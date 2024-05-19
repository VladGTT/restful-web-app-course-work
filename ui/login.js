const roleMapping = {
    "admin": 3, 
    "student": 2, 
    "teacher": 1, 
};
const server = 'localhost:8080';

document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    // const formData = new FormData(document.getElementById("loginForm")); 

    var email = document.getElementById('floatingEmail').value;
    var password = document.getElementById('floatingPassword').value;

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
    try{
        let responce = await fetch(`http://${server}/api/login`, options);
        let data = await responce.json();

        console.log('POST request successful', data);

        window.sessionStorage.setItem("authorization", data["authorization"])
        window.sessionStorage.setItem("role", roleMapping[role])
        window.sessionStorage.setItem("server", server)
        
        window.location.href = `${role}.html`;  

    }catch(error){
        console.error(error);
        alert("Error occured")
    }
    
});
