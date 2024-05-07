
use crate::{entities::{attended_meetings, meetings, prelude, students, subjects, subjects_attendies, users}, models::*};
use actix_web::{get,post,put,delete, web, HttpResponse, Responder};
use sea_orm::{query::*, ActiveValue::NotSet, DatabaseConnection, EntityTrait, RelationTrait, Set, TransactionTrait, Unchanged};
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

    let result = prelude::AttendedMeetings::find()
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
        .join(JoinType::RightJoin,meetings::Relation::AttendedMeetings.def().rev())
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
pub async fn post_admin_attendance(pool: web::Data<DatabaseConnection>,data: web::Json<Attendance>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
             
    
    let new_attended_meeting = attended_meetings::ActiveModel{
        meeting_id: Set(data.meeting_id),
        subject_id: Set(data.subject_id),
        student_id: Set(data.student_id.clone()),
        percentage: Set(data.percentage)
    };

    let insert_result = attended_meetings::Entity::insert(new_attended_meeting)
        .exec(&transaction)
        .await;


    match insert_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    }
     
}

#[put("/attendance")]
pub async fn put_admin_attendance(pool: web::Data<DatabaseConnection>,data: web::Json<Attendance>)-> impl Responder {
    
    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    let new_attended_meeting = attended_meetings::ActiveModel{
        meeting_id: Unchanged(data.meeting_id),
        subject_id: Unchanged(data.subject_id),
        student_id: Unchanged(data.student_id.clone()),
        percentage: Set(data.percentage)
    };
    
    let update_result = attended_meetings::Entity::update(new_attended_meeting)
        .exec(&transaction)
        .await;
    
    match update_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    } 
     
}

#[delete("/attendance")]
pub async fn delete_admin_attendance(pool: web::Data<DatabaseConnection>,data: web::Json<Attendance>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    let new_attended_meeting = attended_meetings::ActiveModel{
        meeting_id: Unchanged(data.meeting_id),
        subject_id: Unchanged(data.subject_id),
        student_id: Unchanged(data.student_id.clone()),
        percentage: NotSet
    };
    
    let delete_result = attended_meetings::Entity::delete(new_attended_meeting)
        .exec(&transaction)
        .await;
    
    match delete_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    }


}
