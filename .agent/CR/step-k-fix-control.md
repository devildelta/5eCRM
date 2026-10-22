# Step K Fix Control

**Created:** 2026-10-19 18:03 JST
**Status:** Groups 1–4 and the operator-approved Soul Trinket subset of Group 5 are implemented and targeted post-fix tested; remaining deferred cases and unsupported event-runtime work stay held in Group 5
**Baseline before fixes:** 56 FAIL cases in the [Step K control table](./step-k-control-table.md): K-S 34, K-B 8, and K-T 14. K-T007-08 was dropped and is excluded.

## Purpose and execution model

This document groups the current failures by similar `src/cr.js` fix context and defines a required post-fix test for each group. It is a remediation plan, not evidence that any fix has been implemented or verified.

- Use one implementation owner for `src/cr.js`. Do not make concurrent edits to this shared source file.
- Complete the groups in order. For each group: implement only that group's changes, run its post-fix checks, record the evidence, and update the control table before starting the next group.
- Cases that appear in multiple groups remain FAIL until every failed assertion for that case has passed its relevant post-fix checks.
- Do not expand metadata fixes into feature activation or payment behavior. The K-B048 paid-action subassertion remains NOT RUN under the approved metadata-only scope.
- Use the existing browser/manual fixtures and catalog checks. Compare actual output against the independent expected rules and plan, not against values copied from `src/cr.js`.

## Preflight: freeze oracles and scope

Before editing:

1. Use the current operator-approved 2014 rules and the [resource plan](./CR-class-resources-plan.md) as the expected oracle. The K-S018 and K-S079 Auditor dispositions are already complete; do not reopen their rule questions.
2. Reconcile K-S046 before changing Rune Knight code. The control table marks it FAIL, while retained historical evidence conflicts about the expected count. Use the operator-corrected maximum of **five** Runes; do not add a sixth. Inspect the failed assertion and current output first. If the output already satisfies the corrected five-pool oracle, record the verification and correct the case disposition rather than changing code.
3. Keep K-S093 limited to the in-scope Bottled Respite assertion: one free entry per Long Rest; PB affects duration, not free-entry count. Do not add a separate Sanctuary Vessel gate, Limited Wish recovery, or paid Bottled Respite re-entry in this plan.
4. Keep K-T003-10 separate from the `src/cr.js` metadata groups. Tides of Chaos and Benign Transposition use the existing manual Reset control after their qualifying events; do not add automatic event handling. Keep Power Surge's integrated accumulator behavior deferred.

## Fix groups

### Group 1 — Missing feature outputs and unlock gates

**Cases:** K-S018, K-S020–K-S033, K-S042, K-S072–K-S080; K-B040-02 and K-B044.

**Fix context**

- Generate Creation's Animating Performance at Bard 6; retain its independent resource identity.
- Generate the shared Cleric Divine Intervention output, including its distinct seven-day lockout after a successful use. Add the missing Knowledge Visions of the Past and Order Embodiment of the Law outputs.
- Generate the Eldritch Knight fourth-level spell-slot tier.
- Generate Stroke of Luck as a Rogue class feature, not a Thief-owned pool. Add the missing Rogue subclass outputs: Arcane Trickster Spell Thief, Inquisitive Unerring Eye, and Swashbuckler Master Duelist.
- Preserve the rule that no resource appears before its unlock level.

**Post-fix test**

- Re-run all 14 Cleric level-20 profiles and verify Divine Intervention is present consistently; test its level-9/10 boundary and its success-only seven-day lockout metadata.
- Test Knowledge at Cleric 16/17 and Order at Cleric 5/6.
- Test Creation at Bard 5/6; test Rogue class-wide Stroke of Luck at Rogue 19/20; test Spell Thief at Rogue 16/17, Unerring Eye at 8/9, and Master Duelist at 16/17.
- Test Eldritch Knight spell-slot progression at Fighter 18/19/20; verify the fourth-level slot unlocks at 19 and the level-20 slots are 4/3/3/1. Test Arcane Trickster's corresponding Rogue 18/19/20 progression as part of K-S074.
- Re-run the complete affected K-S profiles, K-B040-02 fixed-use slice, and K-B044 unlock-boundary matrix. Verify key, owner, level gate, and absence immediately below each applicable unlock.

**Group 1 result — IMPLEMENTED / TARGETED RETEST COMPLETE (2026-10-19 18:18 JST)**

