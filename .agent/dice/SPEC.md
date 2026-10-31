### 📑 DND5e FFT 統計工具：終極核心演算法規格書 (Abstracted Spec)

#### 📋 專案歷史與貢獻者 (Engine Credits)
*   **Core Architecture & Spec Co-Authored By**: Gemini 1.5 Pro
*   **Technical Review & Math Optimization By**: Microsoft Copilot (M365 Copilot, GPT-5 Chat Model)

#### 🌐 實作語言與底層限制 (Implementation Language & Core Typings)
*   **Plain JavaScript (ES6+)**：本系統完全使用原生 JavaScript 實作。
*   **Float64Array (複數時域與頻域緩衝區)**：
    *   在處理 FFT 時，系統統一採用 `Float64Array` 作為緩衝區。
    *   **記憶體配置**：其長度固定為 `fftSize * 2`。其中偶數索引 `2*i` 存放複數的**實部（Real Part）**，代表實質的機率值；奇數索引 `2*i + 1` 存放複數的**虛部（Imaginary Part）**，在時域初始化時皆預設為 0。
*   **Map 結構 (面數聚合)**：
    *   在解析傷害骰時，系統採用 `Map<number, number>`。以骰子面數（sides）為鍵（Key），投骰數量（count）為值（Value），用於在摺積前進行同面數骰子的線性合併優化。

#### 🌐 產品範圍與計算介面 (Product Scope & Calculation Interface)
*   **目標範圍**：本工具專為 D&D 5e 建構分析而設，不以支援所有 TRPG 骰制為目標。現有 D4、D6、D8、D10、D12 為本工具支援的骰種集合；D100 及其他未列出的骰種不在範圍內，除非日後有明確需求。
*   **規則機制範圍**：優先支援對 D&D 5e 傷害分析有實際用途的重擲規則，包括 GWF 重擲 1、2 的情況。爆炸骰、保留最高／最低及任意自訂骰分佈等通用 TRPG 機制不屬目前目標。
*   **單一建構計算單位**：`calculate(...)` 計算一個建構／攻擊設定，並回傳可比較的結果（例如命中率、傷害 PMF、四分位數及理論上限）。跨建構比較由上層提供建構清單，逐一呼叫相同的單一計算單位，再整理結果；不應把不同建構的攻擊設定混成一次計算。
*   **DPR 輪次輸入**：頁面可計算 1 至 3 輪 DPR。每個攻擊項目可套用於所有計算輪次，或只套用於指定的一輪；留空代表每輪套用。總傷害分佈會合併所有已排定輪次的攻擊。進階傷害公式描述單輪，套用輪次由攻擊項目設定。
*   **可行計算量保護**：每個實際摺積骰池上限為 600 顆；單次傷害計算最多展開 300 顆基礎傷害骰、300 次打擊及 300 輪，最終 PMF 最多 100,000 個桶位。這讓常見 2 倍爆擊池可達 600 顆骰，同時限制分佈與 FFT 緩衝區配置；超限輸入會在配置大陣列或開始計算前以明確錯誤拒絕。FFT 頻域冪重構後，Node.js v24.20.0 基準中完整計算 `(300D4)`（含 600 顆爆擊骰）30 次暖機後量度 30 次，中位數約 2.9 ms、P90 約 3.3 ms；這是目前開發環境的實測值，尚未代表最低階瀏覽器裝置的效能保證，日後應以目標裝置重新基準。
*   **PR 資源模型**：每個攻擊項目在其套用的每輪各自有一個共享 PR 池，由該項目該輪的第一個命中消耗；留空輪次的項目會在每個分析輪次套用其 PR 池。多個獨立資源池、不同觸發條件或只適用於特定打擊的規則尚未定義；擴充前須先另行檢視規則語義及輸入表示法。

