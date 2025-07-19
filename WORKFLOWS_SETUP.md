# GitHub Workflows Variables 設定指南

本專案使用兩個獨立的 GitHub Actions workflows：

## 📁 Workflow 文件

### 1. `gemini-code-review.yml` - 程式碼審查
- **觸發時機**: Push 到 master/develop 分支
- **功能**: 使用 Gemini AI 審查變更的程式碼
- **輸出**: 安全性、錯誤處理、可維護性分析

### 2. `pr-alignment-check.yml` - PR 一致性檢查
- **觸發時機**: Pull Request 開啟、更新、重新開啟
- **功能**: 分析 PR 描述與實際程式碼變更是否相符
- **輸出**: PR 品質評估和改善建議

## 🔧 必要設定

### GitHub Secrets (必須)
在 Repository Settings > Secrets and variables > Actions > Secrets：

| Name | Value | 說明 |
|------|-------|------|
| `GEMINI_API_KEY` | 你的 Gemini API Key | 用於呼叫 Google Gemini AI |

### GitHub Variables (可選)
在 Repository Settings > Secrets and variables > Actions > Variables：

| Name | Default Behavior | 說明 |
|------|------------------|------|
| `CODE_REVIEW_PROMPT` | 使用內建預設 prompt | 程式碼審查的提示詞 |
| `PR_ANALYSIS_PROMPT` | 使用內建預設 prompt | PR 分析的提示詞 |

## 📝 推薦的 Variables 設定

### CODE_REVIEW_PROMPT
```
請依據安全程式碼開發標準，深入檢查以下程式碼，明確指出所有潛在問題（如安全性、錯誤處理、可維護性等），並針對每個問題提供具體解決方案。

審查重點：
1. 安全性問題 - SQL注入、XSS、CSRF等漏洞
2. 程式碼品質 - 錯誤處理、異常處理、效能考量
3. 可維護性 - 程式碼結構、命名規範、註解文件

輸出格式：
| 風險等級 | 問題描述 | 修正建議 |
|---------|----------|----------|
| 高/中/低 | 詳細描述問題 | 具體解決方案 |

最後請綜合總結本次檢查發現的主要問題及建議。
```

### PR_ANALYSIS_PROMPT
```
請分析這個 Pull Request 的目標描述是否與實際的程式碼變更內容相符。

分析重點：
1. PR 描述完整性 - 標題和描述是否清楚說明變更目的
2. 程式碼變更一致性 - 實際變更是否符合 PR 描述
3. 變更範圍適當性 - 是否遵循單一職責原則
4. PR 品質評估 - 檔案數量和行數變更是否合理

輸出格式：
| 檢查項目 | 評分(1-5) | 狀態 | 問題描述 | 改善建議 |
|---------|-----------|------|----------|----------|

最後請給出總體評價(優秀/良好/普通/需改善)和主要建議。
```

## 🎯 使用場景

### Scenario 1: 程式碼提交審查
1. 開發者 push 程式碼到 master/develop
2. `gemini-code-review.yml` 自動觸發
3. AI 分析變更的檔案並提供安全性建議

### Scenario 2: Pull Request 品質檢查
1. 開發者建立 Pull Request
2. `pr-alignment-check.yml` 自動觸發
3. AI 分析 PR 描述與程式碼變更的一致性

## 🔍 工作流程優點

### 分離式設計優點：
- ✅ **職責分離**: 每個 workflow 專注單一功能
- ✅ **獨立維護**: 可單獨修改和除錯
- ✅ **並行執行**: 不同事件可同時觸發
- ✅ **易於理解**: 程式碼結構更清晰
- ✅ **靈活配置**: 可為不同場景設定不同參數

### 觸發時機設計：
- **Push 觸發**: 適合即時程式碼品質檢查
- **PR 觸發**: 適合合併前的整體檢視
- **避免重複**: 同一程式碼不會被重複分析

## 🚀 擴展建議

可考慮的未來增強功能：

1. **測試覆蓋率檢查**: 分析新增程式碼的測試覆蓋率
2. **效能影響評估**: 評估程式碼變更對效能的影響
3. **依賴安全掃描**: 檢查新增或更新的套件依賴
4. **文件同步檢查**: 確保程式碼變更有對應的文件更新
5. **Breaking Changes 檢測**: 自動識別可能的破壞性變更
