const server = window.sessionStorage.getItem("server");


class TeachersView {

  constructor(page,onChangeDataEventHandler) {
    this.selectedRow = null;

    this.onEditIconClickEventHandler = this.#onEditIconClickEventHandler.bind(this);
    this.onTableClickEventHandler = this.#onTableClickEventHandler.bind(this);
    this.onSubmitEditionEventHandler = this.#onSubmitEditionEventHandler.bind(this);
    this.onSubmitDeletionEventHandler = this.#onSubmitDeletionEventHandler.bind(this);
    this.onSubmitCreationEventHandler = this.#onSubmitCreationEventHandler.bind(this);
    this.onDeleteIconClickEventHandler = this.#onDeleteIconClickEventHandler.bind(this);
    
    this.callback=onChangeDataEventHandler;

    let newItemHTML =
      `
    <div id="tableButtonsId" class="col d-flex flex-row-reverse">
    <div class="p-1" data-bs-toggle="modal" data-bs-target="#deleteModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z">
            </path>
            <path
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z">
            </path>
        </svg>
    </div>
    <div class="p-1" data-bs-toggle="modal" data-bs-target="#editModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil"
            viewBox="0 0 16 16">
            <path
                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
        </svg>
    </div>
    <div class="p-1" id="addIconId" data-bs-toggle="modal" data-bs-target="#createModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-lg"
            viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
        </svg>
    </div>
    </div>


    <div class="container-fluid shadow-lg mt-3 table-responsive small">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">ПІБ</th>
            <th scope="col">Посада</th>
            <th scope="col">Пошта</th>
          </tr>
        </thead>
        <tbody id="teachersTable" class="table-group-divider text-break">
       </tbody>
      </table>
    </div>


    <div class="modal fade" id="deleteModalId" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
          <h1 class="modal-title fs-5" id="editModalLabel">Редагувати запис</h1>
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
          <div class="modal-body">
            <div class="mb-3">
            <label for="exampleFormControlInput5" class="form-label">Пошта</label>
            <input type="email" class="form-control" id="exampleFormControlInput5">
            </div>
            <div class="mb-3">
            <label for="exampleFormControlInput6" class="form-label">Пароль</label>
            <input type="password" class="form-control" id="exampleFormControlInput6">
            </div>
            <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Прізвище</label>
                  <input type="text" class="form-control" id="exampleFormControlInput1">
              </div>
              <div class="mb-3">
                  <label for="exampleFormControlInput2" class="form-label">Ім'я</label>
                  <input type="text" class="form-control" id="exampleFormControlInput2">
              </div>
              <div class="mb-3">
                  <label for="exampleFormControlInput3" class="form-label">По-батькові</label>
                  <input type="text" class="form-control" id="exampleFormControlInput3">
              </div>
              <div class="mb-3">
                  <label for="exampleFormControlInput4" class="form-label">Посада</label>
                  <input type="text" class="form-control" id="exampleFormControlInput4">
              </div>
              <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Додати</button>
            </div>
        </form>
      </div>
    </div>
  </div>
 
`;
    let tempContainer = document.createElement('div');
    tempContainer.innerHTML = newItemHTML;
    page.replaceChildren(...tempContainer.childNodes);

    let editModal = document.getElementById("editModalId");
    editModal.addEventListener("show.bs.modal", this.onEditIconClickEventHandler);

    let deleteModal = document.getElementById("deleteModalId");
    deleteModal.addEventListener("show.bs.modal", this.onDeleteIconClickEventHandler);

    let table = document.getElementById("teachersTable");
    table.addEventListener("click", this.onTableClickEventHandler)

    let editForm = document.getElementById("editFormId");
    editForm.addEventListener("submit", this.onSubmitEditionEventHandler)

    let deleteForm = document.getElementById("deleteFormId");
    deleteForm.addEventListener("submit", this.onSubmitDeletionEventHandler)

    let createForm = document.getElementById("createFormId");
    createForm.addEventListener("submit", this.onSubmitCreationEventHandler)

    this.fetchData()
  }

  async fetchData() {
    let table = document.getElementById("teachersTable");

    let data = await this.callback();
    //fetching data to dropdown

    let newItemHTML = '';

    data.forEach(element => {
      newItemHTML += `<tr><td>${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</td><td>${element["occupation"]}</td><td>${element["email"]}</td></tr>`
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
  #onEditIconClickEventHandler() {
    let form = document.getElementById("editFormId");
    let newItemHTML
    if (!this.selectedRow) {
      newItemHTML =
        `<div class="modal-body p-4 text-center">
<p class="mb-0">Потрібно виділити дані</p>
</div>
<div class="modal-footer flex-nowrap p-0">
<button type="button" class="bg-warning btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
</div>`;
      // let tempContainer = document.createElement('div');
      // tempContainer.innerHTML = newItemHTML;
      // form.replaceChildren(...tempContainer.childNodes);
      // return;
    } else {
      var cells = this.selectedRow.querySelectorAll("td");
      var fullname = cells[0].textContent.split(' ');
  
       newItemHTML =
        `
  <div class="modal-body">
  <div class="mb-3">
  <label for="exampleFormControlInput5" class="form-label">Пошта</label>
  <input type="text" class="form-control" id="exampleFormControlInput5" value="${cells[2].textContent}" disabled>
  </div>
  <div class="mb-3">
  <label for="exampleFormControlInput1" class="form-label">Прізвище</label>
  <input type="text" class="form-control" id="exampleFormControlInput1" value="${fullname[0]}">
  </div>
  <div class="mb-3">
  <label for="exampleFormControlInput2" class="form-label">Ім'я</label>
  <input type="text" class="form-control" id="exampleFormControlInput2" value="${fullname[1]}">
  </div>
  <div class="mb-3">
  <label for="exampleFormControlInput3" class="form-label">По-батькові</label>
  <input type="text" class="form-control" id="exampleFormControlInput3" value="${fullname[2]}">
  </div>
  <div class="mb-3">
  <label for="exampleFormControlInput4" class="form-label">Посада</label>
  <input type="text" class="form-control" id="exampleFormControlInput4" value="${cells[1].textContent}">
  </div>
  <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Редагувати</button>
  </div>
  `;
    }

    let tempContainer = document.createElement('div');
    tempContainer.innerHTML = newItemHTML;
    form.replaceChildren(...tempContainer.childNodes);
  }

  #onDeleteIconClickEventHandler(){
    let form = document.getElementById("deleteFormId");
    let newItemHTML
    if (!this.selectedRow){
      newItemHTML =         
      `<div class="modal-content rounded-3 shadow">
      <div class="modal-body p-4 text-center">
      <p class="mb-0">Потрібно виділити дані</p>
      </div>
      <div class="modal-footer flex-nowrap p-0">
      <button type="button" class="bg-warning btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
      </div></div>`;
    }else{
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

    var teacherData = {
      "email": createForm[0].value,
      "password": createForm[1].value,
      "lastname": createForm[2].value,
      "secondname": createForm[3].value,
      "firstname": createForm[4].value,
      "occupation": createForm[5].value,
    }

    console.log(teacherData)

    var headers = {
      'Content-Type': 'application/json',
      'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(teacherData)
    };

    const response = await fetch(`http://${server}/api/admin/teachers`, options);
    if (!response.ok) {
      alert(`Error occured`)
    }
    this.fetchData();
  }

  async #onSubmitEditionEventHandler(event) {
    event.preventDefault();
    var editForm = document.getElementById("editFormId");

    var teacherData = {
      "email": editForm[0].value,
      "lastname": editForm[1].value,
      "secondname": editForm[2].value,
      "firstname": editForm[3].value,
      "occupation": editForm[4].value,
    }

    console.log(teacherData)

    var headers = {
      'Content-Type': 'application/json',
      'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var options = {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(teacherData)
    };

    const response = await fetch(`http://${server}/api/admin/teachers`, options);
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
      body: JSON.stringify({"email":cells[2].textContent})
    };

    const response = await fetch(`http://${server}/api/admin/teachers`, options);
    if (!response.ok) {
      alert(`Error occured`)
    }
    this.fetchData();
  }
}


