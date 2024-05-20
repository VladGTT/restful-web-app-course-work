use regex::Regex;
use validator::ValidationError;
// pub static PASSWORD_REGEX: Lazy<Regex> = Lazy::new(||
//     Regex::new("").unwrap()
// );

pub fn validate_password(pass: &String)->Result<(),ValidationError>{
    let regex = Regex::new(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$").unwrap();

    if regex.is_match(pass){
        Ok(())
    } else {
        Err(ValidationError::new("terrible_username"))
    }
}

