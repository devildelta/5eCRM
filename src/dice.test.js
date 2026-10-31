const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const engineContext = vm.createContext({ console });
const engineSource = fs.readFileSync(path.join(__dirname, 'dice.js'), 'utf8');
vm.runInContext(engineSource, engineContext, { filename: 'dice.js' });

const calculateTaggedAttackEntries = vm.runInContext(
	'calculateTaggedAttackEntries',
	engineContext
);
const calculateAttackEntries = vm.runInContext('calculateAttackEntries', engineContext);
const evaluateAttackProbabilities = vm.runInContext(
	'evaluateAttackProbabilities',
	engineContext
);
const expandAttackHitTags = vm.runInContext('expandAttackHitTags', engineContext);

const criticalOptions = { threshold: 20, multiplier: 2 };
const simpleAttack = (name, hitTags, rawDamageStr = '1 (1D4)') => ({
	name,
	attackStr: 'D20+100',
	rawDamageStr,
	attackCount: rawDamageStr.startsWith('3 ') ? 3 : 1,
	critMultiplierBonus: 0,
	hitTags
});
const meanDamage = summary => {
	let totalMass = 0;
	let weightedDamage = 0;
	for (let damage = 0; damage < summary.distribution.length; damage++) {
		const probability = summary.distribution[damage];
		totalMass += probability;
		weightedDamage += damage * probability;
	}
	assert.ok(Math.abs(totalMass - 1) < 1e-10, `Expected probability mass 1, got ${totalMass}`);
	return weightedDamage;
};
const oneD4PerHit = probability => probability.pHit * 2.5 + probability.pCrit * 5;

test('attack hit tags inherit their parent tags', () => {
	assert.deepEqual(
		Array.from(expandAttackHitTags(['weaponHit'])).sort(),
		['attackHit', 'weaponAttackHit', 'weaponHit']
	);
	assert.deepEqual(
		Array.from(expandAttackHitTags(['unarmedStrikeHit'])).sort(),
		['attackHit', 'unarmedStrikeHit', 'weaponAttackHit']
	);
	assert.deepEqual(
		Array.from(expandAttackHitTags(['spellAttackHit'])).sort(),
		['attackHit', 'spellAttackHit']
	);
});

test('multiple per-round damage effects can stack on the first matching hit, including flat damage', () => {
	const attacks = [
		simpleAttack('Weapon attack 1', ['weaponHit']),
		simpleAttack('Weapon attack 2', ['weaponHit'])
	];
	const effects = [
		{ name: 'Sneak Attack', triggerTag: 'weaponAttackHit', dice: [{ sides: 6, count: 1 }], flatMod: 0 },
		{ name: 'Divine Fury', triggerTag: 'weaponAttackHit', dice: [{ sides: 6, count: 1 }], flatMod: 1 },
		{ name: 'Strike of the Giants', triggerTag: 'weaponAttackHit', dice: [{ sides: 6, count: 1 }], flatMod: 0 },
		{ name: 'Dreadful Strikes', triggerTag: 'weaponAttackHit', dice: [{ sides: 4, count: 1 }], flatMod: 0 }
	];
	const summary = calculateAttackEntries(
		'stacked effects',
		attacks,
		13,
		criticalOptions,
		effects,
		1
	);
	const probability = evaluateAttackProbabilities('D20+100', 13, 20);
	const expectedWeaponDamage = 2 * oneD4PerHit(probability);
	const expectedPerRoundDamage = (1 + probability.pMiss)
		* (probability.pHit * 14 + probability.pCrit * 27);

	assert.ok(Math.abs(meanDamage(summary) - expectedWeaponDamage - expectedPerRoundDamage) < 1e-10);
	assert.equal(summary.details.totalMaxPossibleDmg, 61);
});

test('a non-matching hit does not consume an effect before a later matching hit', () => {
	const summary = calculateTaggedAttackEntries(
		'non-matching attack before matching attack',
		[
			simpleAttack('Unclassified attack', []),
			simpleAttack('Weapon attack', ['weaponHit'])
		],
		13,
		criticalOptions,
		[{ name: 'Sneak Attack', triggerTag: 'weaponAttackHit', dice: [{ sides: 6, count: 1 }], flatMod: 0 }],
		1
	);
	const probability = evaluateAttackProbabilities('D20+100', 13, 20);
	const expected = 2 * oneD4PerHit(probability)
		+ probability.pHit * 3.5
		+ probability.pCrit * 7;

	assert.ok(Math.abs(meanDamage(summary) - expected) < 1e-10);
});

