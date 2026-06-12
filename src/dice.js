// Pre-generated constants
const PREGENERATED_DICE = (function() {
    const registry = {};
    for (const sides of [4, 6, 8, 10, 12, 20]) {
        const dist = new Array(sides + 1).fill(0);
        const prob = 1 / sides;
        for (let s = 1; s <= sides; s++) dist[s] = prob;
        registry[`D${sides}`] = Object.freeze(dist);
    }
    return Object.freeze(registry);
})();

// FFT
function fftInPlace(buffer, inverse = false) {
    const n = buffer.length / 2;
    if (n <= 1) return;
    for (let i = 0, j = 0; i < n; i++) {
        if (i < j) {
            [buffer[2 * i], buffer[2 * j]] = [buffer[2 * j], buffer[2 * i]];
            [buffer[2 * i + 1], buffer[2 * j + 1]] = [buffer[2 * j + 1], buffer[2 * i + 1]];
        }
        let bit = n >> 1;
        while (j & bit) { j ^= bit; bit >>= 1; }
        j ^= bit;
    }

    const dir = inverse ? 1 : -1;
    for (let len = 2; len <= n; len <<= 1) {
        const ang = (2 * Math.PI / len) * dir;
        const wlen_r = Math.cos(ang), wlen_i = Math.sin(ang);
        for (let i = 0; i < n; i += len) {
            let w_r = 1.0, w_i = 0.0;
            const halfLen = len >> 1;
            for (let j = 0; j < halfLen; j++) {
                const u = 2 * (i + j), v = 2 * (i + j + halfLen);
                const t_r = buffer[v] * w_r - buffer[v+1] * w_i;
                const t_i = buffer[v] * w_i + buffer[v+1] * w_r;
                [buffer[v], buffer[v + 1], buffer[u], buffer[u + 1]] = [
                    buffer[u] - t_r,
                    buffer[u + 1] - t_i,
                    buffer[u] + t_r,
                    buffer[u + 1] + t_i
                ];

                [w_r, w_i] = [w_r * wlen_r - w_i * wlen_i, w_r * wlen_i + w_i * wlen_r];
            }
        }
    }

    // 3. 逆變換時需要除以 N
    if (inverse) {
        for (let i = 0; i < buffer.length; i++) {
            buffer[i] /= n;
        }
    }
}
function convolveMultipleFFT(individualDists) {
    if (individualDists.length === 0) return new Float64Array([1.0]);
    let maxDmg = individualDists.reduce((sum, dist) => sum + (dist.length - 1), 0);
    let fftSize = 1;
    while (fftSize <= maxDmg) fftSize <<= 1;

    let mainFreqBuffer = new Float64Array(fftSize * 2);
    mainFreqBuffer[0] = 1.0; 
    fftInPlace(mainFreqBuffer);

    for (const dist of individualDists) {
        let tempBuffer = new Float64Array(fftSize * 2);
        for (let i = 0; i < dist.length; i++) tempBuffer[2 * i] = dist[i];
        fftInPlace(tempBuffer);

        for (let i = 0; i < fftSize; i++) {
            const idx = 2 * i;
            const r1 = mainFreqBuffer[idx],   i1 = mainFreqBuffer[idx+1];
            const r2 = tempBuffer[idx],       i2 = tempBuffer[idx+1];
            mainFreqBuffer[idx]   = r1 * r2 - i1 * i2;
            mainFreqBuffer[idx+1] = r1 * i2 + i1 * r2;
        }
    }
    fftInPlace(mainFreqBuffer, true);
    let finalDist = new Float64Array(maxDmg + 1);
    for (let i = 0; i <= maxDmg; i++) finalDist[i] = Math.max(0, mainFreqBuffer[2 * i]);
    return finalDist;
}

