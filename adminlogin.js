/* =========================================================
   JASR EL KHEIR - ADMIN LOGIN SYSTEM
   FULL WORKING VERSION
========================================================= */

class AdminAuth {

    constructor() {

        this.maxAttempts = 5;

        this.lockTime = 24 * 60 * 60 * 1000;

        this.form =
            document.getElementById("adminLoginForm");

        this.emailInput =
            document.getElementById("adminEmail");

        this.passwordInput =
            document.getElementById("adminPassword");

        this.errorMessage =
            document.getElementById("errorMessage");

        this.submitBtn =
            document.getElementById("submitBtn");

        this.seedMainAdmin();

        this.checkLockStatus();

        this.init();
    }

    /* ===============================
       CREATE DEFAULT ADMIN
    =============================== */

    seedMainAdmin() {

        let allUsers =
            JSON.parse(
                localStorage.getItem("allUsers")
            ) || [];

        const hasAdmin =
            allUsers.some(user =>
                user.role === "System Admin"
            );

        if (!hasAdmin) {

            allUsers.push({

                id: Date.now(),

                name: "Main Admin",

                email: "admin@jasralkheir.org",

                password: "Admin@2026",

                role: "System Admin",

                joinedDate:
                    new Date().toLocaleDateString()

            });

            localStorage.setItem(
                "allUsers",
                JSON.stringify(allUsers)
            );
        }
    }

    /* ===============================
       START SYSTEM
    =============================== */

    init() {

        if (!this.form) return;

        this.form.addEventListener(
            "submit",
            (e) => {

                e.preventDefault();

                this.handleLogin();
            }
        );
    }

    /* ===============================
       CHECK IF LOCKED
    =============================== */

    checkLockStatus() {

        const lockUntil =
            localStorage.getItem(
                "adminLockUntil"
            );

        if (!lockUntil) return;

        const currentTime =
            new Date().getTime();

        if (currentTime < Number(lockUntil)) {

            this.lockSystem(
                Number(lockUntil)
            );

        } else {

            localStorage.removeItem(
                "adminAttempts"
            );

            localStorage.removeItem(
                "adminLockUntil"
            );
        }
    }

    /* ===============================
       LOGIN PROCESS
    =============================== */

    handleLogin() {

        const email =
            this.emailInput.value.trim();

        const password =
            this.passwordInput.value.trim();

        const allUsers =
            JSON.parse(
                localStorage.getItem("allUsers")
            ) || [];

        let attempts =
            Number(
                localStorage.getItem(
                    "adminAttempts"
                )
            ) || 0;

        const foundAdmin =
            allUsers.find(user =>

                user.email === email &&
                user.password === password &&
                user.role === "System Admin"
            );

        if (foundAdmin) {

            localStorage.removeItem(
                "adminAttempts"
            );

            localStorage.removeItem(
                "adminLockUntil"
            );

            this.loginSuccess(foundAdmin);

        } else {

            attempts++;

            localStorage.setItem(
                "adminAttempts",
                attempts
            );

            const remaining =
                this.maxAttempts - attempts;

            if (attempts >= this.maxAttempts) {

                const lockUntil =
                    new Date().getTime() +
                    this.lockTime;

                localStorage.setItem(
                    "adminLockUntil",
                    lockUntil
                );

                this.lockSystem(lockUntil);

            } else {

                this.showError(
                    `Wrong admin credentials. Remaining attempts: ${remaining}`
                );
            }
        }
    }

    /* ===============================
       LOCK SYSTEM
    =============================== */

    lockSystem(lockUntil) {

        this.emailInput.disabled = true;

        this.passwordInput.disabled = true;

        this.submitBtn.disabled = true;

        const timer =
            setInterval(() => {

                const currentTime =
                    new Date().getTime();

                const remainingTime =
                    lockUntil - currentTime;

                if (remainingTime <= 0) {

                    clearInterval(timer);

                    localStorage.removeItem(
                        "adminAttempts"
                    );

                    localStorage.removeItem(
                        "adminLockUntil"
                    );

                    this.emailInput.disabled = false;

                    this.passwordInput.disabled = false;

                    this.submitBtn.disabled = false;

                    this.submitBtn.innerText =
                        "Login";

                    this.hideError();

                    return;
                }

                const hours =
                    Math.floor(
                        remainingTime /
                        (1000 * 60 * 60)
                    );

                const minutes =
                    Math.floor(
                        (
                            remainingTime %
                            (1000 * 60 * 60)
                        ) /
                        (1000 * 60)
                    );

                const seconds =
                    Math.floor(
                        (
                            remainingTime %
                            (1000 * 60)
                        ) / 1000
                    );

                this.submitBtn.innerText =
                    `Locked ${hours}h ${minutes}m ${seconds}s`;

                this.showError(
                    "Too many failed attempts. Try again later."
                );

            }, 1000);
    }

    /* ===============================
       SUCCESS LOGIN
    =============================== */

    loginSuccess(admin) {

        localStorage.setItem(
            "userRole",
            admin.role
        );

        localStorage.setItem(
            "userEmail",
            admin.email
        );

        localStorage.setItem(
            "loggedInAdmin",
            JSON.stringify(admin)
        );

        this.hideError();

        this.submitBtn.innerText =
            "Success Login...";

        setTimeout(() => {

            window.location.href =
                "admindashboard.html";

        }, 1000);
    }

    /* ===============================
       ERROR UI
    =============================== */

    showError(message) {

        this.errorMessage.style.display =
            "block";

        this.errorMessage.innerText =
            message;
    }

    hideError() {

        this.errorMessage.style.display =
            "none";
    }
}

/* =========================================================
   START SYSTEM
========================================================= */

window.onload = () => {

    new AdminAuth();
};