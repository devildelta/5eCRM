# D&D 5e 職業資源實作計劃

## 目標與範圍

擴充現有職業等級資源計算器，讓標準 2014 版 D&D 5e 職業輸入可選擇支援的子職業，並按職業等級、子職業、熟練加值及屬性調整值產生有限次數資源。現有法術位計算已實作，必須保持原有計算與行為。

第一階段集中處理明確按長休、短休恢復的資源，以及有每回合／每輪使用限制的資源。每回合或每輪限制屬使用頻率閘，不可當作短休或長休恢復池。七日、每日、事件觸發、付費再用及其他非標準恢復規則留待後續階段。

## 已確認範圍與規則決定

- **規則版本**：以 2014 版 D&D 5e 為準，不混用 2024 版。
- **來源優先次序及本輪範圍**：PHB 2014／DMG 2014、XGE、TCE、Fizban's Treasury of Dragons（FTD）、Bigby Presents: Glory of the Giants（BGG）、The Book of Many Things（BMT）；另作明確例外，加入 SCAG 的牧師 Arcana Domain。其他 SCAG 內容及其他未列來源暫不支援。
- **Artificer**：保留 Artificer 標準職業，採用核准來源中的 TCE 選項；不加入只見於 Eberron: Rising from the Last War 的子職業選項。
- **子職業選擇**：標準職業達到其 2014 規則實際的子職業特性解鎖等級時，必須選擇子職業。解鎖等級按職業而定，不統一設為 3 級。未到解鎖等級時毋須選擇。
- **自訂職業**：自訂職業不提供子職業選擇，繼續使用現有手動輸入方式。
- **能力值**：加入六項能力值輸入，以計算依賴能力調整值的資源上限；不得臆測未輸入的數值。
- **TCE 可選職業特性**：在 Management 新增獨立分頁，為每項支援的 TCE 可選職業特性提供各自獨立的開關；每個角色分別保存選擇，預設全部關閉。
- **BGG／BMT 專長及背景**：不加入職業輸入流程；相關資源留給手動輸入。
- **熟練加值**：依所有已啟用職業等級總和（角色總等級）計算。熟練加值不必在頁面顯示。
- **Bladesinger 版本**：採用 TCE 重印版本；不可與 SCAG 版本次數疊加。SCAG 的本輪唯一例外為牧師 Arcana Domain。
- **共用資源池**：多項職業或子職業能力共用同一池時，只建立一個底層資源池，例如 Ki、Rage、Channel Divinity、Bardic Inspiration、Sorcery Points 及 Superiority Dice。
- **異質資源**：可在同一資源卡片分組顯示，但各 inner pool 必須保留獨立識別、目前值、上限、恢復規則及資源成本；不得把不同冷卻或觸發條件合併成同一計數。
- **回合／回合輪次限制**：「每回合一次」、「自己回合內一次」及「每輪一次」須分別表示為使用限制，不可轉成休息恢復。一次性使用閘與有限恢復池可同時存在，需分開記錄。

## 現況與實作位置

- 職業輸入器及資源計算位於 `src/cr.js`，職業列動態插入 `cr.html` 的 `#classRows`。
- 標準職業預設及法術位進程已存在；自訂職業使用手動法術位進程。
- `readClassRows()` 會把職業設定存入產生資源的 metadata；套用確認流程會重建計算器產生的資源並保留手動資源。
- 一般非生命骰／法術位資源目前會廣泛分組顯示；新增職業資源時須在每個 inner pool 保留獨立識別及規則。
- 職業輸入介面的本地化檔案為 `src/locales/zh-HK.json` 及 `src/locales/zh-TW.json`。
- 專案沒有 `package.json` 或現成自動化測試 runner；瀏覽器驗收參考見 `.agent/CR/CR-stage5-playwright-tests.md`。
- 資源規則基線見 `.agent/CR/class-resource-recovery-reference.md`。

## 執行階段

### 階段 1：建立支援資料目錄

- 建立清晰、可稽核的職業／子職業資料目錄，標明來源與版本、子職業選擇解鎖等級、各有限次數特性的取得等級、最大值公式、恢復方式、額外成本及使用限制。
- 僅列入核准書籍中的標準子職業，另加入 SCAG 牧師 Arcana Domain；排除其他未核准來源、非標準選項及自訂職業。
- 在子職業資料目錄中標明 Arcana Domain 的 SCAG 來源，按 Cleric 1 級解鎖處理，並依資源參考盤點其有限次數資源；使用 Channel Divinity 的能力共用 Cleric 的 Channel Divinity 池，不重複建池。
- 先按職業等級特性表，盤點所有早於子職業選擇解鎖、但已有明確有限次數或恢復條件的職業資源。
- 對同一池的多個能力建立共用資源 key，不為每個能力重複建立次數。

