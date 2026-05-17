'use strict';

class CharityDB {
  constructor() {
    this.projects = JSON.parse(localStorage.getItem('jasr_projects')) || [];
    this.cases = JSON.parse(localStorage.getItem('jasr_cases')) || [];
    this.donors = JSON.parse(localStorage.getItem('jasr_donors')) || [];
    this.transactions = JSON.parse(localStorage.getItem('jasr_transactions')) || [];
  }

  saveToStorage() {
    localStorage.setItem('jasr_projects', JSON.stringify(this.projects));
    localStorage.setItem('jasr_cases', JSON.stringify(this.cases));
    localStorage.setItem('jasr_donors', JSON.stringify(this.donors));
    localStorage.setItem('jasr_transactions', JSON.stringify(this.transactions));
  }

  addProject(project) { 
    this.projects.push(project); 
    this.saveToStorage();
  }

  updateProject(id, updatedData) {
    const proj = this.getProject(id);
    if (proj) {
      proj.name = updatedData.name;
      proj.category = updatedData.category;
      proj.target = updatedData.target;
      this.saveToStorage();
    }
  }

  deleteProject(id) {
    // 1. هات اسم المشروع الأول قبل ما نمسحه عشان نعرف المعاملات بتاعته
    const projectToDelete = this.getProject(id);
    
    if (projectToDelete) {
      const projectName = projectToDelete.name;

      // 2. امسح المشروع من قائمة المشاريع
      this.projects = this.projects.filter(p => p.id !== id);

      // 3. امسح كل المعاملات المالية المربوطة باسم المشروع ده عشان الجدول والأرقام تتحدث
      this.transactions = this.transactions.filter(t => t.project !== projectName);

      // 4. احفظ التعديلات الجديدة في الـ LocalStorage
      this.saveToStorage();
    }
  }

  getProject(id) { return this.projects.find(p => p.id === id); }

  getProject(id) { return this.projects.find(p => p.id === id); }
  getCase(id) { return this.cases.find(c => c.id === id); }
}

class DashboardViews {
  constructor(db) {
    this.db = db;
  }

  renderAll() {
    this.renderStatsCounters();
    this.renderProjectList();
    this.renderCaseListOverview();
    this.renderTransactions();
    this.renderProjectsGrid();
    this.renderDonorsTable();
  }

  renderStatsCounters() {
    const totalDonations = this.db.transactions
      .filter(t => t.type === 'Donation' && t.status === 'Completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const activeProjectsCount = this.db.projects.filter(p => p.status === 'Open').length;
    const pendingCasesCount = this.db.cases.filter(c => c.status === 'Pending').length;
    const uniqueDonorsCount = new Set(this.db.transactions.filter(t => t.type === 'Donation').map(t => t.donor)).size;

    if(document.getElementById('stat-donations')) document.getElementById('stat-donations').textContent = totalDonations.toLocaleString();
    if(document.getElementById('stat-projects')) document.getElementById('stat-projects').textContent = activeProjectsCount;
    if(document.getElementById('stat-cases')) document.getElementById('stat-cases').textContent = pendingCasesCount;
    if(document.getElementById('stat-donors')) document.getElementById('stat-donors').textContent = uniqueDonorsCount;
  }

  renderProjectList() {
    const container = document.getElementById('projectList');
    if (!container) return;
    if (this.db.projects.length === 0) {
      container.innerHTML = '<p style="color:var(--gray); padding:10px; font-size:13px;">No projects created yet.</p>';
      return;
    }
    container.innerHTML = this.db.projects.map(p => {
      const pct = Math.min(Math.round((p.collected / p.target) * 100), 100);
      return `<div class="project-row">
        <div class="project-row-top"><strong>${p.name}</strong>
        <span style="color:var(--gray)">EGP ${p.collected.toLocaleString()} / ${p.target.toLocaleString()}</span></div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        <div class="project-pct">${pct}% funded</div></div>`;
    }).join('');
  }

  renderCaseListOverview() {
    const container = document.getElementById('caseListOverview');
    if (!container) return;
    if (this.db.cases.length === 0) {
      container.innerHTML = '<p style="color:var(--gray); padding:10px; font-size:13px;">No beneficiary cases yet.</p>';
      return;
    }
    container.innerHTML = this.db.cases.slice(0, 4).map(c => `
      <div class="case-item">
        <div class="case-avatar">#</div>
        <div class="case-details"><div class="case-name">${c.name}</div>
        <div class="case-desc">${c.desc.substring(0, 45)}...</div></div>
        <span class="status-badge ${c.status.toLowerCase()}">${c.status}</span>
      </div>`).join('');
  }

  renderTransactions() {
    const tbody = document.getElementById('transactionBody');
    if (!tbody) return;
    if (this.db.transactions.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--gray); padding:20px;">No recent financial log.</td></tr>';
      return;
    }
    tbody.innerHTML = this.db.transactions.map(t => `<tr>
        <td style="color:var(--primary); font-weight:600;">${t.id}</td>
        <td>${t.donor}</td><td>${t.project}</td>
        <td><span class="status-badge approved">${t.type}</span></td>
        <td style="font-weight:bold;">EGP ${t.amount.toLocaleString()}</td>
        <td style="color:var(--gray); font-size:12px;">${new Date(t.date).toLocaleDateString()}</td>
        <td><span class="status-badge approved">${t.status}</span></td>
      </tr>`).join('');
  }

