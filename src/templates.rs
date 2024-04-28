pub static GET_ACCOUNT_QUERY: &str = "SELECT email, password, role FROM accounts WHERE email = ?";  
pub static SET_ISOLATION_QUERY: &str = "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE";

//------------------------------------------- STUDENT --------------------------------------------//

//Запит на вибірку середнього відсотка виконання завдань
pub static STUDENT_AVG_MARK_QUERY: &str = 
    "SELECT AVG(mark) FROM assignments_marks WHERE student_id = ? AND subject_id = ?";

//Запит на вибірку завдання з максимальним відсотком виконання
pub static STUDENT_BEST_COMPETED_TASK_QUERY: &str = 
    "SELECT a.name, MAX(am.mark)
    FROM 
        assignments a 
        INNER JOIN 
            assignments_marks am 
            ON a.id = am.assignment_id 
    WHERE am.subject_id = 0 AND am.student_id = ''
    GROUP BY a.name, am.mark";

//Запит на вибірку завдання з мінімальним відсотком виконання
pub static STUDENT_WORST_COMPETED_TASK_QUERY: &str = 
    "SELECT a.name, MIN(am.mark)
    FROM 
        assignments a 
        INNER JOIN 
            assignments_marks am 
            ON a.id = am.assignment_id 
    WHERE am.subject_id = 0 AND am.student_id = '' 
    GROUP BY a.name, am.mark";

//Запит на вибірку відсотка виконаних завдань
pub static STUDENT_TASK_COMPLETION_PERCENTAGE_QUERY: &str = 
    "SELECT 
        COUNT(*) 
    FROM 
        assignments_marks
    WHERE student_id = ? AND subject_id = ?"; 

//Запит на вибірку відсотка відвіданих занять
pub static STUDENT_MEETING_ATTENDENCE_PERCENTAGE_QUERY: &str = 
    "SELECT 
        COUNT(*) 
    FROM 
        attended_meetings
    WHERE student_id = ? AND subject_id = ?"; 


//Запит на вибірку даних дисциплін за студентом
pub static STUDENT_CHOSEN_DISCIPLINES: &str = 
    "SELECT 
        sb.id,
        sb.name,
        sb.description,
        sb.semestr,
        CONCAT_WS (' ',u.firstname,u.secondname,u.lastname) AS teacher,
        t.occupation 
    FROM 
        subjects sb
    INNER JOIN 
        subjects_attendies sa ON sa.subject_id = sb.id   
    INNER JOIN
        teachers t ON t.email = sb.teacher_id
    INNER JOIN
        users u ON t.email = u.email
    WHERE sa.student_id = ?";

//Запит на вибірку даних викладача за дисципліною
pub static STUDENT_TEACHERS: &str = 
    "SELECT 
        u.firstname,
        u.secondname,
        u.lastname,
        t.occupation,
        sb.name AS subject_name 
    FROM 
        teachers t
    INNER JOIN 
        users u ON u.email = t.email
    INNER JOIN 
        subjects sb ON sb.teacher_id = t.email
    INNER JOIN
        subjects_attendies sa ON sa.subject_id = sb.id
    WHERE sa.student_id = ? AND sa.subject_id = ?";

//Запит на вибірку даних студента (себе)
pub static STUDENT_PERSONAL_DATA: &str = 
    "SELECT 
        u.email,
        u.firstname,
        u.secondname,
        u.lastname,
        st.group
    FROM 
        students st
    INNER JOIN 
        users u ON st.email=u.email
    WHERE u.email = ?";

//Вибрати дані всіх завдань за дисципліною з балами заробленими певним студентом
pub static STUDENT_TASKS: &str = 
    "SELECT 
        a.id,
        a.name,
        a.description,
        a.due_to,
        am.mark,
        a.max_point
    FROM 
        assignments a
    LEFT JOIN 
        assignments_marks am ON am.assignment_id = a.id
    WHERE am.student_id = ? AND am.subject_id = ?";

//Вибрати всі зайняття за дисципліною та записи їх відвідування певним студентом
pub static STUDENT_MEETINGS: &str = 
    "SELECT
        m.id,
        m.name,
        m.time,
        am.percentage AS attendance
    FROM
        meetings m
    LEFT JOIN 
        attended_meetings am ON am.meeting_id = m.id
    WHERE am.student_id = ? AND am.subject_id = ?";  



//------------------------------------------- TEACHER --------------------------------------------//


//Запит на вибірку даних предметів за викладачем
pub static TEACHER_TAUGHT_DISCIPLINES: &str = 
    "SELECT 
        sb.id,
        sb.name,
        sb.description,
        sb.semestr
    FROM 
        subjects sb
    WHERE sb.teacher_id = ?";

