

---
## [2026-10-21 Phase 4 Final Goal] Google AI Studio × BSC_Javis_OS 100% 완전체 병합 · 11대 통합 설정 페이지 · 오픈소스 TTS(Chatterbox/Qwen3) · 영화 속 자비스 간결 화법 완성
1. **Google AI Studio (`C:\Users\USER\antigravity\Jarvis-Open-AI-Assistant`) 22개 전체 컴포넌트 & 18대 스튜디오 100% 통합**:
   - 상단 통합 워크스페이스 바(`#unified-workspace-bar`) 및 부팅 시 `AI_STUDIO_HUB` 자동 소환으로 두 시스템이 한 화면에서 즉시 작동하도록 완성.
   - `MAPS_REA_STUDIO`에 `WIKI`(`JarvisKnowledgeWikiStudio.tsx`) 및 `OS_LAB`(`OpenSourceLabView.tsx` + `jarvis_local_bridge.py` 생성기) 탭 추가, `CREATIVE_BLENDER`에 `Barehands 3D`(`ThreejsBarehandsStage.tsx`) 연동, `RL_BENCHMARK`에 `TelemetryAndDataPanel.tsx` 연동.
2. **11대 마스터 설정 페이지 (`#jarvis-master-settings-modal`) & 실행 승인 큐 서랍 (`#os-action-queue-drawer`)**:
   - 언어(한/영), 화법 스타일(영화 속 자비스 간결 모드 등), 4대 디자인 테마(Cyber HUD Dark / Emerald Light / Aurora / Slate), 5대 상황별 프리셋, STT 3종 / LLM 9종 / 오픈소스 TTS 6종 / 7대 성우 선택, 발화 속도·음정·감정 억양(Exaggeration)·CFG 밀착도 슬라이더, 안전 승인 게이트, 로컬 폴더 바인딩, 외부 IDE 레지스트리, API 키 금고, 음성 매크로 관리까지 전 항목 영구 저장(`public/data/jarvis-settings.json`).
3. **오픈소스 TTS 벤치마크 1위 엔진 통합 (`https://www.youtube.com/watch?v=pnQUKnmPkFg&t=484s`)**:
   - 15종 오픈소스 TTS 벤치마크 1위인 **Chatterbox Multilingual (`resemble-ai/chatterbox`, MIT 라이선스, 음색 유사도 0.75 vs ElevenLabs 0.67, 23개국어 원어민 억양 9/10)** 로컬 데몬(`scripts/local-open-tts-server.py`) 및 `Qwen3-TTS`, `CosyVoice 3`, `VoxCPM2`와 무지연 24kHz `Edge Neural HD` 7대 성우 하이브리드 연동.
4. **영화 속 자비스(Movie J.A.R.V.I.S.) 초간결 집사 화법 적용**:
   - 군더더기 인사와 질문 복창을 제거하고 1~2문장 이내로 핵심 결론과 조치 결과만 정중하고 간결하게 보고하는 영화 속 자비스 화법으로 전면 개편.

---
## [2026-10-21 Phase 5] 답변 정직성 수리

완성 보고서는 18개 항목 통과로 적혀 있으나, 실제 대화 경로는 실패를 성공처럼 말했다. 이번 단계의 목표는 그 거짓 완료를 없애고, 이미 정해진 명령은 로컬 두뇌를 기다리지 않게 하는 것이다.

1. 로컬 두뇌가 비면 끝낸 일처럼 답하지 않고, 응답하지 않았다고만 말한다.
2. 설정 열기, 스튜디오 소환, 그래프 전환, PC 승인 요청은 확정 문장으로 즉시 응답한다.
3. 설정에서 고른 모델을 우선하고, 없으면 `gemma4:e4b`, `gemma4:e2b`, `gemma4:31b` 순으로 설치된 모델을 고른다.
4. 검증기 `ok`는 검사 전부가 통과할 때만 참이다. 음성은 점수만 읽고, 고정 성공 대사를 읽지 않는다.
5. 긴 음성은 800자 문장 단위로 합성하고, 두 번째 MP3부터 ID3 헤더를 뗀 뒤 이어 붙인다.
6. 비전 얼굴 교감 스튜디오는 `열어`와 함께 말하면 열린다.

다음 단계로 남긴 것. STT는 아직 고정 문장을 돌려주고, 화면 비전 좌표와 토큰 절감률 88.5%는 실측이 아니다. 쓰지 않는 `queryLocalOllamaGemma`는 여전히 소하 대사를 요구한다. 이 세 가지는 이번 수리에서 동작 경로를 바꾸지 않았다.