### 階段 2：擴充職業輸入

- 在標準職業列加入子職業欄位；達到該職業實際解鎖等級後必須選擇，未達等級時隱藏或停用。
- 職業或等級更改時更新可選子職業及欄位狀態；語言切換、重新繪製和資源重套時保留選擇。
- 為能力調整值資源新增六項能力值輸入，並在欄位標籤和本地化說明中交代用途。
- 在 Management 新增「TCE 可選特性」分頁，逐項列出每個支援的 TCE optional class feature，使用各自獨立的 opt-in 開關；預設關閉，並按角色保存狀態。
- 更新職業或子職業輸入時，只有角色已啟用相應選項且符合該特性的職業／等級條件時，才納入資源計算；切換角色、重新開啟 Management、語言切換及重套資源時，正確載入並保留該角色的選項狀態。
- 自訂職業不顯示子職業欄位；既有自訂法術位行為維持不變。
- 將職業設定、子職業、能力值與各項可選特性選擇納入產生資源的 metadata，使重套資源時可還原完整輸入。

### 階段 3：產生第一批資源

- 先支援恢復規則明確的職業及子職業資源：長休、短休（包括規則書寫明短休或長休後皆可恢復的特性），以及有明確每回合／每輪使用閘的有限次數池。
- 職業資源及子職業資源均依角色輸入等級判斷是否取得；包括子職業選擇前已取得的職業特性。
- 按特性原文分別計算職業等級、角色總 PB、能力調整值及固定值上限；能力調整值的下限（例如至少 1）依規則資料明確記錄。
- 將法術位、Ki、Channel Divinity 等付款成本記作資源間消耗關係，不把「花既有池」誤建成額外免費次數池。
- 將 SR/LR 統一正規化為短休冷卻；長休批次回復可涵蓋所有短休恢復資源。
- 暫不把每日、七日、1d4 次長休、擲先攻、事件觸發、資源交換或付費再用映射成一般短休／長休恢復。

### 階段 4：分組、重建與保留狀態

- 令職業／子職業資源可以按卡片分組，同時保留每個 inner pool 的唯一 key、current/max、恢復方式、使用閘及成本。
- 重套職業輸入時只替換計算器產生的職業資源；手動建立的資源必須保留。
- 對 key 相同且仍然存在的資源，保留現有消耗狀態；若上限變更，依既有資源管理 UX 呈現，不可靜默抹去超額狀態或將不同池合併。
- 現有生命骰與法術位分類、命名、分組及重建行為保持不變；不得改動法術位計算表或多職法術位算法。

### 階段 5：驗證與文件

- 兩種語言均補上新增職業欄位、子職業選項、錯誤訊息及說明文字。
- 以瀏覽器驗收至少涵蓋：
  - 各職業在實際解鎖等級前後顯示／要求子職業選擇。
  - Management 的 TCE 可選特性分頁逐項顯示獨立開關；啟用或停用一項不會改變其他選項。
  - TCE opt-in 預設關閉，並按角色持久化；切換角色、關閉／重開 Management、切換語言及重套資源後仍載入正確狀態。
  - 僅已啟用且符合職業／等級條件的 TCE 可選特性會影響資源生成；切換開關後資源套用結果相應更新。
  - 職業、等級、子職業、能力值及 TCE opt-in 的輸入與持久化。
  - PB、職業等級及能力調整值公式（含邊界值）。
  - 共用池不重複、不同恢復池分開、每回合／每輪限制獨立表示。
  - 重套時保留手動資源及相同資源池的消耗狀態。
  - 短休／長休恢復符合規則，特殊恢復未被錯誤映射。
  - 自訂職業不提供子職業，原有法術位與多職行為無回歸。
