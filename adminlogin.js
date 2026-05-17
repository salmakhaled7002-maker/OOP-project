/**
 * @class AdminAuth
 * @description كلاس الـ OOP المسؤول عن التحقق وتأمين حساب الأدمن
 * يحتوي على ميزة الـ Data Seeding (حقن حساب الأدمن الأول تلقائياً في السيستم)
 */
class AdminAuth {
    constructor() {
        // البيانات الافتراضية للأدمن الأول (Pre-configured Admin)
        this.defaultAdminEmail = "admin@jasralkhayr.org";
        this.defaultAdminPassword = "admin123";

        // إعدادات نظام الأمان (Security Lockout Counter) ضد التخمين
        this.loginAttempts = 0;
        this.maxAttempts = 3;
        this.isLocked = false;

        // ربط عناصر الـ HTML بالـ JavaScript
        this.form = document.getElementById('adminLoginForm');
        this.emailInput = document.getElementById('adminEmail');
        this.passwordInput = document.getElementById('adminPassword');
        this.errorDiv = document.getElementById('errorMessage');
        this.submitBtn = document.getElementById('submitBtn');

        // تشغيل نظام التأسيس التلقائي ثم أحداث الاستماع
        this.seedAdminAccount();
        this.init();
    }

    /**
     * [Data Seeding]
     * دالة التأسيس: وظيفتها التأكد من وجود الأدمن داخل مصفوفة المستخدمين الحقيقية بالسيستم
     */
    seedAdminAccount() {
        // جلب مصفوفة كل المستخدمين المشتركة في السيستم (التي تستخدمها شاشات اللوجن العادية)
        let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];

        // الفحص: هل الإيميل الخاص بالأدمن موجود مسبقاً في السيستم؟
        const adminExists = allUsers.some(user => user.email === this.defaultAdminEmail);

        // لو الأدمن مش موجود (السيستم لسه متصفر وجديد تماماً)، يتم حقنه فوراً كأنه قادم من الـ Backend
        if (!adminExists) {
            const newAdmin = {
                name: "System Admin",
                email: this.defaultAdminEmail,
                password: this.defaultAdminPassword, // في الباكيند الحقيقي يتم تشفيره (Hashed)
                role: "System Admin",
                joinedDate: new Date().toISOString().split('T')[0]
            };

            allUsers.push(newAdmin);
            // حفظ المصفوفة المحدثة لكي تسمع في السيستم بالكامل
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
            console.log("Admin account seeded successfully into 'allUsers'.");
        }
    }

    // دالة تشغيل الأحداث والـ Listeners
    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault(); // منع الفورم من عمل Refresh للصفحة
            this.handleLogin();
        });
    }

    // دالة فحص ومعالجة الدخول
    handleLogin() {
        if (this.isLocked) return;

        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;

        // جلب المستخدمين للتحقق من الحساب الحالي
        let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
        
        // البحث عن يوزر يطابق الإيميل والباسورد ويكون الـ Role بتاعه أدمن
        const foundAdmin = allUsers.find(user => 
            user.email === email && 
            user.password === password && 
            user.role === "System Admin"
        );

        if (foundAdmin) {
            this.loginSuccess(foundAdmin.email, foundAdmin.role);
        } else {
            this.loginFailed();
        }
    }

    // الدالة التي تعمل في حالة نجاح الدخول
    loginSuccess(email, role) {
        this.errorDiv.style.display = "none";
        
        // تخزين الصلاحيات النشطة في الـ LocalStorage لتتحقق منها الداشبورد
        localStorage.setItem('userRole', role);
        localStorage.setItem('userEmail', email);

        this.submitBtn.innerText = "✓ Success! Redirecting...";
        this.submitBtn.style.background = "#2d6a4f";

        // الانتقال لصفحة الداشبورد
        setTimeout(() => {
            window.location.href = "admin.html"; 
        }, 1000);
    }

    // الدالة التي تعمل في حالة فشل الدخول
    loginFailed() {
        this.loginAttempts++;
        
        if (this.loginAttempts >= this.maxAttempts) {
            this.isLocked = true;
            this.emailInput.disabled = true;
            this.passwordInput.disabled = true;
            this.submitBtn.disabled = true;
            this.submitBtn.style.background = "#95a5a6";
            this.submitBtn.innerText = "❌ Portal Locked";
            
            this.showError("Security Alert: Too many failed attempts. Access blocked for safety.");
        } else {
            const remaining = this.maxAttempts - this.loginAttempts;
            this.showError(`Invalid admin credentials. You have ${remaining} attempts remaining.`);
        }
    }

    showError(message) {
        this.errorDiv.innerText = message;
        this.errorDiv.style.display = "block";
    }
}

// تشغيل الـ Class بمجرد تحميل المتصفح
window.onload = () => {
    new AdminAuth();
};