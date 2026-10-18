# CR Stage 5 Playwright 測試材料

- 審核日期：2026-10-05
- 對照版本：目前工作區的 `cr.html`、`src/cr.js`、`src/cr.css`
- 目的：整理本工作階段已執行的 Playwright 瀏覽器案例，判斷它們是否仍符合目前 UI，並提供階段 5 可重跑的驗收步驟。
- 限制：工作區沒有 Playwright 測試 runner / `package.json`；以下是已手動執行過的瀏覽器案例與重跑規格，不是可直接執行的自動化測試檔。歷史結果不代表每項都已在目前版重跑。

## 狀態定義

- **保留**：測試目的及現行互動仍有效；重跑時使用本文列出的最新定位方式。
- **改寫**：原案例測到的行為仍需要驗收，但原有 selector、表單欄位或操作流程已過時。
- **重跑確認**：最新 UI 仍有該功能，但歷史通過結果不足以代表目前版通過。
- **未曾完成**：在目前可查的 Playwright 紀錄中未找到完整執行與結果；列為 Stage 5 待驗收，不視為通過。
- **淘汰**：舊 UI / 診斷用呼叫，不再作為產品驗收案例。

## 測試前置

1. 以 HTTP(S) 開啟 CR，例如 `http://127.0.0.1:8765/cr.html`；不要用 `file://`。
2. 測試角色使用唯一臨時名稱（例如 `__cr_stage5_<timestamp>__`）。在測試前保存 `localStorage.getItem('dnd_skills_db')`，測試後以 `finally` 邏輯還原原字串，避免污染使用者角色資料。
3. 若以測試 fixture 寫入 localStorage，必須在 reload 前寫入；頁面載入後再以 `#characterSelect` 選取角色，或使用目前支援的 `?character=<encoded-name>` URL。
4. 每次 reload 後等待頁面載入及 modal transition 完成，再檢查 `.show`、可見度或結果文字，避免把動畫中的中間狀態當作失敗。
5. 現行常用定位：`[data-action="open-management"]`、`#managementModal`、`[data-action="new-resource"]`、`#resourceForm`、`[data-action="confirm-management"]`、`[data-action="use-resource"]`、`[data-action="reset-resource"]`、`[data-action="reset-cooldown"]`、`[data-action="accumulate-hit-die"]`、`[data-action="commit-hit-dice"]`、`[data-action="clear-hit-dice"]`。

## 案例總覽

| ID | 測試範圍 | 適用性 | 歷史紀錄判斷 |
|---|---|---|---|
| CR-01 | HTTP 載入、Bootstrap、CR 主頁及空狀態 | 保留 | 曾做載入 / script / Bootstrap smoke test；以最新頁面重跑確認即可 |
| CR-02 | 管理 modal、分頁及關閉 | 重跑確認 | 曾測 modal API、click delegation、分頁和關閉；一些早期點擊測試是 modal 初始化除錯，不是穩定驗收 |
| CR-03 | 建立角色與角色切換 | 改寫 | 舊版首頁連結建立角色已淘汰；目前是 `cr.html` 的 Bootstrap modal。曾有 modal 建立與選取案例，需以現行 UI 重跑 |
| CR-04 | 資源新增 / 修改 / 複製 / 刪除 / 取消 | 改寫 | 曾測新增和確認流程；表單已不再輸入目前次數，需更新舊欄位定位並補齊 CRUD 回歸 |
| CR-05 | 超上限警示及單項重置 | 保留 | 曾驗證降低 max 後保留 current、顯示警示、重置至新上限；目前狀態樣式仍存在，需納入回歸 |
| CR-06 | 消耗、單項重置、批次休息及 DOM 局部更新 | 保留 | 曾測消耗 / 重置 / 短長休與受影響節點更新；需覆蓋最新聚合卡內項目 |
| CR-07 | 生命骰累積器 | 改寫 | 累積 / 清除 / 提交及同骰面合併曾測通過；舊「快速新增模板」selector 已淘汰，改用 accumulator selectors |
| CR-08 | 職業預設、多職業、Artificer、自訂職業 | 保留 | 曾測職業列與進程；用現行 `[data-class-*]` 欄位及 `apply-class-levels` 操作重跑 |
| CR-09 | 重套職業資源、保留手動資源及清除舊生成資源 | 改寫 | 曾測生命骰 / 普通法術位 / Pact Slot 重建並保留手動資源；新增 MA 清除後須重跑完整案例 |
| CR-10 | Warlock Mystic Arcanum 門檻、命名、分組 | 保留 | 最新 Playwright 已確認 12 / 13 / 15 / 17 級生成門檻及與 Pact 同卡；應保留為回歸案例 |
| CR-11 | 分組順序、內項狀態色、外卡聚合色、回復時機層級 | 保留 | 曾測四黃一紅外卡黃、生命骰顏色及混合 / 統一周期；需保留為核心回歸案例 |
| CR-12 | 資源資料刷新後持久化 | 重跑確認 | 曾使用 localStorage fixture 和 reload；應再以使用者資料以外的臨時角色重跑 |
| CR-13 | 行動版 modal / 頁面寬度與 disabled 對比 | 重跑確認 | 曾測 390px viewport、modal 邊界和 disabled 色彩；最新 Bootstrap / CSS 應重跑 |
| CR-14 | 匯入、匯出、剪貼簿、重名覆蓋 / 略過 | 未曾完成 | Stage 5 清單已有要求；目前歷史紀錄不足以判定整套流程已通過 |
| CR-15 | 鍵盤焦點、Tab、ESC、輔助科技及真實裝置 | 未曾完成 | 歷史自動化 / 視窗模擬不能替代人工與實機驗收 |
| CR-16 | Pass 2 職業／子職業、TCE、資源規則 | 已針對性重跑 | 以下記錄本次 focused checks；不代表 Step K 全子職業矩陣已完成 |

