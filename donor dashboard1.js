class DonorDashboard {

    constructor() {

        this.content =
            document.getElementById("content");

        this.balance =
            Number(
                localStorage.getItem("balance")
            ) || 0;

        this.totalDonations =
            Number(
                localStorage.getItem("totalDonations")
            ) || 0;

        this.familiesHelped =
            Number(
                localStorage.getItem("familiesHelped")
            ) || 0;

        this.history =
            JSON.parse(
                localStorage.getItem("history")
            ) || [];

        this.initialize();
    }

    initialize() {

        this.addEvents();

        this.showDashboard();
    }

    addEvents() {

        document
        .getElementById("dashboardBtn")
        .addEventListener(
            "click",
            () => this.showDashboard()
        );

        document
        .getElementById("donationsBtn")
        .addEventListener(
            "click",
            () => this.showDonations()
        );

        document
        .getElementById("profileBtn")
        .addEventListener(
            "click",
            () => this.showProfile()
        );

        document
        .getElementById("settingsBtn")
        .addEventListener(
            "click",
            () => this.showSettings()
        );

        document
        .getElementById("logoutBtn")
        .addEventListener(
            "click",
            () => this.logout()
        );
    }

    saveData() {

        localStorage.setItem(
            "balance",
            this.balance
        );

        localStorage.setItem(
            "totalDonations",
            this.totalDonations
        );

        localStorage.setItem(
            "familiesHelped",
            this.familiesHelped
        );

        localStorage.setItem(
            "history",
            JSON.stringify(this.history)
        );
    }

    showDashboard() {

        let historyHTML = "";

        for(
            let i = 0;
            i < this.history.length;
            i++
        ){

            historyHTML += `

            <div class="request-card">

                <h3>
                    ${this.history[i].title}
                </h3>

                <p>
                    ${this.history[i].description}
                </p>

            </div>

            `;
        }

        if(this.history.length === 0){

            historyHTML = `

            <div class="request-card">

                <p>
                    No donations yet
                </p>

            </div>

            `;
        }

        this.content.innerHTML = `

        <h1 class="title">
            Welcome, Donor 🌱
        </h1>

        <p class="subtitle">
            Give what you can,
            change someone's life
        </p>

        <div class="cards">

            <div class="card">

                <i class="fa-solid fa-wallet"></i>

                <h2>
                    $${this.balance}
                </h2>

                <p>
                    Wallet Balance
                </p>

            </div>

            <div class="card">

                <i class="fa-solid fa-heart"></i>

                <h2>
                    ${this.totalDonations}
                </h2>

                <p>
                    Total Donations
                </p>

            </div>

            <div class="card">

                <i class="fa-solid fa-users"></i>

                <h2>
                    ${this.familiesHelped}
                </h2>

                <p>
                    Families Helped
                </p>

            </div>

        </div>

        <br><br>

        <div class="requests-box">

            <h2>
                Donation History
            </h2>

            ${historyHTML}

        </div>

        `;
    }

    showDonations() {

        this.content.innerHTML = `

        <div class="requests-box">

            <h1 class="title">
                Donation Requests
            </h1>

            <div class="request-card">

                <h3>
                    🍲 Food Donation
                </h3>

                <p>
                    Family needs food supplies
                </p>

                <input type="number"
                       id="foodAmount"
                       placeholder="Number of meals">

                <br><br>

                <button id="foodBtn">
                    Donate Food
                </button>

            </div>

            <div class="request-card">

                <h3>
                    👕 Clothes Donation
                </h3>

                <p>
                    Children need winter clothes
                </p>

                <input type="number"
                       id="clothesAmount"
                       placeholder="Number of clothes">

                <br><br>

                <button id="clothesBtn">
                    Donate Clothes
                </button>

            </div>

            <div class="request-card">

                <h3>
                    💵 Money Donation
                </h3>

                <p>
                    Donate from wallet balance
                </p>

                <button id="moneyBtn">
                    Donate $50
                </button>

            </div>

        </div>

        `;

        document
        .getElementById("foodBtn")
        .addEventListener(
            "click",
            () => this.donateFood()
        );

        document
        .getElementById("clothesBtn")
        .addEventListener(
            "click",
            () => this.donateClothes()
        );

        document
        .getElementById("moneyBtn")
        .addEventListener(
            "click",
            () => this.donateMoney()
        );
    }

    showProfile() {

        const email =
            localStorage.getItem("userEmail");

        this.content.innerHTML = `

        <div class="profile-box">

            <h1 class="title">
                My Profile
            </h1>

            <br>

            <p>

                <strong>Email:</strong>

                ${email}

            </p>

            <p>

                <strong>Wallet Balance:</strong>

                $${this.balance}

            </p>

            <br>

            <h3>
                Add Money To Wallet
            </h3>

            <br>

            <input type="number"
                   id="amount"
                   placeholder="Enter amount">

            <br>

            <button class="wallet-btn"
                    id="fawryBtn">

                Fawry

            </button>

            <button class="wallet-btn"
                    id="instapayBtn">

                InstaPay

            </button>

            <button class="wallet-btn"
                    id="creditBtn">

                Credit Card

            </button>

        </div>

        `;

        document
        .getElementById("fawryBtn")
        .addEventListener(
            "click",
            () => this.addBalance("Fawry")
        );

        document
        .getElementById("instapayBtn")
        .addEventListener(
            "click",
            () => this.addBalance("InstaPay")
        );

        document
        .getElementById("creditBtn")
        .addEventListener(
            "click",
            () => this.addBalance("Credit Card")
        );
    }

    showSettings() {

        this.content.innerHTML = `

        <div class="settings-box">

            <h1 class="title">
                Settings
            </h1>

            <br>

            <label>
                Change Email
            </label>

            <br><br>

            <input type="email"
                   placeholder="New Email">

            <br>

            <label>
                Change Password
            </label>

            <br><br>

            <input type="password"
                   placeholder="New Password">

            <br>

            <label>
                Payment Method
            </label>

            <br><br>

            <select>

                <option>
                    Fawry
                </option>

                <option>
                    InstaPay
                </option>

                <option>
                    Credit Card
                </option>

            </select>

            <br><br>

            <button class="save-btn"
                    id="saveBtn">

                Save Changes

            </button>

        </div>

        `;

        document
        .getElementById("saveBtn")
        .addEventListener(
            "click",
            () => this.saveSettings()
        );
    }

    donateMoney() {

        if(this.balance < 50){

            alert(
                "Wallet balance is low"
            );

            return;
        }

        this.balance -= 50;

        this.totalDonations++;

        this.familiesHelped++;

        this.history.push({

            title:"💵 Money Donation",

            description:
            "You donated $50"
        });

        this.saveData();

        alert(
            "Money Donation Successful"
        );

        this.showDashboard();
    }

    donateFood() {

        const meals =
            document
            .getElementById("foodAmount")
            .value;

        if(meals === ""){

            alert(
                "Enter meals number"
            );

            return;
        }

        this.totalDonations++;

        this.familiesHelped++;

        this.history.push({

            title:"🍲 Food Donation",

            description:
            "You donated " +
            meals +
            " meals"
        });

        this.saveData();

        alert(
            "Food Donation Successful"
        );

        this.showDashboard();
    }

    donateClothes() {

        const clothes =
            document
            .getElementById("clothesAmount")
            .value;

        if(clothes === ""){

            alert(
                "Enter clothes number"
            );

            return;
        }

        this.totalDonations++;

        this.familiesHelped++;

        this.history.push({

            title:"👕 Clothes Donation",

            description:
            "You donated " +
            clothes +
            " clothes"
        });

        this.saveData();

        alert(
            "Clothes Donation Successful"
        );

        this.showDashboard();
    }

    addBalance(method) {

        const amount =
            Number(
                document
                .getElementById("amount")
                .value
            );

        if(amount <= 0){

            alert(
                "Enter valid amount"
            );

            return;
        }

        this.balance += amount;

        this.saveData();

        alert(
            "Balance Added By " +
            method
        );

        this.showProfile();
    }

    saveSettings() {

        alert(
            "Settings Updated"
        );
    }

    logout() {

        window.location.href =
        "login.html";
    }
}

new DonorDashboard();