const server = 'localhost:8080';




async function fetch_subjects(selectedSubject,tablesData) {
    var headers = {
        // 'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var options = {
        method: 'GET',
        headers: headers,
    };

    try {
        const response = await fetch(`http://${server}/api/teacher/subjects`, options);
        const data = await response.json();

        tablesData.subjects = data;
        //fetching data to dropdown
        const subjectsList = document.getElementById("subjectsListId");

        let newItemHTML = '';
        data.forEach(element => {
            newItemHTML += `<li class="dropdown-item d-flex align-items-center gap-2 py-2" value="${element['id']}">${element['name']}</li>`
        });

        let tempContainer = document.createElement('div');

        tempContainer.innerHTML = newItemHTML;

        subjectsList.replaceChildren(...tempContainer.childNodes);


        //set default selection

        selectedSubject['id'] = subjectsList.childNodes[0].value;
        selectedSubject['name'] = subjectsList.childNodes[0].textContent;
        
        var button = document.getElementById("subjectsSelectButton");

        button.childNodes[0].remove();

        button.value = selectedSubject["id"];
        button.textContent = selectedSubject["name"];


    } catch (error) {
        console.log(error);
    }
}

async function fetch_students(selectedSubject,tablesData) {
    var headers = {
        // 'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var options = {
        method: 'GET',
        headers: headers,
    };

    try {
        const response = await fetch(`http://${server}/api/teacher/students?subject_id=${selectedSubject["id"]}`, options);
        const data = await response.json();
        tablesData.students = data;
        

        let studentsTable = document.getElementById("studentsTable");

        //fetching data to dropdown

        let newItemHTML = '';
        data.forEach(element => {
            newItemHTML += `<tr><td>${element["lastname"]}</td><td>${element["secondname"]}</td><td>${element["firstname"]}</td><td>${element["group"]}</td></tr>`
        });

        let tempContainer = document.createElement('tbody');

        tempContainer.innerHTML = newItemHTML;

        studentsTable.replaceChildren(...tempContainer.childNodes);

    } catch (error) {
        console.log(error);
    }
}

async function fetch_meetings(selectedSubject,tablesData) {
    var headers = {
        // 'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var options = {
        method: 'GET',
        headers: headers,
    };

    try {
        const response = await fetch(`http://${server}/api/teacher/meetings?subject_id=${selectedSubject["id"]}`, options);
        const data = await response.json();
        
        tablesData.meetings = data;
        
        let meetingsTable = document.getElementById("meetingsTable");

        //fetching data to dropdown

        let newItemHTML = '';
        data.forEach(element => {
            newItemHTML += `<tr><td>${element["id"]}</td><td>${element["name"]}</td><td>${element["time"]}</td></tr>`
        });

        let tempContainer = document.createElement('tbody');

        tempContainer.innerHTML = newItemHTML;

        meetingsTable.replaceChildren(...tempContainer.childNodes);

    } catch (error) {
        console.log(error);
    }
}
async function fetch_tasks(selectedSubject,tablesData) {
    var headers = {
        // 'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var options = {
        method: 'GET',
        headers: headers,
    };

    try {
        const response = await fetch(`http://${server}/api/teacher/tasks?subject_id=${selectedSubject["id"]}`, options);
        const data = await response.json();
        
        tablesData.tasks = data;
        
        let tasksTable = document.getElementById("tasksTable");

        //fetching data to dropdown

        let newItemHTML = '';
        data.forEach(element => {
            newItemHTML += `<tr><td>${element["id"]}</td><td>${element["name"]}</td><td>${element["description"]}</td><td>${element["due_to"]}</td><td>${element["max_point"]}</td></tr>`
        });

        let tempContainer = document.createElement('tbody');

        tempContainer.innerHTML = newItemHTML;

        tasksTable.replaceChildren(...tempContainer.childNodes);

    } catch (error) {
        console.log(error);
    }
}
async function fetch_attendance(selectedSubject,tablesData) {
    var headers = {
        // 'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var options = {
        method: 'GET',
        headers: headers,
    };

    try {
        const response = await fetch(`http://${server}/api/teacher/attendance?subject_id=${selectedSubject["id"]}`, options);
        const data = await response.json();
        
        tablesData.attendance = data;
        
        let attendanceTable = document.getElementById("attendanceTable");

        //fetching data to dropdown

        let newItemHTML = '';
        data.forEach(element => {
            newItemHTML += `<tr>
                                <td>${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</td>
                                <td>${element["name"]}</td>
                                <td>${element["percentage"]}</td>
                            </tr>`; 
        });

        let tempContainer = document.createElement('tbody');

        tempContainer.innerHTML = newItemHTML;

        attendanceTable.replaceChildren(...tempContainer.childNodes);

    } catch (error) {
        console.log(error);
    }
}
async function fetch_marks(selectedSubject,tablesData) {
    var headers = {
        // 'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var options = {
        method: 'GET',
        headers: headers,
    };

    try {
        const response = await fetch(`http://${server}/api/teacher/marks?subject_id=${selectedSubject["id"]}`, options);
        const data = await response.json();
        
        tablesData.marks = data;


        let marksTable = document.getElementById("marksTable");

        //fetching data to dropdown

        let newItemHTML = '';
        data.forEach(element => {
            newItemHTML += `<tr>
                                <td>${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</td>
                                <td>${element["name"]}</td>
                                <td>${element["mark"]}</td>
                            </tr>`; 
        });

        let tempContainer = document.createElement('tbody');

        tempContainer.innerHTML = newItemHTML;

        marksTable.replaceChildren(...tempContainer.childNodes);

    } catch (error) {
        console.log(error);
    }
}


