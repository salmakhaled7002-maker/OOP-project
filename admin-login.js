/**
 * Jasr Al-Khayr - Admin Login Logic
 * Handles: Password visibility, Remember me, Form validation, and Demo Login.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements Selection
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const loginBtn = document.getElementById('loginBtn');
    const errorMessageDiv = document.getElementById('errorMessage');
    const errorTextSpan = document.getElementById('errorText');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // 2. Demo Credentials
    const VALID_EMAIL = 'admin@jasralkhayr.org';
    const VALID_PASSWORD = 'admin123';

    // 3. Show/Hide Password Logic
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            // Toggle the type attribute
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            
            // Update Icon UI
            if (isPassword) {
                // Eye-off Icon
                this.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>`;
                this.style.color = '#0fa36b'; // Highlight when visible
            } else {
                // Standard Eye Icon
                this.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>`;
                this.style.color = '#bbb';
            }
        });
    }

    // 4. Remember Me: Load Data
    const savedRemember = localStorage.getItem('rememberAdmin');
    if (savedRemember === 'true') {
        usernameInput.value = localStorage.getItem('adminEmail') || '';
        passwordInput.value = localStorage.getItem('adminPass') || '';
        rememberMeCheckbox.checked = true;
    }

    // 5. Error Message Helper
    function showError(message) {
        if (errorMessageDiv && errorTextSpan) {
            errorTextSpan.textContent = message;
            errorMessageDiv.classList.add('show');
            
            // Auto-hide after 4 seconds
            setTimeout(() => {
                errorMessageDiv.classList.remove('show');
            }, 4000);
        } else {
            alert(message); // Fallback
        }
    }

    // 6. Form Submission Logic
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = usernameInput.value.trim();
            const pass = passwordInput.value.trim();

            // Simple Validation
            if (!email || !pass) {
                showError('Please enter both email and password.');
                return;
            }

            // UI Feedback: Loading State
            const originalBtnContent = loginBtn.innerHTML;
            loginBtn.disabled = true;
            loginBtn.style.opacity = '0.8';
            loginBtn.innerHTML = '<span>⌛</span> Signing in...';

            // Simulate Network Request
            setTimeout(() => {
                if (email === VALID_EMAIL && pass === VALID_PASSWORD) {
                    // Save credentials if Remember Me is checked
                    if (rememberMeCheckbox.checked) {
                        localStorage.setItem('rememberAdmin', 'true');
                        localStorage.setItem('adminEmail', email);
                        localStorage.setItem('adminPass', pass);
                    } else {
                        localStorage.removeItem('rememberAdmin');
                        localStorage.removeItem('adminEmail');
                        localStorage.removeItem('adminPass');
                    }

                    // Success Redirect
                    window.location.href = 'admin-dashboard.html';
                } else {
                    // Failure State
                    loginBtn.disabled = false;
                    loginBtn.style.opacity = '1';
                    loginBtn.innerHTML = originalBtnContent;
                    showError('Invalid credentials. Use the demo account below.');
                }
            }, 800); 
        });
    }
});