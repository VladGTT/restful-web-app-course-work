use crate::entities::{accounts::Model as Account,assignments, assignments_marks, students, subjects, subjects_attendies, users};
use actix_web::{get,post,put,delete, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use validator::Validate;

use sea_orm::{query::*, ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, IntoActiveModel, QueryFilter, RelationTrait, Set, TransactionTrait};


#[get("/marks")]
pub async fn get_teacher_marks(req: HttpRequest,pool: web::Data<DatabaseConnection>,query: web::Query<subjects::ModelQuery>)-> impl Responder {
    let ext = req.extensions();
    let account = match ext.get::<Account>(){
        Some(acc) => acc,
        None => return HttpResponse::InternalServerError().finish()
    };

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    // "SELECT 
    //     u.firstname,
    //     u.secondname,
    //     u.lastname,
    //     a.name,
    //     am.mark
    // FROM
    //     assignments_marks am
    // RIGHT JOIN 
    //     assignments a ON a.id = am.assignment_id
    // INNER JOIN 
    //     subjects sb ON sb.id = a.subject_id
    // INNER JOIN
    //     subjects_attendies sa ON sa.student_id=am.student_id AND sa.subject_id=am.subject_id 
    // INNER JOIN
    //     students s ON sa.student_id = s.email
    // INNER JOIN 
    //     users u ON u.email = s.email
    // WHERE sb.teacher_id = ? AND sb.id = ?"

    let result = assignments_marks::Entity::find()
        .select_only()
        .columns(
            [
                users::Column::Firstname,
                users::Column::Secondname,
                users::Column::Lastname
            ]
        )
        .column(assignments::Column::Name)
        .columns([
            assignments_marks::Column::Mark,
            assignments_marks::Column::AssignmentId,
            assignments_marks::Column::StudentId,
            assignments_marks::Column::SubjectId,   
        ])
        .join(JoinType::RightJoin, assignments_marks::Relation::Assignments.def())
        .join(JoinType::InnerJoin, assignments::Relation::Subjects.def())
        .join(JoinType::InnerJoin, assignments_marks::Relation::SubjectsAttendies.def())
        .join(JoinType::InnerJoin, subjects_attendies::Relation::Students.def())
        .join(JoinType::InnerJoin, students::Relation::Users.def())
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



#[post("/marks")]
pub async fn post_teacher_marks(req: HttpRequest,pool: web::Data<DatabaseConnection>,data: web::Json<assignments_marks::Model>)-> impl Responder {
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
        .join(JoinType::InnerJoin,subjects::Relation::SubjectsAttendies.def())
        .filter(
            Condition::all()
                .add(assignments::Column::Id.eq(data.assignment_id))
                .add(subjects_attendies::Column::StudentId.eq(data.student_id.clone()))
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

#[put("/marks")]
pub async fn put_teacher_marks(req: HttpRequest,pool: web::Data<DatabaseConnection>,data: web::Json<assignments_marks::Model>)-> impl Responder {
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
        .join(JoinType::InnerJoin,subjects::Relation::SubjectsAttendies.def())
        .filter(
            Condition::all()
                .add(assignments::Column::Id.eq(data.assignment_id))
                .add(subjects_attendies::Column::StudentId.eq(data.student_id.clone()))
                .add(subjects::Column::Id.eq(data.subject_id))
                .add(subjects::Column::TeacherId.eq(account.email.clone()))
        )
        .into_tuple()
        .one(&transaction)
        .await;
    
    let mut new_object = data.to_owned().into_active_model();
    new_object.mark = Set(data.mark);
    let update_result = new_object.into_active_model().update(&transaction).await;

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

#[delete("/marks")]
pub async fn delete_teacher_marks(req: HttpRequest,pool: web::Data<DatabaseConnection>,data: web::Json<assignments_marks::ModelId>)-> impl Responder {
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
        .join(JoinType::InnerJoin,subjects::Relation::SubjectsAttendies.def())
        .filter(
            Condition::all()
                .add(assignments::Column::Id.eq(data.assignment_id))
                .add(subjects_attendies::Column::StudentId.eq(data.student_id.clone()))
                .add(subjects::Column::Id.eq(data.subject_id))
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
