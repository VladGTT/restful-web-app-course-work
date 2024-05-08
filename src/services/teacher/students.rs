use crate::entities::{accounts::Model as Account, students, subjects, subjects_attendies, users};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use sea_orm::{query::*, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, RelationTrait, TransactionTrait};



#[get("/students")]
pub async fn get_teacher_students(req: HttpRequest,pool: web::Data<DatabaseConnection>,query: web::Query<subjects::ModelQuery>)-> impl Responder {
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
    //     u.firstname,
    //     u.secondname,
    //     u.lastname,
    //     s.group
    // FROM 
    //     subjects_attendies sa
    // INNER JOIN 
    //     students s ON s.email = sa.student_id
    // INNER JOIN 
    //     users u ON s.email = u.email
    // INNER JOIN 
    //     subjects sb ON sb.id = sa.subject_id 
    // WHERE sb.teacher_id = ? AND sa.subject_id = ?

    
    let result = subjects_attendies::Entity::find()
        .select_only()
        .columns([
            users::Column::Firstname,
            users::Column::Secondname,
            users::Column::Lastname
        ])
        .column(students::Column::Group)
        .join(JoinType::InnerJoin, subjects_attendies::Relation::Students.def())
        .join(JoinType::InnerJoin, students::Relation::Users.def())
        .join(JoinType::InnerJoin, subjects_attendies::Relation::Subjects.def())
        .filter(
            Condition::all()
                .add(subjects::Column::TeacherId.eq(account.email.clone()))
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