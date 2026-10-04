# D&D 5e 職業資源與恢復周期參考

- **用途**：作為 CR 後續建立職業 / subclass 專用資源疊、設定回復周期、設計生成與重算規則的參考；不是目前程式已支援功能清單。
- **規則基準**：D&D 5e 2014 版（含 2014 規則相容的後續選項），不混用 2024 新版規則。
- **盤點範圍**：PHB、DMG、SCAG、XGE、Guildmasters' Guide to Ravnica、Eberron: Rising from the Last War、Explorer's Guide to Wildemount、Tasha's Cauldron of Everything、Van Richten's Guide to Ravenloft、Fizban's Treasury of Dragons。
- **完整性界線**：列出上述來源範圍內的職業級資源池、具有限次 / 充能的資源型 subclass 能力，以及會支付資源的常見能力。官方資料還有其他冒險、設定、數位及短篇出版物；不在上述清單的出版內容未逐項核驗，不能將本文件當作所有官方 2014 相容出版物的絕對全集。UA、第三方與 homebrew 不在範圍。
- **摘要方式**：以下用自己的話整理規則，不複製規則原文。子職業能力若消耗既有職業池，記在「消耗既有池」，不另外虛構一個使用次數池。

## 回復類型定義

| 標記 | 意義 | CR 建模建議 |
|---|---|---|
| `SR` | 短休結束後恢復 | `短休` |
| `LR` | 長休結束後恢復 | `長休` |
| `SR/LR` | 短休或長休結束後恢復 | `短休`與`長休`皆可恢復 |
| `每日` | 每日 / 長休節奏恢復；按來源文字決定每日邊界，不應自動等同任意長休 | `長休`或明確自訂周期，需保留來源語意 |
| `先攻觸發` | 擲先攻時符合條件才恢復，不是休息周期 | 獨立觸發，不可映射成`短休`或`長休` |
| `事件觸發` | 施放法術、特定能力成功、特定物件消耗等事件後恢復 | 記錄事件 / 前置條件 |
| `付費再用` | 額外使用需消耗法術位或另一資源 | 表示為資源成本，不增加免費上限 |
| `無有限池` | 能力可用，但無每休息次數池；可能仍受回合、動作、持續時間或其他限制 | 不建立資源疊 |

**通用判讀**：`每短休或長休恢復`不同於`每日一次`；「短休後才可使用的恢復能力」也不同於被恢復的法術位。單次施法 / 攻擊 / 反應限制是行動經濟，不等於可消耗資源池。

## Artificer（E:RftLW / TCE）

- **Spell Slots**：長休恢復；Artificer 在多職業施法者等級計算採半施法等級向上取整。
- **Flash of Genius（7 級）**：使用次數等於智力調整值（至少 1），LR 恢復。
- **Spell-Storing Item（11 級）**：儲存一個合資格法術；使用次數等於兩倍智力調整值（至少 2），耗盡後 LR 恢復。這是物品中的職業能力次數，不是法術位；創建 / 重設該物品與逐次施法需分開表達。
- **Alchemist：Experimental Elixir**：完成 LR 後免費製作一瓶；額外製作每瓶消耗一個法術位。藥劑效果本身不另有回復池。
- **Alchemist：Restorative Reagents（9 級）**：`Lesser Restoration` 免費施放次數等於智力調整值（至少 1），LR 恢復；藥劑帶來的臨時 HP 是效果，不是另一個可累積池。
- **Armorer：Defensive Field（3 級）**：使用次數等於熟練加值（PB），LR 恢復。
- **Artillerist：Eldritch Cannon**：完成 LR 後免費創造一座；同時只能維持一座（15 級特性可有兩座）；額外創造消耗法術位。其持續時間不是休息回復池。
- **Battle Smith：Arcane Jolt（9 級）**：使用次數等於 PB，LR 恢復。
- **Steel Defender**：修復 / 復活可能需要動作、工具或法術位；不可把夥伴 HP 當成 subclass 每日次數池。
- 其他 infusions、工具熟練、裝備選擇多數不是休息次數資源。

## Barbarian（PHB / SCAG / XGE / TCE）

