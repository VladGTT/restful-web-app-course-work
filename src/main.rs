
use std::sync::Arc;
use services::student::subjects::get_student_subjects;
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
            // .wrap(auth::Authentication::default())
            // .service(
            //     web::scope("/teacher")   
            // )        
            .service(
                web::scope("/student")   
                .service(get_student_subjects)
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
