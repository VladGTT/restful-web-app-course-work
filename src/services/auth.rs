use crate::{models::*, templates};
use actix_web::{post, web, HttpResponse, Responder};
use crate::auth::tokenize;
use std::sync::Arc;
use sqlx::{mysql::MySql,Pool};

#[post("/login")]
pub async fn login(creds: web::Json<Account>, pool: web::Data<Arc<Pool<MySql>>>) -> impl Responder {
    let (info_login,info_pass,info_role) = (creds.login.clone(), creds.password.clone(),creds.role);

    let mut transaction_error = false;

    let mut transaction = match pool.begin().await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    transaction_error = sqlx::query(templates::LOCK_TABLES_QUERY)
        .bind("accounts")
        .execute(&mut *transaction)
        .await
        .map_or_else(|_e|true, |_v|false);
    
    let result = sqlx::query(templates::GET_ACCOUNT_QUERY)
        .bind(&info_login)
        .fetch_one(&***pool)
        .await;

    transaction_error = sqlx::query(templates::UNLOCK_TABLES_QUERY)
        .execute(&mut *transaction)
        .await
        .map_or_else(|_e|true, |_v|false);
    
    if transaction_error{
        transaction.rollback().await;
    } else {
        transaction.commit().await;
    }
    
    if let Ok(row) = result {
        let secret_key = std::env::var("SECRET_KEY").unwrap();
                      
        let account:Account = sqlx::FromRow::from_row(&row).unwrap();

        if info_login == account.login && info_pass == account.password && info_role == account.role{
            let auth_token = tokenize(account, secret_key.as_bytes());
            return HttpResponse::Ok().json(AuthorizationToken { authorization: auth_token });
        }

        return HttpResponse::Unauthorized().finish()
    }
    HttpResponse::InternalServerError().finish()
}
