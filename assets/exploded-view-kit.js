/* exploded-view-kit.js — exploded-view engine for Socratic Workshop exploded-views.
   Inline this file into the output page; it has no dependencies and no imports.
   Sections: math, colour, primitives, materials, gl renderer, camera path,
   explode, interaction, ui, boot. The page supplies: a mount element, a parts
   truth table, and the glass CSS it uses (see exploded-view/examples/). */
(function () {
'use strict';

/* ---------------- math ---------------- */

function v3(x, y, z) { return [x, y, z]; }
function sub3(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function cross3(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function dot3(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function norm3(a) { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
function mix(a, b, t) { return a + (b - a) * t; }
function mix3(a, b, t) { return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)]; }
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

function perspective(fovY, aspect, near, far) {
  const f = 1 / Math.tan(fovY / 2);
  return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, 2 * far * near / (near - far), 0];
}
function lookAt(eye, target, up) {
  const z = norm3(sub3(eye, target));
  const x = norm3(cross3(up, z));
  const y = cross3(z, x);
  return [
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dot3(x, eye), -dot3(y, eye), -dot3(z, eye), 1,
  ];
}
function mul4(a, b) {
  const o = new Array(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
    o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
  }
  return o;
}
function xformPoint(m, p) {
  const w = m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15];
  return [
    (m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12]) / w,
    (m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13]) / w,
    (m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14]) / w,
  ];
}
/* Small TRS matrix for baking primitive transforms into part-local vertices. */
function trs(at, rot, scale) {
  const s = scale || [1, 1, 1];
  const r = rot || [0, 0, 0];
  const cx = Math.cos(r[0]), sx = Math.sin(r[0]);
  const cy = Math.cos(r[1]), sy = Math.sin(r[1]);
  const cz = Math.cos(r[2]), sz = Math.sin(r[2]);
  const m = [
    cy * cz, sx * sy * cz + cx * sz, -cx * sy * cz + sx * sz, 0,
    -cy * sz, -sx * sy * sz + cx * cz, cx * sy * sz + sx * cz, 0,
    sy, -sx * cy, cx * cy, 0,
    at[0], at[1], at[2], 1,
  ];
  const sc = [s[0], 0, 0, 0, 0, s[1], 0, 0, 0, 0, s[2], 0, 0, 0, 0, 1];
  return mul4(m, sc);
}

/* ---------------- colour ---------------- */

/* oklch(L C h) -> linear sRGB */
function oklchToLinear(L, C, h) {
  const a = C * Math.cos(h * Math.PI / 180), b = C * Math.sin(h * Math.PI / 180);
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541729 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3);
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}
function oklabNeutralLinear(L) { return oklchToLinear(L, 0, 0); }
function parseOklch(text) {
  const m = text.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  return m ? oklchToLinear(+m[1], +m[2], +m[3]) : [1, 1, 1];
}
function parseRgb(text) {
  const m = text.match(/rgba?\(\s*([\d.]+)/);
  return m ? +m[1] / 255 : 1;
}
function srgbToLinear(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }

/* ---------------- primitives ---------------- */
/* Each returns {pos, nrm, idx} built centred at the origin, y up, mm. */

function pushQuad(pos, nrm, idx, a, b, c, d, n) {
  const base = pos.length / 3;
  pos.push(...a, ...b, ...c, ...d);
  for (let i = 0; i < 4; i++) nrm.push(...n);
  idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
}
function box(w, h, d) {
  const x = w / 2, y = h / 2, z = d / 2;
  const pos = [], nrm = [], idx = [];
  pushQuad(pos, nrm, idx, [-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z], [0, 0, 1]);
  pushQuad(pos, nrm, idx, [x, -y, -z], [-x, -y, -z], [-x, y, -z], [x, y, -z], [0, 0, -1]);
  pushQuad(pos, nrm, idx, [x, -y, z], [x, -y, -z], [x, y, -z], [x, y, z], [1, 0, 0]);
  pushQuad(pos, nrm, idx, [-x, -y, -z], [-x, -y, z], [-x, y, z], [-x, y, -z], [-1, 0, 0]);
  pushQuad(pos, nrm, idx, [-x, y, z], [x, y, z], [x, y, -z], [-x, y, -z], [0, 1, 0]);
  pushQuad(pos, nrm, idx, [-x, -y, -z], [x, -y, -z], [x, -y, z], [-x, -y, z], [0, -1, 0]);
  return { pos, nrm, idx };
}
/* Rounded box: prism whose xz cross-section is a rounded rectangle (vertical
   edges rounded, flat caps). */
function roundedBox(w, h, d, r, seg) {
  const hx = w / 2 - r, hz = d / 2 - r;
  const outline = [];
  const corners = [
    [hx, hz, 0], [-hx, hz, Math.PI / 2], [-hx, -hz, Math.PI], [hx, -hz, Math.PI * 1.5],
  ];
  for (const [cx, cz, a0] of corners) {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (i / seg) * Math.PI / 2;
      outline.push({ p: [cx + r * Math.cos(a), cz + r * Math.sin(a)], n: [Math.cos(a), 0, Math.sin(a)] });
    }
  }
  const n = outline.length;
  const pos = [], nrm = [], idx = [];
  const y0 = -h / 2, y1 = h / 2;
  for (let i = 0; i < n; i++) {
    const A = outline[i], B = outline[(i + 1) % n];
    const base = pos.length / 3;
    pos.push(A.p[0], y0, A.p[1], B.p[0], y0, B.p[1], B.p[0], y1, B.p[1], A.p[0], y1, A.p[1]);
    nrm.push(...A.n, ...B.n, ...B.n, ...A.n);
    idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  const topBase = pos.length / 3;
  outline.forEach(o => { pos.push(o.p[0], y1, o.p[1]); nrm.push(0, 1, 0); });
  const botBase = pos.length / 3;
  outline.forEach(o => { pos.push(o.p[0], y0, o.p[1]); nrm.push(0, -1, 0); });
  for (let i = 1; i < n - 1; i++) {
    idx.push(topBase, topBase + i, topBase + i + 1);
    idx.push(botBase, botBase + i + 1, botBase + i);
  }
  return { pos, nrm, idx };
}
/* Solid truncated cone, base r1 at -h/2, top r2 at +h/2. */
function frustum(r1, r2, h, seg) {
  const pos = [], nrm = [], idx = [];
  const slope = (r1 - r2) / h;
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    const c = Math.cos(a), s = Math.sin(a);
    const n = norm3([c, slope, s]);
    pos.push(r1 * c, -h / 2, r1 * s, r2 * c, h / 2, r2 * s);
    nrm.push(...n, ...n);
  }
  for (let i = 0; i < seg; i++) {
    const b = i * 2;
    idx.push(b, b + 2, b + 3, b, b + 3, b + 1);
  }
  for (const [y, r, ny] of [[-h / 2, r1, -1], [h / 2, r2, 1]]) {
    const centre = pos.length / 3;
    pos.push(0, y, 0); nrm.push(0, ny, 0);
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      pos.push(r * Math.cos(a), y, r * Math.sin(a));
      nrm.push(0, ny, 0);
    }
    for (let i = 0; i < seg; i++) {
      if (ny > 0) idx.push(centre, centre + 1 + i + 1, centre + 1 + i);
      else idx.push(centre, centre + 1 + i, centre + 1 + i + 1);
    }
  }
  return { pos, nrm, idx };
}
function cylinder(r, h, seg) { return frustum(r, r, h, seg); }
/* Hollow wall: outer wall, inner wall, two annuli. */
function ring(rOut, rIn, h, seg) {
  const pos = [], nrm = [], idx = [];
  const y0 = -h / 2, y1 = h / 2;
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    const c = Math.cos(a), s = Math.sin(a);
    pos.push(rOut * c, y0, rOut * s, rOut * c, y1, rOut * s);
    nrm.push(c, 0, s, c, 0, s);
    pos.push(rIn * c, y0, rIn * s, rIn * c, y1, rIn * s);
    nrm.push(-c, 0, -s, -c, 0, -s);
    pos.push(rOut * c, y1, rOut * s, rIn * c, y1, rIn * s);
    nrm.push(0, 1, 0, 0, 1, 0);
    pos.push(rOut * c, y0, rOut * s, rIn * c, y0, rIn * s);
    nrm.push(0, -1, 0, 0, -1, 0);
  }
  for (let i = 0; i < seg; i++) {
    const b = i * 8, n = (i + 1) * 8;
    idx.push(b, n, n + 1, b, n + 1, b + 1);                 // outer
    idx.push(b + 2, b + 3, n + 3, b + 2, n + 3, n + 2);     // inner
    idx.push(b + 4, n + 4, n + 5, b + 4, n + 5, b + 5);     // top annulus
    idx.push(b + 6, b + 7, n + 7, b + 6, n + 7, n + 6);     // bottom annulus
  }
  return { pos, nrm, idx };
}
function helix(radius, wire, turns, height, segPerTurn = 14, sides = 7) {
  const steps = Math.max(2, Math.round(turns * segPerTurn));
  const pos = [], nrm = [], idx = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * turns * Math.PI * 2;
    const p = [radius * Math.cos(a), height * (t - 0.5), radius * Math.sin(a)];
    const tau = norm3([-radius * Math.sin(a), height / (turns * Math.PI * 2), radius * Math.cos(a)]);
    const b = norm3(cross3(tau, [0, 1, 0]));
    const n = cross3(b, tau);
    for (let j = 0; j <= sides; j++) {
      const phi = (j / sides) * Math.PI * 2;
      const dir = [n[0] * Math.cos(phi) + b[0] * Math.sin(phi), n[1] * Math.cos(phi) + b[1] * Math.sin(phi), n[2] * Math.cos(phi) + b[2] * Math.sin(phi)];
      pos.push(p[0] + dir[0] * wire, p[1] + dir[1] * wire, p[2] + dir[2] * wire);
      nrm.push(...dir);
    }
  }
  const ring = sides + 1;
  for (let i = 0; i < steps; i++) for (let j = 0; j < sides; j++) {
    const b = i * ring + j;
    idx.push(b, b + ring, b + ring + 1, b, b + ring + 1, b + 1);
  }
  return { pos, nrm, idx };
}
/* Convex 2D polygon (points [[x,z],…] CCW seen from +y) extruded in y, centred. */
function extrudeConvex(points, h) {
  const n = points.length;
  const pos = [], nrm = [], idx = [];
  const y0 = -h / 2, y1 = h / 2;
  for (let i = 0; i < n; i++) {
    const [x1, z1] = points[i], [x2, z2] = points[(i + 1) % n];
    const e = norm3([x2 - x1, 0, z2 - z1]);
    const normal = [e[2], 0, -e[0]];
    pushQuad(pos, nrm, idx, [x1, y0, z1], [x2, y0, z2], [x2, y1, z2], [x1, y1, z1], normal);
  }
  const tb = pos.length / 3;
  points.forEach(([x, z]) => { pos.push(x, y1, z); nrm.push(0, 1, 0); });
  const bb = pos.length / 3;
  points.forEach(([x, z]) => { pos.push(x, y0, z); nrm.push(0, -1, 0); });
  for (let i = 1; i < n - 1; i++) {
    idx.push(tb, tb + i, tb + i + 1);
    idx.push(bb, bb + i + 1, bb + i);
  }
  return { pos, nrm, idx };
}
function custom(pos, nrm, idx) { return { pos, nrm, idx }; }

