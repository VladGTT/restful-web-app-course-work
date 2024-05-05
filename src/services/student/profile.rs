use crate::{entities::{self, students, users}, models::*};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use sea_orm::{query::*, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, RelationTrait, TransactionTrait};




#[get("/profile")]
pub async fn get_student_profile(req: HttpRequest,pool: web::Data<DatabaseConnection>)-> impl Responder {
    let ext = req.extensions();
    let account = match ext.get::<Account>(){
        Some(acc) => acc,
        None => return HttpResponse::InternalServerError().finish()
    };
    
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
    
    // SELECT 
    //     u.email,
    //     u.firstname,
    //     u.secondname,
    //     u.lastname,
    //     st.group
    // FROM 
    //     students st
    // INNER JOIN 
    //     users u ON st.email=u.email
    // WHERE u.email = ?
    
    let result = entities::prelude::Students::find()
        .select_only()
        .columns([
            users::Column::Email,
            users::Column::Firstname,
            users::Column::Secondname,
            users::Column::Lastname,
        ])
        .column(students::Column::Group)
        .join(JoinType::InnerJoin, entities::users::Relation::Students.def().rev())
        .filter(entities::users::Column::Email.eq(account.login.clone()))
        .into_json()
        .all(&transaction)
        .await;
    
    match result {
        Ok(data)=>{
            _ = transaction.commit().await;
            HttpResponse::Ok().json(data)        
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string())
    }
}