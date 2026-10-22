# Step K Tester 3 Report

> Central Step K status and assignment register: [step-k-control-table.md](./step-k-control-table.md). This report retains Tester 3 execution evidence.

**Status:** Complete: 19 PASS, 3 FAIL. Isolated browser storage was restored and the test server was stopped.

## Scope and method

Assigned cases only:

- K-S034–K-S039: Druid (Land, Moon, Dreams, Shepherd, Stars, Wildfire)
- K-S040–K-S047: Fighter (Champion, Battle Master, Eldritch Knight, Arcane Archer, Cavalier, Samurai, Rune Knight, Psi Warrior)
- K-S048–K-S055: Monk (Four Elements, Open Hand, Shadow, Drunken Master, Kensei, Astral Self, Mercy, Ascendant Dragon)

The contract fixture is a single-class level-20 character with every ability score 14 (+2), total level 20 / PB +6, and TCE optional features disabled. Expected values below are from the independent rules oracle, not `src/cr.js`.

Runtime execution was available over HTTP at `http://127.0.0.1:48937/cr.html`. The origin uses a unique port (isolated localStorage); the only record was the temporary character `__step_k_tester3_20261019_0025__`. The starting `dnd_skills_db` value was null. A first full matrix execution saved each selected class/subclass/source and generated resource keys, values, formulas, dice, and costs. Recovery/gate/trigger details still need a clean per-case capture and comparison, so these are provisional observations, not passes. The subsequent batch was interrupted by reload at the user's request to create this report; no results from that interrupted batch are used.

The first complete 22-case browser matrix and follow-up Druid/Fighter/Monk captures used the actual UI form, applied each level-20 configuration, and read the resulting generated character record. Recovery strings were normalized in-browser to `short-rest` / `long-rest` before comparison. No case remains unexecuted.

## Runtime matrix

Resource values are current/max. Formula shorthand: `class-level`, `PB`, `STR/CON/WIS modifier (minimum 1)`, `fixed`, or the indicated tier formula. Actual source is the recorded generated metadata source version. Recovery shown under Expected is the oracle rule; Actual recovery/trigger confirmation remains pending unless noted.

