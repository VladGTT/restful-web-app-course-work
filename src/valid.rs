use regex::Regex;
use serde::Deserialize;
use validator::{Validate, ValidationError};
// pub static PASSWORD_REGEX: Lazy<Regex> = Lazy::new(||
//     Regex::new("").unwrap()
// );

pub fn validate_password(pass: &String)->Result<(),ValidationError>{
    let regex = Regex::new(r"").unwrap();

    if regex.is_match(pass){
        Ok(())
    } else {
        Err(ValidationError::new("terrible_username"))
    }
}




