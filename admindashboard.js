'use strict';

class Database{

    constructor(){

        this.projects = [

            {
                id:"P001",
                name:"Orphan Sponsorship",
                category:"Support",
                target:30000,
                collected:22000,
                status:"Open"
            },

            {
                id:"P002",
                name:"Mosque Construction",
                category:"Mosque",
                target:50000,
                collected:50000,
                status:"Closed"
            }
        ];

        this.cases = [

            {
                id:"C001",
                name:"Ahmed Ali",
                desc:"Medical Support",
                status:"Pending"
            }
        ];

        this.donors = [];
    }
}

class Dashboard{

    constructor(){

        this.database = new Database();

        this.navItems =
            document.querySelectorAll(".nav-item");

        this.sections =
            document.querySelectorAll(".section");

        this.pageTitle =
            document.getElementById("pageTitle");

        this.projectList =
            document.getElementById("projectList");

        this.caseList =
            document.getElementById("caseListOverview");

        this.projectsGrid =
            document.getElementById("projectsGrid");

        this.casesBody =
            document.getElementById("casesBody");

        this.donorsBody =
            document.getElementById("donorsBody");

        this.form =
            document.getElementById("createProjectForm");

        this.addEvents();

        this.renderProjects();

        this.renderCases();

        this.renderDonors();
    }

    addEvents(){

        this.navItems.forEach((item)=>{

            item.addEventListener("click",(event)=>{

                event.preventDefault();

                this.changeSection(
                    item.dataset.section
                );
            });
        });

        this.form.addEventListener(
            "submit",
            (event)=>this.createProject(event)
        );
    }

    changeSection(sectionName){

        this.sections.forEach((section)=>{

            section.classList.remove("active");
        });

        this.navItems.forEach((item)=>{

            item.classList.remove("active");
        });

        document
            .getElementById(
                "section-" + sectionName
            )
            .classList.add("active");

        document
            .querySelector(
                `[data-section="${sectionName}"]`
            )
            .classList.add("active");

        this.pageTitle.textContent =
            sectionName;
    }

    renderProjects(){

        this.projectList.innerHTML = "";

        this.projectsGrid.innerHTML = "";

        this.database.projects.forEach((project)=>{

            const percent =
                Math.floor(
                    (project.collected / project.target) * 100
                );

            this.projectList.innerHTML += `

                <div class="case-item">

                    <h4>
                        ${project.name}
                    </h4>

                    <p>
                        ${percent}% funded
                    </p>

                </div>
            `;

            this.projectsGrid.innerHTML += `

                <div class="project-card">

                    <h3>
                        ${project.name}
                    </h3>

                    <p>
                        ${project.category}
                    </p>

                    <p>
                        Target:
                        ${project.target}
                    </p>

                    <p>
                        Collected:
                        ${project.collected}
                    </p>

                    <p>
                        ${project.status}
                    </p>

                    <button class="btn">

                        View

                    </button>

                </div>
            `;
        });
    }

    renderCases(){

        this.caseList.innerHTML = "";

        this.casesBody.innerHTML = "";

        this.database.cases.forEach((item)=>{

            this.caseList.innerHTML += `

                <div class="case-item">

                    <h4>
                        ${item.name}
                    </h4>

                    <p>
                        ${item.desc}
                    </p>

                </div>
            `;

            this.casesBody.innerHTML += `

                <tr>

                    <td>
                        ${item.id}
                    </td>

                    <td>
                        ${item.name}
                    </td>

                    <td>
                        ${item.desc}
                    </td>

                    <td>
                        ${item.status}
                    </td>

                    <td>

                        <button class="btn">

                            Review

                        </button>

                    </td>

                </tr>
            `;
        });
    }

    renderDonors(){

        this.donorsBody.innerHTML = `
        
            <tr>

                <td>
                    D001
                </td>

                <td>
                    Salma
                </td>

                <td>
                    salma@gmail.com
                </td>

                <td>
                    Vodafone Cash
                </td>

                <td>
                    5000
                </td>

            </tr>
        `;
    }

    createProject(event){

        event.preventDefault();

        const name =
            document.getElementById("newProjectName").value;

        const category =
            document.getElementById("newProjectCategory").value;

        const target =
            document.getElementById("newProjectTarget").value;

        const project = {

            id:"P00" + (this.database.projects.length + 1),

            name:name,

            category:category,

            target:Number(target),

            collected:0,

            status:"Open"
        };

        this.database.projects.push(project);

        this.renderProjects();

        this.form.reset();

        alert("Project Created");
    }
}

new Dashboard();