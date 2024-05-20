
use crate::entities::{students, subjects, subjects_attendies, users};
use actix_web::{get,post,delete, web, HttpResponse, Responder};
use sea_orm::{query::*, ActiveModelTrait, DatabaseConnection, EntityTrait, IntoActiveModel, RelationTrait, TransactionTrait};
use validator::Validate;


#[get("/attendies")]
pub async fn get_admin_attendies(pool: web::Data<DatabaseConnection>)-> impl Responder {
    
    // SELECT
    //     CONCAT_WS (' ',u.firstname, u.secondname, u.lastname) as student_fullname,
    //     s.group
    // FROM 
    //     subjects_attendies sa
    // LEFT JOIN 
    //     students s ON s.email = sa.student_id     
    // LEFT JOIN 
    //     subjects sb ON sb.id = sa.subject_id         
    // INNER JOIN 
    //     users u ON s.email = u.email


    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    let result = subjects_attendies::Entity::find()
        .select_only()
        .columns([
            users::Column::Email,
            users::Column::Firstname,
            users::Column::Secondname,
            users::Column::Lastname,
        ])
        .columns([
            subjects::Column::Id,
            subjects::Column::Name,
        ])
        .join(JoinType::LeftJoin, students::Relation::SubjectsAttendies.def().rev())
        .join(JoinType::LeftJoin, subjects::Relation::SubjectsAttendies.def().rev())
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


#[post("/attendies")]
pub async fn post_admin_attendies(pool: web::Data<DatabaseConnection>,data: web::Json<subjects_attendies::Model>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
             
    let insert_result = data.to_owned().into_active_model().insert(&transaction).await;

    match insert_result{
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

// #[put("/attendies")]
// pub async fn put_admin_attendies(pool: web::Data<DatabaseConnection>,data: web::Json<SubjectsAttendies>)-> impl Responder {
    
//     if data.validate().is_err(){
//         return HttpResponse::InternalServerError().finish()
//     }

//     let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
//         Ok(dat)=> dat,
//         Err(_)=>return HttpResponse::InternalServerError().finish()
//     };

//     let new_subjects_attendies = subjects_attendies::ActiveModel{
//         student_id: Set(data.student_id.clone()),
//         subject_id: Set(data.subject_id)
//     }; 
    
//     let update_result = attended_meetings::Entity::update(new_subjects_attendies)
//         .exec(&transaction)
//         .await;
    
//     match update_result{
//         Ok(_) =>{
//             _ = transaction.commit().await;
//             HttpResponse::Ok().finish()        
//         }
//         Err(_) => HttpResponse::InternalServerError().finish()
//     } 
     
// }

#[delete("/attendies")]
pub async fn delete_admin_attendies(pool: web::Data<DatabaseConnection>,data: web::Json<subjects_attendies::Model>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

   
    let delete_result = data.to_owned().into_active_model().delete(&transaction).await;
    
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
