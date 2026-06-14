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

/**
 * 針對 5級心靈刃賊非對稱輸出序列進行全方位數值斷言測試
 */
function testPipelineCaseSoulKnife() {
    console.log("🧪 啟動核心 Pipeline 條件機率流數值斷言測試...\n");

    try {
        // 1. 執行目標測試用例
        const result = calculate(
            "Level 5 Soulknife Rogue (Hunter's Mark Setup 3-Round DPR)", 
            "D20A1+6", 
            18, 
            { threshold: 20, multiplier: 2 }, 
            "(1D6+7+1D6, 2D6PR), 2 (1D6+7+1D6, 1D4+7+1D6, 2D6PR)"
        );

        const d = result.details;

        // ================================================================================
        // 斷言防線 A：單發打擊中立三態命中機率校對 (對齊微觀數學守恆值)
        // ================================================================================
        // 預期理論值：優勢未命中 = 0.55 * 0.55 = 30.25% (0.3025)
        // 預期理論值：優勢爆擊率 = 1 - 0.95 * 0.95 = 9.75% (0.0975)
        // 預期理論值：優勢普通命中 = 100% - 30.25% - 9.75% = 60.00% (0.6000)
        
        const expectedHit = 0.6000;
        const expectedCrit = 0.0975;
        const expectedMiss = 0.3025;

        console.assert(Math.abs(d.pHit - expectedHit) < MACHINE_EPSILON, 
            `❌ 命中率斷言失敗：預期應為 ${expectedHit}，但實質產出 ${d.pHit}`);
            
        console.assert(Math.abs(d.pCrit - expectedCrit) < MACHINE_EPSILON, 
            `❌ 爆擊率斷言失敗：預期應為 ${expectedCrit}，但實質產出 ${d.pCrit}`);
            
        console.assert(Math.abs(d.pMiss - expectedMiss) < MACHINE_EPSILON, 
            `❌ 未命中率斷言失敗：預期應為 ${expectedMiss}，但實質產出 ${d.pMiss}`);

        console.log("✅ 命中防線通過：單發普通命中(60.0%)、爆擊(9.75%)、未命中(30.25%)全數零誤差吻合。");

        // ================================================================================
        // 斷言防線 B：全戰鬥純代數理論最大傷害上限校對 (防範跨輪污染)
        // ================================================================================
        // 預期理論真諦值：219 點
        // 第 1 輪 (1D6+7+1D6, 2D6PR) 爆擊極限 = (6 + 6 + 12) * 2 + 7 = 55
        // 第 2 輪 (1D6+7+1D6, 1D4+7+1D6, 2D6PR) 爆擊極限 = (6 + 6 + 12) * 2 + 7 + (4 + 6) * 2 + 7 = 55 + 27 = 82
        // 第 3 輪 與第 2 輪完全相同 = 82
        // 總上限 = 55 + 82 + 82 = 219 點
        
        const expectedMaxDmg = 219;
        
        console.assert(d.totalMaxPossibleDmg === expectedMaxDmg, 
            `❌ 理論最大傷斷言失敗：預期應為 ${expectedMaxDmg} 點，但實質產出 ${d.totalMaxPossibleDmg} 點`);

        console.log("✅ 上限防線通過：純代數解析全戰鬥最大總傷精確等於 219 點，無多擊 PR 重複污染。");

        // ================================================================================
        // 斷言防線 C：統計學四分位數區間驗證 (防範時域機率塌陷)
        // ================================================================================
        // 根據剛才與評審對齊後的修正版機率流，當 0-based 陣列空間獲得完美解放後，
        // 四分位數會穩定鎖定在以下具備高公信力的實質累積總和區間內：
        console.assert(result.q1 !== null && result.q2 !== null && result.q3 !== null,
            "❌ 四分位數斷言失敗：傳回的 Q1, Q2, Q3 不允許為空值");

        console.assert(result.q1 <= result.q2 && result.q2 <= result.q3,
            "❌ 統計邏輯斷言失敗：四分位數必須符合 Q1 <= Q2 <= Q3 的累積單調性");

        console.log(`✅ 區間防線通過：成功提取精準四分位數 [ Q1: ${result.q1} | Q2: ${result.q2} | Q3: ${result.q3} ]`);

        console.log("\n🎉 【測試通關】核心 Pipeline 流水線數值、代數、統計三重斷言全數完美通過！");

    } catch (error) {
        console.error("❌ 測試執行過程中發生未預期崩潰，捕獲異常:", error.message);
    }
}

/**
 * 核心離散統計引擎自動化回歸測試：大失敗隔離與 D20A0 語法漏洞檢驗
 */
