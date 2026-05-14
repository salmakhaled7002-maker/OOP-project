class HomePage {

    constructor() {

        this.startButton =
            document.getElementById("startBtn");

        this.loginButton =
            document.querySelector(".login-btn");

        this.initialize();
    }

    initialize() {

        this.addEvents();
    }

    addEvents() {

        this.startButton.addEventListener(
            "click",
            () => this.startApp()
        );

        this.loginButton.addEventListener(
            "click",
            () => this.openLogin()
        );
    }

    startApp() {

        window.location.href =
            "contact and about us.html";
    }

    openLogin() {

        window.location.href =
            "login.html";
    }
}

new HomePage();