document.addEventListener('DOMContentLoaded',async function () {
    // Your JavaScript code here

    var selectedSubject = {
        "id": {},
        "name": {},
    };
    
    var tablesData = {
        subjects: {},
        students: {},
        meetings: {},
        attendance: {},
        tasks: {},
        marks: {},
    };

    await fetch_subjects(selectedSubject,tablesData);
    await fetch_students(selectedSubject,tablesData);
    await fetch_meetings(selectedSubject,tablesData);
    await fetch_tasks(selectedSubject,tablesData);
    await fetch_attendance(selectedSubject,tablesData);
    await fetch_marks(selectedSubject,tablesData);

    // await fetch_attendance(selectedSubject);
    // await fetch_marks(selectedSubject);

    document.getElementById("subjectsListId").addEventListener("click", async function (event) {

        selectedSubject['id'] = this.childNodes[0].value;
        selectedSubject['name'] = this.childNodes[0].textContent;

        var button = document.getElementById("subjectsSelectButton");

        button.value = selectedSubject["id"];
        button.textContent = selectedSubject["name"];

        await fetch_subjects(selectedSubject,tablesData);
        await fetch_students(selectedSubject,tablesData);
        await fetch_meetings(selectedSubject,tablesData);
        await fetch_tasks(selectedSubject,tablesData);
        await fetch_attendance(selectedSubject,tablesData);
        await fetch_marks(selectedSubject,tablesData);

        // await fetch_attendance(selectedSubject);
        // await fetch_marks(selectedSubject);

    });

    document.getElementById("logoutButtonId").addEventListener("click", async function (event) {
        window.sessionStorage.removeItem('authorization');
        window.location.href = "login.html";
    });

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' 
                && mutation.attributeName === 'class' 
                && mutation.target.className.includes('active') 
                && mutation.target.className.includes('show')
            ){
                if (mutation.target.id.includes('attendance')){
                    let createForm = document.getElementById("createFormId") 
                    let editForm = document.getElementById("editFormId")
                    let deleteForm = document.getElementById("deleteFormId")

                    document.getElementById("tableButtonsId").classList.remove("visually-hidden");
                    createAttendanceCreateForm(createForm,tablesData.students,tablesData.meetings);

                    editAttendanceCreateForm(editForm,tablesData.students,tablesData.meetings);

                    deleteAttendanceCreateForm(deleteForm,tablesData.students,tablesData.meetings);

                    createForm.removeEventListener("submit",createAttendanceFormEventListener);                   
                    createForm.addEventListener("submit",async function(event){
                        createAttendanceFormEventListener(event,selectedSubject["id"]);
                        await fetch_subjects(selectedSubject,tablesData);
                        await fetch_students(selectedSubject,tablesData);
                        await fetch_meetings(selectedSubject,tablesData);
                        await fetch_tasks(selectedSubject,tablesData);
                        await fetch_attendance(selectedSubject,tablesData);
                        await fetch_marks(selectedSubject,tablesData);
                    });
                    
                    editForm.removeEventListener("submit", editAttendanceFormEventListener);                   
                    editForm.addEventListener("submit", async function(event){
                        editAttendanceFormEventListener(event,selectedSubject["id"]);
                        await fetch_subjects(selectedSubject,tablesData);
                        await fetch_students(selectedSubject,tablesData);
                        await fetch_meetings(selectedSubject,tablesData);
                        await fetch_tasks(selectedSubject,tablesData);
                        await fetch_attendance(selectedSubject,tablesData);
                        await fetch_marks(selectedSubject,tablesData);
                    });

                    deleteForm.removeEventListener("submit", deleteAttendanceFormEventListener);                   
                    deleteForm.addEventListener("submit", async function(event){
                        deleteAttendanceFormEventListener(event,selectedSubject["id"]);
                        await fetch_subjects(selectedSubject,tablesData);
                        await fetch_students(selectedSubject,tablesData);
                        await fetch_meetings(selectedSubject,tablesData);
                        await fetch_tasks(selectedSubject,tablesData);
                        await fetch_attendance(selectedSubject,tablesData);
                        await fetch_marks(selectedSubject,tablesData);
                    });

                } else if (mutation.target.id.includes('marks')){
                    let createForm = document.getElementById("createFormId") 
                    let editForm = document.getElementById("editFormId")
                    let deleteForm = document.getElementById("deleteFormId")
                    
                    document.getElementById("tableButtonsId").classList.remove("visually-hidden");
                    createMarksCreateForm(createForm,tablesData.students,tablesData.tasks);

                    editMarksCreateForm(editForm,tablesData.students,tablesData.tasks);
                    
                    deleteMarksCreateForm(deleteForm,tablesData.students,tablesData.tasks);


                    createForm.removeEventListener("submit",createMarksFormEventListener);                   
                    createForm.addEventListener("submit", async function(event){
                        createMarksFormEventListener(event,selectedSubject["id"]);
                        await fetch_subjects(selectedSubject,tablesData);
                        await fetch_students(selectedSubject,tablesData);
                        await fetch_meetings(selectedSubject,tablesData);
                        await fetch_tasks(selectedSubject,tablesData);
                        await fetch_attendance(selectedSubject,tablesData);
                        await fetch_marks(selectedSubject,tablesData);
                    });
                    
                    editForm.removeEventListener("submit",editMarksFormEventListener);                   
                    editForm.addEventListener("submit", async function(event){
                        editMarksFormEventListener(event,selectedSubject["id"]);
                        await fetch_subjects(selectedSubject,tablesData);
                        await fetch_students(selectedSubject,tablesData);
                        await fetch_meetings(selectedSubject,tablesData);
                        await fetch_tasks(selectedSubject,tablesData);
                        await fetch_attendance(selectedSubject,tablesData);
                        await fetch_marks(selectedSubject,tablesData);
                    });


                    deleteForm.removeEventListener("submit",deleteMarksFormEventListener);                   
                    deleteForm.addEventListener("submit", async function(event){
                        deleteMarksFormEventListener(event,selectedSubject["id"]);
                        await fetch_subjects(selectedSubject,tablesData);
                        await fetch_students(selectedSubject,tablesData);
                        await fetch_meetings(selectedSubject,tablesData);
                        await fetch_tasks(selectedSubject,tablesData);
                        await fetch_attendance(selectedSubject,tablesData);
                        await fetch_marks(selectedSubject,tablesData);
                    });
                }else if (mutation.target.id.includes('tasks')){
                    let createForm = document.getElementById("createFormId") 
                    let editForm = document.getElementById("editFormId")
                    let deleteForm = document.getElementById("deleteFormId")
                    
                    document.getElementById("tableButtonsId").classList.remove("visually-hidden");
                    createTasksCreateForm(createForm);
                    
                    editTasksCreateForm(editForm,tablesData.tasks);

                    deleteTasksCreateForm(deleteForm,tablesData.tasks);

                    createForm.removeEventListener("submit",createTasksFormEventListener);                   
                    createForm.addEventListener("submit", async function(event){
                        createTasksFormEventListener(event,selectedSubject["id"]);
                        await fetch_subjects(selectedSubject,tablesData);
                        await fetch_students(selectedSubject,tablesData);
                        await fetch_meetings(selectedSubject,tablesData);
                        await fetch_tasks(selectedSubject,tablesData);
                        await fetch_attendance(selectedSubject,tablesData);
                        await fetch_marks(selectedSubject,tablesData);
                    });

                    editForm.removeEventListener("submit",editTasksFormEventListener);                   
                    editForm.addEventListener("submit", async function(event){
                        editTasksFormEventListener(event,selectedSubject["id"]);
                        await fetch_subjects(selectedSubject,tablesData);
                        await fetch_students(selectedSubject,tablesData);
                        await fetch_meetings(selectedSubject,tablesData);
                        await fetch_tasks(selectedSubject,tablesData);
                        await fetch_attendance(selectedSubject,tablesData);
                        await fetch_marks(selectedSubject,tablesData);
                    });
                    
                    deleteForm.removeEventListener("submit",deleteTasksFormEventListener);                   
                    deleteForm.addEventListener("submit", async function(event){
                        deleteTasksFormEventListener(event,selectedSubject["id"]);
                        await fetch_subjects(selectedSubject,tablesData);
                        await fetch_students(selectedSubject,tablesData);
                        await fetch_meetings(selectedSubject,tablesData);
                        await fetch_tasks(selectedSubject,tablesData);
                        await fetch_attendance(selectedSubject,tablesData);
                        await fetch_marks(selectedSubject,tablesData);
                    });
                } else {
                    document.getElementById("tableButtonsId").classList.add("visually-hidden");

                }

            }
        });
    });

    observer.observe(document.getElementById("pills-tabContent"),{ attributes: true, subtree: true, attributeFilter: ['class'] });
    
});