// Helper Subroutine
function calculateHitProbabilities(toHit, targetAC, safeCrit, advantageMode) {
    // 考慮 D&D 規則：大於等於 20 的 AC 需要骰 20，但大武器必失誤規則下最低需要 2 點
    const neededRoll = Math.max(2, targetAC - toHit);
    
    // 爆擊必定命中，普通命中最低限制為 2 點，找到兩者之間能造成命中的最低門檻
    const lowestRollToHitAtAll = Math.min(safeCrit, neededRoll);
    
    // 核心解析幾何相減法
    const pTotalHit = probAtLeast(lowestRollToHitAtAll, advantageMode);
    const pCrit = probAtLeast(safeCrit, advantageMode);
    
    // 普通命中機率 = 總命中率 - 爆擊率
    const pHit = Math.max(0, pTotalHit - pCrit);
    const pMiss = 1.0 - pHit - pCrit;
    
    return { pHit, pCrit, pMiss };
}
/*
function calculateHitProbabilities(toHit, targetAC, critThreshold = 20) {
    const safeCrit = Math.min(20, critThreshold);
    const neededRoll = Math.max(2, Math.min(20, targetAC - toHit));
    const critFaces = 21 - safeCrit;
    const hitFaces = Math.max(0, safeCrit - neededRoll);
    return { pHit: hitFaces / 20, pCrit: critFaces / 20, pMiss: 1.0 - (hitFaces / 20) - (critFaces / 20) };
}
*/
function parseSingleFormula(formulaStr) {
    const tokens = formulaStr.replace(/\s+/g, '').toUpperCase().match(/[+-]?[^+-]+/g) || [];
    const diceMap = new Map();
    let flatMod = 0;

    for (const token of tokens) {
        const diceMatch = token.match(/^([+-]?\d*)D(\d+)$/);
        if (diceMatch) {
            let countStr = diceMatch[1];
            const sides = parseInt(diceMatch[2], 10);
            let count = (countStr === "" || countStr === "+") ? 1 : (countStr === "-") ? -1 : parseInt(countStr, 10);
            diceMap.set(sides, (diceMap.get(sides) || 0) + count);
        } else {
            const val = parseInt(token, 10);
            if (!isNaN(val)) flatMod += val;
        }
    }

    const weaponDice = Array.from(diceMap.entries())
        .filter(([_, c]) => c > 0)
        .map(([sides, count]) => ({ sides, count }));

    return { weaponDice, flatMod };
}

function parseAdvancedDamageString(damageStr) {
    const cleanStr = damageStr.trim();
    
    // 檢查是否符合 數字 + ( ... ) 的複合語法
    const complexMatch = cleanStr.match(/^(\d+)\s*\((.+)\)$/);
    
    if (complexMatch) {
        const repeatCount = parseInt(complexMatch[1], 10);
        // 用逗號拆分括號內的各發獨立攻擊字串
        const subFormulas = complexMatch[2].split(',').map(s => s.trim());
        
        const attackSequence = subFormulas.map(formula => parseSingleFormula(formula));
        return { repeatCount, attackSequence };
    } else {
        // 如果沒有括號，相容舊有的單發/多發語法 (例如 "4 1D10+5")
        const spaceIndex = cleanStr.indexOf(' ');
        let repeatCount = 1;
        let singleFormula = cleanStr;
        
        if (spaceIndex !== -1) {
            const prefix = cleanStr.substring(0, spaceIndex);
            if (/^\d+$/.test(prefix)) {
                repeatCount = parseInt(prefix, 10);
                singleFormula = cleanStr.substring(spaceIndex + 1);
            }
        }
        return { repeatCount, attackSequence: [parseSingleFormula(singleFormula)] };
    }
}

function probAtLeast(x, advantageMode) {
    const clampedX = Math.max(1, Math.min(21, x));
    const pNormal = (21 - clampedX) / 20;
    
    if (advantageMode === -1) return pNormal * pNormal;                      // 劣勢: p(x)^2
    if (advantageMode === 1)  return 1 - Math.pow((clampedX - 1) / 20, 2);   // 優勢: 1 - (x-1)^2/400
    if (advantageMode === 2)  return 1 - Math.pow((clampedX - 1) / 20, 3);   // 精靈準確: 1 - (x-1)^3/8000
    return pNormal;                                                          // 常規
}



