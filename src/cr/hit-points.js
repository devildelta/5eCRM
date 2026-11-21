(function () {
  'use strict';

  const hitDieMaximums = { d6: 6, d8: 8, d10: 10, d12: 12 };
  const maximumModifiersLimit = 5;
  const maximumOffset = 99999;

  function createHitPoints() {
    function createState() {
      return {
        current: null,
        perLevelOffset: 0,
        constantOffset: 0,
        temporary: null,
        maximumModifiers: []
      };
    }

    function isLegacyModifier(value) {
      return value && typeof value === 'object' && !Array.isArray(value) &&
        typeof value.source === 'string' && value.source.trim().length > 0 && value.source.trim().length <= 120 &&
        Number.isSafeInteger(value.amount);
    }

    function temporaryAmount(value) {
      if (value === null) return null;
      if (Number.isSafeInteger(value)) return value;
      return isLegacyModifier(value) ? value.amount : NaN;
    }

    function maximumModifierAmount(value) {
      if (Number.isSafeInteger(value)) return value;
      return isLegacyModifier(value) ? value.amount : NaN;
    }

    function isOffset(value) {
      return Number.isSafeInteger(value) && Math.abs(value) <= maximumOffset;
    }

    function isValidState(state) {
      if (!state || typeof state !== 'object' || Array.isArray(state) ||
        !(state.current === null || Number.isSafeInteger(state.current) && state.current >= 0) ||
        !isOffset(state.perLevelOffset) || !isOffset(state.constantOffset) ||
        !Array.isArray(state.maximumModifiers) || state.maximumModifiers.length > maximumModifiersLimit) return false;
      if (state.temporary !== null && (!Number.isSafeInteger(temporaryAmount(state.temporary)) ||
        temporaryAmount(state.temporary) < 1)) return false;
      return state.maximumModifiers.every(function (modifier) {
        const amount = maximumModifierAmount(modifier);
        return Number.isSafeInteger(amount) && amount !== 0;
      });
    }

    function copyState(state) {
      if (!isValidState(state)) throw new Error('Invalid hit point state.');
      return {
        current: state.current,
        perLevelOffset: state.perLevelOffset,
        constantOffset: state.constantOffset,
        temporary: state.temporary === null ? null : temporaryAmount(state.temporary),
        maximumModifiers: state.maximumModifiers.map(maximumModifierAmount)
      };
    }

    function calculateBaseMaximum(classConfigs, constitutionScore, perLevelOffset, constantOffset) {
      if (!Array.isArray(classConfigs) || !Number.isInteger(constitutionScore) ||
        constitutionScore < 1 || constitutionScore > 30) return null;
      const perLevel = perLevelOffset === undefined ? 0 : perLevelOffset;
      const constant = constantOffset === undefined ? 0 : constantOffset;
      if (!isOffset(perLevel) || !isOffset(constant)) return null;
      const activeClasses = [];
      let totalLevel = 0;
      for (let index = 0; index < classConfigs.length; index += 1) {
        const config = classConfigs[index];
        if (!config || typeof config !== 'object') return null;
        const level = Number(config.level);
        if (!Number.isInteger(level) || level < 0 || level > 20) return null;
        if (level === 0) continue;
        if (!Object.prototype.hasOwnProperty.call(hitDieMaximums, config.hitDie)) return null;
        totalLevel += level;
        activeClasses.push({ level: level, dieMaximum: hitDieMaximums[config.hitDie] });
      }
      if (totalLevel < 1 || totalLevel > 20) return null;

      const constitutionModifier = Math.floor((constitutionScore - 10) / 2);
      let maximum = 0;
      let hasStartingLevel = false;
      activeClasses.forEach(function (config) {
        for (let level = 0; level < config.level; level += 1) {
          const dieValue = hasStartingLevel ? Math.ceil((config.dieMaximum + 1) / 2) : config.dieMaximum;
          maximum += Math.max(1, dieValue + constitutionModifier);
          hasStartingLevel = true;
        }
      });
      const result = maximum + totalLevel * perLevel + constant;
      return Number.isSafeInteger(result) ? result : null;
    }

    function calculateMaximum(baseMaximum, state) {
      if (!Number.isSafeInteger(baseMaximum) || !isValidState(state)) return null;
      const result = baseMaximum + state.maximumModifiers.reduce(function (total, modifier) {
        return total + maximumModifierAmount(modifier);
      }, 0);
      return Number.isSafeInteger(result) ? Math.max(0, result) : null;
    }

    function adjustmentAmounts(maximum) {
      if (!Number.isSafeInteger(maximum) || maximum < 1) return [];
      const amounts = [];
      let magnitude = 1;
      while (magnitude <= maximum) {
        [1, 2, 5].forEach(function (factor) {
          const amount = magnitude * factor;
          if (amount <= maximum) amounts.push(amount);
        });
        if (magnitude > Math.floor(maximum / 10)) break;
        magnitude *= 10;
      }
      return amounts;
    }

    function setOffsets(state, perLevelOffset, constantOffset) {
      if (!isValidState(state) || !isOffset(perLevelOffset) || !isOffset(constantOffset)) return false;
      state.perLevelOffset = perLevelOffset;
      state.constantOffset = constantOffset;
      return true;
    }

    function decrease(state, amount) {
      if (!isValidState(state) || !Number.isSafeInteger(amount) || amount < 1 ||
        !Number.isSafeInteger(state.current) || state.current === 0 && !state.temporary) return false;
      const absorbed = Math.min(state.temporary || 0, amount);
      if (absorbed > 0) {
        state.temporary -= absorbed;
        if (state.temporary === 0) state.temporary = null;
      }
      const remainingDamage = amount - absorbed;
      if (remainingDamage > 0) state.current = Math.max(0, state.current - remainingDamage);
      return true;
    }

    function increase(state, amount, maximum) {
      if (!isValidState(state) || !Number.isSafeInteger(amount) || amount < 1 ||
        !Number.isSafeInteger(maximum) || maximum < 0 ||
        !Number.isSafeInteger(state.current) || state.current >= maximum) return false;
      state.current = amount >= maximum - state.current ? maximum : state.current + amount;
      return true;
    }

    function reset(state, maximum) {
      if (!isValidState(state) || !Number.isSafeInteger(maximum) || maximum < 0) return false;
      state.current = maximum;
      return true;
    }

    function setTemporary(state, amount) {
      if (!isValidState(state) || !Number.isSafeInteger(amount) || amount < 1) return false;
      state.temporary = amount;
      return true;
    }

    function removeTemporary(state) {
      if (!isValidState(state) || !state.temporary) return false;
      state.temporary = null;
      return true;
    }

    function clearModifiers(state) {
      if (!isValidState(state) || state.temporary === null && state.maximumModifiers.length === 0) return false;
      let maximumAdjustment = 0;
      for (let index = 0; index < state.maximumModifiers.length; index += 1) {
        maximumAdjustment += maximumModifierAmount(state.maximumModifiers[index]);
        if (!Number.isSafeInteger(maximumAdjustment)) return false;
      }
      const current = state.current === null ? null : Math.max(0, state.current - maximumAdjustment);
      if (current !== null && !Number.isSafeInteger(current)) return false;
      state.current = current;
      state.temporary = null;
      state.maximumModifiers = [];
      return true;
    }

    function upsertMaximumModifier(state, amount, index) {
      if (!isValidState(state) || !Number.isSafeInteger(amount) || amount === 0) return { ok: false, reason: 'invalid' };
      const targetIndex = index === undefined || index === null ? null : index;
      if (targetIndex !== null && (!Number.isInteger(targetIndex) ||
        targetIndex < 0 || targetIndex >= state.maximumModifiers.length)) return { ok: false, reason: 'invalid' };
      if (targetIndex === null && state.maximumModifiers.length >= maximumModifiersLimit) {
        return { ok: false, reason: 'limit-reached' };
      }
      const previousAmount = targetIndex === null ? 0 : maximumModifierAmount(state.maximumModifiers[targetIndex]);
      if (targetIndex === null) state.maximumModifiers.push(amount);
      else state.maximumModifiers[targetIndex] = amount;
      if (state.current !== null) state.current = Math.max(0, state.current + amount - previousAmount);
      return { ok: true, reason: '' };
    }

    function removeMaximumModifier(state, index) {
      if (!isValidState(state) || !Number.isInteger(index) ||
        index < 0 || index >= state.maximumModifiers.length) return false;
      if (state.current !== null) state.current = Math.max(0, state.current - maximumModifierAmount(state.maximumModifiers[index]));
      state.maximumModifiers.splice(index, 1);
      return true;
    }

    return Object.freeze({
      adjustmentAmounts: adjustmentAmounts,
      calculateBaseMaximum: calculateBaseMaximum,
      calculateMaximum: calculateMaximum,
      copyState: copyState,
      clearModifiers: clearModifiers,
      createState: createState,
      decrease: decrease,
      increase: increase,
      isValidState: isValidState,
      maximumModifiersLimit: maximumModifiersLimit,
      removeMaximumModifier: removeMaximumModifier,
      removeTemporary: removeTemporary,
      reset: reset,
      setOffsets: setOffsets,
      setTemporary: setTemporary,
      upsertMaximumModifier: upsertMaximumModifier
    });
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = createHitPoints();
    return;
  }

  const app = document.getElementById('crApp');
  if (!app) throw new Error('Unable to initialize hit points without the CR page.');
  Object.defineProperty(app, 'hitPoints', { value: createHitPoints() });
})();
