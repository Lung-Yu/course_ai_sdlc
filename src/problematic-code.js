// 新增一個有問題的函數來測試 Gemini review
function processUserInput(input) {
    // 沒有輸入驗證 - 安全問題
    eval(input); // 極度危險的 eval 使用
    
    // 沒有錯誤處理
    let result = JSON.parse(input);
    
    // 直接 DOM 操作沒有檢查
    document.getElementById('output').innerHTML = result.message;
    
    return result;
}

// 另一個有效能問題的函數
function findUserInList(users, targetId) {
    // O(n) 搜尋，沒有優化
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == targetId) { // 使用 == 而非 ===
            return users[i];
        }
    }
    return null;
}

module.exports = { processUserInput, findUserInList };