test('an effect triggers once per round and resets on later DPR rounds', () => {
	const summary = calculateTaggedAttackEntries(
		'three round reset',
		[simpleAttack('Weapon attack', ['weaponHit'], '3 (1D4)')],
		13,
		criticalOptions,
		[{ name: 'Divine Fury', triggerTag: 'weaponAttackHit', dice: [{ sides: 6, count: 1 }], flatMod: 1 }],
		3
	);
	const probability = evaluateAttackProbabilities('D20+100', 13, 20);
	const expected = 3 * (
		oneD4PerHit(probability)
		+ probability.pHit * 4.5
		+ probability.pCrit * 8
	);

	assert.ok(Math.abs(meanDamage(summary) - expected) < 1e-10);
	assert.equal(summary.details.totalMaxPossibleDmg, 63);
});

test('a matching effect triggers on only the first matching hit in a round', () => {
	const summary = calculateTaggedAttackEntries(
		'first matching hit',
		[
			simpleAttack('Weapon attack 1', ['weaponHit'], '1 (5)'),
			simpleAttack('Weapon attack 2', ['weaponHit'], '1 (5)')
		],
		13,
		criticalOptions,
		[{ name: 'Once per round', triggerTag: 'weaponHit', dice: [], flatMod: 3 }],
		1
	);

	assert.ok(Math.abs(summary.distribution[0] - 0.0025) < 1e-10);
	assert.ok(Math.abs(summary.distribution[8] - 0.095) < 1e-10);
	assert.ok(Math.abs(summary.distribution[13] - 0.9025) < 1e-10);
	assert.equal(summary.distribution.reduce((sum, probability) => sum + probability, 0), 1);
});

test('spell attack effects do not trigger on weapon hits, while Attack Hit effects do', () => {
	const weaponAttack = [simpleAttack('Weapon attack', ['weaponHit'])];
	const noEffects = calculateTaggedAttackEntries(
		'no matching effects',
		weaponAttack,
		13,
		criticalOptions,
		[],
		1
	);
	const spellOnly = calculateTaggedAttackEntries(
		'spell-only effect',
		weaponAttack,
		13,
		criticalOptions,
		[{ name: 'Spell effect', triggerTag: 'spellAttackHit', dice: [], flatMod: 3 }],
		1
	);
	const universal = calculateTaggedAttackEntries(
		'universal effect',
		weaponAttack,
		13,
		criticalOptions,
		[{ name: 'Universal effect', triggerTag: 'attackHit', dice: [], flatMod: 3 }],
		1
	);

	assert.equal(meanDamage(spellOnly), meanDamage(noEffects));
	assert.ok(meanDamage(universal) > meanDamage(noEffects));
});

test('Weapon Hit excludes unarmed strikes, but Weapon Attack Hit includes them', () => {
	const unarmedAttack = [simpleAttack('Unarmed strike', ['unarmedStrikeHit'])];
	const baseline = calculateTaggedAttackEntries(
		'unarmed baseline',
		unarmedAttack,
		13,
		criticalOptions,
		[],
		1
	);
	const weaponOnly = calculateTaggedAttackEntries(
		'weapon-only effect',
		unarmedAttack,
		13,
		criticalOptions,
		[{ name: 'Weapon effect', triggerTag: 'weaponHit', dice: [], flatMod: 2 }],
		1
	);
	const weaponAttack = calculateTaggedAttackEntries(
		'weapon-attack effect',
		unarmedAttack,
		13,
		criticalOptions,
		[{ name: 'Weapon attack effect', triggerTag: 'weaponAttackHit', dice: [], flatMod: 2 }],
		1
	);

	assert.equal(meanDamage(weaponOnly), meanDamage(baseline));
	assert.ok(meanDamage(weaponAttack) > meanDamage(baseline));
});

test('per-round effects reject empty damage and invalid tags or flat values', () => {
	const attack = [simpleAttack('Weapon attack', ['weaponHit'])];
	for (const effect of [
		{ triggerTag: 'weaponAttackHit', dice: [], flatMod: 0 },
		{ triggerTag: 'not-a-tag', dice: [{ sides: 6, count: 1 }], flatMod: 0 },
		{ triggerTag: 'weaponAttackHit', dice: [], flatMod: -1 }
	]) {
		assert.throws(() => calculateTaggedAttackEntries(
			'invalid effect',
			attack,
			13,
			criticalOptions,
			[effect],
			1
		));
	}
});

test('per-round damage effects are capped to keep the state space bounded', () => {
	const effects = Array.from({ length: 11 }, (_, index) => ({
		name: `Effect ${index + 1}`,
		triggerTag: 'attackHit',
		dice: [],
		flatMod: 1
	}));
	assert.throws(
		() => calculateTaggedAttackEntries(
			'too many effects',
			[simpleAttack('Attack', ['attackHit'])],
			13,
			criticalOptions,
			effects,
			1
		),
		/最多 10 項/
	);
});