class StudentsView {

  constructor(page,onChangeDataEventHandler) {
    this.selectedRow = null;

    this.onEditIconClickEventHandler = this.#onEditIconClickEventHandler.bind(this);
    this.onTableClickEventHandler = this.#onTableClickEventHandler.bind(this);
    this.onSubmitEditionEventHandler = this.#onSubmitEditionEventHandler.bind(this);
    this.onSubmitDeletionEventHandler = this.#onSubmitDeletionEventHandler.bind(this);
    this.onSubmitCreationEventHandler = this.#onSubmitCreationEventHandler.bind(this);
    this.onDeleteIconClickEventHandler = this.#onDeleteIconClickEventHandler.bind(this);
    
    this.callback=onChangeDataEventHandler;

    let newItemHTML =
      `
    <div id="tableButtonsId" class="col d-flex flex-row-reverse">
    <div class="p-1" data-bs-toggle="modal" data-bs-target="#deleteModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z">
            </path>
            <path
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z">
            </path>
        </svg>
    </div>
    <div class="p-1" data-bs-toggle="modal" data-bs-target="#editModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil"
            viewBox="0 0 16 16">
            <path
                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
        </svg>
    </div>
    <div class="p-1" id="addIconId" data-bs-toggle="modal" data-bs-target="#createModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-lg"
            viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
        </svg>
    </div>
    </div>


    <div class="container-fluid shadow-lg mt-3 table-responsive small">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
          <th scope="col">ПІБ</th>
          <th scope="col">Група</th>
          <th scope="col">Пошта</th>
        </tr>
        </thead>
        <tbody id="table" class="table-group-divider text-break">
       </tbody>
      </table>
    </div>


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
          <div class="modal-body">
            <div class="mb-3">
            <label for="exampleFormControlInput5" class="form-label">Пошта</label>
            <input type="email" class="form-control" id="exampleFormControlInput5">
            </div>
            <div class="mb-3">
            <label for="exampleFormControlInput6" class="form-label">Пароль</label>
            <input type="password" class="form-control" id="exampleFormControlInput6">
            </div>
            <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Прізвище</label>
                  <input type="text" class="form-control" id="exampleFormControlInput1">
              </div>
              <div class="mb-3">
                  <label for="exampleFormControlInput2" class="form-label">Ім'я</label>
                  <input type="text" class="form-control" id="exampleFormControlInput2">
              </div>
              <div class="mb-3">
                  <label for="exampleFormControlInput3" class="form-label">По-батькові</label>
                  <input type="text" class="form-control" id="exampleFormControlInput3">
              </div>
              <div class="mb-3">
                  <label for="exampleFormControlInput4" class="form-label">Група</label>
                  <input type="text" class="form-control" id="exampleFormControlInput4">
              </div>
              <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Додати</button>
            </div>
        </form>
      </div>
    </div>
  </div>
 
`;
    let tempContainer = document.createElement('div');
    tempContainer.innerHTML = newItemHTML;
    page.replaceChildren(...tempContainer.childNodes);

    let editModal = document.getElementById("editModalId");
    editModal.addEventListener("show.bs.modal", this.onEditIconClickEventHandler);

    let deleteModal = document.getElementById("deleteModalId");
    deleteModal.addEventListener("show.bs.modal", this.onDeleteIconClickEventHandler);

    let table = document.getElementById("table");
    table.addEventListener("click", this.onTableClickEventHandler)

    let editForm = document.getElementById("editFormId");
    editForm.addEventListener("submit", this.onSubmitEditionEventHandler)

    let deleteForm = document.getElementById("deleteFormId");
    deleteForm.addEventListener("submit", this.onSubmitDeletionEventHandler)

    let createForm = document.getElementById("createFormId");
    createForm.addEventListener("submit", this.onSubmitCreationEventHandler)

    this.fetchData()
  }

  async fetchData() {
    let table = document.getElementById("table");

    let data = await this.callback();
    //fetching data to dropdown

    let newItemHTML = '';

    data.forEach(element => {
      newItemHTML += `<tr><td>${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</td><td>${element["group"]}</td><td>${element["email"]}</td></tr>`
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
  #onEditIconClickEventHandler() {
    let form = document.getElementById("editFormId");
    let newItemHTML
    if (!this.selectedRow) {
      newItemHTML =
        `<div class="modal-body p-4 text-center">
<p class="mb-0">Потрібно виділити дані</p>
</div>
<div class="modal-footer flex-nowrap p-0">
<button type="button" class="bg-warning btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
</div>`;
      // let tempContainer = document.createElement('div');
      // tempContainer.innerHTML = newItemHTML;
      // form.replaceChildren(...tempContainer.childNodes);
      // return;
    } else {
      var cells = this.selectedRow.querySelectorAll("td");
      var fullname = cells[0].textContent.split(' ');
  
       newItemHTML =
        `
  <div class="modal-body">
  <div class="mb-3">
  <label for="exampleFormControlInput5" class="form-label">Пошта</label>
  <input type="text" class="form-control" id="exampleFormControlInput5" value="${cells[2].textContent}" disabled>
  </div>
  <div class="mb-3">
  <label for="exampleFormControlInput1" class="form-label">Прізвище</label>
  <input type="text" class="form-control" id="exampleFormControlInput1" value="${fullname[0]}">
  </div>
  <div class="mb-3">
  <label for="exampleFormControlInput2" class="form-label">Ім'я</label>
  <input type="text" class="form-control" id="exampleFormControlInput2" value="${fullname[1]}">
  </div>
  <div class="mb-3">
  <label for="exampleFormControlInput3" class="form-label">По-батькові</label>
  <input type="text" class="form-control" id="exampleFormControlInput3" value="${fullname[2]}">
  </div>
  <div class="mb-3">
  <label for="exampleFormControlInput4" class="form-label">Група</label>
  <input type="text" class="form-control" id="exampleFormControlInput4" value="${cells[1].textContent}">
  </div>
  <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Редагувати</button>
  </div>
  `;
    }

    let tempContainer = document.createElement('div');
    tempContainer.innerHTML = newItemHTML;
    form.replaceChildren(...tempContainer.childNodes);
  }

  #onDeleteIconClickEventHandler(){
    let form = document.getElementById("deleteFormId");
    let newItemHTML
    if (!this.selectedRow){
      newItemHTML =         
      `<div class="modal-content rounded-3 shadow">
      <div class="modal-body p-4 text-center">
      <p class="mb-0">Потрібно виділити дані</p>
      </div>
      <div class="modal-footer flex-nowrap p-0">
      <button type="button" class="bg-warning btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
      </div></div>`;
    }else{
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
      "email": createForm[0].value,
      "password": createForm[1].value,
      "lastname": createForm[2].value,
      "secondname": createForm[3].value,
      "firstname": createForm[4].value,
      "group": createForm[5].value,
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

    const response = await fetch(`http://${server}/api/admin/students`, options);
    if (!response.ok) {
      alert(`Error occured`)
    }
    this.fetchData();
  }

  async #onSubmitEditionEventHandler(event) {
    event.preventDefault();
    var editForm = document.getElementById("editFormId");

    var data = {
      "email": editForm[0].value,
      "lastname": editForm[1].value,
      "secondname": editForm[2].value,
      "firstname": editForm[3].value,
      "group": editForm[4].value,
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

    const response = await fetch(`http://${server}/api/admin/students`, options);
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
      body: JSON.stringify({"email":cells[2].textContent})
    };

    const response = await fetch(`http://${server}/api/admin/students`, options);
    if (!response.ok) {
      alert(`Error occured`)
    }
    this.fetchData();
  }
}

class SubjectsView {

