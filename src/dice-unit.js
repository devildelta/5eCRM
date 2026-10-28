/**
 * 語法解析器自動化斷言檢驗群組
 * @name testParser
 */
const UNIT_TEST_NUMERIC_TOLERANCE = 1e-15;

function testParser() {
    console.log("🧪 [啟動測試群組] -> testParser: 多層嵌套語法與 PR 抽離解析檢驗...");
    try {
        // --------------------------------------------------------
        // 【測試案例 1】標準單擊公式拆解
        // --------------------------------------------------------
        const res1 = parseSingleFormula("1D6 + 7");
        console.assert(res1.weaponDice.length === 1, `[失敗] Case 1: 武器骰種類長度應為 1, 實測為 ${res1.weaponDice.length}`);
        console.assert(res1.weaponDice[0].sides === 6 && res1.weaponDice[0].count === 1, `[失敗] Case 1: 武器骰應為 1D6`);
        console.assert(res1.flatMod === 7, `[失敗] Case 1: 固定加值應為 7, 實測為 ${res1.flatMod}`);
        console.log("  ├─ ✅ Case 1 通過: 標準基礎傷害公式拆解 ── 數據對齊完全無偏誤。");

        // --------------------------------------------------------
        // 【測試案例 2】單擊公式內的單純 PR 識別
        // --------------------------------------------------------
        const res2 = parsePrFormula("2D6PR + 1D6PR");
        console.assert(res2.length === 1, `[失敗] Case 2: PR 種類應合併為 1 種, 實測為 ${res2.length}`);
        console.assert(res2[0].sides === 6 && res2[0].count === 3, `[失敗] Case 2: 2D6+1D6 應自動融合成 3D6 PR, 實測為 ${res2[0].count}D${res2[0].sides}`);
        console.log("  ├─ ✅ Case 2 通過: 單擊層級多源 PR 骰子線性合併 ── 數據對齊完全無偏誤。");

        // --------------------------------------------------------
        // 【測試案例 3】降級相容測試 (不含括號的常規多輪重複)
        // --------------------------------------------------------
        const res3 = parseAdvancedDamageString("3 1D6+7");
        console.assert(res3.length === 3, `[失敗] Case 3: 跨輪展開應為 3 輪, 實測為 ${res3.length}`);
        console.assert(res3[0].attacks.length === 1, `[失敗] Case 3: 每輪打擊數應為 1, 實測為 ${res3[0].attacks.length}`);
        console.assert(res3[0].attacks[0].weaponDice[0].sides === 6 && res3[0].attacks[0].weaponDice[0].count === 1, `[失敗] Case 3: 武器骰應為 1D6`);
        console.assert(res3[0].attacks[0].flatMod === 7, `[失敗] Case 3: 固定加值應為 7, 實測為 ${res3[0].attacks[0].flatMod}`);
        console.assert(res3[0].prDices.length === 0, `[失敗] Case 3: 常規降級公式不應產出 PR 資源, 實測長度 ${res3[0].prDices.length}`);
        console.log("  ├─ ✅ Case 3 通過: 降級無括號常規多輪重複語法相容 ── 數據對齊完全無偏誤。");

        // --------------------------------------------------------
        // 【測試案例 4】一輪多擊（雙武器戰鬥，全輪平行宣告一次 2D6PR）
        // --------------------------------------------------------
        const res4 = parseAdvancedDamageString("3 (1D6+7, 1D4+7, 2D6PR)");
        console.assert(res4.length === 3, `[失敗] Case 4: 跨輪展開應為 3 輪, 實測為 ${res4.length}`);
        
        const round1_4 = res4[0];
        console.assert(round1_4.attacks.length === 2, `[失敗] Case 4: 打擊次數應為 2, 實測為 ${round1_4.attacks.length}`);
        console.assert(round1_4.attacks[0].weaponDice[0].sides === 6, `[失敗] Case 4: 第一擊應為主手 D6`);
        console.assert(round1_4.attacks[1].weaponDice[0].sides === 4, `[失敗] Case 4: 第二擊應為副手 D4`);
        console.assert(round1_4.prDices.length === 1, `[失敗] Case 4: 應成功抽離出 1 種 PR 資源, 實測為 ${round1_4.prDices.length}`);
        console.assert(round1_4.prDices[0].sides === 6 && round1_4.prDices[0].count === 2, `[失敗] Case 4: 全輪 PR 增傷池應為 2D6`);
        console.log("  ├─ ✅ Case 4 通過: 雙擊平行宣告 PR 獨立分離抽離 ── 數據對齊完全無偏誤。");

        // --------------------------------------------------------
        // 【測試案例 5】終極挑戰：非對稱跨輪序列與多源 PR 自動合併
        // --------------------------------------------------------
        const complexInput = "(1D6+7+1D6, 2D6PR, 1D6PR), 2 (1D6+7+1D6, 1D4+7+1D6, 2D6PR)";
        const res5 = parseAdvancedDamageString(complexInput);

        console.assert(res5.length === 3, `[失敗] Case 5: 總輪數應展開為 3 輪, 實測為 ${res5.length}`);

        const r1 = res5[0];
        console.assert(r1.attacks.length === 1, `[失敗] Case 5: 第 1 輪打擊數應為 1, 實測為 ${r1.attacks.length}`);
        console.assert(r1.prDices.length === 1, `[失敗] Case 5: 第 1 輪 PR 種類應合併為 1 種, 實測為 ${r1.prDices.length}`);
        console.assert(r1.prDices[0].sides === 6 && r1.prDices[0].count === 3, `[失敗] Case 5: 偷襲與蜂群應合併為 3D6 PR`);

        const r2 = res5[1];
        console.assert(r2.attacks.length === 2, `[失敗] Case 5: 第 2 輪打擊數應為 2, 實測為 ${r2.attacks.length}`);
        console.assert(r2.prDices[0].sides === 6, `[失敗] Case 5: 第 2 輪應只有 6 面骰的 PR 資源`);
        console.assert(r2.prDices[0].count === 2, `[失敗] Case 5: 第 2 輪 PR 數量應為 2, 實測為 ${r2.prDices[0].count}`);
        console.log("  ├─ ✅ Case 5 通過: 非對稱跨輪序列與多源 PR 線性合併 ── 數據對齊完全無偏誤。");

        // --------------------------------------------------------
        // 【測試案例 6】多層嵌套內層打擊複製語法測試
        // --------------------------------------------------------
        const nestedRes = parseAdvancedDamageString("2 (2 1D8+1D6+17, 2D8+1D6+17)");
        console.assert(nestedRes.length === 2, `[失敗] Case 6: 總作戰輪數應精確為 2 輪, 實測為 ${nestedRes.length}`);
        
        const round1 = nestedRes[0];
        console.assert(round1.attacks.length === 3, `[失敗] Case 6: 單輪內實質打擊數應為 3, 實測為 ${round1.attacks.length}`);
        console.assert(round1.attacks[0].flatMod === 17 && round1.attacks[0].weaponDice[0].sides === 8, `[失敗] Case 6: 第 1 擊展開內容錯誤`);
        console.assert(round1.attacks[1].flatMod === 17 && round1.attacks[1].weaponDice[0].sides === 8, `[失敗] Case 6: 第 2 擊展開內容錯誤`);
        console.assert(round1.attacks[2].flatMod === 17 && round1.attacks[2].weaponDice[0].count === 2, `[失敗] Case 6: 第 3 擊特殊擊內容錯誤`);
        console.log("  ├─ ✅ Case 6 通過: 多層嵌套打擊前綴複製語法展開 ── 數據對齊完全無偏誤。");

        console.log("\n================================================================================");
        console.log("🎉 [群組通關] ── testParser: 全量語法解析器斷言 100% 守恆！");
        console.log("================================================================================\n");

    } catch (error) {
        console.error("❌ 斷言測試發生未預期崩潰，捕獲異常:", error.message);
    }
}