| ID | Status | Expected resources (independent oracle) | Actual captured output | Missing / unexpected / remaining comparison |
|---|---|---|---|---|
| K-S034 | PASS | Land: no finite subclass pool in scope at level 20; Natural Recovery is once-daily/short-rest-gated (not ordinary SR/LR). Druid Wild Shape is unlimited at 20, not a finite pool. Spell slots: 4/3/3/3/3/2/2/1/1. | PHB, Druid 20 / Land. No finite class/subclass pool rows; spell slots 4/4, 3/3, 3/3, 3/3, 3/3, 2/2, 2/2, 1/1, 1/1; d8 Hit Dice 20/20. | No missing or unexpected finite pool in scope. Natural Recovery is intentionally not generated as a daily-rest resource; official 2014 Basic Rules independently confirms unlimited Wild Shape at Druid 20. |
| K-S035 | PASS | Moon: no separate finite subclass pool; Moon features use Wild Shape. At Druid 20 Wild Shape is unlimited. Full-caster spell slots as K-S034. | PHB, Druid 20 / Moon. No finite class/subclass pool rows; spell slots and Hit Dice match K-S034. | No missing or unexpected finite pool at level 20; the unlimited Wild Shape pool is correctly absent. |
| K-S036 | PASS | Balm of the Summer Court: Druid level d6 pool = 20d6/LR. Hidden Paths: WIS +2 (minimum 1) = 2/LR. Walker in Dreams is daily and outside ordinary-rest scope. | XGE: `subclass:druid:dreams:balm-of-the-summer-court` 20/20, class-level, d6, long rest; `subclass:druid:dreams:hidden-paths` 2/2, WIS (minimum 1), long rest. | Keys, maxima, formulas, dice, recovery, and source match. Walker in Dreams is absent as expected for the daily-only feature outside the current recovery scope. |
| K-S037 | PASS | Spirit Totem: 1 use, SR/LR (normalized to short-rest cooldown). | XGE: `subclass:druid:shepherd:spirit-totem` 1/1, fixed 1, short-rest cooldown. | No missing or unexpected pool; key, source, maximum, and normalized recovery match. |
| K-S038 | PASS | Star Map: PB +6 free Guiding Bolt uses/LR. Cosmic Omen: PB +6/LR. Starry Form consumes shared Wild Shape; not a separate pool. | TCE: `subclass:druid:stars:star-map-guiding-bolt` 6/6 PB, long rest; `subclass:druid:stars:cosmic-omen` 6/6 PB, long rest. No Wild Shape row at Druid 20. | Both tracked pools match. Starry Form has no separate pool; its Wild Shape usage is unlimited at this test level. No unexpected pool. |
| K-S039 | FAIL | Cauterizing Flames: WIS +2 (minimum 1) = 2/LR. Wildfire Spirit consumes Wild Shape; dismissed spirit can be revived with a spell-slot cost, not a free pool. | TCE: `subclass:druid:wildfire:cauterizing-flames` 2/2, WIS (minimum 1), long rest. No Wildfire Spirit/Wild Shape row; the resource `costs`/`consumers` metadata is empty. | Missing paid-reuse output for the spell-slot revival of Wildfire Spirit (the oracle explicitly calls this out); Cauterizing Flames itself matches. |
| K-S040 | PASS | No Champion-specific finite rest pool. Fighter core: Second Wind 1/SR-LR; Action Surge 2/SR-LR; Indomitable 3/LR at level 20. | PHB: `class:fighter:second-wind` 1/1 fixed, short rest; `class:fighter:action-surge` 2/2, tiers 1→1 / 17→2, short rest, `once-on-your-turn`; `class:fighter:indomitable` 3/3, tiers 9→1 / 13→2 / 17→3, long rest. No Champion subclass pool. | No missing or unexpected pool; maximums, formulas, recovery, and Action Surge gate match. |
| K-S041 | PASS | Battle Master adds one shared Superiority Dice pool: 6d12 at level 20, SR/LR; Relentless restores 1 when initiative is rolled and the pool is empty. | PHB core pools as K-S040 plus `subclass:fighter:battle-master:superiority-dice` 6/6, d12, short rest; initiative recovery 1 when empty. | No duplicate maneuver pools. Key, dice, maximum, short-rest recovery, and empty-only initiative trigger match. |
| K-S042 | FAIL | Fighter core pools as K-S040; Eldritch Knight level-20 spell slots are 4 first-, 3 second-, 3 third-, and 1 fourth-level slot (Spell Slots; long rest). No additional subclass rest pool. | PHB core pools as K-S040; no subclass finite-pool row. Spell slots captured as 1st 4/4, 2nd 3/3, 3rd 3/3; no 4th-level slot generated. | Missing `class:spell-slot:4` 1/1 long-rest pool. The 2014 Eldritch Knight table's level-20 row independently cross-checks 1 fourth-level slot. |
| K-S043 | PASS | Arcane Shot: 2 uses, SR/LR; level-15 Ever-Ready Shot initiative recovery is not ordinary rest recovery. | XGE: `subclass:fighter:arcane-archer:arcane-shot` 2/2 fixed, short rest; initiative recovery 1 when empty. Fighter core pools as K-S040. | No duplicate Arcane Shot pool. Key, maximum, recovery, and initiative trigger match. |
| K-S044 | PASS | Unwavering Mark: STR +2 (minimum 1) = 2/LR; Warding Maneuver: CON +2 (minimum 1) = 2/LR. | XGE: `subclass:fighter:cavalier:unwavering-mark` 2/2 STR (minimum 1), long rest; `subclass:fighter:cavalier:warding-maneuver` 2/2 CON (minimum 1), long rest. Fighter core pools as K-S040. | No missing or unexpected pool; both ability formulas, maxima, sources, and recoveries match. |
| K-S045 | PASS | Fighting Spirit 3/LR; Strength Before Death 1/LR. Fighting Spirit restores one on initiative if empty at the appropriate level. | XGE: `subclass:fighter:samurai:fighting-spirit` 3/3 fixed, long rest, initiative recovery 1 when empty; `...:strength-before-death` 1/1 fixed, long rest. Fighter core pools as K-S040. | No missing or unexpected pool; maxima, recovery, and empty-only initiative trigger match. |
| K-S046 | PASS | Giant's Might and Runic Shield: PB +6/LR each. Five known rune slots: separate 1-use-per-rune SR/LR pools. | TCE: `subclass:fighter:rune-knight:giants-might` 6/6 PB, long rest; `...:runic-shield` 6/6 PB, long rest; `...:rune:1` through `...:rune:5`, each 1/1 fixed, short rest, separately keyed. Fighter core pools as K-S040. | No merged or missing rune pool. Names are represented as generic numbered rune slots, not actual rune names; all five identities and recovery pools remain separate. |
| K-S047 | PASS | Psionic Energy Dice: 2×PB = 12d12/LR, plus 1 on initiative if empty. Bulwark of Force and Telekinetic Master each 1/LR free, with extra use costing one Psionic Energy Die. | TCE: `subclass:fighter:psi-warrior:psionic-energy-dice` 12/12, 2×PB, d12, long rest, initiative recovery 1 when empty; `...:bulwark-of-force` 1/1 and `...:telekinetic-master` 1/1, long rest, each additional-use cost references the Psionic Energy Dice key. Fighter core pools as K-S040. | No missing or unexpected pool; keys, maxima, die, recovery, initiative trigger, and additional-use costs match. |
| K-S048 | PASS | Shared Ki: Monk level 20 = 20 points, SR/LR. Four Elements techniques spend Ki; no separate subclass pool. Perfect Self at 20 restores 4 Ki on initiative if empty. | PHB: `class:monk:ki` 20/20, class-level, short rest; initiative recovery 4 when empty. No separate Four Elements pool. | No missing or unexpected pool; shared key, recovery, and initiative trigger match. Feature uses spend the shared Ki pool rather than create another pool. |
| K-S049 | PASS | Shared Ki 20/SR-LR; Open Hand features spend Ki as applicable; no separate pool. Perfect Self trigger as K-S048. | PHB: `class:monk:ki` 20/20, class-level, short rest; initiative recovery 4 when empty. No separate Open Hand pool. | No missing or unexpected pool; shared key/recovery/initiative match. Open Hand features do not create separate rest pools. |
| K-S050 | PASS | Shared Ki 20/SR-LR; Shadow Arts costs Ki; no separate subclass pool. Perfect Self trigger as K-S048. | PHB: `class:monk:ki` 20/20, class-level, short rest; initiative recovery 4 when empty. No separate Shadow pool. | No missing or unexpected pool; shared key/recovery/initiative match. Shadow Arts uses the shared pool rather than an additional pool. |
| K-S051 | FAIL | Shared Ki 20/SR-LR; Drunkard's Luck costs 2 Ki; no separate pool. Perfect Self trigger as K-S048. | PHB: `class:monk:ki` 20/20, class-level, short rest; initiative recovery 4 when empty. No separate Drunken Master pool. The Ki record has `costs: []` and `consumers: []`. | Missing expected 2-Ki Drunkard's Luck cost output. Pool key/maximum/recovery/initiative match; no unexpected pool. |
| K-S052 | PASS | Shared Ki 20/SR-LR; Deft Strike and Sharpen the Blade spend Ki; no separate pool. Perfect Self trigger as K-S048. | PHB: `class:monk:ki` 20/20, class-level, short rest; initiative recovery 4 when empty. No separate Kensei pool. | No missing or unexpected pool; shared key/recovery/initiative match. Ki-consuming Kensei features do not create additional pools. |
| K-S053 | PASS | Shared Ki 20/SR-LR; Astral Self features spend Ki; no separate subclass pool. Perfect Self trigger as K-S048. | PHB: `class:monk:ki` 20/20, class-level, short rest; initiative recovery 4 when empty. No separate Astral Self pool. | No missing or unexpected pool; shared key/recovery/initiative match. Ki-consuming forms do not create additional pools. |
| K-S054 | PASS | Shared Ki 20/SR-LR. Hand of Ultimate Mercy: once/LR, costs 5 Ki. Hand of Healing/Harm use Ki. Perfect Self trigger as K-S048. | PHB Ki `class:monk:ki` 20/20, short rest, initiative recovery 4 when empty; TCE `subclass:monk:mercy:hand-of-ultimate-mercy` 1/1 fixed, long rest, 5-Ki cost referencing `class:monk:ki`. | No missing or unexpected finite pool; the explicit once/LR pool and 5-Ki cost match. Other Ki uses remain on the shared Ki pool. |
| K-S055 | PASS | Shared Ki 20/SR-LR. Breath of the Dragon: PB +6 free uses/LR, then Ki alternative. Wings of the Dragon: 1 free use/LR, then Ki alternative. Perfect Self trigger as K-S048. | PHB Ki `class:monk:ki` 20/20, short rest, initiative restores 4 when empty; FToD `subclass:monk:ascendant-dragon:breath-of-the-dragon` 6/6 PB, long rest, additional-use cost references Ki; `...:wings-of-the-dragon` 1/1 fixed, long rest, additional-use cost references Ki. Selected config is Monk 20 / Ascendant Dragon / FToD. | No missing or unexpected resource keys. Confirmed against the level-20 oracle; free-use exhaustion/alternate-use gates are represented by each separate LR pool plus the Ki additional-use cost. |

## Evidence and remaining work