async function createAttendanceFormEventListener(event,subjectId) {
    event.preventDefault();      

    var studentId = document.getElementById("studentFullnameCreate").value; 
    var meetingId = parseInt(document.getElementById("studentMeetingCreate").value);
    var percentage = parseFloat(document.getElementById("studentAttendanceCreate").value);

    var headers = {
        'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var payload = JSON.stringify({
        "meeting_id": meetingId,
        "student_id": studentId,
        "subject_id": subjectId,
        "percentage": percentage,
    });
    var options = {
        method: 'POST',
        headers: headers,
        body: payload
    };
    
    const response = await fetch(`http://${server}/api/teacher/attendance`, options);
    if (!response.ok){
        alert(`Error occured`)
    }
}
async function createTasksFormEventListener(event,subjectId) {
    event.preventDefault();      
    
    var name = document.getElementById("taskNameCreate").value; 
    var maxPoint = parseFloat(document.getElementById("taskMaxPointCreate").value);
    var description = document.getElementById("taskDescriptionCreate").value;
    var dueTo = document.getElementById("taskDeadlineCreate").value;

    var headers = {
        'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var payload = JSON.stringify({
        "subject_id": subjectId,
        "name": name,
        "description": description,
        "due_to": dueTo,
        "max_point": maxPoint,
    });
    var options = {
        method: 'POST',
        headers: headers,
        body: payload
    };
    
    const response = await fetch(`http://${server}/api/teacher/tasks`, options);
    if (!response.ok){
        alert(`Error occured`)
    }
}
async function createMarksFormEventListener(event,subjectId) {
    event.preventDefault();      

    var studentId = document.getElementById("studentFullnameCreate").value; 
    var taskId = parseInt(document.getElementById("studentTaskCreate").value);
    var mark = parseFloat(document.getElementById("studentMarkCreate").value);

    var headers = {
        'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var payload = JSON.stringify({
        "assignment_id": taskId,
        "student_id": studentId,
        "subject_id": subjectId,
        "mark": mark,
    });
    var options = {
        method: 'POST',
        headers: headers,
        body: payload
    };
    
    const response = await fetch(`http://${server}/api/teacher/marks`, options);
    if (!response.ok){
        alert(`Error occured`)
    }
}







