use crate::{entities::{ accounts,  students, users}, models::*, STUDENT_ROLE_ID};
use actix_web::{get,post,put,delete, web, HttpResponse, Responder};
use validator::Validate;

use sea_orm::{query::*, ActiveModelTrait, DatabaseConnection, EntityTrait, RelationTrait, Set, TransactionTrait, Unchanged};


#[get("/students")]
pub async fn get_admin_students(pool: web::Data<DatabaseConnection>)-> impl Responder {

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

    let result = students::Entity::find()
        .select_only()
        .columns(
            [
                users::Column::Firstname,
                users::Column::Secondname,
                users::Column::Lastname,
            ]
        )
        .column(students::Column::Group)
        .join(JoinType::InnerJoin, users::Relation::Students.def().rev())
        .into_json()
        .all(&transaction)
        .await;
        

    match result {
        Ok(data)=>{
            _ = transaction.commit().await;
            HttpResponse::Ok().json(data)        
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string())
    }
}



#[post("/students")]
pub async fn post_admin_students(pool: web::Data<DatabaseConnection>,data: web::Json<Student>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    
    let new_student = students::ActiveModel{
        email: Set(data.email.clone()),
        group: Set(data.group.clone())
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
        role: Set(STUDENT_ROLE_ID),
    };

    let mut result: Result<(),()> = new_account.insert(&transaction).await.map_or(Err(()),|_|Ok(()));
    result = result.and(new_user.insert(&transaction).await.map_or(Err(()),|_|Ok(())));
    result = result.and(new_student.insert(&transaction).await.map_or(Err(()),|_|Ok(())));

    match result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    }

}

#[put("/students")]
pub async fn put_admin_students(pool: web::Data<DatabaseConnection>,data: web::Json<StudentPassLess>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }


    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
    
    let new_student = students::ActiveModel{
        email: Unchanged(data.email.clone()),
        group: Set(data.group.clone())
    };

    let new_user = users::ActiveModel{
        email: Unchanged(data.email.clone()),
        firstname: Set(data.firstname.clone()),
        secondname: Set(data.secondname.clone()),
        lastname: Set(data.lastname.clone())
    };
    

    let mut result: Result<(),()> = new_user.insert(&transaction).await.map_or(Err(()),|_|Ok(()));
    result = result.and(new_student.insert(&transaction).await.map_or(Err(()),|_|Ok(())));

    match result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    }


}

#[delete("/students")]
pub async fn delete_admin_students(pool: web::Data<DatabaseConnection>,data: web::Json<StudentId>)-> impl Responder {

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
        Err(_) => HttpResponse::InternalServerError().finish()
    }   
}
