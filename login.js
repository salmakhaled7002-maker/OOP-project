class LoginPage {

    constructor() {

        this.form =
            document.getElementById("loginForm");

        this.emailInput =
            document.getElementById("emailInput");

        this.passwordInput =
            document.getElementById("passwordInput");

        this.rememberCheckbox =
            document.getElementById("remember");

        this.initialize();
    }

    initialize() {

        this.loadRememberedData();

        this.addEvents();
    }

    addEvents() {

        this.form.addEventListener(
            "submit",
            (event) => this.handleLogin(event)
        );
    }

    loadRememberedData() {

        const rememberedEmail =
            localStorage.getItem("rememberEmail");

        const rememberedPassword =
            localStorage.getItem("rememberPassword");

        if(rememberedEmail && rememberedPassword){

            this.emailInput.value =
                rememberedEmail;

            this.passwordInput.value =
                rememberedPassword;

            this.rememberCheckbox.checked =
                true;
        }
    }

    handleLogin(event) {

        event.preventDefault();

        const email =
            this.emailInput.value.trim();

        const password =
            this.passwordInput.value.trim();

        const remember =
            this.rememberCheckbox.checked;

        const savedEmail =
            localStorage.getItem("userEmail");

        const savedPassword =
            localStorage.getItem("userPassword");

        const savedRole =
            localStorage.getItem("userRole");

        if(email === "" || password === ""){

            alert(
                "Please enter email and password"
            );

            return;
        }

        if(email === savedEmail &&
           password === savedPassword){

            this.handleRememberMe(
                remember,
                email,
                password
            );

            alert(
                "Login Successful"
            );

            this.redirectUser(savedRole);
        }

        else{

            alert(
                "Wrong Email Or Password"
            );
        }
    }

    handleRememberMe(
        remember,
        email,
        password
    ){

        if(remember){

            localStorage.setItem(
                "rememberEmail",
                email
            );

            localStorage.setItem(
                "rememberPassword",
                password
            );
        }

        else{

            localStorage.removeItem(
                "rememberEmail"
            );

            localStorage.removeItem(
                "rememberPassword"
            );
        }
    }

    redirectUser(role) {

        if(role === "donor"){

            window.location.href =
                "donor dashboard1.html";
        }

        else{

            window.location.href =
                "recipient dashboard.html";
        }
    }
}

new LoginPage();