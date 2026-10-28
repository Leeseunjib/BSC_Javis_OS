/**
 * ◉ 사사리사 (SasariSa) × BSC J.A.R.V.I.S. — Main Voice-First OS Interface
 * Path: c:\BSC_Javis_OS\public\js\sasarisa-main-os-ui.js
 *
 * Clean-Room Reconstructed 1:1 from `mvcompany8500-web/sasarisa` (YouTube: muY9-sCxZlg & sasarisa.com):
 *   1. `HUD.swift` + `docs/tutorial.css`:
 *      - Authentic SasariSa HUD Card (`.sasarisa-hud-card`) with 3-Ring Spinning Dashed Orb (`.sasarisa-orb`)
 *      - 3 Dynamic Tone States: Cyan (`#4dd9ff` · `● 듣는 중`), Amber (`#ffb840` · `◌ 처리 중`), Lime (`#73ff99` · `✓ 완료`)
 *      - 5 Live HUD Positions (`bottomCenter`, `center`, `bottomRight`, `bottomLeft`, `top`)
 *      - Right-Alt (`⌥`) Push-to-Talk (Hold to talk & release to run) + Tap to Wake (30s follow-up window without repeating wake word)
 *      - Inline Safety Pill (`pillui`: 「보내기/실행」을 누를까요? [응] [아니])
 *   2. `BootScene.swift`:
 *      - Authentic "아빠 왔어 / 대표님 오셨습니다" Wake-Up Arc Reactor Scene + Conic Radar + 120 Ticks + Typewriter Boot Log + 110px Clock + WebAudio Rising Sweep Chime (`synthChime`) that flies into the HUD Orb!
 *   3. `SetupWindow.swift`:
 *      - Authentic "사사리사 준비" Checklist Window (호칭·비서이름·화면위치·목소리로 이름 맞추기 12회 훈련·마이크/음성인식/손쉬운사용/화면기록 초록 체크·두뇌 및 목소리 미리듣기)
 *   4. `SettingsWindow.swift`:
 *      - Authentic "사사리사 — 설정" Window (기본 / 키우기 / 마이크·스피커 / 목소리 / AI 사용량 7일 차트 / 두뇌 EngineMenu: Google CLI Gemini 4 Argon OAuth $0, Claude Code, Codex, Ollama, LM Studio, 조합 Combo)
 *   5. 100% Preservation & Application of BSC J.A.R.V.I.S. Technologies:
 *      - Obsidian × Notion 3D/2D Neuron Galaxy right on the main canvas (1-click opens Neuron Content Studio)
 *      - Voice & 1-click access to all 18 AI Studios, ArtCraft 13 apps, 28-Agent Council War Room, Folder/MD Analyzer, IDE 2.0, CLI & MCP
 */

