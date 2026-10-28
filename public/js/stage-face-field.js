/**
 * Face-field overlay for the AR stage.
 * One canvas, a short landmark subset, and four labels refreshed at 10Hz.
 * Inference skips the next frame when the previous pass took longer than 12ms.
 */
import { FaceLandmarker, FilesetResolver } from '/vendor/vision_bundle.mjs';

const CHAINS = [
  { close: true, idx: [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109] },
  { close: true, idx: [33, 160, 158, 133, 153, 144] },
  { close: true, idx: [263, 387, 385, 362, 380, 373] },
  { close: false, idx: [70, 63, 105, 66, 107] },
  { close: false, idx: [300, 293, 334, 296, 336] },
  { close: true, idx: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308] },
  { close: false, idx: [168, 6, 197, 195, 5, 4] },
  { close: true, idx: [468, 469, 470, 471, 472] },
  { close: true, idx: [473, 474, 475, 476, 477] }
];

const DOTS = [];
{
  const seen = new Set();
  for (const chain of CHAINS) {
    for (const idx of chain.idx) {
      if (seen.has(idx)) continue;
      seen.add(idx);
      DOTS.push(idx);
    }
  }
}

const LABEL_SPECS = [
  { key: 'NOTES', dx: -0.62, dy: -0.05, adx: -0.42, ady: 0.0 },
  { key: 'RESEARCH', dx: 0.62, dy: -0.42, adx: 0.38, ady: -0.22 },
  { key: 'BSC_HQ', dx: 0.66, dy: 0.18, adx: 0.4, ady: 0.08 },
  { key: 'JARVIS', dx: 0.0, dy: -0.72, adx: 0.0, ady: -0.38 }
];

const field = {
  landmarker: null,
  lastTs: 0,
  lastCost: 0,
  skipNext: false,
  lastLabel: 0,
  labelPos: {},
  hasFace: false,
  wasPinch: false,
  canvas: null,
  ctx: null,
  labels: null,
  els: {}
};

function nextTs(now) {
  const ts = Math.max(Math.round(now), field.lastTs + 1);
  field.lastTs = ts;
  return ts;
}

function toScreen(lm) {
  if (typeof window.BSC_LandmarkToScreen === 'function') return window.BSC_LandmarkToScreen(lm);
  return {
    x: (1 - lm.x) * window.innerWidth,
    y: lm.y * window.innerHeight
  };
}

