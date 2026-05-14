class AboutContactPage {

    constructor() {

        this.loginButton =
            document.getElementById("loginBtn");

        this.signupButton =
            document.getElementById("signupBtn");

        this.initialize();
    }

    initialize() {

        this.addEvents();
    }

    addEvents() {

        this.loginButton.addEventListener(
            "click",
            () => this.goLogin()
        );

        this.signupButton.addEventListener(
            "click",
            () => this.goSignup()
        );
    }

    goLogin() {

        window.location.href =
            "login.html";
    }

    goSignup() {

        window.location.href =
            "signup.html";
    }
}

new AboutContactPage();