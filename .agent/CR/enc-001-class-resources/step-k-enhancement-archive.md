# Step K Enhancement Archive

**封存日期：** 2026-10-22

**程式修正提交：** `c4cafa8` — `fix: complete Step K resource remediation`

**狀態：** Step K 已執行及核銷；本文件已整合現行範圍內全部 216 個 scored case 的定義、標準化輸入、操作、oracle、預期／記錄結果及最終 disposition，可單靠本文執行標準化重測。歷史測試的逐次 browser trace／snapshot 並非全部保存；本文會明確區分歷史 evidence 與新標準化 fixture，不會冒稱兩者完全相同。

本文件是自包含的執行參考：case inventory、fixture manifest、操作順序、expected output、實際記錄、修正結果、 deferred／N/A 範圍及規則來源定位均收錄於本文。歷史報告檔名只作來源 provenance，重測不依賴那些報告；原始報告仍由操作員自行決定何時清理。

## 結果摘要

Step K 對 2014 版 D&D 5e 核准來源範圍中的職業／子職業資源、公式、解鎖門檻、恢復、共享 pool、成本、使用限制及指定多職組合進行驗證與修正。修正前基線為 56 個 FAIL；最新控制表沒有 FAIL：

| 測試集 | 最終結果 |
|---|---|
| K-S001–K-S104：20 級子職業矩陣 | 104 PASS |
| K-B：邊界、公式、成本及 gated definition（53 個 scored IDs） | 52 PASS / 1 N/A |
| K-T：跨目錄 invariants（54 個 current child IDs） | 50 PASS / 1 DEFERRED / 3 N/A |
| K-M001–K-M005：指定多職整合角色 | 5 PASS |
| **合計** | **211 PASS / 1 DEFERRED / 4 N/A；0 FAIL** |

三項 deferred enhancement work items 包含一個整案和兩個 PASS 案例中的 deferred 子項，故控制表的 case-level DEFERRED 數量為一。N/A 為 K-B049、K-T003-11、K-T003-12、K-T004-03。K-T007-08 已由操作員決定 DROPPED，屬範圍外，並不計入以上總數。

## 已完成的 enhancement

### Group 1 — 缺少的資源輸出與解鎖門檻

- 新增 Bard Creation 的 Animating Performance、Cleric Divine Intervention／Knowledge Visions of the Past／Order Embodiment of the Law，以及 Rogue Spell Thief、Unerring Eye、Master Duelist。
- Stroke of Luck 改為 Rogue 職業特性，使用穩定的 Rogue pool key，不再依賴 Thief 子職業。
- 修正 Eldritch Knight 與 Arcane Trickster 的四環法術位解鎖：19 級才出現，並保留原有多職三分之一施法進程。
- 為 Divine Intervention 記錄成功使用後七日鎖定 metadata；應用程式不執行成功事件或日曆倒數。
- 按解鎖等級檢查輸出存在與否，避免過早生成。

### Group 2 — 上限、公式與縮放

- Wails from the Grave 使用 PB 次數，不再按 Rogue 等級的一半計算。
- Bottled Respite 每次長休提供一次免費進入；持續時間另按 2 × PB 小時計算，並在兩種語言顯示。
- Rune Knight 維持五個獨立 Rune pool；Fighter 18 級及以上不新增第六個 Rune。
- 重測 PB、能力調整值（含 minimum 1）、固定次數及骰數／骰面縮放；符合修正後 oracle 的輸出以驗證結案，沒有不必要地修改程式。

### Group 3 — pool identity、來源、共享消耗者與成本

- 為 Bardic Inspiration、Channel Divinity、Wild Shape、Rage、Ki、Superiority Dice、Psi Warrior／Soulknife Psionic Energy Dice 及 Sorcery Points 等建立或修正 canonical shared-pool metadata 與消耗者連結；不因多個能力建立重複 pool。
- 補齊核准範圍內的法術位、Ki、Sorcery Point 及替代成本 metadata，保留正確 pool key、數量、最低法術位環級及免費／付費再用的區別。
- 包括 Drunkard's Luck 的 2 Ki、Wildfire Spirit 的 spell-slot 替代成本、Sorcerer 子職業成本、Creation 最低環級及 TCE 消耗者反向連結。
- 修正 Celestial Healing Light 的子職業來源為 XGE。
- 此組驗證的是成本／關聯 metadata，不宣稱執行了實際能力付款。K-B048 的 paid-action 子項維持 NOT RUN，並在核准的 metadata-only 範圍之外。

### Group 4 — 恢復及重置

- Consult the Spirits 正規化為短休恢復。
- Barbarian 20 Ancestral Guardian UI fixture 驗證消耗後短休恢復至 1/1，再消耗後長休亦恢復至 1/1。

### Group 5 — Soul Trinket 與單次事件恢復的 scope

- Soul Trinkets 按累積資源實作，而非一般休息次數池：從 0 開始、PB 為上限、提供有界的手動 gain/spend 控制，並按規則保留至長休後。
- Phantom 17 的 Death Knell 在長休結束時只於 pool 為空時增加一枚；Soul Trinket 與 Wails from the Grave／Ghost Walk 的 alternative-cost pool key 已驗證。
- K-S079 為 PASS；K-B048 的 Soul Trinket cost metadata 與 pool references 為 PASS。此手動控制不會自動觸發 Reaction 或執行 feature action。
- Tides of Chaos 與 Benign Transposition 維持一格的 Long Rest pool；合資格事件後由使用者按現有 Reset 操作手動恢復。兩者不需要事件偵測、事件模擬或自動恢復功能。K-T003-10 的兩個手動流程均驗證 1/1 → 0/1 → 手動重置 1/1。

## 驗證與報告覆蓋

- 共通子職業 fixture 按單職 20 級、六項能力值 14、PB +6、TCE optional features 關閉執行；比較完整資源輸出，包括 key、owner/source、上限／公式、恢復、cost、gate 及缺漏／多餘資源。
- Tester 1 覆蓋 Artificer、Barbarian、Ranger、Sorcerer；Tester 2 覆蓋 Bard、Cleric、Rogue，並執行 RAW 交叉核對及補充恢復／門檻檢查；Tester 3 覆蓋 Druid、Fighter、Monk；Tester 4 覆蓋 Paladin、Warlock、Wizard。
- K-T 驗證共享 pool、key／顯示分組、恢復、使用閘、成本、重新套用與持久性，以及差異分類；K-M001–K-M005 的五個指定多職角色均 PASS。
- K-B044 最終關閉：Tester 2 的 Group 1 50-profile post-fix matrix 經獨立 audit，另有 16 個 UI threshold fixtures；Tester 4 的 56-profile matrix 覆蓋 26 個 Paladin／Warlock／Wizard gated definitions。均通過。先前記錄的 10 個 profile-level mismatch（3 個 Celestial source、7 個 Genie maximum）已由修正及 retest 清除。
- 一般驗證包含 `node --check src/cr.js`、兩個 locale JSON parse、`git diff --check` 及隔離瀏覽器 UI 檢查。臨時角色及 browser storage 在執行後清理；paid actions 或依賴遊戲事件的行為未被描述為已執行。

## 歷史執行環境與現行重跑基準

### 執行環境與共通步驟

Step K 沒有自動化測試 runner；K-S/K-B/K-T/K-M 以隔離瀏覽器手動操作為主，K-T007 的差異分類另按輸出記錄分類。以下是可用的通用重跑流程，**不是**歷史上每個 case 的逐步操作腳本。過去的測試環境可確認如下：

| 測試批次 | 日期／本機 URL | 臨時角色／storage 證據 | 未記錄資料 |
|---|---|---|---|
| Tester 1：K-S001–012、064–071、081–086 | 2026-10-19；`http://127.0.0.1:41783/cr.html` | `__step-k-tester1-20261019__`；起始 localStorage `{}`，完成後清空並確認角色不存在 | 瀏覽器名稱／版本、完整被測 Git revision、每案操作 trace |
| Tester 2：K-S013–019、020–033、072–080 | 2026-10-19；`http://127.0.0.1:8796/` | `__stepk_tester2_20261019_0025__`；新 origin，讀取套用後持久化 generated-resource records | 瀏覽器名稱／版本、完整被測 Git revision、逐案原始快照 |
| Tester 3：K-S034–055 | 2026-10-19；`http://127.0.0.1:48937/cr.html` | `__step_k_tester3_20261019_0025__`；起始 `dnd_skills_db` 為 null，完成後恢復 storage | 瀏覽器名稱／版本、完整被測 Git revision、各案 recovery 操作的原始快照 |
| Tester 4：K-S056–063、087–104 | 2026-10-19；`http://127.0.0.1:8769/cr.html` | `K-T4-Runtime-20261019-0025`；localStorage 起始空白，完成後清空 | 瀏覽器名稱／版本、完整被測 Git revision、可長期取得的執行 log |
| K-B044／K-T003-10 follow-up | 2026-10-22；隔離本機 origin | 記錄 50+16、56 個 gate profiles 及兩個手動 Reset fixtures；臨時角色及 localStorage/sessionStorage 清除 | 完整逐 profile 輸入、browser build、storage raw dump、歷史 screenshots |

`c4cafa8` 是 Step K 修正提交，不足以證明所有 2026-10-19／22 retest 均在該精確 revision 執行。各記錄沒有統一保存瀏覽器 user-agent／版本或逐 run 的完整 Git SHA。Tester 3 有記錄 storage key `dnd_skills_db`；其他批次只描述讀取 persisted generated-resource records 或清理 storage，故本封存不能指定適用於所有批次的固定 JSON 路徑或 parser。

1. 開啟本機應用程式，建立隔離測試角色／乾淨 browser storage；保存既有資料快照，禁止在正式角色上試驗。
2. 按下列 fixture 輸入職業等級、子職業、能力值、選項及必要的測試狀態；套用／確認職業等級後讀取資源卡及持久化資料。
3. 逐 pool 比較規則預期與實際值：存在／缺席、canonical key、顯示名、owner/source、current/max／公式、骰數／骰面、cooldown／恢復、解鎖 gate、成本數量／最低法術位環級、共享消耗者與重複 pool。
4. 僅在 case 要求時使用、手動增加／扣減、短休、長休、重新套用、重新載入或切換語言；記錄操作前後值。測試只驗證有明確寫入的行為，不推定已執行戰鬥事件、paid action 或自動事件偵測。
5. 清除臨時角色及測試 storage，恢復快照；保存 fixture、實際結果、case ID、PASS／FAIL／N/A／DEFERRED 及證據日期。

規則預期採用 2014 D&D 5e 核准來源：PHB、DMG、XGE、SCAG、TCE、FToD、BGG。能力值預設為 STR/DEX/CON/INT/WIS/CHA 各 14；規則上限需要最低 1 時明確使用 `max(1, modifier)`。現存封存沒有為每個 resource assertion 保留精確書籍頁碼／段落；來源縮寫及 feature 名稱只足以定位規則類別，仍需讀者按相應版本核對。狀態定義：PASS = 範圍內 assertion 全部符合；N/A = 完成掃描但沒有適用項；DEFERRED = 已明確保留為未實作／未驗證；NOT RUN = 不在批准測試範圍；DROPPED = 操作員移出範圍，不能計入測試總數。

### K-S001–K-S104：單職 20 級子職業矩陣

每一列代表一個獨立 fixture：該職業 20 級、對應子職業、六項能力值 14、PB +6、TCE optional features 關閉；比較完整資源清單及所有上述欄位。除下表明列的子項外，104 個 case 均 PASS。

| Case IDs | 職業及子職業（括號為核准來源） | 結果／特別 assertion |
|---|---|---|
| K-S001–004 | Artificer：Alchemist、Armorer、Artillerist、Battle Smith（全 TCE） | 全 PASS |
| K-S005–012 | Barbarian：Berserker、Totem Warrior（PHB）；Ancestral Guardian、Storm Herald、Zealot（XGE）；Beast、Wild Magic（TCE）；Path of the Giant（BGG） | 全 PASS；S007 Consult the Spirits 短休恢復重測 PASS |
| K-S013–019 | Bard：Lore、Valor（PHB）；Glamour、Swords、Whispers（XGE）；Creation、Eloquence（TCE） | 全 PASS；S018 Animating Performance 與 slot cost／minimum gate 已核實 |
| K-S020–033 | Cleric：Knowledge、Life、Light、Nature、Tempest、Trickery、War（PHB）；Death（DMG）；Arcana（SCAG）；Forge、Grave（XGE）；Order、Peace、Twilight（TCE） | 全 PASS；輸出及 subclass unlock 已核實 |
| K-S034–039 | Druid：Land、Moon（PHB）；Dreams、Shepherd（XGE）；Stars、Wildfire（TCE） | 全 PASS；S039 pool／cost／consumer 重測 PASS |
| K-S040–047 | Fighter：Champion、Battle Master、Eldritch Knight（PHB）；Arcane Archer、Cavalier、Samurai（XGE）；Rune Knight、Psi Warrior（TCE） | 全 PASS；Rune Knight 五個 Rune pool；S042 spell-slot progression PASS |
| K-S048–055 | Monk：Four Elements、Open Hand、Shadow（PHB）；Drunken Master、Kensei（XGE）；Astral Self、Mercy（TCE）；Ascendant Dragon（FToD） | 全 PASS；S051 Drunkard's Luck 花費共用 Ki 2 點、沒有 duplicate pool |
| K-S056–063 | Paladin：Ancients、Devotion、Vengeance（PHB）；Oathbreaker（DMG）；Conquest、Redemption（XGE）；Glory、Watchers（TCE） | 全 PASS |
| K-S064–071 | Ranger：Beast Master、Hunter（PHB）；Gloom Stalker、Horizon Walker、Monster Slayer（XGE）；Fey Wanderer、Swarmkeeper（TCE）；Drakewarden（FToD） | 全 PASS；Fey Wanderer free／paid-use metadata 已核實 |
| K-S072–080 | Rogue：Thief、Assassin、Arcane Trickster（PHB）；Inquisitive、Mastermind、Scout、Swashbuckler（XGE）；Phantom、Soulknife（TCE） | 全 PASS；S074 spell slots、S079 Soul Trinket/Wails、S072–080 職業 feature／unlock 已核實 |
| K-S081–086 | Sorcerer：Draconic Bloodline、Wild Magic（PHB）；Divine Soul、Shadow Magic（XGE）；Aberrant Mind、Clockwork Soul（TCE） | 全 PASS；S084–086 cost／consumer 重測 PASS |
| K-S087–093 | Warlock：Archfey、Fiend、Great Old One（PHB）；Hexblade、Celestial（XGE）；Fathomless、Genie（TCE） | 全 PASS；S091 Healing Light source=XGE；S093 Bottled Respite 1/LR、2×PB 小時 |
| K-S094–104 | Wizard：Abjuration、Conjuration、Divination、Enchantment、Evocation、Illusion、Necromancy、Transmutation（PHB）；War Magic（XGE）；Bladesinging、Order of Scribes（TCE） | 全 PASS；S094 Arcane Ward 累積 HP 子項 DEFERRED；S102 Power Surge event accumulation 不屬已通過 runtime assertion |

### K-B001–K-B050：邊界、公式、成本及 gated definition

所有未特別註明項目 PASS；K-B049 為 N/A。B040 的四個 slices 計為 53 個 scored units 中的拆分單位。

| Case IDs | 測試定義及可重跑 fixture |
|---|---|
| K-B001–013 | 逐職業 subclass-selection boundary：在子職業解鎖前一級與解鎖級各套用一次；核對選擇器啟用／必填、級別或職業改變後的清除／重選，以及不提前輸出 gated pool。職業順序／解鎖級：Artificer 3、Barbarian 3、Bard 3、Cleric 1、Druid 2、Fighter 3、Monk 3、Paladin 3、Ranger 3、Rogue 3、Sorcerer 1、Warlock 1、Wizard 2。 |
| K-B014–023 | TCE 選項開關／解鎖測試：Cleric Harness Divine Power (2)、Druid Wild Companion (2)、Monk Quickened Healing (2)／Focused Aim (2)、Paladin Harness Divine Power (3)、Ranger Favored Foe (1)／Primal Awareness (3)／Nature's Veil (10)、Sorcerer Magical Guidance (5)／Sorcerous Restoration (20)。每案在開／關及低於／達到解鎖級檢查 pool 有無及上限。 |
| K-B024 | 六項能力分數 STR/DEX/CON/INT/WIS/CHA 各輸入 1、10、20、30；另將 CHA 留空。輸入 1/10/20/30 均接受；Paladin Divine Sense CHA formula 預期 max 1/1/6/11（modifier+1, minimum 1）；空白 CHA 顯示本地化必填錯誤。UI 輸入範圍為 1–30；本案未記錄測試 0 或 31。 |
| K-B025 | 單職 Ranger Beast Master，Favored Foe ON；總角色等級 1/4/5/8/9/12/13/16/17/20；PB 預期 2/2/3/3/4/4/5/5/6/6，pool max 須逐點符合。 |
| K-B026–039 | 14 個公式／子公式分支的歷史結果與標準化重跑 fixture 已列於「K-B026–039 formula fixture manifest」；逐案 key、輸入、公式邊界和 expected output 均可直接執行。 |
| K-B040-01–04 | 固定次數上限四個獨立切片：-01 Artificer/Barbarian/Ranger/Sorcerer、-02 Bard/Cleric/Rogue、-03 Druid/Fighter/Monk、-04 Paladin/Warlock/Wizard。各用對應 K-S L20 profile 核對固定 pool 數量；-02 同時重查缺失輸出，-03 Rune Knight 上限為五、Fighter 18 不增第六枚，-04 Bottled Respite 免費次數 1/LR。父項不另計分。 |
| K-B041–043 | 跨職業公式矩陣：-041 PB 上限與總角色等級 PB（包括 Wails）；-042 ability modifier／minimum 1 及缺失 ability-based output；-043 level-tier 邊界（包括 Rune Knight 五枚上限）。 |
| K-B044 | gated definitions 的 subclass level、owner、source、maximum、recovery profile matrix；最後以 Tester 2 50-profile + 16 UI threshold fixtures、Tester 4 56 profiles／26 definitions 全部重跑，PASS。Warlock level 0 control 用 Fighter 1 作合法 anchor，Warlock subclass-gated output 必須缺席。 |
| K-B045–046 | 恢復／骰數與使用次數縮放；對照短休／長休恢復 metadata，以及 PB／能力／級別導出的骰子、數量與面值。 |
| K-B047 | canonical shared-pool identity／consumer crosswalk：所有共享消耗者應指向單一 pool，不可重複建立或遺漏 consumer。 |
| K-B048 | cost matrix：核對 pool key、消耗數量、最低法術位環級、替代成本及免費／付費再用 metadata。metadata PASS；實際 paid-action 執行 NOT RUN，且非本範圍。 |
| K-B049 | recovery-only／recovery-target 定義與適用 pool 全目錄掃描；全範圍沒有適用定義，故 N/A。 |
| K-B050 | TCE optional-feature gate／source／level 開關矩陣；比較關閉、開啟及解鎖前後輸出。 |

### K-T001–K-T007：共用 pool 及持久化 invariant

| Case IDs | 測試定義 | 結果 |
|---|---|---|
| K-T001-01–11 | 各類共享資源池／消耗者映射：逐一確認 canonical pool key、owner、shared 狀態、consumer 完整、沒有重複池。Group 3 指定 -01–10 已逐項 retest。 | PASS |
| K-T002-01–06 | pool key 與顯示名稱分離；卡片分組或本地化不能改變資源身份，或把不同 pool 合併。 | PASS |
| K-T003-01–10 | 每種 recovery metadata／手動使用流程：消耗前後、短休、長休、reset gate；-03 Power Surge 整案 DEFERRED；-10 Tides of Chaos、Benign Transposition 手動 Reset 子項 PASS，Power Surge 子項 DEFERRED。 | 除 -03 外 PASS；-03 DEFERRED |
| K-T003-11 | 全目錄掃描 `recoveryOnly`。 | N/A：零適用 row |
| K-T003-12 | 全目錄掃描 `longRestRecoveryWhenEmpty`。 | N/A：零適用 row |
| K-T004-01–09 | 能力解鎖 gate 與消耗成本：解鎖前後有無、正確 pool、費用數量／slot minimum、替代付款引用；-03 無 scoped definition。 | -03 N/A；其餘 PASS |
| K-T005-01–04 | 重新套用／重算職業資源：保留正確消耗值，不生成 duplicate，不丟失手動資源。 | PASS |
| K-T006-01–03 | 本地化 key、持久化、角色間隔離及重新載入後資料完整性。 | PASS |
| K-T007-01–07、09–10 | 將差異分類為缺失／多餘／錯誤公式／gate／source／recovery／cost／identity 等並核對報告 disposition。 | PASS；K-T007-08 DROPPED，不計入總數 |

### K-M001–K-M005：指定多職 fixture

| Case | Fixture 與必查項 | 結果 |
|---|---|---|
| K-M001 | Fighter 5 Battle Master / Ranger 5 Gloom Stalker / Rogue 5 Arcane Trickster；總級 15、PB +5、Favored Foe 開；class-level pool、PB、法術位、pool key 不碰撞。 | PASS |
| K-M002 | Sorcerer 10 Clockwork Soul / Warlock 10 Genie；總級 20、PB +6；class-level resources、Pact Magic、Mystic Arcanum boundary、多職法術位。 | PASS |
| K-M003 | Bard 10 Eloquence / Paladin 10 Watchers、CHA 16；Bardic Inspiration 次數／恢復、Paladin pool、一個 Channel Divinity pool、總級 PB。 | PASS |
| K-M004 | Wizard 10 Order of Scribes / Artificer 10 Battle Smith、INT 16；施法者法術位、class-level pool、INT formula、Arcane Jolt gate、pool identity。 | PASS |
| K-M005 | Cleric 1 Arcana / Fighter 19 Champion；總級 20、PB +6；Cleric 1 subclass、不可提前出現 Channel Divinity、class-level pool、PB、多職法術位。 | PASS |

## 修正控制與驗收證據總表

下表集中保留各修正組的範圍、測試證據與最終 disposition，作為原 fix-control matrix 的封存替代。

| 組別 | Cases | 修正／測試方法 | 最終結果 |
|---|---|---|---|
| Group 1：缺輸出／解鎖 gate | K-S018、K-S020–033、K-S042、K-S072–080；K-B040-02、K-B044 | 驗證 Bard Creation、Cleric Knowledge/Order、Rogue class／subclass features；EK Fighter 18/19/20 與 Arcane Trickster Rogue 18/19/20 法術位 progression，19 級才有四環 slot；確認低於 feature gate 時無 pool。Divine Intervention 成功後 7 日鎖定只記 metadata，不執行事件／倒數。 | 受影響 case PASS；無新事件 runtime。 |
| Group 2：上限／公式／縮放 | K-S046、K-S079、K-S093；K-B040-02/-04、K-B041/-042/-046 | Rune Knight Fighter 3/7/10/15/18/20 應為 2/3/4/5/5/5 Rune pools；Genie Warlock 1–20 的 Bottled Respite 為 1/LR、時間 4/6/8/10/12 小時（PB 2–6）；Phantom Rogue 3/4/5/8/9/12/13/16/17/20 的 PB 上限 2/2/3/3/4/4/5/5/6/6；K-S079 Wails uses = PB；公式邊界同時覆蓋 ability/PB/class-level。 | 全部 PASS；Rune 上限為五，未加第六個。 |
| Group 3：identity／source／consumer／cost | K-S018、K-S039、K-S051、K-S072–078、K-S080、K-S084–086、K-S091；K-B047/-048；K-T001-01–10、K-T004-05/-06 | 對共享資源逐 pool 核對 key、owner、shared、consumer 及無 duplicate；成本核對 pool、數量、最低 slot level、alternative/free use。包括 Drunkard's Luck 2 Ki、Wildfire Spirit 替代法術位、Sorcerer 子職業 costs、Creation 最低 slot level、Celestial Healing Light source=XGE。 | metadata PASS；K-B048 paid action NOT RUN（範圍外）。 |
| Group 4：恢復 | K-S007；另將 Power Surge reset 移出本組 | Ancestral Guardian L20 Consult the Spirits 消耗後 Short Rest 回 1/1，再消耗後 Long Rest 回 1/1；恢復 metadata 為 Short Rest。 | K-S007 PASS；Power Surge 留待累積型 enhancement。 |
| Group 5：累積／事件資源 | K-S079 Soul Trinket；K-S094 Arcane Ward；K-S102 Power Surge metadata；K-T003-03、K-T003-10 | Soul Trinket 卡片 0 起始、PB 上限、有界手動 gain/spend、長休保留、Phantom 17 空池長休後 +1、Wails/Ghost Walk 替代成本；Tides/Benign 只驗手動 Reset。Arcane Ward HP 與 Power Surge lifecycle 不按普通 recovery pool 處理。 | Soul Trinket K-S079 PASS、K-B048 metadata PASS；Arcane Ward 子項、K-T003-03、K-T003-10 Power Surge 子項 DEFERRED；Tides/Benign 手動 Reset PASS。 |
| K-B044 關閉 | K-B044 | Tester 2：50 profile post-fix + 16 UI threshold；Tester 4：56 profile、26 個 Paladin/Warlock/Wizard gated definitions；含 source、owner、maximum、recovery 及 level-zero control。 | 全 PASS；原 10 個 mismatch（Celestial source 3、Genie maximum 7）清除。 |

### 主要手動 Reset 重跑資料（K-T003-10）

Tides of Chaos 與 Benign Transposition 分別以單格 pool 驗證：初值 1/1 → 按既有 Reset 消耗至 0/1 → 合資格事件後由使用者手動 Reset 回 1/1。沒有模擬或自動套用合資格事件；Power Surge 不在這兩個手動 case 的 PASS 範圍內。臨時角色刪除，localStorage/sessionStorage 清除；沒有程式修改。

## Reviewer 完整性要求對照

| 評估項目 | 本文交付內容 | 明確限制 |
|---|---|---|
| K-S001–104 | 每個 case 均列職業／子職業、共通或特別輸入、逐資源 expected、首次 actual 及 final disposition；K-S001–104 case log 內嵌。 | 首次歷史值不等同修正後 storage snapshot；final PASS 以本文件修正組的 assertion／重測說明為準。 |
| K-B001–050 | K-B001–013 valid subclass / level manifest、K-B024／025 輸入值、K-B026–039 formula manifest、K-B040–050 每類定義／輸出及 K-B044 threshold profiles 均在本文。 | 原 run 的部分瀏覽器 character IDs 未保存；按本文標準化 label 重建即可比較輸出。 |
| K-B044 profiles | Tester 2 50 profiles 現以 R2-01-B/A 至 R2-25-B/A 逐 pair 明列；16 focused fixtures 已列 feature／before／at；Tester 4 F001–F170 inputs 全列，K-B044 tag 有 56 個。 | R2 labels 是新標準化 IDs，不冒稱為歷史 IDs；歷史 50 個 character IDs 缺失不影響按同一 gate／oracle 重跑。 |
| K-T001–007 | 54 個 scored child case 的 fixture／scenario／status 表、crosswalk、K-T003 operation oracle、T004 costs/gates、T005–006 persistence／locale steps 及 T007 report specimens 均內嵌。 | Paid-action payment、戰鬥事件模擬及三個 deferred/N/A assertion 明確不執行。 |
| K-M001–005 | 每個角色輸入、PB、資源／slot expected、首次 actual 及 final status 明列。 | 歷史 raw DB dump 未保存；standard replay 按明列 inputs 比較。 |
| 執行／環境 | 有 local HTTP 啟動方式、browser/version／commit 記錄要求、UI sequence、storage key backup／restore、console data path、操作及 cleanup。 | 歷史 browser build 與每次 run SHA 未統一保存；新 run 必須記錄，不能倒推歷史環境。 |
| 規則 oracle | 全部 case 具名 feature、source abbreviation、公式／門檻／恢復／cost；出版物全名及 class/feature locator 在「規則 oracle 索引」。 | 不提供未核實頁碼，不複製規則書原文；讀者需依具名書籍與 feature 標題核對原書。 |
| 原始證據 | 首次 actual、修正後 assertion、status、測試方法與 cleanup 摘要保存在本文。 | 歷史 screenshots、部分 raw storage、完整 browser logs 不在本文；這只限制 forensic replay，不限制標準化 case rerun。 |

**結論：** 本文已達成「測試者只靠本文，能逐案按固定 fixture 執行並比較 expected／actual」的標準。它不宣稱可還原歷史 tester 的每次 click、browser build 或 raw snapshot；該歷史 provenance 缺口已與現行可重跑 case reference 分開說明。

## 新 enhancement scope — 三項 deferred tests

以下三項從 Step K 既有 deferred dispositions 抽出，構成後續設計、實作和驗收範圍。它們不改變 Step K 的已核銷狀態；實作前先凍結同一個累積資源模型，再逐一保留三個 case ID 的驗收證據。

