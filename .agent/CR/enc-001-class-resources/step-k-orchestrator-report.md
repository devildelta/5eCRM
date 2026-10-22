# Step K orchestrator test report

- Central Step K case status and assignment register: [step-k-control-table.md](./step-k-control-table.md). This report retains consolidated findings and evidence; update the control table when status or ownership changes.
- Scope: K-B001–K-B050, 54 scored K-T child cases (K-T007-08 dropped as outside Step A–J CR feature scope; parent IDs are group labels), K-M001–K-M005
- Status: IN PROGRESS
- Runner: orchestrator session
- Rule oracle: `.agent/CR/class-resource-recovery-reference.md` plus explicit fixture assertions in this report
- Product source under test: `src/cr.js`, `cr.html`, and locale files

## Execution setup

Manual Playwright against `http://127.0.0.1:8765/cr.html`; temporary character IDs used the `__stepk_*_20261019__` prefix. Before each browser script, preserve `dnd_skills_db`, `dnd_skills_class_feature_settings`, and `dnd_skills_locale`; restore all three in `finally`/error cleanup and reload the blank home page. No product files were changed during test execution.

## Case results

| Case | Status | Expected | Actual | Evidence / follow-up |
|---|---|---|---|---|
| K-B001–K-B013 | PASS | At each class' `unlockLevel - 1`, subclass select is disabled and not required; at unlock, enabled and required with options. Custom class hides and disables subclass select. | 13/13 standard class boundaries passed; no page errors. | Browser outputs captured in orchestrator session. |
| K-B014–K-B023 | PASS | Each TCE option is independently off by default; selecting only that option must activate it only at its own level threshold. | All 10 options passed below/at-boundary, independent toggle, reload persistence; Sorcerous Restoration adds 4 Sorcery Points on short rest. | Browser Playwright; no page errors. |
| K-B024 | PASS | Ability scores 1/10/20/30 accepted; CHA-dependent Divine Sense applies minimum 1; blank CHA reports a localized validation error. | Divine Sense maxima 1/1/6/11; blank CHA error: `計算此職業資源需要輸入魅力。` | Browser Playwright; all six score fields exercised; no page errors. |
| K-B025 | PASS | Ranger Favored Foe PB boundaries at total level 1/4/5/8/9/12/13/16/17/20. | Maxima 2/2/3/3/4/4/5/5/6/6. | Browser Playwright; no page errors. |
| K-B026–K-B039 | PASS | All 14 formula/subformula branches return fixture-derived values, including half-PB-up slot-level metadata and Barbarian level-20 unlimited Rage. | fixed 1; PB 2; twice PB 6; half PB up 2; ability 3; ability-plus 4; ability-times 6; class level 10; class-level half-up 3; class-level plus one 4; class-level times 20; level tier 2; Cleric Channel Divinity 3; Rage 6 at 19 and no finite pool at 20. | Browser Playwright; no page errors. |
| K-B040–K-B050 | IN PROGRESS | Generation/unlock rows use `level - 1` absent/disabled vs `level` present/enabled; formula, recovery, die/use, shared-pool, cost, and recovery-only rows assert their specific value/metadata changes at each actual boundary and enumerate every applicable definition. | — | Four testers have queued disjoint class slices; outcomes must be recorded below and in each tester's own report. |
| K-T001 (parent) | SPLIT — historical roll-up only; not scored | Shared-pool identities, metadata, and consumers. | Historical evidence is retained; independently scored outcomes are K-T001-01–K-T001-11. | See current child results below. |
| K-T002 (parent) | SPLIT — historical roll-up only; not scored | Independent pools, cooldowns, slot tiers, Rune count, and grouping. | Historical evidence is retained; independently scored outcomes are K-T002-01–K-T002-06. | See current child results below. |
| K-T003 (parent) | SPLIT — historical roll-up only; not scored | Recovery behaviors and triggers. | Historical evidence is retained; independently scored outcomes are K-T003-01–K-T003-12. | See current child results below. |
| K-T004 (parent) | SPLIT — historical roll-up only; not scored | Usage gates and cost families. | Historical evidence is retained; independently scored outcomes are K-T004-01–K-T004-09. | See current child results below. |
| K-T005 (parent) | SPLIT — historical roll-up only; not scored | Reapplication state retention and resource reconciliation. | Historical evidence is retained; independently scored outcomes are K-T005-01–K-T005-04. | See current child results below. |
| K-T006 (parent) | SPLIT — historical roll-up only; not scored | Locale persistence and character isolation. | Historical evidence is retained; independently scored outcomes are K-T006-01–K-T006-03. | See current child results below. |
| K-T007 (parent) | SPLIT — historical roll-up only; not scored | Expected/actual discrepancy reporting. | Historical evidence is retained; independently scored outcomes are K-T007-01–K-T007-10. | See current child results below. |
| K-M001 | PASS | Fighter 5 Battle Master / Ranger 5 Gloom Stalker / Rogue 5 Arcane Trickster, Ranger Favored Foe enabled: PB +5 from total level 15; Fighter/Ranger/Rogue resources and multiclass spell slots are correct and pools do not collide. | Favored Foe max 5; Superiority Dice max 4; regular slots 1st 4 and 2nd 2. | Browser Playwright; no page errors. |
| K-M002 | PASS | Sorcerer 10 Clockwork Soul / Warlock 10 Genie: PB +6; Sorcerer and Pact Magic pools remain class-level based, Pact pool is unique, no level-11 Mystic Arcanum, multiclass spell slots unchanged. | Sorcery Points 10; Pact slots 2 at 5th; no Mystic Arcanum; regular slots 4/3/3/3/2. | Browser Playwright; no page errors. |
| K-M003 | PASS | Bard 10 Eloquence / Paladin 10 Watchers, CHA 16: PB +6; Bardic Inspiration max 3 and short-rest recovery; Paladin pools remain Paladin-level based; shared Channel Divinity pool is unique. | Bardic Inspiration max 3, short rest; one Channel Divinity pool; multiclass caster-level 15 slots 4/3/3/3/2/1/1/1. | Browser Playwright; no page errors. |
| K-M004 | PASS | Wizard 10 Order of Scribes / Artificer 10 Battle Smith, INT 16: PB +6; multiclass caster level 15; class resource formulae and Arcane Jolt gate are correct. | Arcane Jolt max 3, once-per-turn; caster-level 15 slots 4/3/3/3/2/1/1/1. | Browser Playwright; no page errors. |
| K-M005 | PASS | Cleric 1 Arcana / Fighter 19 Champion: PB +6; Cleric subclass required at level 1; no Cleric Channel Divinity before Cleric 2; class-specific thresholds and spell slots are correct. | No Cleric Channel Divinity; Fighter Indomitable max 3; regular slots 1st 2. | Browser Playwright; no page errors. |

## K-S001–K-S104 tester checkpoint — 2026-10-19 01:52 JST

All four individual reports now exist. These are tester-reported results; independent audits and required same-report follow-ups are still outstanding.

| Tester | K-S runtime and current adjudication | Current work |
|---|---|---|
| 1 | 26/26 run: 21 PASS, 3 FAIL (Sorcerer consumer-cost gaps), 2 BLOCKED pending RAW. Rage K-T001 follow-up independently confirmed `shared:false` and absent consumer links. | K-B040–K-B050 class slice in progress. |
| 2 | 30/30 run: 7 Bard PASS; 14 Cleric FAIL (Divine Intervention missing); 9 Rogue FAIL (Stroke of Luck missing or mis-keyed). Independent RAW review/storage cleanup remain open. | Report written; RAW cross-check and cleanup ongoing; K-T001 Bard and K-B040–K-B050 queued. |
| 3 | Retest confirms only five Rune pools at Fighter 18/20 instead of six; K-S046 is FAIL and corrected K-S totals are 18 PASS / 4 FAIL (K-S039, K-S042, K-S046, K-S051). | Auditor accepted Tester 3's corrected Psi Warrior/Four Elements oracle; the rules-oracle correction loop is closed. K-B047 remains FAIL for absent metadata. |
| 4 | 26/26 run: Paladin 8 PASS; Warlock 5 PASS/2 FAIL; Wizard 11 FAIL. Auditor says Arcane Recovery/Ward and Genie variable/paid reuse are deferred scope; Genie Bottled Respite's expected free-use maximum and Celestial source oracle need correction. | 170 K-B profiles executed; Tester 4 is following up on the audit in the same report. K-B047 consumer evidence remains open. |

Individual reports: `.agent/CR/step-k-tester-1-report.md`, `.agent/CR/step-k-tester-2-report.md`, `.agent/CR/step-k-tester-3-report.md`, `.agent/CR/step-k-tester-4-report.md`.

## Progress checkpoint — 2026-10-19 02:22 JST

- Tester 1 is still executing its K-B040–K-B050 slice; K-T001 Rage follow-up is recorded as a failure.
- Tester 2 has all 30 K-S runtime cases recorded, but its report has not had a recent update; independent RAW review and storage cleanup remain open. A dated status note was requested.
- Tester 3 is executing its K-B040–K-B050 slice while K-S case-by-case recovery/gate comparisons remain incomplete; 22 outputs were captured and K-S055 is confirmed PASS.
- Tester 4 completed 170 K-B profiles and its K-T001 owned-class addendum. The auditor review is recorded in the same report; Tester 4 has been reassigned follow-up. Crown is outside supported scope, but supported oath consumer-link evidence remains open.
- Audit clarified that Genie Bottled Respite is one free entry per Long Rest (2×PB is duration), Celestial's source oracle is XGE, and Arcane Recovery/Ward plus Genie variable/paid reuse are deferred-scope gaps. The plan and recovery oracle were corrected; no product code changed while other testers still run against the shared baseline.
- Orchestrator K-T002/K-T003 Soulknife checks passed for distinct pool identity, no per-turn recovery, +1 short-rest recovery, and full long-rest recovery; broader cross-pool/trigger coverage remains open.

## Progress checkpoint — 2026-10-19 02:52 JST

- **Tester 1:** K-B040, K-B041, K-B042, and K-B044 runtime matrices are now recorded as passing (14 fixed-max definitions, 36 PB configurations/44 observations, 18 ability snapshots, and 44 gate snapshots). K-B043/K-B046/K-B049/K-B050 still lack required runtime boundaries; K-B047 and K-B048 have confirmed Rage/Sorcery Point consumer and cost gaps. The restarted browser context still needs cleanup verification.
- **Tester 2:** The report remains at its original 30 K-S runtime results; no fresh dated status, Bard K-T001 follow-up, K-B matrix, or cleanup evidence is recorded. A stop-browsing/status/cleanup steer is pending and a follow-up instruction is queued; no result is inferred from the unchanged report.
- **Tester 3:** The full K-S034–K-S055 comparison is now complete at 19 PASS / 3 FAIL (K-S039, K-S042, K-S051). The owned K-B matrix is also complete with findings, and isolated storage cleanup/server shutdown are verified. The report records missing Wildfire paid reuse and Drunkard's Luck cost, plus consumer-list gaps.
- **Tester 4:** The second auditor review accepted the Genie, Celestial, and deferred-scope corrections. K-B047 remains blocked pending a consumer-to-key crosswalk for all 16 supported Channel Divinity options (or an explicit product/data-model limitation); the exact 170-profile/category crosswalk and corrected K-B040 count are also outstanding. Both items have been returned to Tester 4 for a same-report follow-up.
- **Baseline remains unchanged:** No product source edits were made during the concurrent test run. Step K remains IN PROGRESS; do not start Step L.

## Progress checkpoint — 2026-10-19 03:22 JST

- **Tester 1:** The report has no new update since 02:49 JST; its last recorded status remains K-B040/K-B041/K-B042/K-B044 runtime pass, with other K-B boundaries and cleanup still open. Its current turn remains in progress.
- **Tester 2:** The report remains unchanged since 01:07 JST. The 30 K-S runtime outputs are present, but no dated progress note, Bard K-T001 follow-up, K-B matrix, or cleanup verification has been recorded. The current turn remains active; the requested stop-browsing/status/cleanup instruction is still pending.
- **Tester 3:** No new work was needed after its complete K-S and K-B reports; 19 K-S passes / 3 failures and verified cleanup remain the final recorded result.
- **Tester 4:** The second auditor review is recorded in its report and accepts the Genie, Celestial, and deferred-scope corrections. The supported Oath consumer crosswalk or explicit representation limitation and exact 170-profile/category crosswalk remain outstanding; both are returned to Tester 4. The report has no further update since 03:02 JST.
- **Orchestrator:** The isolated K-T002–K-T004 retest recorded distinct slot/resource keys, Tides of Chaos short-/long-rest behavior, and Arcane Jolt's once-per-turn gate versus its long-rest recovery. Temporary storage is empty and the isolated server is stopped.
- **Baseline remains unchanged:** No product source edits were made. Step K remains IN PROGRESS; Step L has not started.

## K-B040–K-B050 class-sliced follow-up

Each tester must inventory all applicable definitions in their owned classes, list fixture counts and expected/actual outputs, and explicitly identify missing/unexpected resources or wrong maximum, recovery, pool key, and cost. Do not close a K-B case until all four class slices have been reconciled.

