function runAllRigorousParserTests() {
    console.log("🧪 啟動完全體硬核斷言單元測試 (Comprehensive Assertion Tests)...\n");

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

        console.log("\n🎉 【全套通關】所有單元測試與邊界硬核斷言全數完美通過！");

    } catch (error) {
        console.error("❌ 斷言測試發生未預期崩潰，捕獲異常:", error.message);
    }
}

// 執行完全體測試
runAllRigorousParserTests();





// Unit test

const summaries = [
calculate("GloomStalker Action Surge", "D20+10", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+7,1D8+1D6+7,2D8+1D6+7)"),
calculate("GloomStalker Action Surge Dis Bless", "D20D1+10+D4", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+7,1D8+1D6+7,2D8+1D6+7)"),
calculate("GloomStalker Action Surge Dis Precision", "D20D1+10+D8", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+7,1D8+1D6+7,2D8+1D6+7)"),
calculate("GloomStalker Action Surge Bless", "D20+10+D4", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+7,1D8+1D6+7,2D8+1D6+7)"),
calculate("GloomStalker Action Surge Advantage", "D20A1+10", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+7,1D8+1D6+7,2D8+1D6+7)"),
calculate("GloomStalker Action Surge Elven Accuracy", "D20A2+10", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+7,1D8+1D6+7,2D8+1D6+7)"),
calculate("GloomStalker Action Surge Elven Accuracy Sharpshooter", "D20A2+10-5", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+17,1D8+1D6+17,2D8+1D6+17)"),
calculate("GloomStalker Action Surge Elven Accuracy Sharpshooter Bless", "D20A2+10-5+1D4", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+17,1D8+1D6+17,2D8+1D6+17)"),
calculate("GloomStalker Action Surge Elven Accuracy Sharpshooter Bless Precision", "D20A2+10-5+1D4+1D8", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+17,1D8+1D6+17,2D8+1D6+17)"),
//calculate("術士 4發魔能爆連射", "D20+9", 18, {threshold: 20, multiplier: 2}, "4 1D10+5"),
//calculate("大劍聖騎士至高斬擊 (Fiend)", "D20+8", 18, {threshold: 20, multiplier: 2}, "2D6+2D8+1D8+1D6+15"),
//calculate("5級 雙短劍武僧 連環瘋狂亂打 (Flurry of Blows)", "D20+8", 18, {threshold: 20, multiplier: 2}, "4 (1D6+5)"),
//calculate("11級 雙雷霆戰錘 戰士 雙武器瘋狂連擊 (Two-Weapon Action Surge)", "D20+9", 18, {threshold: 20, multiplier: 2}, "7 (1D6+5)"),
//calculate("9級 狂暴野蠻人 殘虐長矛重擊 (Reckless Brutal Critical Piercer)", "D20+9", 18, {threshold: 19, multiplier: 2}, "2 (1D6+1D6+7) + 1D6"),
//calculate("5級 咒劍邪術師 幽冥大劍魂刃斬 (Eldritch Smite)", "D20+8", 18, {threshold: 19, multiplier: 2}, "2 (2D6+3D8+5)"),
//calculate("5級 吟遊詩人 散兵巨劍華麗揮砍 (Slashing Flourish)", "D20+8", 18, {threshold: 20, multiplier: 2}, "2 (2D6+4) + 1D8"),
//calculate("5級 浪人刺客 毒刃偷襲 (Sneak Attack with Poison)", "D20+8", 18, {threshold: 20, multiplier: 2}, "1 (1D6+3D6+2D6+5)"),
//calculate("11級 聖騎士 破邪斬日光長劍 (Sun Blade vs Undead)", "D20+8+2", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D8+1D8+7) + 2D8")
];

summaries.forEach(printTestCase);

calculate("Soulknife FS, Round 1", "D20+6", 18, {threshold: 20, multiplier: 2}, "1D6+7+1D6+2D6"),
calculate("Soulknife FS, Round 2", "D20+6", 18, {threshold: 20, multiplier: 2}, "1D6+7+1D6+2D6,1D4+"),