'use strict';
var DB = {
  projects: [
    { id: 'P001', name: 'Orphan Sponsorship',     category: 'Orphan Sponsorship',  target: 30000, collected: 22500, status: 'Open',   color: 'gold'  },
    { id: 'P002', name: 'Mosque Construction',     category: 'Mosque Construction', target: 50000, collected: 50000, status: 'Closed', color: 'teal'  },
    { id: 'P003', name: 'Ramadan Feeding Program', category: 'Ramadan Feeding',     target: 20000, collected: 14200, status: 'Open',   color: 'rose'  },
    { id: 'P004', name: 'Medical Aid Fund',        category: 'Medical Aid',         target: 40000, collected: 8900,  status: 'Open',   color: 'blue'  },
    { id: 'P005', name: 'Education Support',       category: 'Education Support',   target: 15000, collected: 13100, status: 'Open',   color: 'green' }
  ],

  cases: [
    { id: 'C-0041', name: 'Beneficiary #0041', desc: 'Family in need — urgent housing assistance required',         submitted: '2024-11-01', status: 'Pending'  },
    { id: 'C-0042', name: 'Beneficiary #0042', desc: 'Medical treatment support — ongoing care expenses',           submitted: '2024-10-28', status: 'Approved' },
    { id: 'C-0043', name: 'Beneficiary #0043', desc: 'Educational support request for orphaned children',           submitted: '2024-10-25', status: 'Rejected' },
    { id: 'C-0044', name: 'Beneficiary #0044', desc: 'Elderly household — basic monthly living assistance',         submitted: '2024-10-20', status: 'Approved' },
    { id: 'C-0045', name: 'Beneficiary #0045', desc: 'Mobility aid equipment for person with disability',           submitted: '2024-11-03', status: 'Pending'  },
    { id: 'C-0046', name: 'Beneficiary #0046', desc: 'School supplies and uniforms for children in need',           submitted: '2024-11-04', status: 'Pending'  }
  ],

  donors: [
    { id: 'D001', name: 'Donor #001', email: 'donor001@example.com', wallet: 5200,  total: 18000, joined: '2024-01-15' },
    { id: 'D002', name: 'Donor #002', email: 'donor002@example.com', wallet: 800,   total: 6500,  joined: '2024-03-22' },
    { id: 'D003', name: 'Donor #003', email: 'donor003@example.com', wallet: 12000, total: 34000, joined: '2023-11-08' },
    { id: 'D004', name: 'Donor #004', email: 'donor004@example.com', wallet: 350,   total: 2100,  joined: '2024-06-01' },
    { id: 'D005', name: 'Donor #005', email: 'donor005@example.com', wallet: 7800,  total: 22500, joined: '2024-02-19' },
    { id: 'D006', name: 'Donor #006', email: 'donor006@example.com', wallet: 1100,  total: 4300,  joined: '2024-07-14' }
  ],

  transactions: [
    { id: 'T-88231', donor: 'Donor #001', project: 'Orphan Sponsorship',      type: 'Donation',     amount: 2000, date: '2024-11-05', status: 'Completed' },
    { id: 'T-88230', donor: 'System',     project: 'Medical Aid Fund',        type: 'Disbursement', amount: 1200, date: '2024-11-04', status: 'Completed' },
    { id: 'T-88229', donor: 'Donor #003', project: 'Mosque Construction',     type: 'Donation',     amount: 5000, date: '2024-11-04', status: 'Completed' },
    { id: 'T-88228', donor: 'Donor #002', project: 'Ramadan Feeding Program', type: 'Donation',     amount: 500,  date: '2024-11-03', status: 'Completed' },
    { id: 'T-88227', donor: 'Donor #005', project: 'Education Support',       type: 'Donation',     amount: 3000, date: '2024-11-03', status: 'Completed' },
    { id: 'T-88226', donor: 'Donor #004', project: 'Orphan Sponsorship',      type: 'Donation',     amount: 300,  date: '2024-11-02', status: 'Completed' }
  ],

  disbursements: [
    { caseId: 'C-0044', recipient: 'Beneficiary #0044', project: 'Orphan Sponsorship', amount: 1200, date: '2024-11-04' },
    { caseId: 'C-0042', recipient: 'Beneficiary #0042', project: 'Medical Aid Fund',   amount: 3500, date: '2024-10-30' }
  ]
};

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════

