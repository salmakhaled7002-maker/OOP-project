'use strict';

// ═══════════════════════════════════════════════════════
// 1. DATA MODEL / STORAGE ENGINE (OOP WITH LOCALSTORAGE)
// ═══════════════════════════════════════════════════════
class CharityDB {
  constructor() {
    this.projects = JSON.parse(localStorage.getItem('jasr_projects')) || [];
    this.cases = JSON.parse(localStorage.getItem('jasr_cases')) || [];
    this.donors = JSON.parse(localStorage.getItem('jasr_donors')) || [];
    this.transactions = JSON.parse(localStorage.getItem('jasr_transactions')) || [];
    this.disbursements = JSON.parse(localStorage.getItem('jasr_disbursements')) || [];
  }

  saveToStorage() {
    localStorage.setItem('jasr_projects', JSON.stringify(this.projects));
    localStorage.setItem('jasr_cases', JSON.stringify(this.cases));
    localStorage.setItem('jasr_donors', JSON.stringify(this.donors));
    localStorage.setItem('jasr_transactions', JSON.stringify(this.transactions));
    localStorage.setItem('jasr_disbursements', JSON.stringify(this.disbursements));
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
    this.projects = this.projects.filter(p => p.id !== id);
    this.saveToStorage();
  }

  getProject(id) { 
    return this.projects.find(p => p.id === id); 
  }

  getCase(id) { 
    return this.cases.find(c => c.id === id); 
  }

  addCase(c) {
    this.cases.push(c);
    this.saveToStorage();
  }

  addTransaction(t) { 
    this.transactions.unshift(t); 
    this.saveToStorage();
  }

  addDisbursement(d) { 
    this.disbursements.unshift(d); 
    this.saveToStorage();
  }
}

// ═══════════════════════════════════════════════════════
// 2. UTILITY SERVICE (STATIC UTILITIES)
// ═══════════════════════════════════════════════════════
class Formatter {
  static date(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-EG', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  static currency(n) {
    return Number(n).toLocaleString('en');
  }

  static toast(message, type = 'success') {
    if (!document.getElementById('toastStyles')) {
      const style = document.createElement('style');
      style.id = 'toastStyles';
      style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}';
      document.head.appendChild(style);
    }
    const toast = document.createElement('div');
    const bg = type === 'success' ? 'rgba(8,148,95,0.12)' : 'rgba(224,82,82,0.12)';
    const color = type === 'success' ? '#08945f' : '#e05252';
    toast.style.cssText = `position:fixed;bottom:28px;right:28px;background:${bg};color:${color};border:1px solid ${color};border-radius:10px;padding:14px 20px;font-size:13px;font-family:Arial,sans-serif;font-weight:bold;z-index:9999;max-width:360px;box-shadow:0 5px 20px rgba(0,0,0,0.12);animation:toastIn 0.3s ease`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3400);
  }
}

