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
const SUPPORTED_DICE_SIDES = new Set(Object.keys(PREGENERATED_DICE_NORMAL).map(key => Number(key.slice(1))));

function tokenizeFormula(formulaStr, formulaName, allowPr = false, allowD20Mode = false) {
    if (typeof formulaStr !== "string") {
        throw new TypeError(`${formulaName} 必須是字串。`);
    }

    const cleanStr = formulaStr.trim().toUpperCase().replace(/\s*([+-])\s*/g, '$1');
    if (!cleanStr) throw new Error(`${formulaName} 不可為空。`);

    const dicePattern = allowPr ? '\\d*D\\d+(?:PR)?' : '\\d*D\\d+';
    const termPattern = allowD20Mode
        ? `[+-]?(?:D20[AD]?\\d*|${dicePattern}|\\d+)`
        : `[+-]?(?:${dicePattern}|\\d+)`;
    const terms = cleanStr.match(new RegExp(termPattern, 'g')) || [];
    if (terms.join('') !== cleanStr) {
        throw new Error(`${formulaName} 含有無效或不支援的語法: ${formulaStr}`);
    }

    return terms;
}

function parseDiceTerm(token, formulaName, allowPr = false) {
    const diceMatch = token.match(allowPr
        ? /^([+-]?)(\d*)D(\d+)(PR)?$/
        : /^([+-]?)(\d*)D(\d+)$/
    );
    if (!diceMatch) return null;

    const sides = Number(diceMatch[3]);
    if (!SUPPORTED_DICE_SIDES.has(sides)) {
        throw new Error(`${formulaName} 不支援 D${sides}；支援骰種為 D4、D6、D8、D10、D12。`);
    }

    const count = diceMatch[2] === "" ? 1 : Number(diceMatch[2]);
    if (!Number.isSafeInteger(count)) {
        throw new Error(`${formulaName} 的骰數必須是安全範圍內的整數。`);
    }

    return {
        sides,
        count: (diceMatch[1] === "-" ? -1 : 1) * count,
        isPr: Boolean(diceMatch[4])
    };
}

function splitTopLevel(input, delimiter, contextName) {
    const parts = [];
    let depth = 0;
    let start = 0;

    for (let i = 0; i < input.length; i++) {
        if (input[i] === '(') {
            depth++;
        } else if (input[i] === ')') {
            depth--;
            if (depth < 0) throw new Error(`${contextName} 括號不匹配。`);
        } else if (input[i] === delimiter && depth === 0) {
            const part = input.slice(start, i).trim();
            if (!part) throw new Error(`${contextName} 不可包含空白項目。`);
            parts.push(part);
            start = i + 1;
        }
    }

    if (depth !== 0) throw new Error(`${contextName} 括號不匹配。`);
    const finalPart = input.slice(start).trim();
    if (!finalPart) throw new Error(`${contextName} 不可包含空白項目。`);
    parts.push(finalPart);
    return parts;
}

function parsePositiveRepeatCount(value, contextName) {
    const count = Number(value);
    if (!Number.isSafeInteger(count) || count < 1) {
        throw new Error(`${contextName} 重複次數必須是正整數。`);
    }
    return count;
}

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

    // pass through if pool only contains one item -> means no fft is required.
    if (pool.length === 1 && !pool[0].isNegative) {
        return { 
            dist: new Float64Array(pool[0].dist), // 直接複製，不給計算機任何製造 1e-15 底噪的機會
            offset: 0 
        };
    }

    let globalMinOffset = 0;
    const standardizedPool = [];
    const expectedMass = pool.reduce(
        (mass, item) => mass * item.dist.reduce((sum, probability) => sum + probability, 0),
        1
    );

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

	// Restore numerical drift without changing the input probability mass.
	if (currentSum > 0 && Math.abs(currentSum - expectedMass) > MACHINE_EPSILON) {
		for (let i = 0; i <= maxPossibleSpan; i++) {
			finalDist[i] *= expectedMass / currentSum;
		}
	}

    return { dist: finalDist, offset: globalMinOffset };
}