- Contract / fixture / independent-oracle requirements: `.agent/CR/CR-class-resources-plan.md:95-101`; assigned IDs: `.agent/CR/CR-class-resources-plan.md:145-168`.
- Druid rules oracle: `.agent/CR/class-resource-recovery-reference.md:76-83`.
- Fighter rules oracle: `.agent/CR/class-resource-recovery-reference.md:87-97`.
- Monk rules oracle: `.agent/CR/class-resource-recovery-reference.md:101-110`.
- Browser/localStorage setup procedure: `.agent/CR/CR-stage5-playwright-tests.md:17-20`.
- Runtime evidence: the isolated HTTP page and temporary fixture named above; class/subclass/source selections and resource records were read from the generated `dnd_skills_db` entry. Follow-up captures normalized localized recovery values in-browser and recorded keys, values, formulas, dice, costs, consumers, gates, and initiative metadata for all three class batches.
- Independent RAW cross-checks: D&D Beyond's 2014 Basic Rules class chapter (`https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes`) confirms the level-20 Druid Wild Shape unlimited feature, Fighter core rest/turn limits, and Monk level-based Ki/Perfect Self recovery. The Eldritch Knight level-20 spell-slot table was independently cross-checked against a PHB-labeled transcription at `https://dnd5e.wikidot.com/fighter:eldritch-knight` (not an official publisher site).

**Final comparison:** all 22 assigned IDs were run. 19 PASS; K-S039, K-S042, and K-S051 FAIL for the explicit missing outputs above. No other Step K IDs were run. No product source, test plan, or another tester's report was changed.

**Cleanup verified:** the isolated origin initially had no `dnd_skills_db` entry. The temporary character and its per-character TCE settings were removed; `localStorage` is now empty (`dnd_skills_db === null`). The four temporary sessionStorage capture keys were removed, and the local HTTP server was stopped.

## K-B040–K-B050 follow-up (Tester 3)

**Disposition:** All applicable owned-slice categories were exercised. K-B040–K-B046 and K-B050 pass; K-B047 and K-B048 fail for incomplete consumer/cost output; K-B045 and K-B049 are N/A after a complete owned-slice inventory check. This is not a claim that global Step K is complete.

### Setup and independent oracle

- Scope is the Druid, Fighter, and Monk class-resource slice: 25 catalog definitions (7 / 14 / 4), plus the five dynamically generated Rune Knight rune-activation pools and three applicable TCE optional-feature definitions.
- Runtime page: `http://127.0.0.1:49383/cr.html`; unique temporary character: `K-B T3 isolated 49383`. The origin initially had empty localStorage/sessionStorage. Profiles were applied through the class-level UI and confirmed in the generated character record. No resource-use buttons were pressed; current values for an unchanged key were retained across reapplications, so the boundary assertions below compare pool presence, maximum/formula, recovery, identity, and metadata rather than treating a preserved current value as a failed maximum.
- Expected rules values came from [class-resource-recovery-reference.md](./class-resource-recovery-reference.md), Druid/Fighter/Monk sections (lines 76–110), and the K-B fixture contract in [CR-class-resources-plan.md](./CR-class-resources-plan.md) (lines 99–101 and 229–232). `src/cr.js` was used only to identify actual output keys/definitions under test, not as the expected-value oracle.
- Core 2014 rules were independently cross-checked against the [D&D Beyond 2014 Basic Rules, Chapter 3: Classes](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes), including Druid's level-20 Wild Shape, Fighter core resource levels, and Monk's level-based Ki. The rules reference remains the oracle for expansion subclass features.

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

- Contract: [CR-class-resources-plan.md](./CR-class-resources-plan.md), fixture rules and K-B040–K-B050 requirements at lines 99–101 and 229–232.
- Rules oracle: [class-resource-recovery-reference.md](./class-resource-recovery-reference.md), Druid/Fighter/Monk at lines 76–110.
- Actual catalog inventory (implementation under test only): [src/cr.js](../../src/cr.js), TCE option definitions at lines 142–144, all 25 class-resource rows at lines 182–206, Rune generation at lines 1763–1790.
- Browser evidence: each fixture's selected class/level/subclass/ability/TCE setting and generated resources were read from the isolated `dnd_skills_db` record before cleanup; the matrices above contain the normalized outputs and comparisons.
- Cleanup: the isolated origin was reloaded after clearing localStorage and sessionStorage; both key lists were empty, `dnd_skills_db` and `dnd_skills_class_feature_settings` were null, and the server listener on port 49383 was stopped. No product source or test plan was changed.

## Auditor Review — 2026-10-19

I reviewed K-S034–K-S055 and K-B040–K-B050 against the plan and rules reference. Captured browser output is treated only as actual output, not as the rules oracle. Most level-20 maxima, ordinary rest recovery, subclass gates, and the three already-reported missing-output findings are correctly compared. The following corrections or evidence follow-ups are required; existing rows, statuses, and comments above are intentionally unchanged.

### Confirmed findings

1. **Rune Knight understates the level-20 rune count — K-S046, K-B040, K-B043. Severity: High; confidence: High.**
   - **Independent rules source:** *Tasha’s Cauldron of Everything*, Rune Knight—Rune Carver: the Fighter knows two Runes at Fighter 3 and learns one additional Rune at Fighter 7, 10, 15, and 18. The individual Rune activations have separate short-or-long-rest recovery; see also the independent Rune Knight entry in `class-resource-recovery-reference.md`.
   - **Correction/evidence required:** The expected number at Fighter 18 and 20 is **six**, not five. Add and verify the sixth independent `...:rune:6` pool (1 use, short-rest-normalized recovery), and add the missing Fighter 17 → 18 gate/count comparison. Reconcile the K-B040/K-B043 fixture counts and update the K-S046 conclusion in a later Tester 3 supplement. The captured five-key level-20 output is evidence of a missing generated pool, not evidence that five is the RAW maximum. Consequently K-S046’s existing PASS and the report’s 19 PASS / 3 FAIL summary are not supportable as complete results.
   - **Return same report to Tester 3:** **Yes**—for the corrected independent oracle, a level-18/20 retest, and an appended follow-up; do not overwrite the existing row in this auditor review.