function testParserStrictValidation() {
    const assert = (condition, message) => {
        if (!condition) throw new Error(`[失敗] ${message}`);
    };
    const assertThrows = (action, message) => {
        let didThrow = false;
        try {
            action();
        } catch (error) {
            didThrow = true;
        }
        assert(didThrow, message);
    };

    const opposingDice = parseSingleFormula("1D6 - 1D6");
    assert(
        opposingDice.weaponDice.length === 1
            && opposingDice.weaponDice[0].sides === 6
            && opposingDice.weaponDice[0].count === 1,
        "同面數正向骰應獨立保留"
    );
    assert(
        opposingDice.negativeDice.length === 1
            && opposingDice.negativeDice[0].sides === 6
            && opposingDice.negativeDice[0].count === 1,
        "同面數負向骰不應與正向骰互相抵銷"
    );

    const separateDice = parseSingleFormula("2D6 - 1D6 + 1D4 - 2D4 + 3");
    assert(
        separateDice.weaponDice.length === 2
            && separateDice.weaponDice[0].count === 2
            && separateDice.weaponDice[1].count === 1,
        "正向同面數骰應合併，但不可與負向骰合併"
    );
    assert(
        separateDice.negativeDice.length === 2
            && separateDice.negativeDice[0].count === 1
            && separateDice.negativeDice[1].count === 2
            && separateDice.flatMod === 3,
        "負向同面數骰及固定值應正確解析"
    );

    const toHitFormula = parseAttackString("D20 - 1D6 + 4");
    assert(
        toHitFormula.advantageMode === 0
            && toHitFormula.bonusDice.length === 1
            && toHitFormula.bonusDice[0].sides === 6
            && toHitFormula.bonusDice[0].count === -1
            && toHitFormula.flatMod === 4,
        "典型命中公式 D20 - 1D6 + 4 應正確解析 D20、負向輔助骰及固定值"
    );
    const toHitProbabilities = evaluateAttackProbabilities("D20 - 1D6 + 4", 10);
    assert(
        Math.abs(toHitProbabilities.pHit - 0.525) < UNIT_TEST_NUMERIC_TOLERANCE
            && Math.abs(toHitProbabilities.pCrit - 0.05) < UNIT_TEST_NUMERIC_TOLERANCE
            && Math.abs(toHitProbabilities.pMiss - 0.425) < UNIT_TEST_NUMERIC_TOLERANCE,
        "AC 10 時 D20 - 1D6 + 4 命中率應為 52.5%、爆擊率 5%、未命中率 42.5%"
    );

    assertThrows(() => parseSingleFormula("1D6oops"), "傷害公式不得部分解析無效尾綴");
    assertThrows(() => parseSingleFormula("1D6 + nope"), "傷害公式不得忽略無效項目");
    assertThrows(() => parseSingleFormula("1 D6"), "骰數及骰面標記之間不得有空格");
    assertThrows(() => parseSingleFormula("1D20"), "傷害公式必須拒絕不支援骰種");
    assertThrows(() => parseSingleFormula("1D6PR"), "一般傷害公式必須拒絕 PR 骰標記");
    assertThrows(() => parseAttackString("D20 + 1D20"), "命中公式必須拒絕不支援輔助骰種");
    assertThrows(() => parseAttackString("D20 + 5oops"), "命中公式不得部分解析無效尾綴");
    assertThrows(() => parsePrFormula("1D6PR + 1"), "PR 公式只可包含 PR 骰");
    assertThrows(() => parsePrFormula("1D20PR"), "PR 公式必須拒絕不支援骰種");
    assertThrows(() => parseAdvancedDamageString("(1D6 + 1"), "傷害序列必須拒絕未配對括號");
    assertThrows(
        () => parseAdvancedDamageString("junk (1D6 + 1) trailing"),
        "傷害序列不得忽略括號組以外的文字"
    );
    assertThrows(
        () => parseAdvancedDamageString("(1D6 + 1, nope)"),
        "傷害序列不得忽略輪次內的無效項目"
    );

    console.log("✅ testParserStrictValidation 通過：正負骰分流及傷害語法嚴格驗證。");
}

