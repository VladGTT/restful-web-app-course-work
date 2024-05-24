
const server = window.sessionStorage.getItem("server");

async function save_pdf() {
async function save_pdf() {
    var win = window.open('', '', 'height=700,width=700');
    const table = document.getElementById("table").parentNode
    const table = document.getElementById("table").parentNode
    const docString = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    </head>
    <body>
      <div class="container-fluid shadow-lg mt-3 table-responsive small">
        <table class="table table-striped table-sm">
          ${table.innerHTML}
        </table>
      </div>
    </body>
    </html>`;
    win.document.write(docString)
    win.document.close()
    win.print()
}





function validatePassword(password) {
function validatePassword(password) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return pattern.test(password)
}

async function fetch_profile() {
async function fetch_profile() {

    var headers = {
        // 'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var options = {
        method: 'GET',
        headers: headers,
    };

    try {
        const response = await fetch(`http://${server}/api/teacher/profile`, options);
        const data = await response.json();

        document.getElementById("profileModalLabel").textContent = `${data["lastname"]} ${data["secondname"]} ${data["firstname"]} [${data["occupation"]}]`;
        document.getElementById("profileEmail").value = `${data["email"]}`;
    } catch (error) {
        console.log(error);
    }
}
async function update_password() {
async function update_password() {
    var headers = {
        // 'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };
    let password = document.getElementById("profilePassword").value;
    if (!validatePassword(password)) {
    if (!validatePassword(password)) {
        alert("Incorrect password")
        return
    }
    var payload = {
        password: password
        password: password
    }
    var options = {
        method: 'PUT',
        headers: headers,
        headers: headers,
        body: JSON.stringify(payload)
    };

    try {
        const response = await fetch(`http://${server}/api/teacher/profile`, options);
        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.log(error);
    }
}

class SubjectsView {
    constructor(onChangeDataEventHandler,onSelectedSubjectUpdated) {
        var subjectsList = document.getElementById("subjectsListId");

        this.callback = onChangeDataEventHandler;
        this.selectionUpdated = onSelectedSubjectUpdated;

        this.selectedSubject = {}

        this.onSelectSubjectButtonClickedEventHandler = this.#onSelectSubjectButtonClickedEventHandler.bind(this)
        subjectsList.addEventListener("click", this.onSelectSubjectButtonClickedEventHandler)

        this.fetchData();
    }
    async fetchData() {
        let data = await this.callback();

        let newItemHTML = '';

        data.forEach(element => {
            newItemHTML += `<li value="${element["id"]}" class="dropdown-item d-flex align-items-center gap-2 py-2">${element["name"]}</li>`
        });

        let tempContainer = document.createElement('ul');

        tempContainer.innerHTML = newItemHTML;

        var subjectsList = document.getElementById("subjectsListId");

        subjectsList.replaceChildren(...tempContainer.childNodes);

        this.selectedSubject = {
            id: subjectsList.children[0].value,
            name: subjectsList.children[0].textContent
        }
        document.getElementById("subjectsSelectButton").textContent = this.selectedSubject.name;

        this.selectionUpdated()

    }
    #onSelectSubjectButtonClickedEventHandler(event) {
        this.selectedSubject = {
            id: event.target.value,
            name: event.target.textContent
        }

        document.getElementById("subjectsSelectButton").textContent = this.selectedSubject.name;
        this.selectionUpdated()

    }

}
class StudentsView {

    constructor(onChangeDataEventHandler) {
        this.selectedRow = null;

        this.onTableClickEventHandler = this.#onTableClickEventHandler.bind(this);

        this.callback = onChangeDataEventHandler;
        let newItemHTML =
            `<table class="table table-striped table-sm">
            <thead>
              <tr>
                <th scope="col">Пошта</th>
                <th scope="col">Прізвище</th>
                <th scope="col">Ім'я</th>
                <th scope="col">По-батькові</th>
                <th scope="col">Група</th>
              </tr>
            </thead>
            <tbody id="table" class="table-group-divider text-break">
            
           </tbody>
          </table>`;
        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("tableContainer").replaceChildren(...tempContainer.childNodes);
        document.getElementById("tableButtonsId").classList.add("visually-hidden")
        document.getElementById("printButton").classList.remove("visually-hidden")
        document.getElementById("printButton").classList.remove("visually-hidden")

        document.getElementById("table").addEventListener("click", this.onTableClickEventHandler)
        document.getElementById("printButton").addEventListener("click", save_pdf)
        document.getElementById("printButton").addEventListener("click", save_pdf)

        this.fetchData()
    }

    async fetchData() {
        let table = document.getElementById("table");

        let data = await this.callback();
        //fetching data to dropdown

        let newItemHTML = '';

        data.forEach(element => {
            newItemHTML +=
                `<tr>
            <td>${element['email']}</td>
            <td>${element['lastname']}</td>
            <td>${element['secondname']}</td>
            <td>${element['firstname']}</td>
            <td>${element['group']}</td>
        </tr>`
        });

        let tempContainer = document.createElement('tbody');

        tempContainer.innerHTML = newItemHTML;

        table.replaceChildren(...tempContainer.childNodes);

    }
    #onTableClickEventHandler(event) {
        let classAttribute = 'table-warning';
        if (this.selectedRow) {
            this.selectedRow.classList.remove(classAttribute);
        }

        this.selectedRow = event.target.closest("tr");

        this.selectedRow.classList.add(classAttribute);
    }
}

class MeetingsView {

    constructor(onChangeDataEventHandler) {
        this.selectedRow = null;

        this.onTableClickEventHandler = this.#onTableClickEventHandler.bind(this);

        this.callback = onChangeDataEventHandler;
        let newItemHTML =
            `<table class="table table-striped table-sm">
            <thead>
              <tr>
                <th scope="col">Зібрання #</th>
                <th scope="col">Назва</th>
                <th scope="col">Час</th>
              </tr>
            </thead>
            <tbody id="table" class="table-group-divider text-break">
             
           </tbody>
          </table>`;
        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("tableContainer").replaceChildren(...tempContainer.childNodes);
        document.getElementById("tableButtonsId").classList.add("visually-hidden")
        document.getElementById("printButton").classList.remove("visually-hidden")
        document.getElementById("printButton").classList.remove("visually-hidden")

        document.getElementById("table").addEventListener("click", this.onTableClickEventHandler)

        document.getElementById("printButton").addEventListener("click", save_pdf)


        document.getElementById("printButton").addEventListener("click", save_pdf)

        this.fetchData()
    }

    async fetchData() {
        let table = document.getElementById("table");

        let data = await this.callback();
        //fetching data to dropdown

        let newItemHTML = '';

        data.forEach(element => {
            newItemHTML +=
                `<tr>
                <td>${element['id']}</td>
                <td>${element['name']}</td>
                <td>${element['time']}</td>
            </tr>`
        });

        let tempContainer = document.createElement('tbody');

        tempContainer.innerHTML = newItemHTML;

        table.replaceChildren(...tempContainer.childNodes);

    }
    #onTableClickEventHandler(event) {
        let classAttribute = 'table-warning';
        if (this.selectedRow) {
            this.selectedRow.classList.remove(classAttribute);
        }

        this.selectedRow = event.target.closest("tr");

        this.selectedRow.classList.add(classAttribute);
    }
}

