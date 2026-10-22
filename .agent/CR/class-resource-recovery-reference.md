# D&D 5e 職業資源與恢復周期參考

- **用途**：作為 CR 後續建立職業 / subclass 專用資源疊、設定回復周期、設計生成與重算規則的參考；不是目前程式已支援功能清單。
- **規則基準**：D&D 5e 2014 版（含 2014 規則相容的後續選項），不混用 2024 新版規則。
- **盤點範圍**：PHB、DMG、SCAG、XGE、Guildmasters' Guide to Ravnica、Eberron: Rising from the Last War、Explorer's Guide to Wildemount、Tasha's Cauldron of Everything、Van Richten's Guide to Ravenloft、Fizban's Treasury of Dragons、Bigby Presents: Glory of the Giants（BGG）、The Book of Many Things（BMT）。
- **完整性界線**：列出上述來源範圍內的職業級資源池、具有限次 / 充能的資源型 subclass 能力，以及會支付資源的常見能力。官方資料還有其他冒險、設定、數位及短篇出版物；不在上述清單的出版內容未逐項核驗，不能將本文件當作所有官方 2014 相容出版物的絕對全集。UA、第三方與 homebrew 不在範圍。
- **摘要方式**：以下用自己的話整理規則，不複製規則原文。子職業能力若消耗既有職業池，記在「消耗既有池」，不另外虛構一個使用次數池。

## 回復類型定義

| 標記 | 意義 | CR 建模建議 |
|---|---|---|
| `SR` | 短休結束後恢復 | `短休` |
| `LR` | 長休結束後恢復 | `長休` |
| `SR/LR` | 短休或長休結束後恢復 | 工具統一記為`短休`；長休批次回復亦涵蓋此資源 |
| `每日` | 每日 / 長休節奏恢復；按來源文字決定每日邊界，不應自動等同任意長休 | `長休`或明確自訂周期，需保留來源語意 |
| `先攻觸發` | 擲先攻時符合條件才恢復，不是休息周期 | 獨立觸發，不可映射成`短休`或`長休` |
| `事件觸發` | 施放法術、特定能力成功、特定物件消耗等事件後恢復 | 記錄事件 / 前置條件 |
| `累積資源` | 合資格事件逐次增加數量，受容量上限限制，並可由其他能力消耗；不是普通休息冷卻池 | 需要獨立的取得、上限、消耗及失效 / 重設模型；未設計前不可當成一般 recoverable resource 實作 |
| `付費再用` | 額外使用需消耗法術位或另一資源 | 表示為資源成本，不增加免費上限 |
| `無有限池` | 能力可用，但無每休息次數池；可能仍受回合、動作、持續時間或其他限制 | 不建立資源疊 |

**通用判讀**：工具將規則書中的 `SR/LR` 統一映射為`短休`冷卻；長休恢復會涵蓋短休資源。`每短休或長休恢復`不同於`每日一次`；「短休後才可使用的恢復能力」也不同於被恢復的法術位。單次施法 / 攻擊 / 反應限制是行動經濟，不等於可消耗資源池。

## Artificer（E:RftLW / TCE）

- **Spell Slots**：長休恢復；Artificer 在多職業施法者等級計算採半施法等級向上取整。
- **Flash of Genius（7 級）**：使用次數等於智力調整值（至少 1），LR 恢復。
- **Spell-Storing Item（11 級）**：儲存一個合資格法術；使用次數等於兩倍智力調整值（至少 2），耗盡後 LR 恢復。這是物品中的職業能力次數，不是法術位；創建 / 重設該物品與逐次施法需分開表達。
- **Alchemist：Experimental Elixir**：完成 LR 後免費製作一瓶；額外製作每瓶消耗一個法術位。藥劑效果本身不另有回復池。
- **Alchemist：Restorative Reagents（9 級）**：`Lesser Restoration` 免費施放次數等於智力調整值（至少 1），LR 恢復；藥劑帶來的臨時 HP 是效果，不是另一個可累積池。
- **Armorer：Defensive Field（3 級）**：使用次數等於熟練加值（PB），LR 恢復。
- **Artillerist：Eldritch Cannon**：完成 LR 後免費創造一座；同時只能維持一座（15 級特性可有兩座）；額外創造消耗法術位。其持續時間不是休息回復池。
- **Battle Smith：Arcane Jolt（9 級）**：使用次數等於 INT 調整值（至少 1），LR 恢復；每回合最多使用一次。
- **Steel Defender**：修復 / 復活可能需要動作、工具或法術位；不可把夥伴 HP 當成 subclass 每日次數池。
- 其他 infusions、工具熟練、裝備選擇多數不是休息次數資源。

## Barbarian（PHB / SCAG / XGE / TCE）