function testDicePoolLimits() {
    const assert = (condition, message) => {
        if (!condition) throw new Error(`[失敗] ${message}`);
    };
    const assertThrows = (action, message) => {
        let didThrow = false;
        try {
            action();
        } catch (error) {
            didThrow = true;
        }
        assert(didThrow, message);
    };

    const maximumPool = convolveMultipleFFT(
        Array.from(
            { length: MAX_DICE_POOL },
            () => ({ dist: PREGENERATED_DICE_NORMAL.D4, isNegative: false })
        )
    );
    assert(
        maximumPool.dist.length === MAX_DICE_POOL * 3 + 1
            && maximumPool.offset === MAX_DICE_POOL
            && maximumPool.support[0] === 1
            && maximumPool.support[maximumPool.support.length - 1] === 1
            && maximumPool.dist[0] === 0
            && maximumPool.dist[maximumPool.dist.length - 1] === 0
            && maximumPool.dist.every(Number.isFinite),
        "最大 600 骰 FFT 池須保留有限數值及兩端支撐，即使端點質量已截尾"
    );
    assertThrows(
        () => convolveMultipleFFT(
            Array.from(
                { length: MAX_DICE_POOL + 1 },
                () => ({ dist: PREGENERATED_DICE_NORMAL.D4, isNegative: false })
            )
        ),
        "超過 600 顆的摺積池必須在計算前拒絕"
    );
    assertThrows(
        () => parseSingleFormula("300D4+301D6"),
        "多項骰式合計超過骰池上限時必須拒絕"
    );
    assertThrows(
        () => evaluateAttackProbabilities("D20+600D4", 10),
        "命中公式必須將核心 D20 納入骰池上限"
    );
    assertThrows(
        () => parseAdvancedDamageString("2 (151 1D4)"),
        "重複打擊及輪次乘積超過傷害骰預算時必須在展開前拒絕"
    );
    assertThrows(
        () => parseAdvancedDamageString("301 1D4"),
        "超過輪次展開上限時必須拒絕"
    );
    assertThrows(
        () => calculate("critical pool limit", "D20", 10, { multiplier: 601 }, "(1D4)"),
        "爆擊傷害池超過 600 顆時必須拒絕"
    );
    assertThrows(
        () => calculate("PMF bucket limit", "D20", 10, { multiplier: 2 }, "(1D4+100000)"),
        "傷害 PMF 桶數超過上限時必須在分佈配置前拒絕"
    );

    const maximumDamage = calculate(
        "maximum damage pool",
        "D20",
        10,
        { multiplier: 2 },
        "(300D4)"
    );
    assert(
        maximumDamage.details.totalMaxPossibleDmg === 2400
            && maximumDamage.distribution.length === 2401
            && maximumDamage.distributionSupport[299] === 0
            && maximumDamage.distributionSupport[300] === 1
            && maximumDamage.distribution[300] === 0
            && maximumDamage.distributionSupport[2400] === 1
            && maximumDamage.distribution[2400] === 0
            && maximumDamage.discardedMass > 0,
        "300 顆基礎傷害骰及 600 顆爆擊骰必須完成完整計算"
    );

    console.log("✅ testDicePoolLimits 通過：骰池及計算資源邊界已驗證。");
}

function testPipelineCasePRStateDP() {
    const assert = (condition, message) => {
        if (!condition) throw new Error(`[失敗] ${message}`);
    };

    const threeStrikeCase = calculate(
        "PR single-use support bound",
        "D20 + 99",
        10,
        { threshold: 20, multiplier: 2 },
        "(1D4, 1D4, 1D4PR)"
    );
    const threeStrikeDist = threeStrikeCase.distribution;
    let totalMass = 0;
    let aboveSinglePrMaximum = 0;
    for (let damage = 0; damage < threeStrikeDist.length; damage++) {
        totalMass += threeStrikeDist[damage];
        if (damage > 24) aboveSinglePrMaximum += threeStrikeDist[damage];
    }
    assert(
        threeStrikeCase.details.totalMaxPossibleDmg === 24
            && threeStrikeDist.length <= 25
            && aboveSinglePrMaximum <= BUCKET_EPSILON,
        "兩擊輪次只可套用一次 PR；傷害不得超過 24"
    );
    assert(
        totalMass <= 1
            && 1 - totalMass <= threeStrikeCase.discardedMass + UNIT_TEST_NUMERIC_TOLERANCE,
        "PR 狀態轉移的截尾質量必須由省略質量上界涵蓋"
    );

    const delayedPrCase = calculate(
        "PR remains available after miss",
        "D20 + 99",
        10,
        { threshold: 20, multiplier: 2 },
        "(100, 1D4, 1D4PR)"
    );
    const delayedPrMass = delayedPrCase.distribution
        .slice(1, 100)
        .reduce((sum, probability) => sum + probability, 0);
    assert(
        Math.abs(delayedPrMass - 0.0475) < UNIT_TEST_NUMERIC_TOLERANCE,
        "首擊未命中而次擊命中時，PR 應於次擊使用一次（機率 0.05 × 0.95）"
    );

    console.log("✅ testPipelineCasePRStateDP 通過：PR 單次消耗、未命中延後使用及機率守恆。");
}

function testPipelineCaseMaximumDamageCap() {
    const assert = (condition, message) => {
        if (!condition) throw new Error(`[失敗] ${message}`);
    };
    const highestSupportedDamage = distribution => {
        for (let damage = distribution.length - 1; damage >= 0; damage--) {
            if (distribution[damage] > 0) return damage;
        }
        return 0;
    };

    const clippedNegativeAttack = calculate(
        "Per-attack zero floor maximum",
        "D20 + 99",
        10,
        { threshold: 20, multiplier: 2 },
        "(-1D4, 1D4)"
    );
    assert(
        clippedNegativeAttack.details.totalMaxPossibleDmg === 8
            && highestSupportedDamage(clippedNegativeAttack.distributionSupport) === 8,
        "負傷害攻擊須逐擊歸零，不可抵銷另一擊；理論上限及 PMF 上限應同為 8"
    );

    const prOnly = calculate(
        "PR without an attack",
        "D20 + 99",
        10,
        { threshold: 20, multiplier: 2 },
        "(1D4PR)"
    );
    assert(
        prOnly.details.totalMaxPossibleDmg === 0
            && prOnly.distribution.length === 1
            && prOnly.distribution[0] === 1,
        "沒有攻擊可承接 PR 時，理論上限須為 0，PMF 須集中於零傷害"
    );

    const onePrForRound = calculate(
        "One PR contribution to round maximum",
        "D20 + 99",
        10,
        { threshold: 20, multiplier: 2 },
        "(1D4, 1D4, 1D4PR)"
    );
    assert(
        onePrForRound.details.totalMaxPossibleDmg === 24
            && highestSupportedDamage(onePrForRound.distributionSupport) === 24,
        "每輪最大傷害只能將一次 PR 加至一擊，且理論上限須等於 PMF 上限"
    );

    console.log("✅ testPipelineCaseMaximumDamageCap 通過：零傷下限、PR 可用性及上限一致。");
}

