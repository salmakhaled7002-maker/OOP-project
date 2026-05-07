document.addEventListener('DOMContentLoaded', () => {
    
    const name = localStorage.getItem("userName") || "Recipient";
    document.getElementById("displayUserName").innerText = name;
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
    const title = document.getElementById('caseTitle').value.trim();
    const amount = document.getElementById('caseAmount').value.trim();
    const details = document.getElementById('caseDetails').value.trim();

    if (!title || !amount || !details) {
        alert("Please fill all fields");
        return;
    }

    const newCase = {
        id: "CASE-" + Math.floor(Math.random() * 9000 + 1000),
        title: title,
        date: new Date().toLocaleDateString(),
        status: "Pending"
    };

    
    let cases = JSON.parse(localStorage.getItem('myCases')) || [];
    cases.push(newCase);
    localStorage.setItem('myCases', JSON.stringify(cases));

    addCaseToTable(newCase);
    updateCount();
    
    alert("Case Submitted Successfully!");
    toggleModal('caseModal');
}

function loadSavedCases() {
    let cases = JSON.parse(localStorage.getItem('myCases')) || [];
    document.getElementById('caseTableBody').innerHTML = ""; 
    cases.reverse().forEach(c => addCaseToTable(c));
    updateCount();
}

function addCaseToTable(c) {
    const tableBody = document.getElementById('caseTableBody');
    const row = `<tr>
        <td>#${c.id}</td>
        <td>${c.title}</td>
        <td>${c.date}</td>
        <td><span class="tag pending">${c.status}</span></td>
    </tr>`;
    tableBody.insertAdjacentHTML('afterbegin', row);
}

function updateCount() {
    let cases = JSON.parse(localStorage.getItem('myCases')) || [];
    document.getElementById('caseCount').innerText = cases.length;
}

window.onclick = (event) => {
    if (event.target.className === 'modal') toggleModal('caseModal');
}