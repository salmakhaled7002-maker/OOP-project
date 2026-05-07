
document.addEventListener('DOMContentLoaded', () => {
    loadSavedCases();
});

function toggleModal(id) {
    const modal = document.getElementById(id);
    if (modal.style.display !== "flex") {
        document.getElementById('beneficiaryForm').reset();
        modal.style.display = "flex";
    } else {
        modal.style.display = "none";
    }
}

function submitNewCase() {
    const form = document.getElementById('beneficiaryForm');
    const title = form.querySelector('input[type="text"]').value.trim();
    const description = form.querySelector('textarea').value.trim();
    const amount = form.querySelector('input[type="number"]').value.trim();

    if (title === "" || description === "" || amount === "") {
        alert("Please fill in all required fields.");
        return;
    }

    
    const newCase = {
        id: "CASE-" + (Math.floor(Math.random() * 9000) + 1000),
        title: title,
        date: new Date().toISOString().split('T')[0],
        status: "Pending"
    };

    
    saveCaseToLocal(newCase);

    
    addCaseToTable(newCase);

    alert("Success! Your case has been saved.");
    form.reset();
    toggleModal('caseModal');
}


function saveCaseToLocal(caseObj) {
    let cases;
    if (localStorage.getItem('myCases') === null) {
        cases = [];
    } else {
        cases = JSON.parse(localStorage.getItem('myCases'));
    }
    cases.push(caseObj);
    localStorage.setItem('myCases', JSON.stringify(cases));
}


function loadSavedCases() {
    let cases;
    if (localStorage.getItem('myCases') === null) {
        cases = [];
    } else {
        cases = JSON.parse(localStorage.getItem('myCases'));
    }

    cases.reverse().forEach(caseObj => {
        addCaseToTable(caseObj);
    });
}

function addCaseToTable(caseObj) {
    const tableBody = document.getElementById('caseTableBody');
    const newRow = `
        <tr>
            <td>#${caseObj.id}</td>
            <td>${caseObj.title}</td>
            <td>${caseObj.date}</td>
            <td><span class="tag pending">${caseObj.status}</span></td>
        </tr>
    `;
    tableBody.insertAdjacentHTML('afterbegin', newRow);
}

window.onclick = function(event) {
    const modal = document.getElementById('caseModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}