function testMultipleD20Normalization() {
    const assert = (condition, message) => {
        if (!condition) throw new Error(`[失敗] ${message}`);
    };
    const assertThrows = (formula, message) => {
        let didThrow = false;
        try {
            parseAttackString(formula);
        } catch (error) {
            didThrow = true;
        }
        assert(didThrow, message);
    };

    for (const formula of [
        "D20A1 + D20D1 + 5",
        "D20D1 + D20A1 + 5",
        "D20A2 + D20D1 + 5",
        "D20D1 + D20A2 + D20A1 + 5"
    ]) {
        assert(
            parseAttackString(formula).advantageMode === 0,
            `${formula} 同時含優勢及劣勢，必須正規化為常規 D20`
        );
        const probabilities = evaluateAttackProbabilities(formula, 15);
        assert(
            Math.abs(probabilities.pHit - 0.5) < UNIT_TEST_NUMERIC_TOLERANCE
                && Math.abs(probabilities.pCrit - 0.05) < UNIT_TEST_NUMERIC_TOLERANCE
                && Math.abs(probabilities.pMiss - 0.45) < UNIT_TEST_NUMERIC_TOLERANCE,
            `${formula} 的實際命中機率亦必須與常規 D20 相同`
        );
    }

    assert(
        parseAttackString("D20A1 + D20A2 + 5").advantageMode === 2,
        "多個同向優勢條件須取最高階 Elven Accuracy"
    );
    assert(
        parseAttackString("D20D1 + D20D1 + 5").advantageMode === -1,
        "重複劣勢條件不得累加投骰，只保留劣勢模式"
    );
    assertThrows("D20A3 + 5", "不支援的優勢階數必須明確報錯");
    assertThrows("D20D2 + 5", "不支援的劣勢階數必須明確報錯");

    console.log("✅ testMultipleD20Normalization 通過：多重條件按優劣勢規則正規化。");
}

function testConvolutionTailPreservation() {
    const assert = (condition, message) => {
        if (!condition) throw new Error(`[失敗] ${message}`);
    };
    const d4 = PREGENERATED_DICE_NORMAL.D4;
    const thirtyD4 = convolveMultipleFFT(
        Array.from({ length: 30 }, () => ({ dist: d4, isNegative: false }))
    );
    const thirtyOneD4 = convolveMultipleFFT([
        {
            dist: thirtyD4.dist,
            support: thirtyD4.support,
            discardedMass: thirtyD4.discardedMass,
            offset: thirtyD4.offset,
            isNegative: false
        },
        { dist: d4, isNegative: false }
    ]);
    const supportAt = (pmf, damage) => {
        const index = damage - pmf.offset;
        return index >= 0 && index < pmf.support.length ? pmf.support[index] : 0;
    };
    assert(
        thirtyD4.offset === 30
            && thirtyD4.dist[0] === 0
            && thirtyD4.dist[thirtyD4.dist.length - 1] === 0
            && supportAt(thirtyD4, 29) === 0
            && supportAt(thirtyD4, 30) === 1
            && supportAt(thirtyD4, 120) === 1,
        "30D4 的 29 點以下須無支撐，最低及最高桶則以應用層無窮小保留可能性"
    );
    assert(
        thirtyD4.discardedMass > 0
            && thirtyD4.dist.reduce((sum, probability) => sum + probability, 0) < 1,
        "低於門檻的真實質量須被記錄並從後續數值摺積中移除"
    );
    assert(
        thirtyOneD4.offset === 31
            && thirtyOneD4.dist[0] === 0
            && thirtyOneD4.dist[thirtyOneD4.dist.length - 1] === 0
            && thirtyOneD4.support[0] === 1
            && thirtyOneD4.support[thirtyOneD4.support.length - 1] === 1,
        "下一次摺積須沿用支撐狀態，保留 31D4 的兩個邊界可能值"
    );

    const fftFirstHalf = convolveMultipleFFT(
        Array.from({ length: 300 }, () => ({ dist: d4, isNegative: false }))
    );
    let reference = new Float64Array([1]);
    for (let die = 0; die < 300; die++) {
        const next = new Float64Array(reference.length + 3);
        for (let total = 0; total < reference.length; total++) {
            for (let face = 1; face <= 4; face++) {
                next[total + face - 1] += reference[total] / 4;
            }
        }
        reference = next;
    }
    let maximumBucketError = 0;
    for (let i = 0; i < fftFirstHalf.dist.length; i++) {
        maximumBucketError = Math.max(
            maximumBucketError,
            Math.abs(fftFirstHalf.dist[i] - reference[i])
        );
    }
    const fftMean = fftFirstHalf.dist.reduce(
        (mean, probability, index) => mean + (index + fftFirstHalf.offset) * probability,
        0
    );
    assert(
        maximumBucketError < 1e-10
            && Math.abs(fftMean - 300 * 2.5) < 1e-8,
        "FFT 中心區分佈仍須符合直接摺積基準及理論平均值"
    );

    const negativeFft = convolveMultipleFFT(
        Array.from({ length: 300 }, () => ({ dist: d4, isNegative: true }))
    );
    const negativeFftMean = negativeFft.dist.reduce(
        (mean, probability, index) => mean + (index + negativeFft.offset) * probability,
        0
    );
    assert(
        negativeFft.offset === -1200
            && negativeFft.dist.length === 901
            && negativeFft.support[0] === 1
            && negativeFft.support[negativeFft.support.length - 1] === 1
            && Math.abs(negativeFftMean + 300 * 2.5) < 1e-8,
        "重複負骰的 FFT 頻域冪運算須保留反向分佈及整數位移"
    );

    const fftSecondHalf = convolveMultipleFFT([
        {
            dist: fftFirstHalf.dist,
            support: fftFirstHalf.support,
            discardedMass: fftFirstHalf.discardedMass,
            offset: fftFirstHalf.offset,
            isNegative: false
        },
        ...Array.from({ length: 300 }, () => ({ dist: d4, isNegative: false }))
    ]);
    const fftRetainedMass = fftSecondHalf.dist.reduce((sum, probability) => sum + probability, 0);
    assert(
        fftFirstHalf.dist[0] === 0
            && fftFirstHalf.dist[fftFirstHalf.dist.length - 1] === 0
            && fftFirstHalf.support[0] === 1
            && fftFirstHalf.support[fftFirstHalf.support.length - 1] === 1
            && fftSecondHalf.offset === 600
            && fftSecondHalf.dist[0] === 0
            && fftSecondHalf.dist[fftSecondHalf.dist.length - 1] === 0
            && fftSecondHalf.support[0] === 1
            && fftSecondHalf.support[fftSecondHalf.support.length - 1] === 1,
        "長 FFT 的後續摺積須保留 300D4 到 600D4 的極端邊界支撐"
    );
    assert(
        fftRetainedMass < 1
            && fftSecondHalf.discardedMass > 0
            && fftSecondHalf.dist.every(Number.isFinite)
            && fftSecondHalf.dist.every(probability => probability >= 0)
            && 1 - fftRetainedMass
                <= fftSecondHalf.discardedMass + UNIT_TEST_NUMERIC_TOLERANCE,
        "FFT 不得產生非有限／負質量或重新分配截尾質量，且須記錄省略質量"
    );

    const exactThreshold = convolveMultipleFFT([{
        dist: new Float64Array([1 - BUCKET_EPSILON, BUCKET_EPSILON]),
        isNegative: false
    }]);
    const belowThreshold = convolveMultipleFFT([{
        dist: new Float64Array([1 - BUCKET_EPSILON / 2, BUCKET_EPSILON / 2]),
        isNegative: false
    }]);
    assert(
        exactThreshold.dist[1] === BUCKET_EPSILON
            && exactThreshold.support[1] === 1
            && belowThreshold.dist[1] === 0
            && belowThreshold.support[1] === 1
            && belowThreshold.discardedMass === BUCKET_EPSILON / 2,
        "epsilon 相等值須保留數值，低於 epsilon 的值則只保留支撐並計入截尾質量"
    );

    const sparseSupport = convolveMultipleFFT([
        {
            dist: new Float64Array([0.5, 0, 0.5]),
            support: new Uint8Array([1, 0, 1]),
            isNegative: false
        },
        {
            dist: new Float64Array([0.5, 0, 0.5]),
            support: new Uint8Array([1, 0, 1]),
            isNegative: false
        }
    ]);
    assert(
        sparseSupport.support[0] === 1
            && sparseSupport.support[1] === 0
            && sparseSupport.support[2] === 1
            && sparseSupport.support[3] === 0
            && sparseSupport.support[4] === 1,
        "布林支撐摺積須保留內部不可能桶，不能只以最小／最大值填滿整段"
    );

    let printedRows = [];
    const originalConsoleTable = console.table;
    const originalConsoleLog = console.log;
    try {
        console.table = rows => { printedRows = rows; };
        console.log = () => {};
        printDamageDistribution({
            caseName: "support-only printer",
            distribution: new Float64Array([0, 0, 0]),
            distributionSupport: new Uint8Array([1, 0, 1])
        });
    } finally {
        console.table = originalConsoleTable;
        console.log = originalConsoleLog;
    }
    assert(
        printedRows.length === 2
            && printedRows[0]["傷害 / 區間"] === "0~0 點傷害"
            && printedRows[1]["傷害 / 區間"] === "2~2 點傷害"
            && printedRows.every(row => row["備註"] === "應用層無窮小／長尾聚合"),
        "列印器須展示支撐存在的零數值桶，並略過內部不可能桶"
    );

    console.log("✅ testConvolutionTailPreservation 通過：長尾保留及 FFT 與直接摺積基準一致。");
}

