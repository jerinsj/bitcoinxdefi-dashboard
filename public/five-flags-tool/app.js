/* ============================================================
   Five Flags — Country Screener
   Single-page vanilla JS app.
   ============================================================ */

// ------------ CONFIG ------------
const PASSCODE = 'fiveflags'; // Change this to your preferred passcode.
const STATE = {
  weights: { ...window.DEFAULT_WEIGHTS },
  mins: Object.fromEntries(window.DIMENSIONS.map(d => [d.key, 0])),
  regions: new Set(),
  tags: new Set(),
  search: '',
  sortKey: 'overall',
  sortDir: 'desc',
  view: 'screener',
  layout: 'table',
  compare: new Set(),
  detail: null,
};

// ------------ UTIL ------------
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const fmt = n => (Math.round(n * 10) / 10).toFixed(1);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
// Convert markdown links [text](url) to anchor tags; escape other text.
function renderMarkdownLinks(s) {
  if (!s) return '';
  // Escape HTML first
  const esc = String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  // Then replace markdown links
  return esc.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (m, txt, url) =>
    `<a href="${url}" target="_blank" rel="noopener noreferrer">${txt}</a>`
  );
}

function flagEmoji(code) {
  // Custom multi-letter codes (crown deps etc.) — fall back to globe
  const special = { GG: '🇬🇬', JE: '🇯🇪', IM: '🇮🇲', VG: '🇻🇬', KY: '🇰🇾', BM: '🇧🇲', PR: '🇵🇷', GI: '🇬🇮' };
  if (special[code]) return special[code];
  if (!code || code.length !== 2) return '🌐';
  const base = 127397;
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => c.charCodeAt(0) + base));
}

function overallScore(c, weights) {
  const totalW = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
  let s = 0;
  for (const d of DIMENSIONS) s += c[d.key] * (weights[d.key] || 0);
  return s / totalW;
}

function scoreClass(v) {
  if (v >= 8) return 's-high';
  if (v >= 5) return 's-mid';
  return 's-low';
}

function cryptoStatusLabel(status) {
  switch (status) {
    case 'legal-tender':          return 'Legal tender';
    case 'regulated':             return 'Regulated';
    case 'unregulated-permitted': return 'Unregulated';
    case 'restricted':            return 'Restricted';
    case 'banned':                return 'Banned';
    default:                      return status || '—';
  }
}

function stablecoinStatusLabel(status) {
  switch (status) {
    case 'regulated-emt': return 'Regulated EMT';
    case 'permitted':     return 'Permitted';
    case 'tolerated':     return 'Tolerated';
    case 'restricted':    return 'Restricted';
    case 'banned':        return 'Banned';
    default:              return status || '—';
  }
}

function carfStatusLabel(status) {
  switch (status) {
    case 'live':              return 'Live';
    case 'committed-2027':    return 'Committed · 2027';
    case 'committed-2028':    return 'Committed · 2028';
    case 'committed-later':   return 'Committed · later';
    case 'not-committed':     return 'Not committed';
    default:                  return status || '—';
  }
}

function cryptoPofLabel(status) {
  switch (status) {
    case 'accepted':           return 'Accepted';
    case 'accepted-converted': return 'Accepted (converted)';
    case 'case-by-case':       return 'Case-by-case';
    case 'rejected':           return 'Rejected';
    case 'n-a':                return 'N/A';
    default:                   return status || '—';
  }
}

function onrampStars(n) {
  const v = Math.max(0, Math.min(5, +n || 0));
  return '★'.repeat(v) + '☆'.repeat(5 - v);
}

function dualStatusLabel(status) {
  switch (status) {
    case 'allowed':       return 'Allowed';
    case 'restricted':    return 'Restricted';
    case 'not-allowed':   return 'Not allowed';
    case 'case-by-case':  return 'Case-by-case';
    default:              return status || '—';
  }
}

function formatTimeToCitizenship(v) {
  if (v === null || v === undefined || v === '') return '—';
  if (typeof v === 'number') return `~${v} years (naturalization)`;
  return v; // already a descriptive string
}

// Classify tax burden severity for color-coded cells.
// 'tax-none' (green) = no tax; 'tax-some' (default) = mild; 'tax-heavy' (warm) = significant burden.
function taxSeverity(value) {
  if (!value) return 'tax-none';
  const v = value.toLowerCase();
  if (v.startsWith('none') || v === 'n/a' || v.includes('no tax') || v.includes('abolished') || v.includes('no estate') || v.includes('no formal') || v.startsWith('limited')) {
    return 'tax-none';
  }
  if (v.startsWith('yes') || v.includes('mark-to-market') || v.includes('deemed') || v.includes('wegzug')) return 'tax-heavy';
  // Look for high percentage rates (40%+)
  const m = v.match(/(\d{2,3})\s*%/);
  if (m && parseInt(m[1], 10) >= 30) return 'tax-heavy';
  return 'tax-some';
}

// ------------ LOGIN GATE ------------
function setupLogin() {
  const form = $('#login-form');
  const input = $('#passcode');
  const err = $('#login-error');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (input.value.trim().toLowerCase() === PASSCODE.toLowerCase()) {
      $('#login-gate').hidden = true;
      $('#app').hidden = false;
      bootApp();
    } else {
      err.hidden = false;
      input.value = '';
      input.focus();
    }
  });
  $('#logout-btn').addEventListener('click', () => {
    $('#app').hidden = true;
    $('#login-gate').hidden = false;
    err.hidden = true;
    input.value = '';
    input.focus();
  });
}