## Pass 2 targeted verification

以下使用 HTTP 頁面和臨時角色手動執行 Playwright 檢查；每次測試前後均保存並還原原有 localStorage。各案例通過，沒有 JavaScript page error：

- 13 個標準職業均在子職業解鎖等級前停用選擇、到達解鎖等級後要求選擇。
- Paladin 缺少 CHA 時出現本地化錯誤；Paladin 資源上限、Eldritch Knight 第三施法者進程、語言切換後保留子職業選擇均符合預期。
- TCE 選項預設關閉、不同角色彼此隔離且重新載入後保留；Favored Foe opt-in 會產生 PB 資源，Sorcerous Restoration 會在短休恢復 4 點，停用後不再恢復。
- Arcane Jolt 的 INT 調整值上限及每回合使用閘、Cleric Harness Divine Power 的職業等級次數與法術位環級上限、Star Map、Infectious Inspiration 均已抽樣驗證。
- Soulknife Psionic Energy Dice 的 PB 上限、5 級 d8 骰面及短休恢復 1 顆均已驗證；Power Surge 初始為 1、長休後亦重設為 1；Wizard 的 Benign Transposition、Instinctive Charm、Illusory Self、Major Transformation 規則已抽樣驗證。
- 重套時保留手動資源及既有資源消耗；自訂職業手動法術位／生命骰，以及 Paladin 3 級既有法術位計算均未改變。
- SR/LR 統一為短休：既有資料中的「短休或長休」冷卻與 recovery metadata 會遷移成「短休」；資源編輯器只提供統一用語，短休批次回復仍可恢復遷移後資源。瀏覽器檢查通過且無 JavaScript page error；匯入路徑也使用同一正規化 helper。
- Step J targeted test run（2026-10-19）：使用臨時 Ranger 1／Fighter 3（Battle Master）／Paladin 2 角色驗證總等級 PB、CHA 調整值、職業等級公式、Battle Master 骰數／骰面／冷卻、Favored Foe opt-in 及獨立使用閘；另驗證 TCE 預設關閉、啟用後生成、角色／子職業／能力值持久化與角色間隔離。全數通過，沒有 JavaScript page error。

**Step K 未執行（依操作員指示）**：未跑逐一覆蓋所有子職業的 20 級案例，亦未跑計劃列出的完整多職整合矩陣。以上 focused checks 不替代該矩陣。

## 重跑規格

### CR-01：載入與空狀態

1. 開啟 `cr.html`，確認標題為「D&D 5E 角色資源管理」、`src/cr.js` 載入、`bootstrap.Modal` 可用。
2. 沒有選取角色時，確認提示要求選擇或建立角色；休息按鈕 disabled，資源區沒有卡片。
3. 不再檢查 `window.use` 等舊全域函式；目前互動由 IIFE 和 `data-action` 事件委派處理。

**通過條件**：頁面載入無 JavaScript page error；空狀態與 disabled 狀態正確。

### CR-02：管理 modal / 分頁

