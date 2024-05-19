
use std::{env, time::Duration};
use sea_orm::{DatabaseConnection,ConnectOptions,Database};
use actix_web::{web, App, HttpServer};
use actix_cors::Cors;
use actix_files;
use crate::services::{
    auth as Auth,
    student::{
        meetings::get_student_meetings,
        profile::{get_student_profile,put_student_profile},
        subjects::get_student_subjects,
        tasks::get_student_tasks,
        teachers::get_student_teachers,
        //stats
    },
    teacher::{
        attendance::{delete_teacher_attendance, get_teacher_attendance, post_teacher_attendance, put_teacher_attendance},
        marks::{delete_teacher_marks,get_teacher_marks,post_teacher_marks,put_teacher_marks},
        meetings::get_teacher_meetings,
        //stats
        profile::{get_teacher_profile,put_teacher_profile},
        students::get_teacher_students,
        subjects::get_teacher_subjects,
        tasks::{get_teacher_tasks,post_teacher_tasks,put_teacher_tasks,delete_teacher_tasks},
    },
    admin::{
        attendance::{get_admin_attendance,delete_admin_attendance,post_admin_attendance,put_admin_attendance},
        attendies::{delete_admin_attendies,get_admin_attendies,post_admin_attendies},
        db::{post_admin_db_action,get_admin_db_status},
        logs::get_admin_logs,
        marks::{delete_admin_marks,get_admin_marks,post_admin_marks,put_admin_marks},
        meetings::{delete_admin_meetings,get_admin_meetings,post_admin_meetings,put_admin_meetings},
        students::{delete_admin_students,get_admin_students,post_admin_students,put_admin_students},
        subjects::{delete_admin_subjects,get_admin_subjects,post_admin_subjects,put_admin_subjects},
        tasks::{delete_admin_tasks,get_admin_tasks,post_admin_tasks,put_admin_tasks},
        teachers::{delete_admin_teachers,get_admin_teachers,post_admin_teachers,put_admin_teachers},
        profile::{get_admin_profile,put_admin_profile}
    }
};
use crate::logging::Logger;

mod auth;
mod valid;
mod services;
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
        
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();
            

        App::new()
        .app_data(actix_web::web::Data::new(pool.clone()))
        .wrap(cors)
        .wrap(Logger::new(pool.clone()))
        .service(
            web::scope("/api")
            .service(Auth::login)        
            .service(
                web::scope("/teacher")
                .wrap(auth::Authentication::new(TEACHER_ROLE_ID))
                .service(get_teacher_attendance)
                .service(post_teacher_attendance)
                .service(put_teacher_attendance)
                .service(delete_teacher_attendance)
                .service(get_teacher_marks)
                .service(post_teacher_marks)
                .service(put_teacher_marks)
                .service(delete_teacher_marks)
                .service(get_teacher_meetings)
                .service(get_teacher_profile)
                .service(put_teacher_profile)
                .service(get_teacher_subjects)
                .service(get_teacher_students)
                .service(get_teacher_tasks)
                .service(post_teacher_tasks)
                .service(put_teacher_tasks)
                .service(delete_teacher_tasks)
            )        
            .service(
                web::scope("/student")   
                .wrap(auth::Authentication::new(STUDENT_ROLE_ID))
                .service(get_student_subjects)
                .service(get_student_profile)
                .service(put_student_profile)
                .service(get_student_tasks)
                .service(get_student_meetings)
                .service(get_student_teachers)
            )
            .service(
                web::scope("/admin")
                .wrap(auth::Authentication::new(ADMIN_ROLE_ID))
                .service(get_admin_attendance)
                .service(delete_admin_attendance)
                .service(post_admin_attendance)
                .service(put_admin_attendance)
                .service(get_admin_attendies)
                .service(delete_admin_attendies)
                .service(post_admin_attendies)
                .service(post_admin_db_action)
                .service(get_admin_db_status)
                .service(get_admin_logs)
                .service(get_admin_marks)
                .service(delete_admin_marks)
                .service(post_admin_marks)
                .service(put_admin_marks)
                .service(get_admin_meetings)
                .service(delete_admin_meetings)
                .service(post_admin_meetings)
                .service(put_admin_meetings)
                .service(get_admin_students)
                .service(delete_admin_students)
                .service(post_admin_students)
                .service(put_admin_students)
                .service(get_admin_subjects)
                .service(delete_admin_subjects)
                .service(post_admin_subjects)
                .service(put_admin_subjects)
                .service(get_admin_tasks)
                .service(delete_admin_tasks)
                .service(post_admin_tasks)
                .service(put_admin_tasks)
                .service(get_admin_teachers)
                .service(delete_admin_teachers)
                .service(post_admin_teachers)
                .service(put_admin_teachers)
                .service(get_admin_profile)
                .service(put_admin_profile)
            )
        )
        .service(actix_files::Files::new("/", "./ui").index_file("login.html"))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
