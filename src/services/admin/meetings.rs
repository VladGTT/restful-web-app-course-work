use crate::{entities::{ meetings, subjects, }, models::*};
use actix_web::{get,post,put,delete, web, HttpResponse, Responder};
use validator::Validate;

use sea_orm::{query::*, ActiveModelTrait, ActiveValue::NotSet, DatabaseConnection, EntityTrait, RelationTrait, Set, TransactionTrait, Unchanged};


#[get("/meetings")]
pub async fn get_admin_meetings(pool: web::Data<DatabaseConnection>)-> impl Responder {

    // SELECT
    //     m.id,
    //     m.name,
    //     sb.name AS subject_name,
    //     m.time
    // FROM
    //     meetings m
    // INNER JOIN 
    //     subjects sb ON m.subject_id = sb.id 



    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    let result = meetings::Entity::find()
        .select_only()
        .columns([
            meetings::Column::Id,
            meetings::Column::Name,
            meetings::Column::Time,
        ])
        .column_as(subjects::Column::Name,"subject_name")
        .join(JoinType::InnerJoin,subjects::Relation::Meetings.def().rev())
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



#[post("/meetings")]
pub async fn post_admin_meetings(pool: web::Data<DatabaseConnection>,data: web::Json<MeetingIdLess>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    
    let new_meeting = meetings::ActiveModel{
        id: NotSet,
        subject_id: Set(data.subject_id),
        name: Set(data.name.clone()),
        time: Set(data.time),
    };

    let insert_result = new_meeting.insert(&transaction).await; 

    match insert_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    }

}

#[put("/meetings")]
pub async fn put_admin_meetings(pool: web::Data<DatabaseConnection>,data: web::Json<Meeting>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

   
    let new_meeting = meetings::ActiveModel{
        id: Unchanged(data.id),
        subject_id: Set(data.subject_id),
        name: Set(data.name.clone()),
        time: Set(data.time),
    };

    let update_result = new_meeting.update(&transaction).await;

    match update_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    }


}

#[delete("/meetings")]
pub async fn delete_admin_meetings(pool: web::Data<DatabaseConnection>,data: web::Json<MeetingId>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
    
    let delete_result = subjects::Entity::delete_by_id(data.id).exec(&transaction).await;

    match delete_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    }   
}
