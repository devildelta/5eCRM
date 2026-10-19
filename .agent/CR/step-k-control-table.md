# Step K Central Case Control Table

**Updated:** 2026-10-19 18:03 JST  
**Purpose:** Single control point for Step K case names, scenarios, current status, and current role assignments. The [resource plan](./CR-class-resources-plan.md) defines expected coverage; the [fix control](./step-k-fix-control.md) defines sequential remediation groups and post-fix table updates; tester and orchestrator reports retain execution evidence.

## Control rules and current assignment state

- This table covers **216 current case IDs**: K-S001–K-S104, 53 K-B IDs, 54 K-T child IDs, and K-M001–K-M005.
- K-B040 is no longer scored as a single parent case. Its four tester slices are K-B040-01 through K-B040-04; historical reports may still use the parent ID.
- K-T001–K-T007 are group headings only, not scored cases. Their 54 current atomic child cases are listed below; historical report references to parent IDs remain evidence only.
- Statuses below use the latest consolidated orchestrator report and the four tester reports, with subsequent operator dispositions applied. Historical report rows are evidence, not a newer status.
- All testers are treated as stopped. “Owner” identifies the report/test slice responsible for the evidence, not an active session. No coder or named, active auditor assignment is recorded. Pending auditor work is called out where known.
- Current totals after the K-T execution, Power Surge oracle follow-up, and operator disposition: K-S 70 PASS / 34 FAIL; K-B 44 PASS / 8 FAIL / 1 N/A; K-T 37 PASS / 14 FAIL / 0 IN PROGRESS / 0 UNDETERMINED / 3 N/A across 54 current child cases; K-M 5 PASS. No K-S auditor reclassification remains pending.
- No K-B case is currently IN PROGRESS. K-B048's paid-action subassertion is NOT RUN and remains outside the approved metadata-only scope.
- The 19 K-T cases that were IN PROGRESS were run in four concurrent tester slots (5/4/5/5 cases; hard cap 4). A targeted second review covered K-T007-06–10. The operator subsequently dropped K-T007-08 as outside the Step A–J CR feature scope; its prior UNDETERMINED review is historical and excluded from current counts. The other 18 cases retain their terminal PASS, FAIL, or N/A outcomes. The Rules Auditor clarified Power Surge's Short Rest reset; a focused recheck changed K-T003-03 from PASS to FAIL. No tester is active.
- K-S shared scenario: single-class level-20 character; choose the listed subclass; STR/DEX/CON/INT/WIS/CHA are 14, PB is +6, and TCE options are off unless the case says otherwise. Compare the complete expected and actual resource sets, including identity, ownership, limits/formulae, recovery, costs, gates, and missing/unexpected resources.
- For K-B001–K-B039 and K-M cases, the tester is the orchestrator runner. K-B040–K-B050 are aggregated from the four disjoint class-slice reports. K-T child owners are listed individually below.

## K-S001–K-S104 — Level-20 subclass cases