- **Rage**：依 Barbarian 等級表取得次數；LR 恢復。20 級不再受次數限制。Rage 是多項 subclass 能力共用的職業池。
- **Berserker：Frenzy**：發動 Rage 時選擇進入 Frenzy，沒有額外 Frenzy 次數池；Rage 結束後承受 Exhaustion。Exhaustion 不是「短休恢復」資源。
- **Ancestral Guardian**：Spirit Shield 等在 Rage / 反應條件下使用，沒有獨立次數池；Consult the Spirits：短休或長休恢復（本工具統一標為「短休」）。
- **Storm Herald**：Storm Aura 依 Rage 啟動，沒有每日 aura 次數池。
- **Zealot**：Fanatical Focus 每次 Rage 一次；與 Rage 次數綁定，不另加一池。Rage Beyond Death 依 Rage 維持。
- **Battlerager（SCAG）**：主要能力依 Rage 或攻擊動作使用，沒有獨立充能池。
- **Wild Magic（TCE）**：Bolstering Magic 次數等於 PB / LR；可用於短期增益或恢復法術位。其他 Wild Surge 效果不形成穩定的共用次數池。
- **Beast（TCE）**：Claws / Bite / Tail 形態在 Rage 期間使用，無額外形態次數池。
- 其餘列入來源範圍的 Barbarian subclass 若能力未給出使用上限，歸 `無有限池`，不應自行套用 Rage 次數以外的冷卻。

## Bard（PHB / SCAG / XGE / TCE / VRGtR）

- **Bardic Inspiration**：次數等於魅力調整值（至少 1）；Bard 1–4 級 LR 恢復，從 5 級 Font of Inspiration 起 SR/LR 恢復。子職業消耗它時共用同一池。
- **Superior Inspiration（20 級）**：擲先攻時若沒有 Bardic Inspiration 使用次數，恢復 1 次（`先攻觸發`）。
- **Lore：Cutting Words；Valor：Combat Inspiration；Glamour：Mantle of Inspiration；Swords：Blade Flourish；Whispers：Psychic Blades；Eloquence：Unsettling Words；Spirits：Tales from Beyond**：消耗 Bardic Inspiration，不另設次數池。
- **Glamour：Enthralling Performance**：SR/LR。**Mantle of Majesty**：LR。**Unbreakable Majesty**：SR/LR。
- **Whispers：Words of Terror、Mantle of Whispers**：SR/LR；**Shadow Lore**：LR。
- **Creation：Performance of Creation**：3 級解鎖；LR 免費使用一次，額外使用需消耗至少 2 環法術位。其 Animated Object 持續時間不是每日再次充能的獨立池。
- **Creation：Animating Performance**：6 級解鎖；LR 免費使用一次，額外使用需消耗至少 3 環法術位。可在給予 Bardic Inspiration 的同一個附贈動作中指揮 animated object；不因此額外消耗 Bardic Inspiration。
- **Eloquence：Universal Speech**：LR。**Unsettling Words** 消耗 Bardic Inspiration；**Infectious Inspiration** 使用次數等於 CHA 調整值（至少 1）/ LR，成功觸發時不消耗 Bardic Inspiration。
- **Spirits：Tales from Beyond**：消耗 Bardic Inspiration；效果擲骰後不形成另一個可保存的資源池。
- **Spirits：Spirit Session**：完成一次短休儀式後選擇一個符合等級限制的法術，可在下次長休前免費施放一次；使用此特性後 LR 才可再次主持儀式。
- PHB / SCAG / XGE 的其他學院特性多為消耗 Bardic Inspiration、法術位或沒有有限使用次數。

## Cleric（PHB / DMG / SCAG / XGE / GGtR / TCE）

- **Channel Divinity**：2 級取得 1 次，6 級 2 次，18 級 3 次；SR/LR 恢復。Turn Undead 與所有 Domain Channel Divinity 選項共用此池。
- **Divine Intervention**：使用後若成功，7 日內不能再次使用；20 級成功率改變，但成功後仍依特性規則等待 7 日。不要簡化為普通 LR。
- **Light：Warding Flare；Tempest：Wrath of the Storm；Grave：Sentinel at Death's Door**：各自有獨立的 WIS 調整值次（至少 1）/ LR 池。
- **Peace：Emboldening Bond；Twilight：Steps of Night**：各有 PB 次 / LR 的使用上限。Twilight Sanctuary 另消耗 Channel Divinity。
- **Twilight：Eyes of Night**：共享黑暗視覺的使用為 LR 一次；再次共享可依特性支付任意環級法術位。
- **Forge / Grave / Order / Peace / Twilight / Arcana / Death** 等 Domain 的 Channel Divinity 招式：消耗共用 Channel Divinity 池，不各建一池。
- **War：War Priest**：WIS 調整值次（至少 1）/ LR。
- **TCE optional：Harness Divine Power**：使用次數依 Cleric 等級為 2 級 1 次、6 級 2 次、18 級 3 次，LR 恢復；每次使用另外消耗一次 Channel Divinity，並恢復一個不高於 PB 一半向上取整環的法術位。這是有兩個資源欄位互動的兌換，不是免費法術位池。
- **Arcana：Arcane Abjuration**、**Death：Touch of Death**、**Forge：Artisan's Blessing**、**Order：Order's Demand**、**Grave：Path to the Grave**、**Peace：Balm of Peace**、**Twilight：Twilight Sanctuary** 等均按 Channel Divinity 計費。