#### 0. 全域離散統計防禦常數 (Top-level Defense Constants)
*   **`BUCKET_EPSILON = 1e-12`**：應用層無窮小的絕對機率門檻。支撐存在而機率值嚴格小於此門檻的桶，會將數值質量設為 0、保留可能性支撐標記，並停止參與後續數值摺積；支撐標記須獨立於數值 PMF 傳遞。等於門檻的桶仍保留數值。這是截尾近似語義，不是 IEEE 754 精度常數，也不表示數學機率為零。
*   **`MASS_CORRECTION_REL_TOLERANCE = 1e-15`**：專案自訂的 FFT 總質量相對捨入漂移校正容差，並非 IEEE 754 machine epsilon。若本次摺積已因 `BUCKET_EPSILON` 截尾，不得透過整體正規化把被省略質量灌回保留桶。
*   **`DISPLAY_THRESHOLD = 5e-9`**：除錯印表機專用顯示門檻。低於此門檻的有支撐桶聚合為長尾；其中數值為零但支撐仍存在的桶，標示為「應用層無窮小」，不可當作不可能值略過。

#### 1. 離散機率質量函數快取 (Probability Mass Function Registry)
*   **`PREGENERATED_DICE_NORMAL`**：
    *   **輸入**：骰子面數 $S \in \{4, 6, 8, 10, 12\}$。
    *   **正向分佈處理**：建立長度 S+1 的浮點數陣列。將索引 1 到 S 的機率值皆設為 1/S，索引 0 設為 0。完成後鎖定陣列。
*   **`PREGENERATED_D20_ATTACK`**：
    *   **預計算目標**：長度為 21 的 D20 點數分佈陣列（有效索引 $1 \dots 20$）。
    *   **NORMAL 模式**：常規投骰。每點機率皆為定值 1/20。
    *   **ADV 模式 (優勢)**：投兩顆取最高。其中「至少為 s」的機率公式為 $1 - (\frac{s-1}{20})^2$。
    *   **DIS 模式 (劣勢)**：投兩顆取最低。其中「至少為 s」的機率公式為 $(\frac{21-s}{20})^2$。
    *   **EA 模式 (精靈準確)**：投三顆取最高。其中「至少為 s」的機率公式為 $1 - (\frac{s-1}{20})^3$。

#### 2. 核心快速傅立葉變換與摺積算法 (FFT & Convolution)
*   **核心演算法選型 (Algorithmic Choice)**：指定採用 **時間抽取基底-2 庫利-圖基演算法 (Radix-2 Cooley-Tukey FFT Algorithm)**。
*   **`fftInPlace(buffer, inverse)`**：
    *   **輸入**：長度為 2N 的 `Float64Array`（實部與虛部交錯），`inverse` 佈林值旗標。
    *   **處理流程**：執行位元反轉置換（Bit-reversal）與對數層級（$\log_2 N$）的蝴蝶定理頻域疊加，複數旋轉因子角度為 ± 2π / len。
*   **`convolveMultipleFFT(pool)`**：
    *   **輸入**：物件陣列 `pool`，每個物件含 `{ dist: Float64Array, support?: Uint8Array, discardedMass?: number, offset?: 整數, isNegative: 佈林值 }`。若未提供 `support`，由正機率桶推導；`offset` 表示 `dist[0]` 的絕對座標。
    *   **輸出**：`{ dist, support, discardedMass, offset }`。`support[i]` 表示該桶理論上仍可能出現；因此 `support[i] === 1 && dist[i] === 0` 代表應用層無窮小，而非數學上的零機率。`discardedMass` 累積已截尾質量及計算質量缺口的保守記錄，並非 FFT 全域誤差的形式化證明。
    *   **核心斷言與假設**：輸入的基本骰皆為有限、非負的離散 PMF；負向分佈透過反轉並記錄 offset 轉為非負索引表示。支撐範圍以整數區間集合傳播，支撐摺積獨立於數值摺積執行，以保留內部不可能桶。
    *   **時域直通車優化 (Pass-through Optimization)**：
        *   若 `pool.length === 1` 且其 `isNegative` 為假，則直接複製數值 PMF 及支撐遮罩，不執行 FFT；仍依呼叫選項套用應用層 epsilon 截尾。
    *   **位移整數限制守恆 (Integer Offset Constraint)**：所有偏移量在數學計算與傳遞過程必須保證完全為整數（Integer），直接應用於 `0-based` 陣列索引。
    *   **處理流程**：以支撐標記裁去不可能的前後端桶位，而非以數值大於零推斷支撐。若所有輸入支撐均為連續區間，直接相加各區間端點建立輸出支撐；只有存在內部支撐缺口時才使用區間集合摺積。估算逐次離散摺積工作量；工作量不超過 500,000 時採用直接 PMF 摺積，否則將長度擴展至大於最大可能跨度（`maxPossibleSpan`）的最小 2 的冪次方，以 FFT 計算。FFT 會按來源分佈、來源支撐及正負方向合併重複輸入；每個不同分佈只做一次正向 FFT，頻域以整數冪次表示其重複摺積，最後只做一次反向 FFT。直接摺積或 FFT 後，所有正機率桶若嚴格小於 `BUCKET_EPSILON`，即將數值設為零、累計其已截尾質量並保留支撐標記；FFT 負值與支撐以外的數值噪點設為零。只有本次沒有桶被截尾，且質量漂移在 `MASS_CORRECTION_REL_TOLERANCE` 範圍內，才可校正浮點捨入漂移；截尾質量不得重新分配到其他桶。支撐仍可能存在但數值摺積不再納入，故結果是明確的 epsilon 截尾近似。