| ID | Test case name | Test case scenario | Status | Current tester / owner | Coder | Auditor |
|---|---|---|---|---|---|---|
| K-S001 | Artificer — Alchemist | L20 Alchemist (TCE); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S002 | Artificer — Armorer | L20 Armorer (TCE); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S003 | Artificer — Artillerist | L20 Artillerist (TCE); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S004 | Artificer — Battle Smith | L20 Battle Smith (TCE); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S005 | Barbarian — Berserker | L20 Berserker (PHB); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S006 | Barbarian — Totem Warrior | L20 Totem Warrior (PHB); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S007 | Barbarian — Ancestral Guardian | L20 Ancestral Guardian (XGE); verify recovery and resource metadata. | FAIL | No active; T1 owner | Unassigned | No active assignment; audit outcome recorded |
| K-S008 | Barbarian — Storm Herald | L20 Storm Herald (XGE); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S009 | Barbarian — Zealot | L20 Zealot (XGE); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S010 | Barbarian — Beast | L20 Beast (TCE); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S011 | Barbarian — Wild Magic | L20 Wild Magic (TCE); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S012 | Barbarian — Path of the Giant | L20 Path of the Giant (BGG); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S013 | Bard — Lore | L20 Lore (PHB); compare complete resource set. | PASS | No active; T2 owner | Unassigned | No active assignment |
| K-S014 | Bard — Valor | L20 Valor (PHB); compare complete resource set. | PASS | No active; T2 owner | Unassigned | No active assignment |
| K-S015 | Bard — Glamour | L20 Glamour (XGE); compare complete resource set. | PASS | No active; T2 owner | Unassigned | No active assignment |
| K-S016 | Bard — Swords | L20 Swords (XGE); compare complete resource set. | PASS | No active; T2 owner | Unassigned | No active assignment |
| K-S017 | Bard — Whispers | L20 Whispers (XGE); compare complete resource set. | PASS | No active; T2 owner | Unassigned | No active assignment |
| K-S018 | Bard — Creation | L20 Creation (TCE); verify Performance of Creation count/cost, Animating Performance at level 6, and its paid-use minimum. | FAIL — auditor disposition | No active; T2 owner | Unassigned | DND 5E (2014) Rules Auditor — completed |
| K-S019 | Bard — Eloquence | L20 Eloquence (TCE); compare complete resource set. | PASS | No active; T2 owner | Unassigned | No active assignment |
| K-S020 | Cleric — Knowledge | L20 Knowledge (PHB); compare complete resource set and unlocks. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S021 | Cleric — Life | L20 Life (PHB); compare complete resource set and unlocks. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S022 | Cleric — Light | L20 Light (PHB); compare complete resource set and unlocks. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S023 | Cleric — Nature | L20 Nature (PHB); compare complete resource set and unlocks. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S024 | Cleric — Tempest | L20 Tempest (PHB); compare complete resource set and unlocks. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S025 | Cleric — Trickery | L20 Trickery (PHB); compare complete resource set and unlocks. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S026 | Cleric — War | L20 War (PHB); compare complete resource set and unlocks. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S027 | Cleric — Death | L20 Death (DMG); compare complete resource set and unlocks. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S028 | Cleric — Arcana | L20 Arcana (SCAG); compare complete resource set and unlocks. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S029 | Cleric — Forge | L20 Forge (XGE); compare complete resource set and unlocks. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S030 | Cleric — Grave | L20 Grave (XGE); compare complete resource set and unlocks. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S031 | Cleric — Order | L20 Order (TCE); compare complete resource set and unlocks. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S032 | Cleric — Peace | L20 Peace (TCE); compare complete resource set and unlocks. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S033 | Cleric — Twilight | L20 Twilight (TCE); compare complete resource set and unlocks. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S034 | Druid — Land | L20 Land (PHB); compare complete resource set. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S035 | Druid — Moon | L20 Moon (PHB); compare complete resource set. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S036 | Druid — Dreams | L20 Dreams (XGE); compare complete resource set. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S037 | Druid — Shepherd | L20 Shepherd (XGE); compare complete resource set. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S038 | Druid — Stars | L20 Stars (TCE); compare complete resource set. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S039 | Druid — Wildfire | L20 Wildfire (TCE); compare complete resource set, pool costs, and consumers. | FAIL | No active; T3 owner | Unassigned | No active assignment |
| K-S040 | Fighter — Champion | L20 Champion (PHB); compare complete resource set. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S041 | Fighter — Battle Master | L20 Battle Master (PHB); compare complete resource set. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S042 | Fighter — Eldritch Knight | L20 Eldritch Knight (PHB); verify resource set and spell-slot tiers. | FAIL | No active; T3 owner | Unassigned | No active assignment |
| K-S043 | Fighter — Arcane Archer | L20 Arcane Archer (XGE); compare complete resource set. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S044 | Fighter — Cavalier | L20 Cavalier (XGE); compare complete resource set. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S045 | Fighter — Samurai | L20 Samurai (XGE); compare complete resource set. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S046 | Fighter — Rune Knight | L20 Rune Knight (TCE); verify rune pools, counts, and scaling. | FAIL | No active; T3 owner | Unassigned | No active assignment |
| K-S047 | Fighter — Psi Warrior | L20 Psi Warrior (TCE); compare complete resource set and consumers. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S048 | Monk — Four Elements | L20 Four Elements (PHB); compare complete resource set and Ki costs. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S049 | Monk — Open Hand | L20 Open Hand (PHB); compare complete resource set. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S050 | Monk — Shadow | L20 Shadow (PHB); compare complete resource set. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S051 | Monk — Drunken Master | L20 Drunken Master (XGE); compare complete resource set and Ki costs. | FAIL | No active; T3 owner | Unassigned | No active assignment |
| K-S052 | Monk — Kensei | L20 Kensei (XGE); compare complete resource set. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S053 | Monk — Astral Self | L20 Astral Self (TCE); compare complete resource set. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S054 | Monk — Mercy | L20 Mercy (TCE); compare complete resource set. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S055 | Monk — Ascendant Dragon | L20 Ascendant Dragon (FToD); compare complete resource set. | PASS | No active; T3 owner | Unassigned | No active assignment |
| K-S056 | Paladin — Ancients | L20 Ancients (PHB); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S057 | Paladin — Devotion | L20 Devotion (PHB); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S058 | Paladin — Vengeance | L20 Vengeance (PHB); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S059 | Paladin — Oathbreaker | L20 Oathbreaker (DMG); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S060 | Paladin — Conquest | L20 Conquest (XGE); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S061 | Paladin — Redemption | L20 Redemption (XGE); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S062 | Paladin — Glory | L20 Glory (TCE); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S063 | Paladin — Watchers | L20 Watchers (TCE); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S064 | Ranger — Beast Master | L20 Beast Master (PHB); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S065 | Ranger — Hunter | L20 Hunter (PHB); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S066 | Ranger — Gloom Stalker | L20 Gloom Stalker (XGE); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S067 | Ranger — Horizon Walker | L20 Horizon Walker (XGE); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S068 | Ranger — Monster Slayer | L20 Monster Slayer (XGE); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S069 | Ranger — Fey Wanderer | L20 Fey Wanderer (TCE); verify free and paid-use metadata. | PASS | No active; T1 owner | Unassigned | No active assignment; audit outcome recorded |
| K-S070 | Ranger — Swarmkeeper | L20 Swarmkeeper (TCE); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S071 | Ranger — Drakewarden | L20 Drakewarden (FToD); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S072 | Rogue — Thief | L20 Thief (PHB); compare complete resource set. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S073 | Rogue — Assassin | L20 Assassin (PHB); compare complete resource set. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S074 | Rogue — Arcane Trickster | L20 Arcane Trickster (PHB); verify resources and spell-slot tiers. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S075 | Rogue — Inquisitive | L20 Inquisitive (XGE); compare complete resource set. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S076 | Rogue — Mastermind | L20 Mastermind (XGE); compare complete resource set. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S077 | Rogue — Scout | L20 Scout (XGE); compare complete resource set. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S078 | Rogue — Swashbuckler | L20 Swashbuckler (XGE); compare complete resource set. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S079 | Rogue — Phantom | L20 Phantom (TCE); Wails uses must equal PB (6); verify class-wide Stroke of Luck and Soul Trinket alternate costs for Wails/Ghost Walk. | FAIL — auditor disposition | No active; T2 owner | Unassigned | DND 5E (2014) Rules Auditor — completed |
| K-S080 | Rogue — Soulknife | L20 Soulknife (TCE); compare complete resource set and consumers. | FAIL | No active; T2 owner | Unassigned | No active assignment |
| K-S081 | Sorcerer — Draconic Bloodline | L20 Draconic Bloodline (PHB); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S082 | Sorcerer — Wild Magic | L20 Wild Magic (PHB); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S083 | Sorcerer — Divine Soul | L20 Divine Soul (XGE); compare complete resource set. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-S084 | Sorcerer — Shadow Magic | L20 Shadow Magic (XGE); compare complete resource set. | FAIL | No active; T1 owner | Unassigned | No active assignment |
| K-S085 | Sorcerer — Aberrant Mind | L20 Aberrant Mind (TCE); compare complete resource set and costs. | FAIL | No active; T1 owner | Unassigned | No active assignment |
| K-S086 | Sorcerer — Clockwork Soul | L20 Clockwork Soul (TCE); compare complete resource set and costs. | FAIL | No active; T1 owner | Unassigned | No active assignment |
| K-S087 | Warlock — Archfey | L20 Archfey (PHB); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S088 | Warlock — Fiend | L20 Fiend (PHB); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S089 | Warlock — Great Old One | L20 Great Old One (PHB); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S090 | Warlock — Hexblade | L20 Hexblade (XGE); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S091 | Warlock — Celestial | L20 Celestial (XGE); compare complete resource set and source metadata. | FAIL | No active; T4 owner | Unassigned | No active assignment |
| K-S092 | Warlock — Fathomless | L20 Fathomless (TCE); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S093 | Warlock — Genie | L20 Genie (TCE); verify Bottled Respite use count and recovery. | FAIL | No active; T4 owner | Unassigned | No active assignment |
| K-S094 | Wizard — Abjuration | L20 Abjuration (PHB); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S095 | Wizard — Conjuration | L20 Conjuration (PHB); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S096 | Wizard — Divination | L20 Divination (PHB); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S097 | Wizard — Enchantment | L20 Enchantment (PHB); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S098 | Wizard — Evocation | L20 Evocation (PHB); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S099 | Wizard — Illusion | L20 Illusion (PHB); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S100 | Wizard — Necromancy | L20 Necromancy (PHB); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S101 | Wizard — Transmutation | L20 Transmutation (PHB); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S102 | Wizard — War Magic | L20 War Magic (XGE); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S103 | Wizard — Bladesinging | L20 Bladesinging (TCE); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |
| K-S104 | Wizard — Order of Scribes | L20 Order of Scribes (TCE); compare complete resource set. | PASS | No active; T4 owner | Unassigned | No active assignment |

