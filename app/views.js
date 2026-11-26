// Views: one function per section of the site. Each returns HTML built from
// data.js and charts.js. All text is original; every figure carries its source.

import { YEARS, SERIES, AGE_STRUCTURE_2024, PISA_2022, CO2, CO2_PER_PERSON_2024, ELECTRICITY_MIX_2024, RENEWABLE_SHARE, FACTS, SOURCES, COUNTRY, seriesById, latestValue, formatValue } from './data.js';
import { lineChart, barChart, donutChart, pairedBars } from './charts.js';

export const NAV = [
  { route: 'overview', label: 'Overview' },
  { route: 'population', label: 'Population' },
  { route: 'economy', label: 'Economy' },
  { route: 'health', label: 'Health' },
  { route: 'education', label: 'Education' },
  { route: 'environment', label: 'Environment' },
  { route: 'explorer', label: 'Data explorer' },
];

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

function rangeYears(state) {
  return state.range === 'recent' ? YEARS.filter((y) => y >= 2020) : YEARS;
}

function pointsOf(series, years) {
  return years.map((y) => ({ year: y, value: series.values[y] ?? null }));
}

function chartCard({ id, title, subtitle, series, kind, state, yFormat }) {
  const pts = pointsOf(series, rangeYears(state));
  const chart = kind === 'bar'
    ? barChart({ points: pts, label: series.name, yFormat })
    : lineChart({ points: pts, label: series.name, yFormat });
  const latest = latestValue(series);
  return `<section class="card chart-card" id="card-${id}">
  <div class="card-head"><div><h2>${esc(title)}</h2><p class="sub">${esc(subtitle)}</p></div>
  <div class="controls" role="group" aria-label="Chart controls">
    <button type="button" class="ctl chart-kind" data-chart="${id}" data-kind="line" aria-pressed="${kind === 'line'}">Line</button>
    <button type="button" class="ctl chart-kind" data-chart="${id}" data-kind="bar" aria-pressed="${kind === 'bar'}">Bars</button>
    <button type="button" class="ctl range-btn" data-range="all" aria-pressed="${state.range === 'all'}">2015–2024</button>
    <button type="button" class="ctl range-btn" data-range="recent" aria-pressed="${state.range === 'recent'}">2020–2024</button>
  </div></div>
  <div class="chart">${chart}</div>
  <p class="latest">Latest: <strong>${latest ? formatValue(series, latest.value) + ' (' + latest.year + ')' : 'not published'}</strong></p>
  <p class="source">Source: ${esc(series.source)}</p>
  <p class="note">${esc(series.note)}</p>
</section>`;
}

function statCard(seriesId, caption) {
  const s = seriesById(seriesId);
  const latest = latestValue(s);
  const prevYear = latest.year - 1;
  const prev = s.values[prevYear];
  const change = prev !== null && prev !== undefined && prev !== 0
    ? ((latest.value - prev) / Math.abs(prev)) * 100 : null;
  return `<div class="stat"><span class="stat-label">${esc(caption || s.name)}</span>
  <span class="stat-value">${esc(formatValue(s, latest.value))}</span>
  <span class="stat-meta">${latest.year}${change !== null ? ` · ${change >= 0 ? '+' : ''}${change.toFixed(1)}% on ${prevYear}` : ''}</span></div>`;
}

// Sortable table of several series over years (newest first).
function yearTable(seriesIds, title) {
  const rows = [...YEARS].reverse().map((y) => {
    const cells = seriesIds.map((id) => {
      const s = seriesById(id);
      const v = s.values[y];
      return `<td data-num="${v === null || v === undefined ? '' : v}">${v === null || v === undefined ? '—' : esc(formatValue(s, v))}</td>`;
    }).join('');
    return `<tr><th scope="row" data-num="${y}">${y}</th>${cells}</tr>`;
  }).join('');
  const heads = seriesIds.map((id) => {
    const s = seriesById(id);
    return `<th scope="col" data-key="${id}">${esc(s.name)} <span class="sort-hint">↕</span></th>`;
  }).join('');
  return `<section class="card"><h2>${esc(title)}</h2>
  <p class="sub">Click a column heading to sort. “—” means the source has published no value for that year.</p>
  <div class="table-wrap"><table class="data-table sortable">
  <thead><tr><th scope="col" data-key="year">Year <span class="sort-hint">↕</span></th>${heads}</tr></thead>
  <tbody>${rows}</tbody></table></div></section>`;
}