- **Rage**：依 Barbarian 等級表取得次數；LR 恢復。20 級不再受次數限制。Rage 是多項 subclass 能力共用的職業池。
- **Berserker：Frenzy**：發動 Rage 時選擇進入 Frenzy，沒有額外 Frenzy 次數池；Rage 結束後承受 Exhaustion。Exhaustion 不是「短休恢復」資源。
- **Ancestral Guardian**：Spirit Shield 等在 Rage / 反應條件下使用，沒有獨立次數池；Consult the Spirits：LR。
- **Storm Herald**：Storm Aura 依 Rage 啟動，沒有每日 aura 次數池。
- **Zealot**：Fanatical Focus 每次 Rage 一次；與 Rage 次數綁定，不另加一池。Rage Beyond Death 依 Rage 維持。
- **Battlerager（SCAG）**：主要能力依 Rage 或攻擊動作使用，沒有獨立充能池。
- **Wild Magic（TCE）**：Bolstering Magic 次數等於 PB / LR；可用於短期增益或恢復法術位。其他 Wild Surge 效果不形成穩定的共用次數池。
- **Beast（TCE）**：Claws / Bite / Tail 形態在 Rage 期間使用，無額外形態次數池。
- 其餘列入來源範圍的 Barbarian subclass 若能力未給出使用上限，歸 `無有限池`，不應自行套用 Rage 次數以外的冷卻。

## Bard（PHB / SCAG / XGE / TCE / VRGtR）

- **Bardic Inspiration**：次數等於魅力調整值（至少 1）；Bard 1–4 級 LR 恢復，從 5 級 Font of Inspiration 起 SR/LR 恢復。子職業消耗它時共用同一池。
- **Superior Inspiration（20 級）**：擲先攻時若沒有 Bardic Inspiration 使用次數，恢復 1 次（`先攻觸發`）。
- **Lore：Cutting Words；Valor：Combat Inspiration；Glamour：Mantle of Inspiration；Swords：Blade Flourish；Whispers：Psychic Blades；Creation：Animating Performance；Eloquence：Unsettling Words / Infectious Inspiration；Spirits：Tales from Beyond**：消耗 Bardic Inspiration，不另設次數池。
- **Glamour：Enthralling Performance**：SR/LR。**Mantle of Majesty**：LR。**Unbreakable Majesty**：SR/LR。
- **Whispers：Words of Terror、Mantle of Whispers**：SR/LR；**Shadow Lore**：LR。
- **Creation：Performance of Creation**：LR 免費使用；額外使用支付法術位。其 Animated Object 持續時間不是每日再次充能的獨立池。
- **Eloquence：Universal Speech**：LR；**Unsettling Words / Infectious Inspiration** 消耗 Bardic Inspiration。
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
- **TCE optional：Harness Divine Power**：PB 一半向上取整次 / LR；每次使用另外消耗一次 Channel Divinity，產生法術位恢復。這是有兩個資源欄位互動的兌換，不是免費法術位池。
- **Arcana：Arcane Abjuration**、**Death：Touch of Death**、**Forge：Artisan's Blessing**、**Order：Order's Demand**、**Grave：Path to the Grave**、**Peace：Balm of Peace**、**Twilight：Twilight Sanctuary** 等均按 Channel Divinity 計費。

## Druid（PHB / SCAG / XGE / GGtR / TCE）

- **Wild Shape**：2 次；SR/LR 恢復。消耗此池的 subclass / optional feature 必須共用扣次數。
- **Circle of the Land：Natural Recovery**：每日一次，在完成短休後恢復部分法術位；只能在短休結束時使用，不是 Wild Shape 恢復。
- **Circle of Dreams：Balm of the Summer Court**：治療骰池為 Druid 等級數量的 d6，LR 恢復。**Hidden Paths**：使用次數等於 WIS 調整值（至少 1），LR 恢復；不消耗 Wild Shape。**Walker in Dreams**：每日一次，依特性要求在短休後使用，LR 後恢復。
- **Circle of the Shepherd：Spirit Totem**：SR/LR。
- **Circle of Spores：Symbiotic Entity**：消耗 Wild Shape；Fungal Infestation 次數等於 WIS 調整值（至少 1）/ LR。Halo of Spores 是符合條件時每回合的反應，不是有限池。
- **Circle of Stars：Starry Form**：消耗 Wild Shape；Cosmic Omen 次數等於 PB / LR。星象分支效果共用該次 Starry Form 狀態，不各自建池。
- **Circle of Wildfire：Wildfire Spirit**：召喚消耗 Wild Shape；Cauterizing Flames 次數等於 WIS 調整值（至少 1）/ LR。已消失的靈體可用法術位支付的復活方式應記為 `付費再用`。
- **TCE optional：Wild Companion**：消耗 Wild Shape，或支付法術位替代；此能力沒有再額外恢復一池。

## Fighter（PHB / DMG / SCAG / XGE / EGtW / TCE）

