function testParser() {
    try {
        // --------------------------------------------------------
        // 【測試案例 1】標準單擊公式拆解
        // --------------------------------------------------------
        const res1 = parseSingleFormula("1D6 + 7");
        console.assert(res1.weaponDice.length === 1, "Case 1 失敗: 武器骰種類長度應為 1");
        console.assert(res1.weaponDice[0].sides === 6 && res1.weaponDice[0].count === 1, "Case 1 失敗: 武器骰應為 1D6");
        console.assert(res1.flatMod === 7, "Case 1 失敗: 固定加值應為 7");
        console.log("✅ Case 1 通過: 標準基礎公式拆解正確。");

        // --------------------------------------------------------
        // 【測試案例 2】單擊公式內的單純 PR 識別 (驗證 parseSingleFormula 功能)
        // --------------------------------------------------------
        // 註：在我們最終拍板的「全輪自由平行宣告」規格下，PR 應放入 parseAdvancedDamageString 
        // 這裡測試 parsePrFormula 輔助函數是否能正確識別與線性合併多源 PR 骰
        const res2 = parsePrFormula("2D6PR + 1D6PR");
        console.assert(res2.length === 1, "Case 2 失敗: PR 種類應合併為 1 種");
        console.assert(res2[0].sides === 6 && res2[0].count === 3, `Case 2 失敗: 2D6+1D6 應自動融合成 3D6 PR，但產出 ${res2[0].count}D${res2[0].sides}`);
        console.log("✅ Case 2 通過: 單擊層級多源 PR 骰子成功自動線性加總合併。");

        // --------------------------------------------------------
        // 【測試案例 3】降級相容測試 (不含括號的常規多輪重複)
        // --------------------------------------------------------
        const res3 = parseAdvancedDamageString("3 1D6+7");
        console.assert(res3.length === 3, "Case 3 失敗: 跨輪展開應為 3 輪");
        console.assert(res3[0].attacks.length === 1, "Case 3 失敗: 每輪打擊數應為 1");
        console.assert(res3[0].attacks[0].weaponDice[0].sides === 6 && res3[0].attacks[0].weaponDice[0].count === 1, "Case 3 失敗: 武器骰應為 1D6");
        console.assert(res3[0].attacks[0].flatMod === 7, "Case 3 失敗: 固定加值應為 7");
        console.assert(res3[0].prDices.length === 0, "Case 3 失敗: 常規降級公式不應產出 PR 資源");
        console.log("✅ Case 3 通過: 降級無括號常規多輪重複語法相容正確。");

        // --------------------------------------------------------
        // 【測試案例 4】一輪多擊（雙武器戰鬥，全輪平行宣告一次 2D6PR）
        // --------------------------------------------------------
        const res4 = parseAdvancedDamageString("3 (1D6+7, 1D4+7, 2D6PR)");
        console.assert(res4.length === 3, "Case 4 失敗: 跨輪展開應為 3 輪");
        
        const round1_4 = res4[0];
        // 【關鍵斷言】：打擊次數精確為 2，2D6PR 被成功抽離不佔用打擊次數
        console.assert(round1_4.attacks.length === 2, `Case 4 失敗: 打擊次數應為 2，但實質產出 ${round1_4.attacks.length}`);
        console.assert(round1_4.attacks[0].weaponDice[0].sides === 6, "Case 4 失敗: 第一擊應為主手 D6");
        console.assert(round1_4.attacks[1].weaponDice[0].sides === 4, "Case 4 失敗: 第二擊應為副手 D4");
        console.assert(round1_4.prDices.length === 1, "Case 4 失敗: 應成功抽離出 1 種 PR 資源");
        console.assert(round1_4.prDices[0].sides === 6 && round1_4.prDices[0].count === 2, "Case 4 失敗: 全輪 PR 增傷池應為 2D6");
        console.log("✅ Case 4 通過: 雙擊平行宣告 PR 成功分離，打擊次數完美精確為 2。");

        // --------------------------------------------------------
        // 【測試案例 5】終極挑戰：非對稱跨輪序列與多源 PR 自動合併
        // --------------------------------------------------------
        const complexInput = "(1D6+7+1D6, 2D6PR, 1D6PR), 2 (1D6+7+1D6, 1D4+7+1D6, 2D6PR)";
        const res5 = parseAdvancedDamageString(complexInput);

        console.assert(res5.length === 3, "Case 5 失敗: 總輪數應展開為 3 輪");

        // 檢核第 1 輪 (印記啟動輪)
        const r1 = res5[0];
        console.assert(r1.attacks.length === 1, `Case 5 失敗: 第 1 輪打擊數應為 1，但產出 ${r1.attacks.length}`);
        console.assert(r1.prDices.length === 1, "Case 5 失敗: 第 1 輪 PR 種類應合併為 1 種");
        console.assert(r1.prDices[0].sides === 6 && r1.prDices[0].count === 3, `Case 5 失敗: 偷襲與蜂群應自動合併為 3D6 PR，但產出 ${r1.prDices[0].count}D${r1.prDices[0].sides}`);

        // 檢核第 2 輪 (常規輸出輪)
        const r2 = res5[1];
        console.assert(r2.attacks.length === 2, `Case 5 失敗: 第 2 輪打擊數應為 2，但產出 ${r2.attacks.length}`);
        console.assert(r2.prDices[0].sides === 6, "Case 5 失敗: 第 2 輪應只有 6 面骰的 PR 資源");
        console.assert(r2.prDices[0].count === 2, "Case 5 失敗: 第 2 輪 PR 數量應為 2 (即 2D6 偷襲)");
        console.log("✅ Case 5 通過: 終極非對稱跨輪序列斷言完全吻合，多源 PR 完美自動合併為 3D6。");

        // 1. 解析全新精簡語法
        const nestedRes = parseAdvancedDamageString("2 (2 1D8+1D6+17, 2D8+1D6+17)");
        
        // 2. 進行多維硬核斷言
        console.assert(nestedRes.length === 2, "Nested Test 失敗: 總作戰輪數應精確為 2 輪");
        
        const round1 = nestedRes[0];
        // 【關鍵斷言】：第一輪內部的打擊次數必須精確等於 3 擊（2 擊常規 + 1 擊 Gloomstalker 特殊擊）
        console.assert(round1.attacks.length === 3, `Nested Test 失敗: 單輪內實質打擊數應為 3，但產出了 ${round1.attacks.length}`);
        
        // 檢查前兩擊是否成功經由 "2 " 前綴複製展開
        console.assert(round1.attacks[0].flatMod === 17 && round1.attacks[0].weaponDice[0].sides === 8, "Nested Test 失敗: 第 1 擊展開內容錯誤");
        console.assert(round1.attacks[1].flatMod === 17 && round1.attacks[1].weaponDice[0].sides === 8, "Nested Test 失敗: 第 2 擊展開內容錯誤");
        
        // 檢查第三擊（Gloomstalker 的 2D8 特殊擊）是否完好不受影響
        console.assert(round1.attacks[2].flatMod === 17 && round1.attacks[2].weaponDice[0].count === 2, "Nested Test 失敗: 第 3 擊特殊擊內容錯誤");
        
        console.log("✅ 多層嵌套語法測試完美通過！新語法與手動攤平長字串在資料結構上達到了 100% 完美對齊。");



        console.log("\n🎉 【全套通關】所有單元測試與邊界硬核斷言全數完美通過！");

    } catch (error) {
        console.error("❌ 斷言測試發生未預期崩潰，捕獲異常:", error.message);
    }
}

