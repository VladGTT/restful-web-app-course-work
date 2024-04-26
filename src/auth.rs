use jwt_simple::prelude::*;
use actix_web::{http::header::AUTHORIZATION, HttpMessage, HttpRequest};
use crate::models::*;

pub fn tokenize(data: Account,raw_key: &[u8])->String{

    let hours_of_token_validity = std::env::var("HOURS_OF_TOKEN_VALIDITY").unwrap().parse::<u64>().unwrap();

    let key = HS256Key::from_bytes(raw_key);
    let claims = Claims::with_custom_claims(data, Duration::from_hours(hours_of_token_validity));
    let token = key.authenticate(claims).unwrap();
    token
}

pub fn verify_token(token: &str,raw_key: &[u8])->Result<Account,()>{
    let key = HS256Key::from_bytes(raw_key);
    let claims = key.verify_token::<Account>(&token, None);
    match claims{
        Ok(data)=>{
            Ok(Account{
                login: data.custom.login, 
                password: data.custom.password,
                role: data.custom.role
            })
        }
        Err(_)=>Err(())
    }

}
pub fn approve_request(req: &HttpRequest)->Result<Account,()>{
    let secret_key = std::env::var("SECRET_KEY").unwrap();


    let token = match req.headers().get(AUTHORIZATION) {
        Some(dat) => match dat.to_str(){
            Ok(str)=>str,
            Err(_)=>return Err(())
        },
        _ => return Err(()),
    };
    
    match verify_token(&token, secret_key.as_bytes()){
        Ok(data)=>return Ok(data),
        Err(_)=>return Err(())
    }
}




use std::future::{ready, Ready};
 
use actix_web::{
    body::EitherBody,
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    Error, HttpResponse,
};
use futures_util::{future::LocalBoxFuture, FutureExt};
 
pub struct Authentication{
    role_id: i32
}

impl Authentication{
    pub fn new(role: i32) -> Self {
        Authentication{role_id: role}
    }
}
 
impl<S, B> Transform<S, ServiceRequest> for Authentication
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<EitherBody<B>>;
    type Error = Error;
    type InitError = ();
    type Transform = AuthenticationMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;
 
    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(AuthenticationMiddleware { service: service,role_id: self.role_id }))
    }
}
 
pub struct AuthenticationMiddleware<S> {
    service: S,
    role_id: i32
}
 
impl<S, B> Service<ServiceRequest> for AuthenticationMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<EitherBody<B>>; 
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;
 
    forward_ready!(service);
 
    fn call(&self, req: ServiceRequest) -> Self::Future {       
        let data = approve_request(req.request());

        match data {
            Ok(dat) if dat.role == self.role_id =>{
                req
                    .extensions_mut()
                    .insert::<Account>(dat);        
                let fut = self.service.call(req);
                Box::pin(async move {
                    let res = fut.await?;                                  
                    Ok(res.map_into_left_body())
                })
            }
            _ =>{
                let http_res = HttpResponse::Unauthorized().finish();
                let (http_req, _) = req.into_parts();
                let res = ServiceResponse::new(http_req, http_res);
                (async move { Ok(res.map_into_right_body()) }).boxed_local()
            }
        } 
    }
}