| 原測試 ID | 延後的範圍 | 新 enhancement 的驗收條件 |
|---|---|---|
| **K-S094 — Arcane Ward 子項** | K-S094 的 Abjuration subclass-output assertion 已 PASS；Ward HP buffer／累積恢復行為 DEFERRED。 | 設計獨立 HP-buffer 模型：最大 HP = 2 × Wizard level + INT modifier；長休後首次施放合資格的 1 環或以上 Abjuration 法術時啟動並設為最大值；受到傷害時扣減 HP；施放 1 環或以上 Abjuration 法術時回復 2 × 法術環級 HP、不得超過上限；長休結束 Ward 消失，不自動補滿或重建。不得把它當一般 rest-reset resource。 |
| **K-T003-03 — Power Surge rest reset** | 整案 DEFERRED；不得只修 isolated reset 而略過 event gain／spend lifecycle。 | 以 INT modifier（minimum 1）為上限；長休結束設為 1；短休結束時若為 0 則補至 1，若非 0 則保持原值。整合 event gain、上限及消耗後再驗證兩種休息狀態。 |
| **K-T003-10 — Power Surge 累積子項** | Tides of Chaos 與 Benign Transposition 的手動 reset assertion 已 PASS；Power Surge 子項仍 DEFERRED。 | 成功的 Dispel Magic／Counterspell 終止法術時增加一枚 surge；不可超過 INT modifier 上限；Wizard spell 每回合造成傷害時可消耗一枚以強化傷害；整合測試消耗、事件增加、滿池上限、長休設為 1、短休空池補 1、短休非空池不變。Arcane Deflection 不列作 surge 觸發條件。 |

### Scope 邊界與驗收原則

- K-T003-03 與 K-T003-10 是同一 Power Surge lifecycle 的互補測試：實作可共用，但報告必須分別證明 reset 行為與事件 gain／spend 行為。
- Tides of Chaos 和 Benign Transposition 是上限為 1 的事件恢復，不屬可累積 charge；仍由使用者在事件後手動 Reset。此次 enhancement 不加入自動事件監聽或戰鬥／initiative 控制。
- 不把已完成的 Soul Trinket 重新列入 deferred scope；不把 K-B048 的 paid-action NOT RUN 擴成此 enhancement 的自動付款執行要求。
- 先獨立核對規則 oracle、資料 schema、增減來源及持久化，再實作；完成各子項後更新中央控制表並在隔離 profile 驗證，不得將 metadata-only 證據當作 runtime 行為通過。

## 封存完整性與範圍限制

- 本文件內含現行 scope 的 216 個 scored case：104 K-S、53 K-B、54 K-T child cases、5 K-M；K-T007-08 已 DROPPED，不計入總數。每案均有明確 fixture／操作／oracle／結果，或明確指出 N/A、DEFERRED、NOT RUN 的界線。
- 新測試者按本文「歷史執行環境與現行重跑基準」及「標準化逐案重跑手冊」執行；新重跑使用本文固定 fixture manifest，不代表歷史 run 的 browser/build/snapshot 已完整保留。
- 本文只摘要引用 2014 版核准書籍的章節／feature 名稱及 oracle，不複製規則書原文。來源書名縮寫在「規則 oracle 索引」展開；個案表中的 feature、來源版本及明確數值共同構成可核對定位。
- 歷史 screenshots、部分 raw storage、browser logs 及每次 run 的精確 Git SHA 未完整封存；這限制歷史操作的 forensic replay，但不阻止按本文所列標準化 fixture 重新執行及比較。
- K-B048 付款執行 NOT RUN、K-T007-08 DROPPED、三項 deferred enhancement、四項 N/A 原因及 0 FAIL 均明確列出；不得把未跑、移除或延後 assertion 計作 PASS。

## 逐案 K-S oracle 與歷史輸出（Case logs）

共通輸入依上文 K-S contract：單職 L20、STR/DEX/CON/INT/WIS/CHA 14、PB +6、TCE optional features 關閉；子職業按列名。下表合併四份 tester case log 的規則預期與首次記錄 actual，並以最終控制表補上 current disposition。`Initial status`／`Recorded actual` 保留首次執行歷史；修正後重測由上方 Group 1–5／K-B044 結案證據界定，首次 FAIL 不代表現行 FAIL。

