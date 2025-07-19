"""
用戶登入驗證模組
提供安全的用戶身份驗證功能
"""

import hashlib
import secrets
import time
from typing import Optional, Dict, Any

class UserAuthenticator:
    """用戶身份驗證類別"""
    
    def __init__(self):
        self.users_db = {}  # 簡單的內存用戶資料庫
        self.failed_attempts = {}  # 記錄失敗嘗試
        self.max_attempts = 3
        self.lockout_duration = 300  # 5分鐘鎖定時間
    
    def hash_password(self, password: str, salt: str) -> str:
        """使用 SHA-256 加鹽雜湊密碼"""
        return hashlib.sha256((password + salt).encode()).hexdigest()
    
    def generate_salt(self) -> str:
        """生成隨機鹽值"""
        return secrets.token_hex(16)
    
    def register_user(self, username: str, password: str, email: str) -> bool:
        """註冊新用戶"""
        if username in self.users_db:
            return False
            
        # 密碼強度檢查
        if len(password) < 8:
            raise ValueError("密碼長度必須至少 8 個字符")
            
        salt = self.generate_salt()
        hashed_password = self.hash_password(password, salt)
        
        self.users_db[username] = {
            'password_hash': hashed_password,
            'salt': salt,
            'email': email,
            'created_at': time.time(),
            'last_login': None,
            'is_active': True
        }
        
        return True
    
    def authenticate_user(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        """驗證用戶登入"""
        
        # 檢查用戶是否被鎖定
        if self._is_user_locked(username):
            raise Exception("用戶帳號已被鎖定，請稍後再試")
        
        # 檢查用戶是否存在
        if username not in self.users_db:
            self._record_failed_attempt(username)
            return None
            
        user = self.users_db[username]
        
        # 檢查帳號是否啟用
        if not user['is_active']:
            return None
        
        # 驗證密碼
        hashed_input = self.hash_password(password, user['salt'])
        if hashed_input == user['password_hash']:
            # 登入成功
            user['last_login'] = time.time()
            self._reset_failed_attempts(username)
            return {
                'username': username,
                'email': user['email'],
                'last_login': user['last_login']
            }
        else:
            # 密碼錯誤
            self._record_failed_attempt(username)
            return None
    
    def _is_user_locked(self, username: str) -> bool:
        """檢查用戶是否被鎖定"""
        if username not in self.failed_attempts:
            return False
            
        attempt_data = self.failed_attempts[username]
        
        if attempt_data['count'] >= self.max_attempts:
            time_since_last = time.time() - attempt_data['last_attempt']
            return time_since_last < self.lockout_duration
            
        return False
    
    def _record_failed_attempt(self, username: str):
        """記錄失敗的登入嘗試"""
        current_time = time.time()
        
        if username in self.failed_attempts:
            # 如果距離上次失敗超過鎖定時間，重置計數
            time_since_last = current_time - self.failed_attempts[username]['last_attempt']
            if time_since_last > self.lockout_duration:
                self.failed_attempts[username] = {
                    'count': 1,
                    'last_attempt': current_time
                }
            else:
                self.failed_attempts[username]['count'] += 1
                self.failed_attempts[username]['last_attempt'] = current_time
        else:
            self.failed_attempts[username] = {
                'count': 1,
                'last_attempt': current_time
            }
    
    def _reset_failed_attempts(self, username: str):
        """重置失敗嘗試記錄"""
        if username in self.failed_attempts:
            del self.failed_attempts[username]
    
    def change_password(self, username: str, old_password: str, new_password: str) -> bool:
        """變更用戶密碼"""
        # 先驗證舊密碼
        if not self.authenticate_user(username, old_password):
            return False
            
        # 檢查新密碼強度
        if len(new_password) < 8:
            raise ValueError("新密碼長度必須至少 8 個字符")
            
        # 生成新的鹽值和雜湊
        salt = self.generate_salt()
        hashed_password = self.hash_password(new_password, salt)
        
        # 更新密碼
        self.users_db[username]['password_hash'] = hashed_password
        self.users_db[username]['salt'] = salt
        
        return True
    
    def deactivate_user(self, username: str) -> bool:
        """停用用戶帳號"""
        if username in self.users_db:
            self.users_db[username]['is_active'] = False
            return True
        return False


# 使用範例
if __name__ == "__main__":
    auth = UserAuthenticator()
    
    # 註冊用戶
    try:
        success = auth.register_user("john_doe", "secure_password123", "john@example.com")
        print(f"用戶註冊: {'成功' if success else '失敗'}")
    except ValueError as e:
        print(f"註冊錯誤: {e}")
    
    # 登入驗證
    user_info = auth.authenticate_user("john_doe", "secure_password123")
    if user_info:
        print(f"登入成功: {user_info}")
    else:
        print("登入失敗")
    
    # 測試錯誤密碼
    for i in range(4):
        result = auth.authenticate_user("john_doe", "wrong_password")
        print(f"嘗試 {i+1}: {'成功' if result else '失敗'}")