function formatDate(dateStr) {
  var d = new Date(dateStr);
  return d.toLocaleDateString('en-EG', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmt(n) {
  return Number(n).toLocaleString('en');
}

function showToast(message, type) {
  type = type || 'success';
  if (!document.getElementById('toastStyles')) {
    var style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}';
    document.head.appendChild(style);
  }
  var toast = document.createElement('div');
  var bg    = type === 'success' ? 'rgba(8,148,95,0.12)'   : 'rgba(224,82,82,0.12)';
  var color = type === 'success' ? '#08945f'                : '#e05252';
  toast.style.cssText = 'position:fixed;bottom:28px;right:28px;background:' + bg + ';color:' + color + ';border:1px solid ' + color + ';border-radius:10px;padding:14px 20px;font-size:13px;font-family:Arial,Helvetica,sans-serif;font-weight:bold;z-index:9999;max-width:360px;box-shadow:0 5px 20px rgba(0,0,0,0.12);animation:toastIn 0.3s ease';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 3400);
}

// ═══════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════

var navItems  = document.querySelectorAll('.nav-item[data-section]');
var sections  = document.querySelectorAll('.section');
var pageTitle = document.getElementById('pageTitle');

var TITLES = {
  overview: 'Overview', projects: 'Charity Projects', cases: 'Beneficiary Cases',
  donors: 'Donor Management', disbursements: 'Fund Disbursement',
  reports: 'Financial Reports', settings: 'Settings'
};

function navigateTo(sectionId) {
  sections.forEach(function(s) { s.classList.remove('active'); });
  navItems.forEach(function(n) { n.classList.remove('active'); });
  var target = document.getElementById('section-' + sectionId);
  if (target) target.classList.add('active');
  var activeNav = document.querySelector('.nav-item[data-section="' + sectionId + '"]');
  if (activeNav) activeNav.classList.add('active');
  pageTitle.textContent = TITLES[sectionId] || sectionId;
  if (sectionId === 'reports')       { renderSummaryStats(); initChart(); }
  if (sectionId === 'disbursements') { populateDisbursementDropdowns(); renderDisbursementHistory(); }
}

navItems.forEach(function(item) {
  item.addEventListener('click', function(e) { e.preventDefault(); navigateTo(item.dataset.section); });
});
document.querySelectorAll('[data-section-link]').forEach(function(btn) {
  btn.addEventListener('click', function() { navigateTo(btn.dataset.sectionLink); });
});

var menuToggle = document.getElementById('menuToggle');
var sidebar    = document.getElementById('sidebar');
menuToggle.addEventListener('click', function() { sidebar.classList.toggle('open'); });
document.addEventListener('click', function(e) {
  if (window.innerWidth < 900 && !sidebar.contains(e.target) && e.target !== menuToggle) {
    sidebar.classList.remove('open');
  }
});
(function() {
  var el = document.getElementById('currentDate');
  el.textContent = new Date().toLocaleDateString('en-EG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
})();

// ═══════════════════════════════════════════════════════
// NOTIFICATION BELL
// ═══════════════════════════════════════════════════════

var notifBell     = document.getElementById('notifBell');
var notifDropdown = document.getElementById('notifDropdown');
notifBell.addEventListener('click', function(e) { e.stopPropagation(); notifDropdown.classList.toggle('open'); });
document.addEventListener('click', function() { notifDropdown.classList.remove('open'); });



function animateCounter(el, target) {
  var duration  = 1400;
  var startTime = null;
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var eased    = 1 - Math.pow(1 - progress, 3);
    var current  = Math.floor(eased * target);
    el.textContent = target > 999 ? current.toLocaleString('en') : current;
    if (progress < 1) { requestAnimationFrame(step); }
    else { el.textContent = target > 999 ? target.toLocaleString('en') : target; }
  }
  requestAnimationFrame(step);
}

function initCounters() {
  document.querySelectorAll('.stat-value[data-target]').forEach(function(el) {
    animateCounter(el, parseInt(el.dataset.target, 10));
  });
}