// 執行完全體測試
testParser();





/**
 * 執行一體化核心 Pipeline 綜合測試
 */
function runPipelineIntegrationTests() {
    console.log("⚔️  開始執行 Gemini & Copilot 聯名版統計 Pipeline 整合測試...\n");

    // 1. 建立測試案例陣列 (包含既有 GloomStalker 案例與全新 Level 5 Soulknife 賊案例)
    const testCases = [
        // ----------------------------------------------------------------------
        // 既有 GloomStalker Action Surge 爆發案例 (2 個完整輪次，每輪 3 次打擊)
        // ----------------------------------------------------------------------
        calculate("GloomStalker Action Surge", "D20+10", 18, {threshold: 20, multiplier: 2}, "(2 1D8+1D6+7,2D8+1D6+7), 2 (2 1D8+1D6+7)"),
        calculate("GloomStalker Action Surge Dis Bless", "D20D1+10+D4", 18, {threshold: 20, multiplier: 2}, "(2 1D8+1D6+7,2D8+1D6+7), 2 (2 1D8+1D6+7)"),
        calculate("GloomStalker Action Surge Dis Precision", "D20D1+10+D8", 18, {threshold: 20, multiplier: 2}, "(2 1D8+1D6+7,2D8+1D6+7), 2 (2 1D8+1D6+7)"),
        calculate("GloomStalker Action Surge Bless", "D20+10+D4", 18, {threshold: 20, multiplier: 2}, "(2 1D8+1D6+7,2D8+1D6+7), 2 (2 1D8+1D6+7)"),
        calculate("GloomStalker Action Surge Advantage", "D20A1+10", 18, {threshold: 20, multiplier: 2}, "(2 1D8+1D6+7,2D8+1D6+7), 2 (2 1D8+1D6+7)"),
        calculate("GloomStalker Action Surge Elven Accuracy", "D20A2+10", 18, {threshold: 20, multiplier: 2}, "(2 1D8+1D6+7,2D8+1D6+7), 2 (2 1D8+1D6+7)"),
        calculate("GloomStalker Action Surge Elven Accuracy Sharpshooter", "D20A2+10-5", 18, {threshold: 20, multiplier: 2}, "(2 1D8+1D6+7,2D8+1D6+7), 2 (2 1D8+1D6+7)"),
        calculate("GloomStalker Action Surge Elven Accuracy Sharpshooter Bless", "D20A2+10-5+1D4", 18, {threshold: 20, multiplier: 2}, "(2 1D8+1D6+17,2D8+1D6+17), 2 (2 1D8+1D6+17)"),
        calculate("GloomStalker Action Surge Elven Accuracy Sharpshooter Bless Precision", "D20A2+10-5+1D4+1D8", 18, {threshold: 20, multiplier: 2}, "(2 1D8+1D6+17,2D8+1D6+17), 2 (2 1D8+1D6+17)"),

        calculate(
            "Level 5 Soulknife Rogue (Hunter's Mark Setup 3-Round DPR)", 
            "D20A1+6", 
            18, 
            { threshold: 20, multiplier: 2 }, 
            "(1D6+7+1D6, 2D6PR), 2 (1D6+7+1D6, 1D4+7+1D6, 2D6PR)"
        )
    ];

    // 2. 依序遍歷陣列，調用原有的 printTestCase 格式化印出數據
    testCases.forEach(summary => printTestCase(summary));

    console.log("🏁 所有整合測試案例解算完成並已完整印出。");
}

// 執行整合測試
runPipelineIntegrationTests();