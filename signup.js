class SignupPage {

    constructor() {

        this.form =
            document.getElementById("signupForm");

        this.nameInput =
            document.getElementById("nameInput");

        this.emailInput =
            document.getElementById("emailInput");

        this.passwordInput =
            document.getElementById("passwordInput");

        this.role1 =
            document.getElementById("role1");

        this.role2 =
            document.getElementById("role2");

        this.selectedRole =
            "donor";

        this.initialize();
    }

    initialize() {

        this.addEvents();
    }

    addEvents() {

        this.role1.addEventListener(
            "click",
            () => this.selectDonor()
        );

        this.role2.addEventListener(
            "click",
            () => this.selectRecipient()
        );

        this.form.addEventListener(
            "submit",
            (event) => this.handleSignup(event)
        );
    }

    selectDonor() {

        this.selectedRole =
            "donor";

        this.role1.classList.add("active");

        this.role2.classList.remove("active");

        this.role1.querySelector(
            "input"
        ).checked = true;
    }

    selectRecipient() {

        this.selectedRole =
            "recipient";

        this.role2.classList.add("active");

        this.role1.classList.remove("active");

        this.role2.querySelector(
            "input"
        ).checked = true;
    }

    handleSignup(event) {

        event.preventDefault();

        const name =
            this.nameInput.value.trim();

        const email =
            this.emailInput.value.trim();

        const password =
            this.passwordInput.value.trim();

        if(
            name === "" ||
            email === "" ||
            password === ""
        ){

            alert(
                "Please fill all fields"
            );

            return;
        }

        localStorage.setItem(
            "userName",
            name
        );

        localStorage.setItem(
            "userEmail",
            email
        );

        localStorage.setItem(
            "userPassword",
            password
        );

        localStorage.setItem(
            "userRole",
            this.selectedRole
        );

        alert(
            "Account Created Successfully"
        );

        window.location.href =
            "login.html";
    }
}

new SignupPage();