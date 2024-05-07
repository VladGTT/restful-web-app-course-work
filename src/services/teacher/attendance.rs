
use crate::{entities::{attended_meetings, meetings, prelude, students, subjects, subjects_attendies, users}, models::*};
use actix_web::{get,post,put,delete, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use sea_orm::{query::*, ActiveValue::NotSet, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, RelationTrait, Set, TransactionTrait, Unchanged};
use validator::Validate;


#[get("/attendance")]
pub async fn get_teacher_attendance(req: HttpRequest,pool: web::Data<DatabaseConnection>,query: web::Query<TeacherSubjectQuery>)-> impl Responder {
    let ext = req.extensions();
    let account = match ext.get::<Account>(){
        Some(acc) => acc,
        None => return HttpResponse::InternalServerError().finish()
    };

    // "SELECT 
    //     u.firstname,
    //     u.secondname,
    //     u.lastname,
    //     m.name,
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
    // WHERE sb.teacher_id = ? AND sb.id = ?"

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
        .column(meetings::Column::Name)
        .column(attended_meetings::Column::Percentage)
        .join(JoinType::RightJoin,meetings::Relation::AttendedMeetings.def().rev())
        .join(JoinType::InnerJoin, subjects::Relation::Meetings.def().rev())
        .join(JoinType::InnerJoin, subjects_attendies::Relation::AttendedMeetings.def().rev())
        .join(JoinType::InnerJoin, students::Relation::SubjectsAttendies.def().rev())
        .join(JoinType::InnerJoin, users::Relation::Students.def().rev())
        .filter(
            Condition::all()
                .add(subjects::Column::TeacherId.eq(account.login.clone()))   
                .add(subjects::Column::Id.eq(query.subject_id))   
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


#[post("/attendance")]
pub async fn post_teacher_attendance(req: HttpRequest,pool: web::Data<DatabaseConnection>,data: web::Json<Attendance>)-> impl Responder {
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
        
    let check_result: Result<Option<i32>, sea_orm::prelude::DbErr> = meetings::Entity::find()
        .column_as(meetings::Column::Id.count(),"count")
        .join(JoinType::InnerJoin, subjects::Relation::Meetings.def().rev())
        .join(JoinType::InnerJoin,subjects_attendies::Relation::Subjects.def().rev())
        .filter(
            Condition::all()
                .add(meetings::Column::Id.eq(data.meeting_id))
                .add(subjects_attendies::Column::StudentId.eq(data.student_id.clone()))
                .add(subjects::Column::Id.eq(data.subject_id))
                .add(subjects::Column::TeacherId.eq(account.login.clone()))
        )
        .into_tuple()
        .one(&transaction)
        .await;

        

    //SELECT COUNT(*) FROM meetings m INNER JOIN subjects s ON m.subject_id = s.id INNER JOIN subjects_attendies sa ON sa.subject_id = s.id WHERE m.id = 0 AND sa.student_id = 'student1@example.com' AND s.id = 1 AND s.teacher_id = 'teacher1@example.com'

    // "INSERT INTO attended_meetings (meeting_id, student_id, subject_id, percentage)
    // VALUES (?, ?, ?, ?)"
    
    // let query = Query::insert()
    // .into_table(attended_meetings::Entity.table_ref())
    // .columns(
    //     [
    //         attended_meetings::Column::MeetingId,
    //         attended_meetings::Column::StudentId,
    //         attended_meetings::Column::SubjectId,
    //         attended_meetings::Column::Percentage,
    //     ]
    // )
    // .values([
    //     data.meeting_id.into(),
    //     data.student_id.clone().into(),
    //     SimpleExpr::SubQuery(None, Box::new(
    //         subjects::Entity::find()
    //             .select_only()
    //             .column(subjects::Column::Id)
    //             .filter(
    //                 Condition::all()
    //                     .add(subjects::Column::Id.eq(data.subject_id))
    //                     .add(subjects::Column::TeacherId.eq(account.login.clone()))
    //             )
    //             .into_query()
    //             .into_sub_query_statement()
    //     )),
    //     data.percentage.into(),
    // ])
    // .unwrap()
    // .to_owned();


    // let result = transaction.query_all(pool.get_database_backend().build(&query)).await;
       
    
    let new_attended_meeting = attended_meetings::ActiveModel{
        meeting_id: Set(data.meeting_id),
        subject_id: Set(data.subject_id),
        student_id: Set(data.student_id.clone()),
        percentage: Set(data.percentage)
    };

    let insert_result = attended_meetings::Entity::insert(new_attended_meeting)
        .exec(&transaction)
        .await;


    match insert_result.and(check_result.map(|val|val.filter(|v|*v==1))){
        Ok(Some(_)) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Ok(None) | Err(_) => HttpResponse::InternalServerError().finish()
    }
     
}

#[put("/attendance")]
pub async fn put_teacher_attendance(req: HttpRequest,pool: web::Data<DatabaseConnection>,data: web::Json<Attendance>)-> impl Responder {
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

    let check_result: Result<Option<i32>, sea_orm::prelude::DbErr> = meetings::Entity::find()
        .column_as(meetings::Column::Id.count(),"count")
        .join(JoinType::InnerJoin, subjects::Relation::Meetings.def().rev())
        .join(JoinType::InnerJoin,subjects_attendies::Relation::Subjects.def().rev())
        .filter(
            Condition::all()
                .add(meetings::Column::Id.eq(data.meeting_id))
                .add(subjects_attendies::Column::StudentId.eq(data.student_id.clone()))
                .add(subjects::Column::Id.eq(data.subject_id))
                .add(subjects::Column::TeacherId.eq(account.login.clone()))
        )
        .into_tuple()
        .one(&transaction)
        .await;

    let new_attended_meeting = attended_meetings::ActiveModel{
        meeting_id: Unchanged(data.meeting_id),
        subject_id: Unchanged(data.subject_id),
        student_id: Unchanged(data.student_id.clone()),
        percentage: Set(data.percentage)
    };
    
    let update_result = attended_meetings::Entity::update(new_attended_meeting)
        .exec(&transaction)
        .await;
    
    match update_result.and(check_result.map(|val|val.filter(|v|*v==1))){
        Ok(Some(_)) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Ok(None) | Err(_) => HttpResponse::InternalServerError().finish()
    } 
     
}

#[delete("/attendance")]
pub async fn delete_teacher_attendance(req: HttpRequest,pool: web::Data<DatabaseConnection>,data: web::Json<AttendanceId>)-> impl Responder {
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

    let check_result: Result<Option<i32>, sea_orm::prelude::DbErr> = meetings::Entity::find()
        .column_as(meetings::Column::Id.count(),"count")
        .join(JoinType::InnerJoin, subjects::Relation::Meetings.def().rev())
        .join(JoinType::InnerJoin,subjects_attendies::Relation::Subjects.def().rev())
        .filter(
            Condition::all()
                .add(meetings::Column::Id.eq(data.meeting_id))
                .add(subjects_attendies::Column::StudentId.eq(data.student_id.clone()))
                .add(subjects::Column::Id.eq(data.subject_id))
                .add(subjects::Column::TeacherId.eq(account.login.clone()))
        )
        .into_tuple()
        .one(&transaction)
        .await;

    let new_attended_meeting = attended_meetings::ActiveModel{
        meeting_id: Unchanged(data.meeting_id),
        subject_id: Unchanged(data.subject_id),
        student_id: Unchanged(data.student_id.clone()),
        percentage: NotSet
    };
    
    let delete_result = attended_meetings::Entity::delete(new_attended_meeting)
        .exec(&transaction)
        .await;
    
    match delete_result.and(check_result.map(|val|val.filter(|v|*v==1))){
        Ok(Some(_)) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Ok(None) | Err(_) => HttpResponse::InternalServerError().finish()
    }


}