/**
 * 解耦的一體化印表機 (僅接收單一 summary 物件參數)
 * @param {Object} summary - 來自 calculate 函數打包的完整數據物件
 */
function printTestCase(summary) {
    const d = summary.details;
    const modeNames = { 
        "-1": "劣勢 (Disadvantage)", 
        "0": "常規 (Normal)", 
        "1": "優勢 (Advantage)", 
        "2": "精靈準確 (Elven Accuracy 💥)" 
    };

    console.log(`==================================================`);
    console.log(` ⚔️  測試案例: ${summary.caseName}`);
    console.log(`--------------------------------------------------`);
    console.log(`• 語法解析: "${d.rawDamageStr}" (極限最大總傷: ${d.totalMaxPossibleDmg})`);
	console.log(`• 骰子設定: +${d.toHit} 命中 VS ${d.targetAC} AC | 狀態: ${modeNames[d.advMode] || "未知"}`);
    console.log(`• 爆擊設定: 門檻 Natural ${d.critThreshold}+ | 爆擊傷害骰倍率: ${d.critMultiplier}x`);
    console.log(`• 單發機率: 命中 ${(d.pHit * 100).toFixed(1)}% | 爆擊 ${(d.pCrit * 100).toFixed(1)}% | 未命中 ${(d.pMiss * 100).toFixed(1)}%`);
    console.log(`• 攻擊結構: 動作重複 ${d.repeats} 次 × 每輪 ${d.attacksPerRepeat} 擊 (共 ${d.repeats * d.attacksPerRepeat} 次獨立判定)`);
    console.log(`--------------------------------------------------`);
    console.log(`   👉 有 50% 的機率，總傷害會落在 [ ${summary.q1} ～ ${summary.q3} ] 之間。`);
    console.log(`==================================================\n`);
}


// actual entry function
function calculate(caseName, toHit, targetAC, criticalOptions, rawDamageStr) {
    // 解構 Options 並給予嚴格的防呆預設值
    const critThreshold = criticalOptions.threshold !== undefined ? criticalOptions.threshold : 20;
    const critMultiplier = criticalOptions.multiplier !== undefined ? criticalOptions.multiplier : 2;
    const advMode = criticalOptions.advantageMode !== undefined ? criticalOptions.advantageMode : 0;

    const safeCrit = Math.min(20, critThreshold);
    const { repeatCount, attackSequence } = parseAdvancedDamageString(rawDamageStr);
    const { pHit, pCrit, pMiss } = calculateHitProbabilities(toHit, targetAC, safeCrit, advMode);
    
    const singleActionUnitPDFs = [];

    // 遍歷序列中的每一發獨立攻擊
    for (const attack of attackSequence) {
        const normalDiceArrays = [];
        const critDiceArrays = [];
        
        for (const group of attack.weaponDice) {
            const baseDist = PREGENERATED_DICE[`D${group.sides}`];
            if (!baseDist) throw new Error(`不支援的骰子類型: D${group.sides}`);
            
            for (let i = 0; i < group.count; i++) normalDiceArrays.push(baseDist);
            for (let i = 0; i < group.count * critMultiplier; i++) critDiceArrays.push(baseDist);
        }
        
        const hitDiceDist = convolveMultipleFFT(normalDiceArrays);
        const critDiceDist = convolveMultipleFFT(critDiceArrays);
        
        const maxSingleDmg = Math.max(hitDiceDist.length - 1 + attack.flatMod, critDiceDist.length - 1 + attack.flatMod, 0);
        const singleAttackPDF = new Array(maxSingleDmg + 1).fill(0);
        
        singleAttackPDF[0] = pMiss;
        for (let i = 0; i < hitDiceDist.length; i++) {
            if (hitDiceDist[i] > 0) singleAttackPDF[i + attack.flatMod] += hitDiceDist[i] * pHit;
        }
        for (let i = 0; i < critDiceDist.length; i++) {
            if (critDiceDist[i] > 0) singleAttackPDF[i + attack.flatMod] += critDiceDist[i] * pCrit;
        }
        
        singleActionUnitPDFs.push(singleAttackPDF);
    }
    
    const singleActionCombinedPDF = convolveMultipleFFT(singleActionUnitPDFs);
    
    const finalSequencePool = [];
    for (let i = 0; i < repeatCount; i++) finalSequencePool.push(singleActionCombinedPDF);
    
    const finalTotalDist = convolveMultipleFFT(finalSequencePool);
    const maxDmg = finalTotalDist.length - 1;
    
    let cumulativeProbability = 0;
    let q1 = null, q2 = null, q3 = null;
    for (let d = 0; d <= maxDmg; d++) {
        cumulativeProbability += finalTotalDist[d];
        if (q1 === null && cumulativeProbability >= 0.25) q1 = d;
		if (q2 === null && cumulativeProbability >= 0.50) q2 = d;
        if (q3 === null && cumulativeProbability >= 0.75) { q3 = d; break; }
    }
    
    return { 
        caseName, q1, q2, q3, 
        details: { 
            toHit, targetAC, critThreshold: safeCrit, critMultiplier, advMode, rawDamageStr,
            repeats: repeatCount, attacksPerRepeat: attackSequence.length,
            pHit, pCrit, pMiss, totalMaxPossibleDmg: maxDmg 
        } 
    };
}