async function editAttendanceFormEventListener(event,subjectId) {
    event.preventDefault();      

    var studentId = document.getElementById("studentFullnameEdit").value; 
    var meetingId = parseInt(document.getElementById("studentMeetingEdit").value);
    var percentage = parseFloat(document.getElementById("studentAttendanceEdit").value);

    var headers = {
        'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var payload = JSON.stringify({
        "meeting_id": meetingId,
        "student_id": studentId,
        "subject_id": subjectId,
        "percentage": percentage,
    });
    var options = {
        method: 'PUT',
        headers: headers,
        body: payload
    };
    
    const response = await fetch(`http://${server}/api/teacher/attendance`, options);
    if (!response.ok){
        alert(`Error occured`)
    }
}


async function editTasksFormEventListener(event,subjectId) {
    event.preventDefault();      

    var id = parseInt(document.getElementById("taskIdEdit").value); 
    var name = document.getElementById("taskNameEdit").value; 
    var maxPoint = parseFloat(document.getElementById("taskMaxPointEdit").value);
    var description = document.getElementById("taskDescriptionEdit").value;
    var dueTo = document.getElementById("taskDeadlineEdit").value;

    var headers = {
        'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var payload = JSON.stringify({
        "id":id,
        "subject_id": subjectId,
        "name": name,
        "description": description,
        "due_to": dueTo,
        "max_point": maxPoint,
    });
    var options = {
        method: 'PUT',
        headers: headers,
        body: payload
    };
    
    const response = await fetch(`http://${server}/api/teacher/tasks`, options);
    if (!response.ok){
        alert(`Error occured`)
    }
}

