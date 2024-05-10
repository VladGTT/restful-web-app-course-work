use crate::entities::logs;
use actix_web::{get, web::{self, Query}, HttpResponse, Responder};
use sea_orm::{query::*, ColumnTrait, DatabaseConnection, EntityTrait, TransactionTrait};
use validator::Validate;




#[get("/logs")]
pub async fn get_admin_logs(pool: web::Data<DatabaseConnection>,query: Query<logs::ModelQuery>)-> impl Responder {
    
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    if query.validate().is_err() {
        return HttpResponse::InternalServerError().finish();
    }


    let result = logs::Entity::find()
        .select_only()
        .columns([
            logs::Column::Id,   
            logs::Column::Time,
            logs::Column::Description,
        ])
        .filter({
            let time_lowerbound = query.time_lowerbound.to_owned();
            let time_upperbound = query.time_upperbound.to_owned();
            let event = query.event.to_owned();
            
            let mut cond = Condition::all();

            if let Some(dat) = time_lowerbound{
                cond = cond.add(logs::Column::Time.gte(dat));
            }

            if let Some(dat) = time_upperbound{
                cond = cond.add(logs::Column::Time.lte(dat));
            }

            if let Some(dat) = event{
                cond = cond.add(logs::Column::Description.like(format!("%{}%",dat)))
            }
            cond
        })
        .order_by_desc(logs::Column::Time)
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