const assert = require('node:assert/strict');
const test = require('node:test');
const hitPoints = require('./hit-points.js');

test('standard hit point formula includes first-level maximum and rounded-up later averages', () => {
  const standardMaximum = hitPoints.calculateBaseMaximum(
    [{ level: 14, hitDie: 'd8' }],
    18
  );
  const hillDwarfMaximum = hitPoints.calculateBaseMaximum(
    [{ level: 14, hitDie: 'd8' }],
    18,
    1,
    0
  );

  assert.equal(standardMaximum, 129);
  assert.equal(hillDwarfMaximum, 143);
});

test('HP adjustment buttons follow the 1-2-5 sequence up to maximum HP', () => {
  assert.deepEqual(hitPoints.adjustmentAmounts(0), []);
  assert.deepEqual(hitPoints.adjustmentAmounts(1), [1]);
  assert.deepEqual(hitPoints.adjustmentAmounts(45), [1, 2, 5, 10, 20]);
  assert.deepEqual(hitPoints.adjustmentAmounts(143), [1, 2, 5, 10, 20, 50, 100]);

  const state = hitPoints.createState();
  assert.equal(hitPoints.upsertMaximumModifier(state, 5).ok, true);
  const effectiveMaximum = hitPoints.calculateMaximum(45, state);
  assert.deepEqual(hitPoints.adjustmentAmounts(effectiveMaximum), [1, 2, 5, 10, 20, 50]);
});

test('multiclass hit points apply the first-level maximum to the first class only', () => {
  assert.equal(hitPoints.calculateBaseMaximum([
    { level: 1, hitDie: 'd12' },
    { level: 1, hitDie: 'd6' }
  ], 8), 14);
  assert.equal(hitPoints.calculateBaseMaximum([
    { level: 1, hitDie: 'd12' },
    { level: 1, hitDie: 'd6' }
  ], 8, 0, 3), 17);
});

test('per-level and constant offsets support rolled hit point totals', () => {
  const baseMaximum = hitPoints.calculateBaseMaximum(
    [{ level: 3, hitDie: 'd8' }],
    14,
    -1,
    4
  );

  assert.equal(baseMaximum, 25);
});

test('hit point operations decrement safely and reset to the supplied maximum', () => {
  const state = hitPoints.createState();
  assert.equal(hitPoints.reset(state, 143), true);
  assert.equal(hitPoints.decrease(state, 1), true);
  assert.equal(state.current, 142);
  assert.equal(hitPoints.decrease(state, 10), true);
  assert.equal(state.current, 132);
  assert.equal(hitPoints.decrease(state, 100), true);
  assert.equal(state.current, 32);
  assert.equal(hitPoints.decrease(state, 100), true);
  assert.equal(state.current, 0);
  assert.equal(hitPoints.decrease(state, 1), false);
  assert.equal(hitPoints.reset(state, 143), true);
  assert.equal(state.current, 143);
});

test('increasing HP is capped at maximum and rejects invalid adjustments', () => {
  const state = hitPoints.createState();
  assert.equal(hitPoints.reset(state, 18), true);
  assert.equal(hitPoints.decrease(state, 10), true);

  assert.equal(hitPoints.increase(state, 5, 18), true);
  assert.equal(state.current, 13);
  assert.equal(hitPoints.increase(state, 20, 18), true);
  assert.equal(state.current, 18);
  assert.equal(hitPoints.increase(state, 1, 18), false);
  assert.equal(hitPoints.increase(state, 0, 18), false);
  assert.equal(state.current, 18);
});

test('damage reduces temporary HP before current HP', () => {
  const state = hitPoints.createState();
  assert.equal(hitPoints.reset(state, 20), true);
  assert.equal(hitPoints.setTemporary(state, 5), true);

  assert.equal(hitPoints.decrease(state, 3), true);
  assert.equal(state.temporary, 2);
  assert.equal(state.current, 20);
  assert.equal(hitPoints.decrease(state, 5), true);
  assert.equal(state.temporary, null);
  assert.equal(state.current, 17);
});

