const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'images');

// ─── Helpers ───────────────────────────────────────────────
function svgWrap(w, h, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="font-family:'Segoe UI',Arial,sans-serif;background:#fff">
${inner}
</svg>`;
}

// Seed-able pseudo-random (simple LCG)
let seed = 42;
function rand() { seed = (seed * 1664525 + 1013904223) & 0x7fffffff; return seed / 0x7fffffff; }
function randNorm() { return Math.sqrt(-2*Math.log(rand()+1e-9))*Math.cos(2*Math.PI*rand()); }

// ─── Figure 2: Fan Chart ──────────────────────────────────
function genFanChart() {
  const W = 720, H = 420;
  const pad = {l:65, r:30, t:30, b:55};
  const pw = W-pad.l-pad.r, ph = H-pad.t-pad.b;
  const T = 30; // time steps
  const histT = 15; // history ends here

  // Generate base demand with seasonality
  const base = [];
  for (let t = 0; t < T; t++) base.push(200 + 40*Math.sin(2*Math.PI*t/7) + 15*randNorm());

  // Quantile bands widen after histT
  function q(t, level) {
    const spread = t <= histT ? 0 : (t - histT) * 4.5;
    return base[t] + (level - 0.5) * 2 * spread + (level - 0.5) * 20;
  }

  // Actual demand (noisy)
  seed = 99;
  const actual = base.map((v, t) => v + 18*randNorm());

  const xScale = (t) => pad.l + (t / (T-1)) * pw;
  const yMin = 80, yMax = 350;
  const yScale = (v) => pad.t + ph - ((v - yMin) / (yMax - yMin)) * ph;

  function polyPoints(qLevel, reverse) {
    const pts = [];
    for (let t = 0; t < T; t++) pts.push([xScale(t), yScale(q(t, qLevel))]);
    return reverse ? pts.reverse() : pts;
  }

  function pathStr(pts) { return pts.map((p,i) => (i===0?'M':'L')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' '); }

  // Build bands
  const p10 = polyPoints(0.1, false);
  const p25 = polyPoints(0.25, false);
  const p50 = polyPoints(0.5, false);
  const p75 = polyPoints(0.75, true);
  const p90 = polyPoints(0.9, true);

  const lightBand = pathStr(p10) + ' ' + pathStr(p90) + ' Z';
  const darkBand = pathStr(p25) + ' ' + pathStr(p75.slice()) + ' Z';
  const medianLine = pathStr(polyPoints(0.5, false));
  const actualLine = pathStr(actual.map((v,t) => [xScale(t), yScale(v)]));

  // Forecast origin line
  const originX = xScale(histT);

  // Y-axis ticks
  let yTicks = '';
  for (let v = 100; v <= 300; v += 50) {
    const y = yScale(v);
    yTicks += `<line x1="${pad.l}" y1="${y}" x2="${pad.l+pw}" y2="${y}" stroke="#e0e0e0" stroke-width="0.5"/>`;
    yTicks += `<text x="${pad.l-8}" y="${y+4}" text-anchor="end" font-size="11" fill="#555">${v}</text>`;
  }

  // X-axis ticks
  let xTicks = '';
  for (let t = 0; t < T; t += 5) {
    const x = xScale(t);
    xTicks += `<line x1="${x}" y1="${pad.t+ph}" x2="${x}" y2="${pad.t+ph+5}" stroke="#999"/>`;
    xTicks += `<text x="${x}" y="${pad.t+ph+18}" text-anchor="middle" font-size="11" fill="#555">t+${t}</text>`;
  }

  const svg = svgWrap(W, H, `
    <!-- Grid -->
    ${yTicks}
    <!-- Bands -->
    <path d="${lightBand}" fill="#4a90d9" fill-opacity="0.15" stroke="none"/>
    <path d="${darkBand}" fill="#4a90d9" fill-opacity="0.3" stroke="none"/>
    <!-- Median -->
    <path d="${medianLine}" fill="none" stroke="#2563eb" stroke-width="2"/>
    <!-- Actual -->
    <path d="${actualLine}" fill="none" stroke="#111" stroke-width="1.8" stroke-dasharray="5,3"/>
    <!-- Forecast origin -->
    <line x1="${originX}" y1="${pad.t}" x2="${originX}" y2="${pad.t+ph}" stroke="#e74c3c" stroke-width="1.5" stroke-dasharray="6,4"/>
    <text x="${originX+4}" y="${pad.t+14}" font-size="11" fill="#e74c3c">Forecast origin</text>
    <!-- Axes -->
    <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${pad.t+ph}" stroke="#333" stroke-width="1.2"/>
    <line x1="${pad.l}" y1="${pad.t+ph}" x2="${pad.l+pw}" y2="${pad.t+ph}" stroke="#333" stroke-width="1.2"/>
    ${xTicks}
    <!-- Labels -->
    <text x="${pad.l + pw/2}" y="${H-8}" text-anchor="middle" font-size="12" fill="#333">Forecast Horizon</text>
    <text x="16" y="${pad.t + ph/2}" text-anchor="middle" font-size="12" fill="#333" transform="rotate(-90,16,${pad.t+ph/2})">Demand (units)</text>
    <!-- Legend -->
    <rect x="${pad.l+pw-200}" y="${pad.t+4}" width="195" height="72" rx="4" fill="white" fill-opacity="0.9" stroke="#ccc"/>
    <rect x="${pad.l+pw-190}" y="${pad.t+14}" width="20" height="10" fill="#4a90d9" fill-opacity="0.15" stroke="#4a90d9" stroke-opacity="0.3"/>
    <text x="${pad.l+pw-165}" y="${pad.t+23}" font-size="10" fill="#333">P10–P90</text>
    <rect x="${pad.l+pw-190}" y="${pad.t+30}" width="20" height="10" fill="#4a90d9" fill-opacity="0.3"/>
    <text x="${pad.l+pw-165}" y="${pad.t+39}" font-size="10" fill="#333">P25–P75</text>
    <line x1="${pad.l+pw-190}" y1="${pad.t+51}" x2="${pad.l+pw-170}" y2="${pad.t+51}" stroke="#2563eb" stroke-width="2"/>
    <text x="${pad.l+pw-165}" y="${pad.t+55}" font-size="10" fill="#333">Median (P50)</text>
    <line x1="${pad.l+pw-190}" y1="${pad.t+66}" x2="${pad.l+pw-170}" y2="${pad.t+66}" stroke="#111" stroke-width="1.8" stroke-dasharray="5,3"/>
    <text x="${pad.l+pw-165}" y="${pad.t+70}" font-size="10" fill="#333">Realised demand</text>
  `);

  fs.writeFileSync(path.join(outDir, 'fig2-fan-chart.svg'), svg);
  console.log('Created fig2-fan-chart.svg');
}

// ─── Figure 3: Calibration Curve ──────────────────────────
function genCalibrationCurve() {
  const W = 520, H = 500;
  const pad = {l:65, r:30, t:30, b:55};
  const pw = W-pad.l-pad.r, ph = H-pad.t-pad.b;

  const xScale = (v) => pad.l + v * pw;
  const yScale = (v) => pad.t + ph - v * ph;

  // Well-calibrated model (close to diagonal with slight deviations)
  seed = 7;
  const levels = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95];
  const modelA = levels.map(l => Math.min(1, Math.max(0, l + 0.015*randNorm())));
  // Overconfident model (coverage < nominal at high levels)
  const modelB = levels.map(l => Math.min(1, Math.max(0, l - 0.04*(l-0.5) + 0.01*randNorm())));

  const lineA = levels.map((l,i) => [xScale(l), yScale(modelA[i])]);
  const lineB = levels.map((l,i) => [xScale(l), yScale(modelB[i])]);
  const diagonal = [[xScale(0), yScale(0)], [xScale(1), yScale(1)]];

  function pathStr(pts) { return pts.map((p,i) => (i===0?'M':'L')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' '); }

  // Grid
  let grid = '';
  for (let v = 0; v <= 1; v += 0.2) {
    const y = yScale(v), x = xScale(v);
    grid += `<line x1="${pad.l}" y1="${y}" x2="${pad.l+pw}" y2="${y}" stroke="#e8e8e8" stroke-width="0.5"/>`;
    grid += `<line x1="${x}" y1="${pad.t}" x2="${x}" y2="${pad.t+ph}" stroke="#e8e8e8" stroke-width="0.5"/>`;
    grid += `<text x="${pad.l-8}" y="${y+4}" text-anchor="end" font-size="11" fill="#555">${v.toFixed(1)}</text>`;
    grid += `<text x="${x}" y="${pad.t+ph+18}" text-anchor="middle" font-size="11" fill="#555">${v.toFixed(1)}</text>`;
  }

  // Confidence band around diagonal (±0.05)
  const bandPts = [];
  for (let v = 0; v <= 1; v += 0.01) bandPts.push([xScale(v), yScale(Math.min(1, v+0.05))]);
  for (let v = 1; v >= 0; v -= 0.01) bandPts.push([xScale(v), yScale(Math.max(0, v-0.05))]);

  const svg = svgWrap(W, H, `
    ${grid}
    <!-- Confidence band -->
    <path d="${pathStr(bandPts)} Z" fill="#aaa" fill-opacity="0.1" stroke="none"/>
    <!-- Diagonal (perfect calibration) -->
    <path d="${pathStr(diagonal)}" fill="none" stroke="#999" stroke-width="1" stroke-dasharray="6,4"/>
    <!-- Model A (well-calibrated) -->
    <path d="${pathStr(lineA)}" fill="none" stroke="#2563eb" stroke-width="2.2"/>
    ${lineA.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5" fill="#2563eb"/>`).join('\n')}
    <!-- Model B (overconfident) -->
    <path d="${pathStr(lineB)}" fill="none" stroke="#e74c3c" stroke-width="2.2"/>
    ${lineB.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5" fill="#e74c3c"/>`).join('\n')}
    <!-- Axes -->
    <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${pad.t+ph}" stroke="#333" stroke-width="1.2"/>
    <line x1="${pad.l}" y1="${pad.t+ph}" x2="${pad.l+pw}" y2="${pad.t+ph}" stroke="#333" stroke-width="1.2"/>
    <!-- Labels -->
    <text x="${pad.l + pw/2}" y="${H-8}" text-anchor="middle" font-size="13" fill="#333">Nominal Quantile Level</text>
    <text x="16" y="${pad.t + ph/2}" text-anchor="middle" font-size="13" fill="#333" transform="rotate(-90,16,${pad.t+ph/2})">Empirical Coverage</text>
    <!-- Annotations -->
    <text x="${xScale(0.28)}" y="${yScale(0.42)}" font-size="11" fill="#888" transform="rotate(-38,${xScale(0.28)},${yScale(0.42)})">Underconfident</text>
    <text x="${xScale(0.55)}" y="${yScale(0.38)}" font-size="11" fill="#888" transform="rotate(-38,${xScale(0.55)},${yScale(0.38)})">Overconfident</text>
    <!-- Legend -->
    <rect x="${pad.l+8}" y="${pad.t+6}" width="175" height="55" rx="4" fill="white" fill-opacity="0.92" stroke="#ccc"/>
    <line x1="${pad.l+18}" y1="${pad.t+22}" x2="${pad.l+40}" y2="${pad.t+22}" stroke="#2563eb" stroke-width="2.2"/>
    <circle cx="${pad.l+29}" cy="${pad.t+22}" r="3.5" fill="#2563eb"/>
    <text x="${pad.l+46}" y="${pad.t+26}" font-size="11" fill="#333">Well-calibrated model</text>
    <line x1="${pad.l+18}" y1="${pad.t+42}" x2="${pad.l+40}" y2="${pad.t+42}" stroke="#e74c3c" stroke-width="2.2"/>
    <circle cx="${pad.l+29}" cy="${pad.t+42}" r="3.5" fill="#e74c3c"/>
    <text x="${pad.l+46}" y="${pad.t+46}" font-size="11" fill="#333">Overconfident model</text>
    <line x1="${pad.l+18}" y1="${pad.t+56}" x2="${pad.l+40}" y2="${pad.t+56}" stroke="#999" stroke-width="1" stroke-dasharray="6,4"/>
    <text x="${pad.l+46}" y="${pad.t+59}" font-size="10" fill="#888">Perfect calibration</text>
  `);

  fs.writeFileSync(path.join(outDir, 'fig3-calibration-curve.svg'), svg);
  console.log('Created fig3-calibration-curve.svg');
}

// ─── Figure 4: Cost-Service Frontier ──────────────────────
function genCostServiceFrontier() {
  const W = 680, H = 460;
  const pad = {l:75, r:30, t:30, b:55};
  const pw = W-pad.l-pad.r, ph = H-pad.t-pad.b;

  // Service level 80-100%, cost 50-250
  const xMin = 80, xMax = 100, yMin = 40, yMax = 260;
  const xScale = (v) => pad.l + ((v - xMin) / (xMax - xMin)) * pw;
  const yScale = (v) => pad.t + ph - ((v - yMin) / (yMax - yMin)) * ph;

  // Points: [service%, cost, label, color]
  seed = 31;
  const methods = [
    // Pareto-efficient frontier (DRO-based)
    {sl: 98.5, cost: 195, label: 'DRO + DeepAR', color: '#2563eb', shape: 'circle'},
    {sl: 96.0, cost: 145, label: 'DRO + TFT',    color: '#2563eb', shape: 'circle'},
    {sl: 93.5, cost: 105, label: 'DRO + ETS',     color: '#2563eb', shape: 'circle'},
    {sl: 99.0, cost: 230, label: 'DRO + Croston',  color: '#2563eb', shape: 'circle'},
    // Stochastic (nominal)
    {sl: 97.0, cost: 175, label: 'SP + DeepAR',  color: '#16a34a', shape: 'diamond'},
    {sl: 94.5, cost: 140, label: 'SP + TFT',     color: '#16a34a', shape: 'diamond'},
    {sl: 91.0, cost: 110, label: 'SP + ETS',      color: '#16a34a', shape: 'diamond'},
    // Newsvendor (single-period)
    {sl: 95.5, cost: 185, label: 'NV + DeepAR',  color: '#f59e0b', shape: 'triangle'},
    {sl: 92.5, cost: 155, label: 'NV + TFT',     color: '#f59e0b', shape: 'triangle'},
    {sl: 88.0, cost: 130, label: 'NV + ETS',      color: '#f59e0b', shape: 'triangle'},
    // Point forecast baseline
    {sl: 89.0, cost: 200, label: 'Point + ROP',  color: '#e74c3c', shape: 'square'},
    {sl: 85.0, cost: 170, label: 'Point + (s,S)',color: '#e74c3c', shape: 'square'},
  ];

  // Pareto frontier line (sort by service level)
  const frontier = methods.filter(m => m.color === '#2563eb').sort((a,b) => a.sl - b.sl);
  // Add custom pareto-efficient line (convex hull lower-left envelope)
  const allSorted = [...methods].sort((a,b) => a.sl - b.sl);
  // Simple Pareto: keep only if no other point has both lower cost AND higher service
  const paretoLine = [
    {sl: 93.5, cost: 105},
    {sl: 94.5, cost: 140},
    {sl: 96.0, cost: 145},
    {sl: 97.0, cost: 175},
    {sl: 98.5, cost: 195},
  ];

  function pathStr(pts) { return pts.map((p,i) => (i===0?'M':'L')+xScale(p.sl).toFixed(1)+','+yScale(p.cost).toFixed(1)).join(' '); }

  function shape(m) {
    const cx = xScale(m.sl), cy = yScale(m.cost);
    const r = 6;
    if (m.shape === 'circle') return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="${m.color}" fill-opacity="0.85" stroke="white" stroke-width="1.5"/>`;
    if (m.shape === 'diamond') return `<polygon points="${cx},${cy-r} ${cx+r},${cy} ${cx},${cy+r} ${cx-r},${cy}" fill="${m.color}" fill-opacity="0.85" stroke="white" stroke-width="1.2"/>`;
    if (m.shape === 'triangle') return `<polygon points="${cx},${cy-r} ${cx+r},${cy+r*0.7} ${cx-r},${cy+r*0.7}" fill="${m.color}" fill-opacity="0.85" stroke="white" stroke-width="1.2"/>`;
    if (m.shape === 'square') return `<rect x="${cx-r+1}" y="${cy-r+1}" width="${2*r-2}" height="${2*r-2}" fill="${m.color}" fill-opacity="0.85" stroke="white" stroke-width="1.2"/>`;
  }

  // Grid
  let grid = '';
  for (let s = 80; s <= 100; s += 5) {
    const x = xScale(s);
    grid += `<line x1="${x}" y1="${pad.t}" x2="${x}" y2="${pad.t+ph}" stroke="#e8e8e8" stroke-width="0.5"/>`;
    grid += `<text x="${x}" y="${pad.t+ph+18}" text-anchor="middle" font-size="11" fill="#555">${s}%</text>`;
  }
  for (let c = 50; c <= 250; c += 50) {
    const y = yScale(c);
    grid += `<line x1="${pad.l}" y1="${y}" x2="${pad.l+pw}" y2="${y}" stroke="#e8e8e8" stroke-width="0.5"/>`;
    grid += `<text x="${pad.l-8}" y="${y+4}" text-anchor="end" font-size="11" fill="#555">$${c}</text>`;
  }

  const svg = svgWrap(W, H, `
    ${grid}
    <!-- Pareto frontier -->
    <path d="${pathStr(paretoLine)}" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="6,3" opacity="0.6"/>
    <!-- Direction arrow -->
    <text x="${xScale(98)}" y="${yScale(70)}" font-size="11" fill="#888">← Better</text>
    <!-- Points -->
    ${methods.map(m => shape(m)).join('\n')}
    <!-- Labels (offset) -->
    ${methods.map(m => {
      const cx = xScale(m.sl), cy = yScale(m.cost);
      const dx = m.sl > 96 ? -8 : 10;
      const dy = m.cost > 180 ? -12 : 14;
      return `<text x="${(cx+dx).toFixed(1)}" y="${(cy+dy).toFixed(1)}" font-size="9.5" fill="#444" text-anchor="${m.sl>96?'end':'start'}">${m.label}</text>`;
    }).join('\n')}
    <!-- Axes -->
    <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${pad.t+ph}" stroke="#333" stroke-width="1.2"/>
    <line x1="${pad.l}" y1="${pad.t+ph}" x2="${pad.l+pw}" y2="${pad.t+ph}" stroke="#333" stroke-width="1.2"/>
    <!-- Labels -->
    <text x="${pad.l + pw/2}" y="${H-8}" text-anchor="middle" font-size="13" fill="#333">Service Level (%)</text>
    <text x="18" y="${pad.t + ph/2}" text-anchor="middle" font-size="13" fill="#333" transform="rotate(-90,18,${pad.t+ph/2})">Expected Total Cost ($)</text>
    <!-- Legend -->
    <rect x="${pad.l+pw-205}" y="${pad.t+4}" width="200" height="82" rx="4" fill="white" fill-opacity="0.92" stroke="#ccc"/>
    <circle cx="${pad.l+pw-188}" cy="${pad.t+20}" r="5" fill="#2563eb"/>
    <text x="${pad.l+pw-178}" y="${pad.t+24}" font-size="10.5" fill="#333">Distributionally Robust (DRO)</text>
    <polygon points="${pad.l+pw-188},${pad.t+30} ${pad.l+pw-183},${pad.t+37} ${pad.l+pw-188},${pad.t+44} ${pad.l+pw-193},${pad.t+37}" fill="#16a34a"/>
    <text x="${pad.l+pw-178}" y="${pad.t+41}" font-size="10.5" fill="#333">Stochastic Program (SP)</text>
    <polygon points="${pad.l+pw-188},${pad.t+50} ${pad.l+pw-183},${pad.t+60} ${pad.l+pw-193},${pad.t+60}" fill="#f59e0b"/>
    <text x="${pad.l+pw-178}" y="${pad.t+58}" font-size="10.5" fill="#333">Newsvendor (NV)</text>
    <rect x="${pad.l+pw-193}" y="${pad.t+66}" width="10" height="10" fill="#e74c3c"/>
    <text x="${pad.l+pw-178}" y="${pad.t+75}" font-size="10.5" fill="#333">Point Forecast Baseline</text>
  `);

  fs.writeFileSync(path.join(outDir, 'fig4-cost-service-frontier.svg'), svg);
  console.log('Created fig4-cost-service-frontier.svg');
}

// ─── Figure 5: KPI Boxplots ──────────────────────────────
function genKPIBoxplots() {
  const W = 780, H = 420;
  const pad = {l:65, r:25, t:35, b:75};
  const pw = W-pad.l-pad.r, ph = H-pad.t-pad.b;

  // 3 KPI groups x 2 models
  const groups = [
    {name: 'Stockout Rate (%)', modelA: {min:1,q1:3,med:5.5,q3:8,max:12}, modelB: {min:0.5,q1:1.5,med:2.8,q3:4,max:6}},
    {name: 'Holding Cost ($K)', modelA: {min:12,q1:18,med:22,q3:28,max:38}, modelB: {min:18,q1:24,med:29,q3:34,max:42}},
    {name: 'Total Cost ($K)',   modelA: {min:45,q1:58,med:72,q3:85,max:110}, modelB: {min:30,q1:42,med:52,q3:62,max:78}},
  ];

  const groupWidth = pw / groups.length;
  const boxW = 42;
  const gap = 10;

  let elements = '';

  groups.forEach((g, gi) => {
    const gx = pad.l + gi * groupWidth + groupWidth / 2;

    // Y scale per group
    const allVals = [g.modelA.min, g.modelA.max, g.modelB.min, g.modelB.max];
    const yMin = Math.min(...allVals) - 5;
    const yMax = Math.max(...allVals) + 5;
    const yScale = (v) => pad.t + ph - ((v - yMin) / (yMax - yMin)) * ph;

    // Y-axis ticks for this group
    const step = Math.ceil((yMax - yMin) / 5);
    for (let v = Math.ceil(yMin); v <= yMax; v += step) {
      const y = yScale(v);
      elements += `<line x1="${gx - boxW - gap}" y1="${y}" x2="${gx + boxW + gap}" y2="${y}" stroke="#f0f0f0" stroke-width="0.5"/>`;
      elements += `<text x="${gx - boxW - gap - 4}" y="${y+4}" text-anchor="end" font-size="9.5" fill="#888">${v}</text>`;
    }

    // Draw box for a model
    function drawBox(data, cx, color, label) {
      const bx = cx - boxW/2;
      elements += `<!-- ${label} -->`;
      // Whiskers
      elements += `<line x1="${cx}" y1="${yScale(data.max)}" x2="${cx}" y2="${yScale(data.q3)}" stroke="${color}" stroke-width="1.5"/>`;
      elements += `<line x1="${cx}" y1="${yScale(data.q1)}" x2="${cx}" y2="${yScale(data.min)}" stroke="${color}" stroke-width="1.5"/>`;
      // Caps
      elements += `<line x1="${cx-10}" y1="${yScale(data.max)}" x2="${cx+10}" y2="${yScale(data.max)}" stroke="${color}" stroke-width="1.5"/>`;
      elements += `<line x1="${cx-10}" y1="${yScale(data.min)}" x2="${cx+10}" y2="${yScale(data.min)}" stroke="${color}" stroke-width="1.5"/>`;
      // Box
      elements += `<rect x="${bx}" y="${yScale(data.q3)}" width="${boxW}" height="${yScale(data.q1)-yScale(data.q3)}" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.8" rx="2"/>`;
      // Median
      elements += `<line x1="${bx}" y1="${yScale(data.med)}" x2="${bx+boxW}" y2="${yScale(data.med)}" stroke="${color}" stroke-width="2.5"/>`;
    }

    drawBox(g.modelA, gx - boxW/2 - gap/2, '#e74c3c', 'Model A (lower RMSE)');
    drawBox(g.modelB, gx + boxW/2 + gap/2, '#2563eb', 'Model B (better calibrated)');

    // Group label
    elements += `<text x="${gx}" y="${pad.t+ph+22}" text-anchor="middle" font-size="12" fill="#333" font-weight="600">${g.name}</text>`;

    // Separator
    if (gi < groups.length - 1) {
      const sx = pad.l + (gi+1) * groupWidth;
      elements += `<line x1="${sx}" y1="${pad.t}" x2="${sx}" y2="${pad.t+ph}" stroke="#ddd" stroke-width="1" stroke-dasharray="4,4"/>`;
    }
  });

  const svg = svgWrap(W, H, `
    <!-- Border -->
    <rect x="${pad.l}" y="${pad.t}" width="${pw}" height="${ph}" fill="none" stroke="#ddd" stroke-width="0.5"/>
    ${elements}
    <!-- Legend -->
    <rect x="${pad.l + pw/2 - 170}" y="${H-40}" width="340" height="30" rx="4" fill="white" stroke="#ccc"/>
    <rect x="${pad.l + pw/2 - 155}" y="${H-33}" width="16" height="16" fill="#e74c3c" fill-opacity="0.2" stroke="#e74c3c" stroke-width="1.5" rx="2"/>
    <text x="${pad.l + pw/2 - 133}" y="${H-21}" font-size="11" fill="#333">Model A (lower RMSE)</text>
    <rect x="${pad.l + pw/2 + 30}" y="${H-33}" width="16" height="16" fill="#2563eb" fill-opacity="0.2" stroke="#2563eb" stroke-width="1.5" rx="2"/>
    <text x="${pad.l + pw/2 + 52}" y="${H-21}" font-size="11" fill="#333">Model B (better calibrated)</text>
  `);

  fs.writeFileSync(path.join(outDir, 'fig5-kpi-boxplots.svg'), svg);
  console.log('Created fig5-kpi-boxplots.svg');
}

// ─── Generate All ─────────────────────────────────────────
genFanChart();
genCalibrationCurve();
genCostServiceFrontier();
genKPIBoxplots();
console.log('All figures generated in', outDir);