async function editMarksFormEventListener(event,subjectId) {
    event.preventDefault();      
    var studentId = document.getElementById("studentFullnameEdit").value; 
    var taskId = parseInt(document.getElementById("studentTaskEdit").value);
    var mark = parseFloat(document.getElementById("studentMarkEdit").value);

    var headers = {
        'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var payload = JSON.stringify({
        "assignment_id": taskId,
        "student_id": studentId,
        "subject_id": subjectId,
        "mark": mark,
    });
    var options = {
        method: 'PUT',
        headers: headers,
        body: payload
    };
    
    const response = await fetch(`http://${server}/api/teacher/marks`, options);
    if (!response.ok){
        alert(`Error occured`)
    }
}

async function deleteAttendanceFormEventListener(event,subjectId) {
    event.preventDefault();      

    var studentId = document.getElementById("studentFullnameDelete").value; 
    var meetingId = parseInt(document.getElementById("studentMeetingDelete").value);

    var headers = {
        'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var payload = JSON.stringify({
        "meeting_id": meetingId,
        "student_id": studentId,
        "subject_id": subjectId,
    });
    var options = {
        method: 'DELETE',
        headers: headers,
        body: payload
    };
    
    const response = await fetch(`http://${server}/api/teacher/attendance`, options);
    if (!response.ok){
        alert(`Error occured`)
    }
}