## K-B001–K-B050 — boundary, formula, and class-slice cases

| ID | Test case name | Test case scenario | Status | Current tester / owner | Coder | Auditor |
|---|---|---|---|---|---|---|
| K-B001 | Artificer subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B002 | Barbarian subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B003 | Bard subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B004 | Cleric subclass-selection boundary | Compare level below and at level-1 unlock; verify required selector and reset on level/class changes. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B005 | Druid subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B006 | Fighter subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B007 | Monk subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B008 | Paladin subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B009 | Ranger subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B010 | Rogue subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B011 | Sorcerer subclass-selection boundary | Compare level below and at level-1 unlock; verify required selector and reset on level/class changes. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B012 | Warlock subclass-selection boundary | Compare level below and at level-1 unlock; verify required selector and reset on level/class changes. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B013 | Wizard subclass-selection boundary | Compare level below and at subclass unlock; verify required/disabled selector and reset on level/class changes. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B014 | Cleric Harness Divine Power option | Default off; independently toggle and test applicability and unlock boundary at Cleric 2. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B015 | Druid Wild Companion option | Default off; independently toggle and test applicability and unlock boundary at Druid 2. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B016 | Monk Quickened Healing option | Default off; independently toggle and test applicability and unlock boundary at Monk 2. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B017 | Monk Focused Aim option | Default off; independently toggle and test applicability and unlock boundary at Monk 2. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B018 | Paladin Harness Divine Power option | Default off; independently toggle and test applicability and unlock boundary at Paladin 3. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B019 | Ranger Favored Foe option | Default off; independently toggle and test applicability and unlock boundary at Ranger 1. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B020 | Ranger Primal Awareness option | Default off; independently toggle and test applicability and unlock boundary at Ranger 3. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B021 | Ranger Nature's Veil option | Default off; independently toggle and test applicability and unlock boundary at Ranger 10. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B022 | Sorcerer Magical Guidance option | Default off; independently toggle and test applicability and unlock boundary at Sorcerer 5. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B023 | Sorcerer Sorcerous Restoration option | Default off; independently toggle and test applicability and unlock boundary at Sorcerer 20; verify +4 Sorcery Points on short rest. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B024 | Ability-score input and formula boundary | Test six scores at 1, legal minimum, 10, 20, 30, and blank; verify CHA-based Divine Sense minimum and localized validation. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B025 | Proficiency-bonus thresholds | Test total-character-level PB boundaries at 1/4/5/8/9/12/13/16/17/20 using Favored Foe. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B026 | Fixed resource formula | Verify fixed formula branch and exact output. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B027 | PB resource formula | Verify PB-based maximum at applicable level boundaries. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B028 | Twice-PB resource formula | Verify twice-PB maximum at applicable boundaries. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B029 | Half-PB-rounded-up formula | Verify half-PB-up result and associated spell-slot-cap metadata. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B030 | Ability-modifier formula | Verify ability modifier and minimum-1 behavior. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B031 | Ability-plus formula | Verify ability modifier plus fixed amount. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B032 | Ability-times formula | Verify ability modifier multiplied by configured amount. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B033 | Class-level formula | Verify resource maximum follows owning class level. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B034 | Half-class-level-rounded-up formula | Verify half owning-class level, rounded up. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B035 | Class-level-plus-one formula | Verify owning-class level plus one. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B036 | Class-level-times formula | Verify owning-class level multiplied by configured factor. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B037 | Level-tier formula | Verify tier changes immediately before/at each tier boundary. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B038 | Cleric Channel Divinity tier formula | Verify Channel Divinity availability and progression at Cleric-level boundaries. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B039 | Barbarian Rage tier formula | Verify Rage uses across level tiers, including unlimited use at Barbarian 20. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-B040-01 | Fixed-use maxima — Artificer/Barbarian/Ranger/Sorcerer | Independently assess Tester 1 fixed-value resource slice. | PASS | No active; T1 owner | Unassigned | No active assignment |
| K-B040-02 | Fixed-use maxima — Bard/Cleric/Rogue | Independently assess Tester 2 fixed-value resource slice and missing outputs. | FAIL | No active; T2 owner | Unassigned | Audit pending; no active auditor named |
| K-B040-03 | Fixed-use maxima — Druid/Fighter/Monk | Independently assess fixed counts; Rune Knight maximum is five, with no sixth at Fighter 18. | PASS | No active; T3 owner | Unassigned | No active assignment; corrected oracle applied |
| K-B040-04 | Fixed-use maxima — Paladin/Warlock/Wizard | Independently assess fixed counts, including Bottled Respite's one free entry per Long Rest. | FAIL | No active; T4 owner | Unassigned | Review partial; no active auditor named |
| K-B041 | PB maxima across class slices | Verify PB-based maxima and total-character-level PB; includes corrected Wails from the Grave expectation. | FAIL | No active; T1–T4 slice owners | Unassigned | No active assignment; cross-slice review incomplete |
| K-B042 | Ability-based maxima across class slices | Verify ability modifier/minimum-1 formulas and missing ability-based outputs. | FAIL | No active; T1–T4 slice owners | Unassigned | No active assignment; cross-slice review incomplete |
| K-B043 | Level-tier maxima across class slices | Verify every tier boundary; Rune Knight maximum is five and Fighter 18 adds no sixth Rune. | PASS — operator oracle adjudication | No active; T1–T4 slice owners | Unassigned | No active assignment; oracle corrected |
| K-B044 | Subclass-gated resource outputs | At unlock and one level below, verify correct presence/absence, ownership, and metadata. | FAIL | No active; T1–T4 slice owners | Unassigned | No active assignment; T2 audit pending, T4 partial |
| K-B045 | Recovery-mode level switch | Verify `recoveryFromLevel` changes recovery without duplicating the pool; Bardic Inspiration Bard 4/5 and initiative boundary 19/20. | PASS | No active; T1–T4 slice owners | Unassigned | No active assignment |
| K-B046 | Die/count/uses scaling | Verify die size, counts, and capacity at scaling boundaries across applicable definitions. | FAIL | No active; T1–T4 slice owners | Unassigned | No active assignment; cross-slice review incomplete |
| K-B047 | Shared-pool consumers and keys | Verify canonical pool identity, `shared` metadata, and every consumer-to-key link. | FAIL — operator disposition | No active; T1–T4 slice owners | Unassigned | No active assignment; operator disposition applied |
| K-B048 | Costs and alternative costs | Verify cost metadata and pool references; paid-action execution is a separate subassertion and was not run. | FAIL — operator disposition; paid-action NOT RUN | No active; T1–T4 slice owners | Unassigned | No active assignment; operator disposition applied |
| K-B049 | Recovery-only definitions and resource presence | Scan all scoped rows for `recoveryOnly`/`recoveryTarget`; verify applicable presence conditions and target resource. | N/A — full-scope scan found no applicable definitions | No active; T1–T4 slice owners | Unassigned | Not required; no applicable definition |
| K-B050 | TCE optional-feature gates | Verify defaults, independent toggles, unlock boundaries, and generated resources for applicable options. | PASS | No active; T1–T4 slice owners | Unassigned | No active assignment |