  constructor(page,onChangeDataEventHandler) {
    this.selectedRow = null;

    this.onEditIconClickEventHandler = this.#onEditIconClickEventHandler.bind(this);
    this.onTableClickEventHandler = this.#onTableClickEventHandler.bind(this);
    this.onSubmitEditionEventHandler = this.#onSubmitEditionEventHandler.bind(this);
    this.onSubmitDeletionEventHandler = this.#onSubmitDeletionEventHandler.bind(this);
    this.onSubmitCreationEventHandler = this.#onSubmitCreationEventHandler.bind(this);
    this.onDeleteIconClickEventHandler = this.#onDeleteIconClickEventHandler.bind(this);
    this.onCreateIconClickEventHandler = this.#onCreateIconClickEventHandler.bind(this);


    this.callback=onChangeDataEventHandler;
    
    let newItemHTML = `
    <div id="tableButtonsId" class="col d-flex flex-row-reverse">
    <div class="p-1" data-bs-toggle="modal" data-bs-target="#deleteModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z">
            </path>
            <path
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z">
            </path>
        </svg>
    </div>
    <div class="p-1" data-bs-toggle="modal" data-bs-target="#editModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil"
            viewBox="0 0 16 16">
            <path
                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
        </svg>
    </div>
    <div class="p-1" id="addIconId" data-bs-toggle="modal" data-bs-target="#createModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-lg"
            viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
        </svg>
    </div>
    </div>


    <div class="container-fluid shadow-lg mt-3 table-responsive small">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Назва</th>
            <th scope="col">Викладач</th>
            <th scope="col">Опис</th>
            <th scope="col">Семестр</th>
          </tr>
        </thead>
        <tbody id="table" class="table-group-divider text-break">
       </tbody>
      </table>
    </div>


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
    page.replaceChildren(...tempContainer.childNodes);  
    
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

    this.fetchData();
  }

  async fetchData() {
    let table = document.getElementById("table");

    let data = await this.callback();
    //fetching data to dropdown

    let newItemHTML = '';

    data.subjects.forEach(element => {
      newItemHTML += `<tr><td>${element["id"]}</td><td>${element["name"]}</td><td>${element["lastname"]} ${element["secondname"]} ${element["firstname"]} (${element["teacher"]})</td>  <td>${element["description"]}</td><td>${element["semestr"]}</td></tr>`
    });

    this.teachers = data.teachers;

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

  #onCreateIconClickEventHandler(){
    let form = document.getElementById("createFormId");   
    let teachers=''
    this.teachers.forEach(element=>{
      teachers += `<option value="${element["email"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]} (${element["occupation"]})</option>`;
    });
    
    let newItemHTML = 
    `<div class="modal-body p-5 pt-0">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Назва</label>
                <input type="text" class="form-control" id="exampleFormControlInput1">
            </div>
            <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">Опис</label>
                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            </div>

            <div class="mb-3">
                <label for="exampleFormControlInput2" class="form-label">Семестр</label>
                <input type="text" class="form-control" id="exampleFormControlInput2">
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput3" class="form-label">Викладач</label>
                <select class="form-select" aria-label="Default select example" id="exampleFormControlInput3">
                ${teachers}
                </select>
            </div>
            <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Створити</button>
    </div>`;

    let tempContainer = document.createElement('div');
    tempContainer.innerHTML = newItemHTML;
    form.replaceChildren(...tempContainer.childNodes);
  }

  #onEditIconClickEventHandler() {
    let form = document.getElementById("editFormId");
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

      let teachers=''
      this.teachers.forEach(element=>{
        teachers += `<option value="${element["email"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]} (${element["occupation"]})</option>`;
      });
      
       newItemHTML =
        `<div class="modal-body">
        <div class="mb-3">
          <label for="exampleFormControlInput5" class="form-label">Id</label>
          <input type="text" class="form-control" id="exampleFormControlInput5" value="${cells[0].textContent}" disabled>
          </div>
        <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Назва</label>
                <input type="text" class="form-control" id="exampleFormControlInput1" value="${cells[1].textContent}">
            </div>
            <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">Опис</label>
                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value="${cells[2].textContent}"></textarea>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput2" class="form-label">Семестр</label>
                <input type="text" class="form-control" id="exampleFormControlInput2" value="${cells[4].textContent}">
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput3" class="form-label">Викладач</label>
                <select class="form-select" aria-label="Default select example" id="exampleFormControlInput3">
                ${teachers}
                </select>
            </div>
        <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Редагувати</button>
        </div>`;
    }

    let tempContainer = document.createElement('div');
    tempContainer.innerHTML = newItemHTML;
    form.replaceChildren(...tempContainer.childNodes);
  }

  #onDeleteIconClickEventHandler(){
    let form = document.getElementById("deleteFormId");
    let newItemHTML
    if (!this.selectedRow){
      newItemHTML =         
      `<div class="modal-content rounded-3 shadow">
      <div class="modal-body p-4 text-center">
      <p class="mb-0">Потрібно виділити дані</p>
      </div>
      <div class="modal-footer flex-nowrap p-0">
      <button type="button" class="bg-warning btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
      </div></div>`;
    }else{
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
      "semestr": parseInt(createForm[2].value),
      "teacher_id": createForm[3].value,
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

    const response = await fetch(`http://${server}/api/admin/subjects`, options);
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
      "semestr": parseInt(editForm[3].value),
      "teacher_id": editForm[4].value,
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

    const response = await fetch(`http://${server}/api/admin/subjects`, options);
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
      body: JSON.stringify({"id":cells[0].textContent})
    };

    const response = await fetch(`http://${server}/api/admin/subjects`, options);
    if (!response.ok) {
      alert(`Error occured`)
    }
    this.fetchData();
  }
}

class MeetingsView {

