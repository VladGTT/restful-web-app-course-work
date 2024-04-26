use crate::{models::*, templates};
use actix_web::{get,post,put,delete, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use futures_util::TryFutureExt;
use validator::Validate;
use std::sync::Arc;
use sqlx::{mysql::MySql,Pool};


#[get("/attendance")]
pub async fn get_teacher_attendance(req: HttpRequest,pool: web::Data<Arc<Pool<MySql>>>,query: web::Query<TeacherSubjectQuery>)-> impl Responder {
    let ext = req.extensions();
    let account = match ext.get::<Account>(){
        Some(acc) => acc,
        None => return HttpResponse::InternalServerError().finish()
    };

    let mut transaction = match pool.begin().await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
    _ = sqlx::query(templates::SET_ISOLATION_QUERY)
        .execute(&mut *transaction)
        .await;
    let result: Result<Vec<TeacherAttendance>, sqlx::Error> = sqlx::query(templates::TEACHER_ATTENDANCE_PER_DESCIPLINE)
        .bind(account.login.clone())
        .bind(query.subject_id)
        .fetch_all(&***pool)
        .map_ok(|rows|
            rows.iter().map(|row|{
                sqlx::FromRow::from_row(row).unwrap()
            })
            .collect()
        )
        .await;

    if result.is_err(){
        _ = transaction.rollback().await;
        HttpResponse::InternalServerError().finish()
    } else {
        _ = transaction.commit().await;
        HttpResponse::Ok().json(result.unwrap())
    } 
}


#[post("/attendance")]
pub async fn post_teacher_attendance(req: HttpRequest,pool: web::Data<Arc<Pool<MySql>>>,data: web::Json<Attendance>)-> impl Responder {
    let ext = req.extensions();
    let account = match ext.get::<Account>(){
        Some(acc) => acc,
        None => return HttpResponse::InternalServerError().finish()
    };

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let mut transaction = match pool.begin().await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
    _ = sqlx::query(templates::SET_ISOLATION_QUERY)
        .execute(&mut *transaction)
        .await;
    
    let result = sqlx::query(templates::TEACHER_ADD_ATTENDANCE)
        .bind(data.meeting_id)
        .bind(data.student_id.clone())
        .bind(data.subject_id)
        .bind(account.login.clone())
        .bind(data.percentage)
        .execute(&mut *transaction)
        .await;

    if result.is_err(){
        _ = transaction.rollback().await;
        HttpResponse::InternalServerError().finish()
    } else {
        _ = transaction.commit().await;
        HttpResponse::Ok().finish()
    } 
}

#[put("/attendance")]
pub async fn put_teacher_attendance(req: HttpRequest,pool: web::Data<Arc<Pool<MySql>>>,data: web::Json<Attendance>)-> impl Responder {
    let ext = req.extensions();
    let account = match ext.get::<Account>(){
        Some(acc) => acc,
        None => return HttpResponse::InternalServerError().finish()
    };

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let mut transaction = match pool.begin().await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
    _ = sqlx::query(templates::SET_ISOLATION_QUERY)
        .execute(&mut *transaction)
        .await;
    
    let result = sqlx::query(templates::TEACHER_UPDATE_ATTENDANCE)
        .bind(data.percentage)
        .bind(data.meeting_id)
        .bind(data.student_id.clone())
        .bind(data.subject_id)
        .bind(account.login.clone())
        .execute(&mut *transaction)
        .await;

    if result.is_err(){
        _ = transaction.rollback().await;
        HttpResponse::InternalServerError().finish()
    } else {
        _ = transaction.commit().await;
        HttpResponse::Ok().finish()
    } 
}

#[delete("/attendance")]
pub async fn delete_teacher_attendance(req: HttpRequest,pool: web::Data<Arc<Pool<MySql>>>,data: web::Json<Attendance>)-> impl Responder {
    let ext = req.extensions();
    let account = match ext.get::<Account>(){
        Some(acc) => acc,
        None => return HttpResponse::InternalServerError().finish()
    };

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let mut transaction = match pool.begin().await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
    _ = sqlx::query(templates::SET_ISOLATION_QUERY)
        .execute(&mut *transaction)
        .await;
    
    let result = sqlx::query(templates::TEACHER_DELETE_ATTENDANCE)
        .bind(data.meeting_id)
        .bind(data.student_id.clone())
        .bind(data.subject_id)
        .bind(account.login.clone())
        .execute(&mut *transaction)
        .await;

    if result.is_err(){
        _ = transaction.rollback().await;
        HttpResponse::InternalServerError().finish()
    } else {
        _ = transaction.commit().await;
        HttpResponse::Ok().finish()
    } 
}