- 整合測試須使用以下角色矩陣：
  - **每個支援的子職業各一個 20 級角色案例**：逐一選取該子職業，驗證該職業及子職業截至 20 級取得的資源、上限公式、共用池及恢復設定。這是全子職業資料覆蓋，不可只挑代表性子職業；可用資料驅動測試逐筆產生案例。
  - **Fighter／Ranger／Rogue 多職**：驗證三職業同時啟用時的總等級 PB、各職業特性門檻、各自子職業選擇及資源不互相覆蓋。
  - **Sorcerer／Warlock 多職**：驗證兩種施法職業的職業資源、共享或相近資源不重複建池，並確認法術位既有行為不變。
  - **Bard／Paladin 多職**：驗證各自資源、依總等級計算的 PB，以及資源重套與恢復。
  - **Wizard／Artificer 多職**：驗證兩職的子職業及資源生成，並確認法術位及各職業進程維持正確。
  - **Cleric 1 級多職 dip**：搭配另一個較高等級職業，驗證 Cleric 在 1 級即須選子職業（包括適用的 Arcana Domain），且 Cleric 資源依 Cleric 職業等級而非角色總等級計算；PB 則依多職總等級計算。
- **覆蓋率建議**：上述案例是重要的整合情境，但單靠這些多職組合無法合理宣稱覆蓋 90% 的所有玩家用例；職業／子職業組合、取得等級、資源公式和恢復方式的排列仍很多。建議把「每個支援子職業的 20 級案例」作為子職業功能及資料的全覆蓋基線，再以每個不同資源公式、共享池、恢復規則、使用閘及輸入重建行為至少一個案例作規則矩陣覆蓋。若需要量化 90%，應先定義分母為受支援資源特性／規則分支，而非籠統的玩家用例；目標可設為至少 90% 的這些項目有自動化斷言，剩餘未覆蓋項目列明原因並以瀏覽器驗收補足。每一個多職案例另須驗證總 PB、職業等級歸屬及不重複建池。
- 完成 `.agent/CR/CR-class-resources-plan.md` 所列範圍後，更新計劃狀態及相關測試文件。

### Step K 明細案例（待執行；不代表已驗收）

#### 共用測試契約

- 使用資料驅動 fixture；預設每個子職業案例都是一個總職業等級 20 的單職角色，該職業列等級 20，選定表列子職業。能力值固定為 STR 14、DEX 14、CON 14、INT 14、WIS 14、CHA 14（調整值均為 +2），PB 應為 +6。TCE optional features 全關，除非案例明確要求開啟。
- 每一個 `K-Snnn` 案例比對獨立預期 fixture 與實際生成資源的完整集合：資源 key、名稱／所屬職業與子職業、存在／不存在、目前值與最大值公式、骰面、冷卻、重置／部分回復、共用池、付款成本、使用閘、事件或先攻 metadata。另斷言同一共享池只出現一次、不同 pool 不合併、無未預期的資源。
- 預期值必須由 `.agent/CR/class-resource-recovery-reference.md` 與核准規則來源人工整理成 fixture，不可由 `classResourceData` / `classSubclassData` 直接生成 oracle，避免測試與被測資料目錄同源而自我驗證。規則來源仍待核實的特性須列為 blocked／deferred，不以推測值通過。

#### K-S001–K-S104：全部支援子職業的 20 級案例

每個下列方框都是獨立案例；共 104 個。子職業解鎖級別為其職業的共同邊界，表列來源必須與 UI 選項及資源來源 metadata 一致。

- **Artificer（解鎖 3 級）**
  - [ ] K-S001 Alchemist（TCE）
  - [ ] K-S002 Armorer（TCE）
  - [ ] K-S003 Artillerist（TCE）
  - [ ] K-S004 Battle Smith（TCE）
- **Barbarian（解鎖 3 級）**
  - [ ] K-S005 Berserker（PHB）
  - [ ] K-S006 Totem Warrior（PHB）
  - [ ] K-S007 Ancestral Guardian（XGE）
  - [ ] K-S008 Storm Herald（XGE）
  - [ ] K-S009 Zealot（XGE）
  - [ ] K-S010 Beast（TCE）
  - [ ] K-S011 Wild Magic（TCE）
  - [ ] K-S012 Path of the Giant（BGG）
- **Bard（解鎖 3 級）**
  - [ ] K-S013 Lore（PHB）
  - [ ] K-S014 Valor（PHB）
  - [ ] K-S015 Glamour（XGE）
  - [ ] K-S016 Swords（XGE）
  - [ ] K-S017 Whispers（XGE）
  - [ ] K-S018 Creation（TCE）
  - [ ] K-S019 Eloquence（TCE）
- **Cleric（解鎖 1 級）**
  - [ ] K-S020 Knowledge（PHB）
  - [ ] K-S021 Life（PHB）
  - [ ] K-S022 Light（PHB）
  - [ ] K-S023 Nature（PHB）
  - [ ] K-S024 Tempest（PHB）
  - [ ] K-S025 Trickery（PHB）
  - [ ] K-S026 War（PHB）
  - [ ] K-S027 Death（DMG）
  - [ ] K-S028 Arcana（SCAG）
  - [ ] K-S029 Forge（XGE）
  - [ ] K-S030 Grave（XGE）
  - [ ] K-S031 Order（TCE）
  - [ ] K-S032 Peace（TCE）
  - [ ] K-S033 Twilight（TCE）
