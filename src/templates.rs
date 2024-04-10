pub static GET_ACCOUNT_QUERY: &str = "SELECT email,password,role FROM accounts WHERE email = '?';";  
pub static LOCK_TABLES_QUERY: &str = "LOCK TABLES ? READ WRITE";  
pub static UNLOCK_TABLES_QUERY: &str = "UNLOCK TABLES";  