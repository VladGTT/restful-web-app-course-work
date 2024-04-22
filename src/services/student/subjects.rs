use crate::{models::*, templates};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use std::sync::Arc;
use sqlx::{mysql::MySql,Pool};



#[get("/subjects")]
pub async fn get_student_subjects(req: HttpRequest,pool: web::Data<Arc<Pool<MySql>>>)-> impl Responder {
    let ext = req.extensions();
    let account = match ext.get::<Account>(){
        Some(acc) => acc,
        None => return HttpResponse::InternalServerError().finish()
    };

    let mut transaction_error = false;

    let mut transaction = match pool.begin().await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    transaction_error = sqlx::query(templates::LOCK_TABLES_QUERY)
        .bind("subjects, subjects_attendies, teachers, users")
        .execute(&mut *transaction)
        .await
        .map_or_else(|_e|true, |_v|false);
    
    let result = sqlx::query(templates::STUDENT_CHOSEN_DISCIPLINES)
        .bind(account.login.clone())
        .fetch_one(&***pool)
        .await;

    transaction_error = sqlx::query(templates::UNLOCK_TABLES_QUERY)
        .execute(&mut *transaction)
        .await
        .map_or_else(|_e|true, |_v|false);
    
    if transaction_error{
        transaction.rollback().await;
        return HttpResponse::InternalServerError().finish();
    } else {
        transaction.commit().await;
    }
    
    if let Ok(row) = result{
        let subjects: StudentSubjects = sqlx::FromRow::from_row(&row).unwrap(); 
        return HttpResponse::Ok().json(subjects);
    }
    HttpResponse::InternalServerError().finish()    
}