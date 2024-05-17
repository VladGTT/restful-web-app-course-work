
use crate::entities::{accounts::Model as Account, attended_meetings, meetings, students, subjects, subjects_attendies, users};
use actix_web::{get,post,put,delete, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use sea_orm::{query::*, ActiveModelTrait, ColumnTrait, DatabaseConnection, DatabaseTransaction, EntityTrait, IntoActiveModel, QueryFilter, RelationTrait, Set, TransactionTrait};
use validator::Validate;

async fn check_teacher(tx: &DatabaseTransaction, data: attended_meetings::ActiveModel, email: String)->Result<Option<i32>, sea_orm::prelude::DbErr>{
    meetings::Entity::find()
        .select_only()
        .column_as(meetings::Column::Id.count(),"count")
        .join(JoinType::InnerJoin, meetings::Relation::Subjects.def())
        .join(JoinType::InnerJoin,subjects::Relation::SubjectsAttendies.def())
        .filter(
            Condition::all()
                .add(meetings::Column::Id.eq(data.meeting_id.unwrap()))
                .add(subjects_attendies::Column::StudentId.eq(data.student_id.to_owned().unwrap()))
                .add(subjects::Column::Id.eq(data.subject_id.unwrap()))
                .add(subjects::Column::TeacherId.eq(email))
        )
        .into_tuple()
        .one(tx)
        .await
}


#[get("/attendance")]
pub async fn get_teacher_attendance(req: HttpRequest,pool: web::Data<DatabaseConnection>,query: web::Query<subjects::ModelQuery>)-> impl Responder {
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


    let result = attended_meetings::Entity::find()
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
        .join(JoinType::RightJoin,attended_meetings::Relation::Meetings.def())
        .join(JoinType::InnerJoin, meetings::Relation::Subjects.def())
        .join(JoinType::InnerJoin, attended_meetings::Relation::SubjectsAttendies.def())
        .join(JoinType::InnerJoin, subjects_attendies::Relation::Students.def())
        .join(JoinType::InnerJoin, students::Relation::Users.def())
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
        Err(err) => {
            _ = transaction.rollback().await;
            HttpResponse::InternalServerError().body(err.to_string())
        }
    }

}


#[post("/attendance")]
pub async fn post_teacher_attendance(req: HttpRequest,pool: web::Data<DatabaseConnection>,data: web::Json<attended_meetings::Model>)-> impl Responder {
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
        
    let check_result= check_teacher(&transaction, data.clone().into_active_model(), account.email.clone()).await;
        

    //SELECT COUNT(*) FROM meetings m INNER JOIN subjects s ON m.subject_id = s.id INNER JOIN subjects_attendies sa ON sa.subject_id = s.id WHERE m.id = 0 AND sa.student_id = 'student1@example.com' AND s.id = 1 AND s.teacher_id = 'teacher1@example.com'

    // "INSERT INTO attended_meetings (meeting_id, student_id, subject_id, percentage)
    // VALUES (?, ?, ?, ?)"
    

    
    let insert_result = data.to_owned().into_active_model().insert(&transaction).await;


    match insert_result.and(check_result.map(|val|val.filter(|v|*v==1))){
        Ok(Some(_)) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        _ => {
            _ = transaction.rollback().await;
            HttpResponse::InternalServerError().finish()
        }
    }
     
}

#[put("/attendance")]
pub async fn put_teacher_attendance(req: HttpRequest,pool: web::Data<DatabaseConnection>,data: web::Json<attended_meetings::Model>)-> impl Responder {
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

    let check_result= check_teacher(&transaction, data.clone().into_active_model(), account.email.clone()).await;

    let mut new_object = data.to_owned().into_active_model();
    new_object.percentage = Set(data.percentage);
    let update_result = new_object.into_active_model().update(&transaction).await;
    
    match update_result.and(check_result.map(|val|val.filter(|v|*v==1))){
        Ok(Some(_)) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        _ => {
            _ = transaction.rollback().await;
            HttpResponse::InternalServerError().finish()
        }
    } 
     
}

#[delete("/attendance")]
pub async fn delete_teacher_attendance(req: HttpRequest,pool: web::Data<DatabaseConnection>,data: web::Json<attended_meetings::ModelId>)-> impl Responder {
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

    let check_result= check_teacher(&transaction, data.clone().into_active_model(), account.email.clone()).await;
    
    let delete_result = data.to_owned().into_active_model().delete(&transaction).await;

    match delete_result.and(check_result.map(|val|val.filter(|v|*v==1))){
        Ok(Some(_)) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        _ => {
            _ = transaction.rollback().await;
            HttpResponse::InternalServerError().finish()
        }
    }


}






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
    //                     .add(subjects::Column::TeacherId.eq(account.email.clone()))
    //             )
    //             .into_query()
    //             .into_sub_query_statement()
    //     )),
    //     data.percentage.into(),
    // ])
    // .unwrap()
    // .to_owned();


    // let result = transaction.query_all(pool.get_database_backend().build(&query)).await;