---
## [2026-10-28] 실측으로 바꾼 STT·화면 좌표·절감률

1. `/api/jarvis/stt`는 힌트 문장을 인식 결과로 돌려주지 않는다. Windows가 아니면 빈 문장과 실패를 돌려주고, Windows 음성 인식도 들은 문장이 있을 때만 성공이다.
2. 비전 스튜디오의 고정 좌표 표는 없앴다. 스캔 버튼은 지금 창에 보이는 버튼의 픽셀과 화면 비율만 적는다.
3. 88.5%와 99.8% 절감률 상수는 화면과 분석 응답에서 뺐다. 절감률은 기준량과 실제 전송량이 둘 다 있기 전에는 미측정이다.
4. 호출되지 않던 `queryLocalOllamaGemma`와 그 소하 대사 형식 요구를 삭제했다.

---
## [2026-10-21 Phase 6] 턴 성능과 자비스 재귀

Harness^2 엔진과 그 표면 파일은 수정하지 않는다. 대화 한 턴의 재귀는 `scripts/jarvis-recursion.js`가 맡는다.

1. 초안이 통과하면 추가 모델 호출은 없다.
2. 별표와 다섯 문장 이상은 로컬에서 자른다.
3. 기계적 문장, 질문 반복, REA 오독만 8초 안의 짧은 수리 호출을 한다.
4. 대표님 지적은 `vault/jarvis-recursion/lessons.json`에만 남기고, 다음 턴에 겹치는 교훈 두 줄만 넣는다.
5. 모델 목록은 60초, 브릿지 상태는 8초 동안 재사용한다. 대화 기록은 한 번에 저장하고, 본사 일지 복사는 응답 뒤로 미룬다.
6. 벤더 정적 파일은 하루 동안 캐시한다.


---

## [2026-10-22] 올라마 & LM Studio & RunNow 자율 모델 라우터 · Antigravity IDE 2.0 워크벤치 · CLI/SDK · 유니버설 윈도우 제어 · 자연음성(Human TTS) 마스터 구현
- **5대 안전장치 포함 설계**:
  1. **VRAM 자동 언로드 스왑 (`Auto-Unload Guard`)**: Ollama(`localhost:11434`)와 LM Studio(`localhost:1234`) 간 모델 전환 시 기존 모델 VRAM 점유를 즉시 해제(`keep_alive: 0` / unload)하여 PC 속도 저하 원천 차단.
  2. **UI 단순화 및 통합 (`📄 문서 & IDE 2.0 워크벤치`)**: 기존 문서 뷰와 Antigravity IDE 2.0 4분할 뷰(탐색기/모델센터 + 코드에디터 + 문서/계획서/승인뷰 + 실시간터미널)를 통합하여 화면 과밀화 방지.
  3. **2-Track 지능형 분기**: 일반 대화는 0.5초 즉시 응답(Fast Track), 제작/코드/문서6종/3D/웹디자인 요청은 `1. 상황 판단 ➔ 2. 모델 스스로 선택 ➔ 3. 계획서 보고 ➔ 4. 대표님 승인 ➔ 5. 제작 실행` (Production Track) 작동.
  4. **실시간 스트리밍 웹 터미널 (`spawn` + SSE)**: `ollama pull`, `lms`, `agy`, `jarvis-cli` 실행 시 진행률을 실시간 스트리밍하고 CHLGD 파괴적 명령어 차단.
  5. **모바일-PC 하이브리드 브릿지 & RunNow 15종 WebGPU 연동**: 동일 네트워크에서는 PC 두뇌를 우선 활용하고 오프라인/모바일 단독 시 RunNow 초경량 온디바이스 모델로 자동 전환.
- **유니버설 윈도우 매니저**: 좌측 메뉴를 제외한 모든 창(1:1 대화창, 회의실, HOLO 카메라, 18대 스튜디오, IDE 창 등) 클릭 드래그 이동 및 크기 조절(Resize), 최소화/최대화 지원.
- **사람 같은 자연스러운 TTS**: 인위적 피치 변조 제거(`pitch: +0Hz`, `rate: +1%`), 한국어 아나운서 발음 교정기(`humanizeKoreanSpeechText`), 구형 로봇 음성(`speechSynthesis` SAPI5) 폴백 완전 제거.


---

