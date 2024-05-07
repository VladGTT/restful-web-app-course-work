use crate::{entities::logs, models::*};
use actix_web::{get, web, HttpResponse, Responder};
use sea_orm::{query::*, DatabaseConnection, EntityTrait, TransactionTrait};




#[get("/logs")]
pub async fn get_admin_logs(pool: web::Data<DatabaseConnection>)-> impl Responder {
    
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
        
    let result = logs::Entity::find()
        .select_only()
        .columns([
            logs::Column::Id,
            logs::Column::Time,
            logs::Column::Description,
        ])
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