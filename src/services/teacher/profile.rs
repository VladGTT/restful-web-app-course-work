use crate::{models::*, templates};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use futures_util::TryFutureExt;
use std::sync::Arc;
use sqlx::{mysql::MySql,Pool};



#[get("/profile")]
pub async fn get_teacher_profile(req: HttpRequest,pool: web::Data<Arc<Pool<MySql>>>)-> impl Responder {
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
    
    let result:Result<TeacherProfileData, sqlx::Error> = sqlx::query(templates::TEACHER_PERSONAL_DATA)
        .bind(account.login.clone())
        .fetch_one(&mut *transaction)
        .map_ok(|row|{
            sqlx::FromRow::from_row(&row).unwrap()  
        })
        .await;
    
    if result.is_err(){
        _ = transaction.rollback().await;
        HttpResponse::InternalServerError().finish()
    } else {
        _ = transaction.commit().await;
        HttpResponse::Ok().json(result.unwrap())
    }
}