## K-T001–K-T007 — cross-catalog groups (parents not scored)

| ID | Test case name | Test case scenario | Status | Current tester / owner | Coder | Auditor |
|---|---|---|---|---|---|---|
| K-T001-01 | Bardic Inspiration pool | Verify one canonical pool, `shared` metadata, and Bard consumer links. | FAIL / follow-up open | Tester 2 evidence; next lead T2 (not started) | Unassigned | No active; defect confirmed |
| K-T001-02 | Cleric Channel Divinity consumers | Verify Cleric consumers reference the canonical shared Channel Divinity pool. | FAIL / follow-up open | Tester 2 evidence; next lead T2 (not started) | Unassigned | No active; consumer gap confirmed |
| K-T001-03 | Paladin Channel Divinity consumers | Verify Paladin consumers reuse the same canonical shared Channel Divinity pool. | FAIL / follow-up open | Tester 4 evidence; next lead T4 (not started) | Unassigned | No active; consumer gap confirmed |
| K-T001-04 | Wild Shape pool | Verify one canonical pool, `shared` metadata, and Wild Shape consumer links. | FAIL / follow-up open | Tester 3 evidence; next lead T3 (not started) | Unassigned | No active; consumer gap confirmed |
| K-T001-05 | Ki pool | Verify one canonical pool, `shared` metadata, and Monk Ki consumer links. | FAIL / follow-up open | Tester 3 evidence; next lead T3 (not started) | Unassigned | No active; consumer gap confirmed |
| K-T001-06 | Rage pool | Verify one canonical pool, `shared` metadata, and Rage consumer links. | FAIL / follow-up open | Tester 1 evidence; next lead T1 (not started) | Unassigned | No active; defect confirmed |
| K-T001-07 | Sorcery Points pool | Verify one canonical pool, `shared` metadata, and Sorcery Point consumer links. | FAIL / follow-up open | Tester 1 evidence; next lead T1 (not started) | Unassigned | No active; consumer gap confirmed |
| K-T001-08 | Superiority Dice pool | Verify one canonical pool, `shared` metadata, and Battle Master consumer links. | FAIL / follow-up open | Tester 3 evidence; next lead T3 (not started) | Unassigned | No active; consumer gap confirmed |
| K-T001-09 | Psi Warrior pool | Verify Psionic Energy Dice pool identity and Psi Warrior consumer links. | FAIL / follow-up open | Tester 3 evidence; next lead T3 (not started) | Unassigned | No active; consumer gap confirmed |
| K-T001-10 | Soulknife pool | Verify Psionic Energy Dice pool identity and Soulknife consumer links. | FAIL / follow-up open | Tester 2 evidence; next lead T2 (not started) | Unassigned | No active; consumer gap confirmed |
| K-T001-11 | Remaining shared pools | Enumerate other multi-consumer pools and verify each consumer references its canonical key. | PASS | Tester 1 completed; 2 source/catalog attempts | Unassigned | No active assignment |
| K-T002-01 | Soulknife pool-key separation | Keep Psionic Energy Dice and Psychic Whispers on distinct pool keys. | PASS | Tester 2 evidence; next lead T2 (not started) | Unassigned | No active assignment |
| K-T002-02 | Soulknife recovery separation | Verify Psionic Energy Dice and Psychic Whispers retain distinct recovery behavior. | PASS | Tester 2 evidence; next lead T2 (not started) | Unassigned | No active assignment |
| K-T002-03 | Spell-slot tier identity | Keep Artificer spell-slot levels on separate pool keys. | PASS | Tester 1 evidence; next lead T1 (not started) | Unassigned | No active assignment |
| K-T002-04 | Grouped display identity | Verify showing spell-slot levels in one card does not merge their pool identities. | PASS | Tester 1 evidence; next lead T1 (not started) | Unassigned | No active assignment |
| K-T002-05 | Rune Knight pool count | Verify five independent Rune pools and no sixth pool at Fighter 18+. | PASS | Tester 3 evidence; next lead T3 (not started) | Unassigned | Corrected five-Rune oracle |
| K-T002-06 | Remaining independent pools | Complete the cross-catalog check of distinct keys and cooldowns for other independent resources. | PASS | Tester 1 completed; 2 source/catalog attempts | Unassigned | No active assignment |
| K-T003-01 | Bardic Inspiration recovery boundary | Verify Bard 4 short/long-rest behavior and the Bard 5 short-rest boundary. | PASS | Tester 2 evidence; next lead T2 (not started) | Unassigned | No active assignment |
| K-T003-02 | Sorcerous Restoration | Verify the tested Sorcerous Restoration recovery amount at the checked levels. | PASS | Tester 1 evidence; next lead T1 (not started) | Unassigned | No active assignment |
| K-T003-03 | Power Surge reset-to | Verify Power Surge resets to exactly one after either a Short or Long Rest. | FAIL | Tester 2 follow-up; prior Long Rest passed, Short Rest left 2/2 unchanged (2 fixtures total) | Unassigned | Rules Auditor confirmed both rest types reset to one |
| K-T003-04 | Soulknife per-turn limit | Verify the Psionic Energy Dice per-turn limit remains unchanged by rest controls. | PASS | Tester 2 evidence; next lead T2 (not started) | Unassigned | No active assignment |
| K-T003-05 | Soulknife partial short-rest recovery | Verify the tested short rest restores the correct partial number of Psionic Energy Dice. | PASS | Tester 2 evidence; next lead T2 (not started) | Unassigned | No active assignment |
| K-T003-06 | Soulknife long-rest recovery | Verify long rest restores the tested Psionic Energy Dice pool to its maximum. | PASS | Tester 2 evidence; next lead T2 (not started) | Unassigned | No active assignment |
| K-T003-07 | Psychic Whispers empty-only | Verify Psychic Whispers remains empty on short rest and recovers on long rest. | PASS | Tester 2 evidence; next lead T2 (not started) | Unassigned | No active assignment |
| K-T003-08 | Hit Dice recovery | Verify Fighter 20 recovers half its d10 Hit Dice on long rest. | PASS | Tester 3 evidence; next lead T3 (not started) | Unassigned | No active assignment |
| K-T003-09 | Tides of Chaos rest behavior | Verify ordinary short rest does not recover the use and long rest does. | PASS | Tester 1 evidence; next lead T1 (not started) | Unassigned | No active assignment |
| K-T003-10 | Triggered recovery separation | Verify turn/round/initiative/event-triggered recovery is not replaced by ordinary rest controls; execute event assertions. | FAIL | Tester 2 completed; no event/initiative execution controls were available; 3 trigger fixtures | Unassigned | Rules Auditor clarified Tides, Benign Transposition, and Power Surge trigger oracle |
| K-T003-11 | Recovery-only catalog scope | Complete the catalog scan for `recoveryOnly`; record N/A if none apply. | N/A — zero applicable catalog rows | Tester 1 completed; 2 source/catalog attempts | Unassigned | No active assignment |
| K-T003-12 | Empty-only recovery catalog scope | Complete the catalog scan for `longRestRecoveryWhenEmpty`; record N/A if none apply. | N/A — zero applicable catalog rows | Tester 1 completed; 2 source/catalog attempts | Unassigned | No active assignment |
| K-T004-01 | Arcane Jolt turn gate | Verify once-per-turn gating remains distinct from short-rest controls and long-rest recovery. | PASS | Tester 1 evidence; next lead T1 (not started) | Unassigned | No active assignment |
| K-T004-02 | Action Surge own-turn gate | Verify the once-on-your-turn gate is distinct from its short-rest cooldown. | PASS | Tester 3 evidence; next lead T3 (not started) | Unassigned | No active assignment |
| K-T004-03 | Once-per-round metadata scope | Check supported once-per-round metadata; record N/A because no scoped definition uses it. | N/A — no scoped definition | Orchestrator catalog scan | Unassigned | No active assignment |
| K-T004-04 | Favored Foe effect gate | Verify the damage effect gate is separate from PB-limited marking uses. | PASS | Tester 1 evidence; next lead T1 (not started) | Unassigned | No active assignment |
| K-T004-05 | Spell-slot costs | Verify spell-slot costs, pool references, quantities, and minimum slot levels. | FAIL / follow-up open — known gaps; matrix incomplete | Next lead T1; T2/T4 contribute spellcaster slices (not started) | Unassigned | No active assignment |
| K-T004-06 | Ki costs | Verify Ki costs and alternative costs reference the correct pool and amount. | FAIL / follow-up open — known gaps; matrix incomplete | Tester 3 evidence; next lead T3 (not started) | Unassigned | No active assignment |
| K-T004-07 | Channel Divinity costs | Verify Channel Divinity costs reference the correct pool and amount. | PASS | Tester 1 completed; 2 source/catalog attempts | Unassigned | No active assignment |
| K-T004-08 | Damage costs | Verify damage costs are not represented as free uses or cooldowns. | PASS | Tester 2 completed; 1 UI/resource-record profile | Unassigned | No active assignment |
| K-T004-09 | Item costs | Verify item costs are distinct from free uses and cooldowns. | PASS | Tester 2 completed; 1 UI/resource-record profile | Unassigned | No active assignment |
| K-T005-01 | Same-key current-value retention | Reapplication preserves current value, including a value above the new maximum. | PASS | No active; orchestrator evidence | Unassigned | No active assignment |
| K-T005-02 | Manual resource retention | Reapplication preserves manually created resources. | PASS | No active; orchestrator evidence | Unassigned | No active assignment |
| K-T005-03 | Obsolete generated-resource removal | Reapplication removes generated resources that no longer apply. | PASS | No active; orchestrator evidence | Unassigned | No active assignment |
| K-T005-04 | New resource initialization | Reapplication creates newly applicable generated resources at the correct initial value. | PASS | Tester 2 completed; 1 before/after reapplication | Unassigned | No active assignment |
| K-T006-01 | Locale-switch state retention | Locale change and re-render preserve class, level, subclass, abilities, and TCE selections. | PASS | No active; orchestrator evidence | Unassigned | No active assignment |
| K-T006-02 | Reload state persistence | Reload preserves the same character's inputs and selections. | PASS | No active; orchestrator evidence | Unassigned | No active assignment |
| K-T006-03 | Character option isolation | TCE options remain isolated between characters. | PASS | No active; orchestrator evidence | Unassigned | No active assignment |
| K-T007-01 | Case identity and expected/actual | Every report retains case ID plus explicit expected and actual results. | PASS | Tester 3 completed; 1 report review | Unassigned | No active assignment |
| K-T007-02 | Missing-output classification | Report missing resources separately from other discrepancy types. | PASS | Tester 3 completed; 1 report review | Unassigned | No active assignment |
| K-T007-03 | Unexpected-output classification | Report unexpected resources separately from other discrepancy types. | PASS | Tester 3 completed; 1 report review | Unassigned | No active assignment |
| K-T007-04 | Maximum classification | Report incorrect maximum values as a distinct finding. | PASS | Tester 3 completed; 1 report review | Unassigned | No active assignment |
| K-T007-05 | Recovery classification | Report incorrect recovery behavior as a distinct finding. | PASS | Tester 3 completed; 1 report review | Unassigned | No active assignment |
| K-T007-06 | Pool-key classification | Report incorrect pool keys as a distinct finding. | PASS | Tester 4 completed; 2 report reviews | Unassigned | No active assignment |
| K-T007-07 | Source classification | Report incorrect source metadata as a distinct finding. | PASS | Tester 4 completed; 2 report reviews | Unassigned | No active assignment |
| K-T007-09 | Cost classification | Report incorrect or missing costs as a distinct finding. | PASS | Tester 4 completed; 2 report reviews | Unassigned | No active assignment |
| K-T007-10 | Follow-up tracking | Track follow-up status and required auditor round-trips for each finding. | PASS | Tester 4 completed; 2 report reviews | Unassigned | No active assignment |

