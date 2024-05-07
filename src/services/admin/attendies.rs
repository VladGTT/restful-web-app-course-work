
use crate::{entities::{students, subjects, subjects_attendies, users}, models::*};
use actix_web::{get,post,delete, web, HttpResponse, Responder};
use sea_orm::{query::*, ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, RelationTrait, Set, TransactionTrait, Unchanged};
use sea_query::Expr;
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
        .column_as(
            Expr::cust_with_values(
                "CONCAT_WS(' ',?,?,?)",
                [
                    format!(
                        "{}.{}",
                        users::Column::Firstname.as_column_ref().0.to_string(),
                        users::Column::Firstname.as_column_ref().1.to_string(),
                    ),
                    format!(
                        "{}.{}",
                        users::Column::Secondname.as_column_ref().0.to_string(),
                        users::Column::Secondname.as_column_ref().1.to_string(),
                    ),
                    format!(
                        "{}.{}",
                        users::Column::Lastname.as_column_ref().0.to_string(),
                        users::Column::Lastname.as_column_ref().1.to_string(),
                    )
                ]
            ),
            "student_fullname"
        )
        .column(students::Column::Group)
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
pub async fn post_admin_attendies(pool: web::Data<DatabaseConnection>,data: web::Json<SubjectsAttendie>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
             
    
    let new_subjects_attendies = subjects_attendies::ActiveModel{
        student_id: Set(data.student_id.clone()),
        subject_id: Set(data.subject_id),
    };

    let insert_result = new_subjects_attendies.insert(&transaction).await;


    match insert_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
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
pub async fn delete_admin_attendies(pool: web::Data<DatabaseConnection>,data: web::Json<SubjectsAttendie>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    let new_subjects_attendies = subjects_attendies::ActiveModel{
        student_id: Unchanged(data.student_id.clone()),
        subject_id: Unchanged(data.subject_id)
    };
    
    let delete_result = new_subjects_attendies.delete(&transaction).await;
    
    match delete_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    }


}