Plan inventory check: all 50 K-B, 104 K-S, 7 K-T, and 5 K-M IDs are present with no numbering gaps or extras; this validates the plan's ID inventory only, not case execution. The current catalog has 111 resource definitions, partitioned 28 / 25 / 25 / 33 across the four assigned class slices.

| Tester | Owned classes | Definition rows | Status | Follow-up |
|---|---|---:|---|---|
| 1 | Artificer, Barbarian, Ranger, Sorcerer | 28 | K-B EXECUTION COMPLETE; FOLLOW-UP OPEN | All K-B040–K-B050 categories now have dispositions and the isolated profile/server cleanup is verified. K-S007/K-S069 still need oracle reclassification in the tester report; K-T001 consumer coverage remains open. |
| 2 | Bard, Cleric, Rogue | 25 | K-B QUEUED; K-T001 FOLLOW-UP RECORDED | Full K-B040–K-B050 slice is pending; Bardic Inspiration K-T001 evidence is recorded in Tester 2's report and awaits auditor disposition. |
| 3 | Druid, Fighter, Monk | 25 | AUDIT ACCEPTED; RULES-ORACLE LOOP CLOSED | Psi Warrior and Four Elements corrections are accepted. K-B047 remains FAIL for absent consumer/cost metadata; K-B045/K-B049 remain scoped N/A. Corrected category totals: 4 PASS / 5 FAIL / 2 N/A. |
| 4 | Paladin, Warlock, Wizard | 33 | IN FOLLOW-UP | 170 unique profiles executed; K-B047 supported-oath consumer links and fixture-count crosswalk remain open; audit follow-up assigned in the same report. |

**Tester 4 K-B follow-up — BLOCKED for closure, execution complete:** 170/170 unique profiles plus eight Mystic Arcanum boundary rechecks. K-B047 has an empty consumer list and Crown is unavailable in the class selector; Celestial subclass source metadata is TCE instead of XGE. Arcane Recovery, Arcane Ward, Limited Wish, and Sanctuary Vessel threshold outputs were also absent. Full details and N/A evidence are in `.agent/CR/step-k-tester-4-report.md`. No global Step K completion is claimed.

**Tester 4 K-B tagged-rerun update — 2026-10-19:** The corrected tagged browser rerun completed 170/170 profiles and supplies an exact profile/category crosswalk: K-B040 22 definitions/52 profiles, K-B041 3 PB definitions plus the Harness cap/42 profiles, K-B042 28, K-B043 20, K-B044 56, K-B045 N/A, K-B046 42, K-B047 8, K-B048 20, K-B049 N/A, K-B050 17. The supported eight-Oath consumer-to-key crosswalk is recorded in Tester 4's report; all eight generated the single shared `class:paladin:channel-divinity` pool, but `consumers=[]`, so K-B047 remains BLOCKED. Crown is excluded from supported scope. Celestial subclass source remains TCE instead of expected XGE; Bottled Respite remains a fixed-use mismatch. The report is returned for auditor re-review; no product edits or Step K completion are claimed.

**Tester 3 K-B follow-up — AUDIT ACCEPTED; RULES-ORACLE LOOP CLOSED:** The appended correction distinguishes Psi-Powered Leap's first free use from paid additional uses, removes Guarded Mind's unsupported turn-start restriction, corrects Fist of Unbroken Air to Monk 3, separates Fangs of the Fire Snake activation and damage costs, and includes all spell-discipline upcasting costs/limits. Elemental Attunement remains the no-Ki discipline. The auditor accepted the oracle and absent-link evidence. K-B047 remains FAIL; the accepted Rune Knight retest, corrected K-S/K-B counts, and port reconciliation remain unchanged. K-B040/K-B043/K-B046 fail; K-B048's Wildfire Spirit paid-reuse and Drunkard's Luck 2-Ki failures remain valid. See `.agent/CR/step-k-tester-3-report.md`; no global Step K completion is claimed.

**Tester 1 K-B follow-up — PARTIAL / BLOCKED for closure:** All 28 owned definition rows were inventoried. K-B040 fixed maxima, K-B041 PB maxima (36 configurations/44 observations), K-B042 ability maxima (18 valid snapshots), and K-B044 subclass gates passed runtime checks with no checked mismatches. K-B045 was confirmed N/A for the assigned class-resource rows. K-B047 fails on Rage `shared:false`/absent consumers and missing Sorcery Point consumer links; K-B048 has known missing Sorcerer costs and unresolved Fey Reinforcements RAW. K-B043/K-B046/K-B049/K-B050 runtime boundaries remain incomplete or blocked, including the Sorcerous Restoration-on case. Cleanup is pending for the restarted test run; the earlier expired browser context remains unverifiable. Full inventory, expected/actual findings, fixture counts, and cleanup status: `.agent/CR/step-k-tester-1-report.md`. No owned-slice closure or global Step K completion is claimed.

**Tester 1 K-B follow-up — 2026-10-19 10:35 JST; EXECUTED WITH FINDINGS, CLOSURE BLOCKED:** All 28 definitions are inventoried and every K-B040–K-B050 category now has a recorded disposition. Runtime passes: B040 (14 fixed definitions/44 snapshots), B041 (36 configurations/44 observations), B042 (18 valid snapshots), B043 (11 Rage tiers), B044 (44 gate snapshots), B046 (13 scaling fixtures), B049 (three Restoration modifier fixtures plus the B050 L19-off control), and B050 (18 option boundary fixtures plus a Primal Awareness level-20 progression check). B045 is N/A by full-slice scan. B047 **FAILS** on Rage `shared:false`/missing consumers and empty Sorcery Points consumers; B048 **FAILS** on six missing/incomplete Sorcerer cost links and remains **BLOCKED** on Fey Reinforcements' exact paid-reuse representation. Cleanup of the new isolated Edge profile and local test server is pending; the earlier expired integrated-browser context remains unverifiable. Full evidence and expected-vs-actual details are in `.agent/CR/step-k-tester-1-report.md`. No product source was changed; this is not Step K completion.

**Tester 1 K-B cleanup update — 2026-10-19 10:38 JST:** The new headless Edge profile was created with empty localStorage, used only for the unique temporary character, and removed after testing. Temporary server PID 14120 on port 41783 was stopped; the listener is gone. The older integrated-browser context remains unverifiable and was not modified during the isolated retest. B047/B048 findings and the not-complete Step K disposition are unchanged.

### Test-oracle corrections made during execution

- The first K-M001 probe used an incorrect expected resource key (`tce:ranger:favored-foe`); the stored canonical key is `class:ranger:favored-foe`. Corrected the assertion and reran.
- An initial slot-count assertion expected nine slot tiers for caster level 15; the published progression has eight tiers (spell levels 1–8), with maxima 4/3/3/3/2/1/1/1. Corrected the fixture and reran K-M003/K-M004 successfully. These were test expectation defects, not product failures.

## Auditor comments and tester follow-up

Auditors should append findings here with case IDs, rule/source evidence, expected correction, and disposition. Reassign the same report to its test owner for response; preserve the original finding and record the follow-up beneath it.

### Auditor comment — K-T001

- Date: 2026-10-19
- **Finding 1 — Bardic Inspiration and Rage shared-pool metadata: CONFIRMED.**
  - **Evidence/source:** The plan's shared-pool rule explicitly names Bardic Inspiration and Rage and requires one underlying pool when multiple class or subclass features use it (`.agent/CR/CR-class-resources-plan.md`, “共用資源池” and Stage 1). The recovery reference says Bardic Inspiration is consumed by subclass features from the same pool and identifies Rage as the Barbarian pool shared by subclass abilities (`.agent/CR/class-resource-recovery-reference.md`, Bard and Barbarian sections). In `src/cr.js`'s `classResourceData`, the Bardic Inspiration and Rage definitions omit `shared: true`; the K-T001 actual record says their generated metadata is `shared:false`, while the other selected pools report `shared:true`. This is an inaccurate shared-pool annotation under the contract tested by K-T001. It does **not** establish that either pool was duplicated or that its maximum/recovery is mechanically wrong.
  - **Severity/impact:** Low — metadata/catalog correctness and future consumer-audit risk; the reported one-pool-per-selected-resource result is not contradicted.
  - **Precise follow-up requested:** Reassign this same report to the **Artificer/Barbarian/Ranger/Sorcerer tester** for the Rage follow-up and the **Bard/Cleric/Rogue tester** for the Bardic Inspiration follow-up. Have each verify the generated pool identity/count and shared flag against the catalog and the relevant class/subclass consumers, then append the response and disposition below this comment. **Do not overwrite the original K-T001 Expected or Actual record.**
- **Finding 2 — K-T001 population/consumer coverage: CONFIRMED coverage gap.**
  - **Evidence/source:** The plan's K-T001 requires coverage of the named pools **and all pool keys with multiple consumers** (`.agent/CR/CR-class-resources-plan.md`, K-T001). The report records only the seven named pool families. The `src/cr.js` catalog also marks Fighter Psi Warrior Psionic Energy Dice, Paladin Channel Divinity, and Rogue Soulknife Psionic Energy Dice as shared pools, but they are not in the recorded K-T001 population. Further, the actual record documents Starry Form and selected Monk/Sorcerer cost references, not an exhaustive check of every consumer. Thus the seven-pool result must not be represented as completing the broader planned consumer invariant.
  - **Severity/impact:** Low — test-coverage/reporting gap; no separate product-rule defect is established for these omitted pools by this audit.
  - **Precise follow-up requested:** Append a follow-up in this same report that either verifies the omitted catalogued shared pools and their consumer references, or explicitly records them as not covered/deferred; list which consumer links were actually checked. Preserve the existing expected/actual record.
- **Scope disposition for the other five selected pools:** Their one-pool assertions are properly scoped **per owning class/resource pool**: Cleric Channel Divinity is the Cleric pool (not one global pool shared with Paladin, which has its own Channel Divinity pool); Wild Shape is the Druid pool; Ki is the Monk pool; Sorcery Points are the Sorcerer pool and remain distinct from Spell Slots; Superiority Dice are the Battle Master pool. Their reported `shared:true` values and one-pool outcomes are consistent with the plan/reference. The current Actual record supports only the specific consumer observations it names, not an exhaustive consumer audit.
- **Overall verdict:** **Confirmed finding** — incorrect `shared:false` metadata for Bardic Inspiration and Rage, plus the K-T001 coverage gap above. No separate rules finding on the one-pool behavior of the other five selected pools, subject to the stated per-owner scope.
 
#### Tester 2 follow-up — Bardic Inspiration (2026-10-19 10:27 JST)

- **Expected:** The Bard has one `class:bard:bardic-inspiration` pool marked `shared:true`; Bard/subclass consumers that spend Bardic Inspiration use that same pool, without duplicate pools.
- **Actual — generated pool:** A fresh Bard 20 Eloquence, CHA 14 fixture produced exactly one Bardic Inspiration pool (`class:bard:bardic-inspiration`, 2/2, PHB, owner Bard, subclass null). Universal Speech and Infectious Inspiration were separate Eloquence pools, not additional Bardic Inspiration pools.
- **Actual — catalog/shared flag:** The Bardic Inspiration entry in `src/cr.js` omits `shared:true` (line 163); the persisted generated record has `shared:false`. The generator derives the value with `Boolean(definition.shared)` (line 1706), confirming the catalog omission causes the mismatch.
- **Actual — consumers:** The generated pool has `consumers:[]`; the catalog entry has no consumer list, and no explicit `class:bard:bardic-inspiration` references were found in `src`. The recovery reference names Cutting Words, Combat Inspiration, Mantle of Inspiration, Blade Flourish, Psychic Blades, Animating Performance, Unsettling Words, and Tales from Beyond as shared-pool consumers, but the product data does not map them to the pool key.
- **Evidence:** `.agent/CR/CR-class-resources-plan.md` lines 21 and 236; `.agent/CR/class-resource-recovery-reference.md` lines 51–53 and 57; `src/cr.js` lines 163, 1678, 1706, and 1720–1722; persisted `dnd_skills_db` after the confirmed UI apply on `__stepk_tester2_kt001_20261019__`. The original localStorage snapshot was restored exactly (zero keys); the fixture is absent and the local server is stopped.
- **Disposition:** Bard-specific K-T001 is **FAIL / confirmed**. Exactly-one-pool generation passes, but `shared:true` metadata and explicit consumer-to-key links are absent. Retest is **pending a product correction**. Tester 2 made no product-source changes.

#### Tester 3 follow-up — Finding 2 (2026-10-19)

