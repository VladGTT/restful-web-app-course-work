
use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, types::chrono};





//---------------------------------- AUTH ------------------------------------//

#[derive(Deserialize,Serialize,FromRow)]
pub struct Account{
    pub login: String,
    pub password: String,
    pub role: i32
}

#[derive(Serialize)]
pub struct AuthorizationToken{
    pub authorization: String
}


// ------------------------------- STUDENTS ------------------------------------//
#[derive(Serialize,FromRow)]
pub struct StudentSubjects{
    pub id: i32,
    pub name: String,
    pub description: String,
    pub semestr: i32,
    pub teacher: String,
    pub occupation: String
}  

#[derive(Serialize,FromRow)]
pub struct StudentProfileData{
    pub email: String,
    pub firstname: String,
    pub secondname: String,
    pub lastname: String,
    pub group: String,
}

#[derive(Deserialize)]
pub struct StudentSubjectQuery{
    pub subject_id: i32
}

#[derive(Serialize,FromRow)]
pub struct StudentTasks{
    pub id: i32,
    pub name: String,
    pub description: String,
    pub due_to: chrono::NaiveDateTime,
    pub mark: Option<f32>,
    pub max_point: f32
}

