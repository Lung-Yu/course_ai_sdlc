// 測試 Gemini AI Code Review 的程式碼範例
// 此檔案故意包含多種程式碼問題來測試 AI 審查能力

function processUserData(userData) {
    // 問題1: 使用危險的 eval()
    eval(userData.script);
    
    // 問題2: 沒有輸入驗證
    const userId = userData.id;
    
    // 問題3: SQL 注入風險
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    
    // 問題4: 硬編碼敏感資訊
    const apiKey = "sk-1234567890abcdef";
    const dbPassword = "admin123";
    
    // 問題5: 沒有錯誤處理
    const config = JSON.parse(userData.config);
    
    // 問題6: XSS 風險
    document.getElementById('output').innerHTML = userData.message;
    
    return {
        query: query,
        config: config,
        apiKey: apiKey
    };
}

// 問題7: 沒有參數驗證的函數
function divide(a, b) {
    return a / b; // 沒有檢查除零
}

// 問題8: 全域變數污染
var globalData = null;

// 問題9: 沒有使用 const/let
var userName = "admin";

// 問題10: 密碼明文處理
function savePassword(username, password) {
    localStorage.setItem(username, password); // 明文儲存密碼
}

module.exports = {
    processUserData,
    divide,
    savePassword
};
