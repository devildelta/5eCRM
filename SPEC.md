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
*   **`parseAttackString(attackStr)`**：拆解 D20 命中模式、輔助骰與命中固定加值 `flatMod`。
*   **`parseSingleFormula(formulaStr)`**：拆解基礎傷害公式（不含 PR 欄位）。利用 Map 結構自動合併同面數的常規武器骰數量。
*   **`parsePrFormula(prStr)`**：特別掃描並分離帶有 `PR`（Per-Round Once）後綴的骰子標記，在單擊/單輪層級聚合為獨立資源池。
*   **`parseAdvancedDamageString(damageStr)`**：
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
        2.  **純代數解析法 (Analytical Max Damage Counter)**：全戰鬥絕對理論上限累加由獨立兩層迴圈在靜態藍圖上執行代數加總：`roundMaxPossible = 武器最大爆擊面 + 該輪唯一PR最大爆擊面 + 該輪所有打擊固定值總和`。完美對齊 `219` 點理論上限。
        3.  遍歷輪次，初始化全輪二態鎖 `pPR_Available = 1.0`。
        4.  遍歷該輪次內的打擊序列：
            *   *狀態 A*：本擊完全未命中 $\rightarrow$ `singleAttackPDF[0] = pMiss`。
            *   *狀態 B (普通首擊)*：權重 `pHit * pPR_Available` $\rightarrow$ 武器普通分佈與 PR 普通分佈在實質對齊座標下相加，平移固定值累加至單擊 PDF。
            *   *狀態 C (爆擊首擊)*：權重 `pCrit * pPR_Available` $\rightarrow$ 武器爆擊分佈與 PR 爆擊分佈在實質對齊座標下相加，平移固定值累加至單擊 PDF。
            *   *狀態 D (資源消耗常規傷)*：引入 `pPR_Consumed = 1.0 - pPR_Available`。**當且僅當 `pPR_Consumed > BUCKET_EPSILON` 時才允許分支進場**。依照 `pHit * pPR_Consumed`（普通）與 `pCrit * pPR_Consumed`（爆擊）獨立四象限權重平移累加（不計 PR 骰）。
            *   *狀態更新*：該擊結束後，執行 `pPR_Available *= pMiss` 資源遞減。
            *   *進場過濾*：單擊 PDF 推入單輪 pool 前，執行 `if (singleAttackPDF[k] <= BUCKET_EPSILON) singleAttackPDF[k] = 0` 微觀噪點抹平。
        5.  將單輪 PDF 與跨輪總 PDF 進行連環直通摺積，加總 CDF 提取四分位數，附加完整的 `finalTotalDist` 陣列作 `distribution` 欄位傳回。

#### 5. 高階列印與雙軌自動化斷言工具 (Telemetry Tools)
*   **`printDamageDistribution(summary)`**：
    *   **長尾自動聚合狀態機 (Tail Aggregation)**：遍歷 `distribution` 陣列，若桶位機率大於 `BUCKET_EPSILON` 但低於顯示極限 `DISPLAY_THRESHOLD = 5e-9`，狀態機自動啟動長尾鎖，將後續所有微小點位相加，並以 `156 ~ 177 點傷害` 的單行區間摘要格式推入資料結構。
    *   **雙軌輸出形式**：
        1.  *軌道一*：呼叫原生高階 `console.table()` 輸出完美對齊、自動計算最優欄寬的三欄位（傷害區間、機率百分比、備註）視覺網格表格。
        2.  *軌道二*：在表格正下方噴出單行序列化 `JSON.stringify(copyableArray)` 純文字字串，允許開發者一鍵複製黏貼進自動化測試腳本中，完成 100% 程式碼級的無噪點回歸斷言檢查。
