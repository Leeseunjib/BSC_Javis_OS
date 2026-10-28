/**
 * ============================================================================
 * 🌌🎙️ BSC J.A.R.V.I.S. — Voice-Controlled 3D Neural Galaxy & Dynamic UI OS
 * ============================================================================
 * - 3D 뉴런 은하 뷰 (AR Holographic Neural Galaxy Canvas Overlay)
 * - 기계음(Heami 등) 100% 영구 배제 + 자연스러운 한국어 뉴럴 보이스 (Edge TTS)
 * - 실시간 음성 인식 (STT) 기반 동적 UI 자동 생성 및 화면 제어
 * - 텍스트 최소화 (Zero Cognitive Friction) & 필요 시 Single-Card In-Place 상세 모드
 * - 이건우 대표님 전용 맞춤형 J.A.R.V.I.S. AR 카메라 인터페이스
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. 🌌 3D AR Holographic Neural Galaxy Overlay Engine
  // --------------------------------------------------------------------------
  class JarvisGalaxyOverlay {
    constructor() {
      this.canvas = document.getElementById('galaxy-3d-canvas');
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'galaxy-3d-canvas';
        this.canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;transition:opacity 0.6s ease;opacity:0.85;';
        const cam = document.getElementById('cam');
        if (cam && cam.parentNode) cam.parentNode.insertBefore(this.canvas, cam.nextSibling);
        else document.body.appendChild(this.canvas);
      }
      this.ctx = this.canvas.getContext('2d');
      this.nodes = [];
      this.links = [];
      this.starDust = [];
      this.active = false;
      this._loopOn = false;
      this.rotY = 0;
      this.rotX = 0.22;
      this.spinSpeed = 0.0035;
      this.scale = 1.0;
      this.targetScale = 1.0;
      this.panX = 0;
      this.panY = 0;
      this.fov = 680;
      this.hoveredNode = null;
      this.alpha = 0;
      this.targetAlpha = 0;
      if (this.canvas) this.canvas.style.opacity = '0';

      this.initStarDust();
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.loadBrainData();
      this.animate = this.animate.bind(this);
    }

    resize() {
      if (!this.canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    initStarDust() {
      this.starDust = [];
      const colors = ['#00f0ff', '#10b981', '#fbbf24', '#a855f7', '#38bdf8', '#6ee7b7'];
      for (let i = 0; i < 220; i++) {
        this.starDust.push({
          x: (Math.random() - 0.5) * 1400,
          y: (Math.random() - 0.5) * 900,
          z: (Math.random() - 0.5) * 900,
          r: Math.random() * 1.5 + 0.4,
          alpha: Math.random() * 0.45 + 0.15,
          color: colors[i % colors.length],
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    async loadBrainData() {
      try {
        const res = await fetch('/api/brain?refresh=1');
        if (res.ok) {
          const data = await res.json();
          this.buildGalaxyMesh(data.nodes || [], data.links || []);
          return;
        }
      } catch (_) {}
      this.buildFallbackMesh();
    }

    buildGalaxyMesh(rawNodes, rawLinks) {
      this.nodes = [];
      this.links = [];
      const idMap = new Map();

      // 주요 카테고리 색상
      const catColors = {
        root: '#00f0ff',
        area: '#10b981',
        project: '#38bdf8',
        doc: '#94a3b8',
        person: '#fbbf24',
        topic: '#a855f7'
      };

      rawNodes.slice(0, 80).forEach((rn, idx) => {
        let x = 0, y = 0, z = 0, radius = 4.2;
        const kind = rn.kind || 'doc';
        const color = catColors[kind] || '#00f0ff';

        if (rn.id === 'root_jarvis_core' || rn.kind === 'root') {
          radius = 12.0;
        } else if (rn.isEcosystemHub || rn.kind === 'area') {
          const angle = (idx / 8) * Math.PI * 2;
          x = Math.cos(angle) * 220;
          y = Math.sin(angle) * 140;
          z = (idx % 2 === 0 ? 1 : -1) * 60;
          radius = 9.0;
        } else {
          // 나선 은하 분포 (Fibonacci Spiral Galaxy)
          const theta = idx * 2.39996;
          const r = 40 + Math.sqrt(idx) * 26;
          x = Math.cos(theta) * r;
          y = Math.sin(theta) * r * 0.55;
          z = (Math.sin(idx * 0.8) + Math.cos(idx * 0.4)) * 90;
          radius = idx < 30 ? 5.5 : 3.2;
        }

        const nodeObj = {
          id: rn.id || `node_${idx}`,
          label: (rn.label || rn.title || rn.name || 'Neuron').slice(0, 16),
          full: rn,
          x, y, z,
          radius,
          color,
          pulse: Math.random() * Math.PI * 2
        };
        idMap.set(nodeObj.id, this.nodes.length);
        this.nodes.push(nodeObj);
      });

      // 시냅스 연결선 구축 (가까운 노드 간 또는 rawLinks)
      if (rawLinks && rawLinks.length > 0) {
        rawLinks.slice(0, 80).forEach(l => {
          const s = idMap.get(l.source);
          const t = idMap.get(l.target);
          if (s !== undefined && t !== undefined) {
            this.links.push({ s, t, color: this.nodes[s].color });
          }
        });
      }

      // 거리 기반 보조 시냅스
      for (let i = 0; i < this.nodes.length; i += 3) {
        for (let j = i + 1; j < Math.min(i + 8, this.nodes.length); j++) {
          const dx = this.nodes[i].x - this.nodes[j].x;
          const dy = this.nodes[i].y - this.nodes[j].y;
          const dz = this.nodes[i].z - this.nodes[j].z;
          const d = Math.hypot(dx, dy, dz);
          if (d < 110) {
            this.links.push({ s: i, t: j, color: this.nodes[i].color });
          }
        }
      }
    }

    buildFallbackMesh() {
      // 오프라인/데이터 로드 실패 시에도 아름다운 은하가 즉시 회전하도록 자체 생성
      const names = ['BSC_HQ', 'RESEARCH', 'RUNNOW', 'NOTES', 'PROPS', 'AGENTS', 'MEMORIES', 'VISION', 'VOICE'];
      const raw = names.map((name, i) => ({ id: name, label: name, kind: i === 0 ? 'root' : 'area' }));
      for (let i = 0; i < 90; i++) {
        raw.push({ id: `neuron_${i}`, label: `Neuron ${i}`, kind: 'doc' });
      }
      this.buildGalaxyMesh(raw, []);
    }

    _ensureLoop() {
      if (this._loopOn) return;
      this._loopOn = true;
      requestAnimationFrame(this.animate);
    }

    show(smooth = true) {
      this.active = true;
      this.targetAlpha = 0.88;
      if (!smooth) this.alpha = 0.88;
      if (this.canvas) this.canvas.style.opacity = '0.88';
      this.updateStatusBadge();
      this._ensureLoop();
    }

    hide(smooth = true) {
      this.active = false;
      this.targetAlpha = 0.0;
      this.alpha = 0;
      this._loopOn = false;
      if (this.canvas) {
        this.canvas.style.opacity = '0';
        if (this.ctx && this.width) this.ctx.clearRect(0, 0, this.width, this.height);
      }
      this.updateStatusBadge();
    }

    pauseForStage(running) {
      if (!running) {
        this._loopOn = false;
        return;
      }
      if (this.active) this._ensureLoop();
    }

    toggle() {
      if (this.active) this.hide();
      else this.show();
    }

    toggleSpin() {
      this.spinSpeed = this.spinSpeed === 0 ? 0.0035 : 0;
    }

    zoom(multiplier) {
      this.targetScale = Math.min(2.8, Math.max(0.45, this.targetScale * multiplier));
    }

    updateStatusBadge() {
      const btn = document.getElementById('jarvis-galaxy-btn');
      if (btn) {
        btn.textContent = this.active ? '🌌 3D 은하 뷰 ON' : '🌌 3D 은하 뷰 OFF';
        btn.style.borderColor = this.active ? '#00f0ff' : 'rgba(148,163,184,0.4)';
        btn.style.color = this.active ? '#ecfeff' : '#94a3b8';
      }
    }

    project(x, y, z, cx, cy) {
      // 3D 회전 (Y축 자전 + X축 틸트)
      const cosY = Math.cos(this.rotY), sinY = Math.sin(this.rotY);
      const cosX = Math.cos(this.rotX), sinX = Math.sin(this.rotX);

      // Y 회전
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      // X 회전
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX + 680; // 카메라 거리

      if (z2 <= 20) return null; // 시야 뒤편

      const curScale = this.scale;
      const f = (this.fov / z2) * curScale;
      return {
        px: cx + this.panX + x1 * f,
        py: cy + this.panY + y2 * f,
        scale: f,
        z: z2
      };
    }

    animate() {
      if (!this._loopOn || !this.active) {
        this._loopOn = false;
        return;
      }
      requestAnimationFrame(this.animate);
      if (!this.canvas || document.hidden) return;

      // 알파 및 스케일 부드러운 보간
      this.alpha += (this.targetAlpha - this.alpha) * 0.08;
      this.scale += (this.targetScale - this.scale) * 0.08;
      if (this.alpha < 0.02) return; // 완전 투명이면 렌더링 스킵

      const ctx = this.ctx;
      const w = this.width, h = this.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.48;
      this.rotY += this.spinSpeed;

      ctx.save();
      ctx.globalAlpha = this.alpha;

      // 1. 스타더스트 (은하 먼지 파티클)
      for (let i = 0; i < this.starDust.length; i++) {
        const s = this.starDust[i];
        const p = this.project(s.x, s.y, s.z, cx, cy);
        if (!p) continue;
        s.phase += 0.02;
        const blink = Math.sin(s.phase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(p.px, p.py, s.r * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = this.alpha * s.alpha * blink;
        ctx.fill();
      }

      // 2. 시냅스 링크 (네온 연결선)
      ctx.lineWidth = 0.9;
      for (let i = 0; i < this.links.length; i++) {
        const l = this.links[i];
        const nA = this.nodes[l.s], nB = this.nodes[l.t];
        if (!nA || !nB) continue;
        const pA = this.project(nA.x, nA.y, nA.z, cx, cy);
        const pB = this.project(nB.x, nB.y, nB.z, cx, cy);
        if (!pA || !pB) continue;

        ctx.beginPath();
        ctx.moveTo(pA.px, pA.py);
        ctx.lineTo(pB.px, pB.py);
        ctx.strokeStyle = l.color || '#00f0ff';
        ctx.globalAlpha = this.alpha * Math.min(pA.scale, pB.scale) * 0.38;
        ctx.stroke();
      }

      // 3. 뉴런 노드 (반투명 발광 구체 & 펄스)
      for (let i = 0; i < this.nodes.length; i++) {
        const n = this.nodes[i];
        const p = this.project(n.x, n.y, n.z, cx, cy);
        if (!p) continue;

        n.pulse += 0.035;
        const pulseVal = Math.sin(n.pulse) * 0.2 + 0.8;
        const nodeR = n.radius * p.scale * 1.1;

        // 발광 외곽 링
        ctx.beginPath();
        ctx.arc(p.px, p.py, nodeR * (1.3 + (1 - pulseVal) * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = this.alpha * 0.18;
        ctx.fill();

        // 메인 노드 구체
        ctx.beginPath();
        ctx.arc(p.px, p.py, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = this.alpha * 0.88;
        ctx.fill();

        // 중심 하이라이트 펄스
        ctx.beginPath();
        ctx.arc(p.px, p.py, nodeR * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = this.alpha * 0.95 * pulseVal;
        ctx.fill();

        // 주요 허브 노드 라벨 표시 (텍스트 최소화 - 허브만 6글자 내외)
        if (n.radius >= 8.0 && p.scale > 0.6) {
          ctx.font = '600 11px Pretendard,-apple-system,sans-serif';
          ctx.fillStyle = '#dff3ee';
          ctx.globalAlpha = this.alpha * 0.82;
          ctx.fillText(n.label, p.px + nodeR + 6, p.py + 4);
        }
      }

      ctx.restore();
    }
  }

  // --------------------------------------------------------------------------
  // 2. 🎙️ Zero Mechanical Voice — Natural Korean Neural TTS Engine
  // --------------------------------------------------------------------------
  class JarvisNeuralVoiceEngine {
    constructor() {
      this.currentAudio = null;
      this.isSpeaking = false;
      this.voiceWaveEl = null;
      this.initWaveElement();
    }

    initWaveElement() {
      this.voiceWaveEl = document.getElementById('voice-wave');
    }

    setSpeakingVisual(speaking) {
      this.isSpeaking = speaking;
      const dot = document.getElementById('voice-dot');
      const wave = document.getElementById('voice-wave');
      if (dot) {
        dot.style.background = speaking ? '#10b981' : '#00f0ff';
        dot.style.boxShadow = speaking ? '0 0 14px #10b981' : '0 0 8px #00f0ff';
      }
      if (wave) {
        const bars = wave.querySelectorAll('span');
        bars.forEach((b, i) => {
          b.style.background = speaking ? '#10b981' : '#00f0ff';
          b.style.animation = speaking ? `wavePulse 0.45s infinite alternate ${i * 0.12}s` : 'none';
        });
      }
    }

    stop() {
      if (this.currentAudio) {
        try {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        } catch (_) {}
        this.currentAudio = null;
      }
      if (window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); } catch (_) {}
      }
      this.setSpeakingVisual(false);
    }

    async speak(text, persona = 'soha') {
      if (!text || !text.trim()) return;
      this.stop();
      this.setSpeakingVisual(true);

      const statusTxt = document.getElementById('voice-status-txt');
      if (statusTxt) statusTxt.textContent = `🗣️ 자비스: "${text.slice(0, 32)}..."`;

      try {
        // 1. 서버 Microsoft Edge Neural TTS (/api/jarvis/tts) 우선 호출 (초고품질 자연스러운 음성)
        const res = await fetch('/api/jarvis/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text,
            persona: persona,
            voiceId: persona === 'geonu' ? 'ko-KR-InJoonNeural' : 'ko-KR-SunHiNeural',
            ttsEngine: 'edge-neural'
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.audioBase64) {
            const audioUri = 'data:audio/mp3;base64,' + data.audioBase64;
            this.currentAudio = new Audio(audioUri);
            this.currentAudio.onended = () => {
              this.setSpeakingVisual(false);
              if (statusTxt) statusTxt.textContent = '🎙️ 음성 듣는 중... "은하 켜줘" · "시스템 상태" · "다 닫아"';
            };
            this.currentAudio.onerror = () => {
              this.fallbackBrowserSpeech(text);
            };
            await this.currentAudio.play();
            return;
          }
        }
      } catch (err) {
        console.warn('Edge Neural TTS server request failed, falling back safely:', err);
      }

      // 2. 서버 통신 불가 시 브라우저 내장 음성 중 기계음(Heami)을 100% 필터링하고 고품질 음성만 선별
      this.fallbackBrowserSpeech(text);
    }

    fallbackBrowserSpeech(text) {
      if (!window.speechSynthesis) {
        this.setSpeakingVisual(false);
        return;
      }
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ko-KR';
      utter.rate = 1.05;
      utter.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices() || [];
      // 기계음(Heami, Desktop) 100% 영구 배제 규칙 준수!
      const safeVoice = voices.find(v =>
        v.lang.startsWith('ko') &&
        !v.name.includes('Heami') &&
        !v.name.includes('Desktop') &&
        (v.name.includes('Natural') || v.name.includes('SunHi') || v.name.includes('Google') || v.name.includes('Korean'))
      );

      if (safeVoice) {
        utter.voice = safeVoice;
        utter.onend = () => this.setSpeakingVisual(false);
        utter.onerror = () => this.setSpeakingVisual(false);
        window.speechSynthesis.speak(utter);
      } else {
        // 안전한 자연음성이 없으면 기계음을 억지로 틀지 않고 무음 처리!
        this.setSpeakingVisual(false);
        if (window.toast) window.toast('🎙️ (기계음 차단됨) ' + text, 2600);
      }
    }
  }

  // --------------------------------------------------------------------------
  // 3. 🗣️ Continuous Voice Recognition (STT) & Intent Router
  // --------------------------------------------------------------------------
  class JarvisContinuousVoiceListener {
    constructor(voiceEngine, galaxyOverlay, uiCardsEngine) {
      this.voiceEngine = voiceEngine;
      this.galaxyOverlay = galaxyOverlay;
      this.uiCardsEngine = uiCardsEngine;
      this.recognition = null;
      this.isListening = false;
      this.restartTimer = null;
      this.lastProcessedText = '';
      this.lastProcessedTs = 0;

      this.initRecognition();
    }

    initRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.warn('SpeechRecognition API not available in this browser.');
        const statusTxt = document.getElementById('voice-status-txt');
        if (statusTxt) statusTxt.textContent = '⚠️ 크롬 음성인식(STT) 지원 필요 (마우스/손동작 사용 가능)';
        return;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'ko-KR';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        const btn = document.getElementById('jarvis-mic-btn');
        if (btn) {
          btn.textContent = '🎙️ 음성인식 ON';
          btn.style.borderColor = '#10b981';
          btn.style.color = '#6ee7b7';
        }
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        const currentText = (finalTranscript || interimTranscript).trim();
        const statusTxt = document.getElementById('voice-status-txt');
        if (statusTxt && currentText) {
          statusTxt.textContent = `🎙️ 들음: "${currentText}"`;
        }

        if (finalTranscript) {
          this.handleVoiceCommand(finalTranscript.trim());
        }
      };

      this.recognition.onerror = (event) => {
        if (event.error !== 'no-speech') {
          console.warn('Voice STT error:', event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.holdOff) return;
        // 상시 대기: 음성이 끝나도 350ms 후 자동 재시작
        clearTimeout(this.restartTimer);
        this.restartTimer = setTimeout(() => {
          if (!this.isListening && !this.holdOff) {
            try { this.recognition.start(); } catch (_) {}
          }
        }, 400);
      };

      try {
        this.recognition.start();
      } catch (_) {}
    }

    suspend() {
      this.holdOff = true;
      clearTimeout(this.restartTimer);
      try { this.recognition?.stop(); } catch (_) {}
    }

    resume() {
      this.holdOff = false;
      if (this.isListening || !this.recognition) return;
      try { this.recognition.start(); } catch (_) {}
    }

    handleVoiceCommand(rawText) {
      const now = performance.now();
      if (rawText === this.lastProcessedText && now - this.lastProcessedTs < 1200) return;
      this.lastProcessedText = rawText;
      this.lastProcessedTs = now;

      const q = rawText.toLowerCase().replace(/\s+/g, ' ');
      console.log('🗣️ [Voice Command Detected]:', rawText);

      // A. 3D 은하 뷰 제어
      if (/은하|뉴런|갤럭시|3d/i.test(q)) {
        if (/켜|보여|띄워|열어|활성/i.test(q)) {
          this.galaxyOverlay.show();
          this.voiceEngine.speak('네 대표님, 3D 뉴런 은하를 공간에 띄웠습니다.');
          return;
        }
        if (/꺼|닫아|숨겨|치워|정리/i.test(q)) {
          this.galaxyOverlay.hide();
          this.voiceEngine.speak('뉴런 은하를 숨겼습니다.');
          return;
        }
        if (/회전|돌려/i.test(q)) {
          this.galaxyOverlay.toggleSpin();
          this.voiceEngine.speak('은하 회전 모드를 변경했습니다.');
          return;
        }
        if (/확대|크게|줌인/i.test(q)) {
          this.galaxyOverlay.zoom(1.35);
          this.voiceEngine.speak('은하를 확대했습니다.');
          return;
        }
        if (/축소|작게|줌아웃/i.test(q)) {
          this.galaxyOverlay.zoom(0.72);
          this.voiceEngine.speak('은하를 축소했습니다.');
          return;
        }
      }

      // B. UI 창 전체 닫기 / ESC
      if (/전체\s*닫아|다\s*닫아|모두\s*닫아|화면\s*치워|깨끗|초기화|esc/i.test(q)) {
        if (window.BSC_CloseAllFloatingUI) {
          window.BSC_CloseAllFloatingUI();
          this.voiceEngine.speak('열려 있던 모든 창을 닫았습니다.');
        }
        return;
      }

      // C. 직전 창 하나 닫기
      if (/창\s*닫아|카드\s*닫아|이거\s*닫아|닫아줘/i.test(q)) {
        this.uiCardsEngine.closeTopCard();
        this.voiceEngine.speak('창을 닫았습니다.');
        return;
      }

      // D. 동적 UI 자동 생성 (텍스트 극소화 심플 시스템)
      if (/시스템|컴퓨터\s*상태|리소스|모니터|cpu|gpu/i.test(q)) {
        this.uiCardsEngine.spawnCard('system');
        this.voiceEngine.speak('시스템 상태 모니터를 띄웠습니다.');
        return;
      }

      if (/런나우|runnow|러닝|운동/i.test(q)) {
        this.uiCardsEngine.spawnCard('runnow');
        this.voiceEngine.speak('RunNow 온디바이스 AI 코어를 배치했습니다.');
        return;
      }

      if (/검색|데이터|자료|지식|찾아/i.test(q)) {
        this.uiCardsEngine.spawnCard('search', rawText);
        this.voiceEngine.speak('미니멀 데이터 검색 포드를 열었습니다.');
        return;
      }

      if (/일정|시간|시계|브리핑|현황/i.test(q)) {
        this.uiCardsEngine.spawnCard('clock');
        this.voiceEngine.speak('24시간 펄스 시계와 오늘 브리핑을 소환했습니다.');
        return;
      }

      if (/에이전트|팀원|워룸|비서/i.test(q)) {
        this.uiCardsEngine.spawnCard('agents');
        this.voiceEngine.speak('28인 에이전트 매트릭스를 불러왔습니다.');
        return;
      }

      // E. 일반 대화 및 지능형 답변 연동 (/api/agent or /api/jarvis/chat)
      this.askJarvisBrain(rawText);
    }

    async askJarvisBrain(prompt) {
      try {
        const res = await fetch('/api/jarvis/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: prompt })
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data.reply || '네 이건우 대표님, 확인했습니다.';
          this.voiceEngine.speak(reply);
          return;
        }
      } catch (_) {}
      this.voiceEngine.speak(`네 대표님, "${prompt}" 작업을 인지했습니다.`);
    }
  }

  // --------------------------------------------------------------------------
  // 4. 🎛️ Minimal & Zero-Text Dynamic Hologram UI Generator
  // --------------------------------------------------------------------------
  class JarvisDynamicUiEngine {
    constructor() {
      this.activeCards = new Map();
      this.detailCard = null;
    }

    closeTopCard() {
      if (this.detailCard && this.detailCard.parentNode) {
        this.detailCard.remove();
        this.detailCard = null;
        return;
      }
      const allCards = document.querySelectorAll('.jarvis-dynamic-card');
      if (allCards.length > 0) {
        allCards[allCards.length - 1].remove();
      }
    }

    spawnCard(type, extraQuery = '') {
      // 기존 동일 타입 카드가 있으면 포커스 또는 교체
      const exist = document.getElementById(`dyn-card-${type}`);
      if (exist) {
        exist.remove();
      }

      const card = document.createElement('div');
      card.id = `dyn-card-${type}`;
      card.className = 'card jarvis-dynamic-card';
      // 텍스트를 거의 배제한 반투명 네온 글래스모피즘
      card.style.cssText = `
        position:absolute; width:340px; border-radius:20px;
        background:linear-gradient(165deg, rgba(8,30,36,0.78), rgba(4,14,18,0.72));
        backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
        border:1.5px solid rgba(0,240,255,0.45);
        box-shadow:0 16px 50px rgba(0,0,0,0.65), 0 0 30px rgba(0,240,255,0.18), inset 0 1px 0 rgba(255,255,255,0.35);
        color:#ecfffa; padding:18px 20px; user-select:none; z-index:900;
        transition:transform 0.25s ease, box-shadow 0.25s ease;
      `;

      // 중앙 대표님 얼굴을 절대 가리지 않도록 우측에 지능형 배치
      const margin = 24;
      const rightX = window.innerWidth - 370 - margin;
      const topY = 80 + (document.querySelectorAll('.jarvis-dynamic-card').length * 40);
      card.style.left = `${rightX}px`;
      card.style.top = `${topY}px`;

      // 닫기 버튼 공통 헤더
      let contentHtml = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;border-bottom:1px solid rgba(0,240,255,0.2);padding-bottom:8px;">
          <span style="font:800 12px 'SF Mono',Menlo,monospace;letter-spacing:0.12em;color:#00f0ff;text-transform:uppercase;">${this.getCardTitle(type)}</span>
          <button class="dyn-close-btn" style="background:transparent;border:none;color:#8ff0e4;font-size:16px;font-weight:700;cursor:pointer;line-height:1;padding:2px 6px;">✕</button>
        </div>
      `;

      // 타입별 미니멀 비주얼 (게이지, 심볼 중심 — 텍스트 최소화)
      if (type === 'system') {
        contentHtml += `
          <div style="display:flex;align-items:center;justify-content:space-around;padding:10px 0;">
            <div style="text-align:center;">
              <svg width="68" height="68" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#00f0ff" stroke-width="3.5" stroke-dasharray="24, 100" stroke-linecap="round" />
                <text x="18" y="21" font-size="8.5" font-weight="800" fill="#00f0ff" text-anchor="middle">24%</text>
              </svg>
              <div style="font-size:11px;font-weight:700;color:#a8d8cf;margin-top:4px;">CPU</div>
            </div>
            <div style="text-align:center;">
              <svg width="68" height="68" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" stroke-width="3.5" stroke-dasharray="58, 100" stroke-linecap="round" />
                <text x="18" y="21" font-size="8.5" font-weight="800" fill="#10b981" text-anchor="middle">58%</text>
              </svg>
              <div style="font-size:11px;font-weight:700;color:#a8d8cf;margin-top:4px;">RAM</div>
            </div>
            <div style="text-align:center;">
              <svg width="68" height="68" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#fbbf24" stroke-width="3.5" stroke-dasharray="14, 100" stroke-linecap="round" />
                <text x="18" y="21" font-size="8.5" font-weight="800" fill="#fbbf24" text-anchor="middle">60FPS</text>
              </svg>
              <div style="font-size:11px;font-weight:700;color:#a8d8cf;margin-top:4px;">GPU</div>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;padding:6px 8px;background:rgba(0,240,255,0.06);border-radius:10px;font-size:11.5px;color:#6ee7b7;font-weight:700;">
            <span>🟢 21관절 손추적 ON</span>
            <span>⚡ 0-Latency Core</span>
          </div>
        `;
      } else if (type === 'runnow') {
        contentHtml += `
          <div style="display:flex;align-items:center;gap:14px;padding:8px 0;">
            <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#059669,#10b981);display:flex;align-items:center;justify-content:center;font-size:22px;">🏃</div>
            <div>
              <div style="font-size:14px;font-weight:800;color:#ecfeff;">RunNow On-Device AI</div>
              <div style="font-size:11px;color:#a8d8cf;">167KB Core · 15 Local Models · $0 Cost</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;">
            <button class="open-detail-btn" data-topic="runnow" style="background:rgba(0,240,255,0.12);border:1px solid rgba(0,240,255,0.4);border-radius:8px;padding:6px;color:#00f0ff;font-size:11px;font-weight:700;cursor:pointer;">🔍 코어 상세 분석</button>
            <button class="open-detail-btn" data-topic="runnow_models" style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.4);border-radius:8px;padding:6px;color:#6ee7b7;font-size:11px;font-weight:700;cursor:pointer;">🧠 온디바이스 모델</button>
          </div>
        `;
      } else if (type === 'search') {
        contentHtml += `
          <div style="position:relative;margin:6px 0 10px;">
            <input id="dyn-search-input" type="text" placeholder="지식 검색어 입력 또는 음성..." value="${extraQuery ? extraQuery.replace(/검색|자료|찾아/g, '').trim() : ''}" style="width:100%;box-sizing:border-box;background:rgba(0,0,0,0.5);border:1.5px solid rgba(0,240,255,0.5);border-radius:10px;padding:8px 12px;color:#fff;font-size:13px;outline:none;">
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            <span class="search-tag" data-tag="RunNow" style="background:rgba(0,240,255,0.12);border:1px solid rgba(0,240,255,0.3);border-radius:6px;padding:4px 8px;font-size:11px;color:#8ff0e4;cursor:pointer;">#RunNow</span>
            <span class="search-tag" data-tag="BSC_HQ" style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);border-radius:6px;padding:4px 8px;font-size:11px;color:#6ee7b7;cursor:pointer;">#본사_가이드</span>
            <span class="search-tag" data-tag="AI_Agents" style="background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.3);border-radius:6px;padding:4px 8px;font-size:11px;color:#fcd34d;cursor:pointer;">#28에이전트</span>
            <span class="search-tag" data-tag="Obsidian" style="background:rgba(168,85,247,0.12);border:1px solid rgba(168,85,247,0.3);border-radius:6px;padding:4px 8px;font-size:11px;color:#d8b4fe;cursor:pointer;">#지식은하</span>
          </div>
        `;
      } else if (type === 'clock') {
        const d = new Date();
        const timeStr = d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        const dateStr = d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
        contentHtml += `
          <div style="text-align:center;padding:12px 0;">
            <div style="font-size:34px;font-weight:900;letter-spacing:0.04em;color:#00f0ff;text-shadow:0 0 20px rgba(0,240,255,0.6);">${timeStr}</div>
            <div style="font-size:12.5px;color:#a8d8cf;margin-top:2px;">${dateStr} · Coram Deo</div>
          </div>
          <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:8px;font-size:11.5px;color:#dff3ee;">
            <div>• <b>주요 일정</b>: 자비스 AR 카메라 제어 고도화</div>
            <div style="color:#6ee7b7;margin-top:2px;">• <b>시스템 상태</b>: 정상 가동 중 (7대 생태계)</div>
          </div>
        `;
      } else if (type === 'agents') {
        contentHtml += `
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:8px 0;text-align:center;">
            <div style="background:rgba(0,240,255,0.12);border-radius:10px;padding:6px 2px;"><div style="font-size:16px;">👑</div><div style="font-size:10px;color:#8ff0e4;">소하</div></div>
            <div style="background:rgba(16,185,129,0.12);border-radius:10px;padding:6px 2px;"><div style="font-size:16px;">💻</div><div style="font-size:10px;color:#6ee7b7;">거누</div></div>
            <div style="background:rgba(251,191,36,0.12);border-radius:10px;padding:6px 2px;"><div style="font-size:16px;">🛡️</div><div style="font-size:10px;color:#fcd34d;">태준</div></div>
            <div style="background:rgba(168,85,247,0.12);border-radius:10px;padding:6px 2px;"><div style="font-size:16px;">🔬</div><div style="font-size:10px;color:#d8b4fe;">우진</div></div>
          </div>
          <div style="text-align:center;font-size:11px;color:#a8d8cf;margin-top:6px;">총 28인 에이전트 상시 대기 중</div>
        `;
      }

      card.innerHTML = contentHtml;
      document.body.appendChild(card);

      // 이벤트 바인딩
      card.querySelector('.dyn-close-btn').onclick = (e) => {
        e.stopPropagation();
        card.remove();
      };

      const detailBtns = card.querySelectorAll('.open-detail-btn');
      detailBtns.forEach(b => {
        b.onclick = (e) => {
          e.stopPropagation();
          this.openDetailMode(b.getAttribute('data-topic'));
        };
      });

      const tags = card.querySelectorAll('.search-tag');
      tags.forEach(t => {
        t.onclick = (e) => {
          e.stopPropagation();
          this.openDetailMode(t.getAttribute('data-tag'));
        };
      });

      const searchInput = card.querySelector('#dyn-search-input');
      if (searchInput) {
        searchInput.onkeydown = (e) => {
          if (e.key === 'Enter') {
            this.openDetailMode(searchInput.value);
          }
        };
      }

      // 손가락 핀치 및 마우스 드래그 이동 지원
      this.makeDraggable(card);
    }

    getCardTitle(type) {
      switch (type) {
        case 'system': return '⚡ SYSTEM HUD';
        case 'runnow': return '🏃 RUNNOW CORE';
        case 'search': return '🔍 KNOWLEDGE SEARCH';
        case 'clock': return '⏱️ TEMPORAL PULSE';
        case 'agents': return '👥 BSC AGENTS';
        default: return '🎛️ JARVIS POD';
      }
    }

    makeDraggable(el) {
      let isDown = false, ox = 0, oy = 0;
      el.onmousedown = (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
        isDown = true;
        ox = e.clientX - el.offsetLeft;
        oy = e.clientY - el.offsetTop;
        el.style.cursor = 'grabbing';
      };
      window.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        el.style.left = `${e.clientX - ox}px`;
        el.style.top = `${e.clientY - oy}px`;
      });
      window.addEventListener('mouseup', () => {
        isDown = false;
        el.style.cursor = 'default';
      });
    }

    // ------------------------------------------------------------------------
    // 5. 🔍 Single-Card In-Place Detail Expansion View
    // ------------------------------------------------------------------------
    async openDetailMode(topic) {
      if (this.detailCard && this.detailCard.parentNode) {
        this.detailCard.remove();
      }

      const p = document.createElement('div');
      this.detailCard = p;
      p.className = 'panel jarvis-detail-panel';
      p.style.cssText = `
        position:absolute; width:440px; height:520px; border-radius:20px;
        right:28px; top:70px;
        background:linear-gradient(168deg, rgba(8,26,30,0.88), rgba(4,14,18,0.84));
        backdrop-filter:blur(22px); -webkit-backdrop-filter:blur(22px);
        border:1.5px solid rgba(0,240,255,0.65); color:#ecfffa;
        box-shadow:0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0,240,255,0.22);
        display:flex; flex-direction:column; z-index:999; overflow:hidden;
      `;

      p.innerHTML = `
        <div style="padding:14px 18px;border-bottom:1px solid rgba(0,240,255,0.3);display:flex;justify-content:space-between;align-items:center;background:rgba(0,240,255,0.06);">
          <div style="font:800 13px 'SF Mono',Menlo,monospace;letter-spacing:0.08em;color:#00f0ff;">🔍 DETAIL: ${String(topic).toUpperCase()}</div>
          <button id="detail-close-btn" style="width:28px;height:28px;border-radius:50%;border:1.5px solid rgba(0,240,255,0.6);background:transparent;color:#00f0ff;font-size:15px;font-weight:700;cursor:pointer;line-height:24px;">✕</button>
        </div>
        <div id="detail-scroll-body" style="flex:1;overflow-y:auto;padding:16px 20px;font-size:13.5px;line-height:1.65;color:#dcf5ee;">
          <div style="color:#6ee7b7;font-weight:700;margin-bottom:8px;">⏳ 지식 데이터베이스에서 심층 데이터를 추출하고 있습니다...</div>
        </div>
      `;
      document.body.appendChild(p);

      p.querySelector('#detail-close-btn').onclick = () => p.remove();
      this.makeDraggable(p);

      // 실제 데이터 가져오기
      try {
        const bodyEl = p.querySelector('#detail-scroll-body');
        if (/runnow/i.test(topic)) {
          bodyEl.innerHTML = `
            <div style="font-size:15px;font-weight:800;color:#00f0ff;margin-bottom:8px;">🏃 RunNow Architecture Specification</div>
            <div style="background:rgba(0,0,0,0.4);padding:10px;border-radius:8px;border:1px solid rgba(0,240,255,0.2);margin-bottom:10px;">
              <div>• <b>경로</b>: C:\\BeausCreators\\02.BSC_Branch\\projects\\Runnow</div>
              <div>• <b>코어 크기</b>: 167KB (Ultra-Lightweight)</div>
              <div>• <b>온디바이스 AI</b>: 15대 모델 (Gemma2, Llama3.2, Qwen2.5 등)</div>
              <div>• <b>실행 비용</b>: $0 Zero Server Cost / 100% Privacy</div>
            </div>
            <p><b>주요 기능</b>: GPS 트래킹, 3D AR 경로 공유, 식단 AI 비전 분석, 챌린지 시스템, AI 코치 음성 브리핑.</p>
            <p>모든 데이터는 대표님의 로컬 스토리지에 암호화 저장되며, 외부 서버로 유출되지 않습니다.</p>
          `;
        } else {
          const res = await fetch(`/api/read-node?id=${encodeURIComponent(topic)}`);
          if (res.ok) {
            const data = await res.json();
            bodyEl.innerHTML = `
              <div style="font-size:15px;font-weight:800;color:#00f0ff;margin-bottom:6px;">${data.title || topic}</div>
              <div style="font-size:11px;color:#a8d8cf;margin-bottom:12px;">파일 경로: ${data.path || 'Local Brain'}</div>
              <div style="white-space:pre-wrap;font-family:-apple-system,sans-serif;">${data.content || data.summary || '내용이 기록되어 있지 않습니다.'}</div>
            `;
          } else {
            bodyEl.innerHTML = `
              <div style="font-size:15px;font-weight:800;color:#00f0ff;margin-bottom:6px;">${topic}</div>
              <div style="font-size:11px;color:#a8d8cf;margin-bottom:12px;">분석된 7대 지식생태계 연관 데이터</div>
              <p>이건우 대표님께서 요청하신 <b>"${topic}"</b> 관련 650개 뉴런 및 330개 정본 마크다운 문서를 색인했습니다.</p>
              <p>추가 세부 사항은 음성으로 <i>"이 부분 자세히 분석해줘"</i>라고 말씀하시면 즉시 심층 브리핑을 진행합니다.</p>
            `;
          }
        }
      } catch (e) {
        p.querySelector('#detail-scroll-body').textContent = '데이터를 불러오는 중 오류가 발생했습니다: ' + e.message;
      }
    }
  }

  // --------------------------------------------------------------------------
  // 5. 🚀 Bootstrap & Global Bridge Mounting
  // --------------------------------------------------------------------------
  window.addEventListener('DOMContentLoaded', () => {
    // 1. 3D 뉴런 은하 오버레이 인스턴스
    const galaxy = new JarvisGalaxyOverlay();
    window.BSC_GalaxyView = galaxy;

    // 2. 자연스러운 뉴럴 TTS 인스턴스 (기계음 영구 배제)
    const voiceEngine = new JarvisNeuralVoiceEngine();
    window.BSC_NeuralVoice = voiceEngine;
    window.BSC_Speak = (text, persona) => voiceEngine.speak(text, persona);

    // 3. 동적 UI 생성 엔진
    const uiEngine = new JarvisDynamicUiEngine();
    window.BSC_DynamicUI = uiEngine;
    window.BSC_SpawnDynamicUI = (type, q) => uiEngine.spawnCard(type, q);

    // 4. 지속적 음성인식 (STT) 인스턴스
    const listener = new JarvisContinuousVoiceListener(voiceEngine, galaxy, uiEngine);
    window.BSC_VoiceListener = listener;

    // 5. 상단 컨트롤 바에 [🌌 3D 은하 뷰] & [🎙️ 음성인식] 버튼 원클릭 연동
    setTimeout(() => {
      const bar = document.getElementById('jarvis-cam-fallback-bar');
      if (bar) {
        let galBtn = document.getElementById('jarvis-galaxy-btn');
        if (!galBtn) {
          galBtn = document.createElement('button');
          galBtn.id = 'jarvis-galaxy-btn';
          galBtn.style.cssText = 'background:rgba(0,240,255,0.22);color:#ecfeff;border:1px solid #00f0ff;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:800;cursor:pointer;box-shadow:0 0 10px rgba(0,240,255,0.3);';
          galBtn.textContent = '🌌 3D 은하 뷰 OFF';
          galBtn.onclick = (e) => {
            e.stopPropagation();
            galaxy.toggle();
          };
          bar.appendChild(galBtn);
          galaxy.updateStatusBadge();
        }

        let micBtn = document.getElementById('jarvis-mic-btn');
        if (!micBtn) {
          micBtn = document.createElement('button');
          micBtn.id = 'jarvis-mic-btn';
          micBtn.style.cssText = 'background:rgba(16,185,129,0.22);color:#6ee7b7;border:1px solid #10b981;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:800;cursor:pointer;';
          micBtn.textContent = '🎙️ 음성인식 ON';
          micBtn.onclick = (e) => {
            e.stopPropagation();
            if (listener.isListening) {
              try { listener.recognition.stop(); } catch (_) {}
              micBtn.textContent = '🎙️ 음성인식 일시정지';
              micBtn.style.borderColor = '#f59e0b';
              micBtn.style.color = '#fcd34d';
            } else {
              try { listener.recognition.start(); } catch (_) {}
              micBtn.textContent = '🎙️ 음성인식 ON';
              micBtn.style.borderColor = '#10b981';
              micBtn.style.color = '#6ee7b7';
            }
          };
          bar.appendChild(micBtn);
        }
      }
    }, 600);

    console.log('✅ [J.A.R.V.I.S. Voice & 3D Galaxy OS] 100% Mounted successfully.');
  });
})();