- **Druid（解鎖 2 級）**
  - [ ] K-S034 Land（PHB）
  - [ ] K-S035 Moon（PHB）
  - [ ] K-S036 Dreams（XGE）
  - [ ] K-S037 Shepherd（XGE）
  - [ ] K-S038 Stars（TCE）
  - [ ] K-S039 Wildfire（TCE）
- **Fighter（解鎖 3 級）**
  - [ ] K-S040 Champion（PHB）
  - [ ] K-S041 Battle Master（PHB）
  - [ ] K-S042 Eldritch Knight（PHB）
  - [ ] K-S043 Arcane Archer（XGE）
  - [ ] K-S044 Cavalier（XGE）
  - [ ] K-S045 Samurai（XGE）
  - [ ] K-S046 Rune Knight（TCE）
  - [ ] K-S047 Psi Warrior（TCE）
- **Monk（解鎖 3 級）**
  - [ ] K-S048 Four Elements（PHB）
  - [ ] K-S049 Open Hand（PHB）
  - [ ] K-S050 Shadow（PHB）
  - [ ] K-S051 Drunken Master（XGE）
  - [ ] K-S052 Kensei（XGE）
  - [ ] K-S053 Astral Self（TCE）
  - [ ] K-S054 Mercy（TCE）
  - [ ] K-S055 Ascendant Dragon（FToD）
- **Paladin（解鎖 3 級）**
  - [ ] K-S056 Ancients（PHB）
  - [ ] K-S057 Devotion（PHB）
  - [ ] K-S058 Vengeance（PHB）
  - [ ] K-S059 Oathbreaker（DMG）
  - [ ] K-S060 Conquest（XGE）
  - [ ] K-S061 Redemption（XGE）
  - [ ] K-S062 Glory（TCE）
  - [ ] K-S063 Watchers（TCE）
- **Ranger（解鎖 3 級）**
  - [ ] K-S064 Beast Master（PHB）
  - [ ] K-S065 Hunter（PHB）
  - [ ] K-S066 Gloom Stalker（XGE）
  - [ ] K-S067 Horizon Walker（XGE）
  - [ ] K-S068 Monster Slayer（XGE）
  - [ ] K-S069 Fey Wanderer（TCE）
  - [ ] K-S070 Swarmkeeper（TCE）
  - [ ] K-S071 Drakewarden（FToD）
- **Rogue（解鎖 3 級）**
  - [ ] K-S072 Thief（PHB）
  - [ ] K-S073 Assassin（PHB）
  - [ ] K-S074 Arcane Trickster（PHB）
  - [ ] K-S075 Inquisitive（XGE）
  - [ ] K-S076 Mastermind（XGE）
  - [ ] K-S077 Scout（XGE）
  - [ ] K-S078 Swashbuckler（XGE）
  - [ ] K-S079 Phantom（TCE）
  - [ ] K-S080 Soulknife（TCE）
- **Sorcerer（解鎖 1 級）**
  - [ ] K-S081 Draconic Bloodline（PHB）
  - [ ] K-S082 Wild Magic（PHB）
  - [ ] K-S083 Divine Soul（XGE）
  - [ ] K-S084 Shadow Magic（XGE）
  - [ ] K-S085 Aberrant Mind（TCE）
  - [ ] K-S086 Clockwork Soul（TCE）
- **Warlock（解鎖 1 級）**
  - [ ] K-S087 Archfey（PHB）
  - [ ] K-S088 Fiend（PHB）
  - [ ] K-S089 Great Old One（PHB）
  - [ ] K-S090 Hexblade（XGE）
  - [ ] K-S091 Celestial（XGE）
  - [ ] K-S092 Fathomless（TCE）
  - [ ] K-S093 Genie（TCE）
- **Wizard（解鎖 2 級）**
  - [ ] K-S094 Abjuration（PHB）
  - [ ] K-S095 Conjuration（PHB）
  - [ ] K-S096 Divination（PHB）
  - [ ] K-S097 Enchantment（PHB）
  - [ ] K-S098 Evocation（PHB）
  - [ ] K-S099 Illusion（PHB）
  - [ ] K-S100 Necromancy（PHB）
  - [ ] K-S101 Transmutation（PHB）
  - [ ] K-S102 War Magic（XGE）
  - [ ] K-S103 Bladesinging（TCE）
  - [ ] K-S104 Order of Scribes（TCE）

