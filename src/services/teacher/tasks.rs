use crate::entities::{accounts::Model as Account,assignments, subjects};
use actix_web::{delete, get, post, put, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use sea_orm::{query::*, ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, IntoActiveModel, QueryFilter, RelationTrait, TransactionTrait};
use validator::Validate;



#[get("/tasks")]
pub async fn get_teacher_tasks(req: HttpRequest,pool: web::Data<DatabaseConnection>,query: web::Query<subjects::ModelQuery>)-> impl Responder {
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
    //     a.id,
    //     a.name,
    //     a.description,
    //     a.due_to,
    //     a.max_point
    // FROM 
    //     assignments a
    // INNER JOIN 
    //     subjects sb ON a.subject_id = sb.id
    // WHERE sb.teacher_id = ? AND sb.id = ?

    let result = assignments::Entity::find()
        .select_only()
        .columns([
            assignments::Column::Id,
            assignments::Column::Name,
            assignments::Column::Description,
            assignments::Column::DueTo,
            assignments::Column::MaxPoint
        ])
        .join(JoinType::InnerJoin, assignments::Relation::Subjects.def())
        .filter(
            Condition::all()
                .add(subjects::Column::TeacherId.eq(account.email.clone()))
                .add(subjects::Column::Id.eq(query.subject_id))
        )
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
pub async fn post_teacher_tasks(req: HttpRequest,pool: web::Data<DatabaseConnection>,data: web::Json<assignments::ModelIdLess>)-> impl Responder {
    let ext = req.extensions();
    let account = match ext.get::<Account>(){
        Some(acc) => acc,
        None => return HttpResponse::InternalServerError().finish()
    };

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    let check_result: Result<Option<i32>, sea_orm::prelude::DbErr> = subjects::Entity::find()
        .select_only()        
        .column_as(subjects::Column::Id.count(),"count")
        .filter(
            Condition::all()
                .add(subjects::Column::Id.eq(data.subject_id))
                .add(subjects::Column::TeacherId.eq(account.email.clone()))
        )
        .into_tuple()
        .one(&transaction)
        .await;

    let insert_result = data.to_owned().into_active_model().insert(&transaction).await; 

    match insert_result.and(check_result.map(|val|val.filter(|v|*v==1))){
        Ok(Some(_)) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        _ => {
            _ = transaction.rollback().await;
            HttpResponse::InternalServerError().finish()
        }
    }
}

#[put("/tasks")]
pub async fn put_teacher_tasks(req: HttpRequest,pool: web::Data<DatabaseConnection>,data: web::Json<assignments::Model>)-> impl Responder {
    let ext = req.extensions();
    let account = match ext.get::<Account>(){
        Some(acc) => acc,
        None => return HttpResponse::InternalServerError().finish()
    };

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    let check_result: Result<Option<i32>, sea_orm::prelude::DbErr> = subjects::Entity::find()
        .select_only()        
        .column_as(subjects::Column::Id.count(),"count")
        .filter(
            Condition::all()
                .add(subjects::Column::Id.eq(data.subject_id))
                .add(subjects::Column::TeacherId.eq(account.email.clone()))
        )
        .into_tuple()
        .one(&transaction)
        .await;

    let update_result = data.to_owned().into_active_model().update(&transaction).await; 

    match update_result.and(check_result.map(|val|val.filter(|v|*v==1))){
        Ok(Some(_)) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        _ => {
            _ = transaction.rollback().await;
            HttpResponse::InternalServerError().finish()
        }
    }
}

#[delete("/tasks")]
pub async fn delete_teacher_tasks(req: HttpRequest,pool: web::Data<DatabaseConnection>,data: web::Json<assignments::ModelId>)-> impl Responder {
    let ext = req.extensions();
    let account = match ext.get::<Account>(){
        Some(acc) => acc,
        None => return HttpResponse::InternalServerError().finish()
    };

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    let check_result: Result<Option<i32>, sea_orm::prelude::DbErr> = assignments::Entity::find()
        .select_only()        
        .column_as(assignments::Column::Id.count(),"count")
        .join(JoinType::InnerJoin, assignments::Relation::Subjects.def())
        .filter(
            Condition::all()
                .add(assignments::Column::Id.eq(data.id))
                .add(subjects::Column::TeacherId.eq(account.email.clone()))
        )
        .into_tuple()
        .one(&transaction)
        .await;

    let delete_result = data.to_owned().into_active_model().delete(&transaction).await; 

    match delete_result.and(check_result.map(|val|val.filter(|v|*v==1))){
        Ok(Some(_)) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        _ => {
            _ = transaction.rollback().await;
            HttpResponse::InternalServerError().finish()
        }
    }
}