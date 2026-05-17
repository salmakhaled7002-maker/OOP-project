/**
 * @class AdminDashboard
 * @description لوحة تحكم الأدمن لسيستم "جسر الخير"
 * الكود مبني بالكامل بأسلوب الـ OOP ومربوط بالـ LocalStorage الحقيقي للسيستم (بدون أي بيانات فيك)
 */
class AdminDashboard {
    
    // 1. المُنْشِئ: بيشتغل تلقائياً أول ما الصفحة تفتح ويجيب البيانات الحقيقية
    constructor() {
        // ========== [ حارس البوابة - SECURITY CHECK ] ==========
        // بنروح نشوف المتصفح مخزن إيه في الـ userRole
        const currentRole = localStorage.getItem('userRole');

        // لو الـ Role مش "System Admin"، يبقى الشخص ده متسلل أو يوزر عادي!
        if (currentRole !== 'System Admin') {
            alert("Access Denied! You are not authorized to view this page.");
            window.location.href = "admin-login.html"; // طرده فوراً لصفحة لوجن الأدمن
            return; // إيقاف تشغيل باقي الكود
        }
        // =======================================================

        // لو عدا من الفحص، الكود الحقيقي يكمل عادي جداً:
        this.cases = JSON.parse(localStorage.getItem('myCases')) || [];
        this.history = JSON.parse(localStorage.getItem('history')) || [];
        this.projects = JSON.parse(localStorage.getItem('charityProjects')) || [];
        this.allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
        
        this.currentActiveIndex = null;
        this.init();
    } // القوس هنا بيقفل الـ constructor بس! مش الكلاس كله.
    
    // 2. دالة التشغيل الرئيسية (المايسترو بتاع الكلاس)
    init() {
        this.displayDate();           // عرض التاريخ فوق
        this.setupNavigation();       // تشغيل زراير السايدبار والتنقل (SPA)
        this.setupModals();           // تشغيل النوافذ المنبثقة (الـ Modals)
        this.renderAll();             // رسم وعرض كل البيانات في الشاشات
    }

