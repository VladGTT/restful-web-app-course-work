

const server = window.sessionStorage.getItem("server");


async function save_pdf() {
    var win = window.open('', '', 'height=700,width=700');
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
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return pattern.test(password)
}

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

        document.getElementById("profileModalLabel").textContent = `${data[0]["lastname"]} ${data[0]["secondname"]} ${data[0]["firstname"]} [${data[0]["occupation"]}]`;
        document.getElementById("profileEmail").value = `${data[0]["email"]}`;
    } catch (error) {
        console.log(error);
    }
}
async function update_password() {
    var headers = {
        // 'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };
    let password = document.getElementById("profilePassword").value;
    if (!validatePassword(password)) {
        alert("Incorrect password")
        return
    }
    var payload = {
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

class MeetingsView {

    constructor(onChangeDataEventHandler) {
        this.selectedRow = null;

        this.onTableClickEventHandler = this.#onTableClickEventHandler.bind(this);

        this.callback = onChangeDataEventHandler;
        let newItemHTML =
            `<table class="table table-striped table-sm">
            <thead>
              <tr>
              <th scope="col">Зайняття #</th>
              <th scope="col">Назва</th>
              <th scope="col">Дати</th>
              <th scope="col">Відсоток присутності</th>
              </tr>
            </thead>
            <tbody id="table" class="table-group-divider text-break">
             
           </tbody>
          </table>`;
        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("tableContainer").replaceChildren(...tempContainer.childNodes);
        document.getElementById("printButton").classList.remove("visually-hidden")

        document.getElementById("table").addEventListener("click", this.onTableClickEventHandler)

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
                <td>${element['attendance']}</td>
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

        this.onTableClickEventHandler = this.#onTableClickEventHandler.bind(this);

        this.callback = onChangeDataEventHandler;

        let newItemHTML = `
        <table class="table table-striped table-sm">
          <thead>
            <tr>
                <th scope="col"># Завдання</th>
                <th scope="col">Назва</th>
                <th scope="col">Опис</th>
                <th scope="col">Балл</th>
            </tr>
          </thead>
          <tbody id="table" class="table-group-divider text-break">
         </tbody>
        </table>
      `;
        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("tableContainer").replaceChildren(...tempContainer.childNodes);

        document.getElementById("printButton").classList.remove("visually-hidden")
        document.getElementById("printButton").addEventListener("click", save_pdf)

        this.fetchData();
    }

    async fetchData() {
        let data = await this.callback();
        //fetching data to dropdown

        let newItemHTML = '';

        data.forEach(element => {
            newItemHTML +=
                `<tr>
            <td>${element["id"]}</td>
            <td>${element["name"]}</td>
            <td>${element["description"]}</td>
            <td>${element["mark"]}</td>
        </tr>`;
        });

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

}


class StatsView {
    constructor(onChangeDataEventHandler) {
        this.selectedRow = null;

        this.callback = onChangeDataEventHandler;
        let newItemHTML =
        `<div class="container p-4 gap-4 align-items-center">
            <div class="row p-4 align-items-center gap-4">
              <div class="col border border-primary bg-opacity-10 bg-primary rounded">
                <p class="h3 text-center pt-3">Середній бал по предмету</p>
                <p class="h4 text-center text-body-secondary" id="averageMarkPerSubject">Значення</p>
                <p class="">Середнє арифметичне оцінок за всі завдання</p>
              </div>
              <div class="col border border-primary bg-opacity-10 bg-primary rounded">
                <p class="h3 text-center pt-3">Найкраще написане завдання</p>
                <p class="h4 text-center text-body-secondary" id="taskWithHighestMark">Значення</p>
                <p class="">Завдання за найвищою оцінкою</p>
              </div>
              <div class="col border border-primary bg-opacity-10 bg-primary rounded">
                <p class="h3 text-center pt-3">Найгірше написане завдання</p>
                <p class="h4 text-center text-body-secondary" id="taskWithLowestMark">Значення</p>
                <p class="">Завдання за найнижчею оцінкою</p>
              </div>
            </div>
            <div class="row p-4 align-items-center gap-4">
              <div class="col border border-primary bg-opacity-10 bg-primary rounded">
                <p class="h3 text-center pt-3">Кількість відвіданих зайнять</p>
                <p class="h4 text-center text-body-secondary" id="numberOfAttendedMeetings">Значення</p>
                
              </div>
              <div class="col border border-primary bg-opacity-10 bg-primary rounded">
                <p class="h3 text-center pt-3">Кількість виконаних завдань</p>
                <p class="h4 text-center text-body-secondary" id="numberOfCompletedTasks">Значення</p>
              </div>
            </div>
          </div>`;
        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = newItemHTML;
        document.getElementById("tableContainer").replaceChildren(...tempContainer.childNodes);
        document.getElementById("printButton").classList.add("visually-hidden")

        this.fetchData()
    }

    async fetchData() {
        let data = await this.callback();

        let averageMarkPerSubject = data["average_mark_per_subject"] ?? {"mark": "NaN"}
        let taskWithHighestMark = data["task_with_highest_mark"] ?? {"name": "NaN","mark": "NaN"}
        let taskWithLowestMark = data["task_with_lowest_mark"] ?? {"name": "NaN","mark": "NaN"}
        let numberOfAttendedMeetings = data["number_of_attended_meetings"] ?? {"count": "NaN"}
        let numberOfCompletedTasks = data["number_of_completed_tasks"] ?? {"count": "NaN"}

        document.getElementById("averageMarkPerSubject").textContent = `${averageMarkPerSubject["mark"]}`;
        document.getElementById("taskWithHighestMark").textContent = `${taskWithHighestMark["name"]} (${taskWithHighestMark["mark"]})`;
        document.getElementById("taskWithLowestMark").textContent = `${taskWithLowestMark["name"]} (${taskWithLowestMark["mark"]})`;
        document.getElementById("numberOfAttendedMeetings").textContent = `${numberOfAttendedMeetings["count"]}`;
        document.getElementById("numberOfCompletedTasks").textContent = numberOfCompletedTasks["count"];
    }
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

    let responce = await fetch(`http://${server}/api/student/subjects`, options);
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

    let responce = await fetch(`http://${server}/api/student/meetings?subject_id=${subjectId}`, options);
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

    let responce = await fetch(`http://${server}/api/student/tasks?subject_id=${subjectId}`, options);
    let data = await responce.json();
    return data;
}

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

    let responce = await fetch(`http://${server}/api/student/stats?subject_id=${subjectId}`, options);
    let data = await responce.json();
    return data;
}











document.addEventListener('DOMContentLoaded',async function () {

    if (window.sessionStorage.getItem("role") != 2) {
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
    })
    

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
                })
                break;
            case "Успішність":
                var selector = new SubjectsView(async () => {
                    let data = await getSubjectsData();
                    return data;
                },async () =>{
                    var temp = new TasksView(async () => {
                        return await getTasksData(selector.selectedSubject.id)
                    });
                })
                break;
            case "Відвідуваність":
                var selector = new SubjectsView(async () => {
                    let data = await getSubjectsData();
                    return data;
                },async () =>{
                    var temp = new MeetingsView(async () => {
                        return await getMeetingsData(selector.selectedSubject.id)
                    });
                })
                break;
            
        }
    });

    document.getElementById("profileButton").addEventListener("click", fetch_profile)
    document.getElementById("profileUpdateForm").addEventListener("submit", update_password)

});