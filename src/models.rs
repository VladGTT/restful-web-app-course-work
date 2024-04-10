
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

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