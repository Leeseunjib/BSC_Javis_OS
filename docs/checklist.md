# ✅ BSC J.A.R.V.I.S. OS 구축 체크리스트 (`checklist.md`)

- [x] **Step 1**: 해외 J.A.R.V.I.S. & AI OS 오픈소스 112개 링크 딥리서치 및 10대 레포지토리 로컬 클론 (`research/opensource_sources/`)
- [x] **Step 2**: 마스터 구현 계획서(`implementation_plan.md`) 및 출판급 PDF(`BSC_JARVIS_OS_Implementation_Plan.pdf`) 생성·승인
- [x] **Step 3**: `vault/` 개혁주의 장로교 청지기 세계관(`00_SOUL_and_Worldview.md`), `01_MEMORY_MAP.md` (2-Hop Signpost) 및 핵심 지식 노트 구축
- [x] **Step 4**: `scripts/build-brain-map.js` 구현 및 실행 — BSC 본사(`6.Knowledge_Index`, `0.Guidelines`, `2.Agents`) + 로컬 `vault/` 읽기 전용 스캔 및 `public/data/brain.json` (523 노드, 567 연결선) 생성
- [x] **Step 5**: 로컬 MediaPipe/Three.js 벤더 에셋(`public/vendor/`) 연동 및 `server.js` (포트 7777, `/api/brain`, `/api/summon`, `/api/agent`, `/api/pc-control`, `/api/token-flow`) 구축
- [x] **Step 6**: `public/index.html`, `public/css/jarvis-hud.css` (`AI WORKSHOP OS` 레이아웃: 좌측 Inspector/Top Hubs/Forces/Token Flow, 중앙 6대 지식 그래프 캔버스, 우측 J.A.R.V.I.S. Ring/Cube/Face & EYES/WATCH/HOLO/FOCUS, 하단 멀티모달 독) 구축
- [x] **Step 7**: `public/js/` 코어 엔진 5종 (`graph-engine.js`, `jarvis-core-3d.js`, `window-spawner.js`, `multimodal-engine.js`, `worldview-together.js`) 구축
- [x] **Step 8**: 원클릭 실행 배치파일(`Start-BSC-Jarvis.bat`) 생성, 서버 기동 및 브라우저 HUD/API 검증, `walkthrough.md` 및 본사 보고서/작업일지 양방향 동기화


---
## [2026-10-21 Phase 4 Final Goal Checklist]
- [x] Google AI Studio 22개 전체 컴포넌트 및 18대 스튜디오 `BSC_Javis_OS` HUD 전면 통합 (`#unified-workspace-bar` + 자동 허브 소환)
- [x] 11대 마스터 설정 페이지 (`#jarvis-master-settings-modal`) 및 `/api/jarvis/settings` 영구 저장 구현
- [x] OS 실행 승인 & 우선순위 큐 서랍 (`#os-action-queue-drawer`) 구현
- [x] 유튜브 참고 영상(`pnQUKnmPkFg`) 15종 TTS 벤치마크 분석 및 `Chatterbox Multilingual (MIT)` + `Qwen3-TTS` + 7대 HD 신경망 성우 통합 (`OPEN_TTS_STUDIO` & `scripts/local-open-tts-server.py`)
- [x] 영화 속 자비스(Movie J.A.R.V.I.S.) 1~2문장 초간결 핵심 브리핑 화법 및 로컬 Ollama Gemma 4 (`think: false`, `keep_alive: '30m'`) 1.0초 응답 최적화
- [x] 전 시스템 18개 항목 자동화 QA 검증 스위트 (`scripts/verify-full-system.js`) 18/18 100% 통과 및 DOM 런타임 검증 완료
- [x] 100p+ 마스터 백서 Word 파일 (`BSC_JARVIS_OS_Master_Encyclopedia_100p.docx`, 365KB) 최신 소스코드 포함 재생성
- [x] 대표님 부재 중 자체 승인(Autonomous Self-Approval) 내역 명세 및 최종 완성 보고서 제출

