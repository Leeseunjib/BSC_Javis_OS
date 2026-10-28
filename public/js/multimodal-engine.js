/**
 * 🎙️✋🖥️ BSC J.A.R.V.I.S. OS — 5-Sense Multimodal Perception & Action Engine
 * Integrates:
 *  1. Voice Recognition (Web Speech API STT + Korean/English TTS + Barge-in)
 *  2. Camera Air-Touch (HOLO Mode: Local MediaPipe Hands WASM or Webcam Motion Pointer)
 *  3. Camera Presence / Motion (EYES Mode)
 *  4. Screen Context Perception (WATCH Mode)
 *  5. Safe-Guarded Computer Use (PC Control with CEO Approval Modal)
 *  6. Real-Time SSE Bus (/api/events) for Autonomous Window Summoning
 */

window.MultimodalEngine = {
  recognition: null,
  isListening: false,
  sensors: {
    EYES: false,
    WATCH: false,
    HOLO: false,
    FOCUS: false
  },
  pendingPcActionKey: null,
  webcamStream: null,
  handDetector: null,
  holoCursor: { x: window.innerWidth / 2, y: window.innerHeight / 2, pinching: false },

  escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  init() {
    this.initSSE();
    this.initVoiceEngine();
    this.initIosAudioUnlocker();
    this.bindUIControls();

    // Load persisted Master Settings from disk
    fetch('/api/jarvis/settings')
      .then(r => r.json())
      .then(res => {
        if (res && res.ok && res.settings && window.AIStudioData) {
          Object.assign(window.AIStudioData.routerConfig, res.settings);
          if (res.settings.designTheme && window.HUDWindowSpawner && window.HUDWindowSpawner.applyDesignTheme) {
            window.HUDWindowSpawner.applyDesignTheme(res.settings.designTheme);
          }
        }
      })
      .catch(() => {});

    // Load network info for Mobile Camera Bridge URL
    fetch('/api/jarvis/network-info')
      .then(r => r.json())
      .then(info => {
        if (info && info.mobileCamUrl) {
          const urlText = document.getElementById('holo-mobile-url-text');
          const linkEl = document.getElementById('link-mobile-cam');
          if (urlText) urlText.textContent = info.mobileCamUrl;
          if (linkEl) linkEl.href = info.mobileCamUrl;
        }
      })
      .catch(() => {});

    // Load Persistent Multi-Turn Agent Chat History & Live ADE/IDE Bridge Status
    this.loadInitialChatHistory();

    // Plug-and-Play Auto-Detection when PC USB Camera is plugged in!
    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', () => {
        this.refreshCameraDeviceList(true);
      });
      this.refreshCameraDeviceList(false);
    }

    // Start Always-On Continuous Korean Voice Recognition immediately on load (`Ear.swift` 1:1)
    setTimeout(() => {
      if (this.arStageOwnsMic()) return;
      if (!this.isListening) {
        this.alwaysListening = true;
        this.startMicWaveformVisualizer();
        try {
          this.recognition?.start();
        } catch (_) {}
      }
    }, 600);

    // Also auto-resume voice recognition on the first click/keydown if the browser blocked cold-start mic
    const autoResumeVoiceOnce = () => {
      if (this.arStageOwnsMic()) return;
      this.startMicWaveformVisualizer();
      if (this.recognition && !this.isListening) {
        this.alwaysListening = true;
        try {
          this.recognition.start();
        } catch (_) {}
      }
    };
    window.addEventListener('pointerdown', autoResumeVoiceOnce, { once: true, passive: true });
    window.addEventListener('keydown', autoResumeVoiceOnce, { once: true, passive: true });
  },

  initSSE() {
    try {
      const evtSource = new EventSource('/api/events');
      evtSource.addEventListener('summon_window', e => {
        const winConfig = JSON.parse(e.data);
        window.HUDWindowSpawner.spawn(winConfig);
      });
      evtSource.addEventListener('console_log', e => {
        const payload = JSON.parse(e.data);
        if (payload.telemetry) {
          window.BSC_WORLDVIEW.updateTelemetryUI(payload.telemetry);
        }
      });
      evtSource.addEventListener('agent_report', e => {
        const rep = JSON.parse(e.data);
        if (rep && rep.speechText) {
          window.BSC_WORLDVIEW.showToast(`🤖 ${rep.agent} 작업 완료 보고`, rep.speechText);
          this.speakStewardReply(rep.speechText, 'jarvis');
        }
      });
      evtSource.addEventListener('remote_hand_gesture', e => {
        const data = JSON.parse(e.data);
        if (!data) return;
        const panel = document.getElementById('holo-gesture-hud-panel');
        if (panel && panel.style.display === 'none') {
          panel.style.display = 'block';
          this.startMiniHandSkeletonVisualizer();
        }
        const badgeEl = document.getElementById('holo-gesture-status-badge');
        if (badgeEl) {
          badgeEl.style.color = '#34d399';
          badgeEl.textContent = '🟢 MOBILE CAMERA/TOUCH BRIDGE ON (스마트폰 실시간 연동 중)';
        }
        if (typeof data.normX === 'number' && typeof data.normY === 'number') {
          this.holoCursor.x = data.normX * window.innerWidth;
          this.holoCursor.y = data.normY * window.innerHeight;
          if (window.BrainGraphEngine) {
            window.BrainGraphEngine.rotY += (data.normX - 0.5) * 0.05;
            const hit = window.BrainGraphEngine.findNodeAt(this.holoCursor.x, this.holoCursor.y);
            if (hit) window.BrainGraphEngine.selectNode(hit, false);
          }
        }
        if (Array.isArray(data.landmarks) && data.landmarks.length === 21) {
          this.latestHandLandmarks = data.landmarks;
        }
        if (data.poseLabel) {
          const labelEl = document.getElementById('holo-detected-gesture-label');
          if (labelEl) labelEl.textContent = `📱 모바일 손 인식: ${data.poseLabel}`;
        }
        if (data.gesture) {
          this.executeHandGestureAction(data.gesture);
        }
        if (data.commandText) {
          this.sendCommandToJarvis(data.commandText);
        }
      });
      evtSource.addEventListener('agent_chat_update', e => {
        const payload = JSON.parse(e.data);
        if (payload && Array.isArray(payload.chatHistory)) {
          this.renderChatDrawerFeed(payload.chatHistory, payload.bridgeStatus);
        }
      });
      evtSource.addEventListener('bsc_council_update', e => {
        const payload = JSON.parse(e.data);
        if (payload && Array.isArray(payload.sessions)) {
          this.renderBscCouncilFeed(payload.sessions, payload.reportPath);
        }
      });
    } catch (e) {}
  },

  async loadInitialChatHistory() {
    try {
      const res = await fetch('/api/jarvis/chat-history');
      const data = await res.json();
      if (data && data.ok) {
        this.renderChatDrawerFeed(data.messages || [], data.bridgeStatus);
      }
    } catch (e) {}
    try {
      const cRes = await fetch('/api/jarvis/bsc-council');
      const cData = await cRes.json();
      if (cData && cData.ok) {
        this.renderBscCouncilFeed(cData.sessions || []);
      }
    } catch (e) {}
  },

  renderChatDrawerFeed(messages = [], bridgeStatus = null) {
    const feed = document.getElementById('agent-chat-feed');
    const badgeWrap = document.getElementById('ade-ide-live-badges');
    if (badgeWrap && bridgeStatus) {
      const nodesCnt = bridgeStatus.ide?.brainNodesCount || 523;
      const harnessOn = Boolean(bridgeStatus.harness2?.enabled);
      const driveOn = Boolean(bridgeStatus.googleDrive?.connected);
      badgeWrap.innerHTML = `
        <span class="bridge-pill ade">${harnessOn ? '🟢 Harness² 연결' : '⚪ Harness² 없음'}</span>
        <span class="bridge-pill ide">🟢 자비스 단독 보이스</span>
        <span class="bridge-pill drive">${driveOn ? '🟢 Drive 연결' : '⚪ Drive 경로 없음'} · IDE ${nodesCnt}노드</span>
      `;
    }
    if (!feed || !Array.isArray(messages) || messages.length === 0) return;

    feed.innerHTML = messages.map((m, idx) => {
      const isUser = m.role === 'user';
      const avatar = !isUser && typeof m.avatar === 'string' && m.avatar.startsWith('/')
        ? this.escapeHtml(m.avatar)
        : '';
      const cleanTxt = this.escapeHtml(String(m.text || '').replace(/\*\*/g, '')).replace(/\n/g, '<br/>');
      return `
        <div class="chat-bubble ${isUser ? 'user' : 'assistant'}">
          <div class="bubble-meta" style="display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:6px;">
              ${avatar ? `<img src="${avatar}" class="bubble-avatar" onerror="this.style.display='none'" />` : ''}
              <span>${isUser ? '👑 이건우 대표님' : '🤖 J.A.R.V.I.S.'}</span>
              <span class="bubble-time">${this.escapeHtml(m.timestamp || '')}</span>
            </div>
            ${!isUser ? `<button type="button" class="win-ctrl-btn btn-read-bubble" data-msg-idx="${idx}" style="font-size:9.5px;padding:1px 6px;border-color:#00f0ff;color:#00f0ff;">🔊 끝까지 읽기</button>` : ''}
          </div>
          <div class="bubble-text">${cleanTxt}</div>
        </div>
      `;
    }).join('');

    feed.querySelectorAll('.btn-read-bubble').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.msgIdx);
        const msg = messages[idx];
        if (msg && msg.text) {
          this.speakStewardReply(msg.text, 'jarvis');
        }
      });
    });

    feed.scrollTop = feed.scrollHeight;
  },

  renderBscCouncilFeed(sessions = [], latestReportPath = '') {
    const feed = document.getElementById('bsc-council-feed');
    const pathEl = document.getElementById('bsc-council-saved-path');
    if (pathEl && latestReportPath) {
      pathEl.textContent = `✅ 정식 보고서 저장됨: ${latestReportPath}`;
    }
    if (!feed || !Array.isArray(sessions) || sessions.length === 0) return;

    feed.innerHTML = sessions.map(s => {
      const modeBadge = s.mode === 'DISCUSS'
        ? '<span style="background:rgba(56,189,248,0.18);border:1px solid #38bdf8;color:#38bdf8;padding:2px 8px;border-radius:999px;font-size:10.5px;font-weight:800;">💬 의논 (Discussion)</span>'
        : (s.mode === 'REPORT'
          ? '<span style="background:rgba(52,211,153,0.18);border:1px solid #34d399;color:#34d399;padding:2px 8px;border-radius:999px;font-size:10.5px;font-weight:800;">📋 정식 보고서 (Report)</span>'
          : '<span style="background:rgba(251,191,36,0.18);border:1px solid #fbbf24;color:#fbbf24;padding:2px 8px;border-radius:999px;font-size:10.5px;font-weight:800;">🏛️ 전사 회의 (Council Meeting)</span>');

      const entriesHtml = (s.entries || []).map(e => {
        const agentId = e.agentId || 'taejun';
        const bannerUrl = `/agent_images/${agentId}/avatar_10pct.png`;
        return `
        <div style="padding:10px 12px;background:rgba(15,23,42,0.86);border:1px solid rgba(148,163,184,0.22);border-radius:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px;">
            <img src="${bannerUrl}" alt="${e.speaker || agentId}" style="height:36px;width:auto;max-width:82%;object-fit:contain;" onerror="this.style.display='none'" />
            <span style="font-size:10px;padding:2px 7px;border-radius:6px;background:rgba(251,191,36,0.15);color:#fbbf24;white-space:nowrap;">${e.roleTag || '발언'}</span>
          </div>
          <div style="font-size:12.5px;line-height:1.58;color:#e2e8f0;">${String(e.text || '').replace(/\*\*/g, '').replace(/\n/g, '<br/>')}</div>
        </div>
      `;
      }).join('');

      return `
        <div style="padding:12px 14px;background:rgba(8,14,28,0.92);border:1px solid rgba(251,191,36,0.35);border-radius:12px;display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;border-bottom:1px solid rgba(251,191,36,0.2);padding-bottom:6px;">
            <div style="display:flex;align-items:center;gap:8px;">
              ${modeBadge}
              <strong style="color:#fbbf24;font-size:13px;">안건: ${s.topic || ''}</strong>
            </div>
            <span style="font-size:10.5px;color:#94a3b8;">${s.timestamp || ''}</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:7px;">
            ${entriesHtml}
          </div>
          ${s.reportPath ? `<div style="font-size:10.5px;color:#34d399;font-family:monospace;margin-top:2px;">📄 본사 01.보고서 아카이빙 완료: ${s.reportPath}</div>` : ''}
        </div>
      `;
    }).join('');

    feed.scrollTop = feed.scrollHeight;
  },

  toggleBscCouncilWindow(forceOpen) {
    const win = document.getElementById('bsc-council-window');
    if (!win) return;
    const isVisible = win.style.display === 'flex';
    const nextState = typeof forceOpen === 'boolean' ? forceOpen : !isVisible;
    win.style.display = nextState ? 'flex' : 'none';
  },

  async submitBscCouncilTopic(topic, mode = 'MEETING') {
    if (!topic) return;
    this.toggleBscCouncilWindow(true);
    const feed = document.getElementById('bsc-council-feed');
    if (feed) {
      const loadingDiv = document.createElement('div');
      loadingDiv.style.cssText = 'padding:12px;background:rgba(251,191,36,0.12);border:1px solid #fbbf24;border-radius:10px;color:#fbbf24;font-size:12px;font-weight:700;';
      loadingDiv.textContent = `⏳ [BeausCreators 워룸] 소하·거누·우진·태준 요원이 "${topic}" 안건에 대해 [${mode}] 협업을 진행하고 본사 보고서를 작성 중입니다...`;
      feed.appendChild(loadingDiv);
      feed.scrollTop = feed.scrollHeight;
    }
    try {
      const res = await fetch('/api/jarvis/bsc-council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, mode })
      });
      const data = await res.json();
      if (data && data.ok && Array.isArray(data.sessions)) {
        this.renderBscCouncilFeed(data.sessions, data.reportPath);
      }
    } catch (e) {}
  },

  async runFullSystemVerificationUI() {
    window.BSC_WORLDVIEW.showToast('🛡️ J.A.R.V.I.S. 시스템 감사', '이건우 대표님, 전 시스템 검토·검수·검증 및 Google Harness² 재귀 진화 진단을 실행 중입니다...', '/agent_images/geonu/analyze.png');
    try {
      const res = await fetch('/api/jarvis/full-verify', { method: 'POST' });
      const data = await res.json();
      const checks = Array.isArray(data?.checks) ? data.checks : [];
      const failed = checks.filter(c => !c.passed);
      const mdLines = [
        `# 🛡️ [전 시스템 검토·검수·검증] 종합 점수 ${data.score}/100점 (${data.durationMs}ms)`,
        `판정은 ${data.ok ? '통과' : '미통과'}입니다. 통과하지 못한 항목은 ${failed.length}건입니다.`,
        `## 1. 실시간 검증 결과`,
        ...checks.map(c => `- **${c.passed ? 'PASS' : 'FAIL'} [${c.category}] ${c.item}**. ${c.detail}`),
        `---`,
        `## 2. 이전 수정 기록`,
        ...(data.fixedDefects || []).map(d => `- **[${d.id}] ${d.title}**. ${d.solution}`)
      ];
      if (window.HUDWindowSpawner) {
        window.HUDWindowSpawner.spawn({
          windowType: 'REPORT',
          title: `🛡️ 시스템 검증 ${data.ok ? '통과' : '미통과'} (${data.score}점)`,
          subtitle: '통과하지 못한 항목만 보고서에서 확인합니다.',
          content: mdLines.join('\n')
        });
      }
      const summarySpeech = data.ok
        ? `대표님, 검증 ${checks.length}항목이 모두 통과했습니다. 점수는 ${data.score}점입니다.`
        : `대표님, 검증 ${failed.length}항목이 통과하지 못했습니다. 점수는 ${data.score}점입니다.`;
      this.speakStewardReply(summarySpeech);
    } catch (e) {
      window.BSC_WORLDVIEW.showToast('🛡️ J.A.R.V.I.S. 시스템 감사', '대표님, 검증 서버에 닿지 못했습니다.');
    }
  },

  toggleChatDrawer(forceOpen) {
    const drawer = document.getElementById('agent-chat-drawer');
    if (!drawer) return;
    if (typeof forceOpen === 'boolean') {
      drawer.classList.toggle('open', forceOpen);
    } else {
      drawer.classList.toggle('open');
    }
  },

  alwaysListening: false,
  _arStageOwnsMic: false,

  arStageOwnsMic() {
    return this._arStageOwnsMic === true;
  },

  stopMicWaveform() {
    this._micStop = true;
    if (this._micAnimId) cancelAnimationFrame(this._micAnimId);
    this._micAnimId = 0;
    if (this._micStream) {
      this._micStream.getTracks().forEach((track) => track.stop());
      this._micStream = null;
    }
    try { this._micAudioCtx?.close(); } catch (_) {}
    this._micAudioCtx = null;
    this._micAnalyser = null;
  },

  suspendForArStage(on) {
    this._arStageOwnsMic = !!on;
    if (on) {
      this.alwaysListening = false;
      try { this.recognition?.stop(); } catch (_) {}
      this.stopMicWaveform();
      return;
    }
    this.alwaysListening = true;
    try { this.recognition?.start(); } catch (_) {}
    this.startMicWaveformVisualizer();
  },

  _sttSilenceTimer: null,
  _sttBufferText: '',
  _micAudioCtx: null,
  _micAnalyser: null,
  _micAnimId: null,

  updateSttBanner(text, stateLabel = '대기중', color = '#38bdf8') {
    const txtEl = document.getElementById('sasarisa-live-stt-text');
    const stEl = document.getElementById('sasarisa-live-stt-state');
    const dotEl = document.getElementById('sasarisa-pill-dot');
    if (txtEl) {
      txtEl.textContent = text;
      txtEl.style.color = color;
    }
    if (stEl) {
      stEl.textContent = stateLabel;
      stEl.style.color = color;
    }
    if (dotEl) {
      dotEl.style.background = color;
      dotEl.style.boxShadow = `0 0 12px ${color}`;
    }
  },

  async startMicWaveformVisualizer() {
    if (this.arStageOwnsMic()) return;
    if (this._micAnalyser) return;
    this._micStop = false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this._micStream = stream;
      if (this._micStop || this.arStageOwnsMic()) {
        stream.getTracks().forEach((track) => track.stop());
        this._micStream = null;
        return;
      }
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this._micAudioCtx = new AudioCtx();
      const source = this._micAudioCtx.createMediaStreamSource(stream);
      this._micAnalyser = this._micAudioCtx.createAnalyser();
      this._micAnalyser.fftSize = 64;
      source.connect(this._micAnalyser);

      const dataArray = new Uint8Array(this._micAnalyser.frequencyBinCount);
      let loudTicks = 0;
      let lastNoTranscriptHintAt = 0;
      this._lastSpeechResultAt = Date.now();

      const draw = () => {
        if (this._micStop || !this._micAnalyser || this.arStageOwnsMic()) return;
        this._micAnimId = requestAnimationFrame(draw);
        this._micAnalyser.getByteFrequencyData(dataArray);

        // Compute normalized mic level v (0.0 .. 1.0) and scale SasariSa 3-Ring Orb Core (HUD.swift OrbView.level(v))
        let sum = 0;
        for (let i = 0; i < 16; i++) sum += dataArray[i] || 0;
        const avgLevel = (sum / 16) / 255;
        const orbCore = document.getElementById('sasarisa-orb-core');
        if (orbCore) {
          const s = 1 + Math.min(avgLevel * 1.9, 0.58);
          orbCore.style.transform = `scale(${s.toFixed(3)})`;
        }

        // Voice Activity Detector (VAD): if user is clearly speaking into the mic (avgLevel > 0.14)
        // while TTS is NOT speaking, ensure SpeechRecognition is actively running!
        if (avgLevel > 0.14 && !this.isSpeakingTts && !this.arStageOwnsMic()) {
          loudTicks++;
          if (!this.isListening && this.recognition) {
            this.alwaysListening = true;
            try { this.recognition.start(); } catch (_) {}
          }
          // If user has been speaking for ~1.6s (~95 frames) and WebSpeech hasn't fired onresult yet,
          // automatically invoke Windows SAPI Local Korean STT (/api/jarvis/stt) AND restart WebSpeech!
          if (loudTicks > 95 && Date.now() - (this._lastSpeechResultAt || 0) > 3800 && Date.now() - lastNoTranscriptHintAt > 6500 && !this._sapiFallbackBusy) {
            lastNoTranscriptHintAt = Date.now();
            this._sapiFallbackBusy = true;
            if (window.SasariSaMainOS) {
              window.SasariSaMainOS.setHudCard(
                '',
                '🎙️ 마이크 음성 감지됨 · Windows 로컬 한국어 인식기(SAPI) 동시 가동 중…',
                '말씀하시는 음성을 인식하고 있습니다…',
                '브라우저 WebSpeech와 Windows 11 로컬 음성인식 엔진이 함께 음성을 분석합니다.'
              );
            }
            fetch('/api/jarvis/stt', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ durationSec: 4 })
            })
              .then(r => r.json())
              .then(sapiRes => {
                this._sapiFallbackBusy = false;
                const heard = String(sapiRes?.transcript || '').trim();
                if (heard && heard.length >= 2 && Date.now() - (this._lastSpeechResultAt || 0) > 2500) {
                  this._lastSpeechResultAt = Date.now();
                  if (window.SasariSaMainOS) {
                    window.SasariSaMainOS.executeVoiceOrTextCommand(heard);
                  } else {
                    this.sendCommandToJarvis(heard);
                  }
                }
              })
              .catch(() => {
                this._sapiFallbackBusy = false;
              });
            try {
              this.recognition?.stop();
              setTimeout(() => {
                if (!this.isSpeakingTts) {
                  try { this.recognition?.start(); } catch (_) {}
                }
              }, 180);
            } catch (_) {}
          }
        } else {
          loudTicks = Math.max(0, loudTicks - 2);
        }

        const canvases = [
          document.getElementById('sasarisa-mic-waveform'),
          document.getElementById('sasarisa-orb-level-meter')
        ].filter(Boolean);

        canvases.forEach(canvas => {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const bars = Math.floor(canvas.width / 4.8);
          const barW = 3.2;
          const gap = 1.5;
          for (let i = 0; i < bars; i++) {
            const val = dataArray[i] || 2;
            const h = Math.max(2, (val / 255) * (canvas.height - 2));
            ctx.fillStyle = val > 95 ? '#73ff99' : '#4dd9ff';
            ctx.fillRect(2 + i * (barW + gap), canvas.height - h - 1, barW, h);
          }
        });
      };
      draw();
    } catch (e) {}
  },

  initVoiceEngine() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      this.updateSttBanner('🎙️ 브라우저 웹 음성인식 미지원 — 로컬 Windows SAPI 음성 폴백 대기 중', '로컬 STT', '#fbbf24');
      return;
    }

    this.recognition = new SpeechRec();
    this.recognition.lang = 'ko-KR';
    this.recognition.interimResults = true;
    this.recognition.continuous = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      document.getElementById('orb-voice-mic')?.classList.add('listening');
      document.getElementById('sasarisa-authentic-hud')?.classList.add('listening');
      const hudMicBtn = document.getElementById('btn-hud-mic-toggle');
      if (hudMicBtn) {
        hudMicBtn.classList.add('active');
        hudMicBtn.textContent = '🎙️ 연속 듣기 ON';
      }
      const micBtn = document.getElementById('btn-sasarisa-pill-mic');
      if (micBtn) {
        micBtn.style.background = 'rgba(52,211,153,0.28)';
        micBtn.style.borderColor = '#34d399';
      }
      const alwaysBtn = document.getElementById('btn-sasarisa-always-listen');
      if (alwaysBtn) {
        alwaysBtn.textContent = '🟢 음성인식 작동중 (클릭시 정지)';
      }
      this.updateSttBanner('🎙️ [경청 중] 이건우 대표님, 편하게 말씀해 주십시오. (말씀 후 1.2초 뒤 자동 실행)', 'LISTENING', '#34d399');
      this.startMicWaveformVisualizer();
    };

    this.recognition.onresult = (event) => {
      // Half-Duplex Echo Guard: Ignore microphone events while TTS is actively speaking
      if (this.isSpeakingTts) return;

      let interimTranscript = '';
      let latestFinalPiece = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const piece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          latestFinalPiece += piece;
        } else {
          interimTranscript += piece;
        }
      }

      if (latestFinalPiece.trim()) {
        this._sttAccumulatedFinal = `${this._sttAccumulatedFinal || ''} ${latestFinalPiece.trim()}`.trim();
      }

      const combined = `${this._sttAccumulatedFinal || ''} ${interimTranscript.trim()}`.trim();
      if (!combined) return;
      this._lastSpeechResultAt = Date.now();

      const hudInput = document.getElementById('sasarisa-hud-input');
      if (hudInput) hudInput.value = combined;
      const pillInput = document.getElementById('sasarisa-pill-input');
      if (pillInput) pillInput.value = combined;
      const bottomInput = document.getElementById('jarvis-prompt-input');
      if (bottomInput) bottomInput.value = combined;

      // Update the main SasariSa Authentic HUD Card in real time with large visible heard transcript
      if (window.SasariSaMainOS) {
        window.SasariSaMainOS.setHudCard(
          '',
          latestFinalPiece ? '● 음성 인식 완료 · 실행 대기 중…' : '● 실시간 음성 받아쓰기 중…',
          `🎙️ 인식된 말씀: "${combined}"`,
          combined,
          false
        );
      }

      this.updateSttBanner(`🗣️ 인식 중: "${combined}"`, latestFinalPiece ? '확정됨' : '인식중...', '#00f0ff');

      if (this._sttSilenceTimer) clearTimeout(this._sttSilenceTimer);
      this._sttBufferText = combined;

      // Determine natural pause window:
      // - If the user only said the wake word so far ("자비스", "BSC 자비스", "사사리사"), wait 1200ms so they can finish the sentence!
      // - If a final clause arrived, wait 750ms in case a second clause follows; otherwise 1250ms for interim speech.
      const isWakeOnlySoFar = /^(?:헤이\s*|어이\s*|야\s*)?(?:BSC[\s_]*자비스|비에스씨[\s_]*자비스|자비스|자비쓰|사사리사)[야아님]?[,，.!\s]*$/i.test(combined);
      const waitMs = isWakeOnlySoFar ? 1200 : (latestFinalPiece ? 750 : 1250);

      this._sttSilenceTimer = setTimeout(() => {
        const toSend = String(this._sttBufferText || '').trim();
        this._sttBufferText = '';
        this._sttAccumulatedFinal = '';
        if (toSend.length >= 2) {
          // Anti-Echo Guard: Ignore if the transcript matches what Jarvis just spoke aloud
          if (this.lastSpokenKey && Date.now() - (this.lastSpokenAt || 0) < 7500) {
            const normHeard = toSend.replace(/\s+/g, '');
            const normSpoken = String(this.lastSpokenKey).replace(/\s+/g, '');
            if (normSpoken.includes(normHeard) && normHeard.length > 3) {
              return;
            }
          }
          if (hudInput) hudInput.value = '';
          if (pillInput) pillInput.value = '';
          this.updateSttBanner(`🚀 음성 명령 실행: "${toSend}"`, '실행중', '#fbbf24');
          if (window.SasariSaMainOS) {
            window.SasariSaMainOS.executeVoiceOrTextCommand(toSend);
          } else if (typeof this.runSasarisaPillCommand === 'function') {
            this.runSasarisaPillCommand(toSend);
          } else {
            this.sendCommandToJarvis(toSend);
          }
        }
      }, waitMs);
    };

    this.recognition.onerror = async (event) => {
      const errCode = event?.error || '';
      if (errCode === 'no-speech' || errCode === 'aborted') {
        // Normal silence during continuous listening; keep waiting quietly
        return;
      }
      if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
        this.alwaysListening = false;
        this.updateSttBanner('⚠️ 브라우저 마이크 권한 확인 필요 (주소창 좌측 아이콘)', '마이크 권한', '#f87171');
        return;
      }
      if (errCode === 'audio-capture') {
        this.updateSttBanner('🎙️ OS 백그라운드 음성 데몬 활성 중 (입력칸·Win+H·카메라 시선/손동작 동시 작동)', 'OS 데몬 활성', '#38bdf8');
        return;
      }
      if (errCode === 'network') {
        this.updateSttBanner('🔄 음성인식 엔진 자동 재연결 중...', '재연결', '#fbbf24');
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      document.getElementById('orb-voice-mic')?.classList.remove('listening');
      if (this.isSpeakingTts) {
        // Half-Duplex: Stay paused while TTS is speaking; _resumeMicAfterTts() will restart it
        return;
      }
      if (this.alwaysListening !== false && !this.arStageOwnsMic()) {
        setTimeout(() => {
          try {
            if (!this.isListening && !this.isSpeakingTts && !this.arStageOwnsMic()) {
              this.recognition.start();
            }
          } catch (_) {}
        }, 220);
      } else if (!this.arStageOwnsMic()) {
        const micBtn = document.getElementById('btn-sasarisa-pill-mic');
        if (micBtn) {
          micBtn.style.background = 'rgba(0,240,255,0.16)';
          micBtn.style.borderColor = '#00f0ff';
        }
        const alwaysBtn = document.getElementById('btn-sasarisa-always-listen');
        if (alwaysBtn) {
          alwaysBtn.textContent = '🎙️ 연속 음성인식 시작';
        }
        this.updateSttBanner('🎙️ [음성 대기] 마이크 버튼을 누르거나 말씀해 주십시오.', '대기중', '#38bdf8');
      }
    };
  },

  isSpeakingTts: false,
  alwaysUseOsSpeaker: true,

  _pauseMicForTts() {
    this.isSpeakingTts = true;
    this._sttBufferText = '';
    this._sttAccumulatedFinal = '';
    if (this._sttSilenceTimer) {
      clearTimeout(this._sttSilenceTimer);
      this._sttSilenceTimer = null;
    }
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (_) {}
    }
  },

  _resumeMicAfterTts() {
    this.isSpeakingTts = false;
    this.lastSpokenAt = Date.now();
    if (this.arStageOwnsMic()) return;
    if (this.alwaysListening !== false && this.recognition) {
      setTimeout(() => {
        if (!this.isListening && !this.isSpeakingTts && !this.arStageOwnsMic()) {
          try {
            this.recognition.start();
          } catch (_) {}
        }
      }, 220);
    }
  },

  toggleVoiceListening(forceContinuous) {
    if (this.arStageOwnsMic()) return;
    if (!this.recognition) {
      fetch('/api/jarvis/stt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ durationSec: 4 })
      })
        .then(r => r.json())
        .then(res => {
          if (res && res.transcript) {
            this.runSasarisaPillCommand?.(res.transcript);
          }
        })
        .catch(() => {});
      return;
    }
    this.stopAllSpeech();
    if (this.isListening) {
      this.alwaysListening = false;
      try { this.recognition.stop(); } catch (e) {}
    } else {
      this.alwaysListening = typeof forceContinuous === 'boolean' ? forceContinuous : true;
      try {
        this.recognition.start();
      } catch (e) {}
    }
  },

  selectedVoiceId: (typeof localStorage !== 'undefined' && localStorage.getItem('jarvis_voice_id')) || 'ko-KR-HyunsuMultilingualNeural',

  setNeuralVoice(voiceId, speakSample = false) {
    if (!voiceId) return;
    this.selectedVoiceId = voiceId;
    try { localStorage.setItem('jarvis_voice_id', voiceId); } catch (_) {}
    const labelMap = {
      'ko-KR-HyunsuMultilingualNeural': '현수 HD (차분한 남성 아나운서)',
      'ko-KR-SunHiNeural': '선희 HD (따뜻한 여성 비서)',
      'ko-KR-InJoonNeural': '인준 HD (부드러운 남성 대화)'
    };
    const label = labelMap[voiceId] || voiceId;
    if (speakSample) {
      this.speakText(`이건우 대표님, 자비스 음성을 ${label} 목소리로 변경했습니다. 훨씬 자연스러운 톤으로 안내해 드리겠습니다.`);
    }
  },

  // 40ms ultra-quiet WAV data URI to prime HTMLAudioElement synchronously inside iPad/iOS user tap gestures
  _silentWavDataUri: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',

  primeSharedAudioForIos() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = this.audioCtx || new AudioCtx();
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().catch(() => {});
        }
      }
    } catch (_) {}
    try {
      if (!this.sharedAudioEl) {
        this.sharedAudioEl = new Audio();
        this.sharedAudioEl.playsInline = true;
        this.sharedAudioEl.preload = 'auto';
      }
      if (!this._sharedAudioPrimedOnce) {
        this._sharedAudioPrimedOnce = true;
        this.sharedAudioEl.src = this._silentWavDataUri;
        const p = this.sharedAudioEl.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }
    } catch (_) {}
  },

  initIosAudioUnlocker() {
    if (this._iosAudioUnlockerBound) return;
    this._iosAudioUnlockerBound = true;

    if (window.speechSynthesis && window.speechSynthesis.getVoices) {
      window.speechSynthesis.getVoices();
      if ('onvoiceschanged' in window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
          try { window.speechSynthesis.getVoices(); } catch (_) {}
        };
      }
    }

    const unlockOnce = () => {
      this.primeSharedAudioForIos();
      if (this._iosAudioUnlocked) return;
      this._iosAudioUnlocked = true;
      try {
        const isIos = /iPad|iPhone|iPod/i.test(navigator.userAgent || '');
        if (isIos && window.speechSynthesis && typeof window.SpeechSynthesisUtterance !== 'undefined') {
          window.speechSynthesis.resume();
          const silentUtter = new SpeechSynthesisUtterance(' ');
          silentUtter.volume = 0.01;
          silentUtter.rate = 2.0;
          silentUtter.lang = 'ko-KR';
          window.speechSynthesis.speak(silentUtter);
        }
      } catch (_) {}
    };

    ['touchstart', 'touchend', 'pointerdown', 'click', 'keydown'].forEach(evtName => {
      window.addEventListener(evtName, unlockOnce, { passive: true, once: false });
    });
  },

  normalizeKoreanSpeechTextClient(rawText) {
    return String(rawText || '')
      .replace(/```[\s\S]*?```/g, ' 코드 블록은 화면을 참고해 주십시오. ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[A-Za-z]:\\[^\s"'<>]+/g, ' 로컬 폴더 ')
      .replace(/(\d),(\d{3})/g, '$1$2')
      .replace(/(\d),(\d{3})/g, '$1$2')
      .replace(/\bJ\.?A\.?R\.?V\.?I\.?S\.?\b/gi, '자비스')
      .replace(/\bAPI\b/gi, '에이피아이')
      .replace(/\bRAG\b/gi, '래그')
      .replace(/\bMD\b/gi, '마크다운')
      .replace(/\.md\b/gi, ' 마크다운 ')
      .replace(/\bTTS\b/gi, '티티에스')
      .replace(/\bSTT\b/gi, '에스티티')
      .replace(/\bIDE\b/gi, '아이디이')
      .replace(/\bADE\b/gi, '에이디이')
      .replace(/\bBSC\b/gi, '비에스씨')
      .replace(/\bGemma\s*4\b/gi, '제마 포')
      .replace(/(\d+)\s*%/g, '$1퍼센트')
      .replace(/\(([^)]{1,60})\)/g, ', $1, ')
      .replace(/[*#_~>|『』「」《》〈〉【】\[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  speakViaBrowserSpeechSync(rawText, myToken) {
    if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance === 'undefined') {
      return Promise.resolve(false);
    }
    return new Promise((resolve) => {
      try {
        const normalized = this.normalizeKoreanSpeechTextClient(rawText);
        if (!normalized) return resolve(false);

        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        // Keep track on window so iOS Safari GC never collects the active utterance mid-speech
        const utter = new SpeechSynthesisUtterance(normalized);
        window.__jarvisActiveUtterance = utter;
        utter.lang = 'ko-KR';
        utter.volume = 1.0;
        utter.rate = 1.02;
        utter.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
        // STRICT ANTI-HEAMI GUARD: Never allow legacy Windows SAPI robotic female voice (Microsoft Heami Desktop)
        const naturalKoVoice = voices.find(v =>
          /ko[-_]KR|^ko/i.test(v.lang) &&
          !/Heami|혜미|Desktop/i.test(v.name) &&
          /Natural|Online|Hyunsu|InJoon|BongJin|GookMin|Siri|Minsu|Yuna|Google/i.test(v.name)
        );
        if (!naturalKoVoice) {
          // Do NOT speak with robotic female Heami voice; let Neural MP3 / OS Direct Neural Speaker handle it
          return resolve(false);
        }
        utter.voice = naturalKoVoice;

        if (this.speechPulseInterval) clearInterval(this.speechPulseInterval);
        this.speechPulseInterval = setInterval(() => {
          if (window.JarvisReactorCore) {
            window.JarvisReactorCore.pulseSpeech(0.95 + Math.random() * 0.45);
          }
          // iOS Safari workaround: keep speechSynthesis resumed on long utterances
          if (window.speechSynthesis && window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        }, 140);

        const done = (okState) => {
          clearTimeout(timer);
          if (this.speechPulseInterval) {
            clearInterval(this.speechPulseInterval);
            this.speechPulseInterval = null;
          }
          resolve(okState);
        };

        const timer = setTimeout(() => done(true), 22000);
        utter.onend = () => done(true);
        utter.onerror = () => done(false);

        // Speak synchronously inside the current call stack so iPad/iOS Safari allows it!
        window.speechSynthesis.speak(utter);
      } catch (_) {
        resolve(false);
      }
    });
  },

  haltPlayback() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.removeAttribute('src');
      } catch (e) {}
      this.currentAudio = null;
    }
    if (this.speechPulseInterval) {
      clearInterval(this.speechPulseInterval);
      this.speechPulseInterval = null;
    }
  },

  stopAllSpeech() {
    this.speechQueueToken = (this.speechQueueToken || 0) + 1;
    this.haltPlayback();
    if (window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (_) {}
    }
    fetch('/api/jarvis/tts/stop-os', { method: 'POST' }).catch(() => {});
    this._resumeMicAfterTts();
  },

  async playOnWindowsOsSpeakerFallback(text, activeVoiceId, preSynthesized, myToken) {
    try {
      const osRes = await fetch('/api/jarvis/tts/speak-os', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId: activeVoiceId,
          preSynthesized: preSynthesized && preSynthesized.ok ? preSynthesized : null
        })
      }).then(r => r.json()).catch(() => null);
      if (osRes && osRes.ok) {
        const waitMs = Math.min(24000, Math.max(1800, Number(osRes.estimatedDurationMs) || 3200));
        await new Promise(resolve => setTimeout(resolve, waitMs));
        return true;
      }
    } catch (_) {}
    return false;
  },

  async playSingleNeuralTurn(turn, myToken) {
    if (myToken !== this.speechQueueToken) return;
    const text = String(turn && turn.text ? turn.text : '').replace(/\*\*/g, '').trim();
    if (!text) return;
    const cfg = (window.AIStudioData && window.AIStudioData.routerConfig) || {};
    const activeVoiceId = turn.voiceId || this.selectedVoiceId || 'ko-KR-HyunsuMultilingualNeural';
    const voiceTitleMap = {
      'ko-KR-HyunsuMultilingualNeural': '🎙️ 현수 96kbps HD 자연음성',
      'ko-KR-SunHiNeural': '🎙️ 선희 96kbps HD 자연음성',
      'ko-KR-InJoonNeural': '🎙️ 인준 96kbps HD 자연음성'
    };
    const speaker = '🤖 J.A.R.V.I.S.';
    const avatar = /SunHi/i.test(activeVoiceId) ? '/agent_images/soha/avatar_10pct.png' : '/agent_images/geonu/analyze.png';
    const voiceBadge = voiceTitleMap[activeVoiceId] || '🎙️ 96kbps HD 자연음성';

    window.BSC_WORLDVIEW.showToast(speaker, text, avatar, voiceBadge);

    if (cfg.autoSpeakResponses === false && !turn.voiceId) return;

    this.haltPlayback();
    // Half-Duplex Echo Guard: Pause STT microphone while Jarvis speaks aloud
    this._pauseMicForTts();

    try {
      const res = await fetch('/api/jarvis/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          persona: 'jarvis',
          voiceId: activeVoiceId,
          speechRate: 1.04,
          pitchHz: '+0Hz'
        })
      });
      if (myToken !== this.speechQueueToken) {
        this._resumeMicAfterTts();
        return;
      }
      const data = await res.json();

      // Check if browser autoplay is blocked (e.g., new --app window before user click)
      const userHasActivatedBrowser = navigator.userActivation ? Boolean(navigator.userActivation.hasBeenActive) : true;

      if (data && data.ok && (data.audioBase64 || data.audioUrl) && userHasActivatedBrowser) {
        const audio = this.sharedAudioEl || new Audio();
        audio.playsInline = true;
        audio.volume = 1.0;
        audio.src = data.audioBase64
          ? `data:${data.mimeType || 'audio/mp3'};base64,${data.audioBase64}`
          : data.audioUrl;
        this.currentAudio = audio;
        const started = await audio.play().then(() => true).catch(() => false);
        if (!started || audio.paused) {
          this.haltPlayback();
          // Browser blocked audio.play() -> Immediately play through Windows 11 OS Direct Speaker!
          const osPlayed = await this.playOnWindowsOsSpeakerFallback(text, activeVoiceId, data, myToken);
          if (!osPlayed) {
            await this.speakViaBrowserSpeechSync(text, myToken);
          }
          this._resumeMicAfterTts();
          return;
        }
        if (myToken !== this.speechQueueToken) {
          this.haltPlayback();
          this._resumeMicAfterTts();
          return;
        }
        this.speechPulseInterval = setInterval(() => {
          if (window.JarvisReactorCore) {
            window.JarvisReactorCore.pulseSpeech(0.95 + Math.random() * 0.45);
          }
        }, 110);
        await new Promise((resolve) => {
          audio.onended = resolve;
          audio.onerror = resolve;
        });
        this.haltPlayback();
      } else {
        // Either browser hasn't been clicked yet (Autoplay Blocked) or audio stream missing -> Use Windows 11 OS Speaker directly!
        const osPlayed = await this.playOnWindowsOsSpeakerFallback(text, activeVoiceId, data, myToken);
        if (!osPlayed) {
          await this.speakViaBrowserSpeechSync(text, myToken);
        }
      }
    } catch (e) {
      this.haltPlayback();
      const osPlayed = await this.playOnWindowsOsSpeakerFallback(text, activeVoiceId, null, myToken);
      if (!osPlayed) {
        await this.speakViaBrowserSpeechSync(text, myToken);
      }
    } finally {
      this._resumeMicAfterTts();
    }
  },

  async speakNeuralTurns(dialogueTurns, fallbackText = '') {
    const parts = Array.isArray(dialogueTurns) && dialogueTurns.length > 0
      ? dialogueTurns.map(t => String(t.text || '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean)
      : [String(fallbackText || '').replace(/\s+/g, ' ').trim()];
    const fullText = parts.filter((part, index) => part && part !== parts[index - 1]).join(' ');
    if (!fullText) return;
    const now = Date.now();
    if (fullText === this.lastSpokenKey && now - (this.lastSpokenAt || 0) < 4000) return;
    this.lastSpokenKey = fullText;
    this.lastSpokenAt = now;
    this.stopAllSpeech();
    const myToken = this.speechQueueToken;
    await this.playSingleNeuralTurn({ persona: 'jarvis', speaker: '🤖 J.A.R.V.I.S.', text: fullText }, myToken);
  },

  speakText(text) {
    this.primeSharedAudioForIos();
    this.speakStewardReply(text);
  },

  speakStewardReply(text) {
    if (!text) return;
    this.primeSharedAudioForIos();
    const clean = String(text).replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
    const calloutEl = document.getElementById('jarvis-orb-callout-text');
    if (calloutEl && clean) {
      calloutEl.textContent = `"${clean.slice(0, 88)}${clean.length > 88 ? '...' : ''}"`;
    }
    this.speakNeuralTurns([{ persona: 'jarvis', speaker: '🤖 J.A.R.V.I.S.', text: clean }], clean);
  },

  clearThinkingBubble() {
    document.getElementById('chat-thinking-bubble')?.remove();
  },

  async sendCommandToJarvis(message) {
    if (!message) return;
    // Unlock iPad/iOS HTMLAudioElement synchronously inside the user's submit/tap gesture
    this.primeSharedAudioForIos();
    if (this.pendingPcActionKey && /^(승인(해(요|주세요)?)?|실행\s*승인|허락(해(요)?)?|오케이|ok|yes)\s*[.!]?\s*$/i.test(message.trim())) {
      this.executeApprovedPcAction(this.pendingPcActionKey);
      return;
    }
    const personaMode = 'jarvis';
    window.BSC_WORLDVIEW.showToast('👑 이건우 대표님 (CEO)', message, null, '자비스가 말씀을 처리하는 중입니다.');

    this.toggleChatDrawer(true);
    const feed = document.getElementById('agent-chat-feed');
    if (feed) {
      const tempDiv = document.createElement('div');
      tempDiv.className = 'chat-bubble user';
      const meta = document.createElement('div');
      meta.className = 'bubble-meta';
      meta.textContent = '👑 이건우 대표님 (CEO)';
      const body = document.createElement('div');
      body.className = 'bubble-text';
      body.textContent = message;
      tempDiv.appendChild(meta);
      tempDiv.appendChild(body);
      feed.appendChild(tempDiv);

      const thinkDiv = document.createElement('div');
      thinkDiv.id = 'chat-thinking-bubble';
      thinkDiv.className = 'chat-bubble assistant';
      const thinkMeta = document.createElement('div');
      thinkMeta.className = 'bubble-meta';
      thinkMeta.textContent = '자비스가 답변을 준비하는 중입니다.';
      thinkDiv.appendChild(thinkMeta);
      feed.appendChild(thinkDiv);
      feed.scrollTop = feed.scrollHeight;
    }

    // 🍎 iPadOS / iOS Safari Audio Activation Guarantee:
    // If running on Firebase Cloud Hosting and cached data is ready, start speaking SYNCHRONOUSLY inside the user's tap gesture!
    let alreadySpokenSyncOnCloud = false;
    const isRemoteCloud = !['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (isRemoteCloud && typeof window.getInstantCloudReply === 'function') {
      const instantReply = window.getInstantCloudReply(message);
      if (instantReply) {
        alreadySpokenSyncOnCloud = true;
        this.speakStewardReply(instantReply);
      }
    }

    try {
      const cfg = (window.AIStudioData && window.AIStudioData.routerConfig) || {};
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: {
            personaMode,
            llmEngine: cfg.llmEngine || 'gemma4:e4b',
            speakingStyle: cfg.speakingStyle || 'NATURAL_AGENT_CONVERSATION'
          }
        })
      });
      const data = await res.json();

      if (Array.isArray(data.chatHistory)) {
        this.renderChatDrawerFeed(data.chatHistory, data.bridgeStatus);
      }

      if (data.openSettingsModal && window.HUDWindowSpawner && window.HUDWindowSpawner.openMasterSettingsModal) {
        window.HUDWindowSpawner.openMasterSettingsModal();
      }
      if (data.activateHoloGesture) {
        this.openHoloGesturePanel();
      }
      if (data.graphCommand && window.BrainGraphEngine) {
        window.BrainGraphEngine.setViewMode(data.graphCommand);
      }
      if (data.coreMode && window.JarvisReactorCore) {
        window.JarvisReactorCore.setShape(data.coreMode);
      }
      if (data.pcProposal) {
        this.openPcApprovalModal(data.pcProposal);
      }
      if (data.closeStudioHub || data.openIde) {
        const layer = document.getElementById('floating-windows-layer');
        if (layer) layer.innerHTML = '';
        document.querySelectorAll('.hud-window').forEach(el => {
          if (el.id !== 'jarvis-ide-2-window') el.style.display = 'none';
        });
      }
      if (data.openIde && window.JarvisIdeWorkbench) {
        const ide = window.JarvisIdeWorkbench;
        ide.currentFilePath = data.openIde.filePath;
        ide.openFloatingIdeWorkbench('DOC_PREVIEW');
        await ide.loadFileIntoEditor(data.openIde.filePath);
      }
      if (data.saveCurrentFile && window.JarvisIdeWorkbench) {
        const ide = window.JarvisIdeWorkbench;
        const content = document.getElementById('ide-code-textarea')?.value || '';
        const saved = await fetch('/api/jarvis/ide-save-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filePath: ide.currentFilePath, content })
        }).then(r => r.json()).catch(() => null);
        if (saved && saved.ok) {
          window.BSC_WORLDVIEW?.showToast('💾 파일 안전 저장', saved.message);
        }
      }
      if (data.telemetry) {
        window.BSC_WORLDVIEW.updateTelemetryUI(data.telemetry);
      }
      this.clearThinkingBubble();
      if (!alreadySpokenSyncOnCloud) {
        if (data.dialogueTurns && data.dialogueTurns.length > 0) {
          this.speakNeuralTurns(data.dialogueTurns, data.reply);
        } else if (data.reply) {
          this.speakStewardReply(data.reply);
        }
      }
    } catch (e) {
      this.clearThinkingBubble();
      const errFeed = document.getElementById('agent-chat-feed');
      if (errFeed) {
        const err = document.createElement('div');
        err.className = 'chat-bubble assistant';
        const errMeta = document.createElement('div');
        errMeta.className = 'bubble-meta';
        errMeta.textContent = '🤖 J.A.R.V.I.S.';
        const errBody = document.createElement('div');
        errBody.className = 'bubble-text';
        errBody.textContent = '대표님, 서버에 닿지 못했습니다. 자비스 서버가 켜져 있는지 확인해 주십시오.';
        err.appendChild(errMeta);
        err.appendChild(errBody);
        errFeed.appendChild(err);
      }
    }
  },

  openPcApprovalModal(proposal) {
    this.pendingPcActionKey = proposal.actionKey;
    const modal = document.getElementById('pc-approval-modal');
    if (!modal) return;
    document.getElementById('pc-approval-title').textContent = proposal.label;
    document.getElementById('pc-approval-desc').textContent = proposal.desc;
    document.getElementById('pc-approval-cmd').textContent = proposal.cmd;
    modal.style.display = 'flex';
  },

  async executeApprovedPcAction(actionKey) {
    const modal = document.getElementById('pc-approval-modal');
    if (modal) modal.style.display = 'none';
    this.pendingPcActionKey = null;

    const res = await fetch('/api/pc-control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionKey, approved: true })
    });
    const data = await res.json();
    const msg = data.ok
      ? `이건우 대표님의 승인을 받아 『${data.executed}』 작업을 안전하게 완료했습니다.`
      : `작업 실행 중 주의사항이 발생했습니다: ${data.error || data.output}`;
    window.BSC_WORLDVIEW.showToast('🖥️ Safe Computer Use', msg);
    this.speakStewardReply(msg);
  },

  async toggleSensor(sensorName, btnEl) {
    this.sensors[sensorName] = !this.sensors[sensorName];
    const active = this.sensors[sensorName];
    btnEl.classList.toggle('active', active);
    const stateSpan = btnEl.querySelector('.s-state');
    if (stateSpan) stateSpan.textContent = active ? 'on' : 'off';

    if (sensorName === 'FOCUS') {
      if (window.BrainGraphEngine) window.BrainGraphEngine.focusMode = active;
      window.BSC_WORLDVIEW.showToast('J.A.R.V.I.S.', active ? 'FOCUS 모드가 켜졌습니다. 선택된 지식 노드와 연결 경로에만 집중합니다.' : 'FOCUS 모드가 해제되어 전체 지식 은하를 표시합니다.');
    } else if (sensorName === 'EYES' || sensorName === 'HOLO') {
      if (active) {
        await this.startWebcamAndHolo(sensorName);
      } else if (!this.sensors.EYES && !this.sensors.HOLO) {
        this.stopWebcamAndHolo();
      }
    } else if (sensorName === 'WATCH') {
      if (active) {
        window.BSC_WORLDVIEW.showToast('👁️ WATCH (화면 인식)', 'PC 화면 컨텍스트 인식 모드가 활성화되었습니다. 필요한 작업이 보이면 자비스가 즉시 도구 창을 제안합니다.');
      } else {
        window.BSC_WORLDVIEW.showToast('👁️ WATCH', 'PC 화면 컨텍스트 인식이 종료되었습니다.');
      }
    }
  },

  async refreshCameraDeviceList(autoStartOnNewCamera = false) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter(d => d.kind === 'videoinput');
      const sel = document.getElementById('holo-camera-select');
      if (sel) {
        if (cams.length === 0) {
          sel.innerHTML = '<option value="">📷 PC 웹캠 자동 감지 대기 중 (0대)</option>';
        } else {
          sel.innerHTML = cams.map((c, idx) => `<option value="${c.deviceId}">📷 ${c.label || `PC USB Camera #${idx + 1}`}</option>`).join('');
        }
      }
      if (autoStartOnNewCamera && cams.length > 0 && !this.webcamStream) {
        this.sensors.HOLO = true;
        this.startWebcamAndHolo('HOLO', cams[0].deviceId);
      }
    } catch (e) {}
  },

  async startWebcamAndHolo(mode, preferredDeviceId = '') {
    const video = document.getElementById('webcam-video');
    const handCanvas = document.getElementById('holo-hand-canvas');
    const badgeEl = document.getElementById('holo-gesture-status-badge');
    const alertBox = document.getElementById('holo-camera-alert-box');

    try {
      await this.refreshCameraDeviceList(false);
      const devices = navigator.mediaDevices && navigator.mediaDevices.enumerateDevices
        ? await navigator.mediaDevices.enumerateDevices()
        : [];
      const cams = devices.filter(d => d.kind === 'videoinput');

      if (!this.webcamStream || preferredDeviceId) {
        if (this.webcamStream) {
          this.webcamStream.getTracks().forEach(t => t.stop());
        }
        const videoConstraints = preferredDeviceId
          ? { deviceId: { exact: preferredDeviceId }, width: 640, height: 480 }
          : { width: 640, height: 480 };
        this.webcamStream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: false
        });
        video.srcObject = this.webcamStream;
        await video.play();
      }
      video.style.display = 'block';
      handCanvas.style.display = 'block';
      handCanvas.width = window.innerWidth;
      handCanvas.height = window.innerHeight;

      if (badgeEl) {
        badgeEl.style.color = '#34d399';
        badgeEl.textContent = `🟢 CAMERA AI ON (${cams[0]?.label || 'USB/WebCam'}) · 마우스 추적 OFF · 실제 손 21관절 인식 중`;
      }
      if (alertBox) {
        alertBox.style.background = 'rgba(52,211,153,0.12)';
        alertBox.style.borderColor = 'rgba(52,211,153,0.45)';
        alertBox.innerHTML = '✅ <b>실제 카메라 AI 연결 완료:</b> 마우스 개입이 100% 차단되었으며, 카메라 앞 <b>이건우 대표님의 실제 손가락 21개 관절 모양(✋/🤏/✌️/👍/✊)</b>을 Google MediaPipe AI가 실시간 인식하여 실행합니다.';
      }

      if (mode === 'EYES') {
        const msg = '이건우 대표님, 카메라로 자리에 계신 것을 확인했습니다(EYES ON).';
        window.BSC_WORLDVIEW.showToast('👁️ EYES (재석/모션 인지)', msg);
        this.speakStewardReply(msg);
      } else if (mode === 'HOLO') {
        const msg = '이건우 대표님, 실제 카메라 기반 MediaPipe 21관절 손동작 인식이 가동되었습니다. 카메라 앞에서 브이, 엄지 척, 핀치, 손바닥 스와이프를 취하시면 자비스가 즉시 실행합니다.';
        window.BSC_WORLDVIEW.showToast('✋ HOLO (실제 카메라 AI 21관절 손 인식)', msg);
        this.speakStewardReply(msg);
        const panel = document.getElementById('holo-gesture-hud-panel');
        if (panel) panel.style.display = 'block';
        this.startMiniHandSkeletonVisualizer();
      }

      this.initMediaPipeHandsDetector(video);
      this.runOpticalHandTracker(video, handCanvas);
    } catch (e) {
      // No physical webcam attached to desktop PC (Verified: 0 videoinput devices)
      handCanvas.style.display = 'block';
      handCanvas.width = window.innerWidth;
      handCanvas.height = window.innerHeight;
      if (badgeEl) {
        badgeEl.style.color = '#fbbf24';
        badgeEl.textContent = '⚠️ 물리적 웹캠 미연결 (PC 카메라 0대 감지) -> 웹캠 연결 시 즉시 카메라 AI 전환';
      }
      if (mode === 'HOLO') {
        const panel = document.getElementById('holo-gesture-hud-panel');
        if (panel) panel.style.display = 'block';
        this.startMiniHandSkeletonVisualizer();
      }
      window.BSC_WORLDVIEW.showToast('⚠️ 물리적 웹캠 미감지 (0대)', '현재 데스크톱 PC에 연결된 USB 웹캠이 없어 카메라 영상을 열 수 없습니다. USB 웹캠이나 스마트폰 카메라 연결 후 [📷 카메라 연결]을 누르시면 즉시 실제 손 인식으로 전환됩니다.');
      this.runMouseHoloOverlay(handCanvas);
    }
  },

  initMediaPipeHandsDetector(video) {
    if (this.mpHands || typeof window.Hands !== 'function') return;
    try {
      const hands = new window.Hands({
        locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.65,
        minTrackingConfidence: 0.65
      });
      hands.onResults(results => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const lm = results.multiHandLandmarks[0];
          this.latestHandLandmarks = lm;
          // Mirror X coordinate from Index Finger Tip (landmark 8)
          const ix = (1 - lm[8].x) * window.innerWidth;
          const iy = lm[8].y * window.innerHeight;
          this.holoCursor.x += (ix - this.holoCursor.x) * 0.35;
          this.holoCursor.y += (iy - this.holoCursor.y) * 0.35;

          const pose = this.classifyMediaPipeHandPose(lm);
          this.handleDetectedCameraPose(pose);
        } else {
          this.latestHandLandmarks = null;
        }
      });
      this.mpHands = hands;

      const pumpFrame = async () => {
        if (!this.webcamStream || (!this.sensors.HOLO && !this.sensors.EYES)) return;
        if (video.readyState >= 2) {
          try {
            await this.mpHands.send({ image: video });
          } catch (e) {}
        }
        requestAnimationFrame(pumpFrame);
      };
      requestAnimationFrame(pumpFrame);
    } catch (e) {}
  },

  classifyMediaPipeHandPose(lm) {
    // 21 Landmarks: 0=Wrist, 4=ThumbTip, 8=IndexTip, 12=MiddleTip, 16=RingTip, 20=PinkyTip
    const pinchDist = Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y);
    if (pinchDist < 0.055) return 'PINCH_CLICK';

    const indexUp  = lm[8].y < lm[6].y;
    const middleUp = lm[12].y < lm[10].y;
    const ringUp   = lm[16].y < lm[14].y;
    const pinkyUp  = lm[20].y < lm[18].y;
    const thumbUp  = lm[4].y < lm[3].y && lm[3].y < lm[2].y && lm[4].y < lm[6].y;

    if (indexUp && middleUp && !ringUp && !pinkyUp) return 'VICTORY_BRIEF';
    if (thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) return 'THUMBS_APPROVE';
    if (!indexUp && !middleUp && !ringUp && !pinkyUp) return 'FIST_RESET';
    return 'PALM_SWIPE';
  },

  handleDetectedCameraPose(pose) {
    const labelEl = document.getElementById('holo-detected-gesture-label');
    if (labelEl) labelEl.textContent = `📷 카메라 손 인식: ${pose}`;

    if (pose === 'PALM_SWIPE') {
      if (window.BrainGraphEngine) {
        window.BrainGraphEngine.rotY += ((this.holoCursor.x / window.innerWidth) - 0.5) * 0.035;
      }
      this._poseHoldCount = 0;
      return;
    }

    if (this._lastCameraPose === pose) {
      this._poseHoldCount = (this._poseHoldCount || 0) + 1;
      const now = Date.now();
      if (this._poseHoldCount === 16 && (!this._lastGestureExecAt || now - this._lastGestureExecAt > 3500)) {
        this._lastGestureExecAt = now;
        this.executeHandGestureAction(pose);
      }
    } else {
      this._lastCameraPose = pose;
      this._poseHoldCount = 1;
    }
  },

  openHoloGesturePanel() {
    const holoBtn = document.getElementById('toggle-holo');
    if (holoBtn && !this.sensors.HOLO) {
      this.toggleSensor('HOLO', holoBtn);
    } else {
      const panel = document.getElementById('holo-gesture-hud-panel');
      if (panel) panel.style.display = 'block';
      this.startMiniHandSkeletonVisualizer();
    }
  },

  startMiniHandSkeletonVisualizer() {
    const cvs = document.getElementById('holo-mini-skeleton-canvas');
    if (!cvs || this._miniSkeletonRunning) return;
    this._miniSkeletonRunning = true;
    const ctx = cvs.getContext('2d');
    let tick = 0;

    // 4 Corner Air-Touch Zones inside the mini visualizer
    const zones = [
      { id: 'PALM_SWIPE', x: 10, y: 28, w: 80, h: 36, label: '✋ 회전', color: '#00f0ff' },
      { id: 'VICTORY_BRIEF', x: 276, y: 28, w: 80, h: 36, label: '✌️ 브리핑', color: '#fbbf24' },
      { id: 'PINCH_CLICK', x: 10, y: 110, w: 80, h: 36, label: '🤏 노드클릭', color: '#34d399' },
      { id: 'THUMBS_APPROVE', x: 276, y: 110, w: 80, h: 36, label: '👍 즉시승인', color: '#c084fc' }
    ];

    let hoverZone = null;
    let hoverFrames = 0;

    // ONLY use mouse fallback on canvas if NO physical webcam stream is active!
    cvs.addEventListener('mousemove', e => {
      if (this.webcamStream) return; // Strict Camera-Only when webcam is connected!
      const rect = cvs.getBoundingClientRect();
      this.holoCursor.x = ((e.clientX - rect.left) / rect.width) * window.innerWidth;
      this.holoCursor.y = ((e.clientY - rect.top) / rect.height) * window.innerHeight;
    });

    cvs.addEventListener('click', e => {
      const rect = cvs.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * cvs.width;
      const my = ((e.clientY - rect.top) / rect.height) * cvs.height;
      for (const z of zones) {
        if (mx >= z.x && mx <= z.x + z.w && my >= z.y && my <= z.y + z.h) {
          this.executeHandGestureAction(z.id);
          return;
        }
      }
      this.executeHandGestureAction('PINCH_CLICK');
    });

    const renderLoop = () => {
      const panel = document.getElementById('holo-gesture-hud-panel');
      if (!panel || panel.style.display === 'none') {
        this._miniSkeletonRunning = false;
        return;
      }
      tick += 0.05;
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      // Draw webcam background if stream is active
      const video = document.getElementById('webcam-video');
      if (this.webcamStream && video && video.readyState >= 2) {
        ctx.save();
        ctx.translate(cvs.width, 0);
        ctx.scale(-1, 1);
        ctx.globalAlpha = 0.45;
        ctx.drawImage(video, 0, 0, cvs.width, cvs.height);
        ctx.restore();
      }

      // Draw 4 Air-Touch Corner Action Pads
      const hx = (this.holoCursor.x / Math.max(1, window.innerWidth)) * cvs.width;
      const hy = (this.holoCursor.y / Math.max(1, window.innerHeight)) * cvs.height;

      let currentZone = null;
      for (const z of zones) {
        const isHit = hx >= z.x && hx <= z.x + z.w && hy >= z.y && hy <= z.y + z.h;
        if (isHit) currentZone = z;
        ctx.strokeStyle = z.color;
        ctx.lineWidth = isHit ? 2.2 : 1.1;
        ctx.fillStyle = isHit ? 'rgba(0, 240, 255, 0.22)' : 'rgba(5, 10, 20, 0.65)';
        ctx.beginPath();
        ctx.roundRect(z.x, z.y, z.w, z.h, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = z.color;
        ctx.font = 'bold 10.5px sans-serif';
        ctx.fillText(z.label, z.x + 10, z.y + 22);
      }

      // Dwell Air-Touch Trigger (Hold hand in corner zone for ~45 frames = 0.75s)
      if (currentZone) {
        if (hoverZone === currentZone.id) {
          hoverFrames++;
          // Progress bar on zone
          ctx.fillStyle = currentZone.color;
          ctx.fillRect(currentZone.x, currentZone.y + currentZone.h - 4, (currentZone.w * Math.min(hoverFrames, 45)) / 45, 4);
          if (hoverFrames === 45) {
            this.executeHandGestureAction(currentZone.id);
            hoverFrames = 0;
          }
        } else {
          hoverZone = currentZone.id;
          hoverFrames = 1;
        }
      } else {
        hoverZone = null;
        hoverFrames = 0;
      }

      // Draw 21-Keypoint MediaPipe Hand Skeleton (Real Camera 21 Landmarks if available, else Holographic Avatar)
      if (Array.isArray(this.latestHandLandmarks) && this.latestHandLandmarks.length === 21) {
        const lm = this.latestHandLandmarks;
        const bones = [
          [0,1],[1,2],[2,3],[3,4],
          [0,5],[5,6],[6,7],[7,8],
          [0,9],[9,10],[10,11],[11,12],
          [0,13],[13,14],[14,15],[15,16],
          [0,17],[17,18],[18,19],[19,20],
          [5,9],[9,13],[13,17]
        ];
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.8;
        for (const [a, b] of bones) {
          ctx.beginPath();
          ctx.moveTo((1 - lm[a].x) * cvs.width, lm[a].y * cvs.height);
          ctx.lineTo((1 - lm[b].x) * cvs.width, lm[b].y * cvs.height);
          ctx.stroke();
        }
        for (let i = 0; i < 21; i++) {
          ctx.fillStyle = (i === 4 || i === 8 || i === 12 || i === 16 || i === 20) ? '#fbbf24' : '#34d399';
          ctx.beginPath();
          ctx.arc((1 - lm[i].x) * cvs.width, lm[i].y * cvs.height, i % 4 === 0 ? 3.5 : 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        const cx = Math.max(55, Math.min(cvs.width - 55, hx || cvs.width / 2));
        const cy = Math.max(45, Math.min(cvs.height - 20, hy || cvs.height / 2 + 15));
        const palmX = cx;
        const palmY = cy + 18;

        const fingerTips = [
          { dx: -28, dy: -4 + Math.sin(tick) * 2 },   // Thumb
          { dx: -14, dy: -32 + Math.cos(tick) * 2 },  // Index
          { dx: 0,   dy: -36 + Math.sin(tick) * 2 },  // Middle
          { dx: 14,  dy: -31 + Math.cos(tick) * 2 },  // Ring
          { dx: 26,  dy: -20 + Math.sin(tick) * 2 }   // Pinky
        ];

        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.6;
        for (const f of fingerTips) {
          const midX = palmX + f.dx * 0.55;
          const midY = palmY + f.dy * 0.55;
          const tipX = palmX + f.dx;
          const tipY = palmY + f.dy;
          ctx.beginPath();
          ctx.moveTo(palmX, palmY);
          ctx.lineTo(midX, midY);
          ctx.lineTo(tipX, tipY);
          ctx.stroke();

          // Joints
          ctx.fillStyle = '#34d399';
          ctx.beginPath();
          ctx.arc(midX, midY, 2.5, 0, Math.PI * 2);
          ctx.arc(tipX, tipY, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Wrist/Palm center node
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(palmX, palmY, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(renderLoop);
    };
    requestAnimationFrame(renderLoop);
  },

  async executeHandGestureAction(gestureType) {
    const labelEl = document.getElementById('holo-detected-gesture-label');
    if (gestureType === 'PALM_SWIPE') {
      if (labelEl) labelEl.textContent = '✋ PALM_SWIPE -> 3D 지식 은하 360° 회전 실행!';
      if (window.BrainGraphEngine) {
        window.BrainGraphEngine.setViewMode('3d');
        window.BrainGraphEngine.rotY += 0.85;
      }
      const msg = '손바닥 스와이프 제스처를 인식하여 3D 지식 은하를 회전시켰습니다.';
      window.BSC_WORLDVIEW.showToast('✋ Gesture: PALM_SWIPE', msg);
      this.speakStewardReply(msg, 'jarvis');
    } else if (gestureType === 'PINCH_CLICK') {
      if (labelEl) labelEl.textContent = '🤏 PINCH_CLICK -> 가리킨 지식 노드 선택 & 상세 보고서 열기!';
      if (window.BrainGraphEngine) {
        const node = window.BrainGraphEngine.selectedNode || (window.BrainGraphEngine.nodes && window.BrainGraphEngine.nodes[0]);
        if (node) {
          window.BrainGraphEngine.selectNode(node, true);
        }
      }
      const msg = '핀치 클릭 제스처를 인식하여 포커스된 지식 노드의 홀로그램 상세 창을 열었습니다.';
      window.BSC_WORLDVIEW.showToast('🤏 Gesture: PINCH_CLICK', msg);
      this.speakStewardReply(msg, 'jarvis');
    } else if (gestureType === 'VICTORY_BRIEF') {
      if (labelEl) labelEl.textContent = '✌️ VICTORY_BRIEF -> 15초 전사 모닝/마감 브리핑 즉시 실행!';
      this.sendCommandToJarvis('자비스, 오늘 브리핑 해줘');
    } else if (gestureType === 'THUMBS_APPROVE') {
      if (labelEl) labelEl.textContent = '👍 THUMBS_APPROVE -> 대기 안건 즉시 승인 실행!';
      if (this.pendingPcActionKey) {
        this.executeApprovedPcAction(this.pendingPcActionKey);
      } else {
        try {
          const qRes = await fetch('/api/jarvis/action-queue');
          const qData = await qRes.json();
          const pending = (qData.queue || []).find(item => item.status === 'PENDING_APPROVAL');
          if (pending) {
            await fetch('/api/jarvis/action-queue', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ op: 'approve', id: pending.id })
            });
            const msg = `엄지 척 승인 제스처를 인식하여 대기열 1순위 작업 [${pending.title}]을 즉시 승인 및 실행했습니다.`;
            window.BSC_WORLDVIEW.showToast('👍 Gesture: THUMBS_APPROVE', msg);
            this.speakStewardReply(msg, 'jarvis');
          } else {
            const msg = '엄지 척 제스처를 인식했습니다. 현재 승인 대기 중인 보류 안건이 없어 전 시스템 정상 가동 상태를 유지합니다.';
            window.BSC_WORLDVIEW.showToast('👍 Gesture: THUMBS_APPROVE', msg);
            this.speakStewardReply(msg, 'jarvis');
          }
        } catch (e) {}
      }
    } else if (gestureType === 'FIST_RESET') {
      if (labelEl) labelEl.textContent = '✊ FIST_RESET -> 3D 은하 중앙 정렬(Fit) & 음성 정지!';
      this.stopAllSpeech();
      if (window.BrainGraphEngine && window.BrainGraphEngine.fitGraph) {
        window.BrainGraphEngine.fitGraph();
      }
      window.BSC_WORLDVIEW.showToast('✊ Gesture: FIST_RESET', '주먹 쥐기 제스처를 인식하여 음성을 멈추고 3D 지식 은하를 중앙 정렬(Fit)했습니다.');
    }
  },

  stopWebcamAndHolo() {
    const video = document.getElementById('webcam-video');
    const handCanvas = document.getElementById('holo-hand-canvas');
    const panel = document.getElementById('holo-gesture-hud-panel');
    if (this.webcamStream) {
      this.webcamStream.getTracks().forEach(t => t.stop());
      this.webcamStream = null;
    }
    if (video) video.style.display = 'none';
    if (handCanvas) handCanvas.style.display = 'none';
    if (panel) panel.style.display = 'none';
  },

  runOpticalHandTracker(video, handCanvas) {
    const ctx = handCanvas.getContext('2d');
    const off = document.createElement('canvas');
    off.width = 80;
    off.height = 60;
    const offCtx = off.getContext('2d');
    let prevFrame = null;

    const loop = () => {
      if (!this.sensors.EYES && !this.sensors.HOLO) return;
      offCtx.drawImage(video, 0, 0, off.width, off.height);
      const frame = offCtx.getImageData(0, 0, off.width, off.height).data;

      if (prevFrame) {
        let sumX = 0, sumY = 0, count = 0;
        for (let y = 0; y < off.height; y++) {
          for (let x = 0; x < off.width; x++) {
            const idx = (y * off.width + x) * 4;
            const diff = Math.abs(frame[idx] - prevFrame[idx]) + Math.abs(frame[idx + 1] - prevFrame[idx + 1]);
            if (diff > 55) {
              sumX += (off.width - 1 - x); // mirrored
              sumY += y;
              count++;
            }
          }
        }
        if (count > 18) {
          const tx = (sumX / count / off.width) * window.innerWidth;
          const ty = (sumY / count / off.height) * window.innerHeight;
          this.holoCursor.x += (tx - this.holoCursor.x) * 0.25;
          this.holoCursor.y += (ty - this.holoCursor.y) * 0.25;

          if (this.sensors.HOLO && window.BrainGraphEngine) {
            window.BrainGraphEngine.rotY += ((tx / window.innerWidth) - 0.5) * 0.03;
            const hit = window.BrainGraphEngine.findNodeAt(this.holoCursor.x, this.holoCursor.y);
            if (hit) window.BrainGraphEngine.selectNode(hit, false);
          }
        }
      }
      prevFrame = new Uint8ClampedArray(frame);

      // Draw HOLO reticle
      ctx.clearRect(0, 0, handCanvas.width, handCanvas.height);
      if (this.sensors.HOLO) {
        this.drawHoloReticle(ctx, this.holoCursor.x, this.holoCursor.y);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  },

  runMouseHoloOverlay(handCanvas) {
    const ctx = handCanvas.getContext('2d');
    const onMove = e => {
      this.holoCursor.x = e.clientX;
      this.holoCursor.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    const loop = () => {
      if (!this.sensors.HOLO && !this.sensors.EYES) {
        window.removeEventListener('mousemove', onMove);
        return;
      }
      ctx.clearRect(0, 0, handCanvas.width, handCanvas.height);
      this.drawHoloReticle(ctx, this.holoCursor.x, this.holoCursor.y);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  },

  drawHoloReticle(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = '700 10px monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText('HOLO AIR-TOUCH', 28, 4);
    ctx.restore();
  },

  bindUIControls() {
    // Chat prompt submit (Bottom Dock)
    const form = document.getElementById('jarvis-chat-form');
    const input = document.getElementById('jarvis-prompt-input');
    form?.addEventListener('submit', e => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      input.value = '';
      this.sendCommandToJarvis(val);
    });

    // Live Agent Chat Drawer Form & Controls
    const drawerForm = document.getElementById('drawer-chat-form');
    const drawerInput = document.getElementById('drawer-chat-input');
    drawerForm?.addEventListener('submit', e => {
      e.preventDefault();
      const val = drawerInput.value.trim();
      if (!val) return;
      drawerInput.value = '';
      this.sendCommandToJarvis(val);
    });

    document.getElementById('btn-toggle-agent-chat')?.addEventListener('click', () => {
      this.toggleChatDrawer();
    });
    document.getElementById('orb-chat-drawer')?.addEventListener('click', () => {
      this.toggleChatDrawer();
    });
    document.getElementById('btn-close-agent-chat')?.addEventListener('click', () => {
      this.toggleChatDrawer(false);
    });

    // Separate BeausCreators Agent Council Window (💬 의논 · 🏛️ 회의 · 📋 보고서)
    this.activeCouncilMode = 'DISCUSS';
    document.getElementById('btn-open-bsc-council')?.addEventListener('click', () => {
      this.toggleBscCouncilWindow();
    });
    document.getElementById('orb-bsc-council')?.addEventListener('click', () => {
      this.toggleBscCouncilWindow();
    });
    document.getElementById('btn-open-council-from-drawer')?.addEventListener('click', () => {
      window.JarvisDesignViews?.openWorkspace('AGENT_OFFICE_DASHBOARD');
    });
    document.getElementById('btn-close-bsc-council')?.addEventListener('click', () => {
      this.toggleBscCouncilWindow(false);
    });

    document.querySelectorAll('.bsc-council-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.bsc-council-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCouncilMode = btn.dataset.councilMode || 'MEETING';
        document.getElementById('bsc-council-input')?.focus();
      });
    });

    document.getElementById('bsc-council-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const cInput = document.getElementById('bsc-council-input');
      const val = cInput ? cInput.value.trim() : '';
      if (!val) return;
      cInput.value = '';
      this.submitBscCouncilTopic(val, this.activeCouncilMode || 'MEETING');
    });

    // Full System Review (검토) · Inspection (검수) · Verification (검증) & Harness² Self-Evolution
    document.getElementById('btn-run-full-verify')?.addEventListener('click', () => {
      this.runFullSystemVerificationUI();
    });
    document.getElementById('btn-council-verify-system')?.addEventListener('click', () => {
      this.runFullSystemVerificationUI();
    });

    // Toast Full-Read, Voice Actor Selector & Stop Voice Controls
    const voiceActorSelect = document.getElementById('jarvis-voice-actor-select');
    if (voiceActorSelect) {
      voiceActorSelect.value = this.selectedVoiceId || 'ko-KR-HyunsuMultilingualNeural';
      voiceActorSelect.addEventListener('change', () => {
        this.setNeuralVoice(voiceActorSelect.value, true);
      });
    }
    document.getElementById('btn-toast-cycle-voice')?.addEventListener('click', () => {
      const voices = ['ko-KR-HyunsuMultilingualNeural', 'ko-KR-SunHiNeural', 'ko-KR-InJoonNeural'];
      const curIdx = voices.indexOf(this.selectedVoiceId || 'ko-KR-HyunsuMultilingualNeural');
      const nextVoice = voices[(curIdx + 1) % voices.length];
      if (voiceActorSelect) voiceActorSelect.value = nextVoice;
      this.setNeuralVoice(nextVoice, true);
    });
    document.getElementById('btn-toast-read-full')?.addEventListener('click', () => {
      const txt = window.BSC_WORLDVIEW?.lastSpokenText || document.getElementById('toast-text')?.textContent || '';
      if (txt) {
        this.speakStewardReply(txt);
      }
    });
    document.getElementById('btn-toast-stop-voice')?.addEventListener('click', () => {
      this.stopAllSpeech();
    });

    // 1-Click Export Current Chat to 6 Formats (PNG/Video/MD/Word/PPT/PDF) & Sync to ADE/IDE/Google Drive
    document.getElementById('btn-export-chat-6formats')?.addEventListener('click', async () => {
      const btn = document.getElementById('btn-export-chat-6formats');
      if (btn) btn.textContent = '⏳ 6종 변환 중...';
      try {
        const res = await fetch('/api/jarvis/covision-export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: '현재 에이전트 대화록 및 ADE·IDE 동역 내역 6종 문서(MD·Word·PPT·PDF·PNG·영상) 아카이빙',
            sourceType: 'AGENT_CHAT_ARCHIVE'
          })
        });
        const d = await res.json();
        if (btn) btn.textContent = '✅ 6종 저장됨';
        setTimeout(() => { if (btn) btn.textContent = '📄 6종 문서화'; }, 2500);
        if (d && d.ok && d.session) {
          const f = d.session.files;
          const feed = document.getElementById('agent-chat-feed');
          if (feed) {
            const card = document.createElement('div');
            card.className = 'chat-bubble assistant';
            card.innerHTML = `
              <div class="bubble-meta"><span style="color:#34d399;">✅ 6종 문서 생성 및 ADE·IDE·Google Drive 동기화 완료</span></div>
              <div class="bubble-text" style="display:flex;flex-wrap:wrap;gap:5px;margin-top:4px;">
                <a href="${f.image}" download class="win-ctrl-btn" style="text-decoration:none;color:#00f0ff;">🖼️ PNG</a>
                <a href="${f.video}" target="_blank" class="win-ctrl-btn" style="text-decoration:none;color:#fb7185;">🎬 영상</a>
                <a href="${f.md}" download class="win-ctrl-btn" style="text-decoration:none;color:#34d399;">📝 MD</a>
                <a href="${f.docx}" download class="win-ctrl-btn" style="text-decoration:none;color:#60a5fa;">📘 Word</a>
                <a href="${f.pptx}" download class="win-ctrl-btn" style="text-decoration:none;color:#fbbf24;">📊 PPT</a>
                <a href="${f.pdf}" download class="win-ctrl-btn" style="text-decoration:none;color:#c084fc;">📕 PDF</a>
              </div>
            `;
            feed.appendChild(card);
            feed.scrollTop = feed.scrollHeight;
          }
        }
      } catch (e) {
        if (btn) btn.textContent = '📄 6종 문서화';
      }
    });

    // Responsive Side-Rail Drawer Toggles (PC / Tablet / Mobile)
    document.getElementById('btn-resp-left-rail')?.addEventListener('click', () => {
      document.getElementById('left-rail')?.classList.toggle('resp-open');
      document.getElementById('right-rail')?.classList.remove('resp-open');
    });
    document.getElementById('btn-resp-right-rail')?.addEventListener('click', () => {
      document.getElementById('right-rail')?.classList.toggle('resp-open');
      document.getElementById('left-rail')?.classList.remove('resp-open');
    });

    // Bottom Action Orbs (including AI Studio 17-Modules Hub)
    document.getElementById('orb-aistudio-hub')?.addEventListener('click', () => {
      if (window.HUDWindowSpawner && window.HUDWindowSpawner.openAIStudioWindowByType) {
        window.HUDWindowSpawner.openAIStudioWindowByType('AI_STUDIO_HUB');
      } else {
        this.sendCommandToJarvis('AI Studio 스튜디오 허브 열어줘');
      }
    });
    document.querySelectorAll('[data-ais-win]').forEach(btn => {
      btn.addEventListener('click', () => {
        const winType = btn.dataset.aisWin;
        if (window.HUDWindowSpawner && window.HUDWindowSpawner.openAIStudioWindowByType) {
          window.HUDWindowSpawner.openAIStudioWindowByType(winType);
        }
      });
    });
    document.getElementById('orb-manual')?.addEventListener('click', () => {
      this.sendCommandToJarvis('설명서 창 띄워줘');
    });
    document.getElementById('orb-report')?.addEventListener('click', () => {
      this.sendCommandToJarvis('112개 오픈소스 딥리서치 보고서 보여줘');
    });
    document.getElementById('orb-console')?.addEventListener('click', () => {
      this.sendCommandToJarvis('실시간 제작 콘솔 및 토큰 흐름 창 열어줘');
    });
    document.getElementById('orb-studio')?.addEventListener('click', () => {
      this.sendCommandToJarvis('생성 스튜디오 3D 홀로그램 창 열어줘');
    });
    document.getElementById('orb-pc-ctrl')?.addEventListener('click', () => {
      this.sendCommandToJarvis('컴퓨터 제어로 마스터 설계서 PDF 열어줘');
    });
    document.getElementById('orb-voice-mic')?.addEventListener('click', () => {
      this.toggleVoiceListening();
    });

    // 4 Right-Rail Sensor Switches (EYES / WATCH / HOLO / FOCUS)
    ['eyes', 'watch', 'holo', 'focus'].forEach(id => {
      const btn = document.getElementById(`toggle-${id}`);
      btn?.addEventListener('click', () => {
        this.toggleSensor(btn.dataset.sensor, btn);
      });
    });

    // Top Bar: 15-Second Executive Briefing & HOLO Hand Gesture Control HUD
    document.getElementById('btn-exec-briefing')?.addEventListener('click', () => {
      this.sendCommandToJarvis('자비스, 오늘 브리핑 해줘');
    });
    document.getElementById('btn-holo-gesture-hud')?.addEventListener('click', () => {
      this.openHoloGesturePanel();
    });
    document.getElementById('btn-rescan-camera')?.addEventListener('click', () => {
      const sel = document.getElementById('holo-camera-select');
      this.sensors.HOLO = true;
      this.startWebcamAndHolo('HOLO', sel ? sel.value : '');
    });
    document.getElementById('holo-camera-select')?.addEventListener('change', e => {
      this.sensors.HOLO = true;
      this.startWebcamAndHolo('HOLO', e.target.value || '');
    });
    document.getElementById('btn-close-holo-panel')?.addEventListener('click', () => {
      const panel = document.getElementById('holo-gesture-hud-panel');
      if (panel) panel.style.display = 'none';
    });
    document.querySelectorAll('.holo-gesture-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        this.executeHandGestureAction(btn.dataset.gesture);
      });
    });

    // PC Approval Modal Buttons
    document.getElementById('btn-approve-pc')?.addEventListener('click', () => {
      if (this.pendingPcActionKey) {
        this.executeApprovedPcAction(this.pendingPcActionKey);
      }
    });
    document.getElementById('btn-deny-pc')?.addEventListener('click', () => {
      document.getElementById('pc-approval-modal').style.display = 'none';
      this.pendingPcActionKey = null;
      window.BSC_WORLDVIEW.showToast('J.A.R.V.I.S.', '이건우 대표님, 컴퓨터 제어 요청을 취소했습니다.');
    });

    // 🎙️ SasariSa (사사리사) Windows 11 Floating Voice Pill & 4-Way Multi-LLM Switcher
    this.initSasarisaVoicePill();
  },

  toggleSasarisaVoicePill(forceOpen) {
    const pill = document.getElementById('sasarisa-voice-pill');
    if (!pill) return;
    const isHidden = pill.style.display === 'none' || !pill.style.display;
    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : isHidden;
    pill.style.display = shouldOpen ? 'block' : 'none';
    if (shouldOpen) {
      document.getElementById('sasarisa-pill-input')?.focus();
    }
  },

  initSasarisaVoicePill() {
    const pill = document.getElementById('sasarisa-voice-pill');
    if (!pill) return;

    // Load initial Multi-LLM Hub status to sync pill badge & selector
    fetch('/api/jarvis/llm-hub/status')
      .then(r => r.json())
      .then(res => {
        if (res && res.ok && res.state) {
          const prov = res.state.activeProvider || 'ollama';
          const mod = res.state.activeModel || 'gemma4:e4b';
          const isOAuth = prov === 'gemini' && (res.state.geminiAuthMode || 'oauth') === 'oauth';
          const badge = document.getElementById('sasarisa-pill-llm-badge');
          if (badge) badge.textContent = `${prov.toUpperCase()} · ${mod}${isOAuth ? ' (OAuth $0)' : ''}`;
          const sel = document.getElementById('sasarisa-pill-provider-select');
          if (sel) sel.value = prov;
        }
      })
      .catch(() => {});

    document.getElementById('btn-top-sasarisa-pill')?.addEventListener('click', () => {
      this.toggleSasarisaVoicePill();
    });
    document.getElementById('btn-sasarisa-pill-close')?.addEventListener('click', () => {
      this.toggleSasarisaVoicePill(false);
    });
    document.getElementById('btn-sasarisa-open-hub')?.addEventListener('click', () => {
      window.JarvisDesignViews?.openWorkspace?.('AI_BRAIN_DASHBOARD');
    });
    document.getElementById('btn-sasarisa-pill-mic')?.addEventListener('click', () => {
      this.toggleVoiceListening(true);
    });
    document.getElementById('btn-sasarisa-always-listen')?.addEventListener('click', () => {
      this.toggleVoiceListening(true);
    });

    // 🔐 Google AI Ultra OAuth Login Button ($0 Extra Fee · Gemini 4 Argon)
    document.getElementById('btn-sasarisa-oauth-login')?.addEventListener('click', async () => {
      const statusBox = document.getElementById('sasarisa-pill-status-box');
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.innerHTML = `<span style="color:#38bdf8;">🔐 Google AI Ultra OAuth($0) 및 Google CLI 연결 상태를 확인하는 중입니다...</span>`;
      }
      const res = await fetch('/api/jarvis/llm-hub/oauth-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gemini-4-argon', launchBrowserLogin: false })
      }).then(r => r.json()).catch(() => null);
      if (res && res.ok) {
        const badge = document.getElementById('sasarisa-pill-llm-badge');
        if (badge) badge.textContent = `GEMINI · gemini-4-argon (OAuth $0)`;
        const sel = document.getElementById('sasarisa-pill-provider-select');
        if (sel) sel.value = 'gemini';
        this.updateSttBanner(res.message, 'OAuth $0', '#34d399');
        if (statusBox) {
          const acc = res.oauthStatus?.activeAccount || 'Google AI Ultra 계정';
          statusBox.style.display = 'block';
          statusBox.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
              <div>
                <div style="color:#34d399;font-weight:800;margin-bottom:2px;">✅ Google Gemini CLI × OAuth 로그인 모드 활성 (추가 API 과금 $0)</div>
                <div style="font-size:11px;color:#cbd5e1;">계정: <b>${this.escapeHtml(acc)}</b> · 모델: <b>gemini-4-argon</b> · 인증 파일: <code>~/.gemini/oauth_creds.json</code></div>
              </div>
              <div style="display:flex;gap:6px;">
                <button type="button" id="btn-launch-google-oauth-win" class="win-ctrl-btn" style="border-color:#38bdf8;color:#38bdf8;font-weight:800;">🌐 Google OAuth 재로그인 창 열기</button>
                <button type="button" id="btn-test-argon-now" class="win-ctrl-btn" style="border-color:#34d399;color:#34d399;font-weight:800;">🧪 Argon 응답 테스트</button>
              </div>
            </div>
          `;
          statusBox.querySelector('#btn-launch-google-oauth-win')?.addEventListener('click', async () => {
            await fetch('/api/jarvis/llm-hub/oauth-login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ model: 'gemini-4-argon', launchBrowserLogin: true })
            });
          });
          statusBox.querySelector('#btn-test-argon-now')?.addEventListener('click', () => {
            const inp = document.getElementById('sasarisa-pill-input');
            if (inp) inp.value = '구글 CLI OAuth 로그인 모드로 Gemini 4 Argon 연결 상태 확인해줘';
            document.getElementById('sasarisa-pill-form')?.dispatchEvent(new Event('submit'));
          });
        }
        this.speakStewardReply(res.message, 'jarvis');
      }
    });

    // 👁️ Zero-UI Minimal Voice Mode Toggle (한국 유튜버 사사리사 스타일 음성 중심 미니멀 뷰)
    document.getElementById('btn-sasarisa-zero-ui')?.addEventListener('click', (e) => {
      const isMinimal = document.body.classList.toggle('zero-ui-voice-mode');
      e.currentTarget.textContent = isMinimal ? '👁️ 기본 UI 복원' : '👁️ 미니멀 UI';
      const msg = isMinimal
        ? '이건우 대표님, 주변 UI를 모두 숨기고 BSC_자비스 음성 중심 미니멀 모드로 전환했습니다.'
        : '이건우 대표님, 상단 및 좌측 실무 대시보드 메뉴를 다시 표시했습니다.';
      this.speakStewardReply(msg, 'jarvis');
    });

    // Global Hotkey: Alt+Space or Ctrl+Shift+S to summon SasariSa Floating Voice Pill
    window.addEventListener('keydown', e => {
      if ((e.altKey && e.code === 'Space') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's')) {
        e.preventDefault();
        this.toggleSasarisaVoicePill();
      }
    });

    // Provider Switcher inside Pill
    document.getElementById('sasarisa-pill-provider-select')?.addEventListener('change', async e => {
      const provider = e.target.value;
      const defaultModels = {
        ollama: 'gemma4:e4b',
        lmstudio: 'local-model',
        gemini: 'gemini-4-argon',
        openai: 'gpt-4o'
      };
      const model = defaultModels[provider] || 'gemma4:e4b';
      const res = await fetch('/api/jarvis/llm-hub/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeProvider: provider, activeModel: model, geminiAuthMode: 'oauth' })
      }).then(r => r.json()).catch(() => null);
      if (res && res.ok) {
        const badge = document.getElementById('sasarisa-pill-llm-badge');
        if (badge) badge.textContent = `${provider.toUpperCase()} · ${res.state?.activeModel || model}${provider === 'gemini' ? ' (OAuth $0)' : ''}`;
        const mainPill = document.getElementById('active-model-pill');
        if (mainPill) mainPill.textContent = `${provider.toUpperCase()}:${res.state?.activeModel || model}`;
        this.speakStewardReply(res.message, 'jarvis');
      }
    });

    const runPillCommand = async (cmdText) => {
      const statusBox = document.getElementById('sasarisa-pill-status-box');
      const selProv = document.getElementById('sasarisa-pill-provider-select')?.value || '';
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.innerHTML = `<span style="color:#38bdf8;">⏳ BSC_자비스 음성 엔진 실행 중: "${this.escapeHtml(cmdText)}"...</span>`;
      }
      const res = await fetch('/api/jarvis/sasarisa/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmdText, provider: selProv || undefined })
      }).then(r => r.json()).catch(() => null);

      if (!res || !res.ok) {
        if (statusBox) statusBox.innerHTML = `<span style="color:#f87171;">⚠️ 명령 처리 중 오류가 발생했습니다.</span>`;
        return;
      }

      if (res.reply) {
        this.speakStewardReply(res.reply, 'jarvis');
      }

      // Trigger UI actions if the voice skill requested opening a Neuron Studio or BSC Dashboard!
      const rec = res.actionRecord || {};
      if (rec.uiAction === 'OPEN_NEURON_STUDIO' && window.NeuronContentStudio) {
        window.NeuronContentStudio.openNeuronModal(rec.neuronKeyword || 'J.A.R.V.I.S. 코어');
      } else if (rec.uiAction === 'OPEN_DASHBOARD' && window.JarvisDesignViews && rec.targetDashboard) {
        window.JarvisDesignViews.openWorkspace(rec.targetDashboard);
      }

      if (res.requiresConfirmation && res.confirmItem && statusBox) {
        const ci = res.confirmItem;
        statusBox.innerHTML = `
          <div style="border-left:3px solid #fbbf24;padding-left:8px;">
            <div style="font-weight:800;color:#fbbf24;margin-bottom:3px;">🛡️ [BSC_자비스 2중 안전장치] ${this.escapeHtml(ci.intent?.skillTitleKo || '')}</div>
            <div style="font-size:10.5px;color:#fde68a;margin-bottom:4px;">${this.escapeHtml(ci.intent?.riskReasonKo || '')}</div>
            <div style="background:#050b16;padding:6px 8px;border-radius:6px;margin-bottom:6px;color:#f8fafc;">${this.escapeHtml(ci.draftContent || '')}</div>
            <div style="display:flex;gap:6px;">
              <button type="button" class="win-ctrl-btn btn-pill-confirm" data-id="${this.escapeHtml(ci.confirmId)}" data-dec="APPROVE" style="border-color:#34d399;color:#34d399;font-weight:800;">✅ 승인 및 실행</button>
              <button type="button" class="win-ctrl-btn btn-pill-confirm" data-id="${this.escapeHtml(ci.confirmId)}" data-dec="CANCEL" style="border-color:#f87171;color:#f87171;">✕ 취소</button>
            </div>
          </div>
        `;
        statusBox.querySelectorAll('.btn-pill-confirm').forEach(b => {
          b.addEventListener('click', async () => {
            const cRes = await fetch('/api/jarvis/sasarisa/confirm', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ confirmId: b.dataset.id, decision: b.dataset.dec })
            }).then(r => r.json()).catch(() => null);
            if (cRes && statusBox) {
              statusBox.innerHTML = `<span style="color:#34d399;font-weight:700;">✅ ${this.escapeHtml(cRes.message || cRes.reply || '처리 완료')}</span>`;
              if (cRes.message || cRes.reply) this.speakStewardReply(cRes.message || cRes.reply, 'jarvis');
            }
          });
        });
      } else if (statusBox) {
        statusBox.innerHTML = `
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
              <strong style="color:#34d399;">${this.escapeHtml(rec.icon || '✅')} ${this.escapeHtml(rec.skillTitleKo || '실행 완료')}</strong>
              <span style="font-size:10px;color:#38bdf8;">${this.escapeHtml(rec.llmUsed || '')} (${res.elapsedMs || 0}ms)</span>
            </div>
            <div style="color:#e2e8f0;">${this.escapeHtml(res.reply || '')}</div>
            ${rec.cliOutput ? `<pre style="margin:5px 0 0 0;padding:6px;background:#020617;border:1px solid rgba(56,189,248,0.25);border-radius:6px;font-size:11px;color:#38bdf8;white-space:pre-wrap;">${this.escapeHtml(rec.cliOutput)}</pre>` : ''}
            ${rec.targetUrl ? `<div style="margin-top:4px;"><a href="${this.escapeHtml(rec.targetUrl)}" target="_blank" style="color:#00f0ff;font-size:11px;font-weight:700;">🔗 생성된 링크 바로 열기 (${this.escapeHtml(rec.targetUrl.slice(0, 55))}...)</a></div>` : ''}
          </div>
        `;
      }
    };

    this.runSasarisaPillCommand = runPillCommand;

    document.getElementById('sasarisa-pill-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const inp = document.getElementById('sasarisa-pill-input');
      const val = inp?.value?.trim();
      if (val) {
        inp.value = '';
        runPillCommand(val);
      }
    });

    pill.querySelectorAll('.btn-sasarisa-pill-chip').forEach(btn => {
      btn.addEventListener('click', () => runPillCommand(btn.dataset.cmd));
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.MultimodalEngine.init();
});