#### K-B001–K-B023：解鎖、公式與可選特性邊界

- [ ] K-B001–K-B013：每個 13 個標準職業各驗一個解鎖 UI 邊界案例：等級 `unlockLevel - 1` 子職業欄位不可要求選擇；等級 `unlockLevel` 必須選擇；降低等級、增加等級及切換職業後，不保留不合法的子職業值。Custom 職業不得出現子職業欄位。
- [ ] K-B014–K-B023：逐項測以下 10 個 TCE optional features 各自獨立的 off/on、適用職業、`unlockLevel - 1` / `unlockLevel` 邊界及生成差異：Cleric Harness Divine Power（2）、Druid Wild Companion（2）、Monk Quickened Healing（2）、Monk Focused Aim（2）、Paladin Harness Divine Power（3）、Ranger Favored Foe（1）、Ranger Primal Awareness（3）、Ranger Nature's Veil（10）、Sorcerer Magical Guidance（5）、Sorcerer Sorcerous Restoration（20）。預設 off；只影響該項及所需既有池／成本，不連動修改其他選項。
- [ ] K-B024：邊界屬性 fixture 覆蓋六能力分數 1、最低合法值、10（調整值 0）、20（調整值 +5）、30（調整值 +10）及空白；驗證上限、最少 1 規則及必填錯誤，不得把 PB、職業等級公式錯用能力調整值。
- [ ] K-B025：PB 邊界按總職業等級 1、4、5、8、9、12、13、16、17、20 驗證；資源公式需明確區分角色總等級 PB 與持有該特性的職業等級。
- [ ] K-B026–K-B039：逐項驗證所有 14 個生成公式／子公式分支（fixed、PB、twice-PB、half-PB-up、ability、ability-plus、ability-times、class-level、class-level-half-up、class-level-plus-one、class-level-times、level-tiers、cleric-channel-divinity、barbarian-rage）至少涵蓋最小值、升階邊界及 20 級值。`half-PB-up` 同時驗 Harness Divine Power 的法術位環級上限 metadata。對應資源 fixture 由規則參考逐項指派，不可只用一個通用例取代不同公式的邊界。
- [ ] K-B040 固定值資源門檻；[ ] K-B041 PB 上限資源門檻；[ ] K-B042 能力值公式資源門檻；[ ] K-B043 等級 tier 資源門檻；[ ] K-B044 子職業限制資源門檻；[ ] K-B045 `recoveryFromLevel` 回復方式切換門檻；[ ] K-B046 骰面／次數隨等級變化門檻；[ ] K-B047 shared pool 消費者和 pool key；[ ] K-B048 資源付款成本及替代成本；[ ] K-B049 recovery-only 定義與資源存在條件；[ ] K-B050 TCE 特性適用門檻。每一 case 均須列出完整適用目錄列與 fixture 數，不可用單一代表列替代整份矩陣。生成／解鎖門檻須逐列以獨立 fixture 比較 `level - 1` 不生成／不啟用與 `level` 生成／啟用；公式、回復方式、骰面／次數等變化則須在每個實際變化門檻前後測試並斷言具體數值或 metadata 變更，不可錯判為底層資源消失。共享池／成本須驗證所有相關消費者、key、成本與替代成本；recovery-only 須逐列驗證存在條件，若目錄中沒有適用定義，需記錄已核對的 N/A 與依據。

#### K-T001–K-T007：跨目錄不變條件

- [ ] K-T001 共用池：Bardic Inspiration、Channel Divinity、Wild Shape、Ki、Rage、Sorcery Points、Superiority Dice 及所有有多個消費者的 pool key 不重複建立；所有消費者都指向正確既有 key。
- [ ] K-T002 獨立池：同職業不同恢復方式、不同資源 key、不同法術環級及 Rune Knight 各 rune slot 均不合併；同卡分組不改變 pool identity。
- [ ] K-T003 恢復矩陣：短休、長休、SR/LR（統一標為短休）、部分短休回復、long-rest reset-to、empty-only、生命骰半數回復各按規則恢復；每回合／每輪／先攻／事件觸發不可被普通休息按鈕錯誤回復。
- [ ] K-T004 使用限制與成本：once-per-turn、once-on-your-turn、once-per-round、effect gate、法術位／Ki／Channel Divinity／傷害／物品成本分別記錄，不能混為 cooldown 或免費次數。
- [ ] K-T005 重套與消耗保留：同 pool key 保持 current（包括超上限狀態），已刪除生成資源移除、手動資源保留、新增資源以正確初始值建立。
- [ ] K-T006 Locale／輸入持久化：兩種語言切換及重繪後保留 class、level、subclass、六能力值、TCE selection；使用者角色隔離且資料 reload 後一致。
- [ ] K-T007 報告差異：每一資源輸出 fixture 要能明確列出 missing、unexpected、wrong maximum、wrong recovery、wrong pool key，而非只以總數相等判定成功。