/* Crease lines: mesh edges where adjacent face normals differ by more than 30°.
   Vertices are canonicalised by position so per-face duplicates still match. */
function creaseEdges(g){
  const P = g.pos, N = g.nrm, I = g.idx, out = [];
  const key = i => `${Math.round(P[i*3]*1e4)},${Math.round(P[i*3+1]*1e4)},${Math.round(P[i*3+2]*1e4)}`;
  const canon = new Map(), cid = new Array(P.length/3);
  for(let i = 0; i < cid.length; i++){ const k = key(i); if(!canon.has(k)) canon.set(k, i); cid[i] = canon.get(k); }
  const edges = new Map();
  for(let t = 0; t < I.length; t += 3){
    const tri = [I[t], I[t+1], I[t+2]];
    const n = [N[tri[0]*3], N[tri[0]*3+1], N[tri[0]*3+2]];
    for(let e = 0; e < 3; e++){
      const u = cid[tri[e]], v = cid[tri[(e+1)%3]];
      const k = u < v ? u+'_'+v : v+'_'+u;
      let E = edges.get(k);
      if(!E){ E = { a: [P[u*3],P[u*3+1],P[u*3+2]], b: [P[v*3],P[v*3+1],P[v*3+2]], ns: [] }; edges.set(k, E); }
      E.ns.push(n);
    }
  }
  const COS = Math.cos(30 * Math.PI / 180);
  for(const E of edges.values()){
    if(E.ns.length !== 2) continue;
    if(dot3(E.ns[0], E.ns[1]) < COS) out.push(E.a[0],E.a[1],E.a[2], E.b[0],E.b[1],E.b[2]);
  }
  return out;
}

const GEOM = { box, roundedBox, cylinder, frustum, ring, helix, extrudeConvex, custom };

/* ---------------- materials ---------------- */

const MATERIALS = {
  board: { L: 0.38, spec: 0 },
  darkPlastic: { L: 0.30, spec: 0 },
  lightPlastic: { L: 0.80, spec: 0 },
  metal: { L: 0.68, spec: 0.35 },
  clear: { L: 0.88, spec: 0 },
};

/* ---------------- boot ---------------- */