/**
 * 橫向對比生成器：遍歷不同 AC 與優勢狀態，輸出一體化對比矩陣表格
 * @param {number} toHit - 基礎命中加值
 * @param {Object} critOptions - 包含 threshold 和 multiplier 的爆擊設定 (此處不傳入 advantageMode，由迴圈控制)
 * @param {string} damageStr - 傷害公式字串 (例如 "2 (1D8+1D6+7, 1D8+1D6+7, 2D8+1D6+7)")
 * @param {Array<number>} acRange - 想要測試的 AC 陣列，預設為 [10, 12, 14, 16, 18, 20, 22]
 */
function generateComparisonTable(toHit, critOptions, damageStr, acRange = [10,12,14,16,18,20,22]) {
    const modes = [
        { code: -1, name: "劣勢 DIS" },
        { code: 0,  name: "常規 NOR" },
        { code: 1,  name: "優勢 ADV" },
        { code: 2,  name: "精靈準確 EA" }
    ];

    const tableData = [];

    // 遍歷所有指定的防禦 AC 點
    for (const ac of acRange) {
        // 建立一列（Row）的基礎資料
        const row = { "目標 AC": `AC ${ac}` };

        // 遍歷 4 種不同的優勢狀態
        for (const mode of modes) {
            // 動態組裝當前狀況的完整 criticalOptions
            const currentCritOptions = {
                threshold: critOptions.threshold,
                multiplier: critOptions.multiplier,
                advantageMode: mode.code
            };

            // 呼叫你的固定核心 Pipeline 主函數進行精確計算
            const result = calculate(`AC:${ac}_Mode:${mode.code}`, toHit, ac, currentCritOptions, damageStr);

            // 將 Q1 和 Q3 的傷害範圍打包成乾淨的字串格式 "Q1~Q3"
            row[mode.name] = `[${result.q1} ～ ${result.q3}]`;
        }

        tableData.push(row);
    }

    // 輸出美化報告
    console.log(`======================================================================`);
    console.log(` 📊 橫向對比矩陣報告`);
    console.log(`======================================================================`);
    console.log(`• 基礎命中: +${toHit} | 爆擊門檻: Natural ${critOptions.threshold || 20}+ | 爆擊骰倍率: ${critOptions.multiplier || 2}x`);
    console.log(`• 測試公式: "${damageStr}"`);
    console.log(`----------------------------------------------------------------------`);
    
    // 利用原生的 JavaScript console.table 進行完美網格排版
    console.table(tableData);
    
    console.log(`======================================================================\n`);
}

/**
 * 神射手天賦 (-5/+10) 橫向壓測對比矩陣 (穩健 Steady DPS 決策版)
 * @param {number} baseToHit - 基礎命中加值 (例如 7)
 * @param {Object} critOptions - 包含 threshold, multiplier, advantageMode 的爆擊設定
 * @param {string} rawDamageStr - 基礎傷害公式字串 (例如 "2 (1D8+7, 2D8+7)")
 * @param {Array<number>} acRange - 想要測試的目標 AC 陣列
 */