2. **Shared-pool consumer comparison is incomplete — K-S035, K-S038–K-S039, K-S041, K-S047–K-S055; K-B047 (and cost cross-check K-B048). Severity: Moderate; confidence: High.**
   - **Independent rules sources:** *Player’s Handbook* (2014), Druid—Wild Shape and Circle of the Moon (including Elemental Wild Shape), Fighter—Battle Master maneuvers, and Monk—Ki; *Xanathar’s Guide to Everything*, Drunken Master—Drunkard’s Luck; *Tasha’s Cauldron of Everything*, Psi Warrior—Psionic Power; *Fizban’s Treasury of Dragons*, Ascendant Dragon. These feature rules, rather than the captured consumer arrays, define the shared-pool expenditure.
   - **Correction/evidence required:** K-B047 itself records empty `consumers` arrays for Superiority Dice, Psionic Energy Dice, and Ki, and an empty Moon Wild Shape consumer list. Provide a complete per-pool consumer comparison at the applicable levels: the Moon Wild Shape expenditure (including the two-use Elemental Wild Shape option), Battle Master maneuvers, all assigned Psi Warrior abilities that spend a Psionic Energy Die, and the assigned Ki-consuming Monk features. Show each consumer pointing to the single correct pool; do not create duplicate pools. Also explicitly state whether Wild Companion appears in Wild Shape’s consumer listing—the active-feature alternative-cost link reported under K-B050 does not by itself establish that the separate consumer listing was checked. Preserve as correct the report’s evidence that pool keys are not duplicated and the listed additional-use cost links point to the correct pool.
   - **Return same report to Tester 3:** **Yes**—append the complete consumer matrix/evidence and distinguish missing consumer metadata from the already-correct pool identity and cost links.

3. **Three already-reported missing outputs are correctly identified; their failure conclusions stand — K-S039/K-B048, K-S042, K-S051/K-B048. Severity: Moderate; confidence: High.**
   - **Independent rules sources:** *Tasha’s Cauldron of Everything*, Circle of Wildfire—Summon Wildfire Spirit (spell-slot-paid resummoning after the initial use); *Player’s Handbook* (2014), Eldritch Knight—Spellcasting table at Fighter 20 (4/3/3/1 slots); *Xanathar’s Guide to Everything*, Drunken Master—Drunkard’s Luck (2 Ki).
   - **Correction/evidence required:** Keep these as missing-output findings: add Wildfire Spirit’s spell-slot paid-reuse cost without inventing a free-use pool; generate the missing 1 fourth-level Eldritch Knight Spell Slot; and attach Drunkard’s Luck’s 2-Ki expenditure to `class:monk:ki` without creating another pool. The report already marks the respective discrepancies, so no changed status is requested here.
   - **Return same report to Tester 3:** **No** for these conclusions; they are accurately reported as failures. Assign the listed output corrections to implementation follow-up, with a retest after remediation.

4. **Runtime/cleanup evidence has a conflicting port — all assigned runtime cases. Severity: Low; confidence: High.**
   - **Evidence source:** Internal consistency only (no rules source applies): Scope and method name runtime port `48937`; Evidence and cleanup say the stopped server listener was `49383`.
   - **Correction/evidence required:** Reconcile which listener served the captured output and which listener was stopped, with the matching URL/cleanup evidence. Do not treat either port or runtime output as a rules oracle.
   - **Return same report to Tester 3:** **Yes**—append a short clarification or the relevant runtime/cleanup evidence.

### Accepted scope and N/A dispositions

- K-B045 and K-B049 are acceptable only as the bounded N/A claims stated in the report: no applicable `recoveryFromLevel` or `recoveryOnly` definitions were found in the enumerated catalog slice, and Land Natural Recovery / Dreams Walker in Dreams are explicitly not claimed as runtime-tested. This is consistent with the plan’s deferral of daily and other non-standard recovery behavior; it does not establish those behaviors as implemented or tested.
- The absence of a finite Wild Shape pool at Druid 20 in K-S034–K-S035 and K-S038–K-S039 is correct under the 2014 Archdruid feature. It does not excuse the separate missing level-20 Rune Knight sixth Rune pool.

### Tester 3 follow-up — 2026-10-19

This is an append-only response to the auditor review. All earlier case rows, category rows, statuses, and auditor comments are preserved. The corrected dispositions below supersede only the affected PASS conclusions and aggregates. No product code, test plan, or other tester report was changed.

#### Rune Knight: RAW count, gate, and generated pools

