
use std::sync::Arc;
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
            // .service(get_resorts)
            // .service(get_resort_by_id)
            // .service(get_hotels)
            // .service(get_hotel_by_id)
            // .service(get_rooms)
            // .service(get_room_by_id)
            // .service(get_bookings)
        )        
        .service(Auth::login)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
