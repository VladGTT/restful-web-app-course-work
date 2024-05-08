use crate::{auth::tokenize, entities::accounts::{self, Model as Account}};
use actix_web::{post, web, HttpResponse, Responder};
use jwt_simple::reexports::serde_json::json;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QuerySelect, TransactionTrait};


#[post("/login")]
pub async fn login(creds: web::Json<Account>, pool: web::Data<DatabaseConnection>) -> impl Responder {
    let (info_login,info_pass,info_role) = (creds.email.clone(), creds.password.clone(),creds.role);
    
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable),None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    //SELECT email, password, role FROM accounts WHERE email = ?
    
    let result = accounts::Entity::find()
        .column_as(accounts::Column::Email, "login")
        .filter(accounts::Column::Email.eq(info_login.clone()))
        .into_model::<Account>() 
        .one(&transaction)
        .await;
    
    match result {
        Ok(Some(account))
        if info_login == account.email && info_pass == account.password && info_role == account.role => {
            let secret_key = std::env::var("SECRET_KEY").unwrap();                     
            let auth_token = tokenize(account,secret_key.as_bytes());
            
            _ = transaction.commit().await;

            HttpResponse::Ok().json(json!({"authorization": auth_token}))
        }  
        _ => HttpResponse::Unauthorized().finish()
    }
}