| ID | Fixture | 2014 oracle expected | First recorded actual | Initial / current status |
|---|---|---|---|---|
| K-S001 | Artificer — Alchemist | Experimental Elixir: one free creation per LR; extra creation costs a spell slot. Restorative Reagents: INT modifier (minimum 1) free Lesser Restoration casts per LR. Shared Artificer pools: Flash of Genius INT (minimum 1), Spell-Storing Item twice INT (minimum 2), both LR. Level-20 d8 hit dice x20 and Artificer slot table (levels 1–5: 4/3/3/3/2). | Runtime generated exactly 10 rows: `class:hit-dice:d8` 20/20; `class:spell-slot:1..5` 4/4, 3/3, 3/3, 3/3, 2/2; `class:artificer:flash-of-genius` 2/2 (`ability,int,min1`, LR); `class:artificer:spell-storing-item` 4/4 (`ability-times,2,int,min2`, LR); `subclass:artificer:alchemist:experimental-elixir` 1/1 (TCE/TCE, LR, extra spell-slot cost); `subclass:artificer:alchemist:restorative-reagents` 2/2 (TCE/TCE, `ability,int,min1`, LR). All current values equal max; TCE selection list empty. After consuming 11/20 d8 hit dice, a long rest restored 10 to current 19/20, confirming the required partial recovery behavior. | PASS; PASS |
| K-S002 | Artificer — Armorer | Defensive Field: PB uses per LR. Shared Artificer pools: Flash of Genius INT (minimum 1), Spell-Storing Item twice INT (minimum 2), both LR. Level-20 d8 hit dice x20 and Artificer slot table (levels 1–5: 4/3/3/3/2). | Runtime generated exactly 9 rows: hit dice 20/20; slots 4/4, 3/3, 3/3, 3/3, 2/2; Flash of Genius 2/2; Spell-Storing Item 4/4; `subclass:artificer:armorer:defensive-field` 6/6, LR, formula `pb`, source TCE/TCE. No duplicate pool keys, no optional TCE selections, no missing or unexpected resource rows. | PASS; PASS |
| K-S003 | Artificer — Artillerist | Eldritch Cannon: one free creation per LR; extra creation costs a spell slot; concurrent limit becomes two at level 15. Shared Artificer pools: Flash of Genius INT (minimum 1), Spell-Storing Item twice INT (minimum 2), both LR. Level-20 d8 hit dice x20 and Artificer slot table (levels 1–5: 4/3/3/3/2). | Runtime generated exactly 9 rows: hit dice 20/20; slots 4/4, 3/3, 3/3, 3/3, 2/2; Flash of Genius 2/2; Spell-Storing Item 4/4; `subclass:artificer:artillerist:eldritch-cannon` 1/1, LR, formula `fixed 1`, TCE/TCE, spell-slot additional-use cost, concurrent tiers `[[3,1],[15,2]]`. Config was Artificer 20 / Artillerist, all abilities 14, TCE optional selections empty; no duplicate keys, missing or unexpected rows. | PASS; PASS |
| K-S004 | Artificer — Battle Smith | Arcane Jolt: INT modifier uses per LR; at most once per turn. Shared Artificer pools: Flash of Genius INT (minimum 1), Spell-Storing Item twice INT (minimum 2), both LR. Level-20 d8 hit dice x20 and Artificer slot table (levels 1–5: 4/3/3/3/2). | Runtime generated exactly 9 rows: hit dice 20/20; slots 4/4, 3/3, 3/3, 3/3, 2/2; Flash of Genius 2/2; Spell-Storing Item 4/4; `subclass:artificer:battle-smith:arcane-jolt` 2/2, LR, formula `ability int min 1`, source TCE/TCE, `once-per-turn` gate. Config was Artificer 20 / Battle Smith, all abilities 14, TCE optional selections empty; no duplicate keys, missing or unexpected rows. | PASS; PASS |
| K-S005 | Barbarian — Berserker | No separate Frenzy pool; level-20 Rage has no finite use limit. Level-20 d12 hit dice x20; no spell slots. | Runtime generated only `class:hit-dice:d12` 20/20 (LR); no Rage pool and no Berserker pool. Config Barbarian 20 / Berserker, all abilities 14, TCE optional selections empty; no duplicate keys or unexpected rows. | PASS; PASS |
| K-S006 | Barbarian — Totem Warrior | No subclass finite pool identified in the recovery reference; level-20 Rage is unlimited. Level-20 d12 hit dice x20; no spell slots. | Runtime generated only `class:hit-dice:d12` 20/20 (LR); no Rage or Totem Warrior pool. Config Barbarian 20 / Totem Warrior, all abilities 14, TCE optional selections empty; no duplicate keys or unexpected rows. | PASS; PASS |
| K-S007 | Barbarian — Ancestral Guardian | Consult the Spirits: one use; the initial recorded oracle was LR; final audited oracle is Short Rest or Long Rest, normalized to Short Rest for this resource tracker. No separate Rage pool at level 20. Level-20 d12 hit dice x20; no spell slots. | Runtime generated `class:hit-dice:d12` 20/20 and `subclass:barbarian:ancestral-guardian:consult-the-spirits` 1/1, fixed 1, LR, source XGE/XGE; no Rage pool. Config Barbarian 20 / Ancestral Guardian, all abilities 14, TCE optional selections empty; no duplicate keys or unexpected resource rows versus the current oracle. The attempted official XGtE source page redirected to its marketplace/marketing page without the feature text, so the LR expectation could not be independently resolved. | BLOCKED; PASS — Consult the Spirits uses the accepted Short Rest representation; Short and Long Rest reset rechecked |
| K-S008 | Barbarian — Storm Herald | Storm Aura has no independent daily pool; level-20 Rage is unlimited. Level-20 d12 hit dice x20; no spell slots. | Runtime generated only `class:hit-dice:d12` 20/20 (LR); no Rage or Storm Herald pool. Config Barbarian 20 / Storm Herald, all abilities 14, TCE optional selections empty; no duplicate keys or unexpected rows. | PASS; PASS |
| K-S009 | Barbarian — Zealot | Fanatical Focus is tied to Rage, not a separate pool; level-20 Rage is unlimited. Level-20 d12 hit dice x20; no spell slots. | Runtime generated only `class:hit-dice:d12` 20/20 (LR); no Rage or Zealot pool. Config Barbarian 20 / Zealot, all abilities 14, optional TCE features empty; no duplicate keys or unexpected rows. | PASS; PASS |
| K-S010 | Barbarian — Beast | Beast forms are available during Rage; no independent form-use pool. Level-20 Rage is unlimited. Level-20 d12 hit dice x20; no spell slots. | Runtime generated only `class:hit-dice:d12` 20/20 (LR); no Rage or Beast pool. Config Barbarian 20 / Beast, all abilities 14, optional TCE features empty; no duplicate keys or unexpected rows. | PASS; PASS |
| K-S011 | Barbarian — Wild Magic | Bolstering Magic: PB uses per LR; Wild Surge does not create another stable pool. Level-20 Rage is unlimited. Level-20 d12 hit dice x20; no spell slots. | Runtime generated exactly `class:hit-dice:d12` 20/20 and `subclass:barbarian:wild-magic:bolstering-magic` 6/6, LR, formula `pb`, source TCE/TCE; no Rage pool. Config Barbarian 20 / Wild Magic, all abilities 14, optional TCE features empty; no duplicate keys or missing/unexpected rows. | PASS; PASS |
| K-S012 | Barbarian — Path of the Giant | Giant-path features use Rage, turns, actions, or duration; no subclass pool. Level-20 Rage is unlimited. Level-20 d12 hit dice x20; no spell slots. | Runtime generated only `class:hit-dice:d12` 20/20 (LR); no Rage or Giant pool. Config Barbarian 20 / Path of the Giant, all abilities 14, optional TCE features empty; no duplicate keys or unexpected rows. | PASS; PASS |
| K-S013 | Bard — Lore | Common Bard pools; Cutting Words shares Bardic Inspiration; no extra subclass pool. | Common hit dice, slots and one `class:bard:bardic-inspiration` 2/2, CHA formula, short-rest recovery, initiative-empty +1; no Lore-specific pool. | **PASS**; PASS |
| K-S014 | Bard — Valor | Common Bard pools; Combat Inspiration shares Bardic Inspiration; no extra subclass pool. | Same common set as K-S013; no Valor-specific pool. | **PASS**; PASS |
| K-S015 | Bard — Glamour | Common Bard pools; Enthralling Performance 1/SR-or-LR, Mantle of Majesty 1/LR, Unbreakable Majesty 1/SR-or-LR. | Common set plus `subclass:bard:glamour:enthralling-performance` 1/1 short, `...:mantle-of-majesty` 1/1 long, `...:unbreakable-majesty` 1/1 short; all source XGE. | **PASS**; PASS |
| K-S016 | Bard — Swords | Common Bard pools; Blade Flourish shares Bardic Inspiration; no extra pool. | Common set only; one Bardic Inspiration pool. | **PASS**; PASS |
| K-S017 | Bard — Whispers | Common Bard pools; Words of Terror and Mantle of Whispers 1/SR-or-LR each; Shadow Lore 1/LR; Psychic Blades shares Bardic Inspiration. | Common set plus `subclass:bard:whispers:words-of-terror` 1/1 short, `...:mantle-of-whispers` 1/1 short, `...:shadow-lore` 1/1 long; source XGE. | **PASS**; PASS |
| K-S018 | Bard — Creation | Common Bard pools; Performance of Creation 1/LR free use, extra use costs a spell slot; animated-object duration is not a separate pool. | Common set plus `subclass:bard:creation:performance-of-creation` 1/1 long, TCE, additional-use spell-slot cost. | **PASS**; PASS — 2nd-level and 3rd-level slot minima rechecked |
| K-S019 | Bard — Eloquence | Common Bard pools; Universal Speech 1/LR; Infectious Inspiration CHA modifier (2) / LR; Unsettling Words shares Bardic Inspiration. | Common set plus `subclass:bard:eloquence:universal-speech` 1/1 long and `...:infectious-inspiration` 2/2 long, both TCE. | **PASS**; PASS |
| K-S020 | Cleric — Knowledge | Common Cleric pools plus Divine Intervention (7-day lockout after success) and Visions of the Past 1/SR-or-LR. Domain Channel Divinity options use the shared Channel Divinity pool. | Common hit dice, full-caster slots, one `class:cleric:channel-divinity` 3/3 short. Recorded diff: Missing Divine Intervention and Visions of the Past; no unexpected output. | **FAIL**; PASS |
| K-S021 | Cleric — Life | Common Cleric pools plus Divine Intervention, success lockout 7 days. Preserve Life spends shared Channel Divinity. | Common hit dice, slots and one Channel Divinity 3/3 short. Recorded diff: Missing Divine Intervention pool/lockout; no unexpected output. | **FAIL**; PASS |
| K-S022 | Cleric — Light | Common Cleric pools; Warding Flare WIS modifier (2, minimum 1) / LR; Divine Intervention with 7-day success lockout. Corona of Light has no limited-use recovery stated in the PHB text, so it is not an additional rest pool. | Common pools plus `subclass:cleric:light:warding-flare` 2/2 long, formula WIS modifier, source PHB. Recorded diff: Missing Divine Intervention; no unexpected output. | **FAIL**; PASS |
| K-S023 | Cleric — Nature | Common Cleric pools plus Divine Intervention, success lockout 7 days. Nature’s Channel Divinity uses the shared pool. | Common hit dice, slots and one Channel Divinity 3/3 short. Recorded diff: Missing Divine Intervention pool/lockout; no unexpected output. | **FAIL**; PASS |
| K-S024 | Cleric — Tempest | Common Cleric pools; Wrath of the Storm WIS modifier (2, minimum 1) / LR; Divine Intervention with 7-day success lockout. | Common pools plus `subclass:cleric:tempest:wrath-of-the-storm` 2/2 long, formula WIS modifier, source PHB. Recorded diff: Missing Divine Intervention pool/lockout; no unexpected output. | **FAIL**; PASS |
| K-S025 | Cleric — Trickery | Common Cleric pools plus Divine Intervention, success lockout 7 days. Invoke Duplicity uses shared Channel Divinity. | Common hit dice, slots and one Channel Divinity 3/3 short. Recorded diff: Missing Divine Intervention pool/lockout; no unexpected output. | **FAIL**; PASS |
| K-S026 | Cleric — War | Common Cleric pools; War Priest WIS modifier (2, minimum 1) / LR; Divine Intervention with 7-day success lockout. | Common pools plus `subclass:cleric:war:war-priest` 2/2 long, formula WIS modifier, source PHB. Recorded diff: Missing Divine Intervention pool/lockout; no unexpected output. | **FAIL**; PASS |
| K-S027 | Cleric — Death | Common Cleric pools plus Divine Intervention, success lockout 7 days. Touch of Death uses shared Channel Divinity. | Common hit dice, slots and one Channel Divinity 3/3 short. Recorded diff: Missing Divine Intervention pool/lockout; no unexpected output. | **FAIL**; PASS |
| K-S028 | Cleric — Arcana | Common Cleric pools plus Divine Intervention, success lockout 7 days. Arcane Abjuration uses shared Channel Divinity. | Common hit dice, slots and one Channel Divinity 3/3 short. Recorded diff: Missing Divine Intervention pool/lockout; no unexpected output. | **FAIL**; PASS |
| K-S029 | Cleric — Forge | Common Cleric pools plus Divine Intervention, success lockout 7 days. Artisan’s Blessing uses the shared Channel Divinity pool. | Common hit dice, slots and one Channel Divinity 3/3 short. Recorded diff: Missing Divine Intervention pool/lockout; no unexpected output. | **FAIL**; PASS |
| K-S030 | Cleric — Grave | Common Cleric pools; Sentinel at Death’s Door WIS modifier (2, minimum 1) / LR; Divine Intervention with 7-day success lockout. | Common pools plus `subclass:cleric:grave:sentinel-at-deaths-door` 2/2 long, formula WIS modifier, source XGE. Recorded diff: Missing Divine Intervention pool/lockout; no unexpected output. | **FAIL**; PASS |
| K-S031 | Cleric — Order | Common Cleric pools; Embodiment of the Law WIS modifier (2, minimum 1) / LR; Divine Intervention with 7-day success lockout. Order’s Demand uses shared Channel Divinity. | Common hit dice, slots and one Channel Divinity 3/3 short. Recorded diff: Missing Divine Intervention and Embodiment of the Law; no unexpected output. | **FAIL**; PASS |
| K-S032 | Cleric — Peace | Common Cleric pools; Emboldening Bond PB (6) / LR; Divine Intervention with 7-day success lockout. Balm of Peace uses shared Channel Divinity. | Common pools plus `subclass:cleric:peace:emboldening-bond` 6/6 long, PB formula, source TCE. Harness Divine Power was off. Recorded diff: Missing Divine Intervention pool/lockout; no unexpected output. | **FAIL**; PASS |
| K-S033 | Cleric — Twilight | Common Cleric pools; Steps of Night PB (6) / LR; Eyes of Night 1/LR, additional sharing costs a spell slot; Twilight Sanctuary uses shared Channel Divinity; Divine Intervention with 7-day success lockout. | Common pools plus `subclass:cleric:twilight:steps-of-night` 6/6 long (PB), and `...:eyes-of-night` 1/1 long with additional-use spell-slot cost, source TCE. Recorded diff: Missing Divine Intervention pool/lockout; no unexpected output. | **FAIL**; PASS |
| K-S034 | Druid — Land | Land: no finite subclass pool in scope at level 20; Natural Recovery is once-daily/short-rest-gated (not ordinary SR/LR). Druid Wild Shape is unlimited at 20, not a finite pool. Spell slots: 4/3/3/3/3/2/2/1/1. | PHB, Druid 20 / Land. No finite class/subclass pool rows; spell slots 4/4, 3/3, 3/3, 3/3, 3/3, 2/2, 2/2, 1/1, 1/1; d8 Hit Dice 20/20. Recorded diff: No missing or unexpected finite pool in scope. Natural Recovery is intentionally not generated as a daily-rest resource; official 2014 Basic Rules independently confirms unlimited Wild Shape at Druid 20. | record in tester log; PASS |
| K-S035 | Druid — Moon | Moon: no separate finite subclass pool; Moon features use Wild Shape. At Druid 20 Wild Shape is unlimited. Full-caster spell slots as K-S034. | PHB, Druid 20 / Moon. No finite class/subclass pool rows; spell slots and Hit Dice match K-S034. Recorded diff: No missing or unexpected finite pool at level 20; the unlimited Wild Shape pool is correctly absent. | record in tester log; PASS |
| K-S036 | Druid — Dreams | Balm of the Summer Court: Druid level d6 pool = 20d6/LR. Hidden Paths: WIS +2 (minimum 1) = 2/LR. Walker in Dreams is daily and outside ordinary-rest scope. | XGE: `subclass:druid:dreams:balm-of-the-summer-court` 20/20, class-level, d6, long rest; `subclass:druid:dreams:hidden-paths` 2/2, WIS (minimum 1), long rest. Recorded diff: Keys, maxima, formulas, dice, recovery, and source match. Walker in Dreams is absent as expected for the daily-only feature outside the current recovery scope. | record in tester log; PASS |
| K-S037 | Druid — Shepherd | Spirit Totem: 1 use, SR/LR (normalized to short-rest cooldown). | XGE: `subclass:druid:shepherd:spirit-totem` 1/1, fixed 1, short-rest cooldown. Recorded diff: No missing or unexpected pool; key, source, maximum, and normalized recovery match. | record in tester log; PASS |
| K-S038 | Druid — Stars | Star Map: PB +6 free Guiding Bolt uses/LR. Cosmic Omen: PB +6/LR. Starry Form consumes shared Wild Shape; not a separate pool. | TCE: `subclass:druid:stars:star-map-guiding-bolt` 6/6 PB, long rest; `subclass:druid:stars:cosmic-omen` 6/6 PB, long rest. No Wild Shape row at Druid 20. Recorded diff: Both tracked pools match. Starry Form has no separate pool; its Wild Shape usage is unlimited at this test level. No unexpected pool. | record in tester log; PASS |
| K-S039 | Druid — Wildfire | Cauterizing Flames: WIS +2 (minimum 1) = 2/LR. Wildfire Spirit consumes Wild Shape; dismissed spirit can be revived with a spell-slot cost, not a free pool. | TCE: `subclass:druid:wildfire:cauterizing-flames` 2/2, WIS (minimum 1), long rest. No Wildfire Spirit/Wild Shape row; the resource `costs`/`consumers` metadata is empty. Recorded diff: Missing paid-reuse output for the spell-slot revival of Wildfire Spirit (the oracle explicitly calls this out); Cauterizing Flames itself matches. | record in tester log; PASS — Wildfire Spirit alternatives verified; no finite Wild Shape pool at Druid 20 |
| K-S040 | Fighter — Champion | No Champion-specific finite rest pool. Fighter core: Second Wind 1/SR-LR; Action Surge 2/SR-LR; Indomitable 3/LR at level 20. | PHB: `class:fighter:second-wind` 1/1 fixed, short rest; `class:fighter:action-surge` 2/2, tiers 1→1 / 17→2, short rest, `once-on-your-turn`; `class:fighter:indomitable` 3/3, tiers 9→1 / 13→2 / 17→3, long rest. No Champion subclass pool. Recorded diff: No missing or unexpected pool; maximums, formulas, recovery, and Action Surge gate match. | record in tester log; PASS |
| K-S041 | Fighter — Battle Master | Battle Master adds one shared Superiority Dice pool: 6d12 at level 20, SR/LR; Relentless restores 1 when initiative is rolled and the pool is empty. | PHB core pools as K-S040 plus `subclass:fighter:battle-master:superiority-dice` 6/6, d12, short rest; initiative recovery 1 when empty. Recorded diff: No duplicate maneuver pools. Key, dice, maximum, short-rest recovery, and empty-only initiative trigger match. | record in tester log; PASS |
| K-S042 | Fighter — Eldritch Knight | Fighter core pools as K-S040; Eldritch Knight level-20 spell slots are 4 first-, 3 second-, 3 third-, and 1 fourth-level slot (Spell Slots; long rest). No additional subclass rest pool. | PHB core pools as K-S040; no subclass finite-pool row. Spell slots captured as 1st 4/4, 2nd 3/3, 3rd 3/3; no 4th-level slot generated. Recorded diff: Missing `class:spell-slot:4` 1/1 long-rest pool. The 2014 Eldritch Knight table's level-20 row independently cross-checks 1 fourth-level slot. | record in tester log; PASS |
| K-S043 | Fighter — Arcane Archer | Arcane Shot: 2 uses, SR/LR; level-15 Ever-Ready Shot initiative recovery is not ordinary rest recovery. | XGE: `subclass:fighter:arcane-archer:arcane-shot` 2/2 fixed, short rest; initiative recovery 1 when empty. Fighter core pools as K-S040. Recorded diff: No duplicate Arcane Shot pool. Key, maximum, recovery, and initiative trigger match. | record in tester log; PASS |
| K-S044 | Fighter — Cavalier | Unwavering Mark: STR +2 (minimum 1) = 2/LR; Warding Maneuver: CON +2 (minimum 1) = 2/LR. | XGE: `subclass:fighter:cavalier:unwavering-mark` 2/2 STR (minimum 1), long rest; `subclass:fighter:cavalier:warding-maneuver` 2/2 CON (minimum 1), long rest. Fighter core pools as K-S040. Recorded diff: No missing or unexpected pool; both ability formulas, maxima, sources, and recoveries match. | record in tester log; PASS |
| K-S045 | Fighter — Samurai | Fighting Spirit 3/LR; Strength Before Death 1/LR. Fighting Spirit restores one on initiative if empty at the appropriate level. | XGE: `subclass:fighter:samurai:fighting-spirit` 3/3 fixed, long rest, initiative recovery 1 when empty; `...:strength-before-death` 1/1 fixed, long rest. Fighter core pools as K-S040. Recorded diff: No missing or unexpected pool; maxima, recovery, and empty-only initiative trigger match. | record in tester log; PASS |
| K-S046 | Fighter — Rune Knight | Giant's Might and Runic Shield: PB +6/LR each. Five known rune slots: separate 1-use-per-rune SR/LR pools. | TCE: `subclass:fighter:rune-knight:giants-might` 6/6 PB, long rest; `...:runic-shield` 6/6 PB, long rest; `...:rune:1` through `...:rune:5`, each 1/1 fixed, short rest, separately keyed. Fighter core pools as K-S040. Recorded diff: No merged or missing rune pool. Names are represented as generic numbered rune slots, not actual rune names; all five identities and recovery pools remain separate. | record in tester log; PASS — five-Rune oracle verified at levels 3/7/10/15/18/20 |
| K-S047 | Fighter — Psi Warrior | Psionic Energy Dice: 2×PB = 12d12/LR, plus 1 on initiative if empty. Bulwark of Force and Telekinetic Master each 1/LR free, with extra use costing one Psionic Energy Die. | TCE: `subclass:fighter:psi-warrior:psionic-energy-dice` 12/12, 2×PB, d12, long rest, initiative recovery 1 when empty; `...:bulwark-of-force` 1/1 and `...:telekinetic-master` 1/1, long rest, each additional-use cost references the Psionic Energy Dice key. Fighter core pools as K-S040. Recorded diff: No missing or unexpected pool; keys, maxima, die, recovery, initiative trigger, and additional-use costs match. | record in tester log; PASS |
| K-S048 | Monk — Four Elements | Shared Ki: Monk level 20 = 20 points, SR/LR. Four Elements techniques spend Ki; no separate subclass pool. Perfect Self at 20 restores 4 Ki on initiative if empty. | PHB: `class:monk:ki` 20/20, class-level, short rest; initiative recovery 4 when empty. No separate Four Elements pool. Recorded diff: No missing or unexpected pool; shared key, recovery, and initiative trigger match. Feature uses spend the shared Ki pool rather than create another pool. | record in tester log; PASS |
| K-S049 | Monk — Open Hand | Shared Ki 20/SR-LR; Open Hand features spend Ki as applicable; no separate pool. Perfect Self trigger as K-S048. | PHB: `class:monk:ki` 20/20, class-level, short rest; initiative recovery 4 when empty. No separate Open Hand pool. Recorded diff: No missing or unexpected pool; shared key/recovery/initiative match. Open Hand features do not create separate rest pools. | record in tester log; PASS |
| K-S050 | Monk — Shadow | Shared Ki 20/SR-LR; Shadow Arts costs Ki; no separate subclass pool. Perfect Self trigger as K-S048. | PHB: `class:monk:ki` 20/20, class-level, short rest; initiative recovery 4 when empty. No separate Shadow pool. Recorded diff: No missing or unexpected pool; shared key/recovery/initiative match. Shadow Arts uses the shared pool rather than an additional pool. | record in tester log; PASS |
| K-S051 | Monk — Drunken Master | Shared Ki 20/SR-LR; Drunkard's Luck costs 2 Ki; no separate pool. Perfect Self trigger as K-S048. | PHB: `class:monk:ki` 20/20, class-level, short rest; initiative recovery 4 when empty. No separate Drunken Master pool. The Ki record has `costs: []` and `consumers: []`. Recorded diff: Missing expected 2-Ki Drunkard's Luck cost output. Pool key/maximum/recovery/initiative match; no unexpected pool. | record in tester log; PASS — Drunkard's Luck costs 2 shared Ki; no duplicate pool |
| K-S052 | Monk — Kensei | Shared Ki 20/SR-LR; Deft Strike and Sharpen the Blade spend Ki; no separate pool. Perfect Self trigger as K-S048. | PHB: `class:monk:ki` 20/20, class-level, short rest; initiative recovery 4 when empty. No separate Kensei pool. Recorded diff: No missing or unexpected pool; shared key/recovery/initiative match. Ki-consuming Kensei features do not create additional pools. | record in tester log; PASS |
| K-S053 | Monk — Astral Self | Shared Ki 20/SR-LR; Astral Self features spend Ki; no separate subclass pool. Perfect Self trigger as K-S048. | PHB: `class:monk:ki` 20/20, class-level, short rest; initiative recovery 4 when empty. No separate Astral Self pool. Recorded diff: No missing or unexpected pool; shared key/recovery/initiative match. Ki-consuming forms do not create additional pools. | record in tester log; PASS |
| K-S054 | Monk — Mercy | Shared Ki 20/SR-LR. Hand of Ultimate Mercy: once/LR, costs 5 Ki. Hand of Healing/Harm use Ki. Perfect Self trigger as K-S048. | PHB Ki `class:monk:ki` 20/20, short rest, initiative recovery 4 when empty; TCE `subclass:monk:mercy:hand-of-ultimate-mercy` 1/1 fixed, long rest, 5-Ki cost referencing `class:monk:ki`. Recorded diff: No missing or unexpected finite pool; the explicit once/LR pool and 5-Ki cost match. Other Ki uses remain on the shared Ki pool. | record in tester log; PASS |
| K-S055 | Monk — Ascendant Dragon | Shared Ki 20/SR-LR. Breath of the Dragon: PB +6 free uses/LR, then Ki alternative. Wings of the Dragon: 1 free use/LR, then Ki alternative. Perfect Self trigger as K-S048. | PHB Ki `class:monk:ki` 20/20, short rest, initiative restores 4 when empty; FToD `subclass:monk:ascendant-dragon:breath-of-the-dragon` 6/6 PB, long rest, additional-use cost references Ki; `...:wings-of-the-dragon` 1/1 fixed, long rest, additional-use cost references Ki. Selected config is Monk 20 / Ascendant Dragon / FToD. Recorded diff: No missing or unexpected resource keys. Confirmed against the level-20 oracle; free-use exhaustion/alternate-use gates are represented by each separate LR pool plus the Ki additional-use cost. | record in tester log; PASS |
| K-S056 | Paladin — Ancients | No finite pool beyond shared Channel Divinity; oath options use that pool. | No subclass key; common Paladin profile matches. 9 total resources. | PASS; PASS |
| K-S057 | Paladin — Devotion | No finite pool beyond shared Channel Divinity. | No subclass key; common profile matches. 9 total resources. | PASS; PASS |
| K-S058 | Paladin — Vengeance | No finite pool beyond shared Channel Divinity. | No subclass key; common profile matches. 9 total resources. | PASS; PASS |
| K-S059 | Paladin — Oathbreaker | No finite pool beyond shared Channel Divinity. | No subclass key; common profile matches. 9 total resources. | PASS; PASS |
| K-S060 | Paladin — Conquest | No finite pool beyond shared Channel Divinity. | No subclass key; common profile matches. 9 total resources. | PASS; PASS |
| K-S061 | Paladin — Redemption | No finite pool beyond shared Channel Divinity. | No subclass key; common profile matches. 9 total resources. | PASS; PASS |
| K-S062 | Paladin — Glory | `subclass:paladin:glory:glorious-defense`: CHA modifier (min 1) = 2, long rest, TCE. | Present 2/2, long rest, source/subclass TCE, formula `ability(CHA, min 1)`. Common profile matches. 10 total resources. | PASS; PASS |
| K-S063 | Paladin — Watchers | `subclass:paladin:watchers:vigilant-rebuke`: CHA modifier (min 1) = 2, long rest, TCE. | Present 2/2, long rest, source/subclass TCE, formula `ability(CHA, min 1)`. Common profile matches. 10 total resources. | PASS; PASS |
| K-S064 | Ranger — Beast Master | PHB companion care/replacement is not a fixed rest pool; no Beast Master finite pool expected. Level-20 d10 hit dice x20 and Ranger slot table (levels 1–5: 4/3/3/3/2). | Runtime generated only `class:hit-dice:d10` 20/20 plus `class:spell-slot:1..5` 4/4, 3/3, 3/3, 3/3, 2/2; no subclass resource. Config Ranger 20 / Beast Master, abilities all 14, TCE optional features empty; no duplicate keys, optional Ranger resources, or unexpected rows. | PASS; PASS |
| K-S065 | Ranger — Hunter | No finite Hunter pool identified by the recovery reference. Level-20 d10 hit dice x20 and Ranger slot table (levels 1–5: 4/3/3/3/2). | Runtime generated only `class:hit-dice:d10` 20/20 plus `class:spell-slot:1..5` 4/4, 3/3, 3/3, 3/3, 2/2; no subclass resource. Config Ranger 20 / Hunter, abilities all 14, TCE optional features empty; no duplicate keys, optional Ranger resources, or unexpected rows. | PASS; PASS |
| K-S066 | Ranger — Gloom Stalker | No finite subclass pool identified by the recovery reference; action/turn limits are not rest pools. Level-20 d10 hit dice x20 and Ranger slot table (levels 1–5: 4/3/3/3/2). | Runtime generated only `class:hit-dice:d10` 20/20 plus `class:spell-slot:1..5` 4/4, 3/3, 3/3, 3/3, 2/2; no subclass resource. Config Ranger 20 / Gloom Stalker, abilities all 14, TCE optional features empty; no duplicate keys, optional Ranger resources, or unexpected rows. | PASS; PASS |
| K-S067 | Ranger — Horizon Walker | Detect Portal: WIS modifier uses per LR. Ethereal Step: one use per SR/LR (represented as short-rest cooldown so long rest also restores it). Level-20 d10 hit dice x20 and Ranger slots (1–5: 4/3/3/3/2). | Runtime generated 8 rows: hit dice 20/20; slots 4/4, 3/3, 3/3, 3/3, 2/2; `subclass:ranger:horizon-walker:detect-portal` 2/2, LR, `ability wis min1`, XGE/XGE; `subclass:ranger:horizon-walker:ethereal-step` 1/1, short rest, `fixed 1`, XGE/XGE. Config Ranger 20 / Horizon Walker, abilities all 14, optional TCE features empty; no duplicate keys, optional Ranger pools, missing or unexpected rows. | PASS; PASS |
| K-S068 | Ranger — Monster Slayer | Magic-User’s Nemesis: one use per LR. Level-20 d10 hit dice x20 and Ranger slot table (levels 1–5: 4/3/3/3/2); optional TCE features off. | Runtime generated 7 rows: hit dice 20/20; slots 4/4, 3/3, 3/3, 3/3, 2/2; `subclass:ranger:monster-slayer:magic-users-nemesis` 1/1, LR, fixed 1, XGE/XGE. Config Ranger 20 / Monster Slayer, abilities all 14, no TCE optional resources, duplicate keys, missing or unexpected rows. | PASS; PASS |
| K-S069 | Ranger — Fey Wanderer | Fey Reinforcements: one free casting per eligible spell per LR; verify the precise slot-level requirement and representation of subsequent paid castings. Misty Wanderer: WIS modifier uses (minimum 1) per LR. Level-20 d10 hit dice x20 and Ranger slots (1–5: 4/3/3/3/2); optional TCE features off. | Runtime generated 8 rows: hit dice 20/20; slots 4/4, 3/3, 3/3, 3/3, 2/2; `subclass:ranger:fey-wanderer:fey-reinforcements` 1/1, LR, fixed 1, TCE/TCE, cost `{type:spell-slot,additionalUse:true}`, poolMode `uses`; `subclass:ranger:fey-wanderer:misty-wanderer` 2/2, LR, WIS minimum 1, TCE/TCE. Config Ranger 20 / Fey Wanderer, abilities all 14, no TCE optional resources or duplicate keys. No other missing/unexpected pools; unresolved whether paid castings require a minimum spell-slot level and whether `uses` fully conveys the free-cast restriction. The official TCE feature text was unavailable from the attempted endpoint, so these details remain blocked rather than inferred from implementation data. | BLOCKED; PASS |
| K-S070 | Ranger — Swarmkeeper | Writhing Tide: PB uses per LR. Level-20 d10 hit dice x20 and Ranger slot table (levels 1–5: 4/3/3/3/2); optional TCE features off. | Runtime generated 7 rows: hit dice 20/20; slots 4/4, 3/3, 3/3, 3/3, 2/2; `subclass:ranger:swarmkeeper:writhing-tide` 6/6, LR, PB formula, TCE/TCE. Config Ranger 20 / Swarmkeeper, abilities all 14, no TCE optional resources, duplicate keys, missing or unexpected rows. | PASS; PASS |
| K-S071 | Ranger — Drakewarden | Drake Companion: one free summon per LR; extra summon costs a spell slot. Drake’s Breath: one free use per LR; further use requires a 3rd-level-or-higher spell slot. Level-20 d10 hit dice x20 and Ranger slots (1–5: 4/3/3/3/2); optional TCE features off. | Runtime generated 8 rows: hit dice 20/20; slots 4/4, 3/3, 3/3, 3/3, 2/2; `subclass:ranger:drakewarden:drake-companion` 1/1, LR, fixed 1, FToD/FToD, spell-slot additional-use cost; `subclass:ranger:drakewarden:drakes-breath` 1/1, LR, fixed 1, FToD/FToD, spell-slot additional-use cost with `minimumLevel:3`. Config Ranger 20 / Drakewarden, abilities all 14, optional TCE features empty; no duplicate keys, missing or unexpected rows. | PASS; PASS |
| K-S072 | Rogue — Thief | Common Rogue hit dice; Stroke of Luck 1/SR-or-LR as a **Rogue class** pool; Thief adds no separate pool. | Hit dice 20/20 long; Stroke of Luck 1/1 short, but key/metadata are `subclass:rogue:thief:stroke-of-luck`, subclass Thief. Recorded diff: Stroke of Luck is present but mis-owned/mis-keyed as Thief-only rather than a Rogue class pool; unexpected subclass attribution. | **FAIL**; PASS |
| K-S073 | Rogue — Assassin | Common Rogue hit dice; Stroke of Luck 1/SR-or-LR (Rogue class); no Assassin-specific limited pool expected. | Hit dice 20/20 long only. Recorded diff: Missing Rogue Stroke of Luck; no unexpected resource. | **FAIL**; PASS |
| K-S074 | Rogue — Arcane Trickster | Common Rogue hit dice; Stroke of Luck fixed 1/SR-or-LR; Arcane Trickster level-20 table slots 1–4 = 4/3/3/1, LR; Spell Thief fixed 1/LR. | Hit dice 20/20 long; slots 1–3 4/3/3 long; progression selected as `third`; no 4th-level slot, Stroke of Luck, or Spell Thief. Recorded diff: Missing 4th-level spell-slot pool (expected 1/1), Rogue Stroke of Luck, and Spell Thief; no unexpected resource. | **FAIL**; PASS |
| K-S075 | Rogue — Inquisitive | Common Rogue hit dice; Stroke of Luck 1/SR-or-LR (Rogue class); Unerring Eye WIS modifier (2, minimum 1) / LR. | Hit dice 20/20 long only. Recorded diff: Missing Rogue Stroke of Luck and Unerring Eye; no unexpected resource. | **FAIL**; PASS |
| K-S076 | Rogue — Mastermind | Common Rogue hit dice; Stroke of Luck 1/SR-or-LR (Rogue class); no Mastermind limited pool expected. | Hit dice 20/20 long only. Recorded diff: Missing Rogue Stroke of Luck; no unexpected resource. | **FAIL**; PASS |
| K-S077 | Rogue — Scout | Common Rogue hit dice; Stroke of Luck 1/SR-or-LR (Rogue class); no Scout limited pool expected. | Hit dice 20/20 long only. Recorded diff: Missing Rogue Stroke of Luck; no unexpected resource. | **FAIL**; PASS |
| K-S078 | Rogue — Swashbuckler | Common Rogue hit dice; Stroke of Luck 1/SR-or-LR (Rogue class); Master Duelist 1/SR-or-LR. | Hit dice 20/20 long only. Recorded diff: Missing Rogue Stroke of Luck and Master Duelist; no unexpected resource. | **FAIL**; PASS |
| K-S079 | Rogue — Phantom | Common Rogue hit dice; Stroke of Luck 1/SR-or-LR; Wails from the Grave ceil(Rogue level/2)=10/LR; Ghost Walk 1/LR; tokens are event state capped at PB 6, not a rest pool. | Hit dice 20/20 long; `subclass:rogue:phantom:wails-from-the-grave` 10/10 long using class-level-half-up; `...:ghost-walk` 1/1 long. Recorded diff: Missing Rogue Stroke of Luck; no unexpected resource. Token cap/event state is not represented as a rest pool, as expected. | **FAIL**; PASS — Group 5 Soul Trinket implementation and targeted browser retest |
| K-S080 | Rogue — Soulknife | Common Rogue hit dice; Stroke of Luck 1/SR-or-LR; Psionic Energy Dice 2×PB=12 d12, LR full, SR +1, empty-initiative +1; Psychic Whispers and Psychic Veil each 1 free/LR, additional use costs one Psionic Energy die. | Hit dice 20/20 long; `subclass:rogue:soulknife:psionic-energy-dice` 12/12, resource die d12, shared, long rest plus short-rest recovery 1 and initiative-empty recovery 1; Psychic Whispers 1/1 and Psychic Veil 1/1 long, each additional use costs that Psionic Energy Dice pool. Recorded diff: Missing Rogue Stroke of Luck; no other unexpected resource. Dice size/recovery/costs match. | **FAIL**; PASS |
| K-S081 | Sorcerer — Draconic Bloodline | No subclass rest pool identified. Shared Sorcery Points (Sorcerer level, LR) and level-20 slot pools (1–9: 4/3/3/3/3/2/2/1/1) appear once; optional Sorcerous Restoration off. Level-20 d6 hit dice x20. | Runtime generated exactly 11 rows: hit dice 20/20; nine spell-slot keys at `class:spell-slot:1..9` with 4/4, 3/3, 3/3, 3/3, 3/3, 2/2, 2/2, 1/1, 1/1; `class:sorcerer:sorcery-points` 20/20, LR, `class-level`, shared points pool, PHB. No subclass pool; TCE active list empty and Sorcerous Restoration short-rest recovery 0. Config Sorcerer 20 / Draconic, abilities all 14; no duplicate or unexpected rows. | PASS; PASS |
| K-S082 | Sorcerer — Wild Magic | Tides of Chaos: one use, normally LR; a DM-triggered Wild Magic Surge can restore it early as an event. Shared Sorcery Points; optional Sorcerous Restoration off. Level-20 d6 hit dice x20 and Sorcerer slots 1–9. | Runtime generated 12 rows: shared hit dice, nine slots and `class:sorcerer:sorcery-points` at the full values above, plus `subclass:sorcerer:wild-magic:tides-of-chaos` 1/1, LR, fixed 1, PHB/PHB, `recoveryTrigger:wild-magic-surge`. Config Sorcerer 20 / Wild Magic, all abilities 14, TCE active list empty, point-pool short-rest recovery 0, no duplicate or unexpected rows. | PASS; PASS |
| K-S083 | Sorcerer — Divine Soul | Favored by the Gods: one use per SR/LR. Shared Sorcery Points; optional Sorcerous Restoration off. Level-20 d6 hit dice x20 and Sorcerer slots 1–9. | Runtime generated 12 rows: shared hit dice, nine slots and Sorcery Points 20/20, plus `subclass:sorcerer:divine-soul:favored-by-the-gods` 1/1, short-rest cooldown (therefore LR also resets), fixed 1, XGE/XGE. Config Sorcerer 20 / Divine Soul, all abilities 14, TCE active list empty, Sorcerous Restoration recovery 0, no duplicate or unexpected rows. | PASS; PASS |
| K-S084 | Sorcerer — Shadow Magic | Strength of the Grave: one use per LR. Hound of Ill Omen and Umbral Form spend the shared Sorcery Points pool (3 and 6 points); no extra rest pools. Shared Sorcery Points, slots 1–9 and hit dice d6 x20; optional Sorcerous Restoration off. | Runtime generated 12 rows with the full shared baseline and `subclass:sorcerer:shadow-magic:strength-of-the-grave` 1/1, LR, fixed 1, XGE/XGE. The Sorcery Points row is 20/20, shared, LR, but `consumers:[]`; Strength of the Grave has no costs, and no cost records for Hound of Ill Omen (3 points) or Umbral Form (6 points) appear. No missing/extra resource pools or duplicates; **missing expected cost metadata** fails the case output contract. | FAIL; PASS — Hound of Ill Omen (3) and Umbral Form (6) link to Sorcery Points |
| K-S085 | Sorcerer — Aberrant Mind | Psionic Sorcery spends Sorcery Points equal to the spell's level; Revelation in Flesh spends 1+ points based on selected benefits; Warping Implosion has one free use per LR, then costs 5 points per additional use. Shared point pool, slots 1–9 and d6 hit dice x20; optional Sorcerous Restoration off. | Runtime generated 12 rows with the full shared baseline and `subclass:sorcerer:aberrant-mind:warping-implosion` 1/1, LR, fixed 1, TCE/TCE; cost metadata links to `class:sorcerer:sorcery-points` with `additionalUse:true` but gives no amount. The Sorcery Points row has `consumers:[]`, so no cost records for Psionic Sorcery or Revelation in Flesh appear; the 5-point additional-use cost for Warping Implosion is also absent. No extra pools or duplicate keys, but **expected cost metadata is incomplete**. | FAIL; PASS — Psionic Sorcery, Revelation in Flesh, and Warping Implosion costs verified |
| K-S086 | Sorcerer — Clockwork Soul | Restore Balance: PB uses per LR. Bastion of Law spends 1–5 shared Sorcery Points. Trance of Order: one free use/LR or 5 points; Clockwork Cavalcade: one free use/LR or 7 points. Shared points pool, slots 1–9 and d6 hit dice x20; optional Sorcerous Restoration off. | Runtime generated 14 rows with the full shared baseline; Restore Balance 6/6, LR, PB, TCE/TCE; Trance of Order 1/1, LR, fixed 1, alternative 5-point cost; Clockwork Cavalcade 1/1, LR, fixed 1, alternative 7-point cost. Sorcery Points is 20/20/shared/LR but `consumers:[]`; **Bastion of Law's 1–5 point cost is missing** from generated cost metadata. No duplicate or unexpected resource pools. | FAIL; PASS — Bastion of Law, Trance of Order, and Clockwork Cavalcade costs verified |
| K-S087 | Warlock — Archfey | `fey-presence`, `misty-escape`, `dark-delirium`: each 1, short or long rest. | All three keys present at 1/1, PHB, short-rest representation. Common Warlock profile matches. 10 total resources. | PASS; PASS |
| K-S088 | Warlock — Fiend | `dark-ones-own-luck`: 1, short or long rest; `hurl-through-hell`: 1, long rest. | Both keys present at 1/1 with their expected recovery; PHB. Common profile matches. 9 total resources. | PASS; PASS |
| K-S089 | Warlock — Great Old One | `entropic-ward`: 1, short or long rest. | Key present at 1/1, PHB, short-rest representation. Common profile matches. 8 total resources. | PASS; PASS |
| K-S090 | Warlock — Hexblade | `hexblades-curse`: 1, short or long rest; `accursed-specter`: 1, long rest. | Both keys present at 1/1 with expected recovery and XGE source. Common profile matches. 9 total resources. | PASS; PASS |
| K-S091 | Warlock — Celestial | Two resource pools: Healing Light, Warlock level + 1 = 21d6/long rest; Searing Vengeance, 1/long rest. Source metadata must agree with subclass selection. | Both pools present at 21/21 d6 and 1/1, long rest. Feature source is XGE on both records, while subclass selection metadata reports TCE. This source mismatch violates the plan's source-consistency assertion; resource maxima/recovery match. Common profile matches. 9 total resources. | FAIL; PASS — Healing Light source metadata corrected to XGE |
| K-S092 | Warlock — Fathomless | Tentacle of the Deeps: PB = 6/long rest; Fathomless Plunge: 1/long rest. | Both keys present at 6/6 and 1/1, TCE, long rest. Common profile matches. 9 total resources. | PASS; PASS |
| K-S093 | Warlock — Genie | Bottled Respite and Elemental Gift: each PB = 6/long rest. Limited Wish: one use, then unavailable until 1d4 long rests have completed; preserve this variable recovery rather than fixed LR. Sanctuary Vessel companion/entry use must retain its long-rest restriction. | Bottled Respite and Elemental Gift present at 6/6, TCE, long rest. **No Limited Wish key or 1d4-long-rest recovery output; no Sanctuary Vessel restriction/gate output.** Common profile matches. 9 total resources. | FAIL; PASS — 1/Long Rest; twice-PB-hour duration verified |
| K-S094 | Wizard — Abjuration | Arcane Ward: 42 HP, event-restored by qualifying abjuration spells; no automatic long-rest refill. | **No Abjuration key / ward HP pool / recovery event.** Common Wizard profile matches except missing Arcane Recovery. 12 total resources. | FAIL; PASS — scoped subclass output; Arcane Ward accumulator behavior/output remains deferred |
| K-S095 | Wizard — Conjuration | Benign Transposition: 1, long rest; regain use after casting a 1st+ level conjuration spell. | `subclass:wizard:conjuration:benign-transposition` present at 1/1, long rest, with `conjuration-spell-slot` recovery trigger. Common profile matches, but Arcane Recovery is missing. 13 total resources. | FAIL; PASS |
| K-S096 | Wizard — Divination | Portent: 3 uses/long rest; Third Eye: 1 use/short or long rest. | Both keys present at 3/3 and 1/1 with expected recovery. Common profile matches, but Arcane Recovery is missing. 14 total resources. | FAIL; PASS |
| K-S097 | Wizard — Enchantment | No global finite subclass pool for Instinctive Charm. | No subclass key, as expected. Common profile matches, but Arcane Recovery is missing. 12 total resources. | FAIL; PASS |
| K-S098 | Wizard — Evocation | Overchannel: first use per long rest; subsequent same-rest uses incur increasing damage, not additional fixed charges. | Present 1/1, long rest; additional-use cost is marked as damage. Common profile matches, but Arcane Recovery is missing. 13 total resources. | FAIL; PASS |
| K-S099 | Wizard — Illusion | Illusory Self: 1 use/short or long rest. | Key present at 1/1, short-rest representation. Common profile matches, but Arcane Recovery is missing. 13 total resources. | FAIL; PASS |
| K-S100 | Wizard — Necromancy | No finite subclass pool expected. | No subclass key, as expected. Common profile matches, but Arcane Recovery is missing. 12 total resources. | FAIL; PASS |
| K-S101 | Wizard — Transmutation | Shapechanger: 1/short or long rest; Major Transformation: 1/long rest and consumes Transmuter's Stone. | Both keys present; Shapechanger 1/1 short-rest representation; Major Transformation 1/1 long rest with `Transmuter's Stone` consumption. Common profile matches, but Arcane Recovery is missing. 14 total resources. | FAIL; PASS |
| K-S102 | Wizard — War Magic | Power Surge maximum = INT modifier (min 1) = 2; begins at 1, long rest resets to 1; Counterspell/Dispel Magic success and Arcane Deflection while empty can add a surge. | Present 1/2, XGE, with initial value 1, long-rest reset-to-1 and both event sources. Common profile matches, but Arcane Recovery is missing. 13 total resources. | FAIL; PASS — recorded pool metadata; Power Surge event accumulation is not runtime-supported and is deferred |
| K-S103 | Wizard — Bladesinging | Bladesong: PB = 6 uses/long rest (TCE version, not SCAG version). | Present at 6/6, TCE, long rest. Common profile matches, but Arcane Recovery is missing. 13 total resources. | FAIL; PASS |
| K-S104 | Wizard — Order of Scribes | Manifest Mind: 1 free use/long rest; additional uses cost a spell slot. | Present at 1/1, TCE, long rest, with additional-use spell-slot cost. Common profile matches, but Arcane Recovery is missing. 13 total resources. | FAIL; PASS |

## Full case-definition tables: K-B, K-T, K-M

The following rows are copied into this archive as case-level definitions and current dispositions. Each row is one scored case. K-B040 is counted only as four child slices, not as a scored parent. K-S expected values and first recorded actuals are in the preceding appendix.
### K-B: per-case scenario and current disposition

| ID | Case | Fixture / scenario | Current disposition |
|---|---|---|---|
| K-B001 | Artificer subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS |
| K-B002 | Barbarian subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS |
| K-B003 | Bard subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS |
| K-B004 | Cleric subclass-selection boundary | Compare level below and at level-1 unlock; verify required selector and reset on level/class changes. | PASS |
| K-B005 | Druid subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS |
| K-B006 | Fighter subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS |
| K-B007 | Monk subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS |
| K-B008 | Paladin subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS |
| K-B009 | Ranger subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS |
| K-B010 | Rogue subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS |
| K-B011 | Sorcerer subclass-selection boundary | Compare level below and at level-1 unlock; verify required selector and reset on level/class changes. | PASS |
| K-B012 | Warlock subclass-selection boundary | Compare level below and at level-1 unlock; verify required selector and reset on level/class changes. | PASS |
| K-B013 | Wizard subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS |
| K-B014 | Cleric Harness Divine Power option | Default off; independently toggle and test applicability and unlock boundary at Cleric 2. | PASS |
| K-B015 | Druid Wild Companion option | Default off; independently toggle and test applicability and unlock boundary at Druid 2. | PASS |
| K-B016 | Monk Quickened Healing option | Default off; independently toggle and test applicability and unlock boundary at Monk 2. | PASS |
| K-B017 | Monk Focused Aim option | Default off; independently toggle and test applicability and unlock boundary at Monk 2. | PASS |
| K-B018 | Paladin Harness Divine Power option | Default off; independently toggle and test applicability and unlock boundary at Paladin 3. | PASS |
| K-B019 | Ranger Favored Foe option | Default off; independently toggle and test applicability and unlock boundary at Ranger 1. | PASS |
| K-B020 | Ranger Primal Awareness option | Default off; independently toggle and test applicability and unlock boundary at Ranger 3. | PASS |
| K-B021 | Ranger Nature's Veil option | Default off; independently toggle and test applicability and unlock boundary at Ranger 10. | PASS |
| K-B022 | Sorcerer Magical Guidance option | Default off; independently toggle and test applicability and unlock boundary at Sorcerer 5. | PASS |
| K-B023 | Sorcerer Sorcerous Restoration option | Default off; independently toggle and test applicability and unlock boundary at Sorcerer 20; verify +4 Sorcery Points on short rest. | PASS |
| K-B024 | Ability-score input and formula boundary | Test six scores at 1, legal minimum, 10, 20, 30, and blank; verify CHA-based Divine Sense minimum and localized validation. | PASS |
| K-B025 | Proficiency-bonus thresholds | Test total-character-level PB boundaries at 1/4/5/8/9/12/13/16/17/20 using Favored Foe. | PASS |
| K-B026 | Fixed resource formula | Verify fixed formula branch and exact output. | PASS |
| K-B027 | PB resource formula | Verify PB-based maximum at applicable level boundaries. | PASS |
| K-B028 | Twice-PB resource formula | Verify twice-PB maximum at applicable boundaries. | PASS |
| K-B029 | Half-PB-rounded-up formula | Verify half-PB-up result and associated spell-slot-cap metadata. | PASS |
| K-B030 | Ability-modifier formula | Verify ability modifier and minimum-1 behavior. | PASS |
| K-B031 | Ability-plus formula | Verify ability modifier plus fixed amount. | PASS |
| K-B032 | Ability-times formula | Verify ability modifier multiplied by configured amount. | PASS |
| K-B033 | Class-level formula | Verify resource maximum follows owning class level. | PASS |
| K-B034 | Half-class-level-rounded-up formula | Verify half owning-class level, rounded up. | PASS |
| K-B035 | Class-level-plus-one formula | Verify owning-class level plus one. | PASS |
| K-B036 | Class-level-times formula | Verify owning-class level multiplied by configured factor. | PASS |
| K-B037 | Level-tier formula | Verify tier changes immediately before/at each tier boundary. | PASS |
| K-B038 | Cleric Channel Divinity tier formula | Verify Channel Divinity availability and progression at Cleric-level boundaries. | PASS |
| K-B039 | Barbarian Rage tier formula | Verify Rage uses across level tiers, including unlimited use at Barbarian 20. | PASS |
| K-B040-01 | Fixed-use maxima — Artificer/Barbarian/Ranger/Sorcerer | Independently assess Tester 1 fixed-value resource slice. | PASS |
| K-B040-02 | Fixed-use maxima — Bard/Cleric/Rogue | Independently assess Tester 2 fixed-value resource slice and missing outputs. | PASS — fixed outputs and Group 1 feature additions rechecked |
| K-B040-03 | Fixed-use maxima — Druid/Fighter/Monk | Independently assess fixed counts; Rune Knight maximum is five, with no sixth at Fighter 18. | PASS |
| K-B040-04 | Fixed-use maxima — Paladin/Warlock/Wizard | Independently assess fixed counts, including Bottled Respite's one free entry per Long Rest. | PASS — fixed maxima matched; Bottled Respite retested 1/Long Rest |
| K-B041 | PB maxima across class slices | Verify PB-based maxima and total-character-level PB; includes corrected Wails from the Grave expectation. | PASS — Wails and Genie duration PB boundaries retested; prior cross-slice PB assertions match |
| K-B042 | Ability-based maxima across class slices | Verify ability modifier/minimum-1 formulas and missing ability-based outputs. | PASS — full prior matrices plus Order and Inquisitive WIS boundaries retested |
| K-B043 | Level-tier maxima across class slices | Verify every tier boundary; Rune Knight maximum is five and Fighter 18 adds no sixth Rune. | PASS — operator oracle adjudication |
| K-B044 | Subclass-gated resource outputs | At unlock and one level below, verify correct presence/absence, ownership, and metadata. | PASS — T1–T4 gate slices closed; T4's 56-profile post-fix retest passed. Historical profile mismatches were fixed in Groups 2/3 and were not gate failures. |
| K-B045 | Recovery-mode level switch | Verify `recoveryFromLevel` changes recovery without duplicating the pool; Bardic Inspiration Bard 4/5 and initiative boundary 19/20. | PASS |
| K-B046 | Die/count/uses scaling | Verify die size, counts, and capacity at scaling boundaries across applicable definitions. | PASS — Wails PB and corrected five-Rune boundaries retested; other slice assertions match |
| K-B047 | Shared-pool consumers and keys | Verify canonical pool identity, `shared` metadata, and every consumer-to-key link. | PASS — supported shared-pool consumer crosswalk and canonical keys rechecked |
| K-B048 | Costs and alternative costs | Verify cost metadata and pool references; paid-action execution is a separate subassertion and was not run. | PASS — Soul Trinket alternate-cost metadata and pool references verified; paid-action NOT RUN |
| K-B049 | Recovery-only definitions and resource presence | Scan all scoped rows for `recoveryOnly`/`recoveryTarget`; verify applicable presence conditions and target resource. | N/A — full-scope scan found no applicable definitions |
| K-B050 | TCE optional-feature gates | Verify defaults, independent toggles, unlock boundaries, and generated resources for applicable options. | PASS |

### K-T: per-case scenario and current disposition

| ID | Case | Fixture / scenario | Current disposition |
|---|---|---|---|
| K-T001-01 | Bardic Inspiration pool | Verify one canonical pool, `shared` metadata, and Bard consumer links. | PASS — six supported Bard consumer profiles; canonical pool |
| K-T001-02 | Cleric Channel Divinity consumers | Verify Cleric consumers reference the canonical shared Channel Divinity pool. | PASS — fourteen domains and Harness Divine Power link rechecked |
| K-T001-03 | Paladin Channel Divinity consumers | Verify Paladin consumers reuse the same canonical shared Channel Divinity pool. | PASS — eight supported Oaths and Harness Divine Power link rechecked |
| K-T001-04 | Wild Shape pool | Verify one canonical pool, `shared` metadata, and Wild Shape consumer links. | PASS — Moon, Stars, Wildfire, and Wild Companion links; no finite pool at Druid 20 |
| K-T001-05 | Ki pool | Verify one canonical pool, `shared` metadata, and Monk Ki consumer links. | PASS — eight supported Monk subclasses; all costs point to canonical Ki |
| K-T001-06 | Rage pool | Verify one canonical pool, `shared` metadata, and Rage consumer links. | PASS — all eight supported Barbarian subclasses rechecked |
| K-T001-07 | Sorcery Points pool | Verify one canonical pool, `shared` metadata, and Sorcery Point consumer links. | PASS — Shadow, Aberrant Mind, Clockwork, and Magical Guidance links rechecked |
| K-T001-08 | Superiority Dice pool | Verify one canonical pool, `shared` metadata, and Battle Master consumer links. | PASS — one shared dice pool and maneuver consumer link |
| K-T001-09 | Psi Warrior pool | Verify Psionic Energy Dice pool identity and Psi Warrior consumer links. | PASS — seven consumers point to one canonical shared pool |
| K-T001-10 | Soulknife pool | Verify Psionic Energy Dice pool identity and Soulknife consumer links. | PASS — six consumers point to one canonical shared pool |
| K-T001-11 | Remaining shared pools | Enumerate other multi-consumer pools and verify each consumer references its canonical key. | PASS |
| K-T002-01 | Soulknife pool-key separation | Keep Psionic Energy Dice and Psychic Whispers on distinct pool keys. | PASS |
| K-T002-02 | Soulknife recovery separation | Verify Psionic Energy Dice and Psychic Whispers retain distinct recovery behavior. | PASS |
| K-T002-03 | Spell-slot tier identity | Keep Artificer spell-slot levels on separate pool keys. | PASS |
| K-T002-04 | Grouped display identity | Verify showing spell-slot levels in one card does not merge their pool identities. | PASS |
| K-T002-05 | Rune Knight pool count | Verify five independent Rune pools and no sixth pool at Fighter 18+. | PASS |
| K-T002-06 | Remaining independent pools | Complete the cross-catalog check of distinct keys and cooldowns for other independent resources. | PASS |
| K-T003-01 | Bardic Inspiration recovery boundary | Verify Bard 4 short/long-rest behavior and the Bard 5 short-rest boundary. | PASS |
| K-T003-02 | Sorcerous Restoration | Verify the tested Sorcerous Restoration recovery amount at the checked levels. | PASS |
| K-T003-03 | Power Surge reset-to | Verify Power Surge resets to exactly one after either a Short or Long Rest. | DEFERRED — integrated accumulator gain/spend/reset behavior is out of current scope |
| K-T003-04 | Soulknife per-turn limit | Verify the Psionic Energy Dice per-turn limit remains unchanged by rest controls. | PASS |
| K-T003-05 | Soulknife partial short-rest recovery | Verify the tested short rest restores the correct partial number of Psionic Energy Dice. | PASS |
| K-T003-06 | Soulknife long-rest recovery | Verify long rest restores the tested Psionic Energy Dice pool to its maximum. | PASS |
| K-T003-07 | Psychic Whispers empty-only | Verify Psychic Whispers remains empty on short rest and recovers on long rest. | PASS |
| K-T003-08 | Hit Dice recovery | Verify Fighter 20 recovers half its d10 Hit Dice on long rest. | PASS |
| K-T003-09 | Tides of Chaos rest behavior | Verify ordinary short rest does not recover the use and long rest does. | PASS |
| K-T003-10 | Manual reset for event-triggered recovery | Verify Tides of Chaos and Benign Transposition retain one-use Long Rest pools and can be manually reset to 1/1 after their qualifying event; do not require automatic trigger execution. Power Surge accumulator behavior is a separate deferred subassertion. | PASS — both cards were spent to 0/1 and manually reset to 1/1; Power Surge portion remains DEFERRED |
| K-T003-11 | Recovery-only catalog scope | Complete the catalog scan for `recoveryOnly`; record N/A if none apply. | N/A — zero applicable catalog rows |
| K-T003-12 | Empty-only recovery catalog scope | Complete the catalog scan for `longRestRecoveryWhenEmpty`; record N/A if none apply. | N/A — zero applicable catalog rows |
| K-T004-01 | Arcane Jolt turn gate | Verify once-per-turn gating remains distinct from short-rest controls and long-rest recovery. | PASS |
| K-T004-02 | Action Surge own-turn gate | Verify the once-on-your-turn gate is distinct from its short-rest cooldown. | PASS |
| K-T004-03 | Once-per-round metadata scope | Check supported once-per-round metadata; record N/A because no scoped definition uses it. | N/A — no scoped definition |
| K-T004-04 | Favored Foe effect gate | Verify the damage effect gate is separate from PB-limited marking uses. | PASS |
| K-T004-05 | Spell-slot costs | Verify spell-slot costs, pool references, quantities, and minimum slot levels. | PASS — in-scope spell-slot costs, minimum levels, and alternatives rechecked |
| K-T004-06 | Ki costs | Verify Ki costs and alternative costs reference the correct pool and amount. | PASS — core Monk, subclass, TCE, and Four Elements cost matrix rechecked |
| K-T004-07 | Channel Divinity costs | Verify Channel Divinity costs reference the correct pool and amount. | PASS |
| K-T004-08 | Damage costs | Verify damage costs are not represented as free uses or cooldowns. | PASS |
| K-T004-09 | Item costs | Verify item costs are distinct from free uses and cooldowns. | PASS |
| K-T005-01 | Same-key current-value retention | Reapplication preserves current value, including a value above the new maximum. | PASS |
| K-T005-02 | Manual resource retention | Reapplication preserves manually created resources. | PASS |
| K-T005-03 | Obsolete generated-resource removal | Reapplication removes generated resources that no longer apply. | PASS |
| K-T005-04 | New resource initialization | Reapplication creates newly applicable generated resources at the correct initial value. | PASS |
| K-T006-01 | Locale-switch state retention | Locale change and re-render preserve class, level, subclass, abilities, and TCE selections. | PASS |
| K-T006-02 | Reload state persistence | Reload preserves the same character's inputs and selections. | PASS |
| K-T006-03 | Character option isolation | TCE options remain isolated between characters. | PASS |
| K-T007-01 | Case identity and expected/actual | Every report retains case ID plus explicit expected and actual results. | PASS |
| K-T007-02 | Missing-output classification | Report missing resources separately from other discrepancy types. | PASS |
| K-T007-03 | Unexpected-output classification | Report unexpected resources separately from other discrepancy types. | PASS |
| K-T007-04 | Maximum classification | Report incorrect maximum values as a distinct finding. | PASS |
| K-T007-05 | Recovery classification | Report incorrect recovery behavior as a distinct finding. | PASS |
| K-T007-06 | Pool-key classification | Report incorrect pool keys as a distinct finding. | PASS |
| K-T007-07 | Source classification | Report incorrect source metadata as a distinct finding. | PASS |
| K-T007-09 | Cost classification | Report incorrect or missing costs as a distinct finding. | PASS |
| K-T007-10 | Follow-up tracking | Track follow-up status and required auditor round-trips for each finding. | PASS |

### K-M: per-case scenario and current disposition

| ID | Case | Fixture / scenario | Current disposition |
|---|---|---|---|
| K-M001 | Fighter/Ranger/Rogue multiclass | Fighter 5 Battle Master / Ranger 5 Gloom Stalker / Rogue 5 Arcane Trickster; total level 15, PB +5, Favored Foe on; verify class-level pools, PB, slots, and no key collisions. | PASS |
| K-M002 | Sorcerer/Warlock multiclass | Sorcerer 10 Clockwork Soul / Warlock 10 Genie; total level 20, PB +6; verify class-level resources, Pact Magic, Mystic Arcanum boundary, and multiclass slots. | PASS |
| K-M003 | Bard/Paladin multiclass | Bard 10 Eloquence / Paladin 10 Watchers; CHA 16; verify Bardic Inspiration recovery/count, Paladin-level pools, one Channel Divinity pool, and total-level PB. | PASS |
| K-M004 | Wizard/Artificer multiclass | Wizard 10 Order of Scribes / Artificer 10 Battle Smith; INT 16; verify caster slots, class-level resources, INT formulas, Arcane Jolt gate, and pool identity. | PASS |
| K-M005 | Cleric/Fighter multiclass | Cleric 1 Arcana / Fighter 19 Champion; total level 20, PB +6; verify Cleric 1 subclass, no premature Channel Divinity, class-level resources, PB, and multiclass slots. | PASS |

## K-B full inventory and gate-profile details

The inventories below preserve category-level expected/actual rows and fixture counts from the executed class slices. They include initial FAIL/BLOCKED observations; the current PASS/DEFERRED/N/A result is the disposition table above. Read these historical rows as the defect baseline, not as current output.
### K-B040–K-B050 category results

| Category | Fixture count / full applicable inventory | Expected vs actual and discrepancies | Status |
|---|---|---|---|
| **K-B040 fixed maxima** | 14 fixed-maximum definitions: `experimental-elixir`, `eldritch-cannon`, `consult-the-spirits`, `ethereal-step`, `magic-users-nemesis`, `fey-reinforcements`, `drake-companion`, `drakes-breath`, `tides-of-chaos`, `favored-by-the-gods`, `strength-of-the-grave`, `trance-of-order`, `clockwork-cavalcade`, `warping-implosion`. The 14 rows are included in the 44 K-B044 snapshots. | Each active pool expected/actual maximum 1 with the definition's recovery/source/subclass; all matched in the hand-authored resource-key and metadata assertions. No missing or unexpected outputs or wrong fixed maxima. Cost gaps are tracked separately under B048; B040 is only the fixed-max assertion. | **PASS — runtime** |
| **K-B041 PB maxima** | Six PB definitions: `defensive-field`, `bolstering-magic`, `writhing-tide`, `favored-foe`, `natures-veil`, `restore-balance`. Intended and executed matrix: 36 single-class configurations; 44 target-row observations. | PB=`floor((total level-1)/4)+2`. Defensive Field: L4/5/8/9/12/13/16/17 => 2/3/3/4/4/5/5/6. Bolstering Magic: L8/9/12/13/16/17 => 3/4/4/5/5/6. Writhing Tide: L8/9/12/13/16/17 => 3/4/4/5/5/6. Favored Foe: L4/5/8/9/12/13/16/17 => 2/3/3/4/4/5/5/6. Nature's Veil: correctly absent at L4/5/8/9 (four expected absences), then L12/13/16/17 => 4/5/5/6. Restore Balance: L4/5/8/9/12/13/16/17 => 2/3/3/4/4/5/5/6. Across 40 active-pool assertions, max/formula/recovery/key/source/subclass matched; four expected Nature's Veil absences had no unexpected rows. | **PASS — runtime** |
| **K-B042 ability maxima** | Six definitions, 18 valid snapshots at ability scores 10/12/14: `flash-of-genius`, `spell-storing-item`, `restorative-reagents`, `arcane-jolt`, `detect-portal`, `misty-wanderer`. | Five modifier/min-1 rows expected/actual 1/1/2; Spell-Storing Item (2x INT modifier, min 2) expected/actual 2/2/4. All 18 valid snapshots had the correct pool key, formula, maximum, recovery, source, and subclass; zero mismatches. An initial six Artificer attempts lacked the required subclass and produced no committed fixtures; they were excluded and rerun with Armorer selected. | **PASS — runtime** |
| **K-B043 level tiers** | One applicable tiered definition: `rage` (`barbarian-rage`); 11 exact-level snapshots at L1,2,3,5,6,11,12,16,17,19,20. No `level-tiers` formula rows in the assigned 28-definition slice. | All 11 runtime snapshots matched the independently expected maxima: L1–2=2; L3–5=3; L6–11=4; L12–16=5; L17–19=6; L20 has no finite Rage pool. For L1–19 actual key `class:barbarian:rage`, formula `barbarian-rage`, recovery long rest, PHB; no duplicate or unexpected Rage row was observed. L20 storage contained no Rage row. | **PASS — runtime** |
| **K-B044 subclass gates** | 22 subclass-gated definitions, each at feature level and one level below: `experimental-elixir` L3; `restorative-reagents` L9; `defensive-field` L3; `eldritch-cannon` L3; `arcane-jolt` L9; `consult-the-spirits` L10; `bolstering-magic` L6; `detect-portal` L3; `ethereal-step` L7; `magic-users-nemesis` L11; `fey-reinforcements` L11; `misty-wanderer` L15; `writhing-tide` L7; `drake-companion` L3; `drakes-breath` L11; `tides-of-chaos` L1; `favored-by-the-gods` L1; `strength-of-the-grave` L1; `restore-balance` L1; `trance-of-order` L14; `clockwork-cavalcade` L18; `warping-implosion` L18. | 44 snapshots, including four level-1 Sorcerer Draconic control fixtures. At each threshold the expected unique key appeared; one level below it was absent (using the Draconic controls for level-1 subclass rows). Hand-authored full resource-key sets and checked maximum/formula/recovery/source/subclass metadata had zero mismatches. No missing, unexpected, duplicate, wrong-max, or wrong-recovery rows in these assertions. | **PASS — runtime** |
| **K-B045 `recoveryFromLevel`** | Full assigned slice scan: all 28 `classResourceData` rows; zero rows with `recoveryFromLevel`. | Confirmed N/A for these four classes. The only `recoveryFromLevel` definition found is Bardic Inspiration, outside this assigned slice. Sorcerous Restoration is a separate recovery modifier, not a `recoveryFromLevel` row; see B049. | **N/A — confirmed by full slice scan** |
| **K-B046 die/count/uses scaling** | 13 configurations: hit dice for Artificer d8, Barbarian d12, Ranger d10, Sorcerer d6 at L1/L2 (8); Sorcery Points at L2/L10/L20 (3); Artillerist cannon concurrent limit at L14/L15 (2). Rage's count tiers are tested under B043. | All 13 matched: each hit-die key `class:hit-dice:d8/d12/d10/d6` had max 1/2 at L1/L2 and pool mode `dice` (long-rest recovery displayed); Sorcery Points key `class:sorcerer:sorcery-points` had max 2/10/20, `class-level` formula, long-rest recovery, `shared:true`; Cannon stayed max 1 with long-rest recovery and spell-slot additional-use cost, while the metadata boundary `[[3,1],[15,2]]` evaluates to concurrent limit 1 at L14 and 2 at L15. No wrong die, count, key, formula, recovery, or capacity result. | **PASS — runtime** |
| **K-B047 shared pools / consumers** | Two applicable shared-resource families: Rage and Sorcery Points. Rage evidence includes the prior eight subclass configurations at L19; Sorcery Points were inspected at L2/L10/L20 and in Shadow, Aberrant Mind, and Clockwork fixtures. | Rage expected one `class:barbarian:rage` pool with `shared:true` and all Rage consumers pointing to it. Actual pool key/max/recovery matched, but `shared:false` and `consumers:[]`: **FAIL** (K-T001). Sorcery Points expected one `class:sorcerer:sorcery-points` pool, `shared:true`, and all consumers linked to that key. The observed pool is shared and scales correctly, but its `consumers` list is empty. Some consumer-side cost rows do point to the correct key (Magical Guidance 1, Trance 5, Cavalcade 7; Warping Implosion has the key but lacks amount 5); expected Shadow, Aberrant Mind, and Bastion of Law costs are absent. No duplicate target pool was observed in these fixtures. Full assigned-slice scan found no other `shared:true` definition. | **FAIL — runtime; Rage metadata and Sorcery Point consumer links incomplete** |
| **K-B048 costs / alternatives** | 15 expected relationships: Elixir and Eldritch Cannon extra creation => spell slot; Fey Reinforcements paid reuse => spell slot; Drake Companion extra summon => spell slot; Drake's Breath extra use => level-3+ slot; Primal Awareness extra casting => spell slot; Magical Guidance => 1 Sorcery Point; Hound of Ill Omen => 3 points; Umbral Form => 6; Psionic Sorcery => spell-level points; Revelation in Flesh => 1+ points by benefits; Bastion of Law => 1–5 points; Trance of Order alternative => 5; Clockwork Cavalcade alternative => 7; Warping Implosion additional use => 5 points. Dedicated runtime cost inspection: 12 class/level/option configurations, plus Cannon L14/L15 cross-checks from B046. | Correct: Elixir and Cannon have spell-slot `additionalUse`; Drake Companion has the same; Drake's Breath has spell-slot `additionalUse` with `minimumLevel:3`; each of the five Primal Awareness pools (spell levels 1–5 at Ranger 20 with the option on) has spell-slot `additionalUse`; Magical Guidance at Sorcerer 5 points to `class:sorcerer:sorcery-points` for 1; Trance and Cavalcade alternative costs are 5 and 7 to that same key. Missing: Hound (3), Umbral Form (6), Psionic Sorcery, Revelation in Flesh, and Bastion of Law cost metadata/consumer links. Warping Implosion points to the correct pool for an additional use but omits the expected amount 5. Fey Reinforcements L11 produces one max-1/LR pool with generic spell-slot `additionalUse`; the exact paid-reuse/per-spell representation remains blocked against K-S069's unresolved RAW expectation. No unrelated or unexpected cost rows were observed. | **FAIL — 6 known missing/incomplete cost links; Fey representation BLOCKED** |
| **K-B049 recovery-only / resource existence** | Full 28-row assigned catalog scan; zero `recoveryOnly` or `recoveryTarget` rows. One assigned TCE recovery modifier: Sorcerous Restoration. Required modifier matrix: L19 selected, L20 off, L20 on (3 configurations); the B050 L19-off control was also run. | N/A for standalone recovery-only definitions after the full slice scan. Runtime: L19 selected still has one `class:sorcerer:sorcery-points` pool max 19, `shortRestRecovery:0`, no separate Restoration pool; L20 off has max 20 and recovery bonus 0; L20 on has the same max-20 pool with `shortRestRecovery:4`, active feature metadata targets that existing key, and no separate pool. No missing or unexpected pool/recovery output. | **PASS — runtime; recovery-only subscan N/A** |
| **K-B050 TCE option unlocks** | Five assigned options: Favored Foe L1; Primal Awareness L3; Nature's Veil L10; Magical Guidance L5; Sorcerous Restoration L20. Planned threshold matrix is 18 off/on snapshots; one extra Ranger-20 Primal Awareness progression/cost fixture checked all spell entries. | All 18 planned snapshots and the extra progression fixture were run. Favored Foe: L1 off none/on one PB-2/LR pool. Primal Awareness: L2 off/on none; L3 off none/on one max-1/LR 1st-level free-cast pool with slot additional-use cost; at Ranger 20 on, five max-1/LR pools for spell levels 1–5, each with slot additional-use cost. Nature's Veil: L9 off/on none; L10 off none/on one PB-4/LR pool. Magical Guidance: L4 off/on leaves no active feature/cost; L5 off none/on no separate pool, with one Sorcery Point cost to `class:sorcerer:sorcery-points`. Sorcerous Restoration: L19 off/on has no recovery bonus; L20 off has none; L20 on adds 4 short-rest recovery to the existing Sorcery Points pool with no standalone pool. No missing/unexpected unlock outputs or wrong maxima/recovery/cost targets in the checked option matrix. | **PASS — runtime** |

**B041 runtime evidence:** 36 configurations, 44 target-row observations, 40 active-pool assertions and four expected Nature's Veil absences; all formulas, sources, keys, maxima and gates matched. Level vectors are listed in the K-B inventory above.

**B042 runtime evidence:** 18 valid snapshots across six definitions at ability scores 10/12/14; all formula, key, recovery, source and subclass assertions matched. Invalid no-subclass attempts were excluded; valid Artificer cases used Armorer.

**B040/B044 runtime evidence:** 22 subclass-gated definitions and 44 below/at-threshold profiles; all expected keys and checked metadata matched.

**Source evidence:** Assigned catalog rows and generated metadata were inspected only to identify actual outputs. Expected values are based on the named 2014 rules features and the case oracles included in this archive.

**Additional runtime evidence:** Rage tiers and hit-die, Sorcery Point, Cannon scaling outputs are enumerated in the K-B043/K-B046 tables above; no additional file is required.

**Execution/cleanup disposition:** All 11 K-B categories now have an explicit result; B043, B046, B049, and B050 boundary fixtures are runtime-tested, while B047 has confirmed failures and B048 has confirmed missing/incomplete costs plus the unresolved Fey Reinforcements representation. The isolated headless Edge profile and its unique test character were removed after confirming the profile began with empty localStorage; temporary server PID 14120 on port 41783 was stopped and the port is no longer listening. The earlier integrated-browser contexts used for the original K-S and B040/B044 fixtures expired before storage could be independently re-read, so cleanup for those contexts remains unverifiable. This assigned report is ready for independent audit but does not claim Step K completion.


### Scope and execution

- Checked the complete assigned catalog slice: 25 rows (Bard 10, Cleric 9, Rogue 6), plus rules-derived limited-use features missing from that catalog.
- Ran 115 confirmed UI apply/confirm fixtures under unique `__stepk_tester2_kb_*__` characters. One additional single-class Cleric level-0 smoke attempt was rejected by the UI rule requiring at least one positive class level; it was excluded from the applied-fixture count. The level-0 controls were then tested with valid multiclass anchor fixtures (`cleric0-anchor-bard1` and `bard0-anchor-cleric1`).
- The 115 applied fixtures cover 32 level-1/level generation comparisons, the applicable ability/PB/tier/die boundaries, and the TCE option cases. Ability tests used CHA/WIS 1, 10, 20, and 30. TCE was off unless noted.
- All outputs below were read from `dnd_skills_db` after the normal class-resource UI apply/confirm flow. The two multiclass PB controls were Cleric 1 (Peace)/Rogue 4 (total 5, Bond max 3) and Rogue 3 (Soulknife)/Cleric 2 (total 5, Psionic Energy Dice max 6), confirming PB uses total character level.

### K-B040–K-B050 dispositions

| Case | Fixtures / applicable rows | Expected vs actual | Status |
|---|---|---|---|
| K-B040 fixed maxima | 13 fixed-maximum definitions; 61 generated-resource observations. Boundary fixtures include the Bard subclass level pairs, Twilight Eyes of Night, Rogue Ghost Walk/Psychic Whispers/Psychic Veil, and Thief 19/20. | Every generated fixed pool observed is max 1 with the expected recovery. Exceptions are missing College of Creation Animating Performance at level 6 and Stroke of Luck's Thief-only ownership; see inventory below. | **FAIL** |
| K-B041 PB maxima | 42 observations across Emboldening Bond (11), Steps of Night (8), Psionic Energy Dice (13), and Wails from the Grave (10). | Bond, Steps, and Soulknife dice match PB / twice PB, including the total-level multiclass controls. Phantom Wails is expected to use PB, but actual maxima follow ceil(Rogue level/2) and diverge from level 8 onward. | **FAIL** |
| K-B042 ability maxima | 50 observations across Bardic Inspiration, Infectious Inspiration, Warding Flare, Wrath of the Storm, Sentinel at Death's Door, and War Priest. | CHA/WIS scores 1/10/20/30 produced 1/1/5/10 for all six present formulas, matching ability modifier with minimum 1. Order's Embodiment of the Law and Inquisitive Unerring Eye (both WIS modifier, minimum 1) are missing at their unlock thresholds. | **FAIL** |
| K-B043 level tiers | Channel Divinity: level 1/2, 5/6, 17/18; Harness Divine Power: option off/on and levels 2/6/18. | Channel Divinity is absent at Cleric 1, then 1/1/2/2/3 at levels 2/5/6/17/18. Harness Divine Power on gives 1/2/3 uses at levels 2/6/18. Both tier formulas match. | **PASS** |
| K-B044 subclass/resource gates | 32 level-1/level comparisons across the 25 catalog rows and rules-derived limited-use features. The below-level controls include the two valid level-0 multiclass anchors. | Present rows appear at their tested level and not below it. Missing outputs: Animating Performance, Divine Intervention, Visions of the Past, Embodiment of the Law, Unerring Eye, Master Duelist, and Spell Thief. Stroke of Luck appears at Rogue 20 only for Thief although it is a Rogue class feature. | **FAIL** |
| K-B045 recoveryFromLevel switches | Bardic Inspiration at Bard 4/5, plus Bard 19/20 initiative-recovery boundary. Full slice inventory: one `recoveryFromLevel` row (Bardic Inspiration); initiative recovery also has a level-20 switch on that row. | Bardic Inspiration stays one pool and changes Long Rest to Short Rest at Bard 5; the prior supplementary report records actual use/Short Rest/Long Rest behavior. Empty-initiative recovery is 0 at Bard 19 and 1 at Bard 20. No other assigned row has a `recoveryFromLevel` switch. | **PASS** |
| K-B046 die/count/use scaling | 13 Soulknife Psionic Energy Dice observations, 10 Phantom Wails observations, CHA/WIS formula observations above, and the Bard 19/20 initiative boundary. | Soulknife count is twice PB and die size changes at Rogue 5/11/17 as expected (d6/d8/d10/d12); Bard CHA formulas and initiative recovery match. Wails count is wrong because it uses half Rogue level rather than PB. | **FAIL** |
| K-B047 shared consumers/pool keys | Bardic Inspiration, Cleric Channel Divinity, and Soulknife Psionic Energy Dice; all relevant records were inspected in the same applied fixtures. | Exactly one correct pool key per pool was observed. Bardic Inspiration incorrectly has `shared:false` and `consumers:[]`; Channel Divinity has `shared:true` but `consumers:[]`; Psionic Energy Dice has `shared:true` but `consumers:[]`. Harness Divine Power and Psychic Whispers/Veil forward cost references use the correct existing keys; other documented consumers are not linked in generated metadata. | **FAIL** |
| K-B048 costs/alternate costs | Performance of Creation, Eyes of Night, Harness Divine Power, Phantom Wails/Ghost Walk, and Soulknife additional-use consumers. Cost metadata inspected at the relevant level pairs/tier points. | Eyes of Night's unrestricted spell-slot additional-use metadata, Harness Divine Power's Channel Divinity cost and half-PB-up slot recovery, and Psychic Whispers/Veil's one-die additional-use keys match. Performance of Creation omits the required slot minimum 2; Animating Performance is absent (including its slot minimum 3); Phantom token alternative uses for Wails/Ghost Walk are absent; several Soulknife die-spending abilities are not represented. | **FAIL; paid-action execution BLOCKED** — the resource UI exposes generic pool use/rest controls but no class-feature activation or payment handlers, so it cannot execute additional uses or confirm slot/token/die payment behavior. |
| K-B049 recovery-only presence | Full 25-row assigned slice and generated outputs inspected. | No assigned catalog row has `recoveryOnly`; Bard initiative recovery and Soulknife short-rest/empty-initiative recovery are attached to ordinary pools, not recovery-only rows. Divine Intervention's missing seven-day success lockout is a missing feature finding, not an existing `recoveryOnly` definition. | **N/A — full-slice check** |
| K-B050 TCE option unlock | 10 Harness Divine Power fixtures: level 1 off/on, level 2 off/on, then on at 5/6/9/13/17/18. No other TCE optional feature applies to these class groups. | The option is off by default; selecting it at level 1 produces no resource; level 2 off produces no Harness pool and level 2 on produces one. On-values are 1/2/3 at levels 2/6/18. The spell-slot recovery metadata has max levels 1/2/2/3/3 at Cleric 2/5/9/13/17, matching half PB rounded up. | **PASS** |

### Assigned catalog definition inventory

“Observed” is the count of generated-resource outputs across the applied fixtures (not a count of unique characters); pre-unlock no-output controls are listed under K-B044. Expected values come from the independent feature oracle, not from implementation metadata.

| Resource key (actual source/subclass) | Expected | Actual | Observed / result |
|---|---|---|---|
| `class:bard:bardic-inspiration` (PHB/Bard) | CHA modifier, minimum 1; Long Rest until Bard 5, then Short Rest; empty-initiative +1 beginning at Bard 20; one shared pool. | CHA 1/10/20/30 gives max 1/1/5/10; recovery switches at 5; initiative metadata 0 at 19 and 1 at 20. One key, but `shared:false`, `consumers:[]`. | 26 outputs; formula/recovery **PASS**, shared metadata/consumer links **FAIL**. |
| `subclass:bard:glamour:enthralling-performance` (XGE/Glamour) | Fixed 1, Short Rest; unlock 3. | 1/1, Short Rest at levels 3/5/6/13/14. | 5 outputs; **PASS**. |
| `subclass:bard:glamour:mantle-of-majesty` (XGE/Glamour) | Fixed 1, Long Rest; unlock 6. | 1/1, Long Rest at levels 6/13/14. | 3 outputs; **PASS**. |
| `subclass:bard:glamour:unbreakable-majesty` (XGE/Glamour) | Fixed 1, Short Rest; unlock 14. | 1/1, Short Rest at level 14. | 1 output; **PASS**. |
| `subclass:bard:whispers:words-of-terror` (XGE/Whispers) | Fixed 1, Short Rest; unlock 3. | 1/1, Short Rest at levels 3/5/6/13/14. | 5 outputs; **PASS**. |
| `subclass:bard:whispers:mantle-of-whispers` (XGE/Whispers) | Fixed 1, Short Rest; unlock 6. | 1/1, Short Rest at levels 6/13/14. | 3 outputs; **PASS**. |
| `subclass:bard:whispers:shadow-lore` (XGE/Whispers) | Fixed 1, Long Rest; unlock 14. | 1/1, Long Rest at level 14. | 1 output; **PASS**. |
| `subclass:bard:creation:performance-of-creation` (TCE/Creation) | Fixed 1, Long Rest; additional uses require a spell slot of level 2 or higher; unlock 3. | 1/1, Long Rest; cost is marked `additionalUse:true` but has no minimum slot level. | 3 outputs; maximum/recovery **PASS**, cost minimum **FAIL**. |
| `subclass:bard:eloquence:universal-speech` (TCE/Eloquence) | Fixed 1, Long Rest; unlock 6. | 1/1, Long Rest at level 6 and higher; absent at level 5. | 8 outputs; **PASS**. |
| `subclass:bard:eloquence:infectious-inspiration` (TCE/Eloquence) | CHA modifier, minimum 1, Long Rest; unlock 14. | CHA 1/10/20/30 gives 1/1/5/10; level-13 control absent and level-14 appears. | 6 outputs; formula/gate **PASS**. |
| `class:cleric:channel-divinity` (PHB/Cleric) | Cleric-level tiers 1 at 2–5, 2 at 6–17, 3 at 18+; Short Rest; one shared pool for all domain uses. | Maxima match at all tested tiers, one class key, `shared:true`; `consumers:[]`. Harness Divine Power points its cost to this key, but domain consumer links are not enumerated. | 39 outputs; tier/key **PASS**, consumer metadata **FAIL**. |
| `subclass:cleric:light:warding-flare` (PHB/Light) | WIS modifier, minimum 1, Long Rest; unlock 1. | WIS 1/10/20/30 gives 1/1/5/10; source/subclass and recovery match. | 5 outputs; **PASS**. |
| `subclass:cleric:tempest:wrath-of-the-storm` (PHB/Tempest) | WIS modifier, minimum 1, Long Rest; unlock 1. | WIS 1/10/20/30 gives 1/1/5/10; source/subclass and recovery match. | 4 outputs; **PASS**. |
| `subclass:cleric:grave:sentinel-at-deaths-door` (XGE/Grave) | WIS modifier, minimum 1, Long Rest; unlock 6. | WIS 1/10/20/30 gives 1/1/5/10; absent at Grave 5, present at 6. | 5 outputs; **PASS**. |
| `subclass:cleric:peace:emboldening-bond` (TCE/Peace) | PB uses, Long Rest; unlock 1. | Cleric levels 1/4/5/8/9/12/13/16/17/20 give 2/2/3/3/4/4/5/5/6/6; Cleric 1/Rogue 4 gives 3 at total level 5. | 11 outputs; **PASS**. |
| `subclass:cleric:twilight:steps-of-night` (TCE/Twilight) | PB uses, Long Rest; unlock 6. | Cleric levels 6/8/9/12/13/16/17/20 give 3/3/4/4/5/5/6/6. | 8 outputs; **PASS**. |
| `subclass:cleric:twilight:eyes-of-night` (TCE/Twilight) | Fixed 1, Long Rest; additional sharing may expend a spell slot of any level; unlock 1. | 1/1 Long Rest; `additionalUse:true` spell-slot cost has no minimum, matching “any level.” | 10 outputs; **PASS**. |
| `subclass:cleric:war:war-priest` (PHB/War) | WIS modifier, minimum 1, Long Rest; unlock 1. | WIS 1/10/20/30 gives 1/1/5/10; source/subclass and recovery match. | 4 outputs; **PASS**. |
| `class:cleric:harness-divine-power` (TCE/Cleric, optional) | Off unless selected; unlock 2; 1/2/3 uses at Cleric 2/6/18, Long Rest; each use costs one Channel Divinity and restores one slot no higher than half PB rounded up. | Off/on and gate match; 1/2/3 use tiers match; `costs:[{poolKey:"class:cleric:channel-divinity",amount:1}]`; slot recovery max-level formula is `half-pb-up` and tested values match. | 7 generated outputs plus off/below-level controls; **PASS**. |
| `subclass:rogue:thief:stroke-of-luck` (PHB/Thief) | Rogue class feature: fixed 1, Short or Long Rest, unlock 20; expected class key `class:rogue:stroke-of-luck`. | Rogue 19 absent; Thief 20 has max 1/1, Short Rest, but key/owner are Thief-only. K-S level-20 non-Thief cases also lacked it. | 1 generated output plus 19/20 pair; maximum/recovery **PASS**, owner/key and class-wide presence **FAIL**. |
| `subclass:rogue:phantom:wails-from-the-grave` (TCE/Phantom) | Uses equal PB, Long Rest; unlock 3. (Damage roll separately uses half the Rogue's Sneak Attack dice, rounded up.) | Key/source/gate/recovery match, but formula is `class-level-half-up`: Rogue levels 3/4/5/8/9/12/13/16/17/20 yield 2/2/3/4/5/6/7/8/9/10 rather than PB 2/2/3/3/4/4/5/5/6/6. | 10 outputs; **FAIL** at levels 8 and higher as tested. |
| `subclass:rogue:phantom:ghost-walk` (TCE/Phantom) | Fixed 1, Long Rest; an additional use can destroy a Soul Trinket; unlock 13. | 1/1 Long Rest at 13/16/17/20; `costs:[]`, so the Soul Trinket alternate cost is missing. | 4 outputs; pool/gate **PASS**, alternate cost **FAIL**. |
| `subclass:rogue:soulknife:psionic-energy-dice` (TCE/Soulknife) | 2×PB dice; d6 at 3, d8 at 5, d10 at 11, d12 at 17; Long Rest restores all, Short Rest restores 1, empty-initiative restores 1; one shared pool. | Count/formula/die/recovery match, including Rogue 3/Cleric 2 total-level PB control (6 dice); one key, `shared:true`, but `consumers:[]`. | 13 outputs; pool/scaling/recovery **PASS**, reverse consumer list **FAIL**. |
| `subclass:rogue:soulknife:psychic-whispers` (TCE/Soulknife) | Fixed 1 free use after Long Rest; further use costs one Psionic Energy die; unlock 3. | 1/1 Long Rest; additional-use cost points to the correct Psionic Energy Dice key. | 13 outputs; represented cost **PASS**. |
| `subclass:rogue:soulknife:psychic-veil` (TCE/Soulknife) | Fixed 1 free use after Long Rest; further use costs one Psionic Energy die; unlock 13. | 1/1 Long Rest; additional-use cost points to the correct Psionic Energy Dice key. | 4 outputs; represented cost **PASS**. |

### Rules-derived limited-use outputs absent from the catalog

| Expected resource / rule | Boundary fixtures | Actual output | Disposition |
|---|---|---|---|
| Creation Animating Performance: one Long Rest use at Bard 6; further use costs a 3rd-level-or-higher slot. | `creation-l5`, `creation-l6` | No separate Animating Performance pool at either level; level 6 still only has Bardic Inspiration and Performance of Creation. | **Missing** |
| Cleric Divine Intervention: unlock 10; successful use causes a 7-day lockout. | `knowledge-l9`, `knowledge-l10` | Channel Divinity only; no Divine Intervention pool or success-lockout representation. | **Missing** |
| Knowledge Visions of the Past: one Short/Long Rest use at Cleric 17. | `knowledge-l16`, `knowledge-l17` | Channel Divinity only; no Visions pool. | **Missing** |
| Order Embodiment of the Law: WIS modifier (minimum 1) per Long Rest at Cleric 6. | `order-l5`, `order-l6` | Channel Divinity only; no Embodiment pool. | **Missing** |
| Inquisitive Unerring Eye: WIS modifier (minimum 1) per Long Rest at Rogue 9. | `inquisitive-l8`, `inquisitive-l9` | No class-resource output at either level. | **Missing** |
| Swashbuckler Master Duelist: one Short/Long Rest use at Rogue 17. | `swashbuckler-l16`, `swashbuckler-l17` | No class-resource output at either level. | **Missing** |
| Arcane Trickster Spell Thief: one Long Rest use at Rogue 17. | `arcane-trickster-l16`, `arcane-trickster-l17` | No Rogue class-resource output at either level; K-S074 level 20 also had none. | **Missing** |
| Stroke of Luck is a Rogue class feature, not Thief-only. | `thief-l19`, `thief-l20`; K-S072–K-S080 at level 20 | Only `subclass:rogue:thief:stroke-of-luck` is generated; other Rogue subclasses lack the class-wide resource. | **Wrong key/owner; missing class-wide output** |

Phantom Soul Trinkets were checked separately: their PB maximum is an event-state capacity, not a rest-recharged pool, so no ordinary Soul Trinket pool is expected. However, the token-spend alternatives for Wails from the Grave and Ghost Walk should still be represented as costs.

### Oracle corrections and coverage notes

- **Wails from the Grave correction:** The supplied recovery reference previously said the use count was half Rogue level rounded up. The Tasha's Phantom text instead says the number of uses equals PB; “half the number of Sneak Attack dice, rounded up” is the damage roll, not the use count (TCE Phantom). K-B041/K-B046 therefore use PB as expected. The catalog's class-level-half-up maximum is wrong. The K-S079 Wails subassertion had appeared to match the incorrect oracle; the overall historical K-S079 row was already FAIL for missing Stroke of Luck.
- **Creation correction:** Tasha's College of Creation text requires a 2nd-level-or-higher slot for additional Performance of Creation uses and separately grants Animating Performance at level 6, with additional uses requiring a 3rd-level-or-higher slot (TCE Creation). Animating Performance is not a separate Bardic Inspiration expenditure: it can be commanded as part of the bonus action when Bardic Inspiration is used. The captured Performance of Creation pool has the correct 1/LR maximum and recovery, but its additional-use cost omits the 2nd-level minimum; Animating Performance is missing from the actual set and level-6 boundary output. Therefore the historical K-S018 PASS is superseded by an auditor-adjudicated FAIL. The K-T001 consumer list must not count Animating Performance as a separate BI expenditure.
- **Auditor disposition — 2026-10-19 13:22 JST:** The DND 5E (2014) Rules Auditor reviewed K-S018 and K-S079. Both are **FAIL**; there is no remaining rules-text ambiguity and no human-operator escalation is needed. K-S018 fails for the missing Animating Performance resource and missing minimum slot levels (2nd for Performance of Creation reuse; 3rd for Animating Performance reuse), although Performance of Creation's free-use count/recovery passes. K-S079 fails because Wails should be PB uses (6 at Rogue 20), not 10; Stroke of Luck is a Rogue-class feature missing from the generated Phantom set; and the Wails/Ghost Walk Soul Trinket alternate-cost metadata is absent. Ghost Walk's 1/LR pool passes. Soul Trinket capacity/event behavior and actual slot/token payment were not executed; keep those behavior subassertions NOT RUN/UNVERIFIABLE, outside metadata-only scope. Historical runtime rows above are preserved; this disposition updates their current case status.
- **Other rules evidence:** Cleric Channel Divinity/Harness expectations: recovery reference lines 64, 71–72 and TCE Cleric Order/Twilight. Cleric Divine Intervention: 2014 Basic Rules, Cleric. Rogue Soulknife uses, dice size, and cost clauses: TCE Soulknife. Knowledge, Inquisitive, Swashbuckler, and Arcane Trickster cross-checks are linked in the prior Evidence section above.
- **K-B047 consumer detail:** Bard consumers in the assigned subclasses include Cutting Words, Combat Inspiration, Mantle of Inspiration, Blade Flourish, Psychic Blades, and Unsettling Words; their pool link metadata is absent. Cleric domain Channel Divinity options share the one Cleric key, but the generated `consumers` list is empty (Harness Divine Power alone has a forward cost reference). Soulknife's Psychic Whispers/Veil additional-use costs point to the shared key, but Psi-Bolstered Knack, Homing Strikes, Psychic Teleportation, and Rend Mind spend dice without corresponding generated consumer links/cost entries.
- **K-B049 basis:** Complete assigned-slice scan found zero recovery-only definitions; Sorcerous Restoration is represented as metadata on the existing Sorcery Points pool.

### Evidence and cleanup

- Contract: Case intent and required outputs are reproduced in the K-B case tables above.
- Expected recovery rules: Named 2014 class/subclass features and rest rules are mapped in the oracle index and per-case expected values above.
- Actual outputs: Resource keys and metadata values are recorded in the case inventory above.
- Browser evidence consists of the unique fixture IDs listed in the tables above; all reported actual values were read after UI apply/confirm. A manual Soulknife recovery check used the normal UI handlers: Psionic Energy Dice changed 4/4 → 3/4 on “use” → 4/4 on Short Rest. The pointer click was unstable, so the same visible UI button was activated through its DOM click handler; no resource record was edited directly. Cost metadata was inspected, but class-feature paid-use actions are not exposed by this resource UI and were not executed.
- The saved localStorage backup contained `{}`. It was restored exactly; verification showed zero localStorage keys and zero temporary characters. The local test server exited during the final recovery check; a port check confirmed no listener on 8796. No product source, test plan, or other tester report was edited.

**Disposition:** The assigned K-B slice is executed and ready for independent audit, with failures listed above. K-B043, K-B045, K-B050 pass; K-B049 is N/A after full-slice inspection; K-B040–K-B042, K-B044, K-B046–K-B048 fail. Paid-action cost behavior remains unrun. This is **not** a Step K completion claim.


### Setup and independent oracle

- Scope is the Druid, Fighter, and Monk class-resource slice: 25 catalog definitions (7 / 14 / 4), plus the five dynamically generated Rune Knight rune-activation pools and three applicable TCE optional-feature definitions.
- Runtime page: `http://127.0.0.1:49383/cr.html`; unique temporary character: `K-B T3 isolated 49383`. The origin initially had empty localStorage/sessionStorage. Profiles were applied through the class-level UI and confirmed in the generated character record. No resource-use buttons were pressed; current values for an unchanged key were retained across reapplications, so the boundary assertions below compare pool presence, maximum/formula, recovery, identity, and metadata rather than treating a preserved current value as a failed maximum.
- Expected rules values: Listed by class, subclass, and named feature in the per-case oracle table above; the product implementation was not used as the expectation oracle.
- Core 2014 rules were independently cross-checked against the D&D Beyond 2014 Basic Rules, Chapter 3: Classes, including Druid's level-20 Wild Shape, Fighter core resource levels, and Monk's level-based Ki. The rules reference remains the oracle for expansion subclass features.

