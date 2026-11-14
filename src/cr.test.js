const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const flexibleCasting = require('./cr-flexible-casting.js');

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

test('creation costs follow the 2014 Flexible Casting table', () => {
  assert.deepEqual(
    [1, 2, 3, 4, 5].map(flexibleCasting.slotCreationCost),
    [2, 3, 5, 6, 7]
  );
  assert.equal(flexibleCasting.slotCreationCost(0), null);
  assert.equal(flexibleCasting.slotCreationCost(6), null);
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