- Updated `src/cr.js` to generate Animating Performance, Divine Intervention, Knowledge Visions of the Past, Order Embodiment of the Law, Rogue Stroke of Luck, Spell Thief, Unerring Eye, and Master Duelist. Stroke of Luck now has one Rogue-class key. Single-class Eldritch Knight and Arcane Trickster gain their fourth-level slot at level 19, without changing multiclass third-caster rounding.
- Ran the UI apply/confirm flow on 50 temporary single-class profiles: all seven Bard subclasses, all 14 Cleric subclasses, and all nine Rogue archetypes at level 20; Bard Creation 5/6; and the planned Cleric, Rogue, and Fighter unlock boundaries. Verified all Cleric profiles carry the same Divine Intervention success-triggered seven-day metadata; feature keys, owners, maxima/formulae, recovery, and additional-use cost metadata were checked for the new outputs.
- Rechecked the fixed-maximum output slice across all seven Bard, 14 Cleric, and nine Rogue level-20 profiles. The 30 fixed-formula observations among Cleric/Rogue, plus all fixed-formula Bard outputs, remained 1/1 with the expected owner and recovery.
- Confirmed Fighter Eldritch Knight and Rogue Arcane Trickster slot progression at levels 18/19/20: no 4th-level slot at 18, one at 19/20, and 4/3/3/1 at level 20. A Fighter 19 / Barbarian 1 regression retained only the existing 4/3/3 regular-slot progression.
- One initial Arcane Trickster assertion queried a nonexistent fixture label and reported a test-harness mismatch. A focused UI rerun confirmed the persisted 18/19/20 slot outputs and 4/3/3/1 level-20 table; no source defect remained.
- Browser storage was restored to its captured empty state after the runs. `node --check src/cr.js` and `git diff --check` passed.
- At Group 1 close, the control table marked K-S020–K-S033, K-S042, K-S072–K-S078, and K-S080 PASS. K-S018 remained FAIL because Performance of Creation's additional-use minimum (2nd-level slot) was outstanding; K-S079 still awaited its Wails PB fix and Soul Trinket cost decision at that point. Group 2 subsequently fixed Wails PB, and the later operator scope decision deferred Soul Trinket costs. K-B040-02 remained FAIL pending its overlapping fixed-use cross-group recheck. K-B044 remained FAIL because its broader metadata-inclusive category was not closed; Group 1's changed gate assertions passed, but this did not clear unrelated category findings. The control table records the current disposition and totals.
- Divine Intervention's successful-use seven-day lockout is represented as metadata only; the app does not enforce a success event or calendar-based reset.

### Group 2 — Maximums, formulas, and scaling

**Cases:** K-S046, K-S079, K-S093; K-B040-02, K-B040-04, K-B041, K-B042, and K-B046.

**Fix context**

- Correct Wails from the Grave to PB uses (six at Rogue 20), rather than half Rogue level rounded up.
- Correct Bottled Respite to one free use per Long Rest; do not use PB as its free-use maximum.
- Verify each applicable PB, ability-modifier/minimum-one, fixed-use, and die/count scaling definition against the complete matrix.
- Apply the corrected five-Rune oracle to K-S046; never add a sixth Rune under the current operator instruction.

**Post-fix test**

- Re-run the affected K-S profiles and the complete K-B040-02/-04, K-B041, K-B042, and K-B046 fixtures at their required level, PB, ability-score, and scaling boundaries.
- Assert Wails uses equal PB at each tested PB boundary and equals six at Rogue 20.
- Assert Bottled Respite remains 1/LR while its duration follows twice PB.
- Verify Rune Knight has five independent Rune pools and no sixth at Fighter 18 or higher. If the current output already meets this corrected oracle, treat this as a verification/status-reconciliation result, not a code change.

**Group 2 result — IMPLEMENTED / TARGETED RETEST COMPLETE (2026-10-19 20:07 JST)**