function resize() {
  if (!field.canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  field.canvas.width = Math.max(1, Math.round(window.innerWidth * dpr));
  field.canvas.height = Math.max(1, Math.round(window.innerHeight * dpr));
  field.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function bbox(lms) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity, n = 0;
  for (const idx of DOTS) {
    const lm = lms[idx];
    if (!lm || idx >= 468) continue;
    const p = toScreen(lm);
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
    n++;
  }
  if (n < 8) return null;
  return { minX, minY, maxX, maxY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, w: Math.max(40, maxX - minX), h: Math.max(40, maxY - minY) };
}

function hideLabels() {
  field.labelPos = {};
  for (const el of Object.values(field.els)) el.style.display = 'none';
}

function clearField() {
  field.hasFace = false;
  field.skipNext = false;
  field.wasPinch = false;
  hideLabels();
  if (field.ctx && field.canvas) {
    field.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function drawFace(lms) {
  const ctx = field.ctx;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(125, 245, 232, 0.55)';
  ctx.beginPath();
  for (const chain of CHAINS) {
    let started = false;
    for (const idx of chain.idx) {
      const lm = lms[idx];
      if (!lm) continue;
      const p = toScreen(lm);
      if (!started) {
        ctx.moveTo(p.x, p.y);
        started = true;
      } else ctx.lineTo(p.x, p.y);
    }
    if (started && chain.close) ctx.closePath();
  }
  ctx.stroke();

  ctx.fillStyle = 'rgba(186, 255, 248, 0.95)';
  ctx.beginPath();
  for (const idx of DOTS) {
    const lm = lms[idx];
    if (!lm) continue;
    const p = toScreen(lm);
    ctx.moveTo(p.x + 2.1, p.y);
    ctx.arc(p.x, p.y, 2.1, 0, Math.PI * 2);
  }
  ctx.fill();

  ctx.strokeStyle = 'rgba(125, 245, 232, 0.35)';
  ctx.beginPath();
  for (const spec of LABEL_SPECS) {
    const pos = field.labelPos[spec.key];
    if (!pos) continue;
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(pos.ax, pos.ay);
  }
  ctx.stroke();
}

function updateLabels(lms, now) {
  if (now - field.lastLabel < 100) return;
  field.lastLabel = now;
  const box = bbox(lms);
  if (!box) {
    hideLabels();
    return;
  }
  for (const spec of LABEL_SPECS) {
    const x = box.cx + spec.dx * box.w;
    const y = box.cy + spec.dy * box.h;
    const el = field.els[spec.key];
    el.style.display = 'block';
    el.style.left = Math.round(x) + 'px';
    el.style.top = Math.round(y) + 'px';
    field.labelPos[spec.key] = {
      x,
      y,
      ax: box.cx + spec.adx * box.w,
      ay: box.cy + spec.ady * box.h
    };
  }
}

function openLabel(key) {
  const api = window.BSC_StageAPI;
  if (!api) return;
  if (key === 'JARVIS') {
    api.ringToggle();
    return;
  }
  const idx = api.orbIndex(key);
  if (idx >= 0) api.openBrowser(idx);
}

function pinchPoint(handResult) {
  const hands = handResult && handResult.landmarks;
  if (!hands || !hands.length) return null;
  for (const lms of hands) {
    if (!lms || !lms[4] || !lms[8] || !lms[0] || !lms[9]) continue;
    const gap = Math.hypot(lms[4].x - lms[8].x, lms[4].y - lms[8].y);
    const span = Math.hypot(lms[0].x - lms[9].x, lms[0].y - lms[9].y);
    const ratio = span > 0 ? gap / span : 1;
    if (ratio < 0.42) {
      const a = toScreen(lms[4]);
      const b = toScreen(lms[8]);
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }
  }
  return null;
}

function hitLabel(x, y) {
  for (const spec of LABEL_SPECS) {
    const el = field.els[spec.key];
    if (!el || el.style.display === 'none') continue;
    const r = el.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return spec.key;
  }
  return null;
}

function watchPinch(handResult) {
  const pt = pinchPoint(handResult);
  if (pt && !field.wasPinch) {
    const key = hitLabel(pt.x, pt.y);
    if (key) openLabel(key);
  }
  field.wasPinch = !!pt;
}

function mount() {
  const canvas = document.createElement('canvas');
  canvas.id = 'jarvis-face-field';
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;';
  const behind = document.getElementById('behind');
  if (behind && behind.parentNode) behind.parentNode.insertBefore(canvas, behind);
  else document.body.appendChild(canvas);
  field.canvas = canvas;
  field.ctx = canvas.getContext('2d', { alpha: true });

  const labels = document.createElement('div');
  labels.id = 'jarvis-face-labels';
  labels.style.cssText = 'position:fixed;inset:0;z-index:3;pointer-events:none;';
  document.body.appendChild(labels);
  field.labels = labels;
  for (const spec of LABEL_SPECS) {
    const el = document.createElement('button');
    el.type = 'button';
    el.textContent = spec.key;
    el.style.cssText = 'display:none;position:absolute;transform:translate(-50%,-50%);pointer-events:auto;cursor:pointer;color:#e7fffb;background:rgba(4,16,22,0.78);border:1px solid rgba(125,245,232,0.75);border-radius:999px;padding:4px 10px;font:700 11px Pretendard,-apple-system,sans-serif;letter-spacing:0.04em;box-shadow:0 0 12px rgba(0,240,255,0.28);';
    el.addEventListener('pointerdown', (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      openLabel(spec.key);
    });
    labels.appendChild(el);
    field.els[spec.key] = el;
  }
  resize();
  window.addEventListener('resize', resize);
}

async function createFace(vision, delegate) {
  return FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: '/vendor/face_landmarker.task',
      delegate
    },
    runningMode: 'VIDEO',
    numFaces: 1,
    minFaceDetectionConfidence: 0.5,
    minFacePresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: false
  });
}

async function waitVision() {
  for (let i = 0; i < 200; i++) {
    if (window.BSC_VisionFileset) return window.BSC_VisionFileset;
    await new Promise((r) => setTimeout(r, 50));
  }
  return FilesetResolver.forVisionTasks('/vendor/wasm');
}

async function bootFace() {
  const vision = await waitVision();
  try {
    field.landmarker = await createFace(vision, 'GPU');
  } catch (gpuErr) {
    try {
      field.landmarker = await createFace(vision, 'CPU');
    } catch (cpuErr) {
      console.warn('FaceLandmarker unavailable', cpuErr || gpuErr);
      field.landmarker = null;
    }
  }
}

window.BSC_FaceFieldClear = clearField;
window.BSC_OnCameraFrame = function (cam, now, handResult) {
  if (!field.ctx) return;
  if (document.hidden || window.__stageActive === false || !cam || !cam.videoWidth || !cam.srcObject) {
    if (field.hasFace) clearField();
    return;
  }
  if (!field.landmarker) return;
  if (field.skipNext) {
    field.skipNext = false;
    watchPinch(handResult);
    return;
  }
  let res = null;
  const t0 = performance.now();
  try {
    res = field.landmarker.detectForVideo(cam, nextTs(now));
  } catch (err) {
    console.warn('face detect skipped', err);
    return;
  }
  const cost = performance.now() - t0;
  field.lastCost = cost;
  if (cost > 12) field.skipNext = true;
  const lms = res && res.faceLandmarks && res.faceLandmarks[0];
  if (!lms || lms.length < 100) {
    if (field.hasFace) clearField();
    watchPinch(handResult);
    return;
  }
  field.hasFace = true;
  updateLabels(lms, now);
  drawFace(lms);
  watchPinch(handResult);
};

mount();
bootFace();