- **Owned-slice inventory:** The Druid/Fighter/Monk slice contains four shared multi-consumer pools: `class:druid:wild-shape`, `subclass:fighter:battle-master:superiority-dice`, `subclass:fighter:psi-warrior:psionic-energy-dice`, and `class:monk:ki`. All were generated once under the expected key with `shared:true`; the five Rune Knight rune keys were separately verified as distinct 1-use pools, not a shared pool.
- **Druid Wild Shape:** The Stars profile lists Starry Form as a consumer; the Wildfire profile lists Wildfire Spirit. Wild Companion's active feature cost links to the exact Wild Shape key and offers a spell-slot alternative. The Moon profile's `consumers` array is empty, so Moon consumer enumeration is missing; individual Moon feature-to-key links were not verified.
- **Battle Master Superiority Dice:** The shared key and pool were generated once, with no per-maneuver duplicate pools, but `consumers` is empty. Individual maneuver-to-key links were not independently verified.
- **Psi Warrior Psionic Energy Dice:** The shared key was generated once; Bulwark of Force and Telekinetic Master's additional-use links point to it. `consumers` is empty; links from other Psionic Energy Dice abilities were not independently verified.
- **Monk Ki:** The shared key was generated once. Verified cost links from Hand of Ultimate Mercy, Breath of the Dragon, Wings of the Dragon, Quickened Healing, and Focused Aim point to `class:monk:ki`. `consumers` is empty; other Ki consumer links were not independently verified. Drunkard's Luck's 2-Ki cost is absent.
- **Disposition:** Finding 2 is only partially addressed for Tester 3's slice. Pool identity/deduplication passed, but consumer enumeration remains incomplete and unverified feature-level links are explicitly listed above; K-B047 remains **FAIL**. No product edits were made. Evidence: `.agent/CR/step-k-tester-3-report.md`, “Shared consumers, pool keys, and costs”; expected scope from `.agent/CR/CR-class-resources-plan.md` and `.agent/CR/class-resource-recovery-reference.md`.

#### Tester 4 follow-up — Finding 2 (2026-10-19)

- **Owned-slice inventory:** The Paladin/Warlock/Wizard `classResourceData` slice has one explicit `shared:true` pool, `class:paladin:channel-divinity`; no other owned definition declares `shared:true` or a consumer list. The broader pool interactions are listed in Tester 4's report.
- **Verified:** Eight assigned Paladin oath profiles each generated exactly one Channel Divinity row with the same key and `shared=true`; Harness Divine Power's cost link points to that key with amount 1. The K-S profiles recorded Paladin `class:spell-slot:1..5`, Warlock `class:warlock:pact-slots`, and Wizard `class:spell-slot:1..9`; Eldritch Master's recovery target points to the Pact pool. Manifest Mind's generic spell-slot cost was observed.
- **Not verified / blocked:** The Channel Divinity `consumers` array was empty; Oath of the Crown could not be selected, so the ninth oath consumer was not exercised. Lay on Hands cure-use links, exact spell-slot consumer-to-key links (including Paladin Divine Smite and generic Manifest Mind cost), and Warlock spell/invocation consumer links were not tested. Arcane Recovery output is missing.
- **Disposition:** Finding 2 is only partially addressed. K-B047 remains **BLOCKED**; do not treat the owned-class consumer audit or Step K as complete. No product edit was made. Full fixture and evidence detail: `.agent/CR/step-k-tester-4-report.md`, “K-T001 Finding 2 addendum”.

#### Tester 4 follow-up — Finding 2 (crosswalk update; 2026-10-19)

- **Paladin Channel Divinity:** The eight supported-Oath consumer-to-key crosswalk is now recorded in Tester 4's dated report addendum. Each expected Channel Divinity feature maps by RAW to `class:paladin:channel-divinity`; runtime confirmed one row with `shared=true` and that key for each of Ancients, Devotion, Vengeance, Oathbreaker, Conquest, Redemption, Glory, and Watchers. Every generated consumer array is still `[]`, so no per-feature link is represented or verified; Harness Divine Power's amount-1 cost link is verified. Crown is outside the supported plan scope and is no longer a blocker.
- **Other owned-slice relationships:** Warlock Eldritch Master's recovery target to `class:warlock:pact-slots` was observed, but individual Pact Magic spell/invocation consumer links are not exhaustively tested. Wizard's `class:spell-slot:1..9` keys were observed; Manifest Mind's generic additional-use cost has no explicit `poolKey`, and individual spell-to-slot links remain untested. Arcane Recovery is deferred, not an automatic Short Rest recovery failure.
- **Disposition:** Finding 2 is partially addressed, not closed. The explicit shared-pool identity and Harness cost are verified; unsupported feature-level consumer links remain a data-model/evidence gap. K-B047 remains **BLOCKED**, and this does not close global K-T001 or Step K. Evidence and the 170-profile crosswalk: `.agent/CR/step-k-tester-4-report.md`, “Tester 4 follow-up — exact crosswalk and Oath consumers”; tagged browser output is retained in the cited temp result.

**Tester 4 auditor re-review — PARTIALLY ACCEPTED (2026-10-19):** The 170-profile crosswalk and RAW corrections were accepted. The category summary's mismatch counts are profile-level, not category-owned assertion counts: K-B041's nine profiles failed only on Genie Bottled Respite; PB/Harness assertions matched. K-B044's ten profiles had three Celestial source and seven Bottled Respite errors, with no gate-specific error reported. Tester 4's report now records this limitation and retains affected statuses without claiming category-specific failures or passes. K-B047 remains BLOCKED; Step K remains open.

#### Tester 1 follow-up — Rage (2026-10-19)

- **Expected:** One shared Barbarian Rage pool keyed `class:barbarian:rage`, `shared:true`, with Rage-using subclass features drawing from that same pool and no duplicate Rage pools. Evidence: plan `.agent/CR/CR-class-resources-plan.md:21,236`; recovery reference `.agent/CR/class-resource-recovery-reference.md:39–47,203–204,240`.
- **Runtime actual:** With a single level-19 Barbarian (all abilities 14, PB +6), each of the eight supported subclass configurations generated exactly one Rage row keyed `class:barbarian:rage`, max/current 6/6, formula `{type:"barbarian-rage"}`, long-rest recovery, PHB source. No other generated resource key contained `rage`. Ancestral Guardian's Consult the Spirits and Wild Magic's Bolstering Magic appeared only as their own separate subclass pools.
- **Metadata/consumer actual:** The catalog Rage definition at `src/cr.js:160` omits `shared:true` and `consumers`; runtime consequently reports `shared:false`, `consumers:[]`, and no Rage cost references. No catalog consumer entry points to `class:barbarian:rage` (the explicit catalog `consumers` entry is for Druid Wild Shape at `src/cr.js:182`). Rage formula and generated metadata behavior are at `src/cr.js:1652–1654,1705–1706,1720–1722`.
- **Disposition/retest:** **FAIL / confirmed for Rage.** Pool identity and uniqueness pass; the expected shared flag fails, and consumer links are not represented. Retest required after those catalog/metadata items are addressed. Tester 1 made no product-code change. Runtime evidence came from `http://127.0.0.1:41783/cr.html` using `__kt001-rage-fu-20261019__`; the isolated origin was restored to its initially empty localStorage afterward.

#### Tester 1 follow-up — Finding 2 (2026-10-19 10:38 JST)

- **Owned-slice inventory:** The full 28-row Artificer/Barbarian/Ranger/Sorcerer slice contains two RAW multi-consumer class pools: `class:barbarian:rage` and `class:sorcerer:sorcery-points`. No other owned class-resource row is a shared pool per the rules reference/full-slice inventory. The additional shared pools named by the auditor—Fighter Psi Warrior `subclass:fighter:psi-warrior:psionic-energy-dice`, Paladin `class:paladin:channel-divinity`, and Rogue Soulknife `subclass:rogue:soulknife:psionic-energy-dice`—are outside Tester 1's assigned classes and were **not tested** here.
- **Rage — key, uniqueness, consumers:** Expected one `class:barbarian:rage` pool with `shared:true`, and Rage-dependent subclass features draw from that pool (plan lines 21/236; recovery reference lines 39–47, 203–204, 240). The eight L19 subclass fixtures each generated exactly one pool under that key, 6/6, long-rest recovery, PHB. Actual metadata is `shared:false`, `consumers:[]`, `costs:[]`; no subclass resource cost points to Rage. The runtime check inspected the Rage row and consumer metadata for all eight subclass configurations, not individual feature activations. Rules-level candidates reviewed include Frenzy, Ancestral Guardian's Rage-dependent defenses, Storm Aura, Zealot's Fanatical Focus/Rage Beyond Death, Beast forms, and Path of the Giant's Rage-dependent features; their individual activation/link behavior remains **untested**. Consult the Spirits and Bolstering Magic are separate pools, not Rage consumers.
- **Sorcery Points — key, uniqueness, consumers:** Expected one `class:sorcerer:sorcery-points` pool, `shared:true`, with all Sorcerer point costs targeting it (recovery reference lines 145–152). The key/max/recovery were checked at Sorcerer L2/L10/L20 and across the six assigned subclass outputs; the generated pool is shared and scales by Sorcerer level, but its `consumers` array is `[]`.
  - **Consumer links actually observed:** Magical Guidance at L5 with its option on points to this key for 1 point; Clockwork Soul Trance of Order and Clockwork Cavalcade point to it for alternative costs of 5 and 7; Aberrant Mind Warping Implosion points to it for an additional use but omits the expected amount 5.
  - **Expected links checked but absent/incomplete in runtime output:** Shadow Hound of Ill Omen (3) and Umbral Form (6); Aberrant Mind Psionic Sorcery and Revelation in Flesh; Clockwork Soul Bastion of Law (1–5); Warping Implosion's amount. The Shadow/Aberrant/Clockwork generated resources and Sorcery Points consumer metadata were inspected at their relevant levels; no cost/consumer links for the first five appeared.
  - **Explicitly untested:** Generic Metamagic and Flexible Casting consumer actions were not individually exercised. Ordinary spell-slot consumer-to-slot-level links were also not exhaustively checked by this follow-up; B048 covered only the listed additional-use slot costs. No other Sorcerer consumer link is claimed as verified.
- **Disposition:** Finding 2 is **PARTIALLY ADDRESSED / OPEN** for Tester 1. Rage and Sorcery Points key identity and pool counts were checked, but Rage's shared flag and consumer links fail, Sorcery Points has missing/incomplete consumer links, and generic Sorcerer/spell-slot consumers plus individual Rage-dependent feature activation remain explicitly untested. The out-of-slice Fighter, Paladin, and Rogue pools remain deferred to their owners. No product edit was made; do not close K-T001 Finding 2 or Step K on this evidence. Detailed B047 cost and output evidence remains in `.agent/CR/step-k-tester-1-report.md`.

#### Tester 2 follow-up — Finding 2 (2026-10-19 10:58 JST)

- **Owned-slice inventory:** The complete Bard/Cleric/Rogue 25-row catalog scan yields three shared or multi-consumer pool families: `class:bard:bardic-inspiration`, `class:cleric:channel-divinity`, and `subclass:rogue:soulknife:psionic-energy-dice`. No other assigned row is a shared/multi-consumer pool.
- **Bardic Inspiration:** Every assigned Bard profile and the K-T001 follow-up generated one `class:bard:bardic-inspiration` pool, with no duplicate subclass pool. Expected spenders are Cutting Words, Combat Inspiration, Mantle of Inspiration, Blade Flourish, Psychic Blades, and Unsettling Words. Actual pool metadata is `shared:false`, `consumers:[]`, `costs:[]`; consumer-to-key links are not represented/unverified. Mote of Potential and Animating Performance do not spend an additional Bardic Inspiration use.
- **Cleric Channel Divinity:** The generated Cleric outputs use one `class:cleric:channel-divinity` pool with `shared:true`; no domain-specific duplicate pools were seen. The expected Turn Undead/domain consumers are enumerated in Tester 2's report. The pool `consumers`/`costs` arrays are empty; only Harness Divine Power has a verified forward cost reference to the correct key (amount 1). Individual domain ability activations and links are not represented in the generated output and remain untested.
- **Soulknife Psionic Energy Dice:** Soulknife outputs use one `subclass:rogue:soulknife:psionic-energy-dice` pool with `shared:true`. Psychic Whispers and Psychic Veil additional-use costs point to that exact key. The pool `consumers` array is empty; Psi-Bolstered Knack, Homing Strikes, Psychic Teleportation, and Rend Mind's die-spend links are absent/unverified. Individual activations were not run.
- **Disposition:** Tester 2's owned-class contribution to Finding 2 is **PARTIALLY ADDRESSED / OPEN**. Pool identity/counts were checked; Bardic Inspiration has incorrect shared metadata and explicit consumer links remain incomplete or unrepresented for all three pools. Direct feature-activation/payment verification is **BLOCKED** because the resource UI exposes no ability-specific activation/payment handlers; the confirmed missing metadata links are not blockers. K-B047 remains **FAIL**; global K-T001 Finding 2 is not closed. No product edits were made. Full crosswalk and fixture evidence: [Tester 2's report](./step-k-tester-2-report.md), “K-T001 follow-up — Finding 2”.

### Orchestrator K-T002–K-T004 isolated retest — 2026-10-19