- Updated `src/cr.js`: Wails from the Grave now uses PB; Bottled Respite has one fixed use per Long Rest and carries a twice-PB-hours effect-duration value. Added the localized duration detail to both `zh-HK` and `zh-TW`.
- Applied and confirmed 20 Genie profiles (Warlock 1–20). Every profile produced Bottled Respite at 1/1, Long Rest, fixed-one maximum; duration metadata and rendered detail matched 4/6/8/10/12 hours at PB 2/3/4/5/6. Warlock 1 / Fighter 4 also used total-level PB 3, yielding six hours and one use.
- Applied and confirmed Phantom Rogue levels 3/4/5/8/9/12/13/16/17/20. Wails from the Grave maxima matched PB exactly (2/2/3/3/4/4/5/5/6/6) and retained `{ type: 'pb' }` metadata. Rogue 3 / Fighter 2 produced three uses from total-level PB 3.
- Applied and confirmed Rune Knight at Fighter 3/7/10/15/18/20: 2/3/4/5/5/5 independent pools. A focused level-20 check confirmed exactly keys 1–5, each 1/1, Short Rest, Fighter/Rune Knight-owned, and TCE-sourced. No sixth pool appears at 18 or 20; this follows the operator-approved five-Rune oracle.
- Retested Embodiment of the Law (Cleric 6) and Unerring Eye (Rogue 9) at WIS 1/10/20/30. Both produced 1/1/5/10 with the WIS ability formula and minimum 1.
- Used the prior full class-slice evidence together with these post-fix results to close K-B040-02 (fixed outputs/missing features), K-B040-04 (fixed outputs including Bottled Respite), K-B041 (PB formulas, including Wails), K-B042 (ability formulas and newly added outputs), and K-B046 (scaling assertions, including Wails and the corrected Rune count). The historical Celestial source mismatch is not a fixed-count or scaling assertion and remains tracked under K-S091/K-B044.
- K-S046 and K-S093 now pass. K-S079's Wails PB maximum is fixed and verified; after the later operator scope decision, its Soul Trinket alternate-cost subassertions are DEFERRED. K-S018 remains FAIL for its missing minimum spell-slot cost metadata.
- All temporary browser storage was restored; no browser page errors occurred in the completed matrices. `node --check src/cr.js`, parsing both locale JSON files, and `git diff --check` passed. One supplemental Rune check initially ran after the temporary server had been stopped; it was rerun after restarting the server and passed. The temporary server was stopped after verification.

### Accumulative-resource design hold — operator scope decision (2026-10-19 20:39 JST)

Do not implement a resource as an ordinary recoverable use pool when qualifying events increment its current amount, it can accumulate up to a cap, and another event / feature consumes the accumulated amount. This phase has no suitable event-ledger or accumulator behavior. Keep the needed rule findings visible, but mark these assertions deferred until a separate resource-model design and implementation scope.

| Accumulative / event-refilled resource | Current Step K references | Scope disposition |
|---|---|---|
| Phantom Soul Trinkets / Tokens of the Departed | K-S079 Soul Trinket behavior/cost assertions; K-B048 cost matrix | Capacity PB; gained by Reaction when a creature seen within 30 feet dies; retained through Long Rests; at Phantom 17, Long Rest end grants one only if empty. Spend for Wails from the Grave, asking a spirit a question, or extra Ghost Walk use. This row records the original hold; the operator later approved implementation. |
| War Magic Power Surge | K-S102 metadata note; K-T003-03 and the Power Surge portion of K-T003-10 | Capacity INT modifier (minimum 1); event gains and spending coexist with a reset-to-one rest rule. Defer the integrated event-gain / consume / reset behavior; remove the Power Surge reset fix from Group 4. |
| Wizard Arcane Ward | K-S094; existing Tester 4 disposition | HP capacity is replenished incrementally by qualifying spell events and depleted by damage; no ordinary rest refill. Keep the already-approved deferred disposition; do not implement as a standard cooldown pool. |

Not every event recovery is accumulation. Tides of Chaos and Benign Transposition restore a single spent use up to a maximum of one; empty-only initiative recovery restores a depleted rest pool without stacking extra charges. Keep those under their existing event/recovery assertions and scope holds rather than reclassifying them as accumulators.

### Operator scope update — 2026-10-19 20:39 JST

- K-S079's Wails PB and class-wide Stroke of Luck assertions pass, but its Soul Trinket alternate-cost subassertions are now **DEFERRED**, not a Group 3 implementation target. The auditor's rules ruling remains valid; only the resource-model implementation is deferred.
- K-B048 remains FAIL for other in-scope missing cost metadata; its Soul Trinket cost portion is deferred. K-T004-05/-06 remain scoped to spell-slot and Ki costs and do not acquire Soul Trinket scope.
- At this Group 2 checkpoint, K-T003-03 Power Surge reset testing was **DEFERRED** with its accumulator behavior; K-T003-10 was still FAIL pending operator scope clarification. The 2026-10-22 manual-reset follow-up below supersedes that K-T003-10 status; its Power Surge portion remains deferred.
- K-S094 remains PASS for the previously approved scoped subclass output; Arcane Ward remains an explicit deferred output. K-S102 remains PASS for its recorded pool metadata; Power Surge's event accumulation is not claimed as runtime-supported.
- Revised totals: K-S 95 PASS / 8 FAIL / 1 DEFERRED; K-B 49 PASS / 3 FAIL / 1 N/A; K-T 37 PASS / 13 FAIL / 1 DEFERRED / 3 N/A; K-M 5 PASS.