### Category fixture counts and dispositions

| Case | Applicable rows checked | Fixtures / assertions | Expected vs actual disposition |
|---|---:|---:|---|
| K-B040 fixed maxima | 9 fixed catalog rows plus 5 Rune activation pools | 22 boundary profiles: 8 subclass fixed-row pairs, no-class/Fighter 1 for Second Wind, and Rune Knight levels 3/7/10/15 | PASS. Each fixed value, key, and recovery matched; rune slots appeared 2/3/4/5 at the correct levels, each as its own 1-use short-rest pool. |
| K-B041 PB maxima | 5 PB rows | 46 profiles | PASS. Every expected PB step was asserted independently for every PB row; no wrong maximum, key, source, subclass, or recovery. |
| K-B042 ability maxima | 4 ability rows | 16 profiles: ability scores 1, 10, 20, 30 for each row | PASS. All four produced 1 / 1 / 5 / 10, matching the modifier formula with minimum 1. |
| K-B043 level tiers | Wild Shape, Action Surge, Indomitable, Superiority Dice, and Rune slot count | 28 profiles | PASS. Every tier boundary matched; Wild Shape correctly has no finite pool at Druid 20. |
| K-B044 subclass gates | All 20 subclass-gated catalog rows | 40 profiles: independent `level - 1` / `level` pairs | PASS. Every target key was absent one level below its gate and present at the gate; source/subclass metadata and threshold maximum/recovery matched. No unexpected subclass pool was found. |
| K-B045 `recoveryFromLevel` | All 25 catalog rows, three TCE options, five Rune pools | 0 applicable rows; 0 runtime fixtures | N/A. No owned definition has a `recoveryFromLevel` switch. Initiative-recovery thresholds are separate and were tested under K-B046. |
| K-B046 die/count/uses scaling | All varying-die/count/use rows | 30 dedicated profiles (Balm, Superiority Dice, Arcane Shot/Fighting Spirit initiative thresholds, Psionic Energy Dice, Ki); the 46 K-B041 and 28 K-B043 profiles also assert PB/tier/rune use counts | PASS. Dice, counts, unlimited transition, linear class-level pools, and initiative-recovery level thresholds matched. |
| K-B047 shared consumers/pool keys | Wild Shape, Superiority Dice, Psionic Energy Dice, Ki, Rune slots | 11 owner/subclass profiles, with TCE cost-link assertions reused from K-B050 | FAIL. Pool keys and deduplication are correct, but several expected consumers are not enumerated in the generated consumer metadata; details below. |
| K-B048 costs/alternate costs | 8 represented cost definitions plus 2 RAW cost expectations absent from the output | 10 cost assertions; evidence reused from K-B044/K-B047/K-B050 profiles | FAIL. All eight represented costs are correct; Wildfire Spirit's spell-slot paid reuse and Drunkard's Luck's 2-Ki cost are missing. |
| K-B049 recovery-only presence | All 25 catalog rows, three TCE options, five Rune pools | 0 `recoveryOnly` rows; 0 runtime fixtures | N/A for this catalog category. The complete assigned slice contains no recovery-only resource definition; scope caveat below. |
| K-B050 TCE option unlocks | Wild Companion, Quickened Healing, Focused Aim | 12 profiles: off/on at level 1 and off/on at level 2 for each option | PASS. All defaulted off, remained inactive below level 2 even when selected, and activated independently at level 2 with the expected cost metadata. |