- **Fixture:** A temporary character `__stepk_orch_kt_20261019__` was tested at the isolated origin `http://127.0.0.1:41784/cr.html`.
- **K-T002:** Artificer 9 / Battle Smith generated independent resource keys `class:spell-slot:1`, `class:spell-slot:2`, `class:spell-slot:3`, and `subclass:artificer:battle-smith:arcane-jolt`; the slot levels were grouped in one display card without merging their pool identities.
- **K-T003:** Wild Magic Sorcerer 1 generated Tides of Chaos 1/1, long-rest recovery, with event-recovery metadata. After using it to 0/1, short rest left it at 0/1 and long rest restored it to 1/1. The wild-surge event itself was not triggered in this UI test.
- **K-T004:** Arcane Jolt displayed 2/2, long-rest recovery, and a once-per-turn usage gate. After one use, the every-turn and short-rest controls left it at 1/2; long rest restored it to 2/2. A scan of `src/cr.js` found no catalog row using the once-per-round gate, although the UI has a label for that gate. Cost-family coverage remains open.
- **Cleanup:** This new origin started without a character. After testing, localStorage and sessionStorage were cleared and verified empty after reload; the server process on port 41784 was stopped and the listener check confirmed the port was closed. No production files or user-origin storage were changed.

## Progress checkpoint — 2026-10-19 03:52 JST

- **Tester 1:** No report change since 02:49 JST. Last recorded K-B status remains PASS for B040/B041/B042/B044, with B043/B046/B049/B050 runtime gaps, B047/B048 findings, and cleanup verification outstanding. Its browser-test turn remains in progress.
- **Tester 2:** No report change since 01:07 JST. The report still contains 30 K-S runtime cases; Bard K-T001, K-B040–K-B050, dated progress, and cleanup evidence are absent. Its current turn remains in progress and follow-up messages are queued; no new results are inferred.
- **Tester 3:** Complete; no new work since the full 19 PASS / 3 FAIL K-S result, K-B findings, and verified cleanup.
- **Tester 4:** No report change since 03:02 JST. The second audit accepted the corrected oracle/scope notes but returned K-B047 consumer-to-key evidence (or an explicit representation limitation) and the exact 170-profile/category crosswalk for same-report follow-up.
- **Orchestrator:** No additional K-T cases were run in this interval. The isolated K-T002–K-T004 results and cleanup remain recorded above.
- **Baseline remains unchanged:** No production source edits were made. Step K remains IN PROGRESS; Step L has not started.

## Progress checkpoint — 2026-10-19 04:22 JST

- **Tester 1:** No report update since 02:49 JST. The last recorded K-B status remains PASS for B040/B041/B042/B044; B043/B046/B049/B050 runtime gaps, B047/B048 findings, and cleanup remain open.
- **Tester 2:** No report update since 01:07 JST. Its 30 K-S outputs remain recorded, but there is still no dated progress note, Bard K-T001 follow-up, K-B matrix, or cleanup verification. Its current turn remains in progress.
- **Tester 3:** The same-report follow-up is now appended. Fighter 17/18/20 retests confirm the missing sixth Rune at 18/20; corrected K-S total is 18 PASS / 4 FAIL. K-B040/K-B043/K-B046 fail, the K-B category tally is corrected to 4 PASS / 5 FAIL / 2 N/A, and the port distinction is reconciled. Shared consumer arrays remain absent; an auditor re-review is underway. K-S039/K-S042/K-S051 remain confirmed failures.
- **Tester 4:** No report update since 03:02 JST. The second audit's two remaining requests—supported Oath consumer-to-key evidence or an explicit representation limitation, and the exact 170-profile/category crosswalk—remain queued for same-report follow-up.
- **Orchestrator:** No additional K-T cases were run this interval. Previously recorded K-T002–K-T004 checks and cleanup remain valid.
- **Baseline remains unchanged:** No production source edits were made. Step K remains IN PROGRESS; Step L has not started.

## Progress checkpoint — 2026-10-19 04:52 JST

- **Tester 1:** No report update since 02:49 JST. K-B040/B041/B042/B044 remain the last recorded runtime passes; B043/B046/B049/B050 runtime gaps, B047/B048 findings, and cleanup remain open.
- **Tester 2:** No report update since 01:07 JST. Its 30 K-S runtime results are present, but no progress note, Bard K-T001 follow-up, K-B matrix, or cleanup verification has been recorded; the current turn remains in progress.
- **Tester 3:** The auditor accepted the Rune retest, corrected 18 PASS / 4 FAIL K-S totals, 4 PASS / 5 FAIL / 2 N/A K-B totals, and port reconciliation. K-B047 still needs actual Psi-Powered Leap/Guarded Mind comparisons and a specific Four Elements discipline-cost fixture; this same-report follow-up has been returned to Tester 3.
- **Tester 4:** No report update since 03:02 JST. K-B047 supported Oath consumer evidence or representation limitation, plus the exact 170-profile/category crosswalk, remain outstanding.
- **Orchestrator:** No new direct K-T checks were run this interval.
- **Baseline remains unchanged:** No production source edits were made. Step K remains IN PROGRESS; Step L has not started.

## Progress checkpoint — 2026-10-19 05:22 JST

- **Tester 1:** No report update since 02:49 JST. K-B040/B041/B042/B044 remain the last recorded runtime passes; remaining category gaps, findings, and cleanup are open.
- **Tester 2:** No report update since 01:07 JST. Its 30 K-S runtime cases remain recorded; progress note, Bard K-T001 follow-up, K-B matrix, and cleanup evidence are still absent.
- **Tester 3:** The report now contains the requested RAW corrections for Psi-Powered Leap, Guarded Mind, and Four Elements discipline gates/costs/upcasting. The D&D auditor is re-reviewing the corrected oracle; K-B047 remains FAIL for absent consumer/cost metadata.
- **Tester 4:** No report update since 03:02 JST. Supported Oath consumer evidence or an explicit representation limitation, and the exact 170-profile/category crosswalk, remain open.
- **Orchestrator:** No new direct K-T cases were run this interval.
- **Baseline remains unchanged:** No production source edits were made. Step K remains IN PROGRESS; Step L has not started.

## Progress checkpoint — 2026-10-19 05:52 JST

- **Tester 1:** No report update since 02:49 JST; K-B040/B041/B042/B044 remain the last recorded runtime passes, with remaining category gaps, findings, and cleanup still open.
- **Tester 2:** No report update since 01:07 JST; 30 K-S results are recorded, but the progress note, Bard K-T001 follow-up, K-B matrix, and cleanup evidence remain absent.
- **Tester 3:** Report updated at 05:44 with the latest RAW corrections. K-S/K-B totals and captured-output dispositions are unchanged; the auditor re-review was pending at this checkpoint, and K-B047 remains FAIL for absent links.
- **Tester 4:** No report update since 03:02 JST; supported Oath consumer evidence or representation limitation and the exact 170-profile/category crosswalk remain open.
- **Orchestrator:** No new direct K-T cases were run this interval.
- **Baseline remains unchanged:** No production source edits were made. Step K remains IN PROGRESS; Step L has not started.

## Auditor follow-up — 2026-10-19 06:13 JST

- **Tester 3:** The auditor accepted the Psi Warrior and Four Elements RAW corrections and absent-link evidence. The rules-oracle correction loop is closed; K-B047 remains FAIL for confirmed absent consumer/cost metadata. The auditor-listed post-baseline implementation/retest items remain pending. No product code or other tester report was changed.
- **Baseline remains unchanged:** Step K remains IN PROGRESS; Step L has not started.

## Progress checkpoint — 2026-10-19 06:42 JST

- **Tester 1:** Report remains unchanged since 02:49. Its assigned K-B work is still in progress; a checkpoint steer was accepted, requesting an evidence-backed status entry and continuation of the existing K-B/Rage tasks.
- **Tester 2:** Report remains unchanged since 01:07. Its active session still has the assigned Bard K-T001 and Bard/Cleric/Rogue K-B follow-ups queued; a new steer was rejected because another steer is pending. No duplicate task was queued.
- **Tester 3:** Report was updated by the auditor at 06:11. The Psi Warrior/Four Elements oracle correction is accepted and closed; K-B047 remains FAIL for absent consumer/cost links.
- **Tester 4:** Report remains unchanged since 03:02. Its same-report crosswalk/Oath consumer auditor follow-up is queued; a new steer was rejected because another steer is pending. No duplicate task was queued.
- **Baseline remains unchanged:** No production source edits were made. Step K remains IN PROGRESS; Step L has not started. Next checkpoint timer is scheduled for 07:12 JST.

## Progress checkpoint — 2026-10-19 07:13 JST

- **Tester 1:** Report remains unchanged since 02:49; the 06:42 checkpoint steer is still processing and its assigned K-B/Rage work remains in progress.
- **Tester 2:** Report remains unchanged since 01:07; the K-S outcomes are recorded, but its existing steer and queued Bard K-T001/K-B tasks remain pending. No duplicate messages were added.
- **Tester 3:** Report remains unchanged since the auditor's 06:11 acceptance. The oracle correction loop is closed; K-B047 remains FAIL for absent consumer/cost metadata.
- **Tester 4:** Report remains unchanged since 03:02; its same-report crosswalk/Oath consumer follow-up remains queued behind an existing steer. No duplicate messages were added.
- **Baseline remains unchanged:** No production source edits were made. Step K remains IN PROGRESS; Step L has not started. Next checkpoint timer is scheduled for 07:43 JST.

## Progress checkpoint — 2026-10-19 07:44 JST

- **Tester 1:** Report remains unchanged since 02:49; the active K-B turn and 06:42 progress steer have not produced a report update.
- **Tester 2:** Report remains unchanged since 01:07; its active turn and existing queued Bard K-T001/K-B follow-ups remain pending.
- **Tester 3:** Report remains unchanged since the auditor's 06:11 acceptance. Its rules-oracle loop remains closed; K-B047 remains FAIL for missing consumer/cost links.
- **Tester 4:** Report remains unchanged since 03:02; the active same-report auditor follow-up and queued crosswalk/Oath consumer work remain pending.
- **Baseline remains unchanged:** No production source edits were made. Step K remains IN PROGRESS; Step L has not started. Next checkpoint timer is scheduled for 08:14 JST.

## Progress checkpoint — 2026-10-19 08:16 JST

- **Tester 1:** Report remains unchanged since 02:49; its 06:42 steer is still processing, and no new K-B/Rage evidence is recorded.
- **Tester 2:** Report remains unchanged since 01:07; the progress steer is still processing, and Bard K-T001 plus K-B follow-ups remain queued.
- **Tester 3:** Report remains unchanged since the auditor's 06:11 acceptance. The oracle correction loop is closed; K-B047 remains FAIL for missing consumer/cost links.
- **Tester 4:** Report remains unchanged since 03:02; its auditor-follow-up steer is still processing, and the crosswalk/Oath consumer follow-up remains queued.
- **Baseline remains unchanged:** No production source edits were made. Step K remains IN PROGRESS; Step L has not started. Next checkpoint timer is scheduled for 08:46 JST.

## Progress checkpoint — 2026-10-19 08:47 JST

- **Tester 1:** Report remains unchanged since 02:49; its active K-B turn and existing progress steer remain in progress.
- **Tester 2:** Report remains unchanged since 01:07; its existing steer is still processing, with Bard K-T001 and class-group K-B follow-ups queued.
- **Tester 3:** Report remains unchanged since the auditor's 06:11 acceptance. The oracle correction loop remains closed; K-B047 remains FAIL for absent consumer/cost links.
- **Tester 4:** Report remains unchanged since 03:02; its existing steer is still processing, with the same-report auditor follow-up queued.
- **Coordination:** No duplicate steering or overlapping test assignments were sent while prior steer messages remain active.
- **Baseline remains unchanged:** No production source edits were made. Step K remains IN PROGRESS; Step L has not started. Next checkpoint timer is scheduled for 09:17 JST.

## Progress checkpoint — 2026-10-19 09:18 JST

- **Tester 1:** Report remains unchanged since 02:49; the K-B turn is still in progress and the previously sent steer remains processing.
- **Tester 2:** Report remains unchanged since 01:07; the 30 K-S outcomes are recorded, while the existing steer and queued Bard K-T001/K-B follow-ups remain pending.
- **Tester 3:** Report remains unchanged since the auditor's 06:11 acceptance. The oracle correction loop remains closed; K-B047 remains FAIL for absent consumer/cost links.
- **Tester 4:** Report remains unchanged since 03:02; the active follow-up and queued same-report auditor work remain pending.
- **Coordination:** Existing tester sessions remain active; no replacement or duplicate assignment was started.
- **Baseline remains unchanged:** No production source edits were made. Step K remains IN PROGRESS; Step L has not started. Next checkpoint timer is scheduled for 09:48 JST.

## Progress checkpoint — 2026-10-19 09:51 JST

- **Tester 1:** Report remains unchanged since 02:49; its K-B turn is still reported in progress, with the existing steer processing.
- **Tester 2:** Report remains unchanged since 01:07; its K-S outcomes remain recorded, while the existing steer and Bard K-T001/K-B queue remain pending.
- **Tester 3:** Report remains unchanged since the auditor's 06:11 acceptance. The oracle correction loop is closed; K-B047 remains FAIL for absent consumer/cost links.
- **Tester 4:** Report remains unchanged since 03:02; its auditor-follow-up turn is still in progress and the same-report follow-up remains queued.
- **Orchestration:** No new test evidence arrived in this interval; avoided duplicating the active tester work.
- **Baseline remains unchanged:** No production source edits were made. Step K remains IN PROGRESS; Step L has not started. Next checkpoint timer is scheduled for 10:21 JST.

## Operator update — 2026-10-19 10:13 JST