## K-M001–K-M005 — multiclass integration

| ID | Test case name | Test case scenario | Status | Current tester / owner | Coder | Auditor |
|---|---|---|---|---|---|---|
| K-M001 | Fighter/Ranger/Rogue multiclass | Fighter 5 Battle Master / Ranger 5 Gloom Stalker / Rogue 5 Arcane Trickster; total level 15, PB +5, Favored Foe on; verify class-level pools, PB, slots, and no key collisions. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-M002 | Sorcerer/Warlock multiclass | Sorcerer 10 Clockwork Soul / Warlock 10 Genie; total level 20, PB +6; verify class-level resources, Pact Magic, Mystic Arcanum boundary, and multiclass slots. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-M003 | Bard/Paladin multiclass | Bard 10 Eloquence / Paladin 10 Watchers; CHA 16; verify Bardic Inspiration recovery/count, Paladin-level pools, one Channel Divinity pool, and total-level PB. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-M004 | Wizard/Artificer multiclass | Wizard 10 Order of Scribes / Artificer 10 Battle Smith; INT 16; verify caster slots, class-level resources, INT formulas, Arcane Jolt gate, and pool identity. | PASS | No active; orchestrator runner | Unassigned | No active assignment |
| K-M005 | Cleric/Fighter multiclass | Cleric 1 Arcana / Fighter 19 Champion; total level 20, PB +6; verify Cleric 1 subclass, no premature Channel Divinity, class-level resources, PB, and multiclass slots. | PASS | No active; orchestrator runner | Unassigned | No active assignment |

## Source reports and update responsibility

- [Resource plan](./CR-class-resources-plan.md) — canonical test-case definitions and expected coverage.
- [Orchestrator report](./step-k-orchestrator-report.md) — consolidated results and operator dispositions.
- [Tester 1 report](./step-k-tester-1-report.md), [Tester 2 report](./step-k-tester-2-report.md), [Tester 3 report](./step-k-tester-3-report.md), and [Tester 4 report](./step-k-tester-4-report.md) — slice execution evidence.
- Update this table whenever a status or assignment changes. Record new tester/coder/auditor assignments here before work starts; retain detailed fixtures and raw evidence in the source reports.
