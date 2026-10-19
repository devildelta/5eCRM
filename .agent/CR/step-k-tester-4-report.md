# Step K Tester 4 Report

> Central Step K status and assignment register: [step-k-control-table.md](./step-k-control-table.md). This report retains Tester 4 execution evidence.

## Scope and execution

Assigned scope only:

- K-S056–K-S063: Paladin — Ancients, Devotion, Vengeance, Oathbreaker, Conquest, Redemption, Glory, Watchers.
- K-S087–K-S093: Warlock — Archfey, Fiend, Great Old One, Hexblade, Celestial, Fathomless, Genie.
- K-S094–K-S104: Wizard — Abjuration, Conjuration, Divination, Enchantment, Evocation, Illusion, Necromancy, Transmutation, War Magic, Bladesinging, Order of Scribes.

Executed all 26 cases in the browser at `http://127.0.0.1:8769/cr.html`, using the unique temporary character `K-T4-Runtime-20261019-0025`. Each was applied as a single-class level-20 character with STR/DEX/CON/INT/WIS/CHA 14, PB +6, and all TCE optional features off. The browser run captured each generated resource key, current/max, cooldown, formula, source/subclass metadata, costs, and relevant recovery metadata.

The test origin's localStorage was empty before setup and was cleared after the final case; the captured final check reports `restoredKeys: []`. Runtime result evidence: `C:\Users\Alpha\AppData\Local\Temp\1792337599279-copilot-tool-output-eddee6d14e4341fc9ee8207cdbc6cc34.txt` (tool-captured 26-case result and cleanup check).

Status means the runtime comparison against the independent oracle, not simply that UI generation completed. `FAIL` cases are completed runtime cases with identified missing output or inconsistent metadata; no assigned case remains unrun.

## Common expected-vs-actual profiles

These profiles apply to every case in their class group. Expected values are from the independent rules reference and 2014 class tables, not inferred from the implementation.

### Paladin profile (K-S056–K-S063)

| Pool key | Expected | Actual |
|---|---|---|
| `class:hit-dice:d10` | 20/20 d10, long rest | Present, 20/20 |
| `class:spell-slot:1..5` | 4/3/3/3/2, long rest | All five keys present at 4/3/3/3/2 |
| `class:paladin:divine-sense` | 1 + CHA modifier = 3, long rest; PHB | Present, 3/3, PHB, formula `ability-plus(CHA, 1, min 1)` |
| `class:paladin:lay-on-hands` | Paladin level × 5 = 100 HP, long rest; PHB | Present, 100/100, PHB, formula `class-level-times(5)`, hit-points pool |
| `class:paladin:channel-divinity` | One shared use, short or long rest; PHB | Present exactly once, 1/1, shared, PHB |
| `class:paladin:harness-divine-power` | Absent because TCE options are off | Absent in all eight cases |

Observed common key set and base values match expectations. The Paladin slot table is the level-20 2014 half-caster row. No duplicate Channel Divinity pool was generated for oath abilities.

### Warlock profile (K-S087–K-S093)

| Pool key | Expected | Actual |
|---|---|---|
| `class:hit-dice:d8` | 20/20 d8, long rest | Present, 20/20 |
| `class:warlock:pact-slots` | Four 5th-level Pact Magic slots, short or long rest | Present, 4/4 at level 5; short-rest cooldown representation |
| `class:warlock:mystic-arcanum:6..9` | Four distinct pools, each 1/1 and long rest | All four distinct keys present, each 1/1 at its matching level |
| `class:warlock:eldritch-master` | 1/1, long rest; after 1 minute, restores Pact Magic slots | Present, 1/1 PHB; recovery target is `class:warlock:pact-slots` |

No regular spell-slot pool was expected or observed for the single-class Warlock.

### Wizard profile (K-S094–K-S104)

| Pool key | Expected | Actual |
|---|---|---|
| `class:hit-dice:d6` | 20/20 d6, long rest | Present, 20/20 |
| `class:spell-slot:1..9` | 4/3/3/3/3/2/2/1/1, long rest | All nine keys present at the expected maxima |
| `class:wizard:signature-spell-1` and `-2` | Each 1 free cast, short or long rest | Both present, 1/1 each; short-rest cooldown representation |
| Arcane Recovery | One use per day, usable after a short rest to recover eligible spell slots | **Missing in every Wizard case**; no Arcane Recovery resource / usage gate / recovery output |
| Arcane Ward (Abjuration only) | HP pool max = 2 × Wizard level + INT modifier = 42; HP is restored by qualifying abjuration-spell events, not by an automatic long-rest refill | **Missing in K-S094**; no ward pool or event-recovery output |

## Individual case results

Each row's “common profile” refers to the matching profile above. The `subclass:` keys below are the complete subclass-specific keys captured at runtime; where the oracle expects no finite subclass pool, the expected output is no additional resource key.

### Paladin

| ID | Subclass | Status | Expected subclass-specific output | Actual subclass-specific output / result |
|---|---|---|---|---|
| K-S056 | Ancients (PHB) | PASS | No finite pool beyond shared Channel Divinity; oath options use that pool. | No subclass key; common Paladin profile matches. 9 total resources. |
| K-S057 | Devotion (PHB) | PASS | No finite pool beyond shared Channel Divinity. | No subclass key; common profile matches. 9 total resources. |
| K-S058 | Vengeance (PHB) | PASS | No finite pool beyond shared Channel Divinity. | No subclass key; common profile matches. 9 total resources. |
| K-S059 | Oathbreaker (DMG) | PASS | No finite pool beyond shared Channel Divinity. | No subclass key; common profile matches. 9 total resources. |
| K-S060 | Conquest (XGE) | PASS | No finite pool beyond shared Channel Divinity. | No subclass key; common profile matches. 9 total resources. |
| K-S061 | Redemption (XGE) | PASS | No finite pool beyond shared Channel Divinity. | No subclass key; common profile matches. 9 total resources. |
| K-S062 | Glory (TCE) | PASS | `subclass:paladin:glory:glorious-defense`: CHA modifier (min 1) = 2, long rest, TCE. | Present 2/2, long rest, source/subclass TCE, formula `ability(CHA, min 1)`. Common profile matches. 10 total resources. |
| K-S063 | Watchers (TCE) | PASS | `subclass:paladin:watchers:vigilant-rebuke`: CHA modifier (min 1) = 2, long rest, TCE. | Present 2/2, long rest, source/subclass TCE, formula `ability(CHA, min 1)`. Common profile matches. 10 total resources. |

