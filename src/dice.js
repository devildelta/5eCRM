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
/**
 * 評估單發打擊的命中、爆擊與未命中機率 (三態分離)
 * 
 * @param {string} attackStr - 命中公式字串 (例如 "D20A1 + 5 + D4")
 * @param {number} targetAC - 目標敌人的 Armor Class
 * @param {number} critThreshold - 爆擊原生門檻 (Natural Roll, 預設 20)
 * @returns {Object} 包含 pHit, pCrit, pMiss 的三態互斥機率物件
 */
function evaluateAttackProbabilities(attackStr, targetAC, critThreshold = 20) {
    const { advantageMode, bonusDice, flatMod } = parseAttackString(attackStr);
    const safeCrit = Math.min(20, Math.floor(critThreshold));

    const modeMapper = { "-1": "DIS", "0": "NORMAL", "1": "ADV", "2": "EA" };
    const d20Dist = PREGENERATED_D20_ATTACK[modeMapper[advantageMode] || "NORMAL"];
    
    const distPoolForFFT = [
        { dist: d20Dist, isNegative: false }
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

    // 爆擊完全、唯一取決於核心 D20 骰子的原生面點數 (Natural Roll)
    let pCrit = 0;
    for (let s = safeCrit; s <= 20; s++) pCrit += d20Dist[s];

    let pValidSuccess = 0;
    for (let i = 0; i < dist.length; i++) {
        if (dist[i] <= BUCKET_EPSILON) continue;

		// 【核心修正】：利用時域物理對齊，反向還原出這一點中「包含核心 D20 原生投出 1 點」的成分
		// 如果這次摺積結果的點數，扣除輔助骰後，核心 D20 貢獻的是 1 點 (大失敗)，依規則強制落入未命中
		// 在沒有其他輔助骰干擾或純固定值加值下，這等同於：
		const d20Part = i + offset; 
		if (d20Part === 1) {
			continue; // 大失敗保底剪枝：直接跳過，不計入成功率
		}
        const finalAttackRollResult = i + offset + flatMod;
        if (finalAttackRollResult >= targetAC) {
            pValidSuccess += dist[i];
        }
    }

    const pHit = Math.max(0, pValidSuccess - pCrit);
    const pMiss = Math.max(0, 1.0 - pHit - pCrit);
    
    return { pHit, pCrit, pMiss };
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

/**
 * 基礎單擊公式解析器 (此時專職解析純武器傷害與固定加值，不包含 PR 字串)
 */
function parseSingleFormula(formulaStr) {
    const cleanStr = formulaStr.replace(/\s+/g, '').toUpperCase();
    const tokens = cleanStr.match(/[+-]?[^+-]+/g) || [];
    
    const weaponDiceMap = new Map();
    let flatMod = 0;

    for (const token of tokens) {
        const diceMatch = token.match(/^([+-]?\d*)D(\d+)$/);
        if (diceMatch) {
            let countStr = diceMatch[1];
            const sides = parseInt(diceMatch[2], 10);
            let count = (countStr === "" || countStr === "+") ? 1 : (countStr === "-") ? -1 : parseInt(countStr, 10);
            weaponDiceMap.set(sides, (weaponDiceMap.get(sides) || 0) + count);
            continue;
        }

        const val = parseInt(token, 10);
        if (!isNaN(val)) flatMod += val;
    }

    const weaponDice = Array.from(weaponDiceMap.entries())
        .filter(([_, c]) => c > 0)
        .map(([sides, count]) => ({ sides: Math.floor(sides), count: Math.floor(count) }));

    return { weaponDice, flatMod: Math.floor(flatMod) };
}

/**
 * 專職解析單獨 PR 字串的微型輔助函式
 */
function parsePrFormula(prStr) {
    const cleanStr = prStr.replace(/\s+/g, '').toUpperCase();
    const tokens = cleanStr.match(/[+-]?[^+-]+/g) || [];
    const prDiceMap = new Map();

    for (const token of tokens) {
        const prMatch = token.match(/^([+-]?\d*)D(\d+)PR$/);
        if (prMatch) {
            let countStr = prMatch[1];
            const sides = parseInt(prMatch[2], 10);
            let count = (countStr === "" || countStr === "+") ? 1 : (countStr === "-") ? -1 : parseInt(countStr, 10);
            prDiceMap.set(sides, (prDiceMap.get(sides) || 0) + count);
        }
    }

    return Array.from(prDiceMap.entries())
        .filter(([_, c]) => c > 0)
        .map(([sides, count]) => ({ sides: Math.floor(sides), count: Math.floor(count) }));
}

/**
 * 終極嵌套版：進階跨輪輸出 (DPR) 序列解析器
 * 【升級】：完美支援外層定義輪次重複、內層定義單擊重複（例如 "2 (2 1D8+1D6+17, 2D8+1D6+17)"）
 */
function parseAdvancedDamageString(damageStr) {
    const cleanStr = damageStr.trim();
    const roundSequencePool = [];

    // 1. 分割外層「輪次群組」 (保護括號內層)
    const groupMatches = cleanStr.match(/(?:\d+\s*)?\([^)]+\)/g) || [];

    if (groupMatches.length === 0) {
        // 降級相容常規無括號語法
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
        const isPr = singleFormula.toUpperCase().includes("PR");
        const roundStructure = {
            attacks: isPr ? [] : [parseSingleFormula(singleFormula)],
            prDices: isPr ? parsePrFormula(singleFormula) : []
        };
        for (let i = 0; i < repeatCount; i++) roundSequencePool.push(roundStructure);
        return roundSequencePool;
    }

    // 2. 遍歷每個輪次群組
    for (const groupStr of groupMatches) {
        const trimmedGroup = groupStr.trim();
        const complexMatch = trimmedGroup.match(/^(\d+)\s*\((.+)\)$/);
        
        let repeatCount = 1;
        let subFormulasStr = "";

        if (complexMatch) {
            repeatCount = parseInt(complexMatch, 10);
            subFormulasStr = complexMatch[2];
        } else {
            const noPrefixMatch = trimmedGroup.match(/^\((.+)\)$/);
            if (noPrefixMatch) subFormulasStr = noPrefixMatch[1];
        }

        if (!subFormulasStr) continue;

        // 3. 內層逗號拆分後，進行打擊與 PR 資源分流
        const subTokens = subFormulasStr.split(',').map(s => s.trim());
        
        const attacks = [];
        const globalPrMap = new Map();

        for (const token of subTokens) {
            if (token.toUpperCase().includes("PR")) {
                // 它是全輪共享增傷池
                const extractedPrDices = parsePrFormula(token);
                for (const dice of extractedPrDices) {
                    globalPrMap.set(dice.sides, (globalPrMap.get(dice.sides) || 0) + dice.count);
                }
            } else {
                // 【核心升級】：檢查是否帶有內層打擊重複前綴 (例如 "2 1D8+1D6+17")
                const innerRepeatMatch = token.match(/^(\d+)\s+(.+)$/);
                if (innerRepeatMatch) {
                    const innerCount = parseInt(innerRepeatMatch[1], 10);
                    const actualFormula = innerRepeatMatch[2];
                    const parsedAttack = parseSingleFormula(actualFormula);
                    
                    // 根據內層係數，將同一個打擊公式獨立複製 N 次放入打擊時序中
                    for (let c = 0; c < innerCount; c++) {
                        attacks.push(JSON.parse(JSON.stringify(parsedAttack))); // 深拷貝防止引用污染
                    }
                } else {
                    // 常規單發打擊
                    attacks.push(parseSingleFormula(token));
                }
            }
        }

        const prDices = Array.from(globalPrMap.entries())
            .map(([sides, count]) => ({ sides, count }));

        const roundStructure = { attacks, prDices };

        // 依外層重複係數展開為多輪
        for (let i = 0; i < repeatCount; i++) {
            roundSequencePool.push(roundStructure);
        }
    }

    return roundSequencePool;
}

/**
 * 升級版：格式化印出測試案例統計數據 (四分位數與解析理論最大值一體化整合)
 * 
 * @param {Object} summary - 由 calculate() 傳回的統計數據總物件
 */
function printTestCase(summary) {
    const d = summary.details;
    
    // 動態調用解析器以獲取即時的結構詳情，確保與最新嵌套語法格式 100% 同步
    const roundsBlueprint = parseAdvancedDamageString(d.rawDamageStr);
    const totalRounds = roundsBlueprint.length;
    
    // 計算全戰鬥總打擊次數
    const totalAttackAttempts = roundsBlueprint.reduce((sum, r) => sum + r.attacks.length, 0);

    console.log(`================================================================================`);
    console.log(` ⚔️  測試案例: ${summary.caseName}`);
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`• 命中設定: "${d.attackStr}" VS Target AC: ${d.targetAC}`);
    console.log(`• 爆擊設定: 門檻 Natural ${d.critThreshold}+ | 傷害骰增幅倍率: ${d.critMultiplier}x`);
    console.log(`• 單發機率: 🎯 普通命中 ${(d.pHit * 100).toFixed(1)}% | 🔥 爆擊 ${(d.pCrit * 100).toFixed(1)}% | ❌ 未命中 ${(d.pMiss * 100).toFixed(1)}%`);
    console.log(`• 戰術序列: "${d.rawDamageStr}"`);
    console.log(`• 結構展開: 總作戰輪數 ${totalRounds} 輪 (全戰鬥共進行 ${totalAttackAttempts} 次獨立 D20 判定)`);
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`   👉 傷害統計分佈 [ Q1: ${summary.q1} 點 | 中位數 Q2: ${summary.q2} 點 | Q3: ${summary.q3} 點 | 理論最大上限: ${d.totalMaxPossibleDmg} 點 ]`);
    console.log(`   👉 統計承諾：本輪戰鬥有 50% 的絕對機率，最終累積總傷害會落在 [ ${summary.q1} ～ ${summary.q3} ] 點之間。`);
    console.log(`================================================================================\n`);
}

