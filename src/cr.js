(async function () {
  'use strict';

  const scriptUrl = document.currentScript.src;
  const localeStorageKey = 'dnd_skills_locale';
  const browserLocale = navigator.language.toLowerCase().replace('_', '-').split('-').indexOf('tw') !== -1 ? 'zh-TW' : 'zh-HK';
  const storedLocale = localStorage.getItem(localeStorageKey);
  let locale = storedLocale === 'zh-HK' || storedLocale === 'zh-TW' ? storedLocale : browserLocale;
  function localeResourceUrl(path) {
    const url = new URL(path, scriptUrl);
    const version = new URL(scriptUrl).searchParams.get('v');
    if (version) url.searchParams.set('v', version);
    return url;
  }
  const responses = await Promise.all([
    fetch(localeResourceUrl('locales/common.json')),
    fetch(localeResourceUrl('locales/zh-HK.json')),
    fetch(localeResourceUrl('locales/zh-TW.json'))
  ]);
  const commonResponse = responses[0];
  const localeResponses = { 'zh-HK': responses[1], 'zh-TW': responses[2] };
  if (!commonResponse.ok) throw new Error('Unable to load shared locale resource.');
  Object.keys(localeResponses).forEach(function (localeName) {
    if (!localeResponses[localeName].ok) throw new Error('Unable to load locale resource: ' + localeName);
  });
  const commonI18n = await commonResponse.json();
  const locales = {
    'zh-HK': await localeResponses['zh-HK'].json(),
    'zh-TW': await localeResponses['zh-TW'].json()
  };
  let i18n = locales[locale];
  if (!commonI18n || typeof commonI18n !== 'object' || Array.isArray(commonI18n)) throw new Error('Invalid shared locale resource.');
  Object.keys(locales).forEach(function (localeName) {
    if (!locales[localeName] || typeof locales[localeName] !== 'object' || Array.isArray(locales[localeName])) throw new Error('Invalid locale resource: ' + localeName);
  });

  const localeTokens = {
    character: 'characterNoun',
    resource: 'resourceNoun',
    'class': 'classNoun',
    copy: 'copyResource',
    delete: 'deleteResource',
    edit: 'editResource',
    create: 'newResource',
    confirm: 'confirm'
  };

  function t(key, values) {
    const sharedKeyPrefix = 'common.';
    const template = key.indexOf(sharedKeyPrefix) === 0 ? commonI18n[key.slice(sharedKeyPrefix.length)] : i18n[key];
    if (typeof template !== 'string') throw new Error('Missing locale key "' + key + '" in ' + locale);
    return template.replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, function (match, name) {
      if (values && Object.prototype.hasOwnProperty.call(values, name)) return String(values[name]);
      const tokenKey = localeTokens[name];
      if (tokenKey && typeof i18n[tokenKey] === 'string') return i18n[tokenKey];
      throw new Error('Missing locale value "' + name + '" for key "' + key + '"');
    });
  }

  const storageKey = 'dnd_skills_db';
  const classSettingsStorageKey = 'dnd_skills_class_feature_settings';
  const sourceInfo = {
    '角色職業': { label: 'sourceClassLabel', english: 'common.sourceClassEnglish', description: 'sourceClassDescription' },
    '角色特徵': { label: 'sourceFeatureLabel', english: 'common.sourceFeatureEnglish', description: 'sourceFeatureDescription' },
    '魔法物品': { label: 'sourceMagicItemLabel', english: 'common.sourceMagicItemEnglish', description: 'sourceMagicItemDescription' },
    '其他': { label: 'sourceOtherLabel', english: 'common.sourceOtherEnglish', description: 'sourceOtherDescription' }
  };
  const cooldownInfo = {
    '每回合': { label: 'cooldownEveryTurn', availabilityPeriod: 'cooldownEveryTurn' },
    '短休': { label: 'cooldownShortRest', availabilityPeriod: 'availabilityPeriodShortRest' },
    '長休': { label: 'cooldownLongRest', availabilityPeriod: 'availabilityPeriodLongRest' },
    '日出': { label: 'cooldownSunrise', availabilityPeriod: 'availabilityPeriodSunrise' },
    '每24小時': { label: 'cooldown24Hours', availabilityPeriod: 'cooldown24Hours' },
    '手動': { label: 'cooldownManual', availabilityPeriod: 'availabilityPeriodManual' }
  };
  const legacyShortOrLongRest = '短休或長休';
  function normalizeLegacyRestTerminology(database) {
    if (!database || typeof database !== 'object' || Array.isArray(database)) return false;
    let changed = false;
    Object.keys(database).forEach(function (name) {
      if (!Array.isArray(database[name])) return;
      database[name].forEach(function (resource) {
        if (!resource || typeof resource !== 'object' || Array.isArray(resource)) return;
        if (resource.cooldown === legacyShortOrLongRest) {
          resource.cooldown = '短休';
          changed = true;
        }
        const metadata = resource.generatedClass;
        if (metadata && typeof metadata === 'object' && !Array.isArray(metadata) && metadata.recovery === legacyShortOrLongRest) {
          metadata.recovery = '短休';
          changed = true;
        }
      });
    });
    return changed;
  }
  const hitDice = ['d6', 'd8', 'd10', 'd12'];
  const progressions = ['none', 'full', 'half-down', 'half-up', 'third', 'pact', 'manual'];
  const regularSlots = [
    [], [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2],
    [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1],
    [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1]
  ];
  const pactSlots = [null, [1, 1], [2, 1], [2, 2], [2, 2], [2, 3], [2, 3], [2, 4], [2, 4],
    [2, 5], [2, 5], [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [4, 5], [4, 5], [4, 5], [4, 5]];
  const classPresets = {
    artificer: { name: 'Artificer', label: 'classArtificer', die: 'd8', progression: 'half-up', progressions: ['half-up'] },
    barbarian: { name: 'Barbarian', label: 'classBarbarian', die: 'd12', progression: 'none', progressions: ['none'] },
    bard: { name: 'Bard', label: 'classBard', die: 'd8', progression: 'full', progressions: ['full'] },
    cleric: { name: 'Cleric', label: 'classCleric', die: 'd8', progression: 'full', progressions: ['full'] },
    druid: { name: 'Druid', label: 'classDruid', die: 'd8', progression: 'full', progressions: ['full'] },
    fighter: { name: 'Fighter', label: 'classFighter', die: 'd10', progression: 'none', progressions: ['none', 'third'] },
    monk: { name: 'Monk', label: 'classMonk', die: 'd8', progression: 'none', progressions: ['none'] },
    paladin: { name: 'Paladin', label: 'classPaladin', die: 'd10', progression: 'half-down', progressions: ['half-down'] },
    ranger: { name: 'Ranger', label: 'classRanger', die: 'd10', progression: 'half-down', progressions: ['half-down'] },
    rogue: { name: 'Rogue', label: 'classRogue', die: 'd8', progression: 'none', progressions: ['none', 'third'] },
    sorcerer: { name: 'Sorcerer', label: 'classSorcerer', die: 'd6', progression: 'full', progressions: ['full'] },
    warlock: { name: 'Warlock', label: 'classWarlock', die: 'd8', progression: 'pact', progressions: ['pact'] },
    wizard: { name: 'Wizard', label: 'classWizard', die: 'd6', progression: 'full', progressions: ['full'] }
  };
  const abilityScores = [
    { key: 'str', label: 'abilityStrength' },
    { key: 'dex', label: 'abilityDexterity' },
    { key: 'con', label: 'abilityConstitution' },
    { key: 'int', label: 'abilityIntelligence' },
    { key: 'wis', label: 'abilityWisdom' },
    { key: 'cha', label: 'abilityCharisma' }
  ];
  const classSubclassData = {
    artificer: { unlockLevel: 3, options: [['alchemist', 'Alchemist', 'TCE'], ['armorer', 'Armorer', 'TCE'], ['artillerist', 'Artillerist', 'TCE'], ['battle-smith', 'Battle Smith', 'TCE']] },
    barbarian: { unlockLevel: 3, options: [['berserker', 'Berserker', 'PHB'], ['totem-warrior', 'Totem Warrior', 'PHB'], ['ancestral-guardian', 'Ancestral Guardian', 'XGE'], ['storm-herald', 'Storm Herald', 'XGE'], ['zealot', 'Zealot', 'XGE'], ['beast', 'Beast', 'TCE'], ['wild-magic', 'Wild Magic', 'TCE'], ['giant', 'Path of the Giant', 'BGG']] },
    bard: { unlockLevel: 3, options: [['lore', 'Lore', 'PHB'], ['valor', 'Valor', 'PHB'], ['glamour', 'Glamour', 'XGE'], ['swords', 'Swords', 'XGE'], ['whispers', 'Whispers', 'XGE'], ['creation', 'Creation', 'TCE'], ['eloquence', 'Eloquence', 'TCE']] },
    cleric: { unlockLevel: 1, options: [['knowledge', 'Knowledge', 'PHB'], ['life', 'Life', 'PHB'], ['light', 'Light', 'PHB'], ['nature', 'Nature', 'PHB'], ['tempest', 'Tempest', 'PHB'], ['trickery', 'Trickery', 'PHB'], ['war', 'War', 'PHB'], ['death', 'Death', 'DMG'], ['arcana', 'Arcana', 'SCAG'], ['forge', 'Forge', 'XGE'], ['grave', 'Grave', 'XGE'], ['order', 'Order', 'TCE'], ['peace', 'Peace', 'TCE'], ['twilight', 'Twilight', 'TCE']] },
    druid: { unlockLevel: 2, options: [['land', 'Land', 'PHB'], ['moon', 'Moon', 'PHB'], ['dreams', 'Dreams', 'XGE'], ['shepherd', 'Shepherd', 'XGE'], ['stars', 'Stars', 'TCE'], ['wildfire', 'Wildfire', 'TCE']] },
    fighter: { unlockLevel: 3, options: [['champion', 'Champion', 'PHB'], ['battle-master', 'Battle Master', 'PHB'], ['eldritch-knight', 'Eldritch Knight', 'PHB'], ['arcane-archer', 'Arcane Archer', 'XGE'], ['cavalier', 'Cavalier', 'XGE'], ['samurai', 'Samurai', 'XGE'], ['rune-knight', 'Rune Knight', 'TCE'], ['psi-warrior', 'Psi Warrior', 'TCE']] },
    monk: { unlockLevel: 3, options: [['four-elements', 'Four Elements', 'PHB'], ['open-hand', 'Open Hand', 'PHB'], ['shadow', 'Shadow', 'PHB'], ['drunken-master', 'Drunken Master', 'XGE'], ['kensei', 'Kensei', 'XGE'], ['astral-self', 'Astral Self', 'TCE'], ['mercy', 'Mercy', 'TCE'], ['ascendant-dragon', 'Ascendant Dragon', 'FToD']] },
    paladin: { unlockLevel: 3, options: [['ancients', 'Ancients', 'PHB'], ['devotion', 'Devotion', 'PHB'], ['vengeance', 'Vengeance', 'PHB'], ['oathbreaker', 'Oathbreaker', 'DMG'], ['conquest', 'Conquest', 'XGE'], ['redemption', 'Redemption', 'XGE'], ['glory', 'Glory', 'TCE'], ['watchers', 'Watchers', 'TCE']] },
    ranger: { unlockLevel: 3, options: [['beast-master', 'Beast Master', 'PHB'], ['hunter', 'Hunter', 'PHB'], ['gloom-stalker', 'Gloom Stalker', 'XGE'], ['horizon-walker', 'Horizon Walker', 'XGE'], ['monster-slayer', 'Monster Slayer', 'XGE'], ['fey-wanderer', 'Fey Wanderer', 'TCE'], ['swarmkeeper', 'Swarmkeeper', 'TCE'], ['drakewarden', 'Drakewarden', 'FToD']] },
    rogue: { unlockLevel: 3, options: [['thief', 'Thief', 'PHB'], ['assassin', 'Assassin', 'PHB'], ['arcane-trickster', 'Arcane Trickster', 'PHB'], ['inquisitive', 'Inquisitive', 'XGE'], ['mastermind', 'Mastermind', 'XGE'], ['scout', 'Scout', 'XGE'], ['swashbuckler', 'Swashbuckler', 'XGE'], ['phantom', 'Phantom', 'TCE'], ['soulknife', 'Soulknife', 'TCE']] },
    sorcerer: { unlockLevel: 1, options: [['draconic', 'Draconic Bloodline', 'PHB'], ['wild-magic', 'Wild Magic', 'PHB'], ['divine-soul', 'Divine Soul', 'XGE'], ['shadow-magic', 'Shadow Magic', 'XGE'], ['aberrant-mind', 'Aberrant Mind', 'TCE'], ['clockwork-soul', 'Clockwork Soul', 'TCE']] },
    warlock: { unlockLevel: 1, options: [['archfey', 'Archfey', 'PHB'], ['fiend', 'Fiend', 'PHB'], ['great-old-one', 'Great Old One', 'PHB'], ['hexblade', 'Hexblade', 'XGE'], ['celestial', 'Celestial', 'XGE'], ['fathomless', 'Fathomless', 'TCE'], ['genie', 'Genie', 'TCE']] },
    wizard: { unlockLevel: 2, options: [['abjuration', 'Abjuration', 'PHB'], ['conjuration', 'Conjuration', 'PHB'], ['divination', 'Divination', 'PHB'], ['enchantment', 'Enchantment', 'PHB'], ['evocation', 'Evocation', 'PHB'], ['illusion', 'Illusion', 'PHB'], ['necromancy', 'Necromancy', 'PHB'], ['transmutation', 'Transmutation', 'PHB'], ['war-magic', 'War Magic', 'XGE'], ['bladesinging', 'Bladesinging', 'TCE'], ['order-of-scribes', 'Order of Scribes', 'TCE']] }
  };
  const tceFeatureData = [
    { key: 'cleric-harness-divine-power', classKey: 'cleric', label: 'tceHarnessDivinePowerCleric', unlockLevel: 2, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
    { key: 'druid-wild-companion', classKey: 'druid', label: 'tceWildCompanion', unlockLevel: 2, costs: [{ poolKey: 'class:druid:wild-shape', alternative: true }, { type: 'spell-slot', alternative: true }] },
    { key: 'monk-quickened-healing', classKey: 'monk', label: 'tceQuickenedHealing', unlockLevel: 2, costs: [{ poolKey: 'class:monk:ki', amount: 2 }] },
    { key: 'monk-focused-aim', classKey: 'monk', label: 'tceFocusedAim', unlockLevel: 2, costs: [{ poolKey: 'class:monk:ki', amount: '1-3' }] },
    { key: 'paladin-harness-divine-power', classKey: 'paladin', label: 'tceHarnessDivinePowerPaladin', unlockLevel: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] },
    { key: 'ranger-favored-foe', classKey: 'ranger', label: 'tceFavoredFoe', unlockLevel: 1 },
    { key: 'ranger-primal-awareness', classKey: 'ranger', label: 'tcePrimalAwareness', unlockLevel: 3, costs: [{ type: 'spell-slot', additionalUse: true }] },
    { key: 'ranger-natures-veil', classKey: 'ranger', label: 'tceNaturesVeil', unlockLevel: 10 },
    { key: 'sorcerer-magical-guidance', classKey: 'sorcerer', label: 'tceMagicalGuidance', unlockLevel: 5, costs: [{ poolKey: 'class:sorcerer:sorcery-points', amount: 1 }] },
    { key: 'sorcerer-sorcerous-restoration', classKey: 'sorcerer', label: 'tceSorcerousRestoration', unlockLevel: 20, recovery: { poolKey: 'class:sorcerer:sorcery-points', shortRestRecovery: 4 } }
  ];
  const sharedPoolConsumers = {
    bardicInspiration: [
      { featureKey: 'cutting-words', name: 'Cutting Words', subclassKey: 'lore', level: 3, costs: [{ poolKey: 'class:bard:bardic-inspiration', amount: 1 }] },
      { featureKey: 'combat-inspiration', name: 'Combat Inspiration', subclassKey: 'valor', level: 3, costs: [{ poolKey: 'class:bard:bardic-inspiration', amount: 1 }] },
      { featureKey: 'mantle-of-inspiration', name: 'Mantle of Inspiration', subclassKey: 'glamour', level: 3, costs: [{ poolKey: 'class:bard:bardic-inspiration', amount: 1 }] },
      { featureKey: 'blade-flourish', name: 'Blade Flourish', subclassKey: 'swords', level: 3, costs: [{ poolKey: 'class:bard:bardic-inspiration', amount: 1 }] },
      { featureKey: 'psychic-blades', name: 'Psychic Blades', subclassKey: 'whispers', level: 3, costs: [{ poolKey: 'class:bard:bardic-inspiration', amount: 1 }] },
      { featureKey: 'unsettling-words', name: 'Unsettling Words', subclassKey: 'eloquence', level: 3, costs: [{ poolKey: 'class:bard:bardic-inspiration', amount: 1 }] }
    ],
    clericChannelDivinity: [
      { featureKey: 'turn-undead', name: 'Turn Undead', level: 2, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
      { featureKey: 'knowledge-of-the-ages', name: 'Knowledge of the Ages', subclassKey: 'knowledge', level: 2, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
      { featureKey: 'read-thoughts', name: 'Read Thoughts', subclassKey: 'knowledge', level: 6, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
      { featureKey: 'preserve-life', name: 'Preserve Life', subclassKey: 'life', level: 2, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
      { featureKey: 'radiance-of-the-dawn', name: 'Radiance of the Dawn', subclassKey: 'light', level: 2, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
      { featureKey: 'charm-animals-and-plants', name: 'Charm Animals and Plants', subclassKey: 'nature', level: 2, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
      { featureKey: 'destructive-wrath', name: 'Destructive Wrath', subclassKey: 'tempest', level: 2, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
      { featureKey: 'invoke-duplicity', name: 'Invoke Duplicity', subclassKey: 'trickery', level: 2, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
      { featureKey: 'guided-strike', name: 'Guided Strike', subclassKey: 'war', level: 2, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
      { featureKey: 'war-gods-blessing', name: "War God's Blessing", subclassKey: 'war', level: 6, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
      { featureKey: 'touch-of-death', name: 'Touch of Death', subclassKey: 'death', level: 2, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
      { featureKey: 'arcane-abjuration', name: 'Arcane Abjuration', subclassKey: 'arcana', level: 2, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
      { featureKey: 'artisans-blessing', name: "Artisan's Blessing", subclassKey: 'forge', level: 2, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
      { featureKey: 'path-to-the-grave', name: 'Path to the Grave', subclassKey: 'grave', level: 2, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
      { featureKey: 'orders-demand', name: "Order's Demand", subclassKey: 'order', level: 2, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
      { featureKey: 'balm-of-peace', name: 'Balm of Peace', subclassKey: 'peace', level: 2, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
      { featureKey: 'twilight-sanctuary', name: 'Twilight Sanctuary', subclassKey: 'twilight', level: 2, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] },
      { featureKey: 'cleric-harness-divine-power', label: 'tceHarnessDivinePowerCleric', tceFeatureKey: 'cleric-harness-divine-power', level: 2, costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }] }
    ],
    wildShape: [
      { featureKey: 'combat-wild-shape', name: 'Combat Wild Shape', subclassKey: 'moon', level: 2, costs: [{ poolKey: 'class:druid:wild-shape', amount: 1 }] },
      { featureKey: 'circle-forms', name: 'Circle Forms', subclassKey: 'moon', level: 2 },
      { featureKey: 'elemental-wild-shape', name: 'Elemental Wild Shape', subclassKey: 'moon', level: 10, costs: [{ poolKey: 'class:druid:wild-shape', amount: 2 }] },
      { featureKey: 'starry-form', label: 'classWildShapeConsumerStarryForm', subclassKey: 'stars', level: 2, costs: [{ poolKey: 'class:druid:wild-shape', amount: 1 }] },
      { featureKey: 'wildfire-spirit', label: 'classWildShapeConsumerWildfireSpirit', subclassKey: 'wildfire', level: 2, costs: [{ poolKey: 'class:druid:wild-shape', label: 'classWildShapeUseCost', amount: 1, alternative: true }, { type: 'spell-slot', alternative: true }] },
      { featureKey: 'druid-wild-companion', label: 'tceWildCompanion', tceFeatureKey: 'druid-wild-companion', level: 2, costs: [{ poolKey: 'class:druid:wild-shape', amount: 1, alternative: true }, { type: 'spell-slot', alternative: true }] }
    ],
    rage: [
      { featureKey: 'frenzy', name: 'Frenzy', subclassKey: 'berserker', level: 3 },
      { featureKey: 'totem-warrior-features', name: 'Totem Warrior Rage features', subclassKey: 'totem-warrior', level: 3 },
      { featureKey: 'ancestral-protectors', name: 'Ancestral Protectors', subclassKey: 'ancestral-guardian', level: 3 },
      { featureKey: 'spirit-shield', name: 'Spirit Shield', subclassKey: 'ancestral-guardian', level: 6 },
      { featureKey: 'storm-aura', name: 'Storm Aura', subclassKey: 'storm-herald', level: 3 },
      { featureKey: 'fanatical-focus', name: 'Fanatical Focus', subclassKey: 'zealot', level: 6 },
      { featureKey: 'rage-beyond-death', name: 'Rage Beyond Death', subclassKey: 'zealot', level: 14 },
      { featureKey: 'bestial-soul', name: 'Beast forms', subclassKey: 'beast', level: 3 },
      { featureKey: 'giant-rage-features', name: 'Path of the Giant Rage features', subclassKey: 'giant', level: 3 },
      { featureKey: 'wild-surge', name: 'Wild Surge', subclassKey: 'wild-magic', level: 3 }
    ],
    superiorityDice: [
      { featureKey: 'battle-master-maneuvers', name: 'Battle Master maneuvers', subclassKey: 'battle-master', level: 3, costs: [{ poolKey: 'subclass:fighter:battle-master:superiority-dice', amount: 1 }] }
    ],
    psiWarriorDice: [
      { featureKey: 'protective-field', name: 'Protective Field', subclassKey: 'psi-warrior', level: 3, costs: [{ poolKey: 'subclass:fighter:psi-warrior:psionic-energy-dice', amount: 1 }] },
      { featureKey: 'psionic-strike', name: 'Psionic Strike', subclassKey: 'psi-warrior', level: 3, costs: [{ poolKey: 'subclass:fighter:psi-warrior:psionic-energy-dice', amount: 1 }] },
      { featureKey: 'telekinetic-movement', name: 'Telekinetic Movement', subclassKey: 'psi-warrior', level: 7, costs: [{ poolKey: 'subclass:fighter:psi-warrior:psionic-energy-dice', amount: 1, additionalUse: true }] },
      { featureKey: 'psi-powered-leap', name: 'Psi-Powered Leap', subclassKey: 'psi-warrior', level: 7, costs: [{ poolKey: 'subclass:fighter:psi-warrior:psionic-energy-dice', amount: 1 }] },
      { featureKey: 'guarded-mind', name: 'Guarded Mind', subclassKey: 'psi-warrior', level: 10, costs: [{ poolKey: 'subclass:fighter:psi-warrior:psionic-energy-dice', amount: 1 }] },
      { featureKey: 'bulwark-of-force', name: 'Bulwark of Force', subclassKey: 'psi-warrior', level: 15, costs: [{ poolKey: 'subclass:fighter:psi-warrior:psionic-energy-dice', amount: 1, additionalUse: true }] },
      { featureKey: 'telekinetic-master', name: 'Telekinetic Master', subclassKey: 'psi-warrior', level: 18, costs: [{ poolKey: 'subclass:fighter:psi-warrior:psionic-energy-dice', amount: 1, additionalUse: true }] }
    ],
    ki: [
      { featureKey: 'flurry-of-blows', name: 'Flurry of Blows', level: 2, costs: [{ poolKey: 'class:monk:ki', amount: 1 }] },
      { featureKey: 'patient-defense', name: 'Patient Defense', level: 2, costs: [{ poolKey: 'class:monk:ki', amount: 1 }] },
      { featureKey: 'step-of-the-wind', name: 'Step of the Wind', level: 2, costs: [{ poolKey: 'class:monk:ki', amount: 1 }] },
      { featureKey: 'stunning-strike', name: 'Stunning Strike', level: 5, costs: [{ poolKey: 'class:monk:ki', amount: 1 }] },
      { featureKey: 'drunkards-luck', name: "Drunkard's Luck", subclassKey: 'drunken-master', level: 6, costs: [{ poolKey: 'class:monk:ki', amount: 2 }] },
      { featureKey: 'fangs-of-the-fire-snake', name: 'Fangs of the Fire Snake', subclassKey: 'four-elements', level: 3, costs: [{ poolKey: 'class:monk:ki', amount: 1 }, { poolKey: 'class:monk:ki', amount: '1 on a hit for the first extra 1d10 fire damage; each further Ki adds 1d10' }] },
      { featureKey: 'fist-of-four-thunders', name: 'Fist of Four Thunders', subclassKey: 'four-elements', level: 3, costs: [{ poolKey: 'class:monk:ki', amount: '2 base; +1 per spell level above 1st, maximum 6 total' }] },
      { featureKey: 'fist-of-unbroken-air', name: 'Fist of Unbroken Air', subclassKey: 'four-elements', level: 3, costs: [{ poolKey: 'class:monk:ki', amount: '2 base; +1 per extra point adds 1d10 damage' }] },
      { featureKey: 'clench-of-the-north-wind', name: 'Clench of the North Wind', subclassKey: 'four-elements', level: 6, costs: [{ poolKey: 'class:monk:ki', amount: '3 base; +1 per spell level above 2nd, maximum 6 total' }] },
      { featureKey: 'gong-of-the-summit', name: 'Gong of the Summit', subclassKey: 'four-elements', level: 6, costs: [{ poolKey: 'class:monk:ki', amount: '3 base; +1 per spell level above 2nd, maximum 6 total' }] },
      { featureKey: 'rush-of-the-gale-spirits', name: 'Rush of the Gale Spirits', subclassKey: 'four-elements', level: 6, costs: [{ poolKey: 'class:monk:ki', amount: '2 base; +1 per spell level above 2nd, maximum 6 total' }] },
      { featureKey: 'shape-the-flowing-river', name: 'Shape the Flowing River', subclassKey: 'four-elements', level: 6, costs: [{ poolKey: 'class:monk:ki', amount: 1 }] },
      { featureKey: 'sweeping-cinder-strike', name: 'Sweeping Cinder Strike', subclassKey: 'four-elements', level: 6, costs: [{ poolKey: 'class:monk:ki', amount: '2 base; +1 per spell level above 1st, maximum 6 total' }] },
      { featureKey: 'water-whip', name: 'Water Whip', subclassKey: 'four-elements', level: 6, costs: [{ poolKey: 'class:monk:ki', amount: '2+; each extra point adds 1d10 damage' }] },
      { featureKey: 'flames-of-the-phoenix', name: 'Flames of the Phoenix', subclassKey: 'four-elements', level: 11, costs: [{ poolKey: 'class:monk:ki', amount: '4 base; +1 per spell level above 3rd, maximum 6 total' }] },
      { featureKey: 'mist-stance', name: 'Mist Stance', subclassKey: 'four-elements', level: 11, costs: [{ poolKey: 'class:monk:ki', amount: '4 base; +1 per spell level above 3rd, maximum 6 total' }] },
      { featureKey: 'ride-the-wind', name: 'Ride the Wind', subclassKey: 'four-elements', level: 11, costs: [{ poolKey: 'class:monk:ki', amount: '4 base; +1 per spell level above 3rd, maximum 6 total' }] },
      { featureKey: 'breath-of-winter', name: 'Breath of Winter', subclassKey: 'four-elements', level: 17, costs: [{ poolKey: 'class:monk:ki', amount: 6 }] },
      { featureKey: 'eternal-mountain-defense', name: 'Eternal Mountain Defense', subclassKey: 'four-elements', level: 17, costs: [{ poolKey: 'class:monk:ki', amount: '5 base; +1 per spell level above 4th, maximum 6 total' }] },
      { featureKey: 'river-of-hungry-flame', name: 'River of Hungry Flame', subclassKey: 'four-elements', level: 17, costs: [{ poolKey: 'class:monk:ki', amount: '5 base; +1 per spell level above 4th, maximum 6 total' }] },
      { featureKey: 'wave-of-rolling-earth', name: 'Wave of Rolling Earth', subclassKey: 'four-elements', level: 17, costs: [{ poolKey: 'class:monk:ki', amount: 6 }] },
      { featureKey: 'shadow-arts', name: 'Shadow Arts', subclassKey: 'shadow', level: 3, costs: [{ poolKey: 'class:monk:ki', amount: 2 }] },
      { featureKey: 'quivering-palm', name: 'Quivering Palm', subclassKey: 'open-hand', level: 17, costs: [{ poolKey: 'class:monk:ki', amount: 3 }] },
      { featureKey: 'empty-body', name: 'Empty Body', level: 18, costs: [{ poolKey: 'class:monk:ki', amount: 4 }] },
      { featureKey: 'touch-of-the-long-death', name: 'Touch of the Long Death', subclassKey: 'long-death', level: 17, costs: [{ poolKey: 'class:monk:ki', amount: '1-10' }] },
      { featureKey: 'mastery-of-death', name: 'Mastery of Death', subclassKey: 'long-death', level: 11, costs: [{ poolKey: 'class:monk:ki', amount: 1 }] },
      { featureKey: 'searing-sunburst', name: 'Searing Sunburst', subclassKey: 'sun-soul', level: 11, costs: [{ poolKey: 'class:monk:ki', amount: '3+' }] },
      { featureKey: 'deft-strike', name: 'Deft Strike', subclassKey: 'kensei', level: 3, costs: [{ poolKey: 'class:monk:ki', amount: 1 }] },
      { featureKey: 'sharpen-the-blade', name: 'Sharpen the Blade', subclassKey: 'kensei', level: 11, costs: [{ poolKey: 'class:monk:ki', amount: '1-3' }] },
      { featureKey: 'arms-of-the-astral-self', name: 'Arms of the Astral Self', subclassKey: 'astral-self', level: 3, costs: [{ poolKey: 'class:monk:ki', amount: 2 }] },
      { featureKey: 'visage-of-the-astral-self', name: 'Visage of the Astral Self', subclassKey: 'astral-self', level: 6, costs: [{ poolKey: 'class:monk:ki', amount: 1 }] },
      { featureKey: 'body-of-the-astral-self', name: 'Body of the Astral Self', subclassKey: 'astral-self', level: 11, costs: [{ poolKey: 'class:monk:ki', amount: 1 }] },
      { featureKey: 'awakened-astral-self', name: 'Awakened Astral Self', subclassKey: 'astral-self', level: 17, costs: [{ poolKey: 'class:monk:ki', amount: 5 }] },
      { featureKey: 'hand-of-healing', name: 'Hand of Healing', subclassKey: 'mercy', level: 3, costs: [{ poolKey: 'class:monk:ki', amount: 1 }] },
      { featureKey: 'hand-of-harm', name: 'Hand of Harm', subclassKey: 'mercy', level: 3, costs: [{ poolKey: 'class:monk:ki', amount: 1 }] },
      { featureKey: 'hand-of-ultimate-mercy', name: 'Hand of Ultimate Mercy', subclassKey: 'mercy', level: 17, costs: [{ poolKey: 'class:monk:ki', amount: 5 }] },
      { featureKey: 'breath-of-the-dragon', name: 'Breath of the Dragon', subclassKey: 'ascendant-dragon', level: 3, costs: [{ poolKey: 'class:monk:ki', amount: 1, additionalUse: true }] },
      { featureKey: 'wings-of-the-dragon', name: 'Wings of the Dragon', subclassKey: 'ascendant-dragon', level: 6, costs: [{ poolKey: 'class:monk:ki', amount: 1, additionalUse: true }] },
      { featureKey: 'monk-quickened-healing', label: 'tceQuickenedHealing', tceFeatureKey: 'monk-quickened-healing', level: 2, costs: [{ poolKey: 'class:monk:ki', amount: 2 }] },
      { featureKey: 'monk-focused-aim', label: 'tceFocusedAim', tceFeatureKey: 'monk-focused-aim', level: 2, costs: [{ poolKey: 'class:monk:ki', amount: '1-3' }] },
    ],
    paladinChannelDivinity: [
      { featureKey: 'natures-wrath', name: "Nature's Wrath", subclassKey: 'ancients', level: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] },
      { featureKey: 'turn-the-faithless', name: 'Turn the Faithless', subclassKey: 'ancients', level: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] },
      { featureKey: 'sacred-weapon', name: 'Sacred Weapon', subclassKey: 'devotion', level: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] },
      { featureKey: 'turn-the-unholy', name: 'Turn the Unholy', subclassKey: 'devotion', level: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] },
      { featureKey: 'abjure-enemy', name: 'Abjure Enemy', subclassKey: 'vengeance', level: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] },
      { featureKey: 'vow-of-enmity', name: 'Vow of Enmity', subclassKey: 'vengeance', level: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] },
      { featureKey: 'control-undead', name: 'Control Undead', subclassKey: 'oathbreaker', level: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] },
      { featureKey: 'dreadful-aspect', name: 'Dreadful Aspect', subclassKey: 'oathbreaker', level: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] },
      { featureKey: 'conquering-presence', name: 'Conquering Presence', subclassKey: 'conquest', level: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] },
      { featureKey: 'guided-strike', name: 'Guided Strike', subclassKey: 'conquest', level: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] },
      { featureKey: 'emissary-of-peace', name: 'Emissary of Peace', subclassKey: 'redemption', level: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] },
      { featureKey: 'rebuke-the-violent', name: 'Rebuke the Violent', subclassKey: 'redemption', level: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] },
      { featureKey: 'peerless-athlete', name: 'Peerless Athlete', subclassKey: 'glory', level: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] },
      { featureKey: 'inspiring-smite', name: 'Inspiring Smite', subclassKey: 'glory', level: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] },
      { featureKey: 'watchers-will', name: "Watcher's Will", subclassKey: 'watchers', level: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] },
      { featureKey: 'abjure-the-extraplanar', name: 'Abjure the Extraplanar', subclassKey: 'watchers', level: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] },
      { featureKey: 'paladin-harness-divine-power', label: 'tceHarnessDivinePowerPaladin', tceFeatureKey: 'paladin-harness-divine-power', level: 3, costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }] }
    ],
    sorceryPoints: [
      { featureKey: 'flexible-casting', name: 'Flexible Casting', level: 2, costs: [{ poolKey: 'class:sorcerer:sorcery-points', amount: 'varies by slot level' }] },
      { featureKey: 'metamagic', name: 'Metamagic', level: 3, costs: [{ poolKey: 'class:sorcerer:sorcery-points', amount: 'varies by option' }] },
      { featureKey: 'hound-of-ill-omen', name: 'Hound of Ill Omen', subclassKey: 'shadow-magic', level: 6, costs: [{ poolKey: 'class:sorcerer:sorcery-points', amount: 3 }] },
      { featureKey: 'umbral-form', name: 'Umbral Form', subclassKey: 'shadow-magic', level: 14, costs: [{ poolKey: 'class:sorcerer:sorcery-points', amount: 6 }] },
      { featureKey: 'psionic-sorcery', name: 'Psionic Sorcery', subclassKey: 'aberrant-mind', level: 6, costs: [{ poolKey: 'class:sorcerer:sorcery-points', amount: 'spell level' }] },
      { featureKey: 'revelation-in-flesh', name: 'Revelation in Flesh', subclassKey: 'aberrant-mind', level: 14, costs: [{ poolKey: 'class:sorcerer:sorcery-points', amount: '1 per manifestation' }] },
      { featureKey: 'warping-implosion', name: 'Warping Implosion', subclassKey: 'aberrant-mind', level: 18, costs: [{ poolKey: 'class:sorcerer:sorcery-points', amount: 5, additionalUse: true }] },
      { featureKey: 'bastion-of-law', name: 'Bastion of Law', subclassKey: 'clockwork-soul', level: 6, costs: [{ poolKey: 'class:sorcerer:sorcery-points', amount: '1-5' }] },
      { featureKey: 'trance-of-order', name: 'Trance of Order', subclassKey: 'clockwork-soul', level: 14, costs: [{ poolKey: 'class:sorcerer:sorcery-points', amount: 5, alternative: true }] },
      { featureKey: 'clockwork-cavalcade', name: 'Clockwork Cavalcade', subclassKey: 'clockwork-soul', level: 18, costs: [{ poolKey: 'class:sorcerer:sorcery-points', amount: 7, alternative: true }] },
      { featureKey: 'sorcerer-magical-guidance', label: 'tceMagicalGuidance', tceFeatureKey: 'sorcerer-magical-guidance', level: 5, costs: [{ poolKey: 'class:sorcerer:sorcery-points', amount: 1 }] }
    ],
    soulknifeDice: [
      { featureKey: 'psi-bolstered-knack', name: 'Psi-Bolstered Knack', subclassKey: 'soulknife', level: 3, costs: [{ poolKey: 'subclass:rogue:soulknife:psionic-energy-dice', amount: 1 }] },
      { featureKey: 'psychic-whispers', name: 'Psychic Whispers', subclassKey: 'soulknife', level: 3, costs: [{ poolKey: 'subclass:rogue:soulknife:psionic-energy-dice', amount: 1, additionalUse: true }] },
      { featureKey: 'homing-strikes', name: 'Homing Strikes', subclassKey: 'soulknife', level: 9, costs: [{ poolKey: 'subclass:rogue:soulknife:psionic-energy-dice', amount: 1 }] },
      { featureKey: 'psychic-teleportation', name: 'Psychic Teleportation', subclassKey: 'soulknife', level: 9, costs: [{ poolKey: 'subclass:rogue:soulknife:psionic-energy-dice', amount: 1 }] },
      { featureKey: 'psychic-veil', name: 'Psychic Veil', subclassKey: 'soulknife', level: 13, costs: [{ poolKey: 'subclass:rogue:soulknife:psionic-energy-dice', amount: 1, additionalUse: true }] },
      { featureKey: 'rend-mind', name: 'Rend Mind', subclassKey: 'soulknife', level: 17, costs: [{ poolKey: 'subclass:rogue:soulknife:psionic-energy-dice', amount: 3 }] }
    ]
  };
  const classResourceData = [
    { classKey: 'artificer', key: 'flash-of-genius', label: 'Flash of Genius', level: 7, maximum: { type: 'ability', ability: 'int', minimum: 1 }, cooldown: '長休', source: 'TCE' },
    { classKey: 'artificer', key: 'spell-storing-item', label: 'Spell-Storing Item', level: 11, maximum: { type: 'ability-times', factor: 2, ability: 'int', minimum: 2 }, cooldown: '長休', source: 'TCE' },
    { classKey: 'artificer', subclassKey: 'alchemist', key: 'experimental-elixir', label: 'Experimental Elixir (free creation)', level: 3, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE', costs: [{ type: 'spell-slot', additionalUse: true }] },
    { classKey: 'artificer', subclassKey: 'alchemist', key: 'restorative-reagents', label: 'Restorative Reagents', level: 9, maximum: { type: 'ability', ability: 'int', minimum: 1 }, cooldown: '長休', source: 'TCE' },
    { classKey: 'artificer', subclassKey: 'armorer', key: 'defensive-field', label: 'Defensive Field', level: 3, maximum: { type: 'pb' }, cooldown: '長休', source: 'TCE' },
    { classKey: 'artificer', subclassKey: 'artillerist', key: 'eldritch-cannon', label: 'Eldritch Cannon (free creation)', level: 3, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', concurrentLimitByLevel: [[3, 1], [15, 2]], costs: [{ type: 'spell-slot', additionalUse: true }], source: 'TCE' },
    { classKey: 'artificer', subclassKey: 'battle-smith', key: 'arcane-jolt', label: 'Arcane Jolt', level: 9, maximum: { type: 'ability', ability: 'int', minimum: 1 }, cooldown: '長休', source: 'TCE', usageGate: 'once-per-turn' },
    { classKey: 'barbarian', key: 'rage', label: 'Rage', level: 1, maximum: { type: 'barbarian-rage' }, cooldown: '長休', source: 'PHB', shared: true, consumers: sharedPoolConsumers.rage },
    { classKey: 'barbarian', subclassKey: 'ancestral-guardian', key: 'consult-the-spirits', label: 'Consult the Spirits', level: 10, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'XGE' },
    { classKey: 'barbarian', subclassKey: 'wild-magic', key: 'bolstering-magic', label: 'Bolstering Magic', level: 6, maximum: { type: 'pb' }, cooldown: '長休', source: 'TCE' },
    { classKey: 'bard', key: 'bardic-inspiration', label: 'Bardic Inspiration', level: 1, maximum: { type: 'ability', ability: 'cha', minimum: 1 }, cooldown: '長休', recoveryFromLevel: [{ level: 5, cooldown: '短休' }], initiativeRecovery: 1, initiativeRecoveryFromLevel: 20, initiativeRecoveryWhenEmpty: true, source: 'PHB', shared: true, consumers: sharedPoolConsumers.bardicInspiration },
    { classKey: 'bard', subclassKey: 'glamour', key: 'enthralling-performance', label: 'Enthralling Performance', level: 3, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'XGE' },
    { classKey: 'bard', subclassKey: 'glamour', key: 'mantle-of-majesty', label: 'Mantle of Majesty', level: 6, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'XGE' },
    { classKey: 'bard', subclassKey: 'glamour', key: 'unbreakable-majesty', label: 'Unbreakable Majesty', level: 14, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'XGE' },
    { classKey: 'bard', subclassKey: 'whispers', key: 'words-of-terror', label: 'Words of Terror', level: 3, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'XGE' },
    { classKey: 'bard', subclassKey: 'whispers', key: 'mantle-of-whispers', label: 'Mantle of Whispers', level: 6, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'XGE' },
    { classKey: 'bard', subclassKey: 'whispers', key: 'shadow-lore', label: 'Shadow Lore', level: 14, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'XGE' },
    { classKey: 'bard', subclassKey: 'creation', key: 'performance-of-creation', label: 'Performance of Creation', level: 3, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE', costs: [{ type: 'spell-slot', minimumLevel: 2, additionalUse: true }] },
    { classKey: 'bard', subclassKey: 'creation', key: 'animating-performance', label: 'Animating Performance', level: 6, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE', costs: [{ type: 'spell-slot', minimumLevel: 3, additionalUse: true }] },
    { classKey: 'bard', subclassKey: 'eloquence', key: 'universal-speech', label: 'Universal Speech', level: 6, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE' },
    { classKey: 'bard', subclassKey: 'eloquence', key: 'infectious-inspiration', label: 'Infectious Inspiration', level: 14, maximum: { type: 'ability', ability: 'cha', minimum: 1 }, cooldown: '長休', source: 'TCE' },
    { classKey: 'cleric', key: 'divine-intervention', label: 'Divine Intervention', level: 10, maximum: { type: 'fixed', value: 1 }, cooldown: '成功使用後 7 日', recoveryTrigger: 'divine-intervention-success', source: 'PHB' },
    { classKey: 'cleric', key: 'channel-divinity', label: 'Channel Divinity', level: 2, maximum: { type: 'cleric-channel-divinity' }, cooldown: '短休', source: 'PHB', shared: true, consumers: sharedPoolConsumers.clericChannelDivinity },
    { classKey: 'cleric', subclassKey: 'knowledge', key: 'visions-of-the-past', label: 'Visions of the Past', level: 17, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'PHB' },
    { classKey: 'cleric', subclassKey: 'light', key: 'warding-flare', label: 'Warding Flare', level: 1, maximum: { type: 'ability', ability: 'wis', minimum: 1 }, cooldown: '長休', source: 'PHB' },
    { classKey: 'cleric', subclassKey: 'tempest', key: 'wrath-of-the-storm', label: 'Wrath of the Storm', level: 1, maximum: { type: 'ability', ability: 'wis', minimum: 1 }, cooldown: '長休', source: 'PHB' },
    { classKey: 'cleric', subclassKey: 'grave', key: 'sentinel-at-deaths-door', label: "Sentinel at Death's Door", level: 6, maximum: { type: 'ability', ability: 'wis', minimum: 1 }, cooldown: '長休', source: 'XGE' },
    { classKey: 'cleric', subclassKey: 'order', key: 'embodiment-of-the-law', label: 'Embodiment of the Law', level: 6, maximum: { type: 'ability', ability: 'wis', minimum: 1 }, cooldown: '長休', source: 'TCE' },
    { classKey: 'cleric', subclassKey: 'peace', key: 'emboldening-bond', label: 'Emboldening Bond', level: 1, maximum: { type: 'pb' }, cooldown: '長休', source: 'TCE' },
    { classKey: 'cleric', subclassKey: 'twilight', key: 'steps-of-night', label: 'Steps of Night', level: 6, maximum: { type: 'pb' }, cooldown: '長休', source: 'TCE' },
    { classKey: 'cleric', subclassKey: 'twilight', key: 'eyes-of-night', label: 'Eyes of Night', level: 1, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE', costs: [{ type: 'spell-slot', additionalUse: true }] },
    { classKey: 'cleric', subclassKey: 'war', key: 'war-priest', label: 'War Priest', level: 1, maximum: { type: 'ability', ability: 'wis', minimum: 1 }, cooldown: '長休', source: 'PHB' },
    { classKey: 'cleric', tceFeatureKey: 'cleric-harness-divine-power', key: 'harness-divine-power', label: 'Harness Divine Power', level: 2, maximum: { type: 'level-tiers', tiers: [[2, 1], [6, 2], [18, 3]] }, cooldown: '長休', source: 'TCE', costs: [{ poolKey: 'class:cleric:channel-divinity', amount: 1 }], spellSlotRecovery: { amount: 1, maxLevelFormula: { type: 'half-pb-up' } } },
    { classKey: 'druid', key: 'wild-shape', label: 'Wild Shape', level: 2, maximum: { type: 'level-tiers', tiers: [[2, 2], [20, 0]] }, cooldown: '短休', source: 'PHB', shared: true, consumers: sharedPoolConsumers.wildShape },
    { classKey: 'druid', subclassKey: 'dreams', key: 'balm-of-the-summer-court', label: 'Balm of the Summer Court', level: 2, maximum: { type: 'class-level', die: 'd6' }, cooldown: '長休', source: 'XGE', poolMode: 'dice' },
    { classKey: 'druid', subclassKey: 'dreams', key: 'hidden-paths', label: 'Hidden Paths', level: 10, maximum: { type: 'ability', ability: 'wis', minimum: 1 }, cooldown: '長休', source: 'XGE' },
    { classKey: 'druid', subclassKey: 'shepherd', key: 'spirit-totem', label: 'Spirit Totem', level: 2, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'XGE' },
    { classKey: 'druid', subclassKey: 'stars', key: 'star-map-guiding-bolt', label: 'Star Map (Guiding Bolt free cast)', level: 2, maximum: { type: 'pb' }, cooldown: '長休', source: 'TCE', poolMode: 'free-cast' },
    { classKey: 'druid', subclassKey: 'stars', key: 'cosmic-omen', label: 'Cosmic Omen', level: 6, maximum: { type: 'pb' }, cooldown: '長休', source: 'TCE' },
    { classKey: 'druid', subclassKey: 'wildfire', key: 'cauterizing-flames', label: 'Cauterizing Flames', level: 10, maximum: { type: 'ability', ability: 'wis', minimum: 1 }, cooldown: '長休', source: 'TCE', relatedFeatureCosts: [{ featureKey: 'wildfire-spirit', name: 'Wildfire Spirit', costs: [{ poolKey: 'class:druid:wild-shape', label: 'classWildShapeUseCost', amount: 1, alternative: true }, { type: 'spell-slot', alternative: true }] }] },
    { classKey: 'fighter', key: 'second-wind', label: 'Second Wind', level: 1, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'PHB' },
    { classKey: 'fighter', key: 'action-surge', label: 'Action Surge', level: 2, maximum: { type: 'level-tiers', tiers: [[1, 1], [17, 2]] }, cooldown: '短休', source: 'PHB', usageGate: 'once-on-your-turn' },
    { classKey: 'fighter', key: 'indomitable', label: 'Indomitable', level: 9, maximum: { type: 'level-tiers', tiers: [[9, 1], [13, 2], [17, 3]] }, cooldown: '長休', source: 'PHB' },
    { classKey: 'fighter', subclassKey: 'battle-master', key: 'superiority-dice', label: 'Superiority Dice', level: 3, maximum: { type: 'level-tiers', tiers: [[3, 4], [7, 5], [15, 6]] }, dieByLevel: [[3, 'd8'], [10, 'd10'], [18, 'd12']], cooldown: '短休', initiativeRecovery: 1, initiativeRecoveryFromLevel: 15, initiativeRecoveryWhenEmpty: true, source: 'PHB', shared: true, poolMode: 'dice', dicePoolGroup: 'superiority-dice', dicePoolLabel: 'Superiority Dice', consumers: sharedPoolConsumers.superiorityDice },
    { classKey: 'fighter', subclassKey: 'arcane-archer', key: 'arcane-shot', label: 'Arcane Shot', level: 3, maximum: { type: 'fixed', value: 2 }, cooldown: '短休', initiativeRecovery: 1, initiativeRecoveryFromLevel: 15, initiativeRecoveryWhenEmpty: true, source: 'XGE' },
    { classKey: 'fighter', subclassKey: 'cavalier', key: 'unwavering-mark', label: 'Unwavering Mark', level: 3, maximum: { type: 'ability', ability: 'str', minimum: 1 }, cooldown: '長休', source: 'XGE' },
    { classKey: 'fighter', subclassKey: 'cavalier', key: 'warding-maneuver', label: 'Warding Maneuver', level: 7, maximum: { type: 'ability', ability: 'con', minimum: 1 }, cooldown: '長休', source: 'XGE' },
    { classKey: 'fighter', subclassKey: 'samurai', key: 'fighting-spirit', label: 'Fighting Spirit', level: 3, maximum: { type: 'fixed', value: 3 }, cooldown: '長休', initiativeRecovery: 1, initiativeRecoveryFromLevel: 10, initiativeRecoveryWhenEmpty: true, source: 'XGE' },
    { classKey: 'fighter', subclassKey: 'samurai', key: 'strength-before-death', label: 'Strength Before Death', level: 18, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'XGE' },
    { classKey: 'fighter', subclassKey: 'rune-knight', key: 'giants-might', label: "Giant's Might", level: 3, maximum: { type: 'pb' }, cooldown: '長休', source: 'TCE' },
    { classKey: 'fighter', subclassKey: 'rune-knight', key: 'runic-shield', label: 'Runic Shield', level: 7, maximum: { type: 'pb' }, cooldown: '長休', source: 'TCE' },
    { classKey: 'fighter', subclassKey: 'psi-warrior', key: 'psionic-energy-dice', label: 'Psionic Energy Dice', level: 3, maximum: { type: 'twice-pb' }, dieByLevel: [[3, 'd6'], [5, 'd8'], [11, 'd10'], [17, 'd12']], cooldown: '長休', source: 'TCE', shared: true, initiativeRecovery: 1, initiativeRecoveryWhenEmpty: true, poolMode: 'dice', consumers: sharedPoolConsumers.psiWarriorDice },
    { classKey: 'fighter', subclassKey: 'psi-warrior', key: 'bulwark-of-force', label: 'Bulwark of Force', level: 15, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE', costs: [{ poolKey: 'subclass:fighter:psi-warrior:psionic-energy-dice', additionalUse: true }] },
    { classKey: 'fighter', subclassKey: 'psi-warrior', key: 'telekinetic-master', label: 'Telekinetic Master', level: 18, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE', costs: [{ poolKey: 'subclass:fighter:psi-warrior:psionic-energy-dice', additionalUse: true }] },
    { classKey: 'monk', key: 'ki', label: 'Ki', level: 2, maximum: { type: 'class-level' }, cooldown: '短休', initiativeRecovery: 4, initiativeRecoveryFromLevel: 20, initiativeRecoveryWhenEmpty: true, source: 'PHB', shared: true, poolMode: 'points', consumers: sharedPoolConsumers.ki },
    { classKey: 'monk', subclassKey: 'mercy', key: 'hand-of-ultimate-mercy', label: 'Hand of Ultimate Mercy', level: 17, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE', costs: [{ poolKey: 'class:monk:ki', amount: 5 }] },
    { classKey: 'monk', subclassKey: 'ascendant-dragon', key: 'breath-of-the-dragon', label: 'Breath of the Dragon', level: 3, maximum: { type: 'pb' }, cooldown: '長休', source: 'FToD', costs: [{ poolKey: 'class:monk:ki', additionalUse: true }] },
    { classKey: 'monk', subclassKey: 'ascendant-dragon', key: 'wings-of-the-dragon', label: 'Wings of the Dragon', level: 6, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'FToD', costs: [{ poolKey: 'class:monk:ki', additionalUse: true }] },
    { classKey: 'paladin', key: 'divine-sense', label: 'Divine Sense', level: 1, maximum: { type: 'ability-plus', ability: 'cha', amount: 1, minimum: 1 }, cooldown: '長休', source: 'PHB' },
    { classKey: 'paladin', key: 'lay-on-hands', label: 'Lay on Hands', level: 1, maximum: { type: 'class-level-times', factor: 5 }, cooldown: '長休', source: 'PHB', poolMode: 'hit-points' },
    { classKey: 'paladin', key: 'channel-divinity', label: 'Channel Divinity', level: 3, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'PHB', shared: true, consumers: sharedPoolConsumers.paladinChannelDivinity },
    { classKey: 'paladin', subclassKey: 'glory', key: 'glorious-defense', label: 'Glorious Defense', level: 15, maximum: { type: 'ability', ability: 'cha', minimum: 1 }, cooldown: '長休', source: 'TCE' },
    { classKey: 'paladin', subclassKey: 'watchers', key: 'vigilant-rebuke', label: 'Vigilant Rebuke', level: 15, maximum: { type: 'ability', ability: 'cha', minimum: 1 }, cooldown: '長休', source: 'TCE' },
    { classKey: 'paladin', tceFeatureKey: 'paladin-harness-divine-power', key: 'harness-divine-power', label: 'Harness Divine Power', level: 3, maximum: { type: 'level-tiers', tiers: [[3, 1], [7, 2], [15, 3]] }, cooldown: '長休', source: 'TCE', costs: [{ poolKey: 'class:paladin:channel-divinity', amount: 1 }], spellSlotRecovery: { amount: 1, maxLevelFormula: { type: 'half-pb-up' } } },
    { classKey: 'ranger', subclassKey: 'horizon-walker', key: 'detect-portal', label: 'Detect Portal', level: 3, maximum: { type: 'ability', ability: 'wis', minimum: 1 }, cooldown: '長休', source: 'XGE' },
    { classKey: 'ranger', subclassKey: 'horizon-walker', key: 'ethereal-step', label: 'Ethereal Step', level: 7, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'XGE' },
    { classKey: 'ranger', subclassKey: 'monster-slayer', key: 'magic-users-nemesis', label: "Magic-User's Nemesis", level: 11, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'XGE' },
    { classKey: 'ranger', subclassKey: 'fey-wanderer', key: 'fey-reinforcements', label: 'Fey Reinforcements (free casting)', level: 11, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE', costs: [{ type: 'spell-slot', additionalUse: true }] },
    { classKey: 'ranger', subclassKey: 'fey-wanderer', key: 'misty-wanderer', label: 'Misty Wanderer', level: 15, maximum: { type: 'ability', ability: 'wis', minimum: 1 }, cooldown: '長休', source: 'TCE' },
    { classKey: 'ranger', subclassKey: 'swarmkeeper', key: 'writhing-tide', label: 'Writhing Tide', level: 7, maximum: { type: 'pb' }, cooldown: '長休', source: 'TCE' },
    { classKey: 'ranger', subclassKey: 'drakewarden', key: 'drake-companion', label: 'Drake Companion', level: 3, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'FToD', costs: [{ type: 'spell-slot', additionalUse: true }] },
    { classKey: 'ranger', subclassKey: 'drakewarden', key: 'drakes-breath', label: "Drake's Breath", level: 11, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'FToD', costs: [{ type: 'spell-slot', minimumLevel: 3, additionalUse: true }] },
    { classKey: 'ranger', tceFeatureKey: 'ranger-favored-foe', key: 'favored-foe', label: 'Favored Foe', level: 1, maximum: { type: 'pb' }, cooldown: '長休', source: 'TCE', effectGate: 'favored-foe-damage-on-your-turn' },
    { classKey: 'ranger', tceFeatureKey: 'ranger-natures-veil', key: 'natures-veil', label: "Nature's Veil", level: 10, maximum: { type: 'pb' }, cooldown: '長休', source: 'TCE' },
    { classKey: 'rogue', key: 'stroke-of-luck', label: 'Stroke of Luck', level: 20, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'PHB' },
    { classKey: 'rogue', subclassKey: 'arcane-trickster', key: 'spell-thief', label: 'Spell Thief', level: 17, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'PHB' },
    { classKey: 'rogue', subclassKey: 'inquisitive', key: 'unerring-eye', label: 'Unerring Eye', level: 9, maximum: { type: 'ability', ability: 'wis', minimum: 1 }, cooldown: '長休', source: 'XGE' },
    { classKey: 'rogue', subclassKey: 'swashbuckler', key: 'master-duelist', label: 'Master Duelist', level: 17, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'XGE' },
    { classKey: 'rogue', subclassKey: 'phantom', key: 'wails-from-the-grave', label: 'Wails from the Grave', level: 3, maximum: { type: 'pb' }, cooldown: '長休', source: 'TCE', costs: [{ poolKey: 'subclass:rogue:phantom:soul-trinkets', amount: 1, alternative: true, minimumClassLevel: 9 }] },
    { classKey: 'rogue', subclassKey: 'phantom', key: 'soul-trinkets', label: 'Soul Trinkets', level: 9, maximum: { type: 'pb' }, cooldown: '手動', source: 'TCE', initialValue: 0, poolMode: 'accumulative', accumulative: true, recoveryEvents: [{ key: 'classTriggerSoulTrinketDeath' }], notes: ['classSoulTrinketPassiveBenefits', 'classSoulTrinketAskSpirit'], longRestRecoveryFromLevel: [{ level: 17, amount: 1, whenEmpty: true }] },
    { classKey: 'rogue', subclassKey: 'phantom', key: 'ghost-walk', label: 'Ghost Walk', level: 13, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE', costs: [{ poolKey: 'subclass:rogue:phantom:soul-trinkets', amount: 1, alternative: true }] },
    { classKey: 'rogue', subclassKey: 'soulknife', key: 'psionic-energy-dice', label: 'Psionic Energy Dice', level: 3, maximum: { type: 'twice-pb' }, dieByLevel: [[3, 'd6'], [5, 'd8'], [11, 'd10'], [17, 'd12']], cooldown: '長休', source: 'TCE', shared: true, shortRestRecovery: 1, initiativeRecovery: 1, initiativeRecoveryWhenEmpty: true, poolMode: 'dice', consumers: sharedPoolConsumers.soulknifeDice },
    { classKey: 'rogue', subclassKey: 'soulknife', key: 'psychic-whispers', label: 'Psychic Whispers', level: 3, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE', costs: [{ poolKey: 'subclass:rogue:soulknife:psionic-energy-dice', amount: 1, additionalUse: true }] },
    { classKey: 'rogue', subclassKey: 'soulknife', key: 'psychic-veil', label: 'Psychic Veil', level: 13, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE', costs: [{ poolKey: 'subclass:rogue:soulknife:psionic-energy-dice', amount: 1, additionalUse: true }] },
    { classKey: 'sorcerer', key: 'sorcery-points', label: 'Sorcery Points', level: 2, maximum: { type: 'class-level' }, cooldown: '長休', source: 'PHB', shared: true, poolMode: 'points', consumers: sharedPoolConsumers.sorceryPoints },
    { classKey: 'sorcerer', subclassKey: 'wild-magic', key: 'tides-of-chaos', label: 'Tides of Chaos', level: 1, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'PHB', recoveryTrigger: 'wild-magic-surge' },
    { classKey: 'sorcerer', subclassKey: 'divine-soul', key: 'favored-by-the-gods', label: 'Favored by the Gods', level: 1, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'XGE' },
    { classKey: 'sorcerer', subclassKey: 'shadow-magic', key: 'strength-of-the-grave', label: 'Strength of the Grave', level: 1, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'XGE' },
    { classKey: 'sorcerer', subclassKey: 'clockwork-soul', key: 'restore-balance', label: 'Restore Balance', level: 1, maximum: { type: 'pb' }, cooldown: '長休', source: 'TCE' },
    { classKey: 'sorcerer', subclassKey: 'clockwork-soul', key: 'trance-of-order', label: 'Trance of Order', level: 14, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE', costs: [{ poolKey: 'class:sorcerer:sorcery-points', amount: 5, alternative: true }] },
    { classKey: 'sorcerer', subclassKey: 'clockwork-soul', key: 'clockwork-cavalcade', label: 'Clockwork Cavalcade', level: 18, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE', costs: [{ poolKey: 'class:sorcerer:sorcery-points', amount: 7, alternative: true }] },
    { classKey: 'sorcerer', subclassKey: 'aberrant-mind', key: 'warping-implosion', label: 'Warping Implosion', level: 18, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE', costs: [{ poolKey: 'class:sorcerer:sorcery-points', amount: 5, additionalUse: true }] },
    { classKey: 'warlock', key: 'eldritch-master', label: 'Eldritch Master', level: 20, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'PHB', recoveryTarget: 'class:warlock:pact-slots' },
    { classKey: 'warlock', subclassKey: 'archfey', key: 'fey-presence', label: 'Fey Presence', level: 1, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'PHB' },
    { classKey: 'warlock', subclassKey: 'archfey', key: 'misty-escape', label: 'Misty Escape', level: 6, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'PHB' },
    { classKey: 'warlock', subclassKey: 'archfey', key: 'dark-delirium', label: 'Dark Delirium', level: 14, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'PHB' },
    { classKey: 'warlock', subclassKey: 'fiend', key: 'dark-ones-own-luck', label: "Dark One's Own Luck", level: 6, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'PHB' },
    { classKey: 'warlock', subclassKey: 'fiend', key: 'hurl-through-hell', label: 'Hurl Through Hell', level: 14, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'PHB' },
    { classKey: 'warlock', subclassKey: 'great-old-one', key: 'entropic-ward', label: 'Entropic Ward', level: 6, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'PHB' },
    { classKey: 'warlock', subclassKey: 'hexblade', key: 'hexblades-curse', label: "Hexblade's Curse", level: 1, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'XGE' },
    { classKey: 'warlock', subclassKey: 'hexblade', key: 'accursed-specter', label: 'Accursed Specter', level: 6, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'XGE' },
    { classKey: 'warlock', subclassKey: 'celestial', key: 'healing-light', label: 'Healing Light', level: 1, maximum: { type: 'class-level-plus-one', die: 'd6' }, cooldown: '長休', source: 'XGE' },
    { classKey: 'warlock', subclassKey: 'celestial', key: 'searing-vengeance', label: 'Searing Vengeance', level: 14, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'XGE' },
    { classKey: 'warlock', subclassKey: 'fathomless', key: 'tentacle-of-the-deeps', label: 'Tentacle of the Deeps', level: 1, maximum: { type: 'pb' }, cooldown: '長休', source: 'TCE' },
    { classKey: 'warlock', subclassKey: 'fathomless', key: 'fathomless-plunge', label: 'Fathomless Plunge', level: 14, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE' },
    { classKey: 'warlock', subclassKey: 'genie', key: 'bottled-respite', label: 'Bottled Respite', level: 1, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE', effectDuration: { formula: { type: 'twice-pb' }, unit: 'hours' } },
    { classKey: 'warlock', subclassKey: 'genie', key: 'elemental-gift', label: 'Elemental Gift', level: 6, maximum: { type: 'pb' }, cooldown: '長休', source: 'TCE' },
    { classKey: 'wizard', subclassKey: 'conjuration', key: 'benign-transposition', label: 'Benign Transposition', level: 6, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'PHB', recoveryTrigger: 'conjuration-spell-slot' },
    { classKey: 'wizard', subclassKey: 'divination', key: 'portent', label: 'Portent', level: 2, maximum: { type: 'level-tiers', tiers: [[2, 2], [14, 3]] }, cooldown: '長休', source: 'PHB' },
    { classKey: 'wizard', subclassKey: 'divination', key: 'third-eye', label: 'Third Eye', level: 10, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'PHB' },
    { classKey: 'wizard', subclassKey: 'evocation', key: 'overchannel', label: 'Overchannel', level: 14, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'PHB', costs: [{ type: 'damage', additionalUse: true }] },
    { classKey: 'wizard', subclassKey: 'illusion', key: 'illusory-self', label: 'Illusory Self', level: 10, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'PHB' },
    { classKey: 'wizard', subclassKey: 'transmutation', key: 'shapechanger', label: 'Shapechanger', level: 10, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'PHB' },
    { classKey: 'wizard', subclassKey: 'transmutation', key: 'major-transformation', label: 'Major Transformation', level: 14, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'PHB', consumesItem: "Transmuter's Stone" },
    { classKey: 'wizard', key: 'signature-spell-1', label: 'Signature Spell 1', level: 20, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'PHB', poolMode: 'free-cast' },
    { classKey: 'wizard', key: 'signature-spell-2', label: 'Signature Spell 2', level: 20, maximum: { type: 'fixed', value: 1 }, cooldown: '短休', source: 'PHB', poolMode: 'free-cast' },
    { classKey: 'wizard', subclassKey: 'war-magic', key: 'power-surge', label: 'Power Surge', level: 2, maximum: { type: 'ability', ability: 'int', minimum: 1 }, cooldown: '長休', initialValue: 1, longRestResetTo: 1, recoveryEvents: [{ key: 'classTriggerCounterspellDispel' }, { key: 'classTriggerArcaneDeflectionWhenEmpty' }], source: 'XGE' },
    { classKey: 'wizard', subclassKey: 'bladesinging', key: 'bladesong', label: 'Bladesong', level: 2, maximum: { type: 'pb' }, cooldown: '長休', source: 'TCE' },
    { classKey: 'wizard', subclassKey: 'order-of-scribes', key: 'manifest-mind', label: 'Manifest Mind', level: 6, maximum: { type: 'fixed', value: 1 }, cooldown: '長休', source: 'TCE', costs: [{ type: 'spell-slot', additionalUse: true }] }
  ];
  const params = new URLSearchParams(window.location.search);
  const storedDb = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if (normalizeLegacyRestTerminology(storedDb)) localStorage.setItem(storageKey, JSON.stringify(storedDb));
  const storedClassFeatureSettingsValue = JSON.parse(localStorage.getItem(classSettingsStorageKey) || '{}');
  if (!storedClassFeatureSettingsValue || typeof storedClassFeatureSettingsValue !== 'object' || Array.isArray(storedClassFeatureSettingsValue)) {
    throw new Error('Invalid class feature settings in local storage.');
  }
  const storedClassFeatureSettings = Object.create(null);
  Object.keys(storedClassFeatureSettingsValue).forEach(function (key) {
    storedClassFeatureSettings[key] = storedClassFeatureSettingsValue[key];
  });
  const requestedCharacter = params.get('character');
  const state = {
    db: storedDb,
    character: requestedCharacter && storedDb[requestedCharacter] ? requestedCharacter : '',
    selectedResource: null,
    editorMode: 'create',
    editorIndex: null,
    editorSourceName: '',
    pendingAction: null,
    modal: null,
    roleModal: null,
    toast: null,
    classRowId: 0,
    classFeatureSettings: storedClassFeatureSettings,
    openManagementAfterRoleCreate: false,
    hitDiceAccumulator: { d6: 0, d8: 0, d10: 0, d12: 0 }
  };

  const app = document.getElementById('crApp');
  const modalElement = document.getElementById('managementModal');
  const roleModalElement = document.getElementById('roleCreateModal');
  state.modal = bootstrap.Modal.getOrCreateInstance(modalElement);
  state.roleModal = bootstrap.Modal.getOrCreateInstance(roleModalElement);
  state.toast = bootstrap.Toast.getOrCreateInstance(document.getElementById('crToast'));

  function notify(message) {
    setText(document.getElementById('crToastMessage'), message);
    state.toast.show();
  }

  function save() {
    localStorage.setItem(storageKey, JSON.stringify(state.db));
  }

  function sourceLabel(value) {
    const source = sourceInfo[value];
    return source ? t(source.label) : String(value == null || value === '' ? t('sourceOtherLabel') : value);
  }

  function cooldownLabel(value) {
    const cooldown = cooldownInfo[value];
    return cooldown ? t(cooldown.label) : String(value == null ? '' : value);
  }

  function createResourceRestBadge(resource) {
    const cooldown = cooldownLabel(resource && resource.cooldown ? resource.cooldown : '手動');
    const badge = document.createElement('span');
    badge.className = 'resource-rest-badge';
    badge.textContent = cooldown;
    badge.title = cooldown;
    badge.setAttribute('aria-label', cooldown);
    return badge;
  }

  function isAccumulativeResource(resource) {
    const metadata = resource && resource.generatedClass;
    return Boolean(metadata && metadata.accumulative === true);
  }

  function resourceCountText(resource) {
    const values = { current: resource.current, max: resource.max };
    return isAccumulativeResource(resource)
      ? t('accumulativeResourceCountTemplate', values)
      : t('common.resourceCountTemplate', Object.assign({ prefix: t('resourceCountPrefix') }, values));
  }

  function syncAccumulativeControls(container, resource) {
    if (!container || !isAccumulativeResource(resource)) return;
    const current = Number(resource.current);
    const maximum = Number(resource.max);
    container.querySelectorAll('.accumulative-control').forEach(function (control) {
      const input = control.querySelector('[data-accumulative-amount]');
      const button = control.querySelector('[data-action="adjust-accumulative-resource"]');
      const available = button.dataset.direction === 'gain'
        ? Math.max(0, maximum - current)
        : Math.max(0, current);
      input.max = String(available);
      const amount = Number(input.value);
      button.disabled = !state.character || !Number.isSafeInteger(amount) || amount < 1 || amount > available;
    });
  }

  function createResourceActions(resource, index, small) {
    const actions = document.createElement('div');
    if (isAccumulativeResource(resource)) {
      actions.className = 'accumulative-controls';
      [
        { direction: 'gain', buttonLabel: 'accumulativeResourceGain', inputLabel: 'accumulativeResourceGainAmount' },
        { direction: 'spend', buttonLabel: 'accumulativeResourceSpend', inputLabel: 'accumulativeResourceSpendAmount' }
      ].forEach(function (controlDefinition) {
        const control = document.createElement('div');
        control.className = 'input-group input-group-sm accumulative-control';
        const input = document.createElement('input');
        input.className = 'form-control';
        input.type = 'number';
        input.min = '1';
        input.step = '1';
        input.value = '1';
        input.dataset.accumulativeAmount = '';
        input.setAttribute('aria-label', t(controlDefinition.inputLabel));
        const button = document.createElement('button');
        button.className = 'btn btn-outline-light';
        button.type = 'button';
        button.dataset.action = 'adjust-accumulative-resource';
        button.dataset.direction = controlDefinition.direction;
        button.dataset.index = String(index);
        button.textContent = t(controlDefinition.buttonLabel);
        control.append(input, button);
        actions.appendChild(control);
      });
      syncAccumulativeControls(actions, resource);
      return actions;
    }

    actions.className = 'd-flex gap-2 mt-2';
    const useButton = document.createElement('button');
    useButton.className = small ? 'btn btn-light btn-sm flex-fill' : 'btn btn-light flex-fill';
    useButton.type = 'button';
    useButton.dataset.action = 'use-resource';
    useButton.dataset.index = String(index);
    useButton.textContent = t('resourceUse');
    useButton.disabled = !state.character || Number(resource.current) <= 0;
    const resetButton = document.createElement('button');
    resetButton.className = small ? 'btn btn-warning btn-sm flex-fill' : 'btn btn-warning flex-fill';
    resetButton.type = 'button';
    resetButton.dataset.action = 'reset-resource';
    resetButton.dataset.index = String(index);
    resetButton.textContent = t('resourceReset');
    resetButton.disabled = !state.character;
    actions.append(useButton, resetButton);
    return actions;
  }

  function classResourceDetails(resource) {
    const metadata = resource && resource.generatedClass;
    if (!metadata || metadata.kind !== 'class-resource') return '';
    const details = [];
    const gateLabels = {
      'once-per-turn': 'classUsageGateTurn',
      'once-on-your-turn': 'classUsageGateYourTurn',
      'once-per-round': 'classUsageGateRound'
    };
    if (metadata.usageGate && gateLabels[metadata.usageGate]) details.push(t(gateLabels[metadata.usageGate]));
    if (metadata.effectGate === 'favored-foe-damage-on-your-turn') details.push(t('classEffectGateFavoredFoeDamage'));
    function costText(cost) {
      let costName = cost.type === 'spell-slot'
        ? Number.isInteger(cost.minimumLevel) ? t('classSpellSlotMinimumLevelCostTemplate', { level: cost.minimumLevel }) : t('classSpellSlotCost')
        : cost.type === 'pact-slot' ? t('classPactSlotCost')
          : cost.type === 'damage' ? t('classDamageCost') : '';
      if (cost.poolKey) {
        const pool = currentResources().find(function (candidate) {
          return candidate.generatedClass && candidate.generatedClass.resourceKey === cost.poolKey;
        });
        costName = pool ? displayResourceName(pool) : cost.label ? t(cost.label) : cost.poolKey;
      }
      if (!costName) return '';
      const amount = cost.amount === undefined ? '' : String(cost.amount);
      return cost.alternative
        ? t('classResourceAlternativeCostTemplate', { amount: amount, resource: costName })
        : cost.additionalUse
          ? t('classResourceAdditionalCostTemplate', { amount: amount, resource: costName })
          : t('classResourceCostTemplate', { amount: amount, resource: costName });
    }
    (metadata.costs || []).forEach(function (cost) {
      const text = costText(cost);
      if (text) details.push(text);
    });
    const consumers = Array.isArray(metadata.consumers) ? metadata.consumers : [];
    const listedConsumerKeys = new Set(consumers.map(function (consumer) { return consumer.featureKey; }).filter(Boolean));
    if (consumers.length) {
      details.push(t('classResourceConsumersTemplate', {
        features: consumers.map(function (consumer) {
          const name = consumer.label ? t(consumer.label) : consumer.name;
          const costs = (consumer.costs || []).map(costText).filter(Boolean);
          return costs.length ? t('classResourceConsumerCostTemplate', { feature: name, costs: costs.join('／') }) : name;
        }).join('、')
      }));
    }
    (metadata.relatedFeatureCosts || []).forEach(function (feature) {
      const costs = (feature.costs || []).map(costText).filter(Boolean);
      if (costs.length) details.push(t('classResourceConsumerCostTemplate', { feature: feature.name, costs: costs.join('／') }));
    });
    (Array.isArray(metadata.activeTceFeatures) ? metadata.activeTceFeatures : []).forEach(function (feature) {
      const definition = tceFeatureData.find(function (option) { return option.key === feature.key; });
      if (!definition || listedConsumerKeys.has(feature.key) || !Array.isArray(feature.costs) || !feature.costs.some(function (cost) { return cost.poolKey === metadata.resourceKey; })) return;
      const costs = feature.costs.map(costText).filter(Boolean);
      if (costs.length) details.push(t('classResourceConsumerCostTemplate', { feature: t(definition.label), costs: costs.join('／') }));
    });
    if (metadata.shortRestRecovery > 0) details.push(t('classResourceRestRecoveryTemplate', { rest: t('cooldownShortRest'), amount: metadata.shortRestRecovery }));
    if (metadata.longRestRecovery > 0) {
      const recoveryKey = metadata.longRestRecoveryWhenEmpty
        ? 'classResourceRestRecoveryWhenEmptyTemplate'
        : 'classResourceRestRecoveryTemplate';
      details.push(t(recoveryKey, { rest: t('cooldownLongRest'), amount: metadata.longRestRecovery }));
    }
    if (Number.isInteger(metadata.longRestResetTo)) details.push(t('classResourceRestResetTemplate', { rest: t('cooldownLongRest'), amount: metadata.longRestResetTo }));
    if (metadata.resourceDie) details.push(t('classResourceDieTemplate', { die: formatDieLabel(metadata.resourceDie) }));
    if (metadata.spellSlotRecovery && Number.isInteger(metadata.spellSlotRecovery.maxLevel)) {
      details.push(t('classResourceSpellSlotRecoveryTemplate', { amount: metadata.spellSlotRecovery.amount, level: metadata.spellSlotRecovery.maxLevel }));
    }
    if (metadata.effectDuration && metadata.effectDuration.unit === 'hours' && Number.isInteger(metadata.effectDuration.value)) {
      details.push(t('classResourceDurationHoursTemplate', { hours: metadata.effectDuration.value }));
    }
    if (metadata.consumesItem) details.push(t('classResourceConsumesItemTemplate', { item: metadata.consumesItem }));
    if (metadata.initiativeRecovery > 0) details.push(t('classInitiativeRecoveryTemplate', { amount: metadata.initiativeRecovery }));
    if (metadata.recoveryTrigger) {
      const triggerKeys = {
        'wild-magic-surge': 'classTriggerWildMagicSurge',
        'conjuration-spell-slot': 'classTriggerConjurationSpellSlot'
      };
      const triggerKey = triggerKeys[metadata.recoveryTrigger];
      details.push(t('classResourceEventRecoveryTemplate', { event: triggerKey ? t(triggerKey) : metadata.recoveryTrigger }));
    }
    (Array.isArray(metadata.recoveryEvents) ? metadata.recoveryEvents : []).forEach(function (event) {
      details.push(t('classResourceEventRecoveryTemplate', { event: t(event.key) }));
    });
    (Array.isArray(metadata.notes) ? metadata.notes : []).forEach(function (note) {
      details.push(t(note));
    });
    if (metadata.recoveryTarget) {
      const target = currentResources().find(function (candidate) {
        return candidate.generatedClass && candidate.generatedClass.resourceKey === metadata.recoveryTarget;
      });
      details.push(t('classResourceRestoresPoolTemplate', { pool: target ? displayResourceName(target) : metadata.recoveryTarget }));
    }
    return details.join('；');
  }

  function formatDieLabel(value) {
    return t('common.dieNameTemplate', { size: String(value).replace(/^d/i, '') });
  }

  function currentResources() {
    return state.character ? state.db[state.character] || [] : [];
  }

  function resourceSlotLevel(resource) {
    if (resource && resource.generatedClass && Number.isInteger(resource.generatedClass.slotLevel)) {
      return Number(resource.generatedClass.slotLevel);
    }
    const match = resource && typeof resource.name === 'string' ? resource.name.match(/(\d+)\s*環/) : null;
    return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
  }

  function resourceSortGroup(resource) {
    if (isHitDieResource(resource)) return 0;
    if (isDicePoolResource(resource)) return 1;
    if (isMysticArcanumResource(resource)) return 4;
    if (isSpellSlotResource(resource)) {
      if (resource && resource.generatedClass && resource.generatedClass.kind === 'pact-slot') return 4;
      const slotLevel = resourceSlotLevel(resource);
      return slotLevel <= 5 ? 2 : 3;
    }
    return 5;
  }

  function hitDieFaceValue(resource) {
    const match = hitDieOf(resource).match(/^d(\d+)$/i);
    return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
  }

  function dicePoolDieOf(resource) {
    const metadata = resource && resource.generatedClass;
    const die = metadata && typeof metadata.resourceDie === 'string' ? metadata.resourceDie.toLowerCase() : '';
    return /^d\d+$/.test(die) ? die : '';
  }

  function dicePoolFaceValue(resource) {
    const match = dicePoolDieOf(resource).match(/^d(\d+)$/i);
    return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
  }

  const dicePoolFallbackKeys = new WeakMap();
  let dicePoolFallbackKey = 0;

  function dicePoolGroupKey(resource) {
    const metadata = resource && resource.generatedClass;
    if (metadata && typeof metadata.dicePoolGroup === 'string' && metadata.dicePoolGroup) return 'shared:' + metadata.dicePoolGroup;
    if (metadata && typeof metadata.resourceKey === 'string' && metadata.resourceKey) return 'resource:' + metadata.resourceKey;
    if (!resource || typeof resource !== 'object') return 'resource:unknown';
    if (!dicePoolFallbackKeys.has(resource)) {
      dicePoolFallbackKey += 1;
      dicePoolFallbackKeys.set(resource, 'instance:' + dicePoolFallbackKey);
    }
    return dicePoolFallbackKeys.get(resource);
  }

  function dicePoolGroupType(resource) {
    return 'dice-pool:' + dicePoolGroupKey(resource);
  }

  function dicePoolGroupLabel(resource) {
    const metadata = resource && resource.generatedClass;
    if (metadata && typeof metadata.dicePoolLabel === 'string' && metadata.dicePoolLabel) return metadata.dicePoolLabel;
    const label = displayResourceName(resource);
    return metadata && metadata.dicePoolGroup ? label.replace(/^.+? - /, '') : label;
  }

  function sortResourcesForDisplay(resources) {
    return resources.map(function (resource, index) { return { resource: resource, index: index }; }).sort(function (left, right) {
      const groupDelta = resourceSortGroup(left.resource) - resourceSortGroup(right.resource);
      if (groupDelta !== 0) return groupDelta;
      if (isHitDieResource(left.resource) && isHitDieResource(right.resource)) {
        const faceDelta = hitDieFaceValue(left.resource) - hitDieFaceValue(right.resource);
        if (faceDelta !== 0) return faceDelta;
      } else if (isDicePoolResource(left.resource) && isDicePoolResource(right.resource)) {
        const labelDelta = dicePoolGroupLabel(left.resource).localeCompare(dicePoolGroupLabel(right.resource), 'zh-Hant');
        if (labelDelta !== 0) return labelDelta;
        const groupDelta = dicePoolGroupKey(left.resource).localeCompare(dicePoolGroupKey(right.resource), 'zh-Hant');
        if (groupDelta !== 0) return groupDelta;
        const faceDelta = dicePoolFaceValue(left.resource) - dicePoolFaceValue(right.resource);
        if (faceDelta !== 0) return faceDelta;
      } else {
        const slotDelta = resourceSlotLevel(left.resource) - resourceSlotLevel(right.resource);
        if (slotDelta !== 0) return slotDelta;
      }
      return (left.resource.name || '').localeCompare(right.resource.name || '', 'zh-Hant');
    });
  }

  function resourceSummaryText(resource) {
    return t('resourceSummaryTemplate', {
      source: sourceLabel(resource && resource.source ? resource.source : '其他'),
      cooldown: cooldownLabel(resource && resource.cooldown ? resource.cooldown : '手動'),
      max: Number(resource && resource.max) || 0
    });
  }

  function displayResourceName(resource) {
    const name = String(resource && typeof resource === 'object' ? resource.name : resource);
    const generated = resource && typeof resource === 'object' ? resource.generatedClass : null;
    const kind = generated && generated.kind;
    const hitDie = hitDieOf(resource);
    if ((kind === 'hit-dice' || (!generated && isHitDieResource(resource))) && hitDie) {
      return t('classHitDiceName', { die: formatDieLabel(hitDie) });
    }
    const slotLevel = resourceSlotLevel(resource);
    if ((kind === 'mystic-arcanum' || (!generated && /^神秘奧秘（\d+\s*環）$/.test(name))) && slotLevel >= 1 && slotLevel <= 9) {
      return t('classArcanumName', { level: slotLevel });
    }
    if ((kind === 'pact-slot' || (!generated && /^契約魔法（\d+\s*環）$/.test(name))) && slotLevel >= 1 && slotLevel <= 9) {
      return t('classPactSlotName', { level: slotLevel });
    }
    if ((kind === 'spell-slot' || (!generated && /^\d+\s*環$/.test(name))) && slotLevel >= 1 && slotLevel <= 9) {
      return t('slotLevelLabel', { level: slotLevel });
    }
    return name.replace(/\bd(6|8|10|12)\b/gi, function (_, die) { return formatDieLabel(die); });
  }

  function resourceState(resource) {
    const current = Number(resource.current);
    const max = Number(resource.max);
    const ratio = max > 0 ? current / max : 0;
    return {
      overMax: current > max,
      depleted: current === 0,
      countBand: current === 0 ? 'zero' : ratio <= 0.25 ? 'red' : ratio <= 0.5 ? 'orange' : ratio <= 0.75 ? 'yellow' : 'green'
    };
  }

  function createResourceRow(resource, index) {
    const row = document.createElement('div');
    row.className = 'resource-row p-2 border rounded';
    row.dataset.resourceIndex = String(index);
    const summary = document.createElement('div');
    summary.className = 'd-flex justify-content-between align-items-start gap-2';
    const name = document.createElement('div');
    name.className = 'fw-semibold';
    name.textContent = displayResourceName(resource);
    const meta = document.createElement('div');
    meta.className = 'small text-secondary text-end resource-count';
    meta.textContent = resourceCountText(resource);
    summary.append(name, meta);
    const cooldown = createResourceRestBadge(resource);
    const details = document.createElement('div');
    details.className = 'small text-secondary resource-rules';
    details.textContent = classResourceDetails(resource);
    details.classList.toggle('d-none', !details.textContent);
    const actions = createResourceActions(resource, index, true);
    row.append(summary, cooldown, details, actions);
    applyResourceStatus(row, resource);
    return row;
  }

  function createCompactResourceIcon(pathData) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'currentColor');
    path.setAttribute('d', pathData);
    svg.appendChild(path);
    return svg;
  }

  function createCompactResourceControl(resource, index, controlType, labelText, resetLabel, useLabel, countLabel) {
    const control = document.createElement('div');
    control.className = 'resource-compact-control ' + controlType;
    control.dataset.resourceIndex = String(index);

    const label = document.createElement('div');
    label.className = 'resource-compact-label';
    const resourceLabel = document.createElement('span');
    resourceLabel.textContent = labelText;
    const warning = document.createElement('span');
    warning.className = 'resource-warning d-none';
    warning.textContent = t('common.warningSymbol');
    warning.setAttribute('role', 'img');
    warning.setAttribute('aria-label', '');
    label.append(resourceLabel, warning);

    const resetButton = document.createElement('button');
    resetButton.className = 'btn btn-warning resource-compact-action';
    resetButton.type = 'button';
    resetButton.dataset.action = 'reset-resource';
    resetButton.dataset.index = String(index);
    resetButton.setAttribute('aria-label', resetLabel);
    resetButton.title = resetLabel;
    resetButton.disabled = !state.character;
    resetButton.appendChild(createCompactResourceIcon('M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.418A6 6 0 1 0 8 2z M8 4.5V1.5a.5.5 0 0 0-.854-.354L4.146 4.146A.5.5 0 0 0 4.5 5h3a.5.5 0 0 0 .5-.5'));

    const count = document.createElement('div');
    count.className = 'resource-compact-count';
    count.textContent = String(resource.current);
    count.setAttribute('aria-label', countLabel);
    count.setAttribute('role', 'status');
    count.setAttribute('aria-live', 'polite');
    count.setAttribute('aria-atomic', 'true');

    const useButton = document.createElement('button');
    useButton.className = 'btn btn-light resource-compact-action';
    useButton.type = 'button';
    useButton.dataset.action = 'use-resource';
    useButton.dataset.index = String(index);
    useButton.setAttribute('aria-label', useLabel);
    useButton.title = useLabel;
    useButton.disabled = !state.character || Number(resource.current) <= 0;
    useButton.appendChild(createCompactResourceIcon('M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8'));

    control.append(label, resetButton, count, useButton);
    control.appendChild(createResourceRestBadge(resource));
    applyResourceStatus(control, resource);
    return control;
  }

  function createSpellSlotControl(resource, index) {
    const level = resourceSlotLevel(resource);
    if (level < 1 || level > 9) {
      const row = createResourceRow(resource, index);
      row.style.gridColumn = '1 / -1';
      return row;
    }
    return createCompactResourceControl(
      resource,
      index,
      'spell-slot-control',
      t('slotLevelLabel', { level: level }),
      t('spellSlotResetAriaTemplate', { level: level }),
      t('spellSlotUseAriaTemplate', { level: level }),
      t('spellSlotRemainingAriaTemplate', { level: level, current: resource.current, max: resource.max })
    );
  }

  function createHitDieControl(resource, index) {
    const hitDie = hitDieOf(resource);
    const dieLabel = hitDie ? formatDieLabel(hitDie) : displayResourceName(resource);
    return createCompactResourceControl(
      resource,
      index,
      'hit-die-control',
      dieLabel,
      t('hitDieResetAriaTemplate', { die: dieLabel }),
      t('hitDieUseAriaTemplate', { die: dieLabel }),
      t('hitDieRemainingAriaTemplate', { die: dieLabel, current: resource.current, max: resource.max })
    );
  }

  function createPactMagicControl(resource, index) {
    const level = resourceSlotLevel(resource);
    const isMysticArcanum = resource.generatedClass && resource.generatedClass.kind === 'mystic-arcanum';
    const controlType = isMysticArcanum ? 'mystic-arcanum-control' : 'pact-slot-control';
    const templatePrefix = isMysticArcanum ? 'mysticArcanum' : 'pactSlot';
    return createCompactResourceControl(
      resource,
      index,
      controlType,
      t(templatePrefix + 'CompactLabelTemplate', { level: level }),
      t(templatePrefix + 'ResetAriaTemplate', { level: level }),
      t(templatePrefix + 'UseAriaTemplate', { level: level }),
      t(templatePrefix + 'RemainingAriaTemplate', { level: level, current: resource.current, max: resource.max })
    );
  }

  function createDicePoolControl(resource, index) {
    const name = displayResourceName(resource);
    const die = formatDieLabel(dicePoolDieOf(resource));
    const control = createCompactResourceControl(
      resource,
      index,
      'dice-pool-control',
      t('dicePoolCompactLabelTemplate', { name: name, die: die }),
      t('dicePoolResetAriaTemplate', { name: name, die: die }),
      t('dicePoolUseAriaTemplate', { name: name, die: die }),
      t('dicePoolRemainingAriaTemplate', { name: name, die: die, current: resource.current, max: resource.max })
    );
    const detailsText = classResourceDetails(resource);
    if (detailsText) {
      const details = document.createElement('details');
      details.className = 'resource-compact-details';
      const summary = document.createElement('summary');
      summary.textContent = t('dicePoolDetailsLabel');
      const content = document.createElement('span');
      content.textContent = detailsText;
      details.append(summary, content);
      control.appendChild(details);
    }
    return control;
  }

  function classResourceCompactName(resource) {
    return displayResourceName(resource).replace(/^[^-]+ - /, '');
  }

  function createClassResourceControl(resource, index) {
    const name = classResourceCompactName(resource);
    const control = createCompactResourceControl(
      resource,
      index,
      'class-resource-control',
      name,
      t('classResourceControlResetTemplate', { name: name }),
      t('classResourceControlUseTemplate', { name: name }),
      t('classResourceControlRemainingTemplate', { name: name, current: resource.current, max: resource.max })
    );
    const info = document.createElement('div');
    info.className = 'class-resource-info';
    info.append(
      control.querySelector('.resource-compact-label'),
      control.querySelector('.resource-rest-badge')
    );
    control.insertBefore(info, control.firstChild);
    const detailsText = classResourceDetails(resource);
    if (detailsText) {
      const details = document.createElement('details');
      details.className = 'resource-compact-details';
      const summary = document.createElement('summary');
      summary.textContent = t('dicePoolDetailsLabel');
      const content = document.createElement('span');
      content.textContent = detailsText;
      details.append(summary, content);
      control.appendChild(details);
    }
    return control;
  }

  function createGroupedResourceCard(label, items, groupType) {
    const column = document.createElement('div');
    column.className = groupType.indexOf('class-resources:') === 0
      ? 'col-12 col-md-6 col-xl-6'
      : 'col-12 col-md-6 col-xl-4';
    column.dataset.resourceGroup = groupType;
    const card = document.createElement('article');
    card.className = 'card h-100';
    const header = document.createElement('div');
    header.className = 'card-header d-flex justify-content-between align-items-start gap-2';
    const name = document.createElement('strong');
    name.textContent = label;
    const source = document.createElement('span');
    source.className = 'tag-source';
    const dicePoolSources = Array.from(new Set(items.map(function (item) { return item.resource.source; }).filter(Boolean)));
    const isDicePoolGroup = groupType.indexOf('dice-pool:') === 0;
    const isClassResourceGroup = groupType.indexOf('class-resources:') === 0;
    source.textContent = (isDicePoolGroup || isClassResourceGroup) && dicePoolSources.length
      ? dicePoolSources.map(function (value) { return sourceLabel(value); }).join(' / ')
      : sourceLabel('角色職業');
    const title = document.createElement('div');
    title.appendChild(name);
    header.append(title, source);
    const body = document.createElement('div');
    body.className = 'card-body';
    const isSpellSlotGroup = groupType === 'spell-1-5' || groupType === 'spell-6-9';
    const isHitDiceGroup = groupType === 'hit-dice';
    const isPactGroup = groupType === 'pact';
    const isCompactGroup = isSpellSlotGroup || isHitDiceGroup || isDicePoolGroup || isClassResourceGroup || isPactGroup;
    if (isCompactGroup) {
      body.classList.add('resource-compact-grid');
      if (items.length === 1) body.classList.add('single-compact-resource');
      if (groupType === 'spell-1-5') body.classList.add('spell-slot-grid-low');
      else if (groupType === 'spell-6-9' || isHitDiceGroup) body.classList.add('four-resource-grid');
      else if (isDicePoolGroup) {
        const labelLength = Array.from(label).length;
        body.classList.add(labelLength <= 18 ? 'dice-pool-grid-short' : 'dice-pool-grid-long');
      } else if (isClassResourceGroup) body.classList.add('class-resource-grid');
      else if (isPactGroup) body.classList.add('pact-magic-grid');
    }
    items.forEach(function (item) {
      const row = isSpellSlotGroup
        ? createSpellSlotControl(item.resource, item.index)
        : isHitDiceGroup
          ? createHitDieControl(item.resource, item.index)
          : isDicePoolGroup
            ? createDicePoolControl(item.resource, item.index)
            : isClassResourceGroup
              ? createClassResourceControl(item.resource, item.index)
            : isPactGroup
            ? createPactMagicControl(item.resource, item.index)
            : createResourceRow(item.resource, item.index);
      if (!isCompactGroup) row.classList.add('mb-2');
      body.appendChild(row);
    });
    card.append(header, body);
    const states = items.map(function (item) { return resourceState(item.resource); });
    const allDepleted = states.length > 0 && states.every(function (value) { return value.depleted; });
    card.classList.toggle('resource-over-max', states.length > 0 && states.every(function (value) { return value.overMax; }) && !allDepleted);
    column.appendChild(card);
    return column;
  }

  function createWarlockResourceCard(group) {
    const column = document.createElement('div');
    column.className = 'col-12 col-md-6 col-xl-6';
    column.dataset.resourceGroup = group.type;
    const card = document.createElement('article');
    card.className = 'card h-100';
    const header = document.createElement('div');
    header.className = 'card-header d-flex justify-content-between align-items-start gap-2';
    const name = document.createElement('strong');
    name.textContent = group.label;
    const sources = Array.from(new Set(group.items.map(function (item) { return item.resource.source; }).filter(Boolean)));
    const source = document.createElement('span');
    source.className = 'tag-source';
    source.textContent = sources.map(function (value) { return sourceLabel(value); }).join(' / ');
    header.append(name, source);

    const body = document.createElement('div');
    body.className = 'card-body warlock-resource-body';
    if (group.pactItems.length) {
      const hasArcanumBeyondSixth = group.pactItems.some(function (item) {
        return isMysticArcanumResource(item.resource) && resourceSlotLevel(item.resource) > 6;
      });
      const cluster = document.createElement('section');
      cluster.className = 'warlock-resource-cluster';
      const clusterTitle = document.createElement('h3');
      clusterTitle.className = 'warlock-resource-cluster-title';
      clusterTitle.textContent = t('groupPactMagic');
      const grid = document.createElement('div');
      grid.className = 'resource-compact-grid ' + (hasArcanumBeyondSixth ? 'warlock-pact-rotor-grid' : 'warlock-pact-flat-grid');
      if (group.pactItems.length === 1) grid.classList.add('single-compact-resource');
      group.pactItems.forEach(function (item) {
        const control = createPactMagicControl(item.resource, item.index);
        if (!hasArcanumBeyondSixth) control.classList.add('pact-magic-flat-control');
        grid.appendChild(control);
      });
      cluster.append(clusterTitle, grid);
      body.appendChild(cluster);
    }
    if (group.classItems.length) {
      const cluster = document.createElement('section');
      cluster.className = 'warlock-resource-cluster';
      const clusterTitle = document.createElement('h3');
      clusterTitle.className = 'warlock-resource-cluster-title';
      clusterTitle.textContent = t('classResourceGroupLabel');
      const grid = document.createElement('div');
      grid.className = 'resource-compact-grid class-resource-grid';
      if (group.classItems.length === 1) grid.classList.add('single-compact-resource');
      group.classItems.forEach(function (item) {
        grid.appendChild(createClassResourceControl(item.resource, item.index));
      });
      cluster.append(clusterTitle, grid);
      body.appendChild(cluster);
    }
    card.append(header, body);
    const states = group.items.map(function (item) { return resourceState(item.resource); });
    const allDepleted = states.length > 0 && states.every(function (value) { return value.depleted; });
    card.classList.toggle('resource-over-max', states.length > 0 && states.every(function (value) { return value.overMax; }) && !allDepleted);
    column.appendChild(card);
    return column;
  }

  function createResourceCard(resource, index) {
    const column = document.createElement('div');
    column.className = 'col-12 col-md-6 col-xl-4';
    column.dataset.resourceIndex = String(index);
    column.dataset.resourceGroup = resourceGroupType(resource);
    const card = document.createElement('article');
    card.className = 'card h-100';
    const header = document.createElement('div');
    header.className = 'card-header d-flex justify-content-between align-items-start gap-2';
    const name = document.createElement('strong');
    name.className = 'resource-name';
    name.textContent = displayResourceName(resource);
    const warning = document.createElement('span');
    warning.className = 'resource-warning d-none';
    warning.textContent = t('common.warningSymbol');
    warning.setAttribute('role', 'img');
    warning.setAttribute('aria-label', '');
    const source = document.createElement('span');
    source.className = 'tag-source';
    source.textContent = sourceLabel(resource.source);
    header.append(name, warning, source);

    const body = document.createElement('div');
    body.className = 'card-body';
    const count = document.createElement('p');
    count.className = 'resource-count';
    count.textContent = resourceCountText(resource);
    const details = document.createElement('p');
    details.className = 'small text-secondary resource-rules mb-3';
    details.textContent = classResourceDetails(resource);
    details.classList.toggle('d-none', !details.textContent);
    const actions = createResourceActions(resource, index, false);
    body.append(count, details, actions);
    const footer = document.createElement('footer');
    footer.className = 'card-footer d-flex justify-content-end';
    footer.appendChild(createResourceRestBadge(resource));
    card.append(header, body);
    card.appendChild(footer);
    applyResourceStatus(card, resource);
    column.appendChild(card);
    return column;
  }

  function groupResourcesForDisplay(entries) {
    const groups = [
      { label: t('hitDiceLabel'), type: 'hit-dice', items: [] },
      { label: t('groupSpellSlotsLow'), type: 'spell-1-5', items: [] },
      { label: t('groupSpellSlotsHigh'), type: 'spell-6-9', items: [] },
      { label: t('groupPactMagic'), type: 'pact', items: [] },
      { label: t('groupOther'), type: 'other', items: [] }
    ];
    const dicePoolGroups = new Map();
    const classResourceGroups = new Map();
    entries.forEach(function (entry) {
      const resource = entry.resource;
      if (isHitDieResource(resource)) {
        groups[0].items.push({ resource: resource, index: entry.index });
      } else if (isDicePoolResource(resource)) {
        const type = dicePoolGroupType(resource);
        if (!dicePoolGroups.has(type)) {
          dicePoolGroups.set(type, { label: dicePoolGroupLabel(resource), type: type, items: [] });
        }
        dicePoolGroups.get(type).items.push({ resource: resource, index: entry.index });
      } else if (isClassFeatureResource(resource)) {
        const type = classResourceGroupType(resource);
        if (!classResourceGroups.has(type)) {
          classResourceGroups.set(type, { label: t(classPresets[resource.generatedClass.ownerClass].label), type: type, items: [] });
        }
        classResourceGroups.get(type).items.push({ resource: resource, index: entry.index });
      } else if (isMysticArcanumResource(resource)) {
        groups[3].items.push({ resource: resource, index: entry.index });
      } else if (isSpellSlotResource(resource)) {
        if (resource && resource.generatedClass && resource.generatedClass.kind === 'pact-slot') groups[3].items.push({ resource: resource, index: entry.index });
        else {
          const slotLevel = resourceSlotLevel(resource);
          const target = slotLevel <= 5 ? groups[1] : groups[2];
          target.items.push({ resource: resource, index: entry.index });
        }
      } else {
        /* TODO: future subclass/archetype resources may need a finer aggregate key than plain source=角色職業; keep this bucket intentionally broad for forward compatibility. */
        groups[4].items.push({ resource: resource, index: entry.index });
      }
    });
    const warlockFeatureGroup = classResourceGroups.get('class-resources:warlock');
    const warlockItems = groups[3].items.concat(warlockFeatureGroup ? warlockFeatureGroup.items : []);
    const warlockGroup = warlockItems.length
      ? {
        label: t(classPresets.warlock.label),
        type: 'warlock',
        items: warlockItems,
        pactItems: groups[3].items,
        classItems: warlockFeatureGroup ? warlockFeatureGroup.items : []
      }
      : null;
    const otherClassGroups = Array.from(classResourceGroups.values()).filter(function (group) {
      return group.type !== 'class-resources:warlock';
    });
    return [groups[0]].concat(
      Array.from(dicePoolGroups.values()),
      groups.slice(1, 3),
      warlockGroup ? [warlockGroup] : [],
      otherClassGroups,
      [groups[4]]
    ).filter(function (group) { return group.items.length > 0; });
  }

  function isClassFeatureResource(resource) {
    const metadata = resource && resource.generatedClass;
    return Boolean(metadata && metadata.kind === 'class-resource' && metadata.ownerClass && classPresets[metadata.ownerClass]);
  }

  function classResourceGroupType(resource) {
    return 'class-resources:' + resource.generatedClass.ownerClass;
  }

  function resourceGroupType(resource) {
    if (isHitDieResource(resource)) return 'hit-dice';
    if (isDicePoolResource(resource)) return dicePoolGroupType(resource);
    if (isMysticArcanumResource(resource)) return 'warlock';
    if (resource && resource.generatedClass && resource.generatedClass.kind === 'pact-slot') return 'warlock';
    if (isClassFeatureResource(resource) && resource.generatedClass.ownerClass === 'warlock') return 'warlock';
    if (isClassFeatureResource(resource)) return classResourceGroupType(resource);
    if (isSpellSlotResource(resource)) {
      return resourceSlotLevel(resource) <= 5 ? 'spell-1-5' : 'spell-6-9';
    }
    return 'other';
  }

  function createResourceGroupElement(group) {
    if (group.type === 'warlock') return createWarlockResourceCard(group);
    if (group.items.length === 1 && group.type !== 'spell-1-5' && group.type !== 'spell-6-9' && group.type !== 'hit-dice' && group.type.indexOf('dice-pool:') !== 0 && group.type.indexOf('class-resources:') !== 0 && group.type !== 'pact') {
      const item = group.items[0];
      return createResourceCard(item.resource, item.index);
    }
    return createGroupedResourceCard(group.label, group.items, group.type);
  }

  function setText(element, value) {
    element.textContent = value == null ? '' : String(value);
  }

  function applyStaticTranslations() {
    document.documentElement.lang = locale;
    document.querySelectorAll('[data-i18n]').forEach(function (element) {
      setText(element, t(element.dataset.i18n));
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (element) {
      element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
    });
    setText(document.getElementById('classBuilderHelp'), t('classBuilderHelpTemplate', { artificer: t('classArtificer') }));
    document.getElementById('localeSelect').value = locale;
  }

  function updateCharacters() {
    const select = document.getElementById('characterSelect');
    select.replaceChildren();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = Object.keys(state.db).length ? t('characterSelectLabel') : t('characterSelectEmpty');
    select.appendChild(placeholder);
    Object.keys(state.db).forEach(function (name) {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });
    select.value = state.character;
    setText(document.getElementById('currentLabel'), t('characterCurrentTemplate', {
      name: state.character || t('characterUnselectedPlaceholder')
    }));
    setText(document.getElementById('managementCharacterLabel'), state.character ? t('characterCurrentTemplate', { name: state.character }) : t('managementNoCharacter'));
    document.querySelectorAll('[data-action="copy-character"], [data-action="delete-character"]').forEach(function (button) {
      button.disabled = !state.character;
    });
    document.querySelectorAll('[data-action="reset-cooldown"], [data-action="new-resource"], [data-action="accumulate-hit-die"], [data-action="commit-hit-dice"], [data-action="add-class-row"], [data-action="apply-class-levels"]').forEach(function (button) {
      button.disabled = !state.character;
    });
    renderHitDiceAccumulator();
  }

  function applyResourceStatus(card, resource) {
    const stateInfo = resourceState(resource);
    const overMax = stateInfo.overMax;
    const depleted = stateInfo.depleted;
    ['green', 'yellow', 'orange', 'red', 'zero'].forEach(function (band) {
      card.classList.toggle('resource-status-' + band, stateInfo.countBand === band);
    });
    card.classList.toggle('resource-over-max', overMax);
    const warning = card.querySelector ? card.querySelector('.resource-warning') : null;
    if (warning) {
      warning.classList.toggle('d-none', !overMax);
      warning.title = overMax ? t('warningOverMaxTitle') : '';
      warning.setAttribute('aria-label', overMax ? t('warningOverMaxAria') : '');
    }
  }

  function renderResources() {
    const list = document.getElementById('skillList');
    const entries = sortResourcesForDisplay(currentResources());
    list.replaceChildren();
    const grouped = groupResourcesForDisplay(entries);
    grouped.forEach(function (group) {
      list.appendChild(createResourceGroupElement(group));
    });
    updateEmptyState();
  }

  function updateEmptyState() {
    const resources = currentResources();
    document.getElementById('emptyState').classList.toggle('d-none', resources.length > 0);
    if (!state.character) setText(document.getElementById('emptyState'), t('emptySelectCharacter'));
    else if (!resources.length) setText(document.getElementById('emptyState'), t('emptyCharacterResources'));
  }

  function refreshResourceGroups(groupTypes) {
    const list = document.getElementById('skillList');
    const grouped = groupResourcesForDisplay(sortResourcesForDisplay(currentResources()));
    function groupOrder(type) {
      const index = grouped.findIndex(function (group) { return group.type === type; });
      return index < 0 ? Number.MAX_SAFE_INTEGER : index;
    }
    Array.from(new Set(groupTypes)).sort(function (left, right) {
      return groupOrder(left) - groupOrder(right) || left.localeCompare(right);
    }).forEach(function (type) {
      const existing = Array.from(list.children).find(function (element) {
        return element.dataset.resourceGroup === type;
      });
      const group = grouped.find(function (item) { return item.type === type; });
      if (!group) {
        if (existing) existing.remove();
        return;
      }
      const replacement = createResourceGroupElement(group);
      if (existing) {
        list.replaceChild(replacement, existing);
        return;
      }
      const nextGroup = Array.from(list.children).find(function (element) {
        return groupOrder(element.dataset.resourceGroup) > groupOrder(type);
      });
      list.insertBefore(replacement, nextGroup || null);
    });
    updateEmptyState();
  }

  function refreshResourceAt(index) {
    const resource = currentResources()[index];
    if (!resource) return;
    const list = document.getElementById('skillList');
    const matches = list.querySelectorAll('[data-resource-index="' + index + '"]');
    if (!matches.length) return;
    matches.forEach(function (match) {
      const row = match.classList.contains('resource-row') ? match : match.querySelector('.card') || match;
      const compactCount = row.querySelector('.resource-compact-count');
      if (compactCount) {
        const values = { current: resource.current, max: resource.max };
        let templateKey;
        if (row.classList.contains('spell-slot-control')) {
          templateKey = 'spellSlotRemainingAriaTemplate';
          values.level = resourceSlotLevel(resource);
        } else if (row.classList.contains('pact-slot-control')) {
          templateKey = 'pactSlotRemainingAriaTemplate';
          values.level = resourceSlotLevel(resource);
        } else if (row.classList.contains('mystic-arcanum-control')) {
          templateKey = 'mysticArcanumRemainingAriaTemplate';
          values.level = resourceSlotLevel(resource);
        } else if (row.classList.contains('dice-pool-control')) {
          templateKey = 'dicePoolRemainingAriaTemplate';
          values.name = displayResourceName(resource);
          values.die = formatDieLabel(dicePoolDieOf(resource));
        } else if (row.classList.contains('class-resource-control')) {
          templateKey = 'classResourceControlRemainingTemplate';
          values.name = classResourceCompactName(resource);
        } else {
          templateKey = 'hitDieRemainingAriaTemplate';
          const hitDie = hitDieOf(resource);
          values.die = hitDie ? formatDieLabel(hitDie) : displayResourceName(resource);
        }
        compactCount.textContent = String(resource.current);
        compactCount.setAttribute('aria-label', t(templateKey, values));
      } else {
        const count = row.querySelector('.resource-count');
        if (count) count.textContent = resourceCountText(resource);
      }
      const useButton = row.querySelector('[data-action="use-resource"]');
      if (useButton) useButton.disabled = Number(resource.current) <= 0;
      syncAccumulativeControls(row, resource);
      applyResourceStatus(row, resource);
      const card = row.classList.contains('card') ? row : row.closest('.card');
      const groupRows = card ? Array.from(card.querySelectorAll('.resource-row, .resource-compact-control')) : [];
      if (groupRows.length > 1) {
        const states = groupRows.map(function (item) {
          const itemIndex = Number(item.dataset.resourceIndex);
          return resourceState(currentResources()[itemIndex]);
        });
        const allDepleted = states.length > 0 && states.every(function (value) { return value.depleted; });
        const allOverMax = states.length > 0 && states.every(function (value) { return value.overMax; });
        card.classList.toggle('resource-over-max', allOverMax && !allDepleted);
      }
    });
  }

  function renderManagementResources() {
    const list = document.getElementById('managementResourceList');
    const resources = currentResources();
    const entries = sortResourcesForDisplay(resources);
    list.replaceChildren();
    entries.forEach(function (entry) {
      list.appendChild(createManagementResourceItem(entry.resource, entry.index));
    });
    syncManagementResourceControls();
  }

  function createManagementResourceItem(resource, index) {
    const label = document.createElement('label');
    label.className = 'list-group-item d-flex align-items-center gap-3';
    label.dataset.resourceIndex = String(index);
    const radio = document.createElement('input');
    radio.className = 'form-check-input flex-shrink-0';
    radio.type = 'radio';
    radio.name = 'managedResource';
    radio.value = index;
    radio.dataset.resourceSelect = 'true';
    radio.checked = state.selectedResource === index;
    const description = document.createElement('span');
    description.className = 'flex-grow-1';
    const title = document.createElement('strong');
    title.textContent = displayResourceName(resource);
    const detail = document.createElement('span');
    detail.className = 'd-block small text-secondary';
    const source = sourceInfo[resource.source] || sourceInfo['其他'];
    detail.textContent = t('resourceDetailTemplate', {
      current: resource.current,
      max: resource.max,
      cooldown: cooldownLabel(resource.cooldown),
      source: sourceLabel(resource.source),
      english: t(source.english),
      description: t(source.description)
    });
    description.append(title, detail);
    label.append(radio, description);
    return label;
  }

  function findManagementResourceItem(index) {
    return Array.from(document.getElementById('managementResourceList').children).find(function (item) {
      return Number(item.dataset.resourceIndex) === index;
    }) || null;
  }

  function positionManagementResourceItem(item, index) {
    const list = document.getElementById('managementResourceList');
    const entries = sortResourcesForDisplay(currentResources());
    const position = entries.findIndex(function (entry) { return entry.index === index; });
    const nextItem = entries.slice(position + 1).map(function (entry) {
      return findManagementResourceItem(entry.index);
    }).find(function (candidate) { return candidate && candidate !== item; });
    list.insertBefore(item, nextItem || null);
  }

  function updateManagementResourceAt(index) {
    const list = document.getElementById('managementResourceList');
    const existing = findManagementResourceItem(index);
    const resource = currentResources()[index];
    if (!resource) return;
    const item = createManagementResourceItem(resource, index);
    if (existing) list.replaceChild(item, existing);
    positionManagementResourceItem(item, index);
    syncManagementResourceControls();
  }

  function addManagementResourceAt(index) {
    const resource = currentResources()[index];
    if (!resource) return;
    const item = createManagementResourceItem(resource, index);
    positionManagementResourceItem(item, index);
    syncManagementResourceControls();
  }

  function removeManagementResourceAt(index) {
    const list = document.getElementById('managementResourceList');
    const item = findManagementResourceItem(index);
    if (item) item.remove();
    Array.from(list.children).forEach(function (resourceItem) {
      const itemIndex = Number(resourceItem.dataset.resourceIndex);
      if (itemIndex <= index) return;
      resourceItem.dataset.resourceIndex = String(itemIndex - 1);
      resourceItem.querySelector('[data-resource-select]').value = String(itemIndex - 1);
    });
    syncManagementResourceControls();
  }

  function syncManagementResourceControls() {
    const resources = currentResources();
    document.getElementById('resourceSelectionHint').classList.toggle('d-none', resources.length > 0);
    ['copy-resource', 'edit-resource', 'delete-resource'].forEach(function (action) {
      const button = document.querySelector('[data-action="' + action + '"]');
      if (button) button.disabled = state.selectedResource === null || !resources[state.selectedResource];
    });
  }

  function render() {
    updateCharacters();
    renderResources();
    renderManagementResources();
  }

  function setManagementView(view) {
    const sections = document.getElementById('managementSections');
    const editor = document.getElementById('resourceEditor');
    const confirmation = document.getElementById('managementConfirm');
    sections.classList.toggle('d-none', view !== 'sections');
    editor.classList.toggle('d-none', view !== 'editor');
    confirmation.classList.toggle('d-none', view !== 'confirm');
  }

  function setManagementSection(sectionName) {
    document.querySelectorAll('[data-section-panel]').forEach(function (panel) {
      panel.classList.toggle('d-none', panel.dataset.sectionPanel !== sectionName);
    });
    document.querySelectorAll('[data-section]').forEach(function (button) {
      const active = button.dataset.section === sectionName;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
  }

  function openManagement() {
    state.pendingAction = null;
    setManagementView('sections');
    setManagementSection('resources');
    renderManagementResources();
    renderClassRowsFromResources();
    state.modal.show();
  }

  function formatResourceTitle(mode, isConfirmation) {
    const titleParts = {
      edit: { actionKey: 'editResource', titleKey: 'resourceTitleEdit', placeholder: 'edit' },
      copy: { actionKey: 'copyResource', titleKey: 'resourceTitleCopy', placeholder: 'copy' },
      create: { actionKey: 'newResource', titleKey: 'resourceTitleNew', placeholder: 'create' },
      delete: { actionKey: 'deleteResource', placeholder: 'delete' }
    }[mode];
    if (!titleParts) throw new Error('Unsupported resource title mode: ' + mode);
    const resource = t('resourceNoun');
    if (isConfirmation) {
      return t('resourceTitleConfirmTemplate', {
        confirm: t('confirm'),
        action: t(titleParts.actionKey),
        resource: resource
      });
    }
    if (!titleParts.titleKey) throw new Error('Resource title is unavailable for mode: ' + mode);
    const values = { resource: resource };
    values[titleParts.placeholder] = t(titleParts.actionKey);
    return t(titleParts.titleKey, values);
  }

  function openEditor(mode, index, resource) {
    state.editorMode = mode;
    state.editorIndex = index;
    state.editorSourceName = resource ? resource.name : '';
    document.getElementById('resourceEditorTitle').textContent = formatResourceTitle(mode, false);
    document.getElementById('resourceName').value = resource ? resource.name : '';
    document.getElementById('resourceMax').value = resource ? resource.max : 1;
    document.getElementById('resourceCooldown').value = resource ? resource.cooldown : '每回合';
    document.getElementById('resourceSource').value = resource ? resource.source : '其他';
    updateSourceHelp();
    setManagementView('editor');
    document.getElementById('resourceName').focus();
  }

  function readResourceForm() {
    const name = document.getElementById('resourceName').value.trim();
    const max = Number.parseInt(document.getElementById('resourceMax').value, 10);
    const existing = state.editorMode === 'edit' || state.editorMode === 'copy' ? currentResources()[state.editorIndex] : null;
    const current = existing ? Number(existing.current) : max;
    if (!name || !Number.isInteger(current) || !Number.isInteger(max) || max < 1 || current < 0) {
      document.getElementById('resourceForm').reportValidity();
      return null;
    }
    return {
      name: name,
      current: current,
      max: max,
      cooldown: document.getElementById('resourceCooldown').value,
      source: document.getElementById('resourceSource').value
    };
  }

  function showConfirmation(title, details, action) {
    state.pendingAction = action;
    setText(document.getElementById('confirmTitle'), title);
    setText(document.getElementById('confirmDetails'), details);
    const confirmButton = document.querySelector('[data-action="confirm-management"]');
    confirmButton.classList.toggle('btn-danger', action.type === 'delete-resource' || action.type === 'delete-character');
    confirmButton.classList.toggle('btn-primary', action.type !== 'delete-resource' && action.type !== 'delete-character');
    setManagementView('confirm');
  }

  function updateSourceHelp() {
    const value = document.getElementById('resourceSource').value;
    const source = sourceInfo[value] || sourceInfo['其他'];
    setText(document.getElementById('resourceSourceHelp'), t('sourceHelpTemplate', {
      source: sourceLabel(value),
      english: t(source.english),
      description: t(source.description)
    }));
  }

  function shiftResourceIndexesAfterDelete(index) {
    const list = document.getElementById('skillList');
    list.querySelectorAll('[data-resource-index]').forEach(function (element) {
      const value = Number(element.dataset.resourceIndex);
      if (value > index) element.dataset.resourceIndex = String(value - 1);
    });
    list.querySelectorAll('[data-action="use-resource"], [data-action="reset-resource"], [data-action="adjust-accumulative-resource"]').forEach(function (button) {
      const value = Number(button.dataset.index);
      if (value > index) button.dataset.index = String(value - 1);
    });
  }

  function performPendingAction() {
    const action = state.pendingAction;
    if (!action) return;
    if (action.type === 'save-resource') {
      const resources = currentResources();
      let index;
      let affectedGroups;
      if (action.mode === 'edit') {
        const previous = resources[action.index];
        if (!previous) return;
        index = action.index;
        affectedGroups = [resourceGroupType(previous)];
        resources[index] = Object.assign({}, previous, action.resource);
        affectedGroups.push(resourceGroupType(resources[index]));
      } else {
        resources.push(action.resource);
        index = resources.length - 1;
        affectedGroups = [resourceGroupType(action.resource)];
      }
      state.selectedResource = index;
      save();
      refreshResourceGroups(affectedGroups);
      if (action.mode === 'edit') updateManagementResourceAt(index);
      else addManagementResourceAt(index);
      setManagementView('sections');
    } else if (action.type === 'delete-resource') {
      const resources = currentResources();
      const deleted = resources[action.index];
      if (!deleted) return;
      const previousSelection = state.selectedResource;
      resources.splice(action.index, 1);
      if (previousSelection === action.index) state.selectedResource = null;
      else if (previousSelection !== null && previousSelection > action.index) state.selectedResource = previousSelection - 1;
      save();
      shiftResourceIndexesAfterDelete(action.index);
      refreshResourceGroups([resourceGroupType(deleted)]);
      removeManagementResourceAt(action.index);
      setManagementView('sections');
    } else if (action.type === 'delete-character') {
      delete state.db[action.name];
      delete state.classFeatureSettings[classSettingsEntryKey(action.name)];
      state.character = '';
      state.selectedResource = null;
      save();
      localStorage.setItem(classSettingsStorageKey, JSON.stringify(state.classFeatureSettings));
      render();
      renderClassRowsFromResources();
      state.modal.hide();
    } else if (action.type === 'copy-character') {
      state.db[action.target] = JSON.parse(JSON.stringify(state.db[action.source]));
      state.classFeatureSettings[classSettingsEntryKey(action.target)] = classFeatureSelectionsForCharacter();
      save();
      localStorage.setItem(classSettingsStorageKey, JSON.stringify(state.classFeatureSettings));
      render();
      setManagementView('sections');
      setManagementSection('characters');
    } else if (action.type === 'apply-class-levels') {
      const resources = currentResources();
      const previousPools = new Map();
      resources.filter(isManagedClassResource).forEach(function (resource) {
        const key = classResourceKey(resource);
        if (key) previousPools.set(key, resource);
      });
      const manualResources = resources.filter(function (resource) { return !isManagedClassResource(resource); });
      action.resources.forEach(function (resource) {
        const previous = previousPools.get(classResourceKey(resource));
        if (previous && Number.isInteger(previous.current) && previous.current >= 0) resource.current = previous.current;
      });
      state.db[state.character] = manualResources.concat(action.resources);
      const classMetadata = classBuilderMetadataFromResources(action.resources);
      if (classMetadata && classMetadata.classFeatureSelections) {
        state.classFeatureSettings[classSettingsEntryKey(state.character)] = normalizedClassFeatureSelections(classMetadata.classFeatureSelections);
        localStorage.setItem(classSettingsStorageKey, JSON.stringify(state.classFeatureSettings));
      }
      state.selectedResource = null;
      save();
      render();
      renderClassRowsFromResources();
      setManagementView('sections');
      setManagementSection('resources');
      notify(t('classResourcesUpdated'));
    }
    state.pendingAction = null;
  }

  function isGeneratedClassResource(resource) {
    return resource && resource.generatedClass && resource.generatedClass.generator === 'class-levels';
  }

  function isManagedClassResource(resource) {
    return isGeneratedClassResource(resource) || Boolean(resource && resource.generatedClass && resource.generatedClass.generator === 'quick-hit-dice');
  }

  function classResourceKey(resource) {
    const metadata = resource && resource.generatedClass;
    if (!metadata) return '';
    if (typeof metadata.resourceKey === 'string' && metadata.resourceKey) return metadata.resourceKey;
    if (metadata.kind === 'hit-dice' && hitDice.includes(metadata.hitDie)) return 'class:hit-dice:' + metadata.hitDie;
    if (metadata.kind === 'spell-slot' && Number.isInteger(metadata.slotLevel)) return 'class:spell-slot:' + metadata.slotLevel;
    if (metadata.kind === 'pact-slot') return 'class:warlock:pact-slots';
    if (metadata.kind === 'mystic-arcanum' && Number.isInteger(metadata.slotLevel)) return 'class:warlock:mystic-arcanum:' + metadata.slotLevel;
    if (metadata.kind === 'class-resource' && metadata.ownerClass && metadata.featureKey) {
      return (metadata.subclass ? 'subclass:' + metadata.ownerClass + ':' + metadata.subclass : 'class:' + metadata.ownerClass) + ':' + metadata.featureKey;
    }
    return '';
  }

  function hitDieOf(resource) {
    if (resource && resource.generatedClass && hitDice.includes(resource.generatedClass.hitDie)) return resource.generatedClass.hitDie;
    const match = resource && typeof resource.name === 'string' ? resource.name.match(/\b(d6|d8|d10|d12)\b/i) : null;
    return match ? match[1].toLowerCase() : '';
  }

  function isHitDieResource(resource) {
    return Boolean(resource && ((resource.generatedClass && resource.generatedClass.kind === 'hit-dice') || (/^(生命骰|hit die|hit dice)/i.test(resource.name || '') && hitDieOf(resource))));
  }

  function isDicePoolResource(resource) {
    const metadata = resource && resource.generatedClass;
    return Boolean(metadata && metadata.poolMode === 'dice' && dicePoolDieOf(resource) && !isHitDieResource(resource));
  }

  function isSpellSlotResource(resource) {
    return Boolean(resource && resource.generatedClass && ['spell-slot', 'pact-slot'].includes(resource.generatedClass.kind)) || Boolean(resource && !resource.generatedClass && /^(法術位|契約魔法|spell slots?|pact magic)/i.test(resource.name || ''));
  }

  function isMysticArcanumResource(resource) {
    return Boolean(resource && resource.generatedClass && resource.generatedClass.kind === 'mystic-arcanum');
  }

  function renderHitDiceAccumulator() {
    hitDice.forEach(function (die) {
      const badge = document.querySelector('[data-die-count="' + die + '"]');
      if (badge) badge.textContent = String(state.hitDiceAccumulator[die]);
    });
    const hasDice = hitDice.some(function (die) { return state.hitDiceAccumulator[die] > 0; });
    document.querySelector('[data-action="commit-hit-dice"]').disabled = !state.character || !hasDice;
    document.querySelector('[data-action="clear-hit-dice"]').disabled = !hasDice;
  }

  function accumulateHitDie(die) {
    if (!hitDice.includes(die)) return;
    state.hitDiceAccumulator[die] += 1;
    renderHitDiceAccumulator();
  }

  function clearHitDiceAccumulator() {
    hitDice.forEach(function (die) { state.hitDiceAccumulator[die] = 0; });
    renderHitDiceAccumulator();
  }

  function commitHitDiceAccumulator() {
    if (!state.character) return;
    const resources = currentResources();
    hitDice.forEach(function (die) {
      const count = state.hitDiceAccumulator[die];
      if (!count) return;
      const matches = resources.filter(function (resource) { return isHitDieResource(resource) && hitDieOf(resource) === die; });
      if (matches.length) {
        const existing = matches.find(function (resource) { return isGeneratedClassResource(resource); }) || matches[0];
        existing.name = '生命骰（' + die + '）';
        existing.current = matches.reduce(function (total, resource) { return total + Number(resource.current); }, 0) + count;
        existing.max = matches.reduce(function (total, resource) { return total + Number(resource.max); }, 0) + count;
        existing.cooldown = '長休';
        if (!existing.generatedClass) existing.generatedClass = { generator: 'quick-hit-dice', kind: 'hit-dice', hitDie: die, resourceKey: 'class:hit-dice:' + die };
        matches.filter(function (resource) { return resource !== existing; }).forEach(function (resource) {
          resources.splice(resources.indexOf(resource), 1);
        });
      } else {
        resources.push({ name: '生命骰（' + die + '）', current: count, max: count, cooldown: '長休', source: '角色職業', generatedClass: { generator: 'quick-hit-dice', kind: 'hit-dice', hitDie: die, resourceKey: 'class:hit-dice:' + die } });
      }
      state.hitDiceAccumulator[die] = 0;
    });
    save();
    render();
    renderHitDiceAccumulator();
    notify(t('hitDiceAdded'));
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function addClassRow(config) {
    const row = createElement('div', 'class-row border rounded p-3');
    row.dataset.classId = config && config.classId ? config.classId : 'class-' + Date.now() + '-' + (++state.classRowId);
    const presetKey = config && config.preset && classPresets[config.preset] ? config.preset : 'custom';
    row.dataset.classKey = presetKey;
    const fields = createElement('div', 'row g-2 align-items-end');
    const presetWrap = createElement('div', 'col-12 col-md-3');
    const presetLabel = createElement('label', 'form-label small', t('classPresetLabel'));
    const preset = createElement('select', 'form-select form-select-sm');
    preset.id = row.dataset.classId + '-preset';
    presetLabel.htmlFor = preset.id;
    preset.dataset.classPreset = 'true';
    [['', t('classPresetPrompt')], ['custom', t('classPresetCustom')], ...Object.keys(classPresets).map(function (key) { return [key, t(classPresets[key].label)]; })].forEach(function (item) {
      const option = createElement('option', '', item[1]); option.value = item[0]; preset.appendChild(option);
    });
    preset.value = presetKey;
    presetWrap.append(presetLabel, preset);
    const nameWrap = createElement('div', 'col-12 col-md-3');
    const nameLabel = createElement('label', 'form-label small', t('classNameLabel'));
    const name = createElement('input', 'form-control form-control-sm');
    name.id = row.dataset.classId + '-name'; nameLabel.htmlFor = name.id;
    name.type = 'text'; name.maxLength = 80; name.required = true; name.value = config ? config.name : '';
    name.dataset.className = 'true';
    const nameDisplay = createElement('div', 'class-field-display d-none');
    nameDisplay.dataset.classNameDisplay = 'true';
    nameWrap.append(nameLabel, name, nameDisplay);
    const levelWrap = createElement('div', 'col-6 col-md-2');
    const levelLabel = createElement('label', 'form-label small', t('classLevelLabel'));
    const level = createElement('input', 'form-control form-control-sm');
    level.id = row.dataset.classId + '-level'; levelLabel.htmlFor = level.id;
    level.type = 'number'; level.min = '0'; level.max = '20'; level.step = '1'; level.value = config ? config.level : '1';
    level.dataset.classLevel = 'true'; level.required = true; levelWrap.append(levelLabel, level);
    const dieWrap = createElement('div', 'col-6 col-md-2');
    const dieLabel = createElement('label', 'form-label small', t('hitDiceLabel'));
    const die = createElement('select', 'form-select form-select-sm'); die.dataset.classDie = 'true';
    die.id = row.dataset.classId + '-die'; dieLabel.htmlFor = die.id;
    hitDice.forEach(function (value) { const option = createElement('option', '', formatDieLabel(value)); option.value = value; die.appendChild(option); });
    die.value = config && hitDice.includes(config.hitDie) ? config.hitDie : 'd8';
    const dieDisplay = createElement('div', 'class-field-display d-none');
    dieDisplay.dataset.classDieDisplay = 'true';
    dieWrap.append(dieLabel, die, dieDisplay);
    const progressionWrap = createElement('div', 'col-12 col-md-2');
    const progressionLabel = createElement('label', 'form-label small', t('classProgressionLabel'));
    const progression = createElement('select', 'form-select form-select-sm'); progression.dataset.classProgression = 'true';
    progression.id = row.dataset.classId + '-progression'; progressionLabel.htmlFor = progression.id;
    const progressionDisplay = createElement('div', 'class-field-display d-none');
    progressionDisplay.dataset.classProgressionDisplay = 'true';
    progressionWrap.append(progressionLabel, progression, progressionDisplay);
    fields.append(presetWrap, nameWrap, levelWrap, dieWrap, progressionWrap);
    row.appendChild(fields);
    const subclassWrap = createElement('div', 'mt-2');
    const subclassLabel = createElement('label', 'form-label small', t('classSubclassLabel'));
    const subclass = createElement('select', 'form-select form-select-sm');
    subclass.id = row.dataset.classId + '-subclass';
    subclassLabel.htmlFor = subclass.id;
    subclass.dataset.classSubclass = 'true';
    subclassWrap.append(subclassLabel, subclass);
    const subclassHelp = createElement('div', 'form-text small');
    subclassHelp.dataset.classSubclassHelp = 'true';
    subclassWrap.appendChild(subclassHelp);
    row.appendChild(subclassWrap);
    const presetData = classPresets[presetKey];
    const initialProgression = config && progressions.includes(config.progression)
      ? config.progression
      : presetData ? presetData.progression : 'none';
    renderProgressionOptions(row, initialProgression);
    const manual = createElement('div', 'manual-slots row g-2 mt-1 d-none');
    manual.dataset.manualSlots = 'true';
    row.appendChild(manual);
    document.getElementById('classRows').appendChild(row);
    renderManualSlotInputs(row, config ? config.manualSlots : []);
    renderSubclassOptions(row, config ? config.subclass : '');
    updateClassRowFields(row);
    updateClassPresetOptions();
  }

  function renderSubclassOptions(row, selectedValue) {
    const wrapper = row.querySelector('[data-class-subclass]').parentElement;
    const select = row.querySelector('[data-class-subclass]');
    const catalog = classSubclassData[row.dataset.classKey];
    const level = Number(row.querySelector('[data-class-level]').value);
    const isStandardClass = Boolean(catalog && !rowIsCustom(row));
    wrapper.classList.toggle('d-none', !isStandardClass);
    select.replaceChildren();
    const prompt = createElement('option', '', t('classSubclassPrompt'));
    prompt.value = '';
    select.appendChild(prompt);
    if (catalog) {
      catalog.options.forEach(function (item) {
        const option = createElement('option', '', item[1] + ' (' + item[2] + ')');
        option.value = item[0];
        select.appendChild(option);
      });
    }
    select.value = selectedValue || '';
    select.disabled = !isStandardClass || level < catalog.unlockLevel;
    select.required = isStandardClass && level >= catalog.unlockLevel;
    if (row.dataset.classKey === 'fighter' || row.dataset.classKey === 'rogue') {
      const progression = row.querySelector('[data-class-progression]');
      const subclassKey = row.dataset.classKey === 'fighter' ? 'eldritch-knight' : 'arcane-trickster';
      const isThirdCaster = select.value === subclassKey && level >= catalog.unlockLevel;
      const progressionValue = isThirdCaster ? 'third' : progression.value === 'third' ? 'none' : progression.value;
      renderProgressionOptions(row, progressionValue);
      progression.disabled = isThirdCaster;
      renderManualSlotInputs(row, []);
    }
    const help = row.querySelector('[data-class-subclass-help]');
    if (catalog) {
      setText(help, t('classSubclassUnlockTemplate', { level: catalog.unlockLevel }));
    } else {
      setText(help, '');
    }
  }

  function renderProgressionOptions(row, selectedValue) {
    const progression = row.querySelector('[data-class-progression]');
    const classKey = row.dataset.classKey;
    let allowed = classKey !== 'custom' && classPresets[classKey] ? classPresets[classKey].progressions : progressions;
    const level = Number(row.querySelector('[data-class-level]').value);
    const subclassLevel = classSubclassData[classKey] ? classSubclassData[classKey].unlockLevel : 0;
    if (classKey === 'fighter' && (row.querySelector('[data-class-subclass]').value !== 'eldritch-knight' || level < subclassLevel) ||
      classKey === 'rogue' && (row.querySelector('[data-class-subclass]').value !== 'arcane-trickster' || level < subclassLevel)) {
      allowed = allowed.filter(function (value) { return value !== 'third'; });
    }
    const labels = { none: 'progressionNone', full: 'progressionFull', 'half-down': 'progressionHalfDown', 'half-up': 'progressionHalfUp', third: 'progressionThird', pact: 'progressionPact', manual: 'progressionManual' };
    progression.replaceChildren();
    allowed.forEach(function (value) {
      const option = createElement('option', '', t(labels[value]));
      option.value = value;
      progression.appendChild(option);
    });
    progression.value = allowed.includes(selectedValue) ? selectedValue : allowed[0];
    const display = row.querySelector('[data-class-progression-display]');
    if (display) display.textContent = labels[progression.value] ? t(labels[progression.value]) : progression.value;
  }

  function updateClassPresetOptions() {
    const rows = Array.from(document.querySelectorAll('.class-row'));
    rows.forEach(function (row) {
      const preset = row.querySelector('[data-class-preset]');
      Array.from(preset.options).forEach(function (option) {
        if (!option.value || option.value === 'custom') return;
        option.disabled = rows.some(function (other) { return other !== row && other.dataset.classKey === option.value; });
      });
    });
  }

  function selectClassPreset(row, presetKey) {
    const presetData = classPresets[presetKey];
    if (rowsHaveClassKey(presetKey, row)) {
      setText(document.getElementById('classBuilderError'), t('classDuplicatePresetError'));
      row.querySelector('[data-class-preset]').value = row.dataset.classKey;
      return;
    }
    row.dataset.classKey = presetKey;
    row.querySelector('[data-class-name]').value = presetData.name;
    row.querySelector('[data-class-die]').value = presetData.die;
    row.querySelector('[data-class-subclass]').value = '';
    renderProgressionOptions(row, presetData.progression);
    row.querySelector('[data-class-preset]').value = presetKey;
    renderManualSlotInputs(row, []);
    renderSubclassOptions(row, '');
    updateClassRowFields(row);
    updateClassPresetOptions();
    setText(document.getElementById('classBuilderError'), '');
    row.classList.remove('class-row-applied');
    void row.offsetWidth;
    row.classList.add('class-row-applied');
    window.setTimeout(function () { row.classList.remove('class-row-applied'); }, 1000);
  }

  function rowsHaveClassKey(classKey, exceptRow) {
    return Array.from(document.querySelectorAll('.class-row')).some(function (row) { return row !== exceptRow && row.dataset.classKey === classKey; });
  }

  function rowIsCustom(row) {
    return Boolean(row && row.dataset.classKey === 'custom');
  }

  function unlockCustomClass(row) {
    row.dataset.classKey = 'custom';
    const progression = row.querySelector('[data-class-progression]').value;
    renderProgressionOptions(row, progression);
    renderSubclassOptions(row, '');
    updateClassRowFields(row);
    updateClassPresetOptions();
  }

  function updateClassRowFields(row) {
    const custom = rowIsCustom(row);
    ['name', 'die', 'progression'].forEach(function (field) {
      const input = row.querySelector('[data-class-' + field + ']');
      const display = row.querySelector('[data-class-' + field + '-display]');
      input.classList.toggle('d-none', !custom);
      display.classList.toggle('d-none', custom);
      if (!custom) {
        const value = field === 'progression'
          ? input.options[input.selectedIndex].textContent
          : field === 'die' ? formatDieLabel(input.value) : field === 'name' && classPresets[row.dataset.classKey] && input.value === classPresets[row.dataset.classKey].name ? t(classPresets[row.dataset.classKey].label) : input.value;
        display.textContent = value;
      }
    });
    renderSubclassOptions(row, row.querySelector('[data-class-subclass]').value);
  }

  function renderManualSlotInputs(row, values) {
    const container = row.querySelector('[data-manual-slots]');
    container.replaceChildren();
    values = Array.isArray(values) ? values : [];
    for (let slotLevel = 1; slotLevel <= 9; slotLevel += 1) {
      const wrap = createElement('div', 'col-4 col-md-1');
      const label = createElement('label', 'form-label small', t('slotLevelLabel', { level: slotLevel }));
      const input = createElement('input', 'form-control form-control-sm');
      input.id = row.dataset.classId + '-slot-' + slotLevel; label.htmlFor = input.id;
      input.type = 'number'; input.min = '0'; input.max = '99'; input.step = '1'; input.value = values[slotLevel - 1] || 0; input.required = true;
      input.dataset.manualSlot = String(slotLevel); input.setAttribute('aria-label', t('slotLevelAria', { level: slotLevel }));
      wrap.append(label, input); container.appendChild(wrap);
    }
    container.classList.toggle('d-none', row.querySelector('[data-class-progression]').value !== 'manual');
  }

  function readClassRows() {
    const rows = Array.from(document.querySelectorAll('.class-row'));
    const errors = [];
    const abilityValues = {};
    abilityScores.forEach(function (ability) {
      const input = document.querySelector('[data-ability-score="' + ability.key + '"]');
      const value = input ? input.value.trim() : '';
      if (value && (!Number.isInteger(Number(value)) || Number(value) < 1 || Number(value) > 30)) {
        errors.push(t('classAbilityScoreValidationError', { ability: t(ability.label) }));
      }
      abilityValues[ability.key] = value ? Number(value) : null;
    });
    const configs = rows.map(function (row, index) {
      const levelInput = row.querySelector('[data-class-level]');
      const level = Number(levelInput.value);
      const name = row.querySelector('[data-class-name]').value.trim();
      const progression = row.querySelector('[data-class-progression]').value;
      const die = row.querySelector('[data-class-die]').value;
      const subclass = row.querySelector('[data-class-subclass]').value;
      const subclassInfo = classSubclassData[row.dataset.classKey];
      const selectedSubclass = subclassInfo && subclassInfo.options.find(function (option) { return option[0] === subclass; });
      const manualInputs = Array.from(row.querySelectorAll('[data-manual-slot]'));
      const manualSlots = manualInputs.map(function (input) { return Number(input.value); });
      if (!name || levelInput.value === '' || !Number.isInteger(level) || level < 0 || level > 20 || !hitDice.includes(die) || !progressions.includes(progression) || manualInputs.some(function (input, slotIndex) { return progression === 'manual' && (input.value === '' || !Number.isInteger(manualSlots[slotIndex]) || manualSlots[slotIndex] < 0 || manualSlots[slotIndex] > 99); })) {
        errors.push(t('classRowValidationError', { row: index + 1 }));
      }
      const subclassData = classSubclassData[row.dataset.classKey];
      if (subclassData && level >= subclassData.unlockLevel && !subclass) errors.push(t('classSubclassRequiredError', { row: index + 1, level: subclassData.unlockLevel }));
      return { classId: row.dataset.classId, classKey: row.dataset.classKey, name: name, level: level, hitDie: die, progression: progression, preset: row.dataset.classKey, subclass: subclass, subclassSource: selectedSubclass ? selectedSubclass[2] : null, manualSlots: manualSlots };
    });
    const classKeys = configs.map(function (config) { return config.classKey === 'custom' ? config.name.trim().toLocaleLowerCase() : config.classKey; });
    if (new Set(classKeys).size !== classKeys.length) errors.push(t('classDuplicateError'));
    if (!rows.length) errors.push(t('classMissingError'));
    if (!configs.some(function (config) { return config.level > 0; })) errors.push(t('classZeroLevelError'));
    const totalLevel = configs.reduce(function (total, config) { return total + config.level; }, 0);
    if (totalLevel > 20) errors.push(t('classTotalLevelError'));
    return errors.length ? { errors: errors } : {
      configs: configs,
      abilityScores: abilityValues,
      classFeatureSelections: readClassFeatureSelections()
    };
  }

  function classConfigFromMetadata(resources) {
    const metadata = classBuilderMetadataFromResources(resources);
    return metadata && Array.isArray(metadata.classConfigs)
      ? metadata.classConfigs.filter(function (config) { return config && typeof config === 'object' && Number(config.level) > 0; })
      : [];
  }

  function classBuilderMetadataFromResources(resources) {
    for (let index = 0; index < resources.length; index += 1) {
      const metadata = resources[index].generatedClass;
      if (isGeneratedClassResource(resources[index]) && Array.isArray(metadata.classConfigs)) return metadata;
    }
    return null;
  }

  function normalizedClassFeatureSelections(selections) {
    const normalized = {};
    tceFeatureData.forEach(function (feature) {
      normalized[feature.key] = Boolean(selections && selections[feature.key] === true);
    });
    return normalized;
  }

  function classSettingsEntryKey(character) {
    return 'character:' + character;
  }

  function classFeatureSelectionsForCharacter() {
    const saved = state.character && state.classFeatureSettings[classSettingsEntryKey(state.character)];
    const metadata = classBuilderMetadataFromResources(currentResources());
    const persisted = saved || (metadata && metadata.classFeatureSelections);
    return normalizedClassFeatureSelections(persisted);
  }

  function readClassFeatureSelections() {
    const selections = {};
    document.querySelectorAll('[data-tce-feature]').forEach(function (input) {
      selections[input.dataset.tceFeature] = input.checked;
    });
    return normalizedClassFeatureSelections(selections);
  }

  function persistClassFeatureSelections(selections) {
    if (!state.character) return;
    const normalized = normalizedClassFeatureSelections(selections);
    state.classFeatureSettings[classSettingsEntryKey(state.character)] = normalized;
    const activeFeatures = selectedTceFeatureRules(classConfigFromMetadata(currentResources()), normalized);
    const sorcerousRestoration = activeFeatures.find(function (feature) {
      return feature.key === 'sorcerer-sorcerous-restoration';
    });
    currentResources().forEach(function (resource) {
      if (!isGeneratedClassResource(resource)) return;
      resource.generatedClass.classFeatureSelections = normalized;
      resource.generatedClass.activeTceFeatures = activeFeatures;
      if (resource.generatedClass.resourceKey === 'class:sorcerer:sorcery-points') {
        resource.generatedClass.shortRestRecovery = sorcerousRestoration ? sorcerousRestoration.recovery.shortRestRecovery : 0;
      }
    });
    localStorage.setItem(classSettingsStorageKey, JSON.stringify(state.classFeatureSettings));
    save();
  }

  function renderClassFeatureOptions(selections) {
    const container = document.getElementById('tceFeatureOptions');
    container.replaceChildren();
    const normalized = normalizedClassFeatureSelections(selections);
    tceFeatureData.forEach(function (feature) {
      const wrap = createElement('div', 'form-check');
      const input = createElement('input', 'form-check-input');
      input.type = 'checkbox';
      input.id = 'tce-' + feature.key;
      input.checked = normalized[feature.key];
      input.disabled = !state.character;
      input.dataset.tceFeature = feature.key;
      const label = createElement('label', 'form-check-label', t(feature.label) + ' (' + t(classPresets[feature.classKey].label) + ')');
      label.htmlFor = input.id;
      wrap.append(input, label);
      container.appendChild(wrap);
    });
  }

  function renderAbilityScoreInputs(values) {
    const container = document.getElementById('classAbilityScores');
    container.replaceChildren();
    abilityScores.forEach(function (ability) {
      const wrap = createElement('div', 'col-6 col-md-2');
      const label = createElement('label', 'form-label small', t(ability.label));
      const input = createElement('input', 'form-control form-control-sm');
      input.id = 'ability-' + ability.key;
      input.type = 'number';
      input.min = '1';
      input.max = '30';
      input.step = '1';
      input.inputMode = 'numeric';
      input.dataset.abilityScore = ability.key;
      label.htmlFor = input.id;
      const value = values && values[ability.key];
      input.value = value !== null && value !== undefined && value !== '' && Number.isInteger(Number(value)) ? String(value) : '';
      wrap.append(label, input);
      container.appendChild(wrap);
    });
  }

  function refreshClassRowsForLocale() {
    const container = document.getElementById('classRows');
    const abilityValues = {};
    abilityScores.forEach(function (ability) {
      const input = document.querySelector('[data-ability-score="' + ability.key + '"]');
      abilityValues[ability.key] = input ? input.value : '';
    });
    const selections = readClassFeatureSelections();
    const configs = Array.from(container.querySelectorAll('.class-row')).map(function (row) {
      return {
        classId: row.dataset.classId,
        preset: row.dataset.classKey,
        name: row.querySelector('[data-class-name]').value,
        level: row.querySelector('[data-class-level]').value,
        hitDie: row.querySelector('[data-class-die]').value,
        progression: row.querySelector('[data-class-progression]').value,
        subclass: row.querySelector('[data-class-subclass]').value,
        manualSlots: Array.from(row.querySelectorAll('[data-manual-slot]')).map(function (input) { return input.value; })
      };
    });
    renderAbilityScoreInputs(abilityValues);
    renderClassFeatureOptions(selections);
    container.replaceChildren();
    configs.forEach(function (config) {
      addClassRow(config);
      const row = container.lastElementChild;
      Array.from(row.querySelectorAll('[data-manual-slot]')).forEach(function (input, index) {
        if (config.manualSlots[index] !== undefined) input.value = config.manualSlots[index];
      });
    });
  }

  function renderClassRowsFromResources() {
    const container = document.getElementById('classRows');
    if (!container) return;
    const metadata = classBuilderMetadataFromResources(currentResources());
    const configs = classConfigFromMetadata(currentResources());
    const selections = classFeatureSelectionsForCharacter();
    container.replaceChildren();
    if (configs.length) configs.forEach(function (config) { addClassRow(config); });
    else addClassRow(null);
    renderAbilityScoreInputs(metadata && metadata.abilityScores);
    renderClassFeatureOptions(selections);
  }

  function slotResource(name, maximum, cooldown, metadata) {
    return { name: name, current: maximum, max: maximum, cooldown: cooldown, source: '角色職業', generatedClass: metadata };
  }

  function selectedTceFeatureRules(configs, selections) {
    const activeConfigs = configs.filter(function (config) { return config.level > 0; });
    return tceFeatureData.filter(function (feature) {
      return selections[feature.key] && activeConfigs.some(function (config) {
        return config.classKey === feature.classKey && config.level >= feature.unlockLevel;
      });
    }).map(function (feature) {
      return {
        key: feature.key,
        classKey: feature.classKey,
        unlockLevel: feature.unlockLevel,
        sourceVersion: 'TCE',
        costs: feature.costs || [],
        recovery: feature.recovery || null
      };
    });
  }

  function calculateResourceMaximum(formula, config, proficiencyBonus, abilityValues, errors, errorKeys, featureLabel) {
    let result;
    if (formula.type === 'fixed') result = formula.value;
    else if (formula.type === 'pb') result = proficiencyBonus;
    else if (formula.type === 'twice-pb') result = proficiencyBonus * 2;
    else if (formula.type === 'half-pb-up') result = Math.ceil(proficiencyBonus / 2);
    else if (formula.type === 'class-level') result = config.level;
    else if (formula.type === 'class-level-half-up') result = Math.ceil(config.level / 2);
    else if (formula.type === 'class-level-plus-one') result = config.level + 1;
    else if (formula.type === 'class-level-times') result = config.level * formula.factor;
    else if (formula.type === 'ability' || formula.type === 'ability-plus' || formula.type === 'ability-times') {
      const score = abilityValues && abilityValues[formula.ability];
      if (!Number.isInteger(score) || score < 1 || score > 30) {
        if (!errorKeys.has(formula.ability)) {
          errors.push(t('classAbilityRequiredError', { ability: t(abilityScores.find(function (item) { return item.key === formula.ability; }).label) }));
          errorKeys.add(formula.ability);
        }
        return null;
      }
      const modifier = Math.floor((score - 10) / 2);
      result = formula.type === 'ability-times'
        ? modifier * formula.factor
        : modifier + (formula.type === 'ability-plus' ? formula.amount : 0);
      if (formula.minimum !== undefined) result = Math.max(formula.minimum, result);
    } else if (formula.type === 'level-tiers') {
      const applicable = formula.tiers.filter(function (tier) { return config.level >= tier[0]; });
      result = applicable.length ? applicable[applicable.length - 1][1] : 0;
    } else if (formula.type === 'cleric-channel-divinity') {
      result = config.level >= 18 ? 3 : config.level >= 6 ? 2 : 1;
    } else if (formula.type === 'barbarian-rage') {
      result = config.level >= 20 ? 0 : config.level >= 17 ? 6 : config.level >= 12 ? 5 : config.level >= 6 ? 4 : config.level >= 3 ? 3 : 2;
    } else {
      throw new Error('Unsupported class resource maximum formula "' + formula.type + '" for ' + featureLabel + '.');
    }
    return Number.isInteger(result) && result >= 0 ? result : null;
  }

  function calculateFeatureResources(configs, abilityValues, selections, configSnapshot, sharedMetadata) {
    const activeConfigs = configs.filter(function (config) { return config.level > 0; });
    const totalLevel = activeConfigs.reduce(function (total, config) { return total + config.level; }, 0);
    const proficiencyBonus = Math.floor((totalLevel - 1) / 4) + 2;
    const errors = [];
    const errorKeys = new Set();
    const generated = [];
    const activeTceFeatures = selectedTceFeatureRules(activeConfigs, selections);

    activeConfigs.forEach(function (config) {
      if (!classPresets[config.classKey]) return;
      classResourceData.forEach(function (definition) {
        if (definition.classKey !== config.classKey || config.level < definition.level) return;
        if (definition.subclassKey && config.subclass !== definition.subclassKey) return;
        if (definition.tceFeatureKey && !selections[definition.tceFeatureKey]) return;
        if (definition.recoveryOnly) return;
        const maximum = calculateResourceMaximum(definition.maximum, config, proficiencyBonus, abilityValues, errors, errorKeys, definition.label);
        if (maximum === null || maximum < 1) return;
        const poolKey = (definition.subclassKey ? 'subclass:' + config.classKey + ':' + definition.subclassKey : 'class:' + config.classKey) + ':' + definition.key;
        let cooldown = definition.cooldown;
        (definition.recoveryFromLevel || []).forEach(function (recovery) {
          if (config.level >= recovery.level) cooldown = recovery.cooldown;
        });
        const tceRecovery = activeTceFeatures.find(function (feature) {
          return feature.recovery && feature.recovery.poolKey === poolKey;
        });
        const costs = (definition.costs || []).filter(function (cost) {
          return !cost.minimumClassLevel || config.level >= cost.minimumClassLevel;
        });
        const subclassChoice = classSubclassData[config.classKey].options.find(function (option) {
          return option[0] === definition.subclassKey;
        });
        let longRestRecovery = definition.longRestRecovery || 0;
        let longRestRecoveryWhenEmpty = Boolean(definition.longRestRecoveryWhenEmpty);
        (definition.longRestRecoveryFromLevel || []).forEach(function (recovery) {
          if (config.level >= recovery.level) {
            longRestRecovery = recovery.amount;
            longRestRecoveryWhenEmpty = Boolean(recovery.whenEmpty);
          }
        });
        let resourceDie = definition.maximum.die || null;
        (definition.dieByLevel || []).forEach(function (tier) {
          if (config.level >= tier[0]) resourceDie = tier[1];
        });
        const effectDuration = definition.effectDuration
          ? {
            formula: definition.effectDuration.formula,
            value: calculateResourceMaximum(definition.effectDuration.formula, config, proficiencyBonus, abilityValues, errors, errorKeys, definition.label),
            unit: definition.effectDuration.unit
          }
          : null;
        const metadata = Object.assign({}, sharedMetadata, {
          kind: 'class-resource',
          resourceKey: poolKey,
          featureKey: definition.key,
          ownerClass: config.classKey,
          subclass: definition.subclassKey || null,
          subclassSource: subclassChoice ? subclassChoice[2] : null,
          sourceVersion: definition.source,
          maximumFormula: definition.maximum,
          effectDuration: effectDuration,
          initialValue: definition.initialValue === undefined ? null : definition.initialValue,
          resourceDie: resourceDie,
          dicePoolGroup: definition.dicePoolGroup || null,
          dicePoolLabel: definition.dicePoolLabel || null,
          recovery: cooldown,
          poolMode: definition.poolMode || (definition.maximum.die ? 'dice' : 'uses'),
          accumulative: Boolean(definition.accumulative),
          shared: Boolean(definition.shared),
          costs: costs,
          usageGate: definition.usageGate || null,
          effectGate: definition.effectGate || null,
          recoveryTrigger: definition.recoveryTrigger || null,
          initiativeRecovery: !definition.initiativeRecoveryFromLevel || config.level >= definition.initiativeRecoveryFromLevel ? definition.initiativeRecovery || 0 : 0,
          initiativeRecoveryWhenEmpty: Boolean(definition.initiativeRecoveryWhenEmpty),
          shortRestRecovery: definition.shortRestRecovery || (tceRecovery ? tceRecovery.recovery.shortRestRecovery : 0),
          longRestRecovery: longRestRecovery,
          longRestRecoveryWhenEmpty: longRestRecoveryWhenEmpty,
          longRestResetTo: definition.longRestResetTo,
          spellSlotRecovery: definition.spellSlotRecovery
            ? { amount: definition.spellSlotRecovery.amount, maxLevel: Math.ceil(proficiencyBonus / 2), maxLevelFormula: definition.spellSlotRecovery.maxLevelFormula }
            : null,
          consumesItem: definition.consumesItem || null,
          consumers: (definition.consumers || []).filter(function (consumer) {
            return (!consumer.subclassKey || config.subclass === consumer.subclassKey) &&
              (!consumer.tceFeatureKey || selections[consumer.tceFeatureKey]) &&
              config.level >= consumer.level;
          }),
          relatedFeatureCosts: definition.relatedFeatureCosts || [],
          recoveryEvents: definition.recoveryEvents || [],
          notes: definition.notes || [],
          recoveryTarget: definition.recoveryTarget || null,
          concurrentLimitByLevel: definition.concurrentLimitByLevel || null
        });
        const classLabel = t(classPresets[config.classKey].label);
        generated.push({
          name: classLabel + ' - ' + definition.label,
          current: definition.initialValue === undefined ? maximum : Math.min(maximum, definition.initialValue),
          max: maximum,
          cooldown: cooldown,
          source: '角色職業',
          generatedClass: metadata
        });
      });

      if (config.classKey === 'ranger' && config.level >= 3 && selections['ranger-primal-awareness']) {
        [3, 5, 9, 13, 17].forEach(function (level, index) {
          if (config.level < level) return;
          const spellLevel = index + 1;
          const poolKey = 'tce:ranger:primal-awareness:' + spellLevel;
          generated.push({
            name: t('classRanger') + ' - Primal Awareness (' + spellLevel + t('classSpellLevelSuffix') + ')',
            current: 1,
            max: 1,
            cooldown: '長休',
            source: '角色職業',
            generatedClass: Object.assign({}, sharedMetadata, {
              kind: 'class-resource',
              resourceKey: poolKey,
              featureKey: 'primal-awareness-' + spellLevel,
              ownerClass: 'ranger',
              subclass: null,
              sourceVersion: 'TCE',
              maximumFormula: { type: 'fixed', value: 1, eligibleSpellLevel: spellLevel },
              recovery: '長休',
              poolMode: 'free-cast',
              shared: false,
              costs: [{ type: 'spell-slot', additionalUse: true }],
              usageGate: null
            })
          });
        });
      }

      if (config.classKey === 'fighter' && config.subclass === 'rune-knight' && config.level >= 3) {
        const runeCount = config.level >= 15 ? 5 : config.level >= 10 ? 4 : config.level >= 7 ? 3 : 2;
        for (let runeNumber = 1; runeNumber <= runeCount; runeNumber += 1) {
          const poolKey = 'subclass:fighter:rune-knight:rune:' + runeNumber;
          generated.push({
            name: t('classFighter') + ' - Rune activation ' + runeNumber,
            current: 1,
            max: 1,
            cooldown: '短休',
            source: '角色職業',
            generatedClass: Object.assign({}, sharedMetadata, {
              kind: 'class-resource',
              resourceKey: poolKey,
              featureKey: 'rune-activation-' + runeNumber,
              ownerClass: 'fighter',
              subclass: 'rune-knight',
              subclassSource: 'TCE',
              sourceVersion: 'TCE',
              maximumFormula: { type: 'fixed', value: 1, knownRuneSlot: runeNumber },
              recovery: '短休',
              poolMode: 'uses',
              shared: false,
              costs: [],
              usageGate: null
            })
          });
        }
      }
    });
    return { resources: generated, errors: errors };
  }

  function calculateClassResources(configs, abilityValues, selections) {
    const activeConfigs = configs.filter(function (config) { return config.level > 0; });
    const configSnapshot = JSON.parse(JSON.stringify(activeConfigs));
    const normalizedSelections = normalizedClassFeatureSelections(selections);
    const tceFeatures = selectedTceFeatureRules(activeConfigs, normalizedSelections);
    const metadataBase = {
      generator: 'class-levels',
      classConfigs: configSnapshot,
      abilityScores: abilityValues,
      classFeatureSelections: normalizedSelections,
      activeTceFeatures: tceFeatures
    };
    const regularCounts = Array(9).fill(0);
    const pactResources = [];
    const hitDieCounts = { d6: 0, d8: 0, d10: 0, d12: 0 };
    let casterLevel = 0;
    activeConfigs.forEach(function (config) {
      const common = metadataBase;
      hitDieCounts[config.hitDie] += config.level;
      if (config.progression === 'full') casterLevel += config.level;
      else if (config.progression === 'half-down') casterLevel += Math.floor(config.level / 2);
      else if (config.progression === 'half-up') casterLevel += Math.ceil(config.level / 2);
      else if (config.progression === 'third') casterLevel += Math.floor(config.level / 3);
      else if (config.progression === 'manual') config.manualSlots.forEach(function (count, slotIndex) { regularCounts[slotIndex] += count; });
      else if (config.progression === 'pact') {
        const pact = pactSlots[config.level];
        const metadata = Object.assign({}, common, { kind: 'pact-slot', resourceKey: 'class:warlock:pact-slots', poolMode: 'spell-slot', recovery: '短休', classId: config.classId, className: config.name, slotLevel: pact[1] });
        pactResources.push(slotResource('契約魔法（' + pact[1] + ' 環）', pact[0], '短休', metadata));
        [{ level: 11, slotLevel: 6 }, { level: 13, slotLevel: 7 }, { level: 15, slotLevel: 8 }, { level: 17, slotLevel: 9 }].forEach(function (tier) {
          if (config.level < tier.level) return;
          const arcanumName = '神秘奧秘（' + tier.slotLevel + ' 環）';
          const arcanumMetadata = Object.assign({}, common, { kind: 'mystic-arcanum', resourceKey: 'class:warlock:mystic-arcanum:' + tier.slotLevel, poolMode: 'free-cast', classId: config.classId, className: config.name, slotLevel: tier.slotLevel });
          pactResources.push({ name: arcanumName, current: 1, max: 1, cooldown: '長休', source: '角色職業', generatedClass: arcanumMetadata });
        });
      }
    });
    const generated = [];
    hitDice.forEach(function (die) {
      const count = hitDieCounts[die];
      if (!count) return;
      const metadata = Object.assign({}, metadataBase, { kind: 'hit-dice', resourceKey: 'class:hit-dice:' + die, poolMode: 'dice', hitDie: die });
      generated.push({ name: '生命骰（' + die + '）', current: count, max: count, cooldown: '長休', source: '角色職業', generatedClass: metadata });
    });
    const cappedCasterLevel = Math.min(20, casterLevel);
    const table = regularSlots[cappedCasterLevel] || [];
    table.forEach(function (count, index) { regularCounts[index] += count; });
    if (activeConfigs.length === 1) {
      const config = activeConfigs[0];
      const hasFourthLevelSlot = config.progression === 'third' && config.level >= 19 &&
        ((config.classKey === 'fighter' && config.subclass === 'eldritch-knight') ||
          (config.classKey === 'rogue' && config.subclass === 'arcane-trickster'));
      if (hasFourthLevelSlot) regularCounts[3] += 1;
    }
    regularCounts.forEach(function (count, index) {
      if (!count) return;
      const slotLevel = index + 1;
      const metadata = Object.assign({}, metadataBase, { kind: 'spell-slot', resourceKey: 'class:spell-slot:' + slotLevel, poolMode: 'spell-slot', classId: 'multiclass', slotLevel: slotLevel });
      generated.push(slotResource(String(slotLevel) + ' 環', count, '長休', metadata));
    });
    const featureResources = calculateFeatureResources(configs, abilityValues || {}, normalizedSelections, configSnapshot, metadataBase);
    return { resources: generated.concat(pactResources, featureResources.resources), errors: featureResources.errors };
  }

  function createClassConfirmation() {
    const result = readClassRows();
    if (result.errors) {
      setText(document.getElementById('classBuilderError'), result.errors.join(' '));
      return;
    }
    const calculated = calculateClassResources(result.configs, result.abilityScores, result.classFeatureSelections);
    if (calculated.errors.length) {
      setText(document.getElementById('classBuilderError'), calculated.errors.join(' '));
      return;
    }
    const generated = calculated.resources;
    if (!generated.length) {
      setText(document.getElementById('classBuilderError'), t('classNoResourcesError'));
      return;
    }
    setText(document.getElementById('classBuilderError'), '');
    const summary = generated.map(function (resource) {
      return t('classSummaryItemTemplate', { name: displayResourceName(resource), current: resource.current, max: resource.max });
    }).join(t('classSummarySeparator'));
    showConfirmation(t('confirmApplyClassesTitle'), t('confirmApplyClassesDetail', { summary: summary }), { type: 'apply-class-levels', resources: generated });
  }

  function availabilityText(resource) {
    const cooldown = cooldownInfo[resource.cooldown];
    const period = cooldown
      ? t(cooldown.availabilityPeriod)
      : t('availabilityPeriodCustom', { cooldown: cooldownLabel(resource.cooldown) });
    return t('availabilityTemplate', { period: period, max: resource.max });
  }

  function useResource(index) {
    const resource = currentResources()[index];
    if (!resource || isAccumulativeResource(resource) || Number(resource.current) <= 0) return;
    resource.current = Number(resource.current) - 1;
    save();
    refreshResourceAt(index);
  }

  function resetResource(index) {
    const resource = currentResources()[index];
    if (!resource || isAccumulativeResource(resource)) return;
    resource.current = resource.max;
    save();
    refreshResourceAt(index);
  }

  function adjustAccumulativeResource(index, direction, amountValue) {
    const resource = currentResources()[index];
    if (!resource || !isAccumulativeResource(resource)) return;
    if (direction !== 'gain' && direction !== 'spend') throw new Error('Unsupported accumulative resource adjustment.');
    const amount = Number(amountValue);
    const current = Number(resource.current);
    const maximum = Number(resource.max);
    const available = direction === 'gain' ? Math.max(0, maximum - current) : Math.max(0, current);
    if (!Number.isSafeInteger(amount) || amount < 1 || amount > available) return;
    resource.current = direction === 'gain' ? current + amount : current - amount;
    save();
    refreshResourceAt(index);
  }

  function resetCooldown(level) {
    const tiers = { '每回合': 0, '短休': 1, '長休': 2 };
    const tier = tiers[level];
    const changedIndexes = [];
    currentResources().forEach(function (resource, index) {
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
        } else if (isHitDieResource(resource) && level === '長休') {
          const diceRecovery = Math.max(1, Math.floor(Number(resource.max) / 2));
          const restored = Math.min(Number(resource.max), Number(resource.current) + diceRecovery);
          resource.current = restored;
        } else {
          resource.current = resource.max;
        }
        if (Number(resource.current) !== previous) changedIndexes.push(index);
      }
    });
    if (changedIndexes.length) {
      save();
      changedIndexes.forEach(refreshResourceAt);
    }
  }

  function exportData() {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(state.db))));
    document.getElementById('exportBox').value = encoded;
    document.getElementById('exportActions').classList.remove('d-none');
    setText(document.getElementById('backupStatus'), t('backupExportDone'));
  }

  function copyExportText() {
    const exportBox = document.getElementById('exportBox');
    if (!exportBox.value) return;
    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
      setText(document.getElementById('backupStatus'), t('backupClipboardUnavailable'));
      return;
    }
    navigator.clipboard.writeText(exportBox.value).then(function () {
      exportBox.classList.remove('copied-glow');
      void exportBox.offsetWidth;
      exportBox.classList.add('copied-glow');
      setText(document.getElementById('backupStatus'), t('backupCopyDone'));
    }).catch(function () {
      setText(document.getElementById('backupStatus'), t('backupCopyFailed'));
    });
  }

  function isValidImportData(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
    return Object.keys(data).every(function (name) {
      if (!name.trim() || !Array.isArray(data[name])) return false;
      return data[name].every(function (resource) {
        return Boolean(resource && typeof resource === 'object' && !Array.isArray(resource) &&
          typeof resource.name === 'string' && resource.name.trim() &&
          Number.isInteger(resource.current) && resource.current >= 0 &&
          Number.isInteger(resource.max) && resource.max >= 1 &&
          typeof resource.cooldown === 'string' &&
          typeof resource.source === 'string');
      });
    });
  }

  function importData() {
    const input = document.getElementById('importBox').value.trim();
    if (!input) {
      setText(document.getElementById('backupStatus'), t('backupImportEmpty'));
      return;
    }
    let data;
    try {
      data = JSON.parse(decodeURIComponent(escape(atob(input))));
    } catch (error) {
      setText(document.getElementById('backupStatus'), t('backupImportInvalidJson'));
      return;
    }
    if (!isValidImportData(data)) {
      setText(document.getElementById('backupStatus'), t('backupImportInvalidStructure'));
      return;
    }

    if (!window.confirm(t('backupImportConfirm'))) return;

    const nextDb = Object.create(null);
    Object.keys(data).forEach(function (name) {
      Object.defineProperty(nextDb, name, { value: data[name], enumerable: true, configurable: true, writable: true });
    });
    normalizeLegacyRestTerminology(nextDb);
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextDb));
    } catch (error) {
      setText(document.getElementById('backupStatus'), t('backupImportSaveFailed'));
      throw error;
    }
    state.db = nextDb;
    const importedClassSettings = Object.create(null);
    Object.keys(nextDb).forEach(function (name) {
      const metadata = classBuilderMetadataFromResources(nextDb[name]);
      if (metadata && metadata.classFeatureSelections) {
        importedClassSettings[classSettingsEntryKey(name)] = normalizedClassFeatureSelections(metadata.classFeatureSelections);
      }
    });
    state.classFeatureSettings = importedClassSettings;
    localStorage.setItem(classSettingsStorageKey, JSON.stringify(state.classFeatureSettings));
    if (!Object.prototype.hasOwnProperty.call(state.db, state.character)) state.character = Object.keys(state.db)[0] || '';
    state.selectedResource = null;
    render();
    renderClassRowsFromResources();
    setText(document.getElementById('backupStatus'), t('backupImportDone'));
  }

  function handleAction(actionElement) {
    const action = actionElement.dataset.action;
    const index = Number.parseInt(actionElement.dataset.index, 10);
    const selected = state.selectedResource;
    const selectedResource = selected === null ? null : currentResources()[selected];

    if (action === 'open-management') openManagement();
    else if (action === 'accumulate-hit-die') accumulateHitDie(actionElement.dataset.die);
    else if (action === 'commit-hit-dice') commitHitDiceAccumulator();
    else if (action === 'clear-hit-dice') clearHitDiceAccumulator();
    else if (action === 'add-class-row') addClassRow(null);
    else if (action === 'apply-class-levels') createClassConfirmation();
    else if (action === 'use-resource') useResource(index);
    else if (action === 'reset-resource') resetResource(index);
    else if (action === 'adjust-accumulative-resource') {
      const control = actionElement.closest('.accumulative-control');
      const amountInput = control && control.querySelector('[data-accumulative-amount]');
      adjustAccumulativeResource(index, actionElement.dataset.direction, amountInput ? amountInput.value : '');
    }
    else if (action === 'reset-cooldown') resetCooldown(actionElement.dataset.level);
    else if (action === 'new-resource') {
      if (!state.character) return;
      openEditor('create', null, null);
    } else if (action === 'copy-resource' && selectedResource) {
      openEditor('copy', selected, Object.assign({}, selectedResource));
    } else if (action === 'edit-resource' && selectedResource) {
      openEditor('edit', selected, Object.assign({}, selectedResource));
    } else if (action === 'delete-resource' && selectedResource) {
      showConfirmation(formatResourceTitle('delete', true), t('confirmDeleteResourceDetail', {
        name: selectedResource.name,
        current: selectedResource.current,
        max: selectedResource.max,
        availability: availabilityText(selectedResource)
      }), { type: 'delete-resource', index: selected });
    } else if (action === 'cancel-editor') {
      setManagementView('sections');
      setManagementSection('resources');
    } else if (action === 'copy-character' && state.character) {
      const target = document.getElementById('copyCharacterName').value.trim();
      if (!target) {
        document.getElementById('copyCharacterName').focus();
        return;
      }
      showConfirmation(t('confirmCopyCharacterTitle'), t('confirmCopyCharacterDetail', {
        source: state.character,
        target: target,
        overwrite: state.db[target] ? ' ' + t('copyCharacterOverwriteWarning', { target: target }) : ''
      }), { type: 'copy-character', source: state.character, target: target });
    } else if (action === 'delete-character' && state.character) {
      showConfirmation(t('confirmDeleteCharacterTitle'), t('confirmDeleteCharacterDetail', { name: state.character }), { type: 'delete-character', name: state.character });
    } else if (action === 'export') exportData();
    else if (action === 'import') importData();
    else if (action === 'confirm-management') performPendingAction();
    else if (action === 'cancel-confirm') {
      state.pendingAction = null;
      setManagementView('sections');
      setManagementSection('resources');
    }
  }

  app.addEventListener('click', function (event) {
    const actionElement = event.target.closest('[data-action]');
    if (actionElement && app.contains(actionElement) && !actionElement.disabled) {
      handleAction(actionElement);
      return;
    }
    const sectionButton = event.target.closest('[data-section]');
    if (sectionButton && app.contains(sectionButton)) setManagementSection(sectionButton.dataset.section);
  });

  app.addEventListener('input', function (event) {
    if (!event.target.matches('[data-accumulative-amount]')) return;
    const resourceElement = event.target.closest('[data-resource-index]');
    if (!resourceElement) return;
    const index = Number.parseInt(resourceElement.dataset.resourceIndex, 10);
    syncAccumulativeControls(resourceElement, currentResources()[index]);
  });

  app.addEventListener('change', function (event) {
    if (event.target.id === 'localeSelect') {
      const nextLocale = event.target.value;
      if (!Object.prototype.hasOwnProperty.call(locales, nextLocale)) throw new Error('Unsupported locale: ' + nextLocale);
      localStorage.setItem(localeStorageKey, nextLocale);
      locale = nextLocale;
      i18n = locales[locale];
      applyStaticTranslations();
      render();
      refreshClassRowsForLocale();
    } else if (event.target.id === 'characterSelect') {
      state.character = event.target.value;
      state.selectedResource = null;
      clearHitDiceAccumulator();
      render();
      renderClassRowsFromResources();
    } else if (event.target.matches('[data-resource-select]')) {
      state.selectedResource = Number.parseInt(event.target.value, 10);
      syncManagementResourceControls();
    } else if (event.target.id === 'resourceSource') {
      updateSourceHelp();
    } else if (event.target.matches('[data-class-preset]')) {
      const row = event.target.closest('.class-row');
      if (classPresets[event.target.value]) selectClassPreset(row, event.target.value);
      else if (event.target.value === 'custom') unlockCustomClass(row);
    } else if (event.target.matches('[data-class-name]') && rowIsCustom(event.target.closest('.class-row'))) {
      updateClassPresetOptions();
    } else if (event.target.matches('[data-class-subclass]')) {
      const row = event.target.closest('.class-row');
      renderSubclassOptions(row, event.target.value);
      updateClassRowFields(row);
    } else if (event.target.matches('[data-class-level]')) {
      const row = event.target.closest('.class-row');
      renderSubclassOptions(row, row.querySelector('[data-class-subclass]').value);
      updateClassRowFields(row);
    } else if (event.target.matches('[data-tce-feature]')) {
      persistClassFeatureSelections(readClassFeatureSelections());
    } else if (event.target.matches('[data-class-progression]')) {
      const row = event.target.closest('.class-row');
      const values = Array.from(row.querySelectorAll('[data-manual-slot]')).map(function (input) { return Number(input.value) || 0; });
      renderManualSlotInputs(row, values);
      updateClassRowFields(row);
    }
  });

  app.addEventListener('submit', function (event) {
    if (event.target.id === 'resourceForm') {
      event.preventDefault();
      const resource = readResourceForm();
      if (!resource) return;
      let title;
      let details;
      if (state.editorMode === 'edit') {
        const oldResource = currentResources()[state.editorIndex];
        const oldName = oldResource ? oldResource.name : resource.name;
        title = formatResourceTitle('edit', true);
        const overMax = resource.current > resource.max;
        details = t('resourceEditDetailTemplate', {
          name: oldName,
          rename: resource.name !== oldName ? t('resourceRenameTemplate', { name: resource.name }) : '',
          summary: resourceSummaryText(resource),
          warning: overMax ? t('resourceOverMaxEditWarning') : ''
        });
      } else if (state.editorMode === 'copy') {
        title = formatResourceTitle('copy', true);
        details = t('resourceCopyDetailTemplate', { sourceName: state.editorSourceName, name: resource.name, summary: resourceSummaryText(resource) });
      } else {
        title = formatResourceTitle('create', true);
        details = t('resourceCreateDetailTemplate', { name: resource.name, summary: resourceSummaryText(resource) });
      }
      showConfirmation(title, details, {
        type: 'save-resource',
        mode: state.editorMode === 'edit' ? 'edit' : 'create',
        index: state.editorIndex,
        resource: resource
      });
    }
  });

  document.getElementById('roleCreateForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const nameInput = document.getElementById('roleName');
    const name = nameInput.value.trim();
    const error = document.getElementById('roleCreateError');
    setText(error, '');
    if (!name) { nameInput.focus(); return; }
    if (Object.prototype.hasOwnProperty.call(state.db, name)) {
      setText(error, t('roleNameExists'));
      nameInput.focus();
      return;
    }
    state.db[name] = [];
    state.character = name;
    state.classFeatureSettings[classSettingsEntryKey(name)] = normalizedClassFeatureSelections();
    localStorage.setItem(classSettingsStorageKey, JSON.stringify(state.classFeatureSettings));
    state.selectedResource = null;
    save();
    render();
    renderClassRowsFromResources();
    nameInput.value = '';
    state.openManagementAfterRoleCreate = true;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    state.roleModal.hide();
    notify(t('roleCreated', { name: name }));
  });

  roleModalElement.addEventListener('hidden.bs.modal', function () {
    if (!state.openManagementAfterRoleCreate) return;
    state.openManagementAfterRoleCreate = false;
    openManagement();
  });

  modalElement.addEventListener('hidden.bs.modal', function () {
    state.pendingAction = null;
    setManagementView('sections');
    setManagementSection('resources');
    document.getElementById('copyCharacterName').value = '';
    document.getElementById('importBox').value = '';
    document.getElementById('exportBox').value = '';
    document.getElementById('exportBox').classList.remove('copied-glow');
    document.getElementById('exportActions').classList.add('d-none');
    setText(document.getElementById('backupStatus'), '');
  });

  document.getElementById('exportBox').addEventListener('click', copyExportText);

  applyStaticTranslations();
  render();
  renderHitDiceAccumulator();
})().catch(function (error) {
  console.error('Failed to initialize character resources.', error);
});
