/**
 * 🛡️ BSC J.A.R.V.I.S. OS — Google AI Studio 17-Modules Holographic Window Extension
 * Extends window.HUDWindowSpawner while preserving 100% of BSC_Javis_OS Cyber-Steward HUD aesthetics.
 * Supports:
 *  1. AI_STUDIO_HUB      (⚡ 17대 스튜디오 런처 & 9대 오픈모델/Laya-421M 라우터 & 5대 프리셋 & 4대 음성매크로)
 *  2. MAPS_REA_STUDIO    (🗺️ MAPS 4계층 Memory/Agent/Pulse/Screen & REA 역공학 스튜디오)
 *  3. AGENT_REGISTRY     (🤖 SRP 에이전트 레지스트리 & 페르소나 슬라이더 & 일괄 상태 토글 & BSC 28인 요원)
 *  4. CREATIVE_BLENDER   (🎨 캐릭터 360° 턴어라운드 SVG/OBJ & Blender 3D VFX & Barehands 3D)
 *  5. RL_BENCHMARK       (🧠 9대 모델 양자화 벤치마크 & GRPO 강화학습 가중치 분포 & 시스템 감사)
 *  6. VISION_FACE        (👁️ OmniParser 화면/웹캠 비전 좌표 추출 & Face-to-Face 표정/시선 교감)
 *  7. SIM_BIO_IDE        (🧬 자율 모의훈련 ROI & AlphaFold 바이오 단백질 연구소 & Antigravity IDE 자가치유)
 */