/**
 * 神射手天賦 (-5/+10) 橫向壓測對比矩陣 (全方位決策版：包含 Q1 下限、Q3 爆發與 Q4 極限最大總傷)
 * @param {number} baseToHit - 基礎命中加值 (例如 7)
 * @param {Object} critOptions - 包含 threshold, multiplier, advantageMode 的爆擊設定
 * @param {string} rawDamageStr - 基礎傷害公式字串
 * @param {Array<number>} acRange - 想要測試的目標 AC 陣列
 */
/**
 * 神射手天賦 (-5/+10) 橫向壓測對比矩陣 (Q1/Q2/Q3 一致格式決策版)
 * @param {number} baseToHit - 基礎命中加值 (例如 7)
 * @param {Object} critOptions - 包含 threshold, multiplier, advantageMode 的爆擊設定
 * @param {string} rawDamageStr - 基礎傷害公式字串 (例如 "2 (1D8+7, 2D8+7)")
 * @param {Array<number>} acRange - 想要測試的目標 AC 陣列
 */
function generateSharpshooterTable(baseToHit, critOptions, rawDamageStr, acRange = [10,12,14,16,18,20,22]) {
    let ssDamageStr = "";
    const complexMatch = rawDamageStr.trim().match(/^(\d+)\s*\((.+)\)$/);
    
    // 1. 自動為多軌括號語法內的每一發攻擊精準加上 +10
    if (complexMatch) {
        const repeatCount = complexMatch[1]; // 拿取次數
        const innerFormulas = complexMatch[2]; // 拿取括號內的核心字串
        
        // 對字串調用 split，並為每一發獨立攻擊公式尾端加上 +10
        const subFormulas = innerFormulas.split(',').map(s => `${s.trim()}+10`);
        ssDamageStr = `${repeatCount} (${subFormulas.join(', ')})`;
    } else {
        ssDamageStr = `${rawDamageStr.trim()}+10`;
    }

    const tableData = [];

    // 2. 遍歷指定的防禦 AC 區間
    for (const ac of acRange) {
        const row = { "目標 AC": `AC ${ac}` };

        // 呼叫 Pipeline 核心進行精確計算
        const normalResult = calculate(`AC:${ac}_Normal`, baseToHit, ac, critOptions, rawDamageStr);
        const ssResult = calculate(`AC:${ac}_SS`, baseToHit - 5, ac, critOptions, ssDamageStr);

        // 3. 提取常規組與特技組的 Q1, Q2, Q3 (Q2 需掃描累積機率達到 50%)
        const getQ2 = (dist) => {
            let cum = 0;
            for (let d = 0; d < dist.length; d++) {
                cum += dist[d];
                if (cum >= 0.50) return d;
            }
            return 0;
        };

        // 由於之前核心只回傳了 q1 和 q3，我們這裡利用相同的 cdf 邏輯在印表機內現場解出 Q2 差值
        // 為了避免重複計算，我們直接將原結果的 cdf 分佈拿來抓 Q2 點
        // 註：這步假設 calculate 回傳的結果包含全分佈，若無，我們可以直接用常規組與特技組的結果進行快速差值封裝。
        // 為確保安全，我們直接從結果中衍生出 Q1, Q2, Q3 的對比
        
        // 核心指標 1：Q1 差值 (保底 Steady DPS 增長)
        const q1Diff = ssResult.q1 - normalResult.q1;
        if (q1Diff > 0) row["Q1保底 (25%)"] = `+${q1Diff} 🟢`;
        else if (q1Diff === 0) row["Q1保底 (25%)"] = ` 0 🟡`;
        else row["Q1保底 (25%)"] = `${q1Diff} 🔴`;

        // 核心指標 2：Q2 差值 (中段 Median DPS 增長)
        const q2Diff = ssResult.q2 - normalResult.q2; // 確保你的 calculate 函數回傳結構已帶有 q2 屬性
        if (q2Diff > 0) row["Q2中衛 (50%)"] = `+${q2Diff} 🟢`;
        else if (q2Diff === 0) row["Q2中衛 (50%)"] = ` 0 🟡`;
        else row["Q2中衛 (50%)"] = `${q2Diff} 🔴`;

        // 核心指標 3：Q3 差值 (中高爆發 Burst 增長)
        const q3Diff = ssResult.q3 - normalResult.q3;
        if (q3Diff > 0) row["Q3爆發 (75%)"] = `+${q3Diff} 🟢`;
        else if (q3Diff === 0) row["Q3爆發 (75%)"] = ` 0 🟡`;
        else row["Q3爆發 (75%)"] = `${q3Diff} 🔴`;

        tableData.push(row);
    }

    // 4. 輸出美化表格報告
    const modeNames = { "-1": "劣勢 DIS", "0": "常規 NOR", "1": "優勢 ADV", "2": "精靈準確 EA" };
    console.log(`================================================================================`);
    console.log(` 🎯 神射手天賦 (Sharpshooter -5/+10) 統一格式決策矩陣 (Q1 / Q2 / Q3 橫向掃描)`);
    console.log(`================================================================================`);
    console.log(" 🟢 = 特技勝出 | 🟡 = 數值持平 | 🔴 = 常規勝出 (特技導致衰退)");
    console.log(`--------------------------------------------------------------------------------`);
    
    console.table(tableData);
    
    console.log(`================================================================================\n`);
}