  renderProjectsGrid() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    if (this.db.projects.length === 0) {
      grid.innerHTML = '<p style="color:var(--gray); padding:20px;">No available projects.</p>';
      return;
    }
    grid.innerHTML = this.db.projects.map(p => {
      const pct = Math.min(Math.round((p.collected / p.target) * 100), 100);
      const closed = p.status === 'Closed';
      return `<div class="project-card">
        <div class="project-card-header">
          <div><div class="project-card-name">${p.name}</div>
          <div class="project-card-cat">${p.category}</div></div>
          <span class="status-badge ${p.status.toLowerCase()}">${p.status}</span>
        </div>
        <div style="margin-bottom: 15px;">
          <div class="project-card-amounts">
            <span>Collected: <strong>${p.collected.toLocaleString()}</strong></span>
            <span>Target: <strong>${p.target.toLocaleString()}</strong></span>
          </div>
          <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        </div>
        <div style="display: flex; gap: 8px;">
          ${closed ? `<button class="btn-sm" disabled style="opacity:.4;">Closed</button>` : `<button class="btn-sm close-proj-btn" data-id="${p.id}" style="background:var(--primary); color:#fff;">Close</button>`}
          <button class="btn-sm edit-proj-btn" data-id="${p.id}" style="background:var(--secondary); color:#fff;">Update</button>
          <button class="btn-sm delete-proj-btn" data-id="${p.id}" style="background:var(--rose); color:#fff;">Delete</button>
        </div></div>`;
    }).join('');
  }

  renderCasesTable(filter = 'all') {
    const tbody = document.getElementById('casesBody');
    if (!tbody) return;
    const filtered = this.db.cases.filter(c => filter === 'all' || c.status === filter);
    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--gray); padding:20px;">No cases found.</td></tr>';
      return;
    }
    tbody.innerHTML = filtered.map(c => {
      const actions = c.status === 'Pending' ? `<button class="btn-sm review-case-btn" data-id="${c.id}" style="background:var(--primary); color:#fff;">Review</button>` : `<button class="btn-sm" disabled style="opacity:0.4;">Processed</button>`;
      return `<tr>
        <td style="color:var(--primary); font-weight:600;">${c.id}</td>
        <td>${c.name}</td><td>${c.desc}</td>
        <td style="color:var(--gray); font-size:12px;">${new Date(c.submitted).toLocaleDateString()}</td>
        <td><span class="status-badge ${c.status.toLowerCase()}">${c.status}</span></td>
        <td>${actions}</td>
      </tr>`;
    }).join('');
  }

  renderDonorsTable() {
    const tbody = document.getElementById('donorsBody');
    if (!tbody) return;
    if (this.db.donors.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--gray); padding:20px;">No registered donors.</td></tr>';
      return;
    }
    tbody.innerHTML = this.db.donors.map(d => `<tr>
        <td style="color:var(--primary); font-size:12px;">${d.id}</td>
        <td style="font-weight:600;">${d.name}</td><td>${d.email}</td>
        <td>${d.wallet.toLocaleString()} EGP</td>
        <td style="font-weight:bold; color:var(--primary);">${d.total.toLocaleString()} EGP</td>
        <td style="color:var(--gray); font-size:12px;">${new Date(d.joined).toLocaleDateString()}</td>
      </tr>`).join('');
  }
}

class DashboardApp {
  constructor() {
    this.db = new CharityDB();
    this.view = new DashboardViews(this.db);
    this.activeReviewCaseId = null;
    this.activeEditProjectId = null;
  }