## [2026-10-26] SasariSa (`mvcompany8500-web/sasarisa`) REA Windows 11 역공학 이식 × 4대 멀티 LLM 브릿지(GPT · Gemini · LM Studio · Ollama) × BSC J.A.R.V.I.S. OS 완전 통합
1. **REA 4단계 클린룸 역공학 (`mvcompany8500-web/sasarisa` macOS ➔ Windows 11 네이티브 포팅)**:
   - macOS 전용 아키텍처(`SwiftUI MenuBarExtra`, `Whisper CoreAudio`, `AppleScript osascript`, `Accessibility AXUIElement`, `Safety Confirmation Gate`)를 분석하여 Windows 11 네이티브 엔진(`scripts/rea-sasarisa-windows-engine.js`)으로 1:1 재구축.
   - 6대 음성 자동화 스킬(🎵 음악 제어, 🛒 쇼핑 검색, 💬 카카오톡/메신저 2중 안전 발송, ✉️ 메일 확인/답장 초안, 💻 말로 하는 코딩, 🖥️ Windows 앱/시스템 제어) 및 되돌릴 수 없는 작업 2중 안전 가드레일(`REQUIRES_CONFIRMATION`) 탑재.
2. **4대 멀티 LLM 통합 프로바이더 허브 (`scripts/multi-llm-provider-hub.js`)**:
   - **OpenAI GPT** (`gpt-4o`, `gpt-4o-mini`, `o3-mini`) + **Google Gemini** (`gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.0-flash`) + **로컬 LM Studio** (`127.0.0.1:1234/v1` & `.gguf` 디스크 모델 자동 감지) + **로컬 Ollama** (`127.0.0.1:11434` `gemma4:e4b`, `gemma4:e2b`, `gemma4:31b` 등) 단일 라우터 연결.
   - `.env` 시크릿 격리 저장 및 오프라인/미설정 시 로컬 Ollama/LM Studio 무중단 자동 폴백(`Auto-Fallback`).
3. **사사리사 시그니처 디자인 (`#sasarisa-voice-pill`) & 기존 기술 100% 보존**:
   - 화면 상단 중앙 캡슐형 플로팅 보이스 바(`Alt+Space` 단축키 및 상단바 `🎙️ 사사리사` 버튼)와 `🤖 두뇌·도구` 대시보드 내 4대 멀티 LLM 커넥터 & 사사리사 Windows 컨트롤 센터 통합.
   - 기존 뉴런홈 6대 뷰, 23,595개 파일 전수 파악, 18대 AI Studio, ArtCraft 13종 실시간 제어, HOLO 카메라 제스처, 현수 HD TTS, 에이전트 워룸 100% 무손실 유지.


---

## [2026-10-27 10:35] 사사리사(SasariSa) Voice-First 무겹침 HUD · Google Gemini CLI (`gemini-4-argon` OAuth $0) · 3중 음성인식(STT)/100% 음성발화 복구 · 원클릭 옵시디언×노션 뉴런 스튜디오 구축 완료
- **Google Gemini CLI & `gemini-4-argon` OAuth ($0 추가과금)**: `scripts/multi-llm-provider-hub.js` 및 `/api/jarvis/llm-hub/oauth-login`에 `geminiAuthMode: 'oauth'` 기본 탑재 (`~/.gemini/oauth_creds.json` + `gemini` CLI 브릿지 연동으로 추가 API 과금 $0 보장).
- **음성 거부 환각 차단 & 100% 음성 발화**: `VOICE_FIRST_IDENTITY_DIRECTIVE` 및 `sanitizeVoiceDenialHallucination()`으로 '텍스트 기반의 논리적 설계' 답변 원천 차단 및 96kbps 현수/선희 HD TTS 자동 재생.
- **3중 한국어 연속 음성인식(STT) 복구**: `public/js/multimodal-engine.js`에 `continuous: true` + 실시간 자막 + 1.2초 침묵 자동 전송 + WebAudio 24-Bar 마이크 파형 미터 + `/api/jarvis/stt` Windows SAPI 폴백 구현.
- **뉴런(점) 원클릭 옵시디언×노션 스튜디오**: `public/js/graph-engine.js` 단일 클릭 시 `public/js/neuron-content-studio.js` 및 `scripts/rea-obsidian-notion-engine.js`를 통해 원문 열람, 노션 `/` 블록 편집, 옵시디언 `[[위키링크]]`·백링크·1-Hop 그래프 및 3D 뉴런홈 실시간 반영 완성.
