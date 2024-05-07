use std::future::{ready, Ready};

use actix_web::{
    body::EitherBody, dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform}, Error,
};
use futures_util::future::LocalBoxFuture;
use sea_orm::{ ActiveModelTrait, ActiveValue::NotSet, DatabaseConnection, Set};
use crate::entities::logs;
use futures::executor::block_on;


pub struct Logger{
    pool: DatabaseConnection
}

impl Logger {
    pub fn new(pool: DatabaseConnection)->Self{
        Self{pool:pool}
    }
}
 
impl<S, B> Transform<S, ServiceRequest> for Logger
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<EitherBody<B>>;
    type Error = Error;
    type InitError = ();
    type Transform = LoggerMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;
 
    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(LoggerMiddleware { service: service,pool: self.pool.clone()}))
    }
}
 
pub struct LoggerMiddleware<S> {
    service: S,
    pool: DatabaseConnection
}
 
impl<S, B> Service<ServiceRequest> for LoggerMiddleware<S>
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
        //req type, endpoint, time, ip
        
        let time = chrono::Utc::now();
        
        let (http_req,payload) = req.into_parts(); 

        let new_entry = logs::ActiveModel{  
            id: NotSet,
            time: Set(time.naive_utc()),
            description: Set(format!("Path: {}, Method: {}, Addr: {:?}",http_req.path(),http_req.head().method,http_req.peer_addr())) 
        }; 

        _ = block_on(new_entry.insert(&self.pool));
                               
        let fut = self.service.call(ServiceRequest::from_parts(http_req, payload));
        Box::pin(async move {
            let res = fut.await?;                                  
            Ok(res.map_into_left_body())
        })
    }
}