- **Second Wind、Action Surge**：SR/LR；Action Surge 17 級後有額外次數，但單回合使用上限仍按特性限制。
- **Indomitable**：LR；依 Fighter 等級增加次數。
- **Battle Master：Superiority Dice**：SR/LR；Maneuvers 共用骰池。15 級 Relentless 在擲先攻時若沒有 superiority die，可恢復 1 顆（`先攻觸發`）。
- **Arcane Archer：Arcane Shot**：2 次 / SR/LR；15 級 Ever-Ready Shot 若擲先攻時沒有 Arcane Shot 使用次數，可恢復 1 次。
- **Cavalier：Unwavering Mark**：強化反擊次數等於 STR 調整值（至少 1）/ LR。**Warding Maneuver**：次數等於 CON 調整值（至少 1）/ LR。
- **Samurai：Fighting Spirit**：3 次 / LR；10 級若擲先攻時已無剩餘次數，恢復 1 次。**Strength Before Death**：LR。
- **Echo Knight（EGtW）：Unleash Incarnation**：次數等於 CON 調整值（至少 1）/ LR。Reclaim Potential：PB 次 / LR；Echo 的召喚本身沒有單獨次數池。
- **Rune Knight：Giant's Might、Runic Shield**：各 PB 次 / LR；每個 Rune 的啟動依該 rune 自己的規則 SR/LR 恢復，逐 rune 記錄，不能合併成一個 rune 池。
- **Psi Warrior：Psionic Energy Dice**：數量等於兩倍 PB；LR 全恢復；若擲先攻時為 0，恢復 1 顆。所有消耗 psionic die 的能力共用一池。
- **Psi Warrior：Bulwark of Force、Telekinetic Master**：各有一次 / LR 的免費啟動；額外使用分別可消耗 Psionic Energy die（Telekinetic Master 亦按特性要求施放法術）。
- Champion、Purple Dragon Knight / Banneret、Eldritch Knight 等其他來源項目沒有新增的通用休息次數池；Eldritch Knight 法術位另屬 Spell Slots。

## Monk（PHB / SCAG / XGE / TCE / Fizban）

- **Ki**：數量等於 Monk 等級；SR/LR 恢復。所有 Ki-powered subclass 能力共用此池。
- **Four Elements、Open Hand、Shadow、Sun Soul**：符合條文的招式消耗 Ki；不各自建立一池。
- **Long Death（SCAG）：Mastery of Death**：花 1 Ki 避免降至 0 HP；Touch of the Long Death 消耗 Ki。不是 SR/LR 獨立次數。
- **Drunken Master：Drunkard's Luck**：每次花 2 Ki，受 Ki 池限制。
- **Kensei：Deft Strike、Sharpen the Blade**：花 Ki；不另設休息次數池。
- **Astral Self / Mercy（TCE）**：各種形態、Hand of Healing / Harm 等消耗 Ki，共用職業池。
- **Mercy：Hand of Ultimate Mercy（17 級）**：復活能力需 5 Ki，另限一次 / LR；同時受共用 Ki 池限制。
- **Ascendant Dragon（Fizban）：Breath of the Dragon**：免費使用次數等於 PB / LR；用完後可再花 Ki。免費次數與 Ki 池要分開記錄。
- **Ascendant Dragon：Wings of the Dragon**：一次 / LR 免費展翼；額外使用花 Ki。
- **Perfect Self（20 級）**：擲先攻時若沒有 Ki，立即恢復 4 點（`先攻觸發`）。

## Paladin（PHB / DMG / SCAG / XGE / TCE）

- **Divine Sense**：次數為 1 + CHA 調整值（至少 1）/ LR。
- **Lay on Hands**：HP 池等於 Paladin 等級 × 5；LR 全恢復。疾病 / 毒素治療也從同一池扣固定點數。
- **Channel Divinity**：3 級 1 次，7 級 2 次，15 級 3 次；SR/LR 恢復。各 Oath 的 Channel Divinity 用途共用此池。
- **Oath of the Ancients / Devotion / Vengeance / Crown / Conquest / Redemption / Oathbreaker / Glory / Watchers**：各自 Channel Divinity 招式均消耗共用池。
- **Glory：Glorious Defense**：使用次數等於 CHA 調整值（至少 1）/ LR。
- **Watchers：Vigilant Rebuke**：使用次數等於 CHA 調整值（至少 1）/ LR。
- **TCE optional：Harness Divine Power**：PB 一半向上取整次 / LR；每次另花一次 Channel Divinity 兌換法術位。
- 造成傷害時的 Divine Smite 消耗法術位；這是 Spell Slot 支出，不是額外 Smite 次數池。

