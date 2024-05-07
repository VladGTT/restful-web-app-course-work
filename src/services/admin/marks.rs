use crate::{entities::{assignments, assignments_marks, prelude, students, subjects, subjects_attendies, users}, models::*};
use actix_web::{get,post,put,delete, web, HttpResponse, Responder};
use validator::Validate;

use sea_orm::{query::*, ActiveModelTrait, ActiveValue::NotSet, DatabaseConnection, EntityTrait, RelationTrait, Set, TransactionTrait, Unchanged};


#[get("/marks")]
pub async fn get_admin_marks(pool: web::Data<DatabaseConnection>)-> impl Responder {

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };


    // SELECT 
    //     u.firstname,
    //     u.secondname,
    //     u.lastname,
    //     sb.name as subject_name,
    //     a.name as assignment_name,
    //     am.mark,
    //     a.max_point 
    // FROM
    //     assignments_marks am
    // RIGHT JOIN 
    //     assignments a ON a.id = am.assignment_id
    // INNER JOIN 
    //     subjects sb ON sb.id = a.subject_id
    // INNER JOIN
    //     subjects_attendies sa ON sa.student_id=am.student_id AND sa.subject_id=am.subject_id 
    // INNER JOIN
    //     students s ON sa.student_id = s.email
    // INNER JOIN 
    //     users u ON u.email = s.email

    let result = prelude::AssignmentsMarks::find()
        .select_only()
        .columns(
            [
                users::Column::Firstname,
                users::Column::Secondname,
                users::Column::Lastname
            ]
        )
        .column_as(subjects::Column::Name,"subject_name")
        .column_as(assignments::Column::Name,"assignment_name")
        .column(assignments_marks::Column::Mark)
        .column(assignments::Column::MaxPoint)
        .join(JoinType::RightJoin, assignments::Relation::AssignmentsMarks.def().rev())
        .join(JoinType::InnerJoin, subjects::Relation::Assignments.def().rev())
        .join(JoinType::InnerJoin, subjects_attendies::Relation::AssignmentsMarks.def().rev())
        .join(JoinType::InnerJoin, students::Relation::SubjectsAttendies.def().rev())
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



#[post("/marks")]
pub async fn post_admin_marks(pool: web::Data<DatabaseConnection>,data: web::Json<Mark>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    
    let new_mark = assignments_marks::ActiveModel{
        assignment_id: Set(data.assignment_id),
        subject_id: Set(data.subject_id),
        student_id: Set(data.student_id.clone()),
        mark: Set(Some(data.mark))
    };

    let insert_result = new_mark.insert(&transaction).await; 

    match insert_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    }

}

#[put("/marks")]
pub async fn put_admin_marks(pool: web::Data<DatabaseConnection>,data: web::Json<Mark>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

   
    let new_mark = assignments_marks::ActiveModel{
        assignment_id: Unchanged(data.assignment_id),
        subject_id: Unchanged(data.subject_id),
        student_id: Unchanged(data.student_id.clone()),
        mark: Set(Some(data.mark))
    };

    let update_result = new_mark.update(&transaction).await;

    match update_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    }


}

#[delete("/marks")]
pub async fn delete_admin_marks(pool: web::Data<DatabaseConnection>,data: web::Json<Mark>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
    
    let new_mark = assignments_marks::ActiveModel{
        assignment_id: Unchanged(data.assignment_id),
        subject_id: Unchanged(data.subject_id),
        student_id: Unchanged(data.student_id.clone()),
        mark: NotSet
    };

    let delete_result = new_mark.delete(&transaction).await;

    match delete_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    }   
}
