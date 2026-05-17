/**
 * @class AdminDashboard
 * @description لوحة تحكم الأدمن لسيستم "جسر الخير"
 * الكود معدل بالكامل ليتخاطب مع الـ PHP Backend الموحد عن طريق الـ API (Fetch) بدلاً من الـ LocalStorage
 */
class AdminDashboard {
    
    // 1. المُنْشِئ: بيشتغل تلقائياً أول ما الصفحة تفتح ويجيب البيانات الحقيقية من السيرفر
    constructor() {
        // مصفوفات تخزين البيانات مؤقتاً داخل الكائن لعرضها في الشاشات
        this.cases = [];
        this.history = [];
        this.projects = [];
        this.allUsers = [];
        
        this.currentActiveIndex = null; // لمتابعة الـ ID الخاص بالحالة أو المشروع المفتوح في الـ Modal
        this.init();
    }
    
    // 2. دالة التشغيل الرئيسية (المايسترو بتاع الكلاس)
    init() {
        this.displayDate();           // عرض التاريخ فوق
        this.setupNavigation();       // تشغيل زراير السايدبار والتنقل (SPA)
        this.setupModals();           // تشغيل النوافذ المنبثقة (الـ Modals)
        this.fetchAllDataFromServer(); // جلب كل البيانات الحية من الـ Backend لأول مرة
    }

