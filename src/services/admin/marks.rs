use crate::entities::{assignments, assignments_marks, students, subjects, subjects_attendies, users};
use actix_web::{get,post,put,delete, web, HttpResponse, Responder};
use validator::Validate;

use sea_orm::{query::*, ActiveModelTrait, DatabaseConnection, EntityTrait, IntoActiveModel, RelationTrait, Set, TransactionTrait};


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

    let result = assignments_marks::Entity::find()
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
pub async fn post_admin_marks(pool: web::Data<DatabaseConnection>,data: web::Json<assignments_marks::Model>)-> impl Responder {

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
        Err(_) => HttpResponse::InternalServerError().finish()
    }

}

#[put("/marks")]
pub async fn put_admin_marks(pool: web::Data<DatabaseConnection>,data: web::Json<assignments_marks::Model>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    let mut new_object = data.to_owned().into_active_model();
    new_object.mark = Set(data.mark);
    let update_result = new_object.update(&transaction).await;

    match update_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    }


}

#[delete("/marks")]
pub async fn delete_admin_marks(pool: web::Data<DatabaseConnection>,data: web::Json<assignments_marks::ModelId>)-> impl Responder {

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
        Err(_) => HttpResponse::InternalServerError().finish()
    }   
}
