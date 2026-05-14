class HomePage {

    constructor() {

        this.startButton =
            document.getElementById("startBtn");

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
    }

    startApp() {

        window.location.href =
            "contact and about us.html";
    }
}

new HomePage();