### Complete 25-row resource inventory

Expected values below are rule-derived. Actual values are from the isolated browser output. Source and subclass refer to the generated metadata and matched the named rule source for every listed row.

| Class / resource key | Expected rules value | Actual output and disposition |
|---|---|---|
| Druid `class:druid:wild-shape` | Level 2: 2 uses, short rest; level 20 Archdruid: unlimited; shared by Wild Shape consumers. | Same key, PHB/base class, 2 at levels 2/19 and no finite pool at 20; short-rest recovery and `shared:true`. Gate/maximum/recovery pass. Consumer list is incomplete (K-B047); Wildfire paid-reuse cost is missing (K-B048). |
| Druid `subclass:druid:dreams:balm-of-the-summer-court` | Druid-level count of d6, long rest, Dreams (XGE), gained at 2. | 2d6 at level 2, 3d6 at 3, 20d6 at 20; key, d6, long rest, XGE/Dreams match. |
| Druid `subclass:druid:dreams:hidden-paths` | WIS modifier, minimum 1, long rest, Dreams (XGE), gained at 10. | At the gate with WIS 14: 2; score matrix 1/10/20/30 yields 1/1/5/10. Key/formula/recovery/source/subclass match. |
| Druid `subclass:druid:shepherd:spirit-totem` | Fixed 1 use, short rest, Shepherd (XGE), gained at 2. | 1/1 at level 2; key, fixed maximum, short rest, XGE/Shepherd match. |
| Druid `subclass:druid:stars:star-map-guiding-bolt` | PB free casts, long rest, Stars (TCE), gained at 2. | PB vector matches at all tested levels: 2/2/3/3/4/4/5/5/6/6 at levels 2/4/5/8/9/12/13/16/17/20; TCE/Stars and long rest match. |
| Druid `subclass:druid:stars:cosmic-omen` | PB uses, long rest, Stars (TCE), gained at 6. | PB vector 3/3/4/4/5/5/6/6 at levels 6/8/9/12/13/16/17/20; TCE/Stars and long rest match. |
| Druid `subclass:druid:wildfire:cauterizing-flames` | WIS modifier, minimum 1, long rest, Wildfire (TCE), gained at 10. | At the gate with WIS 14: 2; score matrix 1/10/20/30 yields 1/1/5/10. Key/formula/recovery/source/subclass match. |
| Fighter `class:fighter:second-wind` | Fixed 1 use, short rest, PHB/base class, gained at 1. | Fighter 1 generated exactly one pool, max 1, fixed formula, short rest, PHB; no subclass key. |
| Fighter `class:fighter:action-surge` | Gained at 2; 1 use, 2 uses at Fighter 17; short rest; once on your turn. | Absent at Fighter 1; 1 at 2/16 and 2 at 17; short rest and `once-on-your-turn` match. |
| Fighter `class:fighter:indomitable` | Long rest; 1 use at 9, 2 at 13, 3 at 17. | Absent at 8; maxima 1/1/2/2/3 at levels 9/12/13/16/17; PHB/base key and long rest match. |
| Fighter `subclass:fighter:battle-master:superiority-dice` | 4/5/6 dice at 3/7/15; d8/d10/d12 at 3/10/18; short rest; maneuvers share the pool; Relentless +1 on empty initiative from 15. | Counts/dice match: 4d8 (3), 5d8 (9), 5d10 (10/14), 6d10 (15/17), 6d12 (18); short rest; +1 empty-only initiative recovery starts at 15. PHB/Battle Master key and shared flag match. Consumer list is empty (K-B047). |
| Fighter `subclass:fighter:arcane-archer:arcane-shot` | Fixed 2 uses, short rest, Arcane Archer (XGE); Ever-Ready +1 on empty initiative from 15. | 2/2, short rest, XGE/Arcane Archer; initiative recovery 0 at 14 and 1 at 15 with empty-only condition. |
| Fighter `subclass:fighter:cavalier:unwavering-mark` | STR modifier, minimum 1, long rest, Cavalier (XGE), gained at 3. | At STR 14: 2; score matrix 1/10/20/30 yields 1/1/5/10. Key/formula/recovery/source/subclass match. |
| Fighter `subclass:fighter:cavalier:warding-maneuver` | CON modifier, minimum 1, long rest, Cavalier (XGE), gained at 7. | At CON 14: 2; score matrix 1/10/20/30 yields 1/1/5/10. Key/formula/recovery/source/subclass match. |
| Fighter `subclass:fighter:samurai:fighting-spirit` | Fixed 3 uses, long rest, Samurai (XGE); +1 on empty initiative from 10. | 3/3, long rest, XGE/Samurai; initiative recovery 0 at 9 and 1 at 10 with empty-only condition. |
| Fighter `subclass:fighter:samurai:strength-before-death` | Fixed 1 use, long rest, Samurai (XGE), gained at 18. | Absent at 17; 1/1 at 18; key/source/subclass/recovery match. |
| Fighter `subclass:fighter:rune-knight:giants-might` | PB uses, long rest, Rune Knight (TCE), gained at 3. | PB vector 2/2/3/3/4/4/5/5/6/6 at levels 3/4/5/8/9/12/13/16/17/20; TCE/Rune Knight and long rest match. |
| Fighter `subclass:fighter:rune-knight:runic-shield` | PB uses, long rest, Rune Knight (TCE), gained at 7. | PB vector 3/3/4/4/5/5/6/6 at levels 7/8/9/12/13/16/17/20; TCE/Rune Knight and long rest match. |
| Fighter `subclass:fighter:psi-warrior:psionic-energy-dice` | 2 x PB dice; d6/d8/d10/d12 at 3/5/11/17; long rest; +1 on empty initiative; shared pool. | Max/die pairs at levels 3/4/5/8/9/10/11/12/13/16/17/20 are 4d6/4d6/6d8/6d8/8d8/8d8/8d10/8d10/10d10/10d10/12d12/12d12. Long rest, +1 empty-only initiative, TCE/Psi Warrior, and shared flag match. Consumer list is empty (K-B047). |
| Fighter `subclass:fighter:psi-warrior:bulwark-of-force` | Fixed 1 free use, long rest, Psi Warrior (TCE), gained at 15; extra use costs one Psionic Energy Die. | Absent at 14; 1/1 at 15; additional-use cost references the exact Psionic Energy Dice key. |
| Fighter `subclass:fighter:psi-warrior:telekinetic-master` | Fixed 1 free use, long rest, Psi Warrior (TCE), gained at 18; extra use costs one Psionic Energy Die. | Absent at 17; 1/1 at 18; additional-use cost references the exact Psionic Energy Dice key. |
| Monk `class:monk:ki` | Monk-level count, short-rest recovery; all Ki features share the pool; at 20, +4 on empty initiative. | Maxima 2/3/19/20 at Monk levels 2/3/19/20; short rest; initiative recovery is 0 below 20 and +4 when empty at 20; PHB/base key and `shared:true`. Consumer list is empty (K-B047); Drunkard's Luck cost is missing (K-B048). |
| Monk `subclass:monk:mercy:hand-of-ultimate-mercy` | Fixed 1 use, long rest, Mercy (TCE), gained at 17; costs 5 Ki. | Absent at 16; 1/1 at 17; TCE/Mercy and long rest match; exact cost `class:monk:ki`, amount 5. |
| Monk `subclass:monk:ascendant-dragon:breath-of-the-dragon` | PB free uses, long rest, Ascendant Dragon (FToD), gained at 3; additional uses cost Ki. | PB vector 2/2/3/3/4/4/5/5/6/6 at levels 3/4/5/8/9/12/13/16/17/20; FToD/Ascendant Dragon and long rest match; additional-use cost references `class:monk:ki`. |
| Monk `subclass:monk:ascendant-dragon:wings-of-the-dragon` | Fixed 1 free use, long rest, Ascendant Dragon (FToD), gained at 6; additional uses cost Ki. | Absent at 5; 1/1 at 6; FToD/Ascendant Dragon and long rest match; additional-use cost references `class:monk:ki`. |

### K-B044 subclass gate matrix

For every row, the key was absent at `level - 1` and present at the listed level. The actual maximum/recovery at the gate is shown; any already-unlocked base/subclass keys in the same profile were expected, and no unrelated subclass key appeared.

