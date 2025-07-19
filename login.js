/**
 * 用戶登入介面 JavaScript 模組
 * 提供前端登入表單驗證和 API 呼叫功能
 */

class LoginManager {
    constructor() {
        this.apiBaseUrl = '/api/auth';
        this.maxRetries = 3;
        this.retryCount = 0;
        this.isSubmitting = false;
        
        this.initializeEventListeners();
        this.loadRememberedUser();
    }
    
    /**
     * 初始化事件監聽器
     */
    initializeEventListeners() {
        const loginForm = document.getElementById('loginForm');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const rememberCheckbox = document.getElementById('rememberMe');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (usernameInput) {
            usernameInput.addEventListener('blur', () => this.validateUsername());
            usernameInput.addEventListener('input', () => this.clearFieldError('username'));
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('blur', () => this.validatePassword());
            passwordInput.addEventListener('input', () => this.clearFieldError('password'));
        }
        
        // 載入時檢查是否有記住的用戶
        if (rememberCheckbox && localStorage.getItem('rememberedUser')) {
            rememberCheckbox.checked = true;
        }
    }
    
    /**
     * 處理登入表單提交
     */
    async handleLogin(event) {
        event.preventDefault();
        
        if (this.isSubmitting) {
            return;
        }
        
        const formData = this.getFormData();
        
        // 前端驗證
        if (!this.validateForm(formData)) {
            return;
        }
        
        this.setSubmittingState(true);
        
        try {
            const result = await this.submitLogin(formData);
            
            if (result.success) {
                this.handleLoginSuccess(result.data, formData.rememberMe);
            } else {
                this.handleLoginError(result.error);
            }
        } catch (error) {
            this.handleLoginError('網路連接錯誤，請檢查您的網路連接');
        } finally {
            this.setSubmittingState(false);
        }
    }
    
    /**
     * 獲取表單資料
     */
    getFormData() {
        return {
            username: document.getElementById('username')?.value.trim() || '',
            password: document.getElementById('password')?.value || '',
            rememberMe: document.getElementById('rememberMe')?.checked || false
        };
    }
    
    /**
     * 驗證表單
     */
    validateForm(formData) {
        let isValid = true;
        
        // 驗證用戶名
        if (!this.validateUsername(formData.username)) {
            isValid = false;
        }
        
        // 驗證密碼
        if (!this.validatePassword(formData.password)) {
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * 驗證用戶名
     */
    validateUsername(username = null) {
        const usernameValue = username || document.getElementById('username')?.value.trim();
        const errorElement = document.getElementById('usernameError');
        
        if (!usernameValue) {
            this.showFieldError('username', '請輸入用戶名');
            return false;
        }
        
        if (usernameValue.length < 3) {
            this.showFieldError('username', '用戶名長度至少需要 3 個字符');
            return false;
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(usernameValue)) {
            this.showFieldError('username', '用戶名只能包含字母、數字和下劃線');
            return false;
        }
        
        this.clearFieldError('username');
        return true;
    }
    
    /**
     * 驗證密碼
     */
    validatePassword(password = null) {
        const passwordValue = password || document.getElementById('password')?.value;
        
        if (!passwordValue) {
            this.showFieldError('password', '請輸入密碼');
            return false;
        }
        
        if (passwordValue.length < 8) {
            this.showFieldError('password', '密碼長度至少需要 8 個字符');
            return false;
        }
        
        this.clearFieldError('password');
        return true;
    }
    
    /**
     * 提交登入請求
     */
    async submitLogin(formData) {
        const response = await fetch(`${this.apiBaseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password
            }),
            credentials: 'same-origin'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || '登入失敗');
        }
        
        return data;
    }
    
    /**
     * 處理登入成功
     */
    handleLoginSuccess(userData, rememberMe) {
        // 儲存用戶資訊
        sessionStorage.setItem('userInfo', JSON.stringify(userData));
        
        // 如果選擇記住用戶
        if (rememberMe) {
            localStorage.setItem('rememberedUser', userData.username);
        } else {
            localStorage.removeItem('rememberedUser');
        }
        
        // 顯示成功訊息
        this.showSuccessMessage('登入成功！正在跳轉...');
        
        // 跳轉到儀表板
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1500);
    }
    
    /**
     * 處理登入錯誤
     */
    handleLoginError(errorMessage) {
        this.retryCount++;
        
        if (this.retryCount >= this.maxRetries) {
            this.showErrorMessage('登入失敗次數過多，請稍後再試');
            this.disableForm(300000); // 5分鐘禁用
        } else {
            this.showErrorMessage(errorMessage);
        }
    }
    
    /**
     * 設置提交狀態
     */
    setSubmittingState(isSubmitting) {
        this.isSubmitting = isSubmitting;
        const submitButton = document.getElementById('loginButton');
        const form = document.getElementById('loginForm');
        
        if (submitButton) {
            submitButton.disabled = isSubmitting;
            submitButton.textContent = isSubmitting ? '登入中...' : '登入';
        }
        
        if (form) {
            form.style.opacity = isSubmitting ? '0.7' : '1';
        }
    }
    
    /**
     * 顯示欄位錯誤
     */
    showFieldError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        const inputElement = document.getElementById(fieldName);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        if (inputElement) {
            inputElement.classList.add('error');
        }
    }
    
    /**
     * 清除欄位錯誤
     */
    clearFieldError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        const inputElement = document.getElementById(fieldName);
        
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        if (inputElement) {
            inputElement.classList.remove('error');
        }
    }
    
    /**
     * 顯示成功訊息
     */
    showSuccessMessage(message) {
        const messageElement = document.getElementById('loginMessage');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = 'message success';
            messageElement.style.display = 'block';
        }
    }
    
    /**
     * 顯示錯誤訊息
     */
    showErrorMessage(message) {
        const messageElement = document.getElementById('loginMessage');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = 'message error';
            messageElement.style.display = 'block';
        }
    }
    
    /**
     * 載入記住的用戶
     */
    loadRememberedUser() {
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            const usernameInput = document.getElementById('username');
            if (usernameInput) {
                usernameInput.value = rememberedUser;
            }
        }
    }
    
    /**
     * 禁用表單
     */
    disableForm(duration) {
        const form = document.getElementById('loginForm');
        if (form) {
            const inputs = form.querySelectorAll('input, button');
            inputs.forEach(input => input.disabled = true);
            
            setTimeout(() => {
                inputs.forEach(input => input.disabled = false);
                this.retryCount = 0;
            }, duration);
        }
    }
}

// 當 DOM 載入完成時初始化登入管理器
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});

// 匯出供測試使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoginManager;
}