async function deleteTasksFormEventListener(event,subjectId) {
    event.preventDefault();      

    var id = parseInt(document.getElementById("taskIdDelete").value); 

    var headers = {
        'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var payload = JSON.stringify({
        "id":id,
    });
    var options = {
        method: 'DELETE',
        headers: headers,
        body: payload
    };
    
    const response = await fetch(`http://${server}/api/teacher/tasks`, options);
    if (!response.ok){
        alert(`Error occured`)
    }
}

async function deleteMarksFormEventListener(event,subjectId) {
    event.preventDefault();      
    var studentId = document.getElementById("studentFullnameDelete").value; 
    var taskId = parseInt(document.getElementById("studentTaskDelete").value);

    var headers = {
        'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var payload = JSON.stringify({
        "assignment_id": taskId,
        "student_id": studentId,
        "subject_id": subjectId,
    });
    var options = {
        method: 'DELETE',
        headers: headers,
        body: payload
    };
    
    const response = await fetch(`http://${server}/api/teacher/marks`, options);
    if (!response.ok){
        alert(`Error occured`)
    }
}



function createAttendanceCreateForm(form,students,meetings){
    var title = document.getElementById("createModalLabel");

    let newItemHTML = 
    `<div class="modal-body">
        <div class="mb-3">
            <label for="studentFullnameCreate" class="form-label">ПІБ Студента</label>
                <select class="form-select" aria-label="Default select example" id="studentFullnameCreate">`;
    students.forEach(element => {
        newItemHTML+=`<option value="${element["email"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</option>`
    });
    newItemHTML += `</select></div>
        <div class="mb-3">
            <label for="studentMeetingCreate" class="form-label">Зайняття</label>
            <select class="form-select" aria-label="Default select example" id="studentMeetingCreate">`;
    meetings.forEach(element => {
        newItemHTML+=`<option value="${element["id"]}">${element["name"]}</option>`
    });
    
    newItemHTML += `</select></div>
        <div class="mb-3">
            <label for="studentAttendanceCreate" class="form-label">Відсоток присутності</label>
            <input type="text" class="form-control" id="studentAttendanceCreate">
        </div>
    </div>
    <div class="modal-footer"><button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Створити</button></div>`;
    
    let tempContainer = document.createElement('div');

    tempContainer.innerHTML = newItemHTML;

    form.replaceChildren(...tempContainer.childNodes);

    title.textContent='Створити запис';
}

function createMarksCreateForm(form,students,tasks){
    var title = document.getElementById("createModalLabel");

    let newItemHTML = `<div class="modal-body">
        <div class="mb-3">
            <label for="studentFullnameCreate" class="form-label">ПІБ Студента</label>
            <select class="form-select" aria-label="Default select example" id="studentFullnameCreate">`;
    students.forEach(element => {
        newItemHTML+=`<option value="${element["email"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</option>`
    });
    newItemHTML += `</select></div>
        <div class="mb-3">
            <label for="studentTaskCreate" class="form-label">Завдання</label>
            <select class="form-select" aria-label="Default select example" id="studentTaskCreate">`;
    tasks.forEach(element => {
        newItemHTML+=`<option value="${element["id"]}">${element["name"]}</option>`;
    });
    newItemHTML += `</select></div>
        <div class="mb-3">
            <label for="studentMarkCreate" class="form-label">Балл</label>
            <input type="text" class="form-control" id="studentMarkCreate"></div>            
        </div>
        <div class="modal-footer">
        <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Створити</button>
    </div>`;
    let tempContainer = document.createElement('div');

    tempContainer.innerHTML = newItemHTML;

    form.replaceChildren(...tempContainer.childNodes);

    title.textContent='Створити запис';
}
function createTasksCreateForm(form){
    var title = document.getElementById("createModalLabel");

    let newItemHTML = `<div class="modal-body">
        <div class="mb-3">
            <label for="taskNameCreate" class="form-label">Назва</label>
            <input type="text" class="form-control" id="taskNameCreate">
        </div>
        <div class="mb-3">
            <label for="taskDescriptionCreate" class="form-label">Опис</label>
            <input type="text" class="form-control" id="taskDescriptionCreate"> 
        </div>
        <div class="mb-3">
            <label for="taskDeadlineCreate" class="form-label">Дата та час</label>
            <input type="text" class="form-control" id="taskDeadlineCreate"></div>            
        </div>
        <div class="mb-3">
            <label for="taskMaxPointCreate" class="form-label">Максимальний балл</label>
            <input type="text" class="form-control" id="taskMaxPointCreate"></div>            
        </div>
        <div class="modal-footer">
        <button type="submit" class="btn btn-primary">Створити</button>
    </div>`;
    let tempContainer = document.createElement('div');

    tempContainer.innerHTML = newItemHTML;

    form.replaceChildren(...tempContainer.childNodes);

    title.textContent='Створити запис';
}