### Schedule and tester state

- **30-minute schedule stopped:** stopped timer shells 214 and 215. A follow-up process listing shows no active `Start-Sleep` checkpoint timer.
- **Tester 1 — still in progress:** latest report write 02:49 JST; K-S runtime work is recorded, K-B040–K-B050 remains partial. Retain its session and any attributable test server.
- **Tester 2 — still in progress:** latest report write 01:07 JST; all 30 K-S runtime cases are recorded, but K-T001 Bard follow-up, K-B040–K-B050, RAW checks, and cleanup are outstanding. Retain its session and test server.
- **Tester 3 — complete and quiescent:** latest report write 06:11 JST; auditor accepted the rules-oracle correction and closed the follow-up. No listener remains on its known ports 48937, 49383, 49321, or 49401. No session deletion was attempted because the four tester chats share one host session and deleting it could remove the three active chats.
- **Tester 4 — still in progress:** latest report write 03:02 JST; its same-report auditor follow-up remains outstanding. Retain its session.
- The local test listeners still present are 8765, 8769, 8796, and 41783. Ports 8796 and 41783 are associated with Tester 2 and Tester 1 respectively; the 8765/8769 ownership is not established here. They were left running because active tester work may depend on them. No production source was changed.

### Remaining untested or failed cases

#### K-S001–K-S104

All 104 assigned runtime IDs have been executed. Current aggregate: **70 PASS, 32 FAIL, 2 BLOCKED, 0 NOT RUN**. The remaining dispositions are:

| Cases | Result | Outstanding discrepancy |
|---|---|---|
| K-S007 | BLOCKED | Consult the Spirits recovery oracle remains unresolved. |
| K-S020–K-S033 | FAIL (14) | Cleric Divine Intervention output is absent in every generated set. |
| K-S039 | FAIL | Wildfire Spirit's paid spell-slot reuse is missing. |
| K-S042 | FAIL | Eldritch Knight's fourth-level Spell Slot is missing. |
| K-S046 | FAIL | Rune Knight generates five Rune pools at Fighter 18/20; RAW requires six at Fighter 18+. |
| K-S051 | FAIL | Drunkard's Luck's 2-Ki cost is missing. |
| K-S069 | BLOCKED | Fey Reinforcements paid-casting cost/minimum-level representation remains unresolved. |
| K-S073–K-S081 | FAIL (9) | Rogue Stroke of Luck is missing in eight archetypes and incorrectly attributed to Thief in the ninth. |
| K-S084–K-S086 | FAIL (3) | Sorcery Points consumer/cost links are absent or incomplete, including Hound of Ill Omen/Umbral Form, Sorcerer feature expenditures, the missing 5-point Warping Implosion amount, and Bastion of Law's 1–5 point cost. |
| K-S091 | FAIL | Celestial feature source is XGE, but selected-subclass source metadata is TCE. |
| K-S093 | FAIL | Bottled Respite free-entry maximum is PB-scaled instead of one free entry per Long Rest. |

See [Tester 1](./step-k-tester-1-report.md), [Tester 2](./step-k-tester-2-report.md), [Tester 3](./step-k-tester-3-report.md), and [Tester 4](./step-k-tester-4-report.md) for evidence and corrected scope.

#### K-B040–K-B050

The global matrix is incomplete; Tester 2 has not started its assigned class slice. Existing per-tester dispositions and remaining work:

| Tester / slice | Failed or blocked | Still untested / required follow-up |
|---|---|---|
| Tester 1 — Artificer, Barbarian, Ranger, Sorcerer | K-B047 FAIL (Rage and Sorcery Points have missing `shared`/consumer/cost metadata); K-B048 FAIL for known Sorcerer costs, with Fey Reinforcements expectation blocked. | K-B043 Rage tier boundary matrix, K-B046 13 dedicated count/die/capacity configurations, K-B049 Sorcerous Restoration-on fixture, and most K-B050 option off/on/unlock pairs are blocked or not run. K-B040/041/042/044 pass; K-B045 is N/A. |
| Tester 2 — Bard, Cleric, Rogue | No K-B category results recorded. | All K-B040–K-B050 and Bard K-T001 follow-up remain untested; storage cleanup and independent RAW review remain open. |
| Tester 3 — Druid, Fighter, Monk | K-B040, K-B043, K-B046 FAIL for Rune Knight's missing sixth pool at Fighter 18+; K-B047 FAIL for missing shared-pool consumers; K-B048 FAIL for Wildfire Spirit paid spell-slot reuse and Drunkard's Luck's 2-Ki cost. | K-B041/042/044/050 pass; K-B045/049 are N/A. Consumer links still missing for Wild Shape/Wild Companion, Battle Master maneuvers, Psi Warrior die spends, and Monk Ki consumers. |
| Tester 4 — Paladin, Warlock, Wizard | K-B040 FAIL for Bottled Respite PB-vs-fixed maximum and Celestial source metadata; K-B044 and K-B046 FAIL for the same Celestial selected-subclass metadata; K-B047 BLOCKED because Channel Divinity consumer links are empty. | The supported Oath consumer-to-key crosswalk and exact 170-profile/category-ID crosswalk are outstanding; the corrected K-B040 unique profile count is unrecoverable from the saved aggregate. K-B041/042/043/048/050 pass; K-B045/049 are N/A. |

**Tester 2 K-B follow-up — 2026-10-19; EXECUTED WITH FINDINGS, not Step K completion:** The Bard/Cleric/Rogue slice covers 25 catalog rows and 115 confirmed UI apply fixtures (116 temporary IDs including one rejected level-0 smoke attempt). Thirty-two level-boundary comparisons were run. K-B043, K-B045, and K-B050 pass; K-B049 is checked N/A; K-B040–K-B042, K-B044, and K-B046–K-B048 fail with findings. Main deltas: RAW TCE makes Phantom Wails uses PB-based (the supplied reference's half-level use count is wrong); Creation Animating Performance and other limited-use outputs are missing; Stroke of Luck is Thief-keyed instead of class-wide; Bardic Inspiration has `shared:false`; Channel Divinity and Soulknife consumer metadata are incomplete; several alternate costs are absent/incomplete. Paid-action execution is **BLOCKED** because the resource UI exposes generic pool controls but no class-feature activation/payment handlers. Details, all definition keys, fixture IDs, and expected/actual tables are in [Tester 2's report](./step-k-tester-2-report.md). The saved localStorage snapshot was restored to zero keys and port 8796 has no listener. Historical K-S/K-T rows and auditor comments are preserved; the newly identified Wails, Creation, and BI-consumer oracle corrections require audit. Step K remains **IN PROGRESS**.

**Tester 2 oracle-status clarification — 2026-10-19 11:01 JST:** The Wails and Creation rules-text questions are resolved against the cited TCE text; no owned-slice RAW question remains unresolved. Reclassification of the historical K-S018/K-S079 rows is **BLOCKED pending auditor disposition**; their original runtime rows remain unchanged. No further source browsing or K-S rerun is planned. Browser localStorage cleanup remains verified (restored snapshot `{}`; zero keys/temporary characters), and port 8796 has no listener. The queued Bard K-T001 and K-B040–K-B050 work is recorded above and in Tester 2's report.

#### Historical K-T001–K-T007 parent dispositions (superseded; parent IDs are not scored)

| Case | Current result | Remaining work |
|---|---|---|
| K-T001 | Historical FAIL / audit confirmed | Correct `shared` metadata for Bardic Inspiration and Rage; complete consumer-to-key evidence for all multi-consumer pools, including Paladin Channel Divinity, Psi Warrior, Soulknife, Sorcery Points, Wild Shape, and Monk Ki. |
| K-T002 | Historical IN PROGRESS; six-Rune oracle superseded | The earlier six-Rune expectation was incorrect. The current corrected five-Rune assertion is K-T002-04 PASS; other independent-pool, slot-tier, cooldown, and grouping assertions are split into child cases. |
| K-T003 | IN PROGRESS | Recovery checks are partial. Direct event-trigger confirmation, remaining turn/round/initiative/event recovery distinctions, and catalog-wide N/A confirmation remain open. |
| K-T004 | IN PROGRESS | Gate/cooldown separation is partially checked; detailed cost-family assertions remain open. |
| K-T005 | PASS | — |
| K-T006 | PASS | — |
| K-T007 | IN PROGRESS | Final expected-vs-actual discrepancy reporting and auditor round-trips depend on the outstanding tester reports and T4 crosswalk. |

K-M001–K-M005 remain PASS. The K-T child outcomes are recorded separately above and in the central control table. Step K remains **IN PROGRESS**; Step L has not started.

## Autopilot and graceful-close check — 2026-10-19 10:21 JST

### Current execution state

- **Tester 1:** Chat remains `inProgress`. The latest assistant update says K-B043's 11 Rage-tier snapshots and K-B046's 13 scaling fixtures are complete, and K-B050 is at 17/18 fixtures; K-B048 cost audit and final option control remain. Its report still needs the results reconciled into the category table and cleanup verified.
- **Tester 2:** Chat remains `inProgress`. The 30 K-S runtime cases and supplementary Bardic Inspiration identity/formula/recovery checks are recorded; it is restoring browser storage before queued K-B work. Its Rogue result includes K-S074's missing 4th-level slot and Spell Thief in addition to the Stroke of Luck attribution defect.
- **Tester 3:** Chat is `complete`; its auditor accepted the last rules correction. Its known test ports are stopped. It is already quiescent.
- **Tester 4:** Chat remains `inProgress`, but is waiting on an idle auditor rather than an access prompt. The auditor is idle and has no re-review in progress. Tester 4 has been steered to continue the existing Oath/profile crosswalk follow-up instead of waiting.
- T1 and T2 have queued graceful-close instructions: finish assigned work, record remaining true blockers, clean and verify temporary browser data, stop test servers, then stop. No additional 30-minute timer is running.

### Blocker root-cause assessment

No tester chat is awaiting session permissions, a file-access grant, or an operator approval. T1, T2, and T4 report `inProgress`; T3 is `complete`. The earlier blocked dispositions arose from four different causes:

1. **Rules-source retrieval, not session access:** T1 could not get the official XGtE page to show its feature text. A public rules transcription resolves both entries. The XGtE Ancestral Guardian feature allows Consult the Spirits again after a short or long rest; under the project's normalization this is **short rest**, not long-rest-only. The reference entry was corrected in [class-resource-recovery-reference.md](./class-resource-recovery-reference.md). The captured actual is long-rest-only, so K-S007 should be re-compared and may become a recovery mismatch rather than remain BLOCKED. Fey Reinforcements grants a free Summon Fey casting once per Long Rest; the feature adds no special minimum spell-slot level for normal spellcasting. See the [Ancestral Guardian source transcription](https://github.com/5etools-mirror-3/5etools-src/blob/90d343cde64cf8dce1083ea0525a6b0b9e545f2e/data/class/class-barbarian.json) and [Fey Wanderer source transcription](https://dnd5e.wikidot.com/ranger:fey-wanderer). T1 has been asked to resolve both in its own report before closing.
2. **Fixtures not yet run:** T1's remaining K-B categories, T2's class-slice K-B matrix, and the missing T4 crosswalk are unfinished execution/evidence work. Browser interruptions and long-running sequential turns caused delay; there is no permission barrier.
3. **Product output/contract gaps:** Empty consumer arrays, wrong recovery/source metadata, wrong maxima, and missing features are test findings, not access failures. The T4 supported-Oath consumer and 170-profile/category crosswalk need evidence or an explicit representation limitation.
4. **Agent coordination delay:** T4's active turn was checking for an auditor response, but its auditor was idle and no audit was running. This was a stale workflow dependency; it has been explicitly steered to proceed. Other queued tasks were serially waiting behind long active turns, not for human input.

### Remaining status after this check

The K-S aggregate remains **70 PASS / 32 FAIL / 2 BLOCKED** pending T1's reclassification of K-S007 and K-S069. The case failures and remaining K-B/K-T work are listed above in this report. T1 and T2 have recent in-progress updates; T4 still owes its crosswalk; T3 is complete. The completed tester was left quiescent rather than deleting the shared host session, which also contains the active tester chats.

## Status reconciliation and iteration plan

The 10:21 JST session-status bullets above are a historical checkpoint, not a live status snapshot. They predate Tester 1's 10:35–10:38 K-B completion/cleanup updates and Tester 2's 10:27 Bard follow-up. A tester report saying its assigned runtime cases are complete does not mean the tester's chat has ended: a chat can remain `inProgress` while waiting for an auditor response, a same-report correction, cleanup, or an explicit final stop. Conversely, an old `inProgress` line must not be treated as proof that the tester is still doing runtime work. The current workspace session listing exposes the shared host session, not reliable per-tester child-chat states, so current individual runtime state is not asserted here.

### Latest report evidence and remaining owner work