class TasksView {

    constructor(onChangeDataEventHandler) {
        this.selectedRow = null;

        this.onEditIconClickEventHandler = this.#onEditIconClickEventHandler.bind(this);
        this.onTableClickEventHandler = this.#onTableClickEventHandler.bind(this);
        this.onSubmitEditionEventHandler = this.#onSubmitEditionEventHandler.bind(this);
        this.onSubmitDeletionEventHandler = this.#onSubmitDeletionEventHandler.bind(this);
        this.onSubmitCreationEventHandler = this.#onSubmitCreationEventHandler.bind(this);
        this.onDeleteIconClickEventHandler = this.#onDeleteIconClickEventHandler.bind(this);
        this.onCreateIconClickEventHandler = this.#onCreateIconClickEventHandler.bind(this);


        this.callback = onChangeDataEventHandler;

        let newItemHTML = `
        <table class="table table-striped table-sm">
          <thead>
            <tr>
                <th scope="col">Завдання #</th>
                <th scope="col">Назва</th>
                <th scope="col">Опис</th>
                <th scope="col">Термін</th>
                <th scope="col">Макс бал</th>
            </tr>
          </thead>
          <tbody id="table" class="table-group-divider text-break">
         </tbody>
        </table>
  
  
      <div class="modal fade" id="deleteModalId" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h1 class="modal-title fs-5" id="editModalLabel">Видалити запис</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form id="deleteFormId">
  
          </form>
        </div>
      </div>
    </div>
  
      <div class="modal fade" id="editModalId" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="editModalLabel">Редагувати запис</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form id="editFormId">
            
          </form>
        </div>
      </div>
    </div>
  
    <div class="modal fade" id="createModalId" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="createModalLabel">Створити запис</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form id="createFormId">
  
          </form>
        </div>
      </div>
    </div>
      `;
        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("tableContainer").replaceChildren(...tempContainer.childNodes);

        document.getElementById("tableButtonsId").classList.remove("visually-hidden")


        let editModal = document.getElementById("editModalId");
        editModal.addEventListener("show.bs.modal", this.onEditIconClickEventHandler);

        let deleteModal = document.getElementById("deleteModalId");
        deleteModal.addEventListener("show.bs.modal", this.onDeleteIconClickEventHandler);

        let createModal = document.getElementById("createModalId");
        createModal.addEventListener("show.bs.modal", this.onCreateIconClickEventHandler);

        let table = document.getElementById("table");
        table.addEventListener("click", this.onTableClickEventHandler);

        let editForm = document.getElementById("editFormId");
        editForm.addEventListener("submit", this.onSubmitEditionEventHandler);

        let deleteForm = document.getElementById("deleteFormId");
        deleteForm.addEventListener("submit", this.onSubmitDeletionEventHandler);

        let createForm = document.getElementById("createFormId");
        createForm.addEventListener("submit", this.onSubmitCreationEventHandler);

        document.getElementById("printButton").classList.remove("visually-hidden")
        document.getElementById("printButton").addEventListener("click", save_pdf)
        document.getElementById("printButton").classList.remove("visually-hidden")
        document.getElementById("printButton").addEventListener("click", save_pdf)

        this.fetchData();
    }

    async fetchData() {
        let data = await this.callback();
        //fetching data to dropdown

        let newItemHTML = '';

        data.tasks.forEach(element => {
            newItemHTML +=
                `<tr>
            <td>${element["id"]}</td>
            <td>${element["name"]}</td>
            <td>${element["description"]}</td>
            <td>${element["due_to"]}</td>
            <td>${element["max_point"]}</td>
        </tr>`;
        });
        this.selectedSubject = data.selectedSubject;

        let tempContainer = document.createElement('tbody');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("table").replaceChildren(...tempContainer.childNodes);
    }
    #onTableClickEventHandler(event) {
        let classAttribute = 'table-warning';
        if (this.selectedRow) {
            this.selectedRow.classList.remove(classAttribute);
        }

        this.selectedRow = event.target.closest("tr");