// ------------ THEME TOGGLE ------------
function setupTheme() {
  const btn = $('[data-theme-toggle]');
  const root = document.documentElement;
  let d = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', d);
  btn.addEventListener('click', () => {
    d = d === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', d);
    btn.setAttribute('aria-label', 'Switch to ' + (d === 'dark' ? 'light' : 'dark') + ' mode');
    btn.innerHTML = d === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    // Re-render charts when theme changes
    if (STATE.view === 'chart') renderCharts();
  });
}

// ------------ FILTERS ------------
function renderRegionChips() {
  const regions = [...new Set(COUNTRIES.map(c => c.region))].sort();
  const el = $('#region-chips');
  el.innerHTML = regions.map(r => `<button class="chip" data-region="${r}">${r}</button>`).join('');
  el.addEventListener('click', e => {
    const b = e.target.closest('.chip');
    if (!b) return;
    const r = b.dataset.region;
    STATE.regions.has(r) ? STATE.regions.delete(r) : STATE.regions.add(r);
    b.classList.toggle('active');
    renderResults();
  });
}

function renderTagChips() {
  // Curated subset of tags — too many dilutes usefulness.
  // Several chips are virtual — backed by structured fields, not the tags array.
  // Virtual: cbi-available, rbi-available, crypto-zero-cgt, crypto-legal-tender, crypto-banned, crypto-regulated
  const curated = [
    'cbi-available','rbi-available','dual-citizenship-allowed',
    'no-exit-tax','no-wealth-tax','no-inheritance-tax',
    'crypto-zero-cgt','crypto-legal-tender','crypto-regulated','crypto-banned',
    'stablecoin-regulated','onramp-excellent','crypto-pof-accepted',
    'holding-period-relief','staking-clear','exit-tax-no-crypto',
    'carf-2026','carf-2027','carf-not-committed',
    'zero-tax','territorial','non-dom','flat-tax','lump-sum','tax-cap',
    'nomad-visa','english','schengen','banking-hub'
  ];
  const el = $('#tag-chips');
  el.innerHTML = curated.map(t => `<button class="chip" data-tag="${t}">${t}</button>`).join('');
  el.addEventListener('click', e => {
    const b = e.target.closest('.chip');
    if (!b) return;
    const t = b.dataset.tag;
    STATE.tags.has(t) ? STATE.tags.delete(t) : STATE.tags.add(t);
    b.classList.toggle('active');
    renderResults();
  });
}

function renderMinSliders() {
  const el = $('#min-sliders');
  el.innerHTML = DIMENSIONS.map(d => `
    <div class="slider-row">
      <label for="min-${d.key}">${d.short} ≥ <span class="val" id="min-${d.key}-val">0</span></label>
      <input id="min-${d.key}" type="range" min="0" max="10" step="1" value="0" data-min="${d.key}" />
    </div>
  `).join('');
  el.addEventListener('input', e => {
    const k = e.target.dataset.min;
    if (!k) return;
    STATE.mins[k] = +e.target.value;
    $(`#min-${k}-val`).textContent = e.target.value;
    renderResults();
  });
}

function renderWeightSliders() {
  const el = $('#weight-sliders');
  el.innerHTML = DIMENSIONS.map(d => `
    <div class="slider-row">
      <label for="w-${d.key}">${d.label} <span class="val" id="w-${d.key}-val">${STATE.weights[d.key]}</span></label>
      <input id="w-${d.key}" type="range" min="0" max="30" step="1" value="${STATE.weights[d.key]}" data-weight="${d.key}" />
    </div>
  `).join('');
  el.addEventListener('input', e => {
    const k = e.target.dataset.weight;
    if (!k) return;
    STATE.weights[k] = +e.target.value;
    $(`#w-${k}-val`).textContent = e.target.value;
    updateWeightSum();
    renderResults();
  });
  updateWeightSum();
}
function updateWeightSum() {
  const sum = Object.values(STATE.weights).reduce((a,b) => a+b, 0);
  $('#weight-sum-val').textContent = sum;
  $('#weight-sum-val').style.color = sum === 0 ? 'var(--color-error)' : '';
}

function resetFilters() {
  STATE.regions.clear(); STATE.tags.clear(); STATE.search = '';
  for (const d of DIMENSIONS) STATE.mins[d.key] = 0;
  $('#search').value = '';
  $$('#region-chips .chip').forEach(c => c.classList.remove('active'));
  $$('#tag-chips .chip').forEach(c => c.classList.remove('active'));
  $$('#min-sliders input').forEach(i => { i.value = 0; $(`#${i.id}-val`).textContent = '0'; });
  renderResults();
}
function resetWeights() {
  for (const k in STATE.weights) STATE.weights[k] = Math.round(100 / DIMENSIONS.length);
  DIMENSIONS.forEach(d => {
    $(`#w-${d.key}`).value = STATE.weights[d.key];
    $(`#w-${d.key}-val`).textContent = STATE.weights[d.key];
  });
  updateWeightSum();
  renderResults();
}