//Запит на вибірку даних викладача (себе)
pub static TEACHER_PERSONAL_DATA: &str = 
    "SELECT 
        u.email,
        u.firstname,
        u.secondname,
        u.lastname,
        t.occupation
    FROM 
        teachers t
    INNER JOIN 
        users u ON t.email=u.email
    WHERE u.email = ?";

//Запит на вибірку даних всіх студентів за дисципліною 
pub static TEACHER_STUDENTS_OF_DESCIPLINE: &str = 
    "SELECT
        u.firstname,
        u.secondname,
        u.lastname,
        s.group
    FROM 
        subjects_attendies sa
    INNER JOIN 
        students s ON s.email = sa.student_id
    INNER JOIN 
        users u ON s.email = u.email
    INNER JOIN 
        subjects sb ON sb.id = sa.subject_id 
    WHERE sb.teacher_id = ? AND sa.subject_id = ?";

//Вибрати дані всіх завдань за дисципліною 
pub static TEACHER_TASKS_PER_DESCIPLINE: &str = 
    "SELECT
        a.id,
        a.name,
        a.description,
        a.due_to,
        a.max_point
    FROM 
        assignments a
    INNER JOIN 
        subjects sb ON a.subject_id = sb.id
    WHERE sb.teacher_id = ? AND sb.id = ?";

//Вибрати дані з балами заробленими всіма студентами
pub static TEACHER_MARKS_PER_DESCIPLINE: &str = 
    "SELECT 
        u.firstname,
        u.secondname,
        u.lastname,
        a.name,
        am.mark
    FROM
        assignments_marks am
    RIGHT JOIN 
        assignments a ON a.id = am.assignment_id
    INNER JOIN 
        subjects sb ON sb.id = a.subject_id
    INNER JOIN
        subjects_attendies sa ON sa.student_id=am.student_id AND sa.subject_id=am.subject_id 
    INNER JOIN
        students s ON sa.student_id = s.email
    INNER JOIN 
        users u ON u.email = s.email
    WHERE sb.teacher_id = ? AND sb.id = ?";


//Вибрати всі зайняття за дисципліною 
pub static TEACHER_MEETINGS_PER_DESCIPLINE: &str = 
    "SELECT
        a.id,
        a.name,
        a.time
    FROM 
        meetings m a
    INNER JOIN 
        subjects sb ON m.subject_id = sb.id
    WHERE sb.teacher_id = ? AND sb.id = ?";

//Вибрати записи відвідування зайнять всіма студентами за дисципліною
pub static TEACHER_ATTENDANCE_PER_DESCIPLINE: &str = 
    "SELECT 
        u.firstname,
        u.secondname,
        u.lastname,
        m.name,
        am.percentage
    FROM
        attended_meetings am
    RIGHT JOIN 
        meetings m ON m.id = am.meeting_id
    INNER JOIN 
        subjects sb ON sb.id = m.subject_id
    INNER JOIN
        subjects_attendies sa ON sa.student_id=am.student_id AND sa.subject_id=am.subject_id 
    INNER JOIN
        students s ON sa.student_id = s.email
    INNER JOIN 
        users u ON u.email = s.email
    WHERE sb.teacher_id = ? AND sb.id = ?";


// Запит на вибірку максимального відсотка відвіданих занять усіх студентів дисципліни
// Запит на вибірку середнього відсотка відвіданих занять усіх студентів дисципліни
// Запит на вибірку мінімального відсотка відвіданих занять усіх студентів дисципліни
// Запит на вибірку максимального відсотка виконаних завдань усіх студентів дисципліни
// Запит на вибірку середнього відсотка виконаних завдань усіх студентів дисципліни
// Запит на вибірку мінімальний відсотка виконаних завдань усіх студентів дисципліни


// Створення запису про відвідування певного зайняття певним студентом
pub static TEACHER_ADD_ATTENDANCE: &str = 
    "INSERT INTO attended_meetings (meeting_id, student_id, subject_id, percentage)
    VALUES (?, ?, (SELECT id FROM subjects WHERE id = ? AND teacher_id = ?), ?)";

//Створення запису про оцінку певного студента за певним завданням
pub static TEACHER_ADD_MARK: &str = 
    "INSERT INTO assignments_marks (assignment_id, student_id, subject_id, mark)
    VALUES (?, ?, (SELECT id FROM subjects WHERE id = ? AND teacher_id = ?), ?)";