    // دالة لعرض تاريخ اليوم في التوب بار فوق
    displayDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateEl = document.getElementById('currentDate');
        if (dateEl) dateEl.innerText = new Date().toLocaleDateString('en-US', options);
    }

    // دالة موحدة بتجيب كل البيانات الحية من الـ PHP Backend وترسم الشاشات
    fetchAllDataFromServer() {
        // بنعمل fetch لكل الأكروت والجداول بالتوازي من الـ API المدمج
        Promise.all([
            fetch('admin_api.php?action=get_stats').then(res => res.json()),
            fetch('admin_api.php?action=get_projects').then(res => res.json()),
            fetch('admin_api.php?action=get_cases').then(res => res.json()),
            fetch('admin_api.php?action=get_donors').then(res => res.json()),
            fetch('admin_api.php?action=get_transactions').then(res => res.json())
        ])
        .then(([statsRes, projectsRes, casesRes, donorsRes, txnsRes]) => {
            // لو الـ API رجع نجاح (بمعنى إن اليوزر مأمن والـ Session تمام)، بنخزن البيانات في الأوبجكت
            if (statsRes.success) {
                // تخزين مباشر للبيانات القادمة من قاعدة البيانات
                this.projects = projectsRes.data || [];
                this.cases = casesRes.data || [];
                this.allUsers = donorsRes.data || [];
                this.history = txnsRes.data || [];

                // تحديث كروت الأرقام بناءً على الـ Backend الموحد
                document.getElementById('stat-donations').innerText = Number(statsRes.data.total_donations).toLocaleString();
                document.getElementById('stat-projects').innerText = statsRes.data.active_projects;
                document.getElementById('stat-cases').innerText = statsRes.data.pending_cases;
                document.getElementById('stat-donors').innerText = statsRes.data.total_donors;

                // تشغيل دوال الرسم (الرندر) فوراً بالبيانات الجديدة
                this.renderAll();
            } else {
                // حارس البوابة: لو الـ Backend رفض الاستجابة وقال Unauthorized
                alert(statsRes.message || "Access Denied! Redirecting to login...");
                window.location.href = "adminlogin.php"; 
            }
        })
        .catch(err => {
            console.error("Error communicating with PHP Backend:", err);
            alert("Failed to load dashboard data from server.");
        });
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

                // سحب البيانات حية من الـ API عند الانتقال بين الصفحات عشان لو حصل تبرع جديد يسمع فوراً
                this.fetchAllDataFromServer();
            });
        });

        // زرار تسجيل الخروج المربوط بالـ Backend المأمن
        document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
            if (confirm("Are you sure you want to sign out?")) {
                window.location.href = "logout.php"; // التوجيه لملف غلق الجلسة الموحد
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

        // قفل مودال مراجعة الحالات (إغلاق فقط)
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
        this.renderOverviewTables();
        this.renderProjects();
        this.renderCases();
        this.renderDonors();
    }

    // عرض القوائم المصغرة والجدول المالي في الشاشة الرئيسية (Overview)
    renderOverviewTables() {
        const projectList = document.getElementById('projectList');
        if (projectList) {
            if (this.projects.length === 0) {
                projectList.innerHTML = `<p style="color:var(--gray); font-size:14px;">No active projects created yet.</p>`;
            } else {
                projectList.innerHTML = this.projects.slice(0, 3).map(p => {
                    const pct = p.target_amount > 0 ? Math.min(((p.raised_amount / p.target_amount) * 100), 100).toFixed(0) : 0;
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

        // كارت عرض الحالات العاجلة بالـ Overview (عرض الحالات المعلقة فقط)
        const caseListOverview = document.getElementById('caseListOverview');
        if (caseListOverview) {
            const pendingCases = this.cases.filter(c => c.status === 'Pending').slice(0, 2);
            if (pendingCases.length === 0) {
                caseListOverview.innerHTML = `<p style="color:var(--gray); font-size:14px;">No urgent pending cases.</p>`;
            } else {
                caseListOverview.innerHTML = pendingCases.map(c => `
                    <div style="border-bottom:1px solid #edf2f7; padding:8px 0;">
                        <h4 style="margin:0 0 4px 0;">${c.recipient_name}</h4>
                        <p style="margin:0; font-size:13px; color:var(--gray);">Requested: ${Number(c.target_amount).toLocaleString()} EGP</p>
                    </div>
                `).join('');
            }
        }

        const txnBody = document.getElementById('transactionBody');
        if (txnBody) {
            if (this.history.length === 0) {
                txnBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--gray);">No donations recorded yet.</td></tr>`;
            } else {
                txnBody.innerHTML = this.history.map(t => `
                    <tr>
                        <td>#TXN-${t.id}</td>
                        <td>${t.donor_name}</td>
                        <td>${t.project_name}</td>
                        <td>Donation</td>
                        <td style="font-weight:600; color:var(--primary);">${Number(t.amount).toLocaleString()} EGP</td>
                        <td>${t.date_recorded.split(' ')[0]}</td>
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

        grid.innerHTML = this.projects.map((p) => {
            const pct = p.target_amount > 0 ? Math.min(((p.raised_amount / p.target_amount) * 100), 100).toFixed(0) : 0;
            return `
                <div class="card project-card">
                    <h3>${p.name}</h3>
                    <span style="font-size:12px; background:#edf2f7; padding:2px 8px; border-radius:10px; color:var(--gray);">${p.category}</span>
                    <div style="margin: 15px 0;">
                        <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:5px;">
                            <span>Raised: <b>${Number(p.raised_amount).toLocaleString()} EGP</b></span>
                            <span>Target: ${Number(p.target_amount).toLocaleString()} EGP</span>
                        </div>
                        <div style="background:#e2e8f0; height:6px; border-radius:3px; overflow:hidden;">
                            <div style="background:var(--secondary); width:${pct}%; height:100%;"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // إرسال مشروع جديد للـ PHP Backend وحفظه في قاعدة البيانات الحقيقية
    handleCreateProject() {
        const data = {
            action: 'create_project',
            name: document.getElementById('newProjectName').value,
            category: document.getElementById('newProjectCategory').value,
            target: document.getElementById('newProjectTarget').value
        };

        fetch('admin_api.php', {
            method: 'POST',
            headers: { 'Content-Type: application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            alert(res.message);
            if (res.success) {
                this.toggleModal('createProjectModal', false); 
                document.getElementById('createProjectForm').reset(); 
                this.fetchAllDataFromServer(); // إعادة سحب البيانات لتحديث العدادات والسكاشن تلقائياً
            }
        })
        .catch(err => console.error("Error creating project:", err));
    }

    // عرض جدول الحالات الخيرية المرفوعة حياً من المستفيدين
    renderCases() {
        const tbody = document.getElementById('casesBody');
        if (!tbody) return;

        if (this.cases.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--gray);">No beneficiary cases submitted yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.cases.map((c) => {
            let actionButton = `<span style="color:var(--gray); font-size:12px;">Processed</span>`;
            if (c.status === 'Pending') {
                actionButton = `<button class="btn-primary" style="padding:4px 8px; font-size:12px;" onclick="window.dashboard.openReviewCaseModal(${c.id})">Review Case</button>`;
            }

            return `
                <tr>
                    <td>#CASE-${c.id}</td>
                    <td style="font-weight:600;">${c.recipient_name}</td>
                    <td>${c.description}</td>
                    <td>${c.date_submitted.split(' ')[0]}</td>
                    <td><span class="status-dot ${c.status.toLowerCase()}"></span> ${c.status}</td>
                    <td>${actionButton}</td>
                </tr>
            `;
        }).join('');
    }

    openReviewCaseModal(caseId) {
        this.currentActiveIndex = caseId; // حفظ الـ ID الفعلي القادم من الـ Database للحالة المراد مراجعتها
        const c = this.cases.find(item => item.id == caseId);
        if (!c) return;

        document.getElementById('caseReviewBody').innerHTML = `
            <p><b>Applicant Name:</b> ${c.recipient_name}</p>
            <p style="margin: 8px 0;"><b>Case Description:</b> ${c.description}</p>
            <p><b>Requested Target:</b> ${Number(c.target_amount).toLocaleString()} EGP</p>
            <p style="margin-top:8px;"><b>Current Status:</b> <span style="font-weight:bold; color:var(--primary);">${c.status}</span></p>
        `;
        this.toggleModal('caseReviewModal', true);
    }

    // قبول أو رفض الحالة وإرسال التحديث للـ Database عبر الـ API
    changeCaseStatus(newStatus) {
        if (this.currentActiveIndex !== null) {
            const data = {
                action: 'update_case',
                case_id: this.currentActiveIndex,
                status: newStatus
            };

            fetch('admin_api.php', {
                method: 'POST',
                headers: { 'Content-Type: application/json' },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(res => {
                alert(res.message);
                if (res.success) {
                    this.toggleModal('caseReviewModal', false); 
                    this.fetchAllDataFromServer(); // تحديث فوري للجداول والعدادات
                }
            })
            .catch(err => console.error("Error updating case status:", err));
        }
    }

    // عرض جدول المتبرعين الفعليين القادم حياً من قاعدة البيانات
    renderDonors() {
        const tbody = document.getElementById('donorsBody');
        if (!tbody) return;

        if (this.allUsers.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--gray);">No donors registered in the system yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.allUsers.map((d) => `
            <tr>
                <td>#DONOR-${d.id}</td>
                <td style="font-weight:600;">${d.name}</td>
                <td>${d.email}</td>
                <td>${Number(d.wallet_balance).toLocaleString()} EGP</td>
                <td style="color:var(--primary); font-weight:600;">${Number(d.total_donated).toLocaleString()} EGP</td>
                <td>${d.joined_date.split(' ')[0]}</td>
            </tr>
        `).join('');
    }
}

// تشغيل الكلاس عند تحميل النافذة وتخزينه في الـ Window لضمان عمل الـ onclick بالـ HTML
window.onload = () => {
    window.dashboard = new AdminDashboard();
};