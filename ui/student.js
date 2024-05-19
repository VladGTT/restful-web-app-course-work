const server = window.sessionStorage.getItem("server");

async function fetch_subjects(selectedSubject) {
    var headers = {
        // 'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var options = {
        method: 'GET',
        headers: headers,
    };

    console.log(options);

    try {
        const response = await fetch(`http://${server}/api/student/subjects`, options);
        const data = await response.json();
        console.log(data);

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

async function fetch_attendance(selectedSubject) {
    var headers = {
        // 'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var options = {
        method: 'GET',
        headers: headers,
    };

    try {
        const response = await fetch(`http://${server}/api/student/meetings?subject_id=${selectedSubject["id"]}`, options);
        const data = await response.json();
        console.log(data);

        //fetching data to table
        const table = document.getElementById("attendanceTableId")

        let newItemHTML = '';
        data.forEach(element => {
            newItemHTML += `<tr><td>${element["id"]}</td><td>${element["name"]}</td><td>${element["time"]}</td><td>${element["attendance"]}</td></tr>`;
        });

        let tempContainer = document.createElement('tbody');

        tempContainer.innerHTML = newItemHTML;

        table.replaceChildren(...tempContainer.childNodes);
    } catch (error) {
        console.log(error);
    }
}

async function fetch_marks(selectedSubject) {
    var headers = {
        // 'Content-Type': 'application/json',
        'AUTHORIZATION': window.sessionStorage.getItem('authorization')
    };

    var options = {
        method: 'GET',
        headers: headers,
    };

    try {
        const response = await fetch(`http://${server}/api/student/tasks?subject_id=${selectedSubject["id"]}`, options);
        const data = await response.json();
        console.log(data);

        //fetching data to table
        const table = document.getElementById("marksTableId")

        let newItemHTML = '';
        data.forEach(element => {
            newItemHTML += `<tr><td>${element["id"]}</td><td>${element["name"]}</td><td>${element["description"]}</td><td>${element["mark"]}</td></tr>`;
        });

        let tempContainer = document.createElement('tbody');

        tempContainer.innerHTML = newItemHTML;

        table.replaceChildren(...tempContainer.childNodes);


    } catch (error) {
        console.log(error);
    }
}


document.addEventListener('DOMContentLoaded',async function () {
    // Your JavaScript code here
    if (window.sessionStorage.getItem("role") != 2){
        window.location.href = "login.html";
    }


    var selectedSubject = {
        "id": {},
        "name": {},
    };

    await fetch_subjects(selectedSubject);
    await fetch_attendance(selectedSubject);
    await fetch_marks(selectedSubject);

    document.getElementById("subjectsListId").addEventListener("click", async function (event) {

        selectedSubject['id'] = this.childNodes[0].value;
        selectedSubject['name'] = this.childNodes[0].textContent;

        var button = document.getElementById("subjectsSelectButton");

        button.value = selectedSubject["id"];
        button.textContent = selectedSubject["name"];

        await fetch_attendance(selectedSubject);
        await fetch_marks(selectedSubject);

    });

    document.getElementById("logoutButtonId").addEventListener("click", async function (event) {
        window.sessionStorage.removeItem('authorization');
        window.location.href = "login.html";
    });
});