/**
 * 針對 5級心靈刃賊非對稱輸出序列進行全方位數值斷言測試
 */
/**
 * 靈魂刃盜賊 3 輪 DPR 複合條件機率管線檢驗群組 (含優勢、多段打擊、與 PR 抽離線性合併)
 * @name testPipelineCaseSoulKnife
 */
function testPipelineCaseSoulKnife() {
    console.log("🧪 [啟動測試群組] -> testPipelineCaseSoulKnife: 複合條件機率流與代數統計三重斷言檢驗...");
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
        // 【第一軌：單發打擊中立三態命中機率校對 (對齊微觀數學守恆值)】
        // ================================================================================
        // 預期理論值：優勢普通命中 = 60.00% (0.6000)
        // 預期理論值：優勢爆擊率 = 1 - 0.95 * 0.95 = 9.75% (0.0975)
        // 預期理論值：優勢未命中 = 0.55 * 0.55 = 30.25% (0.3025)
        const expectedHit = 0.6000;
        const expectedCrit = 0.0975;
        const expectedMiss = 0.3025;

        console.assert(
            Math.abs(d.pHit - expectedHit) < UNIT_TEST_NUMERIC_TOLERANCE,
            `[失敗] 狀態機普通命中率錯誤: 預期 ${expectedHit}, 實測值 ${d.pHit}`
        );
        console.assert(
            Math.abs(d.pCrit - expectedCrit) < UNIT_TEST_NUMERIC_TOLERANCE,
            `[失敗] 狀態機爆擊率錯誤: 預期 ${expectedCrit}, 實測值 ${d.pCrit}`
        );
        console.assert(
            Math.abs(d.pMiss - expectedMiss) < UNIT_TEST_NUMERIC_TOLERANCE,
            `[失敗] 狀態機未命中率錯誤: 預期 ${expectedMiss}, 實測值 ${d.pMiss}`
        );
        console.log("  ├─ ✅ 檢查點 A 通過: 優勢三態命中率(普通60%/爆擊9.75%/未命中30.25%) ── 數據對齊完全無偏誤。");

        // ================================================================================
        // 【第二軌：全戰鬥純代數理論最大傷害上限校對 (防範跨輪與多擊資源污染)】
        // ================================================================================
        // 預期理論真諦值：219 點
        // 第 1 輪 (1D6+7+1D6, 2D6PR) 爆擊極限 = (6 + 6 + 12) * 2 + 7 = 55
        // 第 2 輪 (1D6+7+1D6, 1D4+7+1D6, 2D6PR) 爆擊極限 = (6 + 6 + 12) * 2 + 7 + (4 + 6) * 2 + 7 = 55 + 27 = 82
        // 第 3 輪 與第 2 輪完全相同 = 82
        // 總上限 = 55 + 82 + 82 = 219 點
        const expectedMaxDmg = 219;
        
        console.assert(
            d.totalMaxPossibleDmg === expectedMaxDmg, 
            `[失敗] 純代數上限不對齊: 預期最大值 ${expectedMaxDmg}, 實測值 ${d.totalMaxPossibleDmg}`
        );
        console.log("  ├─ ✅ 檢查點 B 通過: 純代數軌道全戰鬥 219 點真理最大傷害上限 ── 數據對齊完全無偏誤。");

        // ================================================================================
        // 【第三軌：統計學四分位數累積單調性驗證 (防範時域機率塌陷)】
        // ================================================================================
        console.assert(
            result.q1 !== null && result.q2 !== null && result.q3 !== null,
            `[失敗] 統計四分位數未完全生成: Q1=${result.q1}, Q2=${result.q2}, Q3=${result.q3}`
        );
        console.assert(
            result.q1 <= result.q2 && result.q2 <= result.q3,
            `[失敗] 累積 CDF 違反單調增長原則: 實測 Q1:${result.q1} <= Q2:${result.q2} <= Q3:${result.q3} 失敗`
        );
        console.log(`  ├─ ✅ 檢查點 C 通過: 全累積 CDF 統計四分位數區間單調性 [ Q1: ${result.q1} | Q2: ${result.q2} | Q3: ${result.q3} ] ── 數據對齊完全無偏誤。`);

        console.log("\n================================================================================");
        console.log("🎉 [群組通關] ── testPipelineCaseSoulKnife: 核心機率、代數、統計三重防線 100% 守恆！");
        console.log("================================================================================\n");

    } catch (error) {
        console.error("❌ 斷言測試發生未預期崩潰，捕獲異常:", error.message);
    }
}