## Ranger（PHB / SCAG / XGE / TCE / Fizban）

- **Spell Slots**：LR 恢復。以法術位發動的能力記為資源成本，不新建冷卻池。
- **PHB Beast Master**：治療或替換 companion 可能需法術位、時間；不是固定次數 / 休息池。TCE Primal Companion 的復活可花法術位；另有重新召喚流程，照各自成本記錄。
- **Horizon Walker：Detect Portal**：WIS 調整值次 / LR；Ethereal Step：SR/LR。
- **Monster Slayer：Magic-User's Nemesis**：LR。
- **Fey Wanderer：Fey Reinforcements**：每個符合條件的召喚法術各一次免費施放 / LR；Misty Wanderer：WIS 調整值次（至少 1）/ LR。
- **Swarmkeeper：Writhing Tide**：PB 次 / LR。
- **Drakewarden：Drake Companion**：LR 免費召喚；額外召喚花法術位。**Drake's Breath**：LR 免費一次；額外使用需支付 3 環以上法術位。
- **TCE optional：Favored Foe、Nature's Veil**：各 PB 次 / LR。**Primal Awareness**：獲得的指定法術各有一次免費施放 / LR；額外施放使用法術位。
- 其他 Hunter、Gloom Stalker、Swarm 等能力若只有每回合觸發、動作或持續時間，沒有使用次數上限時屬 `無有限池`。

## Rogue（PHB / SCAG / XGE / TCE）

- **Thief：Stroke of Luck**：SR/LR。
- **Phantom：Wails from the Grave**：次數等於 Rogue 等級一半向上取整 / LR。**Ghost Walk**：LR。Tokens of the Departed 可保存的 token 數受 PB 上限；token 在長休時消失，取得 / 消耗 token 是事件，不是休息時補滿的普通充能池。
- **Soulknife：Psionic Energy Dice**：數量等於兩倍 PB；LR 全恢復，SR 恢復 1 顆；若擲先攻時已無骰，恢復 1 顆。相關技能檢定與傷害共用此池。Psychic Whispers 與 Psychic Veil 各有一次免費 / LR 的啟動機會，之後可按各自規則花 Psionic Energy die 再用。
- **Arcane Trickster**：法術位 LR 恢復；Mage Hand Legerdemain 等不另造休息池。
- 其他 Inquisitive、Mastermind、Scout、Swashbuckler 等若能力沒有明文有限次數，屬 `無有限池`；Cunning Action / Sneak Attack 是回合頻率，不是冷卻資源。

## Sorcerer（PHB / XGE / TCE）

- **Sorcery Points**：數量等於 Sorcerer 等級；LR 全恢復。Metamagic、Flexible Casting 及 subclass 指定點數消耗共用此池。Sorcery Points 與 Spell Slots 會互相轉換，資料層不可把兩者混為一個池。
- **Sorcerous Restoration（20 級，TCE optional）**：SR 恢復 4 點 Sorcery Points。
- **Wild Magic：Tides of Chaos**：使用後通常需 LR 才恢復；若 DM 令其觸發 Wild Magic Surge，使用機會可提前恢復（`事件觸發` / DM 判定）。
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
- **Celestial：Healing Light**：d6 池數量等於 Warlock 等級 + 1，LR 恢復；Searing Vengeance：LR。
- **Fathomless：Tentacle of the Deeps**：PB 次 / LR；Fathomless Plunge：LR。
- **Genie：Bottled Respite、Elemental Gift**：各 PB 次 / LR；Limited Wish：使用後經 1d4 次 LR 才可再用（不是固定每次 LR）；Sanctuary Vessel 的攜伴 / 進入效果依該 feature 的 LR 限制。
- **Undead：Form of Dread**：PB 次 / LR；Necrotic Husk：LR；Spirit Projection：LR，額外使用可依特性花 Pact Magic slot。
- **Pact of the Talisman（TCE）：Protection of the Talisman**：PB 次 / LR；與 Pact Magic slot 分開。
- Eldritch Smite 等 Invocation 若花 Pact Magic slot，記為 `付費再用 / spell slot cost`，不再建立一個 invocation 使用池。

## Wizard（PHB / SCAG / XGE / EGtW / TCE）

