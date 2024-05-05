use crate::{entities::{teachers, users}, models::*};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use sea_orm::{query::*, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, RelationTrait, TransactionTrait};



#[get("/profile")]
pub async fn get_teacher_profile(req: HttpRequest,pool: web::Data<DatabaseConnection>)-> impl Responder {
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
    //     t.occupation
    // FROM 
    //     teachers t
    // INNER JOIN 
    //     users u ON t.email=u.email
    // WHERE u.email = ?

    let result = teachers::Entity::find()
        .select_only()
        .columns([
            users::Column::Email,
            users::Column::Firstname,
            users::Column::Secondname,
            users::Column::Lastname
        ])
        .column(teachers::Column::Occupation)
        .join(JoinType::InnerJoin, users::Relation::Teachers.def().rev())
        .filter(users::Column::Email.eq(account.login.clone()))
        .into_json()
        .one(&transaction)
        .await;


    match result {
        Ok(data)=>{
            _ = transaction.commit().await;
            HttpResponse::Ok().json(data)        
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string())
    }
}