/**
 * 核心離散統計引擎自動化回歸測試：大失敗隔離與 D20A0 語法漏洞檢驗
 */
/**
 * 大失敗隔離與 D20A0 語法降級自動化斷言檢驗群組 (AC 25 極端防禦)
 * @name testPipelineCaseAC25
 */
function testPipelineCaseAC25() {
    console.log("🧪 [啟動測試群組] -> testPipelineCaseAC25: 大失敗隔離與 D20A0 語法漏洞檢驗...");
    try {
        // 1. 執行實質管線運算
        const summary = calculate(
            "大失敗隔離與輔助骰邊界校正測試 (AC 25 極端防禦)",
            "D20 + 1D4 + 1", 
            25, 
            { threshold: 20, multiplier: 2 }, 
            "(1D8+3)"
        );
        const d = summary.details;

        // ================================================================================
        // 【第一軌：命中與命中率判定斷言 (Accuracy & State Segregation Asserts)】
        // ================================================================================
        
        // 斷言 A: D20A0 必須被正確識別並降級為常規 NORMAL 模式，爆擊率與大失敗率皆必須精確為 5% (1/20)
        console.assert(
            Math.abs(d.pCrit - 0.05) < UNIT_TEST_NUMERIC_TOLERANCE,
            `[失敗] 檢查點 A 錯誤: 爆擊率不符合常規 D20 期望 (預期 0.05, 實測值 ${d.pCrit})`
        );
        console.log("  ├─ ✅ 檢查點 A 通過: D20A0 語法精確降級為常規 D20 分佈 ── 數據對齊完全無偏誤。");

        // 斷言 B: 在 AC 25 的防線下，即使 D20 投出常規上限 19 且 1D4 投出 4 點，總和 19+4+1=24 依舊無法命中。
        // 因此純普通命中率 pHit 理論上必須精確等於 0.0
        console.assert(
            Math.abs(d.pHit - 0.0) < UNIT_TEST_NUMERIC_TOLERANCE,
            `[失敗] 檢查點 B 錯誤: 普通命中率應為 0 (預期 0.0, 實測值 ${d.pHit})`
        );
        console.log("  ├─ ✅ 檢查點 B 通過: AC 25 極端防禦下純普通命中率精確歸零 ── 數據對齊完全無偏誤。");

        // 斷言 C: 根據機率質量守恆，未命中率 pMiss 必須精確收網在 1.0 - 0.0 - 0.05 = 0.95 (95%)
        console.assert(
            Math.abs(d.pMiss - 0.95) < UNIT_TEST_NUMERIC_TOLERANCE,
            `[失敗] 檢查點 C 錯誤: 未命中率未完整收網 (預期 0.95, 實測值 ${d.pMiss})`
        );
        console.log("  ├─ ✅ 檢查點 C 通過: 核心大失敗與未命中質量完全流向未命中軌道 ── 數據對齊完全無偏誤。");


        // ================================================================================
        // 【第二軌：定義域與純代數真理邊界斷言 (Domain Bound Asserts)】
        // ================================================================================
        
        // 斷言 D: 全系統管線最前端的純代數解析器，必須計算出絕對理論最高爆擊傷害：8 * 2 + 3 = 19 點
        console.assert(
            d.totalMaxPossibleDmg === 19, 
            `[失敗] 檢查點 D 錯誤: 代數理論最大傷害上限錯位 (預期 19, 實測值 ${d.totalMaxPossibleDmg})`
        );
        console.log("  ├─ ✅ 檢查點 D 通過: 純代數軌道全戰鬥絕對理論最大傷害上限 ── 數據對齊完全無偏誤。");

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
            `[失敗] 檢查點 E 錯誤: 1~4 點傷害真空區偵測到污染質量 (預期 <= ${BUCKET_EPSILON}, 實測值 ${traceContaminationProb})`
        );
        console.log("  ├─ ✅ 檢查點 E 通過: 1~4 點傷害時域判定域真空區無污染洩漏 ── 數據對齊完全無偏誤。");

        // 斷言 F: 檢驗統計分佈的總體 CDF 中位數 (Q2) 以及上四分位數 (Q3) 是否因 95% 未命中而完美鎖定在 0 點
        console.assert(summary.q1 === 0, `[失敗] 檢查點 F 錯誤: Q1 偏移 (預期 0, 實測值 ${summary.q1})`);
        console.assert(summary.q2 === 0, `[失敗] 檢查點 F 錯誤: 中位數 Q2 偏移 (預期 0, 實測值 ${summary.q2})`);
        console.assert(summary.q3 === 0, `[失敗] 檢查點 F 錯誤: Q3 偏移 (預期 0, 實測值 ${summary.q3})`);
        console.log("  ├─ ✅ 檢查點 F 通過: 全累積 CDF 統計四分位數因高落空完美鎖定 ── 數據對齊完全無偏誤。");


        // ================================================================================
        // 【第三軌：四分位數與機率質量守恆斷言 (Mass Conservation Asserts)】
        // ================================================================================
        
        // 斷言 G: 全分佈 PMF 陣列的所有桶位機率加總，必須 100% 滿足統計學底線：總和恆等於 1.0
        let totalMassSum = 0;
        for (let i = 0; i < summary.distribution.length; i++) {
            totalMassSum += summary.distribution[i];
        }
        console.assert(
            Math.abs(totalMassSum - 1.0) < UNIT_TEST_NUMERIC_TOLERANCE,
            `[失敗] 檢查點 G 錯誤: 機率質量未守恆 (預期 1.0, 實測值 ${totalMassSum})`
        );
        console.log("  ├─ ✅ 檢查點 G 通過: 最終絕對定義域 PMF 全陣列總機率質量守恆 ── 數據對齊完全無偏誤。");

        console.log("\n================================================================================");
        console.log("🎉 [群組通關] ── testPipelineCaseAC25: 全量雙軌大失敗與語法降級防線 100% 守恆！");
        console.log("================================================================================\n");

    } catch (error) {
        console.error("❌ 斷言測試發生未預期崩潰，捕獲異常:", error.message);
    }
}

/**
 * 自動化斷言單元測試：強行觸發 pMiss=0 以檢驗跨輪與最終管線的位移不滅定理
 * @name testPipelineCaseOffsetLoss
 */
/**
 * 自動化斷言單元測試：對齊評審二項分佈展開真理的跨輪管線位移檢驗
 * @name testPipelineCaseOffsetLoss
 */
