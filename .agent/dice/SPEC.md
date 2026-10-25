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

#### 0. 全域離散統計防禦常數 (Top-level Defense Constants)
*   **`BUCKET_EPSILON = 1e-12`**：巨觀的時域剪枝與噪點抹平防線。用於切除傅立葉變換在時域邊界產生的微小機率漣漪，防止其干擾邊界判定與位移追蹤。
*   **`MACHINE_EPSILON = 1e-15`**：微觀的硬體精度防線。對齊 IEEE 754 雙精度浮點數在硬體暫存器上的精度極限，用於校正多層次摺積後的二進位制精度損耗。
*   **`DISPLAY_THRESHOLD = 5e-9`**：除錯印表機專用顯示極限。低於此實質機率值的長尾桶位，在 `.toFixed(6)` 百分比化時會被四捨五入為 `0.000000%`，故在此防線觸發狀態機自動長尾聚合。

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
    *   **輸入**：物件陣列 `pool`，每個物件含 `{ dist: Float64Array, isNegative: 佈林值 }`。
    *   **核心斷言與假設**：輸入的基本骰必滿足 $dist[0] = 0$ 的強烈限制（皆為標準 1-based 均勻骰）。在此前提下，負向分佈可安全跳過動態裁剪。
    *   **時域直通車優化 (Pass-through Optimization)**：
        *   若 `pool.length === 1` 且其 `isNegative` 為假，則**直接深拷貝克隆該分佈並直通返回**，100% 阻斷傅立葉正逆向變換對空分佈或單一分佈引發的微觀定義域污染。
    *   **位移整數限制守恆 (Integer Offset Constraint)**：所有偏移量在數學計算與傳遞過程必須保證完全為整數（Integer），直接應用於 `0-based` 陣列索引。
    *   **處理流程**：遍歷過濾 `BUCKET_EPSILON` 前端零點，將長度擴展至大於最大可能跨度（`maxPossibleSpan`）的最小 2 的冪次方，於頻域點對點複數相乘，逆向 IFFT 轉回時域，並執行 `MACHINE_EPSILON` 級別的唯一一次單次除法歸一化。

#### 3. 語法解析器規格 (Parsers)
*   **`parseAttackString(attackStr)`**：拆解 D20 命中模式、輔助骰與命中固定加值 `flatMod`。公式必須完整匹配；輔助骰只支援 D4、D6、D8、D10、D12。
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
*   **絕對座標系位移補償機制 (Offset Compensation)**：
    *   由於經由 `convolveMultipleFFT` 摺積返回的傷害 PMF 陣列，其相對索引 `w` 和 `p` 已經是被向左推到 `0` 的相對坐標。
    *   在微觀打擊迴圈遍歷時，**必須顯式同步接收並將實質的位移補償量（`weaponCritOffset` 與 `prCritOffset`）加回實質傷害加總中**：`dmg = (w + weaponCritOffset) + (p + prCritOffset) + attack.flatMod`。否則將導致爆擊高傷波峰向左錯位 6 格（流失至 7~12 點）。
*   **`calculate(caseName, attackStr, targetAC, criticalOptions, rawDamageStr)`**：
    *   **處理流程**：
        1.  設定爆擊門檻與傷害骰倍率 `critMultiplier`。呼叫命中函數取得 `pHit, pCrit, pMiss`。
        2.  **純代數解析法 (Analytical Max Damage Counter)**：每次打擊先分別計算普通／爆擊上限，並將該擊上限截斷至最少 0，再加總該輪無 PR 的上限。若該輪有 PR 且至少有一擊，計算每擊加入 PR 後的上限增量，僅將 PR 最大增量計入一次；無打擊時 PR 不產生傷害。這條代數上限必須與最終 PMF 的最高非零桶一致。
        3.  遍歷輪次，初始化兩個狀態分佈：`PR_AVAILABLE` 的總傷害 PMF 初始為 `[1]`；`PR_CONSUMED` 初始為零質量。
        4.  依序處理該輪每次打擊，將目前各狀態的傷害 PMF 分支轉移：
            *   `PR_AVAILABLE` 遇未命中時保持可用，傷害為 0；遇普通命中或爆擊時，對應傷害加入 PR 骰（爆擊按倍率），並轉移至 `PR_CONSUMED`。
            *   `PR_CONSUMED` 遇未命中時保持已消耗，傷害為 0；遇普通命中或爆擊時只加入武器傷害，不再加入 PR 骰。
            *   不可將各次打擊各自的邊際傷害 PMF 當作互相獨立的分佈摺積，因 PR 使用事件依賴先前打擊結果。
        5.  輪次結束時合併 `PR_AVAILABLE` 與 `PR_CONSUMED` 狀態 PMF，所得輪次分佈再與其他獨立輪次摺積；加總 CDF 提取四分位數，並將完整 `finalTotalDist` 作為 `distribution` 欄位傳回。

#### 5. 高階列印與雙軌自動化斷言工具 (Telemetry Tools)
*   **`printDamageDistribution(summary)`**：
    *   **長尾自動聚合狀態機 (Tail Aggregation)**：遍歷 `distribution` 陣列，若桶位機率大於 `BUCKET_EPSILON` 但低於顯示極限 `DISPLAY_THRESHOLD = 5e-9`，狀態機自動啟動長尾鎖，將後續所有微小點位相加，並以 `156 ~ 177 點傷害` 的單行區間摘要格式推入資料結構。
    *   **雙軌輸出形式**：
        1.  *軌道一*：呼叫原生高階 `console.table()` 輸出完美對齊、自動計算最優欄寬的三欄位（傷害區間、機率百分比、備註）視覺網格表格。
        2.  *軌道二*：在表格正下方噴出單行序列化 `JSON.stringify(copyableArray)` 純文字字串，允許開發者一鍵複製黏貼進自動化測試腳本中，完成 100% 程式碼級的無噪點回歸斷言檢查。