1. 點擊 `[data-action="open-management"]`，等待 `#managementModal.show`。
2. 依序選「角色」「備份」「資源」分頁，確認對應 `[data-section-panel]` 可見且其餘隱藏。
3. 以關閉按鈕、Escape 各關閉一次；確認 modal/backdrop 消失且 body 不再維持 modal-open 狀態。
4. 記錄 modal API 已載入與 `pageerror`；不要只用直接呼叫 Bootstrap `.show()` 代替按鈕觸發測試。

**歷史判斷**：曾測 Bootstrap modal API、事件委派、分頁及關閉；早期曾需手動呼叫 modal API 排查 click 行為。最新 UI 的 data API 觸發需在重跑時明確確認，不能只依賴舊的成功結果。

### CR-03：建立角色 / 切換角色

1. 點擊主頁「建立角色」，輸入唯一測試名稱並提交。
2. 確認 modal 關閉、角色出現在 `#characterSelect`、新角色被選取並寫入 `dnd_skills_db`。
3. 建立第二個空測試角色並切換來回，確認目前角色標籤、資源清單和管理資料跟隨角色切換。

**改寫原因**：舊測試從首頁的「建立 CR」連結進入獨立建立頁；目前建立流程是 CR 頁內 modal，舊連結與 `waitForURL(/cr.html\?character=/)` 不應再使用。

### CR-04：資源 CRUD / 取消

1. 在管理 > 資源新增資源，填名稱、max、cooldown、source，提交並確認。
2. 新增資源應以 `current === max` 建立；目前新增表單沒有 current 欄位。
3. 修改資源名稱 / max / cooldown / source；確認 current 保留。取消修改後原資料不得變更。
4. 複製資源並確認複製目標 / 名稱；刪除前確認內容，再取消一次、確認一次。
5. 驗證主頁以及管理列表顯示的名稱、current/max、周期及 source。

**改寫原因**：舊案例定位 `#resourceCurrentGroup` 或輸入新增 current 已過時；現行表單以 `#resourceName`、`#resourceMax`、`#resourceCooldown`、`#resourceSource` 為主，並透過確認畫面完成提交。

### CR-05：max 變更、超上限警示及單項重置

1. fixture 建立資源 `current=5, max=5`，管理編輯將 max 改為 2，保留 current=5。
2. 確認主卡顯示超上限警告 / 紅框與提示，不能把 current 靜默截成 2。
3. 點該資源的「重置」，確認變成 `2 / 2`，警告清除。

**歷史判斷**：已在 HTTP 頁面測過 max 由 5 降至 2、保留目前值、警告與重置至 2/2；此行為仍符合最新 UI，需作回歸。

### CR-06：消耗、單項重置、休息與局部更新

1. fixture 建立每回合、短休、長休資源各一項及不同目前值。
2. 對某資源點「使用」一次，確認只減該資源 1 次；current 為 0 後使用按鈕 disabled，再按不會低於 0。
3. 點單項「重置」，確認只將該資源補至 max。
4. 點「每回合」「短休」「長休」，分別確認只恢復該周期及較短周期的資源；其他周期與手動資源不變。
5. 驗證長休生命骰恢復按目前半數骰規則封頂於 max，契約魔法短休恢復、普通法術位及神秘奧秘長休恢復。
6. 監看未受影響卡片 / 內項 DOM identity，消耗與單項 / 批次回復不得重建無關資源節點。

**歷史判斷**：曾以單資源及短休 / 長休 fixture 驗證消耗、重置、回復，亦曾驗證更新不重繪其他資源。需要補上 grouped inner row 與 Hit Dice 邊界的最新回歸。

**待注意規則邊界**：目前實作以 `Math.floor(max / 2)` 計算長休恢復骰數。2014 PHB 的恢復量有「至少一顆」下限；請加 `max=1, current=0` 的案例確認。以現行公式該案例會恢復 0，若要符合該規則需先修正實作再標通過。

### CR-07：生命骰累積器

1. 管理 > 資源按 d8 兩次、d6 一次，確認 badge 分別為 2、1，主頁資源尚未改變。
2. 點「清除暫存」，確認 badge 歸零且沒有新資源。
3. 再累積 d8 兩次、d6 一次，點「加入生命骰」，確認新增 / 合併成每骰面一個資源，次數和上限同步增加，暫存清零。
4. 測試無角色、無暫存時相關按鈕 disabled。

**改寫原因**：舊 `data-action="add-hit-die-template"` 及立即新增單顆骰子的流程已淘汰；目前以 `[data-action="accumulate-hit-die"][data-die]`、badge `[data-die-count]`、commit / clear 按鈕操作。

### CR-08：職業計算器

