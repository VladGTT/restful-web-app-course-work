use crate::{entities::{ accounts, teachers, users}, STUDENT_ROLE_ID, TEACHER_ROLE_ID};
use actix_web::{get,post,put,delete, web, HttpResponse, Responder};
use validator::Validate;

use sea_orm::{query::*, ActiveModelTrait, DatabaseConnection, EntityTrait, RelationTrait, Set, TransactionTrait, Unchanged};


#[get("/teachers")]
pub async fn get_admin_teachers(pool: web::Data<DatabaseConnection>)-> impl Responder {

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    // SELECT
    //     u.firstname,
    //     u.secondname,
    //     u.lastname,
    //     s.group
    // FROM 
    //     students s
    // INNER JOIN 
    //     users u ON s.email = u.email

    let result = teachers::Entity::find()
        .select_only()
        .columns(
            [
                users::Column::Firstname,
                users::Column::Secondname,
                users::Column::Lastname,
                users::Column::Email,
            ]
        )
        .column(teachers::Column::Occupation)
        .join(JoinType::InnerJoin, teachers::Relation::Users.def())
        .into_json()
        .all(&transaction)
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



#[post("/teachers")]
pub async fn post_admin_teachers(pool: web::Data<DatabaseConnection>,data: web::Json<teachers::Teacher>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    
    let new_teacher = teachers::ActiveModel{
        email: Set(data.email.clone()),
        occupation: Set(data.occupation.clone())
    };
    let new_user = users::ActiveModel{
        email: Set(data.email.clone()),
        firstname: Set(data.firstname.clone()),
        secondname: Set(data.secondname.clone()),
        lastname: Set(data.lastname.clone())
    };
    
    let new_account = accounts::ActiveModel{
        email: Set(data.email.clone()),
        password: Set(data.password.clone()),
        role: Set(TEACHER_ROLE_ID   ),
    };

    let mut result: Result<(),()> = new_account.insert(&transaction).await.map_or(Err(()),|_|Ok(()));
    result = result.and(new_user.insert(&transaction).await.map_or(Err(()),|_|Ok(())));
    result = result.and(new_teacher.insert(&transaction).await.map_or(Err(()),|_|Ok(())));

    match result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => {
            _ = transaction.rollback().await;
            HttpResponse::InternalServerError().finish()
        }
    }

}

#[put("/teachers")]
pub async fn put_admin_teachers(pool: web::Data<DatabaseConnection>,data: web::Json<teachers::TeacherPassLess>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
    
    let new_teacher = teachers::ActiveModel{
        email: Unchanged(data.email.clone()),
        occupation: Set(data.occupation.clone())
    };

    let new_user = users::ActiveModel{
        email: Unchanged(data.email.clone()),
        firstname: Set(data.firstname.clone()),
        secondname: Set(data.secondname.clone()),
        lastname: Set(data.lastname.clone())
    };
    
    let mut result: Result<(),()> = new_user.update(&transaction).await.map_or(Err(()),|_|Ok(()));
    result = result.and(new_teacher.update(&transaction).await.map_or(Err(()),|_|Ok(())));

    match result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => {
            _ = transaction.rollback().await;
            HttpResponse::InternalServerError().finish()
        }
    }

}

#[delete("/teachers")]
pub async fn delete_admin_teachers(pool: web::Data<DatabaseConnection>,data: web::Json<teachers::TeacherId>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
    
    let delete_result = accounts::Entity::delete_by_id(data.email.clone()).exec(&transaction).await;

    match delete_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => {
            _ = transaction.rollback().await;
            HttpResponse::InternalServerError().finish()
        }
    }   
}
