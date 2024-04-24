use crate::{models::*, templates,auth::tokenize};
use actix_web::{post, web, HttpResponse, Responder};
use std::sync::Arc;
use sqlx::{mysql::MySql,Pool};

#[post("/login")]
pub async fn login(creds: web::Json<Account>, pool: web::Data<Arc<Pool<MySql>>>) -> impl Responder {
    let (info_login,info_pass,info_role) = (creds.login.clone(), creds.password.clone(),creds.role);
    
    let mut transaction = match pool.begin().await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
    _ = sqlx::query(templates::SET_ISOLATION_QUERY)
        .execute(&mut *transaction)
        .await;

    let result = sqlx::query(templates::GET_ACCOUNT_QUERY)
        .bind(&info_login)
        .fetch_one(&mut *transaction)
        .await;

    if result.is_err(){
        _ = transaction.rollback().await;
        return HttpResponse::InternalServerError().finish();
    } 
    _ = transaction.commit().await;  

    let row = result.unwrap();
    let secret_key = std::env::var("SECRET_KEY").unwrap();
                      
    let account:Account = sqlx::FromRow::from_row(&row).unwrap();

    if info_login == account.login && info_pass == account.password && info_role == account.role{
        let auth_token = tokenize(account, secret_key.as_bytes());
        return HttpResponse::Ok().json(AuthorizationToken { authorization: auth_token });
    }

    return HttpResponse::Unauthorized().finish()
}
