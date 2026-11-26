// Japan in Numbers — router and controls.
//
// Hash routes: #/overview #/population #/economy #/health #/education
// #/environment #/explorer. Every control on the page works: chart type and
// year-range buttons re-render the chart, table headings sort, the explorer
// search filters, its two selects redraw the comparison, and the CSV button
// downloads the dataset. window.__shotReady tells a screenshot script when
// a view has finished rendering.

import { NAV, overviewView, populationView, economyView, healthView, educationView, environmentView } from './views.js';
import { explorerView, downloadCsv } from './explorer.js';

const app = document.getElementById('app');
const navEl = document.getElementById('nav');

const state = {
  route: 'overview',
  range: 'all', // 'all' = 2015–2024, 'recent' = 2020–2024
  charts: { pop: 'line', gdp: 'bar', pop2: 'line', fert: 'line', age65: 'line', gdp2: 'bar', growth: 'bar', infl: 'line', unemp: 'line', life: 'line', health: 'bar', edu: 'line' },
  explorerQuery: '',
  explorerA: 'population',
  explorerB: 'fertility',
};

const VIEWS = {
  overview: overviewView,
  population: populationView,
  economy: economyView,
  health: healthView,
  education: educationView,
  environment: environmentView,
  explorer: explorerView,
};

function routeFromHash() {
  const m = location.hash.match(/^#\/([a-z]+)/);
  return m && VIEWS[m[1]] ? m[1] : 'overview';
}

function renderNav() {
  navEl.innerHTML = NAV.map((n) => `<a href="#/${n.route}" class="${n.route === state.route ? 'active' : ''}" ${n.route === state.route ? 'aria-current="page"' : ''}>${n.label}</a>`).join('');
}

function render() {
  window.__shotReady = false;
  state.route = routeFromHash();
  renderNav();
  const view = VIEWS[state.route];
  app.innerHTML = view(state);
  document.title = `${NAV.find((n) => n.route === state.route).label} — Japan in Numbers`;
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);

// Chart type and year-range buttons (delegated, so they work after re-render).
document.addEventListener('click', (event) => {
  const kindBtn = event.target.closest('.chart-kind');
  if (kindBtn) {
    state.charts[kindBtn.dataset.chart] = kindBtn.dataset.kind;
    render();
    return;
  }
  const rangeBtn = event.target.closest('.range-btn');
  if (rangeBtn) {
    state.range = rangeBtn.dataset.range;
    render();
    return;
  }
  const csvBtn = event.target.closest('#download-csv');
  if (csvBtn) {
    downloadCsv();
    return;
  }
  // Sortable table headings: click toggles ascending/descending on that column.
  const th = event.target.closest('th[data-key]');
  if (th) {
    const table = th.closest('table');
    const colIndex = [...th.parentElement.children].indexOf(th);
    const body = table.querySelector('tbody');
    const rows = [...body.querySelectorAll('tr')];
    const ascending = th.dataset.dir !== 'asc';
    table.querySelectorAll('th[data-key]').forEach((h) => { delete h.dataset.dir; });
    th.dataset.dir = ascending ? 'asc' : 'desc';
    rows.sort((a, b) => {
      const av = a.children[colIndex].dataset.num ?? a.children[colIndex].textContent.trim();
      const bv = b.children[colIndex].dataset.num ?? b.children[colIndex].textContent.trim();
      const an = parseFloat(av), bn = parseFloat(bv);
      if (!Number.isNaN(an) && !Number.isNaN(bn)) return ascending ? an - bn : bn - an;
      return ascending ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    body.append(...rows);
  }
});

// Explorer search (live filter) and comparison selects.
document.addEventListener('input', (event) => {
  if (event.target.id === 'explorer-search') {
    state.explorerQuery = event.target.value;
    const pos = event.target.selectionStart;
    render();
    const input = document.getElementById('explorer-search');
    if (input) { input.focus(); input.setSelectionRange(pos, pos); }
  }
});
document.addEventListener('change', (event) => {
  if (event.target.id === 'explorer-a') { state.explorerA = event.target.value; render(); }
  if (event.target.id === 'explorer-b') { state.explorerB = event.target.value; render(); }
});

render();
