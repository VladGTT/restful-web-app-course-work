use crate::{models::*, templates};
use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use std::sync::Arc;
use sqlx::{mysql::MySql,Pool};


// #[get("/stats")]
// pub async fn get_student_stats(req: HttpRequest,pool: web::Data<Arc<Pool<MySql>>>)-> impl Responder {
//     let ext = req.extensions();
//     let account = ext.get::<Account>();
// }