function renderProjectList() {
  var container = document.getElementById('projectList');
  if (!container) return;
  container.innerHTML = DB.projects.map(function(p) {
    var pct = Math.min(Math.round((p.collected / p.target) * 100), 100);
    return '<div class="project-row">' +
      '<div class="project-row-top"><span class="project-name">' + p.name + '</span>' +
      '<span class="project-amounts">EGP ' + fmt(p.collected) + ' / ' + fmt(p.target) + '</span></div>' +
      '<div class="progress-bar-bg"><div class="progress-bar-fill ' + p.color + '" style="width:0" data-pct="' + pct + '"></div></div>' +
      '<div class="project-pct">' + pct + '% funded</div></div>';
  }).join('');
  setTimeout(function() {
    container.querySelectorAll('.progress-bar-fill').forEach(function(bar) { bar.style.width = bar.dataset.pct + '%'; });
  }, 250);
}



function renderCaseListOverview() {
  var container = document.getElementById('caseListOverview');
  if (!container) return;
  container.innerHTML = DB.cases.slice(0, 4).map(function(c) {
    return '<div class="case-item">' +
      '<div class="case-avatar">#</div>' +
      '<div class="case-details"><div class="case-name">' + c.id + '</div>' +
      '<div class="case-desc">' + c.desc.substring(0, 50) + '...</div></div>' +
      '<span class="status-badge ' + c.status.toLowerCase() + '">' + c.status + '</span></div>';
  }).join('');
}


function renderTransactions() {
  var tbody = document.getElementById('transactionBody');
  if (!tbody) return;
  tbody.innerHTML = DB.transactions.map(function(t) {
    var isDonation = t.type === 'Donation';
    return '<tr>' +
      '<td style="color:var(--gold);font-size:12px">' + t.id + '</td>' +
      '<td>' + t.donor + '</td><td>' + t.project + '</td>' +
      '<td><span class="status-badge ' + (isDonation ? 'approved' : 'open') + '" style="font-size:11px">' + t.type + '</span></td>' +
      '<td style="font-weight:bold;color:var(--text-primary)">' + (isDonation ? '+' : '-') + fmt(t.amount) + '</td>' +
      '<td style="color:var(--text-muted);font-size:12px">' + formatDate(t.date) + '</td>' +
      '<td><span class="status-badge approved">' + t.status + '</span></td></tr>';
  }).join('');
}



function renderProjectsGrid() {
  var grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.innerHTML = DB.projects.map(function(p) {
    var pct    = Math.min(Math.round((p.collected / p.target) * 100), 100);
    var closed = p.status === 'Closed';
    return '<div class="project-card">' +
      '<div class="project-card-header">' +
        '<div><div class="project-card-name">' + p.name + '</div>' +
        '<div class="project-card-cat">' + p.category + '</div></div>' +
        '<span class="status-badge ' + p.status.toLowerCase() + '">' + p.status + '</span></div>' +
      '<div class="project-card-progress">' +
        '<div class="project-card-amounts">' +
          '<span>Collected: <strong>EGP ' + fmt(p.collected) + '</strong></span>' +
          '<span>Target: <strong>EGP ' + fmt(p.target) + '</strong></span></div>' +
        '<div class="progress-bar-bg"><div class="progress-bar-fill ' + p.color + '" style="width:' + pct + '%"></div></div>' +
        '<div class="project-pct">' + pct + '% of target reached</div></div>' +
      '<div class="project-card-actions">' +
        (closed
          ? '<button class="action-btn" disabled style="opacity:.4">Closed</button>'
          : '<button class="btn-primary" onclick="closeProject(\'' + p.id + '\')">Close Project</button>'
        ) +
        '<button class="btn-sm" onclick="viewProjectDetails(\'' + p.id + '\')">Details</button>' +
      '</div></div>';
  }).join('');
}

window.closeProject = function(id) {
  var p = DB.projects.find(function(p) { return p.id === id; });
  if (!p) return;
  if (confirm('Close project "' + p.name + '"?\nThis will prevent further donations.')) {
    p.status = 'Closed';
    renderProjectsGrid();
    renderProjectList();
    showToast('Project "' + p.name + '" has been closed.', 'success');
  }
};