- **Spell Slots**：LR 恢復。
- **Arcane Recovery**：每日一次，在完成 SR 後恢復部分 spell slots；這是「施放恢復能力」，不是短休自動補槽。
- **Signature Spells（20 級）**：兩個已選法術各有一次不花槽施放 / SR/LR；記為兩個特定 free-cast 次數。
- **Conjuration：Benign Transposition**：LR，或額外使用支付 spell slot。
- **Divination：Portent**：每次 LR 後重擲預言骰（通常 2 顆，14 級 3 顆）；Third Eye：SR/LR。Expert Divination 可在施放合資格預言法術時回復較低環 spell slot（`事件觸發`）。
- **Enchantment：Instinctive Charm**：LR，或額外使用支付 spell slot。
- **Evocation：Overchannel**：每 LR 首次使用無額外傷害；同一長休前額外使用會承受逐次增加的傷害。不是每次使用都消耗固定充能數。
- **Illusion：Illusory Self**：SR/LR，或額外使用支付 spell slot。
- **Transmutation：Shapechanger**：SR/LR。Major Transformation 為消耗 Transmuter's Stone 的一次長休效果；石頭被消耗後依特性重建。
- **Abjuration：Arcane Ward**：ward 有 HP pool；施放合資格 Abjuration 法術時按規則回復 ward HP（`事件觸發`），不是長休自動補池。
- **War Magic：Power Surge**：上限等於 INT 調整值（至少 1）；LR 時回至 1，成功反制 / 驅散法術等指定事件可取得額外 surge；使用 Arcane Deflection 且目前沒有 surge 時也可取得 1 個。上限仍受 INT 調整值限制，以小整數池加事件規則建模。
- **Chronurgy（EGtW）：Chronal Shift**：2 次 / LR；Momentary Stasis：PB 次 / LR；Arcane Abeyance：SR/LR；Convergent Future 沒有固定次數池，但每次承受 Exhaustion，視為代價而非冷卻。
- **Graviturgy（EGtW）：Adjust Density**：使用次數等於 INT 調整值（至少 1）/ LR；Violent Attraction：INT 調整值次（至少 1）/ LR；Event Horizon：LR。
- **Bladesinger**：以採用版本為準（見版本差異）。
- **Order of Scribes（TCE）：Manifest Mind**：LR 免費一次；更多使用花 spell slot。

## TCE 可選職業特性中會影響資源模型者

- **Cleric / Paladin：Harness Divine Power**：PB 一半向上取整次 / LR，使用時支付一次 Channel Divinity 換 spell slot。
- **Druid：Wild Companion**：支付 Wild Shape 或 spell slot；消耗既有池，不增加恢復池。
- **Monk：Quickened Healing、Focused Aim**：消耗 Ki。
- **Ranger：Favored Foe、Nature's Veil**：各 PB 次 / LR；Primal Awareness 的每個免費法術另按每 spell / LR 記錄。
- **Sorcerer：Magical Guidance**：每次花 1 Sorcery Point；Sorcerous Restoration 為 SR 恢復 4 點。
- 其他可選法術表、武器 / 專精 / 靈活替換特性若沒有明文次數池，不建立資源疊。

## 版本 / 多職業 / 疊放規則

- **Bladesinger 來源差異**：SCAG 原始版本為 2 次 / SR/LR；TCE 重印版本為 PB 次 / LR。角色資料需記錄採用版本或全專案指定單一版本，不能同時疊加。
- **短休與長休**：若寫 `SR/LR`，代表兩種休息任一結束即可恢復；批次長休自然涵蓋較短恢復周期。每日 / 七日 / 1d4 次長休 / 事件觸發不可硬塞入三個一般休息按鈕。
- **多職業**：同名能力若依職業等級、熟練加值或屬性調整值計算，計算依 feature 原文的指定職業等級與角色總 PB 規則；不可一律拿角色總等級代替。
- **不重複計池**：Channel Divinity、Ki、Rage、Bardic Inspiration、Sorcery Points、Superiority Dice 等職業池由多項 subclass 能力共用；卡片可專用分組顯示，但底層使用次數仍只有一份。
- **消耗鏈**：例如能力每短休可使用，但每次另花 spell slot / Ki / Channel Divinity，需同時呈現「能力可用次數」和「付款來源」；若規則是直接花既有池且沒有額外次數，不建立額外資源。
- **生命骰**：與上述職業能力池分開。2014 規則長休後只恢復已消耗生命骰的一半（至少一顆），不會全滿；短休時花生命骰不是恢復它。
- **狀態觸發**：先攻恢復、成功反制、召喚物被摧毀、消耗物品等需獨立記錄 trigger / eligibility；不可錯誤標成短休或長休。

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
