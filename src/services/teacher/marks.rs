use crate::{entities::{assignments, assignments_marks, prelude, students, subjects, subjects_attendies, users}, models::*, templates};
use actix_web::{get,post,put,delete, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use validator::Validate;

use sea_orm::{query::*, ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, RelationTrait, Set, TransactionTrait, Unchanged};


#[get("/marks")]
pub async fn get_teacher_marks(req: HttpRequest,pool: web::Data<DatabaseConnection>,query: web::Query<TeacherSubjectQuery>)-> impl Responder {
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

    let result = prelude::AssignmentsMarks::find()
        .select_only()
        .columns(
            [
                users::Column::Firstname,
                users::Column::Secondname,
                users::Column::Lastname
            ]
        )
        .column(assignments::Column::Name)
        .column(assignments_marks::Column::Mark)
        .join(JoinType::RightJoin, assignments::Relation::AssignmentsMarks.def().rev())
        .join(JoinType::InnerJoin, subjects::Relation::Assignments.def().rev())
        .join(JoinType::InnerJoin, subjects_attendies::Relation::AssignmentsMarks.def().rev())
        .join(JoinType::InnerJoin, students::Relation::SubjectsAttendies.def().rev())
        .join(JoinType::InnerJoin, users::Relation::Students.def().rev())
        .filter(
            Condition::all()
                .add(subjects::Column::TeacherId.eq(account.login.clone()))
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
        Err(err) => HttpResponse::InternalServerError().body(err.to_string())
    }
}



#[post("/marks")]
pub async fn post_teacher_marks(req: HttpRequest,pool: web::Data<DatabaseConnection>,data: web::Json<Mark>)-> impl Responder {
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
        .column_as(assignments::Column::Id.count(),"count")
        .join(JoinType::InnerJoin, subjects::Relation::Assignments.def().rev())
        .join(JoinType::InnerJoin,subjects_attendies::Relation::Subjects.def().rev())
        .filter(
            Condition::all()
                .add(assignments::Column::Id.eq(data.assignment_id))
                .add(subjects_attendies::Column::StudentId.eq(data.student_id.clone()))
                .add(subjects::Column::Id.eq(data.subject_id))
                .add(subjects::Column::TeacherId.eq(account.login.clone()))
        )
        .into_tuple()
        .one(&transaction)
        .await;
    
    let new_mark = assignments_marks::ActiveModel{
        assignment_id: Set(data.assignment_id),
        subject_id: Set(data.subject_id),
        student_id: Set(data.student_id.clone()),
        mark: Set(Some(data.mark))
    };

    let insert_result = new_mark.insert(&transaction).await; 

    match insert_result.and(check_result.map(|val|val.filter(|v|*v==1))){
        Ok(Some(_)) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Ok(None) | Err(_) => HttpResponse::InternalServerError().finish()
    }

}

#[put("/marks")]
pub async fn put_teacher_marks(req: HttpRequest,pool: web::Data<DatabaseConnection>,data: web::Json<Mark>)-> impl Responder {
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
        .column_as(assignments::Column::Id.count(),"count")
        .join(JoinType::InnerJoin, subjects::Relation::Assignments.def().rev())
        .join(JoinType::InnerJoin,subjects_attendies::Relation::Subjects.def().rev())
        .filter(
            Condition::all()
                .add(assignments::Column::Id.eq(data.assignment_id))
                .add(subjects_attendies::Column::StudentId.eq(data.student_id.clone()))
                .add(subjects::Column::Id.eq(data.subject_id))
                .add(subjects::Column::TeacherId.eq(account.login.clone()))
        )
        .into_tuple()
        .one(&transaction)
        .await;
    
    let new_mark = assignments_marks::ActiveModel{
        assignment_id: Unchanged(data.assignment_id),
        subject_id: Unchanged(data.subject_id),
        student_id: Unchanged(data.student_id.clone()),
        mark: Set(Some(data.mark))
    };

    let update_result = new_mark.update(&transaction).await;


    match update_result.and(check_result.map(|val|val.filter(|v|*v==1))){
        Ok(Some(_)) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Ok(None) | Err(_) => HttpResponse::InternalServerError().finish()
    }


}

#[delete("/marks")]
pub async fn delete_teacher_marks(req: HttpRequest,pool: web::Data<DatabaseConnection>,data: web::Json<Mark>)-> impl Responder {
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
        .column_as(assignments::Column::Id.count(),"count")
        .join(JoinType::InnerJoin, subjects::Relation::Assignments.def().rev())
        .join(JoinType::InnerJoin,subjects_attendies::Relation::Subjects.def().rev())
        .filter(
            Condition::all()
                .add(assignments::Column::Id.eq(data.assignment_id))
                .add(subjects_attendies::Column::StudentId.eq(data.student_id.clone()))
                .add(subjects::Column::Id.eq(data.subject_id))
                .add(subjects::Column::TeacherId.eq(account.login.clone()))
        )
        .into_tuple()
        .one(&transaction)
        .await;

    let new_mark = assignments_marks::ActiveModel{
        assignment_id: Unchanged(data.assignment_id),
        subject_id: Unchanged(data.subject_id),
        student_id: Unchanged(data.student_id.clone()),
        mark: Unchanged(Some(data.mark))
    };

    let delete_result = new_mark.delete(&transaction).await;


    match delete_result.and(check_result.map(|val|val.filter(|v|*v==1))){
        Ok(Some(_)) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Ok(None) | Err(_) => HttpResponse::InternalServerError().finish()
    }   
}