function editAttendanceCreateForm(form,students,meetings){
    var title = document.getElementById("editModalLabel");

    let newItemHTML = 
    `<div class="modal-body">
        <div class="mb-3">
            <label for="studentFullnameEdit" class="form-label">ПІБ Студента</label>
                <select class="form-select" aria-label="Default select example" id="studentFullnameEdit">`;
    students.forEach(element => {
        newItemHTML+=`<option value="${element["email"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</option>`
    });
    newItemHTML += `</select></div>
        <div class="mb-3">
            <label for="studentMeetingEdit" class="form-label">Зайняття</label>
            <select class="form-select" aria-label="Default select example" id="studentMeetingEdit">`;
    meetings.forEach(element => {
        newItemHTML+=`<option value="${element["id"]}">${element["name"]}</option>`
    });
    
    newItemHTML += `</select></div>
        <div class="mb-3">
            <label for="studentAttendanceEdit" class="form-label">Відсоток присутності</label>
            <input type="text" class="form-control" id="studentAttendanceEdit">
        </div>
    </div>
    <div class="modal-footer"><button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Редагувати</button></div>`;
    
    let tempContainer = document.createElement('div');

    tempContainer.innerHTML = newItemHTML;

    form.replaceChildren(...tempContainer.childNodes);

    title.textContent='Редагувати запис';
}

function editMarksCreateForm(form,students,tasks){
    var title = document.getElementById("editModalLabel");

    let newItemHTML = `<div class="modal-body">
        <div class="mb-3">
            <label for="studentFullnameEdit" class="form-label">ПІБ Студента</label>
            <select class="form-select" aria-label="Default select example" id="studentFullnameEdit">`;
    students.forEach(element => {
        newItemHTML+=`<option value="${element["email"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</option>`
    });
    newItemHTML += `</select></div>
        <div class="mb-3">
            <label for="studentTaskEdit" class="form-label">Завдання</label>
            <select class="form-select" aria-label="Default select example" id="studentTaskEdit">`;
    tasks.forEach(element => {
        newItemHTML+=`<option value="${element["id"]}">${element["name"]}</option>`;
    });
    newItemHTML += `</select></div>
        <div class="mb-3">
            <label for="studentMarkEdit" class="form-label">Балл</label>
            <input type="text" class="form-control" id="studentMarkEdit"></div>            
        </div>
        <div class="modal-footer">
        <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Редагувати</button>
    </div>`;
    let tempContainer = document.createElement('div');

    tempContainer.innerHTML = newItemHTML;

    form.replaceChildren(...tempContainer.childNodes);

    title.textContent='Редагувати запис';
}
function editTasksCreateForm(form,tasks){
    var title = document.getElementById("editModalLabel");

    let newItemHTML = `<div class="modal-body"><div class="mb-3">
    <label for="taskIdEdit" class="form-label">Завдання</label>
    <select class="form-select" aria-label="Default select example" id="taskIdEdit">`
    tasks.forEach(element => {
        newItemHTML+=`<option value="${element["id"]}">${element["name"]}</option>`;
    });

    newItemHTML += `</select></div><div class="mb-3">
            <label for="taskNameEdit" class="form-label">Назва</label>
            <input type="text" class="form-control" id="taskNameEdit">
        </div>
        <div class="mb-3">
            <label for="taskDescriptionEdit" class="form-label">Опис</label>
            <input type="text" class="form-control" id="taskDescriptionEdit"> 
        </div>
        <div class="mb-3">
            <label for="taskDeadlineEdit" class="form-label">Дата та час</label>
            <input type="text" class="form-control" id="taskDeadlineEdit"></div>            
        </div>
        <div class="mb-3">
            <label for="taskMaxPointEdit" class="form-label">Максимальний балл</label>
            <input type="text" class="form-control" id="taskMaxPointEdit"></div>            
        </div>
        <div class="modal-footer">
        <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Створити</button>
        </div>
    </div>`;
    let tempContainer = document.createElement('div');

    tempContainer.innerHTML = newItemHTML;

    form.replaceChildren(...tempContainer.childNodes);

    title.textContent='Редагувати запис';
}



