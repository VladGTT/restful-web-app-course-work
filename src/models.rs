
use sea_orm::FromQueryResult;
use serde::{Deserialize, Serialize};
use validator::Validate;
use crate::valid::validate_password;

//---------------------------------- ACTOR-ABSTRACT ------------------------------------//
#[derive(Deserialize,Validate)]
pub struct Attendance{
    pub meeting_id: i32,
    #[validate(email)]
    pub student_id: String,
    pub subject_id: i32,
    pub percentage: f32
}

#[derive(Deserialize,Validate)]
pub struct Mark{
    pub assignment_id: i32,
    #[validate(email)]
    pub student_id: String, 
    pub subject_id: i32, 
    pub mark: f32
}



//---------------------------------- AUTH ------------------------------------//

#[derive(Deserialize,Serialize,Validate,FromQueryResult)]
pub struct Account{
    #[validate(email)]
    // #[sqlx(rename = "email")]
    pub login: String,
    #[validate(custom(function = "validate_password"))]
    pub password: String,
    #[validate(range(min = 0, max = 3))]
    pub role: i32
}

#[derive(Serialize)]
pub struct AuthorizationToken{
    pub authorization: String
}


// ------------------------------- STUDENTS ------------------------------------ //
#[derive(Serialize,FromQueryResult)]
pub struct StudentSubjects{
    pub id: i32,
    pub name: String,
    pub description: String,
    pub semestr: i32,
    pub teacher: String,
    pub occupation: String
}  

#[derive(Serialize,FromQueryResult)]
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

#[derive(Serialize,FromQueryResult)]
pub struct StudentTasks{
    pub id: i32,
    pub name: String,
    pub description: String,
    pub due_to: chrono::NaiveDateTime,
    pub mark: Option<f32>,
    pub max_point: f32
}

#[derive(Serialize,FromQueryResult)]
pub struct StudentMeetings{
    pub id: i32,
    pub name: String,
    pub time: chrono::NaiveDateTime,
    pub attendance: f32
}

#[derive(Serialize,FromQueryResult)]
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

#[derive(Serialize)]
pub struct TeacherStudents{
    pub firstname: String,
    pub secondname: String,
    pub lastname: String,
    pub group: String,
}

#[derive(Serialize)]
pub struct TeacherSubjects{
    pub id: i32,
    pub name: String,
    pub description: String,
    pub semestr: i32,
} 

#[derive(Serialize)]
pub struct TeacherProfileData{
    pub email: String,
    pub firstname: String,
    pub secondname: String,
    pub lastname: String,
    pub occupation: String
}

#[derive(Serialize)]
pub struct TeacherTasks{
    pub id: i32,
    pub name: String,
    pub description: String,
    pub due_to: chrono::NaiveDateTime,
    pub max_point: f32
}

#[derive(Serialize)]
pub struct TeacherMeetings{
    pub id: i32,
    pub name: String,
    pub time: chrono::NaiveDateTime
}

#[derive(Serialize,FromQueryResult)]
pub struct TeacherMarks{
    pub firstname: String,
    pub secondname: String,
    pub lastname: String,
    pub assignment_name: String,
    pub mark: f32
}

#[derive(Serialize,FromQueryResult)]
pub struct TeacherAttendance{
    pub firstname: String,
    pub secondname: String,
    pub lastname: String,
    pub meeting_name: String,
    pub percentage: f32
}