#### 3. 語法解析器規格 (Parsers)
*   **`parseAttackString(attackStr)`**：拆解 D20 命中模式、輔助骰與命中固定加值 `flatMod`。公式必須完整匹配；輔助骰只支援 D4、D6、D8、D10、D12。多個 D20 條件標記按整體條件正規化，而非視作多次獨立攻擊：若同時包含優勢（`A1`／`A2`）與劣勢（`D1`），依 PHB 優劣勢規則互相抵銷為常規 D20；若只含同向標記，採用最高階（`A2` 高於 `A1`，重複劣勢不疊加）。拒絕不支援階數。
*   **`parseSingleFormula(formulaStr)`**：拆解基礎傷害公式（不含 PR 欄位）。利用 Map 結構分別合併同面數的正向武器骰和負向減傷骰，正負骰不可互相抵銷。公式必須完整匹配，拒絕無效項目及不支援骰種。
*   **`parsePrFormula(prStr)`**：特別掃描並分離帶有 `PR`（Per-Round Once）後綴的骰子標記，在單擊/單輪層級聚合為獨立資源池。只接受格式正確且使用支援骰種的 PR 骰公式。
*   **PR（Per-Round Once，每輪一次傷害）**：傷害公式中以 `PR` 後綴標記的骰子，例如 `2D6PR`，代表每輪最多可加到一次攻擊傷害上的共享傷害骰池。每輪開始時資源可用；未命中不會消耗資源，首個命中的攻擊（普通命中或爆擊）使用後，本輪其餘攻擊不再取得 PR 骰。若使用 PR 的攻擊爆擊，PR 骰按該角色的爆擊傷害倍率擲骰。每個新回合重新可用。此標記及規則是本工具的輸入／計算模型，不代表所有 D&D 5e 能力均共用相同的遊戲規則。
*   **`parseAdvancedDamageString(damageStr)`**：
    *   必須完整解析所有輪次群組及公式項目；不匹配的括號、組外額外文字、空項目及無效骰式均須明確報錯，不可跳過或部分解析。
    *   **結構展開**：一個外層括號代表完整的一輪次（One Full Round DPR）。
    *   **多層嵌套展開 (Nested Expansion)**：外層逗號切分「輪次群組」（支援係數 N 重複）；內層逗號切分「打擊序列」（支援 `N 公式` 形式的前綴數字時域打擊複製展開），含 PR 字串的子項會被完全抽離移出 `attacks` 陣列，不增加打擊次數。

#### 4. 流水線與條件機率耦合 (Pipeline Engine)
*   **變數生命週期作用域絕對隔離 (Scope Isolation)**：
    *   命中軌道與傷害軌道解構接收的變數名稱（如 `dist`、`offset`）必須進行嚴格的專屬命名隔離（例如 `attackDist`、`weaponNormalOffset`），絕對不允許在外層或閉包生命週期中重疊覆蓋。
*   **爆擊判定的規則正當性 & 大失敗剪枝**：
    *   爆擊完全、唯一取決於核心 D20 骰子的原生面點數。在計算總成功率 `pValidSuccess` 的遍歷中，若 `i + offset === 1`（代表核心 D20 投出大失敗 Natural 1），依 5e 規則**強制執行時域剪枝（continue 跳過）**，不計入成功率。總成功率扣除 `pCrit` 後即為純普通命中率 `pHit`。
    *   命中率所用的暫存攻擊骰分佈以 `applyBucketEpsilon: false` 計算，避免把低機率擲骰結果轉成 support-only 後，無法判定它是否達到 AC；傷害 PMF 管線仍使用應用層 epsilon 截尾。
