use crate::entities::{accounts::Model as Account,meetings, subjects};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use sea_orm::{query::*, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, RelationTrait, TransactionTrait};



#[get("/meetings")]
pub async fn get_teacher_meetings(req: HttpRequest,pool: web::Data<DatabaseConnection>,query: web::Query<subjects::ModelQuery>)-> impl Responder {
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
    //     a.time
    // FROM 
    //     meetings m a
    // INNER JOIN 
    //     subjects sb ON m.subject_id = sb.id
    // WHERE sb.teacher_id = ? AND sb.id = ?

    let result = meetings::Entity::find()
        .select_only()
        .columns(
            [
                meetings::Column::Id,
                meetings::Column::Name,
                meetings::Column::Time
            ]
        )
        .join(JoinType::InnerJoin, meetings::Relation::Subjects.def())
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