| Definition key | Gate | Actual at gate |
|---|---:|---|
| `subclass:druid:dreams:balm-of-the-summer-court` | 2 | 2d6, long rest, XGE/Dreams |
| `subclass:druid:dreams:hidden-paths` | 10 | 2, WIS modifier (minimum 1), long rest, XGE/Dreams |
| `subclass:druid:shepherd:spirit-totem` | 2 | 1, fixed, short rest, XGE/Shepherd |
| `subclass:druid:stars:star-map-guiding-bolt` | 2 | 2, PB, long rest, TCE/Stars |
| `subclass:druid:stars:cosmic-omen` | 6 | 3, PB, long rest, TCE/Stars |
| `subclass:druid:wildfire:cauterizing-flames` | 10 | 2, WIS modifier (minimum 1), long rest, TCE/Wildfire |
| `subclass:fighter:battle-master:superiority-dice` | 3 | 4d8, short rest, PHB/Battle Master |
| `subclass:fighter:arcane-archer:arcane-shot` | 3 | 2, fixed, short rest, XGE/Arcane Archer |
| `subclass:fighter:cavalier:unwavering-mark` | 3 | 2, STR modifier (minimum 1), long rest, XGE/Cavalier |
| `subclass:fighter:cavalier:warding-maneuver` | 7 | 2, CON modifier (minimum 1), long rest, XGE/Cavalier |
| `subclass:fighter:samurai:fighting-spirit` | 3 | 3, fixed, long rest, XGE/Samurai |
| `subclass:fighter:samurai:strength-before-death` | 18 | 1, fixed, long rest, XGE/Samurai |
| `subclass:fighter:rune-knight:giants-might` | 3 | 2, PB, long rest, TCE/Rune Knight |
| `subclass:fighter:rune-knight:runic-shield` | 7 | 3, PB, long rest, TCE/Rune Knight |
| `subclass:fighter:psi-warrior:psionic-energy-dice` | 3 | 4d6, 2 x PB, long rest, TCE/Psi Warrior |
| `subclass:fighter:psi-warrior:bulwark-of-force` | 15 | 1, fixed, long rest, TCE/Psi Warrior |
| `subclass:fighter:psi-warrior:telekinetic-master` | 18 | 1, fixed, long rest, TCE/Psi Warrior |
| `subclass:monk:mercy:hand-of-ultimate-mercy` | 17 | 1, fixed, long rest, TCE/Mercy |
| `subclass:monk:ascendant-dragon:breath-of-the-dragon` | 3 | 2, PB, long rest, FToD/Ascendant Dragon |
| `subclass:monk:ascendant-dragon:wings-of-the-dragon` | 6 | 1, fixed, long rest, FToD/Ascendant Dragon |

### Shared consumers, pool keys, and costs

| Shared pool / consumer family | Expected | Actual | Outcome |
|---|---|---|---|
| `class:druid:wild-shape` | One shared Wild Shape pool. Moon abilities, Starry Form, Wildfire Spirit, and Wild Companion spend/choose this pool; Wild Companion may instead pay a spell slot. | One key, max 2 at Druid 2, short rest, `shared:true`. The consumer array contains Starry Form when Stars is selected and Wildfire Spirit when Wildfire is selected; it is empty for Moon. Wild Companion's active-feature cost correctly lists the Wild Shape key and spell slot as alternatives, without a second pool. | Key/deduplication pass; Moon consumer enumeration is missing from the pool's consumer list. |
| `subclass:fighter:battle-master:superiority-dice` | All maneuvers use one shared dice pool. | One key, `shared:true`, correct count/die/recovery; `consumers:[]`; no per-maneuver pools. | Pool identity passes; consumer enumeration is missing. |
| `subclass:fighter:psi-warrior:psionic-energy-dice` | All Psionic Energy Dice abilities share one pool; paid additional uses must point to it. | One key, `shared:true`; Bulwark and Telekinetic Master both link additional uses to this exact key; `consumers:[]`; no duplicate dice pool. | Explicit additional-use links pass; consumer enumeration is incomplete. |
| `class:monk:ki` | All Ki-powered subclass features share the Monk-level pool. | One key, `shared:true`; Mercy, Ascendant Dragon, Quickened Healing, and Focused Aim cost links point to this key. The pool's `consumers` array is empty; Drunkard's Luck has no cost/consumer output. | Pool identity/deduplication passes; consumer enumeration and one explicit cost are missing. |
| `subclass:fighter:rune-knight:rune:1` through `...:rune:5` | Each known rune has an independent 1-use short-rest pool. | At levels 3/7/10/15, 2/3/4/5 separate keys appear; each has max 1, short-rest recovery, TCE/Rune Knight metadata. | PASS; no merged or missing Rune pool. |

Explicit cost comparison:

| Feature | Rules cost | Actual output |
|---|---|---|
| Druid TCE Wild Companion | Wild Shape use **or** spell slot | Both alternatives appear on the active feature at Druid 2; correct pool key, no extra pool. |
| Fighter Psi Warrior Bulwark of Force | One Psionic Energy Die for additional use | Correct additional-use link to `subclass:fighter:psi-warrior:psionic-energy-dice`. |
| Fighter Psi Warrior Telekinetic Master | One Psionic Energy Die for additional use | Correct additional-use link to the same Psionic Energy Dice key. |
| Monk Mercy Hand of Ultimate Mercy | 5 Ki | Correct `class:monk:ki`, amount 5. |
| Monk Ascendant Dragon Breath of the Dragon | Ki for additional uses after free PB uses | Correct additional-use link to `class:monk:ki`; free pool remains separately keyed. |
| Monk Ascendant Dragon Wings of the Dragon | Ki for additional uses after the free use | Correct additional-use link to `class:monk:ki`; free pool remains separately keyed. |
| Monk TCE Quickened Healing | 2 Ki | Active feature at level 2 lists amount 2 on `class:monk:ki`. |
| Monk TCE Focused Aim | 1–3 Ki | Active feature at level 2 lists amount `1-3` on `class:monk:ki`. |
| Druid Wildfire Spirit paid reuse | Spell slot to revive the dismissed spirit | **Missing:** Wild Shape consumer exists, but no paid-reuse/spell-slot cost output exists. |
| Monk Drunkard's Luck | 2 Ki | **Missing:** at Monk 6 Drunken Master, Ki is present but has `costs:[]`, `consumers:[]`; no Drunkard's Luck cost output exists. |

Thus the eight represented cost definitions are correct, while the two independent RAW cost expectations above are absent. The Telekinetic Master additional-use die link is present; the spell-casting condition in the feature is not a pool/payment cost and was not treated as an extra resource-cost assertion.

### TCE unlocks, N/A checks, and output audit

- All three TCE option checkboxes were initially false in the new character's settings. For each option, level 1 off/on and level 2 off/on were applied independently (12 profiles). Selecting below level 2 left `activeTceFeatures` empty. At level 2, Wild Companion exposed its two alternatives; Quickened Healing exposed 2 Ki; Focused Aim exposed 1–3 Ki. No unrelated TCE option activated. No Fighter class-wide TCE optional feature is present in this three-option subset; its TCE Rune Knight/Psi Warrior resources were tested in the subclass rows above.
- K-B045 N/A is limited to `recoveryFromLevel` switches: none occur in the full 25-row owned catalog slice, three owned TCE option definitions, or generated Rune pool family. Initiative recovery is a different rule and was explicitly checked: Superiority Dice and Arcane Shot change from 0 to 1 empty-only initiative recovery at Fighter 15; Fighting Spirit changes at Samurai 10; Ki changes from 0 to 4 at Monk 20.
- K-B049 N/A is limited to `recoveryOnly` resource definitions: the full 25-row owned catalog slice, three owned TCE options, and five generated Rune keys contain zero such rows. The oracle also describes Land Natural Recovery and Dreams Walker in Dreams as short-rest-triggered recovery features, not finite resource pools; those behaviors are not represented as `recoveryOnly` definitions here and are not claimed as runtime-tested by this N/A.
- No unexpected class-resource key or wrong key, maximum formula, ordinary rest recovery, source, or subclass gate was observed in the executed profiles. The only discrepancies are the incomplete consumer listings and two missing costs recorded above. TCE/FToD/XGE metadata is treated as actual output, never as the rules oracle.

### Evidence and cleanup

- Contract: Case intent and required outputs are reproduced in the K-B case tables above.
- Rules oracle: Druid/Fighter/Monk named-feature expectations are summarized in the case tables above.
- Actual catalog inventory: Resource definitions, keys, and outputs relevant to this slice are included above.
- Browser evidence: each fixture's selected class/level/subclass/ability/TCE setting and generated resources were read from the isolated `dnd_skills_db` record before cleanup; the matrices above contain the normalized outputs and comparisons.
- Cleanup: the isolated origin was reloaded after clearing localStorage and sessionStorage; both key lists were empty, `dnd_skills_db` and `dnd_skills_class_feature_settings` were null, and the server listener on port 49383 was stopped. No product source or test plan was changed.


## K-B040–K-B050 class-sliced boundary follow-up (Tester 4)

### Scope and execution

Owned class slice: Paladin, Warlock, and Wizard. The full `classResourceData` slice contained 33 rows: Paladin 6, Warlock 15, Wizard 12. The 170 unique primary profiles exercised level-1/below-unlock and unlock levels, wrong-subclass selections, PB boundaries, ability-score boundaries, level tiers, TCE off/on, and all levels for both count-scaling resources. All 170 profiles completed; the corrected run had no runtime error. Eight of the Warlock profiles (levels 10–17) were reapplied as explicit Mystic Arcanum boundary assertions. A separate Crown consumer attempt was blocked because no `crown` option exists in the UI.

The temporary browser origin was `http://127.0.0.1:8772/cr.html`; temporary characters were `K-B-T4-20261019-0140`, `K-B-T4-Arcanum-20261019-0140`, and `K-B-T4-CDConsumer-20261019-0140`. The fresh-origin baseline was empty and the final cleanup check was `localStorage` keys `[]`. The first matrix attempt stopped at 85/170 due a class-switch collision and was excluded; its temporary storage was cleared before the corrected full run. Current charges were not used as a maximum assertion because reapplying a profile preserves already-current values; maximum, key, formula, recovery, source, gates, and costs were compared.

Independent expectations use the named 2014 sources and features listed in the per-case oracle tables. Generated metadata was compared against those values; implementation data was not used as the rules oracle.

| Case | Applicable definitions | Unique fixtures | Status | Result |
|---|---:|---:|---|---|
| K-B040 fixed maxima | 21 | 39 | FAIL | All fixed maxima and unlock outputs matched. Two fixture profiles also exposed the Celestial subclass-source mismatch below. |
| K-B041 PB maxima | 4, plus Harness spell-slot cap | 45 | PASS | All PB maxima matched PB from total character level; Harness `half-pb-up` spell-slot cap matched at PB boundaries. |
| K-B042 ability maxima | 4 | 28 | PASS | All minimum-1 and ability-modifier boundaries matched. |
| K-B043 level tiers | 2 `classResourceData` rows, plus Mystic Arcanum tiers | 20 | PASS | Harness, Portent, and all four Mystic Arcanum unlock tiers matched. |
| K-B044 subclass gates | 26 | 52 | FAIL | Below-unlock and wrong-subclass outputs were absent; eligible rows appeared. Three profiles failed only on Celestial subclass-source metadata. |
| K-B045 `recoveryFromLevel` | 0 | 0 | N/A | Full assigned slice checked; no definition has `recoveryFromLevel`. |
| K-B046 die/count/uses scaling | 2 | 42 | FAIL | Lay on Hands and Healing Light maxima/die matched at every level; the 20 Celestial profiles also report the source-metadata mismatch. |
| K-B047 shared pool consumers/key | 1 | 8 executed; Crown blocked | BLOCKED | All eight assigned Paladin oaths had exactly one `class:paladin:channel-divinity` row with `shared=true`. Actual `consumers` was empty; the oracle lists nine oath consumers including Crown, which the UI cannot select. |
| K-B048 costs and alternatives | 4 cost-bearing rows | 20 | PASS | All pool/item costs and spell-slot recovery costs matched. No alternative-cost definition exists in this slice. |
| K-B049 recovery-only presence | 0 | 0 | N/A | Full assigned slice checked; no definition has `recoveryOnly`. |
| K-B050 TCE option unlock | 1 | 17 | PASS | Harness Divine Power defaulted off; off/on and level 2/3 gates, use tiers, Channel Divinity cost, and half-PB-up slot cap matched. |

### Expected vs actual — all 33 catalog definitions

`Lx expected/actual` lists the expected and generated maxima at the checked level or ability-score boundary. Unless otherwise called out, each row was absent at `unlock - 1`, present at unlock, had the expected pool key, formula, recovery, feature source, and pool mode, and had no unexpected sibling key. `SR/LR` is represented by the application's short-rest recovery label; `LR` is long rest.

#### Paladin — 6 definitions

| Pool key (unlock) | Expected | Actual |
|---|---|---|
| `class:paladin:divine-sense` (1) | `1 + CHA mod`, min 1; LR; PHB. | Formula matched. CHA 1/10/12/14/20/30: `1/1, 1/1, 2/2, 3/3, 6/6, 11/11`; same values at levels 1 and 15. |
| `class:paladin:lay-on-hands` (1) | Paladin level × 5 HP; LR; PHB; hit-points pool. | Formula, mode, and recovery matched at every level 1–20: 5/5, 10/10, 15/15, 20/20, 25/25, 30/30, 35/35, 40/40, 45/45, 50/50, 55/55, 60/60, 65/65, 70/70, 75/75, 80/80, 85/85, 90/90, 95/95, 100/100. |
| `class:paladin:channel-divinity` (3) | One shared use; short or long rest; PHB. | Level 2 absent; level 3 and above 1/1. Exactly one row and one key across each of the eight tested oaths; `shared=true`. The consumer list was `[]` in every record; see K-B047. |
| `subclass:paladin:glory:glorious-defense` (15) | CHA mod, min 1; LR; TCE. | Formula and recovery matched. CHA 1/10/12/14/20/30: 1/1, 1/1, 1/1, 2/2, 5/5, 10/10. |
| `subclass:paladin:watchers:vigilant-rebuke` (15) | CHA mod, min 1; LR; TCE. | Formula and recovery matched. CHA 1/10/12/14/20/30: 1/1, 1/1, 1/1, 2/2, 5/5, 10/10. |
| `class:paladin:harness-divine-power` (3, TCE opt-in) | Uses 1 at 3, 2 at 7, 3 at 15; LR; each use costs one Channel Divinity and restores one spell slot no higher than `ceil(PB/2)`. | Default off; level 2 absent even when enabled; enabled at level 3. Expected/actual uses: L3/L6 1/1, L7/L14 2/2, L15/L20 3/3. Channel Divinity cost matched. Slot cap formula matched: levels 3–4 cap 1; 5–8 cap 2; 9–12 cap 2; 13–16 cap 3; 17–20 cap 3. |

#### Warlock — 15 definitions

| Pool key (unlock) | Expected | Actual |
|---|---|---|
| `class:warlock:eldritch-master` (20) | 1/LR; PHB; after 1 minute restores Pact Magic slots. | 19 absent; 20 1/1, LR, PHB; recovery target `class:warlock:pact-slots`. |
| `subclass:warlock:archfey:fey-presence` (1) | 1/SR/LR; PHB. | 0 absent; 1 and later 1/1, short-rest representation, PHB. |
| `subclass:warlock:archfey:misty-escape` (6) | 1/SR/LR; PHB. | 5 absent; 6 and later 1/1, short-rest representation, PHB. |
| `subclass:warlock:archfey:dark-delirium` (14) | 1/SR/LR; PHB. | 13 absent; 14 and later 1/1, short-rest representation, PHB. |
| `subclass:warlock:fiend:dark-ones-own-luck` (6) | 1/SR/LR; PHB. | 5 absent; 6 and later 1/1, short-rest representation, PHB. |
| `subclass:warlock:fiend:hurl-through-hell` (14) | 1/LR; PHB. | 13 absent; 14 and later 1/1, LR, PHB. |
| `subclass:warlock:great-old-one:entropic-ward` (6) | 1/SR/LR; PHB. | 5 absent; 6 and later 1/1, short-rest representation, PHB. |
| `subclass:warlock:hexblade:hexblades-curse` (1) | 1/SR/LR; XGE. | 0 absent; 1 and later 1/1, short-rest representation, XGE. |
| `subclass:warlock:hexblade:accursed-specter` (6) | 1/LR; XGE. | 5 absent; 6 and later 1/1, LR, XGE. |
| `subclass:warlock:celestial:healing-light` (1) | Warlock level + 1 d6; LR; XGE; Celestial subclass source XGE. | Counts at levels 1–20 were exactly 2/2 through 21/21; d6, dice mode, and LR matched. Feature `sourceVersion=XGE`, but actual `subclassSource=TCE` (expected XGE); FAIL. |
| `subclass:warlock:celestial:searing-vengeance` (14) | 1/LR; XGE; Celestial subclass source XGE. | 13 absent; 14 and later 1/1, LR, feature `sourceVersion=XGE`; actual `subclassSource=TCE` (expected XGE); FAIL. |
| `subclass:warlock:fathomless:tentacle-of-the-deeps` (1) | PB/LR; TCE. | Formula matched at PB boundaries: L1/4=2/2; L5/8=3/3; L9/12=4/4; L13/16=5/5; L17/20=6/6. |
| `subclass:warlock:fathomless:fathomless-plunge` (14) | 1/LR; TCE. | 13 absent; 14 and later 1/1, LR, TCE. |
| `subclass:warlock:genie:bottled-respite` (1) | PB/LR; TCE. | Formula matched at PB boundaries: L1/4=2/2; L5/8=3/3; L9/12=4/4; L13/16=5/5; L17/20=6/6. |
| `subclass:warlock:genie:elemental-gift` (6) | PB/LR; TCE. | L5 absent; L6/8=3/3; L9/12=4/4; L13/16=5/5; L17/20=6/6. |

The Celestial subclass is published in XGE; the K-S091 plan label says TCE, but that label was not used as the rules oracle. The resource feature source is correctly XGE; the selected subclass source metadata is not.

#### Wizard — 12 definitions

| Pool key (unlock) | Expected | Actual |
|---|---|---|
| `subclass:wizard:conjuration:benign-transposition` (6) | 1/LR; regains its use after casting a 1st+ level Conjuration spell; PHB. | 5 absent; 6 1/1, LR, `conjuration-spell-slot` recovery trigger. |
| `subclass:wizard:divination:portent` (2) | 2/LR; increases to 3 at 14; PHB. | L1 absent; L2/L13=2/2; L14 and later=3/3. |
| `subclass:wizard:divination:third-eye` (10) | 1/SR/LR; PHB. | 9 absent; 10 and later 1/1, short-rest representation. |
| `subclass:wizard:evocation:overchannel` (14) | First use/LR; further same-rest uses incur increasing damage; PHB. | 13 absent; 14 1/1, LR; additional-use damage cost metadata matched. |
| `subclass:wizard:illusion:illusory-self` (10) | 1/SR/LR; PHB. | 9 absent; 10 and later 1/1, short-rest representation. |
| `subclass:wizard:transmutation:shapechanger` (10) | 1/SR/LR; PHB. | 9 absent; 10 and later 1/1, short-rest representation. |
| `subclass:wizard:transmutation:major-transformation` (14) | 1/LR; consumes Transmuter's Stone; PHB. | 13 absent; 14 1/1, LR; item consumption matched. |
| `class:wizard:signature-spell-1` (20) | 1 free cast/SR/LR; PHB. | 19 absent; 20 1/1, `free-cast` mode, short-rest representation. |
| `class:wizard:signature-spell-2` (20) | Separate 1 free cast/SR/LR; PHB. | 19 absent; 20 1/1, separate key and `free-cast` mode, short-rest representation. |
| `subclass:wizard:war-magic:power-surge` (2) | INT mod, min 1; begins with 1, LR reset-to-1; Counterspell/Dispel Magic and empty Arcane Deflection events; XGE. | Formula, initial value, reset, and both recovery events matched. INT 1/10/12/14/20/30: 1/1, 1/1, 1/1, 2/2, 5/5, 10/10. |
| `subclass:wizard:bladesinging:bladesong` (2) | PB/LR; TCE version. | Formula matched: L2/4=2/2; L5/8=3/3; L9/12=4/4; L13/16=5/5; L17/20=6/6. |
| `subclass:wizard:order-of-scribes:manifest-mind` (6) | 1/LR; further uses cost a spell slot; TCE. | 5 absent; 6 1/1, LR; additional-use spell-slot cost matched. |

### Shared consumers, supplemental thresholds, and category N/A

- **K-B047 / Channel Divinity:** the rules reference lists Channel Divinity consumers for Ancients, Devotion, Vengeance, Crown, Conquest, Redemption, Oathbreaker, Glory, and Watchers. The eight assigned oath fixtures each produced exactly one `class:paladin:channel-divinity` row with `shared=true`; no duplicate pool key appeared. However, every generated `consumers` array was empty, and an attempt to select Crown at Paladin 3 failed because no `crown` option is available in the UI/catalog. Thus the pool identity checks pass for the eight assigned oaths, but complete consumer reporting/coverage is not established; K-B047 remains blocked with a concrete missing-output finding.
- **Warlock Mystic Arcanum (K-B043 supplemental):** eight level-boundary profiles all matched the oracle: L10 none; L11/L12 6th; L13/L14 6th and 7th; L15/L16 6th–8th; L17 6th–9th. Every pool was 1/1, long-rest, with distinct keys `class:warlock:mystic-arcanum:6` through `:9`.
- **Additional rule-reference threshold checks:** Wizard Arcane Recovery at level 1 was absent (expected once daily, activated after a short rest to recover eligible slots, not automatic SR slot recovery). Abjuration Arcane Ward was absent at level 2 (expected 6 HP for INT 14) and level 20 (expected 42 HP), including its qualifying-spell recovery output. Genie Sanctuary Vessel was absent at level 10 (expected feature's long-rest restriction); Limited Wish was absent at level 14 (expected one use followed by 1d4 long rests). Their immediately preceding levels were also checked and expected absence was observed.
- **K-B045 N/A:** no `recoveryFromLevel` entry in the complete Paladin/Warlock/Wizard definition slice; no switch fixture applies.
- **K-B049 N/A:** no `recoveryOnly` entry in the complete slice; no recovery-only catalog presence fixture applies. Arcane Recovery was checked separately above and remains a missing rule-defined output.
- The complete slice contains no `dieByLevel` row and no alternative-cost row. The two count-scaling rows (Lay on Hands and Healing Light) were checked at all class levels 1–20; Healing Light's d6 die remained correct. The four cost-bearing definitions are Harness Divine Power (Channel Divinity), Overchannel (additional-use damage), Major Transformation (Transmuter's Stone), and Manifest Mind (additional-use spell slot). Costs, item, and additional-use metadata matched.
- **Unexpected class-resource keys:** none in the 170-profile matrix. **Wrong maximum/formula/recovery/cost/pool key:** none among the 33 listed definitions; the only catalog metadata mismatches are the two Celestial `subclassSource` values, plus the missing Paladin consumer list. The separate missing rule-defined outputs are enumerated above.

### Evidence

- Contract: Case intent and required outputs are reproduced in the K-B case tables above.
- Independent oracle: Paladin, Warlock, and Wizard named-feature rules are listed in the K-S/K-B oracle rows above; do not rely on historical code line numbers.
- Inventory and actual output fields are fully listed in this archive's class/resource tables.
- Primary browser result: 170 profile inputs, category tags, expected outputs, actual outputs, special-threshold checks, and cleanup are included below; no temporary file is required.
- Mystic Arcanum 8-profile recheck and Crown selector attempt were captured in the browser execution for this follow-up; both temporary characters were cleared and the final `localStorage` check was empty.

### Tester 4 disposition

K-B040–K-B050 matrix execution is complete for the enumerated 33 definitions, with K-B045/K-B049 verified N/A. The assigned follow-up is **not fully clear to close**: K-B047 remains blocked by the unavailable Crown selector and has an empty consumer-output list; the Celestial subclass-source metadata mismatch and the four separate rule-defined missing outputs are documented above. This does not declare Step K complete.


## K-B044 post-fix audit and focused threshold retest — 2026-10-22

The Group 1 record documents the post-fix UI retest across 50 Bard/Cleric/Rogue profiles. I independently audited the eight K-B044 feature definitions below against the 2014 rules evidence cited in this report and the expected metadata contract, then applied 16 additional threshold fixtures through the normal class-resource UI flow. For each fixture, the generated pool's presence/absence, key, owner, selected subclass/source, maximum, and recovery were checked; Animating Performance's level-3 spell-slot minimum and Divine Intervention's success-only seven-day trigger metadata were also checked. All 16 focused fixtures passed, and the prior 50-profile post-fix evidence remains consistent.

| Feature | Gate | Focused profile IDs / exact inputs | Audit result |
|---|---|---|---|
| Creation — Animating Performance | Bard 6; TCE | R2F-01-B / R2F-01-A: Bard 5 / 6, Creation | Absent below; present at unlock with 1/LR and 3rd-level minimum for paid reuse. |
| Divine Intervention | Cleric 10; PHB | R2F-02-B / R2F-02-A: Cleric 9 / 10, Knowledge | Absent below; present at unlock with success-only 7-day recovery metadata. |
| Knowledge — Visions of the Past | Cleric 17; PHB | R2F-03-B / R2F-03-A: Cleric 16 / 17, Knowledge | Absent below; present at unlock, 1/SR-or-LR representation. |
| Order — Embodiment of the Law | Cleric 6; TCE | R2F-04-B / R2F-04-A: Cleric 5 / 6, Order | Absent below; present at unlock with WIS modifier (minimum 1) / LR. |
| Stroke of Luck | Rogue 20; PHB | R2F-05-B / R2F-05-A: Rogue 19 / 20, Thief | Absent below; present at 20 as a Rogue class-owned pool, not Thief-owned. |
| Arcane Trickster — Spell Thief | Rogue 17; PHB | R2F-06-B / R2F-06-A: Rogue 16 / 17, Arcane Trickster | Absent below; present at unlock, 1/LR. |
| Inquisitive — Unerring Eye | Rogue 9; XGE | R2F-07-B / R2F-07-A: Rogue 8 / 9, Inquisitive | Absent below; present at unlock with WIS modifier (minimum 1) / LR. |
| Swashbuckler — Master Duelist | Rogue 17; XGE | R2F-08-B / R2F-08-A: Rogue 16 / 17, Swashbuckler | Absent below; present at unlock, 1/SR-or-LR representation. |

Current output is compared with the gates, keys, owners, formulas, and sources listed in this archive. The 16 focused results and 50-profile matrix close the K-B044 audit; earlier missing-output findings are historical, not current failures. This closure does not change the separate paid-action NOT RUN boundary for K-B048.

#### K-B044 post-fix gate audit and 56-profile retest — 2026-10-22

Re-ran the complete T4 K-B044 slice through the class-resource UI apply/confirm flow after the Group 2 Bottled Respite fix and Group 3 Celestial source fix. All 56 tagged profiles were applied and checked; each profile was checked against every applicable row below, including absence before unlock and for an unselected subclass. Assertions covered resource key, owner, selected subclass and source metadata, maximum, and recovery. All 26 definitions passed.

| Definition | Unlock / source | Retest fixtures | Result |
|---|---|---|---|
| Paladin Glory — Glorious Defense | 15 / TCE | F005 L14, F006 L15 | Absent below; present with expected metadata at unlock. |
| Paladin Watchers — Vigilant Rebuke | 15 / TCE | F008 L14, F009 L15 | Absent below; present with expected metadata at unlock. |
| Warlock Archfey — Fey Presence | 1 / PHB | F013 L1 | Present with expected metadata. |
| Warlock Archfey — Misty Escape | 6 / PHB | F015 L5, F016 L6 | Absent below; present at unlock. |
| Warlock Archfey — Dark Delirium | 14 / PHB | F018 L13, F019 L14 | Absent below; present at unlock. |
| Warlock Fiend — Dark One's Own Luck | 6 / PHB | F021 L5, F017 L6 | Absent below; present at unlock. |
| Warlock Fiend — Hurl Through Hell | 14 / PHB | F022 L13, F020 L14 | Absent below; present at unlock. |
| Warlock Great Old One — Entropic Ward | 6 / PHB | F023 L5, F024 L6 | Absent below; present at unlock. |
| Warlock Hexblade — Hexblade's Curse | 1 / XGE | F025 L1 | Present with expected metadata. |
| Warlock Hexblade — Accursed Specter | 6 / XGE | F026 L5, F027 L6 | Absent below; present at unlock. |
| Warlock Celestial — Healing Light | 1 / XGE | F028 L1, F029 L13, F030 L14 | Present; the selected-subclass and feature sources both report XGE. |
| Warlock Celestial — Searing Vengeance | 14 / XGE | F029 L13, F030 L14 | Absent below; present at unlock; source metadata reports XGE. |
| Warlock Fathomless — Tentacle of the Deeps | 1 / TCE | F031 L1, F032 L13, F033 L14 | Present with expected PB maximum and metadata. |
| Warlock Fathomless — Fathomless Plunge | 14 / TCE | F032 L13, F033 L14 | Absent below; present at unlock. |
| Warlock Genie — Bottled Respite | 1 / TCE | F034 L1, F035 L5, F036 L6, F070 L9, F086 L10, F072 L13, F087 L14 | Present at all tested eligible levels with fixed 1/LR maximum; prior PB-maximum failure is cleared. |
| Warlock Genie — Elemental Gift | 6 / TCE | F035 L5, F036 L6, F070 L9, F086 L10, F072 L13, F087 L14 | Absent below; present at and above unlock with expected PB maximum. |
| Wizard Conjuration — Benign Transposition | 6 / PHB | F037 L5, F038 L6 | Absent below; present at unlock. |
| Wizard Divination — Portent | 2 / PHB | F041 L2, F043 L9, F044 L10 | Present with expected 2-use maximum at tested levels. |
| Wizard Divination — Third Eye | 10 / PHB | F043 L9, F044 L10 | Absent below; present at unlock. |
| Wizard Evocation — Overchannel | 14 / PHB | F046 L13, F047 L14 | Absent below; present at unlock. |
| Wizard Illusion — Illusory Self | 10 / PHB | F049 L9, F050 L10 | Absent below; present at unlock. |
| Wizard Transmutation — Shapechanger | 10 / PHB | F051 L9, F052 L10 | Absent below; present at unlock. |
| Wizard Transmutation — Major Transformation | 14 / PHB | F053 L13, F054 L14 | Absent below; present at unlock. |
| Wizard War Magic — Power Surge | 2 / XGE | F057 L2 | Present with expected INT-based maximum and reset metadata; event accumulation remains outside this gate test. |
| Wizard Bladesinging — Bladesong | 2 / TCE | F058 L2 | Present with expected PB maximum and metadata. |
| Wizard Order of Scribes — Manifest Mind | 6 / TCE | F059 L5, F060 L6 | Absent below; present at unlock. |