/**
 * 微觀除錯工具：使用原生表格印出實質總傷害機率分佈 (完美對齊，不雜亂)
 * 
 * @param {Object} summary - 由 calculate() 傳回的統計數據總物件
 */
function printDamageDistribution(summary) {
    if (!summary.distribution) {
        console.error("無法印出分佈：請確保您的 calculate() 函數返回物件中包含 'distribution: finalTotalDist'。");
        return;
    }

    const dist = summary.distribution;
    const tableData = [];

    // 顯示精度防線：低於 5e-9 的實質機率值在 .toFixed(6) 下會變成 0.000000%
    const DISPLAY_THRESHOLD = 5e-9;

    let isInTailMode = false;
    let tailStartDamage = null;
    let tailEndDamage = null;
    let tailProbabilitySum = 0;

    console.log(`\n📊 傷害機率質量分佈 (PMF) 表格 ── 測試案例: ${summary.caseName}`);

    for (let d = 0; d < dist.length; d++) {
        const prob = dist[d];
        
        // 跳過完全沒有機率的絕對零點 (全域防禦常數)
        if (prob <= BUCKET_EPSILON) continue;

        if (prob < DISPLAY_THRESHOLD) {
            if (!isInTailMode) {
                isInTailMode = true;
                tailStartDamage = d;
            }
            tailEndDamage = d;
            tailProbabilitySum += prob;
        } else {
            // 如果從長尾模式切回常規模式，先結算並推入先前的長尾區間
            if (isInTailMode && tailProbabilitySum > 0) {
                tableData.push({
                    "傷害 / 區間": `${tailStartDamage} ~ ${tailEndDamage} 點傷害`,
                    "機率百分比": `${(tailProbabilitySum * 100).toFixed(6)}%`,
                    "備註": "長尾聚合"
                });
                isInTailMode = false;
                tailProbabilitySum = 0;
            }

            // 常規顯性機率點推入表格資料結構
            tableData.push({
                "傷害 / 區間": `${d} 點傷害`,
                "機率百分比": `${(prob * 100).toFixed(6)}%`,
                "備註": "" // 常規行保持留空
            });
        }
    }

    // 遍歷收尾：結算最後殘留的極端暴擊長尾
    if (isInTailMode && tailProbabilitySum > 0) {
        tableData.push({
            "傷害 / 區間": `${tailStartDamage} ~ ${tailEndDamage} 點傷害`,
            "機率百分比": `${(tailProbabilitySum * 100).toFixed(6)}%`,
            "備註": "極端暴擊尾"
        });
    }

    // 呼叫原生瀏覽器/Node.js 高階表格列印工具，自動排版欄位
    console.table(tableData);
}