function deleteAttendanceCreateForm(form,students,meetings){
    let newItemHTML = 
    `<div class="modal-body">
        <div class="mb-3">
            <label for="studentFullnameDelete" class="form-label">ПІБ Студента</label>
                <select class="form-select" aria-label="Default select example" id="studentFullnameDelete">`;
    students.forEach(element => {
        newItemHTML+=`<option value="${element["email"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</option>`
    });
    newItemHTML += `</select></div>
        <div class="mb-3">
            <label for="studentMeetingDelete" class="form-label">Зайняття</label>
            <select class="form-select" aria-label="Default select example" id="studentMeetingDelete">`;
    meetings.forEach(element => {
        newItemHTML+=`<option value="${element["id"]}">${element["name"]}</option>`
    });
    
    newItemHTML += `</select></div>
    </div>
    <div class="modal-footer"><button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Видалити</button></div>`;
    
    let tempContainer = document.createElement('div');

    tempContainer.innerHTML = newItemHTML;

    form.replaceChildren(...tempContainer.childNodes);
}

function deleteMarksCreateForm(form,students,tasks){

    let newItemHTML = `<div class="modal-body">
        <div class="mb-3">
            <label for="studentFullnameDelete" class="form-label">ПІБ Студента</label>
            <select class="form-select" aria-label="Default select example" id="studentFullnameDelete">`;
    students.forEach(element => {
        newItemHTML+=`<option value="${element["email"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</option>`
    });
    newItemHTML += `</select></div>
        <div class="mb-3">
            <label for="studentTaskDelete" class="form-label">Завдання</label>
            <select class="form-select" aria-label="Default select example" id="studentTaskDelete">`;
    tasks.forEach(element => {
        newItemHTML+=`<option value="${element["id"]}">${element["name"]}</option>`;
    });
    newItemHTML += `</select></div>
        <div class="modal-footer">
        <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Видалити</button>
    </div>`;
    let tempContainer = document.createElement('div');

    tempContainer.innerHTML = newItemHTML;

    form.replaceChildren(...tempContainer.childNodes);
}
function deleteTasksCreateForm(form,tasks){
    let newItemHTML = `<div class="modal-body"><div class="mb-3">
    <label for="taskIdDelete" class="form-label">Завдання</label>
    <select class="form-select" aria-label="Default select example" id="taskIdDelete">`
    tasks.forEach(element => {
        newItemHTML+=`<option value="${element["id"]}">${element["name"]}</option>`;
    });

    newItemHTML += `</select></div>
        </div>
        <div class="modal-footer">
        <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Видалити</button>
        </div>
    </div>`;
    let tempContainer = document.createElement('div');

    tempContainer.innerHTML = newItemHTML;

    form.replaceChildren(...tempContainer.childNodes);
}





