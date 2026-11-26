// Data explorer: search, compare and download every series in the site.
// Two indicators can be drawn together, indexed to 2015 = 100 so series in
// different units share one chart honestly.

import { YEARS, SERIES, seriesById, formatValue } from './data.js';
import { lineChart } from './charts.js';

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

export function explorerView(state) {
  const q = (state.explorerQuery || '').toLowerCase();
  const shown = SERIES.filter((s) => !q || s.name.toLowerCase().includes(q) || s.source.toLowerCase().includes(q));
  const a = seriesById(state.explorerA);
  const b = state.explorerB && state.explorerB !== 'none' ? seriesById(state.explorerB) : null;
  const options = SERIES.map((s) => `<option value="${s.id}" ${s.id === state.explorerA ? 'selected' : ''}>${esc(s.name)}</option>`).join('');
  const optionsB = `<option value="none" ${!b ? 'selected' : ''}>— none —</option>` + SERIES.map((s) => `<option value="${s.id}" ${b && s.id === b.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('');

  // Indexed comparison chart: each series divided by its 2015 value, x100.
  let compare = '';
  if (a) {
    const baseA = a.values[2015];
    const ptsA = YEARS.map((y) => ({ year: y, value: a.values[y] === null || baseA === null ? null : +(a.values[y] / baseA * 100).toFixed(1) }));
    let extra = '';
    if (b) {
      const baseB = b.values[2015];
      const ptsB = YEARS.map((y) => ({ year: y, value: b.values[y] === null || baseB === null ? null : +(b.values[y] / baseB * 100).toFixed(1) }));
      extra = `<div class="chart second">${lineChart({ points: ptsB, color: '#2f6fb2', label: b.name + ', indexed' })}</div>
      <p class="sub">Blue: ${esc(b.name)} (indexed, 2015 = 100). Red: ${esc(a.name)}.</p>`;
    }
    compare = `<section class="card"><h2>Compare indicators, 2015 = 100</h2>
    <p class="sub">Indexing puts different units on one scale: 100 is the 2015 value, so 90 means 10% below 2015.</p>
    <div class="compare-controls">
      <label>First indicator <select id="explorer-a">${options}</select></label>
      <label>Second indicator <select id="explorer-b">${optionsB}</select></label>
    </div>
    <div class="chart">${lineChart({ points: ptsA, color: '#c0392b', label: a.name + ', indexed' })}</div>${extra}
    <p class="source">Sources: ${esc(a.source)}${b ? '; ' + esc(b.source) : ''}</p></section>`;
  }

  const rows = shown.map((s) => {
    const latest = [...YEARS].reverse().find((y) => s.values[y] !== null && s.values[y] !== undefined);
    return `<tr><th scope="row">${esc(s.name)}</th><td>${esc(s.unit)}</td>
    <td>${latest ? formatValue(s, s.values[latest]) + ' (' + latest + ')' : '—'}</td>
    <td>${esc(s.source)}</td></tr>`;
  }).join('');

  return `<h1>Data explorer</h1>
  <p class="lede">Every series on this site in one place. Search by name, compare any two indicators on a common indexed scale, or download the whole dataset as a CSV file.</p>
  ${compare}
  <section class="card"><h2>All indicators</h2>
  <div class="explorer-bar">
    <label class="search-label">Search <input id="explorer-search" type="search" value="${esc(state.explorerQuery || '')}" placeholder="e.g. population, GDP, fertility" aria-label="Search indicators"></label>
    <button type="button" class="ctl primary" id="download-csv">Download all data (CSV)</button>
    <span class="count" id="explorer-count">${shown.length} of ${SERIES.length} indicators</span>
  </div>
  <div class="table-wrap"><table class="data-table" id="explorer-table">
  <thead><tr><th scope="col">Indicator</th><th scope="col">Unit</th><th scope="col">Latest value</th><th scope="col">Source</th></tr></thead>
  <tbody>${rows || `<tr><td colspan="4">No indicator matches “${esc(state.explorerQuery || '')}”. Try another word.</td></tr>`}</tbody></table></div>
  <p class="note">CSV columns: indicator, unit, year, value, source. Blank values mean the source has published no figure for that year.</p></section>
  <section class="card"><h2>Definitions</h2>
  <dl class="facts">
    <dt>GDP, current US dollars</dt><dd>The value of all goods and services produced in a year, at market prices, converted to dollars at that year’s exchange rate.</dd>
    <dt>Real GDP growth</dt><dd>Growth after removing price changes, so it measures more output rather than higher prices.</dd>
    <dt>Life expectancy at birth</dt><dd>How long a newborn would live if the death rates of the year it was born in stayed the same throughout its life.</dd>
    <dt>Fertility rate</dt><dd>Children per woman over her childbearing years at current birth rates; about 2.1 keeps a population stable.</dd>
    <dt>Infant mortality rate</dt><dd>Deaths before age one per 1,000 live births.</dd>
  </dl></section>`;
}

export function downloadCsv() {
  const lines = ['indicator,unit,year,value,source'];
  for (const s of SERIES) {
    for (const y of YEARS) {
      const v = s.values[y];
      lines.push(`"${s.name}","${s.unit}",${y},${v === null || v === undefined ? '' : v},"${s.source.replace(/"/g, '""')}"`);
    }
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'japan-statistics-2015-2024.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