*   **絕對座標系位移補償機制 (Offset Compensation)**：
    *   由於經由 `convolveMultipleFFT` 摺積返回的傷害 PMF 陣列，其相對索引 `w` 和 `p` 已經是被向左推到 `0` 的相對坐標。
    *   在微觀打擊迴圈遍歷時，**必須顯式同步接收並將實質的位移補償量（`weaponCritOffset` 與 `prCritOffset`）加回實質傷害加總中**：`dmg = (w + weaponCritOffset) + (p + prCritOffset) + attack.flatMod`。否則將導致爆擊高傷波峰向左錯位 6 格（流失至 7~12 點）。
*   **`calculate(caseName, attackStr, targetAC, criticalOptions, rawDamageStr)`**：
    *   **處理流程**：
        1.  設定爆擊門檻與基礎傷害骰倍率 `critMultiplier`。頁面共用基礎倍率限制為 1–8；可選的 `criticalOptions.attackTypeCritBonus` 僅可為 0 或 1，且只加到單項攻擊的武器傷害骰倍率；每輪 PR 骰仍使用基礎倍率。呼叫命中函數取得 `pHit, pCrit, pMiss`。
        2.  **純代數解析法 (Analytical Max Damage Counter)**：每次打擊先分別計算普通／爆擊上限，並將該擊上限截斷至最少 0，再加總該輪無 PR 的上限。若該輪有 PR 且至少有一擊，計算每擊加入 PR 後的上限增量，僅將 PR 最大增量計入一次；無打擊時 PR 不產生傷害。這條代數上限必須與最終 PMF 的最高支撐桶一致，即使其數值質量已被 epsilon 截尾。
        3.  遍歷輪次，初始化兩個狀態分佈：`PR_AVAILABLE` 的總傷害 PMF 初始為 `[1]`；`PR_CONSUMED` 初始為零質量。
        4.  依序處理該輪每次打擊，將目前各狀態的傷害 PMF 分支轉移：
            *   `PR_AVAILABLE` 遇未命中時保持可用，傷害為 0；遇普通命中或爆擊時，對應傷害加入 PR 骰（爆擊按倍率），並轉移至 `PR_CONSUMED`。
            *   `PR_CONSUMED` 遇未命中時保持已消耗，傷害為 0；遇普通命中或爆擊時只加入武器傷害，不再加入 PR 骰。
            *   不可將各次打擊各自的邊際傷害 PMF 當作互相獨立的分佈摺積，因 PR 使用事件依賴先前打擊結果。
        5.  輪次結束時合併 `PR_AVAILABLE` 與 `PR_CONSUMED` 狀態 PMF，所得輪次分佈再與其他獨立輪次摺積；加總保留數值質量的 CDF 提取四分位數。`calculate(...)` 維持 `distribution` 數值陣列，並另回傳 `distributionSupport` 與 `discardedMass`，供呼叫端分辨應用層無窮小和不可能桶。
    *   **`calculateAttackEntries(...)`** 可為個別項目提供 0 或 1 的 `critMultiplierBonus`，並以 `attackTypeCritBonus` 傳入單項計算；頁面由各攻擊項目的「爆擊時額外傷害骰」核取方塊設定。

#### 5. 高階列印與雙軌自動化斷言工具 (Telemetry Tools)
*   **`printDamageDistribution(summary)`**：
    *   **長尾自動聚合狀態機 (Tail Aggregation)**：按 `distributionSupport` 遍歷可能桶，低於顯示門檻 `DISPLAY_THRESHOLD = 5e-9` 的相鄰桶聚合成區間；數值為零但支撐存在的桶仍須輸出，並標示為應用層無窮小。只有支撐為零的桶才可略過。
    *   **雙軌輸出形式**：
        1.  *軌道一*：呼叫原生高階 `console.table()` 輸出完美對齊、自動計算最優欄寬的三欄位（傷害區間、機率百分比、備註）視覺網格表格。
        2.  *軌道二*：在表格正下方噴出單行序列化 `JSON.stringify(copyableArray)` 純文字字串，允許開發者一鍵複製黏貼進自動化測試腳本中，完成 100% 程式碼級的無噪點回歸斷言檢查。