  constructor(page,onChangeDataEventHandler) {
    this.selectedRow = null;

    this.onEditIconClickEventHandler = this.#onEditIconClickEventHandler.bind(this);
    this.onTableClickEventHandler = this.#onTableClickEventHandler.bind(this);
    this.onSubmitEditionEventHandler = this.#onSubmitEditionEventHandler.bind(this);
    this.onSubmitDeletionEventHandler = this.#onSubmitDeletionEventHandler.bind(this);
    this.onSubmitCreationEventHandler = this.#onSubmitCreationEventHandler.bind(this);
    this.onDeleteIconClickEventHandler = this.#onDeleteIconClickEventHandler.bind(this);
    this.onCreateIconClickEventHandler = this.#onCreateIconClickEventHandler.bind(this);


    this.callback=onChangeDataEventHandler;
    
    let newItemHTML = `
    <div id="tableButtonsId" class="col d-flex flex-row-reverse">
    <div class="p-1" data-bs-toggle="modal" data-bs-target="#deleteModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z">
            </path>
            <path
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z">
            </path>
        </svg>
    </div>
    <div class="p-1" data-bs-toggle="modal" data-bs-target="#editModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil"
            viewBox="0 0 16 16">
            <path
                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
        </svg>
    </div>
    <div class="p-1" id="addIconId" data-bs-toggle="modal" data-bs-target="#createModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-lg"
            viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
        </svg>
    </div>
    </div>


    <div class="container-fluid shadow-lg mt-3 table-responsive small">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">Зібрання #</th>
            <th scope="col">Назва</th>
            <th scope="col">Предмет</th>
            <th scope="col">Час</th>
          </tr>
        </thead>
        <tbody id="table" class="table-group-divider text-break">
       </tbody>
      </table>
    </div>


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
    page.replaceChildren(...tempContainer.childNodes);  
    
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

    this.fetchData();
  }

  async fetchData() {
    let table = document.getElementById("table");

    let data = await this.callback();
    //fetching data to dropdown

    let newItemHTML = '';

    data.meetings.forEach(element => {
      newItemHTML += `<tr><td>${element["id"]}</td><td>${element["name"]}</td><td>${element["subject_name"]}</td><td>${element["time"]}</td></tr>`
    });
    this.subjects = data.subjects;

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

  #onCreateIconClickEventHandler(){
    let form = document.getElementById("createFormId");   
    let subjects=''
    this.subjects.forEach(element=>{
      subjects += `<option value="${element["id"]}">${element["name"]}</option>`;
    });
    
    let newItemHTML = 
    `<div class="modal-body p-5 pt-0">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Назва</label>
                <input type="text" class="form-control" id="exampleFormControlInput1">
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput2" class="form-label">Час</label>
                <input type="text" class="form-control" id="exampleFormControlInput2">
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput3" class="form-label">Предмет</label>
                <select class="form-select" aria-label="Default select example" id="exampleFormControlInput3">
                ${subjects}
                </select>
            </div>
            <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Створити</button>
    </div>`;

    let tempContainer = document.createElement('div');
    tempContainer.innerHTML = newItemHTML;
    form.replaceChildren(...tempContainer.childNodes);
  }

  #onEditIconClickEventHandler() {
    let form = document.getElementById("editFormId");
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

      let subjects=''
      this.subjects.forEach(element=>{
        subjects += `<option value="${element["id"]}">${element["name"]}</option>`;
      });
      
       newItemHTML =        
        `<div class="modal-body p-5 pt-0">
          <div class="mb-3">
            <label for="exampleFormControlInput4" class="form-label">Id</label>
            <input type="text" class="form-control" id="exampleFormControlInput4" disabled value="${cells[0].textContent}">
          </div>  
          <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">Назва</label>
              <input type="text" class="form-control" id="exampleFormControlInput1" value="${cells[1].textContent}">
          </div>
          <div class="mb-3">
              <label for="exampleFormControlInput2" class="form-label">Час</label>
              <input type="text" class="form-control" id="exampleFormControlInput2" value="${cells[3].textContent}">
          </div>
          <div class="mb-3">
              <label for="exampleFormControlInput3" class="form-label">Предмет</label>
              <select class="form-select" aria-label="Default select example" id="exampleFormControlInput3">
              ${subjects}
              </select>
          </div>
          <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Створити</button>
        </div>`;
    }

    let tempContainer = document.createElement('div');
    tempContainer.innerHTML = newItemHTML;
    form.replaceChildren(...tempContainer.childNodes);
  }

  #onDeleteIconClickEventHandler(){
    let form = document.getElementById("deleteFormId");
    let newItemHTML
    if (!this.selectedRow){
      newItemHTML =         
      `<div class="modal-content rounded-3 shadow">
      <div class="modal-body p-4 text-center">
      <p class="mb-0">Потрібно виділити дані</p>
      </div>
      <div class="modal-footer flex-nowrap p-0">
      <button type="button" class="bg-warning btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
      </div></div>`;
    }else{
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
      "time": createForm[1].value,
      "subject_id": parseInt(createForm[2].value),
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

    const response = await fetch(`http://${server}/api/admin/meetings`, options);
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
      "time": editForm[2].value,
      "subject_id": parseInt(editForm[3].value),
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

    const response = await fetch(`http://${server}/api/admin/meetings`, options);
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
      body: JSON.stringify({"id":parseInt(cells[0].textContent)})
    };

    const response = await fetch(`http://${server}/api/admin/meetings`, options);
    if (!response.ok) {
      alert(`Error occured`)
    }
    this.fetchData();
  }
}

class TasksView {

  constructor(page,onChangeDataEventHandler) {
    this.selectedRow = null;

    this.onEditIconClickEventHandler = this.#onEditIconClickEventHandler.bind(this);
    this.onTableClickEventHandler = this.#onTableClickEventHandler.bind(this);
    this.onSubmitEditionEventHandler = this.#onSubmitEditionEventHandler.bind(this);
    this.onSubmitDeletionEventHandler = this.#onSubmitDeletionEventHandler.bind(this);
    this.onSubmitCreationEventHandler = this.#onSubmitCreationEventHandler.bind(this);
    this.onDeleteIconClickEventHandler = this.#onDeleteIconClickEventHandler.bind(this);
    this.onCreateIconClickEventHandler = this.#onCreateIconClickEventHandler.bind(this);


    this.callback=onChangeDataEventHandler;
    
    let newItemHTML = `
    <div id="tableButtonsId" class="col d-flex flex-row-reverse">
    <div class="p-1" data-bs-toggle="modal" data-bs-target="#deleteModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z">
            </path>
            <path
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z">
            </path>
        </svg>
    </div>
    <div class="p-1" data-bs-toggle="modal" data-bs-target="#editModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil"
            viewBox="0 0 16 16">
            <path
                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
        </svg>
    </div>
    <div class="p-1" id="addIconId" data-bs-toggle="modal" data-bs-target="#createModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-lg"
            viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
        </svg>
    </div>
    </div>


    <div class="container-fluid shadow-lg mt-3 table-responsive small">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
              <th scope="col">Завдання #</th>
              <th scope="col">Предмет</th>
              <th scope="col">Назва</th>
              <th scope="col">Опис</th>
              <th scope="col">Термін</th>
              <th scope="col">Макс бал</th>
          </tr>
        </thead>
        <tbody id="table" class="table-group-divider text-break">
       </tbody>
      </table>
    </div>


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
    page.replaceChildren(...tempContainer.childNodes);  
    
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

    this.fetchData();
  }

  async fetchData() {
    let table = document.getElementById("table");

    let data = await this.callback();
    //fetching data to dropdown

    let newItemHTML = '';

    data.tasks.forEach(element => {
      newItemHTML += `<tr><td>${element["id"]}</td><td>${element["subject_name"]}</td><td>${element["name"]}</td><td>${element["description"]}</td><td>${element["due_to"]}</td><td>${element["max_point"]}</td></tr>`
    });
    this.subjects = data.subjects;

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

  #onCreateIconClickEventHandler(){
    let form = document.getElementById("createFormId");   
    let subjects=''
    this.subjects.forEach(element=>{
      subjects += `<option value="${element["id"]}">${element["name"]}</option>`;
    });
    
    let newItemHTML = 
    `<div class="modal-body p-5 pt-0">
            <div class="mb-3">
                <label for="exampleFormControlInput3" class="form-label">Предмет</label>
                <select class="form-select" aria-label="Default select example" id="exampleFormControlInput3">
                ${subjects}
                </select>
            </div>
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
    form.replaceChildren(...tempContainer.childNodes);
  }

  #onEditIconClickEventHandler() {
    let form = document.getElementById("editFormId");
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

      let subjects=''
      this.subjects.forEach(element=>{
        subjects += `<option value="${element["id"]}">${element["name"]}</option>`;
      });
      
