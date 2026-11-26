// Hand-rolled SVG charts. No libraries, no network: every chart is drawn
// from the data in data.js. Each chart returns an SVG string.


function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

function niceTicks(min, max, count) {
  if (min === max) { min -= 1; max += 1; }
  const step = (max - min) / (count - 1);
  const ticks = [];
  for (let i = 0; i < count; i++) ticks.push(min + step * i);
  return ticks;
}

function fmtTick(v) {
  const a = Math.abs(v);
  if (a >= 1e9) return (v / 1e9).toFixed(1) + 'B';
  if (a >= 1e6) return (v / 1e6).toFixed(0) + 'M';
  if (a >= 1000) return (v / 1000).toFixed(1) + 'k';
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(1);
}

// Line chart over years. points: [{year, value}] with nulls skipped.
export function lineChart({ points, width = 640, height = 280, color = '#c0392b', label = '', yFormat = fmtTick, area = true }) {
  const data = points.filter((p) => p.value !== null && p.value !== undefined);
  const xs = data.map((p) => p.year);
  const ys = data.map((p) => p.value);
  let min = Math.min(...ys);
  let max = Math.max(...ys);
  const pad = (max - min) * 0.15 || 1;
  min -= pad; max += pad;
  const L = 56, R = 14, T = 16, B = 30;
  const x = (yr) => L + ((yr - Math.min(...xs)) / (Math.max(...xs) - Math.min(...xs) || 1)) * (width - L - R);
  const y = (v) => T + (1 - (v - min) / (max - min)) * (height - T - B);
  const ticks = niceTicks(min, max, 4);
  const grid = ticks.map((t) => `<line x1="${L}" y1="${y(t)}" x2="${width - R}" y2="${y(t)}" stroke="#e6e2dc" stroke-width="1"/><text x="${L - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="#6b655c">${esc(yFormat(t))}</text>`).join('');
  const xlabels = data.filter((_, i) => i % 2 === 0 || i === data.length - 1)
    .map((p) => `<text x="${x(p.year)}" y="${height - 8}" text-anchor="middle" font-size="11" fill="#6b655c">${p.year}</text>`).join('');
  const path = data.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.year).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const areaPath = area ? `${path} L${x(data[data.length - 1].year).toFixed(1)},${y(min)} L${x(data[0].year).toFixed(1)},${y(min)} Z` : '';
  const dots = data.map((p) => `<circle cx="${x(p.year)}" cy="${y(p.value)}" r="3.5" fill="${color}"><title>${p.year}: ${esc(label)} ${p.value.toLocaleString('en-US')}</title></circle>`).join('');
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="${esc(label)} chart, ${data[0].year} to ${data[data.length - 1].year}">
${grid}${areaPath ? `<path d="${areaPath}" fill="${color}" opacity="0.10"/>` : ''}<path d="${path}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${dots}${xlabels}</svg>`;
}

