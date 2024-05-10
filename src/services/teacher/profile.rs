use crate::{entities::{accounts::{self,Model as Account}, teachers, users}, TEACHER_ROLE_ID};
use actix_web::{get, put, web::{self, Json}, HttpMessage, HttpRequest, HttpResponse, Responder};
use sea_orm::{query::*, ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, RelationTrait, Set, TransactionTrait, Unchanged};
use validator::Validate;



#[get("/profile")]
pub async fn get_teacher_profile(req: HttpRequest,pool: web::Data<DatabaseConnection>)-> impl Responder {
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
    //     u.email,
    //     u.firstname,
    //     u.secondname,
    //     u.lastname,
    //     t.occupation
    // FROM 
    //     teachers t
    // INNER JOIN 
    //     users u ON t.email=u.email
    // WHERE u.email = ?

    let result = teachers::Entity::find()
        .select_only()
        .columns([
            users::Column::Email,
            users::Column::Firstname,
            users::Column::Secondname,
            users::Column::Lastname
        ])
        .column(teachers::Column::Occupation)
        .join(JoinType::InnerJoin, teachers::Relation::Users.def())
        .filter(users::Column::Email.eq(account.email.clone()))
        .into_json()
        .one(&transaction)
        .await;


    match result {
        Ok(data)=>{
            _ = transaction.commit().await;
            HttpResponse::Ok().json(data)        
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string())
    }
}

#[put("/profile")]
pub async fn put_teacher_profile(req: HttpRequest,pool: web::Data<DatabaseConnection>, data: Json<accounts::ModelPass> )-> impl Responder {
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
        role: Unchanged(TEACHER_ROLE_ID)
    };

    let result = new_account.update(&transaction).await;
    
    match result {
        Ok(_)=>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string())
    }
    
}