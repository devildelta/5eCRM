// Pre-generated constants
/** @const {number} 時域微小機率漣漪抹平門檻 (用於剪枝與進出場雜訊消減) */
const BUCKET_EPSILON = 1e-12;
/** @const {number} IEEE 754 雙精度浮點數機器精度極限 (用於硬體級歸一化檢核) */
const MACHINE_EPSILON = 1e-15;
const { PREGENERATED_DICE_NORMAL } = (function() {
    const diceSizes = [4,6,8,10,12];
    const normalRegistry = {};

    for (const sides of diceSizes) {
        const normalDist = new Array(sides + 1).fill(0);
        const normalProb = 1 / sides;
        for (let s = 1; s <= sides; s++) normalDist[s] = normalProb;
        normalRegistry[`D${sides}`] = Object.freeze(normalDist);
    }

    return {
        PREGENERATED_DICE_NORMAL: Object.freeze(normalRegistry)
    };
})();

const PREGENERATED_D20_ATTACK = (function() {
    const registry = {
        DIS:    new Array(21).fill(0), // 劣勢 (-1)
        NORMAL: new Array(21).fill(0), // 常規 (0)
        ADV:    new Array(21).fill(0), // 優勢 (1)
        EA:     new Array(21).fill(0)  // 精靈準確 (2)
    };

    for (let s = 1; s <= 20; s++) {
        const clampedX = s;
        const pNormalAtLeast = (21 - clampedX) / 20;
        const pNormalNextAtLeast = (21 - (clampedX + 1)) / 20;

        registry.DIS[s] = Math.max(0, (pNormalAtLeast * pNormalAtLeast) - (pNormalNextAtLeast * pNormalNextAtLeast));

        registry.NORMAL[s] = 1 / 20;

        registry.ADV[s] = Math.max(0, (1 - Math.pow((clampedX - 1) / 20, 2)) - (1 - Math.pow(clampedX / 20, 2)));

        registry.EA[s] = Math.max(0, (1 - Math.pow((clampedX - 1) / 20, 3)) - (1 - Math.pow(clampedX / 20, 3)));
    }

    Object.keys(registry).forEach(key => Object.freeze(registry[key]));
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
function convolveMultipleFFT(pool) {
    if (pool.length === 0) return { dist: new Float64Array([1.0]), offset: 0 };
    
    let globalMinOffset = 0;
    const standardizedPool = [];

    for (const item of pool) {
        if (item.isNegative) {
            const sides = item.dist.length - 1;
            globalMinOffset -= sides;
            const reversedDist = new Float64Array(sides + 1);
            for (let s = 1; s <= sides; s++) {
                reversedDist[sides - s] = item.dist[s]; 
            }
            standardizedPool.push(reversedDist);
        } else {
			let firstValid = 0;
			for (let i = 0; i < item.dist.length; i++) {
				if (item.dist[i] > BUCKET_EPSILON) { 
					firstValid = i; 
					break; 
				}
			}
            globalMinOffset += firstValid;

            const croppedLength = item.dist.length - firstValid;
            const croppedDist = new Float64Array(croppedLength);
            for (let i = 0; i < croppedLength; i++) {
                croppedDist[i] = item.dist[i + firstValid];
            }
            standardizedPool.push(croppedDist);
        }
    }

    let maxPossibleSpan = standardizedPool.reduce((sum, dist) => sum + (dist.length - 1), 0);
    let fftSize = 1;
    while (fftSize <= maxPossibleSpan) fftSize <<= 1;

    let mainFreqBuffer = new Float64Array(fftSize * 2);
    mainFreqBuffer[0] = 1.0; 
    fftInPlace(mainFreqBuffer);

    for (const dist of standardizedPool) {
        let tempBuffer = new Float64Array(fftSize * 2);
        for (let i = 0; i < dist.length; i++) tempBuffer[2 * i] = dist[i];
        
        fftInPlace(tempBuffer);

        for (let i = 0; i < fftSize; i++) {
            const idx = 2 * i;
            const r1 = mainFreqBuffer[idx],   i1 = mainFreqBuffer[idx + 1];
            const r2 = tempBuffer[idx],       i2 = tempBuffer[idx + 1];
            mainFreqBuffer[idx]     = r1 * r2 - i1 * i2;
            mainFreqBuffer[idx + 1] = r1 * i2 + i1 * r2;
        }
    }

    fftInPlace(mainFreqBuffer, true);

    let finalDist = new Float64Array(maxPossibleSpan + 1);
	let currentSum = 0;

	for (let i = 0; i <= maxPossibleSpan; i++) {
		const val = mainFreqBuffer[2 * i];
		// 只有大於 EPSILON 的數值才會被保留，其餘微小正負噪點一律抹平成 0
		const cleanVal = val > BUCKET_EPSILON ? val : 0;
		finalDist[i] = cleanVal;
		currentSum += cleanVal;
	}

	// 2. 評審建議的防漂移歸一化 (Re-normalization)
	// 只有在總和有效且不等於 1 時才進行除法，修正機器浮點數誤差
	if (currentSum > 0 && Math.abs(currentSum - 1.0) > MACHINE_EPSILON) {
		for (let i = 0; i <= maxPossibleSpan; i++) {
			finalDist[i] /= currentSum;
		}
	}

    return { dist: finalDist, offset: globalMinOffset };
}

// Helper Subroutine
function evaluateAttackProbabilities(attackStr, targetAC, critThreshold = 20) {
    const { advantageMode, bonusDice, flatMod } = parseAttackString(attackStr);
    const safeCrit = Math.min(20, critThreshold);

    const modeMapper = { "-1": "DIS", "0": "NORMAL", "1": "ADV", "2": "EA" };
    const d20Dist = PREGENERATED_D20_ATTACK[modeMapper[advantageMode] || "NORMAL"];
    
    const cleanD20Dist = Array.from(d20Dist);
    cleanD20Dist[1] = 0;

    const distPoolForFFT = [
        { dist: cleanD20Dist, isNegative: false }
    ];
    
    for (let group of bonusDice) {
        const baseBonusDist = PREGENERATED_DICE_NORMAL[`D${group.sides}`];
        if (!baseBonusDist) throw new Error(`不支援的輔助骰類型: D${group.sides}`);
        
        const absoluteCount = Math.abs(group.count);
        const isNegativeDice = group.count < 0;

        for (let i = 0; i < absoluteCount; i++) {
            distPoolForFFT.push({ dist: baseBonusDist, isNegative: isNegativeDice });
        }
    }

    const { dist, offset } = convolveMultipleFFT(distPoolForFFT);

    let pCrit = 0;
    for (let s = safeCrit; s <= 20; s++) pCrit += d20Dist[s];

    let pValidSuccess = 0;
    for (let i = 0; i < dist.length; i++) {
        if (dist[i] <= 0) continue;

        const finalAttackRollResult = i + offset + flatMod;

        if (finalAttackRollResult >= targetAC) {
            pValidSuccess += dist[i];
        }
    }

    const pHit = Math.max(0, pValidSuccess - pCrit);
    return { pHit, pCrit, pMiss: Math.max(0, 1.0 - pHit - pCrit) };
}

function parseAttackString(attackStr) {
    const cleanStr = attackStr.replace(/\s+/g, '').toUpperCase();
    
    const tokens = cleanStr.match(/[+-]?[^+-]+/g) || [];
    
    let advantageMode = 0;
    const bonusDice = [];
    let flatMod = 0;

    for (const token of tokens) {
        const d20Match = token.match(/^([+-]?)D20([AD])?(\d*)$/);
        if (d20Match) {
            const sign = d20Match[1] === '-' ? -1 : 1;
            const type = d20Match[2];
            const count = parseInt(d20Match[3], 10) || 1;

            if (sign === -1) {
                throw new Error("核心 D20 命中骰前方不允許帶有負號！");
            }

            if (type === 'A' && count === 1) advantageMode = 1;      // D20A1
            else if (type === 'A' && count === 2) advantageMode = 2; // D20A2
            else if (type === 'D' && count === 1) advantageMode = -1; // D20D1
            else advantageMode = 0;                                  //  D20
            
            continue; 
        }

        const diceMatch = token.match(/^([+-]?\d*)D(\d+)$/);
        if (diceMatch) {
            const countStr = diceMatch[1];
            const sides = parseInt(diceMatch[2], 10);
            
            let count = 1;
            if (countStr === "" || countStr === "+") count = 1;
            else if (countStr === "-") count = -1;
            else count = parseInt(countStr, 10);

            bonusDice.push({ sides, count });
            continue;
        }

        const val = parseInt(token, 10);
        if (!isNaN(val)) {
            flatMod += val;
        }
    }

    return { advantageMode, bonusDice, flatMod };
}

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
    
    const complexMatch = cleanStr.match(/^(\d+)\s*\((.+)\)$/);
    
    if (complexMatch) {
        const repeatCount = parseInt(complexMatch[1], 10);
        const subFormulas = complexMatch[2].split(',').map(s => s.trim());
        
        const attackSequence = subFormulas.map(formula => parseSingleFormula(formula));
        return { repeatCount, attackSequence };
    } else {
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

/**
 * 配合全新離散命中 Pipeline 升級後的印表機函數
 * @param {Object} summary - 來自新版 calculate 函數回傳的完整封裝數據
 */
function printTestCase(summary) {
    const d = summary.details;

    console.log(`==================================================`);
    console.log(` ⚔️  測試案例: ${summary.caseName}`);
    console.log(`--------------------------------------------------`);
    console.log(`• 語法解析: "${d.rawDamageStr}" (極限最大總傷: ${d.totalMaxPossibleDmg})`);
    console.log(`• 命中設定: "${d.attackStr}" VS ${d.targetAC} AC`);
    console.log(`• 爆擊設定: 門檻 Natural ${d.critThreshold}+ | 爆擊傷害骰倍率: ${d.critMultiplier}x`);
    console.log(`• 單發機率: 命中 ${(d.pHit * 100).toFixed(1)}% | 爆擊 ${(d.pCrit * 100).toFixed(1)}% | 未命中 ${(d.pMiss * 100).toFixed(1)}%`);
    console.log(`• 攻擊結構: 動作重複 ${d.repeats} 次 × 每輪 ${d.attacksPerRepeat} 擊 (共 ${d.repeats * d.attacksPerRepeat} 次獨立判定)`);
    console.log(`--------------------------------------------------`);
    console.log(`   👉 有 50% 的機率，總傷害會落在 [ ${summary.q1} ～ ${summary.q3} ] 之間。`);
    console.log(`==================================================\n`);
}


/**
 * 遷移升級後的終極一體化 Pipeline 主函數
 * 
 * @param {string} caseName - 測試案例名稱
 * @param {string} attackStr - 離散命中公式字串 (例如 "D20A1 + D8 + D4 + 2")
 * @param {number} targetAC - 目標敵人的 Armor Class (例如 18)
 * @param {Object} criticalOptions - 僅包含爆擊傷害倍率的設定物件
 * @param {number} criticalOptions.multiplier - 爆擊時傷害骰增幅倍率 (預設 2x)
 * @param {number} criticalOptions.threshold - 爆擊門檻 (預設 20，用於與命中 Roller 對齊)
 * @param {string} rawDamageStr - 進階括號傷害公式字串 (例如 "2 (1D8+7, 2D8+7)")
 */
function calculate(caseName, attackStr, targetAC, criticalOptions, rawDamageStr) {
    const critMultiplier = criticalOptions.multiplier !== undefined ? criticalOptions.multiplier : 2;
    const critThreshold = criticalOptions.threshold !== undefined ? criticalOptions.threshold : 20;

    const { pHit, pCrit, pMiss } = evaluateAttackProbabilities(attackStr, targetAC, critThreshold);
    
    const { repeatCount, attackSequence } = parseAdvancedDamageString(rawDamageStr);
    const singleActionUnitPDFs = [];

    for (const attack of attackSequence) {
        const normalDiceArrays = [];
        const critDiceArrays = [];
        
        for (const group of attack.weaponDice) {
            const baseDist = PREGENERATED_DICE_NORMAL[`D${group.sides}`];
            if (!baseDist) throw new Error(`不支援的骰子類型: D${group.sides}`);
            
            for (let i = 0; i < group.count; i++) {
                normalDiceArrays.push({ dist: baseDist, isNegative: false });
            }
            for (let i = 0; i < group.count * critMultiplier; i++) {
                critDiceArrays.push({ dist: baseDist, isNegative: false });
            }
        }
        
        const { dist: hitDiceDist } = convolveMultipleFFT(normalDiceArrays);
        const { dist: critDiceDist } = convolveMultipleFFT(critDiceArrays);
        
        const maxSingleDmg = Math.max(hitDiceDist.length - 1 + attack.flatMod, critDiceDist.length - 1 + attack.flatMod, 0);
        const singleAttackPDF = new Array(maxSingleDmg + 1).fill(0);
        
        singleAttackPDF[0] = pMiss;
        
        for (let i = 0; i < hitDiceDist.length; i++) {
            if (hitDiceDist[i] > 0) singleAttackPDF[i + attack.flatMod] += hitDiceDist[i] * pHit;
        }
        for (let i = 0; i < critDiceDist.length; i++) {
            if (critDiceDist[i] > 0) singleAttackPDF[i + attack.flatMod] += critDiceDist[i] * pCrit;
        }
        
        singleActionUnitPDFs.push({ dist: singleAttackPDF, isNegative: false });
    }
    
    const { dist: singleActionCombinedPDF } = convolveMultipleFFT(singleActionUnitPDFs);
    
    const finalSequencePool = [];
    for (let i = 0; i < repeatCount; i++) {
        finalSequencePool.push({ dist: singleActionCombinedPDF, isNegative: false });
    }
    
    const { dist: finalTotalDist } = convolveMultipleFFT(finalSequencePool);
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
            attackStr, targetAC, critThreshold, critMultiplier, rawDamageStr,
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
//TODO: refactor
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

//TODO: refactor
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