## Druid（PHB / SCAG / XGE / GGtR / TCE）

- **Wild Shape**：2 次；SR/LR 恢復。20 級 Archdruid 可無限使用。消耗此池的 subclass / optional feature（包括 Starry Form、Wildfire Spirit 及 Wild Companion）必須共用扣次數。Moon Druid 的 Elemental Wild Shape 花 2 次 Wild Shape。
- **Circle of the Land：Natural Recovery**：每日一次，在完成短休後恢復部分法術位；只能在短休結束時使用，不是 Wild Shape 恢復。
- **Circle of Dreams：Balm of the Summer Court**：治療骰池為 Druid 等級數量的 d6，LR 恢復。**Hidden Paths**：使用次數等於 WIS 調整值（至少 1），LR 恢復；不消耗 Wild Shape。**Walker in Dreams**：每日一次，依特性要求在短休後使用，LR 後恢復。
- **Circle of the Shepherd：Spirit Totem**：SR/LR。
- **Circle of Spores：Symbiotic Entity**：消耗 Wild Shape；Fungal Infestation 次數等於 WIS 調整值（至少 1）/ LR。Halo of Spores 是符合條件時每回合的反應，不是有限池。
- **Circle of Stars：Star Map**：Guiding Bolt 免費施放次數等於 PB / LR。**Starry Form** 消耗 Wild Shape；Cosmic Omen 次數等於 PB / LR。星象分支效果共用該次 Starry Form 狀態，不各自建池。
- **Circle of Wildfire：Wildfire Spirit**：召喚消耗 Wild Shape；Cauterizing Flames 次數等於 WIS 調整值（至少 1）/ LR。已消失的靈體可用法術位支付的復活方式應記為 `付費再用`。
- **TCE optional：Wild Companion**：消耗 Wild Shape，或支付法術位替代；此能力沒有再額外恢復一池。

## Fighter（PHB / DMG / SCAG / XGE / EGtW / TCE）

- **Second Wind、Action Surge**：SR/LR；Action Surge 17 級後有額外次數，但單回合使用上限仍按特性限制。
- **Indomitable**：LR；依 Fighter 等級增加次數。
- **Battle Master：Superiority Dice**：SR/LR；Maneuvers 共用骰池，3 級 d8、10 級 d10、18 級 d12。15 級 Relentless 在擲先攻時若沒有 superiority die，可恢復 1 顆（`先攻觸發`）。
- **Arcane Archer：Arcane Shot**：2 次 / SR/LR；15 級 Ever-Ready Shot 若擲先攻時沒有 Arcane Shot 使用次數，可恢復 1 次。
- **Cavalier：Unwavering Mark**：強化反擊次數等於 STR 調整值（至少 1）/ LR。**Warding Maneuver**：次數等於 CON 調整值（至少 1）/ LR。
- **Samurai：Fighting Spirit**：3 次 / LR；10 級若擲先攻時已無剩餘次數，恢復 1 次。**Strength Before Death**：LR。
- **Echo Knight（EGtW）：Unleash Incarnation**：次數等於 CON 調整值（至少 1）/ LR。Reclaim Potential：PB 次 / LR；Echo 的召喚本身沒有單獨次數池。
- **Rune Knight：Giant's Might、Runic Shield**：各 PB 次 / LR；每個 Rune 的啟動依該 rune 自己的規則 SR/LR 恢復，逐 rune 記錄，不能合併成一個 rune 池。
- **Psi Warrior：Psionic Energy Dice**：數量等於兩倍 PB；骰面為 d6（3 級）、d8（5 級）、d10（11 級）、d12（17 級）；LR 全恢復；若擲先攻時為 0，恢復 1 顆。所有消耗 psionic die 的能力共用一池。
- **Psi Warrior：Bulwark of Force、Telekinetic Master**：各有一次 / LR 的免費啟動；額外使用分別可消耗 Psionic Energy die（Telekinetic Master 亦按特性要求施放法術）。
- Champion、Purple Dragon Knight / Banneret、Eldritch Knight 等其他來源項目沒有新增的通用休息次數池；Eldritch Knight 法術位另屬 Spell Slots。

## Monk（PHB / SCAG / XGE / TCE / Fizban）

