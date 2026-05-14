class RecipientDashboard {

    constructor() {

        this.modal =
            document.getElementById("caseModal");

        this.form =
            document.getElementById("beneficiaryForm");

        this.caseTableBody =
            document.getElementById("caseTableBody");

        this.caseCount =
            document.getElementById("caseCount");

        this.totalAid =
            document.getElementById("totalAid");

        this.userName =
            document.getElementById("displayUserName");

        this.openModalBtn =
            document.getElementById("openModalBtn");

        this.closeModalBtn =
            document.getElementById("closeModalBtn");

        this.initialize();
    }

    initialize() {

        this.loadUserName();

        this.loadSavedCases();

        this.addEvents();
    }

    addEvents() {

        this.openModalBtn.addEventListener(
            "click",
            () => this.toggleModal()
        );

        this.closeModalBtn.addEventListener(
            "click",
            () => this.toggleModal()
        );

        this.form.addEventListener(
            "submit",
            (event) => this.submitNewCase(event)
        );

        window.addEventListener(
            "click",
            (event) => this.closeOutsideModal(event)
        );
    }

    loadUserName() {

        const name =
            localStorage.getItem("userName") ||
            "Recipient";

        this.userName.innerText = name;
    }

    toggleModal() {

        if(this.modal.style.display === "flex"){

            this.modal.style.display = "none";
        }

        else{

            this.form.reset();

            this.modal.style.display = "flex";
        }
    }

    submitNewCase(event) {

        event.preventDefault();

        const title =
            document.getElementById("caseTitle")
            .value.trim();

        const amount =
            document.getElementById("caseAmount")
            .value.trim();

        const details =
            document.getElementById("caseDetails")
            .value.trim();

        const fileInput =
            document.getElementById("caseFile");

        if(
            !title ||
            !amount ||
            !details
        ){

            alert(
                "Please fill all text fields"
            );

            return;
        }

        if(fileInput.files.length === 0){

            alert(
                "You must upload supporting documents"
            );

            return;
        }

        const newCase = {

            id:
            "CASE-" +
            Math.floor(
                Math.random() * 9000 + 1000
            ),

            title:title,

            amount:parseFloat(amount),

            date:
            new Date()
            .toLocaleDateString(),

            status:"Pending",

            attachedFile:
            fileInput.files[0].name
        };

        let cases =
            JSON.parse(
                localStorage.getItem("myCases")
            ) || [];

        cases.push(newCase);

        localStorage.setItem(
            "myCases",
            JSON.stringify(cases)
        );

        this.addCaseToTable(newCase);

        this.updateDashboardStats();

        alert(
            "Case Submitted Successfully"
        );

        this.toggleModal();
    }

    loadSavedCases() {

        let cases =
            JSON.parse(
                localStorage.getItem("myCases")
            ) || [];

        this.caseTableBody.innerHTML = "";

        cases
        .reverse()
        .forEach(
            (currentCase) =>
            this.addCaseToTable(currentCase)
        );

        this.updateDashboardStats();
    }

    addCaseToTable(currentCase) {

        const row = `

        <tr>

            <td>
                #${currentCase.id}
            </td>

            <td>
                ${currentCase.title}
            </td>

            <td>
                ${currentCase.date}
            </td>

            <td>

                <span class="tag pending">

                    ${currentCase.status}

                </span>

            </td>

        </tr>

        `;

        this.caseTableBody.insertAdjacentHTML(
            "afterbegin",
            row
        );
    }

    updateDashboardStats() {

        let cases =
            JSON.parse(
                localStorage.getItem("myCases")
            ) || [];

        this.caseCount.innerText =
            cases.length;

        let total =
            cases.reduce(

                (sum, currentCase) =>

                sum +
                (currentCase.amount || 0),

                0
            );

        this.totalAid.innerText =
            total.toLocaleString();
    }

    closeOutsideModal(event) {

        if(event.target === this.modal){

            this.toggleModal();
        }
    }
}

new RecipientDashboard();