window.viewProjectDetails = function(id) {
  var p = DB.projects.find(function(p) { return p.id === id; });
  if (!p) return;
  alert('Project: ' + p.name + '\nID: ' + p.id + '\nCategory: ' + p.category +
    '\nTarget: EGP ' + fmt(p.target) + '\nCollected: EGP ' + fmt(p.collected) + '\nStatus: ' + p.status);
};


var createProjectModal = document.getElementById('createProjectModal');
document.getElementById('openCreateProject').addEventListener('click', function() { createProjectModal.classList.add('open'); });
document.getElementById('closeCreateProject').addEventListener('click', function() { createProjectModal.classList.remove('open'); });
createProjectModal.addEventListener('click', function(e) { if (e.target === createProjectModal) createProjectModal.classList.remove('open'); });

document.getElementById('createProjectForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var name   = document.getElementById('newProjectName').value.trim();
  var cat    = document.getElementById('newProjectCategory').value;
  var target = parseInt(document.getElementById('newProjectTarget').value, 10);
  if (!name || !target || target < 1) { showToast('Please fill in all fields correctly.', 'error'); return; }
  var colorCycle = ['gold', 'teal', 'rose', 'blue', 'green'];
  DB.projects.push({
    id: 'P' + String(DB.projects.length + 1).padStart(3, '0'),
    name: name, category: cat, target: target, collected: 0,
    status: 'Open', color: colorCycle[DB.projects.length % colorCycle.length]
  });
  renderProjectsGrid();
  renderProjectList();
  createProjectModal.classList.remove('open');
  this.reset();
  showToast('Project "' + name + '" created successfully!', 'success');
});


var currentCaseFilter = 'all';
var selectedCaseId    = null;

function renderCasesTable(filter) {
  filter = filter || 'all';
  var tbody = document.getElementById('casesBody');
  if (!tbody) return;
  var data = filter === 'all' ? DB.cases : DB.cases.filter(function(c) { return c.status === filter; });
  tbody.innerHTML = data.map(function(c) {
    return '<tr>' +
      '<td style="color:var(--gold);font-size:12px">' + c.id + '</td>' +
      '<td style="font-weight:bold">' + c.name + '</td>' +
      '<td style="color:var(--text-secondary)">' + c.desc + '</td>' +
      '<td style="color:var(--text-muted);font-size:12px">' + formatDate(c.submitted) + '</td>' +
      '<td><span class="status-badge ' + c.status.toLowerCase() + '">' + c.status + '</span></td>' +
      '<td><button class="action-btn" onclick="openCaseReview(\'' + c.id + '\')">' +
        (c.status === 'Pending' ? 'Review' : 'View') +
      '</button></td></tr>';
  }).join('');
}

document.querySelectorAll('.filter-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    currentCaseFilter = btn.dataset.filter;
    renderCasesTable(currentCaseFilter);
  });
});



var caseReviewModal = document.getElementById('caseReviewModal');

window.openCaseReview = function(caseId) {
  var c = DB.cases.find(function(c) { return c.id === caseId; });
  if (!c) return;
  selectedCaseId = caseId;
  document.getElementById('caseReviewBody').innerHTML =
    '<span class="review-label">Case ID</span>'           + '<div class="review-field">' + c.id + '</div>' +
    '<span class="review-label">Reference</span>'         + '<div class="review-field">' + c.name + '</div>' +
    '<span class="review-label">Case Description</span>'  + '<div class="review-field">' + c.desc + '</div>' +
    '<span class="review-label">Submitted On</span>'      + '<div class="review-field">' + formatDate(c.submitted) + '</div>' +
    '<span class="review-label">Current Status</span>'    +
    '<div class="review-field"><span class="status-badge ' + c.status.toLowerCase() + '">' + c.status + '</span></div>';
  var isPending = c.status === 'Pending';
  document.getElementById('approveCase').style.display = isPending ? '' : 'none';
  document.getElementById('rejectCase').style.display  = isPending ? '' : 'none';
  caseReviewModal.classList.add('open');
};

document.getElementById('closeCaseReview').addEventListener('click', function() { caseReviewModal.classList.remove('open'); });
caseReviewModal.addEventListener('click', function(e) { if (e.target === caseReviewModal) caseReviewModal.classList.remove('open'); });