### Group 3 — Resource identity, source, shared consumers, and costs

**Cases:** K-S018, K-S039, K-S051, K-S072–K-S078, K-S080, K-S084–K-S086, and K-S091; K-B047 and K-B048; K-T001-01–K-T001-10 and K-T004-05/-06. K-S079's Soul Trinket subassertions are deferred above.

**Fix context**

- Give Stroke of Luck one stable Rogue-class key and owner across Rogue subclasses.
- Correct the Celestial selected-subclass source metadata to XGE.
- Populate canonical shared-pool flags and consumer-to-key links without creating duplicate pools.
- Complete in-scope cost metadata, including Wildfire Spirit's spell-slot revival, Drunkard's Luck's 2-Ki cost, and missing/incomplete Sorcery Point costs.
- Preserve exact pool keys, cost amounts, minimum spell-slot levels, and alternative costs. Do not infer a consumer link merely from a feature's association with a pool.
- Do not implement Soul Trinket alternate costs in this group; they depend on the deferred accumulative-resource model.

**Post-fix test**

- Re-run K-B047's complete shared-pool/consumer crosswalk and all ten K-T001 child checks. Assert canonical keys, correct ownership, `shared` metadata where required, complete consumer links, and no duplicate pools.
- Re-run K-B048 and K-T004-05/-06. Assert each in-scope cost's pool key, amount, minimum slot level, and alternative payment independently. Include the 2-Ki Drunkard's Luck cost, Wildfire Spirit spell-slot reuse, and Sorcery Point costs. Exclude the deferred Phantom Soul Trinket costs.
- Re-run the affected K-S profiles, including Celestial source attribution and the Rogue class-key checks.
- Inspect payment metadata only; do not claim that paid actions were executed.

**Group 3 result — IMPLEMENTED / TARGETED RETEST COMPLETE (2026-10-19 21:29 JST)**

- Added canonical shared-pool consumer metadata and localized neutral related-feature display for Bardic Inspiration, Channel Divinity, Wild Shape, Rage, Ki, Superiority Dice, Psi Warrior dice, Sorcery Points, and Soulknife dice. Corrected Celestial to XGE and completed the in-scope spell-slot, Ki, and Sorcery Point cost links.
- Completed the Ki crosswalk for all eight selectable Monk subclasses, including the four core 1-Ki actions, Empty Body, Quivering Palm, Drunkard's Luck, the corrected Kensei/Astral Self amounts, optional-feature costs, and all 16 costed Four Elements disciplines. Four Elements was checked against the corrected activation/damage split, spell-upcast costs, and its 6-Ki cap at Monk 20; Elemental Attunement remains unlinked.
- Browser checks confirmed the eight Barbarian Rage profiles; six Bard, fourteen Cleric, and eight Paladin consumer profiles; all eight Monk Ki profiles; Druid Moon, Stars, and Wildfire consumers (including the Druid 20 unlimited Wild Shape case); Battle Master, Psi Warrior, Soulknife, and Sorcery Point links. The class-specific TCE reverse links for Harness Divine Power, Wild Companion, Primal Awareness, Magical Guidance, Quickened Healing, and Focused Aim were also asserted.
- Cost checks passed for Bard Creation's 2nd-/3rd-level slot minima; Artificer Elixir/Cannon; Cleric Twilight Eyes of Night and Harness Divine Power; Ranger Drake Companion, Drake's Breath (minimum 3rd level), and all five Primal Awareness spell pools; Wild Companion/Wildfire alternatives; Sorcerer Shadow/Aberrant Mind/Clockwork costs; Soulknife; and Monk Ki. Celestial's generated Healing Light source is XGE. These are metadata checks only.
- Updated K-S018, K-S039, K-S051, K-S084–K-S086, and K-S091 to PASS. K-B047, the in-scope metadata portion of K-B048, K-T001-01–K-T001-10, and K-T004-05/-06 now PASS. K-S079's Soul Trinket subassertions remain DEFERRED; K-B048 paid-action execution remains NOT RUN. At the Group 3 checkpoint, K-S007, K-B044, and K-T003-10 still had open assertions; later dated follow-ups supersede the K-S007, K-B044, and K-T003-10 statuses.
- Final totals after Group 3: K-S 102 PASS / 1 FAIL / 1 DEFERRED; K-B 51 PASS / 1 FAIL / 1 N/A; K-T 49 PASS / 1 FAIL / 1 DEFERRED / 3 N/A; K-M 5 PASS.
- `node --check src/cr.js`, parsing both locale JSON files, and `git diff --check` passed. The temporary character and class-feature settings were removed; reload confirmed empty localStorage/sessionStorage. The temporary server was stopped and port 8766 has no listener.