#### K-M001–K-M005：指定多職整合角色

多職 fixture 的能力值固定 +2（另在公式／能力邊界組補測）；單一 build case 一次建立整個角色，不得以分開單職結果相加替代。

- [ ] K-M001 Fighter 5（Battle Master）／Ranger 5（Gloom Stalker）／Rogue 5（Arcane Trickster），總等級 15、PB +5；僅為此案例 opt-in Ranger Favored Foe。驗證三個子職業、各職業 5 級門檻、Fighter／Ranger／Rogue 各自 class-level 資源、Favored Foe 使用次數依角色總 PB 而非 Ranger 等級、共享／獨立 pool identity、第三施法者多職法術位，以及無跨職業資源覆蓋。
- [ ] K-M002 Sorcerer 10（Clockwork Soul）／Warlock 10（Genie），總等級 20、PB +6。驗證 Sorcery Points 依 Sorcerer 等級、Pact Magic 依 Warlock 等級、Pact Slot 池不重複、Warlock 10 尚無 11 級 Mystic Arcanum、合併施法者法術位符合既有算法。
- [ ] K-M003 Bard 10（Eloquence）／Paladin 10（Watchers），總等級 20、PB +6，CHA 16（調整值 +3）。驗證 Bardic Inspiration 次數依 CHA、於 Bard 5 級改為短休回復、Paladin 池依 Paladin 等級、Channel Divinity 不重複、所有 PB 資源使用總角色 PB。
- [ ] K-M004 Wizard 10（Order of Scribes）／Artificer 10（Battle Smith），總等級 20、PB +6，INT 16（調整值 +3）。驗證 Artificer 半施法者與 Wizard 多職法術位進程、兩職 class-level 資源、INT 公式、Arcane Jolt 每回合閘及 pool identity。
- [ ] K-M005 Cleric 1（Arcana）／Fighter 19（Champion），總等級 20、PB +6。驗證 Cleric 1 級子職業為必填、SCAG Arcana 可選、Cleric 資源門檻依 Cleric 等級（不得誤生 Cleric 2 級 Channel Divinity）、Fighter 資源依 Fighter 等級、PB 依總角色等級及多職法術位維持既有行為。

#### 執行順序與子代理可行性評估

- Step K 尚未全部完成。多職 K-M001–K-M005 和 UI 解鎖 K-B001–K-B013 已由 orchestrator 執行；相關逐案結果見 `.agent/CR/step-k-orchestrator-report.md`。其餘仍須完成：K-S001–K-S104、K-B014–K-B050、K-T001–K-T007，並讓每名 testor 的報告經 auditor 留言及同一 testor 跟進後再關閉。未經操作員要求，不進入 Step L，也不把 Step K targeted matrix 說成所有 Stage 5 驗收完成。
- **估計規模**：104 個子職業 level-20 case、50 個邊界／公式 case 群、7 個跨目錄 invariant case、5 個多職 case；部分案例會共用同一個資料驅動 harness，但每個列出的 ID 都需有可追溯結果。實際單元數量應在 fixture 展開後列入執行報告。
- **可拆給較弱 subagents 的工作**：在完整、凍結且獨立核實的期望 fixture 與固定測試流程提供後，可分配互不重疊的 class batch（例如 13 class groups 分為 4 批，約 3–4 class／批），只負責執行案例、檢查輸出與回報 case ID、expected／actual 差異；並行前要確保每個 worker 使用隔離的 browser context／localStorage。subagent 不修改共用 production files，不自行裁決未核實 RAW。
- **不建議交給弱代理的工作**：建立或裁定 RAW oracle、處理跨職業法術位／共享 pool 的規則判讀、修正共用生成器、合併彼此衝突的發現。這些需由主代理集中審核；有規則疑義時使用 D&D 5E (2014) Rules Auditor 或保留 blocked 狀態。
- **建議編排**：由具完整 repo／規則脈絡的主代理先建立獨立 oracle、資料驅動 harness、共享斷言及多職 fixture，再集中審查任何失敗。若 harness 已成熟，可把 13 個 class groups 分 4 個彼此獨立批次給較弱 subagents 做機械式驗證，主代理自己負責 K-B、K-T、K-M 和 triage；不應同時讓多代理操作同一個 browser page 或修改同一段 `src/cr.js`。
- **GPT-6 Luna 配置判斷**：不用長 context window；class 資料可從 repo／fixture 按批載入。建議在 oracle／harness 設計及失敗分析階段維持高思考強度，待 fixture 凍結後把重複的 104 個機械案例交給一般／較弱代理。若當前沒有可隔離的 browser context 或確定的 fixture，則由單一主代理依同一資料驅動流程逐批跑，避免並行資料污染；無須為單純逐筆執行全程保持最高思考強度。

