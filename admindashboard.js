class AdminDashboard {

    constructor() {

        this.checkAdminAccess();

        this.projects =
            JSON.parse(
                localStorage.getItem("charityProjects")
            ) || [];

        this.cases =
            JSON.parse(
                localStorage.getItem("myCases")
            ) || [];

        this.users =
            JSON.parse(
                localStorage.getItem("allUsers")
            ) || [];

        this.history =
            JSON.parse(
                localStorage.getItem("history")
            ) || [];

        this.currentCaseIndex = null;

        this.navItems =
            document.querySelectorAll(".nav-item");

        this.sections =
            document.querySelectorAll(".section");

        this.pageTitle =
            document.getElementById("pageTitle");

        this.currentDate =
            document.getElementById("currentDate");

        this.projectList =
            document.getElementById("projectList");

        this.projectsGrid =
            document.getElementById("projectsGrid");

        this.caseListOverview =
            document.getElementById("caseListOverview");

        this.casesBody =
            document.getElementById("casesBody");

        this.donorsBody =
            document.getElementById("donorsBody");

        this.transactionBody =
            document.getElementById("transactionBody");

        this.statDonations =
            document.getElementById("stat-donations");

        this.statProjects =
            document.getElementById("stat-projects");

        this.statCases =
            document.getElementById("stat-cases");

        this.statDonors =
            document.getElementById("stat-donors");

        this.createProjectModal =
            document.getElementById("createProjectModal");

        this.caseReviewModal =
            document.getElementById("caseReviewModal");

        this.caseReviewBody =
            document.getElementById("caseReviewBody");

        this.adminNameDisplay =
            document.getElementById("adminNameDisplay");

        this.adminRoleDisplay =
            document.getElementById("adminRoleDisplay");

        this.initialize();
    }

    initialize() {

        this.loadAdminData();

        this.showDate();

        this.addNavigationEvents();

        this.addLogoutEvent();

        this.addProjectEvents();

        this.addCaseEvents();

        this.renderAll();
    }

    checkAdminAccess() {

        const role =
            localStorage.getItem("userRole");

        if (role !== "System Admin") {

            alert(
                "Access denied"
            );

            window.location.href =
                "adminlogin.html";
        }
    }

    loadAdminData() {

        const email =
            localStorage.getItem("userEmail");

        const currentAdmin =
            this.users.find(
                (user) =>
                    user.email === email
            );

        if (currentAdmin) {

            this.adminNameDisplay.innerText =
                currentAdmin.name;

            this.adminRoleDisplay.innerText =
                currentAdmin.role;
        }
    }

    showDate() {

        const today =
            new Date();

        this.currentDate.innerText =
            today.toLocaleDateString(
                "en-US",
                {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );
    }

    addNavigationEvents() {

        this.navItems.forEach((item) => {

            item.addEventListener(
                "click",
                (e) => {

                    e.preventDefault();

                    const section =
                        item.dataset.section;

                    this.changeSection(
                        section,
                        item
                    );
                }
            );
        });
    }

    changeSection(
        sectionName,
        activeItem
    ) {

        this.sections.forEach((section) => {

            section.classList.remove(
                "active"
            );
        });

        this.navItems.forEach((item) => {

            item.classList.remove(
                "active"
            );
        });

        document.getElementById(
            "section-" + sectionName
        ).classList.add(
            "active"
        );

        activeItem.classList.add(
            "active"
        );

        this.pageTitle.innerText =
            activeItem.innerText.trim();

        this.refreshData();

        this.renderAll();
    }

    refreshData() {

        this.projects =
            JSON.parse(
                localStorage.getItem("charityProjects")
            ) || [];

        this.cases =
            JSON.parse(
                localStorage.getItem("myCases")
            ) || [];

        this.users =
            JSON.parse(
                localStorage.getItem("allUsers")
            ) || [];

        this.history =
            JSON.parse(
                localStorage.getItem("history")
            ) || [];
    }

    addLogoutEvent() {

        const logoutBtn =
            document.getElementById(
                "adminLogoutBtn"
            );

        logoutBtn.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    "userRole"
                );

                localStorage.removeItem(
                    "userEmail"
                );

                window.location.href =
                    "adminlogin.html";
            }
        );
    }

    addProjectEvents() {

        document.getElementById(
            "openCreateProject"
        ).addEventListener(
            "click",
            () => {

                this.createProjectModal
                    .classList.add(
                        "open"
                    );
            }
        );

        document.getElementById(
            "closeCreateProject"
        ).addEventListener(
            "click",
            () => {

                this.createProjectModal
                    .classList.remove(
                        "open"
                    );
            }
        );

        document.getElementById(
            "createProjectForm"
        ).addEventListener(
            "submit",
            (e) => {

                e.preventDefault();

                this.createProject();
            }
        );
    }

    createProject() {

        const name =
            document.getElementById(
                "newProjectName"
            ).value;

        const category =
            document.getElementById(
                "newProjectCategory"
            ).value;

        const target =
            Number(
                document.getElementById(
                    "newProjectTarget"
                ).value
            );

        const newProject = {

            id:
                "PROJ-" +
                Date.now(),

            name:
                name,

            category:
                category,

            target:
                target,

            raised:
                0,

            status:
                "Open"
        };

        this.projects.push(
            newProject
        );

        localStorage.setItem(
            "charityProjects",
            JSON.stringify(
                this.projects
            )
        );

        document.getElementById(
            "createProjectForm"
        ).reset();

        this.createProjectModal
            .classList.remove(
                "open"
            );

        this.renderAll();
    }

    addCaseEvents() {

        document.getElementById(
            "closeCaseReview"
        ).addEventListener(
            "click",
            () => {

                this.caseReviewModal
                    .classList.remove(
                        "open"
                    );
            }
        );

        document.getElementById(
            "approveCase"
        ).addEventListener(
            "click",
            () => {

                this.updateCaseStatus(
                    "Approved"
                );
            }
        );

        document.getElementById(
            "rejectCase"
        ).addEventListener(
            "click",
            () => {

                this.updateCaseStatus(
                    "Rejected"
                );
            }
        );
    }

    updateStats() {

        let totalMoney = 0;

        this.history.forEach(
            (transaction) => {

                totalMoney +=
                    Number(
                        transaction.amount
                    );
            }
        );

        const donors =
            this.users.filter(
                (user) =>
                    user.role === "Donor"
            );

        const pendingCases =
            this.cases.filter(
                (c) =>
                    c.status ===
                    "Pending"
            );

        this.statDonations.innerText =
            totalMoney.toLocaleString();

        this.statProjects.innerText =
            this.projects.length;

        this.statCases.innerText =
            pendingCases.length;

        this.statDonors.innerText =
            donors.length;
    }

    renderOverviewProjects() {

        this.projectList.innerHTML = "";

        if (
            this.projects.length === 0
        ) {

            this.projectList.innerHTML =
                `
                <p class="empty-text">
                    No projects available
                </p>
                `;

            return;
        }

        this.projects
            .slice(0, 4)
            .forEach((project) => {

                const percent =
                    project.target > 0
                    ?
                    Math.floor(
                        (
                            project.raised /
                            project.target
                        ) * 100
                    )
                    :
                    0;

                this.projectList.innerHTML +=
                    `
                    <div class="project-row">

                        <div class="project-row-top">

                            <strong>
                                ${project.name}
                            </strong>

                            <span>
                                ${percent}%
                            </span>

                        </div>

                        <div class="progress-bar-bg">

                            <div
                            class="progress-bar-fill"
                            style="
                            width:${percent}%">
                            </div>

                        </div>

                    </div>
                    `;
            });
    }

    renderOverviewCases() {

        this.caseListOverview.innerHTML =
            "";

        if (
            this.cases.length === 0
        ) {

            this.caseListOverview.innerHTML =
                `
                <p class="empty-text">
                    No cases submitted
                </p>
                `;

            return;
        }

        this.cases
            .slice(0, 4)
            .forEach((c) => {

                this.caseListOverview.innerHTML +=
                    `
                    <div class="case-item">

                        <div class="case-avatar">
                            👤
                        </div>

                        <div class="case-details">

                            <div class="case-name">
                                ${c.recipientName || "Recipient"}
                            </div>

                            <div class="case-desc">
                                ${c.description || "No description"}
                            </div>

                        </div>

                        <span class="status-badge ${c.status.toLowerCase()}">
                            ${c.status}
                        </span>

                    </div>
                    `;
            });
    }

    renderTransactions() {

        this.transactionBody.innerHTML =
            "";

        if (
            this.history.length === 0
        ) {

            this.transactionBody.innerHTML =
                `
                <tr>

                    <td colspan="7">
                        No transactions yet
                    </td>

                </tr>
                `;

            return;
        }

        this.history
            .slice()
            .reverse()
            .forEach((transaction) => {

                this.transactionBody.innerHTML +=
                    `
                    <tr>

                        <td>
                            ${transaction.id || "TXN"}
                        </td>

                        <td>
                            ${transaction.donor || "Unknown"}
                        </td>

                        <td>
                            ${transaction.project || "General"}
                        </td>

                        <td>
                            ${transaction.type || "Donation"}
                        </td>

                        <td>
                            ${transaction.amount} EGP
                        </td>

                        <td>
                            ${transaction.date || "Today"}
                        </td>

                        <td>

                            <span class="status-badge approved">
                                Completed
                            </span>

                        </td>

                    </tr>
                    `;
            });
    }

    renderProjects() {

        this.projectsGrid.innerHTML =
            "";

        if (
            this.projects.length === 0
        ) {

            this.projectsGrid.innerHTML =
                `
                <p class="empty-text">
                    No projects created
                </p>
                `;

            return;
        }

        this.projects.forEach(
            (project, index) => {

                const percent =
                    project.target > 0
                    ?
                    Math.floor(
                        (
                            project.raised /
                            project.target
                        ) * 100
                    )
                    :
                    0;

                this.projectsGrid.innerHTML +=
                    `
                    <div class="project-card">

                        <div class="project-card-header">

                            <div>

                                <div class="project-card-name">
                                    ${project.name}
                                </div>

                                <div class="project-card-cat">
                                    ${project.category}
                                </div>

                            </div>

                            <span class="status-badge open">
                                ${project.status}
                            </span>

                        </div>

                        <div class="project-card-amounts">

                            <span>
                                Raised:
                                ${project.raised} EGP
                            </span>

                            <span>
                                ${project.target} EGP
                            </span>

                        </div>

                        <div class="progress-bar-bg">

                            <div
                            class="progress-bar-fill"
                            style="
                            width:${percent}%">
                            </div>

                        </div>

                        <br>

                        <button
                        class="btn-primary"
                        onclick="dashboard.deleteProject(${index})">

                            Delete

                        </button>

                    </div>
                    `;
            });
    }

    deleteProject(index) {

        const confirmDelete =
            confirm(
                "Delete this project?"
            );

        if (!confirmDelete) {

            return;
        }

        this.projects.splice(
            index,
            1
        );

        localStorage.setItem(
            "charityProjects",
            JSON.stringify(
                this.projects
            )
        );

        this.renderAll();
    }

    renderCases() {

        this.casesBody.innerHTML =
            "";

        if (
            this.cases.length === 0
        ) {

            this.casesBody.innerHTML =
                `
                <tr>

                    <td colspan="6">
                        No cases submitted
                    </td>

                </tr>
                `;

            return;
        }

        this.cases.forEach(
            (c, index) => {

                this.casesBody.innerHTML +=
                    `
                    <tr>

                        <td>
                            CASE-${index + 1}
                        </td>

                        <td>
                            ${c.recipientName || "Recipient"}
                        </td>

                        <td>
                            ${c.description || ""}
                        </td>

                        <td>
                            ${c.dateSubmitted || "Today"}
                        </td>

                        <td>

                            <span class="status-badge ${c.status.toLowerCase()}">
                                ${c.status}
                            </span>

                        </td>

                        <td>

                            <button
                            class="btn-primary"
                            onclick="dashboard.reviewCase(${index})">

                                Review

                            </button>

                        </td>

                    </tr>
                    `;
            });
    }

    reviewCase(index) {

        this.currentCaseIndex =
            index;

        const c =
            this.cases[index];

        this.caseReviewBody.innerHTML =
            `
            <h3>
                ${c.recipientName}
            </h3>

            <br>

            <p>
                ${c.description}
            </p>

            <br>

            <p>
                Requested Amount:
                ${c.amount || 0} EGP
            </p>
            `;

        this.caseReviewModal
            .classList.add(
                "open"
            );
    }

    updateCaseStatus(status) {

        if (
            this.currentCaseIndex === null
        ) {

            return;
        }

        this.cases[
            this.currentCaseIndex
        ].status = status;

        localStorage.setItem(
            "myCases",
            JSON.stringify(
                this.cases
            )
        );

        this.caseReviewModal
            .classList.remove(
                "open"
            );

        this.renderAll();
    }

    renderDonors() {

        this.donorsBody.innerHTML =
            "";

        const donors =
            this.users.filter(
                (user) =>
                    user.role === "Donor"
            );

        if (
            donors.length === 0
        ) {

            this.donorsBody.innerHTML =
                `
                <tr>

                    <td colspan="6">
                        No donors found
                    </td>

                </tr>
                `;

            return;
        }

        donors.forEach(
            (donor, index) => {

                this.donorsBody.innerHTML +=
                    `
                    <tr>

                        <td>
                            DON-${index + 1}
                        </td>

                        <td>
                            ${donor.name}
                        </td>

                        <td>
                            ${donor.email}
                        </td>

                        <td>
                            ${donor.walletBalance || 0} EGP
                        </td>

                        <td>
                            ${donor.totalDonated || 0} EGP
                        </td>

                        <td>
                            ${donor.joinedDate || "2026"}
                        </td>

                    </tr>
                    `;
            });
    }

    renderAll() {

        this.updateStats();

        this.renderOverviewProjects();

        this.renderOverviewCases();

        this.renderTransactions();

        this.renderProjects();

        this.renderCases();

        this.renderDonors();
    }
}

window.onload = () => {

    window.dashboard =
        new AdminDashboard();
};