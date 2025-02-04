
use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, types::chrono};





//---------------------------------- AUTH ------------------------------------//

#[derive(Deserialize,Serialize,FromRow)]
pub struct Account{
    #[sqlx(rename = "email")]
    pub login: String,
    pub password: String,
    pub role: i32
}

#[derive(Serialize)]
pub struct AuthorizationToken{
    pub authorization: String
}


// ------------------------------- STUDENTS ------------------------------------ //
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

#[derive(Serialize,FromRow)]
pub struct StudentMeetings{
    pub id: i32,
    pub name: String,
    pub time: chrono::NaiveDateTime,
    pub attendance: f32
}

#[derive(Serialize,FromRow)]
pub struct StudentTeachers{
    pub firstname: String,
    pub secondname: String,
    pub lastname: String,
    pub occupation: String,
    pub subject_name: String,
}

// --------------------------------- TEACHER ---------------------------------- //
#[derive(Deserialize)]
pub struct TeacherSubjectQuery{
    pub subject_id: i32
}

#[derive(Serialize,FromRow)]
pub struct TeacherStudents{
    pub firstname: String,
    pub secondname: String,
    pub lastname: String,
    pub group: String,
}

#[derive(Serialize,FromRow)]
pub struct TeacherSubjects{
    pub id: i32,
    pub name: String,
    pub description: String,
    pub semestr: i32,
} 

#[derive(Serialize,FromRow)]
pub struct TeacherProfileData{
    pub email: String,
    pub firstname: String,
    pub secondname: String,
    pub lastname: String,
    pub occupation: String
}

#[derive(Serialize,FromRow)]
pub struct TeacherTasks{
    pub id: i32,
    pub name: String,
    pub description: String,
    pub due_to: chrono::NaiveDateTime,
    pub max_point: f32
}

#[derive(Serialize,FromRow)]
pub struct TeacherMeetings{
    pub id: i32,
    pub name: String,
    pub time: chrono::NaiveDateTime
}

#[derive(Serialize,FromRow)]
pub struct TeacherMarks{
    pub firstname: String,
    pub secondname: String,
    pub lastname: String,
    #[sqlx(rename = "name")]
    pub assignment_name: String,
    pub mark: f32
}

#[derive(Serialize,FromRow)]
pub struct TeacherAttendance{
    pub firstname: String,
    pub secondname: String,
    pub lastname: String,
    #[sqlx(rename = "name")]
    pub meeting_name: String,
    pub percentage: f32
}