function sourcesFooter() {
  const items = SOURCES.map((s) => `<li><strong>${esc(s.name)}</strong> — ${esc(s.what)}</li>`).join('');
  return `<section class="card sources"><h2>Sources and method</h2>
  <ul>${items}</ul>
  <p>Figures are shown exactly as published by their source; where a source publishes no value for a year, the year is blank rather than estimated. World Bank figures were retrieved from the World Bank API on 26 November 2026. This site is an independent, unofficial presentation of public statistics and is not affiliated with the World Bank, the OECD, or the Government of Japan.</p>
  <p><a href="#/explorer">Open the data explorer</a> to search, sort and download every series as a CSV file.</p></section>`;
}

export function overviewView(state) {
  const pop = seriesById('population');
  const gdp = seriesById('gdp');
  return `<h1>Japan in numbers</h1>
  <p class="lede">The essential statistics of Japan — population, economy, health, education and environment — drawn from the World Bank, the OECD and Japan’s own ministries, with every figure sourced and every year shown.</p>
  <div class="stats-grid">
    ${statCard('population')}
    ${statCard('gdp')}
    ${statCard('lifeExpectancy')}
    ${statCard('unemployment')}
    ${statCard('fertility')}
    ${statCard('age65')}
  </div>
  <div class="grid-2">
    ${chartCard({ id: 'pop', title: 'Population is shrinking', subtitle: 'Total population, 2015–2024', series: pop, kind: state.charts.pop, state })}
    ${chartCard({ id: 'gdp', title: 'The world’s 4th-largest economy', subtitle: 'GDP, current US dollars', series: gdp, kind: state.charts.gdp, state })}
  </div>
  <div class="grid-2">
    <section class="card"><h2>Who lives here: age in 2024</h2>
      <p class="sub">Nearly 3 in 10 residents are 65 or older — the oldest population of any large country.</p>
      ${donutChart({ slices: AGE_STRUCTURE_2024, centreTop: '124.0m', centreBottom: 'people, 2024' })}
      <p class="source">Source: World Bank WDI (SP.POP.0014.TO.ZS, SP.POP.65UP.TO.ZS). The 15–64 share is the remainder.</p>
    </section>
    <section class="card"><h2>Japan at a glance</h2>
      <dl class="facts">
        <dt>Capital</dt><dd>Tokyo</dd>
        <dt>Land area</dt><dd>${COUNTRY.landAreaKm2.toLocaleString('en-US')} km² <span class="src">${esc(COUNTRY.landAreaSource)}</span></dd>
        <dt>Population density</dt><dd>${FACTS.density2023.value} people per km², 2023 <span class="src">World Bank WDI</span></dd>
        <dt>Median age</dt><dd>${FACTS.medianAge2024.value} years, 2024 <span class="src">UN World Population Prospects 2024</span></dd>
        <dt>Births minus deaths, 2024</dt><dd>${FACTS.births2024.value.toLocaleString('en-US')} births, ${FACTS.deaths2024.value.toLocaleString('en-US')} deaths — a natural decrease of about 898,000 <span class="src">Ministry of Health, Labour and Welfare</span></dd>
        <dt>Urban share</dt><dd>92.2% of people live in urban areas, 2024 <span class="src">World Bank WDI</span></dd>
      </dl>
      <p class="note">Start with <a href="#/population">Population</a> for the demographic story, <a href="#/economy">Economy</a> for GDP and jobs, or <a href="#/explorer">the data explorer</a> for every number.</p>
    </section>
  </div>
  ${sourcesFooter()}`;
}

export function populationView(state) {
  return `<h1>Population &amp; demographics</h1>
  <p class="lede">Japan’s population has fallen every year since its 2008 peak, and it is ageing faster than any other large country. The drivers are plain in the numbers: fewer births, a fertility rate far below replacement, and the world’s longest lives.</p>
  <div class="grid-2">
    ${chartCard({ id: 'pop2', title: 'Total population', subtitle: 'People, 2015–2024', series: seriesById('population'), kind: state.charts.pop2, state })}
    ${chartCard({ id: 'fert', title: 'Fertility keeps falling', subtitle: 'Births per woman', series: seriesById('fertility'), kind: state.charts.fert, state })}
  </div>
  <div class="grid-2">
    <section class="card"><h2>Age structure, 2024</h2>
      ${donutChart({ slices: AGE_STRUCTURE_2024, centreTop: '29.8%', centreBottom: 'aged 65+' })}
      <p class="source">Source: World Bank WDI. Children (0–14) are 11.4%; working ages (15–64) are 58.8%.</p>
      <p class="note">The old-age share rose from 26.9% in 2015 to 29.8% in 2024, while the child share fell from 12.8% to 11.4%.</p>
    </section>
    ${chartCard({ id: 'age65', title: 'The 65+ share rises every year', subtitle: '% of total population', series: seriesById('age65'), kind: state.charts.age65, state })}
  </div>
  ${yearTable(['population', 'fertility', 'age65', 'age014', 'urban'], 'Population by year')}
  <section class="card"><h2>How to read this</h2>
  <p><strong>Replacement level</strong> is about 2.1 children per woman — the rate that keeps a population stable without migration. Japan’s 1.15 in 2024 is barely half of it, so each generation is roughly half the size of the one before it, before migration is counted.</p>
  <p><strong>Median age 49.9</strong> (UN, 2024) means half the population is older than 50. Only Monaco has an older population.</p></section>
  ${sourcesFooter()}`;
}