function updateCaseStatus(caseId, newStatus) {
  var c = DB.cases.find(function(c) { return c.id === caseId; });
  if (!c) return;
  c.status = newStatus;
  caseReviewModal.classList.remove('open');
  renderCasesTable(currentCaseFilter);
  renderCaseListOverview();
  showToast('Case ' + caseId + ' has been ' + newStatus.toLowerCase() + '.', newStatus === 'Approved' ? 'success' : 'error');
}

document.getElementById('approveCase').addEventListener('click', function() { updateCaseStatus(selectedCaseId, 'Approved'); });
document.getElementById('rejectCase').addEventListener('click', function() { updateCaseStatus(selectedCaseId, 'Rejected'); });



function renderDonorsTable() {
  var tbody = document.getElementById('donorsBody');
  if (!tbody) return;
  tbody.innerHTML = DB.donors.map(function(d) {
    return '<tr>' +
      '<td style="color:var(--gold);font-size:12px">' + d.id + '</td>' +
      '<td style="font-weight:bold">' + d.name + '</td>' +
      '<td style="color:var(--text-muted)">' + d.email + '</td>' +
      '<td style="color:var(--teal);font-weight:bold">' + fmt(d.wallet) + '</td>' +
      '<td style="font-weight:bold;color:var(--text-primary)">' + fmt(d.total) + '</td>' +
      '<td style="color:var(--text-muted);font-size:12px">' + formatDate(d.joined) + '</td></tr>';
  }).join('');
}


function populateDisbursementDropdowns() {
  var caseSelect    = document.getElementById('disbCase');
  var projectSelect = document.getElementById('disbProject');
  if (!caseSelect || !projectSelect) return;
  var approvedCases = DB.cases.filter(function(c) { return c.status === 'Approved'; });
  caseSelect.innerHTML = '<option value="">-- Select Case --</option>' +
    approvedCases.map(function(c) {
      return '<option value="' + c.id + '">' + c.id + ' (' + c.desc.substring(0, 35) + '...)</option>';
    }).join('');
  var openProjects = DB.projects.filter(function(p) { return p.status === 'Open' && p.collected > 0; });
  projectSelect.innerHTML = '<option value="">-- Select Project --</option>' +
    openProjects.map(function(p) {
      return '<option value="' + p.id + '">' + p.name + ' (EGP ' + fmt(p.collected) + ' available)</option>';
    }).join('');
}

document.getElementById('disbProject').addEventListener('change', function() {
  var proj = DB.projects.find(function(p) { return p.id === document.getElementById('disbProject').value; });
  document.getElementById('availFunds').textContent = proj
    ? 'Available project funds: EGP ' + fmt(proj.collected)
    : 'Available project funds: —';
});

document.getElementById('disburseForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var caseId    = document.getElementById('disbCase').value;
  var projectId = document.getElementById('disbProject').value;
  var amount    = parseInt(document.getElementById('disbAmount').value, 10);
  if (!caseId || !projectId || !amount || amount < 1) {
    showToast('Please fill all fields with valid values.', 'error'); return;
  }
  var proj = DB.projects.find(function(p) { return p.id === projectId; });
  var c    = DB.cases.find(function(c) { return c.id === caseId; });
  if (!proj || !c) return;
  if (amount > proj.collected) {
    showToast('Insufficient funds. Available: EGP ' + fmt(proj.collected), 'error'); return;
  }
  proj.collected -= amount;
  DB.disbursements.unshift({
    caseId: caseId, recipient: c.name, project: proj.name,
    amount: amount, date: new Date().toISOString().split('T')[0]
  });
  renderDisbursementHistory();
  populateDisbursementDropdowns();
  document.getElementById('availFunds').textContent = 'Available project funds: EGP ' + fmt(proj.collected);
  document.getElementById('disbAmount').value = '';
  showToast('EGP ' + fmt(amount) + ' disbursed for ' + caseId + ' successfully.', 'success');
});

