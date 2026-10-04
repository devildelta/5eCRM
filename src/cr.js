(function () {
  'use strict';

  const storageKey = 'dnd_skills_db';
  const sourceInfo = {
    '角色職業': { english: 'Class', description: '職業等級與職業特性' },
    '角色特徵': { english: 'Character Feature', description: '種族特性、專長與背景特性' },
    '魔法物品': { english: 'Magic Item', description: '魔法物品提供的資源' },
    '其他': { english: 'Other', description: '其他來源' }
  };
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
    artificer: { name: 'Artificer', die: 'd8', progression: 'half-up', progressions: ['half-up'] },
    barbarian: { name: 'Barbarian', die: 'd12', progression: 'none', progressions: ['none'] },
    bard: { name: 'Bard', die: 'd8', progression: 'full', progressions: ['full'] },
    cleric: { name: 'Cleric', die: 'd8', progression: 'full', progressions: ['full'] },
    druid: { name: 'Druid', die: 'd8', progression: 'full', progressions: ['full'] },
    fighter: { name: 'Fighter', die: 'd10', progression: 'none', progressions: ['none', 'third'] },
    monk: { name: 'Monk', die: 'd8', progression: 'none', progressions: ['none'] },
    paladin: { name: 'Paladin', die: 'd10', progression: 'half-down', progressions: ['half-down'] },
    ranger: { name: 'Ranger', die: 'd10', progression: 'half-down', progressions: ['half-down'] },
    rogue: { name: 'Rogue', die: 'd8', progression: 'none', progressions: ['none', 'third'] },
    sorcerer: { name: 'Sorcerer', die: 'd6', progression: 'full', progressions: ['full'] },
    warlock: { name: 'Warlock', die: 'd8', progression: 'pact', progressions: ['pact'] },
    wizard: { name: 'Wizard', die: 'd6', progression: 'full', progressions: ['full'] }
  };
  const params = new URLSearchParams(window.location.search);
  const storedDb = JSON.parse(localStorage.getItem(storageKey) || '{}');
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
    hitDiceAccumulator: { d6: 0, d8: 0, d10: 0, d12: 0 }
  };

  const app = document.getElementById('crApp');
  const modalElement = document.getElementById('managementModal');
  state.modal = bootstrap.Modal.getOrCreateInstance(modalElement);
  state.roleModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('roleCreateModal'));
  state.toast = bootstrap.Toast.getOrCreateInstance(document.getElementById('crToast'));

  function notify(message) {
    setText(document.getElementById('crToastMessage'), message);
    state.toast.show();
  }

  function save() {
    localStorage.setItem(storageKey, JSON.stringify(state.db));
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
    if (isSpellSlotResource(resource)) {
      if (resource && resource.generatedClass && resource.generatedClass.kind === 'pact-slot') return 3;
      const slotLevel = resourceSlotLevel(resource);
      return slotLevel <= 5 ? 1 : 2;
    }
    if (resource && resource.generatedClass && resource.generatedClass.kind === 'mystic-arcanum') return 4;
    return 5;
  }

  function sortResourcesForDisplay(resources) {
    return resources.map(function (resource, index) { return { resource: resource, index: index }; }).sort(function (left, right) {
      const groupDelta = resourceSortGroup(left.resource) - resourceSortGroup(right.resource);
      if (groupDelta !== 0) return groupDelta;
      const slotDelta = resourceSlotLevel(left.resource) - resourceSlotLevel(right.resource);
      if (slotDelta !== 0) return slotDelta;
      return (left.resource.name || '').localeCompare(right.resource.name || '', 'zh-Hant');
    });
  }

  function resourceSummaryText(resource) {
    const details = [resource && resource.source ? resource.source : '其他', resource && resource.cooldown ? resource.cooldown : '手動', '上限 ' + (Number(resource && resource.max) || 0) + ' 次'];
    return details.join('，');
  }

  function createResourceRow(resource, index) {
    const row = document.createElement('div');
    row.className = 'resource-row p-2 border rounded';
    row.dataset.resourceIndex = String(index);
    const summary = document.createElement('div');
    summary.className = 'd-flex justify-content-between align-items-start gap-2';
    const name = document.createElement('div');
    name.className = 'fw-semibold';
    name.textContent = resource.name;
    const meta = document.createElement('div');
    meta.className = 'small text-secondary text-end resource-count';
    meta.textContent = '使用次數：' + resource.current + ' / ' + resource.max;
    summary.append(name, meta);
    const actions = document.createElement('div');
    actions.className = 'd-flex gap-2 mt-2';
    const useButton = document.createElement('button');
    useButton.className = 'btn btn-light btn-sm flex-fill';
    useButton.type = 'button';
    useButton.dataset.action = 'use-resource';
    useButton.dataset.index = index;
    useButton.textContent = '使用';
    useButton.disabled = !state.character || Number(resource.current) <= 0;
    const resetButton = document.createElement('button');
    resetButton.className = 'btn btn-warning btn-sm flex-fill';
    resetButton.type = 'button';
    resetButton.dataset.action = 'reset-resource';
    resetButton.dataset.index = index;
    resetButton.textContent = '重置';
    resetButton.disabled = !state.character;
    actions.append(useButton, resetButton);
    row.append(summary, actions);
    return row;
  }

  function createGroupedResourceCard(label, items) {
    const column = document.createElement('div');
    column.className = 'col-12 col-md-6 col-xl-4';
    const card = document.createElement('article');
    card.className = 'card h-100';
    const header = document.createElement('div');
    header.className = 'card-header d-flex justify-content-between align-items-start gap-2';
    const name = document.createElement('strong');
    name.textContent = label;
    const source = document.createElement('span');
    source.className = 'tag-source';
    source.textContent = '角色職業';
    header.append(name, source);
    const body = document.createElement('div');
    body.className = 'card-body';
    items.forEach(function (item) {
      const row = createResourceRow(item.resource, item.index);
      row.classList.add('mb-2');
      body.appendChild(row);
    });
    card.append(header, body);
    column.appendChild(card);
    return column;
  }

  function createResourceCard(resource, index) {
    const column = document.createElement('div');
    column.className = 'col-12 col-md-6 col-xl-4';
    column.dataset.resourceIndex = String(index);
    const card = document.createElement('article');
    card.className = 'card h-100';
    const header = document.createElement('div');
    header.className = 'card-header d-flex justify-content-between align-items-start gap-2';
    const name = document.createElement('strong');
    name.className = 'resource-name';
    name.textContent = resource.name;
    const warning = document.createElement('span');
    warning.className = 'resource-warning d-none';
    warning.textContent = '⚠';
    warning.setAttribute('role', 'img');
    warning.setAttribute('aria-label', '');
    const source = document.createElement('span');
    source.className = 'tag-source';
    source.textContent = resource.source;
    header.append(name, warning, source);

    const body = document.createElement('div');
    body.className = 'card-body';
    const count = document.createElement('p');
    count.className = 'resource-count';
    count.textContent = '使用次數：' + resource.current + ' / ' + resource.max;
    const status = document.createElement('p');
    status.className = 'resource-status small mb-2';
    status.setAttribute('aria-live', 'polite');
    const cooldown = document.createElement('p');
    cooldown.className = 'mb-3';
    cooldown.textContent = '回復時機：' + resource.cooldown;
    const actions = document.createElement('div');
    actions.className = 'd-flex gap-2';
    const useButton = document.createElement('button');
    useButton.className = 'btn btn-light flex-fill';
    useButton.type = 'button';
    useButton.dataset.action = 'use-resource';
    useButton.dataset.index = index;
    useButton.textContent = '使用';
    useButton.disabled = !state.character || Number(resource.current) <= 0;
    const resetButton = document.createElement('button');
    resetButton.className = 'btn btn-warning flex-fill';
    resetButton.type = 'button';
    resetButton.dataset.action = 'reset-resource';
    resetButton.dataset.index = index;
    resetButton.textContent = '重置';
    resetButton.disabled = !state.character;
    actions.append(useButton, resetButton);
    body.append(count, status, cooldown, actions);
    card.append(header, body);
    applyResourceStatus(card, resource);
    column.appendChild(card);
    return column;
  }

  function groupResourcesForDisplay(entries) {
    const groups = [
      { label: '生命骰', type: 'hit-dice', items: [] },
      { label: '法術位（1–5 環）', type: 'spell-1-5', items: [] },
      { label: '法術位（6–9 環）', type: 'spell-6-9', items: [] },
      { label: '契約魔法', type: 'pact', items: [] },
      { label: '其他資源', type: 'other', items: [] }
    ];
    entries.forEach(function (entry) {
      const resource = entry.resource;
      if (isHitDieResource(resource)) {
        groups[0].items.push({ resource: resource, index: entry.index });
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
    return groups.filter(function (group) { return group.items.length > 0; });
  }

  function setText(element, value) {
    element.textContent = value == null ? '' : String(value);
  }

  function updateCharacters() {
    const select = document.getElementById('characterSelect');
    select.replaceChildren();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = Object.keys(state.db).length ? '選擇角色' : '尚無角色';
    select.appendChild(placeholder);
    Object.keys(state.db).forEach(function (name) {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });
    select.value = state.character;
    setText(document.getElementById('currentLabel'), state.character ? '目前角色：' + state.character : '目前角色：尚未選擇');
    setText(document.getElementById('managementCharacterLabel'), state.character ? '目前角色：' + state.character : '尚未選擇角色。');
    document.querySelectorAll('[data-action="copy-character"], [data-action="delete-character"]').forEach(function (button) {
      button.disabled = !state.character;
    });
    document.querySelectorAll('[data-action="reset-cooldown"], [data-action="new-resource"], [data-action="accumulate-hit-die"], [data-action="commit-hit-dice"], [data-action="add-class-row"], [data-action="apply-class-levels"]').forEach(function (button) {
      button.disabled = !state.character;
    });
    renderHitDiceAccumulator();
  }

  function applyResourceStatus(card, resource) {
    const current = Number(resource.current);
    const max = Number(resource.max);
    const overMax = current > max;
    const depleted = current === 0;
    const low = current > 0 && max > 0 && current / max <= 0.5;
    card.classList.toggle('resource-depleted', depleted);
    card.classList.toggle('resource-low', low);
    card.classList.toggle('resource-over-max', overMax);
    const warning = card.querySelector('.resource-warning');
    warning.classList.toggle('d-none', !overMax);
    warning.title = overMax ? '目前可用次數高於新上限，請重置此資源。' : '';
    warning.setAttribute('aria-label', overMax ? '目前可用次數高於新上限，請重置此資源' : '');
    const status = card.querySelector('.resource-status');
    status.textContent = overMax ? '注意：目前次數高於上限，請重置' : depleted ? '狀態：已用盡' : low ? '狀態：剩餘偏低' : '狀態：可用';
  }

  function renderResources() {
    const list = document.getElementById('skillList');
    const entries = sortResourcesForDisplay(currentResources());
    list.replaceChildren();
    const grouped = groupResourcesForDisplay(entries);
    grouped.forEach(function (group) {
      if (group.items.length === 1) {
        const item = group.items[0];
        list.appendChild(createResourceCard(item.resource, item.index));
      } else {
        list.appendChild(createGroupedResourceCard(group.label, group.items));
      }
    });
    const resources = currentResources();
    document.getElementById('emptyState').classList.toggle('d-none', resources.length > 0);
    if (!state.character) setText(document.getElementById('emptyState'), '請先選擇角色，或建立一個新角色。');
    else if (!resources.length) setText(document.getElementById('emptyState'), '此角色尚無資源。請從「管理」新增資源。');
  }

  function refreshResourceAt(index) {
    const resource = currentResources()[index];
    if (!resource) return;
    const list = document.getElementById('skillList');
    const matches = list.querySelectorAll('[data-resource-index="' + index + '"]');
    if (!matches.length) return;
    matches.forEach(function (row) {
      const card = row.closest('.card');
      const count = row.querySelector('.resource-count') || (card && card.querySelector('.resource-count'));
      if (count) count.textContent = '使用次數：' + resource.current + ' / ' + resource.max;
      const useButton = row.querySelector('[data-action="use-resource"]') || (card && card.querySelector('[data-action="use-resource"]'));
      if (useButton) useButton.disabled = Number(resource.current) <= 0;
      if (card) applyResourceStatus(card, resource);
    });
  }

  function renderManagementResources() {
    const list = document.getElementById('managementResourceList');
    const resources = currentResources();
    const entries = sortResourcesForDisplay(resources);
    list.replaceChildren();
    entries.forEach(function (entry) {
      const resource = entry.resource;
      const index = entry.index;
      const label = document.createElement('label');
      label.className = 'list-group-item d-flex align-items-center gap-3';
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
      title.textContent = resource.name;
      const detail = document.createElement('span');
      detail.className = 'd-block small text-secondary';
      const source = sourceInfo[resource.source] || sourceInfo['其他'];
      detail.textContent = resource.current + ' / ' + resource.max + '，' + resource.cooldown + '，' + resource.source + ' (' + source.english + ')：' + source.description;
      description.append(title, detail);
      label.append(radio, description);
      list.appendChild(label);
    });
    document.getElementById('resourceSelectionHint').classList.toggle('d-none', resources.length > 0);
    ['copy-resource', 'edit-resource', 'delete-resource'].forEach(function (action) {
      const button = document.querySelector('[data-action="' + action + '"]');
      button.disabled = state.selectedResource === null || !resources[state.selectedResource];
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

  function openEditor(mode, index, resource) {
    state.editorMode = mode;
    state.editorIndex = index;
    state.editorSourceName = resource ? resource.name : '';
    document.getElementById('resourceEditorTitle').textContent = mode === 'edit' ? '修改資源' : mode === 'copy' ? '複製資源' : '新增資源';
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
    setText(document.getElementById('resourceSourceHelp'), value + ' ' + source.english + '：' + source.description + '。');
  }

  function performPendingAction() {
    const action = state.pendingAction;
    if (!action) return;
    if (action.type === 'save-resource') {
      const resources = currentResources();
      if (action.mode === 'edit') resources[action.index] = action.resource;
      else resources.push(action.resource);
      state.selectedResource = action.mode === 'edit' ? action.index : resources.length - 1;
      save();
      render();
      setManagementView('sections');
    } else if (action.type === 'delete-resource') {
      currentResources().splice(action.index, 1);
      state.selectedResource = null;
      save();
      render();
      setManagementView('sections');
    } else if (action.type === 'delete-character') {
      delete state.db[action.name];
      state.character = '';
      state.selectedResource = null;
      save();
      render();
      renderClassRowsFromResources();
      setManagementView('sections');
    } else if (action.type === 'copy-character') {
      state.db[action.target] = JSON.parse(JSON.stringify(state.db[action.source]));
      save();
      render();
      setManagementView('sections');
      setManagementSection('characters');
    } else if (action.type === 'apply-class-levels') {
      const resources = currentResources();
      const manualResources = resources.filter(function (resource) {
        return !isHitDieResource(resource) && !isSpellSlotResource(resource);
      });
      action.resources.forEach(function (resource) { manualResources.push(resource); });
      state.db[state.character] = manualResources;
      state.selectedResource = null;
      save();
      render();
      renderClassRowsFromResources();
      setManagementView('sections');
      setManagementSection('resources');
      notify('職業等級資源已更新；手動管理的資源保持不變。');
    }
    state.pendingAction = null;
  }

  function isGeneratedClassResource(resource) {
    return resource && resource.generatedClass && resource.generatedClass.generator === 'class-levels';
  }

  function hitDieOf(resource) {
    if (resource && resource.generatedClass && hitDice.includes(resource.generatedClass.hitDie)) return resource.generatedClass.hitDie;
    const match = resource && typeof resource.name === 'string' ? resource.name.match(/\b(d6|d8|d10|d12)\b/i) : null;
    return match ? match[1].toLowerCase() : '';
  }

  function isHitDieResource(resource) {
    return Boolean(resource && ((resource.generatedClass && resource.generatedClass.kind === 'hit-dice') || (/^(生命骰|hit die|hit dice)/i.test(resource.name || '') && hitDieOf(resource))));
  }

  function isSpellSlotResource(resource) {
    return Boolean(resource && resource.generatedClass && ['spell-slot', 'pact-slot'].includes(resource.generatedClass.kind)) || Boolean(resource && !resource.generatedClass && /^(法術位|契約魔法|spell slots?|pact magic)/i.test(resource.name || ''));
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
        if (!existing.generatedClass) existing.generatedClass = { generator: 'quick-hit-dice', kind: 'hit-dice', hitDie: die };
        matches.filter(function (resource) { return resource !== existing; }).forEach(function (resource) {
          resources.splice(resources.indexOf(resource), 1);
        });
      } else {
        resources.push({ name: '生命骰（' + die + '）', current: count, max: count, cooldown: '手動', source: '角色職業', generatedClass: { generator: 'quick-hit-dice', kind: 'hit-dice', hitDie: die } });
      }
      state.hitDiceAccumulator[die] = 0;
    });
    save();
    render();
    renderHitDiceAccumulator();
    notify('已將累積的生命骰加入資源列表。');
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
    const presetLabel = createElement('label', 'form-label small', '職業範本');
    const preset = createElement('select', 'form-select form-select-sm');
    preset.id = row.dataset.classId + '-preset';
    presetLabel.htmlFor = preset.id;
    preset.dataset.classPreset = 'true';
    [['', '選擇職業範本'], ['custom', '自訂職業'], ...Object.keys(classPresets).map(function (key) { return [key, classPresets[key].name]; })].forEach(function (item) {
      const option = createElement('option', '', item[1]); option.value = item[0]; preset.appendChild(option);
    });
    preset.value = config && config.preset === 'custom' ? 'custom' : '';
    presetWrap.append(presetLabel, preset);
    const nameWrap = createElement('div', 'col-12 col-md-3');
    const nameLabel = createElement('label', 'form-label small', '職業名稱');
    const name = createElement('input', 'form-control form-control-sm');
    name.id = row.dataset.classId + '-name'; nameLabel.htmlFor = name.id;
    name.type = 'text'; name.maxLength = 80; name.required = true; name.value = config ? config.name : '';
    name.dataset.className = 'true';
    nameWrap.append(nameLabel, name);
    const levelWrap = createElement('div', 'col-6 col-md-2');
    const levelLabel = createElement('label', 'form-label small', '等級（0 移除）');
    const level = createElement('input', 'form-control form-control-sm');
    level.id = row.dataset.classId + '-level'; levelLabel.htmlFor = level.id;
    level.type = 'number'; level.min = '0'; level.max = '20'; level.step = '1'; level.value = config ? config.level : '1';
    level.dataset.classLevel = 'true'; level.required = true; levelWrap.append(levelLabel, level);
    const dieWrap = createElement('div', 'col-6 col-md-2');
    const dieLabel = createElement('label', 'form-label small', '生命骰');
    const die = createElement('select', 'form-select form-select-sm'); die.dataset.classDie = 'true';
    die.id = row.dataset.classId + '-die'; dieLabel.htmlFor = die.id;
    hitDice.forEach(function (value) { const option = createElement('option', '', value); option.value = value; die.appendChild(option); });
    die.value = config && hitDice.includes(config.hitDie) ? config.hitDie : 'd8'; dieWrap.append(dieLabel, die);
    const progressionWrap = createElement('div', 'col-12 col-md-2');
    const progressionLabel = createElement('label', 'form-label small', '施法進程');
    const progression = createElement('select', 'form-select form-select-sm'); progression.dataset.classProgression = 'true';
    progression.id = row.dataset.classId + '-progression'; progressionLabel.htmlFor = progression.id;
    progressionWrap.append(progressionLabel, progression);
    fields.append(presetWrap, nameWrap, levelWrap, dieWrap, progressionWrap);
    row.appendChild(fields);
    renderProgressionOptions(row, config && progressions.includes(config.progression) ? config.progression : 'none');
    if (presetKey !== 'custom') {
      name.disabled = true;
      die.disabled = true;
    }
    const manual = createElement('div', 'manual-slots row g-2 mt-1 d-none');
    manual.dataset.manualSlots = 'true';
    row.appendChild(manual);
    document.getElementById('classRows').appendChild(row);
    renderManualSlotInputs(row, config ? config.manualSlots : []);
    updateClassPresetOptions();
  }

  function renderProgressionOptions(row, selectedValue) {
    const progression = row.querySelector('[data-class-progression]');
    const classKey = row.dataset.classKey;
    const allowed = classKey !== 'custom' && classPresets[classKey] ? classPresets[classKey].progressions : progressions;
    const labels = { none: '非施法者', full: '完整施法者', 'half-down': '半施法（向下）', 'half-up': '半施法（向上）', third: '三分之一施法者', pact: '契約魔法', manual: '自訂法術位' };
    progression.replaceChildren();
    allowed.forEach(function (value) {
      const option = createElement('option', '', labels[value]);
      option.value = value;
      progression.appendChild(option);
    });
    progression.value = allowed.includes(selectedValue) ? selectedValue : allowed[0];
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
      setText(document.getElementById('classBuilderError'), '此職業已在其他列選擇，請先移除重複項目。');
      row.querySelector('[data-class-preset]').value = '';
      return;
    }
    row.dataset.classKey = presetKey;
    row.querySelector('[data-class-name]').value = presetData.name;
    row.querySelector('[data-class-name]').disabled = true;
    row.querySelector('[data-class-die]').value = presetData.die;
    row.querySelector('[data-class-die]').disabled = true;
    const progression = row.querySelector('[data-class-progression]');
    renderProgressionOptions(row, presetData.progression);
    row.querySelector('[data-class-preset]').value = '';
    renderManualSlotInputs(row, []);
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
    row.querySelector('[data-class-name]').disabled = false;
    row.querySelector('[data-class-die]').disabled = false;
    const progression = row.querySelector('[data-class-progression]').value;
    renderProgressionOptions(row, progression);
    updateClassPresetOptions();
  }

  function renderManualSlotInputs(row, values) {
    const container = row.querySelector('[data-manual-slots]');
    container.replaceChildren();
    values = Array.isArray(values) ? values : [];
    for (let slotLevel = 1; slotLevel <= 9; slotLevel += 1) {
      const wrap = createElement('div', 'col-4 col-md-1');
      const label = createElement('label', 'form-label small', slotLevel + ' 環');
      const input = createElement('input', 'form-control form-control-sm');
      input.id = row.dataset.classId + '-slot-' + slotLevel; label.htmlFor = input.id;
      input.type = 'number'; input.min = '0'; input.max = '99'; input.step = '1'; input.value = values[slotLevel - 1] || 0; input.required = true;
      input.dataset.manualSlot = String(slotLevel); input.setAttribute('aria-label', slotLevel + ' 環法術位數量');
      wrap.append(label, input); container.appendChild(wrap);
    }
    container.classList.toggle('d-none', row.querySelector('[data-class-progression]').value !== 'manual');
  }

  function readClassRows() {
    const rows = Array.from(document.querySelectorAll('.class-row'));
    const errors = [];
    const configs = rows.map(function (row, index) {
      const levelInput = row.querySelector('[data-class-level]');
      const level = Number(levelInput.value);
      const name = row.querySelector('[data-class-name]').value.trim();
      const progression = row.querySelector('[data-class-progression]').value;
      const die = row.querySelector('[data-class-die]').value;
      const manualInputs = Array.from(row.querySelectorAll('[data-manual-slot]'));
      const manualSlots = manualInputs.map(function (input) { return Number(input.value); });
      if (!name || levelInput.value === '' || !Number.isInteger(level) || level < 0 || level > 20 || !hitDice.includes(die) || !progressions.includes(progression) || manualInputs.some(function (input, slotIndex) { return progression === 'manual' && (input.value === '' || !Number.isInteger(manualSlots[slotIndex]) || manualSlots[slotIndex] < 0 || manualSlots[slotIndex] > 99); })) {
        errors.push('第 ' + (index + 1) + ' 列職業資料不完整或超出允許範圍。');
      }
      return { classId: row.dataset.classId, classKey: row.dataset.classKey, name: name, level: level, hitDie: die, progression: progression, preset: row.dataset.classKey, manualSlots: manualSlots };
    });
    const classKeys = configs.map(function (config) { return config.classKey === 'custom' ? config.name.trim().toLocaleLowerCase() : config.classKey; });
    if (new Set(classKeys).size !== classKeys.length) errors.push('職業不可重複；請合併相同職業的等級。');
    if (!rows.length) errors.push('請至少新增一列職業。');
    if (!configs.some(function (config) { return config.level > 0; })) errors.push('至少一個職業等級需大於 0。');
    return errors.length ? { errors: errors } : { configs: configs };
  }

  function classConfigFromMetadata(resources) {
    for (let index = 0; index < resources.length; index += 1) {
      const metadata = resources[index].generatedClass;
      if (isGeneratedClassResource(resources[index]) && Array.isArray(metadata.classConfigs)) {
        return metadata.classConfigs.filter(function (config) { return config && typeof config === 'object'; });
      }
    }
    return [];
  }

  function renderClassRowsFromResources() {
    const container = document.getElementById('classRows');
    if (!container) return;
    const configs = classConfigFromMetadata(currentResources());
    container.replaceChildren();
    if (configs.length) configs.forEach(function (config) { addClassRow(config); });
    else addClassRow(null);
  }

  function slotResource(name, maximum, cooldown, metadata) {
    return { name: name, current: maximum, max: maximum, cooldown: cooldown, source: '角色職業', generatedClass: metadata };
  }

  function calculateClassResources(configs) {
    const activeConfigs = configs.filter(function (config) { return config.level > 0; });
    const configSnapshot = JSON.parse(JSON.stringify(activeConfigs));
    const regularCounts = Array(9).fill(0);
    const pactResources = [];
    const hitDieCounts = { d6: 0, d8: 0, d10: 0, d12: 0 };
    let casterLevel = 0;
    activeConfigs.forEach(function (config) {
      const common = { generator: 'class-levels', classConfigs: configSnapshot };
      hitDieCounts[config.hitDie] += config.level;
      if (config.progression === 'full') casterLevel += config.level;
      else if (config.progression === 'half-down') casterLevel += Math.floor(config.level / 2);
      else if (config.progression === 'half-up') casterLevel += Math.ceil(config.level / 2);
      else if (config.progression === 'third') casterLevel += Math.floor(config.level / 3);
      else if (config.progression === 'manual') config.manualSlots.forEach(function (count, slotIndex) { regularCounts[slotIndex] += count; });
      else if (config.progression === 'pact') {
        const pact = pactSlots[config.level];
        const metadata = Object.assign({}, common, { kind: 'pact-slot', classId: config.classId, className: config.name, slotLevel: pact[1] });
        pactResources.push(slotResource('契約魔法（' + config.name + '，' + pact[1] + ' 環）', pact[0], '短休', metadata));
        const mysticTier = config.level >= 17 ? 6 : config.level >= 11 ? 5 : null;
        if (mysticTier) {
          const arcanumName = '神秘奧秘（' + config.name + '，' + mysticTier + ' 環）';
          const arcanumMetadata = Object.assign({}, common, { kind: 'mystic-arcanum', classId: config.classId, className: config.name, slotLevel: mysticTier });
          pactResources.push({ name: arcanumName, current: 1, max: 1, cooldown: '長休', source: '角色職業', generatedClass: arcanumMetadata });
        }
      }
    });
    const generated = [];
    hitDice.forEach(function (die) {
      const count = hitDieCounts[die];
      if (!count) return;
      const metadata = { generator: 'class-levels', kind: 'hit-dice', hitDie: die, classConfigs: configSnapshot };
      generated.push({ name: '生命骰（' + die + '）', current: count, max: count, cooldown: '手動', source: '角色職業', generatedClass: metadata });
    });
    const cappedCasterLevel = Math.min(20, casterLevel);
    const table = regularSlots[cappedCasterLevel] || [];
    table.forEach(function (count, index) { regularCounts[index] += count; });
    regularCounts.forEach(function (count, index) {
      if (!count) return;
      const slotLevel = index + 1;
      const metadata = { generator: 'class-levels', kind: 'spell-slot', classId: 'multiclass', slotLevel: slotLevel, classConfigs: configSnapshot };
      generated.push(slotResource(String(slotLevel) + ' 環', count, '長休', metadata));
    });
    return generated.concat(pactResources);
  }

  function createClassConfirmation() {
    const result = readClassRows();
    if (result.errors) {
      setText(document.getElementById('classBuilderError'), result.errors.join(' '));
      return;
    }
    const generated = calculateClassResources(result.configs);
    if (!generated.length) {
      setText(document.getElementById('classBuilderError'), '這些設定沒有可產生的資源。');
      return;
    }
    setText(document.getElementById('classBuilderError'), '');
    const summary = generated.map(function (resource) { return resource.name + ' ' + resource.current + ' / ' + resource.max; }).join('；');
    showConfirmation('確認套用職業資源', '將重建此角色由職業計算器產生的資源（手動建立的資源不變）：' + summary + '。', { type: 'apply-class-levels', resources: generated });
  }

  function availabilityText(resource) {
    if (resource.cooldown === '手動') return '上限 ' + resource.max + ' 次，手動回復';
    const period = { '每回合': '每回合', '短休': '每短休', '長休': '每長休', '日出': '日出時', '每24小時': '每24小時' }[resource.cooldown] || resource.cooldown;
    return period + '可使用 ' + resource.max + ' 次';
  }

  function useResource(index) {
    const resource = currentResources()[index];
    if (!resource || Number(resource.current) <= 0) return;
    resource.current = Number(resource.current) - 1;
    save();
    refreshResourceAt(index);
  }

  function resetResource(index) {
    const resource = currentResources()[index];
    if (!resource) return;
    resource.current = resource.max;
    save();
    refreshResourceAt(index);
  }

  function resetCooldown(level) {
    const tiers = { '每回合': 0, '短休': 1, '長休': 2 };
    const tier = tiers[level];
    const changedIndexes = [];
    currentResources().forEach(function (resource, index) {
      if (tiers[resource.cooldown] !== undefined && tiers[resource.cooldown] <= tier) {
        resource.current = resource.max;
        changedIndexes.push(index);
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
    setText(document.getElementById('backupStatus'), '角色設定已匯出。');
  }

  function importData() {
    const input = document.getElementById('importBox').value.trim();
    if (!input) {
      setText(document.getElementById('backupStatus'), '請先貼上 Base64 匯出字串。');
      return;
    }
    try {
      const data = JSON.parse(decodeURIComponent(escape(atob(input))));
      if (!data || typeof data !== 'object') throw new Error('Invalid import');
      Object.keys(data).forEach(function (name) {
        if (state.db[name] && !window.confirm('角色「' + name + '」已存在，是否覆蓋？')) return;
        state.db[name] = data[name];
      });
      save();
      if (!state.character && Object.keys(state.db).length) state.character = Object.keys(state.db)[0];
      state.selectedResource = null;
      render();
      renderClassRowsFromResources();
      setText(document.getElementById('backupStatus'), '匯入完成。');
    } catch (error) {
      setText(document.getElementById('backupStatus'), '資料格式錯誤，請確認為正確的 Base64 編碼 JSON。');
    }
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
    else if (action === 'reset-cooldown') resetCooldown(actionElement.dataset.level);
    else if (action === 'new-resource') {
      if (!state.character) return;
      openEditor('create', null, null);
    } else if (action === 'copy-resource' && selectedResource) {
      openEditor('copy', selected, Object.assign({}, selectedResource));
    } else if (action === 'edit-resource' && selectedResource) {
      openEditor('edit', selected, Object.assign({}, selectedResource));
    } else if (action === 'delete-resource' && selectedResource) {
      showConfirmation('確認刪除資源', '將刪除「' + selectedResource.name + '」（' + selectedResource.current + ' / ' + selectedResource.max + '，' + availabilityText(selectedResource) + '）。此動作無法還原。', { type: 'delete-resource', index: selected });
    } else if (action === 'cancel-editor') {
      setManagementView('sections');
      setManagementSection('resources');
    } else if (action === 'copy-character' && state.character) {
      const target = document.getElementById('copyCharacterName').value.trim();
      if (!target) {
        document.getElementById('copyCharacterName').focus();
        return;
      }
      showConfirmation('確認複製角色', '將角色「' + state.character + '」複製為「' + target + '」。' + (state.db[target] ? ' 現有角色「' + target + '」及其資源將被覆蓋。' : ''), { type: 'copy-character', source: state.character, target: target });
    } else if (action === 'delete-character' && state.character) {
      showConfirmation('確認刪除角色', '將刪除角色「' + state.character + '」及其所有資源。此動作無法還原。', { type: 'delete-character', name: state.character });
    } else if (action === 'export') exportData();
    else if (action === 'import') importData();
    else if (action === 'copy-export') {
      navigator.clipboard.writeText(document.getElementById('exportBox').value).then(function () {
        setText(document.getElementById('backupStatus'), '設定字串已複製。');
      }).catch(function () {
        setText(document.getElementById('backupStatus'), '無法使用剪貼簿，請手動複製匯出字串。');
      });
    } else if (action === 'confirm-management') performPendingAction();
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

  app.addEventListener('change', function (event) {
    if (event.target.id === 'characterSelect') {
      state.character = event.target.value;
      state.selectedResource = null;
      clearHitDiceAccumulator();
      render();
      renderClassRowsFromResources();
    } else if (event.target.matches('[data-resource-select]')) {
      state.selectedResource = Number.parseInt(event.target.value, 10);
      renderManagementResources();
    } else if (event.target.id === 'resourceSource') {
      updateSourceHelp();
    } else if (event.target.matches('[data-class-preset]')) {
      const row = event.target.closest('.class-row');
      if (classPresets[event.target.value]) selectClassPreset(row, event.target.value);
      else if (event.target.value === 'custom') unlockCustomClass(row);
    } else if (event.target.matches('[data-class-name]') && rowIsCustom(event.target.closest('.class-row'))) {
      updateClassPresetOptions();
    } else if (event.target.matches('[data-class-progression]')) {
      const row = event.target.closest('.class-row');
      const values = Array.from(row.querySelectorAll('[data-manual-slot]')).map(function (input) { return Number(input.value) || 0; });
      renderManualSlotInputs(row, values);
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
        title = '確認修改資源';
        const overMax = resource.current > resource.max;
        details = '將修改「' + oldName + '」' + (resource.name !== oldName ? '為「' + resource.name + '」' : '') + '：' + resourceSummaryText(resource) + (overMax ? '。目前次數會高於新上限，主頁將標示提醒；請使用重置恢復。' : '。');
      } else if (state.editorMode === 'copy') {
        title = '確認複製資源';
        details = '將以「' + state.editorSourceName + '」為範本，新增「' + resource.name + '」：' + resourceSummaryText(resource) + '。';
      } else {
        title = '確認新增資源';
        details = '將新增「' + resource.name + '」：' + resourceSummaryText(resource) + '。';
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
      setText(error, '此角色名稱已存在，請使用其他名稱。');
      nameInput.focus();
      return;
    }
    state.db[name] = [];
    state.character = name;
    state.selectedResource = null;
    save();
    render();
    renderClassRowsFromResources();
    nameInput.value = '';
    state.roleModal.hide();
    notify('角色「' + name + '」已建立並選取。');
  });

  modalElement.addEventListener('hidden.bs.modal', function () {
    state.pendingAction = null;
    setManagementView('sections');
    setManagementSection('resources');
  });

  render();
  renderHitDiceAccumulator();
})();

