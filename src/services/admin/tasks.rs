
use crate::entities::{assignments, subjects};
use actix_web::{get,post,put,delete, web, HttpResponse, Responder};
use sea_orm::{query::*, ActiveModelTrait, DatabaseConnection, EntityTrait, IntoActiveModel, RelationTrait, Set, TransactionTrait};
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
        Err(err) => {
            _ = transaction.rollback().await;
            HttpResponse::InternalServerError().body(err.to_string())
        }
    }

}


#[post("/tasks")]
pub async fn post_admin_tasks(pool: web::Data<DatabaseConnection>,data: web::Json<assignments::ModelIdLess>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
             
    let insert_result = data.to_owned().into_active_model().insert(&transaction).await;

    match insert_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => {
            _ = transaction.rollback().await;
            HttpResponse::InternalServerError().finish()
        }
    }
     
}

#[put("/tasks")]
pub async fn put_admin_tasks(pool: web::Data<DatabaseConnection>,data: web::Json<assignments::Model>)-> impl Responder {
    
    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

        
    let mut new_object = data.to_owned().into_active_model();
    
    new_object.name = Set(data.name.to_owned());
    new_object.description = Set(data.description.to_owned());
    new_object.due_to = Set(data.due_to);
    new_object.max_point = Set(data.max_point);

    let update_result = new_object.update(&transaction).await;
        
    match update_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    } 
     
}

#[delete("/tasks")]
pub async fn delete_admin_tasks(pool: web::Data<DatabaseConnection>,data: web::Json<assignments::ModelId>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
   

    let delete_result = data.to_owned().into_active_model().delete(&transaction).await;
    
    match delete_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => {
            _ = transaction.rollback().await;
            HttpResponse::InternalServerError().finish()
        }
    }


}