### Group 4 — Rest recovery and reset behavior

**Case:** K-S007.

**Fix context**

- Normalize Consult the Spirits to the plan's short-rest recovery representation.

**Post-fix test**

- At Barbarian 20 / Ancestral Guardian, verify Consult the Spirits has one use, XGE source, and Short Rest recovery metadata.
- Spend the use, apply a Short Rest, and assert current returns to maximum; spend it again, apply a Long Rest, and assert current returns to maximum.

**Group 4 result — IMPLEMENTED / TARGETED RETEST COMPLETE (2026-10-19 21:58 JST)**

- Changed Consult the Spirits recovery metadata from Long Rest to the accepted Short Rest normalization. The existing rest-reset tier makes Long Rest restore Short-Rest resources as well; no new recovery path was added.
- The Barbarian 20 / Ancestral Guardian browser fixture confirmed the generated resource has one use, XGE source, and Short Rest recovery. After spending the use, a Short Rest restored it to 1/1; after spending it again, a Long Rest restored it to 1/1.
- K-S007 is now PASS. Final totals after Group 4: K-S 103 PASS / 0 FAIL / 1 DEFERRED; K-B 51 PASS / 1 FAIL / 1 N/A; K-T 49 PASS / 1 FAIL / 1 DEFERRED / 3 N/A; K-M 5 PASS.
- `node --check src/cr.js`, parsing both locale JSON files, and `git diff --check` passed. Removed the temporary browser fixture and its per-character settings; both localStorage and sessionStorage are empty. Stopped the temporary server and confirmed port 8766 has no listener.

### Group 5 — Deferred accumulative-resource behavior and event-scope hold

#### Approved subset — Soul Trinket implementation and post-fix retest (2026-10-19 22:37 JST)

- Added one reusable accumulative-resource card control with bounded gain/spend amounts; it shows current-held counts and omits the ordinary use/reset actions. Soul Trinkets start at zero, use PB as their cap, gain through the manual event control, persist through Long Rests, and at Phantom 17 gain one at Long Rest end only when empty.
- Generated the TCE Soul Trinkets feature at Rogue 9. Wails from the Grave and Ghost Walk carry alternative-cost metadata linked to `subclass:rogue:phantom:soul-trinkets`; Wails only exposes that cost from Rogue 9. The card also documents the death Reaction, passive saving-throw benefits, and spirit-question spend.
- Browser retests covered Rogue 8/9/16/17/20: no token pool or Wails alternate cost below Rogue 9; PB maximum at Rogue 9 and 20; no empty-pool Long Rest gain at Rogue 16; empty-pool gain at Rogue 17; token persistence when non-empty; bounded gain/spend controls; and Wails/Ghost Walk cost pool keys. Rogue 20 also retained Wails 6/6 and Stroke of Luck.
- **K-S079 is PASS** as the direct end-to-end implementation test. **K-B048 remains PASS** for cost metadata and pool references, including both Soul Trinket alternatives. Its separately scoped paid-action execution remains **NOT RUN**; the new controls record manual resource changes and do not automatically execute a feature action.
- `node --check src/cr.js`, both locale JSON parses, and `git diff --check` passed. Temporary browser data was removed and the test server stopped.

**Remaining deferred cases/subassertions:** the Arcane Ward subassertion of K-S094; K-T003-03; and the Power Surge subassertion of K-T003-10. Tides of Chaos and Benign Transposition do not require automatic event-trigger execution; their manual-reset handling was retested on 2026-10-22 below.

