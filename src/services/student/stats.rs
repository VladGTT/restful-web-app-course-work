// use crate::models::*;
// use actix_web::{get, web, HttpMessage, HttpRequest, HttpResponse, Responder};


// #[get("/stats")]
// pub async fn get_student_stats(req: HttpRequest,pool: web::Data<Arc<Pool<MySql>>>)-> impl Responder {
//     let ext = req.extensions();
//     let account = ext.get::<Account>();
// }

//Запит на вибірку середнього відсотка виконання завдань
// "SELECT AVG(mark) FROM assignments_marks WHERE student_id = ? AND subject_id = ?";

//Запит на вибірку завдання з максимальним відсотком виконання
// "SELECT a.name, MAX(am.mark)
// FROM 
//     assignments a 
//     INNER JOIN 
//         assignments_marks am 
//         ON a.id = am.assignment_id 
// WHERE am.subject_id = 0 AND am.student_id = ''
// GROUP BY a.name, am.mark";

//Запит на вибірку завдання з мінімальним відсотком виконання
// "SELECT a.name, MIN(am.mark)
// FROM 
//     assignments a 
//     INNER JOIN 
//         assignments_marks am 
//         ON a.id = am.assignment_id 
// WHERE am.subject_id = 0 AND am.student_id = '' 
// GROUP BY a.name, am.mark";

//Запит на вибірку відсотка виконаних завдань
// "SELECT 
//     COUNT(*) 
// FROM 
//     assignments_marks
// WHERE student_id = ? AND subject_id = ?"; 

//Запит на вибірку відсотка відвіданих занять
// "SELECT 
//     COUNT(*) 
// FROM 
//     attended_meetings
// WHERE student_id = ? AND subject_id = ?"; 