- **Ki**：數量等於 Monk 等級；SR/LR 恢復。所有 Ki-powered subclass 能力共用此池。Flurry of Blows、Patient Defense、Step of the Wind 各花 1 Ki；Stunning Strike 每次花 1 Ki；Empty Body（18 級）花 4 Ki。
- **Four Elements**：Elemental Attunement 不花 Ki；其餘 cost-bearing Disciplines 共用 Ki 池。咒法型 discipline 可額外花 Ki 提升法術環級，每升一環加 1 Ki，總成本上限按 Monk 等級決定（Monk 20 最多 6 Ki）；非咒法招式的額外傷害成本另行計算。Fangs of the Fire Snake 花 1 Ki 啟動，命中後可再花 1 Ki 取得首個額外 1d10 火焰傷害，每多花 1 Ki 再加 1d10；Fist of Unbroken Air 基礎 2 Ki；Open Hand 的 Quivering Palm 花 3 Ki；Shadow Arts 的付費施法花 2 Ki。
- **Long Death（SCAG）：Mastery of Death**：花 1 Ki 避免降至 0 HP；Touch of the Long Death 消耗 Ki。不是 SR/LR 獨立次數。
- **Drunken Master：Drunkard's Luck**：每次花 2 Ki，受 Ki 池限制。
- **Kensei：Deft Strike、Sharpen the Blade**：Deft Strike 花 1 Ki；Sharpen the Blade 花 1–3 Ki；不另設休息次數池。
- **Astral Self / Mercy（TCE）**：Arms of the Astral Self 花 2 Ki；Visage、Body、Hand of Healing / Harm 等按特性花 Ki，共用職業池。
- **Mercy：Hand of Ultimate Mercy（17 級）**：復活能力需 5 Ki，另限一次 / LR；同時受共用 Ki 池限制。
- **Ascendant Dragon（Fizban）：Breath of the Dragon**：免費使用次數等於 PB / LR；用完後可再花 Ki。免費次數與 Ki 池要分開記錄。
- **Ascendant Dragon：Wings of the Dragon**：一次 / LR 免費展翼；額外使用花 Ki。
- **Perfect Self（20 級）**：擲先攻時若沒有 Ki，立即恢復 4 點（`先攻觸發`）。

## Paladin（PHB / DMG / SCAG / XGE / TCE）

- **Divine Sense**：次數為 1 + CHA 調整值（至少 1）/ LR。
- **Lay on Hands**：HP 池等於 Paladin 等級 × 5；LR 全恢復。疾病 / 毒素治療也從同一池扣固定點數。
- **Channel Divinity**：取得 Oath 時（3 級）1 次；SR/LR 恢復。各 Oath 的 Channel Divinity 用途共用此池。
- **Oath of the Ancients / Devotion / Vengeance / Crown / Conquest / Redemption / Oathbreaker / Glory / Watchers**：各自 Channel Divinity 招式均消耗共用池。
- **Glory：Glorious Defense**：使用次數等於 CHA 調整值（至少 1）/ LR。
- **Watchers：Vigilant Rebuke**：使用次數等於 CHA 調整值（至少 1）/ LR。
- **TCE optional：Harness Divine Power**：使用次數依 Paladin 等級為 3 級 1 次、7 級 2 次、15 級 3 次，LR 恢復；每次另花一次 Channel Divinity，並恢復一個不高於 PB 一半向上取整環的法術位。
- 造成傷害時的 Divine Smite 消耗法術位；這是 Spell Slot 支出，不是額外 Smite 次數池。

## Ranger（PHB / SCAG / XGE / TCE / Fizban）

- **Spell Slots**：LR 恢復。以法術位發動的能力記為資源成本，不新建冷卻池。
- **PHB Beast Master**：治療或替換 companion 可能需法術位、時間；不是固定次數 / 休息池。TCE Primal Companion 的復活可花法術位；另有重新召喚流程，照各自成本記錄。
- **Horizon Walker：Detect Portal**：WIS 調整值次 / LR；Ethereal Step：SR/LR。
- **Monster Slayer：Magic-User's Nemesis**：LR。
- **Fey Wanderer：Fey Reinforcements**：每個符合條件的召喚法術各一次免費施放 / LR；Misty Wanderer：WIS 調整值次（至少 1）/ LR。
- **Swarmkeeper：Writhing Tide**：PB 次 / LR。
- **Drakewarden：Drake Companion**：LR 免費召喚；額外召喚花法術位。**Drake's Breath**：LR 免費一次；額外使用需支付 3 環以上法術位。
- **TCE optional：Favored Foe、Nature's Veil**：各 PB 次 / LR。Favored Foe 的額外傷害只在自己每回合首次命中標記目標時發生；這不是標記能力的額外使用次數限制。**Primal Awareness**：獲得的指定法術各有一次免費施放 / LR；額外施放使用法術位。
- 其他 Hunter、Gloom Stalker、Swarm 等能力若只有每回合觸發、動作或持續時間，沒有使用次數上限時屬 `無有限池`。

