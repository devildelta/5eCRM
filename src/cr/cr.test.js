const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const flexibleCasting = require('./flexible-casting.js');
const resourcePools = require('./resource-pools.js');

function sorceryPoints(current, max) {
  return {
    current: current,
    max: max,
    generatedClass: {
      kind: 'class-resource',
      resourceKey: 'class:sorcerer:sorcery-points'
    }
  };
}

function spellSlot(level, current, max) {
  return {
    current: current,
    max: max,
    generatedClass: {
      kind: 'spell-slot',
      slotLevel: level
    }
  };
}

function pactSlot(level, current, max) {
  return {
    current: current,
    max: max,
    generatedClass: {
      kind: 'pact-slot',
      slotLevel: level
    }
  };
}

function resource(current, max, cooldown, generatedClass) {
  return {
    current: current,
    max: max,
    cooldown: cooldown,
    generatedClass: generatedClass
  };
}

test('creation costs follow the 2014 Flexible Casting table', () => {
  assert.deepEqual(
    [1, 2, 3, 4, 5].map(flexibleCasting.slotCreationCost),
    [2, 3, 5, 6, 7]
  );
  assert.equal(flexibleCasting.slotCreationCost(0), null);
  assert.equal(flexibleCasting.slotCreationCost(6), null);
});

test('resource pool actions reject display-only and accumulative pools where appropriate', () => {
  const resources = [
    resource(2, 3, '短休'),
    resource(1, 1, 'NO'),
    resource(2, 4, '長休', { accumulative: true })
  ];

  assert.equal(resourcePools.use(resources, 0), true);
  assert.equal(resources[0].current, 1);
  assert.equal(resourcePools.use(resources, 1), false);
  assert.equal(resourcePools.use(resources, 2), false);
  assert.equal(resourcePools.setCount(resources, 1, 0), false);
  assert.equal(resourcePools.setCount(resources, 2, 0), false);
  assert.equal(resourcePools.reset(resources, 1), false);
  assert.equal(resourcePools.reset(resources, 2), false);
  assert.equal(resourcePools.setCount(resources, 0, 3), true);
  assert.equal(resourcePools.reset(resources, 0), true);
  assert.equal(resources[0].current, 3);
});

test('accumulative pool adjustments stay within available capacity', () => {
  const resources = [resource(2, 4, '長休', { accumulative: true })];

  assert.equal(resourcePools.adjustAccumulative(resources, 0, 'gain', 2), true);
  assert.equal(resources[0].current, 4);
  assert.equal(resourcePools.adjustAccumulative(resources, 0, 'gain', 1), false);
  assert.equal(resourcePools.adjustAccumulative(resources, 0, 'spend', 3), true);
  assert.equal(resources[0].current, 1);
  assert.equal(resourcePools.adjustAccumulative(resources, 0, 'spend', 2), false);
});

test('cooldown recovery preserves partial recovery, reset targets, and hit-die recovery', () => {
  const resources = [
    resource(1, 4, '短休'),
    resource(1, 4, '長休', { shortRestRecovery: 2 }),
    resource(0, 5, '長休', { longRestResetTo: 1 }),
    resource(1, 6, '長休', { kind: 'hit-dice' }),
    resource(0, 2, 'NO')
  ];
  const isHitDieResource = function (entry) {
    return Boolean(entry.generatedClass && entry.generatedClass.kind === 'hit-dice');
  };

  assert.deepEqual(resourcePools.resetCooldown(resources, '短休', isHitDieResource), [0, 1]);
  assert.deepEqual(resources.map(function (entry) { return entry.current; }), [4, 3, 0, 1, 0]);
  assert.deepEqual(resourcePools.resetCooldown(resources, '長休', isHitDieResource), [1, 2, 3]);
  assert.deepEqual(resources.map(function (entry) { return entry.current; }), [4, 4, 1, 4, 0]);
});

test('available levels include only existing standard spell slots from levels 1 to 5', () => {
  const resources = [
    spellSlot(3, 1, 2),
    pactSlot(1, 1, 1),
    spellSlot(1, 1, 2),
    spellSlot(6, 1, 1),
    spellSlot(2, 0, 0),
    spellSlot(1, 0, 1),
    spellSlot(5, 1, 1)
  ];

  assert.deepEqual(
    flexibleCasting.availableSlotEntries(resources).map(entry => [entry.level, entry.index]),
    [[1, 2], [3, 0], [5, 6]]
  );
});

test('points-to-slot requires enough points and room under the slot maximum', () => {
  const points = sorceryPoints(3, 5);
  const slot = spellSlot(2, 1, 2);

  assert.deepEqual(flexibleCasting.getAvailability(points, slot, 2), {
    pointsToSlot: true,
    slotToPoints: true
  });
  assert.equal(flexibleCasting.convertPointsToSlot(points, slot, 2), true);
  assert.equal(points.current, 0);
  assert.equal(slot.current, 2);
  assert.equal(flexibleCasting.getAvailability(points, slot, 2).pointsToSlot, false);
  assert.equal(flexibleCasting.convertPointsToSlot(points, slot, 2), false);
});

test('resource pool manager applies Flexible Casting to the selected resources', () => {
  const resources = [
    sorceryPoints(5, 5),
    spellSlot(2, 0, 1),
    pactSlot(2, 1, 1)
  ];

  assert.equal(resourcePools.convertFlexibleCasting(resources, 'points-to-slot', 0, 1, 2), true);
  assert.deepEqual(resources.map(function (entry) { return entry.current; }), [2, 1, 1]);
  assert.equal(resourcePools.convertFlexibleCasting(resources, 'slot-to-points', 0, 1, 2), true);
  assert.deepEqual(resources.map(function (entry) { return entry.current; }), [4, 0, 1]);
});

test('slot-to-points grants points equal to slot level without exceeding the pool maximum', () => {
  const points = sorceryPoints(4, 7);
  const slot = spellSlot(3, 1, 2);

  assert.equal(flexibleCasting.convertSlotToPoints(points, slot, 3), true);
  assert.equal(points.current, 7);
  assert.equal(slot.current, 0);
  assert.equal(flexibleCasting.getAvailability(points, spellSlot(3, 1, 2), 3).slotToPoints, false);
  assert.equal(flexibleCasting.convertSlotToPoints(points, spellSlot(3, 1, 2), 3), false);
});

test('conversions reject pact slots, mismatched levels, and invalid resource counts', () => {
  const points = sorceryPoints(5, 5);
  const pact = pactSlot(1, 1, 1);
  const mismatchedSlot = spellSlot(2, 1, 1);
  const invalidPoints = sorceryPoints(6, 5);

  assert.equal(flexibleCasting.convertSlotToPoints(points, pact, 1), false);
  assert.equal(flexibleCasting.convertPointsToSlot(points, mismatchedSlot, 1), false);
  assert.equal(flexibleCasting.getAvailability(invalidPoints, spellSlot(1, 0, 1), 1).pointsToSlot, false);
  assert.equal(flexibleCasting.getAvailability(points, spellSlot(1, 0, 1), 1).slotToPoints, false);
});

test('both CR locale files contain Flexible Casting action labels', () => {
  ['zh-HK', 'zh-TW'].forEach(function (locale) {
    const localePath = path.join(__dirname, 'locales', locale + '.json');
    const messages = JSON.parse(fs.readFileSync(localePath, 'utf8'));
    assert.ok(messages.sorceryPointsToSlotAriaTemplate);
    assert.ok(messages.spellSlotToSorceryPointsAriaTemplate);
    assert.ok(messages.sorceryConvertSlotLabel);
  });
});
