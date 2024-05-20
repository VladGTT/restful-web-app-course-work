const roleMapping = {
    "admin": 3,
    "student": 2,
    "teacher": 1,
};
const server = 'localhost:8080';

function validatePassword(password){
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return pattern.test(password)
}

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // const formData = new FormData(document.getElementById("loginForm")); 

    var email = document.getElementById('floatingEmail').value;
    var password = document.getElementById('floatingPassword').value;

    if (!validatePassword(password)){
        alert("Incorrect Password: should containe at least 1 digit, 1 special symbol, 1 lowercase, 1 uppercase, length of 8")
        return
    }


    var role = document.querySelector('input[name="role"]:checked').value;

    var payload = JSON.stringify({
        "email": email,
        "password": password,
        "role": roleMapping[role]
    });

    // Define the headers for the request
    var headers = {
        'Content-Type': 'application/json'
    };

    // Define the options for the fetch request
    var options = {
        method: 'POST',
        headers: headers,
        body: payload
    };

    // Make the POST request
    let responce = await fetch(`http://${server}/api/login`, options);
    if (responce.status == 401) {
        alert("Incorrect credentials")
        return
    }
    if (responce.status == 500) {
        alert("Internal server error")
        return
    }
    if (!responce.ok) {
        alert("Cant connect to server")
        return
    }

    let data = await responce.json();

    console.log('POST request successful', data);

    window.sessionStorage.setItem("authorization", data["authorization"])
    window.sessionStorage.setItem("role", roleMapping[role])
    
    window.sessionStorage.setItem("server", server)

    window.location.href = `${role}.html`;


});