## Rogue（PHB / SCAG / XGE / TCE）

- **Stroke of Luck（Rogue 職業特性，20 級）**：一次 / SR 或 LR；不是 Thief 專屬資源。
- **Phantom：Wails from the Grave**：使用次數等於 PB / LR；傷害擲骰才是 Sneak Attack 骰數的一半向上取整。取得 Tokens of the Departed 後，在自己回合造成 Sneak Attack 傷害時可摧毀一枚身上持有的 Soul Trinket，免費再次使用 Wails from the Grave。**Ghost Walk**：一次 / LR；之後可在再次啟動時摧毀一枚 Soul Trinket 以額外使用。亦可用 Action 摧毀一枚 Trinket，向其靈魂問一條問題。Soul Trinket 上限為 PB；看見 30 呎內生物死亡時可用 Reaction 取得一枚。持有時對 Death Saving Throws 及 Constitution Saving Throws 有 Advantage。Trinket 不會因長休消失；17 級 Death Knell 只在長休結束時沒有任何 Trinket 才補一枚。此為事件取得及特定用途消耗的 token pool，不是普通休息充能池（TCE, p. 62）。
- **Soulknife：Psionic Energy Dice**：數量等於兩倍 PB；骰面為 d6（3 級）、d8（5 級）、d10（11 級）、d12（17 級）；LR 全恢復，SR 恢復 1 顆；若擲先攻時已無骰，恢復 1 顆。相關技能檢定與傷害共用此池。Psychic Whispers 與 Psychic Veil 各有一次免費 / LR 的啟動機會，之後可按各自規則花 Psionic Energy die 再用。
- **Arcane Trickster**：法術位 LR 恢復；Mage Hand Legerdemain 等不另造休息池。
- 其他 Inquisitive、Mastermind、Scout、Swashbuckler 等若能力沒有明文有限次數，屬 `無有限池`；Cunning Action / Sneak Attack 是回合頻率，不是冷卻資源。

## Sorcerer（PHB / XGE / TCE）

- **Sorcery Points**：數量等於 Sorcerer 等級；LR 全恢復。Metamagic、Flexible Casting 及 subclass 指定點數消耗共用此池。Sorcery Points 與 Spell Slots 會互相轉換，資料層不可把兩者混為一個池。
- **Sorcerous Restoration（20 級，TCE optional）**：SR 恢復 4 點 Sorcery Points。
- **Wild Magic：Tides of Chaos**：使用後通常需 LR 才恢復；在恢復前，施放 1 環或更高環 Sorcerer 法術後，DM 可選擇要求 Wild Magic Surge 擲骰；若 DM 如此裁定並觸發 Surge，Tides of Chaos 隨即恢復。這是 DM 可選的事件觸發，不是每次施法都自動恢復（PHB 2014, p. 103）。
- **Divine Soul：Favored by the Gods**：SR/LR。
- **Shadow：Strength of the Grave**：LR；Hound of Ill Omen 花 3 Sorcery Points；Umbral Form 花 6 點。
- **Clockwork Soul：Restore Balance**：PB 次 / LR；Bastion of Law 花 Sorcery Points；Trance of Order 花 5 點或 LR 免費一次；Clockwork Cavalcade 花 7 點或 LR 免費一次。
- **Aberrant Mind**：Psionic Sorcery、Revelation in Flesh 花 Sorcery Points；Warping Implosion LR 免費一次，額外使用支付 Sorcery Points。
- **TCE optional：Magical Guidance**：每次花 1 Sorcery Point；不是獨立長休池。

## Warlock（PHB / SCAG / XGE / TCE / VRGtR）

- **Pact Magic Spell Slots**：LR 或 SR 恢復；資源上限及環級依 Warlock 等級表。這是 spell slot pool，不能和 Mystic Arcanum 混為一列。
- **Mystic Arcanum**：6、7、8、9 環各一項；每項各自一次 / LR，施放該項所選法術不消耗 Pact Magic slot。若能力由其他規則改變，逐環保留各自 cooldown。
- **Eldritch Master（20 級）**：LR 一次；花 1 分鐘向 Patron 求助，恢復所有 Pact Magic slots。此能力一次數池本身和 slot 恢復結果要分開表達。
- **Archfey：Fey Presence、Misty Escape、Dark Delirium**：SR/LR。
- **Fiend：Dark One's Own Luck**：SR/LR；Hurl Through Hell：LR。
- **Great Old One：Entropic Ward**：SR/LR。
- **Hexblade：Hexblade's Curse**：SR/LR；Accursed Specter：LR。
- **Celestial（XGE）：Healing Light**：d6 池數量等於 Warlock 等級 + 1，LR 恢復；Searing Vengeance：LR。
- **Fathomless：Tentacle of the Deeps**：PB 次 / LR；Fathomless Plunge：LR。
- **Genie：Bottled Respite**：每次 LR 前可免費進入 vessel 一次；vessel 持續時間最多為 2 × PB 小時，PB 影響持續時間而非免費進入次數。可花 spell slot 再進入，但 paid-reuse 成本屬本階段 deferred scope。**Elemental Gift**：PB 次 / LR。**Limited Wish**：使用後經 1d4 次 LR 才可再用（不是固定每次 LR），屬本階段 deferred scope；Sanctuary Vessel 的攜伴能力沿用 Bottled Respite 的進入限制，不另建使用池。
- **Undead：Form of Dread**：PB 次 / LR；Necrotic Husk：LR；Spirit Projection：LR，額外使用可依特性花 Pact Magic slot。
- **Pact of the Talisman（TCE）：Protection of the Talisman**：PB 次 / LR；與 Pact Magic slot 分開。
- Eldritch Smite 等 Invocation 若花 Pact Magic slot，記為 `付費再用 / spell slot cost`，不再建立一個 invocation 使用池。

