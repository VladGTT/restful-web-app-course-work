use crate::entities::{accounts::Model as Account, assignments, assignments_marks, attended_meetings, subjects};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use futures_util::FutureExt;
use sea_orm::{query::*, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, RelationTrait, TransactionTrait};
use sea_query::SimpleExpr;
use serde_json::json;
#[get("/stats")]
pub async fn get_student_stats(req: HttpRequest,pool: web::Data<DatabaseConnection>,query: web::Query<subjects::ModelQuery>)-> impl Responder {
    let ext = req.extensions();
    let account = match ext.get::<Account>(){
        Some(acc) => acc,
        None => return HttpResponse::InternalServerError().finish()
    };
    
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    let average_mark_per_subject = assignments_marks::Entity::find()
        .select_only()
        .column_as(assignments_marks::Column::Mark.sum().div(assignments_marks::Column::Mark.count()), "mark")
        .filter(
            Condition::all()
            .add(assignments_marks::Column::SubjectId.eq(query.subject_id))
            .add(assignments_marks::Column::StudentId.eq(account.email.to_owned()))   
        )
        .into_json()
        .one(&transaction)
        .map(|val|{
            match val {
                Ok(Some(val))=>Some(val),
                _=>None
            }
        })
        .await;

    let task_with_highest_mark = assignments::Entity::find()
        .select_only()
        .column(assignments::Column::Name)
        .column_as(assignments_marks::Column::Mark.max(),"mark")
        .join(JoinType::InnerJoin,assignments::Relation::AssignmentsMarks.def())
        .filter(
            Condition::all()
                .add(assignments_marks::Column::SubjectId.eq(query.subject_id))
                .add(assignments_marks::Column::StudentId.eq(account.email.to_owned()))   
        )
        .group_by(SimpleExpr::Custom("`assignments`.`name`,`assignments_marks`.`mark`".to_string()))
        .into_json()
        .one(&transaction)
        .map(|val|{
            match val {
                Ok(Some(val))=>Some(val),
                _=>None
            }
        })
        .await;

    let task_with_lowest_mark = assignments::Entity::find()
        .select_only()
        .column(assignments::Column::Name)
        .column_as(assignments_marks::Column::Mark.min(),"mark")
        .join(JoinType::InnerJoin,assignments::Relation::AssignmentsMarks.def())
        .filter(
            Condition::all()
                .add(assignments_marks::Column::SubjectId.eq(query.subject_id))
                .add(assignments_marks::Column::StudentId.eq(account.email.to_owned()))   
        )
        .group_by(SimpleExpr::Custom("`assignments`.`name`,`assignments_marks`.`mark`".to_string()))
        .into_json()
        .one(&transaction)
        .map(|val|{
            match val {
                Ok(Some(val))=>Some(val),
                _=>None
            }
        })
        .await;
    
    let number_of_attended_meetings = attended_meetings::Entity::find()
        .select_only()
        .column_as(attended_meetings::Column::MeetingId.count(), "count")
        .filter(
            Condition::all()
                .add(attended_meetings::Column::SubjectId.eq(query.subject_id))
                .add(attended_meetings::Column::StudentId.eq(account.email.to_owned()))   
        )
        .into_json()
        .one(&transaction)
        .map(|val|{
            match val {
                Ok(Some(val))=>Some(val),
                _=>None
            }
        })
        .await;

    let number_of_completed_tasks = assignments_marks::Entity::find()
        .select_only()
        .column_as(assignments_marks::Column::AssignmentId.count(), "count")
        .filter(
            Condition::all()
                .add(assignments_marks::Column::SubjectId.eq(query.subject_id))
                .add(assignments_marks::Column::StudentId.eq(account.email.to_owned()))   
        )
        .into_json()
        .one(&transaction)
        .map(|val|{
            match val {
                Ok(Some(val))=>Some(val),
                _=>None
            }
        })
        .await;
    


  

    let result = json!({
        "average_mark_per_subject" : average_mark_per_subject,
        "task_with_highest_mark" : task_with_highest_mark,
        "task_with_lowest_mark" : task_with_lowest_mark,
        "number_of_attended_meetings" : number_of_attended_meetings,
        "number_of_completed_tasks" : number_of_completed_tasks,
    });

    _ = transaction.commit().await;
    HttpResponse::Ok().json(result)        
}

//Запит на вибірку середнього відсотка виконання завдань
// "SELECT AVG(mark) FROM assignments_marks WHERE student_id = ? AND subject_id = ?";

//Запит на вибірку завдання з максимальним відсотком виконання
// "SELECT a.name, MAX(am.mark)
// FROM 
//     assignments a 
//     INNER JOIN 
//         assignments_marks am 
//         ON a.id = am.assignment_id 
// WHERE am.subject_id = 0 AND am.student_id = ''
// GROUP BY a.name, am.mark";

//Запит на вибірку завдання з мінімальним відсотком виконання
// "SELECT a.name, MIN(am.mark)
// FROM 
//     assignments a 
//     INNER JOIN 
//         assignments_marks am 
//         ON a.id = am.assignment_id 
// WHERE am.subject_id = 0 AND am.student_id = '' 
// GROUP BY a.name, am.mark";

//Запит на вибірку відсотка виконаних завдань
// "SELECT 
//     COUNT(*) 
// FROM 
//     assignments_marks
// WHERE student_id = ? AND subject_id = ?"; 

//Запит на вибірку відсотка відвіданих занять
// "SELECT 
//     COUNT(*) 
// FROM 
//     attended_meetings
// WHERE student_id = ? AND subject_id = ?"; 