The independent RAW expectation is six known Runes at Fighter 18 and 20: two at Fighter 3, then one additional Rune at 7, 10, 15, and 18 (Tasha's Cauldron of Everything, Rune Knight / Rune Carver; see Finding 1 above). Each Rune activation is independently tracked at one use, with short-or-long-rest recovery normalized to short rest by this tool.

Retests used the actual class-level UI and generated character record at Fighter 17, 18, and 20, with all ability scores 14 and TCE optional features off:

| Fighter level | Expected known Rune pools | Actual generated Rune keys | Actual per-key maximum / recovery / source | Result |
|---:|---:|---|---|---|
| 17 | 5 | `subclass:fighter:rune-knight:rune:1` through `...:rune:5` | Each 1/1, fixed, short rest, TCE; no duplicate key | PASS for the pre-gate count |
| 18 | 6 | `...:rune:1` through `...:rune:5`; `...:rune:6` absent | Each generated key is 1/1, fixed, short rest, TCE; five distinct keys | FAIL: the 17-to-18 RAW increase is missing |
| 20 | 6 | `...:rune:1` through `...:rune:5`; `...:rune:6` absent | Each generated key is 1/1, fixed, short rest, TCE; five distinct keys | FAIL: the sixth independent pool remains absent |

The 17-to-18 comparison confirms the expected gate: the RAW count changes from five to six, while the runtime remains at five. At 20 the generated set likewise contains five unique keys and no `...:rune:6`. The previous K-S046 level-20 capture and this retest agree on actual output; the old expected count of five was not a valid RAW oracle.

- **K-S046:** corrected current disposition is **FAIL**, because the six-pool expectation is met by only five generated keys. This supersedes the earlier K-S046 PASS without changing its original row. The three existing missing-output failures K-S039, K-S042, and K-S051 remain intact. Corrected K-S totals: **18 PASS, 4 FAIL** (K-S039, K-S042, K-S046, K-S051).
- **K-B040:** expected inventory is nine fixed catalog rows plus six independent Rune activation pools (15 fixed-use definitions). The previous 22 profiles covered Rune Knight at 3/7/10/15; these retests add Fighter 17/18/20, for **25 profiles**. The expected sixth fixed-use pool is absent at 18/20, so K-B040 is **FAIL**.
- **K-B043:** the previous 28 level-tier profiles plus the same three new Fighter 17/18/20 profiles make **31 profiles**. The expected Rune count step 5-to-6 at 18 does not occur, and the 20th-level count remains five; K-B043 is **FAIL**.
- **K-B046:** its existing 30 dedicated profiles and 46 K-B041 profiles reused the K-B043 tier profiles for count assertions. With 31 K-B043 profiles, the evidence totals **107 profile assertions** (reused profiles, not 107 distinct characters); the Rune-count assertion now fails at 18/20, so K-B046 is **FAIL**. Other previously passing scaling checks remain as recorded.
- **Corrected K-B category totals:** **4 PASS, 5 FAIL, 2 N/A**. PASS: K-B041, K-B042, K-B044, K-B050. FAIL: K-B040, K-B043, K-B046, K-B047, K-B048. N/A: K-B045, K-B049.

#### Shared-pool consumer-to-key comparison

Twelve focused profiles were applied for consumer evidence: Druid 10 / Moon; Druid 2 / Moon with Wild Companion enabled; Fighter 20 / Battle Master; Fighter 20 / Psi Warrior; and Monk 20 for each of the eight assigned subclasses. Existing K-B047 runtime evidence for the Stars and Wildfire consumer entries is retained and cited below. Expected consumers are from the auditor-cited feature rules and [class-resource-recovery-reference.md](./class-resource-recovery-reference.md); generated records are actual output only.

| Shared pool key | Expected consumers and key relationship | Captured actual consumer/cost evidence | Disposition |
|---|---|---|---|
| `class:druid:wild-shape` | Moon Wild Shape and Elemental Wild Shape use this pool; Elemental Wild Shape spends two uses. Starry Form and Wildfire Spirit use it. Wild Companion uses this pool or an alternative spell slot. | At Druid 10 / Moon the single 2/2 short-rest pool is `shared:true`, but `consumers:[]` and `costs:[]`; no Moon or two-use Elemental Wild Shape link is generated. Prior K-B047 Stars and Wildfire profiles list Starry Form and Wildfire Spirit on this key. At Druid 2 / Moon with Wild Companion enabled, the pool still has `consumers:[]`; `activeTceFeatures` separately records Wild Companion costs as alternatives: `poolKey: class:druid:wild-shape` and `type: spell-slot`. | Pool identity and the Wild Companion cost alternatives are correct. Moon/Elemental links and Wild Companion's membership in the separate `consumers` list are missing. The cost link does not count as consumer-list evidence. |
| `subclass:fighter:battle-master:superiority-dice` | Every maneuver that expends a Superiority Die draws from this single pool. | Fighter 20 generates one 6/6 d12 pool, short-rest recovery, `shared:true`; `consumers:[]`, `costs:[]`. No per-maneuver resource keys or duplicate pools appear. | Correct pool identity/deduplication; no individual maneuver-to-key consumer entries are generated. |
| `subclass:fighter:psi-warrior:psionic-energy-dice` | Protective Field, Psionic Strike, Telekinetic Movement's paid repeat use, and the additional uses of Bulwark of Force and Telekinetic Master draw from this pool. | Fighter 20 generates one 12/12 pool, long-rest recovery, `shared:true`; `consumers:[]`, `costs:[]`. The separate Bulwark of Force and Telekinetic Master rows each have `costs:[{poolKey: subclass:fighter:psi-warrior:psionic-energy-dice, additionalUse: true}]`. No duplicate Psionic Energy Dice pool appears. | The two reported additional-use links are correct and preserved. Consumer-list entries for all five consuming abilities are absent; the three Psionic Power uses have no separate cost-to-key records. |
| `class:monk:ki` | The assigned Ki-consuming features below, as well as the core Monk Ki expenditures, use this one Monk-level pool. | All eight Monk 20 subclass profiles generate exactly one 20/20 Ki pool, short-rest recovery, `shared:true`, with `consumers:[]` and `costs:[]`. Hand of Ultimate Mercy, Breath of the Dragon, and Wings of the Dragon are separate pools whose cost rows point to this exact Ki key. No duplicate Ki pool appears. | Pool identity/deduplication passes. The resource consumer list is empty for every assigned profile; verified separate cost rows are listed below, while other consumer links are absent. |

Assigned Monk consumer matrix (each expected Ki expenditure should resolve to `class:monk:ki`):

| Case / subclass | RAW Ki consumers in the assigned feature set | Actual generated link |
|---|---|---|
| K-S048 Four Elements | Ki-costed Elemental Disciplines (cost varies by discipline) | Ki `consumers:[]`, `costs:[]`; no per-discipline link |
| K-S049 Open Hand | Quivering Palm (3 Ki); Open Hand Technique can modify Flurry without adding a separate Ki expenditure | Ki `consumers:[]`, `costs:[]`; Quivering Palm link absent |
| K-S050 Shadow | Shadow Arts' paid spell options (2 Ki each) | Ki `consumers:[]`, `costs:[]`; spell-to-key links absent |
| K-S051 Drunken Master | Drunkard's Luck (2 Ki) | Ki `consumers:[]`, `costs:[]`; cost remains missing as previously reported |
| K-S052 Kensei | Deft Strike (1 Ki); Sharpen the Blade (1–3 Ki) | Ki `consumers:[]`, `costs:[]`; feature-to-key links absent |
| K-S053 Astral Self | Arms (2 Ki), Visage (1 Ki), Body (1 Ki), and Awakened Astral Self (5 Ki) | Ki `consumers:[]`, `costs:[]`; feature-to-key links absent |
| K-S054 Mercy | Hand of Healing and Hand of Harm (1 Ki where paid); Hand of Ultimate Mercy (5 Ki) | Ki consumer list is empty. The Hand of Ultimate Mercy row's separate cost link is correct: `poolKey: class:monk:ki`, `amount: 5`; Hand of Healing/Harm links are absent. |
| K-S055 Ascendant Dragon | Breath of the Dragon and Wings of the Dragon additional uses | Ki consumer list is empty. Both separate pool rows have the correct `additionalUse: true` link to `class:monk:ki`. |

The core Monk Ki actions (Flurry of Blows, Patient Defense, Step of the Wind, and Stunning Strike) also consume the same Ki pool; no consumer entries for them appear in the captured Ki records. No pool-identity or duplicate-key defect was found in these consumer fixtures. K-B047 remains **FAIL** for incomplete consumer enumeration, distinct from the correctly keyed costs explicitly identified above.

#### Runtime port and cleanup reconciliation

The K-S matrix runtime URL is `http://127.0.0.1:48937/cr.html` (Scope and method above). The `49383` URL and explicit stopped-listener note belong to the later K-B run (K-B setup and cleanup); the K-S cleanup paragraph records that its local server was stopped but does not name a port. Therefore `49383` is not K-S shutdown evidence. Before this follow-up, both historical ports 48937 and 49383 had no listener. These follow-up profiles ran at `http://127.0.0.1:49321/cr.html` with temporary character `__t3_auditor_followup_20261019_0440__`; the isolated origin began with empty localStorage/sessionStorage. After testing, both stores were cleared, the page was reloaded, `dnd_skills_db` and `dnd_skills_class_feature_settings` were null, and both key lists were empty. The 49321 server was stopped; post-cleanup checks found no listener on 48937, 49383, or 49321.

K-S039, K-S042, and K-S051 remain confirmed missing-output failures. Together with K-S046, they require implementation and retest **after the common baseline is released**; this follow-up made no production changes.

### Auditor response — 2026-10-19

Re-reviewed the follow-up against the prior auditor findings. Prior report rows and comments remain unchanged.

- **Rune Knight — accepted.** The six-Rune RAW expectation is correct: two at Fighter 3, then one at each of 7, 10, 15, and 18, per *Tasha’s Cauldron of Everything*, Rune Knight—Rune Carver. The reported Fighter 17/18/20 retests correctly show five actual keys at 17, an absent sixth key at 18 and 20, and the proper 5→6 expected gate. The corrected **K-S totals of 18 PASS / 4 FAIL** are arithmetically consistent with the 22 assigned cases. K-B040’s **25** profiles, K-B043’s **31**, and K-B046’s **107 profile assertions** reconcile with the earlier counts plus the three added levels; K-B046 correctly distinguishes assertions from distinct characters. The **4 PASS / 5 FAIL / 2 N/A** category totals account for all eleven K-B040–K-B050 cases. K-S046, K-B040, and K-B043 remain confirmed missing-pool implementation defects for post-baseline correction and retest.
- **Port and cleanup — accepted.** The report’s K-S runtime is `48937`; the original K-B setup identifies `49383`. The follow-up distinguishes those runs, reports both historical ports listener-free, and records cleanup of the new `49321` run, including storage and listener checks. The earlier port discrepancy is reconciled.
- **Consumer matrix — still insufficient; return the same report to Tester 3. Severity: Moderate; confidence: High.**
  - **Independent rules source:** *Tasha’s Cauldron of Everything*, Psi Warrior—Psionic Power, Telekinetic Adept, and Guarded Mind; *Player’s Handbook* (2014), Way of the Four Elements—Disciplines of the Elements.
  - **K-S047 / K-B047:** The expected Psi Warrior matrix lists five die-consuming feature entries but omits **Psi-Powered Leap** (Telekinetic Adept) and **Guarded Mind**; both expend a Psionic Energy Die. Add them to the expected consumer set and explicitly verify their actual consumer/cost-to-key output against `subclass:fighter:psi-warrior:psionic-energy-dice`. The captured empty consumer/cost arrays do not substitute for recording those two feature-specific comparisons.
  - **K-S048 / K-B047:** “Ki-costed Elemental Disciplines (cost varies by discipline)” is not a complete, fixture-specific comparison. State the level-20 discipline selection used (or enumerate all applicable costed options), list the relevant Ki costs, and show the actual link for each to `class:monk:ki`; identify any no-Ki discipline separately. The current generic description and empty arrays establish a gap but do not provide the requested complete expected/actual matrix.
  - The Wild Companion follow-up is sufficient: it separately checks the `consumers` list, finds it empty, and distinguishes that missing membership from the correctly captured alternative cost link. The other reported consumer-array omissions and the existing K-B047 FAIL disposition are also supported.
  - **Return same report to Tester 3:** **Yes**—append the two missing Psi Warrior consumers and the exact Four Elements fixture/cost comparison, with actual output evidence. Keep K-B047 FAIL unless that evidence changes the comparison; do not overwrite prior rows.
- **Post-baseline implementation/retest items already confirmed:** the sixth Rune pool; the missing Eldritch Knight fourth-level Spell Slot (K-S042); Wildfire Spirit’s spell-slot paid-reuse cost (K-S039/K-B048); Drunkard’s Luck’s 2-Ki cost (K-S051/K-B048); and the missing shared-consumer relationships documented in K-B047. The Four Elements and omitted Psi Warrior entries above still require the specified evidence before the consumer audit can be closed.

### Tester 3 response — 2026-10-19

This is an append-only response to the auditor re-review. Earlier rows, statuses, auditor comments, and post-baseline items are preserved. The focused runtime check used `http://127.0.0.1:49401/cr.html` and the unique temporary character `__t3_auditor_closing_20261019_a__`; the same character was first configured as Fighter 20 / Psi Warrior and then Monk 20 / Four Elements. No product code was changed.

#### Psi Warrior: added expected consumers and actual links

Expected die expenditures are from *Tasha’s Cauldron of Everything*, Psi Warrior—Psionic Power, Telekinetic Adept, and Guarded Mind. Every die expenditure uses the one shared key `subclass:fighter:psi-warrior:psionic-energy-dice`.

| Feature | Expected die use / gate | Expected pool key | Fighter 20 actual output |
|---|---|---|---|
| Protective Field | Expend one die to reduce damage; Psionic Power, level 3 | `subclass:fighter:psi-warrior:psionic-energy-dice` | No consumer entry or feature cost link |
| Psionic Strike | Expend one die to add force damage; Psionic Power, level 3 | Same key | No consumer entry or feature cost link |
| Telekinetic Movement | One free use per short or long rest; each additional use expends one die; level 7 | Same key | No consumer entry or feature cost link |
| **Psi-Powered Leap** | Expend one die when activating the bonus-action flight; Telekinetic Adept, level 7 | Same key | **No feature row, consumer entry, or cost-to-key link** |
| **Guarded Mind** | Expend one die at the start of a turn to end charmed or frightened; level 10 | Same key | **No feature row, consumer entry, or cost-to-key link** |
| Bulwark of Force | Additional use expends one die; level 15 | Same key | Separate Bulwark row has `costs:[{poolKey: subclass:fighter:psi-warrior:psionic-energy-dice, additionalUse:true}]`; the pool consumer list omits it |
| Telekinetic Master | Additional use expends one die; level 18 | Same key | Separate Telekinetic Master row has the same correct `additionalUse:true` link; the pool consumer list omits it |

The generated Psionic Energy Dice row was 12/12, d12, long-rest recovery, `shared:true`, with `consumers:[]` and `costs:[]`. The Fighter 20 configuration satisfies both new features’ level gates, but neither has any generated feature/resource row or link to the expected key. Telekinetic Thrust is not a separate die consumer; it modifies Psionic Strike. This confirms the two newly requested omissions feature-by-feature and preserves the distinction between the correct additional-use cost links and the absent consumer-array membership. **K-B047 remains FAIL**; no prior K-S047 status is changed.

#### Four Elements: complete discipline cost comparison

The runtime fixture was Monk 20 / Four Elements (PHB), all abilities 14, with TCE options off. No specific discipline selection was represented: the builder records class, level, subclass, and source, but has no discipline-selection field. In accordance with the auditor’s alternative, the expected matrix below enumerates all costed options from *Player’s Handbook* (2014), Monk—Way of the Four Elements, “Disciplines of the Elements” (pp. 80–81). Costs and feature effects are the RAW oracle, not implementation metadata.

| Minimum Monk level | Costed discipline | RAW Ki cost | Actual link/output to `class:monk:ki` |
|---:|---|---|---|
| 3 | Fangs of the Fire Snake | 1 base; each additional Ki adds 1d10 extra fire damage | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 3 | Fist of Four Thunders | 2 base; eligible spell upcasting adds 1 Ki per spell level, up to 6 total Ki at Monk 20 | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 6 | Fist of Unbroken Air | 2 base; each additional Ki adds 1d10 damage | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 6 | Clench of the North Wind | 3 base; eligible spell upcasting adds 1 Ki per spell level, up to 6 total Ki at Monk 20 | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 6 | Gong of the Summit | 3 base; eligible spell upcasting adds 1 Ki per spell level, up to 6 total Ki at Monk 20 | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 6 | Rush of the Gale Spirits | 2 | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 6 | Shape the Flowing River | 1 | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 6 | Sweeping Cinder Strike | 2 base; eligible spell upcasting adds 1 Ki per spell level, up to 6 total Ki at Monk 20 | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 6 | Water Whip | 2 base; each additional Ki adds 1d10 damage | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 11 | Flames of the Phoenix | 4 base; eligible spell upcasting adds 1 Ki per spell level, up to 6 total Ki at Monk 20 | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 11 | Mist Stance | 4 | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 11 | Ride the Wind | 4 | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 17 | Breath of Winter | 6 base; no extra Ki fits the level-20 six-Ki spell limit | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 17 | Eternal Mountain Defense | 5 | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 17 | River of Hungry Flame | 5 base; eligible spell upcasting adds 1 Ki per spell level, up to 6 total Ki at Monk 20 | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 17 | Wave of Rolling Earth | 6 base; no extra Ki fits the level-20 six-Ki spell limit | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |

The PHB spell-and-Ki limit at Monk 17–20 is six Ki points total for a discipline spell, including its base cost; the additional damage scaling of Fangs of the Fire Snake, Fist of Unbroken Air, and Water Whip is not that spell limit and is bounded by available Ki. The separate no-Ki discipline is **Elemental Attunement**; it is not expected to link to the Ki pool.

Actual Monk output contained only the 20/20 Hit Dice row and `class:monk:ki` 20/20, with PHB source, `maximumFormula:{type:class-level}`, short-rest recovery, `shared:true`, `consumers:[]`, and `costs:[]`. There were no discipline-specific output rows or cost links, so every costed option above is explicitly absent from the generated links; Elemental Attunement correctly has no expected Ki cost. This supplements, but does not overwrite, K-S048’s PASS for the Ki pool’s presence/identity. **K-B047 remains FAIL** for missing consumer/cost-to-key evidence.

#### Disposition and cleanup

The accepted corrected totals remain **K-S: 18 PASS / 4 FAIL** and **K-B: 4 PASS / 5 FAIL / 2 N/A**. The existing confirmed failures and all post-baseline implementation/retest items remain unchanged. On the isolated origin, localStorage and sessionStorage were empty before the fixture; after clearing and reloading, both key lists were empty and the app returned to its no-character state. The server process was stopped and port `49401` verified listener-free.

### Auditor conclusion — 2026-10-19

The second follow-up supplies the requested actual-output checks for both newly added Psi Warrior features: Psi-Powered Leap and Guarded Mind each have no generated feature row, consumer entry, or cost-to-key link. It also provides a level-20 Four Elements fixture, enumerates the costed options and Elemental Attunement, and explicitly records the actual Ki pool arrays and absent links. Cleanup evidence for port `49401` is adequate. The corrected K-S/K-B totals and the confirmed missing Rune pool and other previously recorded output defects remain as stated.

**The consumer audit is not yet ready to close; return this same report to Tester 3 for a rules-oracle correction.** Independent sources: *Tasha’s Cauldron of Everything*, Psi Warrior—Telekinetic Adept and Guarded Mind; *Player’s Handbook* (2014), Way of the Four Elements—Disciplines of the Elements and its spell/Ki spending rules.

- **K-S047 / K-B047 — Psi Warrior expected-use wording:** The actual absence checks are sufficient, but correct the expected rules. Psi-Powered Leap has one use before a short or long rest; **additional uses**, not the initial activation, expend one Psionic Energy Die. Guarded Mind permits expending one die when charmed or frightened to end all effects subjecting the Fighter to those conditions; the cited feature does not impose the report’s “at the start of a turn” restriction. Reconcile the expected matrix to that wording. The missing links remain a confirmed post-baseline implementation/retest item.
- **K-S048 / K-B047 — Four Elements RAW corrections:** The list is comprehensive in option coverage, but not fully accurate in gates/cost details:
  1. **Fist of Unbroken Air** is a 3rd-level discipline, not a 6th-level discipline.
  2. Clarify **Fangs of the Fire Snake** as 1 Ki to activate the extended/retyped unarmed strikes, plus 1 Ki on a hit for the first extra 1d10 fire damage; each further Ki spent on that hit adds another 1d10. “1 base; each additional Ki” does not clearly state the separate first damage cost.
  3. The Four Elements general rule permits additional Ki to raise the level of a spell discipline, at one additional Ki per spell level and subject to the Monk-level maximum (six total Ki at Monk 20). The table omits this option for **Rush of the Gale Spirits, Mist Stance, and Ride the Wind**. Include their legal upcasting costs/limits as well, even where upcasting provides no additional spell effect; confirm the stated limits for every other spell discipline against the same general rule. Non-spell damage scaling such as Fangs, Fist of Unbroken Air, and Water Whip remains distinct from that spell-level limit.
  4. Keep **Elemental Attunement** explicitly identified as the no-Ki discipline.
- **Return same report to Tester 3:** **Yes**—append the corrected Psi Warrior cost/gate wording and corrected Four Elements gate, cost breakdown, and full spell-upcasting comparison. Preserve the actual-absence evidence and K-B047 FAIL; do not replace prior rows.

The follow-up’s list of absent generated links supports retaining **K-B047 FAIL** and treating the missing consumer/cost metadata as a post-baseline implementation/retest item. The existing confirmed post-baseline items remain the sixth Rune pool, Eldritch Knight’s fourth-level Spell Slot, Wildfire Spirit paid reuse, Drunkard’s Luck’s 2-Ki cost, and the missing shared-pool consumer/cost links. No product code or other report was changed.

### Tester 3 response — 2026-10-19 (rules-oracle correction)

Append-only correction beneath the auditor conclusion. The expected-rule wording below supersedes only the corresponding expected values in the previous follow-up; the captured actual outputs, earlier rows, statuses, auditor comments, corrected totals, and post-baseline classifications remain preserved.

#### Psi Warrior: corrected expected use and costs

RAW source: *Tasha’s Cauldron of Everything*, Psi Warrior—Telekinetic Adept and Guarded Mind. The expected shared pool is `subclass:fighter:psi-warrior:psionic-energy-dice`.

| Feature | Correct expected use / gate | Actual captured output |
|---|---|---|
| Psi-Powered Leap | One use before finishing a short or long rest; each additional use expends one Psionic Energy Die. Telekinetic Adept, Fighter 7. | No `psi-powered-leap` resource row, no consumer entry, and no cost-to-key link. The Psionic Energy Dice pool still has `consumers:[]` and `costs:[]`. |
| Guarded Mind | When charmed or frightened, expend one Psionic Energy Die to end all effects subjecting the Fighter to those conditions. No start-of-turn trigger is specified. | No `guarded-mind` resource row, consumer entry, or cost-to-key link. The pool still has `consumers:[]` and `costs:[]`. |

The prior Fighter 20 capture remains the actual-output evidence: the Psionic Energy Dice pool is 12/12 d12, long-rest recovery, shared, with empty consumer/cost arrays; the Bulwark of Force and Telekinetic Master additional-use cost links remain correct. The expected Psi-Powered Leap free-use recovery and additional-die cost do not appear in that output. **K-B047 remains FAIL**; this correction does not change case status or the post-baseline implementation/retest classification.

#### Four Elements: corrected gate, variable Ki costs, and all spell levels

RAW source: *Player’s Handbook* (2014), Monk—Way of the Four Elements, “Disciplines of the Elements” and its spell/Ki spending rule (pp. 80–81). The expected spell cost is the discipline’s base Ki cost plus 1 Ki for each spell level above the spell’s base level, subject at Monk 20 to a maximum of 6 total Ki for that spell. The maximum target spell level shown below follows that total-cost cap. This accounting includes Rush of the Gale Spirits, Mist Stance, and Ride the Wind, and does not depend on whether the higher spell level adds a further effect.

The runtime fixture was Monk 20 / Four Elements; no discipline choices were recorded in the builder. The actual evidence remains the captured output: only the shared `class:monk:ki` pool (20/20, class-level maximum, short-rest recovery, PHB) and Hit Dice were generated; Ki had `consumers:[]` and `costs:[]`, and no discipline-specific rows or links were present. Each absent link below refers to that same captured output.

| Minimum Monk level | Spell discipline | Base spell / base Ki | Legal spell levels and Ki at Monk 20 | Actual link to `class:monk:ki` |
|---:|---|---|---|---|
| 3 | Fist of Four Thunders | Thunderwave (1st) / 2 Ki | 1st–5th; 2–6 Ki | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 6 | Clench of the North Wind | Hold Person (2nd) / 3 Ki | 2nd–5th; 3–6 Ki | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 6 | Gong of the Summit | Shatter (2nd) / 3 Ki | 2nd–5th; 3–6 Ki | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 6 | Rush of the Gale Spirits | Gust of Wind (2nd) / 2 Ki | 2nd–6th; 2–6 Ki | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 6 | Sweeping Cinder Strike | Burning Hands (1st) / 2 Ki | 1st–5th; 2–6 Ki | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 11 | Flames of the Phoenix | Fireball (3rd) / 4 Ki | 3rd–5th; 4–6 Ki | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 11 | Mist Stance | Gaseous Form (3rd) / 4 Ki | 3rd–5th; 4–6 Ki | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 11 | Ride the Wind | Fly (3rd) / 4 Ki | 3rd–5th; 4–6 Ki | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 17 | Breath of Winter | Cone of Cold (5th) / 6 Ki | 5th only; 6 Ki | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 17 | Eternal Mountain Defense | Stoneskin (4th) / 5 Ki | 4th–5th; 5–6 Ki | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 17 | River of Hungry Flame | Wall of Fire (4th) / 5 Ki | 4th–5th; 5–6 Ki | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 17 | Wave of Rolling Earth | Wall of Stone (5th) / 6 Ki | 5th only; 6 Ki | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |

The non-spell discipline costs remain distinct from spell-level spending:

| Minimum Monk level | Non-spell discipline | Correct RAW cost | Actual link to `class:monk:ki` |
|---:|---|---|---|
| 3 | Fangs of the Fire Snake | 1 Ki to activate the extended, fire-damage unarmed strikes; on a hit, 1 additional Ki for the first extra 1d10 fire damage; each further Ki spent on that hit adds another 1d10 | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 3 | Fist of Unbroken Air | **2 Ki base**; each additional Ki adds 1d10 damage | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 6 | Shape the Flowing River | 1 Ki | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |
| 6 | Water Whip | 2 Ki base; each additional Ki adds 1d10 damage | Absent: no discipline row/link; pool `consumers:[]`, `costs:[]` |

**Elemental Attunement** remains explicitly the no-Ki discipline; it is not expected to link to the Ki pool. Thus all 16 costed disciplines have a corrected expected cost/gate and an explicitly preserved absent-link actual result. The correction does not change K-S048’s existing PASS for the Ki pool’s presence/identity or **K-B047 FAIL** for missing shared-consumer/cost links. Existing post-baseline implementation/retest classifications and totals are unchanged.

### Auditor conclusion — 2026-10-19 (rules-oracle correction)

The rules-oracle correction is accepted; no further return to Tester 3 is required for these expected-rule entries.

- **Psi Warrior:** The corrected expected entries now match *Tasha’s Cauldron of Everything*: Psi-Powered Leap is free once before a short or long rest, with additional uses costing one Psionic Energy Die; Guarded Mind applies when charmed or frightened, with no added start-of-turn restriction. The actual evidence explicitly checks both missing feature rows/consumer links and preserves the correct Bulwark of Force and Telekinetic Master additional-use links.
- **Four Elements:** The correction now gives Fist of Unbroken Air’s 3rd-level gate and 2-Ki base cost; separates Fangs of the Fire Snake’s activation cost from its first and subsequent damage costs; enumerates the costed spell disciplines with their base spell levels, base Ki, legal Monk-20 upcasting range and six-Ki cap; distinguishes non-spell variable-damage costs; and correctly identifies Elemental Attunement as requiring no Ki. The actual-output evidence explicitly reports the absent discipline links and empty Ki consumer/cost arrays.
- **Disposition:** The rules-oracle correction loop is **closed**. Keep **K-B047 FAIL** for the confirmed absent consumer/cost metadata. Keep K-S048’s existing PASS limited to the Ki pool’s presence and identity; it does not pass the missing consumer/cost comparisons. The corrected **K-S 18 PASS / 4 FAIL** and **K-B 4 PASS / 5 FAIL / 2 N/A** totals remain consistent.
- **Confirmed post-baseline implementation and retest items:** add Rune Knight’s sixth independent Rune pool at Fighter 18 (K-S046, K-B040, K-B043); add Eldritch Knight’s fourth-level Spell Slot (K-S042); add Wildfire Spirit’s paid spell-slot reuse (K-S039/K-B048); add Drunkard’s Luck’s 2-Ki cost (K-S051/K-B048); and implement the missing shared-pool consumer/cost links evidenced by K-B047, including Wild Shape consumers, Wild Companion consumer-list membership, Battle Master maneuvers, Psi Warrior die expenditures, and Monk Ki consumers. No product code or other report was changed.