### Warlock

| ID | Subclass | Status | Expected subclass-specific output | Actual subclass-specific output / result |
|---|---|---|---|---|
| K-S087 | Archfey (PHB) | PASS | `fey-presence`, `misty-escape`, `dark-delirium`: each 1, short or long rest. | All three keys present at 1/1, PHB, short-rest representation. Common Warlock profile matches. 10 total resources. |
| K-S088 | Fiend (PHB) | PASS | `dark-ones-own-luck`: 1, short or long rest; `hurl-through-hell`: 1, long rest. | Both keys present at 1/1 with their expected recovery; PHB. Common profile matches. 9 total resources. |
| K-S089 | Great Old One (PHB) | PASS | `entropic-ward`: 1, short or long rest. | Key present at 1/1, PHB, short-rest representation. Common profile matches. 8 total resources. |
| K-S090 | Hexblade (XGE) | PASS | `hexblades-curse`: 1, short or long rest; `accursed-specter`: 1, long rest. | Both keys present at 1/1 with expected recovery and XGE source. Common profile matches. 9 total resources. |
| K-S091 | Celestial (listed TCE in plan) | FAIL | Two resource pools: Healing Light, Warlock level + 1 = 21d6/long rest; Searing Vengeance, 1/long rest. Source metadata must agree with subclass selection. | Both pools present at 21/21 d6 and 1/1, long rest. Feature source is XGE on both records, while subclass selection metadata reports TCE. This source mismatch violates the plan's source-consistency assertion; resource maxima/recovery match. Common profile matches. 9 total resources. |
| K-S092 | Fathomless (TCE) | PASS | Tentacle of the Deeps: PB = 6/long rest; Fathomless Plunge: 1/long rest. | Both keys present at 6/6 and 1/1, TCE, long rest. Common profile matches. 9 total resources. |
| K-S093 | Genie (TCE) | FAIL | Bottled Respite and Elemental Gift: each PB = 6/long rest. Limited Wish: one use, then unavailable until 1d4 long rests have completed; preserve this variable recovery rather than fixed LR. Sanctuary Vessel companion/entry use must retain its long-rest restriction. | Bottled Respite and Elemental Gift present at 6/6, TCE, long rest. **No Limited Wish key or 1d4-long-rest recovery output; no Sanctuary Vessel restriction/gate output.** Common profile matches. 9 total resources. |

### Wizard