// ------------ FILTER + SORT PIPELINE ------------
function getFilteredSorted() {
  const q = STATE.search.trim().toLowerCase();
  let rows = COUNTRIES.filter(c => {
    if (STATE.regions.size && !STATE.regions.has(c.region)) return false;
    if (STATE.tags.size) {
      // Virtual chips backed by structured fields, plus tags array
      let matches = false;
      const cgt = (c.crypto_cgt || '').toLowerCase();
      const isZeroCgt = cgt.startsWith('0%') || cgt.includes('exempt') || cgt.includes('no cgt');
      for (const t of STATE.tags) {
        if (t === 'cbi-available') { if (c.cbi) { matches = true; break; } }
        else if (t === 'rbi-available') { if (c.rbi) { matches = true; break; } }
        else if (t === 'dual-citizenship-allowed') { if (c.dual_citizenship === 'allowed') { matches = true; break; } }
        else if (t === 'no-exit-tax') { if (taxSeverity(c.exit_tax) === 'tax-none') { matches = true; break; } }
        else if (t === 'no-wealth-tax') { if (taxSeverity(c.wealth_tax) === 'tax-none') { matches = true; break; } }
        else if (t === 'no-inheritance-tax') { if (taxSeverity(c.inheritance_tax) === 'tax-none') { matches = true; break; } }
        else if (t === 'crypto-zero-cgt') { if (isZeroCgt) { matches = true; break; } }
        else if (t === 'crypto-legal-tender') { if (c.crypto_legal_status === 'legal-tender') { matches = true; break; } }
        else if (t === 'crypto-regulated') { if (c.crypto_legal_status === 'regulated' || c.crypto_legal_status === 'legal-tender') { matches = true; break; } }
        else if (t === 'crypto-banned') { if (c.crypto_legal_status === 'banned') { matches = true; break; } }
        else if (t === 'stablecoin-regulated') { if (c.stablecoin_status === 'regulated-emt') { matches = true; break; } }
        else if (t === 'onramp-excellent') { if ((c.onramp_quality || 0) >= 5) { matches = true; break; } }
        else if (t === 'crypto-pof-accepted') { if (c.crypto_pof_status === 'accepted' || c.crypto_pof_status === 'accepted-converted') { matches = true; break; } }
        else if (t === 'holding-period-relief') { const h = (c.crypto_holding_period_relief || '').toLowerCase(); if (h && !h.startsWith('none') && !h.startsWith('no specific') && !h.startsWith('no holding') && !h.startsWith('no relief')) { matches = true; break; } }
        else if (t === 'staking-clear') { const s = (c.staking_tax || '').toLowerCase(); if (s && !s.startsWith('no specific') && !s.includes('likely') && !s.includes('unclear')) { matches = true; break; } }
        else if (t === 'exit-tax-no-crypto') { const e = (c.exit_tax_crypto_scope || '').toLowerCase(); if (e.startsWith('no') || e.startsWith('n/a')) { matches = true; break; } }
        else if (t === 'carf-2026') { if (c.carf_first_reporting === '2026') { matches = true; break; } }
        else if (t === 'carf-2027') { if (c.carf_first_reporting === '2027') { matches = true; break; } }
        else if (t === 'carf-not-committed') { if (c.carf_status === 'not-committed') { matches = true; break; } }
        else if (c.tags.includes(t)) { matches = true; break; }
      }
      if (!matches) return false;
    }
    for (const d of DIMENSIONS) {
      if (c[d.key] < STATE.mins[d.key]) return false;
    }
    if (q) {
      const hay = (c.name + ' ' + c.code + ' ' + c.tax_model + ' ' + c.tags.join(' ') + ' ' + (c.cbi || '') + ' ' + (c.rbi || '') + ' ' + (c.crypto_cgt || '') + ' ' + (c.crypto_regulation || '') + ' ' + (c.crypto_legal_status || '') + ' ' + (c.crypto_notes || '') + ' ' + (c.dual_citizenship || '') + ' ' + (c.dual_citizenship_notes || '') + ' ' + (c.exit_tax || '') + ' ' + (c.wealth_tax || '') + ' ' + (c.inheritance_tax || '') + ' ' + (c.crypto_banks || '') + ' ' + (c.residency_triggers || '') + ' ' + (c.time_to_citizenship || '') + ' ' + (c.stablecoin_ramps || '') + ' ' + (c.stablecoin_status || '') + ' ' + (c.carf_first_reporting || '') + ' ' + (c.carf_first_exchange || '') + ' ' + (c.carf_status || '') + ' ' + (c.crypto_as_pof || '') + ' ' + (c.crypto_pof_status || '') + ' ' + (c.crypto_holding_period_relief || '') + ' ' + (c.staking_tax || '') + ' ' + (c.mining_tax || '') + ' ' + (c.exit_tax_crypto_scope || '')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  rows = rows.map(c => ({ ...c, overall: overallScore(c, STATE.weights) }));
  const k = STATE.sortKey;
  const dir = STATE.sortDir === 'asc' ? 1 : -1;
  rows.sort((a,b) => {
    const av = a[k], bv = b[k];
    if (typeof av === 'string') return av.localeCompare(bv) * dir;
    return (av - bv) * dir;
  });
  return rows;
}

// ------------ TABLE / GRID ------------
const TABLE_COLS = [
  { key: 'name', label: 'Country', sortable: true, className: '' },
  { key: 'region', label: 'Region', sortable: true, className: '' },
  { key: 'overall', label: 'Overall', sortable: true, className: 'num' },
  ...DIMENSIONS.map(d => ({ key: d.key, label: d.short, sortable: true, className: 'center', dim: true })),
  { key: 'visa_free_count', label: 'Visa-Free', sortable: true, className: 'num' },
];

function renderTableHead() {
  const head = $('#datatable thead');
  head.innerHTML = '<tr>' + TABLE_COLS.map(c => {
    const arrow = STATE.sortKey === c.key ? (STATE.sortDir === 'asc' ? 'sort-asc' : 'sort-desc') : '';
    return `<th class="${c.className} ${arrow}" data-key="${c.key}" title="Click to sort">${c.label}</th>`;
  }).join('') + '</tr>';
  head.addEventListener('click', e => {
    const th = e.target.closest('th');
    if (!th) return;
    const key = th.dataset.key;
    if (STATE.sortKey === key) STATE.sortDir = STATE.sortDir === 'asc' ? 'desc' : 'asc';
    else { STATE.sortKey = key; STATE.sortDir = (key === 'name' || key === 'region') ? 'asc' : 'desc'; }
    renderResults();
  }, { once: true });
}

function renderTable(rows) {
  renderTableHead();
  const body = $('#datatable tbody');
  body.innerHTML = rows.map(c => `
    <tr data-code="${c.code}">
      <td>
        <div class="c-name">
          <span style="font-size:1.1em">${flagEmoji(c.code)}</span>
          <span>${c.name}</span>
          <span class="c-code">${c.code}</span>
        </div>
      </td>
      <td class="c-region">${c.region}</td>
      <td class="num"><span class="overall-pill">${fmt(c.overall)}</span></td>
      ${DIMENSIONS.map(d => {
        const v = c[d.key];
        return `<td class="center">
          <span class="score-cell">
            <span class="score-bar"><span class="score-bar__fill ${scoreClass(v)}" style="width:${v*10}%"></span></span>
            ${v}
          </span>
        </td>`;
      }).join('')}
      <td class="num">${c.visa_free_count}</td>
    </tr>
  `).join('');
  // Row click → detail
  body.onclick = e => {
    const tr = e.target.closest('tr[data-code]');
    if (!tr) return;
    STATE.detail = tr.dataset.code;
    switchView('detail');
  };
}

function renderGrid(rows) {
  const el = $('#grid-wrap');
  el.innerHTML = rows.map(c => `
    <div class="country-card" data-code="${c.code}">
      <div class="country-card__head">
        <div>
          <div class="country-card__name">${flagEmoji(c.code)} ${c.name}</div>
          <div class="country-card__meta">${c.region} · ${c.tax_model}</div>
        </div>
        <span class="overall-pill">${fmt(c.overall)}</span>
      </div>
      <div class="country-card__mini">
        ${DIMENSIONS.slice(0, 8).map(d => `
          <div class="mini-stat" title="${d.label}">
            <span>${d.short}</span>
            <strong>${c[d.key]}</strong>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
  el.onclick = e => {
    const card = e.target.closest('.country-card');
    if (!card) return;
    STATE.detail = card.dataset.code;
    switchView('detail');
  };
}

function renderResults() {
  const rows = getFilteredSorted();
  $('#result-count').textContent = rows.length;
  if (STATE.layout === 'table') {
    $('#table-wrap').hidden = false;
    $('#grid-wrap').hidden = true;
    renderTable(rows);
  } else {
    $('#table-wrap').hidden = true;
    $('#grid-wrap').hidden = false;
    renderGrid(rows);
  }
  // Also refresh charts/detail if they're active
  if (STATE.view === 'chart') renderCharts();
  if (STATE.view === 'detail') renderDetail();
}

// ------------ VIEW SWITCH ------------
function switchView(v) {
  STATE.view = v;
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === v));
  ['screener','chart','detail','about'].forEach(k => {
    $('#view-' + k).hidden = k !== v;
  });
  if (v === 'chart') renderCharts();
  if (v === 'detail') renderDetail();
}

// ------------ CHARTS ------------
let barChart, radarChart, regionChart, detailRadarChart;

function themeColors() {
  const cs = getComputedStyle(document.documentElement);
  const v = n => cs.getPropertyValue(n).trim();
  return {
    primary: v('--color-primary'),
    accent: v('--color-accent'),
    text: v('--color-text'),
    muted: v('--color-text-muted'),
    grid: v('--color-divider'),
    dv: [1,2,3,4,5,6,7,8].map(i => v('--dv-' + i)),
  };
}

function renderBarChart(rows) {
  // Always rank by overall score for this chart, regardless of table sort
  const top = [...rows].sort((a, b) => b.overall - a.overall).slice(0, 15);
  const c = themeColors();
  const ctx = $('#bar-chart').getContext('2d');
  if (barChart) barChart.destroy();
  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top.map(r => r.name),
      datasets: [{
        data: top.map(r => +fmt(r.overall)),
        backgroundColor: c.primary,
        borderRadius: 4,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { min: 0, max: 10, grid: { color: c.grid }, ticks: { color: c.muted } },
        y: { grid: { display: false }, ticks: { color: c.text, font: { size: 11 } } },
      },
    },
  });
}

function renderRadarChart() {
  const c = themeColors();
  const ctx = $('#radar-chart').getContext('2d');
  if (radarChart) radarChart.destroy();
  const codes = [...STATE.compare];
  const datasets = codes.map((code, i) => {
    const country = COUNTRIES.find(x => x.code === code);
    if (!country) return null;
    const color = c.dv[i % c.dv.length];
    return {
      label: country.name,
      data: DIMENSIONS.map(d => country[d.key]),
      borderColor: color,
      backgroundColor: color + '33',
      pointBackgroundColor: color,
      borderWidth: 2,
    };
  }).filter(Boolean);
  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: DIMENSIONS.map(d => d.short),
      datasets: datasets.length ? datasets : [{ data: DIMENSIONS.map(() => 0), borderColor: c.muted }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { color: c.text, font: { size: 11 } } } },
      scales: {
        r: {
          min: 0, max: 10,
          grid: { color: c.grid },
          angleLines: { color: c.grid },
          pointLabels: { color: c.text, font: { size: 11 } },
          ticks: { display: false, stepSize: 2 },
        },
      },
    },
  });
}

