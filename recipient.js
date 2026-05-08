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
    const fileInput = document.getElementById('caseFile');

    if (!title || !amount || !details) {
        alert("Please fill all text fields");
        return;
    }

    // إجبارية رفع الملف
    if (fileInput.files.length === 0) {
        alert("Error: You must upload supporting documents!");
        return;
    }

    const newCase = {
        id: "CASE-" + Math.floor(Math.random() * 9000 + 1000),
        title: title,
        amount: parseFloat(amount), // حفظنا المبلغ كرقم
        date: new Date().toLocaleDateString(),
        status: "Pending",
        attachedFile: fileInput.files[0].name
    };

    let cases = JSON.parse(localStorage.getItem('myCases')) || [];
    cases.push(newCase);
    localStorage.setItem('myCases', JSON.stringify(cases));

    addCaseToTable(newCase);
    updateDashboardStats(); // تحديث العدادات والمبالغ
    
    alert("Case Submitted Successfully!");
    toggleModal('caseModal');
}

function loadSavedCases() {
    let cases = JSON.parse(localStorage.getItem('myCases')) || [];
    document.getElementById('caseTableBody').innerHTML = ""; 
    cases.reverse().forEach(c => addCaseToTable(c));
    updateDashboardStats();
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

// دالة موحدة لتحديث كل أرقام الداشبورد
function updateDashboardStats() {
    let cases = JSON.parse(localStorage.getItem('myCases')) || [];
    
    // 1. تحديث عدد الحالات
    document.getElementById('caseCount').innerText = cases.length;

    // 2. تحديث إجمالي المساعدات (Aid Received)
    // ملاحظة: في الحقيقة بنحسب الـ Approved فقط، بس هنا هنجمع كله كنموذج تجريبي
    let total = cases.reduce((sum, c) => sum + (c.amount || 0), 0);
    document.getElementById('totalAid').innerText = total.toLocaleString(); 
}

window.onclick = (event) => {
    if (event.target.classList.contains('modal')) toggleModal('caseModal');
}