## 實作步驟 DAG 草案

下圖表示工作相依而非必須逐項串行的排程。各步驟以完成並通過其交付檢查為依賴解除條件；Cartomancer 與 Storm Strike 的原文核實只阻擋各自有疑問的資料項目，不阻擋其他明確資源。

```mermaid
flowchart TD
    A["A. 稽核現有 class builder、metadata、重建流程及測試入口"]
    B["B. 核實規則來源；定義職業、子職業與資源資料規格"]
    C["C. 建立核准來源職業／子職業／資源目錄"]
    D["D. 定義 class input 與 generated-resource metadata schema"]
    E["E. 實作子職業選擇及六項能力值輸入"]
    F["F. 實作 Management 的逐項 TCE opt-in 分頁及角色持久化"]
    G["G. 實作公式、PB、解鎖等級及資源池生成"]
    H["H. 實作資源分組、成本／使用閘、重建與消耗狀態保留"]
    I["I. 完成本地化、可及性標籤及介面樣式"]
    J["J. 執行公式／資料目錄與 UI 狀態的針對性測試"]
    K["K. 執行 Stage 5 全子職業 20 級及多職整合矩陣"]
    L["L. 回歸驗證法術位、自訂職業、手動資源及休息恢復"]
    M["M. 更新驗收文件、未覆蓋分支及實作狀態"]

    A --> B
    B --> C
    A --> D
    B --> D
    C --> G
    D --> E
    D --> F
    C --> E
    C --> F
    E --> G
    F --> G
    G --> H
    E --> I
    F --> I
    H --> I
    C --> J
    G --> J
    H --> J
    I --> J
    J --> K
    K --> L
    L --> M
```

### DAG 步驟交付與依賴

- **A → B**：先確認現有輸入、儲存、更新及測試邊界；再依 RAW 建立可追溯的資料規格。取得原文若受阻，只將對應規則項目標示待核實。
- **B → C**：資料目錄包含來源版本、解鎖等級、公式、共享池 key、恢復方式、成本及使用限制；未核實的特性不得以猜測值進入可執行目錄。
- **A、B → D**：metadata schema 須能持久化各職業輸入、能力值、每一項 TCE opt-in，以及資源 pool identity，並兼容既有手動資源。
- **C、D → E、F**：子職業與能力值 UI、TCE 獨立開關可平行實作，但兩者均須使用已定義的職業目錄及角色 metadata。TCE 開關預設關閉、互不連動，並按角色隔離。
- **C、E、F → G**：資源生成根據資料目錄和有效輸入計算；PB 使用總職業等級，其他公式使用其規則指定的職業等級／能力值。僅已啟用且符合條件的 TCE 選項參與計算。
- **G → H**：先產生正確的資源池，再處理卡片分組、不同 pool 保持獨立、恢復及重建時狀態保留。
- **E、F、H → I**：介面字串、可及性標籤與樣式需覆蓋新增控制及狀態，不自行改變計算規則。
- **C、G、H、I → J → K → L**：先驗證規則／UI 單元行為，再執行全子職業 20 級資料矩陣和指定多職案例，最後檢查既有行為無回歸。
- **L → M**：只有驗收結果、限制及未覆蓋規則分支均記錄後，才更新完成狀態與相關測試文件。

## 操作員需參與事項

### 必要：提供原書文字（若代理仍無法查閱原書）

實作前代理會先嘗試自行核對以下原書條文。只有在無法取得可靠原文時，才需要操作員提供相關頁面影像／逐字條文，或確認將該項目延後；毋須操作員代為整理或實作：

