use crate::{entities::subjects, models::*};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use sea_orm::{query::*, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, TransactionTrait};



#[get("/subjects")]
pub async fn get_teacher_subjects(req: HttpRequest,pool: web::Data<DatabaseConnection>)-> impl Responder {
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
    //     sb.id,
    //     sb.name,
    //     sb.description,
    //     sb.semestr
    // FROM 
    //     subjects sb
    // WHERE sb.teacher_id = ?

    let result = subjects::Entity::find()
        .select_only()
        .columns([
            subjects::Column::Id,
            subjects::Column::Name,
            subjects::Column::Description,
            subjects::Column::Semestr,
        ])
        .filter(subjects::Column::TeacherId.eq(account.login.clone()))
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