export function economyView(state) {
  return `<h1>Economy</h1>
  <p class="lede">Japan is the world’s fourth-largest economy, with GDP of $4.19 trillion in 2024 (World Bank). Growth has been slow for a decade, unemployment is among the lowest in the rich world, and inflation — near zero for years — returned in 2022.</p>
  <div class="stats-grid">
    ${statCard('gdp')}${statCard('gdpPerCapita')}${statCard('gdpGrowth')}${statCard('inflation')}${statCard('unemployment')}${statCard('exports')}
  </div>
  <div class="grid-2">
    ${chartCard({ id: 'gdp2', title: 'GDP in dollars', subtitle: 'Current US dollars, 2015–2024', series: seriesById('gdp'), kind: state.charts.gdp2, state })}
    ${chartCard({ id: 'growth', title: 'Real growth: slow, with a COVID dip', subtitle: 'Annual % change in real GDP', series: seriesById('gdpGrowth'), kind: state.charts.growth, state })}
  </div>
  <div class="grid-2">
    ${chartCard({ id: 'infl', title: 'Inflation returns', subtitle: 'Consumer prices, annual %', series: seriesById('inflation'), kind: state.charts.infl, state })}
    ${chartCard({ id: 'unemp', title: 'Unemployment stays low', subtitle: '% of labour force', series: seriesById('unemployment'), kind: state.charts.unemp, state })}
  </div>
  ${yearTable(['gdp', 'gdpPerCapita', 'gdpGrowth', 'inflation', 'unemployment', 'exports'], 'Economy by year')}
  <section class="card"><h2>Why the dollar GDP fell after 2021</h2>
  <p>In yen, nominal GDP rose to ¥609.29 trillion in 2024 (Cabinet Office). In dollars it fell from $5.23 trillion in 2021 to $4.19 trillion in 2024 because the yen weakened sharply against the dollar — the economy did not shrink by a fifth. Read dollar figures together with the yen figure and the real growth rate.</p></section>
  ${sourcesFooter()}`;
}

export function healthView(state) {
  return `<h1>Health</h1>
  <p class="lede">Japanese people live longer than almost anyone: 84.0 years at birth in 2024, with women at 87.1 and men at 81.1. Infant mortality is 1.8 per 1,000 live births — among the lowest anywhere. Health spending was 10.7% of GDP in 2023.</p>
  <div class="stats-grid">
    ${statCard('lifeExpectancy')}${statCard('infantMortality')}${statCard('healthSpend')}
  </div>
  <div class="grid-2">
    ${chartCard({ id: 'life', title: 'Life expectancy: 84 years', subtitle: 'Years at birth, 2015–2024', series: seriesById('lifeExpectancy'), kind: state.charts.life, state })}
    ${chartCard({ id: 'health', title: 'Health spending', subtitle: '% of GDP (latest year 2023)', series: seriesById('healthSpend'), kind: state.charts.health, state })}
  </div>
  ${yearTable(['lifeExpectancy', 'infantMortality', 'healthSpend'], 'Health by year')}
  <section class="card"><h2>What sits behind the long lives</h2>
  <p>Japan’s universal health insurance, low smoking rates among women, a diet low in saturated fat, and low infant mortality all contribute — but this site reports the outcomes, not the causes. The OECD average life expectancy is about 81.3 years (OECD Health Statistics 2025), roughly three years below Japan’s.</p>
  <p class="note">Note the 2022 dip: life expectancy fell from 84.5 years in 2021 to 84.0 in 2022, the pandemic years, and has held at 84.0 since.</p></section>
  ${sourcesFooter()}`;
}

