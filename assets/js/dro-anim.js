/* =====================================================
   Interactive DRO figures for the Optora blog posts.
   Dependency-free. Each <div class="dro-anim" data-anim="..." data-src="...">
   loads a JSON file exported from the experiment scripts and renders an
   inline SVG whose state is driven by a radius slider with autoplay.
   ===================================================== */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var PAL = ['#0f6fff', '#e4572e', '#17a398', '#8e44ad', '#f0a202', '#8c8c8c'];
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- tiny helpers ---------- */
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function div(cls, parent, text) {
    var e = document.createElement('div');
    e.className = cls;
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function lin(d0, d1, r0, r1) { return function (v) { return r0 + (v - d0) / (d1 - d0) * (r1 - r0); }; }
  function logs(d0, d1, r0, r1) {
    var l0 = Math.log(d0), l1 = Math.log(d1);
    return function (v) { return r0 + (Math.log(v) - l0) / (l1 - l0) * (r1 - r0); };
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function at(arr, p) {           // interpolate an array of frames (scalar or vector) at fractional index p
    var i = clamp(Math.floor(p), 0, arr.length - 2), t = clamp(p - i, 0, 1);
    var a = arr[i], b = arr[i + 1];
    if (typeof a === 'number') return lerp(a, b, t);
    var out = new Array(a.length);
    for (var k = 0; k < a.length; k++) out[k] = lerp(a[k], b[k], t);
    return out;
  }
  function polyline(xs, ys) {
    var s = '';
    for (var i = 0; i < xs.length; i++) s += (i ? 'L' : 'M') + xs[i].toFixed(1) + ',' + ys[i].toFixed(1);
    return s;
  }
  function fmt(v, nd) { return Number(v).toFixed(nd); }
  function pct(v) { return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + '%'; }
  function heat(q) {              // worst-case weight ratio -> colour (cool below 1, hot above)
    var stops = [[0, [160, 196, 240]], [1, [160, 196, 240]], [2, [240, 162, 2]], [4, [215, 48, 31]]];
    q = clamp(q, 0, 4);
    for (var i = 0; i < stops.length - 1; i++) {
      if (q <= stops[i + 1][0]) {
        var t = (q - stops[i][0]) / (stops[i + 1][0] - stops[i][0]);
        var c = stops[i][1].map(function (a, k) { return Math.round(lerp(a, stops[i + 1][1][k], t)); });
        return 'rgb(' + c.join(',') + ')';
      }
    }
    return 'rgb(215,48,31)';
  }
  function gridY(g, sc, ticks, x0, x1, fmtf) {
    ticks.forEach(function (t) {
      el('line', { x1: x0, x2: x1, y1: sc(t), y2: sc(t), 'class': 'grid' }, g);
      el('text', { x: x0 - 6, y: sc(t) + 4, 'text-anchor': 'end' }, g).textContent = fmtf ? fmtf(t) : t;
    });
  }
  function ticksX(g, sc, ticks, y, fmtf) {
    ticks.forEach(function (t) {
      el('line', { x1: sc(t), x2: sc(t), y1: y, y2: y + 4, 'class': 'axis' }, g);
      el('text', { x: sc(t), y: y + 16, 'text-anchor': 'middle' }, g).textContent = fmtf ? fmtf(t) : t;
    });
  }
  function label(g, x, y, text, anchor, cls) {
    var t = el('text', { x: x, y: y, 'text-anchor': anchor || 'start', 'class': cls || 'muted' }, g);
    t.textContent = text;
    return t;
  }
  function chip(host, name) {
    var s = document.createElement('span');
    s.innerHTML = name + ' <b></b>';
    host.appendChild(s);
    return s.querySelector('b');
  }

  /* ---------- controls: play button, slider, autoplay ---------- */
  function controls(root, nFrames, onFrame, valueFormat) {
    var head = div('dro-anim__head', root);
    div('dro-anim__title', head, root.getAttribute('data-title') || 'Interactive figure');
    div('dro-anim__hint', head, 'Press play or drag the slider');
    var host = div('dro-anim__svg', root);
    var bar = div('dro-anim__controls', root);
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'dro-anim__play'; btn.setAttribute('aria-label', 'Play');
    btn.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path class="ic-play" d="M4 2.5v11l9-5.5z"/><path class="ic-pause" d="M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z"/></svg>';
    bar.appendChild(btn);
    var range = document.createElement('input');
    range.type = 'range'; range.min = 0; range.max = nFrames - 1; range.step = 0.01; range.value = 0;
    range.className = 'dro-anim__range'; range.setAttribute('aria-label', 'Radius');
    bar.appendChild(range);
    var val = div('dro-anim__value', bar);
    var readout = div('dro-anim__readout', root);

    var p = 0, playing = false, dir = 1, last = 0, raf = 0, SWEEP = 9000;
    function set(np) {
      p = clamp(np, 0, nFrames - 1);
      range.value = p;
      val.textContent = valueFormat(p);
      onFrame(p);
    }
    function step(ts) {
      if (!playing) return;
      if (last) {
        p += dir * (ts - last) / SWEEP * (nFrames - 1);
        if (p >= nFrames - 1) { p = nFrames - 1; dir = -1; }
        if (p <= 0) { p = 0; dir = 1; }
        set(p);
      }
      last = ts;
      raf = requestAnimationFrame(step);
    }
    function play() { if (playing) return; playing = true; last = 0; root.classList.add('is-playing'); btn.setAttribute('aria-label', 'Pause'); raf = requestAnimationFrame(step); }
    function pause() { playing = false; cancelAnimationFrame(raf); root.classList.remove('is-playing'); btn.setAttribute('aria-label', 'Play'); }
    btn.addEventListener('click', function () { playing ? pause() : play(); });
    range.addEventListener('input', function () { pause(); set(parseFloat(range.value)); });

    if (!REDUCED && 'IntersectionObserver' in window) {
      var seen = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !seen) { seen = true; play(); }
          else if (!en.isIntersecting && playing) { pause(); seen = false; }
        });
      }, { threshold: 0.35 });
      io.observe(root);
    }
    return { host: host, readout: readout, set: set };
  }

  /* ---------- 1. Portfolio: weights and the adversary ---------- */
  function portfolio(root, d) {
    var n = d.radii.length, W = 760, H = 340;
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Portfolio weights and worst-case month weights as the Wasserstein radius changes' });
    var gL = el('g', {}, svg), gR = el('g', {}, svg);
    label(gL, 20, 22, 'Portfolio weights', 'start', 'title');
    label(gR, 420, 22, 'Worst-case weight on each training month', 'start', 'title');
    var bars = [], vals = [], bx = 118, bw = 210;
    d.assets.forEach(function (a, i) {
      var y = 48 + i * 42;
      label(gL, bx - 8, y + 15, a, 'end', 'muted');
      el('rect', { x: bx, y: y, width: bw, height: 22, rx: 4, 'class': 'track' }, gL);
      bars.push(el('rect', { x: bx, y: y, width: 0, height: 22, rx: 4, fill: PAL[i] }, gL));
      vals.push(label(gL, bx + 6, y + 15, '', 'start', 'value'));
    });
    var ex = d.months.map(function (m) { return m[0]; }), bd = d.months.map(function (m) { return m[1]; });
    var sx = lin(Math.min.apply(null, ex) - 1, Math.max.apply(null, ex) + 1, 440, 740);
    var sy = lin(Math.min.apply(null, bd) - 0.5, Math.max.apply(null, bd) + 0.5, 300, 40);
    gridY(gR, sy, [-4, -2, 0, 2, 4], 440, 740, function (t) { return t + '%'; });
    ticksX(gR, sx, [-5, 0, 5], 300, function (t) { return t + '%'; });
    label(gR, 590, 332, 'Equity basket return in the month', 'middle', 'muted');
    label(gR, 404, 170, 'Bond basket return', 'middle', 'muted').setAttribute('transform', 'rotate(-90 404 170)');
    var dots = d.months.map(function (m) {
      return el('circle', { cx: sx(m[0]), cy: sy(m[1]), r: 5, fill: heat(1), 'fill-opacity': 0.85, stroke: 'rgba(0,0,0,0.25)', 'stroke-width': 0.5 }, gR);
    });
    var ui = controls(root, n, frame, function (p) { return 'ρ = ' + fmt(at(d.radii, p), 3); });
    ui.host.appendChild(svg);
    var cIn = chip(ui.readout, 'In-sample return'), cNo = chip(ui.readout, 'Normal regime'), cSt = chip(ui.readout, 'Stress regime'), cCv = chip(ui.readout, 'Stress CVaR 5%'), cMo = chip(ui.readout, 'Months above nominal weight');
    function frame(p) {
      var w = at(d.weights, p), q = at(d.q, p), above = 0;
      for (var i = 0; i < w.length; i++) {
        bars[i].setAttribute('width', (w[i] * bw).toFixed(1));
        vals[i].textContent = (w[i] * 100).toFixed(0) + '%';
        vals[i].setAttribute('x', bx + Math.max(w[i] * bw + 6, 6));
      }
      for (var j = 0; j < q.length; j++) {
        dots[j].setAttribute('r', (2.5 + 3.6 * Math.sqrt(Math.max(q[j], 0))).toFixed(2));
        dots[j].setAttribute('fill', heat(q[j]));
        if (q[j] > 1.5) above++;
      }
      cIn.textContent = pct(at(d.insample, p)); cNo.textContent = pct(at(d.normal, p)); cSt.textContent = pct(at(d.stress, p));
      cCv.textContent = fmt(at(d.stress_cvar, p), 1) + '% / month'; cMo.textContent = above;
    }
    ui.set(0);
  }

  /* ---------- 2. Lipschitz: the worst-case distribution and the three curves ---------- */
  function lipschitz(root, d) {
    var n = d.radii.length, W = 760, H = 360;
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Worst-case distribution on the support and the worst-case value against the radius' });
    var gT = el('g', {}, svg), gB = el('g', {}, svg);
    label(gT, 20, 22, 'Worst-case weight relative to nominal, by support point', 'start', 'title');
    var zx = lin(-2.7, 2.7, 50, 740), base = 180;
    var zh = function (q) { return 130 * Math.sqrt(clamp(q, 0, 25)) / 5; };
    el('line', { x1: 50, x2: 740, y1: base, y2: base, 'class': 'axis' }, gT);
    el('line', { x1: 50, x2: 740, y1: base - zh(1), y2: base - zh(1), 'class': 'grid', 'stroke-dasharray': '3 3' }, gT);
    label(gT, 744, base - zh(1) + 4, 'nominal', 'start', 'muted');
    ticksX(gT, zx, [-2, -1, 0, 1, 2], base, function (t) { return 'z = ' + t; });
    var bars = d.z.map(function (z, i) {
      return el('rect', { x: zx(z) - 4, y: base - zh(1), width: 8, height: zh(1), rx: 1.5, fill: PAL[0], 'fill-opacity': 0.85 }, gT);
    });
    var top = label(gT, 0, 0, '', 'middle', 'value');
    // bottom: curves vs log radius
    var rx = logs(d.radii[0], d.radii[n - 1], 60, 740), ry = lin(0.6, 4.2, 345, 225);
    gridY(gB, ry, [1, 2, 3, 4], 60, 740);
    ticksX(gB, rx, [0.001, 0.01, 0.1, 1], 345, function (t) { return 'ρ = ' + t; });
    el('line', { x1: 60, x2: 740, y1: ry(d.max_loss), y2: ry(d.max_loss), 'class': 'grid', 'stroke-dasharray': '3 3' }, gB);
    label(gB, 64, ry(d.max_loss) - 4, 'largest loss on the support', 'start', 'muted');
    var xs = d.radii.map(rx);
    el('path', { d: polyline(xs, d.radii.map(function (r) { return ry(d.mean + r); })), fill: 'none', stroke: PAL[1], 'stroke-width': 2, 'stroke-dasharray': '5 4' }, gB);
    el('path', { d: polyline(xs, d.radii.map(function (r) { return ry(d.mean + r * d.L_n); })), fill: 'none', stroke: PAL[2], 'stroke-width': 2, 'stroke-dasharray': '2 3' }, gB);
    el('path', { d: polyline(xs, d.exact.map(ry)), fill: 'none', stroke: PAL[0], 'stroke-width': 2.4 }, gB);
    label(gB, 64, 222, 'exact worst case', 'start', 'legend').setAttribute('fill', PAL[0]);
    label(gB, 190, 222, 'E[ℓ] + ρ · Lip', 'start', 'legend').setAttribute('fill', PAL[1]);
    label(gB, 290, 222, 'E[ℓ] + ρ · Lₙ', 'start', 'legend').setAttribute('fill', PAL[2]);
    var cursor = el('line', { y1: 225, y2: 345, 'class': 'axis', 'stroke-dasharray': '2 2' }, gB);
    var dot = el('circle', { r: 5.5, fill: PAL[0], stroke: '#fff', 'stroke-width': 1.5 }, gB);
    var ui = controls(root, n, frame, function (p) { return 'ρ = ' + fmt(at(d.radii, p), 4); });
    ui.host.appendChild(svg);
    var cEx = chip(ui.readout, 'Exact worst case'), cSu = chip(ui.readout, 'Lipschitz surrogate'), cGap = chip(ui.readout, 'Gap / ρ'), cTop = chip(ui.readout, 'Mass on the largest point'), cEmp = chip(ui.readout, 'Support points emptied');
    function frame(p) {
      var q = at(d.q, p), r = at(d.radii, p), ex = at(d.exact, p), emptied = 0;
      for (var i = 0; i < q.length; i++) {
        var h = zh(q[i]);
        bars[i].setAttribute('y', (base - h).toFixed(1)); bars[i].setAttribute('height', h.toFixed(1));
        bars[i].setAttribute('fill', q[i] > 1.05 ? PAL[1] : q[i] < 0.95 ? PAL[5] : PAL[0]);
        if (q[i] < 0.02) emptied++;
      }
      var qm = q[q.length - 1];
      top.setAttribute('x', zx(d.z[q.length - 1])); top.setAttribute('y', base - zh(qm) - 6); top.textContent = '×' + fmt(qm, 1);
      var cx = rx(r); cursor.setAttribute('x1', cx); cursor.setAttribute('x2', cx); dot.setAttribute('cx', cx); dot.setAttribute('cy', ry(ex));
      cEx.textContent = fmt(ex, 3); cSu.textContent = fmt(d.mean + r, 3); cGap.textContent = fmt((d.mean + r - ex) / r, 3);
      cTop.textContent = (qm / q.length * 100).toFixed(1) + '%'; cEmp.textContent = emptied + ' of ' + q.length;
    }
    ui.set(0);
  }

  /* ---------- 3. Energy: schedule, stress days and the adversary ---------- */
  function energy(root, d) {
    var n = d.radii.length, W = 760, H = 340, T = 24;
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Hourly net load with the robust schedule and the worst-case weight of each training day' });
    var gL = el('g', {}, svg), gR = el('g', {}, svg);
    label(gL, 20, 22, 'Hourly net load and scheduled firm capacity (MW)', 'start', 'title');
    label(gR, 500, 22, 'Worst-case weight on each training day', 'start', 'title');
    var hx = lin(0, 23, 50, 450), my = lin(300, 2300, 300, 40);
    gridY(gL, my, [500, 1000, 1500, 2000], 50, 450);
    ticksX(gL, hx, [0, 6, 12, 18, 23], 300, function (t) { return t + ':00'; });
    var hs = [];
    for (var t = 0; t < T; t++) hs.push(hx(t));
    function band(lo, hi, op) {
      var p = polyline(hs, lo.map(my)) + polyline(hs.slice().reverse(), hi.slice().reverse().map(my)).replace('M', 'L') + 'Z';
      el('path', { d: p, fill: PAL[0], 'fill-opacity': op }, gL);
    }
    band(d.bands[0], d.bands[4], 0.10); band(d.bands[1], d.bands[3], 0.2);
    el('path', { d: polyline(hs, d.bands[2].map(my)), fill: 'none', stroke: PAL[0], 'stroke-width': 1.2 }, gL);
    el('path', { d: polyline(hs, d.stress95.map(my)), fill: 'none', stroke: PAL[1], 'stroke-width': 1.2, 'stroke-dasharray': '3 3' }, gL);
    var dayLines = d.days.map(function (day) {
      return el('path', { d: polyline(hs, day.map(my)), fill: 'none', stroke: PAL[1], 'stroke-width': 1, 'stroke-opacity': 0 }, gL);
    });
    var sched = el('path', { d: '', fill: 'none', stroke: PAL[2], 'stroke-width': 3, 'stroke-linejoin': 'round' }, gL);
    label(gL, 54, 44, 'band: training-year 5–95% and 25–75%', 'start', 'muted');
    label(gL, 54, 58, 'dashed red: stress-year 95% quantile', 'start', 'muted');
    label(gL, 54, 72, 'red lines: days the adversary upweights', 'start', 'muted');
    var sx = lin(0, 1, 520, 740), sy = lin(500, 2300, 300, 40);
    gridY(gR, sy, [1000, 1500, 2000], 520, 740);
    ticksX(gR, sx, [0, 0.25, 0.5, 0.75, 1], 300);
    label(gR, 630, 332, 'Daily mean wind capacity factor', 'middle', 'muted');
    label(gR, 482, 170, 'Peak net load (MW)', 'middle', 'muted').setAttribute('transform', 'rotate(-90 482 170)');
    var dots = d.wind_cf.map(function (cf, i) {
      return el('circle', { cx: sx(cf), cy: sy(d.peak[i]), r: 4, fill: heat(1), 'fill-opacity': 0.85, stroke: 'rgba(0,0,0,0.25)', 'stroke-width': 0.5 }, gR);
    });
    var ui = controls(root, n, frame, function (p) { return 'KL ρ = ' + fmt(at(d.radii, p), 3); });
    ui.host.appendChild(svg);
    var cCo = chip(ui.readout, 'Committed MWh/day'), cNc = chip(ui.readout, 'Normal-year cost'), cSc = chip(ui.readout, 'Stress-year cost'), cLo = chip(ui.readout, 'Stress-year hours short'), cUn = chip(ui.readout, 'Stress-year unserved');
    function frame(p) {
      var x = at(d.schedule, p), q = at(d.q, p);
      sched.setAttribute('d', polyline(hs, x.map(my)));
      for (var i = 0; i < q.length; i++) {
        dayLines[i].setAttribute('stroke-opacity', clamp((q[i] - 1.25) / 2.5, 0, 0.7).toFixed(2));
        dots[i].setAttribute('r', (2.2 + 3.2 * Math.sqrt(Math.max(q[i], 0))).toFixed(2));
        dots[i].setAttribute('fill', heat(q[i]));
      }
      cCo.textContent = Math.round(at(d.committed, p)).toLocaleString('en-GB');
      cNc.textContent = '£' + Math.round(at(d.normal_cost, p)).toLocaleString('en-GB') + 'k';
      cSc.textContent = '£' + Math.round(at(d.stress_cost, p)).toLocaleString('en-GB') + 'k';
      cLo.textContent = (at(d.stress_lolp, p) * 100).toFixed(1) + '%';
      cUn.textContent = Math.round(at(d.stress_unserved, p)) + ' MWh/day';
    }
    ui.set(0);
  }

  /* ---------- 4. Subpopulation shift: who gets upweighted and the risk line ---------- */
  function subpop(root, d) {
    var n = d.radii.length, W = 760, H = 340;
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Training points sized by worst-case weight and test risk against the minority share' });
    var gL = el('g', {}, svg), gR = el('g', {}, svg);
    label(gL, 20, 22, 'Training points, sized by worst-case weight', 'start', 'title');
    label(gR, 430, 22, 'Exact test risk against the minority share', 'start', 'title');
    var px = lin(-3.2, 3.2, 40, 400), py = lin(-5.5, 5.5, 300, 40);
    gridY(gL, py, [-4, -2, 0, 2, 4], 40, 400);
    ticksX(gL, px, [-3, -2, -1, 0, 1, 2, 3], 300);
    label(gL, 220, 332, 'x₂  (the feature on which the groups differ)', 'middle', 'muted');
    label(gL, 20, 170, 'y − x₁', 'middle', 'muted').setAttribute('transform', 'rotate(-90 20 170)');
    var ermLine = el('line', { stroke: PAL[5], 'stroke-dasharray': '4 3', 'stroke-width': 1.5 }, gL);
    var fitLine = el('line', { stroke: PAL[2], 'stroke-width': 3, 'stroke-linecap': 'round' }, gL);
    var order = [];
    d.group.forEach(function (g, i) { if (g === 0) order.push(i); });
    d.group.forEach(function (g, i) { if (g === 1) order.push(i); });
    var dots = new Array(d.group.length);
    order.forEach(function (i) {
      dots[i] = el('circle', { cx: px(d.x2[i]), cy: py(d.y_minus_x1[i]), r: 3, fill: d.group[i] ? PAL[1] : PAL[0], 'fill-opacity': d.group[i] ? 0.9 : 0.5, stroke: 'rgba(0,0,0,0.25)', 'stroke-width': 0.5 }, gL);
    });
    label(gL, 44, 44, 'blue: majority group A', 'start', 'legend').setAttribute('fill', PAL[0]);
    label(gL, 44, 58, 'red: minority group B', 'start', 'legend').setAttribute('fill', PAL[1]);
    label(gL, 44, 72, 'green: fitted slope on x₂ (dashed: ERM)', 'start', 'legend').setAttribute('fill', PAL[2]);
    var qx = lin(0, 1, 470, 740), qy = lin(0, 2.3, 300, 40);
    gridY(gR, qy, [0.5, 1, 1.5, 2], 470, 740);
    ticksX(gR, qx, [0, 0.25, 0.5, 0.75, 1], 300);
    label(gR, 605, 332, 'Share π of the minority group at test time', 'middle', 'muted');
    el('line', { x1: qx(0.1), x2: qx(0.1), y1: 40, y2: 300, 'class': 'grid', 'stroke-dasharray': '3 3' }, gR);
    label(gR, qx(0.1) + 4, 52, 'training share', 'start', 'muted');
    var RA0 = d.RA[0], RB0 = d.RB[0];
    el('line', { x1: qx(0), y1: qy(RA0), x2: qx(1), y2: qy(RB0), stroke: PAL[1], 'stroke-width': 2, 'stroke-dasharray': '5 4' }, gR);
    label(gR, qx(1) - 2, qy(RB0) - 8, 'ERM', 'end', 'legend').setAttribute('fill', PAL[1]);
    var cur = el('line', { stroke: PAL[2], 'stroke-width': 3, 'stroke-linecap': 'round' }, gR);
    var cross = el('circle', { r: 6, fill: PAL[2], stroke: '#fff', 'stroke-width': 1.5 }, gR);
    var crossT = label(gR, 0, 0, '', 'start', 'value');
    var ui = controls(root, n, frame, function (p) { return 'KL ρ = ' + fmt(at(d.radii, p), 3); });
    ui.host.appendChild(svg);
    var cA = chip(ui.readout, 'Majority risk R_A'), cB = chip(ui.readout, 'Minority risk R_B'), cM = chip(ui.readout, 'Mass on the minority'), cP = chip(ui.readout, 'Beats ERM once π exceeds');
    var pis = d.pi_star.map(function (v, i) { return v == null ? (d.pi_star[1] || 0.1) : v; });
    function frame(p) {
      var w = at(d.w, p), b = at(d.b, p), q = at(d.q0, p), RA = at(d.RA, p), RB = at(d.RB, p), ps = at(pis, p);
      ermLine.setAttribute('x1', px(-3.2)); ermLine.setAttribute('x2', px(3.2));
      ermLine.setAttribute('y1', py(d.w[0][1] * -3.2 + d.b[0])); ermLine.setAttribute('y2', py(d.w[0][1] * 3.2 + d.b[0]));
      fitLine.setAttribute('x1', px(-3.2)); fitLine.setAttribute('x2', px(3.2));
      fitLine.setAttribute('y1', py(w[1] * -3.2 + b)); fitLine.setAttribute('y2', py(w[1] * 3.2 + b));
      for (var i = 0; i < q.length; i++) dots[i].setAttribute('r', (1.8 + 2.4 * Math.sqrt(Math.max(q[i], 0))).toFixed(2));
      cur.setAttribute('x1', qx(0)); cur.setAttribute('y1', qy(RA)); cur.setAttribute('x2', qx(1)); cur.setAttribute('y2', qy(RB));
      var show = p > 0.5;
      cross.setAttribute('opacity', show ? 1 : 0); crossT.setAttribute('opacity', show ? 1 : 0);
      cross.setAttribute('cx', qx(ps)); cross.setAttribute('cy', qy(RA0 * (1 - ps) + RB0 * ps));
      crossT.setAttribute('x', qx(ps) + 9); crossT.setAttribute('y', qy(RA0 * (1 - ps) + RB0 * ps) + 4); crossT.textContent = 'π* = ' + fmt(ps, 2);
      cA.textContent = fmt(RA, 3); cB.textContent = fmt(RB, 3); cM.textContent = (at(d.qB, p) * 100).toFixed(1) + '%';
      cP.textContent = show ? fmt(ps, 2) : '—';
    }
    ui.set(0);
  }

  var BUILDERS = { portfolio: portfolio, lipschitz: lipschitz, energy: energy, subpop: subpop };

  function init() {
    document.querySelectorAll('.dro-anim[data-anim]').forEach(function (root) {
      var build = BUILDERS[root.getAttribute('data-anim')];
      if (!build) return;
      fetch(root.getAttribute('data-src')).then(function (r) { return r.json(); }).then(function (data) {
        root.innerHTML = '';
        build(root, data);
      }).catch(function (err) {
        if (window.console) console.error('dro-anim:', err);
        root.innerHTML = '<p class="dro-anim__error">The interactive figure could not be loaded.</p>';
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
