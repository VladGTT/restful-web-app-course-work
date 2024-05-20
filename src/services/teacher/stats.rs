use crate::entities::{accounts::Model as Account, assignments, assignments_marks, attended_meetings, meetings, subjects};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use futures_util::FutureExt;
use sea_orm::{query::*, ColumnTrait, DatabaseBackend, DatabaseConnection, EntityTrait, QueryFilter, RelationTrait, TransactionTrait};
use sea_query::SimpleExpr;
use serde_json::json;
#[get("/stats")]
pub async fn get_teacher_stats(req: HttpRequest,pool: web::Data<DatabaseConnection>,query: web::Query<subjects::ModelQuery>)-> impl Responder {
    let ext = req.extensions();
    let account = match ext.get::<Account>(){
        Some(acc) => acc,
        None => return HttpResponse::InternalServerError().finish()
    };
    
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    let most_attended_meeting = meetings::Entity::find()
        .select_only()
        .columns([
            meetings::Column::Id,
            meetings::Column::Name
        ])
        .column_as(attended_meetings::Column::StudentId.count(), "attendance_count")
        .join(JoinType::InnerJoin,meetings::Relation::AttendedMeetings.def())
        .join(JoinType::InnerJoin,meetings::Relation::Subjects.def())
        .filter(
            Condition::all()
            .add(subjects::Column::Id.eq(query.subject_id))
            .add(subjects::Column::TeacherId.eq(account.email.to_owned()))   
        )
        .group_by(SimpleExpr::Custom("`meetings`.`id`,`meetings`.`name`".to_string()))
        .order_by_desc(SimpleExpr::Custom("attendance_count".to_string()))
        .into_json()
        .one(&transaction)
        .map(|val|{
            match val {
                Ok(Some(val))=>Some(val),
                _=>None
            }
        })
        .await;

    let least_attended_meeting = meetings::Entity::find()
        .select_only()
        .columns([
            meetings::Column::Id,
            meetings::Column::Name
        ])
        .column_as(attended_meetings::Column::StudentId.count(), "attendance_count")
        .join(JoinType::InnerJoin,meetings::Relation::AttendedMeetings.def())
        .join(JoinType::InnerJoin,meetings::Relation::Subjects.def())
        .filter(
            Condition::all()
            .add(subjects::Column::Id.eq(query.subject_id))
            .add(subjects::Column::TeacherId.eq(account.email.to_owned()))   
        )
        .group_by(SimpleExpr::Custom("`meetings`.`id`,`meetings`.`name`".to_string()))
        .order_by_asc(SimpleExpr::Custom("attendance_count".to_string()))
        .into_json()
        .one(&transaction)
        .map(|val|{
            match val {
                Ok(Some(val))=>Some(val),
                _=>None
            }
        })
        .await;
    
    let most_completed_assignment = assignments::Entity::find()
        .select_only()
        .columns([
            assignments::Column::Id,
            assignments::Column::Name
        ])
        .column_as(assignments_marks::Column::StudentId.count(), "completion_count")
        .join(JoinType::InnerJoin,assignments::Relation::AssignmentsMarks.def())
        .join(JoinType::InnerJoin,assignments::Relation::Subjects.def())
        .filter(
            Condition::all()
            .add(subjects::Column::Id.eq(query.subject_id))
            .add(subjects::Column::TeacherId.eq(account.email.to_owned()))   
        )
        .group_by(SimpleExpr::Custom("`assignments`.`id`,`assignments`.`name`".to_string()))
        .order_by_desc(SimpleExpr::Custom("completion_count".to_string()))
        .into_json()
        .one(&transaction)
        .map(|val|{
            match val {
                Ok(Some(val))=>Some(val),
                _=>None
            }
        })
        .await;

    let least_completed_assignment = assignments::Entity::find()
        .select_only()
        .columns([
            assignments::Column::Id,
            assignments::Column::Name
        ])
        .column_as(assignments_marks::Column::StudentId.count(), "completion_count")
        .join(JoinType::InnerJoin,assignments::Relation::AssignmentsMarks.def())
        .join(JoinType::InnerJoin,assignments::Relation::Subjects.def())
        .filter(
            Condition::all()
            .add(subjects::Column::Id.eq(query.subject_id))
            .add(subjects::Column::TeacherId.eq(account.email.to_owned()))   
        )
        .group_by(SimpleExpr::Custom("`assignments`.`id`,`assignments`.`name`".to_string()))
        .order_by_asc(SimpleExpr::Custom("completion_count".to_string()))
        .into_json()
        .one(&transaction)
        .map(|val|{
            match val {
                Ok(Some(val))=>Some(val),
                _=>None
            }
        })
        .await;

        
    let mean_student_mean_mark = transaction.query_one(Statement::from_string(
            DatabaseBackend::MySql,
            format!(r#"SELECT AVG(student_mean) AS mean_of_mean_marks
                FROM (
                    SELECT am.student_id, AVG(am.mark) AS student_mean
                    FROM assignments_marks am
                    INNER JOIN assignments a ON a.id = am.assignment_id 
                    INNER JOIN subjects s ON s.id = a.subject_id 
                    WHERE s.id = {} AND s.teacher_id = '{}'
                    GROUP BY am.student_id
                ) AS student_means;"#,query.subject_id,account.email.to_owned())
        ))
        .map(|val|{
            match val {
                Ok(Some(val))=>{
                    let retval: f32 = match val.try_get_by(0) {
                        Ok(dat) => dat,
                        Err(_)=>return None  
                    };
                    Some(retval)
                }
                _=>None
            }
        })
        .await; 

    let mean_student_mean_attendance = transaction.query_one(Statement::from_string(
            DatabaseBackend::MySql,
            format!(r#"SELECT AVG(student_mean) AS mean_of_mean_attendance
                FROM (
                    SELECT am.student_id, AVG(am.percentage) AS student_mean
                    FROM attended_meetings am
                    INNER JOIN meetings m ON m.id = am.meeting_id 
                    INNER JOIN subjects s ON s.id = m.subject_id 
                    WHERE s.id = {} AND s.teacher_id = '{}'
                    GROUP BY am.student_id
                ) AS student_attendances;"#,query.subject_id,account.email.to_owned())
        ))
        .map(|val|{
            match val {
                Ok(Some(val))=>{
                    let retval: f32 = match val.try_get_by(0) {
                        Ok(dat) => dat,
                        Err(_)=>return None  
                    };
                    Some(retval)
                }
                _=>None
            }
        })
        .await; 



    let result = json!({
        "most_attended_meeting" : most_attended_meeting, 
        "least_attended_meeting" : least_attended_meeting, 
        "most_completed_assignment": most_completed_assignment,
        "least_completed_assignment": least_completed_assignment,
        "mean_student_mean_mark": mean_student_mean_mark,
        "mean_student_mean_attendance": mean_student_mean_attendance,
    });

    _ = transaction.commit().await;
    HttpResponse::Ok().json(result)        
}




// Запит на вибірку найбільш відвіданого зайняття
// SELECT m.id AS meeting_id, m.name AS meeting_name, COUNT(am.student_id) AS attendance_count
// FROM meetings m
// INNER JOIN attended_meetings am ON m.id = am.meeting_id
// WHERE m.subject_id = ?
// GROUP BY m.id, m.name
// ORDER BY attendance_count DESC
// LIMIT 1;



// Запит на вибірку найменш відвіданого зайняття
// Запит на вибірку найбільш відвіданого зайняття
// SELECT m.id AS meeting_id, m.name AS meeting_name, COUNT(am.student_id) AS attendance_count
// FROM meetings m
// INNER JOIN attended_meetings am ON m.id = am.meeting_id
// WHERE m.subject_id = ?
// GROUP BY m.id, m.name
// ORDER BY attendance_count ESC
// LIMIT 1;


// Запит на вибірку завдання зробленого більшістю студентів
// Запит на вибірку найбільш відвіданого зайняття
// SELECT a.id, a.name, COUNT(am.student_id) AS attendance_count
// FROM assignments a
// INNER JOIN assignments_marks am ON a.id = am.assignment_id
// WHERE a.subject_id = ?
// GROUP BY a.id, a.name
// ORDER BY attendance_count DESC
// LIMIT 1;


// Запит на вибірку завдання зробленого меншістю студентів
// SELECT a.id, a.name, COUNT(am.student_id) AS attendance_count
// FROM assignments a
// INNER JOIN assignments_marks am ON a.id = am.assignment_id
// WHERE a.subject_id = ?
// GROUP BY a.id, a.name
// ORDER BY attendance_count ESC
// LIMIT 1;


// Запит на вибірку середнього балу студенту
// SELECT AVG(student_mean) AS mean_of_mean_marks
// FROM (
//     SELECT student_id, AVG(mark) AS student_mean
//     FROM assignments_marks
//     WHERE subject_id = <your_subject_id>
//     GROUP BY student_id
// ) AS student_means;

// Запит на вибірку середньої відвідуваності студенту
// SELECT AVG(student_mean) AS mean_of_mean_marks
// FROM (
//     SELECT student_id, AVG(percentage) AS student_mean
//     FROM attended_meetings
//     WHERE subject_id = <your_subject_id>
//     GROUP BY student_id
// ) AS student_means;