| Tester | Latest substantiated disposition | Remaining work before graceful close |
|---|---|---|
| 1 | K-B040–K-B050 all have recorded outcomes; isolated Edge profile and server cleanup are verified at 10:38 JST. | Update its own K-S007/K-S069 rows using the independent rules sources already recorded above; answer the K-T001 consumer-coverage finding in the same report. The expired earlier integrated-browser context remains unverifiable. No broad K-B rerun is indicated. |
| 2 | The 30 K-S cases and Bardic Inspiration K-T001 follow-up are recorded; the report says the original browser storage was restored and the server stopped. | The assigned Bard/Cleric/Rogue K-B040–K-B050 slice is still absent from the report and must be executed or explicitly dispositioned; an auditor then reviews the same report. Do not rerun its completed K-S/Bard checks absent a specific audit defect. |
| 3 | Complete and quiescent; auditor accepted its rules-oracle corrections. | None. |
| 4 | The 170-profile run and cleanup are recorded; the auditor's latest same-report review returned two gaps. | Provide the supported-Oath consumer-to-key evidence or state the representation limit, and provide the exact 170-profile/category crosswalk. If the saved aggregate cannot produce it, follow the auditor's request to rerun the 170-profile matrix with stable per-profile IDs and category tags. Obtain the auditor's acceptance in the same report. |

### Iteration and shutdown sequence

1. Keep the scope to Step K baseline testing; do not change product code or start Step L. Reclassify K-S007/K-S069 from their existing captured outputs and independently sourced rules rather than repeating the full K-S matrix.
2. Finish only the open owned slices: Tester 2's K-B matrix, Tester 1's K-T001 oracle/consumer response, and Tester 4's two auditor-returned evidence items. Each tester records exact case IDs, evidence, and any genuinely untestable item in its own report.
3. Have the auditor review those same reports and return only concrete corrections to the original owner. Do not keep a tester running merely because some other tester's audit or global case remains open.
4. After an owner's last assigned test/audit correction, verify browser-storage cleanup and server shutdown, record any unverifiable cleanup explicitly, and stop that tester. Do not delete the shared host session while any child chat may still be active.
5. Reconcile the final K-S/K-B/K-T/K-M totals and dispositions in this report. Step K closes only after every planned case has a PASS/FAIL/N/A or justified BLOCKED/NOT RUN disposition and the required same-report audits are resolved; otherwise report the exact remaining cases. Step L remains unstarted.

## Consolidated case-status snapshot — latest persisted tester reports

The snapshot below reflects persisted tester reports before the 2026-10-19 13:22 auditor disposition. Current K-S018/K-S079 statuses and the corrected rules reference are recorded in the refreshed disposition section below; the original tester rows remain historical evidence.

This section supersedes the older per-tester queued/unfinished summaries above where they conflict. It uses the latest persisted evidence available in the tester reports (Tester 2's K-B report and this report were updated at 10:57 JST; Tester 4's tagged rerun/auditor response was updated at 10:50 JST), with the operator dispositions recorded below applied afterward. PASS/FAIL below describes the current case outcome; remaining audit, oracle-reclassification, or unrun-subassertion work is called out separately. Case names and rule definitions are indexed by ID in [CR-class-resources-plan.md](./CR-class-resources-plan.md).

### K-S001–K-S104 — level-20 subclass cases

Latest adjudicated outcomes: **69 PASS / 32 FAIL / 2 BLOCKED / 1 pending reclassification**. This isolates K-S018, whose historical PASS is under auditor review after a corrected TCE oracle; do not treat the previous 70-PASS aggregate as settled.

| Latest status | Case IDs |
|---|---|
| PASS | K-S001–K-S006, K-S008–K-S017, K-S019, K-S034–K-S038, K-S040–K-S041, K-S043–K-S045, K-S047–K-S050, K-S052–K-S068, K-S070–K-S071, K-S081–K-S083, K-S087–K-S090, K-S092, K-S094–K-S104 |
| FAIL | K-S020–K-S033, K-S039, K-S042, K-S046, K-S051, K-S072–K-S080, K-S084–K-S086, K-S091, K-S093 |
| **BLOCKED — incomplete classification** | **K-S007, K-S069** |
| **PENDING AUDITOR RECLASSIFICATION** | **K-S018** (historical PASS; corrected oracle identifies an omitted Animating Performance output) |

K-S007/K-S069 runtime outputs were captured, but Tester 1's rows still say BLOCKED. The independent-source research later in this report resolves the cited RAW uncertainty; Tester 1 must update its own report and the final K-S classification. K-S007's captured Long-Rest-only recovery conflicts with the normalized short-or-long-rest expectation. K-S069's source confirms one free casting per Long Rest and no feature-specific minimum spell-slot level; its generic paid-reuse representation still needs explicit disposition. Tester 2's 11:01 JST update also corrects the Wails and Creation oracles: K-S079 remains a reported FAIL but awaits auditor reclassification, while K-S018's historical PASS is pending reclassification for the missing Animating Performance output. Do not close these report corrections until the auditor disposition is recorded.

### K-B001–K-B050 — boundary and class-slice cases

**Operator adjudication — 2026-10-19 12:47 JST:** K-B040 was too broad to score atomically and is replaced for current scoring by four slice IDs: K-B040-01 (Tester 1), K-B040-02 (Tester 2), K-B040-03 (Tester 3), and K-B040-04 (Tester 4). The historical parent-level return count is not attributed to individual child IDs. Rune Knight has a maximum of five Runes; the prior expectation of a sixth at Fighter 18 was incorrect. K-B043 is therefore PASS, and the Rune-count portion of K-B040-03 is PASS. K-B047 and K-B048 are operator-dispositioned FAIL based on the preserved metadata/cost findings; no additional automatic tester/auditor loop is requested.

K-B001–K-B039 are **PASS** (K-B001–K-B013 UI gates, K-B014–K-B023 options, K-B024 ability input, K-B025 PB thresholds, and K-B026–K-B039 formula branches). K-B040–K-B050 have reports for all four class slices; current outcomes are:

| Case | Latest outcome | Finding / incomplete work |
|---|---|---|
| K-B040-01 | **PASS** | Tester 1's Artificer/Barbarian/Ranger/Sorcerer fixed-value checks passed. |
| K-B040-02 | **FAIL** | Tester 2's Bard/Cleric/Rogue slice has missing fixed-use outputs. |
| K-B040-03 | **PASS** | Tester 3's Rune Knight output of five Runes at Fighter 18/20 matches the corrected maximum of five; the alleged sixth-Rune defect is invalid. |
| K-B040-04 | **FAIL** | Tester 4's Genie Bottled Respite use maximum is wrong: the expected free-use maximum is one per Long Rest, not PB. Celestial source metadata remains tracked as a separate source finding. |
| K-B041 | **FAIL** | Phantom Wails uses a half-Rogue-level count instead of PB. Tester 4's attribution review found no PB/Harness-specific error in its tagged slice; this separate class-slice failure remains. |
| K-B042 | **FAIL** | Order's Embodiment of the Law and Inquisitive Unerring Eye are missing at their thresholds. Other tested ability formulas matched. |
| K-B043 | **PASS — operator oracle adjudication** | Five Runes is the maximum; Fighter 18 does not add a sixth. The prior FAIL came from an incorrect expected value. |
| K-B044 | **FAIL** | Bard/Cleric/Rogue required limited-use outputs are missing; Tester 4 also retains profile-level Celestial metadata impacts, although its saved aggregate cannot attribute every error to the gate assertion itself. |
| K-B045 | **PASS** | Purpose: test whether any resource's `recoveryFromLevel` metadata changes its recovery mode at the specified class level, without creating a duplicate pool. The applicable Bardic Inspiration row changes from Long Rest to Short Rest at Bard 5; the level-20 initiative-recovery boundary also matched. Tester 1, 3, and 4 slices had no applicable `recoveryFromLevel` rows, so those slice results are N/A; the global case passes on the Bard evidence. |
| K-B046 | **FAIL** | Phantom Wails count and Rune Knight 18+ count are wrong. Tester 4's tagged profile errors are Celestial source metadata, not a die/count scaling mismatch. |
| K-B047 | **FAIL — operator disposition** | Shared-pool identity is often correct, but `shared`/consumer metadata is missing across Bardic Inspiration, Rage, Channel Divinity, Ki, Psi Warrior, Soulknife, and other consumers. Tester 4's supported-Oath crosswalk confirms actual empty consumer arrays; feature-level links are not represented. |
| K-B048 | **FAIL — operator disposition; paid-action subassertion NOT RUN** | Missing/incomplete costs include Creation, Rogue/Soulknife, Monk, and Sorcerer links. Cost metadata was inspected, but paid-action expenditure could not be executed in the resource UI. Fey Reinforcements' generic additional-use representation is separately noted under K-S069. |
| K-B049 | **N/A — full-scope scan** | Purpose: find resource definitions that exist only to represent recovery (`recoveryOnly`/`recoveryTarget`) and verify their presence conditions and target resource. Full scans of the assigned catalog slices found zero applicable definitions and therefore zero fixtures to execute. Sorcerous Restoration and initiative/short-rest recovery are modifiers on ordinary resource pools, not recovery-only definitions; separate feature/recovery checks do not satisfy this case. N/A means no applicable catalog data in this scope—not “not run,” a product failure, or a claim that D&D has no recovery-only rules or features. |
| K-B050 | **PASS** | Tested TCE option defaults, gates, and generated pools matched across the class slices. |

For N/A interpretation, distinguish a slice-level N/A from a global case result: K-B045 is globally PASS because Bardic Inspiration supplies an applicable, passing recovery-switch boundary; the other owner slices are N/A because they contain no `recoveryFromLevel` row. K-B049 is globally N/A because the full scoped catalog scan found no `recoveryOnly`/`recoveryTarget` definition to test.

The K-B runtime reports are present, but the K-B040–K-B050 cross-slice results have not all received an independent audit in the testers' own reports. Tester 2's report is ready for audit; Tester 4's latest audit is only partially accepted. K-B047/K-B048 are classified FAIL by operator disposition; K-B048's paid-action behavior remains NOT RUN and outside the approved UI scope.

### K-T001–K-T007 — current atomic child roll-up (parent IDs are not scored)

| Parent group | Child outcomes |
|---|---|
| K-T001 | **1 PASS / 10 FAIL** |
| K-T002 | **6 PASS** |
| K-T003 | **8 PASS / 2 FAIL / 2 N/A** |
| K-T004 | **6 PASS / 2 FAIL / 1 N/A** |
| K-T005 | **4 PASS** |
| K-T006 | **3 PASS** |
| K-T007 | **9 PASS** |

### K-M001–K-M005 — multiclass integration cases

**PASS:** K-M001, K-M002, K-M003, K-M004, K-M005.

### Concurrent K-T execution — 2026-10-19 13:57–14:19 JST

The 19 previously IN PROGRESS cases were assigned across **four concurrent tester slots** (Tester 1: 5 cases; Tester 2: 4; Testers 3 and 4: 5 each). Concurrency did not exceed four; all runs are complete and no tester remains active. The first run was read-only except for temporary browser fixtures, which were cleaned up. A second review was used for K-T007-06–10; the operator later dropped K-T007-08 as outside Step A–J CR feature scope, so 18 of the original 19 remain scored cases. After the Auditor clarified Power Surge's Short Rest rule, Tester 2 also rechecked K-T003-03 and changed it from PASS to FAIL. The agreed retry rule is to record **UNDETERMINED** after two consecutive attempts cannot establish a confident PASS/FAIL.

| Case(s) | Tester | Attempts | Outcome | Result summary |
|---|---|---:|---|---|
| K-T001-11 | Tester 1 | 2 | **PASS** | Catalog/link scan: 111 resource definitions; 19 pool-key references resolved to defined keys. |
| K-T002-06 | Tester 1 | 2 | **PASS** | All 111 catalog definitions have distinct derived keys and recognized cooldowns. |
| K-T003-11 | Tester 1 | 2 | **N/A** | No `recoveryOnly` catalog rows. |
| K-T003-12 | Tester 1 | 2 | **N/A** | No `longRestRecoveryWhenEmpty` catalog rows. |
| K-T004-07 | Tester 1 | 2 | **PASS** | Cleric and Paladin Harness Divine Power each reference the appropriate Channel Divinity pool for one use. |
| K-T003-10 | Tester 2 | 1 | **FAIL** | Three trigger fixtures; the UI has no event/initiative execution controls, so required event assertions cannot be performed. |
| K-T003-03 follow-up | Tester 2 | 1 additional (2 total fixtures) | **FAIL** | Auditor oracle requires Short and Long Rest to reset Power Surge to exactly one; prior Long Rest fixture passed, but temporary Wizard 2 War Magic remained 2/2 after Short Rest. |
| K-T004-08 | Tester 2 | 1 | **PASS** | Wizard 14 Overchannel exposes its additional-use damage cost separately from its 1/LR pool. Damage payment was not executed. |
| K-T004-09 | Tester 2 | 1 | **PASS** | Wizard 14 Major Transformation exposes Transmuter's Stone consumption separately. Item consumption was not executed. |
| K-T005-04 | Tester 2 | 1 | **PASS** | Reapplying Wizard 1 as Wizard 2 War Magic created Power Surge at 1/2 with `initialValue: 1`. |
| K-T007-01–05 | Tester 3 | 1 each | **PASS** | Reports demonstrate case ID/expected/actual and separate missing, unexpected, maximum, and recovery classifications. |
| K-T007-06 | Tester 4 | 2 | **PASS** | Stroke of Luck expected class key vs actual Thief-subclass key is identified as a wrong key/owner. |
| K-T007-07 | Tester 4 | 2 | **PASS** | Source mismatch is identified separately: feature XGE vs selected-subclass metadata TCE. |
| K-T007-08 | Tester 4 | 2 | **DROPPED** | Operator disposition: report-classification meta-testing is not a CR feature enhanced in Step A–J; the prior UNDETERMINED review is excluded from current case scope and totals. |
| K-T007-09 | Tester 4 | 2 | **PASS** | Missing expected cost is reported distinctly (Soulknife expected cost vs `costs: []`). |
| K-T007-10 | Tester 4 | 2 | **PASS** | Follow-up, auditor feedback, re-review, and disposition are tracked in the report. |

