use crate::{entities::{assignments, assignments_marks, prelude}, models::*};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use sea_orm::{query::*, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, RelationTrait, TransactionTrait};



#[get("/tasks")]
pub async fn get_student_tasks(req: HttpRequest,pool: web::Data<DatabaseConnection>,query: web::Query<StudentSubjectQuery>)-> impl Responder {
    let ext = req.extensions();
    let account = match ext.get::<Account>(){
        Some(acc) => acc,
        None => return HttpResponse::InternalServerError().finish()
    };

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };



    // "SELECT 
    //     a.id,
    //     a.name,
    //     a.description,
    //     a.due_to,
    //     am.mark,
    //     a.max_point
    // FROM 
    //     assignments a
    // LEFT JOIN 
    //     assignments_marks am ON am.assignment_id = a.id
    // WHERE am.student_id = ? AND am.subject_id = ?";
    


    let result = prelude::Assignments::find()
        .select_only()
        .columns(
            [
                assignments::Column::Id,
                assignments::Column::Name,
                assignments::Column::Description,
                assignments::Column::DueTo
            ]
        )
        .column(assignments_marks::Column::Mark)   
        .column(assignments::Column::MaxPoint)   
        .join(JoinType::LeftJoin,assignments_marks::Relation::Assignments.def().rev())
        .filter(
            Condition::all()
                .add(assignments_marks::Column::StudentId.eq(account.login.clone()))
                .add(assignments_marks::Column::SubjectId.eq(query.subject_id))
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