        this.selectedRow.classList.add(classAttribute);
    }

    #onCreateIconClickEventHandler() {
        let newItemHTML =
            `<div class="modal-body p-5 pt-0">
              <div class="mb-3">
                  <label for="exampleFormControlInput1" class="form-label">Назва</label>
                  <input type="text" class="form-control" id="exampleFormControlInput1">
              </div>
              <div class="mb-3">
                  <label for="exampleFormControlTextarea4" class="form-label">Опис</label>
                  <textarea class="form-control" id="exampleFormControlTextarea4" rows="3"></textarea>
              </div>
              <div class="mb-3">
                  <label for="exampleFormControlInput2" class="form-label">Термін</label>
                  <input type="text" class="form-control" id="exampleFormControlInput2">
              </div>
              <div class="mb-3">
                  <label for="exampleFormControlInput5" class="form-label">Макс Балл</label>
                  <input type="text" class="form-control" id="exampleFormControlInput5">
              </div>
              <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Створити</button>
      </div>`;

        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("createFormId").replaceChildren(...tempContainer.childNodes);
    }

    #onEditIconClickEventHandler() {
        let newItemHTML
        if (!this.selectedRow) {
            newItemHTML =
                `<div class="modal-body p-4 text-center">
          <p class="mb-0">Потрібно виділити дані</p>
          </div>
          <div class="modal-footer flex-nowrap p-0">
          <button type="button" class="bg-warning btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
          </div>`;
        } else {
            var cells = this.selectedRow.querySelectorAll("td");

            newItemHTML =
                `<div class="modal-body p-5 pt-0">
            <div class="mb-3">
              <label for="exampleFormControlInput6" class="form-label">Id</label>
              <input type="text" class="form-control" id="exampleFormControlInput6" disabled value="${cells[0].textContent}">
            </div>  

            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Назва</label>
                <input type="text" class="form-control" id="exampleFormControlInput1" value="${cells[1].textContent}">
            </div>
            <div class="mb-3">
                <label for="exampleFormControlTextarea4" class="form-label">Опис</label>
                <textarea class="form-control" id="exampleFormControlTextarea4" rows="3"></textarea>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput2" class="form-label">Термін</label>
                <input type="text" class="form-control" id="exampleFormControlInput2" value="${cells[3].textContent}">
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput5" class="form-label">Макс Балл</label>
                <input type="text" class="form-control" id="exampleFormControlInput5" value="${cells[4].textContent}">
            </div>
            <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Створити</button>
          </div>`;
        }

        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("editFormId").replaceChildren(...tempContainer.childNodes);
    }

    #onDeleteIconClickEventHandler() {
        let form = document.getElementById("deleteFormId");
        let newItemHTML
        if (!this.selectedRow) {
            newItemHTML =
                `<div class="modal-content rounded-3 shadow">
        <div class="modal-body p-4 text-center">
        <p class="mb-0">Потрібно виділити дані</p>
        </div>
        <div class="modal-footer flex-nowrap p-0">
        <button type="button" class="bg-warning btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
        </div></div>`;
        } else {
            newItemHTML =
                `<div class="modal-content rounded-3 shadow">
         <div class="modal-body p-4 text-center">
           <h5 class="mb-0">Видалити запис?</h5>
           <p class="mb-0">Ви не зможете відмінити цю дію</p>
         </div>
         <div class="modal-footer flex-nowrap p-0">
           <button type="submit" id="confirmDeleteButton" class="bg-danger btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
           <button type="button" class="btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0" data-bs-dismiss="modal">No</button>
         </div>
       </div>`;
        }
        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        form.replaceChildren(...tempContainer.childNodes);
    }

    async #onSubmitCreationEventHandler(event) {
        event.preventDefault();
        var createForm = document.getElementById("createFormId");

        var data = {
            "name": createForm[0].value,
            "description": createForm[1].value,
            "subject_id": parseInt(this.selectedSubject.id),
            "due_to": createForm[2].value,
            "max_point": parseFloat(createForm[3].value),
        }

        var headers = {
            'Content-Type': 'application/json',
            'AUTHORIZATION': window.sessionStorage.getItem('authorization')
        };

        var options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        };

        const response = await fetch(`http://${server}/api/teacher/tasks`, options);
        if (!response.ok) {
            alert(`Error occured`)
        }
        this.fetchData();
    }

    async #onSubmitEditionEventHandler(event) {
        event.preventDefault();
        var editForm = document.getElementById("editFormId");

        var data = {
            "id": parseInt(editForm[0].value),
            "name": editForm[1].value,
            "description": editForm[2].value,
            "subject_id": parseInt(this.selectedSubject.id),
            "due_to": editForm[3].value,
            "max_point": parseFloat(editForm[4].value),
        }

        var headers = {
            'Content-Type': 'application/json',
            'AUTHORIZATION': window.sessionStorage.getItem('authorization')
        };

        var options = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(data)
        };

        const response = await fetch(`http://${server}/api/teacher/tasks`, options);
        if (!response.ok) {
            alert(`Error occured`)
        }
        this.fetchData();
    }

    async #onSubmitDeletionEventHandler(event) {
        event.preventDefault();

        var cells = this.selectedRow.querySelectorAll("td");

        var headers = {
            'Content-Type': 'application/json',
            'AUTHORIZATION': window.sessionStorage.getItem('authorization')
        };

        var options = {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify({ "id": parseInt(cells[0].textContent) })
        };

        const response = await fetch(`http://${server}/api/teacher/tasks`, options);
        if (!response.ok) {
            alert(`Error occured`)
        }
        this.fetchData();
    }
}

class AttendanceView {

    constructor(onChangeDataEventHandler) {
        this.selectedRow = null;

        this.onEditIconClickEventHandler = this.#onEditIconClickEventHandler.bind(this);
        this.onTableClickEventHandler = this.#onTableClickEventHandler.bind(this);
        this.onSubmitEditionEventHandler = this.#onSubmitEditionEventHandler.bind(this);
        this.onSubmitDeletionEventHandler = this.#onSubmitDeletionEventHandler.bind(this);
        this.onSubmitCreationEventHandler = this.#onSubmitCreationEventHandler.bind(this);
        this.onDeleteIconClickEventHandler = this.#onDeleteIconClickEventHandler.bind(this);
        this.onCreateIconClickEventHandler = this.#onCreateIconClickEventHandler.bind(this);


        this.callback = onChangeDataEventHandler;

        let newItemHTML = `
        <table class="table table-striped table-sm">
          <thead>
            <tr>
                <th scope="col">ПІБ Студента</th>
                <th scope="col">Зайняття</th>
                <th scope="col">Відсоток відвідування</th>
                        
            </tr>
          </thead>
          <tbody id="table" class="table-group-divider text-break">
         </tbody>
        </table>
  
  
      <div class="modal fade" id="deleteModalId" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h1 class="modal-title fs-5" id="editModalLabel">Видалити запис</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form id="deleteFormId">
  
          </form>
        </div>
      </div>
    </div>
  
      <div class="modal fade" id="editModalId" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="editModalLabel">Редагувати запис</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form id="editFormId">
            
          </form>
        </div>
      </div>
    </div>
  
    <div class="modal fade" id="createModalId" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="createModalLabel">Створити запис</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form id="createFormId">
  
          </form>
        </div>
      </div>
    </div>
      `;
        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("tableContainer").replaceChildren(...tempContainer.childNodes);

        document.getElementById("tableButtonsId").classList.remove("visually-hidden")


        let editModal = document.getElementById("editModalId");
        editModal.addEventListener("show.bs.modal", this.onEditIconClickEventHandler);

        let deleteModal = document.getElementById("deleteModalId");
        deleteModal.addEventListener("show.bs.modal", this.onDeleteIconClickEventHandler);

        let createModal = document.getElementById("createModalId");
        createModal.addEventListener("show.bs.modal", this.onCreateIconClickEventHandler);

        let table = document.getElementById("table");
        table.addEventListener("click", this.onTableClickEventHandler);

        let editForm = document.getElementById("editFormId");
        editForm.addEventListener("submit", this.onSubmitEditionEventHandler);

        let deleteForm = document.getElementById("deleteFormId");
        deleteForm.addEventListener("submit", this.onSubmitDeletionEventHandler);

        let createForm = document.getElementById("createFormId");
        createForm.addEventListener("submit", this.onSubmitCreationEventHandler);

        document.getElementById("printButton").classList.remove("visually-hidden")
        document.getElementById("printButton").addEventListener("click", save_pdf)
        document.getElementById("printButton").classList.remove("visually-hidden")
        document.getElementById("printButton").addEventListener("click", save_pdf)

        this.fetchData();
    }

