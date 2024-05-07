
use std::{env, time::Duration};
use sea_orm::{DatabaseConnection,ConnectOptions,Database};
use actix_web::{web,App, HttpServer};
use crate::services::{
    auth as Auth,
    student::{
        meetings::get_student_meetings,
        profile::get_student_profile,
        subjects::get_student_subjects,
        tasks::get_student_tasks,
        teachers::get_student_teachers,
    },
    // teacher:: {
    //     attendance::{delete_teacher_attendance, get_teacher_attendance, post_teacher_attendance, put_teacher_attendance}
    // }
};
use crate::logging::Logger;

mod auth;
mod valid;
mod services;
mod models;
mod entities;
mod logging;

pub const STUDENT_ROLE_ID: i32 = 2;
pub const ADMIN_ROLE_ID: i32 = 3;
pub const TEACHER_ROLE_ID: i32 = 1;







#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    let pool:DatabaseConnection = {
        let url = env::var("DATABASE_URL").unwrap();
        let mut opt = ConnectOptions::new(url);
        opt.max_connections(100)
            .min_connections(5)
            .connect_timeout(Duration::from_secs(8))
            .acquire_timeout(Duration::from_secs(8))
            .idle_timeout(Duration::from_secs(8))
            .max_lifetime(Duration::from_secs(8))
            .sqlx_logging(true);

        let db = Database::connect(opt).await.unwrap();
        db
    };


    HttpServer::new(move || {
        App::new()
        .app_data({
            actix_web::web::Data::new(pool.clone())
        })
        
        .wrap(Logger::new(pool.clone()))
        .service(Auth::login)        
        .service(
            web::scope("/api")
            
            .service(
                web::scope("/teacher")
                .wrap(auth::Authentication::new(TEACHER_ROLE_ID))
                // .service(get_teacher_attendance)
                // .service(post_teacher_attendance)
                // .service(put_teacher_attendance)
                // .service(delete_teacher_attendance)
                // .service(get_teacher_marks)
                // .service(post_teacher_marks)
                // .service(put_teacher_marks)
                // .service(delete_teacher_marks)
                // .service(get_teacher_meetings)
                // .service(get_teacher_profile)
                // .service(get_teacher_subjects)
                // .service(get_teacher_students)
                // .service(get_teacher_tasks)
            )        
            .service(
                web::scope("/student")   
                .wrap(auth::Authentication::new(STUDENT_ROLE_ID))
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
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