/**
 * 終極跨輪輸出 (DPR) 統計 Pipeline 主函數 (正式附加分佈數據傳回)
 * 
 * @param {string} caseName - 測試案例名稱
 * @param {string} attackStr - 命中公式字串 (例如 "D20A1 + 6")
 * @param {number} targetAC - 目標敵人 AC (例如 18)
 * @param {Object} criticalOptions - 爆擊設定物件 { multiplier: 2, threshold: 20 }
 * @param {string} rawDamageStr - 進階跨輪括號傷害公式序列 (例如 "(1D6+7+1D6, 2D6PR)")
 * @returns {Object} 包含精準四分位數、完整機率分佈、與解析理論極限值的總數據物件
 */
function calculate(caseName, attackStr, targetAC, criticalOptions, rawDamageStr) {
    const critMultiplier = criticalOptions.multiplier !== undefined ? Math.floor(criticalOptions.multiplier) : 2;
    const critThreshold = criticalOptions.threshold !== undefined ? Math.floor(criticalOptions.threshold) : 20;

    // 1. 取得單發打擊的中立三態命中機率
    const { pHit, pCrit, pMiss } = evaluateAttackProbabilities(attackStr, targetAC, critThreshold);
    
    // 2. 解析出完整的跨輪次序列結構藍圖
    const roundSequencePool = parseAdvancedDamageString(rawDamageStr);
    const finalRoundCombinedPDFs = [];

    // ================================================================================
    // 【純代數解析法】：精準計算全戰鬥絕對理論傷害上限
    // ================================================================================
    let analyticalMaxTotalDmg = 0;

    for (const roundData of roundSequencePool) {
        let roundWeaponAndFlatMax = 0;
        for (const attack of roundData.attacks) {
            let weaponMaxCrit = 0;
            for (const dice of attack.weaponDice) {
                weaponMaxCrit += dice.sides * dice.count * critMultiplier;
            }
            roundWeaponAndFlatMax += weaponMaxCrit + attack.flatMod;
        }

        let prMaxCrit = 0;
        if (roundData.prDices && roundData.prDices.length > 0) {
            for (const dice of roundData.prDices) {
                prMaxCrit += dice.sides * dice.count * critMultiplier;
            }
        }

        const roundMaxPossible = roundWeaponAndFlatMax + prMaxCrit;
        analyticalMaxTotalDmg += Math.max(roundMaxPossible, 0);
    }

    // ================================================================================
    // 3. 進入巨觀跨輪迴圈，逐一解算每個獨立輪次的分佈耦合
    // ================================================================================
    for (const roundData of roundSequencePool) {
        let pPR_Available = 1.0;
        const singleRoundAttackPDFs = [];

        let prNormalDist = new Float64Array([1.0]), prCritDist = new Float64Array([1.0]);
        if (roundData.prDices && roundData.prDices.length > 0) {
            const prNormalPool = [], prCritPool = [];
            for (const dice of roundData.prDices) {
                const baseDist = PREGENERATED_DICE_NORMAL[`D${dice.sides}`];
                if (!baseDist) throw new Error(`不支援的 PR 骰子面數: D${dice.sides}`);
                for (let i = 0; i < dice.count; i++) prNormalPool.push({ dist: baseDist, isNegative: false });
                for (let i = 0; i < dice.count * critMultiplier; i++) prCritPool.push({ dist: baseDist, isNegative: false });
            }
            prNormalDist = convolveMultipleFFT(prNormalPool).dist;
            prCritDist = convolveMultipleFFT(prCritPool).dist;
        }

        for (const attack of roundData.attacks) {
            const weaponNormalPool = [], weaponCritPool = [];
            for (const dice of attack.weaponDice) {
                const baseDist = PREGENERATED_DICE_NORMAL[`D${dice.sides}`];
                if (!baseDist) throw new Error(`不支援的武器骰子面數: D${dice.sides}`);
                for (let i = 0; i < dice.count; i++) weaponNormalPool.push({ dist: baseDist, isNegative: false });
                for (let i = 0; i < dice.count * critMultiplier; i++) weaponCritPool.push({ dist: baseDist, isNegative: false });
            }
            const weaponNormalDist = convolveMultipleFFT(weaponNormalPool).dist;
            const weaponCritDist = convolveMultipleFFT(weaponCritPool).dist;

            const maxHitWithPr = (weaponNormalDist.length - 1) + (prNormalDist.length - 1) + attack.flatMod;
            const maxCritWithPr = (weaponCritDist.length - 1) + (prCritDist.length - 1) + attack.flatMod;
            const maxSingleAttackDmg = Math.max(maxHitWithPr, maxCritWithPr, attack.flatMod, 0);
            
            const singleAttackPDF = new Float64Array(maxSingleAttackDmg + 1);
            singleAttackPDF[0] = pMiss;

            const w1_weight = pHit * pPR_Available;
            if (w1_weight > BUCKET_EPSILON) {
                for (let w = 0; w < weaponNormalDist.length; w++) {
                    for (let p = 0; p < prNormalDist.length; p++) {
                        const dmg = w + p + attack.flatMod;
                        singleAttackPDF[dmg > 0 ? dmg : 0] += weaponNormalDist[w] * prNormalDist[p] * w1_weight;
                    }
                }
            }

            const w2_weight = pCrit * pPR_Available;
            if (w2_weight > BUCKET_EPSILON) {
                for (let w = 0; w < weaponCritDist.length; w++) {
                    for (let p = 0; p < prCritDist.length; p++) {
                        const dmg = w + p + attack.flatMod;
                        singleAttackPDF[dmg > 0 ? dmg : 0] += weaponCritDist[w] * prCritDist[p] * w2_weight;
                    }
                }
            }

            const pPR_Consumed = 1.0 - pPR_Available;
            if (pPR_Consumed > BUCKET_EPSILON) {
                const w3_normal_weight = pHit * pPR_Consumed;
                if (w3_normal_weight > BUCKET_EPSILON) {
                    for (let w = 0; w < weaponNormalDist.length; w++) {
                        const dmg = w + attack.flatMod;
                        singleAttackPDF[dmg > 0 ? dmg : 0] += weaponNormalDist[w] * w3_normal_weight;
                    }
                }
                const w3_crit_weight = pCrit * pPR_Consumed;
                if (w3_crit_weight > BUCKET_EPSILON) {
                    for (let w = 0; w < weaponCritDist.length; w++) {
                        const dmg = w + attack.flatMod;
                        singleAttackPDF[dmg > 0 ? dmg : 0] += weaponCritDist[w] * w3_crit_weight;
                    }
                }
            }

            pPR_Available *= pMiss;
            singleRoundAttackPDFs.push({ dist: singleAttackPDF, isNegative: false });
        }

        const { dist: roundCombinedDmgDist } = convolveMultipleFFT(singleRoundAttackPDFs);
        finalRoundCombinedPDFs.push({ dist: roundCombinedDmgDist, isNegative: false });
    }

    // 4. 將所有獨立輪次的分佈進行最終大總結摺積，得出全戰鬥跨輪輸出分佈
    const { dist: finalTotalDist } = convolveMultipleFFT(finalRoundCombinedPDFs);
    
    // 5. 掃描 CDF 提取精準的統計四分位數
    let cumulativeProbability = 0;
    let q1 = null, q2 = null, q3 = null;
    for (let d = 0; d < finalTotalDist.length; d++) {
        cumulativeProbability += finalTotalDist[d];
        if (q1 === null && cumulativeProbability >= 0.25) q1 = d;
        if (q2 === null && cumulativeProbability >= 0.50) q2 = d;
        if (q3 === null && cumulativeProbability >= 0.75) { q3 = d; break; }
    }
    
    return { 
        caseName, q1, q2, q3, 
        distribution: finalTotalDist, // 👈 正式附加完整的 Float64Array 分佈數據傳回
        details: { 
            attackStr, targetAC, critThreshold, critMultiplier, rawDamageStr, pHit, pCrit, pMiss,
            totalMaxPossibleDmg: analyticalMaxTotalDmg 
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