       newItemHTML =        
        `<div class="modal-body p-5 pt-0">
          <div class="mb-3">
            <label for="exampleFormControlInput6" class="form-label">Id</label>
            <input type="text" class="form-control" id="exampleFormControlInput6" disabled value="${cells[0].textContent}">
          </div>  
          <div class="mb-3">
            <label for="exampleFormControlInput3" class="form-label">Предмет</label>
              <select class="form-select" aria-label="Default select example" id="exampleFormControlInput3">
              ${subjects}
              </select>
          </div>
          <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">Назва</label>
              <input type="text" class="form-control" id="exampleFormControlInput1" value="${cells[2].textContent}">
          </div>
          <div class="mb-3">
              <label for="exampleFormControlTextarea4" class="form-label">Опис</label>
              <textarea class="form-control" id="exampleFormControlTextarea4" rows="3"></textarea>
          </div>
          <div class="mb-3">
              <label for="exampleFormControlInput2" class="form-label">Термін</label>
              <input type="text" class="form-control" id="exampleFormControlInput2" value="${cells[4].textContent}">
          </div>
          <div class="mb-3">
              <label for="exampleFormControlInput5" class="form-label">Макс Балл</label>
              <input type="text" class="form-control" id="exampleFormControlInput5" value="${cells[5].textContent}">
          </div>
          <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Створити</button>
        </div>`;
    }

    let tempContainer = document.createElement('div');
    tempContainer.innerHTML = newItemHTML;
    form.replaceChildren(...tempContainer.childNodes);
  }

  #onDeleteIconClickEventHandler(){
    let form = document.getElementById("deleteFormId");
    let newItemHTML
    if (!this.selectedRow){
      newItemHTML =         
      `<div class="modal-content rounded-3 shadow">
      <div class="modal-body p-4 text-center">
      <p class="mb-0">Потрібно виділити дані</p>
      </div>
      <div class="modal-footer flex-nowrap p-0">
      <button type="button" class="bg-warning btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
      </div></div>`;
    }else{
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
      "name": createForm[1].value,
      "description": createForm[2].value,
      "subject_id": parseInt(createForm[0].value),
      "due_to": createForm[3].value,
      "max_point": parseFloat(createForm[4].value),
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

    const response = await fetch(`http://${server}/api/admin/tasks`, options);
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
      "name": editForm[2].value,
      "description": editForm[3].value,
      "subject_id": parseInt(editForm[1].value),
      "due_to": editForm[4].value,
      "max_point": parseFloat(editForm[5].value),
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

    const response = await fetch(`http://${server}/api/admin/tasks`, options);
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
      body: JSON.stringify({"id":parseInt(cells[0].textContent)})
    };

    const response = await fetch(`http://${server}/api/admin/tasks`, options);
    if (!response.ok) {
      alert(`Error occured`)
    }
    this.fetchData();
  }
}

class AttendiesView {

  constructor(page,onChangeDataEventHandler) {
    this.selectedRow = null;

    this.onTableClickEventHandler = this.#onTableClickEventHandler.bind(this);
    this.onSubmitDeletionEventHandler = this.#onSubmitDeletionEventHandler.bind(this);
    this.onSubmitCreationEventHandler = this.#onSubmitCreationEventHandler.bind(this);
    this.onDeleteIconClickEventHandler = this.#onDeleteIconClickEventHandler.bind(this);
    this.onCreateIconClickEventHandler = this.#onCreateIconClickEventHandler.bind(this);


    this.callback=onChangeDataEventHandler;
    
    let newItemHTML = `
    <div id="tableButtonsId" class="col d-flex flex-row-reverse">
    <div class="p-1" data-bs-toggle="modal" data-bs-target="#deleteModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z">
            </path>
            <path
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z">
            </path>
        </svg>
    </div>
    <div class="p-1" id="addIconId" data-bs-toggle="modal" data-bs-target="#createModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-lg"
            viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
        </svg>
    </div>
    </div>


    <div class="container-fluid shadow-lg mt-3 table-responsive small">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">Студент #</th>
            <th scope="col">ПІБ Студента</th>
            <th scope="col">Предмет #</th>
            <th scope="col">Назва предмету</th>
          </tr>
        </thead>
        <tbody id="table" class="table-group-divider text-break">
       </tbody>
      </table>
    </div>


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
    page.replaceChildren(...tempContainer.childNodes);  
    
    let deleteModal = document.getElementById("deleteModalId");
    deleteModal.addEventListener("show.bs.modal", this.onDeleteIconClickEventHandler);

    let createModal = document.getElementById("createModalId");
    createModal.addEventListener("show.bs.modal", this.onCreateIconClickEventHandler);

    let table = document.getElementById("table");
    table.addEventListener("click", this.onTableClickEventHandler);

    let deleteForm = document.getElementById("deleteFormId");
    deleteForm.addEventListener("submit", this.onSubmitDeletionEventHandler);

    let createForm = document.getElementById("createFormId");
    createForm.addEventListener("submit", this.onSubmitCreationEventHandler);

    this.fetchData();
  }

  async fetchData() {
    let table = document.getElementById("table");

    let data = await this.callback();
    //fetching data to dropdown

    let newItemHTML = '';

    data.attendies.forEach(element => {
      newItemHTML += `<tr><td>${element["email"]}</td><td>${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</td><td>${element["id"]}</td><td>${element["name"]}</td></tr>`
    });
    this.subjects = data.subjects;
    this.students = data.students;

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

  #onCreateIconClickEventHandler(){
    let form = document.getElementById("createFormId");   
    let subjects=''
    this.subjects.forEach(element=>{
      subjects += `<option value="${element["id"]}">${element["name"]}</option>`;
    });
    let students=''
    this.students.forEach(element=>{
      students += `<option value="${element["email"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</option>`;
    });
    
    let newItemHTML = 
    `<div class="modal-body p-5 pt-0">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Предмет</label>
                <select class="form-select" aria-label="Default select example" id="exampleFormControlInput1">
                ${subjects}
                </select>
            </div>
            <div class="mb-3">
              <label for="exampleFormControlInput2" class="form-label">Студент</label>
              <select class="form-select" aria-label="Default select example" id="exampleFormControlInput2">
              ${students}
            </select>
        </div>
            <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Створити</button>
    </div>`;

    let tempContainer = document.createElement('div');
    tempContainer.innerHTML = newItemHTML;
    form.replaceChildren(...tempContainer.childNodes);
  }

  #onDeleteIconClickEventHandler(){
    let form = document.getElementById("deleteFormId");
    let newItemHTML
    if (!this.selectedRow){
      newItemHTML =         
      `<div class="modal-content rounded-3 shadow">
      <div class="modal-body p-4 text-center">
      <p class="mb-0">Потрібно виділити дані</p>
      </div>
      <div class="modal-footer flex-nowrap p-0">
      <button type="button" class="bg-warning btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
      </div></div>`;
    }else{
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
      "subject_id": parseInt(createForm[0].value),
      "student_id": createForm[1].value
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

    const response = await fetch(`http://${server}/api/admin/attendies`, options);
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
      body: JSON.stringify({"subject_id":parseInt(cells[2].textContent),"student_id":cells[0].textContent})
    };

    const response = await fetch(`http://${server}/api/admin/attendies`, options);
    if (!response.ok) {
      alert(`Error occured`)
    }
    this.fetchData();
  }
}

class MarksView {