**Rules Auditor oracle for K-T003-10:** Tides of Chaos normally recovers on Long Rest; before that, a DM may trigger a Wild Magic Surge after a Sorcerer spell of 1st level or higher, which then restores the feature (PHB 2014, p. 103). Benign Transposition recovers on Long Rest or automatically after casting a Conjuration spell of 1st level or higher (PHB 2014, p. 116). Power Surge resets to exactly one on a Short or Long Rest; it is gained when *Dispel Magic* or *Counterspell* successfully ends a spell, and also from Arcane Deflection when the pool is empty (XGE, p. 60). The tested UI exposes no event/initiative action controls; K-T003-10 is therefore FAIL for the required runtime trigger behavior, not a dispute about the rules oracle.

### Operator disposition

- **K-T007-08 — DROPPED:** The operator determined that report-classification meta-testing is outside the Step A–J CR feature scope. The two earlier reviews remain historical evidence only and are excluded from current case totals.

### Incomplete closure checklist

- **K-S007 and K-S069:** tester-owned report classifications have not been updated after oracle research.
- **K-B047:** consumer-link representation gap remains BLOCKED; K-B048's paid-action subassertion is NOT RUN.
- **K-T FAIL remediation:** K-T001-01–10, K-T003-03/-10, and K-T004-05/-06 remain FAIL outcomes. K-T007-08 is dropped and excluded from scope. No current K-T child remains IN PROGRESS or UNDETERMINED.
- **K-B cross-slice audit:** Tester 2's report still needs independent audit; Tester 4's re-review was partial. A FAIL is a completed test outcome, not a successful fix.
- The available session listing reports only the shared host session, not each child tester's live state. Do not infer that a retained browser tab means a test is still running or that a report marked complete means its chat has stopped.

Step K remains **IN PROGRESS**. No production fix or Step L work is included in these baseline results.

## Tester and case-status refresh — 2026-10-19 11:37 JST

### Tester/report state

| Tester | Latest report | Refreshed disposition |
|---|---|---|
| 1 | 10:38 JST | K-B040–K-B050 execution has outcomes and the isolated Edge profile/server cleanup is verified. No newer tester report has resolved K-S007/K-S069 or closed the Rage/Sorcery Points K-T001 consumer follow-up. Its dedicated test port 41783 is no longer listening. |
| 2 | 11:03 JST | K-B040–K-B050 slice (115 confirmed fixtures) is recorded and browser storage/server cleanup verified. The 10:58 K-T001 Finding 2 response is **partially addressed/open**. The 11:01 oracle note leaves K-S018/K-S079 reclassification pending auditor disposition; no additional K-S rerun is planned. Port 8796 is no longer listening. |
| 3 | 06:11 JST | K-S and K-B follow-ups are complete; auditor accepted the rules-oracle corrections. K-B047 remains FAIL for missing consumer/cost metadata. No new report or test-server listener was found. |
| 4 | 10:50 JST | The 170-profile tagged rerun and Oath consumer crosswalk are recorded. Auditor review is partially accepted; K-B047 remains blocked, and profile-level mismatches in K-B044/K-B046 cannot be attributed to those category assertions from the saved aggregate. |

The visible background-agent inventory contains **no running tester agents**; the available auditor agents are idle. The session list exposes the shared host session, not separate live child-chat states, so individual tester chat shutdown cannot be confirmed from that listing. Browser tabs alone are not evidence that a tester is still executing tests.

### Remaining local endpoints

The initial refresh found listeners on `127.0.0.1:8765` (orchestrator server, PID 33376), `127.0.0.1:8769` (port used by Tester 4's original browser run, PID 30208), and `127.0.0.1:8775` (the shared tab showed Tester 4's crosswalk fixture, PID 15440). Known T1/T2/T3 test ports 41783, 8796, 48937, 49321, 49383, and 49401 had no listener. Because all assigned runtime slices were reported and no tester agent was visible as running, the two verified T4 HTTP servers were stopped by PID after checking their Python `http.server` command lines. A post-stop check confirmed 8769/8775 have no listener; orchestrator port 8765 remains active. This does not assert that individual child chats were stopped, since their states are not exposed in the session listing.

### Latest case-status changes since the prior snapshot

- **K-S018:** historical PASS is now **pending auditor reclassification** because the corrected TCE expectation includes Animating Performance, which the recorded output omits.
- **K-S079:** remains a reported FAIL; the corrected TCE Wails use count is PB rather than half Rogue level. The tester has requested auditor disposition of the corrected oracle.
- **K-S007/K-S069:** still marked BLOCKED in Tester 1's report even though the later source research resolves the original rules-text uncertainty; tester-owned reclassification remains outstanding.
- **K-T001:** Tester 2 documented its owned Bard/Cleric/Soulknife crosswalk, but consumer links remain absent/unverified and the finding stays open.
- **K-B040–K-B050:** all four class-slice reports are now present; outcomes are unchanged from the consolidated table above. Tester 2's cross-slice report is ready for audit, and Tester 4's audit is partial.

Step K remains **IN PROGRESS**. The 30-minute schedule remains stopped; this is a manual refresh, not a restart of the timer.

## Slot 1 replacement assignment — 2026-10-19 11:47 JST

Per the operator's instruction, the original Tester 1 is treated as unavailable and a replacement tester has been assigned to **Slot 1** (separate background session `adf116ce-f566-4c2d-afc9-c919e2d8618a`). The replacement inherits only the open Tester 1 follow-ups:

- append an oracle-based disposition for the existing K-S007/K-S069 runtime outputs;
- resolve or explicitly retain the K-B048 Fey Reinforcements representation note as BLOCKED;
- complete the Slot 1 Rage/Sorcery Points K-T001 Finding 2 consumer-to-key response in the Tester 1 report;
- record cleanup as already verified for the dedicated profile/server, with the expired integrated-browser context still unverifiable.

The replacement is directed not to repeat completed K-S or K-B matrices, not to modify product code or other tester reports, and not to start Step L. Its append-only response is recorded in the Tester 1 report:

- K-S007 is classified **FAIL** against short-rest recovery.
- K-S069 is classified **PASS** for its free-use recovery and generic paid-reuse metadata; the K-B048 Fey Reinforcements subassertion is resolved, while K-B048 remains **FAIL** overall.
- K-T001 Finding 2 remains **FAIL/OPEN** for the Rage/Sorcery Points consumer-to-key follow-up.
- No runtime retest was run. Port 41783 has no listener; the earlier integrated-browser context remains unverifiable and was not disturbed. No Step L work began.

The same-report independent audit (`444f56a4-3c37-4718-9450-32f709c5fa65`) accepted the K-S007 **FAIL** reclassification, the bounded K-S069/K-B048 Fey Reinforcements **PASS** subassertion, and the tester's K-T001 Finding 2 clarification. The K-T001 clarification distinguishes Rage-state associations from additional Rage-use costs, and missing Metamagic/Flexible Casting catalog links from UI behavior that was not executable or tested. **All inherited Slot 1 report follow-ups and their auditor round-trip are complete.** K-T001 remains **FAIL/OPEN** for the underlying metadata gaps; K-B048 remains **FAIL** overall. No runtime retest or product change was made. Step K remains open for its other incomplete cases and findings; Step L remains unstarted.

## Incomplete cases and reassignment-threshold refresh — 2026-10-19 11:59 JST

### Counting rule

For the operator's “more than 2 times” rule, count explicit auditor returns/reassignments by global test-case ID, summing returns recorded in separate tester-slice reports. One return is an auditor request that sends the test item back to its tester for additional/corrective work; a tester response followed by an audit disposition completes that round. An audit that accepts or partially adjudicates without requesting more tester work is not an additional return. Historical report rows remain unchanged. A case with **more than 2** returns is now globally **UNDETERMINED — HUMAN OPERATOR DECISION**, with its prior evidence and underlying failure/blocker preserved.

### Reassignment ledger

| Test case(s) | Explicit returns | Recorded back-and-forth | Current disposition |
|---|---:|---|---|
| K-T001 | 1 | Slot 1's Finding 2 clarification was returned once for a specific Rage/Sorcery Points distinction; the response was accepted on re-review. Tester 2's partial owner-slice response is open but was not an auditor reassignment. | **FAIL/OPEN**, not over threshold; metadata gaps remain. |
| K-S047, K-S048 | 2 each | Tester 3's consumer/cost evidence was returned, then its corrected Psi Warrior/Four Elements oracle wording was returned; the second correction was accepted. | Existing case findings retained; not over threshold. |
| K-B040 | 3 | One Tester 3 Rune Knight count return, plus two Tester 4 category/crosswalk returns. | **UNDETERMINED — HUMAN OPERATOR DECISION**; underlying Genie/Celestial failures are preserved. |
| K-B043 | 3 | One Tester 3 Rune Knight count return, plus two Tester 4 category/crosswalk returns. | **UNDETERMINED — HUMAN OPERATOR DECISION**; the missing sixth Rune finding is preserved. |
| K-B047 | 4 | Two Tester 3 consumer/oracle returns plus two Tester 4 supported-Oath/crosswalk returns. | **UNDETERMINED — HUMAN OPERATOR DECISION**; empty consumer arrays and missing feature-level links remain documented. |
| K-B048 | 3 | One Tester 3 consumer/cost evidence return plus two Tester 4 cost/category-crosswalk returns. | **UNDETERMINED — HUMAN OPERATOR DECISION**; known missing costs remain, and paid-action expenditure remains NOT RUN. |

The two Tester 4 returns concerned category-wide K-B040–K-B050 attribution/crosswalk evidence. No other test ID is confirmed above the threshold by the reports reviewed. The auditor's final partial attribution review for Tester 4 did not return another task. The accepted Slot 1 re-review did not add a second return for K-T001.

### Refreshed incomplete and deferred dispositions

| Case | Latest status | Remaining work / evidence |
|---|---|---|
| K-S018 | **FAIL — auditor disposition complete** | Performance of Creation's 1/LR free use and recovery pass, but its additional-use slot minimum is missing; Animating Performance is missing, including its level-6 output and 3rd-level-or-higher reuse minimum. |
| K-S079 | **FAIL — auditor disposition complete** | Wails from the Grave must use PB (6 at Rogue 20), not 10; Stroke of Luck is a Rogue class feature and is absent; Ghost Walk's 1/LR pool passes, but the Wails/Ghost Walk Soul Trinket alternate-cost metadata is missing. |
| K-B040 | **UNDETERMINED — HUMAN OPERATOR DECISION** | Three returns; preserve the fixed-use/Celestial findings pending operator adjudication. |
| K-B041 | **FAIL** | Wails from the Grave's use maximum is wrong in Tester 2's slice. Tester 4's nine tagged profile errors were Genie mismatches, not a PB/Harness assertion failure. The Tester 2 cross-slice audit remains outstanding. |
| K-B042 | **FAIL** | Missing Order's Embodiment of the Law and Inquisitive Unerring Eye outputs remain. |
| K-B043 | **UNDETERMINED — HUMAN OPERATOR DECISION** | Three returns; the underlying missing sixth Rune at Fighter 18+ remains documented. |
| K-B044 | **FAIL; attribution limited** | The cross-slice aggregate has profile-level errors; Tester 4's 10 errors were Celestial source and Genie maximum issues, not identified gate-specific mismatches. Do not claim those 10 prove a gate defect. |
| K-B046 | **FAIL; attribution limited** | Tester 4's 20 profile-level errors were Celestial source mismatches, not die/count/uses scaling errors. The aggregate does not support promoting the category to PASS. |
| K-B047 | **UNDETERMINED — HUMAN OPERATOR DECISION** | Four returns; underlying shared-pool consumer/cost metadata gaps remain. |
| K-B048 | **UNDETERMINED — HUMAN OPERATOR DECISION** | Three returns; underlying missing/incomplete costs remain. Paid-action expenditure was not executed in the UI. The Fey Reinforcements subassertion is resolved PASS and is not the remaining blocker. |
| K-T001 (parent; not scored) | **1 PASS / 10 FAIL** | K-T001-11 passes the catalog/link scan; K-T001-01–10 retain their confirmed pool/consumer failures. |
| K-T002 (parent; not scored) | **6 PASS** | All child assertions pass, including the corrected five-Rune maximum (no sixth Rune) and the catalog-wide key/cooldown scan. |
| K-T003 (parent; not scored) | **8 PASS / 2 FAIL / 2 N/A** | K-T003-03 fails because Short Rest leaves Power Surge at 2/2 instead of resetting to one; K-T003-10 fails because event/initiative execution controls are absent; K-T003-11/-12 are N/A after zero-row scans. |
| K-T004 (parent; not scored) | **6 PASS / 2 FAIL / 1 N/A** | K-T004-05/-06 retain known spell-slot and Ki cost failures; -03 is N/A; -01/-02/-04/-07/-08/-09 pass their bounded gate/cost assertions. |
| K-T005 (parent; not scored) | **4 PASS** | Current-value retention, manual-resource retention, obsolete-resource removal, and new-resource initialization pass. |
| K-T006 (parent; not scored) | **3 PASS** | Locale-switch state, reload persistence, and per-character option isolation pass as separate checks. |
| K-T007 (parent; not scored) | **9 PASS** | K-T007-08 was dropped by operator as outside Step A–J CR feature scope and is excluded from current totals. |