| Deferred case / subassertion | Current disposition | Held work |
|---|---|---|
| K-S094 — Arcane Ward output/behavior | Scoped subclass-output assertion remains PASS; Arcane Ward accumulator behavior/output is DEFERRED | Design a Ward with maximum HP 2 × Wizard level + INT modifier; it is created at maximum on a chosen eligible cast once per Long Rest, ends at Long Rest, loses HP to damage, and regains 2 × spell level on each 1st-level-or-higher Abjuration spell cast up to maximum. Do not encode it as an ordinary rest pool. |
| K-T003-03 — Power Surge reset-to-one | Case remains DEFERRED | Implement and test cap (INT modifier, minimum 1), long-rest set-to-one, short-rest gain-one-only-if-empty, event gain, and expenditure together; isolated reset behavior is insufficient. |
| K-T003-10 — Power Surge portion | This subassertion is DEFERRED; the Tides of Chaos and Benign Transposition manual-reset assertions now PASS | Include one Surge on successful Dispel Magic/Counterspell and the empty-pool Short Rest gain in the integrated lifecycle; spending is once per turn on Wizard-spell damage. Arcane Deflection is not a Surge trigger. Tides of Chaos and Benign Transposition remain manual-reset actions and need no event-control implementation. |

K-S102 remains PASS for its recorded Power Surge metadata only; it does not claim event accumulation is runtime-supported. Do not implement the remaining Group 5 behaviors without a separately approved accumulator/runtime design and test scope. Keep each remaining case status and exclusion unchanged until that work is authorized and verified.

### K-T003-10 manual-reset follow-up — 2026-10-22

- The operator clarified that Tides of Chaos's Wild Magic Surge recovery is not an automatic periodic reset or a new/accumulating resource. After the qualifying event, the user manually restores its single spent use. Apply the same manual-reset scope to Benign Transposition after its qualifying Conjuration spell; do not add event simulation, initiative controls, or automatic recovery.
- In an isolated browser origin, Wild Magic Sorcerer 1 generated Tides of Chaos at 1/1 with Long Rest recovery and the Wild Magic Surge trigger description. The card was used to 0/1 and its existing Reset action manually restored it to 1/1.
- Conjuration Wizard 6 generated Benign Transposition at 1/1 with Long Rest recovery and its level-1-or-higher Conjuration spell trigger description. The card was used to 0/1 and its existing Reset action manually restored it to 1/1.
- These fixtures verify the in-scope manual workflow and the resource caps; neither qualifying game event was simulated or automatically applied. K-T003-09 remains the separate ordinary-rest behavior test. Power Surge remains deferred as an accumulator, and K-T003-03 remains deferred.
- The temporary character was deleted; localStorage and sessionStorage were cleared. No source implementation change was needed. K-T003-10 is now PASS for the approved manual-reset scope; its Power Surge subassertion remains DEFERRED.

### K-B044 audit and retest closure — 2026-10-22

- Tester 2's Group 1 post-fix matrix of 50 profiles was independently audited; 16 additional UI apply/confirm fixtures checked the eight Bard/Cleric/Rogue unlock boundaries and relevant metadata. All passed.
- Tester 4's complete 56-profile K-B044 matrix across 26 Paladin/Warlock/Wizard gated definitions was rerun after the Bottled Respite formula and Celestial source corrections. All gate, ownership, source, maximum, and recovery assertions passed. The old 10 profile-level discrepancies were cleared; none was a gate mismatch.
- F012's Warlock-level-0 control used Fighter 1 as a legal positive-level anchor because the app rejects all-zero class levels. Its Warlock subclass-gated outputs remained absent. Arcane Ward remains deferred and excluded from the scored K-B044 definitions.
- **K-B044 is now PASS.** Current K-B totals are 52 PASS / 0 FAIL / 1 N/A. Detailed evidence is appended to the Tester 2 and Tester 4 reports and the K-B044 slice breakdown in the control table. No product code was changed for this audit.

## Required control-table update after every group

After **each group has been fixed and its post-fix tests have completed**:

1. Update every affected row in `step-k-control-table.md` before beginning another group.
2. Mark a case PASS only when all assertions for that case—including assertions covered by other groups—are verified. Otherwise keep its current FAIL status and record the actual result or blocker.
3. Record the post-fix tester/evidence source, coder/owner if assigned, and any Auditor disposition. Link or append the detailed test evidence in the orchestrator/test report.
4. Update the table's `Updated` date and recompute the current status totals. Do not count dropped K-T007-08.
5. If a test fails, iterate within that same group and re-run its post-fix checks before proceeding.

After all in-scope groups are complete, run a combined targeted regression across the affected K-S/K-B/K-T cases and confirm that previously passing cases sharing the changed generation paths remain unchanged. Update the control table from that final evidence; do not treat this plan as completion of Step K.
