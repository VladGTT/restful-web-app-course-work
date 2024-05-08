use crate::entities::{accounts::Model as Account,subjects,subjects_attendies,users,teachers};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use sea_orm::{query:: *, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, RelationTrait, TransactionTrait};
use sea_orm::sea_query::Expr;

#[get("/subjects")]
pub async fn get_student_subjects(req: HttpRequest,pool: web::Data<DatabaseConnection>)-> impl Responder {
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
    //     sb.id,
    //     sb.name,
    //     sb.description,
    //     sb.semestr,
    //     CONCAT_WS (' ',u.firstname,u.secondname,u.lastname) AS teacher,
    //     t.occupation 
    // FROM 
    //     subjects sb
    // INNER JOIN 
    //     subjects_attendies sa ON sa.subject_id = sb.id   
    // INNER JOIN
    //     teachers t ON t.email = sb.teacher_id
    // INNER JOIN
    //     users u ON t.email = u.email
    // WHERE sa.student_id = ?
     
    let result = subjects::Entity::find()
        .select_only()
        .columns(
            [
                subjects::Column::Id,
                subjects::Column::Name,
                subjects::Column::Description,
                subjects::Column::Semestr
            ]
        )
        .column_as(
            Expr::cust_with_values(
                "CONCAT_WS(' ',?,?,?)",
                [
                    format!(
                        "{}.{}",
                        users::Column::Firstname.as_column_ref().0.to_string(),
                        users::Column::Firstname.as_column_ref().1.to_string(),
                    ),
                    format!(
                        "{}.{}",
                        users::Column::Secondname.as_column_ref().0.to_string(),
                        users::Column::Secondname.as_column_ref().1.to_string(),
                    ),
                    format!(
                        "{}.{}",
                        users::Column::Lastname.as_column_ref().0.to_string(),
                        users::Column::Lastname.as_column_ref().1.to_string(),
                    )
                ]
            ),
            "teacher"
        )
        .column(teachers::Column::Occupation)
        .join(JoinType::InnerJoin, subjects::Relation::SubjectsAttendies.def())
        .join(JoinType::InnerJoin, teachers::Relation::Subjects.def().rev())
        .join(JoinType::InnerJoin, teachers::Relation::Users.def())
        .filter(subjects_attendies::Column::StudentId.eq(account.email.clone()))
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