| ID | Subclass | Status | Expected subclass-specific output | Actual subclass-specific output / result |
|---|---|---|---|---|
| K-S094 | Abjuration (PHB) | FAIL | Arcane Ward: 42 HP, event-restored by qualifying abjuration spells; no automatic long-rest refill. | **No Abjuration key / ward HP pool / recovery event.** Common Wizard profile matches except missing Arcane Recovery. 12 total resources. |
| K-S095 | Conjuration (PHB) | FAIL | Benign Transposition: 1, long rest; regain use after casting a 1st+ level conjuration spell. | `subclass:wizard:conjuration:benign-transposition` present at 1/1, long rest, with `conjuration-spell-slot` recovery trigger. Common profile matches, but Arcane Recovery is missing. 13 total resources. |
| K-S096 | Divination (PHB) | FAIL | Portent: 3 uses/long rest; Third Eye: 1 use/short or long rest. | Both keys present at 3/3 and 1/1 with expected recovery. Common profile matches, but Arcane Recovery is missing. 14 total resources. |
| K-S097 | Enchantment (PHB) | FAIL | No global finite subclass pool for Instinctive Charm. | No subclass key, as expected. Common profile matches, but Arcane Recovery is missing. 12 total resources. |
| K-S098 | Evocation (PHB) | FAIL | Overchannel: first use per long rest; subsequent same-rest uses incur increasing damage, not additional fixed charges. | Present 1/1, long rest; additional-use cost is marked as damage. Common profile matches, but Arcane Recovery is missing. 13 total resources. |
| K-S099 | Illusion (PHB) | FAIL | Illusory Self: 1 use/short or long rest. | Key present at 1/1, short-rest representation. Common profile matches, but Arcane Recovery is missing. 13 total resources. |
| K-S100 | Necromancy (PHB) | FAIL | No finite subclass pool expected. | No subclass key, as expected. Common profile matches, but Arcane Recovery is missing. 12 total resources. |
| K-S101 | Transmutation (PHB) | FAIL | Shapechanger: 1/short or long rest; Major Transformation: 1/long rest and consumes Transmuter's Stone. | Both keys present; Shapechanger 1/1 short-rest representation; Major Transformation 1/1 long rest with `Transmuter's Stone` consumption. Common profile matches, but Arcane Recovery is missing. 14 total resources. |
| K-S102 | War Magic (XGE) | FAIL | Power Surge maximum = INT modifier (min 1) = 2; begins at 1, long rest resets to 1; Counterspell/Dispel Magic success and Arcane Deflection while empty can add a surge. | Present 1/2, XGE, with initial value 1, long-rest reset-to-1 and both event sources. Common profile matches, but Arcane Recovery is missing. 13 total resources. |
| K-S103 | Bladesinging (TCE) | FAIL | Bladesong: PB = 6 uses/long rest (TCE version, not SCAG version). | Present at 6/6, TCE, long rest. Common profile matches, but Arcane Recovery is missing. 13 total resources. |
| K-S104 | Order of Scribes (TCE) | FAIL | Manifest Mind: 1 free use/long rest; additional uses cost a spell slot. | Present at 1/1, TCE, long rest, with additional-use spell-slot cost. Common profile matches, but Arcane Recovery is missing. 13 total resources. |

## Findings and evidence

1. **Missing Wizard Arcane Recovery resource (K-S094–K-S104).** The reference calls for a once-daily ability used after a short rest to regain eligible spell slots. No such pool, once-per-day gate, or post-short-rest activation appears in any of the eleven generated Wizard sets. This is separate from restoring spell slots automatically on a short rest.
2. **Missing Abjuration Arcane Ward pool (K-S094).** No ward HP pool (expected max 42 for this fixture) or event recovery metadata is emitted.
3. **Missing Genie Limited Wish and Sanctuary Vessel restriction outputs (K-S093).** The two PB-based Genie pools match, but the variable 1d4-long-rest Limited Wish recovery and Sanctuary Vessel long-rest gate are absent.
4. **Celestial source metadata disagrees (K-S091).** The case plan/UI selection says TCE, while the generated Healing Light and Searing Vengeance feature records say XGE. The numerical pools match; the source mismatch remains a failure against the contract's metadata-consistency check.
5. **No unexpected keys were observed** beyond the missing outputs listed above. Shared pools were not duplicated; Pact slots and Mystic Arcanum remained distinct; Paladin Channel Divinity remained one shared pool.

Evidence:

- Test contract and expected 20th-level setup: `CR-class-resources-plan.md:95–103`.
- Assigned case/source list: Paladin `CR-class-resources-plan.md:165–177`; Warlock `:205–212`; Wizard `:213–223`.
- Independent recovery oracle: Paladin `class-resource-recovery-reference.md:112–120`; Warlock `:154–165`; Wizard `:170–186`; Bladesinger version note `:237`.
- Runtime definitions/output surfaces: `../../src/cr.js:207–212` (Paladin); `:237–263` (Warlock/Wizard features); `:1805–1853` (hit dice, spell slots, Pact slots, Mystic Arcanum); `:1658–1718` (feature maximum/recovery metadata generation).
- Browser evidence: the unique character and isolated-origin run details above; full captured output and post-run empty-storage check at the temporary path recorded in “Scope and execution”.

## Remaining cases

None. All 26 assigned IDs were executed. Failures above are completed comparisons with mismatches, not runtime-blocked or unrun cases.

## K-B040–K-B050 class-sliced boundary follow-up (Tester 4)

### Scope and execution

Owned class slice: Paladin, Warlock, and Wizard. The full `classResourceData` slice contained 33 rows: Paladin 6, Warlock 15, Wizard 12. The 170 unique primary profiles exercised level-1/below-unlock and unlock levels, wrong-subclass selections, PB boundaries, ability-score boundaries, level tiers, TCE off/on, and all levels for both count-scaling resources. All 170 profiles completed; the corrected run had no runtime error. Eight of the Warlock profiles (levels 10–17) were reapplied as explicit Mystic Arcanum boundary assertions. A separate Crown consumer attempt was blocked because no `crown` option exists in the UI.

The temporary browser origin was `http://127.0.0.1:8772/cr.html`; temporary characters were `K-B-T4-20261019-0140`, `K-B-T4-Arcanum-20261019-0140`, and `K-B-T4-CDConsumer-20261019-0140`. The fresh-origin baseline was empty and the final cleanup check was `localStorage` keys `[]`. The first matrix attempt stopped at 85/170 due a class-switch collision and was excluded; its temporary storage was cleared before the corrected full run. Current charges were not used as a maximum assertion because reapplying a profile preserves already-current values; maximum, key, formula, recovery, source, gates, and costs were compared.

Independent expectations were taken from `.agent/CR/class-resource-recovery-reference.md`, not from `src/cr.js`. The plan contract is `.agent/CR/CR-class-resources-plan.md:232`. The implementation slice was inventoried at `src/cr.js:207–263` and generated metadata compared at `src/cr.js:1671–1724`.

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

- Contract: `.agent/CR/CR-class-resources-plan.md:232`.
- Independent oracle: Paladin `class-resource-recovery-reference.md:112–120`; Warlock `:154–165`; Wizard `:170–186`; Mystic Arcanum and Genie variable-recovery notes `:154–165`.
- Inventory and actual output fields: `src/cr.js:207–263` and `src/cr.js:1671–1724` (implementation evidence only, not the expectation oracle).
- Primary browser result (170 profiles, category summary, per-definition maxima/formulas, special-threshold checks, and empty-storage cleanup): `C:\Users\Alpha\AppData\Local\Temp\1792342715004-copilot-tool-output-a668e9dfcccb4dfcb6216ed441524f3b.txt`.
- Mystic Arcanum 8-profile recheck and Crown selector attempt were captured in the browser execution for this follow-up; both temporary characters were cleared and the final `localStorage` check was empty.

### Tester 4 disposition

K-B040–K-B050 matrix execution is complete for the enumerated 33 definitions, with K-B045/K-B049 verified N/A. The assigned follow-up is **not fully clear to close**: K-B047 remains blocked by the unavailable Crown selector and has an empty consumer-output list; the Celestial subclass-source metadata mismatch and the four separate rule-defined missing outputs are documented above. This does not declare Step K complete.

### K-T001 Finding 2 addendum — owned-class shared and multi-consumer pools

The full Paladin/Warlock/Wizard catalog slice was checked for `shared`, `consumers`, `costs.poolKey`, and `recoveryTarget` links (`src/cr.js:207–263`). It has exactly one explicitly shared definition, Paladin Channel Divinity, and no declared `consumers` arrays in these three class slices. The broader rules-defined pool inventory and link disposition is:

