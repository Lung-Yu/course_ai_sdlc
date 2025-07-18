def vulnerable_function(user_input):
    """
    這個函數包含多個安全漏洞，用來測試 Gemini AI 的檢測能力
    """
    
    # 問題1: SQL 注入風險
    query = f"SELECT * FROM users WHERE name = '{user_input}'"
    
    # 問題2: 命令注入風險
    import os
    os.system(f"echo {user_input}")
    
    # 問題3: 硬編碼敏感資訊
    api_key = "sk-1234567890abcdef"
    db_password = "admin123"
    
    # 問題4: 不安全的反序列化
    import pickle
    data = pickle.loads(user_input.encode())
    
    # 問題5: 沒有輸入驗證
    return eval(user_input)

# 問題6: 全域變數存放敏感資料
SECRET_TOKEN = "secret-token-12345"

class UserManager:
    def __init__(self):
        # 問題7: 明文存放密碼
        self.admin_password = "admin123"
    
    def authenticate(self, username, password):
        # 問題8: 時序攻擊風險
        if password == self.admin_password:
            return True
        return False