    // دالة لعرض تاريخ اليوم في التوب بار فوق
    displayDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateEl = document.getElementById('currentDate');
        if (dateEl) dateEl.innerText = new Date().toLocaleDateString('en-US', options);
    }

    // دالة بتحدث البيانات من الـ LocalStorage عشان تسمع أول ما تضغطي على أي زرار
    refreshData() {
        this.cases = JSON.parse(localStorage.getItem('myCases')) || [];
        this.history = JSON.parse(localStorage.getItem('history')) || [];
        this.projects = JSON.parse(localStorage.getItem('charityProjects')) || [];
        this.allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    }

    // 3. دالة التنقل الذكي بين الصفحات بدون ريفريش (Single Page Application)
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault(); // منع الصفحة إنها تعمل ريفريش
                
                // شيل كلاس الـ active من كل الزراير وحطه على الزرار اللي اتضغط عليه بس
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // إخفاء كل السكاشن وإظهار السكشن اللي واخد نفس الـ data-section بتاعة الزرار
                const targetSection = item.getAttribute('data-section');
                document.querySelectorAll('.main-content .section').forEach(sec => sec.classList.remove('active'));
                
                const sectionElement = document.getElementById(`section-${targetSection}`);
                if (sectionElement) sectionElement.classList.add('active');

                // تحديث عنوان التوب بار باسم الصفحة الحالية
                document.getElementById('pageTitle').innerText = item.innerText.trim();

                // تحديث البيانات الحية وإعادة عرضها عشان لو الدونور عمل حاجة تسمع فوراً
                this.refreshData();
                this.renderAll();
            });
        });

        // زرار تسجيل الخروج
        document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
            if (confirm("Are you sure you want to sign out?")) {
                localStorage.removeItem('userRole');
                window.location.href = "admin-login.html"; // يرجع لصفحة لوجن الإدمن المأمنة
            }
        });
    }

    // 4. التحكم في فتح وقفل المودالز (الشبابيك المنبثقة)
    setupModals() {
        // فتح وقفل مودال إنشاء مشروع جديد
        document.getElementById('openCreateProject')?.addEventListener('click', () => this.toggleModal('createProjectModal', true));
        document.getElementById('closeCreateProject')?.addEventListener('click', () => this.toggleModal('createProjectModal', false));
        
        // لما الأدمن يضغط Create للمشروع الجديد
        document.getElementById('createProjectForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateProject();
        });

        // قفل مودال تعديل المشاريع ومراجعة الحالات
        document.getElementById('closeEditProject')?.addEventListener('click', () => this.toggleModal('editProjectModal', false));
        document.getElementById('closeCaseReview')?.addEventListener('click', () => this.toggleModal('caseReviewModal', false));

        // أزرار قبول ورفض الحالات جوه المودال
        document.getElementById('approveCase')?.addEventListener('click', () => this.changeCaseStatus('Approved'));
        document.getElementById('rejectCase')?.addEventListener('click', () => this.changeCaseStatus('Rejected'));
    }

    toggleModal(modalId, show) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = show ? 'flex' : 'none';
    }

    // 5. دالة تجميعية بتشغل كل دوال العرض (الرندر) مع بعض
    renderAll() {
        this.renderCardsData();
        this.renderOverviewTables();
        this.renderProjects();
        this.renderCases();
        this.renderDonors();
    }

    // حَسْاب الإحصائيات في الصفحة الرئيسية (الكروت الأربعة الكبار)
    renderCardsData() {
        const donorUsers = this.allUsers.filter(u => u.role === 'donor' || u.role === 'Donor');
        const totalMoney = this.history.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        const pendingCasesCount = this.cases.filter(c => c.status === 'Pending' || c.status === 'pending').length;

        document.getElementById('stat-donations').innerText = totalMoney.toLocaleString();
        document.getElementById('stat-projects').innerText = this.projects.length;
        document.getElementById('stat-cases').innerText = pendingCasesCount;
        document.getElementById('stat-donors').innerText = donorUsers.length;
    }

    // عرض القوائم المصغرة والجدول المالي في الشاشة الرئيسية (Overview)
    renderOverviewTables() {
        const projectList = document.getElementById('projectList');
        if (projectList) {
            if (this.projects.length === 0) {
                projectList.innerHTML = `<p style="color:var(--gray); font-size:14px;">No active projects created yet.</p>`;
            } else {
                projectList.innerHTML = this.projects.slice(0, 3).map(p => {
                    const pct = p.target > 0 ? Math.min(((p.raised / p.target) * 100), 100).toFixed(0) : 0;
                    return `
                        <div style="margin-bottom: 12px;">
                            <div style="display:flex; justify-content:space-between; font-size:14px; margin-bottom:4px;">
                                <span>${p.name}</span><strong>${pct}%</strong>
                            </div>
                            <div style="background:#e2e8f0; height:8px; border-radius:4px; overflow:hidden;">
                                <div style="background:var(--primary); width:${pct}%; height:100%;"></div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        const txnBody = document.getElementById('transactionBody');
        if (txnBody) {
            if (this.history.length === 0) {
                txnBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--gray);">No donations recorded yet.</td></tr>`;
            } else {
                txnBody.innerHTML = [...this.history].reverse().slice(0, 5).map(t => `
                    <tr>
                        <td>#TXN-${t.id || Math.floor(1000 + Math.random() * 9000)}</td>
                        <td>${t.donor || 'Anonymous'}</td>
                        <td>${t.project || 'General Donation'}</td>
                        <td>${t.type || 'Money'}</td>
                        <td style="font-weight:600; color:var(--primary);">${t.amount} EGP</td>
                        <td>${t.date || 'Today'}</td>
                        <td><span class="badge success">Completed</span></td>
                    </tr>
                `).join('');
            }
        }
    }

    // عرض وإدارة المشاريع (Charity Projects)
    renderProjects() {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        if (this.projects.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--gray);">No projects available. Click "+ Create New Project" to add one.</p>`;
            return;
        }

        grid.innerHTML = this.projects.map((p, index) => {
            const pct = p.target > 0 ? Math.min(((p.raised / p.target) * 100), 100).toFixed(0) : 0;
            return `
                <div class="card project-card">
                    <h3>${p.name}</h3>
                    <span style="font-size:12px; background:#edf2f7; padding:2px 8px; border-radius:10px; color:var(--gray);">${p.category}</span>
                    <div style="margin: 15px 0;">
                        <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:5px;">
                            <span>Raised: <b>${p.raised || 0} EGP</b></span>
                            <span>Target: ${p.target} EGP</span>
                        </div>
                        <div style="background:#e2e8f0; height:6px; border-radius:3px; overflow:hidden;">
                            <div style="background:var(--secondary); width:${pct}%; height:100%;"></div>
                        </div>
                    </div>
                    <button class="btn-primary" style="font-size:12px; padding:6px 12px; background:var(--gray);" onclick="window.dashboard.openEditProjectModal(${index})">⚙️ Configure</button>
                </div>
            `;
        }).join('');
    }

    // إضافة مشروع جديد من الأدمن وحفظه في الـ LocalStorage بجد
    handleCreateProject() {
        const name = document.getElementById('newProjectName').value;
        const category = document.getElementById('newProjectCategory').value;
        const target = Number(document.getElementById('newProjectTarget').value);

        this.projects.push({ name, category, target, raised: 0 });
        localStorage.setItem('charityProjects', JSON.stringify(this.projects));
        
        this.toggleModal('createProjectModal', false); 
        document.getElementById('createProjectForm').reset(); 
        this.renderAll(); 
    }

    openEditProjectModal(index) {
        this.currentActiveIndex = index;
        const p = this.projects[index];
        document.getElementById('editProjectName').value = p.name;
        document.getElementById('editProjectCategory').value = p.category;
        document.getElementById('editProjectTarget').value = p.target;
        this.toggleModal('editProjectModal', true);
    }

    // عرض جدول الحالات اللي رفعها المستفيد (من شاشة الـ Recipient)
    renderCases() {
        const tbody = document.getElementById('casesBody');
        if (!tbody) return;

        if (this.cases.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--gray);">No beneficiary cases submitted yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.cases.map((c, index) => `
            <tr>
                <td>#CASE-${100 + index}</td>
                <td style="font-weight:600;">${c.recipientName || c.name || 'Beneficiary'}</td>
                <td>${c.description || 'No description.'}</td>
                <td>${c.dateSubmitted || 'Recent'}</td>
                <td><span class="status-dot ${c.status ? c.status.toLowerCase() : 'pending'}"></span> ${c.status || 'Pending'}</td>
                <td>
                    <button class="btn-primary" style="padding:4px 8px; font-size:12px;" onclick="window.dashboard.openReviewCaseModal(${index})">Review Case</button>
                </td>
            </tr>
        `).join('');
    }

    openReviewCaseModal(index) {
        this.currentActiveIndex = index;
        const c = this.cases[index];
        document.getElementById('caseReviewBody').innerHTML = `
            <p><b>Applicant Name:</b> ${c.recipientName || c.name || 'Beneficiary'}</p>
            <p style="margin: 8px 0;"><b>Case Description:</b> ${c.description || 'N/A'}</p>
            <p><b>Requested Target:</b> ${c.amount || c.target || 0} EGP</p>
            <p style="margin-top:8px;"><b>Current Status:</b> <span style="font-weight:bold; color:var(--primary);">${c.status || 'Pending'}</span></p>
        `;
        this.toggleModal('caseReviewModal', true);
    }

    // قبول أو رفض الحالة وتحديث الـ LocalStorage فوراً عشان يسمع في شاشة المستفيد
    changeCaseStatus(newStatus) {
        if (this.currentActiveIndex !== null) {
            this.cases[this.currentActiveIndex].status = newStatus;
            localStorage.setItem('myCases', JSON.stringify(this.cases));
            this.toggleModal('caseReviewModal', false); 
            this.renderAll(); 
        }
    }

    // عرض جدول المتبرعين الفعليين المسجلين في السيستم (من شاشة الـ Register)
    renderDonors() {
        const tbody = document.getElementById('donorsBody');
        if (!tbody) return;

        const donorUsers = this.allUsers.filter(u => u.role === 'donor' || u.role === 'Donor');

        if (donorUsers.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--gray);">No donors registered in the system yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = donorUsers.map((d, index) => `
            <tr>
                <td>#DONOR-${500 + index}</td>
                <td style="font-weight:600;">${d.name || 'Donor User'}</td>
                <td>${d.email}</td>
                <td>${d.walletBalance || 0} EGP</td>
                <td style="color:var(--primary); font-weight:600;">${d.totalDonated || 0} EGP</td>
                <td>${d.joinedDate || '2026-05-17'}</td>
            </tr>
        `).join('');
    }
} // القوس ده هنا هو اللي بيقفل كلاس الـ AdminDashboard بالكامل في آخر الملف!

// تشغيل الكلاس وحفظ الأوبجكت في الـ window
window.onload = () => {
    window.dashboard = new AdminDashboard();
};