1. 新角色開管理時確認至少一列職業；選標準職業範本，確認名稱 / 骰面鎖定並呈現合法施法進程。
2. 加第二列，確認重複職業範本不可選；測 Bard + Warlock 的多職業普通法術位與 Pact 分開計算。
3. 選 Artificer，確認半施法向上取整；選自訂職業與 manual progression，填逐環數量並驗證生成法術位。
4. 修改等級、移除等級 0 職業，確認 Hit Dice、普通法術位、Pact 資源依職業組合重算。
5. 輸入空名稱、非整數或範圍外等級 / 數量，確認不可套用並顯示錯誤。

**歷史判斷**：曾測職業 preset、合法 progression、Artificer / 自訂職業、重複職業鎖定及多職業生成；套用按鈕目前是 `data-action="apply-class-levels"`，而非早期腳本中的舊 selector。

### CR-09：重套 / 清除生成資源

1. 為測試角色先生成職業資源，再額外建立一筆手動資源。
2. 加入含 `generatedClass.kind="mystic-arcanum"` 的舊 5 環 MA 資料（可模擬舊版錯誤資料），並保留正常 6 環 MA。
3. 重套 Warlock 12 級，檢查確認預覽及保存後資源。
4. 確認舊 5 環與舊 6 環生成列均被清除，只剩一筆新生成的 6 環 MA；契約位重建；生命骰重算；手動資源保留。
5. 將 Warlock 17 級套用後再降至 12 級，確認 7 / 8 / 9 環 MA 移除，不留下過期 tier 或重複列。

**歷史判斷**：舊測試已驗證 Hit Dice / 普通法術位 / Pact Slot 重建並保留 Ki Points；最新修補後已實際注入舊 5 環 MA 並重套 12 級，確認只保留一筆 6 環。往返等級 17 -> 12 仍應列為完整回歸。

### CR-10：Warlock Pact / Mystic Arcanum

1. 分別預覽 Warlock 10、11、12、13、15、17 級。
2. 預期：10 級無 MA；11 / 12 級有 6 環；13 級增加 7 環；15 級再增加 8 環；17 級再增加 9 環，較低已解鎖 tier 保留。
3. 12 級檢查 Pact Slot 為 5 環、short rest；MA 為 6 環、long rest。
4. 確認 Pact 與 MA 在「契約魔法與神秘奧秘」同卡；內項名稱是「契約魔法（5 環）」「神秘奧秘（6 環）」等，不含 Warlock 名稱。
5. 確認混合周期時各內項顯示自己的回復時機，外卡不顯示假的統一周期。

**歷史判斷**：12 / 13 / 15 / 17 級預覽、6 / 7 / 8 / 9 環累加及 12 級同卡曾在最新版本執行；保留為專項回歸。

### CR-11：排序、分組、顏色與回復時機

1. fixture 至少包含兩種生命骰、普通法術位 1–5 環 / 6–9 環、Pact、MA、其他資源。
2. 確認生命骰先於普通法術位；普通法術位 1–5 環先於 6–9 環；Pact / MA 共卡；其他資源排後。
3. 驗證單列資源不必包進多項群組；群組內的按鈕仍只操作對應 inner resource。
4. 單項資源卡 / 群組內資源列背景依比例分五段：`(75%,100%]` 綠、`(50%,75%]` 黃、`(25%,50%]` 橙、`(0%,25%]` 紅、`0%` 近黑；次數標籤本身維持原樣式。
5. 超過 max 時仍顯示獨立警示框；檢查五種背景與警示同時出現時文字仍清楚。
6. 同周期群組只在外層顯示回復時機，內項標籤隱藏；混合周期群組外層不顯示「混合」，各內項顯示自己的周期。

**歷史判斷**：早期三段狀態色及群組外卡聚合色已由目前五段資源卡/列背景取代；測試須以最新五段規格為準。統一周期外層標籤及混合周期內層標籤仍為有效斷言。

### CR-12：保存與重載

1. 使用臨時角色消耗或重置一項資源，檢查 `dnd_skills_db` 值。
2. reload 後重新選取該角色，確認資源 / current / max / cooldown 與重載前相同。
3. 本案例只驗證 localStorage 保存；不要在未備份狀況下用真實角色資料覆寫 fixture。

**歷史判斷**：曾使用 localStorage fixture 與 reload 檢查資源狀態；最新角色結構及 generatedClass metadata 仍需同時保留。

### CR-13：手機與 disabled 對比