export function educationView(state) {
  const pisaRows = PISA_2022.map((p) => ({ label: p.subject, a: p.japan, b: p.oecd }));
  return `<h1>Education</h1>
  <p class="lede">In PISA 2022, Japan’s 15-year-olds ranked 5th in mathematics, 3rd in reading and 2nd in science out of 81 participating systems — and improved on 2018 in all three subjects while the OECD average fell. Public spending on education was 3.3% of GDP in 2021, the latest year published.</p>
  <section class="card"><h2>PISA 2022: Japan vs the OECD average</h2>
  <p class="sub">Mean scores, 15-year-olds. OECD averages: mathematics 472, reading 476, science 485.</p>
  ${pairedBars({ rows: pisaRows })}
  <table class="data-table"><thead><tr><th scope="col">Subject</th><th scope="col">Japan</th><th scope="col">OECD average</th><th scope="col">Japan’s rank</th></tr></thead>
  <tbody>${PISA_2022.map((p) => `<tr><th scope="row">${p.subject}</th><td>${p.japan}</td><td>${p.oecd}</td><td>${p.japanRank}</td></tr>`).join('')}</tbody></table>
  <p class="source">Source: OECD, PISA 2022 (Japan NIER summary). Ranks are among the 81 countries and economies that took part.</p></section>
  <div class="grid-2">
    ${chartCard({ id: 'edu', title: 'Public spending on education', subtitle: '% of GDP (no value published for 2022–2024)', series: seriesById('eduSpend'), kind: state.charts.edu, state })}
    <section class="card"><h2>Schooling in Japan</h2>
    <dl class="facts">
      <dt>Compulsory schooling</dt><dd>6 years of primary + 3 years of lower secondary, ages 6–15</dd>
      <dt>Upper secondary</dt><dd>3 years, attended by about 98% of the age group</dd>
      <dt>School year</dt><dd>Starts in April</dd>
      <dt>PISA trend</dt><dd>Reading +12, mathematics +9, science +18 points vs 2018</dd>
    </dl>
    <p class="note">Compulsory-school facts are the standard structure published by Japan’s Ministry of Education, Culture, Sports, Science and Technology (MEXT). The 98% upper-secondary attendance figure is MEXT’s published rate.</p></section>
  </div>
  ${yearTable(['eduSpend'], 'Education spending by year')}
  ${sourcesFooter()}`;
}

export function environmentView(state) {
  return `<h1>Environment &amp; energy</h1>
  <p class="lede">Japan’s CO₂ emissions fell to 961.9 million tonnes in 2024 — 17% below 1990 — and renewables supplied 22.9% of electricity. The government targets net-zero greenhouse-gas emissions by 2050. Fossil fuels still generate about two-thirds of electricity.</p>
  <div class="grid-2">
    <section class="card"><h2>CO₂ emissions are falling</h2>
    <p class="sub">Million tonnes of CO₂ from fossil fuels and industry. 1990 shown for reference.</p>
    ${barChart({ points: CO2.map((d) => ({ year: d.year, value: d.value })), label: 'CO₂ emissions, million tonnes', color: '#2f6fb2' })}
    <p class="latest">Latest: <strong>961.9 million tonnes (2024)</strong> · ${CO2_PER_PERSON_2024} tonnes per person</p>
    <p class="source">Source: Global Carbon Budget / Our World in Data.</p>
    <p class="note">Total greenhouse-gas emissions in fiscal 2023 were 1,071 MtCO₂e, down 23.3% from fiscal 2013 (Ministry of the Environment, Japan).</p></section>
    <section class="card"><h2>Electricity mix, 2024</h2>
    <p class="sub">Share of domestic electricity generation, 1,016 TWh in total.</p>
    ${donutChart({ slices: ELECTRICITY_MIX_2024, centreTop: '22.9%', centreBottom: 'renewable' })}
    <p class="source">Source: Ember, via Our World in Data. Shares sum to 100.1% after rounding.</p>
    <p class="note">Renewables were 22.1% of generation in 2023 and 22.9% in 2024; nuclear was 8.4% in 2024.</p></section>
  </div>
  <section class="card"><h2>Renewable share of electricity</h2>
  <p class="sub">Hydro, solar, wind and bioenergy as a share of generation.</p>
  <table class="data-table"><thead><tr><th scope="col">Year</th><th scope="col">Renewable share</th><th scope="col">Nuclear share</th><th scope="col">Thermal share</th></tr></thead>
  <tbody>
  <tr><th scope="row">2023</th><td>22.1%</td><td>8.5%</td><td>68.6%</td></tr>
  <tr><th scope="row">2024</th><td>22.9%</td><td>8.4%</td><td>68.7%</td></tr>
  </tbody></table>
  <p class="source">Source: Ember via Our World in Data (2024 mix); METI Agency for Natural Resources and Energy, FY2023 energy statistics (2023 shares).</p>
  <p class="note">Japan imports almost all of its fossil fuels and is the world’s largest importer of liquefied natural gas. Its 7th Strategic Energy Plan sets a 2040 target of 40–50% renewables in the power mix.</p></section>
  ${sourcesFooter()}`;
}
