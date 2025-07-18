"""
測試用的 Python 檔案 - 包含一些可以改進的程式碼
"""

import os

# 沒有適當的錯誤處理
def read_config_file(filename):
    file = open(filename, 'r')  # 沒有使用 with 語句
    content = file.read()
    file.close()
    return content

# SQL 注入風險
def get_user_by_id(user_id):
    import sqlite3
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # 直接字串拼接，有 SQL 注入風險
    query = f"SELECT * FROM users WHERE id = {user_id}"
    cursor.execute(query)
    
    result = cursor.fetchone()
    conn.close()
    return result

# 密碼處理不當
def store_password(username, password):
    # 明文儲存密碼
    with open('passwords.txt', 'a') as f:
        f.write(f"{username}:{password}\n")

# 沒有輸入驗證
def calculate_discount(price, discount_percent):
    return price * (discount_percent / 100)

# 硬編碼的敏感資訊
API_KEY = "sk-1234567890abcdef"
DATABASE_URL = "mysql://user:password@localhost/mydb"

class UserManager:
    def __init__(self):
        self.users = []
    
    # 沒有適當的異常處理
    def add_user(self, user_data):
        self.users.append(user_data)
        # 假設這裡可能會失敗
        self.save_to_database(user_data)
    
    def save_to_database(self, data):
        # 模擬可能失敗的操作
        pass