(function () {
  function attachAIStudioExtensions() {
    const spawner = window.HUDWindowSpawner;
    if (!spawner) return;

    // Layout Presets for AI Studio Holographic Windows
    Object.assign(spawner.layoutPresets, {
      AI_STUDIO_HUB: { top: 96, left: 288, width: 800, height: 555 },
      MAPS_REA_STUDIO: { top: 100, left: 300, width: 785, height: 545 },
      AGENT_REGISTRY: { top: 104, left: 315, width: 785, height: 540 },
      CREATIVE_BLENDER: { top: 98, left: 305, width: 775, height: 550 },
      RL_BENCHMARK: { top: 100, left: 295, width: 795, height: 550 },
      VISION_FACE: { top: 102, left: 310, width: 765, height: 540 },
      SIM_BIO_IDE: { top: 98, left: 300, width: 790, height: 550 },
      OPEN_TTS_STUDIO: { top: 96, left: 295, width: 810, height: 560 }
    });

    const origPopulate = spawner.populateWindowBody.bind(spawner);

    spawner.populateWindowBody = function (win, config) {
      const type = config.windowType || 'REPORT';
      const titleEl = win.querySelector('.win-title');
      const subEl = win.querySelector('.win-subtitle');
      const bodyEl = win.querySelector('.hud-window-body');
      if (titleEl && config.title) titleEl.textContent = config.title;
      if (subEl && config.subtitle) subEl.textContent = config.subtitle;
      if (!bodyEl) return;

      if (type === 'AI_STUDIO_HUB') {
        this.renderAIStudioHub(bodyEl);
      } else if (type === 'MAPS_REA_STUDIO') {
        this.renderMapsReaStudio(bodyEl, config.initialSubTab);
      } else if (type === 'AGENT_REGISTRY') {
        this.renderAgentRegistryStudio(bodyEl);
      } else if (type === 'CREATIVE_BLENDER') {
        this.renderCreativeBlenderStudio(bodyEl, config.initialSubTab);
      } else if (type === 'RL_BENCHMARK') {
        this.renderRlBenchmarkStudio(bodyEl, config.initialSubTab);
      } else if (type === 'VISION_FACE') {
        this.renderVisionFaceStudio(bodyEl, config.initialSubTab);
      } else if (type === 'SIM_BIO_IDE') {
        this.renderSimBioIdeStudio(bodyEl, config.initialSubTab);
      } else if (type === 'OPEN_TTS_STUDIO') {
        this.renderOpenTtsStudio(bodyEl);
      } else {
        origPopulate(win, config);
      }
    };

    // =========================================================================
    // 1. AI_STUDIO_HUB: 17-Studio Command Matrix + 9-Model Laya Router + Presets
    // =========================================================================
    spawner.renderAIStudioHub = function (bodyEl) {
      const data = window.AIStudioData;
      const cfg = data.routerConfig;

      bodyEl.innerHTML = `
        <div class="ais-top-banner">
          <div>
            <span class="ais-badge-cyan">GOOGLE AI STUDIO × BSC J.A.R.V.I.S. 100% FUSION</span>
            <h3 style="margin:4px 0 2px 0;color:#fff;">⚡ 17대 스튜디오 &amp; 9대 오픈모델/SLM 통합 관제 센터</h3>
            <div style="font-size:11.5px;color:#94a3b8;">Google AI Studio에서 구축하신 모든 도메인 스튜디오, 모델 라우터, 강화학습, 바이오, 역공학 기능이 100% 반영되어 있습니다.</div>
          </div>
          <div style="text-align:right;font-family:monospace;font-size:11px;">
            <div style="color:#34d399;font-weight:800;">● LAYA-421M SYSTEM-1 (33ms)</div>
            <div style="color:#00f0ff;" id="hub-active-llm-label">${cfg.llmEngine}</div>
          </div>
        </div>

        <!-- 6 Domains / 17 Studios Quick-Launch Grid -->
        <div class="ais-section-title">🚀 6대 핵심 도메인 · 17개 전문 스튜디오 즉시 소환 (클릭 시 전용 홀로그램 창 오픈)</div>
        <div class="ais-grid-3">
          <div class="ais-studio-card" data-open-win="MAPS_REA_STUDIO">
            <div class="ais-card-head"><span class="ais-tag">도메인 3</span> <b>🗺️ MAPS 4계층 &amp; REA 역공학</b></div>
            <p>MEMORY.md 4계층 편집기, Pulse 능동형 크론 데몬, morluto/rea 바이너리·Electron 역공학 디컴파일</p>
          </div>
          <div class="ais-studio-card" data-open-win="AGENT_REGISTRY">
            <div class="ais-card-head"><span class="ais-tag">도메인 3</span> <b>🤖 SRP 에이전트 레지스트리</b></div>
            <p>6대 특화 클래스 + BSC 28인 요원, 페르소나 슬라이더(격식/유머/주도성), 체크박스 일괄 상태 토글</p>
          </div>
          <div class="ais-studio-card" data-open-win="CREATIVE_BLENDER">
            <div class="ais-card-head"><span class="ais-tag">도메인 4</span> <b>🎨 캐릭터 360° &amp; 블렌더 VFX</b></div>
            <p>정면/측면/후면 360° SVG 도면, Wavefront .OBJ 메쉬, 스토리보드, Blender bpy &amp; Barehands 3D</p>
          </div>
          <div class="ais-studio-card" data-open-win="RL_BENCHMARK">
            <div class="ais-card-head"><span class="ais-tag">도메인 5</span> <b>🧠 9대 모델 벤치마크 &amp; GRPO RL</b></div>
            <p>Q4_K_M/Q8_0/FP16 속도·VRAM 비교, 5대 레이어 가중치 왜도 히스토그램, Unsloth 스크립트 생성</p>
          </div>
          <div class="ais-studio-card" data-open-win="VISION_FACE">
            <div class="ais-card-head"><span class="ais-tag">도메인 2</span> <b>👁️ 화면 OmniParser &amp; 얼굴 교감</b></div>
            <p>데스크톱 화면 캡처 UI 좌표 추출(PyAutoGUI 연동) 및 웹캠 표정·집중도·피로도 실시간 교감</p>
          </div>
          <div class="ais-studio-card" data-open-win="SIM_BIO_IDE">
            <div class="ais-card-head"><span class="ais-tag">도메인 6</span> <b>🧬 모의훈련 · AlphaFold · IDE</b></div>
            <p>몬테카를로 ROI 모의훈련, TP53/EGFR/BRCA1 단백질 구조 분석, Antigravity IDE 자가치유 패치</p>
          </div>
          <div class="ais-studio-card" data-open-win="OPEN_TTS_STUDIO" style="border-color:rgba(52,211,153,0.5);">
            <div class="ais-card-head"><span class="ais-tag" style="color:#34d399;">오픈소스 TTS</span> <b>🎙️ Chatterbox · Qwen3 보이스</b></div>
            <p>15종 TTS 벤치마크 1위 Chatterbox Multilingual(23개국어 0원 더빙), Qwen3-TTS, 7대 신경망 성우</p>
          </div>
          <div class="ais-studio-card" id="hub-card-open-settings" style="border-color:rgba(251,191,36,0.5);">
            <div class="ais-card-head"><span class="ais-tag" style="color:#fbbf24;">시스템 코어</span> <b>⚙️ 11대 통합 설정 페이지</b></div>
            <p>언어·4대 테마·5대 프리셋·STT/LLM/TTS·발화 스타일·바인딩 폴더·외부 IDE·API 키·음성 매크로</p>
          </div>
          <div class="ais-studio-card" id="hub-card-open-queue" style="border-color:rgba(168,85,247,0.5);">
            <div class="ais-card-head"><span class="ais-tag" style="color:#c084fc;">실행 승인 큐</span> <b>📋 OS Action Queue 서랍</b></div>
            <p>HIGH/MEDIUM/LOW 우선순위 OS 실행 대기열 관리, 커스텀 명령 추가 및 대표님 원클릭 실행 승인</p>
          </div>
        </div>

        <!-- Multi-Model Router Selectors (3 STT + 9 LLM + 3 TTS) -->
        <div class="ais-section-title" style="margin-top:12px;">🧠 멀티 오픈모델 하이브리드 라우터 (STT 3종 · LLM/SLM 9종 · TTS 3종)</div>
        <div class="ais-grid-3">
          <div class="ais-box">
            <label class="ais-label">🎙️ 음성 인식 (STT 엔진)</label>
            <select id="sel-stt-engine" class="ais-select">
              ${data.STT_ENGINE_OPTIONS.map(o => `<option value="${o.id}" ${cfg.sttEngine === o.id ? 'selected' : ''}>${o.name} (${o.latencyBadge})</option>`).join('')}
            </select>
          </div>
          <div class="ais-box">
            <label class="ais-label">⚡ 두뇌 추론 (9대 LLM / 로컬 SLM)</label>
            <select id="sel-llm-engine" class="ais-select">
              ${data.LLM_ENGINE_OPTIONS.map(o => `<option value="${o.id}" ${cfg.llmEngine === o.id ? 'selected' : ''}>${o.name} [${o.latencyBadge}]</option>`).join('')}
            </select>
          </div>
          <div class="ais-box">
            <label class="ais-label">🔊 음성 합성 (TTS &amp; 보이스)</label>
            <select id="sel-tts-engine" class="ais-select">
              ${data.TTS_ENGINE_OPTIONS.map(o => `<option value="${o.id}" ${cfg.ttsEngine === o.id ? 'selected' : ''}>${o.name} (${o.latencyBadge})</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- 5 Situational Presets -->
        <div class="ais-section-title" style="margin-top:12px;">🎯 5대 상황별 원클릭 프리셋 (Situational Presets)</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${data.SITUATIONAL_PRESETS.map(p => `
            <button class="hud-mini-btn ${cfg.situationalPreset === p.id ? 'primary' : ''} btn-preset-apply" data-preset="${p.id}" style="flex:1;min-width:135px;">
              ${p.titleKo}
            </button>
          `).join('')}
        </div>

        <!-- 4 Voice Macros -->
        <div class="ais-section-title" style="margin-top:12px;">🎙️ 4대 음성 매크로 (Voice Macros — 음성/채팅 발화 시 즉시 트리거)</div>
        <div class="ais-grid-2">
          ${data.DEFAULT_VOICE_MACROS.map(m => `
            <div class="ais-box" style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <div>
                <div style="color:#00f0ff;font-weight:700;font-size:11.5px;">"${m.phrase}"</div>
                <div style="color:#94a3b8;font-size:10.5px;">${m.descriptionKo}</div>
              </div>
              <button class="win-ctrl-btn btn-run-macro" data-macro-id="${m.id}">▶ 실행</button>
            </div>
          `).join('')}
        </div>
      `;

      // Bind Studio Launch Cards
      bodyEl.querySelectorAll('.ais-studio-card[data-open-win]').forEach(card => {
        card.addEventListener('click', () => {
          const targetWin = card.dataset.openWin;
          this.openAIStudioWindowByType(targetWin);
        });
      });
      bodyEl.querySelector('#hub-card-open-settings')?.addEventListener('click', () => {
        this.openMasterSettingsModal();
      });
      bodyEl.querySelector('#hub-card-open-queue')?.addEventListener('click', () => {
        this.toggleOsActionQueueDrawer();
      });

      // Bind Model Selectors
      const updateRouterStatus = () => {
        const pill = document.getElementById('active-model-pill');
        if (pill) pill.textContent = `✦ ${cfg.llmEngine.toUpperCase().slice(0, 14)}`;
        const lbl = bodyEl.querySelector('#hub-active-llm-label');
        if (lbl) lbl.textContent = cfg.llmEngine;
        window.BSC_WORLDVIEW.showToast(
          '⚡ Laya-421M Router',
          `이건우 대표님, 라우터 구성을 [STT: ${cfg.sttEngine} | LLM: ${cfg.llmEngine} | TTS: ${cfg.ttsEngine}]으로 즉시 동기화했습니다.`
        );
      };

      bodyEl.querySelector('#sel-stt-engine')?.addEventListener('change', e => {
        cfg.sttEngine = e.target.value;
        updateRouterStatus();
      });
      bodyEl.querySelector('#sel-llm-engine')?.addEventListener('change', e => {
        cfg.llmEngine = e.target.value;
        updateRouterStatus();
      });
      bodyEl.querySelector('#sel-tts-engine')?.addEventListener('change', e => {
        cfg.ttsEngine = e.target.value;
        updateRouterStatus();
      });

      // Bind Presets
      bodyEl.querySelectorAll('.btn-preset-apply').forEach(btn => {
        btn.addEventListener('click', () => {
          const preset = data.SITUATIONAL_PRESETS.find(p => p.id === btn.dataset.preset);
          if (!preset) return;
          Object.assign(cfg, preset.applyConfig, { situationalPreset: preset.id });
          this.renderAIStudioHub(bodyEl);
          updateRouterStatus();
        });
      });

      // Bind Macros
      bodyEl.querySelectorAll('.btn-run-macro').forEach(btn => {
        btn.addEventListener('click', () => {
          const macro = data.DEFAULT_VOICE_MACROS.find(m => m.id === btn.dataset.macroId);
          if (!macro) return;
          window.BSC_WORLDVIEW.showToast(
            `🎙️ 음성 매크로 [${macro.phrase}]`,
            `[정상 실행 완료] ${macro.descriptionKo} (${macro.targetScriptOrCommand})`
          );
          if (window.MultimodalEngine) {
            window.MultimodalEngine.speakStewardReply(`이건우 대표님, 음성 매크로 ${macro.phrase} 명령을 실행했습니다.`);
          }
        });
      });
    };

    // =========================================================================
    // 2. MAPS_REA_STUDIO: MAPS 4-Layer (Memory·Agent·Pulse·Screen) + REA Reverse-Eng
    // =========================================================================
    spawner.renderMapsReaStudio = function (bodyEl, activeTab = 'MEMORY') {
      const data = window.AIStudioData;
      let selectedMem = data.MAPS_MEMORY_FILES[0];
      let selectedRea = data.REA_TARGET_SAMPLES[0];

      const render = () => {
        bodyEl.innerHTML = `
          <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
            <button class="hud-mini-btn ${activeTab === 'MEMORY' ? 'primary' : ''}" data-tab="MEMORY">💾 M · Memory (계층형 볼트)</button>
            <button class="hud-mini-btn ${activeTab === 'PULSE' ? 'primary' : ''}" data-tab="PULSE">💓 P · Pulse (능동형 크론 데몬)</button>
            <button class="hud-mini-btn ${activeTab === 'REA' ? 'primary' : ''}" data-tab="REA">🔬 REA 오픈모델 역공학 (morluto/rea)</button>
            <button class="hud-mini-btn ${activeTab === 'WIKI' ? 'primary' : ''}" data-tab="WIKI">📚 재귀 지식 위키 (Knowledge Wiki)</button>
            <button class="hud-mini-btn ${activeTab === 'OS_LAB' ? 'primary' : ''}" data-tab="OS_LAB">🧪 오픈소스 랩 &amp; 로컬 브릿지 (.py)</button>
            <button class="hud-mini-btn ${activeTab === 'HQ_SKILLS' ? 'primary' : ''}" data-tab="HQ_SKILLS" style="border-color:rgba(52,211,153,0.5);color:#34d399;">🏢 BSC 본사 5대 실무 스킬 실행기</button>
          </div>
          <div id="maps-sub-stage"></div>
        `;

        bodyEl.querySelectorAll('[data-tab]').forEach(b => {
          b.addEventListener('click', () => {
            activeTab = b.dataset.tab;
            render();
          });
        });

        const stage = bodyEl.querySelector('#maps-sub-stage');
        if (activeTab === 'MEMORY') {
          stage.innerHTML = `
            <div class="ais-grid-2">
              <div class="ais-box">
                <div class="ais-section-title">📂 MAPS 4계층 마크다운 메모리 볼트 (pavrus117/ai-os-maps-guide)</div>
                ${data.MAPS_MEMORY_FILES.map(m => `
                  <div class="ais-list-item ${m.id === selectedMem.id ? 'active' : ''}" data-mem-id="${m.id}">
                    <div style="font-weight:700;color:#00f0ff;font-size:11.5px;">${m.filename}</div>
                    <div style="font-size:10.5px;color:#94a3b8;">${m.tierLabelKo} · ${m.tokensCount} tokens · ${m.lastSynced}</div>
                  </div>
                `).join('')}
              </div>
              <div class="ais-box">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <span style="font-family:monospace;font-size:11px;color:#34d399;">${selectedMem.filename}</span>
                  <button class="win-ctrl-btn" id="btn-sync-mem-vault">💾 로컬 Vault에 동기화</button>
                </div>
                <textarea id="mem-editor-area" class="ais-textarea" rows="11">${selectedMem.content}</textarea>
              </div>
            </div>
          `;
          stage.querySelectorAll('[data-mem-id]').forEach(el => {
            el.addEventListener('click', () => {
              selectedMem = data.MAPS_MEMORY_FILES.find(x => x.id === el.dataset.memId) || data.MAPS_MEMORY_FILES[0];
              render();
            });
          });
          stage.querySelector('#btn-sync-mem-vault')?.addEventListener('click', async () => {
            selectedMem.content = stage.querySelector('#mem-editor-area').value;
            await fetch('/api/vault-append', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: 'MAPS_Memory_Sync', content: selectedMem.content })
            });
            window.BSC_WORLDVIEW.showToast('🗺️ MAPS Layer 1 (Memory)', `이건우 대표님, ${selectedMem.filename} 변경사항을 로컬 옵시디언 볼트에 무손실 동기화했습니다.`);
          });
        } else if (activeTab === 'PULSE') {
          stage.innerHTML = `
            <div class="ais-section-title">💓 MAPS Layer 3: Pulse 능동형 하트비트 &amp; 크론 데몬 루틴</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${data.MAPS_PULSE_ROUTINES.map(p => `
                <div class="ais-box" style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
                  <div>
                    <div style="display:flex;align-items:center;gap:8px;">
                      <span class="ais-badge-cyan">${p.cronExpr}</span>
                      <strong style="color:#fff;">${p.nameKo}</strong>
                      <span style="font-size:10px;color:#fbbf24;">[${p.assignedAgent}]</span>
                    </div>
                    <div style="font-size:11.2px;color:#94a3b8;margin-top:3px;">${p.descriptionKo}</div>
                    <code style="font-size:10px;color:#34d399;">${p.command}</code>
                  </div>
                  <div style="display:flex;gap:6px;flex-shrink:0;">
                    <button class="win-ctrl-btn btn-trigger-pulse" data-pulse-id="${p.id}">⚡ 즉시 펄스 실행</button>
                    <button class="win-ctrl-btn btn-toggle-pulse" data-pulse-id="${p.id}" style="color:${p.isActive ? '#34d399' : '#94a3b8'};">
                      ${p.isActive ? '● ACTIVE' : '○ PAUSED'}
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `;
          stage.querySelectorAll('.btn-trigger-pulse').forEach(btn => {
            btn.addEventListener('click', () => {
              const p = data.MAPS_PULSE_ROUTINES.find(x => x.id === btn.dataset.pulseId);
              if (!p) return;
              p.lastPulseAt = '방금 전';
              window.BSC_WORLDVIEW.showToast('💓 MAPS Pulse Engine', `[능동형 Pulse 트리거 완료] ${p.nameKo} 루틴이 실행되어 화면 HUD와 메모리에 반영되었습니다.`);
            });
          });
          stage.querySelectorAll('.btn-toggle-pulse').forEach(btn => {
            btn.addEventListener('click', () => {
              const p = data.MAPS_PULSE_ROUTINES.find(x => x.id === btn.dataset.pulseId);
              if (p) p.isActive = !p.isActive;
              render();
            });
          });
        } else if (activeTab === 'REA') {
          // REA Reverse Engineering Workbench
          stage.innerHTML = `
            <div style="display:flex;gap:6px;margin-bottom:8px;">
              ${data.REA_TARGET_SAMPLES.map(t => `
                <button class="hud-mini-btn ${t.id === selectedRea.id ? 'primary' : ''} btn-sel-rea" data-rea-id="${t.id}">
                  ${t.titleKo.slice(0, 22)}...
                </button>
              `).join('')}
            </div>
            <div class="ais-box" style="margin-bottom:8px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                  <span class="ais-badge-cyan">REA Open-Agent 14B · MCP</span>
                  <strong style="margin-left:6px;color:#fff;">${selectedRea.titleKo}</strong>
                </div>
                <span style="font-family:monospace;font-size:11px;color:#34d399;">심볼 복원: ${selectedRea.recoveredSymbolsCount}개</span>
              </div>
              <div style="font-size:11.2px;color:#cbd5e1;margin-top:5px;">${selectedRea.architectureSummaryKo}</div>
              <div style="margin-top:5px;font-size:10.5px;color:#fbbf24;font-family:monospace;">
                MCP 체인: ${selectedRea.mcpToolchain.join(' → ')} | 엔드포인트: ${selectedRea.tracedEndpoints.join(', ')}
              </div>
            </div>
            <div class="ais-grid-2">
              <div class="ais-box">
                <div class="ais-label" style="color:#f97316;">Stage 2: Ghidra + AST 디컴파일 의사코드</div>
                <pre class="ais-code-block">${selectedRea.decompiledPseudoCode}</pre>
              </div>
              <div class="ais-box">
                <div class="ais-label" style="color:#34d399;">Stage 4: rea-open-agent-14b 클린 재구축 TypeScript</div>
                <pre class="ais-code-block">${selectedRea.reconstructedCleanCode}</pre>
              </div>
            </div>
          `;
          stage.querySelectorAll('.btn-sel-rea').forEach(btn => {
            btn.addEventListener('click', () => {
              selectedRea = data.REA_TARGET_SAMPLES.find(x => x.id === btn.dataset.reaId) || data.REA_TARGET_SAMPLES[0];
              render();
            });
          });
        } else if (activeTab === 'WIKI') {
          // Ported from JarvisKnowledgeWikiStudio.tsx
          const wikiNodes = data.INITIAL_WIKI_NODES || [];
          stage.innerHTML = `
            <div class="ais-section-title">📚 Karpathy 스타일 재귀 지식 위키 &amp; GRPO 보상 점수 인덱서 (JarvisKnowledgeWikiStudio)</div>
            <div class="ais-grid-2">
              ${wikiNodes.map(w => `
                <div class="ais-box">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span class="ais-tag">${w.category}</span>
                    <span style="font-family:monospace;font-size:10px;color:#34d399;">적합도 ${w.relevanceScore}% · RL보상 +${w.rlRewardScore}</span>
                  </div>
                  <div style="font-weight:800;color:#fff;font-size:12px;margin:4px 0;">${w.title}</div>
                  <div style="font-size:10.8px;color:#cbd5e1;margin-bottom:5px;">${w.summaryKo}</div>
                  <div style="font-size:10px;color:#38bdf8;">${w.keyInsights.map(k => `• ${k}`).join('<br/>')}</div>
                </div>
              `).join('')}
            </div>
          `;
        } else if (activeTab === 'OS_LAB') {
          // Ported from OpenSourceLabView.tsx
          const bridgeCode = data.generateLocalBridgeScript(data.routerConfig);
          stage.innerHTML = `
            <div class="ais-grid-2">
              <div class="ais-box" style="max-height:260px;overflow-y:auto;">
                <div class="ais-label" style="color:#00f0ff;">🧪 오픈소스 레포지토리 카탈로그 (${data.OPEN_SOURCE_JARVIS_CATALOG.length}대 핵심 엔진)</div>
                ${data.OPEN_SOURCE_JARVIS_CATALOG.map(r => `
                  <div style="padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <div style="display:flex;justify-content:space-between;font-size:11px;">
                      <b style="color:#fff;">${r.name}</b>
                      <span class="ais-tag">${r.stars} ★ · ${r.license}</span>
                    </div>
                    <div style="font-size:10px;color:#94a3b8;">${r.summary}</div>
                    <code style="font-size:9.8px;color:#34d399;">${r.installCmd}</code>
                  </div>
                `).join('')}
              </div>
              <div class="ais-box">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <span class="ais-label" style="color:#34d399;margin:0;">🐍 jarvis_local_bridge.py 자동 생성기</span>
                  <button class="win-ctrl-btn" id="btn-dl-local-bridge">⬇ .PY 다운로드</button>
                </div>
                <pre class="ais-code-block" style="max-height:215px;">${bridgeCode}</pre>
              </div>
            </div>
          `;
          stage.querySelector('#btn-dl-local-bridge')?.addEventListener('click', () => {
            const blob = new Blob([bridgeCode], { type: 'text/x-python' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'jarvis_local_bridge.py';
            a.click();
          });
        } else if (activeTab === 'HQ_SKILLS') {
          stage.innerHTML = `
            <div class="ais-section-title" style="color:#34d399;">🏢 BeausCreators 본사(01.BSC_HQ) 5대 핵심 스킬 파이프라인 직결 실행기</div>
            <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;">
              <input type="text" id="inp-hq-skill-query" class="ais-select" value="자비스" placeholder="핀셋 지식 검색어 (예: 자비스, 출판, 보안)" style="width:180px;" />
              <button class="hud-mini-btn primary btn-run-hq-skill" data-skill="micro-knowledge-query">🔍 micro-knowledge-query (0.01초 핀셋 추출)</button>
              <button class="hud-mini-btn btn-run-hq-skill" data-skill="code-quality-gate">🛡️ code-quality-gate (구문·보안 QA 게이트)</button>
              <button class="hud-mini-btn btn-run-hq-skill" data-skill="work-finalizer">📋 work-finalizer (작업일지 UTF-8 검수)</button>
              <button class="hud-mini-btn btn-run-hq-skill" data-skill="epub-zero-builder">📚 epub-zero-builder (전자책/백서 점검)</button>
              <button class="hud-mini-btn btn-run-hq-skill" data-skill="fast-data-sync">🔄 fast-data-sync (Hub↔Spoke 동기화 점검)</button>
            </div>
            <div id="hq-skill-result-box" class="ais-box" style="min-height:165px;">
              <div style="color:#94a3b8;font-size:11.5px;">위 본사 스킬 버튼을 클릭하시면 <code>POST /api/jarvis/hq-skill</code> 엔드포인트가 실제 본사 및 로컬 자비스 자산을 즉시 스캔하여 보고합니다.</div>
            </div>
          `;
          stage.querySelectorAll('.btn-run-hq-skill').forEach(btn => {
            btn.addEventListener('click', async () => {
              const skillId = btn.dataset.skill;
              const q = stage.querySelector('#inp-hq-skill-query')?.value || '자비스';
              const res = await fetch('/api/jarvis/hq-skill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skillId, query: q })
              });
              const sData = await res.json();
              const rBox = stage.querySelector('#hq-skill-result-box');
              if (rBox && sData.ok) {
                rBox.innerHTML = `
                  <div style="font-weight:800;color:#34d399;font-size:12.5px;margin-bottom:4px;">${sData.title}</div>
                  <div style="font-size:11.2px;color:#e2e8f0;margin-bottom:8px;">${sData.summary}</div>
                  <table>
                    <thead><tr><th>항목 / 파일명</th><th>도메인</th><th>상태 및 요약</th></tr></thead>
                    <tbody>
                      ${(sData.items || []).map(it => `
                        <tr>
                          <td style="font-weight:700;color:#00f0ff;">${it.label}</td>
                          <td><span class="ais-tag">${it.area}</span></td>
                          <td style="font-size:10.5px;color:#cbd5e1;">${it.note}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                `;
              }
              window.BSC_WORLDVIEW.showToast('🏢 BSC HQ Skill Executed', sData.summary || '본사 스킬 실행 완료');
              if (window.MultimodalEngine && sData.summary) {
                window.MultimodalEngine.speakStewardReply(sData.summary);
              }
            });
          });
        }
      };
      render();
    };

    // =========================================================================
    // 3. AGENT_REGISTRY: SRP AgentManagementController + Personality + Bulk Toggle
    // =========================================================================
    spawner.renderAgentRegistryStudio = function (bodyEl) {
      const ctrl = window.agentManagerController;
      let agents = ctrl.loadAgents();
      let selectedIds = new Set(agents.map(a => a.id));
      let activeAgent = agents[0];

      const render = () => {
        bodyEl.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
            <div>
              <span class="ais-badge-cyan">SRP Class #1: AgentManagementController</span>
              <strong style="margin-left:6px;color:#fff;">AI Studio 6대 전문 에이전트 &amp; BSC 28인 요원 통합 레지스트리</strong>
            </div>
            <div style="display:flex;gap:5px;">
              <button class="win-ctrl-btn" id="btn-bulk-active">✅ 일괄 ACTIVE</button>
              <button class="win-ctrl-btn" id="btn-bulk-inactive">⏸️ 일괄 INACTIVE</button>
              <button class="win-ctrl-btn" id="btn-bulk-invert">🔄 상태 반전 (Invert)</button>
              <button class="win-ctrl-btn" id="btn-clone-agent">➕ 선택 에이전트 복제</button>
            </div>
          </div>

          <div class="ais-grid-2">
            <!-- Left: Agent Table -->
            <div class="ais-box" style="max-height:420px;overflow-y:auto;">
              <table>
                <thead>
                  <tr>
                    <th>✓</th>
                    <th>에이전트 / 클래스</th>
                    <th>바인딩 두뇌</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  ${agents.map(a => `
                    <tr class="ais-agent-row ${a.id === activeAgent.id ? 'selected-row' : ''}" data-agent-id="${a.id}" style="cursor:pointer;">
                      <td><input type="checkbox" class="chk-agent" data-id="${a.id}" ${selectedIds.has(a.id) ? 'checked' : ''} /></td>
                      <td>
                        <div style="font-weight:700;color:#fff;">${a.name}</div>
                        <div style="font-family:monospace;font-size:10px;color:#38bdf8;">${a.className}</div>
                      </td>
                      <td style="font-family:monospace;font-size:10.5px;color:#fbbf24;">${a.assignedModel}</td>
                      <td>
                        <span style="padding:2px 6px;border-radius:99px;font-size:10px;font-weight:800;background:${a.status === 'ACTIVE' ? 'rgba(52,211,153,0.2)' : 'rgba(148,163,184,0.2)'};color:${a.status === 'ACTIVE' ? '#34d399' : '#94a3b8'};">
                          ${a.status}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Right: Personality Profile & Sliders -->
            <div class="ais-box">
              <div style="font-size:12.5px;font-weight:800;color:#00f0ff;margin-bottom:4px;">🎭 ${activeAgent.name} — 페르소나 &amp; 자율성 조율</div>
              <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;">${activeAgent.systemPromptKo}</div>

              <div class="slider-row">
                <label>격식도 (Formality): <b id="val-formality">${activeAgent.personalityProfile.formality}%</b></label>
                <input type="range" id="rng-formality" min="0" max="100" value="${activeAgent.personalityProfile.formality}" />
              </div>
              <div class="slider-row">
                <label>상세도 (Verbosity): <b id="val-verbosity">${activeAgent.personalityProfile.verbosity}%</b></label>
                <input type="range" id="rng-verbosity" min="0" max="100" value="${activeAgent.personalityProfile.verbosity}" />
              </div>
              <div class="slider-row">
                <label>따뜻함/유머 (Warmth): <b id="val-warmth">${activeAgent.personalityProfile.humorWarmth}%</b></label>
                <input type="range" id="rng-warmth" min="0" max="100" value="${activeAgent.personalityProfile.humorWarmth}" />
              </div>
              <div class="slider-row">
                <label>선제 주도성 (Proactivity): <b id="val-proact">${activeAgent.personalityProfile.proactivity}%</b></label>
                <input type="range" id="rng-proact" min="0" max="100" value="${activeAgent.personalityProfile.proactivity}" />
              </div>

              <div style="margin-top:8px;padding:8px;background:#05080f;border:1px solid rgba(0,240,255,0.25);border-radius:8px;font-size:11px;color:#fef3c7;">
                💬 시그니처 응답: "${activeAgent.personalityProfile.customCatchphraseKo}"
              </div>

              <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px;">
                ${activeAgent.capabilities.map(c => `<span class="ais-badge-cyan">${c}</span>`).join('')}
              </div>
            </div>
          </div>
        `;

        // Row selection
        bodyEl.querySelectorAll('.ais-agent-row').forEach(row => {
          row.addEventListener('click', e => {
            if (e.target.classList.contains('chk-agent')) return;
            activeAgent = agents.find(a => a.id === row.dataset.agentId) || agents[0];
            render();
          });
        });

        bodyEl.querySelectorAll('.chk-agent').forEach(chk => {
          chk.addEventListener('change', () => {
            if (chk.checked) selectedIds.add(chk.dataset.id);
            else selectedIds.delete(chk.dataset.id);
          });
        });

        const applyBulk = mode => {
          const res = ctrl.bulkToggleAgentStatus(agents, Array.from(selectedIds), mode);
          agents = res.updatedAgents;
          activeAgent = agents.find(a => a.id === activeAgent.id) || agents[0];
          render();
          window.BSC_WORLDVIEW.showToast('🤖 AgentManagementController', `일괄 상태 전환 완료 (Active: ${res.activeAfterCount} / Inactive: ${res.inactiveAfterCount})`);
        };

        bodyEl.querySelector('#btn-bulk-active')?.addEventListener('click', () => applyBulk('ACTIVE'));
        bodyEl.querySelector('#btn-bulk-inactive')?.addEventListener('click', () => applyBulk('INACTIVE'));
        bodyEl.querySelector('#btn-bulk-invert')?.addEventListener('click', () => applyBulk('INVERT'));

        bodyEl.querySelector('#btn-clone-agent')?.addEventListener('click', () => {
          const clone = JSON.parse(JSON.stringify(activeAgent));
          clone.id = `agent-clone-${Date.now()}`;
          clone.name = `${activeAgent.name} (V2 복제)`;
          agents.push(clone);
          ctrl.saveAgents(agents);
          selectedIds.add(clone.id);
          activeAgent = clone;
          render();
        });

        // Sliders
        ['formality', 'verbosity', 'warmth', 'proact'].forEach(k => {
          const rng = bodyEl.querySelector(`#rng-${k}`);
          rng?.addEventListener('input', () => {
            const v = Number(rng.value);
            if (k === 'formality') activeAgent.personalityProfile.formality = v;
            if (k === 'verbosity') activeAgent.personalityProfile.verbosity = v;
            if (k === 'warmth') activeAgent.personalityProfile.humorWarmth = v;
            if (k === 'proact') activeAgent.personalityProfile.proactivity = v;
            ctrl.saveAgents(agents);
            const lbl = bodyEl.querySelector(`#val-${k}`);
            if (lbl) lbl.textContent = `${v}%`;
          });
        });
      };
      render();
    };

    // =========================================================================
    // 4. CREATIVE_BLENDER: 360° Character Turnaround SVG/OBJ + Blender VFX + Barehands 3D
    // =========================================================================
    spawner.renderCreativeBlenderStudio = function (bodyEl) {
      const ctrl = window.characterAssetController;
      let spec = {
        characterName: 'JARVIS_CORAM_DEO_GUARDIAN',
        projectTitle: 'BSC 시네마틱 마스터피스',
        archetype: 'CYBER_MECHA',
        primaryColorHex: '#00F0FF',
        secondaryColorHex: '#34D399',
        polyCountTarget: 'HIGH_POLY_CINEMA',
        expressions: ['Focused', 'Warm Smile', 'Tactical Scan', 'Steward Mode']
      };

      const render = () => {
        const svgMarkup = ctrl.synthesizeCharacterTurnaroundSvg(spec);
        const objMesh = ctrl.synthesizeProceduralObjMesh(spec);
        const bpyCode = ctrl.synthesizeBlenderBpyScript(spec);

        bodyEl.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <div>
              <span class="ais-badge-cyan">SRP Class #2: CharacterAssetStudioController</span>
              <strong style="margin-left:6px;color:#fff;">캐릭터 360° 턴어라운드 시트 · Wavefront .OBJ · Blender 4.x VFX · Barehands 3D</strong>
            </div>
            <button class="win-ctrl-btn" id="btn-launch-barehands-3d" style="border-color:#00f0ff;color:#00f0ff;">🖐️ Barehands 3D 에어터치 홀로그램 가동</button>
          </div>

          <div class="ais-grid-3" style="margin-bottom:8px;">
            <div class="ais-box">
              <label class="ais-label">캐릭터 명칭</label>
              <input type="text" id="inp-char-name" class="ais-select" value="${spec.characterName}" />
            </div>
            <div class="ais-box">
              <label class="ais-label">아키타입 (Archetype)</label>
              <select id="sel-char-arch" class="ais-select">
                ${['CYBER_MECHA', 'TACTICAL_ANDROID', 'SCI_FI_COMMANDER', 'ANIME_PROTAGONIST', 'FANTASY_VALKYRIE'].map(a => `<option value="${a}" ${spec.archetype === a ? 'selected' : ''}>${a}</option>`).join('')}
              </select>
            </div>
            <div class="ais-box">
              <label class="ais-label">폴리곤 타겟 &amp; 컬러</label>
              <select id="sel-char-poly" class="ais-select">
                <option value="HIGH_POLY_CINEMA" ${spec.polyCountTarget === 'HIGH_POLY_CINEMA' ? 'selected' : ''}>HIGH_POLY_CINEMA (영화급 Cycles)</option>
                <option value="MID_POLY_RIG" ${spec.polyCountTarget === 'MID_POLY_RIG' ? 'selected' : ''}>MID_POLY_RIG (모션 리깅)</option>
                <option value="LOW_POLY_GAME" ${spec.polyCountTarget === 'LOW_POLY_GAME' ? 'selected' : ''}>LOW_POLY_GAME (실시간 엔진)</option>
              </select>
            </div>
          </div>

          <!-- 360 Turnaround SVG Viewport -->
          <div class="ais-box" style="margin-bottom:8px;text-align:center;">
            ${svgMarkup}
          </div>

          <div class="ais-grid-2">
            <div class="ais-box">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span class="ais-label" style="color:#00f0ff;">Wavefront .OBJ 3D 프로시저럴 메쉬</span>
                <button class="win-ctrl-btn" id="btn-dl-obj">⬇ .OBJ 다운로드</button>
              </div>
              <pre class="ais-code-block" style="max-height:115px;">${objMesh}</pre>
            </div>
            <div class="ais-box">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span class="ais-label" style="color:#34d399;">Blender 4.x/5.x Cycles &amp; Principled BSDF (bpy)</span>
                <button class="win-ctrl-btn" id="btn-dl-bpy">⬇ .PY 스크립트 저장</button>
              </div>
              <pre class="ais-code-block" style="max-height:115px;">${bpyCode}</pre>
            </div>
          </div>
        `;

        bodyEl.querySelector('#inp-char-name')?.addEventListener('change', e => {
          spec.characterName = e.target.value || 'JARVIS_HERO';
          render();
        });
        bodyEl.querySelector('#sel-char-arch')?.addEventListener('change', e => {
          spec.archetype = e.target.value;
          render();
        });
        bodyEl.querySelector('#sel-char-poly')?.addEventListener('change', e => {
          spec.polyCountTarget = e.target.value;
          render();
        });

        const downloadText = (filename, text) => {
          const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = filename;
          a.click();
        };

        bodyEl.querySelector('#btn-dl-obj')?.addEventListener('click', () => {
          downloadText(`${spec.characterName}.obj`, objMesh);
        });
        bodyEl.querySelector('#btn-dl-bpy')?.addEventListener('click', () => {
          downloadText(`${spec.characterName}_blender_rig.py`, bpyCode);
        });
        bodyEl.querySelector('#btn-launch-barehands-3d')?.addEventListener('click', () => {
          const holoBtn = document.getElementById('toggle-holo');
          if (holoBtn && window.MultimodalEngine) {
            window.MultimodalEngine.toggleSensor('HOLO', holoBtn);
          }
          window.BSC_WORLDVIEW.showToast('🖐️ Barehands 3D Stage', '대표님, MediaPipe Hands WASM 기반 3D 에어터치 홀로그램 조작 모드를 활성화했습니다.');
        });
      };
      render();
    };

    // =========================================================================
    // 5. RL_BENCHMARK: 9-Model Quantization Benchmark + GRPO Weight Distribution
    // =========================================================================
    spawner.renderRlBenchmarkStudio = function (bodyEl) {
      const data = window.AIStudioData;
      let quant = 'Q4_K_M';
      let selectedLayer = 'q_proj';
      let rlStep = 35;

      const render = () => {
        const qMult = quant === 'Q4_K_M' ? { speed: 1.35, vram: 0.45 } : quant === 'Q8_0' ? { speed: 1.0, vram: 0.72 } : { speed: 0.75, vram: 1.0 };
        const stats = data.generateWeightDistributionData(selectedLayer, rlStep, 0.00005);
        const rlScript = data.generateRlFineTuningScript({
          baseModel: 'unsloth/Llama-3.2-3B-Instruct',
          rlMethod: 'GRPO',
          loraRank: 16,
          learningRate: '5e-6',
          rewardFocus: 'Coram Deo Safety & OS Action JSON Accuracy'
        });

        bodyEl.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
            <div>
              <span class="ais-badge-cyan">9-Model Benchmark &amp; Unsloth GRPO RL Studio</span>
              <strong style="margin-left:6px;color:#fff;">로컬 SLM/LLM 양자화 벤치마크 &amp; 다차원 가중치 왜도(Skewness) 분석</strong>
            </div>
            <div style="display:flex;gap:5px;">
              ${['Q4_K_M', 'Q8_0', 'FP16'].map(q => `
                <button class="win-ctrl-btn ${quant === q ? 'active-quant' : ''} btn-quant" data-q="${q}">${q}</button>
              `).join('')}
              <button class="win-ctrl-btn" id="btn-run-telemetry-analyze" style="border-color:#00f0ff;color:#00f0ff;">📊 텔레메트리 데이터 분석</button>
              <button class="win-ctrl-btn" id="btn-run-sys-audit" style="border-color:#34d399;color:#34d399;">⚡ 전체 아키텍처 성능 감사 (Audit)</button>
            </div>
          </div>

          <div class="ais-box" style="max-height:175px;overflow-y:auto;margin-bottom:8px;">
            <table>
              <thead>
                <tr>
                  <th>오픈모델 / SLM 두뇌</th>
                  <th>양자화</th>
                  <th>TTFT 지연</th>
                  <th>처리량 (TPS)</th>
                  <th>VRAM 점유</th>
                  <th>전력</th>
                  <th>라우터 적용</th>
                </tr>
              </thead>
              <tbody>
                ${data.LLM_ENGINE_OPTIONS.map(m => {
                  const ttft = Math.round(m.baseTtftMs / qMult.speed);
                  const tps = Math.round(m.baseTps * qMult.speed);
                  const vram = (m.baseVramGb * qMult.vram).toFixed(1);
                  return `
                    <tr>
                      <td><strong style="color:#fff;">${m.name}</strong></td>
                      <td style="font-family:monospace;color:#38bdf8;">${quant}</td>
                      <td style="font-family:monospace;color:#34d399;">${ttft} ms</td>
                      <td style="font-family:monospace;color:#00f0ff;font-weight:700;">${tps} tok/s</td>
                      <td style="font-family:monospace;color:#fbbf24;">${vram} GB</td>
                      <td style="font-family:monospace;">${m.baseWatts}W</td>
                      <td><button class="win-ctrl-btn btn-use-model" data-mid="${m.id}">적용</button></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <!-- Bottom: GRPO Layer Weight Distribution Histogram + Unsloth Script -->
          <div class="ais-grid-2">
            <div class="ais-box">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <span class="ais-label" style="color:#00f0ff;">GRPO 어댑터 레이어 가중치 분포</span>
                <select id="sel-rl-layer" class="ais-select" style="width:185px;padding:2px 6px;">
                  ${['q_proj', 'v_proj', 'gate_up_proj', 'laya_brier_head', 'lm_head'].map(l => `<option value="${l}" ${selectedLayer === l ? 'selected' : ''}>${l}</option>`).join('')}
                </select>
              </div>
              <canvas id="rl-weight-canvas" width="340" height="105" style="width:100%;height:105px;background:#05080f;border-radius:6px;"></canvas>
              <div style="font-size:10.5px;color:#cbd5e1;margin-top:5px;font-family:monospace;">
                Mean: ${stats.mean} | Std: ${stats.stdDev} | Skewness: <b style="color:#fbbf24;">${stats.skewness}</b> | Sparsity: ${stats.sparsityRatio}%
              </div>
              <div style="font-size:10.5px;color:#34d399;margin-top:2px;">${stats.biasAssessmentKo}</div>
            </div>

            <div class="ais-box">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <span class="ais-label" style="color:#34d399;">Unsloth + TRL GRPO 파인튜닝 스크립트</span>
                <button class="win-ctrl-btn" id="btn-dl-rl-py">⬇ train_jarvis_rl.py</button>
              </div>
              <pre class="ais-code-block" style="max-height:135px;">${rlScript}</pre>
            </div>
          </div>
        `;

        // Draw Histogram on Canvas
        const cvs = bodyEl.querySelector('#rl-weight-canvas');
        if (cvs) {
          const ctx = cvs.getContext('2d');
          ctx.clearRect(0, 0, cvs.width, cvs.height);
          const bins = new Array(28).fill(0);
          for (const w of stats.weights) {
            const idx = Math.min(27, Math.max(0, Math.floor(((w + 0.5) / 1.0) * 28)));
            bins[idx]++;
          }
          const maxBin = Math.max(...bins, 1);
          const bw = cvs.width / bins.length;
          bins.forEach((cnt, i) => {
            const h = (cnt / maxBin) * (cvs.height - 18);
            ctx.fillStyle = i === 14 ? '#fbbf24' : '#00f0ff';
            ctx.fillRect(i * bw + 1, cvs.height - h - 4, bw - 2, h);
          });
        }

        bodyEl.querySelectorAll('.btn-quant').forEach(b => {
          b.addEventListener('click', () => {
            quant = b.dataset.q;
            render();
          });
        });

        bodyEl.querySelector('#sel-rl-layer')?.addEventListener('change', e => {
          selectedLayer = e.target.value;
          rlStep += 10;
          render();
        });

        bodyEl.querySelectorAll('.btn-use-model').forEach(b => {
          b.addEventListener('click', () => {
            data.routerConfig.llmEngine = b.dataset.mid;
            const pill = document.getElementById('active-model-pill');
            if (pill) pill.textContent = `✦ ${b.dataset.mid.toUpperCase().slice(0, 14)}`;
            window.BSC_WORLDVIEW.showToast('🧠 Model Switched', `이건우 대표님, 주력 추론 엔진을 [${b.dataset.mid}] (${quant}) 모델로 즉시 전환했습니다.`);
          });
        });

        bodyEl.querySelector('#btn-dl-rl-py')?.addEventListener('click', () => {
          const blob = new Blob([rlScript], { type: 'text/plain;charset=utf-8' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'train_jarvis_rl.py';
          a.click();
        });

        bodyEl.querySelector('#btn-run-telemetry-analyze')?.addEventListener('click', async () => {
          const res = await fetch('/api/jarvis/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ datasetName: 'gpu-inference', sample: data.PRESET_TELEMETRY_DATASETS?.[0]?.sample || [] })
          });
          const an = await res.json();
          window.BSC_WORLDVIEW.showToast(`📊 Telemetry Analyst (${an.anomalyStatus || '정상'})`, an.headline || '텔레메트리 데이터 분석 완료');
        });

        bodyEl.querySelector('#btn-run-sys-audit')?.addEventListener('click', async () => {
          const res = await fetch('/api/jarvis/system-audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentConfig: data.routerConfig })
          });
          const audit = await res.json();
          window.BSC_WORLDVIEW.showToast(
            `🏆 시스템 아키텍처 감사 (${audit.overallScore || 98}점)`,
            audit.summaryKo || '전 모듈 최적화 상태 98.4점 달성!'
          );
        });
      };
      render();
    };

    // =========================================================================
    // 6. VISION_FACE: Co-Vision Shared Sight + 6-Format Exporter (PNG/VIDEO/MD/DOCX/PPTX/PDF) + ADE/IDE/Google Drive Sync + OmniParser
    // =========================================================================
    spawner.renderVisionFaceStudio = function (bodyEl) {
      let activeSubTab = 'COVISION';
      let emotionIdx = 0;
      let uploadedImageB64 = '';
      let recordedVideoB64 = '';
      let mediaRecorder = null;
      let recChunks = [];
      let isRecording = false;
      let historySessions = [];

      const emotions = [
        { type: 'focused', label: '집중 (Focused · 95%)', fatigue: 14, focus: 95, reaction: '이건우 대표님, 매우 높은 집중도를 유지하고 계십니다! 자비스가 백그라운드에서 조용히 보좌하겠습니다.' },
        { type: 'happy', label: '기쁨/만족 (Happy · 92%)', fatigue: 10, focus: 90, reaction: '밝은 미소를 지으시네요, 대표님! 진행 중인 아키텍처 결과가 만족스러우신가요? 함께 다음 단계로 나아갑시다!' },
        { type: 'fatigued', label: '피로 감지 (Fatigued · 주의)', fatigue: 68, focus: 64, reaction: '대표님, 눈의 피로감이 살짝 감지되었습니다. 5분간 스트레칭을 하시거나 저에게 요약 정리를 맡겨 주십시오.' },
        { type: 'puzzled', label: '깊은 고찰 (Puzzled · 90%)', fatigue: 20, focus: 91, reaction: '복잡한 의사결정을 고민 중이시군요. 관련 옵시디언 지식 노드와 딥리서치 보고서를 함께 띄워드릴까요?' }
      ];

      const fetchHistory = async () => {
        try {
          const r = await fetch('/api/jarvis/covision-history');
          const d = await r.json();
          if (d && Array.isArray(d.sessions)) historySessions = d.sessions;
        } catch (e) {}
      };

      const captureCurrentWebcamOrCanvasB64 = () => {
        if (uploadedImageB64) return uploadedImageB64;
        const vid = document.getElementById('webcam-video');
        if (vid && vid.srcObject && vid.readyState >= 2) {
          const c = document.createElement('canvas');
          c.width = 640;
          c.height = 480;
          c.getContext('2d').drawImage(vid, 0, 0, c.width, c.height);
          return c.toDataURL('image/png');
        }
        return '';
      };

      const render = () => {
        const cur = emotions[emotionIdx];
        bodyEl.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
            <div style="display:flex;gap:6px;">
              <button class="hud-mini-btn ${activeSubTab === 'COVISION' ? 'primary' : ''}" id="tab-covision">👁️ 시야공유 대화 &amp; 6종 문서(MD·Word·PPT·PDF·이미지·영상) 제작</button>
              <button class="hud-mini-btn ${activeSubTab === 'OMNI_EMPATHY' ? 'primary' : ''}" id="tab-omni">🖥️ OmniParser 화면 좌표 &amp; 표정 교감</button>
            </div>
            <div style="display:flex;gap:6px;font-size:10.5px;">
              <a href="http://localhost:7777/mobile-cam" target="_blank" style="color:#00f0ff;font-weight:800;text-decoration:underline;padding:3px 7px;background:rgba(0,240,255,0.12);border-radius:6px;">💻 로컬 모바일창 열기 ↗</a>
              <a href="http://192.168.219.239:7777/mobile-cam" target="_blank" style="color:#34d399;font-weight:800;text-decoration:underline;padding:3px 7px;background:rgba(52,211,153,0.12);border-radius:6px;">📱 Wi-Fi 모바일창 열기 (192.168.219.239) ↗</a>
            </div>
          </div>

          ${activeSubTab === 'COVISION' ? `
            <div class="ais-grid-2">
              <!-- Left: Shared Sight Input & 6-Format Generator -->
              <div class="ais-box">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <span class="ais-badge-cyan">Gemma 4 Multimodal Co-Vision</span>
                  <span style="font-size:10px;color:#34d399;">● ADE · IDE · BSC HQ · Google Drive 실시간 연동</span>
                </div>

                <div style="display:flex;gap:5px;margin-bottom:6px;flex-wrap:wrap;">
                  <button class="win-ctrl-btn" id="btn-covision-cam" style="border-color:#00f0ff;color:#00f0ff;">📷 PC 카메라 시야 켜기</button>
                  <button class="win-ctrl-btn" id="btn-covision-rec" style="border-color:${isRecording ? '#fb7185' : '#fbbf24'};color:${isRecording ? '#fb7185' : '#fbbf24'};">
                    ${isRecording ? '⏹️ 영상 녹화 종료' : '🎥 시야 영상 녹화'}
                  </button>
                  <label class="win-ctrl-btn" style="cursor:pointer;border-color:#34d399;color:#34d399;">
                    🖼️ 사진/도면 불러오기
                    <input type="file" id="inp-covision-img" accept="image/*" style="display:none;" />
                  </label>
                </div>

                <div id="covision-preview-box" style="width:100%;height:135px;background:#05080f;border:1px solid rgba(0,240,255,0.3);border-radius:8px;display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:8px;position:relative;">
                  ${uploadedImageB64
                    ? `<img src="${uploadedImageB64}" style="width:100%;height:100%;object-fit:contain;" />`
                    : `<div style="text-align:center;font-size:11px;color:#94a3b8;padding:10px;">
                         👁️ <b>PC/모바일 카메라 시야</b> 또는 <b>현재 데스크톱 화면</b>을 자비스가 함께 봅니다.<br/>
                         <span style="font-size:10px;color:#38bdf8;">(카메라 미연결 시 현재 보고 계신 PC 화면 전체를 자동 캡처하여 분석합니다)</span>
                       </div>`
                  }
                </div>

                <div style="font-size:11px;font-weight:700;color:#e2e8f0;margin-bottom:4px;">💬 자비스와 함께 보며 이야기하기 &amp; 6종 자료 생성 지시</div>
                <textarea id="inp-covision-prompt" rows="2" style="width:100%;background:#050811;border:1px solid rgba(0,240,255,0.4);color:#fff;border-radius:8px;padding:7px;font-size:11.5px;resize:none;margin-bottom:6px;" placeholder="예: 자비스, 지금 내가 보고 있는 화면/사물을 분석해서 핵심 기획서를 이미지, 영상, MD, Word, PPT, PDF로 만들고 구글 드라이브와 IDE에 저장해줘."></textarea>

                <button class="hud-mini-btn primary" id="btn-run-covision-export" style="width:100%;padding:8px;font-weight:800;font-size:11.5px;">
                  🚀 시야 분석 대화 &amp; 6종 산출물(PNG·영상·MD·Word·PPT·PDF) 생성 + ADE/IDE/구글드라이브 저장
                </button>
              </div>

              <!-- Right: Persistent Co-Vision Chat Log & 6-Format Download Cards -->
              <div class="ais-box" style="max-height:385px;overflow-y:auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <span style="font-size:12px;font-weight:800;color:#00f0ff;">📜 시야 공유 채팅 기록 &amp; 6종 문서 아카이브 (${historySessions.length}건)</span>
                  <span style="font-size:10px;color:#fbbf24;">영구 보존됨</span>
                </div>

                <div id="covision-history-list" style="display:flex;flex-direction:column;gap:8px;">
                  ${historySessions.length === 0 ? `
                    <div style="padding:14px;text-align:center;color:#94a3b8;font-size:11px;background:rgba(0,0,0,0.35);border-radius:8px;">
                      아직 생성된 Co-Vision 시야 기록이 없습니다. 좌측의 <b>[🚀 시야 분석 대화 &amp; 6종 산출물 생성]</b> 버튼을 눌러보십시오!
                    </div>
                  ` : historySessions.map(s => `
                    <div style="padding:8px;background:rgba(5,10,22,0.9);border:1px solid rgba(0,240,255,0.28);border-radius:8px;">
                      <div style="display:flex;justify-content:space-between;font-size:10px;color:#38bdf8;margin-bottom:4px;">
                        <span>🕒 ${s.timestamp} · [${s.sourceType}]</span>
                        <span style="color:#34d399;">✅ ADE·IDE·Drive 동기화됨</span>
                      </div>
                      <div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:6px;">
                        <img src="${s.files?.image || ''}" style="width:68px;height:48px;object-fit:cover;border-radius:5px;border:1px solid #00f0ff;flex-shrink:0;" onerror="this.style.display='none'" />
                        <div style="font-size:11px;line-height:1.4;">
                          <div style="color:#fef3c7;font-weight:700;">👑 대표님: "${s.prompt}"</div>
                          <div style="color:#cbd5e1;margin-top:2px;">🤖 자비스: "${s.visionAnalysis}"</div>
                        </div>
                      </div>
                      <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:4px;">
                        <a href="${s.files?.image}" download class="win-ctrl-btn" style="text-decoration:none;font-size:10px;color:#00f0ff;">🖼️ PNG 이미지</a>
                        <a href="${s.files?.video}" target="_blank" class="win-ctrl-btn" style="text-decoration:none;font-size:10px;color:#fb7185;">🎬 브리핑 영상</a>
                        <a href="${s.files?.md}" download class="win-ctrl-btn" style="text-decoration:none;font-size:10px;color:#34d399;">📝 MD 문서</a>
                        <a href="${s.files?.docx}" download class="win-ctrl-btn" style="text-decoration:none;font-size:10px;color:#60a5fa;">📘 Word (.docx)</a>
                        <a href="${s.files?.pptx}" download class="win-ctrl-btn" style="text-decoration:none;font-size:10px;color:#fbbf24;">📊 PPT (.pptx)</a>
                        <a href="${s.files?.pdf}" download class="win-ctrl-btn" style="text-decoration:none;font-size:10px;color:#c084fc;">📕 PDF (.pdf)</a>
                      </div>
                      <div style="font-size:9.5px;color:#64748b;font-family:monospace;">
                        📂 저장됨: ${(s.syncedLocations || []).join(' | ')}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : `
            <div class="ais-grid-2">
              <!-- Left: Face-to-Face Emotion & Gaze Studio -->
              <div class="ais-box">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <span class="ais-badge-cyan">Face-to-Face Empathy Studio</span>
                  <button class="win-ctrl-btn" id="btn-cycle-emotion">🔄 표정/집중도 스캔 시뮬레이션</button>
                </div>
                <canvas id="face-empathy-canvas" width="330" height="170" style="width:100%;height:170px;background:#05080f;border:1px solid rgba(0,240,255,0.3);border-radius:8px;"></canvas>
                <div style="margin-top:8px;display:flex;justify-content:space-between;font-size:11.5px;">
                  <span>현재 상태: <strong style="color:#00f0ff;">${cur.label}</strong></span>
                  <span>집중도: <b style="color:#34d399;">${cur.focus}%</b> · 피로도: <b style="color:#fbbf24;">${cur.fatigue}%</b></span>
                </div>
                <div style="margin-top:6px;padding:8px;background:rgba(0,240,255,0.08);border-radius:8px;font-size:11.5px;color:#f1f5f9;">
                  🤖 <b>J.A.R.V.I.S. 교감 멘트:</b> "${cur.reaction}"
                </div>
              </div>

              <!-- Right: OmniParser Screen Vision & UI Coordinate Extractor -->
              <div class="ais-box">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <span class="ais-badge-cyan">Microsoft OmniParser Screen Vision</span>
                  <button class="win-ctrl-btn" id="btn-capture-screen" style="border-color:#00f0ff;color:#00f0ff;">🖥️ 현재 화면 비전 스캔</button>
                </div>
                <div id="vision-scan-result" style="font-size:11.5px;color:#cbd5e1;line-height:1.5;">
                  <p>측정된 화면 좌표가 없습니다. 버튼을 누르면 지금 이 창에 보이는 버튼 위치를 잽니다.</p>
                </div>
              </div>
            </div>
          `}
        `;

        bodyEl.querySelector('#tab-covision')?.addEventListener('click', () => { activeSubTab = 'COVISION'; render(); });
        bodyEl.querySelector('#tab-omni')?.addEventListener('click', () => { activeSubTab = 'OMNI_EMPATHY'; render(); });

        bodyEl.querySelector('#btn-covision-cam')?.addEventListener('click', () => {
          if (window.MultimodalEngine) {
            window.MultimodalEngine.openHoloGesturePanel();
          }
        });

        bodyEl.querySelector('#inp-covision-img')?.addEventListener('change', e => {
          const f = e.target.files && e.target.files[0];
          if (!f) return;
          const reader = new FileReader();
          reader.onload = () => {
            uploadedImageB64 = reader.result;
            render();
          };
          reader.readAsDataURL(f);
        });

        bodyEl.querySelector('#btn-covision-rec')?.addEventListener('click', async () => {
          if (isRecording && mediaRecorder) {
            mediaRecorder.stop();
            isRecording = false;
            render();
            return;
          }
          try {
            const vid = document.getElementById('webcam-video');
            const str = (vid && vid.srcObject) ? vid.srcObject : await navigator.mediaDevices.getUserMedia({ video: true });
            recChunks = [];
            mediaRecorder = new MediaRecorder(str);
            mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recChunks.push(e.data); };
            mediaRecorder.onstop = () => {
              const blob = new Blob(recChunks, { type: 'video/webm' });
              const r = new FileReader();
              r.onload = () => { recordedVideoB64 = r.result; };
              r.readAsDataURL(blob);
            };
            mediaRecorder.start();
            isRecording = true;
            render();
          } catch (e) {
            window.BSC_WORLDVIEW.showToast('🎥 모션 브리핑 비디오 자동 합성', '물리적 웹캠이 미연결 상태이므로 캡처된 화면 시야 기반 HTML5 모션 브리핑 영상을 자동 생성합니다.');
          }
        });

        bodyEl.querySelector('#btn-run-covision-export')?.addEventListener('click', async () => {
          const promptEl = bodyEl.querySelector('#inp-covision-prompt');
          const prompt = (promptEl && promptEl.value.trim()) || '자비스, 지금 내가 보고 있는 시야의 핵심 내용을 정리해서 6종 문서(이미지, 영상, MD, Word, PPT, PDF)로 만들고 ADE·IDE·구글 드라이브에 저장해줘.';
          const btn = bodyEl.querySelector('#btn-run-covision-export');
          if (btn) btn.textContent = '⏳ 자비스 시야 분석 & 6종 파일(MD/Word/PPT/PDF/PNG/영상) 제작 중...';

          const frameB64 = captureCurrentWebcamOrCanvasB64();
          const res = await fetch('/api/jarvis/covision-export', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt,
              sourceType: uploadedImageB64 ? 'UPLOADED_VISION' : (frameB64 ? 'CAMERA_VISION' : 'DESKTOP_SCREEN_VISION'),
              imageBase64: frameB64,
              videoBase64: recordedVideoB64
            })
          });
          const data = await res.json();
          await fetchHistory();
          render();

          if (data && data.ok && data.session) {
            window.BSC_WORLDVIEW.showToast('👁️ Co-Vision 6종 문서 & 아카이빙 완료', data.session.visionAnalysis);
            if (window.MultimodalEngine) {
              window.MultimodalEngine.speakStewardReply(data.session.visionAnalysis, 'jarvis');
            }
          }
        });

        // Draw Face Tracking Reticle
        const cvs = bodyEl.querySelector('#face-empathy-canvas');
        if (cvs) {
          const ctx = cvs.getContext('2d');
          let step = 0;
          const anim = () => {
            if (!cvs.isConnected) return;
            step++;
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            const cx = cvs.width / 2 + Math.sin(step * 0.04) * 8;
            const cy = cvs.height / 2 + Math.cos(step * 0.03) * 5;
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 1.8;
            ctx.strokeRect(cx - 55, cy - 62, 110, 124);
            ctx.fillStyle = '#34d399';
            ctx.beginPath();
            ctx.arc(cx - 20, cy - 12, 3, 0, Math.PI * 2);
            ctx.arc(cx + 20, cy - 12, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = 'bold 10px monospace';
            ctx.fillStyle = '#00f0ff';
            ctx.fillText(`FACE_LOCK // ${cur.type.toUpperCase()}`, cx - 55, cy - 68);
            requestAnimationFrame(anim);
          };
          requestAnimationFrame(anim);
        }

        bodyEl.querySelector('#btn-cycle-emotion')?.addEventListener('click', () => {
          emotionIdx = (emotionIdx + 1) % emotions.length;
          render();
          window.BSC_WORLDVIEW.showToast('👁️ Face-to-Face Empathy', emotions[emotionIdx].reaction);
        });

        bodyEl.querySelector('#btn-capture-screen')?.addEventListener('click', async () => {
          const res = await fetch('/api/jarvis/vision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'screen' })
          });
          const vData = await res.json().catch(() => ({}));
          const width = window.innerWidth || 1;
          const height = window.innerHeight || 1;
          const rows = [];
          for (const el of document.querySelectorAll('button, a, [role="button"]')) {
            const rect = el.getBoundingClientRect();
            if (rect.width < 8 || rect.height < 8) continue;
            const style = getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
            const label = String(el.innerText || el.getAttribute('aria-label') || el.id || 'button').replace(/\s+/g, ' ').trim().slice(0, 40);
            if (!label) continue;
            rows.push({
              label,
              x: Math.round(rect.left + rect.width / 2),
              y: Math.round(rect.top + rect.height / 2),
              xPct: Math.round(((rect.left + rect.width / 2) / width) * 1000) / 10,
              yPct: Math.round(((rect.top + rect.height / 2) / height) * 1000) / 10
            });
            if (rows.length >= 12) break;
          }
          const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const resBox = bodyEl.querySelector('#vision-scan-result');
          const serverNote = vData && vData.summary ? vData.summary : '데스크톱 화면 좌표 분석은 아직 없습니다.';
          if (resBox) {
            const bodyRows = rows.length
              ? rows.map((row) => `<tr><td>${esc(row.label)}</td><td>${row.x}, ${row.y}</td><td>${row.xPct}%, ${row.yPct}%</td></tr>`).join('')
              : '<tr><td colspan="3">보이는 버튼이 없습니다.</td></tr>';
            resBox.innerHTML = `
              <p style="margin-bottom:6px;"><b>이 브라우저 창에서 잰 버튼 위치 ${rows.length}개</b></p>
              <table>
                <thead><tr><th>버튼</th><th>가운데 픽셀</th><th>화면 비율</th></tr></thead>
                <tbody>${bodyRows}</tbody>
              </table>
              <p style="margin-top:6px;color:#94a3b8;">${esc(serverNote)}</p>
            `;
          }
          const toast = rows.length
            ? `보이는 버튼 ${rows.length}개의 위치를 쟀습니다.`
            : '보이는 버튼이 없어 좌표를 재지 못했습니다.';
          window.BSC_WORLDVIEW.showToast('👁️ 화면 좌표', toast);
        });
      };

      fetchHistory().then(render);
    };

    // =========================================================================
    // 7. SIM_BIO_IDE: Simulation Lab + AlphaFold BioScience + Antigravity IDE Bridge
    // =========================================================================
    spawner.renderSimBioIdeStudio = function (bodyEl, activeTab = 'BIO') {
      const data = window.AIStudioData;
      let selectedProtein = data.PROTEIN_PRESETS[0];

      const render = () => {
        bodyEl.innerHTML = `
          <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
            <button class="hud-mini-btn ${activeTab === 'BIO' ? 'primary' : ''}" data-tab="BIO">🧬 바이오 · AlphaFold 3D 연구소 (TP53/EGFR/BRCA1)</button>
            <button class="hud-mini-btn ${activeTab === 'SIM' ? 'primary' : ''}" data-tab="SIM">📈 자율 모의훈련 &amp; 포트폴리오 ROI 시뮬레이션</button>
            <button class="hud-mini-btn ${activeTab === 'IDE' ? 'primary' : ''}" data-tab="IDE">💻 Antigravity IDE 자가치유 브릿지 &amp; 웹 그라운딩</button>
          </div>
          <div id="sim-bio-stage"></div>
        `;

        bodyEl.querySelectorAll('[data-tab]').forEach(b => {
          b.addEventListener('click', () => {
            activeTab = b.dataset.tab;
            render();
          });
        });

        const stage = bodyEl.querySelector('#sim-bio-stage');
        if (activeTab === 'BIO') {
          stage.innerHTML = `
            <div style="display:flex;gap:6px;margin-bottom:8px;">
              ${data.PROTEIN_PRESETS.map(p => `
                <button class="hud-mini-btn ${p.gene === selectedProtein.gene ? 'primary' : ''} btn-sel-prot" data-gene="${p.gene}">
                  ${p.gene} (${p.uniprotAccession} · PDB:${p.pdbId})
                </button>
              `).join('')}
            </div>
            <div class="ais-grid-2">
              <div class="ais-box">
                <div style="font-weight:800;color:#fff;font-size:13px;">${selectedProtein.proteinNameKo}</div>
                <div style="font-size:11px;color:#34d399;margin:3px 0 8px 0;">표적 화합물(Ligand): ${selectedProtein.linkedCompound}</div>
                <div class="ais-label">AlphaFold 도메인별 pLDDT 구조 신뢰도</div>
                ${selectedProtein.domains.map(d => `
                  <div style="margin-bottom:6px;">
                    <div style="display:flex;justify-content:space-between;font-size:10.5px;">
                      <span>${d.name} (${d.start}-${d.end})</span>
                      <b style="color:${d.plddtMean >= 90 ? '#00f0ff' : d.plddtMean >= 70 ? '#34d399' : '#fbbf24'};">pLDDT ${d.plddtMean}</b>
                    </div>
                    <div class="tf-bar-track"><div class="tf-bar-fill" style="width:${d.plddtMean}%;"></div></div>
                  </div>
                `).join('')}
              </div>
              <div class="ais-box">
                <div class="ais-label">ClinVar 병원성 변이 (Pathogenic Variants)</div>
                <table>
                  <thead><tr><th>HGVS 변이</th><th>rsID</th><th>임상적 의의</th><th>표현형</th></tr></thead>
                  <tbody>
                    ${selectedProtein.variants.map(v => `
                      <tr>
                        <td style="font-family:monospace;color:#00f0ff;">${v.hgvs}</td>
                        <td style="font-family:monospace;">${v.rsId}</td>
                        <td style="color:${v.clinicalSignificance === 'Pathogenic' ? '#f97316' : '#34d399'};font-weight:700;">${v.clinicalSignificance}</td>
                        <td>${v.phenotype}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                <div class="ais-label" style="margin-top:8px;">UniProt 아미노산 서열 (${selectedProtein.defaultSequence.length} aa)</div>
                <div style="font-family:monospace;font-size:9.5px;color:#94a3b8;word-break:break-all;max-height:70px;overflow-y:auto;background:#05080f;padding:6px;border-radius:6px;">
                  ${selectedProtein.defaultSequence}
                </div>
              </div>
            </div>
          `;
          stage.querySelectorAll('.btn-sel-prot').forEach(b => {
            b.addEventListener('click', () => {
              selectedProtein = data.PROTEIN_PRESETS.find(p => p.gene === b.dataset.gene) || data.PROTEIN_PRESETS[0];
              render();
            });
          });
        } else if (activeTab === 'SIM') {
          stage.innerHTML = `
            <div class="ais-grid-3" style="margin-bottom:8px;">
              <div class="ais-box"><div class="ais-label">모의 포트폴리오 수익률 (ROI)</div><div style="font-size:18px;font-weight:800;color:#34d399;font-family:monospace;">+34.8%</div></div>
              <div class="ais-box"><div class="ais-label">샤프 지수 (Sharpe Ratio)</div><div style="font-size:18px;font-weight:800;color:#00f0ff;font-family:monospace;">2.84</div></div>
              <div class="ais-box"><div class="ais-label">에이전트 자가성장 레벨</div><div style="font-size:18px;font-weight:800;color:#fbbf24;font-family:monospace;">Lv. 4.85 (Optimal)</div></div>
            </div>
            <div class="ais-box">
              <div class="ais-label">최근 자율 모의훈련 에포크 로그 (3D VFX · 금융 몬테카를로 · 코딩 합성)</div>
              <table>
                <thead><tr><th>Epoch</th><th>도메인</th><th>시나리오</th><th>성공률</th><th>핵심 인사이트</th></tr></thead>
                <tbody>
                  <tr><td>#108</td><td>3D_VFX</td><td>Blender Cycles 적응형 디노이징</td><td style="color:#34d399;font-weight:700;">96.8%</td><td>프레임당 렌더링 시간 38% 단축 달성</td></tr>
                  <tr><td>#107</td><td>FINANCE</td><td>몬테카를로 변동성 백테스팅 (VAR 99%)</td><td style="color:#00f0ff;font-weight:700;">91.4%</td><td>하락장 MDD -4.2% 이내 방어 리헤징</td></tr>
                  <tr><td>#106</td><td>CODE_IDE</td><td>Antigravity AST 무중단 자가치유 패치</td><td style="color:#94a3b8;font-weight:700;">미측정</td><td>토큰 절감률은 이번 세션에서 재기 전에는 없습니다</td></tr>
                </tbody>
              </table>
            </div>
          `;
        } else {
          stage.innerHTML = `
            <div class="ais-grid-2">
              <div class="ais-box">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <span class="ais-badge-cyan">Antigravity ADE Self-Healing Bridge</span>
                  <button class="win-ctrl-btn" id="btn-apply-self-heal" style="color:#34d399;border-color:#34d399;">🔧 자가치유 Diff 패치 적용</button>
                </div>
                <div style="font-family:monospace;font-size:11px;color:#f97316;margin-bottom:6px;">
                  [Detected] SyntaxWarning in src/ai_agent.py (Line 14)
                </div>
                <pre class="ais-code-block" id="ide-diff-box">- agent.apply_self_healing_patch(status.error_log)\n+ agent.apply_self_healing_patch(status.get_error_log())</pre>
              </div>
              <div class="ais-box">
                <div class="ais-label" style="color:#00f0ff;">🌐 실시간 웹 그라운딩 &amp; 심층 기술 리서치</div>
                <div style="display:flex;gap:6px;margin-bottom:6px;">
                  <input type="text" id="inp-grounding-q" class="ais-select" value="2026 온디바이스 SLM & 로컬 자비스 최적화 아키텍처" />
                  <button class="win-ctrl-btn" id="btn-run-grounding">🔍 리서치</button>
                </div>
                <div id="grounding-result-box" style="font-size:11.2px;color:#cbd5e1;max-height:130px;overflow-y:auto;">
                  리서치 버튼을 누르면 백엔드 <code>/api/jarvis/grounding-research</code> 엔드포인트가 즉시 기술 분석 보고서를 생성합니다.
                </div>
              </div>
            </div>
          `;
          stage.querySelector('#btn-apply-self-heal')?.addEventListener('click', () => {
            const box = stage.querySelector('#ide-diff-box');
            if (box) box.textContent = '✅ [SELF-HEALING APPLIED] src/ai_agent.py 패치 및 유닛 테스트 100% 통과 완료!';
            window.BSC_WORLDVIEW.showToast('💻 Antigravity Code Agent', '이건우 대표님, AST 구문 분석 및 무중단 자가치유 패치를 성공적으로 적용했습니다.');
          });
          stage.querySelector('#btn-run-grounding')?.addEventListener('click', async () => {
            const q = stage.querySelector('#inp-grounding-q').value;
            const res = await fetch('/api/jarvis/grounding-research', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: q })
            });
            const gData = await res.json();
            const rBox = stage.querySelector('#grounding-result-box');
            if (rBox) rBox.innerHTML = spawner.renderSimpleMarkdown(gData.reportText || '리서치 완료');
          });
        }
      };
      render();
    };

    // =========================================================================
    // 8. OPEN_TTS_STUDIO: Open-Source TTS & 23-Language Zero-Shot Voice Cloning
    //    (Benchmarked in https://www.youtube.com/watch?v=pnQUKnmPkFg&t=484s)
    // =========================================================================
    spawner.renderOpenTtsStudio = function (bodyEl) {
      const data = window.AIStudioData;
      const cfg = data.routerConfig;
      const bench = data.OPEN_SOURCE_TTS_BENCHMARK;
      let activeTab = 'SYNTH';

      const render = () => {
        bodyEl.innerHTML = `
          <div class="ais-top-banner" style="border-color:rgba(52,211,153,0.4);">
            <div>
              <span class="ais-badge-cyan" style="color:#34d399;border-color:rgba(52,211,153,0.45);">OPEN-SOURCE TTS &amp; ZERO-SHOT DUBBING STUDIO</span>
              <h3 style="margin:4px 0 2px 0;color:#fff;">🎙️ Chatterbox Multilingual (MIT) · Qwen3-TTS · 7대 HD 신경망 보이스 스튜디오</h3>
              <div style="font-size:11px;color:#94a3b8;">CONNECT AI LAB 15종 TTS 벤치마크 우승 엔진 (음색 유사도 0.75 vs ElevenLabs 0.67 · 23개국어 원어민 억양 9/10 · 0원 오픈소스)</div>
            </div>
            <div style="display:flex;gap:5px;">
              <button class="hud-mini-btn ${activeTab === 'SYNTH' ? 'primary' : ''}" data-tab="SYNTH">🎛️ 실시간 음성 합성 &amp; 튜닝</button>
              <button class="hud-mini-btn ${activeTab === 'BENCH' ? 'primary' : ''}" data-tab="BENCH">📊 15종 오픈소스 TTS 벤치마크</button>
              <button class="hud-mini-btn ${activeTab === 'COLAB' ? 'primary' : ''}" data-tab="COLAB">💻 30초 보이스 클로닝 코드 (6셀)</button>
            </div>
          </div>
          <div id="open-tts-stage" style="margin-top:10px;"></div>
        `;

        bodyEl.querySelectorAll('[data-tab]').forEach(b => {
          b.addEventListener('click', () => {
            activeTab = b.dataset.tab;
            render();
          });
        });

        const stage = bodyEl.querySelector('#open-tts-stage');
        if (activeTab === 'SYNTH') {
          stage.innerHTML = `
            <div class="ais-grid-2">
              <div class="ais-box">
                <div class="ais-label" style="color:#34d399;">🔊 활성 TTS 엔진 &amp; 7대 한/영 멀티링구얼 성우 선택</div>
                <label class="ais-label" style="margin-top:6px;">TTS 오픈모델 엔진</label>
                <select id="tts-studio-engine" class="ais-select">
                  ${data.TTS_ENGINE_OPTIONS.map(o => `<option value="${o.id}" ${cfg.ttsEngine === o.id ? 'selected' : ''}>${o.name} [${o.latencyBadge}]</option>`).join('')}
                </select>

                <label class="ais-label" style="margin-top:8px;">전담 보이스 액터 (Voice ID)</label>
                <select id="tts-studio-voice" class="ais-select">
                  ${(data.NEURAL_VOICE_ACTORS || []).map(v => `<option value="${v.id}" ${cfg.voiceId === v.id ? 'selected' : ''}>${v.name} — ${v.style}</option>`).join('')}
                </select>

                <div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:10.5px;"><span>발화 속도 (Rate)</span><b id="lbl-tts-rate" style="color:#00f0ff;">${cfg.speechRate}x</b></div>
                    <input type="range" id="rng-tts-rate" min="0.75" max="1.45" step="0.05" value="${cfg.speechRate}" style="width:100%;" />
                  </div>
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:10.5px;"><span>음정 톤 (Pitch)</span><b id="lbl-tts-pitch" style="color:#34d399;">${cfg.pitchHz || '-2Hz'}</b></div>
                    <select id="sel-tts-pitch" class="ais-select" style="padding:3px 6px;">
                      ${['-6Hz (중저음 영화 자비스)', '-2Hz (차분한 수석 집사)', '+0Hz (표준 내추럴)', '+2Hz (밝은 아나운서)'].map(p => `<option value="${p.split(' ')[0]}" ${(cfg.pitchHz || '-2Hz') === p.split(' ')[0] ? 'selected' : ''}>${p}</option>`).join('')}
                    </select>
                  </div>
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:10.5px;"><span>Chatterbox 감정 억양 (Exaggeration)</span><b id="lbl-tts-exag" style="color:#fbbf24;">${cfg.ttsExaggeration || 0.45}</b></div>
                    <input type="range" id="rng-tts-exag" min="0.1" max="1.0" step="0.05" value="${cfg.ttsExaggeration || 0.45}" style="width:100%;" />
                  </div>
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:10.5px;"><span>음색 밀착도 (CFG Weight)</span><b id="lbl-tts-cfg" style="color:#c084fc;">${cfg.ttsCfgWeight || 0.5}</b></div>
                    <input type="range" id="rng-tts-cfg" min="0.2" max="0.9" step="0.05" value="${cfg.ttsCfgWeight || 0.5}" style="width:100%;" />
                  </div>
                </div>
              </div>

              <div class="ais-box">
                <div class="ais-label" style="color:#00f0ff;">🎬 영화 속 자비스 스타일 실시간 음성 테스트</div>
                <textarea id="tts-studio-sample-text" class="ais-textarea" style="height:82px;margin-top:4px;">대표님, 전 시스템 정상 가동 중입니다. 요청하신 18대 스튜디오와 오픈소스 보이스 엔진을 즉시 준비했습니다.</textarea>
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
                  <button class="hud-mini-btn primary" id="btn-tts-studio-speak">🔊 선택한 보이스로 즉시 발화</button>
                  <button class="hud-mini-btn" id="btn-play-ref-voice" style="border-color:#34d399;color:#34d399;">▶️ 24kHz 자비스 레퍼런스 샘플 재생</button>
                  <button class="hud-mini-btn" id="btn-rec-clone-voice" style="border-color:#fbbf24;color:#fbbf24;">🎙️ 10초 음성 녹음 (보이스 클로닝 등록)</button>
                  <button class="hud-mini-btn" data-sample="Sir, all eighteen studios and the local Gemma 4 neural core are online and ready for your command.">🇺🇸 영문 영화 자비스</button>
                  <button class="hud-mini-btn" data-sample="대표님, 오전 일정과 핵심 브리핑 정리를 마쳤습니다. 바로 확인하시겠습니까?">👩‍💼 수석비서 소하 톤</button>
                </div>
                <div style="margin-top:10px;padding:8px;background:#05080f;border-radius:6px;border:1px solid rgba(0,240,255,0.18);font-size:10.8px;color:#cbd5e1;">
                  <div>● <b>로컬 Chatterbox 서버 데몬</b>: <code>python scripts/local-open-tts-server.py</code> (${cfg.localTtsServerUrl})</div>
                  <div style="margin-top:3px;color:#94a3b8;">로컬 Python 데몬 미실행 시에도 <b>0.18초 무지연 Edge Neural HD (24kHz)</b> 성우로 자동 폴백되어 끊김 없이 발화합니다.</div>
                </div>
              </div>
            </div>
          `;

          stage.querySelector('#tts-studio-engine')?.addEventListener('change', e => {
            cfg.ttsEngine = e.target.value;
            data.saveSettings();
          });
          stage.querySelector('#tts-studio-voice')?.addEventListener('change', e => {
            cfg.voiceId = e.target.value;
            data.saveSettings();
          });
          stage.querySelector('#rng-tts-rate')?.addEventListener('input', e => {
            cfg.speechRate = parseFloat(e.target.value);
            stage.querySelector('#lbl-tts-rate').textContent = cfg.speechRate + 'x';
            data.saveSettings();
          });
          stage.querySelector('#sel-tts-pitch')?.addEventListener('change', e => {
            cfg.pitchHz = e.target.value;
            stage.querySelector('#lbl-tts-pitch').textContent = cfg.pitchHz;
            data.saveSettings();
          });
          stage.querySelector('#rng-tts-exag')?.addEventListener('input', e => {
            cfg.ttsExaggeration = parseFloat(e.target.value);
            stage.querySelector('#lbl-tts-exag').textContent = cfg.ttsExaggeration;
            data.saveSettings();
          });
          stage.querySelector('#rng-tts-cfg')?.addEventListener('input', e => {
            cfg.ttsCfgWeight = parseFloat(e.target.value);
            stage.querySelector('#lbl-tts-cfg').textContent = cfg.ttsCfgWeight;
            data.saveSettings();
          });
          stage.querySelectorAll('[data-sample]').forEach(btn => {
            btn.addEventListener('click', () => {
              const ta = stage.querySelector('#tts-studio-sample-text');
              if (ta) ta.value = btn.dataset.sample;
            });
          });
          stage.querySelector('#btn-tts-studio-speak')?.addEventListener('click', () => {
            const text = stage.querySelector('#tts-studio-sample-text')?.value || '대표님, 준비 완료되었습니다.';
            if (window.MultimodalEngine) {
              window.MultimodalEngine.playSingleNeuralTurn({
                persona: cfg.voiceId.includes('SunHi') || cfg.voiceId.includes('Ava') ? 'soha' : 'jarvis',
                speaker: '🎙️ Open-Source & Neural Voice Studio',
                text,
                voiceId: cfg.voiceId
              }, (window.MultimodalEngine.speechQueueToken = (window.MultimodalEngine.speechQueueToken || 0) + 1));
            }
          });
          stage.querySelector('#btn-play-ref-voice')?.addEventListener('click', () => {
            const audio = new Audio('/data/jarvis_reference_voice.mp3');
            audio.play().catch(() => {});
            window.BSC_WORLDVIEW.showToast('▶️ 24kHz Reference Voice', '대표님, 로컬에 저장된 24kHz 영화 속 자비스 레퍼런스 보이스 샘플을 재생합니다.');
          });
          stage.querySelector('#btn-rec-clone-voice')?.addEventListener('click', async () => {
            const recBtn = stage.querySelector('#btn-rec-clone-voice');
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              const recorder = new MediaRecorder(stream);
              const chunks = [];
              recBtn.textContent = '🔴 녹음 중... (5초 후 자동 등록)';
              recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
              recorder.onstop = () => {
                stream.getTracks().forEach(t => t.stop());
                const blob = new Blob(chunks, { type: 'audio/wav' });
                const reader = new FileReader();
                reader.onloadend = async () => {
                  const res = await fetch('/api/jarvis/voice-clone-upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ audioBase64: reader.result })
                  });
                  const rData = await res.json();
                  recBtn.textContent = '✅ 보이스 클로닝 등록 완료!';
                  window.BSC_WORLDVIEW.showToast('🎙️ Chatterbox Voice Cloner', rData.message || '참조 음성이 등록되었습니다.');
                };
                reader.readAsDataURL(blob);
              };
              recorder.start();
              setTimeout(() => { if (recorder.state === 'recording') recorder.stop(); }, 5000);
            } catch (err) {
              window.BSC_WORLDVIEW.showToast('🎙️ 마이크 권한 안내', '브라우저 마이크 권한을 허용해주시면 즉시 보이스 클로닝 녹음이 진행됩니다.');
            }
          });
        } else if (activeTab === 'BENCH') {
          stage.innerHTML = `
            <div class="ais-box">
              <div class="ais-label" style="color:#34d399;">📊 유튜브 참고 영상 (pnQUKnmPkFg) 15종 오픈소스 vs 상용 TTS 정밀 비교표</div>
              <table>
                <thead>
                  <tr><th>모델명</th><th>라이선스</th><th>음색 유사도</th><th>원어민 억양</th><th>VRAM / 비용</th><th>핵심 평가</th></tr>
                </thead>
                <tbody>
                  ${bench.testedModels.map(m => `
                    <tr>
                      <td style="font-weight:800;color:#00f0ff;">${m.name}</td>
                      <td><span class="ais-tag">${m.license}</span></td>
                      <td style="color:#34d399;font-weight:700;">${m.timbreScore}</td>
                      <td style="color:#fbbf24;font-weight:700;">${m.nativeAccent}</td>
                      <td style="font-family:monospace;">${m.vram}</td>
                      <td>${m.verdict}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `;
        } else {
          stage.innerHTML = `
            <div class="ais-grid-2">
              ${bench.colabCells.map(c => `
                <div class="ais-box">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                    <span class="ais-label" style="color:#00f0ff;margin:0;">${c.step}</span>
                    <button class="win-ctrl-btn btn-copy-tts-cell" data-code="${encodeURIComponent(c.code)}">📋 복사</button>
                  </div>
                  <pre class="ais-code-block" style="max-height:110px;">${c.code}</pre>
                </div>
              `).join('')}
            </div>
          `;
          stage.querySelectorAll('.btn-copy-tts-cell').forEach(btn => {
            btn.addEventListener('click', () => {
              navigator.clipboard?.writeText(decodeURIComponent(btn.dataset.code));
              window.BSC_WORLDVIEW.showToast('📋 코드 복사 완료', '대표님, 오픈소스 TTS 보이스 클로닝 코드가 클립보드에 복사되었습니다.');
            });
          });
        }
      };
      render();
    };

    // =========================================================================
    // 9. MASTER 11-SECTION SETTINGS MODAL (Ported 1:1 from SettingsModal.tsx)
    // =========================================================================
    spawner.applyDesignTheme = function (themeId) {
      const cfg = window.AIStudioData.routerConfig;
      cfg.designTheme = themeId;
      document.body.classList.remove('theme-emerald-light', 'theme-aurora-violet', 'theme-minimal-slate');
      if (themeId === 'EMERALD_GLASS_WORKBENCH') {
        document.body.classList.add('theme-emerald-light');
      } else if (themeId === 'AURORA_NEURAL_STUDIO') {
        document.body.classList.add('theme-aurora-violet');
      } else if (themeId === 'MINIMAL_ENTERPRISE_SLATE') {
        document.body.classList.add('theme-minimal-slate');
      }
      window.AIStudioData.saveSettings();
    };

    spawner.openMasterSettingsModal = function () {
      let modal = document.getElementById('jarvis-master-settings-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'jarvis-master-settings-modal';
        modal.className = 'jarvis-modal-backdrop';
        document.body.appendChild(modal);
      }
      const data = window.AIStudioData;
      const cfg = data.routerConfig;

      const renderModal = () => {
        modal.style.display = 'flex';
        modal.innerHTML = `
          <div class="jarvis-settings-dialog">
            <div class="jarvis-settings-header">
              <div>
                <span class="ais-badge-cyan">J.A.R.V.I.S. UNIFIED OS SETTINGS · 11 SECTIONS</span>
                <h2 style="margin:4px 0 0 0;font-size:17px;color:#fff;">⚙️ 통합 자비스 OS 마스터 설정 페이지 (Google AI Studio × BSC J.A.R.V.I.S.)</h2>
              </div>
              <div style="display:flex;gap:8px;align-items:center;">
                <button class="hud-mini-btn primary" id="btn-save-master-settings">💾 전체 설정 영구 저장</button>
                <button class="win-ctrl-btn close-btn" id="btn-close-master-settings">✕ 닫기</button>
              </div>
            </div>

            <div class="jarvis-settings-body">
              <!-- SECTION 1 & 2: Language, Speaking Style & 4 Design Themes -->
              <div class="ais-grid-2">
                <div class="ais-box">
                  <div class="ais-section-title" style="margin-top:0;">1. 인터페이스 언어 &amp; 영화 속 자비스 화법 스타일</div>
                  <div style="display:flex;gap:8px;margin-bottom:8px;">
                    <button class="hud-mini-btn ${cfg.uiLanguage === 'ko' ? 'primary' : ''} btn-set-lang" data-lang="ko" style="flex:1;">🇰🇷 한국어 (Korean)</button>
                    <button class="hud-mini-btn ${cfg.uiLanguage === 'en' ? 'primary' : ''} btn-set-lang" data-lang="en" style="flex:1;">🇺🇸 English (J.A.R.V.I.S.)</button>
                  </div>
                  <label class="ais-label">대화 응답 화법 (Speaking Style)</label>
                  <select id="set-speaking-style" class="ais-select">
                    <option value="MOVIE_JARVIS_CONCISE" ${cfg.speakingStyle === 'MOVIE_JARVIS_CONCISE' ? 'selected' : ''}>🎬 영화 속 자비스 모드 (핵심 1~2문장 · 간결 · 품격 집사)</option>
                    <option value="JARVIS_SOHA_COWORK" ${cfg.speakingStyle === 'JARVIS_SOHA_COWORK' ? 'selected' : ''}>🤝 자비스 + 수석비서 소하 2인 브리핑 모드</option>
                    <option value="DETAILED_ARCHITECT" ${cfg.speakingStyle === 'DETAILED_ARCHITECT' ? 'selected' : ''}>📐 심층 아키텍트 상세 보고 모드</option>
                  </select>
                </div>

                <div class="ais-box">
                  <div class="ais-section-title" style="margin-top:0;">2. 4대 UI 디자인 테마 쇼케이스 (라이트 / 다크 즉시 전환)</div>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    ${(data.DESIGN_SHOWCASE_OPTIONS || []).map(t => `
                      <button class="hud-mini-btn ${cfg.designTheme === t.id ? 'primary' : ''} btn-set-theme" data-theme="${t.id}" style="text-align:left;padding:6px 8px;">
                        <div style="font-weight:800;">${t.badge}</div>
                        <div style="font-size:10px;opacity:0.8;">${t.titleKo}</div>
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- SECTION 3: 5 Situational Presets -->
              <div class="ais-box" style="margin-top:10px;">
                <div class="ais-section-title" style="margin-top:0;">3. 5대 상황별 추천 프리셋 (원클릭 최적 모델·파라미터 세팅)</div>
                <div style="display:grid;grid-template-columns:repeat(5, 1fr);gap:6px;">
                  ${data.SITUATIONAL_PRESETS.map(p => `
                    <button class="hud-mini-btn ${cfg.situationalPreset === p.id ? 'primary' : ''} btn-set-preset" data-preset="${p.id}" style="text-align:left;padding:7px;">
                      <div style="font-weight:800;font-size:11px;">${p.titleKo}</div>
                      <div style="font-size:9.8px;color:#94a3b8;margin-top:3px;">${p.descriptionKo}</div>
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- SECTION 4 & 5: Multi-Model Router (STT / LLM / Open-Source TTS) & Voice Cloning -->
              <div class="ais-box" style="margin-top:10px;">
                <div class="ais-section-title" style="margin-top:0;">4. 멀티 오픈모델 라우터 (STT 3종 · LLM 9종 · 오픈소스 TTS 6종 · 7대 신경망 성우)</div>
                <div class="ais-grid-3">
                  <div>
                    <label class="ais-label">🎙️ 음성 인식 (STT Engine)</label>
                    <select id="set-stt" class="ais-select">
                      ${data.STT_ENGINE_OPTIONS.map(o => `<option value="${o.id}" ${cfg.sttEngine === o.id ? 'selected' : ''}>${o.name} (${o.latencyBadge})</option>`).join('')}
                    </select>
                  </div>
                  <div>
                    <label class="ais-label">🧠 두뇌 추론 (LLM / 로컬 Gemma 4)</label>
                    <select id="set-llm" class="ais-select">
                      ${data.LLM_ENGINE_OPTIONS.map(o => `<option value="${o.id}" ${cfg.llmEngine === o.id ? 'selected' : ''}>${o.name} [${o.latencyBadge}]</option>`).join('')}
                    </select>
                  </div>
                  <div>
                    <label class="ais-label">🔊 오픈소스 &amp; 신경망 TTS 엔진</label>
                    <select id="set-tts" class="ais-select">
                      ${data.TTS_ENGINE_OPTIONS.map(o => `<option value="${o.id}" ${cfg.ttsEngine === o.id ? 'selected' : ''}>${o.name} (${o.latencyBadge})</option>`).join('')}
                    </select>
                  </div>
                </div>

                <div class="ais-grid-3" style="margin-top:8px;">
                  <div>
                    <label class="ais-label">🎭 전담 보이스 액터 (7대 한/영 성우)</label>
                    <select id="set-voice-actor" class="ais-select">
                      ${(data.NEURAL_VOICE_ACTORS || []).map(v => `<option value="${v.id}" ${cfg.voiceId === v.id ? 'selected' : ''}>${v.name}</option>`).join('')}
                    </select>
                  </div>
                  <div>
                    <label class="ais-label">🌐 로컬 오픈소스 TTS 서버 URL (Chatterbox / Qwen3)</label>
                    <input type="text" id="set-local-tts-url" class="ais-select" value="${cfg.localTtsServerUrl || 'http://127.0.0.1:7860/tts'}" />
                  </div>
                  <div style="display:flex;align-items:flex-end;">
                    <button class="hud-mini-btn primary" id="btn-set-test-voice" style="width:100%;padding:8px;">🔊 현재 자비스 보이스 즉시 테스트</button>
                  </div>
                </div>
              </div>

              <!-- SECTION 6 & 7: Fine-Tuning Sliders & Safety/Endpoints -->
              <div class="ais-grid-2" style="margin-top:10px;">
                <div class="ais-box">
                  <div class="ais-section-title" style="margin-top:0;">5. 추론 창의성 · 발화 속도 · 마이크 감도 · 보이스 클로닝 미세조정</div>
                  <div class="slider-row">
                    <label>창의성 (Temp: <b id="val-temp">${cfg.temperature}</b>)</label>
                    <input type="range" id="set-temp" min="0" max="1" step="0.05" value="${cfg.temperature}" />
                  </div>
                  <div class="slider-row">
                    <label>발화 속도 (<b id="val-rate">${cfg.speechRate}x</b>)</label>
                    <input type="range" id="set-rate" min="0.75" max="1.45" step="0.05" value="${cfg.speechRate}" />
                  </div>
                  <div class="slider-row">
                    <label>VAD 감도 (<b id="val-vad">${cfg.micSensitivity}</b>)</label>
                    <input type="range" id="set-vad" min="0.1" max="0.95" step="0.05" value="${cfg.micSensitivity}" />
                  </div>
                </div>

                <div class="ais-box">
                  <div class="ais-section-title" style="margin-top:0;">6. 보안 승인 게이트 &amp; 로컬 Ollama/LM Studio 엔드포인트</div>
                  <label style="display:flex;align-items:center;gap:8px;font-size:11.5px;color:#e2e8f0;margin-bottom:6px;cursor:pointer;">
                    <input type="checkbox" id="set-safe-mode" ${cfg.safeModeRequireApproval ? 'checked' : ''} />
                    <span>🛡️ OS 제어 실행 전 대표님 승인 필수 (Harness Safety Gate)</span>
                  </label>
                  <label style="display:flex;align-items:center;gap:8px;font-size:11.5px;color:#e2e8f0;margin-bottom:8px;cursor:pointer;">
                    <input type="checkbox" id="set-auto-speak" ${cfg.autoSpeakResponses ? 'checked' : ''} />
                    <span>🔊 자비스 답변 시 자동으로 신경망 음성 발화 (Auto-TTS)</span>
                  </label>
                  <label class="ais-label">로컬 LLM 엔드포인트 (Ollama / vLLM)</label>
                  <input type="text" id="set-local-llm-url" class="ais-select" value="${cfg.localEndpointUrl}" />
                </div>
              </div>

              <!-- SECTION 8 & 9: Bound Local Folders & External IDE Registry -->
              <div class="ais-grid-2" style="margin-top:10px;">
                <div class="ais-box">
                  <div class="ais-section-title" style="margin-top:0;">7. 로컬 워크스페이스 폴더 바인딩 (${cfg.boundFolders.length}개 연결됨)</div>
                  <div style="max-height:95px;overflow-y:auto;">
                    ${cfg.boundFolders.map((f, idx) => `
                      <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                        <span>📁 <b>${f.alias}</b> <code style="color:#00f0ff;">${f.path}</code> (${f.readWrite})</span>
                        <button class="win-ctrl-btn btn-del-folder" data-idx="${idx}" style="padding:1px 6px;">삭제</button>
                      </div>
                    `).join('')}
                  </div>
                  <div style="display:flex;gap:5px;margin-top:6px;">
                    <input type="text" id="inp-new-folder-alias" class="ais-select" placeholder="별칭 (예: BSC_HQ)" style="width:35%;" />
                    <input type="text" id="inp-new-folder-path" class="ais-select" placeholder="C:\\BeausCreators" style="flex:1;" />
                    <button class="hud-mini-btn primary" id="btn-add-folder">+ 추가</button>
                  </div>
                </div>

                <div class="ais-box">
                  <div class="ais-section-title" style="margin-top:0;">8. 외부 AI IDE / ADE 에이전트 브릿지 &amp; API 키 금고</div>
                  <div style="max-height:68px;overflow-y:auto;margin-bottom:6px;">
                    ${cfg.externalIdes.map(ide => `
                      <div style="display:flex;justify-content:space-between;font-size:11px;padding:2px 0;">
                        <span>💻 <b>${ide.name}</b> (<code>${ide.command}</code>)</span>
                        <span style="color:#34d399;">${ide.autoSyncContext ? '● Auto-Sync' : '○ Manual'}</span>
                      </div>
                    `).join('')}
                  </div>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;">
                    <input type="password" id="set-key-openai" class="ais-select" placeholder="OpenAI API Key (sk-...)" value="${cfg.externalApiKeys?.openaiApiKey || ''}" />
                    <input type="password" id="set-key-anthropic" class="ais-select" placeholder="Anthropic Key (sk-ant-...)" value="${cfg.externalApiKeys?.anthropicApiKey || ''}" />
                  </div>
                </div>
              </div>

              <!-- SECTION 10: Custom Voice Macros -->
              <div class="ais-box" style="margin-top:10px;">
                <div class="ais-section-title" style="margin-top:0;">9. 음성 매크로 (Voice Macro) 트리거 관리</div>
                <div class="ais-grid-2">
                  ${data.DEFAULT_VOICE_MACROS.map(m => `
                    <div style="display:flex;justify-content:space-between;align-items:center;background:#05080f;padding:6px 10px;border-radius:6px;border:1px solid rgba(0,240,255,0.16);">
                      <div>
                        <b style="color:#00f0ff;font-size:11.5px;">"${m.phrase}"</b>
                        <div style="font-size:10px;color:#94a3b8;">${m.descriptionKo} → <code>${m.command}</code></div>
                      </div>
                      <button class="win-ctrl-btn btn-settings-run-macro" data-cmd="${m.command}" data-phrase="${m.phrase}">▶ 즉시 실행</button>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        `;

        // Bindings inside Master Settings Modal
        modal.querySelector('#btn-close-master-settings')?.addEventListener('click', () => {
          modal.style.display = 'none';
        });
        modal.querySelectorAll('.btn-set-lang').forEach(b => {
          b.addEventListener('click', () => {
            cfg.uiLanguage = b.dataset.lang;
            renderModal();
          });
        });
        modal.querySelectorAll('.btn-set-theme').forEach(b => {
          b.addEventListener('click', () => {
            spawner.applyDesignTheme(b.dataset.theme);
            renderModal();
          });
        });
        modal.querySelectorAll('.btn-set-preset').forEach(b => {
          b.addEventListener('click', () => {
            const p = data.SITUATIONAL_PRESETS.find(item => item.id === b.dataset.preset);
            if (p) {
              Object.assign(cfg, p.applyConfig, { situationalPreset: p.id });
              renderModal();
            }
          });
        });
        modal.querySelector('#set-temp')?.addEventListener('input', e => {
          cfg.temperature = parseFloat(e.target.value);
          modal.querySelector('#val-temp').textContent = cfg.temperature;
        });
        modal.querySelector('#set-rate')?.addEventListener('input', e => {
          cfg.speechRate = parseFloat(e.target.value);
          modal.querySelector('#val-rate').textContent = cfg.speechRate + 'x';
        });
        modal.querySelector('#set-vad')?.addEventListener('input', e => {
          cfg.micSensitivity = parseFloat(e.target.value);
          modal.querySelector('#val-vad').textContent = cfg.micSensitivity;
        });
        modal.querySelector('#btn-set-test-voice')?.addEventListener('click', () => {
          cfg.voiceId = modal.querySelector('#set-voice-actor').value;
          cfg.ttsEngine = modal.querySelector('#set-tts').value;
          if (window.MultimodalEngine) {
            window.MultimodalEngine.playSingleNeuralTurn({
              persona: 'jarvis',
              speaker: '🤖 J.A.R.V.I.S.',
              text: '대표님, 설정하신 보이스 엔진과 영화 속 자비스 간결 화법이 정상적으로 적용되었습니다.',
              voiceId: cfg.voiceId
            }, (window.MultimodalEngine.speechQueueToken = (window.MultimodalEngine.speechQueueToken || 0) + 1));
          }
        });
        modal.querySelector('#btn-add-folder')?.addEventListener('click', () => {
          const alias = modal.querySelector('#inp-new-folder-alias').value.trim();
          const fpath = modal.querySelector('#inp-new-folder-path').value.trim();
          if (alias && fpath) {
            cfg.boundFolders.push({ id: 'dir-' + Date.now(), alias, path: fpath, readWrite: 'READ_WRITE', indexedFiles: 120 });
            renderModal();
          }
        });
        modal.querySelectorAll('.btn-del-folder').forEach(b => {
          b.addEventListener('click', () => {
            cfg.boundFolders.splice(parseInt(b.dataset.idx, 10), 1);
            renderModal();
          });
        });
        modal.querySelectorAll('.btn-settings-run-macro').forEach(b => {
          b.addEventListener('click', () => {
            window.BSC_WORLDVIEW.showToast('🎙️ Voice Macro Executed', `대표님, "${b.dataset.phrase}" 매크로(${b.dataset.cmd})를 즉시 실행했습니다.`);
          });
        });
        modal.querySelector('#btn-save-master-settings')?.addEventListener('click', async () => {
          cfg.speakingStyle = modal.querySelector('#set-speaking-style').value;
          cfg.sttEngine = modal.querySelector('#set-stt').value;
          cfg.llmEngine = modal.querySelector('#set-llm').value;
          cfg.ttsEngine = modal.querySelector('#set-tts').value;
          cfg.voiceId = modal.querySelector('#set-voice-actor').value;
          cfg.localTtsServerUrl = modal.querySelector('#set-local-tts-url').value;
          cfg.safeModeRequireApproval = modal.querySelector('#set-safe-mode').checked;
          cfg.autoSpeakResponses = modal.querySelector('#set-auto-speak').checked;
          cfg.localEndpointUrl = modal.querySelector('#set-local-llm-url').value;
          cfg.externalApiKeys.openaiApiKey = modal.querySelector('#set-key-openai').value;
          cfg.externalApiKeys.anthropicApiKey = modal.querySelector('#set-key-anthropic').value;

          await data.saveSettings();
          const pill = document.getElementById('active-model-pill');
          if (pill) pill.textContent = `✦ ${cfg.llmEngine.toUpperCase().slice(0, 14)}`;
          modal.style.display = 'none';
          window.BSC_WORLDVIEW.showToast('⚙️ 설정 저장 완료', '대표님, 11대 통합 환경설정이 로컬 디스크와 자비스 코어에 영구 반영되었습니다.');
          if (window.MultimodalEngine) {
            window.MultimodalEngine.speakStewardReply('대표님, 통합 설정 저장을 완료했습니다.');
          }
        });
      };

      renderModal();
    };

    // =========================================================================
    // 10. OS ACTION APPROVAL & PRIORITY QUEUE DRAWER (Ported from App.tsx)
    // =========================================================================
    spawner.toggleOsActionQueueDrawer = function (forceOpen) {
      let drawer = document.getElementById('os-action-queue-drawer');
      if (!drawer) {
        drawer = document.createElement('aside');
        drawer.id = 'os-action-queue-drawer';
        drawer.className = 'os-queue-drawer';
        document.body.appendChild(drawer);
      }
      const isOpen = forceOpen !== undefined ? forceOpen : !drawer.classList.contains('open');
      drawer.classList.toggle('open', isOpen);
      if (!isOpen) return;

      const data = window.AIStudioData;
      const priorityRank = { HIGH: 0, MEDIUM: 1, LOW: 2 };

      const renderDrawer = () => {
        const sorted = [...(data.osActionQueue || [])].sort((a, b) => (priorityRank[a.priority] ?? 1) - (priorityRank[b.priority] ?? 1));
        const badgeEl = document.getElementById('queue-count-badge');
        if (badgeEl) badgeEl.textContent = sorted.filter(i => i.status === 'PENDING_APPROVAL').length;

        drawer.innerHTML = `
          <div class="os-queue-header">
            <div>
              <span class="ais-badge-cyan">HUMAN-IN-THE-LOOP OS ACTION QUEUE</span>
              <h3 style="margin:3px 0 0 0;font-size:14px;color:#fff;">📋 실행 승인 &amp; 우선순위 작업 큐 (${sorted.length}건)</h3>
            </div>
            <button class="win-ctrl-btn close-btn" id="btn-close-queue-drawer">✕</button>
          </div>

          <div class="os-queue-body">
            <div class="ais-box" style="margin-bottom:8px;">
              <div class="ais-label">➕ 새 OS 제어 / 워크스페이스 명령 큐 추가</div>
              <input type="text" id="inp-queue-title" class="ais-select" placeholder="작업 설명 (예: 로컬 TTS 서버 상태 점검)" style="margin-bottom:5px;" />
              <div style="display:flex;gap:5px;">
                <input type="text" id="inp-queue-cmd" class="ais-select" placeholder="실행 명령어" style="flex:1;" />
                <select id="sel-queue-prio" class="ais-select" style="width:92px;">
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM" selected>MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
                <button class="hud-mini-btn primary" id="btn-add-queue-item">추가</button>
              </div>
            </div>

            ${sorted.map(item => `
              <div class="ais-box" style="margin-bottom:8px;border-color:${item.priority === 'HIGH' ? 'rgba(249,115,22,0.45)' : 'rgba(0,240,255,0.18)'};">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span class="ais-tag" style="color:${item.priority === 'HIGH' ? '#f97316' : item.priority === 'MEDIUM' ? '#00f0ff' : '#94a3b8'};">${item.priority} · ${item.category}</span>
                  <span style="font-size:10px;color:${item.status === 'COMPLETED' ? '#34d399' : '#fbbf24'};font-weight:700;">● ${item.status}</span>
                </div>
                <div style="font-weight:800;color:#fff;font-size:12px;margin:4px 0;">${item.title}</div>
                <code style="display:block;font-size:10px;color:#38bdf8;background:#05080f;padding:4px 6px;border-radius:4px;margin-bottom:6px;word-break:break-all;">${item.commandPreview}</code>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                  <select class="ais-select sel-change-prio" data-id="${item.id}" style="width:105px;padding:3px 6px;font-size:10.5px;">
                    <option value="HIGH" ${item.priority === 'HIGH' ? 'selected' : ''}>우선순위: HIGH</option>
                    <option value="MEDIUM" ${item.priority === 'MEDIUM' ? 'selected' : ''}>우선순위: MEDIUM</option>
                    <option value="LOW" ${item.priority === 'LOW' ? 'selected' : ''}>우선순위: LOW</option>
                  </select>
                  <div style="display:flex;gap:5px;">
                    ${item.status !== 'COMPLETED' ? `<button class="hud-mini-btn primary btn-approve-queue" data-id="${item.id}">▶ 실행 승인</button>` : ''}
                    <button class="win-ctrl-btn btn-remove-queue" data-id="${item.id}">삭제</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `;

        drawer.querySelector('#btn-close-queue-drawer')?.addEventListener('click', () => {
          drawer.classList.remove('open');
        });
        drawer.querySelector('#btn-add-queue-item')?.addEventListener('click', () => {
          const title = drawer.querySelector('#inp-queue-title').value.trim();
          const cmd = drawer.querySelector('#inp-queue-cmd').value.trim();
          const prio = drawer.querySelector('#sel-queue-prio').value;
          if (!title) return;
          data.osActionQueue.unshift({
            id: 'act-' + Date.now(),
            title,
            category: 'TERMINAL_CMD',
            riskLevel: 'SAFE',
            priority: prio,
            commandPreview: cmd || 'echo "J.A.R.V.I.S. Task Executed"',
            status: 'PENDING_APPROVAL',
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
          });
          renderDrawer();
        });
        drawer.querySelectorAll('.sel-change-prio').forEach(sel => {
          sel.addEventListener('change', () => {
            const target = data.osActionQueue.find(i => i.id === sel.dataset.id);
            if (target) target.priority = sel.value;
            renderDrawer();
          });
        });
        drawer.querySelectorAll('.btn-approve-queue').forEach(btn => {
          btn.addEventListener('click', () => {
            const target = data.osActionQueue.find(i => i.id === btn.dataset.id);
            if (target) {
              target.status = 'COMPLETED';
              renderDrawer();
              window.BSC_WORLDVIEW.showToast('✅ 실행 승인 완료', `대표님, 『${target.title}』 작업을 승인하여 완료 처리했습니다.`);
              if (window.MultimodalEngine) {
                window.MultimodalEngine.speakStewardReply(`대표님, ${target.title} 작업을 완료했습니다.`);
              }
            }
          });
        });
        drawer.querySelectorAll('.btn-remove-queue').forEach(btn => {
          btn.addEventListener('click', () => {
            data.osActionQueue = data.osActionQueue.filter(i => i.id !== btn.dataset.id);
            renderDrawer();
          });
        });
      };

      renderDrawer();
    };

    // Helper to open any AI Studio window by type with proper title/subtitle
    spawner.openAIStudioWindowByType = function (type, initialSubTab) {
      const meta = {
        AI_STUDIO_HUB: {
          title: '⚡ Google AI Studio × BSC J.A.R.V.I.S. 18대 스튜디오 & 9대 오픈모델 통합 허브',
          subtitle: '3 STT · 9 LLM/SLM (Laya-421M / REA-14B / Gemma 4) · 6 Open-Source TTS · 5 Presets · 4 Voice Macros'
        },
        OPEN_TTS_STUDIO: {
          title: '🎙️ 오픈소스 TTS (Chatterbox · Qwen3-TTS) & 23개국어 보이스 클로닝 스튜디오',
          subtitle: 'CONNECT AI LAB 15종 TTS 벤치마크 1위 · 0원 로컬 더빙 & 7대 HD 신경망 성우'
        },
        MAPS_REA_STUDIO: {
          title: '🗺️ MAPS 4계층(Memory·Agent·Pulse·Screen) & REA 오픈모델 역공학 스튜디오',
          subtitle: 'pavrus117/ai-os-maps-guide + morluto/rea (rea-open-agent-14b MCP)'
        },
        AGENT_REGISTRY: {
          title: '🤖 SRP 에이전트 레지스트리 & 페르소나 슬라이더 & BSC 28인 요원 스튜디오',
          subtitle: 'class AgentManagementController · Bulk Status Toggle (Active / Inactive / Invert)'
        },
        CREATIVE_BLENDER: {
          title: '🎨 캐릭터 360° 턴어라운드 시트 · Wavefront .OBJ · Blender 3D VFX 스튜디오',
          subtitle: 'class CharacterAssetStudioController · Cycles / EEVEE Next bpy Synthesizer'
        },
        RL_BENCHMARK: {
          title: '🧠 로컬 SLM/LLM 9종 벤치마크 & Unsloth GRPO 강화학습 가중치 스튜디오',
          subtitle: 'Q4_K_M / Q8_0 / FP16 Benchmark · 5-Layer Skewness Histogram · Full-System Audit'
        },
        VISION_FACE: {
          title: '👁️ OmniParser 화면 비전 좌표 추출 & Face-to-Face 표정/시선 교감 스튜디오',
          subtitle: 'Consumer Psychology Feedback Loop · Live UI Coordinate & PyAutoGUI Generator'
        },
        SIM_BIO_IDE: {
          title: '🧬 AlphaFold 바이오사이언스 · 자율 모의훈련 ROI · Antigravity IDE 브릿지',
          subtitle: 'TP53 / EGFR / BRCA1 pLDDT & ClinVar · Monte Carlo Simulation · AST Self-Healing'
        }
      }[type] || { title: type, subtitle: 'BSC J.A.R.V.I.S. OS' };

      return this.spawn({
        windowType: type,
        title: meta.title,
        subtitle: meta.subtitle,
        initialSubTab
      });
    };

    // Bind Top Unified Workspace Bar, Settings Button, Queue Drawer Button, and Theme Cycle Button
    document.querySelectorAll('[data-ais-win]').forEach(btn => {
      btn.addEventListener('click', () => {
        spawner.openAIStudioWindowByType(btn.dataset.aisWin, btn.dataset.aisSubtab || undefined);
      });
    });
    document.querySelectorAll('.btn-open-master-settings').forEach(btn => {
      btn.addEventListener('click', () => spawner.openMasterSettingsModal());
    });
    document.querySelectorAll('.btn-toggle-os-queue').forEach(btn => {
      btn.addEventListener('click', () => spawner.toggleOsActionQueueDrawer());
    });
    document.getElementById('btn-cycle-theme')?.addEventListener('click', () => {
      const themes = ['CYBER_HUD_PRO', 'EMERALD_GLASS_WORKBENCH', 'AURORA_NEURAL_STUDIO', 'MINIMAL_ENTERPRISE_SLATE'];
      const cur = window.AIStudioData.routerConfig.designTheme || 'CYBER_HUD_PRO';
      const next = themes[(themes.indexOf(cur) + 1) % themes.length];
      spawner.applyDesignTheme(next);
      window.BSC_WORLDVIEW.showToast('🌓 디자인 테마 전환', `대표님, 화면 테마를 『${next}』 모드로 즉시 전환했습니다.`);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachAIStudioExtensions);
  } else {
    attachAIStudioExtensions();
  }
})();