// Helper Subroutine
/**
 * 評估單發打擊的命中、爆擊與未命中機率 (三態分離 - 修正大失敗/爆擊摺積污染漏洞)
 * 
 * @param {string} attackStr - 命中公式字串 (例如 "D20A1 + 5 + D4")
 * @param {number} targetAC - 目標敌人的 Armor Class
 * @param {number} critThreshold - 爆擊原生門檻 (Natural Roll, 預設 20)
 * @returns {Object} 包含 pHit, pCrit, pMiss 的三態互斥機率物件
 */
function evaluateAttackProbabilities(attackStr, targetAC, critThreshold = 20) {
    const { advantageMode, bonusDice, flatMod } = parseAttackString(attackStr);
    const safeCrit = Math.max(2, Math.min(20, Math.floor(critThreshold)));

    const modeMapper = { "-1": "DIS", "0": "NORMAL", "1": "ADV", "2": "EA" };
    const rawD20Dist = PREGENERATED_D20_ATTACK[modeMapper[advantageMode] || "NORMAL"];
    
    // ================================================================================
    // 【核心修正】：原生點數防禦隔離門檻 (Natural Roll Segregation)
    // ================================================================================
    // 1. 完全由核心 D20 獨立抽取大失敗與大成功的絕對機率
    const pNatural1 = rawD20Dist[1]; 
    let pCrit = 0;
    for (let s = safeCrit; s <= 20; s++) {
        pCrit += rawD20Dist[s];
    }

    // 2. 建立一個「純淨常規命中」的 D20 分佈，將大失敗與爆擊位點清零
    // 這能確保進入摺積的機率質量，完美對齊常規判定的物理空間
    const pureNormalD20Dist = new Float64Array(21);
    for (let s = 2; s < safeCrit; s++) {
        pureNormalD20Dist[s] = rawD20Dist[s];
    }
    
    // 3. 將純淨 D20 分佈送入摺積管線
    const distPoolForFFT = [
        { dist: pureNormalD20Dist, isNegative: false }
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

    // 執行傅立葉高效摺積 (此時 attackDist 僅包含「純常規命中 D20」與輔助骰的複合可能)
    const { dist: attackDist, offset: attackOffset } = convolveMultipleFFT(distPoolForFFT);

    // 4. 在實質絕對座標補償下，精確累加通過 AC 檢定的純命中機率
    let pHit = 0;
    for (let i = 0; i < attackDist.length; i++) {
        if (attackDist[i] <= BUCKET_EPSILON) continue;
        
        // 實質物理座標 = 陣列索引 + 摺積動態原點補償
        const realRollTotal = i + attackOffset;
        
        // 常規點數判定：必須加上 flatMod 滿足目標 AC
        if (realRollTotal + flatMod >= targetAC) {
            pHit += attackDist[i];
        }
    }

    // 5. 根據機率質量守恆定理，未命中率即為總機率 1.0 扣除其餘三態
    // 大失敗 (pNatural1) 已被物理隔離，自然會安全地落入未命中 (pMiss) 中
    const pMiss = Math.max(0, 1.0 - pHit - pCrit);
    
    return { pHit, pCrit, pMiss };
}

function parseAttackString(attackStr) {
    const tokens = tokenizeFormula(attackStr, "命中公式", false, true);
    
    let advantageMode = 0;
    const bonusDice = [];
    let flatMod = 0;

    for (const token of tokens) {
        const d20Match = token.match(/^([+-]?)D20([AD])?(\d*)$/);
        if (d20Match) {
            const sign = d20Match[1] === '-' ? -1 : 1;
            const type = d20Match[2];
            
            // 【核心修正】：精確解析 count，防止 0 被短路運算子 || 1 覆蓋
            const hasCountStr = d20Match[3] !== "";
            const count = hasCountStr ? parseInt(d20Match[3], 10) : 1;

            if (sign === -1) {
                throw new Error("核心 D20 命中骰前方不允許帶有負號！");
            }

            // 嚴格狀態機判定：D20A0 或 D20D0 會精確落入 else 分支，降級為常規模式 (0)
            if (type === 'A' && count === 1) advantageMode = 1;       // D20A1 (優勢)
            else if (type === 'A' && count === 2) advantageMode = 2;  // D20A2 (精靈準確)
            else if (type === 'D' && count === 1) advantageMode = -1; // D20D1 (劣勢)
            else advantageMode = 0;                                   // 常規 D20 / D20A0 / D20D0
            
            continue; 
        }

        const dice = parseDiceTerm(token, "命中公式");
        if (dice) {
            bonusDice.push({ sides: dice.sides, count: dice.count });
            continue;
        }

        flatMod += Number(token);
    }

    return { advantageMode, bonusDice, flatMod };
}

/**
 * 升級版基礎單擊公式解析器（完美支援正向武器骰與負向減傷骰之雙向語義分流）
 * 
 * @param {string} formulaStr - 傷害公式 (例如 "1D8 - 1D4 + 3")
 * @returns {Object} 包含 weaponDice(正向), negativeDice(負向) 與 flatMod 的物件
 */
function parseSingleFormula(formulaStr) {
    const tokens = tokenizeFormula(formulaStr, "傷害公式");
    
    const weaponDiceMap = new Map();
    let flatMod = 0;

    for (const token of tokens) {
        const dice = parseDiceTerm(token, "傷害公式");
        if (dice) {
            const counts = weaponDiceMap.get(dice.sides) || { positive: 0, negative: 0 };
            if (dice.count >= 0) counts.positive += dice.count;
            else counts.negative += Math.abs(dice.count);
            weaponDiceMap.set(dice.sides, counts);
            continue;
        }

        flatMod += Number(token);
    }

    const weaponDice = [];
    const negativeDice = [];

    for (const [sides, counts] of weaponDiceMap.entries()) {
        if (counts.positive > 0) weaponDice.push({ sides, count: counts.positive });
        if (counts.negative > 0) negativeDice.push({ sides, count: counts.negative });
    }

    return { weaponDice, negativeDice, flatMod: Math.floor(flatMod) };
}

/**
 * 專職解析單獨 PR 字串的微型輔助函式
 */
function parsePrFormula(prStr) {
    const tokens = tokenizeFormula(prStr, "PR 傷害公式", true);
    const prDiceMap = new Map();

    for (const token of tokens) {
        const dice = parseDiceTerm(token, "PR 傷害公式", true);
        if (!dice || !dice.isPr) throw new Error(`PR 傷害公式只接受帶 PR 後綴的骰子: ${token}`);
        prDiceMap.set(dice.sides, (prDiceMap.get(dice.sides) || 0) + dice.count);
    }

    return Array.from(prDiceMap.entries())
        .filter(([_, c]) => c > 0)
        .map(([sides, count]) => ({ sides: Math.floor(sides), count: Math.floor(count) }));
}

/**
 * 終極嵌套版：進階跨輪輸出 (DPR) 序列解析器 (升級：全面開通正向武器骰與負向減傷骰雙向分流)
 * 完美支援外層定義輪次重複、內層單擊重複與負向減傷骰之雙向語義分流
 * 
 * @param {string} damageStr - 完整一輪次語法 (含括號與嵌套複製)
 * @returns {Array<Object>} 展開後的跨輪次序列結構藍圖陣列
 */
function parseAdvancedDamageString(damageStr) {
    if (typeof damageStr !== "string" || !damageStr.trim()) {
        throw new TypeError("傷害序列必須是非空字串。");
    }
    const cleanStr = damageStr.trim();
    const roundSequencePool = [];

    if (!cleanStr.includes('(') && !cleanStr.includes(')')) {
        // 降級相容常規無括號語法
        let repeatCount = 1;
        let singleFormula = cleanStr;
        const repeatMatch = cleanStr.match(/^(\d+)\s+(.+)$/);
        if (repeatMatch) {
            repeatCount = parsePositiveRepeatCount(repeatMatch[1], "輪次");
            singleFormula = repeatMatch[2];
        }
        const isPr = singleFormula.toUpperCase().includes("PR");
        const parsedAttack = isPr ? null : parseSingleFormula(singleFormula);
        const prDices = isPr ? parsePrFormula(singleFormula) : [];
        const roundStructure = {
            attacks: parsedAttack ? [{
                weaponDice: parsedAttack.weaponDice,
                negativeDice: parsedAttack.negativeDice,
                flatMod: parsedAttack.flatMod,
                prDiceMap: null
            }] : [],
            prDices
        };
        for (let i = 0; i < repeatCount; i++) {
            roundSequencePool.push(JSON.parse(JSON.stringify(roundStructure)));
        }
        return roundSequencePool;
    }

    const groupStrings = splitTopLevel(cleanStr, ',', "傷害序列");
    for (const groupStr of groupStrings) {
        const groupMatch = groupStr.match(/^(?:(\d+)\s*)?\(([^()]*)\)$/);
        if (!groupMatch) throw new Error(`傷害序列格式無效: ${groupStr}`);

        let repeatCount = 1;
        if (groupMatch[1]) repeatCount = parsePositiveRepeatCount(groupMatch[1], "輪次");
        const subFormulasStr = groupMatch[2];
        if (!subFormulasStr.trim()) throw new Error("每輪必須至少包含一項傷害公式。");

        // 3. 內層逗號拆分後，進行打擊與 PR 資源分流
        const subTokens = splitTopLevel(subFormulasStr, ',', "每輪傷害公式");
        
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
                // 檢查是否帶有內層打擊重複前綴 (例如 "2 1D8-1D4+17")
                const innerRepeatMatch = token.match(/^(\d+)\s+(.+)$/);
                if (innerRepeatMatch) {
                    const innerCount = parsePositiveRepeatCount(innerRepeatMatch[1], "打擊");
                    const actualFormula = innerRepeatMatch[2];
                    
                    // 呼叫升級後的基礎解析器，分離出正負向骰子
                    const parsedAttack = parseSingleFormula(actualFormula);
                    const structuredAttack = {
                        weaponDice: parsedAttack.weaponDice,
                        negativeDice: parsedAttack.negativeDice, // 🚀 注入負向減傷骰
                        flatMod: parsedAttack.flatMod,
                        prDiceMap: null
                    };
                    
                    // 根據內層係數，將同一個打擊公式獨立複製 N 次放入打擊時序中
                    for (let c = 0; c < innerCount; c++) {
                        attacks.push(JSON.parse(JSON.stringify(structuredAttack))); // 深拷貝防止引用污染
                    }
                } else {
                    // 常規單發打擊，同樣執行雙向分流結構化封裝
                    const parsedAttack = parseSingleFormula(token);
                    attacks.push({
                        weaponDice: parsedAttack.weaponDice,
                        negativeDice: parsedAttack.negativeDice, // 🚀 注入負向減傷骰
                        flatMod: parsedAttack.flatMod,
                        prDiceMap: null
                    });
                }
            }
        }

        const prDices = Array.from(globalPrMap.entries())
            .map(([sides, count]) => ({ sides, count }));

        const roundStructure = { attacks, prDices };

        for (let i = 0; i < repeatCount; i++) {
            roundSequencePool.push(JSON.parse(JSON.stringify(roundStructure)));
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
 * 微觀除錯工具：使用網格表格列印分佈，並附帶可直接複製的合法 JSON 陣列藍圖
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
    const copyableArray = []; // 專門收集供測試腳本一鍵複製比對的乾淨 JSON 結構

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
                const label = `${tailStartDamage}~${tailEndDamage}`;
                const pct = (tailProbabilitySum * 100).toFixed(6);
                
                tableData.push({ "傷害 / 區間": `${label} 點傷害`, "機率百分比": `${pct}%`, "備註": "長尾聚合" });
                copyableArray.push({ damage: label, percentage: `${pct}%`, note: "長尾聚合" });
                
                isInTailMode = false;
                tailProbabilitySum = 0;
            }

            // 常規顯性機率點推入資料結構
            const pct = (prob * 100).toFixed(6);
            tableData.push({ "傷害 / 區間": `${d} 點傷害`, "機率百分比": `${pct}%`, "備註": "" });
            copyableArray.push({ damage: d, percentage: `${pct}%` });
        }
    }

    // 遍歷收尾：結算最後殘留的極端暴擊長尾
    if (isInTailMode && tailProbabilitySum > 0) {
        const label = `${tailStartDamage}~${tailEndDamage}`;
        const pct = (tailProbabilitySum * 100).toFixed(6);
        
        tableData.push({ "傷害 / 區間": `${label} 點傷害`, "機率百分比": `${pct}%`, "備註": "極端暴擊尾" });
        copyableArray.push({ damage: label, percentage: `${pct}%`, note: "極端暴擊尾" });
    }

    // 軌道一：印出由瀏覽器/Node.js 自動分配最優欄寬的完美表格邊框
    console.table(tableData);

    // 軌道二：印出供程式碼一鍵複製、做自動化斷言檢查的合法單行 JSON 陣列
    console.log(`📋 可複製的 JS 驗證數據陣列 (可用於 Automated Assert 比對)：`);
    console.log(JSON.stringify(copyableArray));
}


