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
    let name = document.querySelector('input[type="text"]').value;
    let email = document.querySelector('input[type="email"]').value;
    let password = document.querySelector('input[type="password"]').value;

    if(name === "" || email === "" || password === ""){
        alert("Please fill all fields");
    } else {
        let isRecipient = role2.classList.contains("active");
        let userRole = isRecipient ? "recipient" : "donor";
        
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userName", name);

        alert("Account Created Successfully!");

        if (userRole === "recipient") {
            window.location.href = "recipient dashboard.html";
        } else {
            alert("Donor dashboard is under development. Redirecting to Home.");
            window.location.href = "home.html";
        }
    }
}