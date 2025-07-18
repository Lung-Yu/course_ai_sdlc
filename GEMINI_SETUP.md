# Gemini Code Review 設定指南

## 前置設定

### 1. 取得 Gemini API Key

1. 前往 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登入你的 Google 帳號
3. 點擊 "Create API Key"
4. 複製產生的 API Key

### 2. 在 GitHub Repository 設定 Secret

1. 前往你的 GitHub repository 頁面
2. 點擊 "Settings" 標籤
3. 在左側選單點擊 "Secrets and variables" > "Actions"
4. 點擊 "New repository secret"
5. Name: `GEMINI_API_KEY`
6. Secret: 貼上你的 Gemini API Key
7. 點擊 "Add secret"

## GitHub Actions Workflow 說明

這個 workflow (`gemini-code-review.yml`) 會在以下情況觸發：
- 有新的 Pull Request 或 PR 更新時
- 推送到 main、master 或 develop 分支時

### Workflow 步驟：

1. **Checkout code**: 取得程式碼
2. **Setup Node.js**: 安裝 Node.js 環境
3. **Install Gemini CLI**: 安裝 Google Generative AI 套件和 Gemini CLI
4. **Get changed files**: 取得變更的檔案清單
5. **Review code with Gemini**: 設定 API Key 並使用 Gemini AI 審查程式碼
6. **Comment PR**: 在 PR 中留下審查結果註解
7. **Upload results**: 上傳審查結果作為 artifact

## 測試流程

1. 創建測試分支：
   ```bash
   git checkout -b test-gemini-review
   ```

2. 修改或新增一些程式碼檔案

3. 提交變更：
   ```bash
   git add .
   git commit -m "test: 測試 Gemini code review"
   ```

4. 推送到 GitHub：
   ```bash
   git push origin test-gemini-review
   ```

5. 在 GitHub 上創建 Pull Request

6. 檢查 Actions 標籤中的 workflow 執行結果

## 審查重點

Gemini AI 會從以下角度審查程式碼：

1. **程式碼品質與可讀性**
   - 變數命名
   - 函數結構
   - 註解品質

2. **潛在的安全問題**
   - SQL 注入
   - XSS 攻擊
   - 硬編碼敏感資訊

3. **效能考量**
   - 演算法效率
   - 記憶體使用
   - 不必要的操作

4. **最佳實踐建議**
   - 設計模式
   - 程式碼組織
   - 重構建議

5. **錯誤處理**
   - 異常處理
   - 輸入驗證
   - 邊界條件

## 本地測試

如果你想在本地測試 Gemini code review 功能：

```bash
# 1. 安裝必要套件
npm install -g @google/generative-ai @google/gemini-cli

# 2. 設定 API Key
export GEMINI_API_KEY="your_api_key"

# 3. 執行本地測試腳本
node test-gemini-review.js
```

測試腳本會審查 `src/` 目錄下的檔案並產生審查報告。

## 注意事項

- 確保你的 repository 有足夠的 Actions 執行時間配額
- Gemini API 有使用限制，請注意配額管理
- 大型檔案可能會超過 API 的輸入限制
- 審查結果僅供參考，最終決定仍需人工判斷