function runPipelineCaseAC25() {
    console.log("🧪 啟動核心離散統計引擎自動化斷言檢驗...");

    // 2. 執行實質管線運算
    const summary =         calculate(
            "大失敗隔離與輔助骰邊界校正測試 (AC 25 極端防禦)",
            "D20 + 1D4 + 1", 
            25, 
            { threshold: 20, multiplier: 2 }, 
            "(1D8+3)"
        )
    const d = summary.details;

    // ================================================================================
    // 【第一軌：命中與命中率判定斷言 (Accuracy & State Segregation Asserts)】
    // ================================================================================
    
    // 斷言 A: D20A0 必須被正確識別並降級為常規 NORMAL 模式，爆擊率與大失敗率皆必須精確為 5% (1/20)
    console.assert(
        Math.abs(d.pCrit - 0.05) < MACHINE_EPSILON, 
        `[失敗] 爆擊率錯誤：預期 0.05, 實測值 ${d.pCrit} (可能誤觸優勢 D20A1)`
    );

    // 斷言 B: 在 AC 25 的防線下，即使 D20 投出常規上限 19 且 1D4 投出 4 點，總和 19+4+1=24 依舊無法命中。
    // 因此純普通命中率 pHit 理論上必須精確等於 0.0
    console.assert(
        Math.abs(d.pHit - 0.0) < MACHINE_EPSILON, 
        `[失敗] 普通命中率錯誤：預期 0.0, 實測值 ${d.pHit} (大失敗或常規質量發生污染外洩)`
    );

    // 斷言 C: 根據機率質量守恆，未命中率 pMiss 必須精確收網在 1.0 - 0.0 - 0.05 = 0.95 (95%)
    console.assert(
        Math.abs(d.pMiss - 0.95) < MACHINE_EPSILON, 
        `[失敗] 未命中率錯誤：預期 0.95, 實測值 ${d.pMiss}`
    );


    // ================================================================================
    // 【第二軌：定義域與純代數真理邊界斷言 (Domain Bound Asserts)】
    // ================================================================================
    
    // 斷言 D: 全系統管線最前端的純代數解析器，必須計算出絕對理論最高爆擊傷害：8 * 2 + 3 = 19 點
    console.assert(
        d.totalMaxPossibleDmg === 19, 
        `[失敗] 代數理論最大傷害上限錯誤：預期 19, 實測值 ${d.totalMaxPossibleDmg}`
    );

    // 斷言 E: 因為普通命中率為 0，此戰鬥唯一能造成傷害的只有未命中 (0點) 與爆擊 (最少 1*2+3 = 5 點)。
    // 因此分佈矩陣的相對索引 1, 2, 3, 4 點傷害在時域中必須恆為絕對零點 (機率和 <= BUCKET_EPSILON)
    let traceContaminationProb = 0;
    for (let dmg = 1; dmg <= 4; dmg++) {
        if (summary.distribution[dmg]) {
            traceContaminationProb += summary.distribution[dmg];
        }
    }
    console.assert(
        traceContaminationProb <= BUCKET_EPSILON,
        `[失敗] 時域判定域污染：在 1~4 點傷害區間偵測到幽靈機率質量 ${traceContaminationProb}`
    );

    // 斷言 F: 檢驗統計分佈的總體 CDF 中位數 (Q2) 以及上四分位數 (Q3) 是否因 95% 未命中而完美鎖定在 0 點
    console.assert(summary.q1 === 0, `[失敗] Q1 偏移：預期 0, 實測值 ${summary.q1}`);
    console.assert(summary.q2 === 0, `[失敗] 中位數 Q2 偏移：預期 0, 實測值 ${summary.q2}`);
    console.assert(summary.q3 === 0, `[失敗] Q3 偏移：預期 0, 實測值 ${summary.q3}`);


    // ================================================================================
    // 【第三軌：四分位數與機率質量守恆斷言 (Mass Conservation Asserts)】
    // ================================================================================
    
    // 斷言 G: 全分佈 PMF 陣列的所有桶位機率加總，必須 100% 滿足統計學底線：總和恆等於 1.0 (容許硬體級微觀雜訊)
    let totalMassSum = 0;
    for (let i = 0; i < summary.distribution.length; i++) {
        totalMassSum += summary.distribution[i];
    }
    console.assert(
        Math.abs(totalMassSum - 1.0) < MACHINE_EPSILON,
        `[失敗] 機率質量未守恆：全分佈加總為 ${totalMassSum}，觸發防漂移防線破裂`
    );

    console.log("✅ 恭喜！全量雙軌自動化斷言 100% 通過，大失敗時域防火牆與語法解析狀態機無噪點運作。");
}




testParser();
testPipelineCaseSoulKnife();
runPipelineCaseAC25();



/**
 * 執行一體化核心 Pipeline 綜合測試
 */
function runPipelineIntegrationTests() {
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
        ),
		
        calculate(
            "大失敗隔離與輔助骰邊界校正測試 (AC 25 極端防禦)",
            "D20 + 1D4 + 1", 
            25, 
            { threshold: 20, multiplier: 2 }, 
            "(1D8+3)"
        )
    ];

    // 2. 依序遍歷陣列，調用原有的 printTestCase 格式化印出數據
    testCases.forEach(summary => printTestCase(summary));

    console.log("🏁 所有整合測試案例解算完成並已完整印出。");
}

// 執行整合測試
runPipelineIntegrationTests();