//Редагування запису про відвідування певного зайняття певним студентом
pub static TEACHER_UPDATE_ATTENDANCE: &str =
    "UPDATE attended_meetings
    SET percentage = ?
    WHERE meeting_id = ?
    AND student_id = ?
    AND subject_id = (SELECT id FROM subjects WHERE id = ? AND teacher_id = ?)";

//Редагування запису про оцінку певного студента за певним завданням
pub static TEACHER_UPDATE_MARK: &str = 
    "UPDATE assignments_marks
    SET mark = ?
    WHERE assignment_id = ?
    AND student_id = ?
    AND subject_id = (SELECT id FROM subjects WHERE id = ? AND teacher_id = ?)";

//Видалення запису про відвідування певного зайняття певним студентом
pub static TEACHER_DELETE_ATTENDANCE: &str =
    "DELETE FROM attended_meetings
    WHERE meeting_id = ?
    AND student_id = ?
    AND subject_id = (SELECT id FROM subjects WHERE id = ? AND teacher_id = ?)";
//Видалення запису про оцінку певного студента за певним завданням
pub static TEACHER_DELETE_MARK: &str = 
    "DELETE FROM assignments_marks
    WHERE assignment_id = ?
    AND student_id = ?
    AND subject_id = (SELECT id FROM subjects WHERE id = ? AND teacher_id = ?)";

//------------------------------------------- ADMIN --------------------------------------------//

//Запит на вибірку даних всіх викладачів
pub static ADMIN_TEACHERS_DATA: &str = 
    "SELECT 
        u.email,
        u.firstname,
        u.secondname,
        u.lastname,
        t.occupation
    FROM 
        teachers t
    INNER JOIN 
        users u ON t.email=u.email";


//Запит на вибірку даних всіх студентів (students)
pub static ADMIN_STUDENTS_DATA: &str = 
    "SELECT
        u.firstname,
        u.secondname,
        u.lastname,
        s.group
    FROM 
        students s
    INNER JOIN 
        users u ON s.email = u.email";

//Запит на вибірку даних всіх студентів (students-attendies)
pub static ADMIN_SUBJECTS_ATTENDIES_DATA: &str = 
    "SELECT
        CONCAT_WS (' ',u.firstname, u.secondname, u.lastname) as student_fullname,
        s.group
    FROM 
        subjects_attendies sa
    LEFT JOIN 
        students s ON s.email = sa.student_id     
    LEFT JOIN 
        subjects sb ON sb.id = sa.subject_id         
    INNER JOIN 
        users u ON s.email = u.email";


//Запит на вибірку даних всіх предметів
pub static ADMIN_SUBJECTS: &str =
    "SELECT 
        sb.id,
        sb.name,
        sb.description,
        sb.semestr,
        CONCAT_WS (' ',u.firstname,u.secondname,u.lastname) AS teacher,
        t.occupation 
    FROM 
        subjects sb
    INNER JOIN
        teachers t ON t.email = sb.teacher_id
    INNER JOIN
        users u ON t.email = u.email";
//Вибрати дані всіх завдань за всіма дисциплінами
pub static ADMIN_TASKS: &str =
    "SELECT
        a.id,
        a.name,
        sb.name as subject_name,
        
        a.description,
        a.due_to,
        a.max_point
    FROM 
        assignments a
    INNER JOIN 
        subjects sb ON a.subject_id = sb.id";

//Вибрати дані з балами заробленими всіма студентами
pub static ADMIN_MARKS: &str =
    "SELECT 
        u.firstname,
        u.secondname,
        u.lastname,
        sb.name as subject_name,
        a.name as assignment_name,
        am.mark,
        a.max_point 
    FROM
        assignments_marks am
    RIGHT JOIN 
        assignments a ON a.id = am.assignment_id
    INNER JOIN 
        subjects sb ON sb.id = a.subject_id
    INNER JOIN
        subjects_attendies sa ON sa.student_id=am.student_id AND sa.subject_id=am.subject_id 
    INNER JOIN
        students s ON sa.student_id = s.email
    INNER JOIN 
        users u ON u.email = s.email";

//Вибрати всі зайняття за всіма дисциплінами 
pub static ADMIN_MEETINGS: &str =
    "SELECT
        m.id,
        m.name,
        sb.name AS subject_name,
        m.time
    FROM
        meetings m
    INNER JOIN 
        subjects sb ON m.subject_id = sb.id"; 