| Pool family | Expected key and consumers | Actual key/link evidence | Coverage |
|---|---|---|---|
| Paladin Channel Divinity | `class:paladin:channel-divinity`; all nine Oath Channel Divinity features use the one pool; TCE Harness Divine Power spends one use. | Exactly one generated row with this key and `shared=true` in each of the eight assigned oath fixtures. Harness `costs` link to this key with amount 1 matched. Generated `consumers` is `[]`; Crown cannot be selected in the UI. | Pool key and Harness cost verified; eight oath profiles checked. Oath consumer links are absent, and Crown is untested/blocked. |
| Paladin Lay on Hands | `class:paladin:lay-on-hands`; healing, disease cure, and poison cure draw from the same HP pool. | Pool key, `class-level-times(5)` maximum, and hit-points mode matched at every Paladin level 1–20. | Pool verified; consumer/action links for cure uses were not separately tested and are not declared in the generated consumer metadata. |
| Paladin spell slots | `class:spell-slot:1..5`; spellcasting/Divine Smite spend slots; Harness Divine Power restores a slot subject to `ceil(PB/2)`. | All five level-20 keys/maxima were captured in the K-S profile; Harness recovery amount and cap were tested in K-B. No per-slot `poolKey` appears in Harness recovery metadata. | Generated keys and cap verified; exact consumer-to-slot-key links and Divine Smite linkage were not tested. |
| Warlock Pact Magic slots | `class:warlock:pact-slots`; Pact Magic spells/invocations consume slots; Eldritch Master restores the pool. | K-S recorded the level-20 Pact pool at 4/4, 5th level. K-B verified Eldritch Master `recoveryTarget` equals `class:warlock:pact-slots`. | Pool key and Eldritch Master recovery link verified; individual spell/invocation consumer links were not tested or listed in the owned class-resource catalog. |
| Wizard spell slots | `class:spell-slot:1..9`; spellcasting and features use/recover slots, including Manifest Mind additional-use cost and Arcane Recovery. | All nine level-20 keys/maxima were captured in K-S. K-B verified Manifest Mind's generic `{type:"spell-slot", additionalUse:true}` cost, which has no pool key; Arcane Recovery output is missing. | Generated keys verified; specific feature-to-slot-key links were not tested/represented, and Arcane Recovery is missing. |

The class-resource slice contains no other explicit `shared:true` row or declared consumer list. Other multi-consumer interactions above are distinguished from catalog-declared shared pools; where exact links were not verified, they are explicitly left untested. K-B047 remains **BLOCKED**: the one explicit shared pool has an empty consumer list and Crown coverage is unavailable. This addendum preserves the original K-B047 and K-T001 records; no product code was changed.

### Auditor review — Tester 4

This is an independent rules/scope review of the recorded results against the 2014 rules, `.agent/CR/CR-class-resources-plan.md`, and `.agent/CR/class-resource-recovery-reference.md`. Existing case rows and statuses are preserved; the findings below do not silently reclassify them.

#### Findings by case/category

1. **K-S093; K-B040, K-B041, and K-B044 — Genie Bottled Respite uses the wrong maximum formula (High impact; High confidence).**  
   *Tasha's Cauldron of Everything*, The Genie, **Bottled Respite**: the vessel's duration is up to twice the Proficiency Bonus in hours, but after entering it the Warlock cannot enter again until finishing a Long Rest unless they expend a Spell Slot. Proficiency Bonus scales duration, not free entries. The report/reference's `PB/LR` expectation and the observed `6/6` therefore do not establish a correct use maximum. The in-scope free-use maximum is **1 per Long Rest**; paid re-entry is a distinct cost and is deferred by the plan's paid-reuse scope rule. The definition should move from the PB category to the fixed-maximum category: on the report's current inventory counts, K-B040 should account for 22 fixed-maximum definitions rather than 21, and K-B041 for 3 PB-maximum definitions rather than 4. Recheck the affected fixtures and update the reference/oracle disposition; do not treat the present PB match as a pass.

2. **K-S093; K-B048 — Genie Limited Wish and paid vessel re-entry are correctly recognized as rules, but are outside this phase's promised recovery model (Medium impact; High confidence).**  
   The report's rule descriptions—Limited Wish returning after 1d4 Long Rests, and a Spell Slot permitting another Bottled Respite entry—are consistent with the Genie feature text. However, the plan explicitly defers 1d4-Long-Rest and paid-reuse rules. Their absence is therefore a documented later-stage coverage gap, not an in-scope phase-one RAW mismatch. Likewise, Sanctuary Vessel adds the ability to bring companions into the existing vessel; it does not create a separate level-10 use pool or a new entry cooldown. The entry restriction originates in Bottled Respite. Keep these distinctions explicit when explaining K-S093's existing FAIL and K-B048's four-row cost inventory.

3. **K-S094–K-S104 — Arcane Recovery; K-S094 — Arcane Ward (Medium impact; High confidence).**  
   The RAW summaries are substantively correct: Wizard **Arcane Recovery** is usable once per day after finishing a Short Rest to regain eligible expended Spell Slots (PHB, Wizard class feature); **Arcane Ward** has maximum HP equal to twice Wizard level plus Intelligence modifier and regains HP through qualifying Abjuration-spell events, not an automatic Long Rest refill (PHB, School of Abjuration). At Wizard 20 and INT 14, 42 HP is correct. But the plan expressly defers daily and event-triggered recovery behavior. These absent outputs are valid known coverage gaps, not phase-one failures against the plan's stated supported recovery set. Arcane Recovery must not be described as ordinary automatic Short Rest restoration of Spell Slots. Preserve the current rows, but ask the tester to separate “RAW feature not represented” from “in-scope implementation mismatch”; the Arcane Recovery absence alone should not make all eleven Wizard cases fail the scoped profile.

4. **K-S091; K-B040, K-B044, K-B046 — Celestial source attribution (Medium impact; High confidence).**  
   The Celestial patron is published in *Xanathar's Guide to Everything* (Otherworldly Patron: The Celestial), not TCE. The plan's K-S091 “Celestial (TCE)” label is erroneous. The report correctly identifies that feature records use XGE while selected-subclass metadata says TCE: the feature source is correct and the selected-subclass source metadata is inconsistent with RAW. Retain the product metadata finding, but correct the test oracle/plan label to XGE before using source agreement as the assertion.

