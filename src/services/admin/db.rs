
use actix_web::{post, web::{self, Json}, HttpResponse, Responder};
use sea_orm::{query::*,DatabaseConnection, DatabaseTransaction, DbErr, ExecResult, TransactionTrait};
use serde::Deserialize;

use std::process::Command;

#[derive(Clone,Copy,Deserialize)]
pub enum DbAction{
    Archive,
    Clone,
    Restore,
}

#[derive(Clone,Deserialize)]
pub struct DbParams{
    pub action: DbAction
}

async fn export_table(tx: &DatabaseTransaction,table_name: String, out_filename: String)->Result<(), DbErr>{
    let query = format!(r#"SELECT * FROM {} INTO OUTFILE '/var/lib/mysql-files/{}.csv' FIELDS ENCLOSED BY '"'  TERMINATED BY ','  ESCAPED BY '"'  LINES TERMINATED BY '\r\n';"#,table_name,out_filename);
    tx.execute(Statement::from_string(sea_orm::DatabaseBackend::MySql,query)).await.map(|_|())
}

async fn import_table(tx: &DatabaseTransaction,table_name: String, in_filename: String)->Result<(), DbErr>{
    let query = format!(r#"LOAD DATA INFILE '/var/lib/mysql-files/{}.csv' INTO TABLE {} FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';"#,in_filename,table_name);
    tx.execute(Statement::from_string(sea_orm::DatabaseBackend::MySql,query)).await.map(|_|())
}


// LOAD DATA INFILE '/var/lib/mysql-files/{}.csv' 
// INTO TABLE discounts 
// FIELDS TERMINATED BY ',' 
// ENCLOSED BY '"'
// LINES TERMINATED BY '\n'
// IGNORE 1 ROWS;

#[post("/db")]
pub async fn post_admin_db_action(pool: web::Data<DatabaseConnection>,data: Json<DbParams>)-> impl Responder {
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    let result =  match data.to_owned().action{
        DbAction::Archive => {
            let mut res: Result<(), DbErr>;
            
            res = export_table(&transaction, "subjects".to_string(), "subjects-archive".to_string())
                .await;
            
            for i in ["assignments","assignments_marks","attended_meetings","meetings"]{
                res = res.and({
                    export_table(&transaction, format!("{} WHERE subject_id IN (SELECT id FROM subjects)",i), format!("{}-archive",i))
                        .await
                });
            }

            res = res.and(
                transaction.execute(Statement::from_string(sea_orm::DatabaseBackend::MySql,"DELETE FROM subjects WHERE id IN (SELECT id FROM subjects);"))
                    .await.map(|_|())
            );

            res
        }
        DbAction::Clone =>{
            // docker exec some-mysql rm /var/lib/mysql-files/.csv
            let mut res: Result<(), DbErr> = Ok(());
            for i in ["logs","accounts","assignments","assignments_marks","attended_meetings","meetings","students","subjects","subjects_attendies","teachers","users"]{
                Command::new("docker")
                    .args(["exec","some-mysql","rm"])
                    .arg(format!("/var/lib/mysql-files/{}-copy.csv",i))
                    .spawn();
                res = res.and(
                    export_table(&transaction, i.to_string(), format!("{}-copy",i)).await
                );
            }
            res
        }
        DbAction::Restore => {
            let mut res: Result<(), DbErr> = Ok(());

            for i in ["logs","assignments","assignments_marks","attended_meetings","meetings","subjects"]{
                res = res.and(
                    import_table(&transaction, i.to_string(), format!("{}-archive",i)).await
                );
            }
            res
        }
    }; 



    match result {
        Ok(_)=>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string())
    }
}