  constructor(page,onChangeDataEventHandler) {
    this.selectedRow = null;

    this.onEditIconClickEventHandler = this.#onEditIconClickEventHandler.bind(this);
    this.onTableClickEventHandler = this.#onTableClickEventHandler.bind(this);
    this.onSubmitEditionEventHandler = this.#onSubmitEditionEventHandler.bind(this);
    this.onSubmitDeletionEventHandler = this.#onSubmitDeletionEventHandler.bind(this);
    this.onSubmitCreationEventHandler = this.#onSubmitCreationEventHandler.bind(this);
    this.onDeleteIconClickEventHandler = this.#onDeleteIconClickEventHandler.bind(this);
    this.onCreateIconClickEventHandler = this.#onCreateIconClickEventHandler.bind(this);


    this.callback=onChangeDataEventHandler;
    
    let newItemHTML = `
    <div id="tableButtonsId" class="col d-flex flex-row-reverse">
    <div class="p-1" data-bs-toggle="modal" data-bs-target="#deleteModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z">
            </path>
            <path
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z">
            </path>
        </svg>
    </div>
    <div class="p-1" data-bs-toggle="modal" data-bs-target="#editModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil"
            viewBox="0 0 16 16">
            <path
                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
        </svg>
    </div>
    <div class="p-1" id="addIconId" data-bs-toggle="modal" data-bs-target="#createModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-lg"
            viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
        </svg>
    </div>
    </div>


    <div class="container-fluid shadow-lg mt-3 table-responsive small">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
              <th scope="col">Завдання #</th>
              <th scope="col">Предмет</th>
              <th scope="col">Назва</th>
              <th scope="col">ПІБ Студента</th>
              <th scope="col">Зароблений бал</th>
              <th scope="col">Макс бал</th>
          </tr>
        </thead>
        <tbody id="table" class="table-group-divider text-break">
       </tbody>
      </table>
    </div>


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
    page.replaceChildren(...tempContainer.childNodes);  
    
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

    this.fetchData();
  }

  async fetchData() {
    let table = document.getElementById("table");

    let data = await this.callback();
    //fetching data to dropdown

    let newItemHTML = '';

    data.marks.forEach(element => {
      newItemHTML += `<tr>
      <td>${element["assignment_id"]}</td>
      <td hidden>${element["subject_id"]}</td>
      <td hidden>${element["email"]}</td>
      <td>${element["subject_name"]}</td>
      <td>${element["assignment_name"]}</td>
      <td>${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</td>
      <td>${element["mark"]}</td>
      <td>${element["max_point"]}</td>
      </tr>`
    });
    this.attendies = data.attendies;
    this.tasks = data.tasks;

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

  #onCreateIconClickEventHandler(){
    let form = document.getElementById("createFormId");   
    let attendies=''
    this.attendies.forEach(element=>{
      attendies += `<option value="${element["email"]}|${element["id"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]} (${element["name"]})</option>`;
    });
    
    let tasks=''
    this.tasks.forEach(element=>{
      tasks += `<option value="${element["id"]}">${element["name"]}</option>`;
    });
    
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
                <label for="exampleFormControlInput5" class="form-label">Балл</label>
                <input type="text" class="form-control" id="exampleFormControlInput5">
            </div>
            <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Створити</button>
    </div>`;

    let tempContainer = document.createElement('div');
    tempContainer.innerHTML = newItemHTML;
    form.replaceChildren(...tempContainer.childNodes);
  }

  #onEditIconClickEventHandler() {
    let form = document.getElementById("editFormId");
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

      let attendies=''
      this.attendies.forEach(element=>{
        attendies += `<option value="${element["email"]}|${element["id"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]} (${element["name"]})</option>`;
      });
      
      let tasks=''
      this.tasks.forEach(element=>{
        tasks += `<option value="${element["id"]}">${element["name"]}</option>`;
      });
      
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
                  <label for="exampleFormControlInput5" class="form-label">Балл</label>
                  <input type="text" class="form-control" id="exampleFormControlInput5" value="${cells[6].textContent}">
              </div>
              <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Редагувати</button>
      </div>`;
    }

    let tempContainer = document.createElement('div');
    tempContainer.innerHTML = newItemHTML;
    form.replaceChildren(...tempContainer.childNodes);
  }

  #onDeleteIconClickEventHandler(){
    let form = document.getElementById("deleteFormId");
    let newItemHTML
    if (!this.selectedRow){
      newItemHTML =         
      `<div class="modal-content rounded-3 shadow">
      <div class="modal-body p-4 text-center">
      <p class="mb-0">Потрібно виділити дані</p>
      </div>
      <div class="modal-footer flex-nowrap p-0">
      <button type="button" class="bg-warning btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
      </div></div>`;
    }else{
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

    let ids = createForm[0].value.split('|'); 

    var data = {
      "assignment_id": parseInt(createForm[1].value),
      "student_id": ids[0],
      "subject_id": parseInt(ids[1]),
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

    const response = await fetch(`http://${server}/api/admin/marks`, options);
    if (!response.ok) {
      alert(`Error occured`)
    }
    this.fetchData();
  }

  async #onSubmitEditionEventHandler(event) {
    event.preventDefault();
    var editForm = document.getElementById("editFormId");

    let ids = editForm[0].value.split('|'); 

    var data = {
      "assignment_id": parseInt(editForm[1].value),
      "student_id": ids[0],
      "subject_id": parseInt(ids[1]),
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

    const response = await fetch(`http://${server}/api/admin/marks`, options);
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
      "assignment_id": parseInt(cells[0].textContent),
      "student_id": cells[2].textContent,
      "subject_id": parseInt(cells[1].textContent),
    }

    var options = {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify(data)
    };

    const response = await fetch(`http://${server}/api/admin/marks`, options);
    if (!response.ok) {
      alert(`Error occured`)
    }
    this.fetchData();
  }
}

class AttendanceView {