## Wizard（PHB / SCAG / XGE / EGtW / TCE）

- **Spell Slots**：LR 恢復。
- **Arcane Recovery**：每日一次，在完成 SR 後恢復部分 spell slots；這是「施放恢復能力」，不是短休自動補槽。
- **Signature Spells（20 級）**：兩個已選法術各有一次不花槽施放 / SR/LR；記為兩個特定 free-cast 次數。
- **Conjuration：Benign Transposition**：使用後需完成 LR 才能再次使用；施放 1 環或更高環咒法法術後亦會自動恢復使用機會（PHB 2014, p. 116）。
- **Divination：Portent**：每次 LR 後重擲預言骰（通常 2 顆，14 級 3 顆）；Third Eye：SR/LR。Expert Divination 可在施放合資格預言法術時回復較低環 spell slot（`事件觸發`）。
- **Enchantment：Instinctive Charm**：沒有全域使用次數池；成功抵抗此特性的攻擊者會在長休前免受此特性再次影響。
- **Evocation：Overchannel**：每 LR 首次使用無額外傷害；同一長休前額外使用會承受逐次增加的傷害。不是每次使用都消耗固定充能數。
- **Illusion：Illusory Self**：SR/LR。
- **Transmutation：Shapechanger**：SR/LR。**Major Transformation（14 級）**：LR 一次，消耗 Transmuter's Stone。
- **Abjuration：Arcane Ward**：建立時 HP 等於 2 × Wizard 等級 + INT 調整值；建立後持續至長休，且每長休只能建立一次。Ward 吸收傷害會扣 HP；施放 1 環或以上 Abjuration 法術時回復 2 × 法術環級 HP，上限為最大值。長休令 Ward 結束，不會自動建立或補滿；下一次選擇建立時才以最大 HP 開始。此為有建立限制、受傷耗損及法術事件回補的 HP buffer，需獨立設計，不按一般休息次數池實作（PHB 2014, p. 115）。
- **War Magic：Power Surge**：上限等於 INT 調整值（至少 1）；長休結束時數量重設為 1；短休結束時若數量為 0 則取得 1，否則不變。Counterspell／Dispel Magic 成功終止法術時取得 1 個 surge。每回合一次，當 Wizard 法術對生物或物件造成傷害時，可消耗 1 個 surge，對該目標增加等於 Wizard 等級一半的 Force damage。Arcane Deflection 不會產生 surge。此為事件累積的 charge pool；增量、條件、消耗與兩種休息行為需一併建模，不可只當一般 LR 次數池（XGE, p. 59）。
- **Chronurgy（EGtW）：Chronal Shift**：2 次 / LR；Momentary Stasis：PB 次 / LR；Arcane Abeyance：SR/LR；Convergent Future 沒有固定次數池，但每次承受 Exhaustion，視為代價而非冷卻。
- **Graviturgy（EGtW）：Adjust Density**：使用次數等於 INT 調整值（至少 1）/ LR；Violent Attraction：INT 調整值次（至少 1）/ LR；Event Horizon：LR。
- **Bladesinger**：以採用版本為準（見版本差異）。
- **Order of Scribes（TCE）：Manifest Mind**：LR 免費一次；更多使用花 spell slot。

## TCE 可選職業特性中會影響資源模型者

- **Cleric / Paladin：Harness Divine Power**：使用次數依各自職業等級表增加並於 LR 恢復；使用時支付一次 Channel Divinity，恢復法術位環級上限為 PB 一半向上取整。
- **Druid：Wild Companion**：支付 Wild Shape 或 spell slot；消耗既有池，不增加恢復池。
- **Monk：Quickened Healing、Focused Aim**：消耗 Ki。
- **Ranger：Favored Foe、Nature's Veil**：各 PB 次 / LR；Primal Awareness 的每個免費法術另按每 spell / LR 記錄。
- **Sorcerer：Magical Guidance**：每次花 1 Sorcery Point；Sorcerous Restoration 為 SR 恢復 4 點。
- 其他可選法術表、武器 / 專精 / 靈活替換特性若沒有明文次數池，不建立資源疊。