K-S007 is now an audited **FAIL** and K-S069 an audited **PASS** for the bounded metadata assertion; neither remains incomplete. K-B043 is **PASS** under the corrected five-Rune maximum. K-B045 is **PASS** for the applicable Bardic Inspiration recovery boundary (other slices are N/A); K-B049 is **N/A** for the enumerated catalog slices. K-T005-01–04 and K-T006-01–03 are PASS. K-M001–K-M005 remain PASS.

**Auditor disposition — 2026-10-19 13:22 JST:** The DND 5E (2014) Rules Auditor reviewed K-S018 and K-S079 against the captured outputs and TCE text. Both are **FAIL**; the rules oracles are now clear, so neither requires human-operator adjudication. The historical runtime rows are unchanged. Actual feature activation/payment was not tested; that remains NOT RUN/UNVERIFIABLE and outside the approved metadata-only scope.

### Current failed-case queue for the operator

- **K-S FAIL:** K-S007, K-S018, K-S020–K-S033, K-S039, K-S042, K-S046, K-S051, K-S072–K-S080, K-S084–K-S086, K-S091, and K-S093. K-S079 remains in the FAIL set; its auditor disposition is complete.
- **K-B FAIL:** K-B040-02, K-B040-04, K-B041, K-B042, K-B044, K-B046, K-B047, and K-B048, with the attribution qualifications above.
- **K-T FAIL:** K-T001-01–K-T001-10, K-T003-03, K-T003-10, K-T004-05, and K-T004-06.
- **K-T dropped:** K-T007-08 was removed from the scored case set by operator disposition as outside Step A–J CR feature scope.
- **K-T N/A:** K-T003-11, K-T003-12, and K-T004-03.
- **Human decision queue:** No K-S/K-B operator decision remains pending, and K-T007-08 no longer requires a decision because it was dropped. K-B040 remains split, K-B043 passed under the corrected oracle, and K-B047/K-B048 are FAIL.

Current reconciled counts: **K-S: 70 PASS / 34 FAIL / 0 BLOCKED / 0 pending reclassification**; **K-B: 44 PASS / 8 FAIL / 0 UNDETERMINED / 1 N/A across 53 current case IDs** (K-B040 contributes four slice IDs instead of its former single parent ID); **K-T: 37 PASS / 14 FAIL / 0 IN PROGRESS / 0 UNDETERMINED / 3 N/A across 54 current child case IDs**; **K-M: 5 PASS**. These remain Step K baseline results, not product fixes. Step K remains open; Step L remains unstarted.

## Proposed Pass 2 follow-up plan — 2026-10-19 12:42 JST

**Status:** Planning only. All testers are treated as stopped per operator update. This plan proposes remediation and targeted regression; it does not change product code, restart a tester, or begin Step L.

### Gate 0 — resolve scope and freeze the oracle

1. **Apply operator dispositions; no further human decision is pending for these cases:** score K-B040-01 through K-B040-04 independently (PASS, FAIL, PASS, FAIL respectively); classify K-B043 PASS under the five-Rune maximum; classify K-B047 and K-B048 FAIL from their preserved findings. Keep prior report rows and return counts as historical evidence, do not attribute the old parent K-B040 return count to its new child IDs, and do not send these cases through another automatic tester/auditor loop.
2. **Auditor adjudication complete:** K-S018 and K-S079 are both FAIL on the existing outputs under the corrected TCE oracle. No full level-20 rerun is required for classification; keep actual paid-action behavior NOT RUN because feature activation/payment UI is outside this pass.
3. **Correct the independent test reference before using it as the oracle:**
   - Phantom Wails from the Grave: use count is PB, not half Rogue level rounded up.
   - Genie Bottled Respite: one free entry per Long Rest; twice PB is duration, not uses.
   - Rune Knight: the maximum is five Runes; Fighter 18 does not unlock a sixth. Do not add a sixth pool.
   - College of Creation: separate Animating Performance from Bardic Inspiration expenditure; record its free use and the 3rd-level-slot paid reuse separately. Performance of Creation's additional-use minimum is 2nd level.
   - Keep the accepted Fey Reinforcements assertion bounded: generic spell-slot paid-reuse metadata is acceptable without a feature-specific minimum; UI payment was not tested.
4. **Approved behavior scope:** metadata only; feature-activation/payment UI is out of scope. The current resource UI exposes generic pool controls, not feature-specific activation/payment handlers, so keep paid-action execution explicitly NOT RUN. Include Divine Intervention's 7-day lockout as a distinct recovery rule, not ordinary Long-Rest recovery. Include Arcane Recovery's spell-slot recovery output/metadata. Continue deferring Arcane Ward event recovery, Genie Limited Wish, and paid Bottled Respite re-entry.

### Gate 1 — settle the resource metadata contract

Before bulk catalog edits, define and test the distinction between:

- one canonical resource pool and its `shared` identity;
- a feature that is associated with or depends on a pool;
- an actual expenditure (`poolKey`, amount, and any alternative payment);
- free uses and paid additional uses, including any rule-specified minimum spell-slot level;
- recovery, per-turn/round gates, and event-triggered recovery.

Keep Rage-state dependence separate from spending an additional Rage use. A consumer association must not imply a cost. Costs must point to existing pool keys; multiple consumers must not create duplicate pools. Apply the same contract consistently to Bardic Inspiration, Channel Divinity, Wild Shape, Ki, Rage, Sorcery Points, Superiority Dice, Psionic Energy Dice, and other multi-consumer pools.

### Gate 2 — implement high-confidence data corrections

| Workstream | Evidence-driven changes | Primary cases |
|---|---|---|
| Formula, cooldown, source, and pool identity | Normalize Consult the Spirits to short-rest recovery; correct Wails to PB; set Bottled Respite free uses to 1/LR while keeping PB duration separate; retain Rune Knight's maximum of five independent pools (no sixth at Fighter 18); correct Celestial selected-subclass source to XGE; generate Eldritch Knight's fourth-level slot; make Stroke of Luck class-wide with a stable Rogue key rather than Thief-owned. | K-S007, K-S042, K-S046, K-S072–K-S080, K-S079, K-S091, K-S093; K-B040-04, K-B041; K-T002, K-T003-03 |
| Missing outputs, gates, and recovery metadata | Add Arcane Recovery's spell-slot recovery output/metadata and Cleric Divine Intervention with a distinct 7-day lockout; add the missing Creation Animating Performance, Order Embodiment of the Law, Inquisitive Unerring Eye, Knowledge Visions of the Past, Swashbuckler Master Duelist, and Arcane Trickster Spell Thief outputs. Preserve level-minus-one absence and exact unlock boundaries. | K-S018, K-S020–K-S033; K-B040-02, K-B042, K-B044 |
| Shared consumers and costs | Populate correct shared flags and consumer/cost links without duplicating pools. Cover Sorcery Point costs and amounts; Drunkard's Luck (2 Ki); Four Elements and Monk Ki costs; Soulknife and Psi Warrior die consumers; Battle Master maneuvers; Wild Shape, Wild Companion, and Wildfire Spirit; Bardic Inspiration; and Cleric/Paladin Channel Divinity. Wildfire Spirit must spend existing Wild Shape or use its spell-slot alternative; do not invent a free-use pool. | K-S039, K-S051, K-S084–K-S086; K-B047, K-B048; K-T001-01–11, K-T004-05–09 |

### Gate 3 — finish cross-catalog invariants and reporting

- K-T002-01–06 now PASS, including the corrected five-Rune maximum and slot-tier grouping checks.
- K-T003-03 and K-T003-10 are FAIL; K-T003-11/-12 are N/A after separate zero-row scans. The Auditor clarified the event oracle; runtime trigger support is absent, and Power Surge Short Rest reset behavior is wrong.
- K-T004-07–09 now PASS for their bounded cost assertions; K-T004-05/-06 remain FAIL for known spell-slot and Ki cost gaps.
- K-T007-01–07 and -09/-10 PASS. K-T007-08 was dropped by the operator as outside Step A–J CR feature scope and is excluded from the scored case set.
- Preserve passing behavior: K-B045 recovery switch, K-B050 option gates/defaults, K-B049's scoped N/A, existing reapplication/persistence checks, and multiclass PB behavior.

### Gate 4 — targeted regression and release decision

After Gates 0–3 and implementation, run focused regressions for the affected K-S IDs (`K-S007`, `K-S018`, `K-S020–K-S033`, `K-S039`, `K-S042`, `K-S046`, `K-S051`, `K-S072–K-S080`, `K-S084–K-S086`, `K-S091`, `K-S093`), failed K-B slices K-B040-02/K-B040-04 and cases K-B041, K-B042, K-B044, K-B046–K-B048, plus failed K-T children K-T001-01–10, K-T003-03/-10, and K-T004-05/-06. Preserve the passed K-T outcomes and K-T004-03/K-T003-11/-12 N/A dispositions; validate the five-Rune oracle in regression fixtures without expecting a sixth pool. Exclude K-T007-08 from regression because the operator dropped it as outside Step A–J CR feature scope. Keep the passed K-B040-01/K-B040-03/K-B043 outcomes. Add focused Arcane Recovery and Divine Intervention recovery-metadata fixtures. Use independent expected fixtures; assert exact keys, owners, counts/formulas, unlock boundaries, cooldowns, costs, sources, and non-duplication. Keep paid-action behavior NOT RUN and outside this metadata-only scope.

Only after the remediation is ready should new isolated tester sessions be created (four parallel slots, each with its own report); auditors should return and accept/reject follow-ups in the same reports. Update case statuses only from those reports. Do not run the entire Step K matrix unless the targeted results uncover a regression requiring it. Keep Step L blocked until Step K's in-scope cases are either accepted or explicitly dispositioned by the operator.

## K-B044 closure update — 2026-10-22

This update supersedes earlier K-B044 FAIL/pending-audit entries above; those rows remain historical evidence:

- Tester 2: Group 1's 50-profile post-fix matrix is retained. An independent audit of the eight Bard/Cleric/Rogue gated definitions plus 16 focused threshold fixtures passed, including required ownership/source, limits/recovery, Animating Performance's 3rd-level slot minimum, and Divine Intervention's success-only seven-day trigger. No T2 K-B044 audit item remains open. Details are appended to [Tester 2 report](./step-k-tester-2-report.md).
- Tester 4: the entire 56-profile, 26-definition slice was rerun after Groups 2/3. All relevant gate, key, ownership, subclass/source, maximum, and recovery assertions passed. The previous ten profile-level errors (three Celestial source and seven Genie maximum) were resolved by those fixes; none represented a gate-specific failure. F012 used a Fighter 1 anchor for the Warlock 0 control because the UI requires at least one positive class level. Arcane Ward remains deferred and excluded. Details and the full feature/fixture crosswalk are appended to [Tester 4 report](./step-k-tester-4-report.md).
- **Current K-B044 disposition: PASS.** K-B totals are now 52 PASS / 0 FAIL / 1 N/A; the [control table](./step-k-control-table.md) is the current status authority. No source change was made during the audit.

## K-T003-10 manual-reset scope and retest — 2026-10-22

This follow-up supersedes the earlier K-T003-10 FAIL disposition above for Tides of Chaos and Benign Transposition. The operator clarified that these event-triggered recoveries are user-initiated manual resets, not automatic periodic recovery or accumulating resources. No event/initiative execution control is required or in scope. The Power Surge subassertion remains DEFERRED as integrated accumulator behavior; K-T003-03 also remains DEFERRED.

- **Tides of Chaos:** Wild Magic Sorcerer 1 generated the resource at 1/1, Long Rest, with the Wild Magic Surge trigger description. The card's Use action changed it to 0/1; the existing Reset action manually restored it to 1/1.
- **Benign Transposition:** Conjuration Wizard 6 generated the resource at 1/1, Long Rest, with the qualifying Conjuration spell trigger description. Use changed it to 0/1; the existing Reset action manually restored it to 1/1.
- These are manual-workflow fixtures; neither game event was simulated or automatically applied. K-T003-09 separately retains the ordinary short/long-rest test.
- The temporary character was deleted, localStorage and sessionStorage were cleared, and no product source change was required. The updated [control table](./step-k-control-table.md) records K-T003-10 as PASS for this approved scope; current K-T totals are 50 PASS / 0 FAIL / 1 DEFERRED / 3 N/A.