  constructor(page,onChangeDataEventHandler) {
    this.selectedRow = null;

    this.onEditIconClickEventHandler = this.#onEditIconClickEventHandler.bind(this);
    this.onTableClickEventHandler = this.#onTableClickEventHandler.bind(this);
    this.onSubmitEditionEventHandler = this.#onSubmitEditionEventHandler.bind(this);
    this.onSubmitDeletionEventHandler = this.#onSubmitDeletionEventHandler.bind(this);
    this.onSubmitCreationEventHandler = this.#onSubmitCreationEventHandler.bind(this);
    this.onDeleteIconClickEventHandler = this.#onDeleteIconClickEventHandler.bind(this);
    this.onCreateIconClickEventHandler = this.#onCreateIconClickEventHandler.bind(this);


    this.callback=onChangeDataEventHandler;
    
    let newItemHTML = `
    <div id="tableButtonsId" class="col d-flex flex-row-reverse">
    <div class="p-1" data-bs-toggle="modal" data-bs-target="#deleteModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z">
            </path>
            <path
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z">
            </path>
        </svg>
    </div>
    <div class="p-1" data-bs-toggle="modal" data-bs-target="#editModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil"
            viewBox="0 0 16 16">
            <path
                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
        </svg>
    </div>
    <div class="p-1" id="addIconId" data-bs-toggle="modal" data-bs-target="#createModalId">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-lg"
            viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
        </svg>
    </div>
    </div>


    <div class="container-fluid shadow-lg mt-3 table-responsive small">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
              <th scope="col">Зайняття #</th>
              <th scope="col">Предмет</th>
              <th scope="col">Назва</th>
              <th scope="col">ПІБ Студента</th>
              <th scope="col">% Присутності</th>
          </tr>
        </thead>
        <tbody id="table" class="table-group-divider text-break">
       </tbody>
      </table>
    </div>


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
    page.replaceChildren(...tempContainer.childNodes);  
    
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

    this.fetchData();
  }

  async fetchData() {
    let table = document.getElementById("table");

    let data = await this.callback();
    //fetching data to dropdown

    let newItemHTML = '';

    data.attendance.forEach(element => {
      newItemHTML += `<tr>
      <td>${element["meeting_id"]}</td>
      <td hidden>${element["subject_id"]}</td>
      <td hidden>${element["email"]}</td>
      <td>${element["subject_name"]}</td>
      <td>${element["meeting_name"]}</td>
      <td>${element["lastname"]} ${element["secondname"]} ${element["firstname"]}</td>
      <td>${element["percentage"]}</td>
      </tr>`
    });
    this.attendies = data.attendies;
    this.meetings = data.meetings;

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

  #onCreateIconClickEventHandler(){
    let form = document.getElementById("createFormId");   
    let attendies=''
    this.attendies.forEach(element=>{
      attendies += `<option value="${element["email"]}|${element["id"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]} (${element["name"]})</option>`;
    });
    
    let meetings=''
    this.meetings.forEach(element=>{
      meetings += `<option value="${element["id"]}">${element["name"]}</option>`;
    });
    
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
    form.replaceChildren(...tempContainer.childNodes);
  }

  #onEditIconClickEventHandler() {
    let form = document.getElementById("editFormId");
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

      let attendies=''
      this.attendies.forEach(element=>{
        attendies += `<option value="${element["email"]}|${element["id"]}">${element["lastname"]} ${element["secondname"]} ${element["firstname"]} (${element["name"]})</option>`;
      });
      
      let meetings=''
      this.meetings.forEach(element=>{
        meetings += `<option value="${element["id"]}">${element["name"]}</option>`;
      });
      
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
                  <input type="text" class="form-control" id="exampleFormControlInput5" value="${cells[6].textContent}">
              </div>
              <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Редагувати</button>
      </div>`;
    }

    let tempContainer = document.createElement('div');
    tempContainer.innerHTML = newItemHTML;
    form.replaceChildren(...tempContainer.childNodes);
  }

  #onDeleteIconClickEventHandler(){
    let form = document.getElementById("deleteFormId");
    let newItemHTML
    if (!this.selectedRow){
      newItemHTML =         
      `<div class="modal-content rounded-3 shadow">
      <div class="modal-body p-4 text-center">
      <p class="mb-0">Потрібно виділити дані</p>
      </div>
      <div class="modal-footer flex-nowrap p-0">
      <button type="button" class="bg-warning btn btn-lg fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end" data-bs-dismiss="modal"><strong>Yes</strong></button>
      </div></div>`;
    }else{
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

    let ids = createForm[0].value.split('|'); 

    var data = {
      "meeting_id": parseInt(createForm[1].value),
      "student_id": ids[0],
      "subject_id": parseInt(ids[1]),
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

    const response = await fetch(`http://${server}/api/admin/attendance`, options);
    if (!response.ok) {
      alert(`Error occured`)
    }
    this.fetchData();
  }

  async #onSubmitEditionEventHandler(event) {
    event.preventDefault();
    var editForm = document.getElementById("editFormId");

    let ids = editForm[0].value.split('|'); 

    var data = {
      "meeting_id": parseInt(editForm[1].value),
      "student_id": ids[0],
      "subject_id": parseInt(ids[1]),
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

    const response = await fetch(`http://${server}/api/admin/attendance`, options);
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
      "meeting_id": parseInt(cells[0].textContent),
      "student_id": cells[2].textContent,
      "subject_id": parseInt(cells[1].textContent),
    }

    var options = {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify(data)
    };

    const response = await fetch(`http://${server}/api/admin/attendance`, options);
    if (!response.ok) {
      alert(`Error occured`)
    }
    this.fetchData();
  }
}

class LogsView {

  constructor(page,onChangeDataEventHandler) {
    this.selectedRow = null;

    this.onTimeFilterLowerboundTextChanged = this.#onTimeFilterLowerboundTextChanged.bind(this);
    this.onTimeFilterUpperboundTextChanged = this.#onTimeFilterUpperboundTextChanged.bind(this);
    this.onEventFilterTextChanged = this.#onEventFilterTextChanged.bind(this);
    // this.fetchData = this.#fetchData.bind(this);

    this.callback=onChangeDataEventHandler;
    
    let newItemHTML = `
    <div class="container-fluid mt-3 row">
    <div class="mb-3 col">
      <input type="email" class="form-control" id="timeFilterLowerboundId" placeholder="Час з">
    </div>
    <div class="mb-3 col">
      <input type="email" class="form-control" id="timeFilterUpperboundId" placeholder="Час по">
    </div>
    <div class="mb-3 col">
      <input type="email" class="form-control" id="eventFilterId" placeholder="Подія">
    </div>
  </div>


    <div class="container-fluid shadow-lg mt-3 table-responsive small">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Час</th>
            <th scope="col">Подія</th>
          </tr>
        </thead>
        <tbody id="table" class="table-group-divider text-break">
       </tbody>
      </table>
    </div>
    `;
    let tempContainer = document.createElement('div');
    tempContainer.innerHTML = newItemHTML;
    page.replaceChildren(...tempContainer.childNodes);  
    
    let timeFilterLowerbound = document.getElementById("timeFilterLowerboundId");
    timeFilterLowerbound.addEventListener("input",this.onTimeFilterLowerboundTextChanged)

    let timeFilterUpperbound = document.getElementById("timeFilterUpperboundId");
    timeFilterUpperbound.addEventListener("input",this.onTimeFilterUpperboundTextChanged)

    let eventFilter = document.getElementById("eventFilterId");
    eventFilter.addEventListener("input",this.onEventFilterTextChanged)


    this.fetchData();
  }

  async fetchData() {
    let table = document.getElementById("table");

    let data = await this.callback(this.lowerBound,this.upperBound,this.eventText);
    //fetching data to dropdown

    let newItemHTML = '';

    data.forEach(element => {
      newItemHTML += `<tr>
      <td>${element["id"]}</td>
      <td>${element["time"]}</td>
      <td>${element["description"]}</td>
      </tr>`
    });

    let tempContainer = document.createElement('tbody');

    tempContainer.innerHTML = newItemHTML;

    table.replaceChildren(...tempContainer.childNodes);

  }
  #onTimeFilterLowerboundTextChanged(){
    let timeFilterLowerbound = document.getElementById("timeFilterLowerboundId");
    this.lowerBound = timeFilterLowerbound.value;
    console.log(this.lowerBound);
    this.fetchData();
  }
  #onTimeFilterUpperboundTextChanged(){
    let timeFilterUpperbound = document.getElementById("timeFilterUpperboundId");
    this.upperBound = timeFilterUpperbound.value;
    console.log(this.upperBound);
    this.fetchData();
  }
  #onEventFilterTextChanged(){
    let eventFilter = document.getElementById("eventFilterId");
    this.eventText = eventFilter.value;
    console.log(this.eventText);
    this.fetchData();
  }

}



async function getTeachersData() {

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

  let responce = await fetch(`http://${server}/api/admin/teachers`, options);
  let data = await responce.json();
  return data;
}
async function getStudentsData() {

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

  let responce = await fetch(`http://${server}/api/admin/students`, options);
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

  let responce = await fetch(`http://${server}/api/admin/subjects`, options);
  let data = await responce.json();
  return data;
}
async function getMeetingsData() {

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

  let responce = await fetch(`http://${server}/api/admin/meetings`, options);
  let data = await responce.json();
  return data;
}

async function getTasksData() {

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

  let responce = await fetch(`http://${server}/api/admin/tasks`, options);
  let data = await responce.json();
  return data;
}

async function getAttendiesData() {

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

  let responce = await fetch(`http://${server}/api/admin/attendies`, options);
  let data = await responce.json();
  return data;
}

async function getMarksData() {

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

  let responce = await fetch(`http://${server}/api/admin/marks`, options);
  let data = await responce.json();
  return data;
}

async function getAttendanceData() {

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

  let responce = await fetch(`http://${server}/api/admin/attendance`, options);
  let data = await responce.json();
  return data;
}

async function getLogsData(lowerBound,upperBound,eventText) {

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

  let reqString = `http://${server}/api/admin/logs`

  const url = new URL(reqString);
  const searchParams = new URLSearchParams();

  if (lowerBound){
    searchParams.append ("time_lowerbound",lowerBound)
  }
  if (upperBound){
    searchParams.append("time_upperbound",upperBound)
  }
  if (eventText){
    searchParams.append("event",eventText)
  }
  url.search = searchParams.toString() 

  console.log(url.toString())

  let responce = await fetch(url.toString(), options);
  let data = await responce.json();
  return data;
}



