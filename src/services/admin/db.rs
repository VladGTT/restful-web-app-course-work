
use actix_web::{get, post, web::{self, Json, Query}, HttpResponse, Responder};
use sea_orm::{query::*,DatabaseConnection, DatabaseTransaction, DbErr, TransactionTrait};
use serde::Deserialize;

use std::process::Command;

#[derive(Clone,Copy,Deserialize)]
enum DbAction{
    Archive,
    Clone,
    Restore,
}

#[derive(Clone,Deserialize)]
struct DbParams{
    pub action: DbAction
}

async fn export_table(tx: &DatabaseTransaction,table_name: String, out_filename: String)->Result<(), DbErr>{
    let query = format!(r#"SELECT * FROM {} INTO OUTFILE '/var/lib/mysql-files/{}.csv' FIELDS ENCLOSED BY '"'  TERMINATED BY ','  ESCAPED BY '"'  LINES TERMINATED BY '\r\n';"#,table_name,out_filename);
    tx.execute_unprepared(&query).await.map(|_|())

}

async fn import_table(tx: &DatabaseTransaction,table_name: String, in_filename: String)->Result<(), DbErr>{
    let query = format!(r#"LOAD DATA INFILE '/var/lib/mysql-files/{}.csv' INTO TABLE {} FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n';"#,in_filename,table_name);
    tx.execute_unprepared(&query).await.map(|_|())
}


// LOAD DATA INFILE '/var/lib/mysql-files/{}.csv' 
// INTO TABLE discounts 
// FIELDS TERMINATED BY ',' 
// ENCLOSED BY '"'
// LINES TERMINATED BY '\n'
// IGNORE 1 ROWS;

#[get("/db/status")]
pub async fn get_admin_db_status(data: Query<DbParams>)->impl Responder{

    let result: Result<(), ()> =  match data.to_owned().action{
        DbAction::Archive=>{
            // docker exec some-mysql ls /var/lib/mysql-files/ | grep .csv
            let output: Result<String, ()> = Command::new("docker")
                .args(["exec","some-mysql","ls","/var/lib/mysql-files/","|","grep","archive.csv"])
                .output()
                .map_err(|_|())
                .and_then::<String,_>(|val|{
                    Ok(String::from_utf8_lossy(&val.stdout).to_string())
                });               
            
            output.and_then(|val|{
                let mut res = true;
                for i in ["subjects","logs","subjects_attendies","assignments","assignments_marks","attended_meetings","meetings"]{
                    res &= val.contains(&format!("{}-archive.csv",i));    
                }
                if res{
                    Ok(())
                } else {
                    Err(())
                }    
            })            
        }
        DbAction::Clone=>{
            let output: Result<String, ()> = Command::new("docker")
                .args(["exec","some-mysql","ls","/var/lib/mysql-files/","|","grep","copy.csv"])
                .output()
                .map_err(|_|())
                .and_then::<String,_>(|val|{
                    Ok(String::from_utf8_lossy(&val.stdout).to_string())
                });                            
            
            output.and_then(|val|{
                let mut res = true;
                for i in ["logs","accounts","assignments","assignments_marks","attended_meetings","meetings","students","subjects","subjects_attendies","teachers","users"]{
                    res &= val.contains(&format!("{}-copy.csv",i));    
                }
                if res{
                    Ok(())
                } else {
                    Err(())
                }    
            })
        }
        _=>Ok(())
    };

    match result {
        Ok(_)=>{
            HttpResponse::Ok().finish()        
        }
        Err(_) => {
            HttpResponse::InternalServerError().finish()
        }
    }
}




#[post("/db")]
pub async fn post_admin_db_action(pool: web::Data<DatabaseConnection>,data: Json<DbParams>)-> impl Responder {
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    let result =  match data.to_owned().action{
        DbAction::Archive => {

            // for i in ["subjects_attendies","assignments","assignments_marks","attended_meetings","meetings"]{
            //     res = res.and({
            //         export_table(&transaction, format!("{} WHERE subject_id IN (SELECT id FROM subjects)",i), format!("{}-archive",i))
            //             .await                      
            //     });
            // }

            let mut res: Result<(), DbErr> = Ok(());
            
            for i in ["subjects","logs","subjects_attendies","assignments","assignments_marks","attended_meetings","meetings"]{
                _ = Command::new("docker")
                    .args(["exec","some-mysql","rm"])
                    .arg(format!("/var/lib/mysql-files/{}-archive.csv",i))
                    .status();
                
                res = res.and({
                    export_table(&transaction, i.to_string(), format!("{}-archive",i)).await
                });
            }

            res = res.and(
                transaction.execute_unprepared("DELETE FROM subjects logs;")
                    .await.map(|_|())
            );

            res
        }
        DbAction::Clone =>{
            // docker exec some-mysql rm /var/lib/mysql-files/.csv
            let mut res: Result<(), DbErr> = Ok(());
            for i in ["logs","accounts","assignments","assignments_marks","attended_meetings","meetings","students","subjects","subjects_attendies","teachers","users"]{
                _ = Command::new("docker")
                    .args(["exec","some-mysql","rm"])
                    .arg(format!("/var/lib/mysql-files/{}-copy.csv",i))
                    .status();
                res = res.and(
                    export_table(&transaction, i.to_string(), format!("{}-copy",i)).await
                );
            }
            res
        }
        DbAction::Restore => {
            let mut res: Result<(), DbErr> = Ok(());

            for i in ["subjects","subjects_attendies","assignments","meetings","assignments_marks","attended_meetings"]{
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
        Err(err) => {
            _ = transaction.rollback().await;
            HttpResponse::InternalServerError().body(err.to_string())
        }
    }
}


