(function () {
  'use strict';

  function createResourcePools(flexibleCastingRules) {
    if (!flexibleCastingRules) throw new Error('Flexible Casting rules are unavailable.');

    function isAccumulativeResource(resource) {
      const metadata = resource && resource.generatedClass;
      return Boolean(metadata && metadata.accumulative === true);
    }

    function isDisplayOnlyResource(resource) {
      return Boolean(resource && resource.cooldown === 'NO');
    }

    function resourceAt(resources, index) {
      return Array.isArray(resources) ? resources[index] : null;
    }

    function use(resources, index) {
      const resource = resourceAt(resources, index);
      if (!resource || isDisplayOnlyResource(resource) || isAccumulativeResource(resource) ||
        Number(resource.current) <= 0) return false;
      resource.current = Number(resource.current) - 1;
      return true;
    }

    function convertFlexibleCasting(resources, direction, sorceryPointsIndex, spellSlotIndex, level) {
      const sorceryPoints = resourceAt(resources, sorceryPointsIndex);
      const spellSlot = resourceAt(resources, spellSlotIndex);
      if (direction === 'points-to-slot') {
        return flexibleCastingRules.convertPointsToSlot(sorceryPoints, spellSlot, level);
      }
      if (direction === 'slot-to-points') {
        return flexibleCastingRules.convertSlotToPoints(sorceryPoints, spellSlot, level);
      }
      throw new Error('Unsupported Flexible Casting conversion.');
    }

    function setCount(resources, index, current) {
      const resource = resourceAt(resources, index);
      if (!resource || isDisplayOnlyResource(resource) || isAccumulativeResource(resource)) return false;
      resource.current = current;
      return true;
    }

    function reset(resources, index) {
      const resource = resourceAt(resources, index);
      if (!resource || isDisplayOnlyResource(resource) || isAccumulativeResource(resource)) return false;
      resource.current = resource.max;
      return true;
    }

    function adjustAccumulative(resources, index, direction, amountValue) {
      const resource = resourceAt(resources, index);
      if (!resource || isDisplayOnlyResource(resource) || !isAccumulativeResource(resource)) return false;
      if (direction !== 'gain' && direction !== 'spend') {
        throw new Error('Unsupported accumulative resource adjustment.');
      }
      const amount = Number(amountValue);
      const current = Number(resource.current);
      const maximum = Number(resource.max);
      const available = direction === 'gain' ? Math.max(0, maximum - current) : Math.max(0, current);
      if (!Number.isSafeInteger(amount) || amount < 1 || amount > available) return false;
      resource.current = direction === 'gain' ? current + amount : current - amount;
      return true;
    }

    function resetCooldown(resources, level, isHitDieResource) {
      const tiers = { '每回合': 0, '短休': 1, '長休': 2 };
      const tier = tiers[level];
      const changedIndexes = [];
      (Array.isArray(resources) ? resources : []).forEach(function (resource, index) {
        if (isDisplayOnlyResource(resource)) return;
        const recovery = resource.generatedClass || {};
        const partialRecovery = level === '短休' && recovery.shortRestRecovery > 0 ||
          level === '長休' && recovery.longRestRecovery > 0;
        if (partialRecovery || tiers[resource.cooldown] !== undefined && tiers[resource.cooldown] <= tier) {
          const previous = Number(resource.current);
          if (level === '短休' && recovery.shortRestRecovery > 0) {
            resource.current = Math.max(previous, Math.min(Number(resource.max), previous + recovery.shortRestRecovery));
          } else if (level === '長休' && Number.isInteger(recovery.longRestResetTo)) {
            resource.current = Math.min(Number(resource.max), recovery.longRestResetTo);
          } else if (level === '長休' && recovery.longRestRecovery > 0) {
            if (!recovery.longRestRecoveryWhenEmpty || previous === 0) {
              resource.current = Math.max(previous, Math.min(Number(resource.max), previous + recovery.longRestRecovery));
            }
          } else if (typeof isHitDieResource === 'function' && isHitDieResource(resource) && level === '長休') {
            const diceRecovery = Math.max(1, Math.floor(Number(resource.max) / 2));
            const restored = Math.min(Number(resource.max), Number(resource.current) + diceRecovery);
            resource.current = restored;
          } else {
            resource.current = resource.max;
          }
          if (Number(resource.current) !== previous) changedIndexes.push(index);
        }
      });
      return changedIndexes;
    }

    return Object.freeze({
      adjustAccumulative: adjustAccumulative,
      convertFlexibleCasting: convertFlexibleCasting,
      isAccumulativeResource: isAccumulativeResource,
      isDisplayOnlyResource: isDisplayOnlyResource,
      reset: reset,
      resetCooldown: resetCooldown,
      setCount: setCount,
      use: use
    });
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = createResourcePools(require('./flexible-casting.js'));
    return;
  }

  const app = document.getElementById('crApp');
  if (!app || !app.flexibleCastingRules) {
    throw new Error('Unable to initialize resource pools without CR and Flexible Casting.');
  }
  Object.defineProperty(app, 'resourcePools', {
    value: createResourcePools(app.flexibleCastingRules)
  });
})();