function renderRegionChart(rows) {
  const c = themeColors();
  const byRegion = {};
  rows.forEach(r => {
    byRegion[r.region] = byRegion[r.region] || [];
    byRegion[r.region].push(r.overall);
  });
  const regions = Object.keys(byRegion).sort();
  const avgs = regions.map(r => byRegion[r].reduce((a,b) => a+b, 0) / byRegion[r].length);
  const ctx = $('#region-chart').getContext('2d');
  if (regionChart) regionChart.destroy();
  regionChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: regions,
      datasets: [{
        data: avgs.map(v => +fmt(v)),
        backgroundColor: regions.map((_, i) => c.dv[i % c.dv.length]),
        borderRadius: 4,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, title: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: c.text, font: { size: 11 } } },
        y: { min: 0, max: 10, grid: { color: c.grid }, ticks: { color: c.muted } },
      },
    },
  });
}

function renderComparePicker() {
  // Show top 20 countries (filtered) so user can tick up to 4 for radar
  const rows = getFilteredSorted().slice(0, 25);
  const el = $('#compare-picker');
  // Ensure current compare selections are included even if not in top 25
  const pool = new Map();
  rows.forEach(r => pool.set(r.code, r.name));
  [...STATE.compare].forEach(code => {
    if (!pool.has(code)) {
      const c = COUNTRIES.find(x => x.code === code);
      if (c) pool.set(code, c.name);
    }
  });
  el.innerHTML = [...pool.entries()].map(([code, name]) => {
    const active = STATE.compare.has(code) ? 'active' : '';
    return `<button class="chip ${active}" data-compare="${code}">${name}</button>`;
  }).join('');
  el.onclick = e => {
    const b = e.target.closest('[data-compare]');
    if (!b) return;
    const code = b.dataset.compare;
    if (STATE.compare.has(code)) {
      STATE.compare.delete(code);
    } else {
      if (STATE.compare.size >= 4) {
        // remove oldest
        STATE.compare.delete([...STATE.compare][0]);
      }
      STATE.compare.add(code);
    }
    renderComparePicker();
    renderRadarChart();
  };
}