5. **K-B047; K-T001 Finding 2 — supported Channel Divinity consumer coverage and Crown scope (Medium impact; High confidence on scope, medium on the precise metadata contract).**  
   Crown is an SCAG Paladin Oath; the plan expressly includes only the SCAG Cleric Arcana Domain exception and excludes other SCAG content. An unavailable Crown selector is therefore not a product defect or a valid reason to block coverage of the supported Paladin Oaths. The eight supported oath fixtures do establish one shared Channel Divinity pool key each. However, the empty `consumers` arrays and lack of assertions that each supported Oath option references that key leave the plan's K-B047 requirement (“all related consumers, key, and costs”) unverified. Keep K-B047 open for that supported-consumer evidence, not for Crown. The K-T001 addendum is appropriately labeled as the Paladin/Warlock/Wizard slice; it does not establish the plan's global K-T001 coverage for Bardic Inspiration, Wild Shape, Ki, Rage, Sorcery Points, or Superiority Dice. Cross-reference those owners' evidence rather than implying this addendum closes the global invariant.

6. **K-B040–K-B050 counts and N/A/blocking claims (Low impact; Medium confidence).**  
   The primary K-S scope arithmetic is consistent: 8 Paladin + 7 Warlock + 11 Wizard = 26 cases. The K-B definition counts (21 fixed, 4 PB, 4 ability, 2 tier, 26 subclass-gated, 0 recoveryFromLevel, 2 scaling, 1 shared-pool, 4 cost-bearing, 0 recoveryOnly, 1 TCE option) describe overlapping categories across 33 definitions, so they should not be summed as unique definitions. Likewise, the per-category fixture counts total 271 while the narrative reports 170 unique primary profiles; that is possible when profiles are reused across categories, but the report does not provide a case/category-to-profile crosswalk to verify the counts independently. Clarify that these are overlapping category memberships, identify which fixtures satisfy each row, and distinguish the eight separately reapplied Mystic Arcanum assertions from the 170 unique profiles.

   K-B045 N/A is supported for the enumerated 33-row slice: it contains no `recoveryFromLevel` definition. K-B049 N/A is also accurate only as a statement that the slice contains no `recoveryOnly` catalog row; it does not mean no RAW recovery-only ability applies, since Arcane Recovery was separately identified and is deferred. Keep that qualification. K-B047 is not wholly blocked by Crown's exclusion, though the supported consumer-link assertion remains unresolved. Reconcile the K-B040/K-B041 counts after correcting Bottled Respite.

#### Requested follow-up for Tester 4

Please append a dated follow-up (without changing or deleting the original result rows) that: (1) corrects the Genie Bottled Respite oracle to one free entry per Long Rest, separates its twice-PB-hour duration and deferred Spell Slot re-entry, and reruns/reconciles K-S093 plus the affected K-B040/K-B041/K-B044 counts and assertions; (2) labels Limited Wish, paid re-entry, Arcane Recovery, and Arcane Ward as deferred/out-of-phase coverage rather than in-scope failures, while retaining the RAW gap notes; (3) corrects Celestial's expected source to XGE while retaining the actual TCE subclass-metadata discrepancy; (4) removes Crown from the supported K-B047 blocker and supplies consumer/key evidence for all supported Oaths, or states precisely which links cannot be represented; and (5) supplies a fixture crosswalk that reconciles the 170 unique profiles with category fixture counts and preserves the valid K-B045/K-B049 N/A qualifications. Leave all prior statuses intact until that follow-up explicitly documents any corrected test disposition.

### Tester 4 follow-up — Auditor review (2026-10-19)

The original case rows, matrix, and auditor comments above are preserved as the first-run record. The scoped dispositions below supersede earlier oracle/status interpretations. No product source, plan, or recovery-reference file was changed.

#### K-S093 and Bottled Respite retest

The RAW expectation is one free Bottled Respite entry per Long Rest. The vessel's duration is up to 2 × PB hours; PB does not increase the number of free entries. Expending a Spell Slot for another entry is paid re-entry and deferred scope. Limited Wish's 1d4-Long-Rest recovery is also deferred. Sanctuary Vessel adds companions to an existing entry; it creates no separate pool or level-10 entry cooldown.

I reran a unique level-20 Genie Warlock fixture and reapplied the corrected Bottled Respite boundary profiles in the browser. The level-20 generated maximum was 6/6, LR, rather than the expected 1/1, LR. The 13 reapplications below used generated maxima from the class-resource confirmation summary, not preserved current charges:

| Warlock level | Expected Bottled Respite | Actual generated maximum | Result |
|---:|---:|---:|---|
| 1 | 1/LR | 2/LR | FAIL |
| 4 | 1/LR | 2/LR | FAIL |
| 5 | 1/LR | 3/LR | FAIL |
| 6 | 1/LR | 3/LR | FAIL |
| 8 | 1/LR | 3/LR | FAIL |
| 9 | 1/LR | 4/LR | FAIL |
| 10 | 1/LR | 4/LR | FAIL |
| 12 | 1/LR | 4/LR | FAIL |
| 13 | 1/LR | 5/LR | FAIL |
| 14 | 1/LR | 5/LR | FAIL |
| 16 | 1/LR | 5/LR | FAIL |
| 17 | 1/LR | 6/LR | FAIL |
| 20 | 1/LR | 6/LR | FAIL |

This is an in-scope maximum mismatch: `K-S093` remains **FAIL**, now for Bottled Respite only. Elemental Gift remains PB/LR and matched. Missing Limited Wish and paid-re-entry behavior are retained as deferred coverage notes, not failures. No separate Sanctuary Vessel pool/restriction is expected.

