
use crate::{entities::{assignments, subjects}, models::*};
use actix_web::{get,post,put,delete, web, HttpResponse, Responder};
use sea_orm::{query::*, ActiveModelTrait, ActiveValue::NotSet, DatabaseConnection, EntityTrait, RelationTrait, Set, TransactionTrait, Unchanged};
use validator::Validate;


#[get("/tasks")]
pub async fn get_admin_tasks(pool: web::Data<DatabaseConnection>)-> impl Responder {
    
    // SELECT
    //     a.id,
    //     a.name,
    //     sb.name as subject_name,    
    //     a.description,
    //     a.due_to,
    //     a.max_point
    // FROM 
    //     assignments a
    // INNER JOIN 
    //     subjects sb ON a.subject_id = sb.id

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    let result = assignments::Entity::find()
        .select_only()
        .columns([
            assignments::Column::Id,
            assignments::Column::Name,
            assignments::Column::Description,
            assignments::Column::DueTo,
            assignments::Column::MaxPoint
        ])
        .column_as(subjects::Column::Name,"subject_name")
        .join(JoinType::InnerJoin,subjects::Relation::Assignments.def().rev())
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


#[post("/tasks")]
pub async fn post_admin_tasks(pool: web::Data<DatabaseConnection>,data: web::Json<AssignmentIdLess>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
             
    let new_assignment = assignments::ActiveModel{
        id: NotSet,
        name: Set(data.name.clone()),
        subject_id: Set(data.subject_id),
        description: Set(data.description.clone()),
        due_to: Set(data.due_to),
        max_point: Set(data.max_point)
    };

    let insert_result = new_assignment.insert(&transaction).await;

    match insert_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    }
     
}

#[put("/tasks")]
pub async fn put_admin_tasks(pool: web::Data<DatabaseConnection>,data: web::Json<Assignment>)-> impl Responder {
    
    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    let new_assignment = assignments::ActiveModel{
        id: Unchanged(data.id),
        name: Set(data.name.clone()),
        subject_id: Unchanged(data.subject_id),
        description: Set(data.description.clone()),
        due_to: Set(data.due_to),
        max_point: Set(data.max_point)
    };
    
    let update_result = new_assignment.update(&transaction).await;
    
    match update_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    } 
     
}

#[delete("/tasks")]
pub async fn delete_admin_tasks(pool: web::Data<DatabaseConnection>,data: web::Json<AssignmentId>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
   
    let delete_result = assignments::Entity::delete_by_id(data.id).exec(&transaction).await;
    
    match delete_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    }


}
