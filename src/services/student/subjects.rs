use crate::{models::*, templates};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use futures_util::TryFutureExt;
use std::sync::Arc;
use sqlx::{mysql::MySql,Pool};



#[get("/subjects")]
pub async fn get_student_subjects(req: HttpRequest,pool: web::Data<Arc<Pool<MySql>>>)-> impl Responder {
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

    let result: Result<Vec<StudentSubjects>, sqlx::Error> = sqlx::query(templates::STUDENT_CHOSEN_DISCIPLINES)
        .bind(account.login.clone())
        .fetch_all(&mut *transaction)   
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