The formula reclassification changes the definition counts to **22 fixed maxima** (21 + Bottled Respite) and **3 PB maxima** (4 − Bottled Respite). K-B041's unique fixture count changes from 45 to 42: the Genie levels 1, 4, and 5 were unique to Bottled Respite in the PB set; the other ten Bottled profiles overlap the still-PB Elemental Gift profiles. K-B041 remains **PASS** for the three PB definitions and the separate Harness spell-slot cap. K-B040 is **FAIL**: its original 39 unique fixture count is pre-correction, and the 13 Bottled profile applications were rerun; the saved primary artifact does not retain the fixture-ID intersection needed to calculate the corrected K-B040 unique-profile count without guessing. The 13 reapplications are existing profile inputs, not 13 new profiles.

K-B044 remains 26 subclass-gated definitions. Its original below-unlock/wrong-subclass assertions remain the first-run record; the corrected Genie expected maximum does not change the level-1 eligibility gate, which was present in the retest. The category's gate assertions pass; the metadata-inclusive category remains **FAIL** only for the Celestial source-metadata discrepancy described below.

#### Deferred scope and corrected K-S dispositions

Arcane Recovery (K-S094–K-S104) and Abjuration's Arcane Ward (K-S094) remain documented RAW coverage gaps, but their daily/event-triggered recovery behavior is deferred by this phase's supported recovery scope; their absence is not an in-scope K-S failure. Limited Wish and paid Bottled Respite re-entry are likewise deferred. These scope corrections do not erase the recorded missing outputs.

The Celestial oracle is **XGE**. Its feature records correctly report XGE, but the selected-subclass metadata still reports TCE; this is a product metadata finding, not an expected-source mismatch. Corrected scoped K-S dispositions:

| Cases | Corrected status | Basis |
|---|---|---|
| K-S056–K-S063 | PASS (8) | Assigned Paladin outputs match the scoped oracle. |
| K-S087–K-S090 | PASS (4) | Assigned Warlock outputs match the scoped oracle. |
| K-S091 | FAIL | Expected Celestial source is XGE; actual feature sources are XGE but selected-subclass source metadata is TCE. |
| K-S092 | PASS | Fathomless outputs match the scoped oracle. |
| K-S093 | FAIL | Bottled Respite actual maximum scales with PB instead of remaining 1/LR. |
| K-S094–K-S104 | PASS (11) | Scoped subclass outputs match; Arcane Recovery/Arcane Ward absences are deferred, not failures. |

Corrected K-S total: **24 PASS, 2 FAIL**. The former Arcane Recovery/Arcane Ward/Limited Wish/Sanctuary Vessel findings remain recorded as deferred or non-pool gaps, not scoped case failures.

#### Corrected K-B dispositions and supported Channel Divinity coverage

| Case | Corrected inventory / fixture reconciliation | Corrected disposition |
|---|---|---|
| K-B040 fixed maxima | 22 definitions. Original 39 unique fixtures are pre-correction; 13 Bottled Respite profile applications were rerun. Corrected unique K-B040 count is not recoverable from the saved aggregate-only artifact. | FAIL — Bottled Respite is PB-scaled; Celestial metadata mismatch also remains. |
| K-B041 PB maxima | 3 PB definitions, plus the Harness spell-slot cap; 42 unique fixtures (45 less the three Genie-only PB profiles at levels 1/4/5). | PASS for the remaining PB definitions and Harness cap. |
| K-B042 ability maxima | 4 definitions, 28 fixtures. | PASS. |
| K-B043 level tiers | 2 catalog definitions, 20 primary fixtures. | PASS. The eight Mystic Arcanum reapplications are separate supplemental checks, not part of the 170-profile primary set. |
| K-B044 subclass gates | 26 definitions, 52 first-run fixtures. | Gate assertions pass; metadata-inclusive result remains FAIL only on Celestial source metadata. |
| K-B045 `recoveryFromLevel` | 0 definitions, 0 fixtures after checking all 33 owned-slice rows. | N/A — no applicable catalog definition. |
| K-B046 die/count/uses scaling | 2 definitions, 42 fixtures. | Scaling/die assertions pass; metadata-inclusive result remains FAIL on Celestial source metadata. |
| K-B047 shared consumers/key | 1 shared pool, 8 supported Oath profiles. | BLOCKED — not because of Crown; feature-level consumer links for the supported Oaths are not represented in generated output. |
| K-B048 costs/alternatives | 4 cost-bearing definitions, 20 fixtures; no alternative-cost definition. | PASS. Paid Bottled Respite re-entry remains deferred and is not a fifth in-scope cost row. |
| K-B049 recovery-only presence | 0 definitions, 0 fixtures after checking all 33 owned-slice rows. | N/A only for the absence of a `recoveryOnly` catalog row. It does not assert that no RAW recovery-only ability exists; Arcane Recovery is separately documented and deferred. |
| K-B050 TCE option unlock | 1 definition, 17 fixtures. | PASS. |

For K-B047, the supported set is Ancients, Devotion, Vengeance, Oathbreaker, Conquest, Redemption, Glory, and Watchers. Each of those eight runtime profiles generated exactly one `class:paladin:channel-divinity` row with `shared=true`; every generated `consumers` list was `[]`. Harness Divine Power's explicit cost link to that key, amount 1, was verified separately. The current output has no per-Oath consumer record/link for any of those eight Oath options, so those feature-to-key links cannot be verified from this product surface; K-B047 remains open for that reason. Crown is an unsupported SCAG option and is removed from the supported-scope blocker. This owned-slice disposition does not close global K-T001.

#### Fixture-count reconciliation

The original run's category counts are overlapping category memberships, not disjoint fixture sets:

| Category | Definitions before Bottled correction | Original category fixtures | Corrected note |
|---|---:|---:|---|
| K-B040 | 21 fixed | 39 | 22 fixed after reclassification; corrected unique fixture count unavailable in the saved aggregate. |
| K-B041 | 4 PB (+ Harness cap) | 45 | 3 PB (+ Harness cap); 42 unique profiles after removing Genie levels 1/4/5 unique to Bottled Respite. |
| K-B042 | 4 ability | 28 | Unchanged. |
| K-B043 | 2 level-tier rows | 20 | Eight Mystic Arcanum reapplications are separate supplemental checks. |
| K-B044 | 26 subclass-gated | 52 | Unchanged; source-metadata failures are separately identified. |
| K-B045 | 0 `recoveryFromLevel` | 0 | N/A, qualified above. |
| K-B046 | 2 scaling | 42 | Unchanged. |
| K-B047 | 1 shared pool | 8 | Eight supported Oaths; consumer-link representation remains blocked. |
| K-B048 | 4 cost-bearing | 20 | Unchanged; paid re-entry deferred. |
| K-B049 | 0 `recoveryOnly` | 0 | N/A, qualified above. |
| K-B050 | 1 TCE option | 17 | Unchanged. |

