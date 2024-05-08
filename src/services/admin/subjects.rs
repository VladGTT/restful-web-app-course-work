use crate::entities::{subjects, teachers, users};
use actix_web::{get,post,put,delete, web, HttpResponse, Responder};
use sea_query::Expr;
use validator::Validate;

use sea_orm::{query::*, ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, IntoActiveModel, RelationTrait, Set, TransactionTrait};


#[get("/subjects")]
pub async fn get_admin_subjects(pool: web::Data<DatabaseConnection>)-> impl Responder {

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };

    // "SELECT 
    //     sb.id,
    //     sb.name,
    //     sb.description,
    //     sb.semestr,
    //     CONCAT_WS (' ',u.firstname,u.secondname,u.lastname) AS teacher,
    //     t.occupation 
    // FROM 
    //     subjects sb
    // INNER JOIN
    //     teachers t ON t.email = sb.teacher_id
    // INNER JOIN
    //     users u ON t.email = u.email";

    let result = subjects::Entity::find()
        .select_only()
        .columns(
            [
                subjects::Column::Id,
                subjects::Column::Name,
                subjects::Column::Description,
                subjects::Column::Semestr,
            ]
        )
        .column_as(
            Expr::cust_with_values(
                "CONCAT_WS(' ',?,?,?)",
                [
                    format!(
                        "{}.{}",
                        users::Column::Firstname.as_column_ref().0.to_string(),
                        users::Column::Firstname.as_column_ref().1.to_string(),
                    ),
                    format!(
                        "{}.{}",
                        users::Column::Secondname.as_column_ref().0.to_string(),
                        users::Column::Secondname.as_column_ref().1.to_string(),
                    ),
                    format!(
                        "{}.{}",
                        users::Column::Lastname.as_column_ref().0.to_string(),
                        users::Column::Lastname.as_column_ref().1.to_string(),
                    )
                ]
            ),
            "teacher"
        )
        .column(teachers::Column::Occupation)
        .join(JoinType::InnerJoin,teachers::Relation::Subjects.def().rev())
        .join(JoinType::InnerJoin, users::Relation::Teachers.def().rev())
        .into_json()
        .all(&transaction)
        .await;
        

    match result {
        Ok(data)=>{
            _ = transaction.commit().await;
            HttpResponse::Ok().json(data)        
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string())
    }
}



#[post("/subjects")]
pub async fn post_admin_subjects(pool: web::Data<DatabaseConnection>,data: web::Json<subjects::ModelIdLess>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }

    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
   
    let insert_result = data.to_owned().into_active_model().insert(&transaction).await; 

    match insert_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    }

}

#[put("/subjects")]
pub async fn put_admin_subjects(pool: web::Data<DatabaseConnection>,data: web::Json<subjects::Model>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
 

    let mut new_object = data.to_owned().into_active_model();

    new_object.name = Set(data.name.to_owned());
    new_object.description = Set(data.description.to_owned());
    new_object.semestr = Set(data.semestr);
    new_object.teacher_id = Set(data.teacher_id.to_owned());

    let update_result = new_object.update(&transaction).await;
    

    match update_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    }


}

#[delete("/subjects")]
pub async fn delete_admin_subjects(pool: web::Data<DatabaseConnection>,data: web::Json<subjects::ModelId>)-> impl Responder {

    if data.validate().is_err(){
        return HttpResponse::InternalServerError().finish()
    }
    let transaction = match pool.begin_with_config(Some(sea_orm::IsolationLevel::Serializable), None).await{
        Ok(dat)=> dat,
        Err(_)=>return HttpResponse::InternalServerError().finish()
    };
    
    let delete_result = subjects::Entity::delete_by_id(data.id).exec(&transaction).await;

    match delete_result{
        Ok(_) =>{
            _ = transaction.commit().await;
            HttpResponse::Ok().finish()        
        }
        Err(_) => HttpResponse::InternalServerError().finish()
    }   
}
