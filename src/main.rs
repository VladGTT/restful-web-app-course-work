
use std::sync::Arc;
use services::{student::{meetings::get_student_meetings, profile::get_student_profile, subjects::get_student_subjects, tasks::get_student_tasks, teachers::get_student_teachers}, teacher::{attendance::get_teacher_attendance, marks::get_teacher_marks, meetings::get_teacher_meetings, profile::get_teacher_profile, students::get_teacher_students, subjects::get_teacher_subjects, tasks::get_teacher_tasks}};
use sqlx::{mysql::{MySql, MySqlPoolOptions},Pool};
use actix_web::{web,App, HttpServer};
use dotenv;
use crate::services::auth as Auth;

mod auth;
mod services;
mod models;
mod templates;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    let pool:Arc<Pool<MySql>> = Arc::new(MySqlPoolOptions::new()
        .max_connections(10)
        .connect(&(std::env::var("DATABASE_URL").unwrap()))
        .await
        .unwrap());


    HttpServer::new(move || {
        App::new()
        .app_data({
            actix_web::web::Data::new(pool.clone())
        })
        
        // .wrap(Logger::default())
        .service(
            web::scope("/api")
            .wrap(auth::Authentication::default())
            
            .service(
                web::scope("/teacher")
                .wrap(auth::RoleValidation::new(1))
                .service(get_teacher_attendance)
                .service(get_teacher_marks)
                .service(get_teacher_meetings)
                .service(get_teacher_profile)
                .service(get_teacher_subjects)
                .service(get_teacher_students)
                .service(get_teacher_tasks)
            )        
            .service(
                web::scope("/student")   
                .wrap(auth::RoleValidation::new(2))
                .service(get_student_subjects)
                .service(get_student_profile)
                .service(get_student_tasks)
                .service(get_student_meetings)
                .service(get_student_teachers)
            )
            // .service(
            //     web::scope("/admin")
            // )
        )
        .service(Auth::login)        
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
