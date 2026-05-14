class AboutContactPage {

    constructor() {

        this.loginButton =
            document.getElementById("loginBtn");

        this.signupButton =
            document.getElementById("signupBtn");

        this.homeButton =
            document.getElementById("homeBtn");

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

        this.homeButton.addEventListener(
            "click",
            () => this.goHome()
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

    goHome() {

        window.location.href =
            "home.html";
    }
}

new AboutContactPage();