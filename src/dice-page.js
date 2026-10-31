(function () {
	'use strict';

	const form = document.getElementById('dice-form');
	const attackEditor = document.getElementById('attack-editor');
	const attackModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('attack-modal'));
	const attackList = document.getElementById('attack-list');
	const inputError = document.getElementById('input-error');
	const results = document.getElementById('results');
	const placeholder = document.getElementById('result-placeholder');
	const chartCanvas = document.getElementById('damage-chart');
	const chartError = document.getElementById('chart-error');
	const outcomeChartCanvas = document.getElementById('outcome-chart');
	const outcomeChartError = document.getElementById('outcome-chart-error');
	const discardedWarning = document.getElementById('discarded-warning');
	const editorBasicFields = document.getElementById('entry-basic-fields');
	const editorAdvancedMode = document.getElementById('entry-advanced-mode');
	const editorAdvancedFields = document.getElementById('entry-advanced-fields');
	const editorHitDiceDisplay = document.getElementById('entry-hit-dice-display');
	const editorDamageDiceDisplay = document.getElementById('entry-damage-dice-display');
	const attackBonusInput = document.getElementById('entry-attack-bonus');
	const attackBonusTerm = attackBonusInput.closest('.hit-formula-bonus');
	const damageBonusInput = document.getElementById('entry-damage-bonus');
	const damageBonusTerm = damageBonusInput.closest('.hit-formula-bonus');
	const editorHitModifierDice = [];
	const editorDamageDice = [];
	const attacks = [{
		id: '1',
		name: '弓手攻擊',
		advancedMode: false,
		extraCritDamageDie: false,
		attackBonus: 5,
		attackMode: 'normal',
		hitModifierDice: [],
		damageDice: [{ sides: 8, isNegative: false, count: 1 }],
		damageBonus: 3,
		attacksPerRound: 1,
		roundNumber: '',
		prFormula: '',
		advancedAttack: 'D20+5',
		advancedDamage: '1 (1D8+3)'
	}];
	let damageChart = null;
	let outcomeChart = null;
	let editingIndex = -1;
	let nextAttackId = 2;
	let calculationRunId = 0;

	function logPerformance(stage, runId, durationMs, details = {}) {
		console.info('[骰子分析效能]', {
			runId,
			stage,
			durationMs: Number(durationMs.toFixed(2)),
			...details
		});
	}

	function fieldValue(id) {
		return document.getElementById(id).value;
	}

	function signedTerm(value) {
		const number = Number(value);
		return number < 0 ? String(number) : `+${number}`;
	}

	function formatPercent(probability) {
		return `${(probability * 100).toFixed(1)}%`;
	}

	function damageDiceFormula(dice) {
		return dice.map((die, index) => {
			const sign = die.isNegative ? '-' : index === 0 ? '' : '+';
			return `${sign}${die.count}D${die.sides}`;
		}).join('');
	}

	function createDieFace(sides, tone, label, modeLabel = '', mode = '') {
		const face = document.createElement('span');
		face.className = `die-face die-face-${tone} die-face-d${sides}`;
		face.setAttribute('aria-hidden', 'true');

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.classList.add('die-svg');
		svg.setAttribute('viewBox', '0 0 64 64');
		svg.setAttribute('focusable', 'false');
		svg.style.color = getComputedStyle(face).color;
		svg.style.setProperty('--die-fill', getComputedStyle(face).getPropertyValue('--die-fill'));
		const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
		use.setAttribute('href', `#die-shape-d${sides}`);
		svg.appendChild(use);

		const text = document.createElement('span');
		text.className = 'die-label';
		text.textContent = label;
		face.append(svg, text);
		if (modeLabel) {
			const modeBadge = document.createElement('span');
			modeBadge.className = `die-mode-label die-mode-label-${mode}`;
			modeBadge.textContent = modeLabel;
			modeBadge.setAttribute('aria-hidden', 'true');
			face.appendChild(modeBadge);
		}
		return face;
	}

	function getSimpleAttackInput(entry, totalRounds) {
		const modeToken = {
			normal: '',
			advantage: 'A1',
			disadvantage: 'D1',
			'elven-accuracy': 'A2'
		}[entry.attackMode];
		const hitDice = entry.hitModifierDice.map(die => {
			const sign = die.isNegative ? '-' : '+';
			return `${sign}${die.count}D${die.sides}`;
		}).join('');
		const attackStr = `D20${modeToken}${signedTerm(entry.attackBonus)}${hitDice}`;
		const damageDice = damageDiceFormula(entry.damageDice);
		const damageFormula = `${damageDice || ''}${signedTerm(entry.damageBonus)}`;
		const roundFormula = `${entry.attacksPerRound} ${damageFormula}${entry.prFormula ? `, ${entry.prFormula}` : ''}`;
		const scheduledRounds = entry.roundNumber ? 1 : totalRounds;

		return {
			attackStr,
			rawDamageStr: `${scheduledRounds} (${roundFormula})`,
			attackCount: entry.attacksPerRound * scheduledRounds
		};
	}

	function getEntryCalculation(entry, totalRounds) {
		if (!entry.advancedMode) return getSimpleAttackInput(entry, totalRounds);
		const rawDamageStr = entry.advancedDamage.trim();
		const roundBlueprint = parseAdvancedDamageString(rawDamageStr);
		if (roundBlueprint.length !== 1) {
			throw new Error(`攻擊「${entry.name}」嘅進階公式只可輸入單輪傷害；請用「套用輪次」設定輪次。`);
		}
		if (roundBlueprint[0].attacks.length === 0) {
			throw new Error(`攻擊「${entry.name}」嘅進階公式必須包含至少一次攻擊。`);
		}
		const scheduledRounds = entry.roundNumber ? 1 : totalRounds;
		const repeatedDamageStr = scheduledRounds === 1
			? rawDamageStr
			: /^\s*\d+\s*\(/.test(rawDamageStr)
				? rawDamageStr.replace(/^\s*\d+/, String(scheduledRounds))
				: `${scheduledRounds} ${rawDamageStr}`;
		return {
			attackStr: entry.advancedAttack.trim(),
			rawDamageStr: repeatedDamageStr,
			attackCount: scheduledRounds * roundBlueprint[0].attacks.length
		};
	}

	function renderEditorHitDice() {
		const mode = fieldValue('entry-attack-mode');
		const modeOrder = ['normal', 'advantage', 'elven-accuracy', 'disadvantage'];
		const modeLabels = {
			normal: '普通',
			advantage: '優勢',
			'elven-accuracy': '精靈準確',
			disadvantage: '劣勢'
		};
		const nextMode = modeOrder[(modeOrder.indexOf(mode) + 1) % modeOrder.length];
		editorHitDiceDisplay.replaceChildren();
		const appendOperator = operator => {
			const separator = document.createElement('span');
			separator.className = 'hit-formula-operator';
			separator.textContent = operator;
			separator.setAttribute('aria-hidden', 'true');
			editorHitDiceDisplay.appendChild(separator);
		};
		const tone = mode === 'normal' ? 'neutral' : mode === 'disadvantage' ? 'negative' : 'positive';
		const modeTag = {
			normal: '',
			advantage: 'A',
			'elven-accuracy': 'EA',
			disadvantage: 'D'
		}[mode];
		const modeToggle = document.createElement('button');
		modeToggle.type = 'button';
		modeToggle.className = 'die-mode-toggle';
		modeToggle.appendChild(createDieFace(20, tone, 'D20', modeTag, mode));
		modeToggle.setAttribute(
			'aria-label',
			`命中模式：${modeLabels[mode]}；按一下切換至${modeLabels[nextMode]}`
		);
		modeToggle.title = `命中模式：${modeLabels[mode]}（按一下切換至${modeLabels[nextMode]}）`;
		modeToggle.addEventListener('click', function () {
			document.getElementById('entry-attack-mode').value = nextMode;
			renderEditorHitDice();
		});
		editorHitDiceDisplay.appendChild(modeToggle);
		editorHitModifierDice.forEach(die => {
			appendOperator(die.isNegative ? '−' : '+');
			const tone = die.isNegative ? 'negative' : 'positive';
			const modifier = document.createElement('button');
			modifier.type = 'button';
			modifier.className = 'die-remove';
			modifier.appendChild(createDieFace(
				die.sides,
				tone,
				`${die.count > 1 ? die.count : ''}D${die.sides}`
			));
			modifier.setAttribute(
				'aria-label',
				`移除一顆${die.isNegative ? '負向' : '正向'} D${die.sides}；目前 ${die.count} 顆`
			);
			modifier.addEventListener('click', function () {
				die.count--;
				if (die.count === 0) {
					const dieIndex = editorHitModifierDice.indexOf(die);
					if (dieIndex >= 0) editorHitModifierDice.splice(dieIndex, 1);
				}
				renderEditorHitDice();
			});
			editorHitDiceDisplay.appendChild(modifier);
		});
		attackBonusTerm.dataset.sign = Number(attackBonusInput.value) < 0 ? '−' : '+';
		editorHitDiceDisplay.appendChild(attackBonusTerm);
		const modifierCount = editorHitModifierDice.reduce((sum, die) => sum + die.count, 0);
		document.querySelectorAll('.hit-die-buttons button').forEach(button => {
			button.disabled = modifierCount >= 599;
		});
	}

	function renderEditorDamageDice() {
		editorDamageDiceDisplay.replaceChildren();
		const appendOperator = operator => {
			const separator = document.createElement('span');
			separator.className = 'hit-formula-operator';
			separator.textContent = operator;
			separator.setAttribute('aria-hidden', 'true');
			editorDamageDiceDisplay.appendChild(separator);
		};
		editorDamageDice.forEach((die, index) => {
			if (die.isNegative) appendOperator('−');
			else if (index > 0) appendOperator('+');
			const tone = die.isNegative ? 'negative' : 'positive';
			const modifier = document.createElement('button');
			modifier.type = 'button';
			modifier.className = 'die-remove';
			modifier.appendChild(createDieFace(
				die.sides,
				tone,
				`${die.count > 1 ? die.count : ''}D${die.sides}`
			));
			modifier.setAttribute(
				'aria-label',
				`移除一顆${die.isNegative ? '負向' : '正向'}傷害 D${die.sides}；目前 ${die.count} 顆`
			);
			modifier.addEventListener('click', function () {
				die.count--;
				if (die.count === 0) {
					const dieIndex = editorDamageDice.indexOf(die);
					if (dieIndex >= 0) editorDamageDice.splice(dieIndex, 1);
				}
				renderEditorDamageDice();
			});
			editorDamageDiceDisplay.appendChild(modifier);
		});
		damageBonusTerm.dataset.sign = Number(damageBonusInput.value) < 0 ? '−' : '+';
		editorDamageDiceDisplay.appendChild(damageBonusTerm);
		const diceCount = editorDamageDice.reduce((sum, die) => sum + die.count, 0);
		document.querySelectorAll('.damage-die-buttons button').forEach(button => {
			button.disabled = diceCount >= 300;
		});
	}

	function setEditorValue(id, value) {
		document.getElementById(id).value = value;
	}

	function openAttackEditor(index) {
		editingIndex = index;
		attackEditor.reset();
		editorHitModifierDice.length = 0;
		editorDamageDice.length = 0;
		const entry = index < 0 ? null : attacks[index];
		document.getElementById('attack-modal-title').textContent = entry ? '編輯攻擊' : '新增攻擊';
		document.getElementById('delete-attack').hidden = !entry;
		setEditorValue('entry-name', entry ? entry.name : `攻擊 ${attacks.length + 1}`);
		setEditorValue('entry-attack-bonus', entry ? entry.attackBonus : 5);
		setEditorValue('entry-attack-mode', entry ? entry.attackMode : 'normal');
		setEditorValue('entry-damage-bonus', entry ? entry.damageBonus : 3);
		setEditorValue('entry-attacks-per-round', entry ? entry.attacksPerRound : 1);
		setEditorValue('entry-round-number', entry ? entry.roundNumber : '');
		setEditorValue('entry-pr-formula', entry ? entry.prFormula : '');
		editorAdvancedMode.checked = Boolean(entry && entry.advancedMode);
		document.getElementById('entry-extra-crit-die').checked = Boolean(entry && entry.extraCritDamageDie);
		setEditorValue('entry-advanced-attack', entry ? entry.advancedAttack : 'D20+5');
		setEditorValue('entry-advanced-damage', entry ? entry.advancedDamage : '1 (1D8+3)');
		if (entry) editorHitModifierDice.push(...entry.hitModifierDice.map(die => ({ ...die })));
		if (entry) editorDamageDice.push(...entry.damageDice.map(die => ({ ...die })));
		else editorDamageDice.push({ sides: 8, isNegative: false, count: 1 });
		toggleAdvancedFields();
		renderEditorHitDice();
		renderEditorDamageDice();
		attackModal.show();
	}

	function toggleAdvancedFields() {
		const advanced = editorAdvancedMode.checked;
		editorBasicFields.disabled = advanced;
		editorAdvancedFields.hidden = !advanced;
		editorAdvancedFields.querySelectorAll('input, textarea').forEach(field => {
			field.disabled = !advanced;
			field.required = advanced;
		});
	}

	function formulaForRow(entry) {
		if (entry.advancedMode) return `${entry.advancedAttack} · ${entry.advancedDamage}`;
		return getSimpleAttackInput(entry).attackStr;
	}

	function getEntryRemarkTags(entry) {
		const tags = [];
		if (entry.roundNumber) tags.push(`第 ${entry.roundNumber} 輪`);
		let prFormula = '';
		if (entry.advancedMode) {
			const prDice = entry.advancedDamage.match(/\d*D\d+PR/gi) || [];
			prFormula = prDice.map(die => die.replace(/PR$/i, '')).join(' + ');
		} else {
			prFormula = entry.prFormula.replace(/PR$/i, '').trim();
		}
		if (prFormula) tags.push(`PR: ${prFormula}`);
		if (entry.extraCritDamageDie) tags.push('+1 C.M.');
		return tags;
	}

	function renderAttackList() {
		attackList.replaceChildren();
		attacks.forEach((entry, index) => {
			const row = document.createElement('button');
			row.type = 'button';
			row.className = 'attack-item';
			row.dataset.index = String(index);
			row.setAttribute('aria-label', `編輯攻擊，名稱：${entry.name}`);
			const hit = document.createElement('span');
			hit.className = 'font-monospace';
			hit.textContent = formulaForRow(entry);
			const damage = document.createElement('span');
			damage.className = 'font-monospace';
			damage.textContent = entry.advancedMode
				? '進階公式'
				: `${damageDiceFormula(entry.damageDice)}${signedTerm(entry.damageBonus)}`;
			const count = document.createElement('span');
			count.textContent = entry.advancedMode
				? '自訂'
				: `${entry.attacksPerRound} 次 / 輪`;
			const name = document.createElement('span');
			name.textContent = entry.name;
			name.title = entry.name;
			const parts = [hit, damage, count, name];
			const tags = getEntryRemarkTags(entry);
			if (tags.length > 0) {
				const remarks = document.createElement('span');
				remarks.className = 'attack-remark-tags';
				tags.forEach(tagText => {
					const tag = document.createElement('span');
					tag.className = 'badge bg-light text-secondary border';
					tag.textContent = tagText;
					remarks.appendChild(tag);
				});
				parts.push(remarks);
			}
			parts.forEach((part, partIndex) => {
				if (partIndex > 0) {
					const separator = document.createElement('span');
					separator.className = 'attack-item-separator';
					separator.setAttribute('aria-hidden', 'true');
					separator.textContent = '|';
					row.appendChild(separator);
				}
				row.appendChild(part);
			});
			attackList.appendChild(row);
		});
	}

	function renderDistributionChart(summary, runId) {
		const { distribution, distributionSupport } = summary;
		if (typeof Chart !== 'function') {
			chartError.textContent = '圖表程式未能載入；計算結果仍可查看。請檢查網絡連線或 CDN 設定。';
			chartError.hidden = false;
			chartCanvas.hidden = true;
			logPerformance('graph-render-unavailable', runId, 0, {
				reason: 'Chart.js 未載入',
				pointCount: distribution.length
			});
			return;
		}

		chartError.hidden = true;
		chartCanvas.hidden = false;
		const prepareStartedAt = performance.now();
		const plottedPoints = Array.from(
			{ length: Math.max(0, distribution.length - 1) },
			(_, index) => ({ x: index + 1, y: distribution[index + 1] * 100 })
		);
		const quartileColors = {
			Q1: '#e6a700',
			Q2: '#8056b3',
			Q3: '#168a75',
			Q4: '#d34b45'
		};
		const quartilesByDamage = new Map();
		[
			['Q1', summary.q1],
			['Q2', summary.q2],
			['Q3', summary.q3],
			['Q4', summary.details.totalMaxPossibleDmg]
		].forEach(([label, damage]) => {
			const labelsAtDamage = quartilesByDamage.get(damage) || [];
			labelsAtDamage.push(label);
			quartilesByDamage.set(damage, labelsAtDamage);
		});
		const infinitesimalMarkers = [
			{ label: 'Q1', damage: summary.q1 },
			{ label: 'Q4', damage: summary.details.totalMaxPossibleDmg }
		].filter(marker => marker.damage < distribution.length
			&& distributionSupport[marker.damage]
			&& distribution[marker.damage] === 0);
		const compactDistributionChartPlugin = {
			id: 'compactDistributionChart',
			beforeLayout(chart) {
				const showYAxisLabels = chart.width >= 480;
				chart.options.scales.y.ticks.display = showYAxisLabels;
				chart.options.scales.y.title.display = showYAxisLabels;
			}
		};
		const infinitesimalMarkerPlugin = {
			id: 'infinitesimalQuartileMarkers',
			afterDatasetsDraw(chart) {
				if (infinitesimalMarkers.length === 0) return;
				const context = chart.ctx;
				context.save();
				infinitesimalMarkers.forEach(marker => {
					const x = Math.min(
						chart.chartArea.right - 7,
						Math.max(chart.chartArea.left + 7, chart.scales.x.getPixelForValue(marker.damage))
					);
					const y = chart.chartArea.bottom - 2;
					context.fillStyle = quartileColors[marker.label];
					context.beginPath();
					context.moveTo(x, y);
					context.lineTo(x - 7, y - 12);
					context.lineTo(x + 7, y - 12);
					context.closePath();
					context.fill();
				});
				context.restore();
			}
		};
		const quartileAxisLabelsPlugin = {
			id: 'quartileAxisLabels',
			afterDraw(chart) {
				const scale = chart.scales.x;
				const labelItems = scale.getLabelItems();
				const labelItem = labelItems[0];
				if (!labelItem) return;
				const context = chart.ctx;
				context.save();
				context.font = labelItem.font.string;
				context.textBaseline = 'middle';
				const labelY = labelItem.options.translation[1];
				Array.from(quartilesByDamage.entries()).forEach(([damage, labelsAtDamage]) => {
					const isFirst = damage === Math.min(...quartilesByDamage.keys());
					const isLast = damage === Math.max(...quartilesByDamage.keys());
					context.fillStyle = quartileColors[labelsAtDamage[0]] || '#666';
					context.textAlign = isFirst ? 'left' : isLast ? 'right' : 'center';
					context.fillText(labelsAtDamage.join(' / '), scale.getPixelForValue(damage), labelY);
				});
				context.restore();
			}
		};

		logPerformance('graph-data-prepare', runId, performance.now() - prepareStartedAt, {
			pointCount: distribution.length,
			highlightedValues: quartilesByDamage.size,
			infinitesimalQuartiles: infinitesimalMarkers.map(marker => marker.label)
		});

		if (damageChart) damageChart.destroy();
		const renderStartedAt = performance.now();
		try {
			damageChart = new Chart(chartCanvas, {
				type: 'line',
				data: {
					datasets: [{
						label: '機率',
						data: plottedPoints,
						backgroundColor: 'rgba(49, 103, 176, 0.08)',
						borderColor: '#3167b0',
						borderWidth: 2,
						pointRadius(context) {
							const labelsAtDamage = quartilesByDamage.get(context.parsed.x) || [];
							return labelsAtDamage.length ? 4 : 0;
						},
						pointBackgroundColor(context) {
							const labelsAtDamage = quartilesByDamage.get(context.parsed.x) || [];
							return quartileColors[labelsAtDamage[0]] || '#3167b0';
						},
						pointBorderColor: '#fff',
						pointBorderWidth: 1.5,
						pointHoverRadius(context) {
							const labelsAtDamage = quartilesByDamage.get(context.parsed.x) || [];
							return labelsAtDamage.length ? 5 : 0;
						},
						pointHitRadius: 6,
						tension: 0,
						fill: false
					}]
				},
				plugins: [compactDistributionChartPlugin, infinitesimalMarkerPlugin, quartileAxisLabelsPlugin],
				options: {
					responsive: true,
					maintainAspectRatio: false,
					animation: false,
					plugins: {
						legend: { display: false },
						tooltip: {
							callbacks: {
								title: items => {
									const damage = items[0].parsed.x;
									const labelsAtDamage = quartilesByDamage.get(damage) || [];
									return `總傷害 ${damage}${labelsAtDamage.length ? ` · ${labelsAtDamage.join(' / ')}` : ''}`;
								},
								label: item => `機率 ${item.parsed.y.toFixed(3)}%`
							}
						}
					},
					scales: {
						x: {
							type: 'linear',
							min: 0,
							max: Math.max(1, distribution.length - 1),
							offset: false,
							title: { display: true, text: '總傷害（點）' },
							afterBuildTicks(axis) {
								axis.ticks = Array.from(quartilesByDamage.keys())
									.sort((left, right) => left - right)
									.map(value => ({ value }));
							},
							ticks: {
								autoSkip: false,
								align: 'start',
								maxRotation: 0,
								color(context) {
									const value = Number(context && context.tick ? context.tick.value : NaN);
									const labelsAtDamage = quartilesByDamage.get(value) || [];
									return quartileColors[labelsAtDamage[0]] || '#666';
								},
								callback(value) {
									return '';
								}
							}
						},
						y: {
							beginAtZero: true,
							title: { display: true, text: '機率（%）' },
							ticks: { callback: value => `${value}%` }
						}
					}
				}
			});
			logPerformance('graph-render', runId, performance.now() - renderStartedAt, {
				pointCount: distribution.length
			});
		} catch (error) {
			logPerformance('graph-render-failed', runId, performance.now() - renderStartedAt, {
				pointCount: distribution.length,
				error: error instanceof Error ? error.message : '未知錯誤'
			});
			chartError.textContent = error instanceof Error
				? `圖表未能繪製：${error.message}`
				: '圖表未能繪製：發生未預期錯誤。';
			chartError.hidden = false;
		}
	}

	function renderOutcomeChart(summary, runId) {
		if (typeof Chart !== 'function') {
			outcomeChartError.textContent = '圖表程式未能載入；計算結果仍可查看。請檢查網絡連線或 CDN 設定。';
			outcomeChartError.hidden = false;
			logPerformance('outcome-chart-render-unavailable', runId, 0, {
				reason: 'Chart.js 未載入'
			});
			return;
		}

		const prepareStartedAt = performance.now();
		const outcomes = [
			{ label: '失手', probability: summary.details.pMiss, color: '#d34b45', textColor: '#fff' },
			{ label: '普通命中', probability: summary.details.pHit, color: '#168a75', textColor: '#fff' },
			{ label: '爆擊', probability: summary.details.pCrit, color: '#e6a700', textColor: '#202633' }
		];
		logPerformance('outcome-chart-data-prepare', runId, performance.now() - prepareStartedAt, {
			outcomeCount: outcomes.length
		});

		if (outcomeChart) outcomeChart.destroy();
		const renderStartedAt = performance.now();
		try {
			const outcomePercentagePlugin = {
				id: 'outcomePercentages',
				afterDatasetsDraw(chart) {
					const context = chart.ctx;
					context.save();
					context.textAlign = 'center';
					context.textBaseline = 'middle';
					outcomes.forEach((outcome, index) => {
						if (outcome.probability <= 0) return;
						const bar = chart.getDatasetMeta(index).data[0];
						if (!bar) return;
						const percentage = outcome.probability * 100;
						const label = `${Number.isInteger(percentage) ? percentage : percentage.toFixed(1)}%`;
						const width = Math.abs(bar.x - bar.base);
						context.font = '600 11px "Helvetica Neue", Helvetica, Arial, sans-serif';
						const fontSize = Math.min(11, 11 * Math.max(0, width - 2) / context.measureText(label).width);
						if (width === 0 || fontSize < 7) return;
						context.font = `600 ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
						context.fillStyle = outcome.textColor;
						context.fillText(label, (bar.x + bar.base) / 2, bar.y);
					});
					context.restore();
				}
			};
			outcomeChart = new Chart(outcomeChartCanvas, {
				type: 'bar',
				data: {
					labels: [''],
					datasets: outcomes.map(outcome => ({
						label: outcome.label,
						data: [outcome.probability * 100],
						backgroundColor: outcome.color,
						stack: 'outcome',
						barThickness: 36,
						borderWidth: 0
					}))
				},
				plugins: [outcomePercentagePlugin],
				options: {
					indexAxis: 'y',
					responsive: true,
					maintainAspectRatio: false,
					animation: false,
					plugins: {
						legend: { display: false },
						tooltip: { enabled: false }
					},
					scales: {
						x: {
							min: 0,
							max: 100,
							stacked: true,
							display: false,
							grid: { display: false, drawBorder: false },
							border: { display: false }
						},
						y: {
							stacked: true,
							display: false,
							grid: { display: false, drawBorder: false },
							border: { display: false }
						}
					}
				}
			});
			outcomeChartError.hidden = true;
			logPerformance('outcome-chart-render', runId, performance.now() - renderStartedAt, {
				outcomeCount: outcomes.length
			});
		} catch (error) {
			logPerformance('outcome-chart-render-failed', runId, performance.now() - renderStartedAt, {
				outcomeCount: outcomes.length,
				error: error instanceof Error ? error.message : '未知錯誤'
			});
			outcomeChartError.textContent = error instanceof Error
				? `圖表未能繪製：${error.message}`
				: '圖表未能繪製：發生未預期錯誤。';
			outcomeChartError.hidden = false;
		}
	}

	function showResults(summary, runId) {
		const populateStartedAt = performance.now();
		let totalMass = 0;
		let weightedDamage = 0;
		for (let damage = 0; damage < summary.distribution.length; damage++) {
			const probability = summary.distribution[damage];
			totalMass += probability;
			weightedDamage += damage * probability;
		}
		const estimatedMean = totalMass > 0 ? weightedDamage / totalMass : 0;

		document.getElementById('mean-damage').textContent = `${estimatedMean.toFixed(2)} 點`;
		document.getElementById('q1').textContent = `${summary.q1} 點`;
		document.getElementById('q2').textContent = `${summary.q2} 點`;
		document.getElementById('q3').textContent = `${summary.q3} 點`;
		document.getElementById('max-damage').textContent = `${summary.details.totalMaxPossibleDmg} 點`;
		document.getElementById('result-summary').textContent =
			`${fieldValue('analysis-round-count')}DPR · ${summary.details.attackEntryCount} 個攻擊項目 · ${summary.details.targetAC} AC`;

		const warningMass = Math.max(summary.discardedMass || 0, 1 - totalMass);
		discardedWarning.hidden = warningMass <= 0;
		if (warningMass > 0) {
			discardedWarning.textContent =
				`計算分佈略去約 ${(warningMass * 100).toExponential(2)}% 嘅極低機率質量；平均傷害及圖表以保留嘅機率分佈估算。`;
		}

		placeholder.hidden = true;
		results.hidden = false;
		logPerformance('dom-populate', runId, performance.now() - populateStartedAt, {
			pointCount: summary.distribution.length
		});
		renderDistributionChart(summary, runId);
		renderOutcomeChart(summary, runId);
	}

	editorAdvancedMode.addEventListener('change', toggleAdvancedFields);
	attackBonusInput.addEventListener('input', function () {
		attackBonusTerm.dataset.sign = Number(attackBonusInput.value) < 0 ? '−' : '+';
	});
	damageBonusInput.addEventListener('input', function () {
		damageBonusTerm.dataset.sign = Number(damageBonusInput.value) < 0 ? '−' : '+';
	});
	document.querySelector('.hit-die-buttons').addEventListener('click', function (event) {
		const button = event.target.closest('button[data-sign][data-sides]');
		if (!button) return;
		const isNegative = button.dataset.sign === 'negative';
		const sides = Number(button.dataset.sides);
		if (editorHitModifierDice.reduce((sum, die) => sum + die.count, 0) >= 599) return;
		const existingDie = editorHitModifierDice.find(die => die.sides === sides && die.isNegative === isNegative);
		if (existingDie) {
			existingDie.count++;
		} else {
			editorHitModifierDice.push({ sides, isNegative, count: 1 });
		}
		renderEditorHitDice();
	});
	document.querySelector('.damage-die-buttons').addEventListener('click', function (event) {
		const button = event.target.closest('button[data-sign][data-sides]');
		if (!button) return;
		const isNegative = button.dataset.sign === 'negative';
		const sides = Number(button.dataset.sides);
		if (editorDamageDice.reduce((sum, die) => sum + die.count, 0) >= 300) return;
		const existingDie = editorDamageDice.find(die => die.sides === sides && die.isNegative === isNegative);
		if (existingDie) {
			existingDie.count++;
		} else {
			editorDamageDice.push({ sides, isNegative, count: 1 });
		}
		renderEditorDamageDice();
	});

	document.getElementById('add-attack').addEventListener('click', () => openAttackEditor(-1));
	attackList.addEventListener('click', function (event) {
		const row = event.target.closest('button[data-index]');
		if (row) openAttackEditor(Number(row.dataset.index));
	});
	document.getElementById('delete-attack').addEventListener('click', function () {
		if (editingIndex < 0) return;
		attacks.splice(editingIndex, 1);
		renderAttackList();
		attackModal.hide();
	});
	document.getElementById('entry-name').addEventListener('input', function (event) {
		event.target.setCustomValidity('');
	});
	attackEditor.addEventListener('submit', function (event) {
		event.preventDefault();
		const name = fieldValue('entry-name').trim();
		document.getElementById('entry-name').setCustomValidity(
			name ? '' : '請輸入名稱。'
		);
		if (!attackEditor.reportValidity()) return;

		const entry = {
			id: editingIndex >= 0 ? attacks[editingIndex].id : String(nextAttackId++),
			name,
			advancedMode: editorAdvancedMode.checked,
			extraCritDamageDie: document.getElementById('entry-extra-crit-die').checked,
			attackBonus: Number(fieldValue('entry-attack-bonus')),
			attackMode: fieldValue('entry-attack-mode'),
			hitModifierDice: editorHitModifierDice.map(die => ({ ...die })),
			damageDice: editorDamageDice.map(die => ({ ...die })),
			damageBonus: Number(fieldValue('entry-damage-bonus')),
			attacksPerRound: Number(fieldValue('entry-attacks-per-round')),
			roundNumber: fieldValue('entry-round-number'),
			prFormula: fieldValue('entry-pr-formula').trim(),
			advancedAttack: fieldValue('entry-advanced-attack').trim(),
			advancedDamage: fieldValue('entry-advanced-damage').trim()
		};
		if (editingIndex >= 0) attacks[editingIndex] = entry;
		else attacks.push(entry);
		renderAttackList();
		inputError.hidden = true;
		attackModal.hide();
	});

	form.addEventListener('submit', function (event) {
		event.preventDefault();
		inputError.hidden = true;
		if (!form.reportValidity()) return;

		const runId = ++calculationRunId;
		const calculationStartedAt = performance.now();
		let summary;
		try {
			const totalRounds = Number(fieldValue('analysis-round-count'));
			const entries = attacks.map(entry => {
				if (entry.roundNumber && Number(entry.roundNumber) > totalRounds) {
					throw new Error(`攻擊「${entry.name}」指定第 ${entry.roundNumber} 輪，但目前只計算 ${totalRounds} 輪。`);
				}
				return {
					name: entry.name,
					critMultiplierBonus: entry.extraCritDamageDie ? 1 : 0,
					...getEntryCalculation(entry, totalRounds)
				};
			});
			summary = calculateAttackEntries(
				'骰子分析',
				entries,
				Number(fieldValue('target-ac')),
				{
					threshold: Number(fieldValue('crit-threshold')),
					multiplier: Number(fieldValue('crit-multiplier'))
				}
			);
			logPerformance('calculation', runId, performance.now() - calculationStartedAt, {
				attackEntryCount: entries.length,
				roundCount: totalRounds,
				pointCount: summary.distribution.length
			});
		} catch (error) {
			logPerformance('calculation-failed', runId, performance.now() - calculationStartedAt, {
				error: error instanceof Error ? error.message : '未知錯誤'
			});
			inputError.textContent = error instanceof Error
				? `無法計算：${error.message}`
				: '無法計算：發生未預期錯誤。';
			inputError.hidden = false;
			return;
		}
		showResults(summary, runId);
	});

	renderAttackList();
	renderEditorHitDice();
})();