function scaleDistribution(dist, weight) {
    const scaledDist = new Float64Array(dist.length);
    for (let i = 0; i < dist.length; i++) scaledDist[i] = dist[i] * weight;
    return scaledDist;
}

function convolveDamageDistributions(left, right) {
    if (left.every(value => value === 0) || right.every(value => value === 0)) {
        return new Float64Array([0]);
    }

    const result = convolveMultipleFFT([
        { dist: left, isNegative: false },
        { dist: right, isNegative: false }
    ]);
    const aligned = new Float64Array(result.offset + result.dist.length);
    for (let i = 0; i < result.dist.length; i++) {
        aligned[i + result.offset] = result.dist[i];
    }
    return aligned;
}

function sumDistributions(distributions) {
    const length = distributions.reduce((maxLength, dist) => Math.max(maxLength, dist.length), 1);
    const total = new Float64Array(length);
    for (const dist of distributions) {
        for (let i = 0; i < dist.length; i++) total[i] += dist[i];
    }
    return total;
}

function createAttackHitDistribution(
    weaponNormalDist,
    weaponNormalOffset,
    weaponCritDist,
    weaponCritOffset,
    prNormalDist,
    prNormalOffset,
    prCritDist,
    prCritOffset,
    flatMod,
    pHit,
    pCrit,
    includePr
) {
    const normalPrDist = includePr ? prNormalDist : new Float64Array([1]);
    const normalPrOffset = includePr ? prNormalOffset : 0;
    const critPrDist = includePr ? prCritDist : new Float64Array([1]);
    const critPrOffset = includePr ? prCritOffset : 0;
    const maxNormalDamage = weaponNormalDist.length - 1 + weaponNormalOffset
        + normalPrDist.length - 1 + normalPrOffset + flatMod;
    const maxCritDamage = weaponCritDist.length - 1 + weaponCritOffset
        + critPrDist.length - 1 + critPrOffset + flatMod;
    const hitDist = new Float64Array(Math.max(maxNormalDamage, maxCritDamage, 0) + 1);

    for (let weapon = 0; weapon < weaponNormalDist.length; weapon++) {
        for (let pr = 0; pr < normalPrDist.length; pr++) {
            const damage = Math.max(0, weapon + weaponNormalOffset + pr + normalPrOffset + flatMod);
            hitDist[damage] += weaponNormalDist[weapon] * normalPrDist[pr] * pHit;
        }
    }
    for (let weapon = 0; weapon < weaponCritDist.length; weapon++) {
        for (let pr = 0; pr < critPrDist.length; pr++) {
            const damage = Math.max(0, weapon + weaponCritOffset + pr + critPrOffset + flatMod);
            hitDist[damage] += weaponCritDist[weapon] * critPrDist[pr] * pCrit;
        }
    }
    return hitDist;
}



