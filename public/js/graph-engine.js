/**
 * 🧠🌌 BSC J.A.R.V.I.S. OS — Obsidian-Style Knowledge Neuron Graph Engine
 * Implements CEO Lee Geon-woo's Directive:
 *  - "옵시디언처럼 우리 프로젝트와 스킬, 이런 부분들이 가운데에 지식 뉴런처럼 보여야 하지 않을까."
 *  - Renders all 798+ real nodes (52 Projects, 90+ Skills, 28 Agents, 10 Antigravity 2.0 / IDE Live Sessions,
 *    HQ Knowledge Index, Reports & WorkLogs) as an organic, densely interconnected Obsidian Neural Synapse Web
 *    right in the center of the viewport.
 */

window.BrainGraphEngine = {
  canvas: null,
  ctx: null,
  nodes: [],
  links: [],
  neighbors: new Map(),
  starDust: [],
  synapsePulses: [],
  viewMode: '3d', // '3d' | '2d' | 'rings' | 'areas' | 'timeline' | 'brain'
  activeAreaFilter: null,
  activeKindFilter: 'all',
  searchQuery: '',
  selectedNode: null,
  hoveredNode: null,
  focusMode: false,

  // Camera & Physics parameters
  rotX: 0.12,
  rotY: -0.15,
  autoRotate: true,
  zoom: 1.04,
  camX: 40, // Slight right offset so center neuron web sits cleanly to the right of the left menu
  camY: 0,
  repelStrength: 155,
  linkDistance: 75,
  replayProgress: 1.0,
  tick: 0,
  // Neuron Home Color Palette Mode: 'light-monotone' (Bright Warm Stone) | 'warm-graphite' (Zero-Blue Matte Warm Dark)
  neuronPaletteMode: 'light-monotone',

  normalizeNeuronColor(rawColor, node = {}) {
    const label = String(node.label || node.id || '').toLowerCase();
    const isLight = this.neuronPaletteMode === 'light-monotone';
    if (node.id === 'root_jarvis_core' || node.kind === 'root' || label.includes('j.a.r.v.i.s')) {
      return isLight ? '#d97706' : '#f59e0b'; // Warm Amber Gold
    }
    if (label.includes('hq') || label.includes('본사')) {
      return isLight ? '#18181b' : '#f4f4f5'; // Matte Charcoal / Warm Ivory
    }
    if (label.includes('branch') || label.includes('지점')) {
      return isLight ? '#059669' : '#34d399'; // Soft Sage Emerald
    }
    if (label.includes('research') || label.includes('연구소')) {
      return isLight ? '#ea580c' : '#fb923c'; // Warm Terracotta
    }
    if (label.includes('warehouse') || label.includes('지식생태계') || label.includes('스킬')) {
      return isLight ? '#b45309' : '#fbbf24'; // Warm Bronze / Champagne
    }
    const c = String(rawColor || '').toLowerCase();
    if (!c || c === '#00f0ff' || c === '#38bdf8' || c === '#00d2ff' || c === '#60a5fa') {
      return isLight ? '#374151' : '#d6d3d1'; // Neutral Slate / Warm Stone (Zero Blue)
    }
    if (c === '#a855f7' || c === '#bc13fe' || c === '#c084fc') {
      return isLight ? '#b45309' : '#fbbf24'; // Replace Purple with Warm Amber/Bronze
    }
    if (c === '#f472b6' || c === '#ff0055') {
      return isLight ? '#ea580c' : '#fb923c'; // Replace Neon Pink with Terracotta
    }
    if (c === '#34d399' || c === '#00ff88') {
      return isLight ? '#059669' : '#34d399'; // Sage Emerald
    }
    return isLight ? '#4b5563' : '#e7e5e4';
  },

  async init() {
    this.canvas = document.getElementById('brain-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.initStarDust();
    await this.loadBrainData();
    this.bindEvents();
    this.animate();
  },

  resize() {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  },

  initStarDust() {
    this.starDust = [];
    const palette = ['#a8a29e', '#d97706', '#059669', '#78716c', '#ea580c', '#57534e'];
    for (let i = 0; i < 200; i++) {
      this.starDust.push({
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 1000,
        z: (Math.random() - 0.5) * 800,
        r: Math.random() * 1.3 + 0.3,
        alpha: Math.random() * 0.35 + 0.10,
        color: palette[i % palette.length],
        phase: Math.random() * Math.PI * 2
      });
    }
  },

  async loadBrainData() {
    try {
      const brainRes = await fetch('/api/brain?refresh=1');
      const data = await brainRes.json();

      this.connectedFolders = data.connectedFolders || [];
      this.slots = data.slots || [];
      const rawNodes = data.nodes || [];
      const rawLinks = data.links || [];

      this.buildObsidianNeuralGalaxy(rawNodes, rawLinks);
      this.ensureEcosystemConnectorHud();

      // Update Real-Time Stats
      const statNodes = document.getElementById('stat-nodes');
      const statLinks = document.getElementById('stat-links');
      const liveNeuronCount = document.getElementById('lvm-live-neuron-count');
      const topSlotBadge = document.getElementById('top-connected-slot-badge');
      const topStatusPill = document.getElementById('top-ecosystem-status-pill');
      const cntAll = document.getElementById('cnt-all');

      if (statNodes) statNodes.textContent = `${this.nodes.length}점`;
      if (statLinks) statLinks.textContent = `${this.links.length} 시냅스`;
      if (liveNeuronCount) liveNeuronCount.textContent = `${this.nodes.length} 뉴런`;
      if (topSlotBadge) topSlotBadge.textContent = `${this.connectedFolders.length}`;
      if (topStatusPill) {
        topStatusPill.textContent = this.connectedFolders.length > 0
          ? `연결 슬롯 ${this.connectedFolders.length}개 · ${this.nodes.length} 뉴런 활성`
          : '상업용 클린 모드 · 폴더 연결 대기';
      }
      if (cntAll) cntAll.textContent = this.nodes.length;

      this.renderTopHubs();
      this.computeLayoutTargets();

      const defaultHub = this.nodes[0];
      if (defaultHub) {
        this.selectedNode = defaultHub;
        this.syncNodePreviewCard(defaultHub);
      }
    } catch (e) {
      console.error('Failed to load brain graph:', e);
    }
  },

  async reloadFromDisk() {
    return this.loadBrainData();
  },

  async pollLiveNeurons() {
    try {
      const brain = await fetch('/api/brain').then(r => r.json());
      this.connectedFolders = brain.connectedFolders || [];
      this.slots = brain.slots || [];
      this.buildObsidianNeuralGalaxy(brain.nodes || [], brain.links || []);
      this.updateEcosystemConnectorHudBadge();
      this.renderTopHubs();
      this.computeLayoutTargets();
    } catch (e) {}
  },

  buildObsidianNeuralGalaxy(rawNodes, rawLinks) {
    const categoryColorMap = {
      project: '#00f0ff',
      doc: '#38bdf8',
      person: '#fbbf24',
      topic: '#a855f7',
      idea: '#34d399',
      ext: '#f472b6'
    };

    this.nodes = [];
    this.links = [];
    const idToIdx = new Map();

    // 1. Identify Ecosystem Hubs (kind === 'area' / isEcosystemHub) & Subfolder Hubs (kind === 'project')
    const ecoHubs = rawNodes.filter(n => n.isEcosystemHub || n.kind === 'area');
    const hubCoords = new Map();
    hubCoords.set('root_jarvis_core', { hx: 0, hy: 0, hz: 0 });

    ecoHubs.forEach((eh, idx) => {
      const total = Math.max(1, ecoHubs.length);
      const angle = (idx / total) * Math.PI * 2 - Math.PI / 4;
      const dist = total === 1 ? 165 : 210;
      hubCoords.set(eh.id, {
        hx: Math.cos(angle) * dist,
        hy: Math.sin(angle) * dist * 0.82,
        hz: (idx % 2 === 0 ? 1 : -1) * 35
      });
    });

    const subHubs = rawNodes.filter(n => n.kind === 'project' && !n.isEcosystemHub);
    const subCountByParent = new Map();
    subHubs.forEach((sh) => {
      const pId = sh.parentHubId || 'root_jarvis_core';
      const cIdx = subCountByParent.get(pId) || 0;
      subCountByParent.set(pId, cIdx + 1);
      const pCoord = hubCoords.get(pId) || { hx: 0, hy: 0, hz: 0 };
      const angle = cIdx * 1.15 + 0.4;
      const rad = 78 + (cIdx % 3) * 22;
      hubCoords.set(sh.id, {
        hx: pCoord.hx + Math.cos(angle) * rad,
        hy: pCoord.hy + Math.sin(angle) * rad * 0.86,
        hz: pCoord.hz + Math.sin(angle * 2) * 28
      });
    });

    const childCountByParent = new Map();

    // 2. Build Only Real Connected Nodes (Zero Hardcoded Dummy Clusters!)
    rawNodes.forEach((rn, i) => {
      const nodeIdx = this.nodes.length;
      let hx = 0, hy = 0, hz = 0;
      let r = 4.2;
      let isFeaturedHub = false;
      let isFeaturedChild = false;
      let showAtDefault = false;

      if (rn.id === 'root_jarvis_core' || rn.kind === 'root') {
        hx = 0; hy = 0; hz = 0;
        r = 12.0;
        isFeaturedHub = true;
        showAtDefault = true;
      } else if (rn.isEcosystemHub || rn.kind === 'area') {
        const c = hubCoords.get(rn.id) || { hx: 160, hy: 0, hz: 0 };
        hx = c.hx; hy = c.hy; hz = c.hz;
        r = 10.2;
        isFeaturedHub = true;
        showAtDefault = true;
      } else if (rn.kind === 'project') {
        const c = hubCoords.get(rn.id) || { hx: 90, hy: 60, hz: 0 };
        hx = c.hx; hy = c.hy; hz = c.hz;
        r = 6.2;
        isFeaturedChild = true;
        showAtDefault = true;
      } else {
        const pId = rn.parentHubId || rn.ecosystemHubId || 'root_jarvis_core';
        const pCoord = hubCoords.get(pId) || hubCoords.get(rn.ecosystemHubId) || { hx: 0, hy: 0, hz: 0 };
        const cIdx = childCountByParent.get(pId) || 0;
        childCountByParent.set(pId, cIdx + 1);
        const angle = cIdx * 2.39996; // Golden angle spiral around parent folder/subfolder
        const dist = 34 + Math.sqrt(cIdx) * 15;
        hx = pCoord.hx + Math.cos(angle) * dist;
        hy = pCoord.hy + Math.sin(angle) * dist * 0.88;
        hz = pCoord.hz + Math.cos(cIdx * 0.7) * 36;
        r = cIdx < 5 ? 4.6 : 3.4;
        isFeaturedChild = cIdx < 8;
        showAtDefault = cIdx < 4;
      }

      const parentIdx = idToIdx.get(rn.parentHubId || rn.ecosystemHubId || 'root_jarvis_core');
      const rawColor = rn.color || categoryColorMap[rn.category] || '#374151';
      const color = this.normalizeNeuronColor(rawColor, rn);

      this.nodes.push({
        ...rn,
        idx: nodeIdx,
        isFeaturedHub,
        isFeaturedChild,
        showAtDefault,
        parentHubIdx: parentIdx,
        rawColor,
        color,
        r,
        hx, hy, hz,
        x: hx, y: hy, z: hz,
        tx: hx, ty: hy, tz: hz
      });
      idToIdx.set(rn.id, nodeIdx);
    });

    // 3. Build Real Synapse Links from connected folders
    rawLinks.forEach(l => {
      const s = idToIdx.get(l.source || l.s);
      const t = idToIdx.get(l.target || l.t);
      if (s !== undefined && t !== undefined) {
        const isBackbone = l.type === 'core-hub';
        const isConstellationRay = l.type === 'hub-sub' || l.type === 'parent-child';
        const isCrossSynapse = l.type === 'wikilink';
        const linkColor = this.normalizeNeuronColor(l.color || this.nodes[t]?.color, this.nodes[t] || {});
        this.links.push({
          s,
          t,
          kind: l.type || l.kind,
          isBackbone,
          isConstellationRay,
          isCrossSynapse,
          color: linkColor
        });
      }
    });

    // Build adjacency map
    this.neighbors.clear();
    this.nodes.forEach(n => this.neighbors.set(n.idx, new Set()));
    this.links.forEach(l => {
      this.neighbors.get(l.s)?.add(l.t);
      this.neighbors.get(l.t)?.add(l.s);
    });

    // Initialize traveling neural action-potential pulses along primary links
    this.synapsePulses = [];
    const rayLinks = this.links.filter(l => l.isConstellationRay || l.isBackbone || l.isCrossSynapse);
    for (let i = 0; i < Math.min(45, rayLinks.length); i++) {
      this.synapsePulses.push({
        link: rayLinks[(i * 5) % rayLinks.length],
        t: Math.random(),
        speed: 0.004 + Math.random() * 0.006
      });
    }
  },

  renderTopHubs() {
    const listEl = document.getElementById('top-hubs-list');
    if (!listEl) return;

    const ecoHubs = this.nodes.filter(n => n.isEcosystemHub || n.kind === 'area');
    let html = `
      <div class="hub-item ${!this.activeAreaFilter ? 'active' : ''}" data-area="">
        <span class="dot" style="background:#00f0ff"></span>
        <span class="name">전체 지식 뉴런 (${this.nodes.length})</span>
        <span class="cnt">${this.links.length}</span>
      </div>
    `;

    ecoHubs.forEach(hub => {
      const childCnt = this.nodes.filter(n => n.ecosystemHubId === hub.id || n.parentHubId === hub.id).length;
      html += `
        <div class="hub-item" data-hub-id="${hub.id}">
          <span class="dot" style="background:${hub.color}"></span>
          <span class="name">${hub.label}</span>
          <span class="cnt">${childCnt}</span>
        </div>
      `;
    });
    listEl.innerHTML = html;

    listEl.querySelectorAll('.hub-item').forEach(el => {
      el.addEventListener('click', () => {
        listEl.querySelectorAll('.hub-item').forEach(x => x.classList.remove('active'));
        el.classList.add('active');
        const hubId = el.dataset.hubId;
        if (hubId) {
          const target = this.nodes.find(n => n.id === hubId);
          if (target) {
            this.selectNode(target, true);
            this.flyToNode(target);
          }
        } else {
          this.activeAreaFilter = null;
          this.selectedNode = null;
        }
      });
    });
  },

  ensureEcosystemConnectorHud() {
    if (!this.ecoSseBound) {
      this.ecoSseBound = true;
      try {
        const es = new EventSource('/api/events');
        es.addEventListener('brain_ecosystem_updated', () => {
          this.loadBrainData();
          if (window.JarvisDesignViews?.activeWorkspace === 'ECOSYSTEM_DASHBOARD') {
            window.JarvisDesignViews.openWorkspace('ECOSYSTEM_DASHBOARD');
          }
          this.renderEcosystemModalBody();
        });
      } catch (_) {}
    }
    this.updateEcosystemConnectorHudBadge();
  },

  updateEcosystemConnectorHudBadge() {
    const fCount = (this.connectedFolders || []).length;
    const badge = document.getElementById('top-connected-slot-badge');
    if (badge) badge.textContent = String(fCount);
    const pill = document.getElementById('top-ecosystem-status-pill');
    if (pill) pill.textContent = fCount ? `연결 ${fCount}곳 · 뉴런 ${this.nodes.length}` : '뉴런홈';
  },

  openEcosystemModal() {
    if (window.JarvisDesignViews?.openWorkspace) {
      window.JarvisDesignViews.openWorkspace('ECOSYSTEM_DASHBOARD');
      return;
    }
    let modal = document.getElementById('jarvis-ecosystem-connector-modal');
    if (!modal) {
      modal = document.createElement('section');
      modal.id = 'jarvis-ecosystem-connector-modal';
      modal.className = 'hud-window';
      modal.style.cssText = 'position:fixed;top:96px;left:228px;width:640px;max-width:calc(100vw - 250px);max-height:82vh;z-index:9750;display:flex;flex-direction:column;background:rgba(8,14,28,0.97);border:1px solid rgba(0,240,255,0.55);border-radius:16px;box-shadow:0 24px 70px rgba(0,0,0,0.85);backdrop-filter:blur(20px);overflow:hidden;';
      modal.innerHTML = `
        <div class="hud-window-header" style="padding:10px 14px;background:linear-gradient(90deg,rgba(0,240,255,0.18),rgba(15,23,42,0.95));border-bottom:1px solid rgba(56,189,248,0.3);">
          <div class="win-title-wrap">
            <span class="win-title" style="font-size:13.5px;">🔗 실무 지식생태계 폴더 연결 & .MD 문서 분석 시스템</span>
            <span class="win-subtitle">폴더를 직접 선택해 연결하면 내부 마크다운(.md) 문서의 목차·태그·링크·요약을 정밀 분석하여 보유합니다</span>
          </div>
          <div class="win-controls">
            <button type="button" class="win-ctrl-btn" id="btn-close-eco-modal">✕</button>
          </div>
        </div>
        <div id="jarvis-ecosystem-modal-body" style="padding:14px;overflow-y:auto;display:flex;flex-direction:column;gap:12px;font-size:12px;color:#e2e8f0;"></div>
      `;
      document.body.appendChild(modal);
      if (window.UniversalWindowManager) {
        window.UniversalWindowManager.enhanceWindow(modal, modal.querySelector('.hud-window-header'));
      }
      modal.querySelector('#btn-close-eco-modal')?.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    } else {
      modal.style.display = 'flex';
    }
    this.renderEcosystemModalBody();
  },

  async renderEcosystemModalBody() {
    const body = document.getElementById('jarvis-ecosystem-modal-body');
    if (!body) return;
    const res = await fetch('/api/brain/ecosystems').then(r => r.json()).catch(() => null);
    const slots = res?.slots || [];
    const connected = res?.connectedFolders || [];
    const totalMd = res?.stats?.totalAnalyzedMarkdownFiles || 0;

    body.innerHTML = `
      <!-- 상단 요약 & [+ 폴더 추가] 버튼 바 -->
      <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(15,23,42,0.95);border:1px solid rgba(0,240,255,0.4);border-radius:10px;padding:10px 12px;gap:10px;flex-wrap:wrap;">
        <div>
          <div style="font-weight:800;color:#00f0ff;font-size:12.5px;">
            🧠 활성 슬롯: ${connected.length}개 · 분석된 .MD 문서: ${totalMd}개 · 뉴런 점: ${res?.stats?.totalNodes || this.nodes.length}개
          </div>
          <div style="font-size:11px;color:#94a3b8;margin-top:2px;">
            기본 슬롯([회사_HQ], [회사_Branch], [지식생태계])의 <b>[📂 연결]</b> 또는 우측 <b>[➕ 폴더 추가]</b>를 클릭해 실제 폴더를 선택하세요.
          </div>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <button type="button" id="btn-add-new-folder-slot" class="hud-mini-btn primary" style="padding:7px 12px;font-weight:800;font-size:11.5px;">➕ 폴더 추가</button>
          ${connected.length > 0 ? `<button type="button" id="btn-eco-clear-all" class="win-ctrl-btn" style="border-color:#f87171;color:#f87171;font-size:11px;padding:6px 10px;">🧹 전체 초기화</button>` : ''}
        </div>
      </div>

      <!-- 실시간 폴더 선택 탐색기 영역 (슬롯 [연결] 또는 [+ 폴더 추가] 클릭 시 활성화) -->
      <div id="eco-folder-picker-drawer" style="display:none;background:rgba(4,10,22,0.98);border:1.5px solid #00f0ff;border-radius:12px;padding:12px;"></div>

      <!-- 지식생태계 슬롯 목록 (기본 3종: 회사_HQ / 회사_Branch / 지식생태계 + 추가된 슬롯) -->
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${slots.map(slot => {
          const isConn = Boolean(slot.connected && slot.path);
          const sum = slot.analysisSummary || {};
          const topDocs = Array.isArray(sum.topMarkdownDocs) ? sum.topMarkdownDocs : [];
          const tags = Array.isArray(sum.extractedTags) ? sum.extractedTags : [];

          return `
            <div style="background:rgba(15,23,42,0.92);border:1px solid ${isConn ? (slot.color || '#34d399') : 'rgba(148,163,184,0.28)'};border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:8px;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
                <div style="min-width:0;flex:1;">
                  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                    <span style="font-size:13.5px;font-weight:900;color:${slot.color || '#38bdf8'};">${slot.label}</span>
                    <span style="font-size:10px;padding:2px 8px;border-radius:999px;font-weight:800;background:${isConn ? 'rgba(52,211,153,0.2)' : 'rgba(148,163,184,0.15)'};color:${isConn ? '#34d399' : '#94a3b8'};">
                      ${isConn ? '🟢 연결됨 · .MD 분석 완료' : '⚪ 미연결 (폴더를 선택해 주세요)'}
                    </span>
                  </div>
                  <div style="font-size:11px;color:#cbd5e1;margin-top:3px;">${slot.roleDescription || ''}</div>
                  ${isConn ? `
                    <div style="font-size:11px;color:#38bdf8;font-family:monospace;margin-top:4px;word-break:break-all;">
                      📁 선택된 경로: ${slot.path}
                    </div>
                  ` : ''}
                </div>
                <div style="display:flex;gap:6px;flex-shrink:0;flex-wrap:wrap;">
                  <button type="button" class="hud-mini-btn primary btn-slot-select-folder" data-slot-id="${slot.slotId}" data-slot-label="${slot.label}" data-slot-color="${slot.color || '#00f0ff'}" data-current-path="${slot.path || ''}" style="padding:6px 11px;font-weight:800;font-size:11px;">
                    ${isConn ? '📂 폴더 변경' : '📂 연결 (폴더 선택)'}
                  </button>
                  <button type="button" class="win-ctrl-btn btn-slot-win-picker" data-slot-id="${slot.slotId}" data-slot-label="${slot.label}" data-slot-color="${slot.color || '#00f0ff'}" title="Windows 탐색기 폴더 선택창 띄우기" style="border-color:#38bdf8;color:#38bdf8;font-size:10.5px;padding:5px 9px;">
                    🪟 윈도우창 선택
                  </button>
                  ${isConn ? `
                    <button type="button" class="win-ctrl-btn btn-disconnect-eco" data-slot-id="${slot.slotId}" style="border-color:#f87171;color:#f87171;font-size:10.5px;padding:5px 9px;">
                      ${slot.isDefaultSlot ? '연결 해제' : '슬롯 삭제'}
                    </button>
                  ` : ''}
                </div>
              </div>

              ${isConn ? `
                <!-- 분석된 .MD 파일 및 내용 요약 리포트 -->
                <div style="background:rgba(6,11,22,0.9);border:1px solid rgba(56,189,248,0.22);border-radius:8px;padding:8px 10px;display:flex;flex-direction:column;gap:6px;">
                  <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:11px;color:#e2e8f0;font-weight:700;">
                    <span>📝 분석된 .MD 파일: <strong style="color:#00f0ff;">${sum.markdownFileCount || 0}개</strong></span>
                    <span>📦 전체 스캔 파일: <strong>${sum.totalFilesScanned || 0}개</strong></span>
                    <span>📑 추출된 목차(H1~H3): <strong style="color:#fbbf24;">${sum.totalHeadingsCount || 0}개</strong></span>
                    <span>🔗 위키/문서 링크: <strong style="color:#34d399;">${sum.totalWikiLinksCount || 0}개</strong></span>
                  </div>
                  ${tags.length > 0 ? `
                    <div style="display:flex;gap:4px;flex-wrap:wrap;">
                      ${tags.slice(0, 10).map(t => `<span style="background:rgba(168,85,247,0.18);color:#d8b4fe;padding:1px 6px;border-radius:4px;font-size:10px;">#${t}</span>`).join('')}
                    </div>
                  ` : ''}
                  ${topDocs.length > 0 ? `
                    <details style="margin-top:2px;">
                      <summary style="cursor:pointer;color:#38bdf8;font-weight:800;font-size:11px;user-select:none;">
                        📖 보유 중인 .MD 분석 문서 목록 열람 (${topDocs.length}개) — 클릭 시 원문 열기 / IDE 2.0 편집
                      </summary>
                      <div style="margin-top:6px;display:flex;flex-direction:column;gap:5px;max-height:190px;overflow-y:auto;padding-right:4px;">
                        ${topDocs.map(doc => `
                          <div style="background:rgba(15,23,42,0.95);border:1px solid rgba(148,163,184,0.2);border-radius:6px;padding:6px 8px;display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                            <div style="min-width:0;flex:1;">
                              <div style="font-weight:800;color:#f8fafc;font-size:11px;">📝 ${doc.fileName} <span style="color:#94a3b8;font-weight:400;">(${doc.title})</span></div>
                              <div style="font-size:10.5px;color:#cbd5e1;margin-top:2px;">${doc.summary}</div>
                              ${doc.headings && doc.headings.length > 0 ? `
                                <div style="font-size:10px;color:#fbbf24;margin-top:2px;">목차: ${doc.headings.join(' · ')}</div>
                              ` : ''}
                            </div>
                            <div style="display:flex;gap:4px;flex-shrink:0;">
                              <button type="button" class="win-ctrl-btn btn-open-md-preview" data-file-path="${doc.filePath}" style="font-size:10px;padding:3px 7px;border-color:#00f0ff;color:#00f0ff;">원문 보기</button>
                              <button type="button" class="win-ctrl-btn btn-open-md-ide" data-file-path="${doc.filePath}" style="font-size:10px;padding:3px 7px;border-color:#34d399;color:#34d399;">IDE 편집</button>
                            </div>
                          </div>
                        `).join('')}
                      </div>
                    </details>
                  ` : `
                    <div style="font-size:10.5px;color:#94a3b8;">이 폴더에는 .md 파일이 ${sum.markdownFileCount || 0}개 있으며 코드/기타 파일 ${sum.otherFileCount || 0}개가 뉴런으로 연결되었습니다.</div>
                  `}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;

    // [+ 폴더 추가] 버튼 클릭 -> 새 슬롯용 폴더 선택 탐색기 열기
    body.querySelector('#btn-add-new-folder-slot')?.addEventListener('click', () => {
      this.openInlineFolderBrowser({
        slotId: '',
        slotLabel: '',
        slotColor: '#00f0ff',
        startDir: 'C:\\',
        isNewCustomSlot: true
      });
    });

    // 각 슬롯의 [📂 연결 (폴더 선택)] 버튼 클릭 -> 실시간 폴더 탐색기 열기
    body.querySelectorAll('.btn-slot-select-folder').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openInlineFolderBrowser({
          slotId: btn.dataset.slotId,
          slotLabel: btn.dataset.slotLabel,
          slotColor: btn.dataset.slotColor,
          startDir: btn.dataset.currentPath || 'C:\\',
          isNewCustomSlot: false
        });
      });
    });

    // 각 슬롯의 [🪟 윈도우창 선택] 버튼 클릭 -> Windows 네이티브 폴더 선택 대화상자 실행
    body.querySelectorAll('.btn-slot-win-picker').forEach(btn => {
      btn.addEventListener('click', async () => {
        const origText = btn.textContent;
        btn.textContent = '⏳ 폴더창 대기...';
        btn.disabled = true;
        const r = await fetch('/api/brain/pick-folder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slotId: btn.dataset.slotId,
            label: btn.dataset.slotLabel,
            color: btn.dataset.slotColor,
            description: `${btn.dataset.slotLabel}에 연결할 폴더를 선택하세요 (.md 자동 분석)`
          })
        }).then(x => x.json()).catch(() => null);
        btn.textContent = origText;
        btn.disabled = false;
        if (r && r.ok) {
          await this.loadBrainData();
          await this.renderEcosystemModalBody();
        }
      });
    });

    // .MD 문서 [원문 보기] 버튼
    body.querySelectorAll('.btn-open-md-preview, .btn-open-md-ide').forEach(btn => {
      btn.addEventListener('click', () => {
        const fp = btn.dataset.filePath;
        if (!fp || !window.JarvisDesignViews) return;
        window.JarvisDesignViews.pendingDocPath = fp;
        window.JarvisDesignViews.openWorkspace('DOC_IDE_DASHBOARD');
      });
    });

    // [연결 해제 / 슬롯 삭제] 버튼
    body.querySelectorAll('.btn-disconnect-eco').forEach(btn => {
      btn.addEventListener('click', async () => {
        await fetch('/api/brain/disconnect-folder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slotId: btn.dataset.slotId })
        });
        await this.loadBrainData();
        await this.renderEcosystemModalBody();
      });
    });

    // [전체 초기화] 버튼
    body.querySelector('#btn-eco-clear-all')?.addEventListener('click', async () => {
      await fetch('/api/brain/clear-all', { method: 'POST' });
      await this.loadBrainData();
      await this.renderEcosystemModalBody();
    });
  },

  async openInlineFolderBrowser(opts = {}) {
    const drawer = document.getElementById('eco-folder-picker-drawer');
    if (!drawer) return;
    drawer.style.display = 'block';

    const slotId = opts.slotId || '';
    const isNewCustomSlot = Boolean(opts.isNewCustomSlot);
    let currentDir = opts.startDir || 'C:\\';

    const renderDirStep = async (dirPath) => {
      const res = await fetch(`/api/brain/browse-dirs?dir=${encodeURIComponent(dirPath)}`).then(r => r.json()).catch(() => null);
      if (!res || !res.ok) return;
      currentDir = res.currentDir;

      drawer.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-weight:900;color:#00f0ff;font-size:12.5px;">
            ${isNewCustomSlot ? '➕ 새 폴더 추가 연결 및 .MD 분석' : `📂 [${opts.slotLabel}]에 연결할 폴더 선택`}
          </span>
          <button type="button" id="btn-close-folder-drawer" class="win-ctrl-btn" style="font-size:10.5px;">닫기 ✕</button>
        </div>

        ${isNewCustomSlot ? `
          <div style="margin-bottom:8px;display:flex;gap:6px;align-items:center;">
            <span style="font-size:11px;color:#cbd5e1;font-weight:700;">슬롯 이름:</span>
            <input type="text" id="input-new-slot-label" placeholder="비워두면 선택한 폴더 이름으로 자동 생성됩니다 (예: 개인_옵시디언, 신규_사업)" style="flex:1;background:#060c18;border:1px solid rgba(56,189,248,0.4);border-radius:6px;padding:5px 8px;color:#fff;font-size:11px;" />
          </div>
        ` : ''}

        <!-- 드라이브 빠른 이동 & 윈도우 네이티브 창 호출 -->
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:8px;flex-wrap:wrap;">
          <div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap;">
            <span style="font-size:10.5px;color:#94a3b8;">로컬 디스크 드라이브:</span>
            ${(res.drives || ['C:\\']).map(d => `
              <button type="button" class="win-ctrl-btn btn-browse-drive" data-dir="${d}" style="font-size:10.5px;padding:3px 8px;">💿 ${d}</button>
            `).join('')}
          </div>
          <button type="button" id="btn-drawer-win-native" class="win-ctrl-btn" style="border-color:#a855f7;color:#d8b4fe;font-size:10.5px;padding:4px 9px;">🪟 Windows 탐색기 창으로 폴더 선택</button>
        </div>

        <!-- 현재 선택된 경로 표시 & 즉시 연결 확정 버튼 -->
        <div style="display:flex;gap:6px;align-items:center;background:#060c18;border:1px solid rgba(0,240,255,0.45);border-radius:8px;padding:7px 10px;margin-bottom:8px;">
          <div style="flex:1;min-width:0;">
            <div style="font-size:10px;color:#94a3b8;">현재 위치 (직속 .md ${res.currentMdCount}개 / 파일 ${res.currentTotalFiles}개):</div>
            <input type="text" id="input-drawer-current-path" value="${res.currentDir}" style="width:100%;background:transparent;border:none;color:#00f0ff;font-family:monospace;font-size:11.5px;font-weight:800;outline:none;" />
          </div>
          <button type="button" id="btn-confirm-connect-current-dir" class="hud-mini-btn primary" style="padding:7px 12px;font-weight:900;font-size:11.5px;flex-shrink:0;">
            ✅ 이 폴더 선택 및 .MD 분석 연결
          </button>
        </div>

        <!-- 하위 폴더 목록 클릭 탐색 -->
        <div style="max-height:195px;overflow-y:auto;background:rgba(10,16,30,0.95);border:1px solid rgba(148,163,184,0.2);border-radius:8px;padding:6px;display:flex;flex-direction:column;gap:4px;">
          ${res.parentDir ? `
            <div class="dir-row-item" data-dir="${res.parentDir}" style="padding:5px 8px;border-radius:6px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:rgba(30,41,59,0.5);color:#fbbf24;font-weight:800;">
              <span>⬆️ 상위 폴더로 이동 (${res.parentDir})</span>
            </div>
          ` : ''}
          ${(res.subDirs || []).map(sd => `
            <div style="padding:5px 8px;border-radius:6px;display:flex;justify-content:space-between;align-items:center;background:rgba(15,23,42,0.85);border:1px solid rgba(148,163,184,0.12);gap:8px;">
              <div class="dir-row-item" data-dir="${sd.path}" style="flex:1;cursor:pointer;display:flex;align-items:center;gap:8px;min-width:0;">
                <span style="font-weight:700;color:#f8fafc;">📁 ${sd.name}</span>
                ${sd.mdCount > 0 ? `<span style="font-size:10px;background:rgba(0,240,255,0.18);color:#00f0ff;padding:1px 6px;border-radius:999px;">.md ${sd.mdCount}개</span>` : ''}
                ${sd.childFolderCount > 0 ? `<span style="font-size:10px;color:#64748b;">하위폴더 ${sd.childFolderCount}개</span>` : ''}
              </div>
              <button type="button" class="win-ctrl-btn btn-quick-select-subdir" data-dir="${sd.path}" data-name="${sd.name}" style="font-size:10px;padding:3px 8px;border-color:#34d399;color:#34d399;flex-shrink:0;">선택 연결</button>
            </div>
          `).join('')}
        </div>
      `;

      drawer.querySelector('#btn-close-folder-drawer')?.addEventListener('click', () => {
        drawer.style.display = 'none';
      });

      drawer.querySelectorAll('.btn-browse-drive, .dir-row-item').forEach(el => {
        el.addEventListener('click', () => renderDirStep(el.dataset.dir));
      });

      const doConnectPath = async (targetPath, fallbackName = '') => {
        const customLabelInput = drawer.querySelector('#input-new-slot-label')?.value?.trim() || '';
        const finalLabel = isNewCustomSlot
          ? (customLabelInput || (fallbackName ? `📂 ${fallbackName}` : ''))
          : opts.slotLabel;

        const r = await fetch('/api/brain/connect-folder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slotId,
            folderPath: targetPath,
            label: finalLabel,
            color: opts.slotColor || ''
          })
        }).then(x => x.json()).catch(() => null);

        if (r && r.ok) {
          drawer.style.display = 'none';
          await this.loadBrainData();
          await this.renderEcosystemModalBody();
        }
      };

      drawer.querySelector('#btn-confirm-connect-current-dir')?.addEventListener('click', () => {
        const typedPath = drawer.querySelector('#input-drawer-current-path')?.value?.trim() || currentDir;
        doConnectPath(typedPath);
      });

      drawer.querySelectorAll('.btn-quick-select-subdir').forEach(btn => {
        btn.addEventListener('click', () => doConnectPath(btn.dataset.dir, btn.dataset.name));
      });

      drawer.querySelector('#btn-drawer-win-native')?.addEventListener('click', async () => {
        const customLabelInput = drawer.querySelector('#input-new-slot-label')?.value?.trim() || '';
        const r = await fetch('/api/brain/pick-folder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slotId,
            label: isNewCustomSlot ? customLabelInput : opts.slotLabel,
            color: opts.slotColor || ''
          })
        }).then(x => x.json()).catch(() => null);
        if (r && r.ok) {
          drawer.style.display = 'none';
          await this.loadBrainData();
          await this.renderEcosystemModalBody();
        }
      });
    };

    await renderDirStep(currentDir);
  },

  computeLayoutTargets() {
    const N = this.nodes.length;
    if (!N) return;
    const spread = this.repelStrength / 155;

    this.nodes.forEach((n, i) => {
      if (this.viewMode === '3d' || this.viewMode === '2d') {
        n.tx = (n.hx || 0) * spread;
        n.ty = (n.hy || 0) * spread;
        n.tz = this.viewMode === '2d' ? 0 : (n.hz || 0) * spread;
      } else if (this.viewMode === 'rings') {
        const ringIdx = n.isFeaturedHub ? 1 : n.isFeaturedChild ? 2 : 3;
        const ringR = ringIdx * 115 * spread;
        const ang = (i / N) * Math.PI * 2 * 3;
        n.tx = Math.cos(ang) * ringR;
        n.ty = Math.sin(ang) * ringR;
        n.tz = 0;
      } else if (this.viewMode === 'areas') {
        n.tx = (n.hx || 0) * 1.18 * spread;
        n.ty = (n.hy || 0) * 1.18 * spread;
        n.tz = 0;
      } else if (this.viewMode === 'timeline') {
        const xSpan = 820 * spread;
        n.tx = ((i / Math.max(1, N - 1)) - 0.5) * xSpan;
        n.ty = Math.sin(i * 0.35) * 140;
        n.tz = 0;
      } else if (this.viewMode === 'brain') {
        const hemi = i % 2 === 0 ? -1 : 1;
        const u = ((i * 0.6180339) % 1) * Math.PI;
        const v = (i / N) * Math.PI * 2;
        const rx = 165 * spread, ry = 205 * spread, rz = 140 * spread;
        n.tx = hemi * (34 + Math.abs(Math.sin(u) * Math.cos(v)) * rx);
        n.ty = Math.sin(u) * Math.sin(v) * ry * 0.82;
        n.tz = Math.cos(u) * rz;
      }
    });
  },

  setViewMode(mode) {
    this.viewMode = mode;
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === mode);
    });
    const toggle2d3d = document.getElementById('btn-bottom-2d3d');
    if (toggle2d3d) {
      toggle2d3d.textContent = mode === '2d' ? '2D' : '3D';
    }
    this.computeLayoutTargets();
  },

  isNodeVisible(n) {
    if (n.idx / Math.max(1, this.nodes.length) > this.replayProgress) return false;
    if (this.activeAreaFilter && n.area !== this.activeAreaFilter && !n.isFeaturedHub) return false;
    if (this.activeKindFilter !== 'all' && n.category !== this.activeKindFilter && n.kind !== this.activeKindFilter) {
      return false;
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      if (!n.label.toLowerCase().includes(q) && !(n.note || '').toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  },

  project(n, W, H) {
    let x = n.x, y = n.y, z = n.z;
    if (this.viewMode === '3d' || this.viewMode === 'brain') {
      const cy = Math.cos(this.rotY), sy = Math.sin(this.rotY);
      const x1 = x * cy - z * sy;
      const z1 = x * sy + z * cy;
      const cx = Math.cos(this.rotX), sx = Math.sin(this.rotX);
      const y2 = y * cx - z1 * sx;
      const z2 = y * sx + z1 * cx;
      const fov = 980;
      const scale = (fov / Math.max(220, fov + z2)) * this.zoom;
      return {
        sx: W / 2 + this.camX + x1 * scale,
        sy: H / 2 + this.camY + y2 * scale,
        scale,
        z: z2
      };
    } else {
      return {
        sx: W / 2 + this.camX + x * this.zoom,
        sy: H / 2 + this.camY + y * this.zoom,
        scale: this.zoom,
        z: 0
      };
    }
  },

  drawCosmicNebulaBackdrop(ctx, W, H) {
    const isLight = this.neuronPaletteMode === 'light-monotone';
    const bgGrad = ctx.createRadialGradient(W * 0.54, H * 0.48, 40, W * 0.52, H * 0.5, Math.max(W, H) * 0.78);
    if (isLight) {
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(0.55, '#f4f5f7');
      bgGrad.addColorStop(1, '#ebedf0');
    } else {
      bgGrad.addColorStop(0, '#262523');
      bgGrad.addColorStop(0.55, '#1c1b1a');
      bgGrad.addColorStop(1, '#141312');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle Warm Glow around each Neural Cluster Hub (Zero Blue)
    for (const n of this.nodes) {
      if (!n.isFeaturedHub || !n.sx) continue;
      const nebR = (n.id === 'hub-ai-office' ? 185 : 140) * (n.scale || 1);
      const g = ctx.createRadialGradient(n.sx, n.sy, 4, n.sx, n.sy, nebR);
      const hubCol = this.normalizeNeuronColor(n.color, n);
      g.addColorStop(0, hubCol + (isLight ? '1f' : '26'));
      g.addColorStop(0.5, hubCol + (isLight ? '0a' : '0c'));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.sx, n.sy, nebR, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const s of this.starDust) {
      const p = this.project(s, W, H);
      if (p.sx < 0 || p.sx > W || p.sy < 0 || p.sy > H) continue;
      const tw = s.alpha * (0.65 + 0.35 * Math.sin(this.tick * 1.8 + s.phase));
      ctx.globalAlpha = isLight ? tw * 0.65 : tw;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, s.r * Math.min(1.4, p.scale), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  },

  drawStarburstFlare(ctx, x, y, radius, color, isSelected) {
    const isLight = this.neuronPaletteMode === 'light-monotone';
    const normCol = this.normalizeNeuronColor(color);
    const haloR = radius * (isSelected ? 4.2 : 3.2);
    const g = ctx.createRadialGradient(x, y, radius * 0.2, x, y, haloR);
    g.addColorStop(0, isLight ? normCol : '#ffffff');
    g.addColorStop(0.28, normCol);
    g.addColorStop(0.65, normCol + (isLight ? '33' : '44'));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, haloR, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = isLight ? '#18181b' : '#ffffff';
    ctx.lineWidth = isSelected ? 1.8 : 1.25;
    const spikeLen = radius * (isSelected ? 3.0 : 2.2);
    ctx.beginPath();
    ctx.moveTo(-spikeLen, 0);
    ctx.lineTo(spikeLen, 0);
    ctx.moveTo(0, -spikeLen);
    ctx.lineTo(0, spikeLen);
    ctx.stroke();

    ctx.fillStyle = isLight ? '#ffffff' : '#ffffff';
    ctx.strokeStyle = normCol;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.58, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  },

  paused: false,
  _rafId: 0,

  setPaused(on) {
    this.paused = !!on;
    if (this.paused) {
      if (this._rafId) cancelAnimationFrame(this._rafId);
      this._rafId = 0;
      return;
    }
    if (!this._rafId && this.ctx) {
      this._rafId = requestAnimationFrame(() => this.animate());
    }
  },

  animate() {
    this._rafId = 0;
    if (this.paused || !this.ctx) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const ctx = this.ctx;
    this.tick += 0.016;

    if (this.autoRotate && !this.hoveredNode && (this.viewMode === '3d' || this.viewMode === 'brain')) {
      this.rotY += 0.00085;
    }

    if (this.replayProgress < 1.0) {
      this.replayProgress = Math.min(1.0, this.replayProgress + 0.015);
    }

    for (const n of this.nodes) {
      n.x += (n.tx - n.x) * 0.085;
      n.y += (n.ty - n.y) * 0.085;
      n.z += (n.tz - n.z) * 0.085;
      const p = this.project(n, W, H);
      n.sx = p.sx;
      n.sy = p.sy;
      n.scale = p.scale;
      n.depth = p.z;
    }

    this.drawCosmicNebulaBackdrop(ctx, W, H);

    const focusTarget = this.hoveredNode || this.selectedNode;
    let focusSet = null;
    if (focusTarget) {
      focusSet = new Set([focusTarget.idx]);
      const nbrs = this.neighbors.get(focusTarget.idx);
      if (nbrs) nbrs.forEach(idx => focusSet.add(idx));
    }

    // 1. Draw Obsidian Neural Synapse Links (Zero-Blue Monotone / Warm Palette)
    const isLight = this.neuronPaletteMode === 'light-monotone';
    for (const l of this.links) {
      const a = this.nodes[l.s];
      const b = this.nodes[l.t];
      if (!a || !b || !this.isNodeVisible(a) || !this.isNodeVisible(b)) continue;

      const isHighlighted = focusSet && focusSet.has(a.idx) && focusSet.has(b.idx);
      if (focusSet && !isHighlighted && this.focusMode) continue;

      const linkCol = this.normalizeNeuronColor(l.color, b);
      if (l.isConstellationRay) {
        ctx.lineWidth = isHighlighted ? 1.5 : 0.95;
        ctx.strokeStyle = isHighlighted ? linkCol + 'cc' : (isLight ? 'rgba(71, 85, 105, 0.28)' : 'rgba(214, 211, 209, 0.26)');
      } else if (l.isBackbone) {
        ctx.lineWidth = isHighlighted ? 1.5 : 1.0;
        ctx.strokeStyle = isHighlighted ? linkCol + 'dd' : (isLight ? 'rgba(24, 24, 27, 0.25)' : 'rgba(245, 158, 11, 0.28)');
      } else if (l.isLateralSynapse || l.isCrossSynapse) {
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = isHighlighted ? linkCol + 'aa' : (isLight ? 'rgba(100, 116, 139, 0.18)' : 'rgba(168, 162, 158, 0.18)');
      } else {
        ctx.lineWidth = 0.65;
        ctx.strokeStyle = isHighlighted ? linkCol + '99' : (isLight ? 'rgba(148, 163, 184, 0.22)' : 'rgba(120, 113, 108, 0.18)');
      }

      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    }

    // 2. Draw Traveling Synapse Action-Potential Pulses
    for (const sp of this.synapsePulses) {
      sp.t = (sp.t + sp.speed) % 1.0;
      const a = this.nodes[sp.link.s];
      const b = this.nodes[sp.link.t];
      if (!a || !b || !this.isNodeVisible(a) || !this.isNodeVisible(b)) continue;
      const px = a.sx + (b.sx - a.sx) * sp.t;
      const py = a.sy + (b.sy - a.sy) * sp.t;
      ctx.fillStyle = isLight ? '#d97706' : '#f59e0b';
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.arc(px, py, 2.0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 3. Draw Neuron Nodes & Obsidian Smart Labels sorted back-to-front
    this._placedLabelBoxes = [];
    const sorted = [...this.nodes].sort((a, b) => b.depth - a.depth);
    for (const n of sorted) {
      if (!this.isNodeVisible(n)) continue;
      const inFocus = !focusSet || focusSet.has(n.idx);
      if (!inFocus && this.focusMode) continue;

      const radius = Math.max(2.0, n.r * n.scale);
      const isDirectTarget = n === this.selectedNode || n === this.hoveredNode;
      const nodeCol = this.normalizeNeuronColor(n.color, n);

      if (n.isFeaturedHub) {
        ctx.globalAlpha = 1.0;
        this.drawStarburstFlare(ctx, n.sx, n.sy, radius, nodeCol, isDirectTarget);
      } else if (n.isFeaturedChild) {
        ctx.globalAlpha = inFocus ? 0.96 : 0.65;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, radius * 2.1, 0, Math.PI * 2);
        ctx.fillStyle = nodeCol + (isLight ? '26' : '38');
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.sx, n.sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = isDirectTarget ? '#d97706' : (isLight ? '#18181b' : '#faf8f5');
        ctx.fill();
      } else {
        // Obsidian Vault Knowledge Neurons (clearly visible & interactive)
        ctx.globalAlpha = inFocus ? 0.82 : 0.42;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeCol;
        ctx.fill();
      }

      // Obsidian LOD Label Rendering:
      // Shows all 8 Hubs + default Featured Neurons + any hovered/focused neighbors + more neurons as you zoom in
      const shouldShowLabel =
        n.isFeaturedHub ||
        isDirectTarget ||
        (n.isFeaturedChild && (n.showAtDefault || inFocus || this.zoom > 1.15)) ||
        (focusSet && focusSet.has(n.idx)) ||
        (this.zoom > 1.38 && inFocus);

      if (shouldShowLabel) {
        const labelText = n.label.slice(0, 24);
        const isHub = n.isFeaturedHub;
        const fontSize = isHub ? 13.5 : isDirectTarget ? 12 : 10.8;
        ctx.font = `${isHub || isDirectTarget ? '700' : '600'} ${fontSize}px Pretendard, -apple-system, sans-serif`;
        const estW = ctx.measureText(labelText).width + 10;
        const estH = fontSize + 5;
        const lx = isHub ? n.sx - estW / 2 : n.sx + radius + 5;
        const ly = isHub ? n.sy + radius * 2.1 + 3 : n.sy - fontSize / 2;

        let overlaps = false;
        if (!isHub && !isDirectTarget) {
          for (const box of this._placedLabelBoxes) {
            if (lx < box.x + box.w && lx + estW > box.x && ly < box.y + box.h && ly + estH > box.y) {
              overlaps = true;
              break;
            }
          }
        }

        if (!overlaps) {
          this._placedLabelBoxes.push({ x: lx, y: ly, w: estW, h: estH, node: n });
          ctx.globalAlpha = isHub || isDirectTarget ? 1.0 : 0.92;
          ctx.shadowColor = isLight ? 'rgba(255, 255, 255, 0.96)' : 'rgba(0, 0, 0, 0.92)';
          ctx.shadowBlur = isLight ? 4 : 5;
          ctx.fillStyle = isHub
            ? (isLight ? '#111827' : '#ffffff')
            : isDirectTarget
              ? '#d97706'
              : (isLight ? '#374151' : '#e7e5e4');
          ctx.fillText(labelText, isHub ? n.sx - (estW - 10) / 2 : n.sx + radius + 5, isHub ? n.sy + radius * 2.1 + fontSize : n.sy + 3.5);
          ctx.shadowBlur = 0;
        }
      }
    }
    ctx.globalAlpha = 1.0;

    this._rafId = requestAnimationFrame(() => this.animate());
  },

  findNodeAt(x, y) {
    // 1. Find closest visible neuron dot within generous click radius
    let bestNode = null;
    let bestDistSq = Infinity;
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      if (!this.isNodeVisible(n)) continue;
      const hitPad = n.isFeaturedHub ? 24 : n.isFeaturedChild ? 15 : 11;
      const r = Math.max(12, n.r * (n.scale || 1) + hitPad);
      const dx = n.sx - x;
      const dy = n.sy - y;
      const dSq = dx * dx + dy * dy;
      if (dSq <= r * r && dSq < bestDistSq) {
        bestDistSq = dSq;
        bestNode = n;
      }
    }
    if (bestNode) return bestNode;

    // 2. Also allow clicking directly on the rendered neuron text label box
    if (Array.isArray(this._placedLabelBoxes)) {
      for (let i = this._placedLabelBoxes.length - 1; i >= 0; i--) {
        const b = this._placedLabelBoxes[i];
        if (b && b.node && x >= b.x - 4 && x <= b.x + b.w + 4 && y >= b.y - 4 && y <= b.y + b.h + 6) {
          return b.node;
        }
      }
    }
    return null;
  },

  syncNodePreviewCard(node) {
    if (!node) return;
    const titleEl = document.getElementById('np-card-title');
    const subEl = document.getElementById('np-card-sub');
    const imgEl = document.getElementById('np-card-img');
    const badgeEl = document.getElementById('np-card-badge');

    if (titleEl) titleEl.textContent = node.label;
    if (subEl) subEl.textContent = node.subtitle || node.note || 'BSC J.A.R.V.I.S. 지식 뉴런 노드';
    if (imgEl && node.previewImg) imgEl.src = node.previewImg;
    if (badgeEl) {
      badgeEl.textContent = node.area || 'OBSIDIAN NEURON';
      badgeEl.style.color = node.color || '#00f0ff';
    }
  },

  selectNode(node, openWindow = false) {
    this.selectedNode = node;
    const inspEl = document.getElementById('inspector-content');
    const actEl = document.getElementById('inspector-actions');

    if (!node) return;

    this.syncNodePreviewCard(node);

    const nbrCount = (this.neighbors.get(node.idx) || new Set()).size;
    if (inspEl) {
      inspEl.innerHTML = `
        <div style="color:${node.color};font-weight:800;font-size:13px;margin-bottom:4px;">${node.label}</div>
        <div style="font-size:10.5px;color:#38bdf8;font-family:monospace;margin-bottom:6px;">[${node.area}] · ${nbrCount} synapses</div>
        <div style="color:#e2e8f0;margin-bottom:6px;">${node.note || ''}</div>
        <div style="font-size:10px;color:#64748b;word-break:break-all;">${node.path || ''}</div>
      `;
    }
    if (actEl) actEl.style.display = 'flex';

    if (openWindow) {
      if (window.NeuronContentStudio && typeof window.NeuronContentStudio.openNeuronModal === 'function') {
        window.NeuronContentStudio.openNeuronModal(node);
      } else if (window.JarvisDesignViews && node.workspaceTarget) {
        window.JarvisDesignViews.openWorkspace(node.workspaceTarget, node);
      } else if (node.path) {
        this.openNodeInReportWindow(node);
      }
    }
  },

  async openNodeInReportWindow(node) {
    if (!node) return;
    if (window.JarvisDesignViews && node.workspaceTarget) {
      window.JarvisDesignViews.openWorkspace(node.workspaceTarget, node);
      return;
    }
    try {
      const res = await fetch(`/api/read-node?path=${encodeURIComponent(node.path || '')}`);
      const data = await res.json();
      window.HUDWindowSpawner?.spawn({
        windowType: 'REPORT',
        title: `📊 ${node.label}`,
        subtitle: `${node.area} · ${node.path || ''}`,
        content: data.ok ? data.content : `# ${node.label}\n\n${node.note || ''}`
      });
    } catch (e) {}
  },

  flyToNode(node) {
    if (!node) return;
    this.camX = 40 - node.x * 0.55;
    this.camY = -node.y * 0.55;
    this.zoom = 1.32;
  },

  bindEvents() {
    let dragging = false, startX = 0, startY = 0, downX = 0, downY = 0, moved = false, downHit = null;

    this.canvas.addEventListener('mousedown', e => {
      dragging = true;
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      downX = e.clientX;
      downY = e.clientY;
      downHit = this.findNodeAt(e.clientX, e.clientY) || this.hoveredNode;
      if (!downHit) {
        this.autoRotate = false;
      }
    });

    window.addEventListener('mousemove', e => {
      if (!dragging) {
        this.hoveredNode = this.findNodeAt(e.clientX, e.clientY);
        this.canvas.style.cursor = this.hoveredNode ? 'pointer' : 'grab';
        return;
      }
      const totalDist = Math.hypot(e.clientX - downX, e.clientY - downY);
      const threshold = downHit ? 14 : 6;
      if (totalDist > threshold) {
        moved = true;
        this.autoRotate = false;
      }
      if (!moved) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (this.viewMode === '3d' || this.viewMode === 'brain') {
        this.rotY += dx * 0.0045;
        this.rotX = Math.max(-1.1, Math.min(1.1, this.rotX + dy * 0.0045));
      } else {
        this.camX += dx;
        this.camY += dy;
      }
      startX = e.clientX;
      startY = e.clientY;
    });

    window.addEventListener('mouseup', e => {
      if (dragging && !moved) {
        const hit = this.findNodeAt(e.clientX, e.clientY) || downHit || this.hoveredNode;
        if (hit) {
          this.selectNode(hit, true);
        }
      }
      dragging = false;
      downHit = null;
    });

    this.canvas.addEventListener('click', e => {
      if (!moved) {
        const hit = this.findNodeAt(e.clientX, e.clientY) || this.hoveredNode;
        if (hit && (!window.NeuronContentStudio || !window.NeuronContentStudio.isOpen)) {
          this.selectNode(hit, true);
        }
      }
    });

    this.canvas.addEventListener('dblclick', e => {
      const hit = this.findNodeAt(e.clientX, e.clientY) || this.hoveredNode || this.selectedNode;
      if (hit) this.selectNode(hit, true);
    });

    this.canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      this.zoom = Math.max(0.4, Math.min(3.5, this.zoom * factor));
    }, { passive: false });

    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => this.setViewMode(btn.dataset.view));
    });

    document.getElementById('btn-toggle-2d3d')?.addEventListener('click', () => {
      this.setViewMode(this.viewMode === '2d' ? '3d' : '2d');
    });

    document.getElementById('btn-bottom-zoom-in')?.addEventListener('click', () => {
      this.zoom = Math.min(3.5, this.zoom * 1.18);
    });
    document.getElementById('btn-bottom-zoom-out')?.addEventListener('click', () => {
      this.zoom = Math.max(0.4, this.zoom * 0.84);
    });
    document.getElementById('btn-bottom-fit')?.addEventListener('click', () => {
      this.camX = 40;
      this.camY = 0;
      this.zoom = 1.04;
      this.rotX = 0.12;
      this.rotY = -0.15;
      this.autoRotate = true;
    });

    document.getElementById('btn-fit-graph')?.addEventListener('click', () => {
      this.camX = 40;
      this.camY = 0;
      this.zoom = 1.04;
      this.rotX = 0.12;
      this.rotY = -0.15;
      this.autoRotate = true;
    });

    document.getElementById('btn-replay-growth')?.addEventListener('click', () => {
      this.replayProgress = 0.02;
    });

    document.getElementById('btn-open-node-report')?.addEventListener('click', () => {
      if (this.selectedNode) this.openNodeInReportWindow(this.selectedNode);
    });
    document.getElementById('btn-fly-node')?.addEventListener('click', () => {
      if (this.selectedNode) this.flyToNode(this.selectedNode);
    });

    const bindSearch = (inputEl) => {
      if (!inputEl) return;
      inputEl.addEventListener('input', e => {
        this.searchQuery = e.target.value.trim();
      });
      inputEl.addEventListener('keydown', e => {
        if (e.key === 'Enter' && this.searchQuery) {
          const match = this.nodes.find(n => this.isNodeVisible(n));
          if (match) {
            this.selectNode(match, true);
            this.flyToNode(match);
          }
        }
      });
    };
    bindSearch(document.getElementById('brain-search'));
    bindSearch(document.getElementById('top-galaxy-search'));

    document.querySelectorAll('.legend-filter-item[data-cat]').forEach(item => {
      item.addEventListener('click', () => {
        const cat = item.dataset.cat;
        if (this.activeKindFilter === cat) {
          this.activeKindFilter = 'all';
          document.querySelectorAll('.legend-filter-item').forEach(x => x.classList.remove('active'));
        } else {
          this.activeKindFilter = cat;
          document.querySelectorAll('.legend-filter-item').forEach(x => x.classList.toggle('active', x.dataset.cat === cat));
        }
      });
    });

    document.getElementById('slider-repel')?.addEventListener('input', e => {
      this.repelStrength = Number(e.target.value);
      this.computeLayoutTargets();
    });
    document.getElementById('slider-link-len')?.addEventListener('input', e => {
      this.linkDistance = Number(e.target.value);
      this.computeLayoutTargets();
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.BrainGraphEngine.init();
});