The 56 profiles comprise 5 Paladin, 29 Warlock, and 22 Wizard configurations. F012's below-level Warlock control was applied as Warlock 0 plus Fighter 1 because the UI rejects a character whose class levels are all zero; it generated no Warlock subclass resource. The four Abjuration profiles F039/F042/F045/F048 produced no Arcane Ward. Arcane Ward is an explicitly deferred accumulator/HP feature, not one of the 26 scored K-B044 definitions, so these are recorded as deferred-scope observations rather than failures.

**Retest disposition:** 56/56 profiles passed the K-B044 assertions. The three historical Celestial source mismatches and seven Genie maximum mismatches are cleared by the post-fix results; no gate-specific mismatch remains. The 2026-10-19 auditor's profile-error attribution review is superseded for closure purposes by this post-fix, assertion-attributed retest. No product code was changed during this audit.

The corrected inventory is **22 fixed / 3 PB** definitions (the fourth prior PB row, Genie Bottled Respite, is fixed at one free use per Long Rest). K-B040 now has 52 distinct tagged profiles; K-B041 has 42, including the separate Harness half-PB-up slot-recovery cap. The earlier 39/45 counts remain in their original table as historical aggregate values; this tagged rerun supersedes them for the corrected crosswalk. K-B044 is 56 profiles in the actual tagged output; the prior aggregate's 52 did not include all four distinct tagged wrong-subclass profiles. K-B045 and K-B049 remain N/A only for the absence of such rows in the complete 33-definition owned slice; this does not imply the RAW features noted below are absent.

## K-T crosswalk and detailed output evidence

The following is retained historical K-T001 evidence from before the final Group 3 metadata corrections. It documents what was tested and which links were absent at that point; final case dispositions and post-fix assertions remain authoritative above.

### Rage and Sorcery Points (Tester 1)

| Pool key | Supported consumers / relationship | Existing catalog/generated metadata |
|---|---|---|
| `class:barbarian:rage` | Rage use is the common pool for Rage-dependent subclass features. Supported examples in the independent reference include Berserker Frenzy (chosen when Rage starts), Ancestral Guardian Rage/Spirit Shield conditions, Storm Aura, Zealot Fanatical Focus (once per Rage) and Rage Beyond Death, Beast forms during Rage, and the Giant-path Rage-dependent features (`2014 feature rules summarized above`). These should resolve to this one pool, not duplicated per-feature pools. Consult the Spirits and Bolstering Magic are separate pools, not Rage consumers. | Eight L19 subclass fixtures each generated the one correct Rage key and 6/6/LR, but metadata is `shared:false`, `consumers:[]`, `costs:[]`; the catalog Rage row has no `shared:true` or consumer list, and no subclass resource-cost link targets this key (cross-check evidence recorded in this archive). Thus the shared flag is **FAIL** and the consumer-to-key links are absent from the captured catalog/output. |
| `class:sorcerer:sorcery-points` | Metamagic and Flexible Casting use the common points pool. Subclass/optional consumers in the assigned classes are Shadow Hound of Ill Omen (3) and Umbral Form (6); Aberrant Mind Psionic Sorcery (spell-level points), Revelation in Flesh (1+ by benefits), and Warping Implosion (5 for an additional use); Clockwork Soul Bastion of Law (1–5), Trance of Order (5 alternative), and Clockwork Cavalcade (7 alternative); and optional Magical Guidance (1) (`2014 feature rules summarized above`). Every point cost targets this same key. | The generated pool is shared and scales correctly, but its `consumers` array is empty. Captured consumer-side links to the key exist for Magical Guidance (1), Trance of Order (5), and Clockwork Cavalcade (7). Warping Implosion points to the key but omits amount 5. Links/cost metadata for Hound, Umbral Form, Psionic Sorcery, Revelation in Flesh, and Bastion of Law are absent in the inspected outputs. Generic Metamagic/Flexible Casting activation and payment were explicitly **not tested**; individual links remain unverified and are not claimed present. |

## K-T001 follow-up — Bardic Inspiration — 2026-10-19 10:27 JST

| Check | Expected | Actual | Result |
|---|---|---|---|
| Generated pool identity/count | A level-20 Bard has exactly one `class:bard:bardic-inspiration` pool; subclass abilities that consume Bardic Inspiration reuse it rather than creating duplicates. | Fresh Bard 20 Eloquence (CHA 14) fixture generated exactly one matching pool, 2/2, owner Bard, no subclass owner, source PHB. The other two Bard resources were separate Eloquence pools (`universal-speech` and `infectious-inspiration`), not duplicate Bardic Inspiration pools. | One-pool deduplication passes for this fixture; this also agrees with the seven assigned K-S Bard outputs. |
| Catalog/generated shared metadata | The audited K-T001 expectation is `shared:true` for the shared Bardic Inspiration pool. | The `classResourceData` Bardic Inspiration catalog row omits `shared:true`; the generated record reports `shared:false`. The generator writes `Boolean(definition.shared)`, so the omitted catalog flag produces the observed false value. | FAIL — shared metadata defect confirmed. |
| Bard/subclass consumer links | Bardic Inspiration consumers use the same `class:bard:bardic-inspiration` pool; no separate consumer pool is created. | The generated Bardic Inspiration record has `consumers:[]` and `costs:[]`. The catalog row has no `consumers` list, and a source search found no explicit `class:bard:bardic-inspiration` reference. The recovery oracle names Cutting Words, Combat Inspiration, Mantle of Inspiration, Blade Flourish, Psychic Blades, Animating Performance, Unsettling Words, and Tales from Beyond as consumers, but the product data does not link them to the pool. | Consumer-to-key linkage is absent/unverified; the consumer-coverage portion fails. |

**Evidence:** Unique fixture tags, resource keys, expected/actual values, cleanup, and statuses are captured in this archive; no external raw file is required.

**Disposition / retest:** Bard-specific K-T001 is **FAIL**: deduplication passes, but `shared:true` is missing and explicit consumer links are absent. Retest is **pending a product correction**; no product code was changed in this follow-up.


## K-T001 follow-up — Finding 2 — owned shared-pool crosswalk — 2026-10-19 10:58 JST

The full 25-row Bard/Cleric/Rogue catalog scan identifies exactly three shared or multi-consumer pool families: Bardic Inspiration, Cleric Channel Divinity, and Soulknife Psionic Energy Dice. No other assigned row is marked shared or has a multi-consumer pool definition. The per-feature use actions are not exposed by the resource UI; where a direct generated cost/consumer link is absent, that link is explicitly unverified rather than inferred from pool uniqueness.

| Pool | Expected consumers in Tester 2's class scope | Generated key / actual links | Finding 2 disposition |
|---|---|---|---|
| Bardic Inspiration | Cutting Words (Lore), Combat Inspiration (Valor), Mantle of Inspiration (Glamour), Blade Flourish (Swords), Psychic Blades (Whispers), and Unsettling Words (Eloquence) use the Bardic Inspiration resource. Creation's Mote of Potential and Animating Performance do not spend an additional Bardic Inspiration use. | The K-T001 Bard 20 Eloquence fixture and assigned Bard outputs generated one `class:bard:bardic-inspiration` pool per character, with no duplicate subclass pool. Actual metadata is `shared:false`, `consumers:[]`, and `costs:[]`; no feature-to-key cost references are present. | Key/count verified; consumer-to-key links are **not represented / unverified**. Shared flag fails. |
| Cleric Channel Divinity | Turn Undead and the assigned domain uses: Knowledge of the Ages / Read Thoughts; Preserve Life; Radiance of the Dawn; Charm Animals and Plants; Destructive Wrath; Invoke Duplicity; Guided Strike / War God's Blessing; Touch of Death; Arcane Abjuration; Artisan's Blessing; Path to the Grave; Order's Demand; Balm of Peace; and Twilight Sanctuary. Optional Harness Divine Power additionally spends one Channel Divinity. | The 39 generated Cleric observations use one `class:cleric:channel-divinity` key with `shared:true`; no per-domain duplicate pool appeared. The pool's `consumers:[]` and `costs:[]` are empty. Harness Divine Power's resource metadata has a forward cost link to the correct key with amount 1. No domain ability activation or individual domain-feature-to-key link is represented in the output. | Key/count and Harness cost link verified; domain consumer links are **not represented / unverified**. |
| Soulknife Psionic Energy Dice | Psi-Bolstered Knack, Psychic Whispers, Homing Strikes, Psychic Teleportation, Psychic Veil, and Rend Mind use the shared dice pool. Psychic Whispers and Psychic Veil have one free Long Rest use before their paid reuse; Rend Mind's paid reuse costs three dice. | Soulknife fixtures generated one `subclass:rogue:soulknife:psionic-energy-dice` pool with `shared:true` and `consumers:[]`. Psychic Whispers and Psychic Veil each have an `additionalUse:true` cost pointing to that exact key. No generated consumer/cost link was found for Psi-Bolstered Knack, Homing Strikes, Psychic Teleportation, or Rend Mind. | Key/count and two forward cost links verified; remaining consumer links/costs are **absent or unverified**. |

**Evidence:** Unique fixture tags, resource keys, expected/actual values, cleanup, and statuses are captured in this archive; no external raw file is required.

**Disposition:** Tester 2's owned-slice portion of Finding 2 is **PARTIALLY ADDRESSED / OPEN**. The expected pool families, generated keys, pool counts, shared flags, and all observed forward cost references are documented. Bardic Inspiration's shared flag is wrong; Bard/Cleric consumer arrays are empty; Soulknife's reverse consumer list and several die-spend links are missing. Direct feature-activation/payment verification is **BLOCKED**: this resource UI exposes generic pool use/rest controls but no Bard, Cleric, or Rogue feature activation/payment handlers. Missing metadata links remain confirmed findings, not blockers. K-B047 remains **FAIL**; global K-T001 Finding 2 remains open. No product edits were made.


#### Supported Oath consumer-to-key crosswalk — K-B047 / K-T001 Finding 2

The rules reference identifies the following supported Channel Divinity consumers. Each expected feature consumes the shared Paladin Channel Divinity pool, key `class:paladin:channel-divinity`; the eight runtime oath profiles each generated exactly one row with `shared=true` and that same key. Every generated consumer array was `[]`, so the pool identity is verified but feature-level consumer links are not represented in actual output. This is an explicit representation/evidence limitation, not a K-B047 pass. Harness Divine Power's actual cost link to this key, amount 1, was verified. Crown is SCAG and outside the supported plan scope; it is not a blocker and no Crown fixture was run.

| Supported oath | RAW Channel Divinity consumers | Expected shared key | Actual generated evidence |
|---|---|---|---|
| Ancients | Nature's Wrath; Turn the Faithless | `class:paladin:channel-divinity` | One row, `shared=true`; `consumers=[]`; no per-feature link |
| Devotion | Sacred Weapon; Turn the Unholy | `class:paladin:channel-divinity` | One row, `shared=true`; `consumers=[]`; no per-feature link |
| Vengeance | Abjure Enemy; Vow of Enmity | `class:paladin:channel-divinity` | One row, `shared=true`; `consumers=[]`; no per-feature link |
| Oathbreaker | Control Undead; Dreadful Aspect | `class:paladin:channel-divinity` | One row, `shared=true`; `consumers=[]`; no per-feature link |
| Conquest | Conquering Presence; Guided Strike | `class:paladin:channel-divinity` | One row, `shared=true`; `consumers=[]`; no per-feature link |
| Redemption | Emissary of Peace; Rebuke the Violent | `class:paladin:channel-divinity` | One row, `shared=true`; `consumers=[]`; no per-feature link |
| Glory | Peerless Athlete; Inspiring Smite | `class:paladin:channel-divinity` | One row, `shared=true`; `consumers=[]`; no per-feature link |
| Watchers | Watcher's Will; Abjure the Extraplanar | `class:paladin:channel-divinity` | One row, `shared=true`; `consumers=[]`; no per-feature link |

The owned 33-row class-resource slice contains only one explicit `shared:true` row: Paladin Channel Divinity. Other multi-consumer relationships are distinguished rather than overclaimed: Warlock Eldritch Master has an observed recovery target `class:warlock:pact-slots`, but individual Pact Magic spell/invocation consumers were not exhaustively linked; Wizard's nine level-20 spell-slot keys were observed in K-S, while Manifest Mind's actual cost is generic `{'type': 'spell-slot', 'additionalUse': true}` without a `poolKey`, and individual spell-to-key consumer links remain untested. Arcane Recovery remains deferred and is not an ordinary automatic Short Rest slot refill. K-B047 is still **BLOCKED** for absent feature-level consumer links; this owned-slice note does not close global K-T001.

#### Deferred outputs and source disposition

- Genie Limited Wish (levels 13/14), Sanctuary Vessel (levels 9/10), Arcane Ward (levels 2/20), and paid Bottled Respite re-entry are documented deferred/out-of-phase behavior, not in-scope failures. Arcane Recovery's RAW absence remains a K-S coverage note; it was not reclassified as an automatic Short Rest recovery failure.
- The Celestial expected source is **XGE**. The feature source is XGE; the actual selected-subclass source metadata remains TCE, so the metadata finding remains.
- K-B042/K-B043/K-B048/K-B050 remain PASS; K-B045/K-B049 remain qualified N/A; K-B040/K-B041/K-B044/K-B046 retain their evidenced failures; K-B047 remains BLOCKED. Step K is not declared complete.

#### Evidence

- Tagged 170-profile browser result: Per-profile inputs, category tags, generated definitions, shared-pool observations, and cleanup are included in the matrix below.
- Earlier 13-level Bottled Respite UI retest: Expected and actual values for each PB tier are listed in the K-S093/K-B044 tables above.
- Rules expectations: 2014 Cleric, Warlock, and Wizard named-feature rules and the case contracts stated in this archive. Product source was used only to locate generated metadata under test never as the rules oracle.

#### Exact 170-profile/category crosswalk

The runner's actual per-profile output is reproduced here. Ability scores are `STR/DEX/CON/INT/WIS/CHA`; `Harness ON` is the Paladin TCE option and is irrelevant/off for the other classes. Every row is a distinct profile input; the last column lists all of its deduplicated category memberships.

| ID | Tested inputs | K-B memberships |
|---|---|---|
| F001 | Paladin L0 / -; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B042, K-B046 |
| F002 | Paladin L1 / -; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B042, K-B046 |
| F003 | Paladin L2 / -; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B043, K-B046, K-B048, K-B050 |
| F004 | Paladin L3 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B043, K-B046, K-B047, K-B048, K-B050 |
| F005 | Paladin L14 / glory; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B042, K-B044 |
| F006 | Paladin L15 / glory; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B042, K-B044 |
| F007 | Paladin L15 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B044, K-B046 |
| F008 | Paladin L14 / watchers; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B042, K-B044 |
| F009 | Paladin L15 / watchers; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B042, K-B044 |
| F010 | Warlock L19 / archfey; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040 |
| F011 | Warlock L20 / archfey; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040 |
| F012 | Warlock L0 / -; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044, K-B046 |
| F013 | Warlock L1 / archfey; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F014 | Warlock L1 / fiend; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B044 |
| F015 | Warlock L5 / archfey; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F016 | Warlock L6 / archfey; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F017 | Warlock L6 / fiend; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F018 | Warlock L13 / archfey; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B043, K-B044 |
| F019 | Warlock L14 / archfey; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B043, K-B044 |
| F020 | Warlock L14 / fiend; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F021 | Warlock L5 / fiend; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F022 | Warlock L13 / fiend; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F023 | Warlock L5 / great-old-one; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F024 | Warlock L6 / great-old-one; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F025 | Warlock L1 / hexblade; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F026 | Warlock L5 / hexblade; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F027 | Warlock L6 / hexblade; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F028 | Warlock L1 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B044, K-B046 |
| F029 | Warlock L13 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044, K-B046 |
| F030 | Warlock L14 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044, K-B046 |
| F031 | Warlock L1 / fathomless; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041, K-B044 |
| F032 | Warlock L13 / fathomless; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B041, K-B044 |
| F033 | Warlock L14 / fathomless; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F034 | Warlock L1 / genie; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F035 | Warlock L5 / genie; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B041, K-B044 |
| F036 | Warlock L6 / genie; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B041, K-B044 |
| F037 | Wizard L5 / conjuration; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F038 | Wizard L6 / conjuration; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F039 | Wizard L6 / abjuration; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B044 |
| F040 | Wizard L1 / -; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041, K-B042, K-B043, K-B044 |
| F041 | Wizard L2 / divination; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B043, K-B044 |
| F042 | Wizard L2 / abjuration; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B044 |
| F043 | Wizard L9 / divination; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F044 | Wizard L10 / divination; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F045 | Wizard L10 / abjuration; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B044 |
| F046 | Wizard L13 / evocation; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044, K-B048 |
| F047 | Wizard L14 / evocation; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044, K-B048 |
| F048 | Wizard L14 / abjuration; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B044 |
| F049 | Wizard L9 / illusion; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F050 | Wizard L10 / illusion; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F051 | Wizard L9 / transmutation; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F052 | Wizard L10 / transmutation; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F053 | Wizard L13 / transmutation; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044, K-B048 |
| F054 | Wizard L14 / transmutation; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044, K-B048 |
| F055 | Wizard L19 / abjuration; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040 |
| F056 | Wizard L20 / abjuration; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040 |
| F057 | Wizard L2 / war-magic; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B042, K-B044 |
| F058 | Wizard L2 / bladesinging; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041, K-B044 |
| F059 | Wizard L5 / order-of-scribes; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044, K-B048 |
| F060 | Wizard L6 / order-of-scribes; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044, K-B048 |
| F061 | Warlock L4 / fathomless; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041 |
| F062 | Warlock L5 / fathomless; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041 |
| F063 | Warlock L8 / fathomless; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041 |
| F064 | Warlock L9 / fathomless; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041 |
| F065 | Warlock L12 / fathomless; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041 |
| F066 | Warlock L16 / fathomless; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041 |
| F067 | Warlock L17 / fathomless; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041 |
| F068 | Warlock L20 / fathomless; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041 |
| F069 | Warlock L8 / genie; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B041 |
| F070 | Warlock L9 / genie; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B041, K-B044 |
| F071 | Warlock L12 / genie; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B041 |
| F072 | Warlock L13 / genie; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B041, K-B044 |
| F073 | Warlock L16 / genie; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B041 |
| F074 | Warlock L17 / genie; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B041 |
| F075 | Warlock L20 / genie; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B041 |
| F076 | Wizard L4 / bladesinging; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041 |
| F077 | Wizard L5 / bladesinging; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041 |
| F078 | Wizard L8 / bladesinging; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041 |
| F079 | Wizard L9 / bladesinging; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041 |
| F080 | Wizard L12 / bladesinging; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041 |
| F081 | Wizard L13 / bladesinging; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041 |
| F082 | Wizard L16 / bladesinging; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041 |
| F083 | Wizard L17 / bladesinging; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041 |
| F084 | Wizard L20 / bladesinging; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B041 |
| F085 | Warlock L4 / genie; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040 |
| F086 | Warlock L10 / genie; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F087 | Warlock L14 / genie; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B040, K-B044 |
| F088 | Paladin L1 / -; STR14/DEX14/CON14/INT14/WIS14/CHA1; Harness OFF | K-B042 |
| F089 | Paladin L1 / -; STR14/DEX14/CON14/INT14/WIS14/CHA10; Harness OFF | K-B042 |
| F090 | Paladin L1 / -; STR14/DEX14/CON14/INT14/WIS14/CHA12; Harness OFF | K-B042 |
| F091 | Paladin L1 / -; STR14/DEX14/CON14/INT14/WIS14/CHA20; Harness OFF | K-B042 |
| F092 | Paladin L1 / -; STR14/DEX14/CON14/INT14/WIS14/CHA30; Harness OFF | K-B042 |
| F093 | Paladin L15 / glory; STR14/DEX14/CON14/INT14/WIS14/CHA1; Harness OFF | K-B042 |
| F094 | Paladin L15 / glory; STR14/DEX14/CON14/INT14/WIS14/CHA10; Harness OFF | K-B042 |
| F095 | Paladin L15 / glory; STR14/DEX14/CON14/INT14/WIS14/CHA12; Harness OFF | K-B042 |
| F096 | Paladin L15 / glory; STR14/DEX14/CON14/INT14/WIS14/CHA20; Harness OFF | K-B042 |
| F097 | Paladin L15 / glory; STR14/DEX14/CON14/INT14/WIS14/CHA30; Harness OFF | K-B042 |
| F098 | Paladin L15 / watchers; STR14/DEX14/CON14/INT14/WIS14/CHA1; Harness OFF | K-B042 |
| F099 | Paladin L15 / watchers; STR14/DEX14/CON14/INT14/WIS14/CHA10; Harness OFF | K-B042 |
| F100 | Paladin L15 / watchers; STR14/DEX14/CON14/INT14/WIS14/CHA12; Harness OFF | K-B042 |
| F101 | Paladin L15 / watchers; STR14/DEX14/CON14/INT14/WIS14/CHA20; Harness OFF | K-B042 |
| F102 | Paladin L15 / watchers; STR14/DEX14/CON14/INT14/WIS14/CHA30; Harness OFF | K-B042 |
| F103 | Wizard L2 / war-magic; STR14/DEX14/CON14/INT1/WIS14/CHA14; Harness OFF | K-B042 |
| F104 | Wizard L2 / war-magic; STR14/DEX14/CON14/INT10/WIS14/CHA14; Harness OFF | K-B042 |
| F105 | Wizard L2 / war-magic; STR14/DEX14/CON14/INT12/WIS14/CHA14; Harness OFF | K-B042 |
| F106 | Wizard L2 / war-magic; STR14/DEX14/CON14/INT20/WIS14/CHA14; Harness OFF | K-B042 |
| F107 | Wizard L2 / war-magic; STR14/DEX14/CON14/INT30/WIS14/CHA14; Harness OFF | K-B042 |
| F108 | Paladin L2 / -; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness ON | K-B043, K-B050 |
| F109 | Paladin L3 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness ON | K-B041, K-B043, K-B048, K-B050 |
| F110 | Paladin L6 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness ON | K-B043, K-B050 |
| F111 | Paladin L7 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness ON | K-B041, K-B043, K-B048, K-B050 |
| F112 | Paladin L14 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness ON | K-B043, K-B050 |
| F113 | Paladin L15 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness ON | K-B041, K-B043, K-B048, K-B050 |
| F114 | Wizard L13 / divination; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B043 |
| F115 | Wizard L14 / divination; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B043 |
| F116 | Warlock L2 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F117 | Warlock L3 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F118 | Warlock L4 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F119 | Warlock L5 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F120 | Warlock L6 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F121 | Warlock L7 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F122 | Warlock L8 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F123 | Warlock L9 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F124 | Warlock L10 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F125 | Warlock L11 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F126 | Warlock L12 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F127 | Warlock L15 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F128 | Warlock L16 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F129 | Warlock L17 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F130 | Warlock L18 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F131 | Warlock L19 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F132 | Warlock L20 / celestial; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F133 | Paladin L4 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F134 | Paladin L5 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F135 | Paladin L6 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F136 | Paladin L7 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F137 | Paladin L8 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F138 | Paladin L9 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F139 | Paladin L10 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F140 | Paladin L11 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F141 | Paladin L12 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F142 | Paladin L13 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F143 | Paladin L14 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F144 | Paladin L16 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F145 | Paladin L17 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F146 | Paladin L18 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F147 | Paladin L19 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F148 | Paladin L20 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B046 |
| F149 | Paladin L4 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness ON | K-B041, K-B048, K-B050 |
| F150 | Paladin L5 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness ON | K-B041, K-B048, K-B050 |
| F151 | Paladin L8 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness ON | K-B041, K-B048, K-B050 |
| F152 | Paladin L9 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness ON | K-B041, K-B048, K-B050 |
| F153 | Paladin L12 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness ON | K-B041, K-B048, K-B050 |
| F154 | Paladin L13 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness ON | K-B041, K-B048, K-B050 |
| F155 | Paladin L16 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness ON | K-B041, K-B048, K-B050 |
| F156 | Paladin L17 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness ON | K-B041, K-B048, K-B050 |
| F157 | Paladin L20 / ancients; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness ON | K-B041, K-B048, K-B050 |
| F158 | Paladin L3 / devotion; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B047 |
| F159 | Paladin L3 / vengeance; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B047 |
| F160 | Paladin L3 / oathbreaker; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B047 |
| F161 | Paladin L3 / conquest; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B047 |
| F162 | Paladin L3 / redemption; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B047 |
| F163 | Paladin L3 / glory; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B047 |
| F164 | Paladin L3 / watchers; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B047 |
| F165 | Warlock L10 / archfey; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B043 |
| F166 | Warlock L11 / archfey; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B043 |
| F167 | Warlock L12 / archfey; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B043 |
| F168 | Warlock L15 / archfey; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B043 |
| F169 | Warlock L16 / archfey; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B043 |
| F170 | Warlock L17 / archfey; STR14/DEX14/CON14/INT14/WIS14/CHA14; Harness OFF | K-B043 |

#### Auditor re-review response — category attribution and final status (2026-10-19)

The auditor partially accepted the crosswalk and RAW corrections and identified that the category table's mismatch counts needed attribution. The table's “Profiles with an asserted mismatch” column is an **overall profile-level** count among fixtures tagged to that category, not a count of failures specific to that category's assertion. The tagged result records profile-level error strings but does not separately assign each error to a K-B assertion.

- **K-B041:** All 9 tagged profiles marked as mismatching have only Genie Bottled Respite errors (formula/max expected fixed 1, actual PB); no PB-maximum or Harness-cap mismatch is reported. The PB/Harness-specific assertions matched. K-B041 is therefore not evidence of a PB-formula defect; its `FAIL` in the earlier summary denotes overlapping profile-level mismatches, not a PB assertion failure.
- **K-B044:** Its 10 profile-level mismatches comprise 3 Celestial subclass-source errors and 7 Genie Bottled Respite formula/max errors. None of these error strings reports a subclass-gate mismatch. The prior `FAIL` is retained as a profile-level affected status; the saved aggregate does not provide category-owned assertion counts from which to claim a gate-specific failure or to promote K-B044 to PASS.
- **K-B040** has the Genie fixed-use mismatch and Celestial source errors; **K-B046**'s 20 profile-level mismatches are Celestial source errors only, not die/count/uses scaling mismatches. The earlier category table remains intact as the historical output; these qualifications explain its counts without changing the underlying tagged result.

**Final Tester 4 disposition:** Auditor review is partially accepted with the attribution clarification above. The corrected 170-profile tagged rerun was not rerun again for this clarification; the same saved result was parsed to attribute its recorded errors. K-B047 remains **BLOCKED** because generated consumer arrays are empty and feature-level links are not represented; K-S093 remains **FAIL** for Bottled Respite's in-scope maximum. No product code was changed. Step K is not complete.

## 標準化逐案重跑手冊

本節定義可重複執行的現行標準流程。歷史 actual 欄保留首次觀察；本節的 profile 名稱是新建、穩定可重跑的 fixture label，不冒稱歷史 character ID。

### 執行環境與資料隔離