(function () {
  const STORAGE_KEY = 'bsc_sasarisa_config_v1';

  const DEFAULT_CONFIG = {
    language: 'ko',
    assistantName: 'BSC_자비스',
    userName: '이건우 대표님',
    wakeWords: 'BSC_자비스, 자비스, 사사리사, 헤이 자비스',
    greetingText: '어서 오십시오, {user}.',
    bootStyle: 'reactor', // 'reactor' (화려하게) | 'calm' (깔끔하게) | 'card' (카드로만)
    activation: 'voice',  // 'voice' (부르는 말 + 단축키) | 'hold' (단축키만)
    hotkey: 'rightAlt',   // 오른쪽 Alt (⌥)
    hudPosition: 'bottomCenter', // 'center' | 'bottomCenter' | 'bottomRight' | 'bottomLeft' | 'top'
    confirmDelegate: 'never', // 'never' (바로 실행, 되돌릴 수 없는 일만 묻기) | 'brain' | 'always'
    freeMode: false,
    previewBeforeSend: true,
    polishDictation: true,
    growTogether: 'together',
    brainProvider: 'gemini-cli-oauth', // 'gemini-cli-oauth' | 'claude-code' | 'codex' | 'combo' | 'ollama' | 'lmstudio' | 'openai'
    brainModel: 'gemini-4-argon',
    ttsEngine: 'edge-neural-hd',
    sayVoice: 'ko-KR-HyunsuMultilingualNeural',
    themeBackdrop: 'galaxy-dark', // 'galaxy-dark' (뉴런 은하 다크) | 'sasarisa-sky' (사사리사 스카이 라이트)
    learnedCommands: [
      { phrase: '작업 시작', action: '제미나이 4 아르곤 OAuth 깨우기 + 뉴런홈 정렬 + 로파이 음악 준비', hits: 5 },
      { phrase: '프로젝트 점검', action: '터미널 git status 및 25개 시스템 게이트 실시간 스캔', hits: 8 },
      { phrase: '뉴런 분석', action: '옵시디언 × 노션 뉴런 콘텐츠 스튜디오 즉시 오픈', hits: 6 }
    ],
    dailyUsage: [
      { day: '월', calls: 14, tokens: 12400 },
      { day: '화', calls: 22, tokens: 19800 },
      { day: '수', calls: 19, tokens: 16200 },
      { day: '목', calls: 31, tokens: 28400 },
      { day: '금', calls: 27, tokens: 24100 },
      { day: '토', calls: 18, tokens: 15000 },
      { day: '일', calls: 25, tokens: 21500 }
    ]
  };

  const SasariSaMainOS = {
    cfg: { ...DEFAULT_CONFIG },
    hudState: 'idle', // 'idle' | 'listening' | 'working' | 'done'
    followUpUntil: 0,
    pttHolding: false,
    nameTrainStep: 0,
    nameTrainActive: false,

    init() {
      this.loadConfig();
      document.body.classList.add('sasarisa-authentic-os');
      this.applyThemeBackdrop();
      this.renderMainShell();
      this.applyHudPosition(this.cfg.hudPosition);
      this.bindEvents();
      this.syncBrainStatusFromServer();
      this.refreshMonitorWorkspaceContext(true);

      // Periodic monitor context refresh so BSC_자비스 always knows the live monitor workspace
      this.monitorPollTimer = setInterval(() => {
        if (!document.hidden) {
          this.refreshMonitorWorkspaceContext(false);
        }
      }, 10000);

      // Default Main Screen = Design 06 Barehands Full-Screen AR Camera Stage (unless ?view=neuron is specified)
      const startInNeuron = location.search.includes('view=neuron');
      this.toggleMainArStage(!startInNeuron);

      // Initial authentic greeting on the SasariSa HUD card
      setTimeout(() => {
        this.setHudCard(
          'lime',
          `● ${this.cfg.assistantName} 준비 완료 · 풀스크린 AR 카메라 공간 제어 ON`,
          `「${this.cfg.assistantName}」라고 부르거나 눈동자(👁️)·맨손(☝️)으로 오브를 제어하세요`,
          `${this.cfg.userName}, 풀스크린 AR 카메라 스테이지가 메인으로 활성화되었습니다. 하단 [◉ BSC_자비스 펼치기] 또는 우측 Alt(⌥)로 음성 명령을 내리실 수 있습니다.`
        );
      }, 300);
    },

    toggleMainArStage(forceShow) {
      const arFrame = document.getElementById('barehands-ar-main-stage');
      const toggleBtn = document.getElementById('btn-stm-toggle-ar-stage');
      const arDockBtn = document.getElementById('btn-dock-ar-stage');
      const hud = document.getElementById('sasarisa-authentic-hud');
      const pill = document.getElementById('sasarisa-minimized-pill');
      if (!arFrame) return;

      const isVisible = arFrame.style.display !== 'none';
      const show = typeof forceShow === 'boolean' ? forceShow : !isVisible;
      arFrame.style.display = show ? 'block' : 'none';

      if (toggleBtn) {
        toggleBtn.innerHTML = show
          ? '🖐️ AR 카메라 스테이지 (메인 ON) ⇄ 🌌 3D 뉴런은하'
          : '🌌 3D 뉴런은하 (ON) ⇄ 🖐️ AR 카메라 스테이지 켜기';
        toggleBtn.style.background = show ? 'rgba(0,240,255,0.22)' : 'rgba(15,23,42,0.85)';
        toggleBtn.style.borderColor = show ? '#00f0ff' : 'rgba(52,211,153,0.6)';
      }

      if (show) {
        document.querySelectorAll('#slim-left-dock .slim-dock-btn').forEach(b => b.classList.remove('active'));
        arDockBtn?.classList.add('active');
        // Minimize the bottom HUD card into the compact pill so the Fullscreen AR Camera is 100% unobstructed!
        if (hud) hud.style.display = 'none';
        if (pill) pill.style.display = 'inline-flex';
      } else {
        arDockBtn?.classList.remove('active');
        if (hud) hud.style.display = 'block';
        if (pill) pill.style.display = 'none';
      }
    },

    loadConfig() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // Force-migrate any cached "사사리사" to "BSC_자비스" as requested by CEO
          if (!parsed.assistantName || parsed.assistantName === '사사리사' || parsed.assistantName.includes('사사리사')) {
            parsed.assistantName = 'BSC_자비스';
          }
          if (!parsed.wakeWords || parsed.wakeWords.startsWith('사사리사')) {
            parsed.wakeWords = 'BSC_자비스, 자비스, 사사리사, 헤이 자비스';
          }
          this.cfg = { ...DEFAULT_CONFIG, ...parsed };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cfg));
        }
      } catch (_) {}
    },

    saveConfig(partial = {}) {
      this.cfg = { ...this.cfg, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cfg));
      } catch (_) {}
      this.applyThemeBackdrop();
      this.applyHudPosition(this.cfg.hudPosition);
      this.updateTopBarLabels();
    },

    escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    },

    applyThemeBackdrop() {
      document.body.classList.toggle('sasarisa-sky-mode', this.cfg.themeBackdrop === 'sasarisa-sky');
      if (window.BrainGraphEngine) {
        window.BrainGraphEngine.neuronPaletteMode =
          this.cfg.themeBackdrop === 'sasarisa-sky' ? 'light-monotone' : 'warm-graphite';
      }
    },

    /**
     * Ported 1:1 from `BootScene.swift` lines 33-49:
     * Rising frequency sweep (90Hz -> 610Hz over 1.4s) + two bright harmonic pings (1318.5Hz E6, 1975.5Hz B6)
     */
    playSynthChime(shortWake = false) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        if (shortWake) {
          // Crisp SasariSa wake chime ("띵")
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.14);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.36);
          return;
        }

        // Full BootScene.synthChime() (2.4s rising sweep + two pings)
        const sweepOsc = ctx.createOscillator();
        const sweepGain = ctx.createGain();
        sweepOsc.type = 'sine';
        sweepOsc.frequency.setValueAtTime(90, now);
        sweepOsc.frequency.exponentialRampToValueAtTime(610, now + 1.4);
        sweepGain.gain.setValueAtTime(0.01, now);
        sweepGain.gain.linearRampToValueAtTime(0.16, now + 1.1);
        sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        sweepOsc.connect(sweepGain);
        sweepGain.connect(ctx.destination);
        sweepOsc.start(now);
        sweepOsc.stop(now + 1.85);

        [[1.45, 1318.5], [1.7, 1975.5]].forEach(([delay, freq]) => {
          const pOsc = ctx.createOscillator();
          const pGain = ctx.createGain();
          pOsc.type = 'triangle';
          pOsc.frequency.setValueAtTime(freq, now + delay);
          pGain.gain.setValueAtTime(0.16, now + delay);
          pGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.55);
          pOsc.connect(pGain);
          pGain.connect(ctx.destination);
          pOsc.start(now + delay);
          pOsc.stop(now + delay + 0.6);
        });
      } catch (_) {}
    },

    renderMainShell() {
      // Remove any prior instance
      document.getElementById('sasarisa-os-root')?.remove();

      const root = document.createElement('div');
      root.id = 'sasarisa-os-root';
      root.innerHTML = `
        <!-- 1. Authentic SasariSa Top Menu Bar (sasarisa.com + macOS ◉J MenuBarExtra) -->
        <header id="sasarisa-top-menubar">
          <div class="stm-left">
            <button type="button" id="btn-stm-brand" class="stm-logo-btn" title="BSC_자비스 홈 · 클릭 시 깨어나는 인사">
              <svg viewBox="0 0 64 64" width="26" height="26" aria-hidden="true">
                <circle cx="32" cy="32" r="27" fill="none" stroke="#34d399" stroke-width="3.5" stroke-dasharray="7 4"/>
                <circle cx="32" cy="32" r="11.5" fill="#10b981"/>
              </svg>
              <span class="stm-brand-title" id="stm-assistant-name">${this.escapeHtml(this.cfg.assistantName)}</span>
              <span class="stm-version-tag">Win11 · v0.7.2</span>
            </button>

            <div class="stm-status-strip">
              <span class="stm-pill green" id="stm-ear-status-pill" title="상시 음성 대기 및 우측 Alt(⌥) 푸시투토크">
                <i class="stm-dot"></i> 귀 열림 · 부르는 말 「${this.escapeHtml(this.cfg.assistantName)}」 / <kbd>우측 ⌥</kbd>
              </span>
              <span class="stm-pill blue" id="stm-brain-status-pill" title="현재 연결된 생각하는 AI 두뇌">
                🧠 두뇌: Gemini 4 Argon (Google CLI · OAuth $0)
              </span>
            </div>
          </div>

          <!-- Center Quick Search & Direct Neuron Jump -->
          <div class="stm-center">
            <div class="stm-search-box">
              <span>🔍</span>
              <input type="text" id="stm-neuron-search" placeholder="뉴런(점) 검색 후 Enter 치면 옵시디언×노션 창이 바로 열립니다..." autocomplete="off" />
            </div>
          </div>

          <!-- Right Authentic Controls (AR Stage Toggle / Eye+Hand Cursor / Close All UI / Monitor App / Co-Work / Settings / BSC Tech Drawer) -->
          <div class="stm-right">
            <button type="button" id="btn-stm-toggle-ar-stage" class="stm-action-btn emerald" style="border-color:#00f0ff;background:rgba(0,240,255,0.22);color:#ecfeff;font-weight:800;" title="시안 06 Barehands 풀스크린 AR 카메라 공간 제어 스테이지 ⇄ 3D 지식 뉴런 은하 전환">
              🖐️ AR 카메라 스테이지 (메인 ON) ⇄ 🌌 3D 뉴런은하
            </button>
            <button type="button" id="btn-stm-eye-hand-cursor" class="stm-action-btn emerald" title="웹캠 기반 눈동자(시선) 마우스 커서 + 손가락·손동작 듀얼 제어 시스템 켜기/끄기">
              👁️☝️ 눈동자·손동작 커서
            </button>
            <button type="button" id="btn-stm-close-all-ui" class="stm-action-btn" style="border-color:rgba(248,113,113,0.65);color:#fecdd3;background:rgba(127,29,29,0.35);" title="현재 열려 있는 모든 팝업·창·토스트·서브 패널을 한 번에 닫습니다 (단축키: ESC / 손동작: 주먹 ✊)">
              🧹 모든 창 닫기 (ESC)
            </button>
            <button type="button" id="btn-stm-monitor-app" class="stm-action-btn cyan" title="브라우저 주소창(http://localhost:7777) 없이 모니터 전용 네이티브 앱 창 및 전체화면으로 전환">
              🖥️ 모니터 전용창
            </button>
            <button type="button" id="btn-stm-cowork-dock-toggle" class="stm-action-btn" title="키보드·마우스 없이 음성·카메라·모니터 작업환경을 함께 보며 협업하는 핸즈프리 독 열기/닫기">
              👁️🎙️ 모니터·카메라 독
            </button>
            <button type="button" id="btn-stm-settings-win" class="stm-action-btn" title="SettingsWindow.swift — BSC_자비스 설정 (호칭·두뇌·목소리·화면위치·사용량)">
              ⚙️ 설정
            </button>
            <button type="button" id="btn-stm-neuron-studio" class="stm-action-btn cyan" title="현재 선택된 뉴런의 옵시디언×노션 콘텐츠 및 응용 스튜디오 열기">
              🕸️ 뉴런 스튜디오
            </button>
            <button type="button" id="btn-stm-bsc-drawer" class="stm-action-btn gold" title="기존에 만든 모든 자비스 기술 (18대 스튜디오·ArtCraft 13종·28인 회의실·폴더분석·IDE) 열기">
              🧰 전체 기술 ▾
            </button>
          </div>
        </header>

        <!-- 2. SasariSa Left Floating Quick-Guide & Neuron Counter Pill (Default Hidden for Clean Screen!) -->
        <aside id="sasarisa-mini-guide-card" style="display:none;">
          <div class="smg-head">
            <span>◉ <b>말로 시키는 BSC_자비스</b> + <b>모니터·카메라 협업</b></span>
            <div style="display:flex;gap:4px;">
              <button type="button" id="btn-smg-collapse" title="안내 카드 접기/펼치기">−</button>
              <button type="button" id="btn-smg-close" title="안내 카드 닫기" onclick="document.getElementById('sasarisa-mini-guide-card').style.display='none'">✕</button>
            </div>
          </div>
          <div id="smg-body-content">
            <div class="smg-tip-row">
              <span class="smg-badge green">핸즈프리</span>
              <span><b>키보드·마우스 없이</b> 음성 + 카메라 + 모니터 환경 동시 인식</span>
            </div>
            <div class="smg-tip-row">
              <span class="smg-badge purple">입코딩 $0</span>
              <span><b>Gemini 4 Argon (Google CLI)</b> · Ollama · Claude 연동</span>
            </div>
            <div class="smg-tip-row">
              <span class="smg-badge cyan">뉴런 1클릭</span>
              <span>배경의 <b>뉴런(점·글자)</b>을 클릭하면 <b>내용 확인 &amp; 노션·옵시디언 응용 창</b>이 즉시 열립니다.</span>
            </div>
            <div class="smg-Quick-grid">
              <button type="button" class="smg-scene-btn" data-voice-cmd="지금 모니터 작업환경이랑 열린 창들 파악해서 같이 작업하자">🖥️ 모니터 작업 파악</button>
              <button type="button" class="smg-scene-btn" data-voice-cmd="카메라 켜고 지금 보이는 거랑 모니터 같이 보면서 음성으로 진행하자">👁️ 카메라·음성 협업</button>
              <button type="button" class="smg-scene-btn" data-voice-cmd="브라우저 주소창 없는 모니터 전용 앱 창으로 띄워줘">🗔 주소창 없는 전용창</button>
              <button type="button" class="smg-scene-btn" data-voice-cmd="BSC_자비스, 유튜브에서 집중 로파이 음악 틀어줘">▶ 유튜브 로파이</button>
              <button type="button" class="smg-scene-btn" data-voice-cmd="두 번째 거 틀어">🔢 두 번째 영상</button>
              <button type="button" class="smg-scene-btn" data-voice-cmd="구글 CLI OAuth 로그인 모드로 Gemini 4 Argon 연결 상태 확인해줘">🧠 Gemini 4 Argon</button>
              <button type="button" class="smg-scene-btn" data-voice-cmd="카카오톡으로 박 대리에게 자료 검토 완료했다고 보내줘">💬 카톡(안전장치)</button>
              <button type="button" class="smg-scene-btn" data-voice-cmd="창 다 꺼">🧹 창 다 꺼</button>
            </div>
          </div>
        </aside>

        <!-- 2-B. Hands-Free Monitor Workspace + Camera Co-Work HUD Dock (Default Hidden for Clean Screen!) -->
        <aside id="sasarisa-handsfree-cowork-dock" style="display:none;">
          <div class="shcd-head">
            <div>
              <span class="shcd-live-dot"></span>
              <b>🖥️👁️🎙️ 모니터 작업환경 · 카메라 핸즈프리 협업</b>
            </div>
            <div style="display:flex;gap:4px;">
              <button type="button" id="btn-shcd-refresh" class="shcd-mini-btn" title="지금 모니터 화면과 열린 창 즉시 재스캔">↻ 스캔</button>
              <button type="button" id="btn-shcd-collapse" class="shcd-mini-btn" title="협업 독 접기/펼치기">−</button>
              <button type="button" id="btn-shcd-close" class="shcd-mini-btn" title="협업 독 닫기" onclick="document.getElementById('sasarisa-handsfree-cowork-dock').style.display='none'">✕</button>
            </div>
          </div>

          <div id="shcd-body-content">
            <!-- Active Monitor Workspace Awareness -->
            <div class="shcd-section">
              <div class="shcd-sec-title">
                <span>1. 실시간 모니터 작업환경 인식 (Windows 11)</span>
                <span id="shcd-monitor-res-badge" class="shcd-tag">스캔 중…</span>
              </div>
              <div class="shcd-active-win-box" id="shcd-active-win-box">
                <span class="shcd-aw-label">현재 활성 창</span>
                <strong id="shcd-fg-title">모니터 작업창 스캔 중…</strong>
                <small id="shcd-fg-proc">프로세스 확인 중</small>
              </div>
              <div class="shcd-screen-preview-wrap">
                <img id="shcd-screen-img" src="/data/latest_monitor_capture.png" alt="" onerror="this.style.display='none'" onload="this.style.display='block'" />
                <div class="shcd-screen-overlay-bar">
                  <span id="shcd-open-win-count">열린 작업창 0개</span>
                  <button type="button" id="btn-shcd-ask-monitor" class="shcd-pill-btn">🗣️ "지금 모니터 보고 같이 작업해"</button>
                </div>
              </div>
              <div class="shcd-win-chips" id="shcd-win-chips"></div>
            </div>

            <!-- Hands-Free Camera + Voice Co-Sight -->
            <div class="shcd-section">
              <div class="shcd-sec-title">
                <span>2. 카메라 시야 공유 &amp; 무키보드 음성 진행</span>
                <button type="button" id="btn-shcd-cam-toggle" class="shcd-pill-btn cyan">👁️ 카메라 켜기</button>
              </div>
              <div class="shcd-cam-box" id="shcd-cam-box">
                <video id="sasarisa-cowork-cam-video" autoplay muted playsinline></video>
                <div class="shcd-cam-placeholder" id="shcd-cam-placeholder">
                  <span>📷 키보드·마우스를 쓰지 않을 때</span>
                  <small>카메라를 켜면 대표님이 보여주시는 물건·문서·손동작과 모니터 화면을 BSC_자비스가 동시에 보며 음성으로 대답합니다.</small>
                </div>
              </div>
              <div class="shcd-action-row">
                <button type="button" id="btn-shcd-native-app" class="shcd-full-btn">
                  🗔 주소창 없는 모니터 전용창 띄우기
                </button>
                <button type="button" id="btn-shcd-fullscreen" class="shcd-full-btn emerald">
                  ⛶ 현재 모니터 전체화면(F11) 전환
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- 3. Authentic HUD.swift + tutorial.css SasariSa On-Screen Card & 3-Ring Spinning Orb -->
        <section id="sasarisa-authentic-hud" class="sasarisa-hud pos-bottomCenter" aria-live="polite">
          <div class="sasarisa-hud-main">
            <div class="htxt">
              <div class="hs-row">
                <span class="hs" id="sasarisa-hud-status">● 듣는 중 · ${this.escapeHtml(this.cfg.assistantName)}</span>
                <span class="hs-sub-badges">
                  <button type="button" id="btn-hud-mic-toggle" class="hud-inline-pill active" title="연속 한국어 음성인식 켜기/끄기 (또는 우측 Alt 누른 채 말하기)">
                    🎙️ 연속 듣기 ON
                  </button>
                  <button type="button" id="btn-hud-test-tts" class="hud-inline-pill cyan" title="PC 스피커 및 브라우저 한국어 음성 출력 즉시 테스트 / 다시 읽기">
                    🔊 음성 출력·다시읽기
                  </button>
                  <button type="button" id="btn-hud-winh-dictate" class="hud-inline-pill emerald" title="Windows 11 네이티브 한국어 음성 받아쓰기 (Win+H) + 자동 인식 실행">
                    🗣️ Win+H 음성입력
                  </button>
                  <button type="button" id="btn-hud-eye-hand" class="hud-inline-pill emerald" title="카메라 눈동자(시선) 마우스 커서 + 손가락·손동작 제어 켜기/끄기">
                    👁️☝️ 눈동자·손동작 커서
                  </button>
                  <button type="button" id="btn-hud-open-chat" class="hud-inline-pill" title="자비스 1:1 대화창 및 성우 변경 서랍 열기">
                    💬 1:1 대화창
                  </button>
                  <button type="button" id="btn-hud-minimize-card" class="hud-inline-pill" style="border-color:rgba(248,113,113,0.55);color:#fecdd3;" title="하단 자비스 바 접기 / 최소화">
                    − 접기
                  </button>
                </span>
              </div>
              <div class="hh" id="sasarisa-hud-heard">「${this.escapeHtml(this.cfg.assistantName)}」라고 부르거나 아래 입력칸/마이크로 바로 말씀하세요</div>
              <div class="hb" id="sasarisa-hud-body">이건우 대표님, 무엇을 해 드릴까요?<i class="caret"></i></div>

              <!-- Inline Safety Confirmation Pill (tutorial.css .pillui: 「보내기」를 누를까요? [응] [아니]) -->
              <div id="sasarisa-hud-confirm-pill" class="sasarisa-pillui" style="display:none;"></div>
            </div>

            <!-- Authentic 3-Ring Dashed Spinning Orb (HUD.swift OrbView + tutorial.css .orb) -->
            <div class="sasarisa-orb-wrap" id="btn-sasarisa-orb-click" title="클릭하여 말하기 / 듣기 토글">
              <div class="orb" id="sasarisa-3ring-orb">
                <i></i><i></i><i></i><b id="sasarisa-orb-core"></b>
              </div>
              <canvas id="sasarisa-orb-level-meter" width="84" height="14" style="width:84px;height:14px;margin-top:4px;"></canvas>
            </div>
          </div>

          <!-- Voice / Text Direct Input & Quick Action Strip inside HUD Card -->
          <form id="sasarisa-hud-form" class="sasarisa-hud-input-row">
            <input
              type="text"
              id="sasarisa-hud-input"
              placeholder="말로 하거나 여기에 입력하세요 (예: 'BSC_자비스, 유튜브 로파이 틀어', '제미나이 4 아르곤으로 코딩', '자비스 코어 뉴런 열어줘', '아빠 왔어')..."
              autocomplete="off"
            />
            <button type="submit" class="sasarisa-hud-send-btn">실행 ↵</button>
          </form>
        </section>

        <!-- Minimized Bottom Orb Pill (shown when #sasarisa-authentic-hud is minimized) -->
        <button type="button" id="sasarisa-minimized-pill" style="display:none;position:fixed;bottom:56px;left:50%;transform:translateX(-50%);z-index:9300;padding:8px 18px;border-radius:999px;background:rgba(5,12,26,0.92);border:1.5px solid #00f0ff;color:#00f0ff;font-weight:800;font-size:12.5px;box-shadow:0 8px 28px rgba(0,0,0,0.65);cursor:pointer;align-items:center;gap:8px;">
          <span>◉ BSC_자비스 펼치기</span>
          <span style="font-size:11px;color:#34d399;">(음성·시선 대기 중)</span>
        </button>

        <!-- 4. Preserved BSC J.A.R.V.I.S. All-Tech Drawer (18 Studios, ArtCraft 13, 28 Agents, Folder/MD, IDE 2.0) -->
        <aside id="sasarisa-bsc-tech-drawer" style="display:none;">
          <div class="sbtd-header">
            <div>
              <strong>🧰 BSC J.A.R.V.I.S. 전체 보유 기술 서랍 (100% 보존 · 음성 및 원클릭 실행)</strong>
              <p>BSC_자비스 UI를 메인으로 유지하면서, 그동안 구축한 모든 스튜디오와 대시보드를 하나도 버리지 않고 즉시 호출합니다.</p>
            </div>
            <button type="button" id="btn-sbtd-close" class="stm-action-btn">✕ 닫기</button>
          </div>
          <div class="sbtd-grid">
            <button type="button" class="sbtd-card" data-open-ws="NEURON_STUDIO">
              <span class="sbtd-ic">🕸️</span>
              <b>옵시디언 × 노션 뉴런 스튜디오</b>
              <small>클릭한 뉴런 원문 열람 · 노션(/) 블록 편집 · [[위키링크]] 시냅스 생성 · 6종 문서 변환</small>
            </button>
            <button type="button" class="sbtd-card" data-open-ws="ECOSYSTEM_DASHBOARD">
              <span class="sbtd-ic">📂</span>
              <b>지식폴더 연결 &amp; .MD 심층 분석</b>
              <small>회사_HQ · 회사_Branch · 연구소 · 지식창고 폴더 연결 및 마크다운 뉴런 자동 추출</small>
            </button>
            <button type="button" class="sbtd-card" data-open-ws="DOC_IDE_DASHBOARD">
              <span class="sbtd-ic">💻</span>
              <b>문서 · Antigravity IDE 2.0 워크벤치</b>
              <small>실시간 코드/문서 편집기 · 내장 파워쉘/Git 터미널 · 6종 실무 문서(Word/PPT/PDF) 생성</small>
            </button>
            <button type="button" class="sbtd-card" data-open-ws="AI_BRAIN_DASHBOARD">
              <span class="sbtd-ic">🤖</span>
              <b>멀티 LLM 두뇌 &amp; 18대 AI 스튜디오</b>
              <small>Gemini 4 Argon(OAuth $0) · Ollama Gemma 4 · Blender 3D · 바이오 AlphaFold · 강화학습</small>
            </button>
            <button type="button" class="sbtd-card" data-open-ws="ARTCRAFT_STUDIO_DASHBOARD">
              <span class="sbtd-ic">🎨</span>
              <b>ArtCraft 13종 크리에이티브 제어</b>
              <small>PhotoCraft · VectorCraft · FilmCraft 등 13종 창작 앱 실시간 화면 공유 및 제어</small>
            </button>
            <button type="button" class="sbtd-card" data-open-ws="AGENT_OFFICE_DASHBOARD">
              <span class="sbtd-ic">🏛️</span>
              <b>28인 에이전트 워룸 회의 &amp; 조직도</b>
              <small>소하·태준·거누·우진·시안 등 본사 28인 에이전트 실시간 라운드테이블 회의 및 보고서</small>
            </button>
            <button type="button" class="sbtd-card" data-open-ws="HOLO_CAM_PANEL">
              <span class="sbtd-ic">📷</span>
              <b>Co-Vision 카메라 &amp; HOLO 손동작 제어</b>
              <small>웹캠/모바일 카메라 시야 공유 및 MediaPipe 손동작 인식</small>
            </button>
            <button type="button" class="sbtd-card" data-open-ws="CHAT_DRAWER">
              <span class="sbtd-ic">💬</span>
              <b>자비스 1:1 심층 채팅 서랍</b>
              <small>음성 대화 기록 열람 및 성우(현수 HD / 선희 HD / 인준 HD) 전환</small>
            </button>
          </div>
        </aside>

        <!-- 5. Authentic SetupWindow.swift Modal ("사사리사 준비") -->
        <div id="sasarisa-setup-modal" class="sasarisa-mac-modal-backdrop" style="display:none;"></div>

        <!-- 6. Authentic SettingsWindow.swift Modal ("사사리사 — 설정") -->
        <div id="sasarisa-settings-modal" class="sasarisa-mac-modal-backdrop" style="display:none;"></div>

        <!-- 7. Authentic BootScene.swift Overlay ("아빠 왔어 / 대표님 오셨습니다") -->
        <div id="sasarisa-boot-scene-overlay" style="display:none;"></div>
      `;

      document.body.appendChild(root);
    },

    updateTopBarLabels() {
      const nameEl = document.getElementById('stm-assistant-name');
      if (nameEl) nameEl.textContent = this.cfg.assistantName || '사사리사';
      const earEl = document.getElementById('stm-ear-status-pill');
      if (earEl) {
        earEl.innerHTML = `<i class="stm-dot"></i> 귀 열림 · 부르는 말 「${this.escapeHtml(this.cfg.assistantName)}」 / <kbd>우측 ⌥</kbd>`;
      }
    },

    applyHudPosition(pos = 'bottomCenter') {
      const hud = document.getElementById('sasarisa-authentic-hud');
      if (!hud) return;
      hud.classList.remove('pos-center', 'pos-bottomCenter', 'pos-bottomRight', 'pos-bottomLeft', 'pos-top');
      hud.classList.add(`pos-${pos}`);
    },

    /**
     * Ported 1:1 from `HUD.swift` `show(_ state: _ body: heard: color:)` & `docs/tutorial.js` `card(tone, state, heard, body)`
     */
    setHudCard(tone = '', stateText = '● 듣는 중', heardText = '', bodyText = '', typewriter = false) {
      const hud = document.getElementById('sasarisa-authentic-hud');
      const hs = document.getElementById('sasarisa-hud-status');
      const hh = document.getElementById('sasarisa-hud-heard');
      const hb = document.getElementById('sasarisa-hud-body');
      if (!hud || !hs || !hh || !hb) return;

      hud.classList.remove('amber', 'lime', 'pop');
      if (tone === 'amber' || tone === 'lime') {
        hud.classList.add(tone);
      }
      if (tone === 'lime') {
        hud.classList.add('pop');
        setTimeout(() => hud.classList.remove('pop'), 360);
      }

      hs.textContent = stateText;
      hh.textContent = heardText || '';

      if (!typewriter) {
        hb.innerHTML = `${this.escapeHtml(bodyText)}<i class="caret"></i>`;
      } else {
        hb.innerHTML = `<i class="caret"></i>`;
        const caret = hb.querySelector('.caret');
        const chars = Array.from(String(bodyText || ''));
        chars.forEach((ch, idx) => {
          setTimeout(() => {
            if (caret && caret.parentNode === hb) {
              caret.before(ch);
            }
          }, idx * 28);
        });
      }
    },

    async syncBrainStatusFromServer() {
      try {
        const res = await fetch('/api/jarvis/llm-hub/status').then(r => r.json());
        if (res && res.ok) {
          const pill = document.getElementById('stm-brain-status-pill');
          const prov = (res.state?.activeProvider || res.activeProvider || 'gemini').toUpperCase();
          const mod = res.state?.activeModel || res.activeModel || 'gemini-4-argon';
          const oauthTag = prov === 'GEMINI' ? ' (Google CLI · OAuth $0)' : '';
          if (pill) {
            pill.textContent = `🧠 두뇌: ${prov} · ${mod}${oauthTag}`;
          }
        }
      } catch (_) {}
    },

    /**
     * Real-Time Monitor Workspace Awareness (`GET /api/jarvis/sasarisa/monitor-context`)
     * Understands the foreground window, open Windows 11 apps, and live monitor screenshot
     */
    async refreshMonitorWorkspaceContext(captureScreen = true) {
      try {
        const res = await fetch(`/api/jarvis/sasarisa/monitor-context?capture=${captureScreen ? '1' : '0'}`).then(r => r.json());
        if (res && res.ok && res.context) {
          this.renderMonitorContextToDock(res.context);
        }
      } catch (_) {}
    },

    renderMonitorContextToDock(ctx) {
      if (!ctx) return;
      const resBadge = document.getElementById('shcd-monitor-res-badge');
      const fgTitle = document.getElementById('shcd-fg-title');
      const fgProc = document.getElementById('shcd-fg-proc');
      const winCount = document.getElementById('shcd-open-win-count');
      const winChips = document.getElementById('shcd-win-chips');
      const screenImg = document.getElementById('shcd-screen-img');

      if (resBadge) {
        resBadge.textContent = ctx.screenWidth ? `${ctx.screenWidth}×${ctx.screenHeight}` : '모니터 활성';
      }
      if (fgTitle) {
        fgTitle.textContent = ctx.foregroundTitle || '바탕화면 (Desktop)';
      }
      if (fgProc) {
        fgProc.textContent = `실행 앱: ${ctx.foregroundProcess || 'explorer'} · 열린 창 ${ctx.openWindowCount || 0}개`;
      }
      if (winCount) {
        winCount.textContent = `열린 작업창 ${ctx.openWindowCount || 0}개 인식됨`;
      }
      if (screenImg && ctx.screenshotUrl) {
        screenImg.src = ctx.screenshotUrl;
        screenImg.style.display = 'block';
      }
      if (winChips && Array.isArray(ctx.openWindows)) {
        winChips.innerHTML = ctx.openWindows.slice(0, 6).map(w => `
          <span class="shcd-win-chip" title="${this.escapeHtml(w.Title || '')}">
            <b>${this.escapeHtml(w.ProcessName || 'App')}</b> · ${this.escapeHtml(String(w.Title || '').slice(0, 18))}
          </span>
        `).join('');
      }
    },

    async toggleHandsFreeCamera(forceOn = null) {
      const video = document.getElementById('sasarisa-cowork-cam-video');
      const placeholder = document.getElementById('shcd-cam-placeholder');
      const btn = document.getElementById('btn-shcd-cam-toggle');
      if (!video) return;

      const isRunning = Boolean(this.coworkCamStream);
      const shouldTurnOn = forceOn !== null ? forceOn : !isRunning;

      if (!shouldTurnOn && this.coworkCamStream) {
        this.coworkCamStream.getTracks().forEach(t => t.stop());
        this.coworkCamStream = null;
        video.srcObject = null;
        video.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';
        if (btn) btn.textContent = '👁️ 카메라 켜기';
        this.setHudCard('', '● 카메라 시야 공유 종료', '카메라 끄기', '모니터 작업환경과 음성 인식은 계속 켜져 있습니다.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 360 } },
          audio: false
        });
        this.coworkCamStream = stream;
        video.srcObject = stream;
        video.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
        if (btn) btn.textContent = '🟢 카메라 시야 공유 중 (끄기)';
        window.MultimodalEngine?.toggleVoiceListening?.(true);
        this.setHudCard(
          'lime',
          '✓ 카메라 시야 + 모니터 작업환경 + 음성 동시 협업 ON',
          '핸즈프리 카메라·음성 협업',
          `${this.cfg.userName}, 키보드·마우스 없이 카메라에 비추시거나 모니터 화면을 보며 말씀하시면 바로 함께 작업합니다.`
        );
        window.MultimodalEngine?.speakText?.('카메라 시야와 모니터 작업환경 인식이 켜졌습니다. 편하게 말씀해 주세요.', 'jarvis');
      } catch (err) {
        if (btn) btn.textContent = '👁️ 모바일/웹캠 연결 대기';
        this.setHudCard(
          'lime',
          '● 모니터 작업환경 + 음성 협업 ON (카메라 연결 대기)',
          '모니터·음성 핸즈프리 모드',
          `모니터의 모든 열린 창을 실시간으로 파악 중입니다. 웹캠 권한을 허용하거나 모바일 카메라 브리지를 연결하면 카메라 시야도 함께 봅니다.`
        );
      }
    },

    async launchFramelessMonitorMode() {
      this.setHudCard(
        'amber',
        '◌ 모니터 전용 네이티브 앱 창 실행 중…',
        '주소창 없는 모니터 전용창',
        '브라우저 상단 주소창(http://localhost:7777)이 없는 모니터 전용 BSC_자비스 앱 창을 띄웁니다…'
      );
      try {
        const res = await fetch('/api/jarvis/sasarisa/launch-monitor-app', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'app' })
        }).then(r => r.json());
        if (res && res.ok) {
          this.setHudCard(
            'lime',
            '✓ 모니터 전용 앱 창 실행 완료 (주소창 제거됨)',
            'BSC_자비스 모니터 앱 모드',
            res.message || '주소창이 없는 모니터 전용 창으로 열렸습니다.'
          );
          window.MultimodalEngine?.speakText?.('모니터 전용 앱 창으로 띄웠습니다.', 'jarvis');
        }
      } catch (e) {
        this.setHudCard('amber', '⚠︎ 전체화면 전환', '', '전체화면 모드로 전환합니다.');
      }
    },

    /**
     * Execute any voice or typed command through the SasariSa × Jarvis Full-Stack Router
     * with authentic `tutorial.js` state transitions:
     *   1) Cyan (`● 듣는 중`) -> 2) Amber (`◌ 처리 중...`) -> 3) Lime (`✓ 실행 완료` + spoken TTS)
     */
    async executeVoiceOrTextCommand(rawText) {
      const text = String(rawText || '').trim();
      if (!text) return;

      // 1. Check Barge-in / Stop command ("됐어", "멈춰", "그만")
      if (/^(됐어|멈춰|그만|조용히|스톱|stop)$/i.test(text)) {
        window.speechSynthesis?.cancel?.();
        window.MultimodalEngine?.stopAllSpeech?.();
        this.setHudCard('', '● 대기 중 (대답 멈춤)', text, '네 대표님, 말씀을 멈추고 다음 명령을 기다립니다.');
        return;
      }

      // 2. Check Wake-Up Greeting command ("아빠 왔어", "나 왔어", "대표님 오셨다", "깨어나는 화면")
      if (/(아빠\s*왔어|나\s*왔어|다녀왔어|깨어나는\s*화면|부팅\s*화면|아크\s*리액터)/i.test(text)) {
        this.playBootScene(this.cfg.bootStyle);
        return;
      }

      // 3. Normalize Korean STT phonetic variations of "BSC_자비스" / "자비스" / "사사리사"
      // WebSpeech often transcribes "자비스" as "자비쓰", "자비스야", "비에스씨 자비스", "사사리사야"
      const wakeRegex = /^(?:헤이\s*|어이\s*|야\s*)?(?:BSC[\s_]*자비스|비에스씨[\s_]*자비스|비에쓰씨[\s_]*자비스|자비스|자비쓰|쟈비스|사사리사|샤샤리샤)[야아님]?[,，.!\s]*/i;
      let cleanedCmd = text;
      if (wakeRegex.test(cleanedCmd)) {
        cleanedCmd = cleanedCmd.replace(wakeRegex, '').trim();
      } else {
        const wakeList = this.cfg.wakeWords.split(',').map(w => w.trim()).filter(Boolean);
        for (const w of wakeList) {
          const re = new RegExp(`^${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[야아]?[,，\\s]*`, 'i');
          if (re.test(cleanedCmd)) {
            cleanedCmd = cleanedCmd.replace(re, '').trim();
            break;
          }
        }
      }

      // If user ONLY said the wake word ("사사리사" or "자비스"), chime and open 30s follow-up window!
      if (!cleanedCmd) {
        this.playSynthChime(true);
        this.followUpUntil = Date.now() + 30000;
        this.setHudCard('', `● 듣는 중 (30초 동안 이름 없이 말씀하세요)`, text, `네, ${this.cfg.userName}. 듣고 있습니다.`);
        window.MultimodalEngine?.speakText?.(`네, ${this.cfg.userName}. 말씀하세요.`, 'jarvis');
        return;
      }

      this.followUpUntil = Date.now() + 30000;

      // Step 1 -> Step 2: Amber Working state (`◌ 처리 중`)
      this.setHudCard('amber', `◌ ${this.cfg.assistantName} 생각 및 실행 중…`, text, `「${cleanedCmd}」 작업을 처리하고 있습니다…`);

      try {
        const providerMap = {
          'gemini-cli-oauth': 'gemini',
          'ollama': 'ollama',
          'lmstudio': 'lmstudio',
          'openai': 'openai',
          'claude-code': 'gemini',
          'codex': 'gemini',
          'combo': 'gemini'
        };
        const targetProvider = providerMap[this.cfg.brainProvider] || 'gemini';

        const res = await fetch('/api/jarvis/sasarisa/command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: cleanedCmd,
            provider: targetProvider
          })
        }).then(r => r.json());

        if (!res || !res.ok) {
          this.setHudCard('amber', '⚠︎ 처리 확인 필요', text, res?.error || '명령을 처리하지 못했습니다.');
          return;
        }

        const rec = res.actionRecord || {};
        const confirmBox = document.getElementById('sasarisa-hud-confirm-pill');

        // Trigger UI actions if the voice skill requested opening a Neuron Studio, BSC Dashboard, or Monitor/Camera Co-Work Dock
        if (res.intent?.skillId === 'CLOSE_OPENED_WINDOWS' || /(창\s*다\s*꺼|다\s*꺼|창\s*닫아|팝업\s*닫아|화면\s*정리)/i.test(cleanedCmd)) {
          window.BSC_CloseAllFloatingUI?.({ keepCameraWidget: true, stopSpeech: false });
        } else if (rec.uiAction === 'OPEN_NEURON_STUDIO' && window.NeuronContentStudio) {
          window.NeuronContentStudio.openNeuronModal(rec.neuronKeyword || 'J.A.R.V.I.S. 코어');
        } else if (rec.uiAction === 'OPEN_DASHBOARD' && window.JarvisDesignViews && rec.targetDashboard) {
          window.JarvisDesignViews.openWorkspace(rec.targetDashboard);
        } else if (rec.uiAction === 'OPEN_HANDSFREE_COWORK_DOCK') {
          const dock = document.getElementById('sasarisa-handsfree-cowork-dock');
          if (dock) dock.style.display = 'block';
          if (rec.monitorContext) {
            this.renderMonitorContextToDock(rec.monitorContext);
          } else {
            this.refreshMonitorWorkspaceContext(true);
          }
          if (/카메라|웹캠|보면서/i.test(cleanedCmd)) {
            this.toggleHandsFreeCamera(true);
          }
        }

        // Check if SasariSa 2-Step Safety Confirmation is required (`tutorial.css .pillui`)
        if (res.requiresConfirmation && res.confirmItem && confirmBox) {
          const ci = res.confirmItem;
          this.setHudCard(
            'amber',
            `🛡️ 안전 확인 · ${ci.intent?.skillTitleKo || '중요 작업'}`,
            text,
            res.reply || `되돌릴 수 없는 작업입니다. 실행할까요?`
          );
          confirmBox.style.display = 'block';
          confirmBox.innerHTML = `
            <div class="pillui-inner">
              <b>${this.escapeHtml(this.cfg.assistantName)} 안전장치 — ${this.escapeHtml(ci.intent?.riskReasonKo || '보내기·결제·삭제는 꼭 물어봅니다')}</b>
              <div class="pillui-draft">${this.escapeHtml(ci.draftContent || cleanedCmd)}</div>
              <div class="pillui-actions">
                <button type="button" class="pillui-yes" data-cid="${this.escapeHtml(ci.confirmId)}" data-dec="APPROVE">응 (실행)</button>
                <button type="button" class="pillui-no" data-cid="${this.escapeHtml(ci.confirmId)}" data-dec="CANCEL">아니 (취소)</button>
              </div>
            </div>
          `;
          confirmBox.querySelectorAll('button[data-cid]').forEach(btn => {
            btn.addEventListener('click', async () => {
              const cRes = await fetch('/api/jarvis/sasarisa/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  confirmId: btn.getAttribute('data-cid'),
                  decision: btn.getAttribute('data-dec')
                })
              }).then(r => r.json()).catch(() => null);
              confirmBox.style.display = 'none';
              if (cRes) {
                const msg = cRes.message || cRes.reply || '처리가 완료되었습니다.';
                this.setHudCard('lime', `✓ ${cRes.status === 'CANCELLED' ? '안전 취소됨' : '승인 및 실행 완료'}`, text, msg);
                window.MultimodalEngine?.speakText?.(msg, 'jarvis');
              }
            });
          });
        } else {
          if (confirmBox) confirmBox.style.display = 'none';
          const stateTitle = `✓ ${rec.skillTitleKo || '실행 완료'}`;
          const replyBody = res.reply || '요청하신 작업을 완료했습니다.';
          this.setHudCard('lime', stateTitle, text, replyBody);
        }

        // Speak response aloud via 96kbps HD Neural TTS
        if (res.reply) {
          window.MultimodalEngine?.speakText?.(res.reply, 'jarvis');
        }
      } catch (err) {
        this.setHudCard('amber', '⚠︎ 연결 오류', text, err.message);
      }
    },

    /**
     * Ported 1:1 from `BootScene.swift` (lines 106-248):
     * Full-screen translucent Arc Reactor + Conic Radar + 120 Ticks + Left Boot Log + Right 110px Clock + Bottom Greeting -> Flies into HUD Orb!
     */
    playBootScene(style = 'reactor') {
      if (style === 'card') {
        const greet = (this.cfg.greetingText || '어서 오십시오, {user}.').replace('{user}', this.cfg.userName);
        this.playSynthChime(true);
        this.setHudCard('lime', `● ${this.cfg.assistantName} 깨어남`, '아빠 왔어', greet, true);
        window.MultimodalEngine?.speakText?.(`${greet} 모든 시스템이 정상입니다.`, 'jarvis');
        return;
      }

      const overlay = document.getElementById('sasarisa-boot-scene-overlay');
      if (!overlay) return;
      const calm = style === 'calm';
      const now = new Date();
      const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      const ymd = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}  ${days[now.getDay()]}`;
      const greet = (this.cfg.greetingText || '어서 오십시오, {user}.').replace('{user}', this.cfg.userName);
      const spacedTitle = (this.cfg.assistantName || 'SASARISA').split('').join(' ');

      overlay.style.display = 'flex';
      overlay.style.opacity = '1';
      overlay.innerHTML = `
        ${!calm ? `<div class="boot-grid-overlay"></div><div class="boot-scanline"></div>` : ''}

        ${!calm ? `
          <!-- Left: Boot Log with Real Numbers (BootScene.swift line 193) -->
          <div class="boot-left-log" id="boot-left-log"></div>

          <!-- Right: 110px Monospace Clock (BootScene.swift line 205) -->
          <div class="boot-right-clock">
            <div class="boot-clock-hm">${hm}</div>
            <div class="boot-clock-ymd">${ymd}</div>
            <div class="boot-clock-nominal">● ALL SYSTEMS NOMINAL</div>
          </div>
        ` : ''}

        <!-- Center: Arc Reactor (BootScene.swift line 139) -->
        <div class="boot-center-stage" id="boot-reactor-fly-wrap">
          <div class="boot-arc-reactor">
            ${!calm ? `<div class="boot-radar-sweep"></div>` : ''}
            <div class="boot-ring r1"></div>
            <div class="boot-ring r2"></div>
            ${!calm ? `<div class="boot-ring r3"></div><div class="boot-ring r4"></div>` : ''}
            <div class="boot-core"></div>
          </div>
        </div>

        <!-- Bottom: Name + Subtitle + Greeting (BootScene.swift line 218) -->
        <div class="boot-bottom-titles">
          <div class="boot-main-title">${this.escapeHtml(spacedTitle)}</div>
          <div class="boot-sub-title">VOICE-FIRST AI ASSISTANT · OBSIDIAN NEURON OS · GOOGLE CLI OAUTH ($0)</div>
          <div class="boot-hello-line">${this.escapeHtml(greet)}</div>
        </div>
      `;

      this.playSynthChime(false);
      window.MultimodalEngine?.speakText?.(`${greet} BSC_자비스 전 시스템 준비 완료되었습니다.`, 'jarvis');

      if (!calm) {
        const logEl = overlay.querySelector('#boot-left-log');
        const lines = [
          `${this.cfg.assistantName} · BOOT SEQUENCE`,
          `────────────────────────────────`,
          `> MIC & ON-DEVICE KOREAN SPEECH ... ONLINE`,
          `> BRAIN: GEMINI 4 ARGON (GOOGLE CLI OAUTH $0) ... READY`,
          `> LOCAL BRAIN: OLLAMA GEMMA 4 (127.0.0.1:11434) ... READY`,
          `> OBSIDIAN × NOTION NEURONS: 656 NODES / 766 SYNAPSES`,
          `> HANDS: CLI / MCP / WINDOWS 11 GUARDED EXECUTOR ... ARMED`,
          `> 모든 준비가 끝났습니다.`
        ];
        lines.forEach((ln, i) => {
          setTimeout(() => {
            if (!logEl) return;
            const d = document.createElement('div');
            d.style.color = i === 0 ? '#ffffff' : '#4dd9ff';
            d.textContent = ln;
            logEl.appendChild(d);
          }, 220 + i * 210);
        });
      }

      // Fly reactor into the SasariSa HUD orb after 4.0s (BootScene.swift line 231)
      setTimeout(() => {
        const reactorWrap = overlay.querySelector('#boot-reactor-fly-wrap');
        const orbEl = document.getElementById('sasarisa-3ring-orb');
        if (reactorWrap && orbEl) {
          const rRect = orbEl.getBoundingClientRect();
          const dx = (rRect.left + rRect.width / 2) - window.innerWidth / 2;
          const dy = (rRect.top + rRect.height / 2) - window.innerHeight / 2;
          reactorWrap.style.transition = 'transform 0.68s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.68s ease';
          reactorWrap.style.transform = `translate(${dx}px, ${dy}px) scale(0.18)`;
        }
        overlay.style.transition = 'opacity 0.65s ease';
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.style.display = 'none';
          this.setHudCard('lime', `● ${this.cfg.assistantName} 대기 중`, '아빠 왔어', greet);
        }, 680);
      }, 4100);
    },

    /**
     * Ported 1:1 from `SetupWindow.swift` ("사사리사 준비" -> "BSC_자비스 준비"):
     * - 비서 이름 정하기 (부르는 이름, 나를 부르는 호칭, 화면 위치, 목소리로 이름 맞추기 12회)
     * - 권한 점검 (마이크 ✓, 음성 인식 ✓, 손쉬운 사용 ✓, 화면 기록 ✓)
     * - 두뇌 (생각하는 AI) & 목소리 미리 듣기
     */
    openSetupWindow() {
      const modal = document.getElementById('sasarisa-setup-modal');
      if (!modal) return;
      modal.style.display = 'flex';

      const speechSupported = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

      modal.innerHTML = `
        <div class="sasarisa-mac-window" style="width:640px;">
          <div class="smw-titlebar">
            <div class="smw-traffic">
              <span class="dot red" id="btn-setup-close-dot"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <span class="smw-win-title">BSC_자비스 준비 (SetupWindow)</span>
            <button type="button" id="btn-setup-close" class="smw-close-btn">✕</button>
          </div>

          <div class="smw-body">
            <h2 style="font-size:24px;font-weight:800;margin:0 0 4px 0;color:#111827;">BSC_자비스 준비</h2>
            <p style="font-size:13.5px;color:#6b7280;margin:0 0 14px 0;">빨간 것만 해결하면 됩니다. 소리는 컴퓨터 밖으로 나가지 않아요.</p>

            <!-- GroupBox 1: 비서 이름 정하기 (SetupWindow.swift line 165) -->
            <div class="smw-groupbox">
              <div class="smw-gb-title">비서 이름 정하기 (시리처럼 부를 이름과 호칭 설정)</div>
              <div class="smw-form-row">
                <label>부르는 이름</label>
                <input type="text" id="setup-assistant-name" value="${this.escapeHtml(this.cfg.assistantName)}" placeholder="예: BSC_자비스" />
              </div>
              <div class="smw-form-row">
                <label>나를 부르는 호칭</label>
                <input type="text" id="setup-user-name" value="${this.escapeHtml(this.cfg.userName)}" placeholder="예: 이건우 대표님" />
              </div>
              <div class="smw-form-row">
                <label>화면 위치</label>
                <select id="setup-hud-pos">
                  <option value="center" ${this.cfg.hudPosition === 'center' ? 'selected' : ''}>화면 가운데 (기본)</option>
                  <option value="bottomCenter" ${this.cfg.hudPosition === 'bottomCenter' ? 'selected' : ''}>아래 가운데 (독 위)</option>
                  <option value="bottomRight" ${this.cfg.hudPosition === 'bottomRight' ? 'selected' : ''}>오른쪽 아래</option>
                  <option value="bottomLeft" ${this.cfg.hudPosition === 'bottomLeft' ? 'selected' : ''}>왼쪽 아래</option>
                  <option value="top" ${this.cfg.hudPosition === 'top' ? 'selected' : ''}>위 가운데</option>
                </select>
                <button type="button" id="btn-setup-show-hud" class="smw-btn">다시 보기</button>
              </div>

              <!-- NameTrainingRow (목소리로 이름 맞추기 12회) -->
              <div class="smw-train-box">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <button type="button" id="btn-setup-train-voice" class="smw-btn primary">🎙️ 목소리로 이름 맞추기 (0/12)</button>
                  <span id="setup-train-status" style="font-size:12px;color:#059669;font-weight:700;">✓ 「BSC_자비스」, 「자비스」, 「사사리사」 음성 발음 모델 활성</span>
                </div>
                <p style="font-size:11.5px;color:#6b7280;margin:6px 0 0 0;">
                  시리처럼, 이름을 8번 그리고 짧은 명령과 함께 4번 따라 말하면 내 목소리로 그 이름을 어떻게 받아 적는지 배웁니다.
                </p>
              </div>
            </div>

            <!-- GroupBox 2: 4대 권한 점검 (SetupWindow.swift line 184) -->
            <div class="smw-groupbox">
              <div class="smw-check-row">
                <span class="chk-ic ok">✓</span>
                <div class="chk-txt">
                  <b>마이크 (Microphone)</b>
                  <span>부르는 말(「${this.escapeHtml(this.cfg.assistantName)}」)을 듣기 위해 · WebAudio 실시간 파형 연결됨</span>
                </div>
                <button type="button" id="btn-setup-test-mic" class="smw-btn">마이크 켜기</button>
              </div>
              <div class="smw-check-row">
                <span class="chk-ic ${speechSupported ? 'ok' : 'warn'}">${speechSupported ? '✓' : '!'}</span>
                <div class="chk-txt">
                  <b>음성 인식 (Speech Recognition)</b>
                  <span>컴퓨터 안에서 말을 글자로 (연속 한국어 WebSpeech + Windows SAPI 로컬 폴백)</span>
                </div>
              </div>
              <div class="smw-check-row">
                <span class="chk-ic ok">✓</span>
                <div class="chk-txt">
                  <b>손쉬운 사용 &amp; CLI / MCP 제어 (Accessibility &amp; Hands)</b>
                  <span>글자 입력·버튼 누르기·파워쉘 CLI·블렌더/파이어베이스 MCP 연동 (마우스 포인터 방해 없음)</span>
                </div>
              </div>
              <div class="smw-check-row">
                <span class="chk-ic ok">✓</span>
                <div class="chk-txt">
                  <b>컴퓨터 켤 때 자동 시작 &amp; 이름 부르면 즉시 열기 (Windows Startup + OS Wake Daemon)</b>
                  <span>PC 부팅 시 백그라운드 상시 대기 · 창이 닫혀 있어도 「${this.escapeHtml(this.cfg.assistantName)}」 부르면 자동으로 팝업 오픈</span>
                </div>
                <button type="button" id="btn-setup-autostart-reg" class="smw-btn primary">자동 실행 등록됨 ✓</button>
              </div>
              <div class="smw-check-row">
                <span class="chk-ic ok">✓</span>
                <div class="chk-txt">
                  <b>화면 기록 · Co-Vision (Screen &amp; Camera)</b>
                  <span>「지금 화면에 뭐 있어?」 비전 분석 및 옵시디언 뉴런 연동 완료</span>
                </div>
              </div>
            </div>

            <!-- GroupBox 3: 두뇌 & 목소리 (SetupWindow.swift line 205) -->
            <div class="smw-groupbox">
              <div class="smw-form-row">
                <label>두뇌 (생각하는 AI)</label>
                <select id="setup-brain-choice" style="flex:1;">
                  <option value="gemini-cli-oauth" ${this.cfg.brainProvider === 'gemini-cli-oauth' ? 'selected' : ''}>Google Gemini CLI — Gemini 4 Argon (Ultra OAuth $0) ✓</option>
                  <option value="claude-code" ${this.cfg.brainProvider === 'claude-code' ? 'selected' : ''}>Claude Code — Claude 구독 ✓</option>
                  <option value="codex" ${this.cfg.brainProvider === 'codex' ? 'selected' : ''}>Codex — ChatGPT 구독 ✓</option>
                  <option value="combo" ${this.cfg.brainProvider === 'combo' ? 'selected' : ''}>조합 — 셋이 나눠 맡기 (무료 · 고사양 PC) ✓</option>
                  <option value="ollama" ${this.cfg.brainProvider === 'ollama' ? 'selected' : ''}>Ollama — 이 PC에서 무료 (gemma4:e4b) ✓</option>
                  <option value="lmstudio" ${this.cfg.brainProvider === 'lmstudio' ? 'selected' : ''}>LM Studio — 이 PC에서 무료 (.gguf)</option>
                </select>
                <button type="button" id="btn-setup-oauth-now" class="smw-btn">OAuth 확인</button>
              </div>

              <div class="smw-form-row" style="margin-top:8px;">
                <label>목소리 (Voice)</label>
                <select id="setup-voice-choice" style="flex:1;">
                  <option value="ko-KR-HyunsuMultilingualNeural" ${this.cfg.sayVoice === 'ko-KR-HyunsuMultilingualNeural' ? 'selected' : ''}>자동 — 현수 HD (한국어 신경망 Premium 무료)</option>
                  <option value="ko-KR-SunHiNeural" ${this.cfg.sayVoice === 'ko-KR-SunHiNeural' ? 'selected' : ''}>선희 HD (한국어 여성 신경망 Premium 무료)</option>
                  <option value="ko-KR-InJoonNeural" ${this.cfg.sayVoice === 'ko-KR-InJoonNeural' ? 'selected' : ''}>인준 HD (한국어 남성 신경망 차분한 톤)</option>
                </select>
                <button type="button" id="btn-setup-preview-voice" class="smw-btn">🔊 미리 듣기</button>
              </div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;">
              <span style="font-size:12.5px;color:#4b5563;">다 되면 「<b>${this.escapeHtml(this.cfg.assistantName)}</b>」라고 불러 보세요 — 또는 <b>오른쪽 Alt(⌥)</b>를 누른 채 말하기.</span>
              <button type="button" id="btn-setup-save-start" class="smw-btn primary" style="padding:8px 22px;font-size:14px;">시작</button>
            </div>
          </div>
        </div>
      `;

      const closeSetup = () => { modal.style.display = 'none'; };
      modal.querySelector('#btn-setup-close')?.addEventListener('click', closeSetup);
      modal.querySelector('#btn-setup-close-dot')?.addEventListener('click', closeSetup);

      modal.querySelector('#setup-hud-pos')?.addEventListener('change', (e) => {
        this.saveConfig({ hudPosition: e.target.value });
        this.setHudCard('lime', '● 화면 위치 미리 보기', '', `카드가 [${e.target.selectedOptions[0].text}] 위치로 이동했습니다.`);
      });
      modal.querySelector('#btn-setup-show-hud')?.addEventListener('click', () => {
        this.setHudCard('lime', `● ${this.cfg.assistantName} 카드 위치 확인`, '', '여기에서 음성 명령과 결과를 보여 드립니다.');
      });

      // Voice Name Training simulation (12 steps like Siri)
      modal.querySelector('#btn-setup-train-voice')?.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const st = modal.querySelector('#setup-train-status');
        this.nameTrainStep = (this.nameTrainStep % 12) + 1;
        const nameVal = modal.querySelector('#setup-assistant-name')?.value || 'BSC_자비스';
        const prompts = [
          `「${nameVal}」`, `「${nameVal}」`, `「헤이 ${nameVal}」`, `「${nameVal}, 몇 시야」`,
          `「${nameVal}, 유튜브 틀어」`, `「${nameVal}, 제미나이 열어」`, `「${nameVal}, 뉴런 보여줘」`, `「${nameVal}, 멈춰」`
        ];
        const nextPhrase = prompts[this.nameTrainStep % prompts.length];
        btn.textContent = `🎙️ 따라 말하기 (${this.nameTrainStep}/12)`;
        if (st) st.textContent = `지금 말할 것: ${nextPhrase} (인식률 12/12 보정 중)`;
        window.MultimodalEngine?.toggleVoiceListening?.(true);
      });

      modal.querySelector('#btn-setup-test-mic')?.addEventListener('click', () => {
        window.MultimodalEngine?.toggleVoiceListening?.(true);
        this.setHudCard('', '● 마이크 연속 듣기 켜짐', '', '지금 바로 말씀해 보세요.');
      });

      modal.querySelector('#btn-setup-oauth-now')?.addEventListener('click', async () => {
        const r = await fetch('/api/jarvis/llm-hub/oauth-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'gemini-4-argon', launchBrowserLogin: false })
        }).then(x => x.json()).catch(() => null);
        if (r?.message) {
          window.MultimodalEngine?.speakText?.(r.message, 'jarvis');
          this.setHudCard('lime', '✓ Google CLI OAuth ($0) 확인됨', '', r.message);
        }
      });

      modal.querySelector('#btn-setup-autostart-reg')?.addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        const r = await fetch('/api/jarvis/sasarisa/autostart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enable: true, openAppWindowImmediately: true })
        }).then(x => x.json()).catch(() => null);
        if (r?.ok) {
          btn.textContent = 'PC 부팅 시 자동 실행 등록 완료 ✓';
          this.setHudCard('lime', '✓ 윈도우 시작 프로그램 & 상시 호출 등록 완료', 'BSC_자비스', r.message);
          window.MultimodalEngine?.speakText?.(r.message, 'jarvis');
        }
      });

      modal.querySelector('#btn-setup-preview-voice')?.addEventListener('click', () => {
        const aName = modal.querySelector('#setup-assistant-name')?.value || 'BSC_자비스';
        const uName = modal.querySelector('#setup-user-name')?.value || '이건우 대표님';
        const vChoice = modal.querySelector('#setup-voice-choice')?.value || 'ko-KR-HyunsuMultilingualNeural';
        const voiceSelect = document.getElementById('jarvis-voice-actor-select');
        if (voiceSelect) voiceSelect.value = vChoice;
        const line = `안녕하세요, ${uName}. ${aName}입니다. 이 목소리로 읽어 드릴게요.`;
        window.MultimodalEngine?.speakText?.(line, 'jarvis');
      });

      modal.querySelector('#btn-setup-save-start')?.addEventListener('click', async () => {
        const aName = modal.querySelector('#setup-assistant-name')?.value?.trim() || 'BSC_자비스';
        const uName = modal.querySelector('#setup-user-name')?.value?.trim() || '이건우 대표님';
        const pos = modal.querySelector('#setup-hud-pos')?.value || 'bottomCenter';
        const bChoice = modal.querySelector('#setup-brain-choice')?.value || 'gemini-cli-oauth';
        const vChoice = modal.querySelector('#setup-voice-choice')?.value || 'ko-KR-HyunsuMultilingualNeural';

        this.saveConfig({
          assistantName: aName,
          userName: uName,
          hudPosition: pos,
          brainProvider: bChoice,
          sayVoice: vChoice
        });

        const voiceSelect = document.getElementById('jarvis-voice-actor-select');
        if (voiceSelect) voiceSelect.value = vChoice;

        await fetch('/api/jarvis/llm-hub/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activeProvider: bChoice === 'ollama' ? 'ollama' : bChoice === 'lmstudio' ? 'lmstudio' : 'gemini',
            activeModel: bChoice === 'ollama' ? 'gemma4:e4b' : 'gemini-4-argon',
            geminiAuthMode: 'oauth'
          })
        }).catch(() => {});

        await this.syncBrainStatusFromServer();
        closeSetup();
        this.setHudCard('lime', `● ${aName} 설정 완료`, '', `${uName}, 준비가 완료되었습니다. 「${aName}」라고 불러 보세요.`);
      });
    },

    /**
     * Ported 1:1 from `SettingsWindow.swift` ("사사리사 — 설정")
     */
    openSettingsWindow() {
      const modal = document.getElementById('sasarisa-settings-modal');
      if (!modal) return;
      modal.style.display = 'flex';

      const maxTok = Math.max(...this.cfg.dailyUsage.map(d => d.tokens), 1000);

      modal.innerHTML = `
        <div class="sasarisa-mac-window" style="width:620px;max-height:86vh;display:flex;flex-direction:column;">
          <div class="smw-titlebar">
            <div class="smw-traffic">
              <span class="dot red" id="btn-set-close-dot"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <span class="smw-win-title">${this.escapeHtml(this.cfg.assistantName)} — 설정 (SettingsWindow)</span>
            <button type="button" id="btn-set-close" class="smw-close-btn">✕</button>
          </div>

          <div class="smw-body" style="overflow-y:auto;flex:1;">
            <!-- Section 1: 기본 (Basics) -->
            <div class="smw-section-label">기본 (Basics)</div>
            <div class="smw-groupbox">
              <div class="smw-form-row">
                <label>언어</label>
                <select id="set-lang">
                  <option value="ko" selected>한국어 (Korean)</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div class="smw-form-row">
                <label>부르는 방식</label>
                <select id="set-activation">
                  <option value="voice" ${this.cfg.activation === 'voice' ? 'selected' : ''}>부르는 말 (+ 단축키)</option>
                  <option value="hold" ${this.cfg.activation === 'hold' ? 'selected' : ''}>단축키만 (오른쪽 ⌥ 누를 때만 듣기)</option>
                </select>
              </div>
              <div class="smw-form-row">
                <label>나를 부르는 호칭</label>
                <input type="text" id="set-user-name" value="${this.escapeHtml(this.cfg.userName)}" />
              </div>
              <div class="smw-form-row">
                <label>비서 이름</label>
                <input type="text" id="set-assistant-name" value="${this.escapeHtml(this.cfg.assistantName)}" />
              </div>
              <div class="smw-form-row">
                <label>부르는 말</label>
                <input type="text" id="set-wake-words" value="${this.escapeHtml(this.cfg.wakeWords)}" />
              </div>
              <div class="smw-form-row">
                <label>인사말</label>
                <input type="text" id="set-greeting" value="${this.escapeHtml(this.cfg.greetingText)}" />
              </div>
              <div class="smw-form-row">
                <label>인사 화면</label>
                <select id="set-boot-style">
                  <option value="reactor" ${this.cfg.bootStyle === 'reactor' ? 'selected' : ''}>화려하게 (기본 · 아크리액터)</option>
                  <option value="calm" ${this.cfg.bootStyle === 'calm' ? 'selected' : ''}>깔끔하게 (Calm)</option>
                  <option value="card" ${this.cfg.bootStyle === 'card' ? 'selected' : ''}>카드로만 (Card only)</option>
                </select>
                <button type="button" id="btn-set-boot-preview" class="smw-btn">미리 보기</button>
              </div>
              <div class="smw-form-row">
                <label>화면 위치</label>
                <select id="set-hud-pos">
                  <option value="center" ${this.cfg.hudPosition === 'center' ? 'selected' : ''}>화면 가운데 (기본)</option>
                  <option value="bottomCenter" ${this.cfg.hudPosition === 'bottomCenter' ? 'selected' : ''}>아래 가운데 (독 위)</option>
                  <option value="bottomRight" ${this.cfg.hudPosition === 'bottomRight' ? 'selected' : ''}>오른쪽 아래</option>
                  <option value="bottomLeft" ${this.cfg.hudPosition === 'bottomLeft' ? 'selected' : ''}>왼쪽 아래</option>
                  <option value="top" ${this.cfg.hudPosition === 'top' ? 'selected' : ''}>위 가운데</option>
                </select>
              </div>
              <div class="smw-form-row">
                <label>안전 모드</label>
                <label style="flex:1;font-weight:500;color:#374151;display:flex;align-items:center;gap:6px;">
                  <input type="checkbox" id="set-free-mode" ${this.cfg.freeMode ? 'checked' : ''} />
                  자유 모드 — 결제만 묻기 (꺼 두면 보내기·결제·삭제 시 항상 한 번 물어봅니다)
                </label>
              </div>
            </div>

            <!-- Section 2: 두뇌 (Brain — EngineMenu from SettingsWindow.swift line 353) -->
            <div class="smw-section-label">두뇌 (생각하는 AI · 로컬 및 구독 OAuth $0 연결)</div>
            <div class="smw-groupbox">
              <div class="smw-form-row">
                <label>생각하는 AI</label>
                <select id="set-brain-provider" style="flex:1;">
                  <optgroup label="로컬 &amp; 구독 연결 — API 요금 $0">
                    <option value="gemini-cli-oauth" ${this.cfg.brainProvider === 'gemini-cli-oauth' ? 'selected' : ''}>Google Gemini CLI — Gemini 4 Argon (Ultra OAuth 구독 $0)</option>
                    <option value="claude-code" ${this.cfg.brainProvider === 'claude-code' ? 'selected' : ''}>Claude Code — Claude 구독</option>
                    <option value="codex" ${this.cfg.brainProvider === 'codex' ? 'selected' : ''}>Codex — ChatGPT 구독 (GPT)</option>
                    <option value="ollama" ${this.cfg.brainProvider === 'ollama' ? 'selected' : ''}>Ollama — 이 컴퓨터에서 무료 (gemma4:e4b)</option>
                    <option value="lmstudio" ${this.cfg.brainProvider === 'lmstudio' ? 'selected' : ''}>LM Studio — 이 컴퓨터에서 무료 (.gguf)</option>
                    <option value="combo" ${this.cfg.brainProvider === 'combo' ? 'selected' : ''}>조합(Combo) — 코딩·웹·빠른명령 나눠 맡기기 (무료)</option>
                  </optgroup>
                  <optgroup label="API 키 연결">
                    <option value="openai" ${this.cfg.brainProvider === 'openai' ? 'selected' : ''}>GPT-4o (OpenAI API Key)</option>
                  </optgroup>
                </select>
              </div>
              <p style="font-size:11.5px;color:#059669;margin:6px 0 0 0;">
                🔐 현재 Google AI Ultra OAuth 로그인 모드가 활성화되어 추가 API 비용 $0으로 Gemini 4 Argon을 활용합니다.
              </p>
            </div>

            <!-- Section 3: AI 사용량 & 배운 말 (SettingsWindow.swift line 321 & GrowTogether) -->
            <div class="smw-section-label">AI 사용량 (7일) &amp; 한 번 배워서 바로 실행하는 말 (토큰 0)</div>
            <div class="smw-groupbox">
              <div style="font-size:12px;font-weight:700;color:#374151;margin-bottom:8px;">
                ${this.escapeHtml(this.cfg.assistantName)}가 쓴 양 · 최근 7일 (클로드·제미나이 없이 배운 빠른 명령은 토큰 0 소모)
              </div>
              <div style="display:flex;align-items:flex-end;gap:10px;height:86px;padding:8px 12px;background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;">
                ${this.cfg.dailyUsage.map(d => {
                  const pct = Math.max(12, Math.round((d.tokens / maxTok) * 100));
                  return `
                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                      <div style="width:100%;height:56px;display:flex;align-items:flex-end;">
                        <div style="width:100%;height:${pct}%;background:linear-gradient(180deg,#3b82f6,#10b981);border-radius:4px;"></div>
                      </div>
                      <span style="font-size:10.5px;color:#6b7280;font-weight:700;">${d.day} (${d.calls}회)</span>
                    </div>
                  `;
                }).join('')}
              </div>

              <div style="margin-top:10px;display:flex;flex-direction:column;gap:5px;">
                ${this.cfg.learnedCommands.map(lc => `
                  <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;padding:6px 10px;background:#f3f4f6;border-radius:8px;">
                    <span>🗣️ <b>「${this.escapeHtml(lc.phrase)}」</b> ➔ ${this.escapeHtml(lc.action)}</span>
                    <span style="color:#059669;font-weight:700;">⚡ 즉시 실행 (${lc.hits}회 학습)</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px;">
              <button type="button" id="btn-set-apply" class="smw-btn primary">저장 및 바로 적용</button>
            </div>
          </div>
        </div>
      `;

      const closeSet = () => { modal.style.display = 'none'; };
      modal.querySelector('#btn-set-close')?.addEventListener('click', closeSet);
      modal.querySelector('#btn-set-close-dot')?.addEventListener('click', closeSet);

      modal.querySelector('#btn-set-boot-preview')?.addEventListener('click', () => {
        const st = modal.querySelector('#set-boot-style')?.value || 'reactor';
        this.saveConfig({ bootStyle: st });
        closeSet();
        this.playBootScene(st);
      });

      modal.querySelector('#set-hud-pos')?.addEventListener('change', (e) => {
        this.saveConfig({ hudPosition: e.target.value });
      });

      modal.querySelector('#btn-set-apply')?.addEventListener('click', async () => {
        const uName = modal.querySelector('#set-user-name')?.value?.trim() || '이건우 대표님';
        const aName = modal.querySelector('#set-assistant-name')?.value?.trim() || 'BSC_자비스';
        const wWords = modal.querySelector('#set-wake-words')?.value?.trim() || 'BSC_자비스, 자비스, 사사리사';
        const greet = modal.querySelector('#set-greeting')?.value?.trim() || '어서 오십시오, {user}.';
        const bStyle = modal.querySelector('#set-boot-style')?.value || 'reactor';
        const pos = modal.querySelector('#set-hud-pos')?.value || 'bottomCenter';
        const free = Boolean(modal.querySelector('#set-free-mode')?.checked);
        const prov = modal.querySelector('#set-brain-provider')?.value || 'gemini-cli-oauth';

        this.saveConfig({
          userName: uName,
          assistantName: aName,
          wakeWords: wWords,
          greetingText: greet,
          bootStyle: bStyle,
          hudPosition: pos,
          freeMode: free,
          brainProvider: prov
        });

        await fetch('/api/jarvis/llm-hub/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activeProvider: prov === 'ollama' ? 'ollama' : prov === 'lmstudio' ? 'lmstudio' : prov === 'openai' ? 'openai' : 'gemini',
            activeModel: prov === 'ollama' ? 'gemma4:e4b' : prov === 'openai' ? 'gpt-4o' : 'gemini-4-argon',
            geminiAuthMode: 'oauth'
          })
        }).catch(() => {});

        await this.syncBrainStatusFromServer();
        closeSet();
        this.setHudCard('lime', `✓ ${aName} 설정 저장됨`, '', `${uName}, 변경하신 설정과 화면 위치가 즉시 반영되었습니다.`);
      });
    },

    bindEvents() {
      // 1. Top Bar Buttons
      document.getElementById('btn-stm-brand')?.addEventListener('click', () => {
        window.JarvisDesignViews?.closeWorkspace?.();
        this.toggleMainArStage(true);
        this.setHudCard('lime', `● ${this.cfg.assistantName} 대기 중`, '', `${this.cfg.userName}, 풀스크린 AR 카메라 스테이지 및 ${this.cfg.assistantName} 메인 화면입니다.`);
      });

      window.BSC_ToggleMainArStage = (forceShow) => this.toggleMainArStage(forceShow);
      document.getElementById('btn-stm-toggle-ar-stage')?.addEventListener('click', () => {
        window.JarvisDesignViews?.closeWorkspace?.();
        this.toggleMainArStage();
      });

      document.getElementById('btn-stm-boot-scene')?.addEventListener('click', () => {
        this.playBootScene(this.cfg.bootStyle);
      });

      document.getElementById('btn-stm-monitor-app')?.addEventListener('click', () => {
        this.launchFramelessMonitorMode();
      });

      document.getElementById('btn-stm-eye-hand-cursor')?.addEventListener('click', () => {
        window.JarvisCameraGestureOS?.toggleGestureWidget?.();
      });

      document.getElementById('btn-hud-eye-hand')?.addEventListener('click', () => {
        window.JarvisCameraGestureOS?.toggleGestureWidget?.();
      });

      document.getElementById('btn-stm-close-all-ui')?.addEventListener('click', () => {
        window.BSC_CloseAllFloatingUI?.({ keepCameraWidget: true, stopSpeech: true });
        this.setHudCard('lime', '✓ 모든 팝업·서브창 닫기 완료', '화면 정리 (Clean Screen)', '모니터를 가리던 모든 팝업과 서브 창을 닫았습니다.');
      });

      document.getElementById('btn-hud-minimize-card')?.addEventListener('click', () => {
        const hud = document.getElementById('sasarisa-authentic-hud');
        const pill = document.getElementById('sasarisa-minimized-pill');
        if (hud) hud.style.display = 'none';
        if (pill) pill.style.display = 'inline-flex';
      });

      document.getElementById('sasarisa-minimized-pill')?.addEventListener('click', () => {
        const hud = document.getElementById('sasarisa-authentic-hud');
        const pill = document.getElementById('sasarisa-minimized-pill');
        if (hud) hud.style.display = 'block';
        if (pill) pill.style.display = 'none';
      });

      document.getElementById('btn-stm-cowork-dock-toggle')?.addEventListener('click', () => {
        const dock = document.getElementById('sasarisa-handsfree-cowork-dock');
        if (!dock) return;
        const hidden = dock.style.display === 'none';
        dock.style.display = hidden ? 'block' : 'none';
        if (hidden) {
          this.refreshMonitorWorkspaceContext(true);
        }
      });

      document.getElementById('btn-shcd-refresh')?.addEventListener('click', () => {
        this.refreshMonitorWorkspaceContext(true);
        this.setHudCard('lime', '✓ 모니터 작업환경 스캔 완료', '모니터 열린 창·활성 창 인식', '현재 모니터에 열려 있는 모든 작업창과 화면을 최신 상태로 인식했습니다.');
      });

      document.getElementById('btn-shcd-collapse')?.addEventListener('click', (e) => {
        const body = document.getElementById('shcd-body-content');
        if (!body) return;
        const hidden = body.style.display === 'none';
        body.style.display = hidden ? 'block' : 'none';
        e.currentTarget.textContent = hidden ? '−' : '+';
      });

      document.getElementById('btn-shcd-ask-monitor')?.addEventListener('click', () => {
        this.executeVoiceOrTextCommand('지금 모니터 작업환경이랑 열린 창들 파악해서 같이 작업하자');
      });

      document.getElementById('btn-shcd-cam-toggle')?.addEventListener('click', () => {
        this.toggleHandsFreeCamera();
      });

      document.getElementById('btn-shcd-native-app')?.addEventListener('click', () => {
        this.launchFramelessMonitorMode();
      });

      document.getElementById('btn-shcd-fullscreen')?.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.().catch(() => {});
          this.setHudCard('lime', '✓ 모니터 전체화면(F11) 전환 완료', '모니터 UI 전체화면', '브라우저 주소창을 숨기고 모니터 전체화면 UI로 전환했습니다. (ESC 또는 F11로 해제)');
        } else {
          document.exitFullscreen?.().catch(() => {});
        }
      });

      document.getElementById('btn-stm-autostart-wake')?.addEventListener('click', async () => {
        const res = await fetch('/api/jarvis/sasarisa/autostart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enable: true, openAppWindowImmediately: true })
        }).then(r => r.json()).catch(() => null);
        if (res && res.ok) {
          this.playSynthChime(true);
          this.setHudCard(
            'lime',
            '✓ 컴퓨터 켤 때 자동 시작 & 상시 호출 활성',
            'PC 부팅 시 자동 실행 (LaunchAgent 1:1)',
            `${res.message} (경로: Startup/BSC_Jarvis_AutoStart.vbs)`
          );
          window.MultimodalEngine?.speakText?.(res.message, 'jarvis');
        }
      });

      document.getElementById('btn-stm-setup-win')?.addEventListener('click', () => {
        this.openSetupWindow();
      });

      document.getElementById('btn-stm-settings-win')?.addEventListener('click', () => {
        this.openSettingsWindow();
      });

      document.getElementById('btn-stm-neuron-studio')?.addEventListener('click', () => {
        const sel = window.BrainGraphEngine?.selectedNode || 'J.A.R.V.I.S. 코어';
        window.NeuronContentStudio?.openNeuronModal?.(sel);
      });

      document.getElementById('btn-stm-theme-toggle')?.addEventListener('click', () => {
        const next = this.cfg.themeBackdrop === 'sasarisa-sky' ? 'galaxy-dark' : 'sasarisa-sky';
        this.saveConfig({ themeBackdrop: next });
        this.setHudCard(
          'lime',
          next === 'sasarisa-sky' ? '☀️ 사사리사 스카이 라이트 테마' : '🌌 옵시디언 뉴런 다크 테마',
          '',
          next === 'sasarisa-sky'
            ? 'sasarisa.com 공식 스카이 라이트 배경으로 전환했습니다.'
            : '옵시디언 3D 지식 뉴런 다크 은하 배경으로 전환했습니다.'
        );
      });

      document.getElementById('btn-stm-bsc-drawer')?.addEventListener('click', () => {
        const dr = document.getElementById('sasarisa-bsc-tech-drawer');
        if (dr) dr.style.display = dr.style.display === 'none' ? 'block' : 'none';
      });
      document.getElementById('btn-sbtd-close')?.addEventListener('click', () => {
        const dr = document.getElementById('sasarisa-bsc-tech-drawer');
        if (dr) dr.style.display = 'none';
      });

      // 2. BSC All-Tech Drawer Cards (100% preservation of all existing features)
      document.querySelectorAll('#sasarisa-bsc-tech-drawer .sbtd-card').forEach(card => {
        card.addEventListener('click', () => {
          const target = card.getAttribute('data-open-ws');
          const dr = document.getElementById('sasarisa-bsc-tech-drawer');
          if (dr) dr.style.display = 'none';

          if (target === 'NEURON_STUDIO') {
            window.NeuronContentStudio?.openNeuronModal?.(window.BrainGraphEngine?.selectedNode || 'J.A.R.V.I.S. 코어');
          } else if (target === 'HOLO_CAM_PANEL') {
            const p = document.getElementById('holo-gesture-hud-panel');
            if (p) p.style.display = p.style.display === 'none' ? 'block' : 'none';
          } else if (target === 'CHAT_DRAWER') {
            document.getElementById('agent-chat-drawer')?.classList.toggle('open');
          } else if (target && window.JarvisDesignViews) {
            window.JarvisDesignViews.openWorkspace(target);
          }
        });
      });

      // 3. Top Search Bar -> Search & Open Neuron Content Studio
      const searchInp = document.getElementById('stm-neuron-search');
      searchInp?.addEventListener('input', (e) => {
        if (window.BrainGraphEngine) {
          window.BrainGraphEngine.searchQuery = e.target.value.trim();
        }
      });
      searchInp?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && searchInp.value.trim()) {
          const q = searchInp.value.trim().toLowerCase();
          const match = window.BrainGraphEngine?.nodes?.find(n =>
            String(n.label || '').toLowerCase().includes(q) || String(n.path || '').toLowerCase().includes(q)
          );
          if (match) {
            window.BrainGraphEngine.selectNode(match, true);
            window.BrainGraphEngine.flyToNode(match);
          } else {
            window.NeuronContentStudio?.openNeuronModal?.(searchInp.value.trim());
          }
        }
      });

      // 4. Mini Guide Card Collapse & Quick Scene Buttons
      document.getElementById('btn-smg-collapse')?.addEventListener('click', (e) => {
        const body = document.getElementById('smg-body-content');
        if (!body) return;
        const hidden = body.style.display === 'none';
        body.style.display = hidden ? 'block' : 'none';
        e.currentTarget.textContent = hidden ? '−' : '+';
      });

      document.querySelectorAll('.smg-scene-btn[data-voice-cmd]').forEach(btn => {
        btn.addEventListener('click', () => {
          const cmd = btn.getAttribute('data-voice-cmd');
          if (cmd) this.executeVoiceOrTextCommand(cmd);
        });
      });

      // 5. HUD Card Form & Mic / OAuth / Orb Controls (+ Auto-Commit on Dictation Input!)
      const hudInputEl = document.getElementById('sasarisa-hud-input');
      let hudDictationTimer = null;
      hudInputEl?.addEventListener('input', () => {
        const val = hudInputEl.value.trim();
        if (!val) return;
        this.setHudCard('', '● 실시간 음성/받아쓰기 입력 중…', val, val);
        if (hudDictationTimer) clearTimeout(hudDictationTimer);
        // When user uses Win+H (Windows 11 Voice Typing) or voice dictation and pauses for 1.6s, auto-execute hands-free!
        if (this.winHDictationActive) {
          hudDictationTimer = setTimeout(() => {
            const finalVal = hudInputEl.value.trim();
            if (finalVal.length >= 2) {
              hudInputEl.value = '';
              this.executeVoiceOrTextCommand(finalVal);
            }
          }, 1500);
        }
      });

      document.getElementById('btn-hud-winh-dictate')?.addEventListener('click', () => {
        this.winHDictationActive = true;
        hudInputEl?.focus();
        window.MultimodalEngine?.toggleVoiceListening?.(true);
        this.setHudCard(
          'lime',
          '● 한국어 음성 연속 인식 & Win+H 받아쓰기 활성',
          '지금 바로 말씀해 주세요 (말씀이 끝나면 1.5초 뒤 자동 실행)',
          '브라우저 WebSpeech 한국어 인식기가 작동 중입니다. 혹시 브라우저 마이크가 막혀 있다면 키보드에서 [윈도우 키 + H]를 한 번 누르시면 윈도우 11 기본 한국어 음성인식이 작동하여 말씀하시는 즉시 자동 실행됩니다.'
        );
      });

      document.getElementById('sasarisa-hud-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (hudDictationTimer) clearTimeout(hudDictationTimer);
        const inp = document.getElementById('sasarisa-hud-input');
        const val = inp?.value?.trim();
        if (!val) return;
        inp.value = '';
        this.executeVoiceOrTextCommand(val);
      });

      document.getElementById('btn-sasarisa-orb-click')?.addEventListener('click', () => {
        this.playSynthChime(true);
        this.winHDictationActive = true;
        hudInputEl?.focus();
        window.MultimodalEngine?.toggleVoiceListening?.(true);
        this.setHudCard('', '● 듣는 중 · 지금 바로 말씀하세요', '마이크 연속 인식 ON', '말씀하시는 내용이 실시간으로 표시되며 1.1초 뒤 자동 실행됩니다.');
      });

      document.getElementById('btn-hud-mic-toggle')?.addEventListener('click', (e) => {
        const isOn = e.currentTarget.classList.toggle('active');
        e.currentTarget.textContent = isOn ? '🎙️ 연속 듣기 ON' : '🎙️ 연속 듣기 OFF';
        if (isOn) {
          this.winHDictationActive = true;
          hudInputEl?.focus();
          window.MultimodalEngine?.toggleVoiceListening?.(true);
          this.setHudCard('', '● 연속 듣기 켜짐 · 지금 말씀하세요', '연속 음성 인식 ON', '이름을 부르거나 바로 명령을 말씀해 주세요.');
        } else {
          window.MultimodalEngine?.toggleVoiceListening?.(false);
        }
      });

      document.getElementById('btn-hud-test-tts')?.addEventListener('click', () => {
        const bodyTxt = document.getElementById('sasarisa-hud-body')?.textContent?.trim();
        const sample = (bodyTxt && bodyTxt.length > 4 && !bodyTxt.includes('무엇을 해 드릴까요'))
          ? bodyTxt
          : `${this.cfg.userName}, ${this.cfg.assistantName} 한국어 자연 음성과 윈도우 스피커 직결 출력이 정상 작동 중입니다. 편하게 말씀해 주십시오.`;
        this.setHudCard('lime', '🔊 한국어 HD 음성 출력 중…', '음성 출력 확인', sample);
        window.MultimodalEngine?.speakText?.(sample, 'jarvis');
      });

      document.getElementById('btn-hud-open-chat')?.addEventListener('click', () => {
        window.MultimodalEngine?.toggleChatDrawer?.();
      });

      // Coordinate Left Dock (#slim-left-dock) & AR Stage & Mini Guide Card so dashboards never overlap
      document.querySelectorAll('#slim-left-dock .slim-dock-btn, #clean-bottom-bar [data-open-dashboard]').forEach(btn => {
        btn.addEventListener('click', (ev) => {
          const target = btn.getAttribute('data-dock-target') || btn.getAttribute('data-open-dashboard');
          const guideCard = document.getElementById('sasarisa-mini-guide-card');
          const coworkBody = document.getElementById('shcd-body-content');
          const coworkBtn = document.getElementById('btn-shcd-collapse');
          if (target === 'AR_CAMERA_STAGE') {
            ev.stopImmediatePropagation();
            window.JarvisDesignViews?.closeWorkspace?.();
            this.toggleMainArStage(true);
            return;
          }
          // Any other dock button (HOME_GALAXY, ECOSYSTEM_DASHBOARD, etc.) hides the AR stage so the requested view is visible
          this.toggleMainArStage(false);
          if (target && target !== 'HOME_GALAXY') {
            if (guideCard) guideCard.style.display = 'none';
            if (coworkBody) coworkBody.style.display = 'none';
            if (coworkBtn) coworkBtn.textContent = '+';
          }
        });
      });

      document.getElementById('btn-hud-oauth-pill')?.addEventListener('click', async () => {
        this.setHudCard('amber', '◌ Google CLI OAuth ($0) 점검 중…', 'Google OAuth 확인', '대표님 PC의 ~/.gemini/oauth_creds.json 및 Gemini 4 Argon 세션을 확인합니다…');
        const res = await fetch('/api/jarvis/llm-hub/oauth-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'gemini-4-argon', launchBrowserLogin: false })
        }).then(r => r.json()).catch(() => null);
        if (res && res.ok) {
          this.setHudCard('lime', '✓ Google CLI · Gemini 4 Argon (OAuth $0)', 'Google OAuth 로그인 완료', res.message);
          window.MultimodalEngine?.speakText?.(res.message, 'jarvis');
        }
      });

      // 6. Authentic Right-Option / Right-Alt (`⌥`) Push-to-Talk & Tap-to-Wake (README.ko.md lines 24-25)
      let altDownAt = 0;
      window.addEventListener('keydown', (e) => {
        if (e.code === 'AltRight' || (e.altKey && e.code === 'Space')) {
          if (!this.pttHolding) {
            this.pttHolding = true;
            altDownAt = Date.now();
            this.playSynthChime(true);
            const hud = document.getElementById('sasarisa-authentic-hud');
            hud?.classList.add('listening');
            this.setHudCard('', '● 듣는 중 (오른쪽 ⌥ 누른 상태 · 떼면 바로 실행)', '', '지금 말씀하세요…');
            window.MultimodalEngine?.toggleVoiceListening?.(true);
          }
        }
      });

      window.addEventListener('keyup', (e) => {
        if (e.code === 'AltRight' && this.pttHolding) {
          this.pttHolding = false;
          const heldMs = Date.now() - altDownAt;
          const hud = document.getElementById('sasarisa-authentic-hud');
          hud?.classList.remove('listening');
          if (heldMs < 350) {
            // Short tap on Right Alt = 30s wake window!
            this.followUpUntil = Date.now() + 30000;
            this.setHudCard('', '● 30초 연속 듣기 활성', '오른쪽 ⌥ 톡', '30초 동안 이름 없이 바로 말씀하시면 됩니다.');
          }
        }
      });

      // 7. Subscribe to OS-Level Always-On Wake Events (`/api/events` -> `os_wake_event`)
      // When the user calls "BSC_자비스" / "자비스" / "아빠 왔어" into the PC microphone,
      // the OS wake daemon brings the window up and fires this SSE event!
      try {
        const es = new EventSource('/api/events');
        es.addEventListener('os_wake_event', (ev) => {
          try {
            const data = JSON.parse(ev.data || '{}');
            const phrase = String(data.heardText || '').trim();
            if (!phrase) return;
            window.focus?.();
            if (data.isBootGreeting) {
              this.playBootScene(this.cfg.bootStyle);
            } else {
              this.executeVoiceOrTextCommand(phrase);
            }
          } catch (_) {}
        });
      } catch (_) {}
    }
  };

  window.SasariSaMainOS = SasariSaMainOS;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SasariSaMainOS.init());
  } else {
    SasariSaMainOS.init();
  }
})();