  init() {
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    this.bindNavigationEvents();
    this.bindActionEvents();
    this.bindFormSubmissions();
    this.bindLogoutEvent(); // تشغيل ميزة تسجيل الخروج
    this.view.renderAll();
  }

  bindNavigationEvents() {
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    const sections = document.querySelectorAll('.section');
    const pageTitle = document.getElementById('pageTitle');

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        sections.forEach(s => s.classList.remove('active'));
        navItems.forEach(n => n.classList.remove('active'));
        
        document.getElementById('section-' + item.dataset.section).classList.add('active');
        item.classList.add('active');
        pageTitle.textContent = item.textContent.trim();
        
        this.view.renderAll();
        if (item.dataset.section === 'cases') this.view.renderCasesTable('all');
      });
    });
  }

  bindActionEvents() {
    document.getElementById('projectsGrid').addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      if (!id) return;
      if (e.target.classList.contains('close-proj-btn')) {
        const p = this.db.getProject(id);
        if (p && confirm(`Close "${p.name}"?`)) { p.status = 'Closed'; this.db.saveToStorage(); this.view.renderAll(); }
      }
      if (e.target.classList.contains('delete-proj-btn')) {
        if (confirm('Delete this project?')) { this.db.deleteProject(id); this.view.renderAll(); }
      }
      if (e.target.classList.contains('edit-proj-btn')) {
        const p = this.db.getProject(id);
        if (!p) return;
        this.activeEditProjectId = id;
        document.getElementById('editProjectName').value = p.name;
        document.getElementById('editProjectCategory').value = p.category;
        document.getElementById('editProjectTarget').value = p.target;
        document.getElementById('editProjectModal').classList.add('open');
      }
    });

    document.getElementById('openCreateProject').addEventListener('click', () => document.getElementById('createProjectModal').classList.add('open'));
    document.getElementById('closeCreateProject').addEventListener('click', () => document.getElementById('createProjectModal').classList.remove('open'));
    document.getElementById('closeEditProject').addEventListener('click', () => document.getElementById('editProjectModal').classList.remove('open'));

    document.getElementById('casesBody').addEventListener('click', (e) => {
      if (e.target.classList.contains('review-case-btn')) {
        const id = e.target.dataset.id;
        const c = this.db.getCase(id);
        if (!c) return;
        this.activeReviewCaseId = id;
        document.getElementById('caseReviewBody').innerHTML = `<h3>${c.name}</h3><p style="margin-top:10px;">${c.desc}</p>`;
        document.getElementById('caseReviewModal').classList.add('open');
      }
    });
    document.getElementById('closeCaseReview').addEventListener('click', () => document.getElementById('caseReviewModal').classList.remove('open'));
    document.getElementById('approveCase').addEventListener('click', () => this.processCase('Approved'));
    document.getElementById('rejectCase').addEventListener('click', () => this.processCase('Rejected'));
  }

  bindFormSubmissions() {
    document.getElementById('createProjectForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('newProjectName').value;
      const category = document.getElementById('newProjectCategory').value;
      const target = parseFloat(document.getElementById('newProjectTarget').value);
      this.db.addProject({ id: `P00${this.db.projects.length + 1}`, name, category, target, collected: 0, status: 'Open' });
      e.target.reset();
      document.getElementById('createProjectModal').classList.remove('open');
      this.view.renderAll();
    });

    document.getElementById('editProjectForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.db.updateProject(this.activeEditProjectId, {
        name: document.getElementById('editProjectName').value,
        category: document.getElementById('editProjectCategory').value,
        target: parseFloat(document.getElementById('editProjectTarget').value)
      });
      document.getElementById('editProjectModal').classList.remove('open');
      this.view.renderAll();
    });
  }

  processCase(status) {
    const c = this.db.getCase(this.activeReviewCaseId);
    if (c) {
      c.status = status;
      this.db.saveToStorage();
      document.getElementById('caseReviewModal').classList.remove('open');
      this.view.renderAll();
      this.view.renderCasesTable('all');
    }
  }

  // ميزة الخروج البرمجية والربط بصفحة الـ login
  bindLogoutEvent() {
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to sign out of the Administrator Portal?')) {
          // التوجيه لصفحة الـ Login بالاسم الصحيح لملفك
          window.location.href = 'adminlogin.html'; 
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new DashboardApp();
  app.init();
});