//Вибрати всі записи їх відвідування занять всіма студентами
pub static ADMIN_ATTENDANCE: &str =
    "SELECT 
        u.firstname,
        u.secondname,
        u.lastname,
        sb.name as subject_name,
        m.name as meeting_name,
        am.percentage
    FROM
        attended_meetings am
    RIGHT JOIN 
        meetings m ON m.id = am.meeting_id
    INNER JOIN 
        subjects sb ON sb.id = m.subject_id
    INNER JOIN
        subjects_attendies sa ON sa.student_id=am.student_id AND sa.subject_id=am.subject_id 
    INNER JOIN
        students s ON sa.student_id = s.email
    INNER JOIN 
        users u ON u.email = s.email";



// Створення запису про відвідування певного зайняття певним студентом
pub static ADMIN_ADD_ATTENDANCE: &str = 
    "INSERT INTO attended_meetings (meeting_id, student_id, subject_id, percentage)
    VALUES (?, ?, ?, ?)";

//Створення запису про оцінку певного студента за певним завданням
pub static ADMIN_ADD_MARK: &str = 
    "INSERT INTO assignments_marks (assignment_id, student_id, subject_id, mark)
    VALUES (?, ?, ?, ?)";

//Редагування запису про відвідування певного зайняття певним студентом
pub static ADMIN_UPDATE_ATTENDANCE: &str =
    "UPDATE attended_meetings
    SET percentage = ?
    WHERE meeting_id = ?
    AND student_id = ?
    AND subject_id = ?";

//Редагування запису про оцінку певного студента за певним завданням
pub static ADMIN_UPDATE_MARK: &str = 
    "UPDATE assignments_marks
    SET mark = ?
    WHERE assignment_id = ?
    AND student_id = ?
    AND subject_id = ?";

//Видалення запису про відвідування певного зайняття певним студентом
pub static ADMIN_DELETE_ATTENDANCE: &str =
    "DELETE FROM attended_meetings
    WHERE meeting_id = ?
    AND student_id = ?
    AND subject_id = ?";
//Видалення запису про оцінку певного студента за певним завданням
pub static ADMIN_DELETE_MARK: &str = 
    "DELETE FROM assignments_marks
    WHERE assignment_id = ?
    AND student_id = ?
    AND subject_id = ?";




//  Додавання дисциплін
pub static ADMIN_ADD_SUBJECT: &str = 
    "INSERT INTO subjects (name, description, semestr, teacher_id)
    VALUES (?, ?, ?, ?)";

// 5.2а Додавання даних студентів
pub static ADMIN_ADD_STUDENT: &str = 
    "";

// 5.2б Додавання даних студентів (Записи на предмети)
pub static ADMIN_ADD_SUBJECT_ATTENDIE: &str = 
    "INSERT INTO subjects_attendies (student_id, subject_id)
    VALUES (?, ?)";

// 5.3 Додавання даних викладачів
pub static ADMIN_ADD_TEACHER: &str = 
    "";

// 5.4 Додавання занять по дисциплінам
pub static ADMIN_ADD_MEETING: &str = 
    "INSERT INTO meetings (subject_id, name, time)
    VALUES (?, ?, ?)";

// 5.5 Додавання завдань по дисциплінам
pub static ADMIN_ADD_TASK: &str = 
    "INSERT INTO assignments (subject_id, name, description, due_to, max_point)
    VALUES (?, ?, ?, ?, ?)";



//Редагування дисциплін
pub static ADMIN_UPDATE_SUBJECT: &str = "";

//Редагування даних студентів
pub static ADMIN_UPDATE_STUDENT: &str = "";

//Редагування даних студентів (Записи на предмети)
pub static ADMIN_UPDATE_SUBJECT_ATTENDIE: &str = "";

//Редагування даних викладачів
pub static ADMIN_UPDATE_TEACHER: &str = "";

//Редагування занять по дисциплінам
pub static ADMIN_UPDATE_MEETING: &str = "";

//Редагування завдань по дисциплінам
pub static ADMIN_UPDATE_TASK: &str = "";



// 5.11 Видалення дисциплін
pub static ADMIN_DELETE_SUBJECT: &str = "";

// 5.12 Видалення даних студентів
pub static ADMIN_DELETE_STUDENT: &str = "";

// 5.12 Видалення даних студентів (Записи на предмети)
pub static ADMIN_DELETE_SUBJECT_ATTENDIE: &str = "";

// 5.13 Видалення даних викладачів
pub static ADMIN_DELETE_TEACHER: &str = "";

// 5.14 Видалення занять по дисциплінам
pub static ADMIN_DELETE_MEETING: &str = "";

// 5.15 Видалення завдань по дисциплінам
pub static ADMIN_DELETE_TASK: &str = "";