document.addEventListener('DOMContentLoaded',function () {

  if (window.sessionStorage.getItem("role") != 3){
      window.location.href = "login.html";
  }

  document.getElementById("logoutButton").addEventListener("click", async function (event) {
      window.sessionStorage.removeItem('authorization');
      window.location.href = "login.html";
  });









  let view = new ServiceView()
  var page = document.getElementById("pageContainer");
  var temp = new TeachersView(page,async ()=>{
    let data = await getTeachersData();
    console.log(data);
    return data;
  });
  document.getElementById('navPanel').addEventListener('click',async function(event){
    
    
    console.log(event.target.textContent)
    switch (event.target.textContent) {
      case "Вчителя":  
        temp = new TeachersView(page,async ()=>{
          let data = await getTeachersData();
          console.log(data);
          return data;
        });
        break;
      case "Студенти":
        temp = new StudentsView(page,async ()=>{
          let data = await getStudentsData();
          console.log(data);
          return data;
        });
        break;
      case "Успішність":
        temp = new MarksView(page,async ()=>{
          let tasks = await getTasksData();
          let attendies = await getAttendiesData();
          let marks = await getMarksData();
          console.log(tasks,marks,attendies);
          return {
            tasks: tasks,
            attendies: attendies,
            marks: marks
          }
        });
        break; 
      case "Завдання":
        temp = new TasksView(page,async ()=>{
          let tasks = await getTasksData();
          let subjects = await getSubjectsData();
          console.log(tasks,subjects);
          return {
            tasks: tasks,
            subjects: subjects
          }
        });
        break; 
      case "Відвідуваність":
        temp = new AttendanceView(page,async ()=>{
          let meetings = await getMeetingsData();
          let attendies = await getAttendiesData();
          let attendance = await getAttendanceData();
          console.log(meetings,attendance,attendies);
          return {
            meetings: meetings,
            attendies: attendies,
            attendance: attendance
          }
        });
        break; 
      case "Зібрання":
        temp = new MeetingsView(page,async ()=>{
          let meetings = await getMeetingsData();
          let subjects = await getSubjectsData();
          console.log(meetings,subjects);
          return {
            meetings: meetings,
            subjects: subjects
          }
        });
        break; 
      case "Предмети":
        temp = new SubjectsView(page,async ()=>{
          let subjects = await getSubjectsData();
          let teachers = await getTeachersData();
          console.log(subjects,teachers);
          return {
            subjects: subjects,
            teachers: teachers
          };  
        });
        break; 
      case "Записи студентів":
        temp = new AttendiesView(page,async ()=>{
          let subjects = await getSubjectsData();
          let students = await getStudentsData();
          let attendies = await getAttendiesData();
          console.log(subjects,students,attendies);
          return {
            subjects: subjects,
            students: students,
            attendies: attendies
          };  
        });
        break;
        case "Журнал": 
         temp = new LogsView(page,async (lowerBound,upperBound,eventText)=>{
            let logs = await getLogsData(lowerBound,upperBound,eventText);
            console.log(logs);
            return logs;  
          });
          break; 
      }
    })
});

class ServiceView{
  constructor(){
    var archiveButton = document.getElementById("archiveButtonId");
    var restoreButton = document.getElementById("restoreButtonId");
    var cloneButton = document.getElementById("cloneButtonId");

    this.onArchiveButtonClickEventListener = this.#onArchiveButtonClickEventListener.bind(this)
    this.onRestoreButtonClickEventListener = this.#onRestoreButtonClickEventListener.bind(this)
    this.onCloneButtonClickEventListener = this.#onCloneButtonClickEventListener.bind(this)
    this.getStatus = this.#getStatus.bind(this)

    archiveButton.addEventListener("click",this.onArchiveButtonClickEventListener)
    restoreButton.addEventListener("click",this.onRestoreButtonClickEventListener)
    cloneButton.addEventListener("click",this.onCloneButtonClickEventListener)

    this.getStatus()
  }
  async #getStatus(){

    var headers = {
      'Content-Type': 'application/json',
      'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };
   
    var options = {
      method: 'GET',
      headers: headers,
    };
  
    let archiveStatus = await fetch(`http://${server}/api/admin/db/status?action=Archive`, options);       
    let cloneStatus = await fetch(`http://${server}/api/admin/db/status?action=Clone`, options);  
    let restoreStatus = await fetch(`http://${server}/api/admin/db/status?action=Restore`, options);
   
    if (archiveStatus.ok){
      let newItemHTML = 
      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
      </svg><a class="dropdown-item">Архівувати</a>`;
      let tempContainer = document.createElement('tbody');
      tempContainer.innerHTML = newItemHTML;
      document.getElementById("archiveButtonId").replaceChildren(...tempContainer.childNodes);
    } else {
      let newItemHTML = 
      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
      </svg>
      <a class="dropdown-item">Архівувати</a>`;
      let tempContainer = document.createElement('tbody');
      tempContainer.innerHTML = newItemHTML;
      document.getElementById("archiveButtonId").replaceChildren(...tempContainer.childNodes);
    }
    if (restoreStatus.ok){
      let newItemHTML = 
      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
      </svg><a class="dropdown-item">Відновити</a>`;
      let tempContainer = document.createElement('tbody');
      tempContainer.innerHTML = newItemHTML;
      document.getElementById("restoreButtonId").replaceChildren(...tempContainer.childNodes);
    } else {
      let newItemHTML = 
      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
      </svg>
      <a class="dropdown-item">Відновити</a>`;
      let tempContainer = document.createElement('tbody');
      tempContainer.innerHTML = newItemHTML;
      document.getElementById("restoreButtonId").replaceChildren(...tempContainer.childNodes);
    }
    if (cloneStatus.ok){
      let newItemHTML = 
      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
      </svg><a class="dropdown-item">Копіювати</a>`;
      let tempContainer = document.createElement('tbody');
      tempContainer.innerHTML = newItemHTML;
      document.getElementById("cloneButtonId").replaceChildren(...tempContainer.childNodes);
    } else {
      let newItemHTML = 
      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
      </svg>
      <a class="dropdown-item">Копіювати</a>`;
      let tempContainer = document.createElement('tbody');
      tempContainer.innerHTML = newItemHTML;
      document.getElementById("cloneButtonId").replaceChildren(...tempContainer.childNodes);
    }
  
  }  
  async #onArchiveButtonClickEventListener(){   
    var headers = {
     'Content-Type': 'application/json',
     'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };
  
    // Define the options for the fetch request
    var options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({"action":"Archive"})
    };
    
    const responce = await fetch(`http://${server}/api/admin/db`, options);   
    
    if (!responce.ok){
      alert("Error occured");
    }
  }
  async #onRestoreButtonClickEventListener(){
    var headers = {
      'Content-Type': 'application/json',
      'AUTHORIZATION': window.sessionStorage.getItem('authorization')
     };
   
     // Define the options for the fetch request
     var options = {
       method: 'POST',
       headers: headers,
       body: JSON.stringify({"action":"Restore"})
     };
   
    const responce = await fetch(`http://${server}/api/admin/db`, options);   
    
    if (!responce.ok){
      alert("Error occured");
    }
  }
  async #onCloneButtonClickEventListener(){
    var headers = {
      'Content-Type': 'application/json',
      'AUTHORIZATION': window.sessionStorage.getItem('authorization')
     };
   
     // Define the options for the fetch request
     var options = {
       method: 'POST',
       headers: headers,
       body: JSON.stringify({"action":"Clone"})
     };
   
    
    const responce = await fetch(`http://${server}/api/admin/db`, options);   
    
    if (!responce.ok){
      alert("Error occured");
    }

  }
}