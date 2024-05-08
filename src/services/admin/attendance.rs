
use crate::entities::{attended_meetings, meetings, students, subjects, subjects_attendies, users};
use actix_web::{get,post,put,delete, web, HttpResponse, Responder};
use sea_orm::{query::*, ActiveModelTrait, DatabaseConnection, EntityTrait, IntoActiveModel, RelationTrait, Set, TransactionTrait};
use validator::Validate;


#[get("/attendance")]
pub async fn get_admin_attendance(pool: web::Data<DatabaseConnection>)-> impl Responder {

    // SELECT 
    //     u.firstname,
    //     u.secondname,
    //     u.lastname,
    //     sb.name as subject_name,
    //     m.name as meeting_name,
    //     am.percentage
    // FROM
    //     attended_meetings am
    // RIGHT JOIN 
    //     meetings m ON m.id = am.meeting_id
    // INNER JOIN 
    //     subjects sb ON sb.id = m.subject_id
    // INNER JOIN
    //     subjects_attendies sa ON sa.student_id=am.student_id AND sa.subject_id=am.subject_id 
    // INNER JOIN
    //     students s ON sa.student_id = s.email
    // INNER JOIN 
    //     users u ON u.email = s.email

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    let result = attended_meetings::Entity::find()
        .select_only()
        .columns(
            [
                users::Column::Firstname,
                users::Column::Secondname,
                users::Column::Lastname
            ]
        )
        .column_as(subjects::Column::Name,"subject_name")
        .column_as(meetings::Column::Name,"meeting_name")
        .column(attended_meetings::Column::Percentage)
        .join(JoinType::RightJoin, attended_meetings::Relation::Meetings.def())
        .join(JoinType::InnerJoin, subjects::Relation::Meetings.def().rev())
        .join(JoinType::InnerJoin, subjects_attendies::Relation::AttendedMeetings.def().rev())
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


#[post("/attendance")]
pub async fn post_admin_attendance(pool: web::Data<DatabaseConnection>,data: web::Json<attended_meetings::Model>)-> impl Responder {

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

#[put("/attendance")]
pub async fn put_admin_attendance(pool: web::Data<DatabaseConnection>,data: web::Json<attended_meetings::Model>)-> impl Responder {
    
    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };


    let mut new_object = data.to_owned().into_active_model();
    new_object.percentage = Set(data.percentage);
    let update_result = new_object.update(&transaction).await;
    
    
    match update_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    } 
     
}

#[delete("/attendance")]
pub async fn delete_admin_attendance(pool: web::Data<DatabaseConnection>,data: web::Json<attended_meetings::ModelId>)-> impl Responder {

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