function renderCharts() {
  const rows = getFilteredSorted();
  renderBarChart(rows);
  renderRegionChart(rows);
  // Seed compare with top 3 if empty
  if (STATE.compare.size === 0 && rows.length) {
    rows.slice(0, 3).forEach(r => STATE.compare.add(r.code));
  }
  renderComparePicker();
  renderRadarChart();
}

// ------------ DETAIL ------------
function renderDetailPicker() {
  const el = $('#detail-picker');
  const sorted = [...COUNTRIES].sort((a,b) => a.name.localeCompare(b.name));
  el.innerHTML = sorted.map(c => `<option value="${c.code}">${flagEmoji(c.code)} ${c.name}</option>`).join('');
  el.value = STATE.detail || sorted[0].code;
  STATE.detail = el.value;
  el.onchange = () => { STATE.detail = el.value; renderDetail(); };
}

function renderDetail() {
  renderDetailPicker();
  const c = COUNTRIES.find(x => x.code === STATE.detail);
  if (!c) return;
  $('#detail-picker').value = c.code;
  const overall = overallScore(c, STATE.weights);
  const minStayLabel = c.min_stay_days === 0
    ? 'No formal day-count test'
    : `${c.min_stay_days} days/year typical`;
  $('#detail-body').innerHTML = `
    <div class="detail-hero">
      <div>
        <h2>${flagEmoji(c.code)} ${c.name}</h2>
        <div class="detail-meta">
          <span><strong>${c.region}</strong></span>
          <span>${c.tax_model}</span>
          <span>Personal tax: ${c.personal_tax_max}</span>
          <span>Corp: ${c.corp_tax}</span>
          <span>Visa-free: ${c.visa_free_count}</span>
          <span>Min stay: ${minStayLabel}</span>
        </div>
        <p class="detail-notes">${c.notes}</p>
        <div class="detail-tags">
          ${c.tags.map(t => `<span class="detail-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="detail-overall">
        <div class="detail-overall__label">Overall (weighted)</div>
        <div class="detail-overall__num">${fmt(overall)}</div>
        <div class="detail-overall__label">out of 10</div>
      </div>
    </div>
    <div class="card immigration-card">
      <header class="card__h"><h3>Immigration & residency pathways</h3></header>
      <div class="immigration-grid">
        <div class="immigration-cell">
          <div class="immigration-cell__label">Citizenship-by-investment (CBI)</div>
          <div class="immigration-cell__value ${c.cbi ? 'has-value' : 'no-value'}">${c.cbi || '— Not available'}</div>
        </div>
        <div class="immigration-cell">
          <div class="immigration-cell__label">Residency-by-investment (RBI / Golden Visa)</div>
          <div class="immigration-cell__value ${c.rbi ? 'has-value' : 'no-value'}">${c.rbi || '— No formal investment program'}</div>
        </div>
        <div class="immigration-cell">
          <div class="immigration-cell__label">Tax-residency minimum stay</div>
          <div class="immigration-cell__value has-value">${minStayLabel}</div>
        </div>
      </div>
      <div class="immigration-cell immigration-cell--full">
        <div class="immigration-cell__label">Tax-residency triggers</div>
        <div class="immigration-cell__value has-value">${c.residency_triggers || '—'}</div>
      </div>
      <div class="immigration-cell immigration-cell--full">
        <div class="immigration-cell__label">Time to citizenship</div>
        <div class="immigration-cell__value has-value">${formatTimeToCitizenship(c.time_to_citizenship)}</div>
      </div>
      <div class="immigration-cell immigration-cell--full">
        <div class="immigration-cell__head">
          <div class="immigration-cell__label">Dual citizenship</div>
          <span class="dual-status dual-status--${c.dual_citizenship}">${dualStatusLabel(c.dual_citizenship)}</span>
        </div>
        <div class="immigration-cell__value has-value">${c.dual_citizenship_notes || '—'}</div>
      </div>
      <div class="immigration-disclaimer">Investment thresholds, stay requirements, and citizenship rules change frequently. Always verify with official sources or qualified advisors before relying on these figures.</div>
    </div>
    <div class="card tax-exposure-card">
      <header class="card__h"><h3>Tax exposure</h3></header>
      <div class="tax-exposure-grid">
        <div class="tax-exposure-cell ${taxSeverity(c.exit_tax)}">
          <div class="tax-exposure-cell__label">Exit tax on departure</div>
          <div class="tax-exposure-cell__value">${c.exit_tax || '—'}</div>
        </div>
        <div class="tax-exposure-cell ${taxSeverity(c.wealth_tax)}">
          <div class="tax-exposure-cell__label">Annual wealth tax</div>
          <div class="tax-exposure-cell__value">${c.wealth_tax || '—'}</div>
        </div>
        <div class="tax-exposure-cell ${taxSeverity(c.inheritance_tax)}">
          <div class="tax-exposure-cell__label">Inheritance / estate tax</div>
          <div class="tax-exposure-cell__value">${c.inheritance_tax || '—'}</div>
        </div>
      </div>
      <div class="immigration-disclaimer">Tax rules vary by personal circumstances and change with each budget. These are headline rules — always model your specific situation with a qualified tax advisor.</div>
    </div>
    <div class="card crypto-card">
      <header class="card__h">
        <h3>Crypto regime</h3>
        <span class="crypto-status crypto-status--${c.crypto_legal_status}">${cryptoStatusLabel(c.crypto_legal_status)}</span>
      </header>
      <div class="crypto-grid">
        <div class="crypto-cell">
          <div class="crypto-cell__label">Capital gains on crypto</div>
          <div class="crypto-cell__value">${c.crypto_cgt || '—'}</div>
        </div>
        <div class="crypto-cell">
          <div class="crypto-cell__label">Regulatory framework</div>
          <div class="crypto-cell__value">${c.crypto_regulation || '—'}</div>
        </div>
      </div>
      <div class="crypto-banks-row">
        <div class="crypto-cell__label">Crypto-friendly banking</div>
        <div class="crypto-cell__value">${c.crypto_banks || '—'}</div>
      </div>
      <p class="crypto-notes">${c.crypto_notes || ''}</p>
      <div class="crypto-subsection">
        <div class="crypto-subsection__head">
          <h4>Holding-period, staking &amp; mining</h4>
        </div>
        <div class="crypto-grid">
          <div class="crypto-cell">
            <div class="crypto-cell__label">Long-term holding relief</div>
            <div class="crypto-cell__value">${c.crypto_holding_period_relief || '—'}</div>
          </div>
          <div class="crypto-cell">
            <div class="crypto-cell__label">Exit tax — crypto scope</div>
            <div class="crypto-cell__value">${c.exit_tax_crypto_scope || '—'}</div>
          </div>
          <div class="crypto-cell">
            <div class="crypto-cell__label">Staking rewards</div>
            <div class="crypto-cell__value">${c.staking_tax || '—'}</div>
          </div>
          <div class="crypto-cell">
            <div class="crypto-cell__label">Mining income</div>
            <div class="crypto-cell__value">${c.mining_tax || '—'}</div>
          </div>
        </div>
        ${c.crypto_tax_sources ? `<div class="crypto-tax-sources"><span class="crypto-cell__label">Sources</span> <span class="crypto-cell__value">${renderMarkdownLinks(c.crypto_tax_sources)}</span></div>` : ''}
      </div>
      <div class="crypto-subsection">
        <div class="crypto-subsection__head">
          <h4>Stablecoins &amp; on-ramps</h4>
          <span class="stablecoin-status stablecoin-status--${c.stablecoin_status || 'tolerated'}">${stablecoinStatusLabel(c.stablecoin_status)}</span>
        </div>
        <div class="onramp-quality" title="On-ramp quality (1–5)">
          <span class="onramp-quality__label">On-ramp quality</span>
          <span class="onramp-quality__stars" aria-label="${c.onramp_quality || 0} of 5">${onrampStars(c.onramp_quality)}</span>
          <span class="onramp-quality__num">${c.onramp_quality || 0}/5</span>
        </div>
        <div class="crypto-cell__value">${c.stablecoin_ramps || '—'}</div>
      </div>
      <div class="crypto-subsection">
        <div class="crypto-subsection__head">
          <h4>CARF reporting timeline</h4>
          <span class="carf-status carf-status--${c.carf_status || 'not-committed'}">${carfStatusLabel(c.carf_status)}</span>
        </div>
        <div class="carf-grid">
          <div><span class="crypto-cell__label">First reporting year</span><div class="crypto-cell__value">${c.carf_first_reporting || '—'}</div></div>
          <div><span class="crypto-cell__label">First exchange</span><div class="crypto-cell__value">${c.carf_first_exchange || '—'}</div></div>
        </div>
      </div>
      <div class="crypto-subsection">
        <div class="crypto-subsection__head">
          <h4>Crypto as proof-of-funds</h4>
          <span class="pof-status pof-status--${c.crypto_pof_status || 'n-a'}">${cryptoPofLabel(c.crypto_pof_status)}</span>
        </div>
        <div class="crypto-cell__value">${c.crypto_as_pof || '—'}</div>
      </div>
      <div class="immigration-disclaimer">Crypto rules shift quickly. Verify current treatment with a qualified tax advisor before making decisions.</div>
    </div>
    <div class="detail-flags">
      <div class="card">
        <header class="card__h"><h3>Flag-by-flag breakdown</h3></header>
        ${DIMENSIONS.map(d => {
          const v = c[d.key];
          return `
            <div class="flag-row">
              <div>
                <div class="flag-row__label">${d.label}</div>
                <div class="flag-row__desc">${d.desc}</div>
              </div>
              <div class="flag-row__bar"><div class="flag-row__fill ${scoreClass(v)}" style="width:${v*10}%; background: var(--color-${scoreClass(v) === 's-high' ? 'success' : scoreClass(v) === 's-mid' ? 'accent' : 'warning'})"></div></div>
              <div class="flag-row__score">${v}</div>
            </div>`;
        }).join('')}
      </div>
      <div class="card">
        <header class="card__h"><h3>Radar</h3></header>
        <div class="chart-box"><canvas id="detail-radar"></canvas></div>
      </div>
    </div>
  `;
  // Detail radar
  const tc = themeColors();
  const ctx = $('#detail-radar').getContext('2d');
  if (detailRadarChart) detailRadarChart.destroy();
  detailRadarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: DIMENSIONS.map(d => d.short),
      datasets: [{
        label: c.name,
        data: DIMENSIONS.map(d => c[d.key]),
        borderColor: tc.primary,
        backgroundColor: tc.primary + '30',
        pointBackgroundColor: tc.primary,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0, max: 10,
          grid: { color: tc.grid }, angleLines: { color: tc.grid },
          pointLabels: { color: tc.text, font: { size: 10 } },
          ticks: { display: false, stepSize: 2 },
        },
      },
    },
  });
}

// ------------ ABOUT ------------
function renderAbout() {
  $('#about-dimensions').innerHTML = DIMENSIONS.map(d =>
    `<li><strong>${d.label}</strong> — ${d.desc}</li>`
  ).join('');
}

// ------------ EXPORTS ------------
function buildExportRows() {
  const rows = getFilteredSorted();
  return rows.map(c => ({
    Country: c.name,
    Code: c.code,
    Region: c.region,
    'Tax Model': c.tax_model,
    'Overall Score': +fmt(c.overall),
    ...Object.fromEntries(DIMENSIONS.map(d => [d.label, c[d.key]])),
    'Visa-Free Count': c.visa_free_count,
    'Personal Tax Max': c.personal_tax_max,
    'Corporate Tax': c.corp_tax,
    'CBI Program': c.cbi || '',
    'RBI / Golden Visa': c.rbi || '',
    'Min Stay (days/yr)': c.min_stay_days,
    'Crypto Legal Status': c.crypto_legal_status,
    'Crypto Capital Gains': c.crypto_cgt,
    'Crypto Regulation': c.crypto_regulation,
    'Crypto Notes': c.crypto_notes,
    'Stablecoin Status': c.stablecoin_status,
    'Stablecoin / On-Ramps': c.stablecoin_ramps,
    'On-Ramp Quality (1-5)': c.onramp_quality,
    'CARF First Reporting': c.carf_first_reporting,
    'CARF First Exchange': c.carf_first_exchange,
    'CARF Status': c.carf_status,
    'Crypto as Proof-of-Funds': c.crypto_as_pof,
    'Crypto PoF Status': c.crypto_pof_status,
    'Crypto Holding-Period Relief': c.crypto_holding_period_relief || '',
    'Staking Tax': c.staking_tax || '',
    'Mining Tax': c.mining_tax || '',
    'Exit Tax (Crypto Scope)': c.exit_tax_crypto_scope || '',
    'Crypto Tax Sources': c.crypto_tax_sources || '',
    'Dual Citizenship': c.dual_citizenship,
    'Dual Citizenship Notes': c.dual_citizenship_notes,
    'Exit Tax': c.exit_tax,
    'Wealth Tax': c.wealth_tax,
    'Inheritance Tax': c.inheritance_tax,
    'Crypto-Friendly Banks': c.crypto_banks,
    'Residency Triggers': c.residency_triggers,
    'Time to Citizenship': c.time_to_citizenship,
    Tags: c.tags.join(', '),
    Notes: c.notes,
  }));
}

function exportCSV() {
  const rows = buildExportRows();
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const esc = v => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => esc(r[h])).join(','))].join('\n');
  downloadBlob(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }), 'five-flags-screener.csv');
}

function exportXLSX() {
  const rows = buildExportRows();
  if (!rows.length) return;
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  // Simple column widths
  const headers = Object.keys(rows[0]);
  ws['!cols'] = headers.map(h => ({
    wch: Math.min(40, Math.max(h.length + 2, ...rows.map(r => String(r[h] ?? '').length + 2)))
  }));
  XLSX.utils.book_append_sheet(wb, ws, 'Countries');
  // Weights sheet
  const wRows = DIMENSIONS.map(d => ({ Dimension: d.label, Weight: STATE.weights[d.key] }));
  const wws = XLSX.utils.json_to_sheet(wRows);
  XLSX.utils.book_append_sheet(wb, wws, 'Weights');
  XLSX.writeFile(wb, 'five-flags-screener.xlsx');
}

function exportPDF() {
  const rows = buildExportRows();
  if (!rows.length) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  // Header
  doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
  doc.setTextColor(12, 78, 84);
  doc.text('Five Flags — Country Screener', 40, 40);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  const today = new Date().toLocaleDateString();
  doc.text(`Export date: ${today}  ·  ${rows.length} countries  ·  Weighted overall score`, 40, 58);

  // Table
  const tableHeaders = [['Country','Region','Overall', ...DIMENSIONS.map(d => d.short), 'Visa-Free']];
  const tableRows = rows.map(r => [
    r.Country,
    r.Region,
    r['Overall Score'],
    ...DIMENSIONS.map(d => r[d.label]),
    r['Visa-Free Count'],
  ]);
  doc.autoTable({
    head: tableHeaders,
    body: tableRows,
    startY: 75,
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [12, 78, 84], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [244, 241, 234] },
    margin: { left: 40, right: 40 },
  });

  // Weights footer
  const endY = doc.lastAutoTable.finalY + 20;
  if (endY < doc.internal.pageSize.getHeight() - 80) {
    doc.setFontSize(10); doc.setFont('helvetica','bold');
    doc.setTextColor(40,40,40);
    doc.text('Flag weights used:', 40, endY);
    doc.setFont('helvetica','normal');
    const wTxt = DIMENSIONS.map(d => `${d.short} ${STATE.weights[d.key]}`).join('  ·  ');
    doc.text(wTxt, 40, endY + 15);
  }

  // Footer on every page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8); doc.setTextColor(140,140,140);
    doc.text(`Five Flags Screener · Page ${i} of ${pageCount}`, pageW - 180, doc.internal.pageSize.getHeight() - 20);
  }

  doc.save('five-flags-screener.pdf');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 500);
}

// ------------ BOOT ------------
function bootApp() {
  // Sidebar
  renderRegionChips();
  renderTagChips();
  renderMinSliders();
  renderWeightSliders();

  // Search
  $('#search').addEventListener('input', e => {
    STATE.search = e.target.value; renderResults();
  });
  $('#reset-filters').addEventListener('click', resetFilters);
  $('#reset-weights').addEventListener('click', resetWeights);

  // Layout toggle
  $$('.view-btn').forEach(b => b.addEventListener('click', () => {
    STATE.layout = b.dataset.layout;
    $$('.view-btn').forEach(x => x.classList.toggle('active', x === b));
    renderResults();
  }));

  // Tabs
  $$('.tab').forEach(t => t.addEventListener('click', () => switchView(t.dataset.view)));

  // Exports
  $('#export-csv').addEventListener('click', exportCSV);
  $('#export-xlsx').addEventListener('click', exportXLSX);
  $('#export-pdf').addEventListener('click', exportPDF);

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea, select')) {
      if (e.key === 'Escape') e.target.blur();
      return;
    }
    if (e.key === '/') { e.preventDefault(); $('#search').focus(); }
    else if (['1','2','3','4'].includes(e.key)) {
      switchView(['screener','chart','detail','about'][+e.key - 1]);
    } else if (e.key === 'Escape') {
      if (STATE.search) { STATE.search = ''; $('#search').value = ''; renderResults(); }
    }
  });

  // Initial render
  renderAbout();
  renderResults();
}

// Initialize login gate (runs immediately)
document.addEventListener('DOMContentLoaded', () => {
  setupLogin();
  setupTheme();
});