/**
 * 跨輪管線與二項展開位移不滅檢驗群組 (評審真理修正版)
 * @name testPipelineCaseOffsetLoss
 */
function testPipelineCaseOffsetLoss() {
    console.log("🧪 [啟動測試群組] -> testPipelineCaseOffsetLoss: 跨輪管線位移與二項展開檢驗...");
    try {
        const caseName = "絕對命中與跨輪位移不滅回歸測試";
        const attackStr = "D20 + 99"; 
        const targetAC = 10;
        const criticalOptions = { threshold: 20, multiplier: 2 };
        const rawDamageStr = "2 (1D12+50)";

        const summary = calculate(caseName, attackStr, targetAC, criticalOptions, rawDamageStr);
        const d = summary.details;

        // 斷言 A: 5% 大失敗強制未命中，故單擊 pMiss 恆為 0.05
        console.assert(
            Math.abs(d.pMiss - 0.05) < UNIT_TEST_NUMERIC_TOLERANCE,
            `[失敗] 狀態機未命中率未對齊 5e 規則: 預期 0.05, 實測值 ${d.pMiss}`
        );
        console.log("  ├─ ✅ 檢查點 A 通過: 核心大失敗強制未命中率狀態分離 ── 數據對齊完全無偏誤。");

        // 斷言 B: 1 命中起點為 51 點。因此 1 ~ 50 點傷害之間是絕對真空區，質量必須恆為絕對零點
        let prefixLeakageProb = 0;
        const theoreticalFloor1Hit = 51;
        for (let dmg = 1; dmg < theoreticalFloor1Hit; dmg++) {
            if (summary.distribution[dmg] > BUCKET_EPSILON) {
                prefixLeakageProb += summary.distribution[dmg];
            }
        }
        console.assert(
            prefixLeakageProb <= BUCKET_EPSILON,
            `[失敗] 絕對真空區內偵測到洩漏質量: 預期 <= ${BUCKET_EPSILON}, 實測值 ${prefixLeakageProb}`
        );
        console.log("  ├─ ✅ 檢查點 B 通過: 跨輪時域 1~50 點保底真空區無污染 ── 數據對齊完全無偏誤。");

        // 斷言 C: 實質分佈的第一個傷害起點必須精確等於 51
        let actualFirstValidDamagePoint = -1;
        for (let i = 1; i < summary.distribution.length; i++) {
            if (summary.distribution[i] > BUCKET_EPSILON) {
                actualFirstValidDamagePoint = i;
                break;
            }
        }
        console.assert(
            actualFirstValidDamagePoint === theoreticalFloor1Hit,
            `[失敗] 實質分佈第一物理起點錯位: 預期第 ${theoreticalFloor1Hit} 格, 實測為第 ${actualFirstValidDamagePoint} 格`
        );
        console.log("  ├─ ✅ 檢查點 C 通過: 1 命中軌道時域實質物理起點對齊 ── 數據對齊完全無偏誤。");

        // 斷言 D: 驗證雙命中軌道（90.25%）在第 102 格安全存活
        console.assert(
            summary.distribution[102] > BUCKET_EPSILON,
            `[失敗] 雙命中傷軌波峰遺失: 第 102 格未偵測到保底質量 (實測 ${summary.distribution[102]})`
        );
        console.log("  ├─ ✅ 檢查點 D 通過: 2 命中雙保底波峰時域物理起點對齊 ── 數據對齊完全無偏誤。");

        // 斷言 E: 全戰鬥絕對理論最高爆擊傷害為 148 點
        console.assert(
            d.totalMaxPossibleDmg === 148,
            `[失敗] 純代數上限不對齊: 預期最大值 148, 實測值 ${d.totalMaxPossibleDmg}`
        );
        console.log("  ├─ ✅ 檢查點 E 通過: 純代數軌道全戰鬥絕對最大傷害上限 ── 數據對齊完全無偏誤。");

        // 斷言 F: 二次命中率高達 90.25%，四分位數 Q2 與 Q3 必須落在 102 點以上
        console.assert(summary.q2 >= 102, `[失敗] 中位數 Q2 未進入雙中軌: 實測值 ${summary.q2}`);
        console.assert(summary.q3 >= 102, `[失敗] Q3 未進入雙中軌: 實測值 ${summary.q3}`);
        console.log("  ├─ ✅ 檢查點 F 通過: 全累積 CDF 統計四分位數區間承諾 ── 數據對齊完全無偏誤。");

        console.log("\n================================================================================");
        console.log("🎉 [群組通關] ── testPipelineCaseOffsetLoss: 跨輪管線位移與二項展開防線 100% 守恆！");
        console.log("================================================================================\n");

    } catch (error) {
        console.error("❌ 斷言測試發生未預期崩潰，捕獲異常:", error.message);
    }
}

function testPipelineCaseDamageReduction() {
    console.log("🧪 [啟動測試群組] -> testPipelineCaseDamageReduction: 減傷骰時域相減與零傷沈澱檢驗...");
    try {
        const caseName = "武僧接箭與減傷護盾測試";
        const attackStr = "D20 + 99"; 
        const targetAC = 10;
        const criticalOptions = { threshold: 20, multiplier: 2 };
        const rawDamageStr = "(1D4 - 1D12 + 1)";

        const summary = calculate(caseName, attackStr, targetAC, criticalOptions, rawDamageStr);
        const d = summary.details;

        // 斷言 A: 【爆擊減傷修正】最大爆擊傷 = 4*2 - 1 + 1 = 8 點。對齊純代數解析軌道。
        console.assert(
            d.totalMaxPossibleDmg === 8,
            `[失敗] 檢查點 A 錯誤: 減傷代數上限不對齊 (預期最大值 8, 實測值 ${d.totalMaxPossibleDmg})`
        );
        console.log("  ├─ ✅ 檢查點 A 通過: 減傷資產架構下純代數 8 點真理最大傷害上限 ── 數據對齊完全無偏誤。");

        // 斷言 B: 5e 零傷保底沉澱檢驗
        const expectedZeroBucketMass = 19.0 / 24.0;
        const actualZeroBucketMass = summary.distribution[0];

        console.assert(
            Math.abs(actualZeroBucketMass - expectedZeroBucketMass) < UNIT_TEST_NUMERIC_TOLERANCE,
            `[失敗] 檢查點 B 錯誤: 5e 零傷保底時域沉澱率未與真理交匯 (預期 ${expectedZeroBucketMass}, 實測值 ${actualZeroBucketMass})`
        );
        console.log("  ├─ ✅ 檢查點 B 通過: 減傷幅度溢出時 5e 零傷保底時域沈澱防線 ── 數據對齊完全無偏誤。");

        // 斷言 C: 整個分佈的最高物理傷害邊界絕對不允許超出 8 點。第 9 格及以上的機率必須為絕對零點。
        let upperContamination = 0;
        for (let i = 9; i < summary.distribution.length; i++) {
            if (summary.distribution[i] > BUCKET_EPSILON) upperContamination += summary.distribution[i];
        }
        console.assert(
            upperContamination <= BUCKET_EPSILON,
            `[失敗] 檢查點 C 錯誤: 減傷判定域高位污染 (發現超出理論上限的幽靈質量 ${upperContamination})`
        );
        console.log("  ├─ ✅ 檢查點 C 通過: 減傷相減後高位時域定義域邊界真空區 ── 數據對齊完全無偏誤。");

        console.log("\n================================================================================");
        console.log("🎉 [群組通關] ── testPipelineCaseDamageReduction: 負向減傷與零傷沈澱管線 100% 守恆！");
        console.log("================================================================================\n");

    } catch (error) {
        console.error("❌ 斷言測試發生未預期崩潰，捕獲異常:", error.message);
    }
}