function mount(root, config) {
  const parts = config.parts;
  const axis = config.axis || 'vertical';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  root.classList.add('td-root');
  root.innerHTML = '';
  const stage = document.createElement('div');
  stage.className = 'td-stage';
  const canvas = document.createElement('canvas');
  canvas.className = 'td-canvas';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', `Exploded 3D view, ${parts.length} parts. The part list follows.`);
  const leader = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  leader.setAttribute('class', 'td-leader');
  const leaderLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  leaderLine.setAttribute('visibility', 'hidden');
  leader.append(leaderLine);
  const pop = document.createElement('div');
  pop.className = 'td-popover';
  pop.hidden = true;
  stage.append(canvas, leader, pop);
  root.prepend(stage);

  const bar = document.createElement('div');
  bar.className = 'td-bar playback';
  bar.innerHTML =
    '<div class="td-seg" role="radiogroup" aria-label="Assembly state">' +
    '<i class="td-seg-div" aria-hidden="true"></i>' +
    '<button type="button" role="radio" aria-checked="false" data-e="0">Assembled</button>' +
    '<button type="button" role="radio" aria-checked="true" data-e="1">Exploded</button></div>' +
    '<button type="button" data-view="above">Above</button>' +
    '<button type="button" data-view="eye">Eye level</button>' +
    '<button type="button" class="td-icon" data-view="reset" aria-label="Reset view" data-tip="Reset view">' +
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4h4"/></svg>' +
    '<span class="td-tip" role="tooltip">Reset view</span></button>' +
    '<span class="td-sep" aria-hidden="true"></span>' +
    '<span class="td-readout"></span>';
  const hint = document.createElement('p');
  hint.className = 'td-hint';
  hint.innerHTML = innerWidth < 420
    ? '<span>Drag to turn or tilt</span><span>+ − to zoom</span><span>click a part</span>'
    : '<span>Drag sideways to turn</span><span>drag up or down to tilt</span><span>scroll or + − to descend</span><span>click a part</span>';
  const list = document.createElement('ol');
  list.className = 'sr-only';
  parts.forEach((p, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = `Part ${i + 1} of ${parts.length}, ${p.name}`;
    b.addEventListener('click', () => api.open(i));
    li.append(b);
    list.append(li);
  });
  const live = document.createElement('div');
  live.className = 'sr-only';
  live.setAttribute('aria-live', 'polite');
  (document.querySelector('.stage-header') || root).appendChild(hint);
  root.append(bar, list, live);

  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: true });

  /* ---- geometry bake ---- */

  function bakePart(part) {
    const pos = [], nrm = [], idx = [], decal = [], edge = [];
    let yMin = Infinity, yMax = -Infinity;
    const bMin = [Infinity, Infinity, Infinity], bMax = [-Infinity, -Infinity, -Infinity];
    for (const prim of part.prims) {
      const m = trs(prim.at || [0, 0, 0], prim.rot || [0, 0, 0], prim.scale || [1, 1, 1]);
      const base = pos.length / 3;
      for (let i = 0; i < prim.g.pos.length; i += 3) {
        const p = [prim.g.pos[i], prim.g.pos[i + 1], prim.g.pos[i + 2]];
        const q = xformPoint(m, p);
        pos.push(...q);
        const nv = [prim.g.nrm[i], prim.g.nrm[i + 1], prim.g.nrm[i + 2]];
        const nn = norm3([m[0] * nv[0] + m[4] * nv[1] + m[8] * nv[2], m[1] * nv[0] + m[5] * nv[1] + m[9] * nv[2], m[2] * nv[0] + m[6] * nv[1] + m[10] * nv[2]]);
        nrm.push(...nn);
        for (let k = 0; k < 3; k++) { bMin[k] = Math.min(bMin[k], q[k]); bMax[k] = Math.max(bMax[k], q[k]); }
        yMin = Math.min(yMin, q[1]); yMax = Math.max(yMax, q[1]);
      }
      prim.g.idx.forEach(ix => (prim.decal ? decal : idx).push(ix + base));
      const eg = creaseEdges(prim.g);
      if(prim.lines) eg.push(...prim.lines);
      for(let i = 0; i < eg.length; i += 3) edge.push(...xformPoint(m, [eg[i], eg[i+1], eg[i+2]]));
    }
    part.edges = new Float32Array(edge);
    part.decal = new Uint32Array(decal);
    part.localCentre = [(bMin[0] + bMax[0]) / 2, (bMin[1] + bMax[1]) / 2, (bMin[2] + bMax[2]) / 2];
    part.localMin = bMin; part.localMax = bMax;
    part.y0 = yMin; part.y1 = Math.max(yMax, yMin + 0.001);
    part.mesh = { pos: new Float32Array(pos), nrm: new Float32Array(nrm), idx: new Uint32Array(idx) };
    part.material = part.material || 'darkPlastic';
  }
  parts.forEach(bakePart);

  /* ---- explode offsets ---- */

  const aMin = [Infinity, Infinity, Infinity], aMax = [-Infinity, -Infinity, -Infinity];
  parts.forEach(p => {
    for (let k = 0; k < 3; k++) {
      aMin[k] = Math.min(aMin[k], p.at[k] + p.localMin[k]);
      aMax[k] = Math.max(aMax[k], p.at[k] + p.localMax[k]);
    }
  });
  const aC = [(aMin[0] + aMax[0]) / 2, (aMin[1] + aMax[1]) / 2, (aMin[2] + aMax[2]) / 2];
  const aSize = [aMax[0] - aMin[0], aMax[1] - aMin[1], aMax[2] - aMin[2]];
  /* Cumulative real-extent offsets: gap between part i's far edge and i+1's
     near edge along the axis = 0.6 x max(footprint_i, footprint_i+1). */
  const A = axis === 'vertical' ? 1 : 0;
  const P1 = (A + 1) % 3 === 1 ? 0 : (A === 0 ? 1 : 0), P2 = A === 0 ? 2 : 2;
  const Pq1 = A === 1 ? 0 : 1, Pq2 = 2;
  const foot = p => Math.max(p.localMax[Pq1] - p.localMin[Pq1], p.localMax[Pq2] - p.localMin[Pq2]);
  {
    let cursor = parts[0].at[A];
    parts[0].explodeOffset = [0, 0, 0];
    for (let i = 1; i < parts.length; i++) {
      const prev = parts[i - 1], cur = parts[i];
      const gap = 0.6 * Math.max(foot(prev), foot(cur));
      cursor = cursor + (prev.localMax[A] - prev.localMin[A]) * 0 + (cursor === parts[i-1].at[A] ? 0 : 0);
      /* pos_{i+1} = pos_i + (part_i.max - part_{i+1}.min) + gap, all along A */
      const posPrev = cursor;
      const posCur = posPrev + (prev.localMax[A] - cur.localMin[A]) + gap;
      const off = [0, 0, 0]; off[A] = posCur - cur.at[A];
      cur.explodeOffset = off;
      cursor = posCur;
    }
    /* per-part overrides */
    parts.forEach(p => {
      if (p.offset) { p.explodeOffset = p.offset; }
      else if (p.offsetK) {
        const dir = Math.sign(p.offsetK[A] || 1);
        if (dir < 0) {
          const first = parts[0];
          const gap = 0.6 * Math.max(foot(first), foot(p));
          const eMin = first.at[A] + first.localMin[A];
          const pos = eMin - gap - p.localMax[A];
          const off = [0, 0, 0]; off[A] = pos - p.at[A];
          p.explodeOffset = off;
        } else {
          const gap = 0.6 * Math.max(foot(parts[parts.length - 2]), foot(p));
          const last = parts[parts.length - 2];
          const lastPos = last.at[A] + last.explodeOffset[A];
          const pos = lastPos + last.localMax[A] + gap - p.localMin[A];
          const off = [0, 0, 0]; off[A] = pos - p.at[A];
          p.explodeOffset = off;
        }
      }
    });
  }
  /* Exploded centre and radius fix the camera frame. */
  const eMin = [Infinity, Infinity, Infinity], eMax = [-Infinity, -Infinity, -Infinity];
  parts.forEach(p => {
    for (let k = 0; k < 3; k++) {
      eMin[k] = Math.min(eMin[k], p.at[k] + p.explodeOffset[k] + p.localMin[k]);
      eMax[k] = Math.max(eMax[k], p.at[k] + p.explodeOffset[k] + p.localMax[k]);
    }
  });
  const c = [(eMin[0] + eMax[0]) / 2, (eMin[1] + eMax[1]) / 2, (eMin[2] + eMax[2]) / 2];
  const dims = [eMax[0]-eMin[0], eMax[1]-eMin[1], eMax[2]-eMin[2]].sort((a,b)=>a-b);
  const longRow = axis === 'horizontal' && dims[2] > 2 * Math.max(dims[0], dims[1]);
  const DEFAULT_YAW = (longRow ? -15 : -35) * Math.PI / 180;
  const TAnim = c.slice();
  let focusT0 = 0, focusFrom = [0, 0, 0, 0];
  let R = 0;
  parts.forEach(p => {
    for (let k = 0; k < 3; k++) {
      R = Math.max(R, Math.hypot(
        (p.at[0] + p.explodeOffset[0] + (k === 0 ? p.localMin[0] : p.localMax[0])) - c[0],
        (p.at[1] + p.explodeOffset[1] + (k === 1 ? p.localMin[1] : p.localMax[1])) - c[1],
        (p.at[2] + p.explodeOffset[2] + (k === 2 ? p.localMin[2] : p.localMax[2])) - c[2]));
    }
  });
  R = Math.max(R, 1);
  const F = 1.08 * R / Math.sin(15 * Math.PI / 180);

  /* ---- state ---- */

  const state = {
    yaw: DEFAULT_YAW, yawVel: 0, yawTarget: DEFAULT_YAW,
    tilt: 0, tiltVel: 0, tiltTarget: 0,
    z: 0.12, zTarget: 0.12,
    e: 1, eAnim: null,
    openPart: -1, hoverPart: -1, tAnim: null,
    dragging: false, lastInput: performance.now(), spinRamp: 0, spinTimer: 0,
    pickPending: null,
  };

  /* ---- theme colours ---- */

  const theme = {};
  function readTheme() {
    const cs = getComputedStyle(document.documentElement);
    theme.amber = parseOklch(cs.getPropertyValue('--amber'));
    theme.coral = parseOklch(cs.getPropertyValue('--coral'));
    const cm = cs.getPropertyValue('--coral').match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
    theme.coralLch = cm ? [+cm[1], +cm[2], +cm[3]] : [0.7, 0.15, 35];
    const rgbText = cs.getPropertyValue('--text-rgb').trim();
    const t = parseRgb(`rgba(${rgbText})`);
    theme.dark = t > 0.5;
    const gw = cs.getPropertyValue('--work').trim();
    {
      let Y = null;
      const om = gw.match(/oklch\(\s*([\d.]+)/);
      if(om){ theme.groundL = +om[1]; }
      else {
        const hm = gw.match(/#?([0-9a-fA-F]{6})\b/) || gw.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/);
        if(hm){
          let r, g, b;
          if(hm[1].length === 6){ const v = parseInt(hm[1], 16); r = v>>16&255; g = v>>8&255; b = v&255; }
          else { r = +hm[1]; g = +hm[2]; b = +hm[3]; }
          const f = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
          Y = 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
          theme.groundL = Math.max(0, Math.min(1, Math.cbrt(Y) * 1.227 - 0.138));
        } else theme.groundL = theme.dark ? 0.2 : 0.93;
      }
    }
    theme.rim = [srgbToLinear(t), srgbToLinear(t), srgbToLinear(t)];
    theme.shadow = theme.dark ? 0.25 : 0.12;
    leaderLine.setAttribute('stroke', `rgba(${rgbText},0.31)`);
    requestRender();
  }

  /* ---- gl setup ---- */

  const SHADER_V = `#version 300 es
  layout(location=0) in vec3 aPos;
  layout(location=1) in vec3 aNrm;
  uniform mat4 uMVP;
  uniform mat4 uModel;
  out vec3 vN; out vec3 vW; out float vY;
  void main(){
    vec4 w = uModel * vec4(aPos,1.);
    vW = w.xyz; vY = aPos.y;
    vN = mat3(uModel) * aNrm;
    gl_Position = uMVP * vec4(aPos,1.);
  }`;
  const SHADER_F = `#version 300 es
  precision highp float;
  in vec3 vN; in vec3 vW; in float vY;
  uniform vec3 uAlbedo,uAmber,uCoral,uRim,uLightDir,uFillDir,uCam;
  uniform float uSpec,uY0,uY1;
  uniform int uMode;
  out vec4 o;
  vec3 srgb(vec3 c){ return mix(12.92*c, 1.055*pow(c,vec3(1./2.4))-0.055, step(0.0031308,c)); }
  void main(){
    vec3 n = normalize(vN);
    vec3 v = normalize(uCam - vW);
    vec3 albedo = uMode==2 ? mix(uCoral,uAmber,clamp((vY-uY0)/(uY1-uY0),0.,1.)) : uAlbedo;
    if(uMode==1) albedo *= 0.70;
    float dif = max(dot(n,uLightDir),0.);
    float fill = max(dot(n,uFillDir),0.)*0.25;
    float amb = mix(0.18,0.45,n.y*0.5+0.5);
    vec3 col = albedo*(dif+fill+amb);
    if(uSpec>0.){
      vec3 h = normalize(uLightDir+v);
      col += uSpec*pow(max(dot(n,h),0.),48.)*vec3(1.);
    }
    col += pow(1.-max(dot(n,v),0.),3.)*0.12*uRim;
    o = vec4(srgb(clamp(col,vec3(0.),vec3(1.))),1.);
  }`;
  const ID_V = `#version 300 es
  layout(location=0) in vec3 aPos;
  uniform mat4 uMVP;
  void main(){ gl_Position = uMVP * vec4(aPos,1.); }`;
  const ID_F = `#version 300 es
  precision mediump float;
  uniform vec4 uId;
  out vec4 o;
  void main(){ o = uId; }`;
  const SH_V = `#version 300 es
  layout(location=0) in vec2 aP;
  uniform mat4 uMVP;
  out vec2 vUv;
  void main(){ vUv = aP; gl_Position = uMVP * vec4(aP.x,0.,aP.y,1.); }`;
  const SH_F = `#version 300 es
  precision mediump float;
  in vec2 vUv;
  uniform float uA;
  out vec4 o;
  void main(){
    float r = length(vUv);
    o = vec4(0.,0.,0., uA*smoothstep(1.,0.15,r));
  }`;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function program(vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }

  let prog = null, idProg = null, shProg = null, pickFbo = null, pickTex = null, pickDepth = null;
  const uni = {};
  if (gl) {
    prog = program(SHADER_V, SHADER_F);
    idProg = program(ID_V, ID_F);
    shProg = program(SH_V, SH_F);
    ['uMVP', 'uModel', 'uAlbedo', 'uAmber', 'uCoral', 'uRim', 'uLightDir', 'uFillDir', 'uCam', 'uSpec', 'uY0', 'uY1', 'uMode', 'uId', 'uA'].forEach(u => {
      uni[u] = { p: gl.getUniformLocation(prog, u), i: gl.getUniformLocation(idProg, u), s: gl.getUniformLocation(shProg, u) };
    });
    parts.forEach(p => {
      const vbo = gl.createBuffer(), nbo = gl.createBuffer(), ibo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, p.mesh.pos, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, nbo);
      gl.bufferData(gl.ARRAY_BUFFER, p.mesh.nrm, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, p.mesh.idx, gl.STATIC_DRAW);
      const ebo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, ebo);
      gl.bufferData(gl.ARRAY_BUFFER, p.edges, gl.STATIC_DRAW);
      const dbo = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dbo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, p.decal, gl.STATIC_DRAW);
      p.gl = { vbo, nbo, ibo, ebo, dbo, count: p.mesh.idx.length, dcount: p.decal.length, ecount: p.edges.length/3 };
    });
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
  }

  const shadowGeom = { x: aC[0], y: aMin[1] - 0.6, z: aC[2], r: Math.max(aSize[0], aSize[2]) * 0.75 };
  const SHADOW_VERTS = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
  const shadowBuf = gl ? gl.createBuffer() : null;
  if (gl) { gl.bindBuffer(gl.ARRAY_BUFFER, shadowBuf); gl.bufferData(gl.ARRAY_BUFFER, SHADOW_VERTS, gl.STATIC_DRAW); }

  let pickW = 0, pickH = 0;
  function ensurePickBuffer(w, h) {
    if (!gl || (w === pickW && h === pickH && pickFbo)) return;
    pickW = w; pickH = h;
    if (pickTex) { gl.deleteTexture(pickTex); gl.deleteRenderbuffer(pickDepth); gl.deleteFramebuffer(pickFbo); }
    pickTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, pickTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    pickDepth = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, pickDepth);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
    pickFbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, pickFbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pickTex, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, pickDepth);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  function drawParts(mvp, idPass) {
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      const px = p.at[0] + state.e * p.explodeOffset[0];
      const py = p.at[1] + state.e * p.explodeOffset[1];
      const pz = p.at[2] + state.e * p.explodeOffset[2];
      const model = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, px, py, pz, 1];
      gl.uniformMatrix4fv(uni.uMVP[idPass ? 'i' : 'p'], false, mul4(mvp, model));
      if (!idPass) {
        gl.uniformMatrix4fv(uni.uModel.p, false, model);
        const mat = typeof p.material === 'object' ? p.material : (MATERIALS[p.material] || MATERIALS.darkPlastic);
        const mL = theme.dark ? 0.38 + (mat.L - 0.30) * 0.93 : 0.22 + (mat.L - 0.30) * 0.97;
        const L = mL + (i === state.hoverPart ? 0.06 : 0);
        gl.uniform3fv(uni.uAlbedo.p, oklabNeutralLinear(L));
        gl.uniform1f(uni.uSpec.p, mat.spec);
        gl.uniform1f(uni.uY0.p, p.y0);
        gl.uniform1f(uni.uY1.p, p.y1);
        gl.uniform1i(uni.uMode.p, state.openPart < 0 ? 0 : (i === state.openPart ? 2 : 1));
      } else {
        const id = i + 1;
        gl.uniform4f(uni.uId.i, (id & 255) / 255, ((id >> 8) & 255) / 255, 0, 1);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, p.gl.vbo);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
      if (!idPass) {
        gl.bindBuffer(gl.ARRAY_BUFFER, p.gl.nbo);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
      } else gl.disableVertexAttribArray(1);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, p.gl.ibo);
      gl.drawElements(gl.TRIANGLES, p.gl.count, gl.UNSIGNED_INT, 0);
      if(p.gl.dcount){
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, p.gl.dbo);
        if(!idPass){ gl.polygonOffset(-1, -1); }
        gl.drawElements(gl.TRIANGLES, p.gl.dcount, gl.UNSIGNED_INT, 0);
        if(!idPass){ gl.polygonOffset(1, 1); }
      }
    }
  }

  let lastVP = null, lastEye = null, lastFree = null;

  /* floor: a disc under the assembly's lowest point, radial alpha falloff */
  const FLOOR_V = `#version 300 es
  layout(location=0) in vec4 aPos;
  uniform mat4 uMVP; out float vA;
  void main(){ vA=aPos.w; gl_Position=uMVP*vec4(aPos.xyz,1.); }`;
  const FLOOR_F = `#version 300 es
  precision highp float; in float vA; uniform vec4 uC; out vec4 o;
  vec3 srgb(vec3 c){ return mix(12.92*c, 1.055*pow(c,vec3(1./2.4))-0.055, step(0.0031308,c)); }
  void main(){ float a=uC.a*vA; o=vec4(srgb(uC.rgb)*a, a); }`;
  const floorProg = program(FLOOR_V, FLOOR_F);
  let floorVBO = null, floorCount = 0, floorRX = 1, floorRZ = 1, floorR = 1;
  function buildFloor(){
        let mn = [1e9,1e9,1e9], mx = [-1e9,-1e9,-1e9], maxHD = 0;
    parts.forEach(p => {
      const o = [p.at[0]+p.explodeOffset[0], p.at[1]+p.explodeOffset[1], p.at[2]+p.explodeOffset[2]];
      for(const lx of [p.localMin[0],p.localMax[0]]) for(const ly of [p.localMin[1],p.localMax[1]]) for(const lz of [p.localMin[2],p.localMax[2]]){
        const q = [o[0]+lx, o[1]+ly, o[2]+lz];
        for(let k2 = 0; k2 < 3; k2++){ mn[k2]=Math.min(mn[k2],q[k2]); mx[k2]=Math.max(mx[k2],q[k2]); }
        maxHD = Math.max(maxHD, Math.hypot(q[0]-c[0], q[2]-c[2]));
      }});
    floorRX = floorRZ = Math.max(0.6*Math.max(mx[0]-mn[0], mx[1]-mn[1], mx[2]-mn[2]), 1.15*maxHD, 8);
    floorR = floorRX;
    const seg = 64, pos = [];
    for(let i = 0; i < seg; i++){
      const a0 = i/seg*Math.PI*2, a1 = (i+1)/seg*Math.PI*2;
      pos.push(0,0,0,1, Math.cos(a0)*0.7,0,Math.sin(a0)*0.7,1, Math.cos(a1)*0.7,0,Math.sin(a1)*0.7,1);
      pos.push(Math.cos(a0)*0.7,0,Math.sin(a0)*0.7,1, Math.cos(a0),0,Math.sin(a0),0, Math.cos(a1),0,Math.sin(a1),0);
      pos.push(Math.cos(a0)*0.7,0,Math.sin(a0)*0.7,1, Math.cos(a1),0,Math.sin(a1),0, Math.cos(a1)*0.7,0,Math.sin(a1)*0.7,1);
    }
    floorCount = pos.length/4;
    if(floorVBO) gl.deleteBuffer(floorVBO);
    floorVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, floorVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  }
  function drawFloor(vp, y, cen){
    if(!floorVBO || !floorCount) return;
    gl.useProgram(floorProg);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false); gl.disable(gl.CULL_FACE);
    const model = [floorRX,0,0,0, 0,1,0,0, 0,0,floorRZ,0, cen[0],y,cen[2],1];
    gl.uniformMatrix4fv(gl.getUniformLocation(floorProg,'uMVP'), false, mul4(vp, model));
    const gc = oklchToLinear(theme.groundL + (theme.dark ? 0.07 : -0.07), 0, 0);
    gl.uniform4f(gl.getUniformLocation(floorProg,'uC'), gc[0],gc[1],gc[2],1);
    gl.bindBuffer(gl.ARRAY_BUFFER, floorVBO);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0,4,gl.FLOAT,false,0,0);
    gl.drawArrays(gl.TRIANGLES, 0, floorCount);
    gl.enable(gl.CULL_FACE); gl.depthMask(true); gl.disable(gl.BLEND);
  }

  function lineColor(part, i){
    if(state.openPart === i) return [...oklchToLinear(theme.coralLch[0]-0.1, theme.coralLch[1], theme.coralLch[2]), 0.9];
    const mat = typeof part.material === 'object' ? part.material : (MATERIALS[part.material] || MATERIALS.darkPlastic);
    const mL = theme.dark ? 0.38 + (mat.L - 0.30) * 0.93 : 0.22 + (mat.L - 0.30) * 0.97;
    const L = theme.dark ? (mL > 0.5 ? mL - 0.20 : mL + 0.14) : mL - 0.20;
    return [...oklabNeutralLinear(L), 0.9];
  }
  function drawLines(vp){
    gl.useProgram(idProg);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.CULL_FACE);
    for(let i = 0; i < parts.length; i++){
      const p = parts[i];
      if(!p.gl.ecount) continue;
      const model = [1,0,0,0, 0,1,0,0, 0,0,1,0,
        p.at[0]+state.e*p.explodeOffset[0], p.at[1]+state.e*p.explodeOffset[1], p.at[2]+state.e*p.explodeOffset[2], 1];
      gl.uniformMatrix4fv(uni.uMVP.i, false, mul4(vp, model));
      gl.uniform4fv(uni.uId.i, lineColor(p, i));
      gl.bindBuffer(gl.ARRAY_BUFFER, p.gl.ebo);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
      gl.disableVertexAttribArray(1);
      gl.drawArrays(gl.LINES, 0, p.gl.ecount);
    }
    gl.enable(gl.CULL_FACE);
    gl.disable(gl.BLEND);
  }

  function render() {
    const w = canvas.width, h = canvas.height;
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    /* bounds at the current explode amount drive the fitted distance */
    const bMin = [1/0,1/0,1/0], bMax = [-1/0,-1/0,-1/0];
    for(const p of parts){
      const o = [p.at[0]+state.e*p.explodeOffset[0], p.at[1]+state.e*p.explodeOffset[1], p.at[2]+state.e*p.explodeOffset[2]];
      for(let k = 0; k < 3; k++){ bMin[k] = Math.min(bMin[k], o[k]+p.localMin[k]); bMax[k] = Math.max(bMax[k], o[k]+p.localMax[k]); }
    }
    const cDyn = [(bMin[0]+bMax[0])/2, (bMin[1]+bMax[1])/2, (bMin[2]+bMax[2])/2];
    const corners = [];
    for(const p of parts){
      const o = [p.at[0]+state.e*p.explodeOffset[0], p.at[1]+state.e*p.explodeOffset[1], p.at[2]+state.e*p.explodeOffset[2]];
      for(const lx of [p.localMin[0], p.localMax[0]]) for(const ly of [p.localMin[1], p.localMax[1]]) for(const lz of [p.localMin[2], p.localMax[2]])
        corners.push([o[0]+lx,o[1]+ly,o[2]+lz]);
    }
    const open = state.openPart >= 0 ? parts[state.openPart] : null;
    const oC = open
      ? [open.at[0] + state.e * open.explodeOffset[0] + open.localCentre[0],
         open.at[1] + state.e * open.explodeOffset[1] + open.localCentre[1],
         open.at[2] + state.e * open.explodeOffset[2] + open.localCentre[2]]
      : cDyn;
    /* one animated target: eases toward the open part's centre, or back to the
       assembly centre when nothing is open — switching parts never snaps */
    /* focus tween: every change of focus is one 420 ms ease-in-out cubic,
       restarted from the live value; no springs, no overshoot */
    const nowT = performance.now();
    const fu = focusT0 ? Math.min(1, (nowT - focusT0) / 420) : 1;
    const fe = fu < 0.5 ? 4*fu*fu*fu : 1 - Math.pow(-2*fu + 2, 3) / 2;
    for(let k2 = 0; k2 < 3; k2++)
      TAnim[k2] = fu < 1 ? focusFrom[k2] + (oC[k2] - focusFrom[k2]) * fe : oC[k2];
    if(fu < 1) state.tilt = focusFrom[3] + (state.tiltTarget - focusFrom[3]) * fe;
    if(fu < 1) requestRender();
    const T = TAnim;
    const phi = Math.min(85, Math.max(2, phiOf(state.z) + state.tilt)) * Math.PI / 180, k = kOf(state.z);
    const fov = 30 * Math.PI / 180;
    const fr = freeRect();
    const cr = stage.getBoundingClientRect();
    /* swept envelope: union of projected bounds corners over 12 yaw samples at
       d=1, cached per (z, e, canvas size) — spinning never breathes */
    const ckey = Math.round(phi*180/Math.PI*4)+'_'+Math.round(state.z*200) + '_' + Math.round(state.e*100) + '_' + Math.round(cr.width) + 'x' + Math.round(cr.height);
    let env = fitCache.get(ckey);
    if(!env){
      const pj = perspective(fov, cr.width/cr.height, 1, 4000);
      const u = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
      const D_REF = 1000; /* far outside any assembly; NDC scales as D_REF/d */
      const yaws = longRow ? [DEFAULT_YAW] : Array.from({length:12},(_,t)=>t/12*Math.PI*2);
      for(const th of yaws){
        const dir = [Math.cos(phi)*Math.sin(th), Math.sin(phi), Math.cos(phi)*Math.cos(th)];
        const vw = lookAt([cDyn[0]+D_REF*dir[0], cDyn[1]+D_REF*dir[1], cDyn[2]+D_REF*dir[2]], cDyn, [0,1,0]);
        const vpm = mul4(pj, vw);
        for(const q of corners){ const n = xformPoint(vpm, q);
          u.x0 = Math.min(u.x0, n[0]); u.y0 = Math.min(u.y0, n[1]);
          u.x1 = Math.max(u.x1, n[0]); u.y1 = Math.max(u.y1, n[1]); }
      }
      env = { w: u.x1-u.x0, h: u.y1-u.y0, cx: (u.x0+u.x1)/2, cy: (u.y0+u.y1)/2 };
      fitCache.set(ckey, env);
    }
    const wFrac = axis === 'horizontal' ? 0.80 : 0.70;
    const dFit = Math.max(env.h * 1000 * cr.height / (1.2 * fr.h), env.w * 1000 * cr.width / (2 * wFrac * fr.w));
    const d = dFit * k;
    const eye = [T[0] + d*Math.cos(phi)*Math.sin(state.yaw), T[1] + d*Math.sin(phi), T[2] + d*Math.cos(phi)*Math.cos(state.yaw)];
    let Renv = 0; for(const q of corners) Renv = Math.max(Renv, Math.hypot(q[0]-cDyn[0],q[1]-cDyn[1],q[2]-cDyn[2]));
    const far = d + 3*Renv, near = Math.max(Math.max(0.02, d - 3*Renv), far/1000);
    const proj = perspective(fov, w / h, near, far);
    const ndcFx = 2 * (fr.cx - cr.left) / cr.width - 1;
    const ndcFy = 1 - 2 * (fr.cy - cr.top) / cr.height;
    const view = lookAt(eye, T, [0, 1, 0]);
    proj[8] = -ndcFx;
    proj[9] = -ndcFy;
    const vp = mul4(proj, view);
    lastVP = vp; lastEye = eye; lastFree = fr; lastCam = { d, env, near, far, cDyn: cDyn.slice(), T: T.slice(), floorR, longRow };

    drawFloor(vp, bMin[1] - 0.05, cDyn);
    gl.useProgram(prog);
    gl.uniform3fv(uni.uLightDir.p, norm3([-0.4, 0.8, 0.45]));
    gl.uniform3fv(uni.uFillDir.p, norm3([0.7, 0.3, -0.65]));
    gl.uniform3fv(uni.uAmber.p, theme.amber);
    gl.uniform3fv(uni.uCoral.p, theme.coral);
    gl.uniform3fv(uni.uRim.p, theme.rim);
    gl.uniform3fv(uni.uCam.p, eye);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1, 1);
    drawParts(vp, false);
    gl.disable(gl.POLYGON_OFFSET_FILL);
    drawLines(vp);

    /* soft contact shadow under the assembled base */
    gl.useProgram(shProg);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    const sm = [shadowGeom.r, 0, 0, 0, 0, shadowGeom.r, 0, 0, 0, 0, 1, 0, shadowGeom.x, shadowGeom.y, shadowGeom.z, 1];
    gl.uniformMatrix4fv(uni.uMVP.s, false, mul4(vp, sm));
    gl.uniform1f(uni.uA.s, theme.shadow * (1 - state.e));
    gl.bindBuffer(gl.ARRAY_BUFFER, shadowBuf);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disableVertexAttribArray(1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
  }

  function pick(cx, cy) {
    if (!gl) return -1;
    const w = canvas.width, h = canvas.height;
    ensurePickBuffer(w, h);
    gl.bindFramebuffer(gl.FRAMEBUFFER, pickFbo);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(idProg);
    drawParts(lastVP, true);
    const px = new Uint8Array(4);
    gl.readPixels(Math.round(cx * (w / canvas.clientWidth)), h - 1 - Math.round(cy * (h / canvas.clientHeight)), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    const id = px[0] + px[1] * 256;
    return id > 0 ? id - 1 : -1;
  }

  /* ---- camera path (settled maths) ---- */

  /* Monotone cubic (Fritsch-Carlson) through the camera knots: elevation and a
     distance factor over z, so the fitted view never breathes under spin. */
  function monotoneCubic(knots){
    const n = knots.length, xs = knots.map(k => k[0]), ys = knots.map(k => k[1]);
    const h = [], d = [];
    for(let i = 0; i < n-1; i++){ h.push(xs[i+1]-xs[i]); d.push((ys[i+1]-ys[i])/h[i]); }
    const m = [d[0]];
    for(let i = 1; i < n-1; i++) m.push(d[i-1]*d[i] <= 0 ? 0 : (d[i-1]+d[i])/2);
    m.push(d[n-2]);
    for(let i = 0; i < n-1; i++){
      if(d[i] === 0){ m[i] = 0; m[i+1] = 0; }
      else { const a = m[i]/d[i], b = m[i+1]/d[i], q = a*a+b*b;
        if(q > 9){ const t = 3/Math.sqrt(q); m[i] = t*a*d[i]; m[i+1] = t*b*d[i]; } }
    }
    return z => {
      let i = 0; while(i < n-2 && z > xs[i+1]) i++;
      const t = (z-xs[i])/h[i], t2 = t*t, t3 = t2*t;
      return ys[i]*(2*t3-3*t2+1) + h[i]*m[i]*(t3-2*t2+t) + ys[i+1]*(-2*t3+3*t2) + h[i]*m[i+1]*(t3-t2);
    };
  }
  const phiOf = monotoneCubic([[0,69],[0.45,18],[0.60,5],[1,6]]);
  const kOf = monotoneCubic([[0,1.0],[0.45,1.0],[0.60,0.90],[1,0.32]]);
  /* The free viewport: the canvas rect minus the header band and the bar band. */
  function freeRect(){
    const cr = stage.getBoundingClientRect();
    const hdr = document.querySelector('.stage-header').getBoundingClientRect();
    const bar = root.querySelector('.td-bar').getBoundingClientRect();
    const top = Math.min(cr.bottom, Math.max(cr.top, hdr.bottom));
    const bottom = Math.max(top, Math.min(cr.bottom, bar.top));
    return { top, bottom, left: cr.left, right: cr.right, w: cr.right-cr.left, h: bottom-top,
             cx: (cr.left+cr.right)/2, cy: (top+bottom)/2 };
  }

  /* ---- frame loop: render only when something moves ---- */

  const fitCache = new Map();
  let rafId = 0, lastT = 0, lastDt = 1/60, frameTotal = 0, popHideT = 0, lastPopT = 0, lastCam = null;
  const perfBuf = [];
  function requestRender() { if (!gl || rafId) return; rafId = requestAnimationFrame(frame); }
  function frame(t) {
    rafId = 0;
    const dt = Math.min(0.05, lastT ? (t - lastT) / 1000 : 0.016);
    lastT = t; lastDt = dt;
    const moving = step(dt);
    if (state.pickPending) { doPick(state.pickPending); state.pickPending = null; }
    const t0 = performance.now();
    render();
    frameTotal++;
    perfBuf.push(performance.now() - t0);
    if (perfBuf.length > 240) perfBuf.shift();
    api._drain();
    updatePopover();
    if (moving) requestRender();
    else if(!state.spinTimer && state.z < 0.35 && state.openPart < 0 && !reducedMotion.matches){
      const wait = 3050 - (performance.now() - state.lastInput);
      if(wait > 0) state.spinTimer = setTimeout(() => { state.spinTimer = 0; requestRender(); }, wait);
    }
  }
  function step(dt) {
    let moving = false;
    const rm = reducedMotion.matches;
    if (rm) { state.z = state.zTarget; state.yaw = state.yawTarget; }
    const dz = state.zTarget - state.z;
    if (Math.abs(dz) > 0.0005) { state.z += dz * (1 - Math.exp(-dt / 0.12)); moving = true; }
    else state.z = state.zTarget;
    const dy = state.yawTarget - state.yaw;
    if (Math.abs(dy) > 0.0005 && !state.dragging) { state.yaw += dy * (1 - Math.exp(-dt / 0.15)); moving = true; }
    else if (!state.dragging) state.yaw = state.yawTarget;
    if (Math.abs(state.yawVel) > 0.01) {
      state.yaw += state.yawVel * dt;
      state.yawTarget = state.yaw;
      state.yawVel *= Math.exp(-dt / 0.35);
      moving = true;
    }
    const dtil = state.tiltTarget - state.tilt;
    if (Math.abs(dtil) > 0.001 && !state.dragging) { state.tilt += dtil * (1 - Math.exp(-dt / 0.15)); moving = true; }
    else if (!state.dragging) state.tilt = state.tiltTarget;
    if (!rm && Math.abs(state.tiltVel) > 0.5) {
      state.tilt = Math.max(-60, Math.min(60, state.tilt + state.tiltVel * dt));
      state.tiltTarget = state.tilt;
      state.tiltVel *= Math.exp(-dt / 0.35);
      moving = true;
    }
    /* eased scalar animations (explode, camera target) */
    for (const key of ['eAnim']) {
      const an = state[key];
      if (!an) continue;
      const prop = 'e';
      const p = Math.min(1, (performance.now() - an.t0) / an.dur);
      state[prop] = mix(an.from, an.to, rm ? 1 : easeOutCubic(p));
      if (p < 1 && !rm) moving = true; else state[key] = null;
    }
    /* idle spin */
    const idle = performance.now() - state.lastInput > 3000;
    if (idle && state.z < 0.35 && Math.abs(state.tilt) < 5 && state.openPart < 0 && !state.dragging && !rm) {
      state.spinRamp = Math.min(1, state.spinRamp + dt);
      state.yaw += (8 * Math.PI / 180) * state.spinRamp * dt;
      state.yawTarget = state.yaw;
      moving = true;
    } else state.spinRamp = 0;
    return moving;
  }

  function bumpInput() { state.lastInput = performance.now(); state.spinRamp = 0; clearTimeout(state.spinTimer); state.spinTimer = 0; }

  /* ---- picking + popover ---- */

  function doPick(pt) {
    const i = pick(pt.x, pt.y);
    if (i !== state.hoverPart) { state.hoverPart = i; canvas.style.cursor = i >= 0 ? 'pointer' : 'grab'; requestRender(); }
  }

  function partScreenBBox(i) {
    if (!lastVP) return null;
    const p = parts[i];
    const off = [p.at[0] + state.e * p.explodeOffset[0], p.at[1] + state.e * p.explodeOffset[1], p.at[2] + state.e * p.explodeOffset[2]];
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) for (let d = 0; d < 2; d++) {
      const q = xformPoint(lastVP, [
        off[0] + (a ? p.localMin[0] : p.localMax[0]),
        off[1] + (b ? p.localMin[1] : p.localMax[1]),
        off[2] + (d ? p.localMin[2] : p.localMax[2]),
      ]);
      const sx = (q[0] * 0.5 + 0.5) * canvas.clientWidth;
      const sy = (1 - (q[1] * 0.5 + 0.5)) * canvas.clientHeight;
      x0 = Math.min(x0, sx); y0 = Math.min(y0, sy);
      x1 = Math.max(x1, sx); y1 = Math.max(y1, sy);
    }
    const r = stage.getBoundingClientRect();
    return { x0: x0 + r.left, y0: y0 + r.top, x1: x1 + r.left, y1: y1 + r.top };
  }

  function popHtml(i) {
    const p = parts[i];
    pop.innerHTML =
      `<div class="td-pop-head"><h3>${p.name}</h3><span class="td-pop-pos">${i + 1} / ${parts.length}</span></div>` +
      `<p class="td-pop-job">${p.job}</p>` +
      `<dl class="td-specs">${p.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` +
      '<div class="td-pop-actions">' +
      `<button type="button" data-up aria-label="Part above" title="Up"${i >= parts.length - 1 ? ' disabled' : ''}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 10l5-5 5 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>` +
      `<button type="button" data-down aria-label="Part below" title="Down"${i <= 0 ? ' disabled' : ''}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>` +
      '<button type="button" data-close aria-label="Close" title="Close"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button></div>';
    pop.querySelector('[data-up]').addEventListener('click', () => api.open(i + 1));
    pop.querySelector('[data-down]').addEventListener('click', () => api.open(i - 1));
    pop.querySelector('[data-close]').addEventListener('click', () => api.open(null));
  }

  /* Popovers sit beside, never on top: candidates right, left, above, below at a
     32 px gap; first side fully inside the free rect (16 px margins) and clear of
     the part bounds wins; otherwise dock to the free edge farthest from the part.
     Position follows with a ~150 ms critically damped spring; a side only gives
     up after failing for 300 ms (hysteresis). */
  const popPos = { x: 0, y: 0, vx: 0, vy: 0, side: null, failSince: 0, snap: true };
  const POP_W = 35; /* rad/s, ~150 ms settle */
  function updatePopover() {
    if (state.openPart < 0 || pop.hidden) return;
    const bb = partScreenBBox(state.openPart);
    if (!bb) return;
    pop.hidden = false;
    const pw = pop.offsetWidth, ph = pop.offsetHeight;
    const fr = lastFree || { top: 8, bottom: innerHeight - 8, left: 8, right: innerWidth - 8 };
    const pc = [(bb.x0 + bb.x1) / 2, (bb.y0 + bb.y1) / 2];
    const cand = {
      right: { x: bb.x1 + 32, y: pc[1] - ph / 2 },
      left: { x: bb.x0 - 32 - pw, y: pc[1] - ph / 2 },
      above: { x: pc[0] - pw / 2, y: bb.y0 - 32 - ph },
      below: { x: pc[0] - pw / 2, y: bb.y1 + 32 },
    };
    const fits = r =>
      r.x >= fr.left + 16 && r.x + pw <= fr.right - 16 &&
      r.y >= fr.top + 16 && r.y + ph <= fr.bottom - 16 &&
      !(r.x < bb.x1 && r.x + pw > bb.x0 && r.y < bb.y1 && r.y + ph > bb.y0);
    /* the side was chosen once at open() / part switch and is locked now;
       the popover only slides along that side as the part's bounds move */
    const side = popPos.side || 'right';
    const r = cand[side];
    const tgt = {
      x: Math.max(fr.left + 16, Math.min(r.x, fr.right - 16 - pw)),
      y: Math.max(fr.top + 16, Math.min(r.y, fr.bottom - 16 - ph)),
    };
    /* leader: nearest bound to nearest edge, never shorter than 24 px */
    const px1 = tgt.x + pw, py1 = tgt.y + ph;
    const ax = Math.max(bb.x0, Math.min(pc[0], bb.x1)), ay = Math.max(bb.y0, Math.min(pc[1], bb.y1));
    const bx = Math.max(tgt.x, Math.min(ax, px1)), by = Math.max(tgt.y, Math.min(ay, py1));
    let ll = Math.hypot(bx - ax, by - ay);
    if (ll < 24) {
      const dx = tgt.x + pw / 2 - pc[0], dy = tgt.y + ph / 2 - pc[1];
      const dd = Math.hypot(dx, dy) || 1;
      tgt.x += (24 - ll) * dx / dd; tgt.y += (24 - ll) * dy / dd;
      tgt.x = Math.max(fr.left + 16, Math.min(tgt.x, fr.right - 16 - pw));
      tgt.y = Math.max(fr.top + 16, Math.min(tgt.y, fr.bottom - 16 - ph));
    }
    /* the popover rides the same focus tween as the camera — rigid follow */
    popPos.x = tgt.x; popPos.y = tgt.y;
    const sr = stage.getBoundingClientRect();
    pop.style.left = (popPos.x - sr.left) + 'px';
    pop.style.top = (popPos.y - sr.top) + 'px';
    /* draw the leader from the live popover rect to the part bounds */
    const rx1 = popPos.x + pw, ry1 = popPos.y + ph;
    const aax = Math.max(bb.x0, Math.min(pc[0], bb.x1)), aay = Math.max(bb.y0, Math.min(pc[1], bb.y1));
    const bbx = Math.max(popPos.x, Math.min(aax, rx1)), bby = Math.max(popPos.y, Math.min(aay, ry1));
    leaderLine.setAttribute('x1', aax - sr.left); leaderLine.setAttribute('y1', aay - sr.top);
    leaderLine.setAttribute('x2', bbx - sr.left); leaderLine.setAttribute('y2', bby - sr.top);
    leaderLine.setAttribute('visibility', 'visible');
  }
  function pickPopSide(i){
    const bb = partScreenBBox(i);
    if(!bb) return 'right';
    const fr = lastFree || { top: 8, bottom: innerHeight - 8, left: 8, right: innerWidth - 8 };
    const pw = Math.max(pop.offsetWidth, 200), ph = Math.max(pop.offsetHeight, 120);
    const pc = [(bb.x0 + bb.x1) / 2, (bb.y0 + bb.y1) / 2];
    const cand = {
      right: { x: bb.x1 + 32, y: pc[1] - ph / 2 },
      left: { x: bb.x0 - 32 - pw, y: pc[1] - ph / 2 },
      above: { x: pc[0] - pw / 2, y: bb.y0 - 32 - ph },
      below: { x: pc[0] - pw / 2, y: bb.y1 + 32 },
    };
    const hits = r => {
      for(let j = 0; j < parts.length; j++){
        const ob = partScreenBBox(j);
        if(ob && r.x < ob.x1 && r.x + pw > ob.x0 && r.y < ob.y1 && r.y + ph > ob.y0) return true;
      }
      return false;
    };
    const fits = r =>
      r.x >= fr.left + 16 && r.x + pw <= fr.right - 16 &&
      r.y >= fr.top + 16 && r.y + ph <= fr.bottom - 16 &&
      !hits(r);
    const order = axis === 'horizontal' ? ['above','below','right','left'] : ['right','left','above','below'];
    for (const sd of order) if (fits(cand[sd])) return sd;
    const hitsArea = r => {
      let a = 0;
      for(let j = 0; j < parts.length; j++){
        const ob = partScreenBBox(j);
        if(ob) a += Math.max(0, Math.min(ob.x1, r.x + pw) - Math.max(ob.x0, r.x)) * Math.max(0, Math.min(ob.y1, r.y + ph) - Math.max(ob.y0, r.y));
      }
      return a;
    };
    let best = null, bestA = Infinity;
    for(const sd of order){
      const r = cand[sd];
      if(r.x + pw < fr.left + 16 || r.x > fr.right - 16 || r.y + ph < fr.top + 16 || r.y > fr.bottom - 16) continue;
      const a = hitsArea({ x: Math.max(fr.left + 16, Math.min(r.x, fr.right - 16 - pw)),
                           y: Math.max(fr.top + 16, Math.min(r.y, fr.bottom - 16 - ph)) });
      if(a < bestA){ bestA = a; best = sd; }
    }
    if(best) return best;
    const dc = { left: pc[0] - fr.left, right: fr.right - pc[0], above: pc[1] - fr.top, below: fr.bottom - pc[1] };
    return ['right', 'left', 'above', 'below'].reduce((a, b) => dc[b] > dc[a] ? b : a);
  }
  function leaderLength(bb){
    if(pop.hidden) return 0;
    const pw = pop.offsetWidth, ph = pop.offsetHeight;
    const pc = [(bb.x0 + bb.x1) / 2, (bb.y0 + bb.y1) / 2];
    const aax = Math.max(bb.x0, Math.min(pc[0], bb.x1)), aay = Math.max(bb.y0, Math.min(pc[1], bb.y1));
    const bbx = Math.max(popPos.x, Math.min(aax, popPos.x + pw)), bby = Math.max(popPos.y, Math.min(aay, popPos.y + ph));
    return Math.hypot(bbx - aax, bby - aay);
  }

  function announce(i) {
    live.textContent = i < 0 ? 'All parts' : `Part ${i + 1} of ${parts.length}, ${parts[i].name}`;
  }
  function setOpen(i) {
    state.openPart = i;
    if (i >= 0) {
      clearTimeout(popHideT);
      focusFrom = TAnim.slice().concat([state.tilt]); focusT0 = reducedMotion.matches ? 0 : performance.now();
      popHtml(i); pop.hidden = false; popPos.snap = true; popPos.side = pickPopSide(i); updatePopover(); announce(i);
      requestAnimationFrame(() => pop.classList.add('is-open'));
    } else {
      focusFrom = TAnim.slice().concat([state.tilt]); focusT0 = reducedMotion.matches ? 0 : performance.now();
      pop.classList.remove('is-open');
      clearTimeout(popHideT);
      popHideT = setTimeout(() => { pop.hidden = true; leaderLine.setAttribute('visibility', 'hidden'); }, 130);
      announce(-1);
    }
    readout();
    requestRender();
  }
  function readout() {
    bar.querySelector('.td-readout').textContent =
      state.openPart < 0 ? `${parts.length} parts` : `Part ${state.openPart + 1} / ${parts.length}`;
  }

  /* ---- input ---- */

  const pointers = new Map();
  let dragMoved = 0, lastPinch = 0, velSamples = [];
  canvas.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointers.size === 1) { state.dragging = true; dragMoved = 0; velSamples = []; canvas.classList.add('dragging'); }
    bumpInput();
  });
  canvas.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId)) { state.pickPending = { x: e.offsetX, y: e.offsetY }; requestRender(); return; }
    const prev = pointers.get(e.pointerId);
    pointers.set(e.pointerId, [e.clientX, e.clientY]);
    bumpInput();
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (lastPinch) { state.zTarget = Math.max(0, Math.min(1, state.zTarget + (d - lastPinch) * 0.0015)); }
      lastPinch = d;
      return;
    }
    const dx = e.clientX - prev[0];
    const dy = e.clientY - prev[1];
    dragMoved += Math.abs(dx) + Math.abs(dy);
    const dyaw = -dx * 0.35 * Math.PI / 180;
    state.yaw += dyaw; state.yawTarget = state.yaw;
    const dtilt = Math.max(-60, Math.min(60, state.tilt + dy * 0.3)) - state.tilt;
    state.tilt += dtilt; state.tiltTarget = state.tilt;
    velSamples.push([performance.now(), dyaw, dtilt]);
    if (velSamples.length > 6) velSamples.shift();
    requestRender();
  });
  function endPointer(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) lastPinch = 0;
    if (pointers.size === 0 && state.dragging) {
      state.dragging = false;
      canvas.classList.remove('dragging');
      const now = performance.now();
      const recent = velSamples.filter(([t]) => now - t < 90);
      if (!reducedMotion.matches && dragMoved > 4) {
        const span = recent.length > 1 ? (now - recent[0][0]) / 1000 : 0;
        if (span > 0) { state.yawVel = recent.reduce((s, [, d]) => s + d, 0) / span;
                        state.tiltVel = recent.reduce((s, [, , d]) => s + d, 0) / span; }
      }
      requestRender();
      if (dragMoved <= 4) {
        const i = pick(e.offsetX, e.offsetY);
        api.open(i >= 0 ? i : null);
      }
    }
    bumpInput();
  }
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', e => { pointers.delete(e.pointerId); state.dragging = false; canvas.classList.remove('dragging'); });
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    bumpInput();
    const mode = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1;
    state.zTarget = Math.max(0, Math.min(1, state.zTarget + e.deltaY * mode * 0.0015));
    requestRender();
  }, { passive: false });

  document.addEventListener('keydown', e => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
    const key = e.key;
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      state.yawTarget += (key === 'ArrowLeft' ? 1 : -1) * 15 * Math.PI / 180;
      bumpInput(); requestRender(); e.preventDefault();
    } else if (key === '+' || key === '=' || key === 'PageDown') {
      state.zTarget = Math.min(1, state.zTarget + 0.08); bumpInput(); requestRender(); e.preventDefault();
    } else if (key === '-' || key === '_' || key === 'PageUp') {
      state.zTarget = Math.max(0, state.zTarget - 0.08); bumpInput(); requestRender(); e.preventDefault();
    } else if (key === 'Home') {
      state.zTarget = 0.12; bumpInput(); requestRender(); e.preventDefault();
    } else if (key === 'End') {
      state.zTarget = 1; bumpInput(); requestRender(); e.preventDefault();
    } else if ((key === 'ArrowUp' || key === 'ArrowDown') && state.openPart < 0) {
      state.tiltTarget = Math.max(-60, Math.min(60, state.tiltTarget + (key === 'ArrowUp' ? 5 : -5)));
      bumpInput(); requestRender(); e.preventDefault();
    } else if (key === 'ArrowUp' || key === 'ArrowDown') {
      const next = state.openPart < 0 ? 0 : state.openPart + (key === 'ArrowUp' ? 1 : -1);
      api.open(Math.max(0, Math.min(parts.length - 1, next)));
      bumpInput(); e.preventDefault();
    } else if (key === 'Enter' && state.hoverPart >= 0) {
      api.open(state.hoverPart); e.preventDefault();
    } else if (key === 'Escape' && state.openPart >= 0) {
      api.open(null); e.preventDefault();
    } else if ((key === 'e' || key === 'E')) {
      api.setExploded(state.eAnim ? state.eAnim.to < 0.5 : state.e < 0.5);
      e.preventDefault();
    }
  });
  new MutationObserver(readTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readTheme);

  const seg = bar.querySelector('.td-seg');
  seg.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault(); e.stopPropagation();
    api.setExploded(seg.dataset.active !== '1');
  });
  bar.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    bumpInput();
    if (b.dataset.e != null) api.setExploded(b.dataset.e === '1');
    else if (b.dataset.view === 'above') state.zTarget = 0.12;
    else if (b.dataset.view === 'eye') state.zTarget = 0.72;
    else if (b.dataset.view === 'reset') { state.z = state.zTarget = 0.12; state.yaw = state.yawTarget = DEFAULT_YAW; state.yawVel = 0; state.tiltTarget = 0; focusFrom = TAnim.slice().concat([state.tilt]); focusT0 = reducedMotion.matches ? 0 : performance.now(); api.open(null); }
    requestRender();
  });
  /* glass tooltip after 500 ms hover on icon buttons */
  let tipTimer = 0;
  bar.addEventListener('pointerover', e => {
    const b = e.target.closest('[data-tip]');
    clearTimeout(tipTimer);
    if (b) tipTimer = setTimeout(() => b.classList.add('is-tip'), 500);
  });
  bar.addEventListener('pointerout', e => {
    const b = e.target.closest('[data-tip]');
    clearTimeout(tipTimer);
    if (b) b.classList.remove('is-tip');
  });

  /* ---- resize ---- */

  function resize() {
    if (!gl) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    const w = Math.max(1, Math.round(stage.clientWidth * dpr));
    const h = Math.max(1, Math.round(stage.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; ensurePickBuffer(w, h); }
    requestRender();
  }
  new ResizeObserver(resize).observe(stage);

  /* ---- public api ---- */

  seg.dataset.active = '1';
  const pendingApi = [];
  buildFloor();
  const api = {
    setView(z) { state.z = state.zTarget = Math.max(0, Math.min(1, z)); state.lastInput = performance.now(); requestRender(); },
    open(index) { setOpen(index == null ? -1 : index); },
    setExploded(on) {
      const to = on ? 1 : 0;
      if (state.e === to && !state.eAnim) return;
      state.eAnim = { from: state.e, to, t0: performance.now(), dur: 450 };
      seg.dataset.active = on ? '1' : '0';
      seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-checked', String((b.dataset.e === '1') === on)));
      requestRender();
    },
    setYaw(deg) { state.yaw = state.yawTarget = deg * Math.PI / 180; state.yawVel = 0; state.lastInput = performance.now(); requestRender(); },
    /* diagnostics for manual inspection, not part of the contract */
    frameCount: () => frameTotal,
    _drain: () => { if(pendingApi.length) pendingApi.splice(0).forEach(fn => fn()); },
    _cam: () => lastCam,
    partBox: i => partScreenBBox(i),
    popRect: () => pop.hidden ? null : { x: popPos.x, y: popPos.y, w: pop.offsetWidth, h: pop.offsetHeight, side: popPos.side },
    leaderLen: i => leaderLength(partScreenBBox(i)),
    targetPoint: () => TAnim.slice(),
    frameTimes: () => perfBuf.slice(),
  };
  window.explodedView = api;

  /* ---- fallback: no WebGL2 ---- */

  if (!gl) {
    stage.removeChild(canvas);
    const note = document.createElement('div');
    note.className = 'notice td-fallback';
    note.innerHTML = `<p>Interactive 3D needs WebGL2, which this browser does not provide.</p><ol>${parts.map((p, i) => `<li><strong>${i + 1}. ${p.name}</strong> — ${p.job}</li>`).join('')}</ol>`;
    stage.append(note);
    readout();
    return api;
  }

  readTheme();
  readout();
  requestRender();
  return api;
}

window.ExplodedViewKit = { mount, geom: GEOM };
})();