function renderDisbursementHistory() {
  var container = document.getElementById('disburseHistory');
  if (!container) return;
  if (DB.disbursements.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding:12px 0">No disbursements yet.</p>';
    return;
  }
  container.innerHTML = DB.disbursements.map(function(d) {
    return '<div class="disburse-item">' +
      '<div class="di-header">' +
        '<span class="di-amount">EGP ' + fmt(d.amount) + '</span>' +
        '<span class="di-date">' + formatDate(d.date) + '</span>' +
      '</div>' +
      '<div class="di-case">' + d.caseId + ' / ' + d.project + '</div>' +
    '</div>';
  }).join('');
}

var chartInstance = null;

function initChart() {
  var canvas = document.getElementById('donationsChart');
  if (!canvas) return;
  if (typeof Chart === 'undefined') {
    canvas.parentElement.innerHTML = '<p style="color:var(--text-muted);padding:20px;text-align:center">Chart.js failed to load. Please check your internet connection.</p>';
    return;
  }
  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

  var labels = DB.projects.map(function(p) { return p.name; });
  var data   = DB.projects.map(function(p) { return p.collected; });
  var colors = ['#b98a1f', '#0d9b68', '#e05252', '#3a7bd5', '#4caf50'];
  var faded  = colors.map(function(c) { return c + '28'; });

  chartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Collected (EGP)',
        data: data,
        backgroundColor: faded,
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff',
          borderColor: '#d2f5df',
          borderWidth: 1,
          titleColor: '#1a2e1a',
          bodyColor: '#4a6650',
          padding: 12,
          callbacks: {
            label: function(ctx) { return ' EGP ' + ctx.parsed.y.toLocaleString('en'); }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#8aab90', font: { family: 'Arial, Helvetica, sans-serif', size: 11 }, maxRotation: 30 },
          grid: { color: 'rgba(0,0,0,0.04)' },
          border: { color: '#d2f5df' }
        },
        y: {
          ticks: {
            color: '#8aab90',
            font: { family: 'Arial, Helvetica, sans-serif', size: 11 },
            callback: function(val) { return val >= 1000 ? (val / 1000).toFixed(0) + 'K' : val; }
          },
          grid: { color: 'rgba(0,0,0,0.04)' },
          border: { color: '#d2f5df' }
        }
      }
    }
  });
}



function renderSummaryStats() {
  var el = document.getElementById('summaryStats');
  if (!el) return;
  var totalDonations = DB.transactions
    .filter(function(t) { return t.type === 'Donation'; })
    .reduce(function(s, t) { return s + t.amount; }, 0);
  var totalDisbursed = DB.disbursements
    .reduce(function(s, d) { return s + d.amount; }, 0);
  var rows = [
    { label: 'Total Donations Received', val: 'EGP ' + fmt(totalDonations) },
    { label: 'Total Funds Disbursed',    val: 'EGP ' + fmt(totalDisbursed) },
    { label: 'Registered Donors',        val: DB.donors.length },
    { label: 'Total Charity Projects',   val: DB.projects.length },
    { label: 'Projects Fully Funded',    val: DB.projects.filter(function(p) { return p.status === 'Closed'; }).length },
    { label: 'Cases Approved',           val: DB.cases.filter(function(c) { return c.status === 'Approved'; }).length }
  ];
  el.innerHTML = rows.map(function(r) {
    return '<div class="summary-row"><span class="sr-label">' + r.label + '</span><span class="sr-val">' + r.val + '</span></div>';
  }).join('');
}

document.getElementById('exportBtn').addEventListener('click', function() {
  var btn = this;
  btn.textContent = 'Generating...';
  btn.disabled = true;
  setTimeout(function() {
    document.getElementById('exportSuccess').style.display = 'block';
    btn.textContent = 'Download PDF Report';
    btn.disabled = false;
  }, 1800);
});

document.getElementById('reportPeriod').addEventListener('change', function() { initChart(); });


var alertBanner = document.getElementById('alertBanner');
if (alertBanner) {
  var closeBannerBtn = alertBanner.querySelector('button');
  if (closeBannerBtn) {
    closeBannerBtn.addEventListener('click', function() { alertBanner.style.display = 'none'; });
  }
}



(function init() {
  renderProjectList();
  renderCaseListOverview();
  renderTransactions();
  renderProjectsGrid();
  renderCasesTable('all');
  renderDonorsTable();
  renderDisbursementHistory();
  initCounters();
})();