## BGG / BMT 玩家選項

以下依 5e.tools 的 BGG / BMT 書籍資料、職業、專長與背景索引整理；僅列能形成可追蹤使用次數、免費施法或恢復條件的角色選項。這兩本書沒有額外通用職業資源池；背景本身通常授予專長，資源規則由被選到的專長提供。

### BGG：Path of the Giant（Barbarian，p. 11–12）

- Giant's Havoc、Elemental Cleaver、Mighty Impel、Demiurgic Colossus 的限制依賴 Rage、回合 / 動作或持續時間；沒有獨立的 subclass 使用次數池，Rage 次數沿用 Barbarian 共用池。
- 巨人形態的尺寸、額外傷害、傷害類型切換與投擲目標都不是可另行恢復的充能資源。專用疊應記為「使用 Rage」的條件 / 效果，不要再複製一份 Rage 次數。

### BGG：巨人專長

- **Rune Shaper（p. 18）**：知道的符文數等於 PB 一半向下取整；每次 LR 後可將知道的符文刻在物件上，並暫時取得對應的一環法術。可用法術位施放；另有一次 / LR 的不花法術位施放（任一已刻符文法術），用後直到 LR 不能再用此免費施放。模型上是「符文選擇 / 長休重設」加「免費施法 1 次 / LR」，不是每個符文各有一次免費施放。
- **Ember of the Fire Giant：Searing Ignition（p. 17）**：PB 次 / LR；每回合最多一次。
- **Fury of the Frost Giant：Frigid Retaliation（p. 17）**：PB 次 / LR，以反應觸發。
- **Guile of the Cloud Giant：Cloudy Escape（p. 18）**：PB 次 / LR，以反應觸發。
- **Keenness of the Stone Giant：Stone Throw（p. 18）**：PB 次 / LR，以附贈動作使用。
- **Soul of the Storm Giant：Maelstrom Aura（p. 19）**：PB 次 / LR，以附贈動作啟動；效果持續至下回合開始或失能。
- **Vigor of the Hill Giant：Bulwark / Iron Stomach（p. 19）**：無獨立有限次數池；反應免疫移動 / 倒地依觸發條件，Iron Stomach 在短休花生命骰恢復 HP 時生效。
- **Strike of the Giants（p. 19）**：六種 strike 共用「每回合一次」觸發，不因這個頻率本身建立可休息恢復的次數池。5e.tools 結構資料將 PB 次 / LR 的明文放在 Storm Strike 子項；實作 Storm Strike 前應按採用版本的印刷頁面確認該限制的適用範圍，不要推廣到其他 strike 選項。

### BGG：背景（p. 6、12）

- **Giant Foundling（p. 6）**：可選 Strike of the Giants；資源 / 頻率按所選專長，不另有背景池。
- **Rune Carver（p. 12）**：可選 Rune Shaper；免費施法與符文重設按 Rune Shaper 條目，不另有背景池。

### BMT：Cartomancer 與背景

- **Cartomancer（p. 49）**：每次完成 LR，選擇一個符合條件且有相應法術位的職業法術，注入一張牌；牌維持 8 小時，之後可用附贈動作施放一次並失去魔力。這是一個「準備 1 次 / LR、有效 8 小時、施放 1 次」的施法機會，不是額外法術位。5e.tools 條文沒有寫明施放時免耗法術位；實作應依採用的印刷規則判讀法術位成本，勿直接登記成確定免費施法。
- **Rewarded（p. 57）**：背景可選 Lucky、Magic Initiate 或 Skilled。背景本身沒有恢復池；若選 Lucky，沿用該專長的 3 點 Luck / LR；若選 2014 Magic Initiate，所選法術可免費施放一次 / LR（若角色有相應法術位，亦可用法術位施放）。Skilled 不提供有限次數池。
- **Ruined（p. 58）**：背景可選 Alert、Skilled 或 Tough，均不新增有限次數 / 恢復池。
- 5e.tools 的 BMT 職業子類索引沒有 BMT 來源的 subclass 條目；本輪 BMT 角色資源增補因此集中在 Cartomancer 與背景授予的專長，不把 Deck of Many Things 魔法物品充能誤列成職業資源。

### 5e.tools 資料索引