The pre-correction category fixture counts sum to 271; the primary run reports 170 unique profile inputs. The 101 difference is overlapping category membership, not 101 additional unique profiles. The 13 Bottled Respite reapplications reuse profile levels already present in the original 170, and the eight Mystic Arcanum checks are separate supplemental reapplications. The saved primary result contains aggregate category counts and definition values, but no fixture-ID-to-category membership map; an exact ID-level crosswalk cannot be reconstructed from that artifact, so no fixture IDs or corrected K-B040 unique count are invented. A full 170-profile rerun with per-profile category tags would be required to produce that exact crosswalk.

#### Retest evidence and cleanup

- Independent oracle: `.agent/CR/class-resource-recovery-reference.md:163–165` (Celestial XGE; Genie uses, duration, and deferred rules), `:173` (Arcane Recovery), `:181` (Arcane Ward); contract `.agent/CR/CR-class-resources-plan.md:232`.
- Implementation-under-test evidence only: `src/cr.js:246,250–251` (Celestial and Genie resource definitions).
- Original 170-profile aggregate: `C:\Users\Alpha\AppData\Local\Temp\1792342715004-copilot-tool-output-a668e9dfcccb4dfcb6216ed441524f3b.txt`.
- Level-20 Genie retest: `C:\Users\Alpha\AppData\Local\Temp\1792344851353-copilot-tool-output-891ef0fd5dc74d4199a09a9ade810e7a.txt`.
- 13-level Bottled Respite recheck: `C:\Users\Alpha\AppData\Local\Temp\1792345030486-copilot-tool-output-f80616c634e14d7eaeccc473fe960bfc.txt`.
- Retest used the unique temporary character `T4-Auditor-20261019-0230`; localStorage was empty before setup and restored to `[]` afterward. The temporary local server was stopped.

K-B047 remains blocked, and the exact ID-level K-B profile/category crosswalk remains unavailable from the saved aggregate. Step K is not declared complete.

### Auditor follow-up — Tester 4 (2026-10-19)

The latest follow-up correctly addresses the substantive RAW corrections and transparently identifies the remaining evidence gaps. The original findings and tester statuses above remain preserved.

#### Verified corrections

- **Genie / K-S093 and K-B040–K-B041:** The corrected expectation is right: Bottled Respite permits one free vessel entry before a Long Rest; PB scales its duration (up to twice PB hours), not free-entry count. The reported 13-level comparison supports an in-scope maximum mismatch: actual maxima follow PB, while expected is 1/LR. The revised category counts (22 fixed definitions; 3 PB definitions) and K-B041 reduction to 42 profiles are arithmetically consistent with the stated overlap at levels 6, 8, 9, 10, 12, 13, 14, 16, 17, and 20. Limited Wish, paid re-entry, and a separate Sanctuary Vessel pool/cooldown are correctly dispositioned as deferred or not separate outputs.
- **Celestial / K-S091 and affected K-B cases:** XGE is the correct source. The report correctly distinguishes XGE feature-source metadata from the still-incorrect TCE selected-subclass metadata. This remains a product metadata finding.
- **Deferred features:** The corrected distinction is consistent with the plan: Arcane Recovery's daily recovery and Arcane Ward's event-triggered recovery are outside the stated phase scope; their RAW absences remain coverage notes, not scoped K-S failures. Limited Wish's 1d4-Long-Rest recovery and paid vessel re-entry are also deferred. The revised 24 PASS / 2 FAIL K-S disposition follows from those scope decisions and the Celestial and Bottled Respite mismatches.
- **Other category dispositions:** K-B045 and K-B049 are valid N/A claims for the enumerated 33-row catalog slice, with the report's qualification that K-B049 does not imply Arcane Recovery is absent from RAW. Removing Crown as a supported-scope blocker is correct because the plan excludes SCAG Paladin options.

**Oracle caveat:** The report says the recovery-reference file was not changed, but that reference's Genie entry still describes Bottled Respite as PB uses per Long Rest. That source cannot support the corrected 1/LR assertion as currently written. The latest report's direct TCE rule description is the correct oracle for this audit; explicitly flag the conflicting reference text and route its correction to the reference owner. Do not silently cite the contradictory entry as supporting evidence.

#### Remaining gaps — return to Tester 4

1. **K-B047 supported Oath consumer evidence (still BLOCKED; High confidence).** The follow-up correctly confirms that the eight supported Oath fixtures each have one shared pool and that their generated `consumers` arrays are empty. This verifies pool identity and the Harness Divine Power cost, but it does **not** verify the plan's requirement that each consumer points to that pool. Provide a consumer-to-key crosswalk for all supported Channel Divinity options—Ancients (Nature's Wrath, Turn the Faithless), Devotion (Sacred Weapon, Turn the Unholy), Vengeance (Abjure Enemy, Vow of Enmity), Oathbreaker (Control Undead, Dreadful Aspect), Conquest (Conquering Presence, Guided Strike), Redemption (Emissary of Peace, Rebuke the Violent), Glory (Peerless Athlete, Inspiring Smite), and Watchers (Watcher’s Will, Abjure the Extraplanar)—showing each uses `class:paladin:channel-divinity` without creating another pool. If the product/catalog cannot represent feature-level links, state that explicitly as the unresolved contract/data-model gap and keep K-B047 blocked. Crown is excluded and needs no fixture.