---
## [2026-10-21 Phase 5] 답변 정직성 수리
- [x] 두뇌 무응답 시 질문과 무관한 완료 문장 제거
- [x] 창 열기·설정·그래프·PC 승인 명령은 확정 문장으로 즉시 응답
- [x] 설치된 Ollama 모델 우선순위 (`요청 모델 → e4b → e2b → 31b`)
- [x] 검증기 `ok`를 실제 통과 여부로 계산하고, 음성은 점수만 읽기
- [x] MP3 청크 ID3 제거와 비전 스튜디오 열기 정규식 수정
- [x] 대화창 사용자 문장 HTML 이스케이프, 승인 단어는 짧은 승인 문장만 인식
- [x] 자비스 재귀를 Harness^2 호출 없이 로컬 검사와 조건부 수리로 분리
- [x] 대화 턴의 중복 파일 읽기, 모델 목록 조회, 본사 일지 동기화 지연
- [x] STT·비전 좌표·토큰 절감률을 실측값으로 교체
- [x] 미사용 `queryLocalOllamaGemma`의 소하 대사 요구 정리


## [2026-10-22] 소비자 심리학 기반 실무 통합 대시보드 & .MD 심층 분석 시스템 검증 완료
- [x] `index.html`, `graph-engine.js`, `jarvis-design-views.js` 내 모든 더미 텍스트·이미지(`소풍 홈페이지`, `sopoong-boat.jpg`, `서윤 PM`, `김태오`, `달빛 숲`, `월 한도 42%`) 100% 제거 (`zeroDummyInHtml: true`, `zeroDummyInJs: true`)
- [x] 좌측 메뉴바(`#slim-left-dock`) 기반 6대 실무 대시보드(`HOME_GALAXY`, `ECOSYSTEM_DASHBOARD`, `DOC_IDE_DASHBOARD`, `AI_BRAIN_DASHBOARD`, `AGENT_OFFICE_DASHBOARD`, `SETTINGS_DASHBOARD`) 단일 스테이지 전환 구축
- [x] 3대 기본 슬롯(`🏢 회사_HQ`, `🚀 회사_Branch`, `🧠 지식생태계 (데이터 || 옵시디언)`) 및 `[➕ 폴더 추가]` + 실시간 `.md` 마크다운 심층 파서(`analyzed-md-knowledge.json`) 연동 완료


---
## [2026-10-26] SasariSa (사사리사) REA Windows 11 포팅 & 4대 멀티 LLM 브릿지 통합 체크리스트
- [x] `scripts/multi-llm-provider-hub.js` 구현 (OpenAI GPT + Google Gemini + LM Studio `:1234` + Ollama `:11434` 통합 라우팅, `.env` 키 격리, 자동 폴백)
- [x] `scripts/rea-sasarisa-windows-engine.js` 구현 (`mvcompany8500-web/sasarisa` REA 4단계 역공학 블루프린트 및 Windows 11 6대 음성 자동화 스킬 + 2중 안전 확인 가드레일)
- [x] `server.js` API 확장 (`/api/jarvis/llm-hub/*`, `/api/jarvis/sasarisa/*` 및 `/api/agent` 멀티 LLM 연동)
- [x] `public/js/aistudio-catalog-and-domains.js` & `public/js/aistudio-windows.js`에 `rea-sasarisa-macos-to-win11` REA 역공학 타겟 및 4대 LLM 카탈로그 반영
- [x] `public/index.html`, `public/css/jarvis-hud.css`, `public/js/multimodal-engine.js`, `public/js/jarvis-design-views.js`에 사사리사 Floating Voice Pill (`#sasarisa-voice-pill`, `Alt+Space`) 및 4대 LLM 허브 UI 통합
- [x] 전 파일 `node --check` 구문 검사 및 엔드투엔드 검증 통과