// ═══════════════════════════════════════════════════════
// 3. UI RENDERING ENGINES
// ═══════════════════════════════════════════════════════
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

    this.setCounterDOM('Total Donations', totalDonations);
    this.setCounterDOM('Active Projects', activeProjectsCount);
    this.setCounterDOM('Pending Cases', pendingCasesCount);
    this.setCounterDOM('Total Donors', uniqueDonorsCount);
  }

  setCounterDOM(label, val) {
    document.querySelectorAll('.stat-card').forEach(card => {
      const cardLabel = card.querySelector('.stat-label');
      if (cardLabel && cardLabel.textContent.trim() === label) {
        const valEl = card.querySelector('.stat-value');
        if (valEl) {
          valEl.dataset.target = val;
          valEl.textContent = Formatter.currency(val);
        }
      }
    });
  }

  renderProjectList() {
    const container = document.getElementById('projectList');
    if (!container) return;
    if (this.db.projects.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted); padding:15px; font-size:13px;">No projects created yet.</p>';
      return;
    }
    container.innerHTML = this.db.projects.map(p => {
      const pct = Math.min(Math.round((p.collected / p.target) * 100), 100);
      return `<div class="project-row">
        <div class="project-row-top"><span class="project-name">${p.name}</span>
        <span class="project-amounts">EGP ${Formatter.currency(p.collected)} / ${Formatter.currency(p.target)}</span></div>
        <div class="progress-bar-bg"><div class="progress-bar-fill ${p.color}" style="width:0" data-pct="${pct}"></div></div>
        <div class="project-pct">${pct}% funded</div></div>`;
    }).join('');
    setTimeout(() => {
      container.querySelectorAll('.progress-bar-fill').forEach(bar => bar.style.width = bar.dataset.pct + '%');
    }, 250);
  }

  renderCaseListOverview() {
    const container = document.getElementById('caseListOverview');
    if (!container) return;
    if (this.db.cases.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted); padding:15px; font-size:13px;">No beneficiary cases registered yet.</p>';
      return;
    }
    container.innerHTML = this.db.cases.slice(0, 4).map(c => `
      <div class="case-item">
        <div class="case-avatar">#</div>
        <div class="case-details"><div class="case-name">${c.id}</div>
        <div class="case-desc">${c.desc.substring(0, 50)}...</div></div>
        <span class="status-badge ${c.status.toLowerCase()}">${c.status}</span>
      </div>`).join('');
  }

  renderTransactions() {
    const tbody = document.getElementById('transactionBody');
    if (!tbody) return;
    if (this.db.transactions.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:20px;">No recent financial activities logged.</td></tr>';
      return;
    }
    tbody.innerHTML = this.db.transactions.map(t => {
      const isDonation = t.type === 'Donation';
      return `<tr>
        <td style="color:var(--gold);font-size:12px">${t.id}</td>
        <td>${t.donor}</td><td>${t.project}</td>
        <td><span class="status-badge ${isDonation ? 'approved' : 'open'}" style="font-size:11px">${t.type}</span></td>
        <td style="font-weight:bold;color:var(--text-primary)">${isDonation ? '+' : '-'}${Formatter.currency(t.amount)}</td>
        <td style="color:var(--text-muted);font-size:12px">${Formatter.date(t.date)}</td>
        <td><span class="status-badge approved">${t.status}</span></td>
      </tr>`;
    }).join('');
  }

  renderProjectsGrid() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    if (this.db.projects.length === 0) {
      grid.innerHTML = '<p style="color:var(--text-muted); padding:20px;">No available projects. Please create a new charity program.</p>';
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
        <div class="project-card-progress">
          <div class="project-card-amounts">
            <span>Collected: <strong>EGP ${Formatter.currency(p.collected)}</strong></span>
            <span>Target: <strong>EGP ${Formatter.currency(p.target)}</strong></span>
          </div>
          <div class="progress-bar-bg"><div class="progress-bar-fill ${p.color}" style="width:${pct}%"></div></div>
          <div class="project-pct">${pct}% of target reached</div>
        </div>
        <div class="project-card-actions" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 15px;">
          ${closed ? `<button class="btn-sm" disabled style="opacity:.4; background:#333;">Closed</button>` : `<button class="btn-sm close-proj-btn" data-id="${p.id}" style="background:var(--gold); color:#000;">Close</button>`}
          <button class="btn-sm edit-proj-btn" data-id="${p.id}" style="background:#1e3a8a; color:#fff;">Update</button>
          <button class="btn-sm delete-proj-btn" data-id="${p.id}" style="background:#991b1b; color:#fff;">Delete</button>
        </div></div>`;
    }).join('');
  }

  renderCasesTable(filter = 'all') {
    const tbody = document.getElementById('casesBody');
    if (!tbody) return;
    const filtered = this.db.cases.filter(c => filter === 'all' || c.status === filter);
    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:20px;">No beneficiary cases matched this state filter.</td></tr>';
      return;
    }
    tbody.innerHTML = filtered.map(c => {
      const actions = c.status === 'Pending' ? `<button class="btn-sm review-case-btn" data-id="${c.id}">Review</button>` : `<button class="btn-sm" disabled style="opacity:0.4; cursor:not-allowed;">Processed</button>`;
      return `<tr>
        <td style="color:var(--gold); font-weight:500;">${c.id}</td>
        <td>${c.name}</td>
        <td title="${c.desc}">${c.desc.length > 50 ? c.desc.substring(0, 50) + '...' : c.desc}</td>
        <td style="color:var(--text-muted); font-size:12px;">${Formatter.date(c.submitted)}</td>
        <td><span class="status-badge ${c.status.toLowerCase()}">${c.status}</span></td>
        <td>${actions}</td>
      </tr>`;
    }).join('');
  }

  renderDonorsTable() {
    const tbody = document.getElementById('donorsBody');
    if (!tbody) return;
    if (this.db.donors.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:20px;">No structural donor profiles recorded yet.</td></tr>';
      return;
    }
    tbody.innerHTML = this.db.donors.map(d => `
      <tr>
        <td style="color:var(--gold); font-size:12px;">${d.id}</td>
        <td style="font-weight:500;">${d.name}</td>
        <td style="color:var(--text-muted);">${d.email}</td>
        <td>${Formatter.currency(d.wallet)}</td>
        <td style="font-weight:bold; color:var(--teal);">${Formatter.currency(d.total)}</td>
        <td style="color:var(--text-muted); font-size:12px;">${Formatter.date(d.joined)}</td>
      </tr>`).join('');
  }
}

// ═══════════════════════════════════════════════════════
// 4. MAIN CONTROLLER APPLICATION
// ═══════════════════════════════════════════════════════
class DashboardApp {
  constructor() {
    this.db = new CharityDB();
    this.view = new DashboardViews(this.db);
    this.activeReviewCaseId = null;
    this.activeEditProjectId = null;
    this.currentCaseFilter = 'all';

    this.titles = {
      overview: 'Overview', projects: 'Charity Projects', cases: 'Beneficiary Cases',
      donors: 'Donor Management', disbursements: 'Fund Disbursement',
      reports: 'Financial Reports', settings: 'Settings'
    };
  }

  init() {
    this.initCoreDOMElements();
    this.bindNavigationEvents();
    this.bindActionEvents();
    this.bindFormSubmissions();

    this.view.renderAll();
    this.view.renderCasesTable(this.currentCaseFilter);
  }

  initCoreDOMElements() {
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-EG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }

  bindNavigationEvents() {
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    const sections = document.querySelectorAll('.section');
    const pageTitle = document.getElementById('pageTitle');

    const navigateTo = (sectionId) => {
      sections.forEach(s => s.classList.remove('active'));
      navItems.forEach(n => n.classList.remove('active'));
      
      const target = document.getElementById('section-' + sectionId);
      if (target) target.classList.add('active');
      
      const activeNav = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
      if (activeNav) activeNav.classList.add('active');
      
      pageTitle.textContent = this.titles[sectionId] || sectionId;
      this.view.renderAll();
    };

    navItems.forEach(item => {
      item.addEventListener('click', (e) => { e.preventDefault(); navigateTo(item.dataset.section); });
    });
  }

  bindActionEvents() {
    // مجمع أحداث الـ Grid الخاص بالمشاريع (تفاصيل، غلق، تعديل، حذف)
    document.getElementById('projectsGrid').addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      if (!id) return;
      if (e.target.classList.contains('close-proj-btn')) this.closeProject(id);
      if (e.target.classList.contains('delete-proj-btn')) this.deleteProject(id);
      if (e.target.classList.contains('edit-proj-btn')) this.openEditModal(id);
    });

    const createProjectModal = document.getElementById('createProjectModal');
    document.getElementById('openCreateProject').addEventListener('click', () => createProjectModal.classList.add('open'));
    document.getElementById('closeCreateProject').addEventListener('click', () => createProjectModal.classList.remove('open'));

    // غلق مودال التعديل
    document.getElementById('closeEditProject').addEventListener('click', () => {
      document.getElementById('editProjectModal').classList.remove('open');
      this.activeEditProjectId = null;
    });

    // كيس ريفيو
    document.getElementById('casesBody').addEventListener('click', (e) => {
      if (e.target.classList.contains('review-case-btn')) this.openReviewModal(e.target.dataset.id);
    });
    document.getElementById('closeCaseReview').addEventListener('click', () => {
      document.getElementById('caseReviewModal').classList.remove('open');
      this.activeReviewCaseId = null;
    });
    document.getElementById('approveCase').addEventListener('click', () => this.processCaseStatus('Approved'));
    document.getElementById('rejectCase').addEventListener('click', () => this.processCaseStatus('Rejected'));
  }

  bindFormSubmissions() {
    // 1. إضافة مشروع جديد (بصفر تبرعات)
    document.getElementById('createProjectForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('newProjectName').value;
      const category = document.getElementById('newProjectCategory').value;
      const target = parseFloat(document.getElementById('newProjectTarget').value);

      const colors = ['gold', 'teal', 'rose', 'blue', 'green'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newId = `P00${this.db.projects.length + 1}`;

      this.db.addProject({ id: newId, name, category, target, collected: 0, status: 'Open', color: randomColor });

      e.target.reset();
      document.getElementById('createProjectModal').classList.remove('open');
      Formatter.toast(`Project "${name}" created from scratch.`, 'success');
      this.view.renderAll();
    });

    // 2. تحديث مشروع قائم
    document.getElementById('editProjectForm').addEventListener('submit', (e) => {
      e.preventDefault();
      if (!this.activeEditProjectId) return;

      const name = document.getElementById('editProjectName').value;
      const category = document.getElementById('editProjectCategory').value;
      const target = parseFloat(document.getElementById('editProjectTarget').value);

      this.db.updateProject(this.activeEditProjectId, { name, category, target });

      document.getElementById('editProjectModal').classList.remove('open');
      this.activeEditProjectId = null;
      Formatter.toast('Project configurations updated successfully.', 'success');
      this.view.renderAll();
    });
  }

  closeProject(id) {
    const p = this.db.getProject(id);
    if (p && confirm(`Close project "${p.name}"?`)) {
      p.status = 'Closed';
      this.db.saveToStorage();
      this.view.renderAll();
      Formatter.toast('Project successfully closed.', 'success');
    }
  }

  deleteProject(id) {
    const p = this.db.getProject(id);
    if (p && confirm(`Are you sure you want to completely DELETE "${p.name}"? This action cannot be undone.`)) {
      this.db.deleteProject(id);
      this.view.renderAll();
      Formatter.toast('Project completely wiped from database.', 'error');
    }
  }

  openEditModal(id) {
    const p = this.db.getProject(id);
    if (!p) return;
    this.activeEditProjectId = id;

    // ملء بيانات الـ Modal الحالية بالتفاصيل المخزنة
    document.getElementById('editProjectName').value = p.name;
    document.getElementById('editProjectCategory').value = p.category;
    document.getElementById('editProjectTarget').value = p.target;

    document.getElementById('editProjectModal').classList.add('open');
  }

  openReviewModal(id) {
    const c = this.db.getCase(id);
    if (!c) return;
    this.activeReviewCaseId = id;
    document.getElementById('caseReviewBody').innerHTML = `
      <h4>${c.name} (${c.id})</h4>
      <p style="margin-top:10px;"><strong>Description:</strong><br>${c.desc}</p>`;
    document.getElementById('caseReviewModal').classList.add('open');
  }

  processCaseStatus(statusText) {
    if (!this.activeReviewCaseId) return;
    const c = this.db.getCase(this.activeReviewCaseId);
    if (c) {
      c.status = statusText;
      this.db.saveToStorage();
      Formatter.toast(`Case updated to ${statusText}.`, statusText === 'Approved' ? 'success' : 'error');
      document.getElementById('caseReviewModal').classList.remove('open');
      this.view.renderAll();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new DashboardApp();
  app.init();
});