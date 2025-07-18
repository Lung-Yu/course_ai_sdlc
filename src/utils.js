// 測試用的 JavaScript 檔案 - 故意包含一些可以改進的地方
function calculateTotal(items) {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
        // 沒有檢查 items[i] 是否存在
        total += items[i].price * items[i].quantity;
    }
    return total;
}

// 沒有錯誤處理的 API 呼叫
function fetchUserData(userId) {
    fetch('/api/user/' + userId)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // 直接操作 DOM，沒有檢查元素是否存在
            document.getElementById('user-name').innerHTML = data.name;
        });
}

// 密碼驗證函數 - 有安全問題
function validatePassword(password) {
    if (password.length >= 6) {
        return true;
    }
    return false;
}

// 沒有使用 const/let，使用 var
var globalConfig = {
    apiKey: 'hardcoded-api-key-123', // 硬編碼的 API Key
    debug: true
};

module.exports = {
    calculateTotal,
    fetchUserData,
    validatePassword,
    globalConfig
};
