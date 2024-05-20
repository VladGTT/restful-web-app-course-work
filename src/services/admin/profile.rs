use crate::{entities::accounts::{self,Model as Account}, ADMIN_ROLE_ID};
use actix_web::{get, put, web::{self, Json}, HttpMessage, HttpRequest, HttpResponse, Responder};
use sea_orm::{query::*, ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set, TransactionTrait, Unchanged};
use validator::Validate;



#[get("/profile")]
pub async fn get_admin_profile(req: HttpRequest,pool: web::Data<DatabaseConnection>)-> impl Responder {
    let ext = req.extensions();
    let account = match ext.get::<Account>(){
        Some(acc) => acc,
        None => return HttpResponse::InternalServerError().finish()
    };
    
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    // SELECT 
    //     a.email,
    //     a.password,
    // FROM 
    //     accounts a
    // WHERE u.email = ?

    let result = accounts::Entity::find()
        .select_only()
        .columns([
            accounts::Column::Email,
            // accounts::Column::Password,
        ])
        .filter(accounts::Column::Email.eq(account.email.clone()))
        .into_json()
        .one(&transaction)
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

#[put("/profile")]
pub async fn put_admin_profile(req: HttpRequest,pool: web::Data<DatabaseConnection>, data: Json<accounts::ModelPass> )-> impl Responder {
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
    
    let new_account = accounts::ActiveModel{
        email: Unchanged(account.email.to_owned()),
        password: Set(data.password.to_owned()),
        role: Unchanged(ADMIN_ROLE_ID)
    };

    let result = new_account.update(&transaction).await;
    
    match result {
        Ok(_)=>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(err) => {
            _ = transaction.rollback().await;
            HttpResponse::InternalServerError().body(err.to_string())
        }
    }
    
}