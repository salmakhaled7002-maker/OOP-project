function login(){
    let email = document.querySelector('input[type="email"]').value;
    let password = document.querySelector('input[type="password"]').value;

    if(email === "" || password === ""){
        alert("Please enter email and password");
    } else {
        
        let savedRole = localStorage.getItem("userRole");

        if (savedRole === "recipient") {
            alert("Login Successful! Welcome back.");
            window.location.href = "recipient dashboard.html";
        } else if (savedRole === "donor") {
            alert("Welcome Donor! Redirecting...");
            window.location.href = "home.html"; 
        } else {
            alert("No account found. Please sign up first.");
            window.location.href = "signup.html";
        }
    }
}