2. **Exact K-B fixture crosswalk (still not supplied; High confidence).** The narrative explains that category counts overlap and correctly refuses to invent fixture IDs, but it does not satisfy the requested exact crosswalk. The totals 271 category memberships and 170 unique primary profiles establish only aggregate arithmetic; they do not identify which of the 170 profiles contributes to each K-B040–K-B050 category, nor independently verify the corrected K-B040 unique count. Supply a table or machine-readable listing with one stable ID per unique primary profile (exactly 170), its tested inputs, and all applicable K-B case/category memberships; include category-level deduplicated totals that reconcile to the reported counts. Mark the 13 Bottled Respite reapplications and eight Mystic Arcanum supplemental checks as reuses/supplemental runs, not extra primary profiles. If the original artifact cannot provide this, rerun the 170-profile matrix with per-profile category tags and report the corrected K-B040 count.

**Disposition:** The corrected RAW/scope conclusions above are accepted. K-B047 remains **BLOCKED** pending consumer-to-key evidence or an explicit representation limitation, and the requested exact 170-profile/category crosswalk remains outstanding. Return these two items to Tester 4 for follow-up; this review does not close Step K or alter earlier rows/statuses.


### Tester 4 follow-up ? exact crosswalk and Oath consumers (2026-10-19)

The prior auditor disposition and every earlier K-B/K-S row remain intact above. This response supplies the two returned items. No product source or other tester report was changed.

#### Tagged runtime rerun and corrected category reconciliation

The isolated browser runner completed **170/170** profiles for temporary character `K-B-T4-Crosswalk-20261019-1030` with no runtime error. Its actual `fixtureCrosswalk` output contains exactly 170 unique IDs, and the per-profile memberships below sum to 285 category memberships (overlap is expected). The fresh-origin `localStorage` baseline was empty and the runner's final `cleanupKeys` was `[]`; `sessionStorage` was cleared before setup.

| Case | Category | Definitions | Deduplicated profiles | Profiles with an asserted mismatch | Status |
|---|---|---:|---:|---:|---|
| K-B040 | fixed maxima | 22 | 52 | 15 | FAIL |
| K-B041 | PB maxima plus Harness half-PB-up cap | 3 | 42 | 9 | FAIL |
| K-B042 | ability maxima | 4 | 28 | 0 | PASS |
| K-B043 | level tiers | 2 | 20 | 0 | PASS |
| K-B044 | subclass gates | 26 | 56 | 10 | FAIL |
| K-B045 | recoveryFromLevel presence | 0 | 0 | 0 | N/A |
| K-B046 | die/count/uses scaling | 2 | 42 | 20 | FAIL |
| K-B047 | shared pool consumers/keys | 1 | 8 | 0 | BLOCKED |
| K-B048 | costs and alternatives | 4 | 20 | 0 | PASS |
| K-B049 | recovery-only presence | 0 | 0 | 0 | N/A |
| K-B050 | TCE option unlock | 1 | 17 | 0 | PASS |

The corrected inventory is **22 fixed / 3 PB** definitions (the fourth prior PB row, Genie Bottled Respite, is fixed at one free use per Long Rest). K-B040 now has 52 distinct tagged profiles; K-B041 has 42, including the separate Harness half-PB-up slot-recovery cap. The earlier 39/45 counts remain in their original table as historical aggregate values; this tagged rerun supersedes them for the corrected crosswalk. K-B044 is 56 profiles in the actual tagged output; the prior aggregate's 52 did not include all four distinct tagged wrong-subclass profiles. K-B045 and K-B049 remain N/A only for the absence of such rows in the complete 33-definition owned slice; this does not imply the RAW features noted below are absent.

#### Bottled Respite correction ? K-S093 and K-B040/K-B041/K-B044

Independent TCE rules expectation: **one free vessel entry per Long Rest**. Twice PB is the maximum duration in hours, not free-entry count; spending a Spell Slot for another entry is paid re-entry and remains deferred. The tagged run exercised the 13 distinct levels below; the expected maximum is 1 at every row, while the actual generated formula is `{'type': 'pb'}` and actual maximum follows PB.

| Warlock level | PB | Expected free uses | Actual maximum |
|---:|---:|---:|---:|
| 1 | 2 | 1 | 2 |
| 4 | 2 | 1 | 2 |
| 5 | 3 | 1 | 3 |
| 6 | 3 | 1 | 3 |
| 8 | 3 | 1 | 3 |
| 9 | 4 | 1 | 4 |
| 10 | 4 | 1 | 4 |
| 12 | 4 | 1 | 4 |
| 13 | 5 | 1 | 5 |
| 14 | 5 | 1 | 5 |
| 16 | 5 | 1 | 5 |
| 17 | 6 | 1 | 6 |
| 20 | 6 | 1 | 6 |

Thus K-S093 remains **FAIL** for the in-scope maximum mismatch. The generated recovery is Long Rest and the source is TCE; only the maximum formula is wrong. This correction does not count the 13 reapplications as extra unique profiles; all 13 level inputs occur in the 170-profile crosswalk. The separate earlier 13-level UI recheck remains supplemental evidence.

#### Supported Oath consumer-to-key crosswalk ? K-B047 / K-T001 Finding 2

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

- Tagged 170-profile browser result, including per-profile tags, category summaries, generated definitions, shared-pool observations, and cleanup: `C:\Users\Alpha\AppData\Local\Temp\1792374152767-copilot-tool-output-c356600cc1be4dc99caf8505dd4d0542.txt`.
- Earlier 13-level Bottled Respite UI retest: `C:\Users\Alpha\AppData\Local\Temp\1792345030486-copilot-tool-output-f80616c634e14d7eaeccc473fe960bfc.txt`.
- Rules expectations: `.agent/CR/class-resource-recovery-reference.md:112?120, 163?165, 173, 181`; K-B contract: `.agent/CR/CR-class-resources-plan.md:232`. Implementation-under-test metadata evidence only: `src/cr.js:209, 212, 237, 246, 250?251, 263`.

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
