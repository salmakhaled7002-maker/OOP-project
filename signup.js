let role1 = document.getElementById("role1");
let role2 = document.getElementById("role2");

role1.onclick = function () {

    role1.classList.add("active");
    role2.classList.remove("active");

    role1.querySelector("input").checked = true;

}

role2.onclick = function () {

    role2.classList.add("active");
    role1.classList.remove("active");

    role2.querySelector("input").checked = true;

}

function signup(){

    let name =
    document.querySelector('input[type="text"]').value;

    let email =
    document.querySelector('input[type="email"]').value;

    let password =
    document.querySelector('input[type="password"]').value;

    let role = "donor";

    if(role2.classList.contains("active")){

        role = "recipient";

    }

    if(name === "" || email === "" || password === ""){

        alert("Please fill all fields");

    }

    else{

        localStorage.setItem("userEmail", email);

        localStorage.setItem("userPassword", password);

        localStorage.setItem("userRole", role);

        alert("Account Created Successfully");

        window.location.href = "login.html";

    }

}