- [BGG 書籍資料](https://raw.githubusercontent.com/5etools-mirror-3/5etools-src/main/data/book/book-bgg.json)、[BMT 書籍資料](https://raw.githubusercontent.com/5etools-mirror-3/5etools-src/main/data/book/book-bmt.json)
- [Barbarian 職業 / 子職業資料](https://raw.githubusercontent.com/5etools-mirror-3/5etools-src/main/data/class/class-barbarian.json)、[專長資料](https://raw.githubusercontent.com/5etools-mirror-3/5etools-src/main/data/feats.json)、[背景資料](https://raw.githubusercontent.com/5etools-mirror-3/5etools-src/main/data/backgrounds.json)
- 已查詢 13 個職業索引的 subclass source：本兩書只有 BGG Path of the Giant；未找到 BMT subclass。

## 版本 / 多職業 / 疊放規則

- **Bladesinger 來源差異**：SCAG 原始版本為 2 次 / SR/LR；TCE 重印版本為 PB 次 / LR。角色資料需記錄採用版本或全專案指定單一版本，不能同時疊加。
- **短休與長休**：若寫 `SR/LR`，代表兩種休息任一結束即可恢復；工具統一將其標記為短休冷卻，而批次長休仍會恢復短休資源。每日 / 七日 / 1d4 次長休 / 事件觸發不可硬塞入一般休息按鈕。
- **多職業**：同名能力若依職業等級、熟練加值或屬性調整值計算，計算依 feature 原文的指定職業等級與角色總 PB 規則；不可一律拿角色總等級代替。
- **不重複計池**：Channel Divinity、Ki、Rage、Bardic Inspiration、Sorcery Points、Superiority Dice 等職業池由多項 subclass 能力共用；卡片可專用分組顯示，但底層使用次數仍只有一份。
- **消耗鏈**：例如能力每短休可使用，但每次另花 spell slot / Ki / Channel Divinity，需同時呈現「能力可用次數」和「付款來源」；若規則是直接花既有池且沒有額外次數，不建立額外資源。
- **生命骰**：與上述職業能力池分開。2014 規則長休後只恢復已消耗生命骰的一半（至少一顆），不會全滿；短休時花生命骰不是恢復它。
- **狀態觸發**：先攻恢復、成功反制、召喚物被摧毀、消耗物品等需獨立記錄 trigger / eligibility；不可錯誤標成短休或長休。
- **累積資源範圍**：若每次合資格事件都可增加資源、累積至上限，並由其他效果消耗，須分別表達事件取得、容量、消耗、長休失效 / 重設。Soul Trinkets、Power Surge 和 Arcane Ward 屬需專門設計的例子；它們不能因有 `maximum` 或休息文字就簡化成普通 recoverable resource。只在空池時恢復一點的 initiative recovery，以及上限為 1 的事件恢復（如 Tides of Chaos、Benign Transposition），不會逐次累積至多點容量，不屬此類。

## 對 CR 後續資料模型的建議

建議資源至少能表達以下欄位（只作設計參考，尚未改程式）：

| 欄位概念 | 例子 |
|---|---|
| `resourceKey` / 專用疊鍵 | `class:monk:ki`、`subclass:psi-warrior:energy-dice`、`warlock:mystic-arcanum:6` |
| `ownerClass` / `subclass` | Monk / Mercy、Fighter / Psi Warrior |
| `poolMode` | 次數、點數、骰數、HP pool、特定環級免費施法 |
| `maximumFormula` | 職業等級、PB、屬性調整值、固定值、逐環各一 |
| `recovery.kind` | long-rest、short-or-long-rest、initiative-if-empty、event、spell-slot-cost、days |
| `recovery.amount` | 全恢復、固定 1、4 點、半池至少 1、依觸發條件 |
| `recovery.trigger` / `eligibility` | 擲先攻時為 0、短休結束後、成功反制法術、消耗 item |
| `costs` | 消耗 Ki、Channel Divinity、Spell Slot 或其他 pool |
| `sourceVersion` | PHB 2014、SCAG 原版、TCE 重印等 |

聚合建議：一張職業 / subclass 專用資源疊可以容納多個 inner pools；但每個 inner resource 必須保有獨立 key、回復規則與花費關係。卡片聚合不能把不同 cooldown 或不同觸發條件合併成同一個 current/max。

累積資源另需 event-ledger / counter semantics：各取得事件及資格條件、每次增量、容量上限、消耗來源、長休時的失效或重設、以及消耗後剩餘值。現階段不以一般資源的初始化 / cooldown / reset 欄位模擬；待資料模型及互動流程設計完成後再納入。

## 來源縮寫

- **PHB**：Player's Handbook（2014）
- **DMG**：Dungeon Master's Guide（2014）
- **SCAG**：Sword Coast Adventurer's Guide
- **XGE**：Xanathar's Guide to Everything
- **GGtR**：Guildmasters' Guide to Ravnica
- **E:RftLW**：Eberron: Rising from the Last War
- **EGtW**：Explorer's Guide to Wildemount
- **TCE**：Tasha's Cauldron of Everything
- **VRGtR**：Van Richten's Guide to Ravenloft
- **FToD**：Fizban's Treasury of Dragons
- **BGG**：Bigby Presents: Glory of the Giants
- **BMT**：The Book of Many Things
