#!/usr/bin/env node

/**
 * 本地測試 Gemini Code Review 功能
 * 使用方式：
 * 1. 設定環境變數 GEMINI_API_KEY
 * 2. 執行：node test-gemini-review.js
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

async function testGeminiReview() {
    // 檢查 API Key
    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ 請設定 GEMINI_API_KEY 環境變數');
        console.log('💡 執行方式：GEMINI_API_KEY=your_api_key node test-gemini-review.js');
        process.exit(1);
    }

    console.log('🚀 開始測試 Gemini Code Review...\n');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 測試檔案清單
    const testFiles = [
        'src/utils.js',
        'src/user_manager.py'
    ];

    for (const file of testFiles) {
        const filePath = path.join(__dirname, file);
        
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  檔案不存在: ${file}`);
            continue;
        }

        console.log(`📄 正在審查: ${file}`);
        console.log('─'.repeat(50));

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const prompt = `請協助進行程式碼審查。檔案: ${file}

程式碼內容:
\`\`\`
${content}
\`\`\`

請從以下角度進行審查：
1. 程式碼品質與可讀性
2. 潛在的安全問題  
3. 效能考量
4. 最佳實踐建議
5. 錯誤處理

請提供具體的改進建議，並用繁體中文回覆。`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            console.log('🤖 Gemini AI 審查結果：');
            console.log(text);
            console.log('\n' + '='.repeat(80) + '\n');

            // 儲存結果
            const outputDir = 'review-results';
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir);
            }
            
            const outputFile = path.join(outputDir, `${path.basename(file)}-review.md`);
            fs.writeFileSync(outputFile, `# Code Review for ${file}\n\n${text}\n`);
            console.log(`💾 審查結果已儲存至: ${outputFile}`);

        } catch (error) {
            console.error(`❌ 審查 ${file} 時發生錯誤:`, error.message);
        }
    }

    console.log('\n✅ 測試完成！');
}

// 執行測試
testGeminiReview().catch(console.error);