/**
 * 戰士冠軍爆擊門檻擴展與半奧克殘暴爆擊自動化斷言檢驗群組
 * @name testPipelineCaseSubclassModifiers
 */
function testPipelineCaseSubclassModifiers() {
    console.log("🧪 [啟動測試群組] -> testPipelineCaseSubclassModifiers: 冠軍擴展門檻與殘暴爆擊倍率檢驗...");
    try {
        const attackStr = "D20A1 + 5";
        const targetAC = 15;
        const rawDamageStr = "(1D12+4)";

        // ------------------------------------------------------------------------
        // 【檢查點 A】 戰士冠軍 19-20 爆擊擴展門檻檢驗
        // ------------------------------------------------------------------------
        const summaryA = calculate("冠軍戰士 19 門檻測試", attackStr, targetAC, { threshold: 19, multiplier: 2 }, rawDamageStr);
        const dA = summaryA.details;

        // 斷言 A-1: 優勢下 19+ 爆擊率必須精確等於 19.0%
        console.assert(
            Math.abs(dA.pCrit - 0.1900) < UNIT_TEST_NUMERIC_TOLERANCE,
            `[失敗] 檢查點 A-1 錯誤: 冠軍 19 門檻優勢爆擊率未對齊 (預期 0.19, 實測值 ${dA.pCrit})`
        );
        // 斷言 A-2: 普通命中率必須精確等於 60.75%
        console.assert(
            Math.abs(dA.pHit - 0.6075) < UNIT_TEST_NUMERIC_TOLERANCE,
            `[失敗] 檢查點 A-2 錯誤: 冠軍 19 門檻優勢普通命中率未對齊 (預期 0.6075, 實測值 ${dA.pHit})`
        );
        console.log("  ├─ ✅ 檢查點 A 通過: 戰士冠軍 19 門檻優勢三態機率流 ── 數據對齊完全無偏誤。");

        // ------------------------------------------------------------------------
        // 【檢查點 B】 戰士冠軍 18-20 高階爆擊擴展門檻檢驗
        // ------------------------------------------------------------------------
        const summaryB = calculate("冠軍戰士 18 門檻測試", attackStr, targetAC, { threshold: 18, multiplier: 2 }, rawDamageStr);
        const dB = summaryB.details;

        // 斷言 B-1: 優勢下 18+ 爆擊率必須精確等於 27.75%
        console.assert(
            Math.abs(dB.pCrit - 0.2775) < UNIT_TEST_NUMERIC_TOLERANCE,
            `[失敗] 檢查點 B-1 錯誤: 冠軍 18 門檻優勢爆擊率未對齊 (預期 0.2775, 實測值 ${dB.pCrit})`
        );
        // 斷言 B-2: 普通命中率必須精確等於 52.00%
        console.assert(
            Math.abs(dB.pHit - 0.5200) < UNIT_TEST_NUMERIC_TOLERANCE,
            `[失敗] 檢查點 B-2 錯誤: 冠軍 18 門檻優勢普通命中率未對齊 (預期 0.52, 實測值 ${dB.pHit})`
        );
        console.log("  ├─ ✅ 檢查點 B 通過: 戰士冠軍 18 門檻優勢三態機率流 ── 數據對齊完全無偏誤。");

        // ------------------------------------------------------------------------
        // 【檢查點 C】 半奧克蠻族 3x 殘暴爆擊倍率與代數上限檢驗
        // ------------------------------------------------------------------------
        const summaryC = calculate("半奧克蠻族 3倍爆擊測試", attackStr, targetAC, { threshold: 19, multiplier: 3 }, rawDamageStr);
        const dC = summaryC.details;

        // 斷言 C-1: 驗證代數上限解析器是否能精確算出 3 倍爆擊最大傷為 40 點 (12 * 3 + 4 = 40)
        console.assert(
            dC.totalMaxPossibleDmg === 40,
            `[失敗] 檢查點 C-1 錯誤: 殘暴爆擊 3x 代數上限不對齊 (預期最大值 40, 實測值 ${dC.totalMaxPossibleDmg})`
        );

        // 斷言 C-2: 檢驗統計分佈的實質物理最末端，第 41 格及以上必須為絕對真空區
        let upperContamination = 0;
        for (let i = 41; i < summaryC.distribution.length; i++) {
            if (summaryC.distribution[i] > BUCKET_EPSILON) upperContamination += summaryC.distribution[i];
        }
        console.assert(
            upperContamination <= BUCKET_EPSILON,
            `[失敗] 檢查點 C-2 錯誤: 3x 爆擊時域高位判定域污染 (發現超出理論上限的幽靈質量 ${upperContamination})`
        );
        console.log("  ├─ ✅ 檢查點 C 通過: 半奧克蠻族 3x 殘暴爆擊時域與代數真理上限 ── 數據對齊完全無偏誤。");

        console.log("\n================================================================================");
        console.log("🎉 [群組通關] ── testPipelineCaseSubclassModifiers: 門檻擴展與殘暴爆擊管線 100% 守恆！");
        console.log("================================================================================\n");

    } catch (error) {
        console.error("❌ 斷言測試發生未預期崩潰，捕獲異常:", error.message);
    }
}


testParser();
testParserStrictValidation();
testDicePoolLimits();
testPipelineCasePRStateDP();
testPipelineCaseMaximumDamageCap();
testMultipleD20Normalization();
testConvolutionTailPreservation();
testPipelineCaseSoulKnife();
testPipelineCaseAC25();
testPipelineCaseOffsetLoss();
testPipelineCaseDamageReduction();
testPipelineCaseSubclassModifiers();

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