1. 在乾淨的 5eCRM checkout 根目錄啟動本機 HTTP server（例如 `python -m http.server 8765`），以 Chromium／Edge 開啟 `http://127.0.0.1:8765/cr.html`。不要用 `file://`，因 app 會載入 locale JSON。
2. 每次記錄日期、瀏覽器名稱／完整版本、`navigator.userAgent`、repo commit SHA、測試網址、case／fixture ID。歷史 run 沒有統一保留這些欄位；新 run 必須記錄。
3. 使用新的瀏覽器 profile 或專用 local origin；不得在正式角色資料上測試。執行前在 DevTools Console 保存以下三個 key 的原始字串（包括不存在時的 `null`）：

   ```js
   const stepKKeys = [
     'dnd_skills_db',
     'dnd_skills_class_feature_settings',
     'dnd_skills_locale'
   ];
   const stepKBackup = Object.fromEntries(
     stepKKeys.map(key => [key, localStorage.getItem(key)])
   );
   JSON.stringify(stepKBackup);
   ```

4. 建立唯一角色名 `STEPK-<case-id>-<fixture-id>-<date>`：按角色建立按鈕，填 `#roleName` 並提交 `#roleCreateForm`。按 `[data-action="open-management"]`；在 class builder 的 `#classRows` 新增 class row，填 `[data-class-preset]`、`[data-class-level]`、`[data-class-subclass]`；六項數值在 `#classAbilityScores` 的 `[data-ability-score="str|dex|con|int|wis|cha"]` 填 14，除非 fixture 明示例外。TCE features 由 `[data-section="tce"]` 開啟，逐一核對 `[data-tce-feature]`。按 `[data-action="apply-class-levels"]`，於確認畫面按 `[data-action="confirm-management"]`。
5. 對每個 case 先核對 UI 卡片，再用 DevTools Console 讀取已持久化資料：

   ```js
   const roleName = 'STEPK-<case-id>-<fixture-id>-<date>';
   const db = JSON.parse(localStorage.getItem('dnd_skills_db') || '{}');
   db[roleName];
   ```

   `dnd_skills_db` 是以角色名為 key 的 object；每個角色值為 resource array。對生成資源核對 `current`、`max`、`cooldown`、`source` 及 `generatedClass` 中的 `resourceKey`、`owner`、`subclass`、`sourceVersion`、公式／die／gate／cost／consumer 欄位。TCE 選項可另外在 `dnd_skills_class_feature_settings` 的 `character:<角色名>` entry 核對；生成資源 metadata 亦應反映已套用選項。
6. 需要消耗時按 `#skillList` 資源卡上的 `[data-action="use-resource"]`；一般 pool 使用 `[data-action="reset-cooldown"][data-level="短休"]`／`[data-level="長休"]`；accumulative resource 使用 `[data-action="adjust-accumulative-resource"]` 的 gain／spend 控制；需要「事件後手動恢復」時用卡片 `[data-action="reset-resource"]`。每一步保存操作前後 `current/max`。不要把 metadata／cost 存在當成已執行 feature action 或付款。
7. 執行完刪除專用測試角色。把第 3 步記下的 JSON 貼回 Console 作為 `backup`，再原樣還原三個 key：原值為 `null` 就 `removeItem`，否則 `setItem` 原始字串；reload 後確認原角色清單與 locale 回復。不要只清空 storage 而遺失原有資料。

   ```js
   const backup = JSON.parse(prompt('Paste the JSON saved in step 3'));
   const restoreKeys = [
     'dnd_skills_db',
     'dnd_skills_class_feature_settings',
     'dnd_skills_locale'
   ];
   for (const key of restoreKeys) {
     if (backup[key] === null) localStorage.removeItem(key);
     else localStorage.setItem(key, backup[key]);
   }
   location.reload();
   ```
8. 每個結果記錄 case ID、fixture label、輸入 tuple、操作序列、期待 key／輸出、實際 key／輸出、PASS／FAIL／N/A／DEFERRED／NOT RUN、證據日期及環境。多職 PB 用總角色等級；職業特徵級別用該職業等級；能力值公式按該能力的 modifier 並遵循該列 minimum。

### K-B001–013：subclass selection boundary fixture

每案建立兩個 profile，除表列 class/subclass/level 外，能力值均 14、TCE OFF。Below profile 需 subclass selector disabled/not required；gate profile selector enabled/required，選擇表列 subclass 後 Apply。再將 class preset 改為 Custom，核對 subclass selector 隱藏／停用。當 gate 為 0 級時，保留一個 Fighter 1 anchor 使角色總級為正數，同時測試目標 class 為 0 級。

| Case | Class / subclass | Below level / at gate | Gate |
|---|---|---:|---:|
| K-B001 | Artificer / Armorer | 2 / 3 | 3 |
| K-B002 | Barbarian / Berserker | 2 / 3 | 3 |
| K-B003 | Bard / Lore | 2 / 3 | 3 |
| K-B004 | Cleric / Knowledge | 0 / 1 | 1 |
| K-B005 | Druid / Moon | 1 / 2 | 2 |
| K-B006 | Fighter / Champion | 2 / 3 | 3 |
| K-B007 | Monk / Open Hand | 2 / 3 | 3 |
| K-B008 | Paladin / Ancients | 2 / 3 | 3 |
| K-B009 | Ranger / Hunter | 2 / 3 | 3 |
| K-B010 | Rogue / Thief | 2 / 3 | 3 |
| K-B011 | Sorcerer / Draconic Bloodline | 0 / 1 | 1 |
| K-B012 | Warlock / Archfey | 0 / 1 | 1 |
| K-B013 | Wizard / Divination | 1 / 2 | 2 |

### K-B014–023：TCE optional feature fixture matrix

每個 option 使用兩個隔離角色／profile：checkbox 初始 OFF，先核對 default；再只開該 option、比較 gate 前與 gate 級；不同 option 不可同時打開。能力值 14、未指定 class level 以表列 gate／邊界為準。

| Case | Class / option | Gate and exact assertion |
|---|---|---|
| K-B014 | Cleric / Harness Divine Power | Gate 2；OFF 無 Harness pool；ON 在 Cleric 2 max1/LR、6 max2、18 max3；每次 cost 1 Channel Divinity，slot recovery cap `ceil(PB/2)`. |
| K-B015 | Druid / Wild Companion | Gate 2；OFF 無選項輸出；ON 顯示消耗 1 Wild Shape use 或一個 1st-level+ spell slot 的替代成本；不得建立免費獨立 pool。 |
| K-B016 | Monk / Quickened Healing | Gate 2；OFF 不啟用；ON cost 指向 `class:monk:ki`，amount 2。 |
| K-B017 | Monk / Focused Aim | Gate 2；OFF 不啟用；ON cost 指向 `class:monk:ki`，amount range 1–3 Ki。 |
| K-B018 | Paladin / Harness Divine Power | Gate 3；OFF 無 pool；ON uses 1 at Paladin 3, 2 at 7, 3 at 15；每次 cost 1 Channel Divinity，slot recovery cap `ceil(PB/2)`. |
| K-B019 | Ranger / Favored Foe | Gate 1；OFF 不產生；ON max PB/LR；total level 1/4/5/8/9/12/13/16/17/20 預期 2/2/3/3/4/4/5/5/6/6。 |
| K-B020 | Ranger / Primal Awareness | OFF 不產生 optional feature；ON 逐級提供 Speak with Animals (3)、Beast Sense (5)、Speak with Plants (9)、Locate Creature (13)、Commune with Nature (17) 各 1/LR 的免費施放；額外 cast 用法術位，按相應 spell level 核對，不得另算免費 pool。 |
| K-B021 | Ranger / Nature's Veil | Gate 10；OFF／低於10缺席；ON 從 Ranger 10 起 PB/LR，PB boundaries 按總級計算。 |
| K-B022 | Sorcerer / Magical Guidance | Gate 5；OFF 不啟用；ON cost 指向 `class:sorcerer:sorcery-points`，amount 1。 |
| K-B023 | Sorcerer / Sorcerous Restoration | Gate 20；L19 或 OFF 不啟用；ON 在短休恢復最多 4 Sorcery Points，仍不得超過 Sorcery Points max。 |

### K-B044：50 個標準化 T2 gate profiles

下表將 Tester 2 的 25 個 definition 明確展開為 25 組「解鎖前一級／解鎖級」，合共 50 個可執行 profiles。這是對既有 50-profile post-fix 結果的標準化重跑 manifest；原歷史記錄沒有保存全部 50 個 character IDs。每組兩個 profile 同用表列職業，六項能力值 14，TCE 預設 OFF；只有 Harness Divine Power 的「解鎖級」profile 將該 TCE option ON。子職業在該 profile 的 class level 已達選擇門檻時才選取；若 gate-1 profile 尚未解鎖子職業，按 UI 保持未選。level 1 以下的角色以 Fighter 1 作有效 anchor，測試職業設為 0 級且不選子職業。其餘 below-level profile 使用表列職業的 gate-1 級；解鎖級 profile 使用 gate 級。

| Profile pair | 職業／子職業 | Gate；below / at | 解鎖級 oracle（below 必須不存在） |
|---|---|---:|---|
| R2-01-B / R2-01-A | Bard / 無 | 1；Fighter 1 / Bard 1 | `class:bard:bardic-inspiration`，max 2（CHA 14），LR；單一 Bard pool。 |
| R2-02-B / R2-02-A | Bard / Glamour | 3；2 / 3 | `subclass:bard:glamour:enthralling-performance`，1/LR。 |
| R2-03-B / R2-03-A | Bard / Glamour | 6；5 / 6 | `subclass:bard:glamour:mantle-of-majesty`，1/LR。 |
| R2-04-B / R2-04-A | Bard / Glamour | 14；13 / 14 | `subclass:bard:glamour:unbreakable-majesty`，1/SR。 |
| R2-05-B / R2-05-A | Bard / Whispers | 3；2 / 3 | `subclass:bard:whispers:words-of-terror`，1/SR。 |
| R2-06-B / R2-06-A | Bard / Whispers | 6；5 / 6 | `subclass:bard:whispers:mantle-of-whispers`，1/SR。 |
| R2-07-B / R2-07-A | Bard / Whispers | 14；13 / 14 | `subclass:bard:whispers:shadow-lore`，1/LR。 |
| R2-08-B / R2-08-A | Bard / Creation | 3；2 / 3 | `subclass:bard:creation:performance-of-creation`，1/LR；paid reuse 最低 2 環。 |
| R2-09-B / R2-09-A | Bard / Eloquence | 6；5 / 6 | `subclass:bard:eloquence:universal-speech`，1/LR。 |
| R2-10-B / R2-10-A | Bard / Eloquence | 14；13 / 14 | `subclass:bard:eloquence:infectious-inspiration`，CHA modifier（min 1）/LR；CHA 14 時 max 2。 |
| R2-11-B / R2-11-A | Cleric / Knowledge | 2；1 / 2 | `class:cleric:channel-divinity`，max 1/SR；一個跨 domain pool。 |
| R2-12-B / R2-12-A | Cleric / Light | 1；Fighter 1 / Cleric 1 | `subclass:cleric:light:warding-flare`，WIS modifier（min 1）/LR；WIS 14 時 max 2。 |
| R2-13-B / R2-13-A | Cleric / Tempest | 1；Fighter 1 / Cleric 1 | `subclass:cleric:tempest:wrath-of-the-storm`，WIS modifier（min 1）/LR；WIS 14 時 max 2。 |
| R2-14-B / R2-14-A | Cleric / Grave | 6；5 / 6 | `subclass:cleric:grave:sentinel-at-deaths-door`，WIS modifier（min 1）/LR；WIS 14 時 max 2。 |
| R2-15-B / R2-15-A | Cleric / Peace | 1；Fighter 1 / Cleric 1 | `subclass:cleric:peace:emboldening-bond`，PB/LR；總等級 1 時 max 2。 |
| R2-16-B / R2-16-A | Cleric / Twilight | 6；5 / 6 | `subclass:cleric:twilight:steps-of-night`，PB/LR；總等級 6 時 max 3。 |
| R2-17-B / R2-17-A | Cleric / Twilight | 1；Fighter 1 / Cleric 1 | `subclass:cleric:twilight:eyes-of-night`，1/LR。 |
| R2-18-B / R2-18-A | Cleric / War | 1；Fighter 1 / Cleric 1 | `subclass:cleric:war:war-priest`，WIS modifier（min 1）/LR；WIS 14 時 max 2。 |
| R2-19-B / R2-19-A | Cleric / Knowledge | 2；1 / 2 | `class:cleric:harness-divine-power`，1/LR；每次 cost 為 1 Channel Divinity，TCE option 只在 A 開啟。 |
| R2-20-B / R2-20-A | Rogue / Thief | 20；19 / 20 | `class:rogue:stroke-of-luck`，1/SR；class-owned，不可生成 Thief-only key。 |
| R2-21-B / R2-21-A | Rogue / Phantom | 3；2 / 3 | `subclass:rogue:phantom:wails-from-the-grave`，PB/LR；Rogue 3、總級 3 時 max 2。 |
| R2-22-B / R2-22-A | Rogue / Phantom | 13；12 / 13 | `subclass:rogue:phantom:ghost-walk`，1/LR；Soul Trinket cost metadata另按 K-B048 核對。 |
| R2-23-B / R2-23-A | Rogue / Soulknife | 3；2 / 3 | `subclass:rogue:soulknife:psionic-energy-dice`，2×PB=4 顆 d6；LR 恢復全部、SR 恢復 1 顆。 |
| R2-24-B / R2-24-A | Rogue / Soulknife | 3；2 / 3 | `subclass:rogue:soulknife:psychic-whispers`，1/LR；另有空池條件及 die-cost metadata。 |
| R2-25-B / R2-25-A | Rogue / Soulknife | 13；12 / 13 | `subclass:rogue:soulknife:psychic-veil`，1/LR；paid reuse die cost 按 K-B048 核對。 |

對每一 pair 比較完整 generated resource set，而不只看目標 key：below 應缺席、at 應恰有一個目標 key、owner／subclass／source／max／recovery／cost 應符合表列 oracle，且不能多出同能力的 duplicate pool。Tester 2 的另外 16 個 focused threshold profiles 以 R2F-01-B/A 至 R2F-08-B/A 明列；Tester 4 的 F001–F170 tagged matrix中有 56 個 K-B044 profiles，逐案標出 membership。故本文含 50+16+56 組 reviewer 指定的 gate profiles，且提供可重播輸入。

### K-T003 標準操作 oracle

| ID | 固定輸入與操作 | 預期前後狀態／界線 |
|---|---|---|
| K-T003-01 | Bard 4 與 Bard 5，CHA 14；各消耗 Bardic Inspiration 1 次，分別按短休及長休。 | Bard 4：max 2，短休不恢復，長休恢復至 2；Bard 5：同一 pool recovery 轉為短休，短休恢復至 2。 |
| K-T003-02 | Sorcerer 20，INT/CHA 14，Sorcery Points max 20；設定 current 16，短休一次。 | Sorcerous Restoration 每個長休間隔一次，短休加 4，達上限；預期 16→20。不得生成另一個 Sorcery Points pool。 |
| K-T003-03 | Power Surge 一體化累積／消耗／休息重置。 | **DEFERRED，不執行或計 PASS。** 此 accumulator lifecycle 不屬本次 scope；細節需新 enhancement。 |
| K-T003-04 | Rogue 3 Soulknife；確認 Psionic Energy Dice 的 per-turn metadata，按回合 Reset、短休、長休並記錄。 | 回合／休息控制不得改寫 once-per-turn gate；不以通用「使用」按鈕宣稱執行 Homing Strikes 等 feature action。 |
| K-T003-05 | Rogue 3 Soulknife，PB 2、pool 4 d6；消耗 2 顆後按短休。 | 只恢復 1 顆：2/4→3/4；此 fixture 能區別部分恢復與錯誤的全額重置。只核對資源追蹤及休息恢復，不代表已測試任何需要 bonus action 的 Soulknife 能力或戰鬥行為。 |
| K-T003-06 | 同一 Rogue 3 Soulknife，先耗盡至 0/4，再按長休。 | 恢復全部至 4/4。 |
| K-T003-07 | Rogue 3 Soulknife，Psychic Whispers 1/1；使用至 0，分別按短休及長休。 | 短休仍 0/1；長休恢復 1/1。 |
| K-T003-08 | Fighter 20 Champion，d10 Hit Dice 20；消耗 11 顆後按長休。 | 長休恢復總 HD 的一半（10），預期 9/20→19/20。 |
| K-T003-09 | Sorcerer 1 Wild Magic；Tides of Chaos 1/1，使用至 0，依次短休、長休。 | 短休後 0/1；長休後 1/1。額外合資格事件恢復由使用者手動 Reset，非自動休息機制。 |
| K-T003-10 | 兩角色分開測：Wild Magic Sorcerer 1 的 Tides of Chaos；Conjuration Wizard 6 的 Benign Transposition。各 1/1→使用→0/1→按卡片 Reset。 | 各回到 1/1。只驗證手動 reset 流程；不模擬事件、不加入事件監聽。Power Surge 子項另列 DEFERRED。 |
| K-T003-11 | 全範圍 class-resource definition scan `recoveryOnly`。 | N/A：沒有適用 definition；記錄掃描範圍及零筆結果。 |
| K-T003-12 | 全範圍 scan `longRestRecoveryWhenEmpty`。 | N/A：沒有適用 definition；記錄掃描範圍及零筆結果。 |

### K-T 與 K-M 其餘可執行資料

- **K-T001-01–11：** 使用「K-T crosswalk and detailed output evidence」內每個 canonical key、consumer list、owner/source、shared flag 及 cost links。以各對應 K-S／K-B fixture 套用後，只比較一個 canonical key、exact consumer-to-key link、不重複 pool；包括六個 Bard consumer profiles、14 Cleric domains、八個 supported Paladin oaths、Druid／Wild Shape、Monk／Ki、八個 Barbarian paths、Sorcerer point consumers、Battle Master、Psi Warrior 七個 consumers 及 Soulknife 六個 consumers。這些 crosswalk 的初始 actual 亦已保存；最終 case status 以 Group 3 post-fix disposition為準。
- **K-T002-01–06：** Soulknife Rogue 3 的 Psionic Energy Dice 與 Psychic Whispers 必須使用不同 key，分別比較 SR/LR oracle；Artificer 20 的每環 spell slot 使用獨立 pool key，即使 UI 同卡分組亦不得合併；Rune Knight Fighter 3/7/10/15/18/20 的 rune pool 數為 2/3/4/5/5/5，key `...:rune:1` 至已知 rune 數量、每個 max 1/SR；其他 independent pools 逐 key／cooldown 比較，不得只以卡片數量判定。
- **K-T004-01–09：** Arcane Jolt（Artificer 20 Battle Smith，INT14，max2/LR、once-per-turn）；Action Surge（Fighter 20，max2/SR、once on your turn）；once-per-round 全目錄 scan（N/A）；Favored Foe（Ranger20，TCE ON，PB6/LR，effect gate 與 marking use 分開）；spell-slot／Ki／Channel Divinity cost 按 K-B048 inventory 的 key、amount、minimum slot level／alternative逐條核對；Overchannel 另列 increasing-damage cost，不當作免費 pool；Major Transformation 消耗 Transmuter's Stone，不當作 cooldown。付款行為不在此 metadata test 執行。
- **K-T005-01–04：** 先用生成 pool 建基準，將 current 設為 3；同 key 重新套用時保留 current，即使新 max 較低而 current 暫時高於 max；新增一個手動 resource（key/name `manual-stepk-retained`，3/5）後重套 classes，該手動 resource 不變；把 Rogue／Phantom 角色改成無 Phantom 的合法職業組合後，Phantom generated keys 消失；Wizard 1 改為 Wizard 2 War Magic，新增 `subclass:wizard:war-magic:power-surge` 1/2、initialValue 1。每次均檢查 apply 前後同一角色的 resource array。
- **K-T006-01–03：** 建立有 class／subclass／ability／TCE settings 的角色；切換 zh-HK／zh-TW、reload，確認上述輸入及選項維持；建立第二角色並只更改一個 TCE checkbox，確認兩角色 settings 互不串改。檢查 UI 及 `dnd_skills_class_feature_settings` 的 `character:<name>` entry。
- **K-T007-01–10（排除 DROPPED -08）：** 對照下列已保存例子作分類練習：K-S020 的 Divine Intervention 初次缺失＝missing output；K-S093 的 Bottled Respite PB vs fixed 1＝maximum/formula；K-S007 的 Long Rest vs Short Rest＝recovery；K-S079 的 Stroke of Luck Thief key vs Rogue class key＝pool-key/owner；K-S091 Celestial subclass source TCE vs XGE＝source；K-S018 Creation additional-use 最低 2 環遺漏＝cost。Unexpected-output 使用 synthetic report-only pair `expected={A}; actual={A,B}`，明確標示為分類控制，不記成產品失敗。每個 finding 都須寫 case ID、expected、actual、類別、證據、status／follow-up；不把舊錯誤標成現行 FAIL。

## K-M001–K-M005 exact profile 與 output oracle

六項能力值未特別指定時均為 14；profile row 順序即 UI 輸入順序。Multiclass caster level 僅按 2014 Multiclassing rules 合併適用職業等級；PB 按總角色等級。

| ID | 精確角色輸入 | 預期核對值 | 首次記錄 actual／最終 |
|---|---|---|---|
| K-M001 | Fighter 5 Battle Master / Ranger 5 Gloom Stalker（Favored Foe ON）/ Rogue 5 Arcane Trickster；總級15，PB+5。 | Favored Foe max 5；Superiority Dice max 4（Fighter class level 5）；1st/2nd slot 4/2（AT 1/3 caster progression）；keys 不碰撞。 | Favored Foe 5；Superiority Dice 4；slot 4/2；PASS。 |
| K-M002 | Sorcerer 10 Clockwork Soul / Warlock 10 Genie；總級20，PB+6。 | Sorcery Points 10；Pact Magic 兩個 5th-level slots；Warlock 10 無 11th-level Mystic Arcanum；multiclass slot vector L1–5 = 4/3/3/3/2。 | 完全符合；PASS。 |
| K-M003 | Bard 10 Eloquence / Paladin 10 Watchers；CHA16，總級20，PB+6。 | Bardic Inspiration max3、短休恢復；Paladin resources 按 Paladin 10；單一 Channel Divinity pool；caster level15 slots L1–8 = 4/3/3/3/2/1/1/1。 | max3／SR、單一 Channel Divinity、slot vector符合；PASS。 |
| K-M004 | Wizard 10 Order of Scribes / Artificer 10 Battle Smith；INT16，總級20，PB+6。 | Multiclass caster level15 slots L1–8 = 4/3/3/3/2/1/1/1；Arcane Jolt INT modifier 3/LR、once-per-turn；資源 class-level formula 不混用總級。 | Arcane Jolt max3／once-per-turn、slot vector符合；PASS。 |
| K-M005 | Cleric 1 Arcana / Fighter 19 Champion；總級20，PB+6。 | Cleric 1 可選 Arcana；無 Cleric Channel Divinity（須 Cleric2）；Fighter Indomitable max3；Cleric caster-level1 slots = 1st level 2。 | 無 Channel Divinity、Indomitable3、1st-level slots2；PASS。 |

## 規則 oracle 索引及封存內部優先序

來源縮寫均指 2014 版／本測試核准出版物；不引用未核實頁碼，也不複製規則原文。逐案 oracle 以 case table 中的具名 feature、source／subclass、公式、門檻、恢復及 cost 共同定位：

| 縮寫 | 全名 | 本文使用的定位方式 |
|---|---|---|
| PHB | Player's Handbook (2014) | Chapter 3 對應 class／named feature；一般 short rest、long rest、Hit Dice、multiclassing／spell-slot rules 按其具名規則節。 |
| DMG | Dungeon Master's Guide (2014) | Death Domain 及其具名 Cleric feature。 |
| SCAG | Sword Coast Adventurer's Guide | Arcana Domain 及其具名 Cleric feature。 |
| XGE | Xanathar's Guide to Everything | 對應 class／subclass named feature（例如 Glamour、Whispers、Grave、Inquisitive、War Magic）。 |
| TCE | Tasha's Cauldron of Everything | 對應 subclass／optional feature（例如 Creation、Eloquence、Peace、Twilight、Soulknife、Rune Knight、Genie）；附加 cost／reuse 按 feature clauses。 |
| FToD | Fizban's Treasury of Dragons | 對應 Drakewarden、Ascendant Dragon feature。 |
| BGG | Bigby Presents: Glory of the Giants | Path of the Giant feature。 |

**判定優先序：** 使用者確認的 scope／disposition ＞ 本文 current expected／final result ＞ 歷史 first-run actual。歷史 log 中的「FAIL／BLOCKED／Step K not complete」均是修正前證據；不得覆蓋本文的最終 211 PASS／1 DEFERRED／4 N/A。

## K-B026–039 formula fixture manifest

下列是可直接在 class builder 執行的最小標準 fixture。除表列能力值／level／option 外，其他能力值均 14；每筆核對目標 key、公式 metadata、max、recovery 及不重複輸出。所有 TCE options 預設 OFF，只有明列「ON」才開啟。公式 branch 的歷史輸出已在 K-B 初始表列明；涉及已修正錯誤的 K-B034 以目前 PB oracle 為準。

| ID | Fixture 輸入 | Target key / oracle | Expected |
|---|---|---|---|
| K-B026 | Artificer 3 Artillerist | `subclass:artificer:artillerist:eldritch-cannon`，固定值，LR | max 1；extra creation 是 spell-slot additional-use cost。 |
| K-B027 | Ranger 1 Beast Master；Favored Foe ON | `class:ranger:favored-foe`，PB，LR | total level 1、PB2，max 2。 |
| K-B028 | Rogue 5 Soulknife | `subclass:rogue:soulknife:psionic-energy-dice`，2×PB，LR | total level 5、PB3，max 6 顆 d8。 |
| K-B029 | Cleric 5 Knowledge；Harness Divine Power ON | `class:cleric:harness-divine-power` 的 `spellSlotRecovery.maxLevelFormula` | PB3，half-PB rounded up=2；每次恢復一個不高於 2 環的 spell slot；resource uses 1/LR。 |
| K-B030 | Cleric 1 Light；WIS16 | `subclass:cleric:light:warding-flare`，ability WIS、minimum 1 | WIS modifier 3，max 3/LR。 |
| K-B031 | Paladin 1 Devotion；CHA16 | `class:paladin:divine-sense`，CHA modifier +1、minimum 1 | 3+1=4，max 4/LR。 |
| K-B032 | Artificer 11 Armorer；INT16 | `class:artificer:spell-storing-item`，2×INT modifier、minimum 2 | 2×3=6，max 6/LR。 |
| K-B033 | Sorcerer 10 Draconic Bloodline | `class:sorcerer:sorcery-points`，class-level | Sorcerer class level 10，max 10/LR；pool key remains shared. |
| K-B034 | Rogue 8 Phantom (current correction fixture; compare historical Rogue 5 output separately) | `subclass:rogue:phantom:wails-from-the-grave`，current oracle PB, not ceil(class level/2) | Rogue 8 total level 8 gives PB3, max 3/LR. The old class-level-half-up formula would be 4 and must not return. |
| K-B035 | Warlock 3 Celestial | `subclass:warlock:celestial:healing-light`，class-level+1, dice mode d6 | class level 3 gives max 4d6/LR. |
| K-B036 | Paladin 4 Ancients | `class:paladin:lay-on-hands`，class-level×5, hit-points mode | class level 4 gives 20 HP/LR. |
| K-B037 | Fighter 13 Champion | `class:fighter:indomitable`，level tiers | max 2/LR (tiers 9→1, 13→2, 17→3). |
| K-B038 | Cleric 18 Knowledge | `class:cleric:channel-divinity`，Cleric tier formula | max 3/SR; one shared Cleric pool. |
| K-B039 | Barbarian 19 Berserker, then Barbarian 20 Berserker | `class:barbarian:rage`，Rage tier | L19 max 6; L20 no finite Rage pool. |

**邊界擴展：** K-B026–039 的原始目標是驗證最小值、升階邊界及高等級值，不只一個中間點。上表是指定主 fixture；遇到 PB／ability／class-level／tier formula，按相應 K-S/K-B full inventory 中列出的 levels／scores 再套用一次，尤其 K-B024 的 ability scores 1/10/20/30、K-B025 的 PB boundaries、K-B041 的所有 PB vectors、K-B043 的 tier boundaries、K-B044 的 gate pairs。K-B034 的修正值以 Rogue 8 作區分點，必須驗證 PB3 而非歷史 ceil(8/2)=4。

## 歷史 evidence 與現行標準結果的分界

本文件在較早段落中保留了原 tester／orchestrator 的首次輸出、失敗判斷及原始用語，以免抹去修正前證據。那些段落可能寫有舊 status、錯誤 oracle 或「Step K not complete」；它們是 history，不是本文的最後判定。新測試者應：

1. 使用本文 K-S/K-B/K-T/K-M fixture manifest 和共通手冊重新套用；
2. 對照 current oracle，而不是複製 first-run expected 值；
3. 以本文最前面的結果摘要及 case status table 記錄結果；
4. 將新 run 的環境、storage snapshot、操作前後值及證據一併寫回本文相應 case，不需查閱或保留原始 tester／orchestrator 報告。
