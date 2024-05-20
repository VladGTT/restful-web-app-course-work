use fancy_regex::Regex;
use validator::ValidationError;
// pub static PASSWORD_REGEX: Lazy<Regex> = Lazy::new(||
//     Regex::new("").unwrap()
// );

pub fn validate_password(pass: &String)->Result<(),ValidationError>{
    let regex = Regex::new(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$").unwrap();

    regex.is_match(pass)
        .map_err(|_|ValidationError::new("terrible_username"))
        .and_then(|val|if val{Ok(())}else{Err(ValidationError::new("terrible_username"))})
}

