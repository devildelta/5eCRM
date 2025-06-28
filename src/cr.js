let character = '';
let db = JSON.parse(localStorage.getItem('dnd_skills_db') || '{}');

function save() {
  localStorage.setItem('dnd_skills_db', JSON.stringify(db));
}

function updateCurrentLabel() {
  const label = document.getElementById('currentLabel');
  label.textContent = character ? `目前角色：${character}` : '目前角色：尚未選擇';
}

function updateCharacterList() {
  const sel = document.getElementById('characterSelect');
  sel.innerHTML = '';
  Object.keys(db).forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.text = c;
    sel.appendChild(opt);
  });
  sel.value = character;
}

function switchCharacter() {
  const input = document.getElementById('characterInput').value.trim();
  const selection = document.getElementById('characterSelect').value;
  character = input || selection;
  if (!character) return;
  if (!db[character]) db[character] = [];
  save();
  updateCharacterList();
  updateCurrentLabel();
  refreshAllSkills();
  document.getElementById('characterInput').value = '';
}

function copyCharacter() {
  if (!character) return alert('請先選擇角色');
  const newName = prompt('輸入新角色名稱以複製：');
  if (!newName) return;
  if (db[newName] && !confirm('角色已存在，確定覆蓋？')) return;
  db[newName] = JSON.parse(JSON.stringify(db[character]));
  save();
  updateCharacterList();
}

function deleteCharacter() {
  if (!character) return alert("請先選擇角色");
  if (!db[character]) return alert("角色不存在");

  if (!confirm(`確定要刪除角色「${character}」及其所有技能？此動作無法還原。`)) return;

  delete db[character];
  character = '';
  save();
  updateCharacterList();
  updateCurrentLabel();
  refreshAllSkills();
}

function createSkillCard(s, i) {
  const card = document.createElement('div');
  card.className = 'card mb-3';
  card.id = `skill-${i}`;

  const header = document.createElement('div');
  header.className = 'card-header';

  const titleRow = document.createElement('div');
  titleRow.className = 'title-row';
  titleRow.innerHTML = `
    <strong>${s.name}</strong>
    <span class="tag-source source-${s.source}">${s.source}</span>
  `;

  const buttonRow = document.createElement('div');
  buttonRow.className = 'button-row';
  buttonRow.innerHTML = `
    <button class="btn btn-sm btn-light me-1" onclick="use(${i})">使用</button>
    <button class="btn btn-sm btn-warning me-1" onclick="resetOne(${i})">重置</button>
    <button class="btn btn-sm btn-info me-1" onclick="copyItem(${i})">複製</button>
    <button class="btn btn-sm btn-primary me-1" onclick="edit(${i})">修改</button>
    <button class="btn btn-sm btn-danger" onclick="remove(${i})">刪除</button>
  `;

  header.appendChild(titleRow);
  header.appendChild(buttonRow);

  const body = document.createElement('div');
  body.className = 'card-body';
  body.innerHTML = `
    <p id="count-${i}">使用次數：<strong>${s.current}</strong> / ${s.max}</p>
    <p id="cooldown-${i}">冷卻間隔：${s.cooldown}</p>
  `;

  card.appendChild(header);
  card.appendChild(body);
  return card;
}

function refreshAllSkills() {
  const out = document.getElementById('skillList');
  out.innerHTML = '';
  (db[character] || []).forEach((s, i) => {
    const card = createSkillCard(s, i);
    out.appendChild(card);
  });
}

function refreshSkillAt(i) {
  const s = db[character][i];
  const count = document.getElementById(`count-${i}`);
  const cooldown = document.getElementById(`cooldown-${i}`);
  if (count) count.innerHTML = `使用次數：<strong>${s.current}</strong> / ${s.max}`;
  if (cooldown) cooldown.innerHTML = `冷卻間隔：${s.cooldown}`;
}

function addSkill() {
  if (!character) return alert('請先選擇角色');
  const name = document.getElementById('name').value.trim();
  const uses = parseInt(document.getElementById('uses').value);
  const max = parseInt(document.getElementById('max').value);
  const cooldown = document.getElementById('cooldown').value;
  const source = document.getElementById('sourceType').value;
  if (!name || isNaN(uses) || isNaN(max)) return alert('資料不完整');
  const s = { name, current: uses, max, cooldown, source };
  db[character].push(s);
  save();
  const skillList = document.getElementById('skillList');
  skillList.appendChild(createSkillCard(s, db[character].length - 1));
  ['name','uses','max'].forEach(id => document.getElementById(id).value = '');
}

function use(i) {
  if (db[character][i].current > 0) db[character][i].current--;
  save(); refreshSkillAt(i);
}

function resetOne(i) {
  db[character][i].current = db[character][i].max;
  save(); refreshSkillAt(i);
}

function copyItem(i) {
  const item = { ...db[character][i] };
  db[character].splice(i + 1, 0, item);
  save(); refreshAllSkills();
}

function edit(i) {
  const s = db[character][i];
  document.getElementById('name').value = s.name;
  document.getElementById('uses').value = s.current;
  document.getElementById('max').value = s.max;
  document.getElementById('cooldown').value = s.cooldown;
  document.getElementById('sourceType').value = s.source;
  db[character].splice(i, 1);
  save(); refreshAllSkills();
}

function remove(i) {
  if (confirm('確定刪除此技能？')) {
    db[character].splice(i, 1);
    save(); refreshAllSkills();
  }
}

function resetCooldown(level) {
  const tier = { '每回合': 0, '短休': 1, '長休': 2 };
  const currentTier = tier[level];
  const list = db[character] || [];
  let changed = false;
  list.forEach((s, i) => {
    if (tier[s.cooldown] !== undefined && tier[s.cooldown] <= currentTier) {
      s.current = s.max;
      refreshSkillAt(i);
      changed = true;
    }
  });
  if (changed) save();
}

function exportData() {
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(db))));
  document.getElementById('exportBox').textContent = encoded;
  document.getElementById('exportBox').classList.remove('d-none');
  document.getElementById('exportActions').classList.remove('d-none');
  document.getElementById('copyAlert').classList.add('d-none');
}

function copyExport() {
  const data = document.getElementById('exportBox').textContent;
  if (!data) return;
  navigator.clipboard.writeText(data).then(() => {
    const alertEl = document.getElementById('copyAlert');
    alertEl.classList.remove('d-none');
    setTimeout(() => alertEl.classList.add('d-none'), 2000);
  });
}


function importPrompt() {
  const input = prompt("請貼上 Base64 匯出字串：");
  if (!input) return;
  try {
    const json = decodeURIComponent(escape(atob(input)));
    const data = JSON.parse(json);
    if (typeof data !== 'object') throw new Error();

    Object.keys(data).forEach(name => {
      if (db[name] && !confirm(`角色 "${name}" 已存在，是否覆蓋？`)) return;
      db[name] = data[name];
    });

    save();
    updateCharacterList();
    if (!character && Object.keys(db).length > 0) {
      character = Object.keys(db)[0];
      updateCurrentLabel();
    }
    refreshAllSkills();
    alert("匯入成功！");
  } catch (e) {
    alert("資料格式錯誤，請確認為正確的 Base64 編碼 JSON。");
  }
}


// 初始化
updateCharacterList();
updateCurrentLabel();

