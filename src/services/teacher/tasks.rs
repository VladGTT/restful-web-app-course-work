use crate::entities::{accounts::Model as Account,assignments, subjects};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use sea_orm::{query::*, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, RelationTrait, TransactionTrait};



#[get("/tasks")]
pub async fn get_teacher_tasks(req: HttpRequest,pool: web::Data<DatabaseConnection>,query: web::Query<subjects::ModelQuery>)-> impl Responder {
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
    //     a.id,
    //     a.name,
    //     a.description,
    //     a.due_to,
    //     a.max_point
    // FROM 
    //     assignments a
    // INNER JOIN 
    //     subjects sb ON a.subject_id = sb.id
    // WHERE sb.teacher_id = ? AND sb.id = ?

    let result = assignments::Entity::find()
        .select_only()
        .columns([
            assignments::Column::Id,
            assignments::Column::Name,
            assignments::Column::Description,
            assignments::Column::DueTo,
            assignments::Column::MaxPoint
        ])
        .join(JoinType::InnerJoin, assignments::Relation::Subjects.def())
        .filter(
            Condition::all()
                .add(subjects::Column::TeacherId.eq(account.email.clone()))
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