function calculate(caseName, attackStr, targetAC, criticalOptions, rawDamageStr) {
    const critMultiplier = criticalOptions.multiplier !== undefined ? Math.floor(criticalOptions.multiplier) : 2;
    const critThreshold = criticalOptions.threshold !== undefined ? Math.floor(criticalOptions.threshold) : 20;

    // 1. 取得單發打擊的中立三態命中機率
    const { pHit, pCrit, pMiss } = evaluateAttackProbabilities(attackStr, targetAC, critThreshold);
    
    // 2. 解析出完整的跨輪次序列結構藍圖
    const roundSequencePool = parseAdvancedDamageString(rawDamageStr);
    const finalRoundCombinedPDFs = [];

    // ================================================================================
    // 【純代數解析法】：精準計算全戰鬥絕對理論傷害上限 (修正負向減傷爆擊不對稱)
    // ================================================================================
    let analyticalMaxTotalDmg = 0;

    for (const roundData of roundSequencePool) {
        let roundWeaponAndFlatMax = 0;
        for (const attack of roundData.attacks) {
            // 正向武器骰：爆擊時面數翻倍
            let weaponMaxCrit = 0;
            for (const dice of attack.weaponDice) {
                weaponMaxCrit += dice.sides * dice.count * critMultiplier;
            }
            
            // 負向減傷骰：爆擊時不翻倍。且為了求「最大可能傷害」，減傷骰應貢獻其最小減傷量 (即 count * 1)
            let reductionMinContribution = 0;
            if (attack.negativeDice && attack.negativeDice.length > 0) {
                for (const dice of attack.negativeDice) {
                    reductionMinContribution -= dice.count * 1; // 減傷越少，最終傷害越高
                }
            }
            
            roundWeaponAndFlatMax += weaponMaxCrit + reductionMinContribution + attack.flatMod;
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
        // 全輪唯一的 PR 資源骰池預摺積
        let prNormalDist = new Float64Array([1.0]), prCritDist = new Float64Array([1.0]);
        let prNormalOffset = 0, prCritOffset = 0; 
        
        if (roundData.prDices && roundData.prDices.length > 0) {
            const prNormalPool = [], prCritPool = [];
            for (const dice of roundData.prDices) {
                const baseDist = PREGENERATED_DICE_NORMAL[`D${dice.sides}`];
                for (let i = 0; i < dice.count; i++) prNormalPool.push({ dist: baseDist, isNegative: false });
                for (let i = 0; i < dice.count * critMultiplier; i++) prCritPool.push({ dist: baseDist, isNegative: false });
            }
            const prNormalRes = convolveMultipleFFT(prNormalPool);
            const prCritRes = convolveMultipleFFT(prCritPool);
            prNormalDist = prNormalRes.dist;
            prNormalOffset = prNormalRes.offset;
            prCritDist = prCritRes.dist;
            prCritOffset = prCritRes.offset;
        }

        let prAvailableDist = new Float64Array([1.0]);
        let prConsumedDist = new Float64Array([0]);

        for (const attack of roundData.attacks) {
            const weaponNormalPool = [], weaponCritPool = [];

            for (const dice of attack.weaponDice) {
                const baseDist = PREGENERATED_DICE_NORMAL[`D${dice.sides}`];
                for (let i = 0; i < dice.count; i++) weaponNormalPool.push({ dist: baseDist, isNegative: false });
                for (let i = 0; i < dice.count * critMultiplier; i++) weaponCritPool.push({ dist: baseDist, isNegative: false });
            }

            // 2. 【核心修正】：注入負向減傷骰 ── 爆擊時維持 1 倍數量，絕不翻倍！
            if (attack.negativeDice && attack.negativeDice.length > 0) {
                for (const dice of attack.negativeDice) {
                    const baseDist = PREGENERATED_DICE_NORMAL[`D${dice.sides}`];
                    for (let i = 0; i < dice.count; i++) {
                        weaponNormalPool.push({ dist: baseDist, isNegative: true });
                        weaponCritPool.push({ dist: baseDist, isNegative: true });
                    }
                }
            }

            const weaponNormalRes = convolveMultipleFFT(weaponNormalPool);
            const weaponCritRes = convolveMultipleFFT(weaponCritPool);
            const hitWithPr = createAttackHitDistribution(
                weaponNormalRes.dist,
                weaponNormalRes.offset,
                weaponCritRes.dist,
                weaponCritRes.offset,
                prNormalDist,
                prNormalOffset,
                prCritDist,
                prCritOffset,
                attack.flatMod,
                pHit,
                pCrit,
                true
            );
            const hitWithoutPr = createAttackHitDistribution(
                weaponNormalRes.dist,
                weaponNormalRes.offset,
                weaponCritRes.dist,
                weaponCritRes.offset,
                prNormalDist,
                prNormalOffset,
                prCritDist,
                prCritOffset,
                attack.flatMod,
                pHit,
                pCrit,
                false
            );

            const nextAvailable = scaleDistribution(prAvailableDist, pMiss);
            const availableHits = convolveDamageDistributions(prAvailableDist, hitWithPr);
            const consumedMisses = scaleDistribution(prConsumedDist, pMiss);
            const consumedHits = convolveDamageDistributions(prConsumedDist, hitWithoutPr);
            prConsumedDist = sumDistributions([availableHits, consumedMisses, consumedHits]);
            prAvailableDist = nextAvailable;
        }

        const roundDistribution = sumDistributions([prAvailableDist, prConsumedDist]);
        finalRoundCombinedPDFs.push({ dist: roundDistribution, isNegative: false });
    }

    // 4. 跨輪總結摺積：接收最終全域原點平移量 finalTotalOffset
    const { dist: finalTotalDist, offset: finalTotalOffset } = convolveMultipleFFT(finalRoundCombinedPDFs);
    
    // 同步還原具有絕對座標對齊的完整分佈陣列
    const absoluteDomainDist = new Float64Array(finalTotalDist.length + finalTotalOffset);
    for (let d = 0; d < finalTotalDist.length; d++) {
        absoluteDomainDist[d + finalTotalOffset] = finalTotalDist[d];
    }

    // 5. 掃描實質絕對 PMF 的 CDF 提取精準的統計四分位數
    let cumulativeProbability = 0;
    let q1 = null, q2 = null, q3 = null;
    
    for (let d = 0; d < absoluteDomainDist.length; d++) {
        cumulativeProbability += absoluteDomainDist[d];
        if (q1 === null && cumulativeProbability >= 0.25) q1 = d;
        if (q2 === null && cumulativeProbability >= 0.50) q2 = d;
        if (q3 === null && cumulativeProbability >= 0.75) { q3 = d; break; }
    }

    if (q1 === null) q1 = 0;
    if (q2 === null) q2 = 0;
    if (q3 === null) q3 = 0;

    return { 
        caseName, q1, q2, q3, 
        distribution: absoluteDomainDist, 
        details: { 
            attackStr, targetAC, critThreshold, critMultiplier, rawDamageStr, pHit, pCrit, pMiss,
            totalMaxPossibleDmg: analyticalMaxTotalDmg 
        } 
    };
}