// Unit test

const summaries = [
calculate("術士 4發魔能爆連射", 9, 18, {threshold: 20, multiplier: 2}, "4 1D10+5"),
calculate("大劍聖騎士至高斬擊 (Fiend)", 8, 18, {threshold: 20, multiplier: 2}, "2D6+2D8+1D8+1D6+15"),
calculate("5級 雙短劍武僧 連環瘋狂亂打 (Flurry of Blows)", 8, 18, {threshold: 20, multiplier: 2}, "4 (1D6+5)"),
calculate("GloomStalker Action Surge", 10, 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+7,1D8+1D6+7,2D8+1D6+7)"),
calculate("GloomStalker Action Surge Advantage", 10, 18, {threshold: 20, multiplier: 2, advantageMode: 1}, "2 (1D8+1D6+7,1D8+1D6+7,2D8+1D6+7)"),
calculate("GloomStalker Action Surge Elven Accuracy", 10, 18, {threshold: 20, multiplier: 2, advantageMode: 2}, "2 (1D8+1D6+7,1D8+1D6+7,2D8+1D6+7)"),
calculate("GloomStalker Action Surge Elven Accuracy Sharpshooter", 5, 18, {threshold: 20, multiplier: 2, advantageMode: 2}, "2 (1D8+1D6+17,1D8+1D6+17,2D8+1D6+17)"),
calculate("11級 雙雷霆戰錘 戰士 雙武器瘋狂連擊 (Two-Weapon Action Surge)", 9, 18, {threshold: 20, multiplier: 2}, "7 (1D6+5)"),
calculate("9級 狂暴野蠻人 殘虐長矛重擊 (Reckless Brutal Critical Piercer)", 9, 18, {threshold: 19, multiplier: 2}, "2 (1D6+1D6+7) + 1D6"),
calculate("5級 咒劍邪術師 幽冥大劍魂刃斬 (Eldritch Smite)", 8, 18, {threshold: 19, multiplier: 2}, "2 (2D6+3D8+5)"),
calculate("5級 吟遊詩人 散兵巨劍華麗揮砍 (Slashing Flourish)", 8, 18, {threshold: 20, multiplier: 2}, "2 (2D6+4) + 1D8"),
calculate("5級 浪人刺客 毒刃偷襲 (Sneak Attack with Poison)", 8, 18, {threshold: 20, multiplier: 2}, "1 (1D6+3D6+2D6+5)"),
calculate("11級 聖騎士 破邪斬日光長劍 (Sun Blade vs Undead)", 10, 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D8+1D8+7) + 2D8")
];

summaries.forEach(printTestCase);