1. 設 viewport `390 x 844`，檢查 `document.documentElement.scrollWidth <= window.innerWidth`。
2. 開啟管理 modal，檢查 modal 寬度不超 viewport、內文可捲動、標籤 / 表單 / 按鈕不互相覆蓋。
3. 列舉 disabled button / input / select，檢查文字仍可辨識；可記錄前景 / 背景對比值供人工審閱。
4. 再以一般桌面 viewport 檢查多欄卡片和長名稱換行。

**歷史判斷**：曾以手機模擬 viewport 檢查 modal / 水平溢出，亦曾檢查 disabled 控件樣式；CSS 結構仍在，Stage 5 需以最新版重跑與人工確認。

### CR-14：備份匯入 / 匯出

1. 用臨時角色匯出所有角色，確認 Base64 可解碼且角色、資源和 `generatedClass` 欄位保留。
2. 匯入確認後會以匯入內容取代整個角色資料庫；確認取消匯入時現有資料不變。
3. 測試空字串、無效 Base64/JSON，確認錯誤提示且既有資料不變。
4. 點擊匯出文字區觸發複製；需要安全來源（HTTPS 或 localhost）才能驗證剪貼簿成功，確認 textarea glow 與成功狀態。移除舊版「複製設定」按鈕後不再測該按鈕。

**匯入語意**：目前是整庫取代，不提供逐角色重名覆蓋 / 略過選項；不要將舊版逐筆匯入案例當成預期行為。

### CR-15：鍵盤與人工驗收

1. 鍵盤 Tab 可到達角色選擇、主要動作、modal tab、表單與確認按鈕；focus indicator 清楚。
2. modal 開啟後焦點進入 modal；Tab 不逸出；Escape 關閉；關閉後焦點回到開啟 modal 的按鈕。
3. 螢幕閱讀器 / aria-live 狀態、實際觸控尺寸、真實手機與桌面遊戲流程由使用者人工驗收。

**狀態**：使用者已完成鍵盤及實機人工驗收；瀏覽器 smoke test 僅作為代理自動化證據，不取代該驗收。

## 舊測試改寫 / 淘汰清單

- 首頁「建立 CR」連結、建立專用頁及等待 `cr.html?character=...` 的建立流程：**淘汰**。目前角色建立在 CR 頁面的 `#roleCreateModal`。
- `#resourceCurrentGroup`、新增表單要求目前次數：**淘汰**。目前新增預設全滿；修改才保留原 current。
- `[data-action="add-hit-die-template"]`：**淘汰**。改測累積器、badge、提交與清除。
- 假設所有資源一項一張卡、只查 `.card.resource-low`：**改寫**。多資源會聚合，須同時查 `.resource-row` 及外層 `.card`。
- `window.use` 等全域事件 handler：**淘汰**。目前使用 IIFE / 事件委派，應由 UI 的 `data-action` 操作驗證。
- 直接呼叫 `bootstrap.Modal.show()` 的除錯測試：可用於診斷，但**不能取代**點擊現行入口並等待 modal 真正完成顯示。

#### Stage 5 回歸執行結果（2026-10-14）

- VS Code 整合式瀏覽器經本機 HTTP 載入 CR 頁面；Bootstrap modal 可用，測試期間未記錄到 page errors。測試使用臨時 localStorage fixture，完成後還原為原本的空角色資料庫。
- 功能 smoke tests 通過：角色建立/切換/複製/刪除；資源新增、修改取消、max 低於 current 的警示、消耗、單項重置、刪除；短休恢復；生命骰暫存累積/清除；Base64 匯出/有效匯入/取消匯入/無效輸入拒絕；modal 關閉清空匯入、匯出及角色複製欄位。
- 持久性在 reload 後重新選取角色驗證；360 CSS px 下 document/body 均無水平溢出；五種比例皆套用到資源卡/列背景。匯出文字區成功回饋以整合式瀏覽器剪貼簿 stub 驗證（發光、成功狀態）；未在此 HTTP 測試環境驗證作業系統剪貼簿權限。
- 自動化序列中的個別 Bootstrap hide transition 曾超出等待時間而未回報 `hidden.bs.modal`；刪除資料與不自動選取結果有驗證，modal 實際關閉及鍵盤流程依使用者已完成的人工驗收。
- 資源複製控制項目前未呈現於管理 UI（舊控制項留在註解區）；不將其列為目前使用者可操作的回歸項目。實際手機、桌面鍵盤/輔助科技及遊戲流程由使用者完成人工驗收。

## Stage 5 記錄欄

| 日期 / 版本 | 案例 ID | 結果 | 瀏覽器 / viewport | 備註 |
|---|---|---|---|---|
|  |  |  |  |  |