test('damage can still consume temporary HP when current HP is zero', () => {
  const state = hitPoints.createState();
  assert.equal(hitPoints.reset(state, 0), true);
  assert.equal(hitPoints.setTemporary(state, 2), true);

  assert.equal(hitPoints.decrease(state, 1), true);
  assert.equal(state.temporary, 1);
  assert.equal(state.current, 0);
});

test('only one temporary hit point value is kept and a new value replaces the old one', () => {
  const state = hitPoints.createState();

  assert.equal(hitPoints.setTemporary(state, 9), true);
  assert.equal(hitPoints.setTemporary(state, 12), true);
  assert.equal(state.temporary, 12);
  assert.equal(hitPoints.removeTemporary(state), true);
  assert.equal(hitPoints.removeTemporary(state), false);
  assert.equal(state.temporary, null);
});

test('clearing all HP tags removes temporary HP and applies the net maximum modifier change', () => {
  const state = hitPoints.createState();
  assert.equal(hitPoints.reset(state, 30), true);
  assert.equal(hitPoints.setTemporary(state, 9), true);
  assert.equal(hitPoints.upsertMaximumModifier(state, 15).ok, true);
  assert.equal(hitPoints.upsertMaximumModifier(state, -5).ok, true);
  assert.equal(state.current, 40);

  assert.equal(hitPoints.clearModifiers(state), true);
  assert.equal(state.current, 30);
  assert.equal(state.temporary, null);
  assert.deepEqual(state.maximumModifiers, []);
  assert.equal(hitPoints.clearModifiers(state), false);
});

test('maximum hit point modifiers are capped at five and editable by index', () => {
  const state = hitPoints.createState();
  for (let index = 0; index < hitPoints.maximumModifiersLimit; index += 1) {
    assert.equal(hitPoints.upsertMaximumModifier(state, index + 1).ok, true);
  }
  assert.deepEqual(hitPoints.upsertMaximumModifier(state, 1), {
    ok: false,
    reason: 'limit-reached'
  });
  assert.deepEqual(hitPoints.upsertMaximumModifier(state, -2, 0), {
    ok: true,
    reason: ''
  });
  assert.equal(hitPoints.removeMaximumModifier(state, 0), true);
  assert.equal(state.maximumModifiers.length, 4);
  assert.equal(hitPoints.calculateMaximum(100, state), 114);
});

test('adding, changing, and removing maximum modifiers adjust current HP by the same amount', () => {
  const state = hitPoints.createState();
  assert.equal(hitPoints.reset(state, 72), true);
  assert.equal(hitPoints.setTemporary(state, 9), true);
  assert.equal(hitPoints.upsertMaximumModifier(state, 15).ok, true);
  assert.equal(hitPoints.calculateMaximum(129, state), 144);
  assert.equal(state.current, 87);
  assert.equal(hitPoints.upsertMaximumModifier(state, 20, 0).ok, true);
  assert.equal(state.current, 92);
  assert.equal(hitPoints.removeMaximumModifier(state, 0), true);
  assert.equal(state.current, 72);
  assert.equal(state.temporary, 9);
});

test('removing a negative maximum HP modifier restores current HP without going below zero', () => {
  const state = hitPoints.createState();
  assert.equal(hitPoints.reset(state, 4), true);
  assert.equal(hitPoints.upsertMaximumModifier(state, -8).ok, true);
  assert.equal(state.current, 0);
  assert.equal(hitPoints.removeMaximumModifier(state, 0), true);
  assert.equal(state.current, 8);
});

test('legacy source labels are removed when hit point states are copied', () => {
  const state = hitPoints.copyState({
    current: 42,
    perLevelOffset: 0,
    constantOffset: 0,
    temporary: { source: 'Protector', amount: 9 },
    maximumModifiers: [
      { source: 'Aid', amount: 15 },
      { source: 'Curse', amount: -3 }
    ]
  });

  assert.deepEqual(state, {
    current: 42,
    perLevelOffset: 0,
    constantOffset: 0,
    temporary: 9,
    maximumModifiers: [15, -3]
  });
});

test('hit point states reject invalid modifier shapes and limits', () => {
  const state = hitPoints.createState();
  state.maximumModifiers = Array.from({ length: 6 }, function (_, index) {
    return { source: 'Source ' + index, amount: 1 };
  });
  assert.equal(hitPoints.isValidState(state), false);
});
