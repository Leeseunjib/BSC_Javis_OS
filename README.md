# 🛡️ BSC_Javis_OS (Autonomous Agent OS — Coram Deo & Together Edition)

> **"이건우 대표님, 오늘도 주신 지혜로 함께(Together) 만들어 갑시다."**
> 개혁주의 장로교(Presbyterian) 청지기 세계관과 MAPS 4계층(Memory, Agent, Pulse, Screen) 프레임워크, 그리고 5대 멀티모달 감각(음성 · 카메라 에어터치 HOLO · 모션 인지 EYES · 화면 인식 WATCH · 안전 컴퓨터 제어) 및 자율 윈도우 스폰 엔진을 결합한 자율 인공지능 운영체제입니다.

---

## 🚀 1. 원클릭 실행 방법 (Zero Cost · Zero API Key · 100% Local)

```bash
# 1. 지식 은하(Brain Map) 인덱싱 및 서버 기동 (포트 7777)
node scripts/build-brain-map.js
node server.js
```
또는 Windows에서 **`Start-BSC-Jarvis.bat`** 파일을 더블클릭하면 브라우저(`http://localhost:7777`)가 자동으로 열립니다.

---

## 🌌 2. 핵심 아키텍처 및 주요 기능

1. **AI WORKSHOP OS 레이아웃 & 6대 지식 은하 그래프 (`public/js/graph-engine.js`)**
   - `3D Galaxy` (입체 은하) / `2D Force` / `Concentric Rings` (MAPS 계층 동심원) / `Areas` (도메인 클러스터) / `Timeline` / `Brain Shape` (해부학적 좌·우뇌 뉴런) 6가지 뷰 실시간 전환.
   - **Show, Don't Store**: 원본 마크다운 볼트를 변조하지 않고 읽기 전용으로 인덱싱합니다. 토큰 절감률은 이번 세션에서 기준량과 실제 전송량을 둘 다 재기 전에는 적지 않습니다.
2. **자율 스폰 HUD 윈도우 매니저 (`public/js/window-spawner.js` & `/api/summon`)**
   - 대화 맥락에 따라 자비스가 스스로 판단하여 4대 홀로그램 플로팅 윈도우를 화면 위에 소환합니다:
     - `📘 설명서 창 (MANUAL)`
     - `📊 심층 보고서 창 (REPORT)`
     - `💻 실시간 제작 콘솔 & 토큰 유량 모니터 창 (LIVE_CONSOLE)`
     - `🎨 통합 생성 스튜디오 & 3D 홀로그램 조립기 창 (GEN_STUDIO)`
3. **5대 멀티모달 감각 & 안전 컴퓨터 제어 (`public/js/multimodal-engine.js`)**
   - `🎙️ Voice`: 양방향 한국어/영어 음성 인식(STT) & 청지기 음성 합성(TTS) & 말 도중 끼어들기(Barge-in)
   - `✋ HOLO`: 로컬 웹캠 & MediaPipe WASM 기반 손가락 에어 터치
   - `👁️ EYES`: 재석 및 모션 감지 환영 브리핑
   - `🖥️ WATCH`: 화면 컨텍스트 인식
   - `🛡️ Safe Computer Use`: 대표님 승인(`Human-in-the-Loop`) 카드 기반 안전 OS 제어
4. **마스터 설계서 및 100+ 페이지 백과사전 정본 포함**
   - `BSC_JARVIS_OS_Implementation_Plan.pdf` (A4 고해상도 마스터 설계서 PDF)
   - `BSC_JARVIS_OS_Master_Encyclopedia_100p.docx` (전 기능·세계관·112개 오픈소스 리서치·전체 소스코드·523개 노드 장부 수록 Word 백과사전)
   - `research/JARVIS_110_Sources_Master_Index.md` (해외 112개 J.A.R.V.I.S. / AI OS 오픈소스 딥리서치 인덱스)
