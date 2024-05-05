use crate::{entities::{prelude, subjects, subjects_attendies, teachers, users}, models::*};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use sea_orm::{query::*, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, RelationTrait, TransactionTrait};



#[get("/teachers")]
pub async fn get_student_teachers(req: HttpRequest,pool: web::Data<DatabaseConnection>,query: web::Query<StudentSubjectQuery>)-> impl Responder {
    let ext = req.extensions();
    let account = match ext.get::<Account>(){
        Some(acc) => acc,
        None => return HttpResponse::InternalServerError().finish()
    };

    // "SELECT 
    //     u.firstname,
    //     u.secondname,
    //     u.lastname,
    //     t.occupation,
    //     sb.name AS subject_name 
    // FROM 
    //     teachers t
    // INNER JOIN 
    //     users u ON u.email = t.email
    // INNER JOIN 
    //     subjects sb ON sb.teacher_id = t.email
    // INNER JOIN
    //     subjects_attendies sa ON sa.subject_id = sb.id
    // WHERE sa.student_id = ? AND sa.subject_id = ?"
    
    
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };


    let result = prelude::Teachers::find()
        .select_only()
        .columns(
            [
                users::Column::Firstname,
                users::Column::Secondname,
                users::Column::Lastname,
            ]
        )
        .column(teachers::Column::Occupation)
        .column_as(subjects::Column::Name, "subject_name")
        .join(JoinType::InnerJoin, users::Relation::Teachers.def().rev())
        .join(JoinType::InnerJoin, subjects::Relation::Teachers.def().rev())
        .join(JoinType::InnerJoin, subjects_attendies::Relation::Subjects.def().rev())
        .filter(
            Condition::any()
               .add(subjects_attendies::Column::StudentId.eq(account.login.clone()))
               .add(subjects_attendies::Column::SubjectId.eq(query.subject_id))
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