- **BMT Cartomancer（p. 49）**：確認卡牌施法是否明文免除法術位消耗。
- **BGG Storm Strike（p. 19）**：確認 PB 次／長休限制的確切適用範圍。

在這兩項條文核實前，代理不得把 Cartomancer 當作免費施法，也不得把 Storm Strike 的 PB 限制擴大至其他 Strike of the Giants 選項。若操作員不提供原文，代理會將有疑問的項目標為待處理並避免推測，不會因此阻擋其他已有明確規則的資源。

### 可選：完成後人工驗收

代理會自行執行可行的瀏覽器驗證並回報結果。若操作員希望確認實際遊戲流程，可再人工驗收子職業選擇、資源使用及休息恢復體驗；這不是代理開始實作前的必要前置條件。

### 代理負責、無須操作員代辦

- 依已核准的書籍範圍整理職業／子職業資料、資源公式及恢復規則。
- 按 RAW 盤點每項能力的解鎖等級、共享資源池、使用閘及額外成本。
- 修改程式、介面、本地化及相關文件；執行自動或瀏覽器測試並處理發現的回歸問題。
- 對規則上已明確且不涉及 house rule 的問題，先查核規則來源或諮詢 D&D 5E 規則審核代理；只有涉及 house rule 或產品範圍的新決定時才詢問操作員。

## RAW 核實事項

- **BMT Cartomancer（BMT p. 49）**：參考資料未確定卡牌施法是否免法術位。代理實作前先查核印刷條文；除非文字明確免除，按一般施法規則處理為需要支付合資格法術位，不可記成免費施法。若代理無法查閱原文，再按「操作員需參與事項」索取條文或延後該項目。
- **BGG Storm Strike（BGG p. 19）**：代理實作前先查核 PB 次／長休限制在印刷版中的適用範圍。未有明文支持時，只套用於 Storm Strike，不擴大至其他 Strike of the Giants 選項；其 PB 池與每回合使用閘分開表示。若代理無法查閱原文，再按「操作員需參與事項」索取條文或延後該項目。
- **核實原則**：D&D 規則審核代理在 Pass 1 無法存取原書；實作階段須重新嘗試查閱可靠原文，並在資源目錄保留核實依據，不可把代理先前無法查閱視為已核實。
- **其他非標準恢復**：例如 Divine Intervention 七日限制、擲先攻時補充及事件觸發恢復留待後續階段，第一階段不把它們當普通短休／長休池。

## 不可違反的實作限制

- 沿用 classic script、IIFE、現有本地化及事件處理模式；不引入框架、建置工具或第三方依賴。
- 不改動已實作的法術位計算邏輯。
- 不產生未核准來源或自訂職業的子職業資源；SCAG 僅允許 Cleric 的 Arcana Domain 作為例外。
- 不將專長／背景資源混入職業／子職業選擇範圍。
- 資源分組僅影響呈現，不得破壞 pool identity、恢復規則、觸發條件或成本。

## Pass 2 implementation status

- 已實作標準職業子職業選擇、六項能力值輸入、逐項 TCE opt-in、資源公式與骰面 metadata、穩定 pool key、回復／成本／使用閘顯示，以及重套時保留手動資源和相同 pool 的消耗值。
- 已更新核准資源參考中發現的錯誤：Paladin Channel Divinity 次數、Arcane Jolt 公式、Harness Divine Power 使用次數／法術位環級、部分 Wizard 能力，以及 Bard Eloquence 和 Druid Circle of Stars 資源。
- 已按 `.agent/CR/CR-stage5-playwright-tests.md` 執行 targeted browser checks，涵蓋輸入解鎖、選項隔離與持久化、代表性公式、休息恢復、重套保留和法術位／自訂職業回歸。
- **Step J targeted tests 已完成**：以臨時 Ranger 1／Fighter 3（Battle Master）／Paladin 2 角色驗證總等級 PB、Paladin CHA 與職業等級公式、Battle Master 骰池、TCE 預設關閉／啟用後生成，以及能力值、子職業與角色隔離狀態的重新載入持久化；無瀏覽器錯誤。這不是 Step K 的完整多職矩陣。
- **Step K 未執行（依操作員指示）**；逐一覆蓋全部子職業的 20 級案例及完整多職矩陣仍未驗收，不宣稱 Stage 5 全矩陣完成。
- 先攻／事件觸發目前保存為 metadata 並顯示於資源資訊，未自動偵測戰鬥事件。Rune Knight 的 rune 使用池按已知 rune 數量分開追蹤，但目前以通用序號表示，沒有記錄各 rune 的名稱。