    async fetchData() {
        let data = await this.callback();
        //fetching data to dropdown

        let newItemHTML = '';

        data.attendance.forEach(element => {
            newItemHTML +=
                `<tr>
            newItemHTML +=
                `<tr>
                <td hidden>${element["email"]}</td>
                <td>${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</td>
                <td hidden>${element["id"]}</td>
                <td>${element["name"]}</td>
                <td>${element["percentage"]}</td>
            </tr>`;
        });
        this.selectedSubject = data.selectedSubject;
        this.students = data.students;
        this.meetings = data.meetings;

        let tempContainer = document.createElement('tbody');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("table").replaceChildren(...tempContainer.childNodes);
    }
    #onTableClickEventHandler(event) {
        let classAttribute = 'table-warning';
        if (this.selectedRow) {
            this.selectedRow.classList.remove(classAttribute);
        }

        this.selectedRow = event.target.closest("tr");

        this.selectedRow.classList.add(classAttribute);
    }

    #onCreateIconClickEventHandler() {
        let attendies = ''
        this.students.forEach(element => {
            attendies += `<option value="${element["email"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</option>`;
        let attendies = ''
        this.students.forEach(element => {
            attendies += `<option value="${element["email"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</option>`;
        });

        let meetings = ''
        this.meetings.forEach(element => {
            meetings += `<option value="${element["id"]}">${element["name"]}</option>`;

        let meetings = ''
        this.meetings.forEach(element => {
            meetings += `<option value="${element["id"]}">${element["name"]}</option>`;
        });

        let newItemHTML =
            `<div class="modal-body p-5 pt-0">

        let newItemHTML =
            `<div class="modal-body p-5 pt-0">
                <div class="mb-3">
                    <label for="exampleFormControlInput3" class="form-label">Студент</label>
                    <select class="form-select" aria-label="Default select example" id="exampleFormControlInput3">
                    ${attendies}
                    </select>
                </div>
                <div class="mb-3">
                  <label for="exampleFormControlInput4" class="form-label">Зайняття</label>
                  <select class="form-select" aria-label="Default select example" id="exampleFormControlInput4">
                    ${meetings}
                  </select>
                </div>
                <div class="mb-3">
                    <label for="exampleFormControlInput5" class="form-label">Присутність</label>
                    <input type="text" class="form-control" id="exampleFormControlInput5">
                </div>
                <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Створити</button>
        </div>`;

        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("createFormId").replaceChildren(...tempContainer.childNodes);
    }

    #onEditIconClickEventHandler() {
        let newItemHTML
        if (!this.selectedRow) {
            newItemHTML =
                `<div class="modal-body p-4 text-center">
          <p class="mb-0">Потрібно виділити дані</p>
          </div>
          <div class="modal-footer flex-nowrap p-0">
          <button type="button" class="bg-warning btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
          </div>`;
        } else {
            var cells = this.selectedRow.querySelectorAll("td");

            let attendies = ''
            this.students.forEach(element => {
                attendies += `<option value="${element["email"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]})</option>`;
            let attendies = ''
            this.students.forEach(element => {
                attendies += `<option value="${element["email"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]})</option>`;
            });

            let meetings = ''
            this.meetings.forEach(element => {
                meetings += `<option value="${element["id"]}">${element["name"]}</option>`;

            let meetings = ''
            this.meetings.forEach(element => {
                meetings += `<option value="${element["id"]}">${element["name"]}</option>`;
            });

            newItemHTML =
                `<div class="modal-body p-5 pt-0">

            newItemHTML =
                `<div class="modal-body p-5 pt-0">
                    <div class="mb-3">
                        <label for="exampleFormControlInput3" class="form-label">Студент</label>
                        <select class="form-select" aria-label="Default select example" id="exampleFormControlInput3">
                        ${attendies}
                        </select>
                    </div>
                    <div class="mb-3">
                      <label for="exampleFormControlInput4" class="form-label">Зайняття</label>
                      <select class="form-select" aria-label="Default select example" id="exampleFormControlInput4">
                        ${meetings}
                      </select>
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlInput5" class="form-label">Присутність</label>
                        <input type="text" class="form-control" id="exampleFormControlInput5" value="${cells[4].textContent}">
                    </div>
                    <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Редагувати</button>
            </div>`;


        }

        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("editFormId").replaceChildren(...tempContainer.childNodes);
    }

    #onDeleteIconClickEventHandler() {
        let form = document.getElementById("deleteFormId");
        let newItemHTML
        if (!this.selectedRow) {
            newItemHTML =
                `<div class="modal-content rounded-3 shadow">
        <div class="modal-body p-4 text-center">
        <p class="mb-0">Потрібно виділити дані</p>
        </div>
        <div class="modal-footer flex-nowrap p-0">
        <button type="button" class="bg-warning btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
        </div></div>`;
        } else {
            newItemHTML =
                `<div class="modal-content rounded-3 shadow">
         <div class="modal-body p-4 text-center">
           <h5 class="mb-0">Видалити запис?</h5>
           <p class="mb-0">Ви не зможете відмінити цю дію</p>
         </div>
         <div class="modal-footer flex-nowrap p-0">
           <button type="submit" id="confirmDeleteButton" class="bg-danger btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
           <button type="button" class="btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0" data-bs-dismiss="modal">No</button>
         </div>
       </div>`;
        }
        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        form.replaceChildren(...tempContainer.childNodes);
    }

    async #onSubmitCreationEventHandler(event) {
        event.preventDefault();
        var createForm = document.getElementById("createFormId");

        var data = {
            "meeting_id": parseInt(createForm[1].value),
            "student_id": createForm[0].value,
            "subject_id": parseInt(this.selectedSubject.id),
            "percentage": parseFloat(createForm[2].value),
        }

        var headers = {
            'Content-Type': 'application/json',
            'AUTHORIZATION': window.sessionStorage.getItem('authorization')
        };

        var options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        };

        const response = await fetch(`http://${server}/api/teacher/attendance`, options);
        if (!response.ok) {
            alert(`Error occured`)
        }
        this.fetchData();
    }

    async #onSubmitEditionEventHandler(event) {
        event.preventDefault();
        var editForm = document.getElementById("editFormId");

        var data = {
            "meeting_id": parseInt(editForm[1].value),
            "student_id": editForm[0].value,
            "subject_id": parseInt(this.selectedSubject.id),
            "percentage": parseFloat(editForm[2].value),
        }

        var headers = {
            'Content-Type': 'application/json',
            'AUTHORIZATION': window.sessionStorage.getItem('authorization')
        };

        var options = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(data)
        };

        const response = await fetch(`http://${server}/api/teacher/attendance`, options);
        if (!response.ok) {
            alert(`Error occured`)
        }
        this.fetchData();
    }

    async #onSubmitDeletionEventHandler(event) {
        event.preventDefault();

        var cells = this.selectedRow.querySelectorAll("td");

        var headers = {
            'Content-Type': 'application/json',
            'AUTHORIZATION': window.sessionStorage.getItem('authorization')
        };
        var data = {
            "meeting_id": parseInt(cells[2].textContent),
            "student_id": cells[0].textContent,
            "subject_id": parseInt(this.selectedSubject.id),
        }
        var options = {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify(data)
        };

        const response = await fetch(`http://${server}/api/teacher/attendance`, options);
        if (!response.ok) {
            alert(`Error occured`)
        }
        this.fetchData();
    }
}

class MarksView {

    constructor(onChangeDataEventHandler) {
        this.selectedRow = null;

        this.onEditIconClickEventHandler = this.#onEditIconClickEventHandler.bind(this);
        this.onTableClickEventHandler = this.#onTableClickEventHandler.bind(this);
        this.onSubmitEditionEventHandler = this.#onSubmitEditionEventHandler.bind(this);
        this.onSubmitDeletionEventHandler = this.#onSubmitDeletionEventHandler.bind(this);
        this.onSubmitCreationEventHandler = this.#onSubmitCreationEventHandler.bind(this);
        this.onDeleteIconClickEventHandler = this.#onDeleteIconClickEventHandler.bind(this);
        this.onCreateIconClickEventHandler = this.#onCreateIconClickEventHandler.bind(this);


        this.callback = onChangeDataEventHandler;

        let newItemHTML = `
        <table class="table table-striped table-sm">
          <thead>
            <tr>
                <th scope="col">ПІБ Студента</th>
                <th scope="col">Зайняття</th>
                <th scope="col">Оцінка %</th>                  
            </tr>
          </thead>
          <tbody id="table" class="table-group-divider text-break">
         </tbody>
        </table>
  
  
      <div class="modal fade" id="deleteModalId" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h1 class="modal-title fs-5" id="editModalLabel">Видалити запис</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form id="deleteFormId">
  
          </form>
        </div>
      </div>
    </div>
  
      <div class="modal fade" id="editModalId" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="editModalLabel">Редагувати запис</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form id="editFormId">
            
          </form>
        </div>
      </div>
    </div>
  
    <div class="modal fade" id="createModalId" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="createModalLabel">Створити запис</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form id="createFormId">
  
          </form>
        </div>
      </div>
    </div>
      `;
        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("tableContainer").replaceChildren(...tempContainer.childNodes);

        document.getElementById("tableButtonsId").classList.remove("visually-hidden")


        let editModal = document.getElementById("editModalId");
        editModal.addEventListener("show.bs.modal", this.onEditIconClickEventHandler);

        let deleteModal = document.getElementById("deleteModalId");
        deleteModal.addEventListener("show.bs.modal", this.onDeleteIconClickEventHandler);

        let createModal = document.getElementById("createModalId");
        createModal.addEventListener("show.bs.modal", this.onCreateIconClickEventHandler);

        let table = document.getElementById("table");
        table.addEventListener("click", this.onTableClickEventHandler);

        let editForm = document.getElementById("editFormId");
        editForm.addEventListener("submit", this.onSubmitEditionEventHandler);

        let deleteForm = document.getElementById("deleteFormId");
        deleteForm.addEventListener("submit", this.onSubmitDeletionEventHandler);

        let createForm = document.getElementById("createFormId");
        createForm.addEventListener("submit", this.onSubmitCreationEventHandler);

        document.getElementById("printButton").classList.remove("visually-hidden")
        document.getElementById("printButton").addEventListener("click", save_pdf)
        document.getElementById("printButton").classList.remove("visually-hidden")
        document.getElementById("printButton").addEventListener("click", save_pdf)

        this.fetchData();
    }

    async fetchData() {
        let data = await this.callback();
        //fetching data to dropdown

        let newItemHTML = '';

        data.marks.forEach(element => {
            newItemHTML +=
                `<tr>
            newItemHTML +=
                `<tr>
                <td hidden>${element["email"]}</td>
                <td>${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</td>
                <td hidden>${element["id"]}</td>
                <td>${element["name"]}</td>
                <td>${element["mark"]}</td>
            </tr>`;
        });
        this.selectedSubject = data.selectedSubject;
        this.students = data.students;
        this.tasks = data.tasks;

        let tempContainer = document.createElement('tbody');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("table").replaceChildren(...tempContainer.childNodes);
    }
    #onTableClickEventHandler(event) {
        let classAttribute = 'table-warning';
        if (this.selectedRow) {
            this.selectedRow.classList.remove(classAttribute);
        }

        this.selectedRow = event.target.closest("tr");

        this.selectedRow.classList.add(classAttribute);
    }

    #onCreateIconClickEventHandler() {
        let attendies = ''
        this.students.forEach(element => {
            attendies += `<option value="${element["email"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</option>`;
        let attendies = ''
        this.students.forEach(element => {
            attendies += `<option value="${element["email"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</option>`;
        });

        let tasks = ''
        this.tasks.forEach(element => {

        let tasks = ''
        this.tasks.forEach(element => {
            tasks += `<option value="${element["id"]}">${element["name"]}</option>`;
        });

        let newItemHTML =
            `<div class="modal-body p-5 pt-0">

        let newItemHTML =
            `<div class="modal-body p-5 pt-0">
                <div class="mb-3">
                    <label for="exampleFormControlInput3" class="form-label">Студент</label>
                    <select class="form-select" aria-label="Default select example" id="exampleFormControlInput3">
                    ${attendies}
                    </select>
                </div>
                <div class="mb-3">
                  <label for="exampleFormControlInput4" class="form-label">Завдання</label>
                  <select class="form-select" aria-label="Default select example" id="exampleFormControlInput4">
                    ${tasks}
                  </select>
                </div>
                <div class="mb-3">
                    <label for="exampleFormControlInput5" class="form-label">Бали</label>
                    <input type="text" class="form-control" id="exampleFormControlInput5">
                </div>
                <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Створити</button>
        </div>`;

        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("createFormId").replaceChildren(...tempContainer.childNodes);
    }

    #onEditIconClickEventHandler() {
        let newItemHTML
        if (!this.selectedRow) {
            newItemHTML =
                `<div class="modal-body p-4 text-center">
          <p class="mb-0">Потрібно виділити дані</p>
          </div>
          <div class="modal-footer flex-nowrap p-0">
          <button type="button" class="bg-warning btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
          </div>`;
        } else {
            var cells = this.selectedRow.querySelectorAll("td");

            let attendies = ''
            this.students.forEach(element => {
                attendies += `<option value="${element["email"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]})</option>`;
            let attendies = ''
            this.students.forEach(element => {
                attendies += `<option value="${element["email"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]})</option>`;
            });

            let tasks = ''
            this.tasks.forEach(element => {

            let tasks = ''
            this.tasks.forEach(element => {
                tasks += `<option value="${element["id"]}">${element["name"]}</option>`;
            });

            newItemHTML =
                `<div class="modal-body p-5 pt-0">

            newItemHTML =
                `<div class="modal-body p-5 pt-0">
                    <div class="mb-3">
                        <label for="exampleFormControlInput3" class="form-label">Студент</label>
                        <select class="form-select" aria-label="Default select example" id="exampleFormControlInput3">
                        ${attendies}
                        </select>
                    </div>
                    <div class="mb-3">
                      <label for="exampleFormControlInput4" class="form-label">Завдання</label>
                      <select class="form-select" aria-label="Default select example" id="exampleFormControlInput4">
                        ${tasks}
                      </select>
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlInput5" class="form-label">Бали</label>
                        <input type="text" class="form-control" id="exampleFormControlInput5" value="${cells[4].textContent}">
                    </div>
                    <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Редагувати</button>
            </div>`;


        }

        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("editFormId").replaceChildren(...tempContainer.childNodes);
    }

    #onDeleteIconClickEventHandler() {
        let form = document.getElementById("deleteFormId");
        let newItemHTML
        if (!this.selectedRow) {
            newItemHTML =
                `<div class="modal-content rounded-3 shadow">
        <div class="modal-body p-4 text-center">
        <p class="mb-0">Потрібно виділити дані</p>
        </div>
        <div class="modal-footer flex-nowrap p-0">
        <button type="button" class="bg-warning btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
        </div></div>`;
        } else {
            newItemHTML =
                `<div class="modal-content rounded-3 shadow">
         <div class="modal-body p-4 text-center">
           <h5 class="mb-0">Видалити запис?</h5>
           <p class="mb-0">Ви не зможете відмінити цю дію</p>
         </div>
         <div class="modal-footer flex-nowrap p-0">
           <button type="submit" id="confirmDeleteButton" class="bg-danger btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
           <button type="button" class="btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0" data-bs-dismiss="modal">No</button>
         </div>
       </div>`;
        }
        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        form.replaceChildren(...tempContainer.childNodes);
    }

    async #onSubmitCreationEventHandler(event) {
        event.preventDefault();
        var createForm = document.getElementById("createFormId");

        var data = {
            "assignment_id": parseInt(createForm[1].value),
            "student_id": createForm[0].value,
            "subject_id": parseInt(this.selectedSubject.id),
            "mark": parseFloat(createForm[2].value),
        }

        var headers = {
            'Content-Type': 'application/json',
            'AUTHORIZATION': window.sessionStorage.getItem('authorization')
        };

        var options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        };

        const response = await fetch(`http://${server}/api/teacher/marks`, options);
        if (!response.ok) {
            alert(`Error occured`)
        }
        this.fetchData();
    }

    async #onSubmitEditionEventHandler(event) {
        event.preventDefault();
        var editForm = document.getElementById("editFormId");

        var data = {
            "assignment_id": parseInt(editForm[1].value),
            "student_id": editForm[0].value,
            "subject_id": parseInt(this.selectedSubject.id),
            "mark": parseFloat(editForm[2].value),
        }

        var headers = {
            'Content-Type': 'application/json',
            'AUTHORIZATION': window.sessionStorage.getItem('authorization')
        };

        var options = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(data)
        };

        const response = await fetch(`http://${server}/api/teacher/marks`, options);
        if (!response.ok) {
            alert(`Error occured`)
        }
        this.fetchData();
    }

    async #onSubmitDeletionEventHandler(event) {
        event.preventDefault();

        var cells = this.selectedRow.querySelectorAll("td");

        var headers = {
            'Content-Type': 'application/json',
            'AUTHORIZATION': window.sessionStorage.getItem('authorization')
        };
        var data = {
            "assignment_id": parseInt(cells[2].textContent),
            "student_id": cells[0].textContent,
            "subject_id": parseInt(this.selectedSubject.id),
        }
        var options = {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify(data)
        };

        const response = await fetch(`http://${server}/api/teacher/marks`, options);
        if (!response.ok) {
            alert(`Error occured`)
        }
        this.fetchData();
    }
}

class StatsView {
    constructor(onChangeDataEventHandler) {
        this.selectedRow = null;

        this.callback = onChangeDataEventHandler;
        let newItemHTML =
        `<div class="container p-4 gap-4 align-items-center">
            <div class="row p-4 align-items-center gap-4">
              <div class="col border border-primary bg-opacity-10 bg-primary rounded">
                <p class="h3 text-center pt-3">Найбільш відвідане зайняття</p>
                <p class="h4 text-center text-body-secondary" id="mostAttendedMeeting">Значення</p>
                <p class="">Зайняття на яке прийшло найбільше студентів</p>
              </div>
              <div class="col border border-primary bg-opacity-10 bg-primary rounded">
                <p class="h3 text-center pt-3">Найменш відвідане зайняття</p>
                <p class="h4 text-center text-body-secondary" id="leastAttendedMeeting">Значення</p>
                <p class="">Зайняття на яке прийшло найменше студентів</p>
              </div>
              <div class="col border border-primary bg-opacity-10 bg-primary rounded">
                <p class="h3 text-center pt-3">Найбільш виконане завдання</p>
                <p class="h4 text-center text-body-secondary" id="mostCompletedAssignment">Значення</p>
                <p class="">Завдання, яке виконало найбільше студентів</p>
              </div>
            </div>
            <div class="row p-4 align-items-center gap-4">
              <div class="col border border-primary bg-opacity-10 bg-primary rounded">
                <p class="h3 text-center pt-3">Найменш виконане завдання</p>
                <p class="h4 text-center text-body-secondary" id="leastCompletedAssignment">Значення</p>
                <p class="">Завдання, яке виконало найменше студентів</p>
              </div>
              <div class="col border border-primary bg-opacity-10 bg-primary rounded">
                <p class="h3 text-center pt-3">Середня оцінка студентів</p>
                <p class="h4 text-center text-body-secondary" id="meanStudentMeanMark">Значення</p>
                <p class="">Середнє арифметичне середніх оцінок студентів</p>
              </div>
              <div class="col border border-primary bg-opacity-10 bg-primary rounded">
                <p class="h3 text-center pt-3">Середня присутність студентів</p>
                <p class="h4 text-center text-body-secondary" id="meanStudentMeanPercentage">Значення</p>
                <p class="">Середнє арифметичне середніх значень присутності студентів</p>
              </div>
            </div>
          </div>`;
        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("tableContainer").replaceChildren(...tempContainer.childNodes);
        document.getElementById("tableButtonsId").classList.add("visually-hidden")
        document.getElementById("printButton").classList.add("visually-hidden")

        this.fetchData()
    }

    async fetchData() {
        let data = await this.callback();

        let mostAttendedMeeting = data["most_attended_meeting"] ?? {"name": "NaN","attendance_count": "NaN"}
        let leastAttendedMeeting = data["least_attended_meeting"] ?? {"name": "NaN","attendance_count": "NaN"}
        let mostCompletedAssignment = data["most_completed_assignment"] ?? {"name": "NaN","completion_count": "NaN"}
        let leastCompletedAssignment = data["least_completed_assignment"] ?? {"name": "NaN","completion_count": "NaN"}
        let meanStudentMeanMark = data["mean_student_mean_mark"] ?? {"mean_of_mean_marks": "NaN"}
        let meanStudentMeanPercentage = data["mean_student_mean_percentage"] ?? {"mean_of_mean_attendance": "NaN"}

        document.getElementById("mostAttendedMeeting").textContent = `${mostAttendedMeeting["name"]} (${mostAttendedMeeting["attendance_count"]})`;
        document.getElementById("leastAttendedMeeting").textContent = `${leastAttendedMeeting["name"]} (${leastAttendedMeeting["attendance_count"]})`;
        document.getElementById("mostCompletedAssignment").textContent = `${mostCompletedAssignment["name"]} (${mostCompletedAssignment["completion_count"]})`;
        document.getElementById("leastCompletedAssignment").textContent = `${leastCompletedAssignment["name"]} (${leastCompletedAssignment["completion_count"]})`;
        document.getElementById("meanStudentMeanMark").textContent = meanStudentMeanMark["mean_of_mean_marks"];
        document.getElementById("meanStudentMeanPercentage").textContent = meanStudentMeanPercentage["mean_of_mean_attendance"];
    }
}

class StatsView {
    constructor(onChangeDataEventHandler) {
        this.selectedRow = null;

        this.callback = onChangeDataEventHandler;
        let newItemHTML =
        `<div class="container p-4 gap-4 align-items-center">
            <div class="row p-4 align-items-center gap-4">
              <div class="col border border-primary bg-opacity-10 bg-primary rounded">
                <p class="h3 text-center pt-3">Найбільш відвідане зайняття</p>
                <p class="h4 text-center text-body-secondary" id="mostAttendedMeeting">Значення</p>
                <p class="">Зайняття на яке прийшло найбільше студентів</p>
              </div>
              <div class="col border border-primary bg-opacity-10 bg-primary rounded">
                <p class="h3 text-center pt-3">Найменш відвідане зайняття</p>
                <p class="h4 text-center text-body-secondary" id="leastAttendedMeeting">Значення</p>
                <p class="">Зайняття на яке прийшло найменше студентів</p>
              </div>
              <div class="col border border-primary bg-opacity-10 bg-primary rounded">
                <p class="h3 text-center pt-3">Найбільш виконане завдання</p>
                <p class="h4 text-center text-body-secondary" id="mostCompletedAssignment">Значення</p>
                <p class="">Завдання, яке виконало найбільше студентів</p>
              </div>
            </div>
            <div class="row p-4 align-items-center gap-4">
              <div class="col border border-primary bg-opacity-10 bg-primary rounded">
                <p class="h3 text-center pt-3">Найменш виконане завдання</p>
                <p class="h4 text-center text-body-secondary" id="leastCompletedAssignment">Значення</p>
                <p class="">Завдання, яке виконало найменше студентів</p>
              </div>
              <div class="col border border-primary bg-opacity-10 bg-primary rounded">
                <p class="h3 text-center pt-3">Середня оцінка студентів</p>
                <p class="h4 text-center text-body-secondary" id="meanStudentMeanMark">Значення</p>
                <p class="">Середнє арифметичне середніх оцінок студентів</p>
              </div>
              <div class="col border border-primary bg-opacity-10 bg-primary rounded">
                <p class="h3 text-center pt-3">Середня присутність студентів</p>
                <p class="h4 text-center text-body-secondary" id="meanStudentMeanPercentage">Значення</p>
                <p class="">Середнє арифметичне середніх значень присутності студентів</p>
              </div>
            </div>
          </div>`;
        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("tableContainer").replaceChildren(...tempContainer.childNodes);
        document.getElementById("tableButtonsId").classList.add("visually-hidden")
        document.getElementById("printButton").classList.add("visually-hidden")

        this.fetchData()
    }

    async fetchData() {
        let data = await this.callback();

        let mostAttendedMeeting = data["most_attended_meeting"] ?? {"name": "NaN","attendance_count": "NaN"}
        let leastAttendedMeeting = data["least_attended_meeting"] ?? {"name": "NaN","attendance_count": "NaN"}
        let mostCompletedAssignment = data["most_completed_assignment"] ?? {"name": "NaN","completion_count": "NaN"}
        let leastCompletedAssignment = data["least_completed_assignment"] ?? {"name": "NaN","completion_count": "NaN"}
        let meanStudentMeanMark = data["mean_student_mean_mark"] ?? {"mean_of_mean_marks": "NaN"}
        let meanStudentMeanPercentage = data["mean_student_mean_percentage"] ?? {"mean_of_mean_attendance": "NaN"}

        document.getElementById("mostAttendedMeeting").textContent = `${mostAttendedMeeting["name"]} (${mostAttendedMeeting["attendance_count"]})`;
        document.getElementById("leastAttendedMeeting").textContent = `${leastAttendedMeeting["name"]} (${leastAttendedMeeting["attendance_count"]})`;
        document.getElementById("mostCompletedAssignment").textContent = `${mostCompletedAssignment["name"]} (${mostCompletedAssignment["completion_count"]})`;
        document.getElementById("leastCompletedAssignment").textContent = `${leastCompletedAssignment["name"]} (${leastCompletedAssignment["completion_count"]})`;
        document.getElementById("meanStudentMeanMark").textContent = meanStudentMeanMark["mean_of_mean_marks"];
        document.getElementById("meanStudentMeanPercentage").textContent = meanStudentMeanPercentage["mean_of_mean_attendance"];
    }
}




async function getStudentsData(subjectId) {

    // Define the headers for the request
    var headers = {
        'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    // Define the options for the fetch request
    var options = {
        method: 'GET',
        headers: headers,
    };

    let responce = await fetch(`http://${server}/api/teacher/students?subject_id=${subjectId}`, options);
    let data = await responce.json();
    return data;
}

async function getSubjectsData() {

    // Define the headers for the request
    var headers = {
        'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    // Define the options for the fetch request
    var options = {
        method: 'GET',
        headers: headers,
    };

    let responce = await fetch(`http://${server}/api/teacher/subjects`, options);
    let data = await responce.json();
    return data;
}
async function getMeetingsData(subjectId) {

    // Define the headers for the request
    var headers = {
        'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    // Define the options for the fetch request
    var options = {
        method: 'GET',
        headers: headers,
    };

    let responce = await fetch(`http://${server}/api/teacher/meetings?subject_id=${subjectId}`, options);
    let data = await responce.json();
    return data;
}

async function getTasksData(subjectId) {

    // Define the headers for the request
    var headers = {
        'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    // Define the options for the fetch request
    var options = {
        method: 'GET',
        headers: headers,
    };

    let responce = await fetch(`http://${server}/api/teacher/tasks?subject_id=${subjectId}`, options);
    let data = await responce.json();
    return data;
}

async function getMarksData(subjectId) {

    // Define the headers for the request
    var headers = {
        'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    // Define the options for the fetch request
    var options = {
        method: 'GET',
        headers: headers,
    };

    let responce = await fetch(`http://${server}/api/teacher/marks?subject_id=${subjectId}`, options);
    let data = await responce.json();
    return data;
}

async function getAttendanceData(subjectId) {

    // Define the headers for the request
    var headers = {
        'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    // Define the options for the fetch request
    var options = {
        method: 'GET',
        headers: headers,
    };

    let responce = await fetch(`http://${server}/api/teacher/attendance?subject_id=${subjectId}`, options);
    let data = await responce.json();
    return data;
}

async function getStatsData(subjectId) {
    var headers = {
        'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };
async function getStatsData(subjectId) {
    var headers = {
        'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    // Define the options for the fetch request
    var options = {
        method: 'GET',
        headers: headers,
    };
    // Define the options for the fetch request
    var options = {
        method: 'GET',
        headers: headers,
    };

    let responce = await fetch(`http://${server}/api/teacher/stats?subject_id=${subjectId}`, options);
    let data = await responce.json();
    return data;
}
    let responce = await fetch(`http://${server}/api/teacher/stats?subject_id=${subjectId}`, options);
    let data = await responce.json();
    return data;
}











document.addEventListener('DOMContentLoaded',async function () {

    if (window.sessionStorage.getItem("role") != 1) {

document.addEventListener('DOMContentLoaded',async function () {

    if (window.sessionStorage.getItem("role") != 1) {
        window.location.href = "login.html";
    }


    document.getElementById("logoutButtonId").addEventListener("click", async function (event) {
        window.sessionStorage.removeItem('authorization');
        window.location.href = "login.html";
    });


    var selector = new SubjectsView(async () => {
        let data = await getSubjectsData();
        return data;
    },async () =>{
        var temp = new StatsView(async () => {
            return await getStatsData(selector.selectedSubject.id)
        });
    });

    document.getElementById('pills-tab').addEventListener('click', async function (event) {
        console.log(event.target.textContent)
        switch (event.target.textContent) {
            case "Статистика":
                var selector = new SubjectsView(async () => {
                    let data = await getSubjectsData();
                    return data;
                },async () =>{
                    var temp = new StatsView(async () => {
                        return await getStatsData(selector.selectedSubject.id)
                    });
                });
                break;
            case "Успішність":
                var selector = new SubjectsView(async () => {
                    let data = await getSubjectsData();
                    return data;
                },async () =>{
                    var temp = new MarksView(async () => {
                        return {
                            marks: await getMarksData(selector.selectedSubject.id),
                            selectedSubject: selector.selectedSubject,
                            tasks: await getTasksData(selector.selectedSubject.id),
                            students: await getStudentsData(selector.selectedSubject.id)
                        }
                    });
                });

                break;
            case "Відвідуваність":
                var selector = new SubjectsView(async () => {
                    let data = await getSubjectsData();
                    return data;
                },async () =>{
                    var temp = new AttendanceView(async () => {
                        return {
                            attendance: await getAttendanceData(selector.selectedSubject.id),
                            selectedSubject: selector.selectedSubject,
                            meetings: await getMeetingsData(selector.selectedSubject.id),
                            students: await getStudentsData(selector.selectedSubject.id)
                        }
                    });
                });
                break;
            case "Завдання":
                var selector = new SubjectsView(async () => {
                    let data = await getSubjectsData();
                    return data;
                },async () =>{
                    var temp = new TasksView(async () => {
                        return {
                            tasks: await getTasksData(selector.selectedSubject.id),
                            selectedSubject: selector.selectedSubject
                        }
                    });
                });
                break;
            case "Зайняття":
                var selector = new SubjectsView(async () => {
                    let data = await getSubjectsData();
                    return data;
                },async () =>{
                    var temp = new MeetingsView(async () => {
                        return await getMeetingsData(selector.selectedSubject.id)
                    });
                });
                break;
            case "Студенти":
                var selector = new SubjectsView(async () => {
                    let data = await getSubjectsData();
                    return data;
                },async () =>{
                    var temp = new StudentsView(async () => {
                        return await getStudentsData(selector.selectedSubject.id)
                    });
                });
                break;
        }
    });

    document.getElementById("profileButton").addEventListener("click", fetch_profile)
    document.getElementById("profileUpdateForm").addEventListener("submit", update_password)
    document.getElementById("profileButton").addEventListener("click", fetch_profile)
    document.getElementById("profileUpdateForm").addEventListener("submit", update_password)
});