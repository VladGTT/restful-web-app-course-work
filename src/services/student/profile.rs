use crate::{models::*, templates};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use futures_util::TryFutureExt;
use std::sync::Arc;
use sqlx::{mysql::MySql,Pool};



#[get("/profile")]
pub async fn get_student_profile(req: HttpRequest,pool: web::Data<Arc<Pool<MySql>>>)-> impl Responder {
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
    
    let result = sqlx::query(templates::STUDENT_PERSONAL_DATA)
        .bind(account.login.clone())
        .fetch_one(&mut *transaction)
        .map_ok(|row|{
            let obj: StudentProfileData = sqlx::FromRow::from_row(&row).unwrap();
            obj  
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