// Vertical bar chart over years.
export function barChart({ points, width = 640, height = 280, color = '#2f6fb2', label = '', yFormat = fmtTick }) {
  const data = points.filter((p) => p.value !== null && p.value !== undefined);
  const xs = data.map((p) => p.year);
  let min = Math.min(0, ...data.map((p) => p.value));
  let max = Math.max(0, ...data.map((p) => p.value));
  const pad = (max - min) * 0.08 || 1;
  max += pad;
  const L = 56, R = 14, T = 16, B = 30;
  const slot = (width - L - R) / data.length;
  const bw = Math.min(44, slot * 0.62);
  const x = (i) => L + slot * i + (slot - bw) / 2;
  const y = (v) => T + (1 - (v - min) / (max - min)) * (height - T - B);
  const zeroY = y(0);
  const ticks = niceTicks(min, max, 4);
  const grid = ticks.map((t) => `<line x1="${L}" y1="${y(t)}" x2="${width - R}" y2="${y(t)}" stroke="#e6e2dc" stroke-width="1"/><text x="${L - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="#6b655c">${esc(yFormat(t))}</text>`).join('');
  const bars = data.map((p, i) => {
    const top = Math.min(y(p.value), zeroY);
    const h = Math.abs(zeroY - y(p.value));
    const neg = p.value < 0;
    return `<rect x="${x(i).toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(h, 1).toFixed(1)}" rx="3" fill="${neg ? '#c0392b' : color}"><title>${p.year}: ${esc(label)} ${p.value.toLocaleString('en-US')}</title></rect>`;
  }).join('');
  const xlabels = data.map((p, i) => `<text x="${(L + slot * i + slot / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="11" fill="#6b655c">${p.year}</text>`).join('');
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="${esc(label)} chart, ${data[0].year} to ${data[data.length - 1].year}">
${grid}<line x1="${L}" y1="${zeroY}" x2="${width - R}" y2="${zeroY}" stroke="#b9b2a6" stroke-width="1"/>${bars}${xlabels}</svg>`;
}

// Donut chart with a centre label and a legend.
export function donutChart({ slices, width = 300, height = 300, centreTop = '', centreBottom = '' }) {
  const cx = width / 2, cy = height / 2, r = Math.min(width, height) / 2 - 14, inner = r * 0.62;
  const total = slices.reduce((s, d) => s + d.value, 0);
  let angle = -Math.PI / 2;
  const paths = slices.map((d) => {
    const frac = d.value / total;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    return `<path d="M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${large} 1 ${x1.toFixed(1)},${y1.toFixed(1)} L${xi1.toFixed(1)},${yi1.toFixed(1)} A${inner},${inner} 0 ${large} 0 ${xi0.toFixed(1)},${yi0.toFixed(1)} Z" fill="${d.color}"><title>${esc(d.label)}: ${d.value}%</title></path>`;
  }).join('');
  const legend = slices.map((d) => `<span class="legend-item"><span class="swatch" style="background:${d.color}"></span>${esc(d.label)} — ${d.value}%</span>`).join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Donut chart">${paths}
<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="20" font-weight="700" fill="#1f2a37">${esc(centreTop)}</text>
<text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="12" fill="#6b655c">${esc(centreBottom)}</text></svg>
<div class="legend">${legend}</div></div>`;
}

// Horizontal paired bars (e.g. Japan vs OECD average).
export function pairedBars({ rows, width = 640, height = 220, colorA = '#c0392b', colorB = '#9db8d2', labelA = 'Japan', labelB = 'OECD average' }) {
  const max = Math.max(...rows.flatMap((r) => [r.a, r.b])) * 1.08;
  const L = 110, R = 46, T = 26, B = 12;
  const rowH = (height - T - B) / rows.length;
  const barH = Math.min(18, rowH * 0.32);
  const x = (v) => L + (v / max) * (width - L - R);
  const body = rows.map((r, i) => {
    const yA = T + rowH * i + rowH * 0.5 - barH - 2;
    const yB = T + rowH * i + rowH * 0.5 + 2;
    return `<text x="${L - 10}" y="${T + rowH * i + rowH * 0.5 + 4}" text-anchor="end" font-size="12" fill="#1f2a37">${esc(r.label)}</text>
<rect x="${L}" y="${yA}" width="${(x(r.a) - L).toFixed(1)}" height="${barH}" rx="3" fill="${colorA}"><title>${esc(r.label)} — ${labelA}: ${r.a}</title></rect>
<text x="${x(r.a) + 6}" y="${yA + barH - 4}" font-size="12" font-weight="700" fill="${colorA}">${r.a}</text>
<rect x="${L}" y="${yB}" width="${(x(r.b) - L).toFixed(1)}" height="${barH}" rx="3" fill="${colorB}"><title>${esc(r.label)} — ${labelB}: ${r.b}</title></rect>
<text x="${x(r.b) + 6}" y="${yB + barH - 4}" font-size="12" fill="#5b7285">${r.b}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Comparison chart">
<text x="${L}" y="14" font-size="12" font-weight="700" fill="${colorA}">■ ${esc(labelA)}</text>
<text x="${L + 90}" y="14" font-size="12" fill="#5b7285">■ ${esc(labelB)}</text>${body}</svg>`;
}
