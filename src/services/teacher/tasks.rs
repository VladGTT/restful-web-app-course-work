use crate::{models::*, templates};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use futures_util::TryFutureExt;
use std::sync::Arc;
use sqlx::{mysql::MySql,Pool};



#[get("/tasks")]
pub async fn get_teacher_tasks(req: HttpRequest,pool: web::Data<Arc<Pool<MySql>>>,query: web::Query<TeacherSubjectQuery>)-> impl Responder {
    let ext = req.extensions();
    let account = match ext.get::<Account>(){
        Some(acc) => acc,
        None => return HttpResponse::InternalServerError().finish()
    };

    let mut transaction = match pool.begin().await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
    _ = sqlx::query(templates::SET_ISOLATION_QUERY)
        .execute(&mut *transaction)
        .await;
    let result: Result<Vec<TeacherTasks>, sqlx::Error> = sqlx::query(templates::TEACHER_TASKS_PER_DESCIPLINE)
        .bind(account.login.clone())
        .bind(query.subject_id)
        .fetch_all(&***pool)
        .map_ok(|rows|
            rows.iter().map(|row|{
                sqlx::FromRow::from_row(row).unwrap()
            })
            .collect()
        )
        .await;

    if result.is_err(){
        _ = transaction.rollback().await;
        HttpResponse::InternalServerError().finish()
    } else {
        _ = transaction.commit().await;
        HttpResponse::Ok().json(result.unwrap())
    } 
}
