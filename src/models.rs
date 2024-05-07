
use chrono::NaiveDateTime;
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
    #[validate(range(exclusive_min = 0.0, max = 100.0))]
    pub percentage: f32
}
#[derive(Deserialize,Validate)]
pub struct AttendanceId{
    pub meeting_id: i32,
    #[validate(email)]
    pub student_id: String,
    pub subject_id: i32,
}

#[derive(Deserialize,Validate)]
pub struct Mark{
    pub assignment_id: i32,
    #[validate(email)]
    pub student_id: String, 
    pub subject_id: i32, 
    #[validate(range(exclusive_min = 0.0, max = 100.0))]
    pub mark: f32
}

#[derive(Deserialize,Validate)]
pub struct MarkId{
    pub assignment_id: i32,
    #[validate(email)]
    pub student_id: String, 
    pub subject_id: i32, 
}




#[derive(Deserialize,Validate)]
pub struct Subject{
    pub id: i32,
    pub name: String,
    pub description: String,
    pub semestr: Option<i32>,
    #[validate(email)]
    pub teacher_id: String
}
#[derive(Deserialize,Validate)]
pub struct SubjectIdLess{
    pub name: String,
    pub description: String,
    pub semestr: Option<i32>,
    #[validate(email)]
    pub teacher_id: String
}

#[derive(Deserialize,Validate)]
pub struct SubjectId{
    pub id: i32
}


#[derive(Deserialize,Validate)]
pub struct SubjectsAttendie{
    #[validate(email)]
    pub student_id: String,
    pub subject_id: i32
}



#[derive(Deserialize,Validate)]
pub struct Meeting{
    pub id: i32,
    pub subject_id: i32,
    pub name: String,
    pub time: NaiveDateTime
}
#[derive(Deserialize,Validate)]
pub struct MeetingIdLess{
    pub subject_id: i32,
    pub name: String,
    pub time: NaiveDateTime
}
#[derive(Deserialize,Validate)]
pub struct MeetingId{
    pub id: i32
}

#[derive(Deserialize,Validate)]
pub struct Assignment{
    pub id: i32,
    pub subject_id: i32,
    pub name: String,
    pub description: Option<String>,
    pub due_to: NaiveDateTime,
    pub max_point: f32
}
#[derive(Deserialize,Validate)]
pub struct AssignmentIdLess{
    pub subject_id: i32,
    pub name: String,
    pub description: Option<String>,
    pub due_to: NaiveDateTime,
    pub max_point: f32
}

#[derive(Deserialize,Validate)]
pub struct AssignmentId{
    pub id: i32
}

#[derive(Deserialize,Validate)]
pub struct StudentPassLess{
    pub email: String,
    pub firstname: String,
    pub secondname: String,
    pub lastname: String,
    pub group: String,
}
#[derive(Deserialize,Validate)]
pub struct Student{
    pub email: String,
    pub password: String,
    pub firstname: String,
    pub secondname: String,
    pub lastname: String,
    pub group: String,
}

#[derive(Deserialize,Validate)]
pub struct StudentId{
    pub email: String
}


#[derive(Deserialize,Validate)]
pub struct TeacherPassLess{
    pub email: String,
    pub firstname: String,
    pub secondname: String,
    pub lastname: String,
    pub occupation: String,
}
#[derive(Deserialize,Validate)]
pub struct Teacher{
    pub email: String,
    pub password: String,
    pub firstname: String,
    pub secondname: String,
    pub lastname: String,
    pub occupation: String,
}

#[derive(Deserialize,Validate)]
pub struct TeacherId{
    pub email: String
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

// --------------------------------- STUDENT ---------------------------------- //

#[derive(Deserialize)]
pub struct StudentSubjectQuery{
    pub subject_id: i32
}


// --------------------------------- TEACHER ---------------------------------- //

#[derive(Deserialize)]
pub struct TeacherSubjectQuery{
    pub subject_id: i32
}


// --------------------------------- ADMIN ---------------------------------- //

