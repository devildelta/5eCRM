(function () {
  'use strict';

  const slotCreationCosts = [2, 3, 5, 6, 7];

  function slotCreationCost(level) {
    return Number.isInteger(level) && level >= 1 && level <= slotCreationCosts.length
      ? slotCreationCosts[level - 1]
      : null;
  }

  function isSorceryPointPool(resource) {
    const metadata = resource && resource.generatedClass;
    return Boolean(metadata && metadata.kind === 'class-resource' &&
      metadata.resourceKey === 'class:sorcerer:sorcery-points');
  }

  function isStandardSpellSlot(resource, level) {
    const metadata = resource && resource.generatedClass;
    return Boolean(metadata && metadata.kind === 'spell-slot' && metadata.slotLevel === level);
  }

  function availableSlotEntries(resources) {
    const slotsByLevel = new Map();
    (Array.isArray(resources) ? resources : []).forEach(function (resource, index) {
      const metadata = resource && resource.generatedClass;
      const maximum = Number(resource && resource.max);
      if (!metadata || metadata.kind !== 'spell-slot' || !Number.isInteger(metadata.slotLevel) ||
        metadata.slotLevel < 1 || metadata.slotLevel > 5 || !Number.isSafeInteger(maximum) ||
        maximum <= 0 || slotsByLevel.has(metadata.slotLevel)) return;
      slotsByLevel.set(metadata.slotLevel, {
        level: metadata.slotLevel,
        resource: resource,
        index: index
      });
    });
    return Array.from(slotsByLevel.values()).sort(function (left, right) {
      return left.level - right.level;
    });
  }

  function getAvailability(sorceryPoints, spellSlot, level) {
    const pointCurrent = Number(sorceryPoints && sorceryPoints.current);
    const pointMaximum = Number(sorceryPoints && sorceryPoints.max);
    const slotCurrent = Number(spellSlot && spellSlot.current);
    const slotMaximum = Number(spellSlot && spellSlot.max);
    const cost = slotCreationCost(level);
    const validPair = cost !== null && isSorceryPointPool(sorceryPoints) &&
      isStandardSpellSlot(spellSlot, level);
    const validCounts = Number.isSafeInteger(pointCurrent) && Number.isSafeInteger(pointMaximum) &&
      Number.isSafeInteger(slotCurrent) && Number.isSafeInteger(slotMaximum) &&
      pointCurrent >= 0 && pointCurrent <= pointMaximum &&
      slotCurrent >= 0 && slotCurrent <= slotMaximum;
    if (!validPair || !validCounts) return { pointsToSlot: false, slotToPoints: false };
    return {
      pointsToSlot: pointCurrent >= cost && slotCurrent < slotMaximum,
      slotToPoints: slotCurrent > 0 && pointCurrent + level <= pointMaximum
    };
  }

  function convertPointsToSlot(sorceryPoints, spellSlot, level) {
    if (!getAvailability(sorceryPoints, spellSlot, level).pointsToSlot) return false;
    sorceryPoints.current = Number(sorceryPoints.current) - slotCreationCost(level);
    spellSlot.current = Number(spellSlot.current) + 1;
    return true;
  }

  function convertSlotToPoints(sorceryPoints, spellSlot, level) {
    if (!getAvailability(sorceryPoints, spellSlot, level).slotToPoints) return false;
    spellSlot.current = Number(spellSlot.current) - 1;
    sorceryPoints.current = Number(sorceryPoints.current) + level;
    return true;
  }

  const api = Object.freeze({
    availableSlotEntries: availableSlotEntries,
    convertPointsToSlot: convertPointsToSlot,
    convertSlotToPoints: convertSlotToPoints,
    getAvailability: getAvailability,
    slotCreationCost: slotCreationCost
  });

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
    return;
  }

  const app = document.getElementById('crApp');
  if (!app) throw new Error('Unable to find the CR app root for Flexible Casting rules.');
  Object.defineProperty(app, 'flexibleCastingRules', { value: api });
})();
