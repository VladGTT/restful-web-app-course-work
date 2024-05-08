use crate::entities::{accounts::Model as Account, attended_meetings, meetings, subjects};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use sea_orm::{query::*, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, RelationTrait, TransactionTrait};



#[get("/meetings")]
pub async fn get_student_meetings(req: HttpRequest,pool: web::Data<DatabaseConnection>,query: web::Query<subjects::ModelQuery>)-> impl Responder {
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
    //     m.id,
    //     m.name,
    //     m.time,
    //     am.percentage AS attendance
    // FROM
    //     meetings m
    // LEFT JOIN 
    //     attended_meetings am ON am.meeting_id = m.id
    // WHERE am.student_id = ? AND am.subject_id = ?
    
    let result =  attended_meetings::Entity::find()
        .column_as(attended_meetings::Column::Percentage, "attendance")
        .join(JoinType::LeftJoin,meetings::Relation::AttendedMeetings.def())
        .filter(
            Condition::all()
                .add(attended_meetings::Column::StudentId.eq(account.email.clone()))   
                .add(attended_meetings::Column::SubjectId.eq(query.subject_id))   
        )
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