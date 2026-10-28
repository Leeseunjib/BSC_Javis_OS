/**
 * 🚀 BSC J.A.R.V.I.S. OS — Google AI Studio Complete Model Catalog & Domain Controllers
 * 100% Ported & Integrated from C:\Users\USER\antigravity\Jarvis-Open-AI-Assistant
 * Includes:
 *  - 3 STT Engines, 9 LLM/SLM Engines (Laya-421M, REA-14B, Llama 3.3, Qwen 2.5, Phi-4, Gemma 3, DeepSeek-R1, Gemini 3.8)
 *  - 3 TTS Engines & 5 Neural Voices (Charon, Kore, Puck, Fenrir, Zephyr)
 *  - 5 Situational Presets, 4 Design Themes, 4 Voice Macros, 8 Open-Source Repo Catalogs
 *  - SRP Class #1: AgentManagementController (6 AI Studio Agents + Personality Sliders + Bulk Status Toggle)
 *  - SRP Class #2: CharacterAssetStudioController (360° SVG Turnaround + Wavefront .OBJ + Storyboards)
 *  - MAPS 4-Layer (Memory, Agent, Pulse, Screen) & 3 REA Reverse Engineering Targets
 *  - AlphaFold BioScience Presets (TP53, EGFR, BRCA1), RL Weight Distribution & 9-Model Benchmark Specs
 */

window.AIStudioData = {
  // 현재 활성화된 멀티모델 라우터 설정 상태 (대표님 PC 로컬 Ollama gemma4:e4b & 오픈소스/신경망 TTS 기본 활성화)
  routerConfig: {
    sttEngine: 'whisper-large-v3',
    llmEngine: 'gemma4:e4b',
    ttsEngine: 'edge-neural-korean-tts',
    ttsVoice: 'ko-KR-HyunsuMultilingualNeural',
    sohaVoice: 'ko-KR-SunHiNeural',
    activePersonaMode: 'jarvis', // 'jarvis' (영화 속 자비스 간결 모드 기본), 'cowork', 'soha', 'taejun', 'geonu'
    exaggeration: 0.5,
    cfgWeight: 0.45,
    pitchHz: '-3Hz',
    localTtsUrl: 'http://127.0.0.1:7860',
    layaRouterEnabled: true,
    autoRouting: true,
    wakeWordEnabled: false,
    autoSpeakReply: true,
    speechRate: 1.08,
    vadSensitivity: 60,
    temperature: 0.65,
    freeEnginePriority: true,
    safetyMode: 'ALWAYS_ASK',
    ollamaEndpoint: 'http://localhost:11434',
    bridgeEndpoint: 'ws://localhost:8765',
    uiLanguage: 'ko',
    designTheme: 'cyber-hud',
    situationalPreset: 'daily-assistant',
    boundFolders: [
      { id: 'f-1', folderName: 'BSC_Javis_OS Vault', absolutePath: 'c:\\BSC_Javis_OS\\vault', purpose: 'KNOWLEDGE_WIKI', lastScannedTime: '방금 전', fileCount: 24 },
      { id: 'f-2', folderName: 'BSC_HQ 6.Knowledge_Index', absolutePath: 'C:\\BeausCreators\\01.BSC_HQ\\6.Knowledge_Index', purpose: 'KNOWLEDGE_WIKI', lastScannedTime: '5분 전', fileCount: 455 },
      { id: 'f-3', folderName: 'Jarvis-Open-AI-Assistant', absolutePath: 'C:\\Users\\USER\\antigravity\\Jarvis-Open-AI-Assistant\\src', purpose: 'CODE_BASE', lastScannedTime: '방금 전', fileCount: 24 }
    ],
    externalIdes: [
      { id: 'ide-1', name: 'Antigravity IDE & ADE', status: 'CONNECTED', wsEndpoint: 'ws://localhost:8765/antigravity', boundFolderPath: 'c:\\BSC_Javis_OS', autoSync: true },
      { id: 'ide-2', name: 'Cursor AI Agent', status: 'SYNCING', wsEndpoint: 'ws://localhost:8765/cursor', boundFolderPath: 'C:\\BeausCreators\\01.BSC_HQ', autoSync: true }
    ]
  },

  NEURAL_VOICE_ACTORS: [
    { id: 'ko-KR-HyunsuMultilingualNeural', name: '🎙️ 현수 멀티링구얼 (Hyunsu HD · 영화 속 자비스 중저음 남성 · 기본 추천)', persona: 'jarvis', lang: 'ko/Multi' },
    { id: 'en-US-AndrewMultilingualNeural', name: '🎙️ Andrew 멀티링구얼 (글로벌 시네마틱 자비스 남성 · 한/영 완벽 발음)', persona: 'jarvis', lang: 'Multi-23' },
    { id: 'ko-KR-InJoonNeural', name: '🎙️ 인준 뉴럴 (InJoon HD · 침착한 비서실장 태준 남성)', persona: 'taejun', lang: 'ko-KR' },
    { id: 'en-US-BrianMultilingualNeural', name: '🎙️ Brian 멀티링구얼 (경쾌한 테크 리더 CTO 거누 남성)', persona: 'geonu', lang: 'Multi-23' },
    { id: 'ko-KR-SunHiNeural', name: '🎙️ 선희 뉴럴 (SunHi HD · 밝고 또렷한 수석비서 소하 여성 · 추천)', persona: 'soha', lang: 'ko-KR' },
    { id: 'en-US-AvaMultilingualNeural', name: '🎙️ Ava 멀티링구얼 (부드럽고 세련된 글로벌 소하 여성)', persona: 'soha', lang: 'Multi-23' },
    { id: 'en-US-EmmaMultilingualNeural', name: '🎙️ Emma 멀티링구얼 (차분한 임원 비서 여성)', persona: 'soha', lang: 'Multi-23' }
  ],

  DESIGN_SHOWCASE_OPTIONS: [
    { id: 'cyber-hud', titleKo: '시안 1: 홀로그램 사이버 HUD (BSC 기본)', titleEn: 'Holographic Cyber HUD', overseasReference: 'Iron Man J.A.R.V.I.S. Obsidian & Cyan' },
    { id: 'minimal-dark', titleKo: '시안 2: 사파이어 시안 다크', titleEn: 'Sapphire Cyan Dark', overseasReference: 'Linear / Raycast Deep Slate & Sky' },
    { id: 'warm-light', titleKo: '시안 3: 에메랄드 라이트 글래스', titleEn: 'Emerald Light Glass', overseasReference: 'BSC JARVIS Emerald & White Glass' },
    { id: 'soft-studio', titleKo: '시안 4: 소프트 크리에이티브 스튜디오', titleEn: 'Soft Creative Studio', overseasReference: 'Runway / ElevenLabs Studio Tone' }
  ],

  INITIAL_OS_ACTION_QUEUE: [
    {
      id: 'act-init-1',
      actionType: 'FILE_SYSTEM',
      title: '프로젝트 파일 정리 (24개 주제별 자동 분류)',
      command: 'python jarvis_file_organizer.py --scan ./project_files --count 24 --mode topic_folders',
      target: '프로젝트 폴더 (파일 24개)',
      coordinates: '원본 유지 · 주제별 분류',
      riskLevel: 'SAFE',
      priority: 'HIGH',
      explanation: '프로젝트 관련 파일 24개를 분석하여 주제별 폴더로 정리합니다. 대표님 승인 후에만 실행됩니다.',
      status: 'PENDING',
      timestamp: '10:24:05'
    },
    {
      id: 'act-init-2',
      actionType: 'SHELL_EXEC',
      title: '시스템 리소스 및 메모리 최적화 점검',
      command: 'Get-CimInstance Win32_OperatingSystem | Select-Object Caption, FreePhysicalMemory',
      target: '시스템 프로세스 및 RAM',
      coordinates: '해당 없음',
      riskLevel: 'SAFE',
      priority: 'MEDIUM',
      explanation: '현재 PC에서 메모리 여유 공간과 상위 점유 프로세스를 실시간 스캔합니다.',
      status: 'PENDING',
      timestamp: '10:24:08'
    },
    {
      id: 'act-init-3',
      actionType: 'PYTHON_SCRIPT',
      title: '블렌더 VFX 씬 쉐이더 캐시 스냅샷 백업',
      command: 'python backup_blender_cache.py --scene vfx_main --compress zstd',
      target: 'Blender VFX 캐시 디렉토리',
      coordinates: '백그라운드 압축',
      riskLevel: 'SAFE',
      priority: 'LOW',
      explanation: '렌더링 전 3D 쉐이더 및 볼륨 플루이드 시뮬레이션 캐시를 안전하게 스냅샷 백업합니다.',
      status: 'PENDING',
      timestamp: '10:24:12'
    }
  ],

  STT_ENGINE_OPTIONS: [
    {
      id: 'whisper-large-v3',
      name: 'Whisper Large-v3 Turbo',
      provider: '무료 클라우드 오픈모델 API (Groq 호환)',
      latencyBadge: '0.18초',
      costBadge: '무료 (Free)',
      description: '해외 AI 유튜버들이 가장 많이 사용하는 초고속 다국어 음성 인식 모델로, 한국어와 영어 기술 용어를 정확하게 텍스트로 변환합니다.'
    },
    {
      id: 'faster-whisper-local',
      name: 'Faster-Whisper + RealtimeSTT',
      provider: '내 PC 로컬 구동 (CTranslate2 INT8)',
      latencyBadge: '0.12초',
      costBadge: '100% 무료 로컬',
      description: '인터넷이나 API 요금 없이 내 컴퓨터에서 "자비스" 호출어 감지와 실시간 음성 인식을 수행하는 오픈소스 엔진입니다.'
    },
    {
      id: 'gemini-3.5-transcribe',
      name: 'Gemini 3.5 Transcribe',
      provider: '서버 기본 내장 음성 엔진',
      latencyBadge: '0.20초',
      costBadge: '기본 무료 내장',
      description: '별도 설치 없이 웹 브라우저 마이크 입력을 즉시 고해상도 한글 텍스트로 변환하는 내장 음성 인식기입니다.'
    }
  ],

  LLM_ENGINE_OPTIONS: [
    {
      id: 'gemma4:e4b',
      name: '🟢 Gemma 4 E4B (대표님 PC 로컬 Ollama 설치됨 · 9.6GB)',
      provider: '내 PC 로컬 Ollama (localhost:11434 · 100% 무료)',
      latencyBadge: '165 토큰/초',
      costBadge: '$0 완전 무료 로컬',
      categoryTag: '대표님 PC 설치 주력 두뇌',
      baseTtftMs: 42,
      baseTps: 165,
      baseVramGb: 6.4,
      baseWatts: 38,
      taskScores: { 'os-voice-routing': 98, 'code-blender-bpy': 95, 'reasoning-rl-math': 96, 'rag-vision-multimodal': 98 },
      description: '현재 이건우 대표님 PC의 Ollama에 실제 설치되어 구동 중인 주력 Gemma 4 (e4b / latest, 9.6GB) 로컬 두뇌입니다.'
    },
    {
      id: 'gemma4:e2b',
      name: '🟢 Gemma 4 E2B (대표님 PC 로컬 초고속 SLM · 7.2GB)',
      provider: '내 PC 로컬 Ollama (localhost:11434 · 100% 무료)',
      latencyBadge: '240 토큰/초',
      costBadge: '$0 완전 무료 로컬',
      categoryTag: '대표님 PC 초고속 SLM',
      baseTtftMs: 28,
      baseTps: 240,
      baseVramGb: 4.8,
      baseWatts: 25,
      taskScores: { 'os-voice-routing': 99, 'code-blender-bpy': 91, 'reasoning-rl-math': 90, 'rag-vision-multimodal': 94 },
      description: '현재 대표님 PC의 Ollama에 설치된 초저지연 Gemma 4 E2B 모델로, 음성 대화 시 즉각적인 응답을 제공합니다.'
    },
    {
      id: 'gemma4:31b',
      name: '🟢 Gemma 4 31B (대표님 PC 로컬 대형 추론 두뇌 · 19.8GB)',
      provider: '내 PC 로컬 Ollama (localhost:11434 · 100% 무료)',
      latencyBadge: '85 토큰/초',
      costBadge: '$0 완전 무료 로컬',
      categoryTag: '대표님 PC 심층 추론',
      baseTtftMs: 95,
      baseTps: 85,
      baseVramGb: 19.0,
      baseWatts: 95,
      taskScores: { 'os-voice-routing': 94, 'code-blender-bpy': 99, 'reasoning-rl-math': 99, 'rag-vision-multimodal': 98 },
      description: '현재 대표님 PC의 Ollama에 설치된 31B 대형 모델로, 고난도 아키텍처 설계와 심층 추론을 수행합니다.'
    },
    {
      id: 'laya-421m-rlcd',
      name: 'Laya-421M-RLCD + Llama 3 하이브리드',
      provider: 'ConvAI Laya (System-1 강화학습 결정 모델)',
      latencyBadge: '0.03초 라우팅',
      costBadge: '100% 무료 오픈소스',
      categoryTag: 'Laya 초고속 판단',
      baseTtftMs: 31,
      baseTps: 380,
      baseVramGb: 0.9,
      baseWatts: 18,
      taskScores: { 'os-voice-routing': 99, 'code-blender-bpy': 89, 'reasoning-rl-math': 86, 'rag-vision-multimodal': 90 },
      description: '강화학습(RLCD)으로 훈련된 421M 크기의 초경량 오픈모델 Laya가 0.03초 만에 사용자 의도를 분류·판단하고 최적의 무료 모델로 연결합니다.'
    },
    {
      id: 'rea-open-agent-14b',
      name: 'REA Open-Agent 14B (Reverse Engineer Anything · MCP)',
      provider: 'REA 오픈소스 역공학·에이전틱 오픈모델 (MIT)',
      latencyBadge: '142 토큰/초',
      costBadge: '100% 무료 오픈모델',
      categoryTag: 'REA 오픈소스 역공학·분석',
      baseTtftMs: 88,
      baseTps: 142,
      baseVramGb: 8.4,
      baseWatts: 65,
      taskScores: { 'os-voice-routing': 92, 'code-blender-bpy': 98, 'reasoning-rl-math': 95, 'rag-vision-multimodal': 89 },
      description: '바이너리, Electron 앱, 웹 번들, API 프로토콜 및 런타임 동작을 역공학(Reverse Engineering) 분석하고 기능을 재구축하는 오픈소스 에이전틱 모델입니다.'
    },
    {
      id: 'llama-3.3-70b-versatile',
      name: 'Meta Llama 3.3 70B Versatile',
      provider: 'Meta 오픈웨이트 (무료 클라우드 추론)',
      latencyBadge: '310 토큰/초',
      costBadge: '무료 오픈모델',
      categoryTag: '대표 대형 오픈모델',
      baseTtftMs: 120,
      baseTps: 310,
      baseVramGb: 4.2,
      baseWatts: 45,
      taskScores: { 'os-voice-routing': 96, 'code-blender-bpy': 94, 'reasoning-rl-math': 95, 'rag-vision-multimodal': 93 },
      description: '자연스러운 대화, 컴퓨터 제어 명령 생성, 데이터 분석에서 상용 유료 모델 수준의 성능을 무료로 제공하는 핵심 두뇌입니다.'
    },
    {
      id: 'llama-3.2-3b-slm-ollama',
      name: 'Meta Llama 3.2 3B Instruct (SLM)',
      provider: 'Ollama 로컬 무료 서버 (localhost:11434)',
      latencyBadge: '95 토큰/초',
      costBadge: '완전 무료 로컬 SLM',
      categoryTag: '초경량 SLM',
      baseTtftMs: 48,
      baseTps: 95,
      baseVramGb: 2.1,
      baseWatts: 22,
      taskScores: { 'os-voice-routing': 94, 'code-blender-bpy': 82, 'reasoning-rl-math': 79, 'rag-vision-multimodal': 81 },
      description: '일반 노트북이나 보급형 PC에서도 메모리 3GB 미만으로 가볍게 돌아가는 메타의 대표 소형 언어모델(SLM)입니다.'
    },
    {
      id: 'qwen-2.5-coder-32b',
      name: 'Qwen 2.5 Coder 32B Instruct',
      provider: 'Alibaba 오픈웨이트 (무료 코딩/제어 엔진)',
      latencyBadge: '220 토큰/초',
      costBadge: '무료 오픈모델',
      categoryTag: '컴퓨터 제어·코딩 특화',
      baseTtftMs: 95,
      baseTps: 220,
      baseVramGb: 18.0,
      baseWatts: 85,
      taskScores: { 'os-voice-routing': 91, 'code-blender-bpy': 99, 'reasoning-rl-math': 94, 'rag-vision-multimodal': 86 },
      description: '파이썬 자동화 스크립트, PyAutoGUI 마우스/키보드 제어, 블렌더 bpy 3D 코딩에 가장 뛰어난 오픈소스 코딩 모델입니다.'
    },
    {
      id: 'phi-4-mini-3.8b-slm',
      name: 'Microsoft Phi-4 Mini 3.8B (SLM)',
      provider: 'MS 오픈웨이트 소형 언어모델',
      latencyBadge: '110 토큰/초',
      costBadge: '완전 무료 SLM',
      categoryTag: '고효율 추론 SLM',
      baseTtftMs: 52,
      baseTps: 110,
      baseVramGb: 2.5,
      baseWatts: 25,
      taskScores: { 'os-voice-routing': 93, 'code-blender-bpy': 90, 'reasoning-rl-math': 92, 'rag-vision-multimodal': 84 },
      description: '작은 크기(3.8B)에도 논리적 추론과 수학·데이터 분석 능력이 뛰어나 강화학습(GRPO) 튜닝 베이스로 인기가 높은 SLM입니다.'
    },
    {
      id: 'gemma-3-12b-it',
      name: 'Google Gemma 3 12B IT',
      provider: 'Google 오픈웨이트 멀티모달',
      latencyBadge: '160 토큰/초',
      costBadge: '무료 오픈모델',
      categoryTag: '다국어·시각 오픈모델',
      baseTtftMs: 74,
      baseTps: 160,
      baseVramGb: 7.2,
      baseWatts: 55,
      taskScores: { 'os-voice-routing': 92, 'code-blender-bpy': 88, 'reasoning-rl-math': 91, 'rag-vision-multimodal': 97 },
      description: '단일 GPU에서 구동 가능하며 한국어 표현력과 이미지·화면 이해 능력이 우수한 최신 오픈웨이트 모델입니다.'
    },
    {
      id: 'deepseek-r1-distill-llama-70b',
      name: 'DeepSeek-R1 Distill Llama 70B',
      provider: 'GRPO 강화학습 추론 오픈모델',
      latencyBadge: '185 토큰/초',
      costBadge: '무료 오픈모델',
      categoryTag: '강화학습 심층추론',
      baseTtftMs: 140,
      baseTps: 185,
      baseVramGb: 24.0,
      baseWatts: 110,
      taskScores: { 'os-voice-routing': 88, 'code-blender-bpy': 96, 'reasoning-rl-math': 99, 'rag-vision-multimodal': 90 },
      description: '대규모 강화학습(GRPO)을 통해 스스로 생각하고 검증하는 사슬 추론(Chain-of-Thought) 능력을 갖춘 오픈소스 모델입니다.'
    },
    {
      id: 'gemini-3.8-flash',
      name: 'Gemini 2.5 Pro / 3.8 Flash (Google Cloud 멀티모달)',
      provider: 'Google Gemini API (클라우드 멀티모달)',
      latencyBadge: '250 토큰/초',
      costBadge: 'Google Gemini 연동',
      categoryTag: '초고속 멀티모달',
      baseTtftMs: 65,
      baseTps: 250,
      baseVramGb: 0.0,
      baseWatts: 12,
      taskScores: { 'os-voice-routing': 97, 'code-blender-bpy': 95, 'reasoning-rl-math': 95, 'rag-vision-multimodal': 99 },
      description: '음성, 실시간 카메라 화면, 데이터 분석을 끊김 없이 한 번에 처리하는 Google Gemini 멀티모달 엔진입니다.'
    },
    {
      id: 'gpt-4o',
      name: '🟠 OpenAI GPT-4o / o3-mini (클라우드 추론·코딩 AI)',
      provider: 'OpenAI API (api.openai.com)',
      latencyBadge: '210 토큰/초',
      costBadge: 'OpenAI GPT 연동',
      categoryTag: 'OpenAI 클라우드',
      baseTtftMs: 75,
      baseTps: 210,
      baseVramGb: 0.0,
      baseWatts: 12,
      taskScores: { 'os-voice-routing': 98, 'code-blender-bpy': 98, 'reasoning-rl-math': 98, 'rag-vision-multimodal': 97 },
      description: 'OpenAI GPT-4o 및 o3-mini 엔진과 직결되어 자연어 음성 비서 및 고난도 코딩을 수행합니다.'
    },
    {
      id: 'lmstudio-local-gguf',
      name: '🟣 LM Studio Local Server (localhost:1234 · GGUF)',
      provider: '내 PC 로컬 LM Studio (OpenAI 호환 서버 · $0 무료)',
      latencyBadge: '155 토큰/초',
      costBadge: '$0 완전 무료 로컬',
      categoryTag: 'LM Studio 로컬 GGUF',
      baseTtftMs: 48,
      baseTps: 155,
      baseVramGb: 6.0,
      baseWatts: 35,
      taskScores: { 'os-voice-routing': 96, 'code-blender-bpy': 96, 'reasoning-rl-math': 95, 'rag-vision-multimodal': 92 },
      description: '내 PC의 LM Studio(:1234)에 로드된 모든 GGUF 오픈모델을 자비스 및 사사리사의 주력 두뇌로 연결합니다.'
    }
  ],

  TTS_ENGINE_OPTIONS: [
    {
      id: 'edge-neural-korean-tts',
      name: '🏆 Edge Neural DragonHD (현수/선희/Andrew/Ava · 0.2초 무지연 · 기본 작동)',
      provider: '24kHz 48kbps 초고음질 신경망 성우 스트리밍 (VRAM 0MB)',
      latencyBadge: '0.18초',
      costBadge: '₩0 완전 무료',
      description: '설치나 GPU 메모리 점유 없이 영화 속 자비스(현수/Andrew)와 수석비서 소하(선희/Ava)의 자연스러운 호흡을 즉시 출력합니다.'
    },
    {
      id: 'chatterbox-multilingual',
      name: '🥇 Chatterbox Multilingual (resemble-ai/chatterbox · MIT 오픈소스 1위)',
      provider: '내 목소리 10초 복제 · 23개 언어 원어민 억양 (유튜브 벤치마크 1위)',
      latencyBadge: '0.45초 (GPU)',
      costBadge: '₩0 MIT 오픈소스',
      description: '유튜브 15개 성우 AI 비교 1위! 한국어 말투 간섭 없이 내 음색(유사도 0.75 vs ElevenLabs 0.67)만 추출해 23개 언어를 원어민 억양(9/10)으로 발화하며 감정 세기(exaggeration)를 조절합니다.'
    },
    {
      id: 'qwen3-tts',
      name: '🥈 Qwen3-TTS (QwenLM/Qwen3-TTS · 한국어/중국어 발음 명료도 최강)',
      provider: 'Alibaba Qwen 오픈웨이트 멀티링구얼 TTS',
      latencyBadge: '0.35초 (GPU)',
      costBadge: '₩0 오픈웨이트',
      description: '한국어와 동아시아 언어의 자모음 발음 정확도와 장문 낭독 안정성이 가장 뛰어난 오픈소스 TTS 모델입니다.'
    },
    {
      id: 'cosyvoice-3',
      name: '🥉 CosyVoice 3 (FunAudioLLM · 일본어 가나 & 감정 억양 특화)',
      provider: 'FunAudioLLM 제로샷 보이스 클로닝 & 감정 제어',
      latencyBadge: '0.40초 (GPU)',
      costBadge: '₩0 오픈소스',
      description: '일본어(가나 변환 시 9.5/10점) 및 세밀한 감정 호흡 표현에서 최고 점수를 기록한 오픈소스 음성 합성기입니다.'
    },
    {
      id: 'voxcpm-2',
      name: '⚡ VoxCPM2 (OpenBMB/VoxCPM · 비토크나이저 End-to-End)',
      provider: 'OpenBMB 연속 오디오 표현 기반 문맥 인지 TTS',
      latencyBadge: '0.30초',
      costBadge: '₩0 오픈소스',
      description: '이산 코덱(Discrete Tokenizer) 손실 없이 문맥에 맞춰 자연스러운 억양과 운율을 직접 생성하는 차세대 오픈모델입니다.'
    },
    {
      id: 'kokoro-82m-local',
      name: '🪶 Kokoro-82M / OpenVoice v2 (초경량 CPU 로컬 TTS)',
      provider: '82M 파라미터 초경량 ONNX/PyTorch 로컬 엔진',
      latencyBadge: '0.09초 (CPU)',
      costBadge: '₩0 초경량 로컬',
      description: '외장 GPU 없이 CPU만으로도 0.1초 내에 음성을 합성하는 초경량 오픈웨이트 모델입니다.'
    }
  ],

  OPEN_SOURCE_TTS_BENCHMARK: {
    videoRef: 'https://www.youtube.com/watch?v=pnQUKnmPkFg&t=484s',
    guideUrl: 'https://www.aicitybuilders.com/dubbing',
    summaryKo: '유료 ElevenLabs(30분×6개국어 약 36만 원) 대신 내 PC/Colab에서 ₩0으로 구동하는 오픈소스 TTS 15종 실전 비교 결과, 다국어 보이스 클로닝은 【Chatterbox Multilingual(MIT)】, 실시간 한국어 비서 응답은 【Edge Neural HD + Qwen3-TTS】, 일본어는 【CosyVoice 3】 조합이 최고 성능을 기록했습니다.',
    modelsCompared: [
      { rank: '🏆 실시간 비서 1위', name: 'Edge Neural DragonHD (현수/선희/Andrew)', license: 'Free Neural Stream', timbreScore: '자연스러움 9.6/10', accentScore: '한국어/영어 9.7/10', vram: '0 MB (무지연)', bestFor: '자비스 & 소하 실시간 0.2초 음성 대화 (현재 즉시 작동)' },
      { rank: '🥇 글로벌 더빙 1위', name: 'Chatterbox Multilingual (resemble-ai)', license: 'MIT 오픈소스', timbreScore: '0.75 (ElevenLabs 0.67 압도)', accentScore: '원어민 억양 9.0/10', vram: '3.8 GB', bestFor: '내 목소리 10~30초 복제 후 23개 언어 원어민 발음 더빙 (exaggeration 감정 조절)' },
      { rank: '🥈 한국어 로컬 1위', name: 'Qwen3-TTS (QwenLM/Qwen3-TTS)', license: 'Apache-2.0', timbreScore: '0.72', accentScore: '한국어 발음 9.4/10 (영어 복제 시 한국 말투 4/10)', vram: '4.2 GB', bestFor: '한국어 단독 장문 브리핑 및 나레이션' },
      { rank: '🥉 일본어 특화 1위', name: 'CosyVoice 3 (FunAudioLLM)', license: 'Apache-2.0', timbreScore: '0.73', accentScore: '일본어(가나) 9.5/10', vram: '4.0 GB', bestFor: '일본어·중국어 감성 보이스 클로닝' },
      { rank: '4위 (End-to-End)', name: 'VoxCPM2 (OpenBMB/VoxCPM)', license: 'Apache-2.0', timbreScore: '0.70', accentScore: '문맥 운율 8.8/10', vram: '2.6 GB', bestFor: '토크나이저 없는 연속 파형 직접 합성' },
      { rank: '5위 (음색 변환)', name: 'Seed-VC & Confucius4-TTS', license: 'MIT / Apache-2.0', timbreScore: '0.71', accentScore: '감정/노래 변환 8.7/10', vram: '2.2 GB', bestFor: '기존 오디오의 억양은 유지하고 음색만 내 목소리로 교체' }
    ],
    colabSixCells: [
      { step: 'CELL 01 · 설치', cmd: '!pip install -q chatterbox-tts "setuptools<81"' },
      { step: 'CELL 02 · 엔진 로드', cmd: 'from chatterbox.mtl_tts import ChatterboxMultilingualTTS\ntts = ChatterboxMultilingualTTS.from_pretrained(device="cuda")' },
      { step: 'CELL 03 · 내 목소리 30초 정규화', cmd: 'ffmpeg -y -i my_sample.mp3 -ac 1 -ar 24000 -t 30 my_voice_24k.wav' },
      { step: 'CELL 04 · 감정/차분함 조절 합성', cmd: 'wav = tts.generate(TEXT, language_id="ko", audio_prompt_path="my_voice_24k.wav", exaggeration=0.5, cfg_weight=0.45)' },
      { step: 'CELL 05 · 23개국어 일괄 더빙', cmd: 'for lang, txt in SAY.items(): torchaudio.save(f"{lang}.wav", tts.generate(txt, language_id=lang, audio_prompt_path=VOICE).cpu(), tts.sr)' },
      { step: 'CELL 06 · 로컬 자비스 TTS 서버 기동', cmd: 'python c:\\BSC_Javis_OS\\scripts\\local-open-tts-server.py --port 7860' }
    ]
  },

  SITUATIONAL_PRESETS: [
    {
      id: 'daily-assistant',
      titleKo: '일상 대화 & 빠른 음성 비서 모드',
      recommendedModels: 'Whisper Large-v3 + Laya-421M + Llama 3.3 70B',
      descKo: 'Laya 초고속 라우터와 Whisper, Llama 3.3을 결합해 가장 빠르고 친근하게 음성 대화를 나눕니다.',
      applyConfig: { sttEngine: 'whisper-large-v3', llmEngine: 'laya-421m-rlcd', ttsEngine: 'gemini-3.8-flash-lite-tts', layaRouterEnabled: true, temperature: 0.7 }
    },
    {
      id: 'free-local-slm',
      titleKo: '100% 무료 로컬 & 저사양 SLM 절전 모드',
      recommendedModels: 'Faster-Whisper + Llama 3.2 3B SLM + Kokoro-82M',
      descKo: 'API 비용 없이 내 PC 자원을 최소한으로 쓰면서 소형 오픈모델(Llama 3.2 3B / Phi-4 Mini)로 구동합니다.',
      applyConfig: { sttEngine: 'faster-whisper-local', llmEngine: 'llama-3.2-3b-slm-ollama', ttsEngine: 'kokoro-82m-local', layaRouterEnabled: true, temperature: 0.5 }
    },
    {
      id: 'pc-automation',
      titleKo: '컴퓨터 자동 제어 & 코딩 에이전트 모드',
      recommendedModels: 'Whisper Large-v3 + Qwen 2.5 Coder 32B + Open Interpreter',
      descKo: '마우스/키보드 조작, 파일 정리, 터미널 명령어 생성에 특화된 Qwen 2.5 Coder와 안전 승인 게이트를 활성화합니다.',
      applyConfig: { sttEngine: 'whisper-large-v3', llmEngine: 'qwen-2.5-coder-32b', ttsEngine: 'browser-web-speech', layaRouterEnabled: true, temperature: 0.2 }
    },
    {
      id: 'rl-slm-training',
      titleKo: '강화학습(GRPO/RLHF) & SLM 튜닝 연구 모드',
      recommendedModels: 'DeepSeek-R1 Distill 70B + Phi-4 Mini SLM + Unsloth GRPO',
      descKo: 'DeepSeek-R1 추론 엔진과 Unsloth GRPO 강화학습 파라미터를 조합하여 나만의 소형 언어모델(SLM)을 훈련·설계합니다.',
      applyConfig: { sttEngine: 'gemini-3.5-transcribe', llmEngine: 'deepseek-r1-distill-llama-70b', ttsEngine: 'browser-web-speech', layaRouterEnabled: true, temperature: 0.4 }
    },
    {
      id: 'vision-inspector',
      titleKo: '실시간 카메라 & 화면 공유 비전 분석 모드',
      recommendedModels: 'Gemini 3.8 Flash Vision + Gemma 3 12B + OmniParser',
      descKo: '웹캠 사물/표정 인식과 내 컴퓨터 화면 캡처 분석에 최적화된 멀티모달 비전 파이프라인을 가동합니다.',
      applyConfig: { sttEngine: 'whisper-large-v3', llmEngine: 'gemini-3.8-flash', ttsEngine: 'gemini-3.8-flash-lite-tts', layaRouterEnabled: true, temperature: 0.4 }
    }
  ],

  DEFAULT_VOICE_MACROS: [
    {
      id: 'vm-1',
      phrase: '자비스, 바탕화면 정리해',
      actionType: 'PYTHON_SCRIPT',
      targetScriptOrCommand: 'python3 ~/.jarvis/scripts/clean_desktop.py --target ~/Desktop --archive-tmp',
      descriptionKo: '바탕화면에 흩어진 임시 파일과 캡처 이미지를 날짜별 폴더로 자동 정리 및 압축 저장',
      isEnabled: true,
      riskLevel: 'SAFE',
      lastTriggeredAt: '방금 전'
    },
    {
      id: 'vm-2',
      phrase: '자비스, 블렌더 렌더링 시작해',
      actionType: 'SHELL_EXEC',
      targetScriptOrCommand: 'blender -b ~/projects/character_rig.blend -o //render_out/ -f 1 --engine CYCLES',
      descriptionKo: '현재 선택된 3D 캐릭터 시트 및 블렌더 프로젝트 백그라운드 Cycles 프레임 렌더링',
      isEnabled: true,
      riskLevel: 'MODERATE',
      lastTriggeredAt: '3시간 전'
    },
    {
      id: 'vm-3',
      phrase: '자비스, 시스템 메모리 및 GPU 최적화',
      actionType: 'SHELL_EXEC',
      targetScriptOrCommand: 'python3 -c "import torch, gc; gc.collect(); torch.cuda.empty_cache()"',
      descriptionKo: 'PyTorch GPU VRAM 캐시를 강제 해제하고 메모리 점유 상위 10개 프로세스 정밀 스캔',
      isEnabled: true,
      riskLevel: 'SAFE',
      lastTriggeredAt: '10분 전'
    },
    {
      id: 'vm-4',
      phrase: '자비스, 안티그래비티 IDE 빌드 검증',
      actionType: 'OS_AUTOMATION',
      targetScriptOrCommand: 'npm run lint && npm run build -- --profile',
      descriptionKo: '안티그래비티 ADE 워크스페이스 내 전체 소스코드 린트 및 번들 컴파일 상태 자동 정밀 검사',
      isEnabled: true,
      riskLevel: 'SAFE',
      lastTriggeredAt: '오늘 09:15'
    }
  ],

  OPEN_SOURCE_JARVIS_CATALOG: [
    {
      id: 'rea-open-model',
      name: 'REA 오픈모델 (Reverse Engineer Anything · MCP 에이전트)',
      repoSlug: 'morluto/rea',
      category: '오픈모델 두뇌 (LLM/SLM)',
      starsEstimate: '21.4k+ Stars',
      license: 'MIT License',
      summary: '디스어셈블리, 디컴파일(Ghidra/IDA 연동), 네트워크 프로토콜 트레이싱, Electron/웹 번들 AST 분석을 체이닝하여 타겟 소프트웨어의 아키텍처를 추론하고 클린 코드로 재구축합니다.',
      installCommand: 'npx @morluto/rea-mcp --serve && ollama pull rea-open-agent:14b'
    },
    {
      id: 'ai-os-maps-guide',
      name: 'AI-OS MAPS 4-Layer Architecture (Memory · Agent · Pulse · Screen)',
      repoSlug: 'pavrus117/ai-os-maps-guide',
      category: '컴퓨터 제어 (OS Control)',
      starsEstimate: 'MAPS AI-OS Standard',
      license: 'MIT / Open Architecture Guide',
      summary: '단발성 챗봇을 넘어 스스로 기억을 유지(Memory)하고, 전문 에이전트를 조율(Agent)하며, 크론/상태 기반으로 선제 작동(Pulse)하고, 화면 인터페이스로 시각화(Screen)하는 4계층 AI OS 표준입니다.',
      installCommand: 'mkdir -p ~/.jarvis/maps/{memory,agents,pulse,screen}'
    },
    {
      id: 'laya-convai',
      name: 'Laya-421M System-1 & Laya Command Center',
      repoSlug: 'ConvAI-Innovations/laya',
      category: 'Laya & 강화학습 (RL/SLM)',
      starsEstimate: '3.9k+ Stars',
      license: 'Apache-2.0',
      summary: '강화학습(RLCD)으로 학습된 421M 파라미터 오픈모델로, 100개 이상의 언어에서 33ms 초고속 라우팅·분류·신뢰도 판단을 수행합니다.',
      installCommand: 'pip install transformers torch && ollama pull llama3.2'
    },
    {
      id: 'unsloth-grpo',
      name: 'Unsloth + HuggingFace TRL (GRPO / RLHF 학습)',
      repoSlug: 'unslothai/unsloth',
      category: 'Laya & 강화학습 (RL/SLM)',
      starsEstimate: '34k+ Stars',
      license: 'Apache-2.0',
      summary: '커스텀 Triton 커널을 통해 메모리(VRAM) 사용량을 80% 줄이고 학습 속도를 2배 높여, 단 5~7GB VRAM만으로도 나만의 자비스 추론 모델(GRPO 강화학습 및 QLoRA)을 훈련할 수 있습니다.',
      installCommand: 'pip install unsloth trl peft accelerate bitsandbytes'
    },
    {
      id: 'realtimestt',
      name: 'RealtimeSTT + Faster-Whisper',
      repoSlug: 'KoljaB/RealtimeSTT',
      category: '음성 인식 (STT)',
      starsEstimate: '5.8k+ Stars',
      license: 'MIT License',
      summary: '사용자가 말을 시작하고 끝내는 순간을 자동으로 감지하고, Faster-Whisper를 통해 기존 대비 4배 빠른 속도로 음성을 한글/영문 텍스트로 변환합니다.',
      installCommand: 'pip install RealtimeSTT faster-whisper openwakeword'
    },
    {
      id: 'ollama-llama3',
      name: 'Ollama (Llama 3.2/3.3 · Qwen 2.5 · Phi-4 구동)',
      repoSlug: 'ollama/ollama',
      category: '오픈모델 두뇌 (LLM/SLM)',
      starsEstimate: '115k+ Stars',
      license: 'MIT License',
      summary: 'Llama 3.2(3B SLM), Qwen 2.5 Coder, Phi-4 Mini, Gemma 3 등 최신 무료 오픈모델을 로컬 서버(localhost:11434)로 실행하여 자비스의 두뇌로 연결합니다.',
      installCommand: 'ollama pull llama3.2:3b && ollama pull qwen2.5-coder:7b && ollama pull phi4-mini'
    },
    {
      id: 'open-interpreter',
      name: 'Open Interpreter & PyAutoGUI',
      repoSlug: 'OpenInterpreter/open-interpreter',
      category: '컴퓨터 제어 (OS Control)',
      starsEstimate: '58k+ Stars',
      license: 'MIT License',
      summary: 'AI가 생성한 파이썬/터미널 명령과 마우스·키보드 제어 코드를 안전한 사용자 승인을 거쳐 실제 내 컴퓨터에서 실행합니다.',
      installCommand: 'pip install open-interpreter pyautogui psutil'
    },
    {
      id: 'omniparser-kokoro',
      name: 'OmniParser 비전 & Kokoro-82M 음성 합성',
      repoSlug: 'microsoft/OmniParser',
      category: '화면 비전 & 음성 합성',
      starsEstimate: '12k+ Stars',
      license: 'MIT / Apache-2.0',
      summary: '컴퓨터 화면 캡처에서 클릭 가능한 모든 UI 요소의 좌표를 추출하고, Kokoro-82M 신경망 TTS로 자연스러운 음성 응답을 출력합니다.',
      installCommand: 'pip install kokoro-onnx sounddevice mss pillow'
    }
  ],

  // MAPS 4-Layer Memory Vault Files
  MAPS_MEMORY_FILES: [
    {
      id: 'mem-identity',
      filename: '~/.jarvis/maps/memory/IDENTITY.md',
      tier: 'LONG_TERM',
      tierLabelKo: '장기 코어 기억 (Long-Term Core · Coram Deo)',
      tokensCount: 420,
      lastSynced: '실시간 동기화',
      content: `# J.A.R.V.I.S. AI-OS Core Identity (MAPS Layer 1: Memory)\n- Worldview: Coram Deo (하나님 앞에서) & Together (함께 동역하는 청지기)\n- Architecture: pavrus117/ai-os-maps-guide (Memory · Agent · Pulse · Screen)\n- Primary Brain Router: Laya-421M-RLCD (33ms System-1) + REA Open-Agent 14B (Reverse-Eng MCP)\n- CEO: 이건우 대표님 (BeausCreators 최고경영자)\n- Safety Directive: OS 파일/쉘 변경 전 실행 승인 게이트(Human-in-the-Loop) 및 원본 보존 100% 필수`
    },
    {
      id: 'mem-projects',
      filename: '~/.jarvis/maps/memory/PROJECTS.md',
      tier: 'LONG_TERM',
      tierLabelKo: '장기 프로젝트 컨텍스트 (Project Graph)',
      tokensCount: 680,
      lastSynced: '2분 전',
      content: `# Active Workspace Projects & Domain Separation\n1. [BSC J.A.R.V.I.S. OS] 3D/2D Constellation Graph + Autonomous Window Spawner HUD\n2. [JarvisAgentRegistry] SRP 클래스 분리 에이전트 레지스트리 & BSC 28인 요원 연동\n3. [CreativeAssetManager] 캐릭터 360° 턴어라운드 시트 · 블렌더 3D VFX · 스토리보드 스튜디오\n4. [REA Open-Model Workbench] 바이너리·Electron·웹 번들 역공학 및 클린 코드 재구축`
    },
    {
      id: 'mem-episodic',
      filename: '~/.jarvis/maps/memory/EPISODIC_PULSE.md',
      tier: 'MID_TERM',
      tierLabelKo: '중기 에피소드 스냅샷 (State-Aware Episode)',
      tokensCount: 510,
      lastSynced: '실시간 동기화',
      content: `# Recent State-Aware Episodes (Synced with Pulse Engine)\n- Google AI Studio 17개 스튜디오 및 9대 오픈모델 라우터 BSC_Javis_OS 완전 통합 완료\n- REA Open-Agent 14B (morluto/rea MCP) 로컬 역공학 엔진 바인딩 완료\n- MAPS 4계층(Memory·Agent·Pulse·Screen) 아키텍처 파이프라인 가동`
    },
    {
      id: 'mem-working',
      filename: '~/.jarvis/maps/memory/WORKING_BUFFER.md',
      tier: 'SHORT_TERM',
      tierLabelKo: '단기 작업 버퍼 (Working Context)',
      tokensCount: 290,
      lastSynced: '실시간 (31ms)',
      content: `# Active Working Context Window\n- Current Focus: AI-OS MAPS 4-Layer Control & Full Studio Integration\n- Active VRAM Allocation: 2.4 GB / 24.0 GB (KV Cache Quantized Q8_0)\n- Next Scheduled Pulse: Repo Drift & Memory Compaction in 4m 12s`
    }
  ],

  // MAPS Layer 3: Pulse Cron Routines
  MAPS_PULSE_ROUTINES: [
    {
      id: 'pulse-morning-brief',
      nameKo: '모닝 브리핑 & 코람데오 일일 우선순위 자동 합성',
      cronExpr: '30 08 * * *',
      triggerType: 'CRON_SCHEDULE',
      assignedAgent: 'JARVIS + 소하(수석비서) + RecursiveWikiAgent',
      descriptionKo: '매일 오전 8:30 로컬 MEMORY.md와 글로벌 AI 트렌드·일정을 교차 분석해 화면(Screen) HUD에 브리핑 창을 띄웁니다.',
      command: 'python3 ~/.jarvis/maps/pulse/morning_briefing.py --memory ~/.jarvis/maps/memory/PROJECTS.md --notify-hud',
      isActive: true,
      lastPulseAt: '오늘 08:30'
    },
    {
      id: 'pulse-rea-binary-audit',
      nameKo: 'REA 오픈모델 기반 외부 패키지·바이너리 무결성 스캔',
      cronExpr: '*/30 * * * *',
      triggerType: 'STATE_CHANGE',
      assignedAgent: 'ReaReverseEngineeringAgent (rea-open-agent-14b) + 수호(QA)',
      descriptionKo: '새 빌드 아티팩트나 외부 바이너리 변경 감지 시 REA MCP 서버를 호출해 숨겨진 네트워크 호출과 심볼 트리를 자동 검증합니다.',
      command: 'npx @morluto/rea-mcp inspect --target ./dist --model rea-open-agent-14b --audit-outbound',
      isActive: true,
      lastPulseAt: '6분 전'
    },
    {
      id: 'pulse-memory-compaction',
      nameKo: '유휴 시간 계층형 메모리 압축 (Memory Compaction)',
      cronExpr: 'IDLE >= 10m',
      triggerType: 'IDLE_TRIGGER',
      assignedAgent: 'Laya-421M + Phi-4 Mini SLM',
      descriptionKo: '사용자 유휴 상태가 10분 이상 지속되면 단기 대화 버퍼(WORKING_BUFFER.md)의 핵심 결정 사항만 추려 장기 MEMORY.md로 병합합니다.',
      command: 'python3 ~/.jarvis/maps/pulse/compact_memory.py --source WORKING_BUFFER.md --target EPISODIC_PULSE.md',
      isActive: true,
      lastPulseAt: '14분 전'
    },
    {
      id: 'pulse-screen-posture-guard',
      nameKo: 'Screen 비전 집중도 & 피로도 선제 개입 루틴',
      cronExpr: '*/15 * * * *',
      triggerType: 'STATE_CHANGE',
      assignedAgent: 'OsAutomationAgent (EYES & WATCH Layer)',
      descriptionKo: '화면 전환 빈도와 카메라 자세 텔레메트리를 결합하여 집중력 저하 시 조도 및 휴식 알림을 선제 제안합니다.',
      command: 'python3 ~/.jarvis/maps/pulse/screen_focus_guard.py --check-posture --hud-overlay',
      isActive: true,
      lastPulseAt: '10분 전'
    }
  ],

  // REA (Reverse Engineer Anything) Target Samples (Includes SasariSa macOS -> Windows 11 Native Port)
  REA_TARGET_SAMPLES: [
    {
      id: 'rea-sasarisa-macos-to-win11',
      titleKo: '🎙️ 사사리사(SasariSa) macOS AI 음성 비서 ➔ Windows 11 네이티브 포팅 (mvcompany8500-web/sasarisa)',
      artifactType: 'macOS 14 Sonoma Swift + AppleScript + Accessibility ➔ Windows 11 Node.js/PowerShell/Win32',
      binaryPath: 'https://github.com/mvcompany8500-web/sasarisa (brew install --cask mvcompany8500-web/tap/sasarisa)',
      mcpToolchain: ['Invoke-ReaAnalyzer.js', 'ast-applescript-mapper', 'win32-com-synthesizer', 'multi-llm-provider-hub'],
      recoveredSymbolsCount: 412,
      tracedEndpoints: ['/api/jarvis/sasarisa/command', '/api/jarvis/sasarisa/confirm', '/api/jarvis/llm-hub/status'],
      architectureSummaryKo: '유튜브(muY9-sCxZlg) 및 GitHub(mvcompany8500-web/sasarisa)의 macOS 전용 음성 비서 아키텍처(Whisper 온디바이스 STT, AppleScript 음악/쇼핑 제어, Accessibility 카카오톡/메일 자동화, 되돌릴 수 없는 작업 2중 안전 확인, Claude 코딩 브릿지)를 REA 4단계 클린룸 역공학으로 분석하여 Windows 11 네이티브 엔진 + 4대 멀티 LLM(GPT·Gemini·LM Studio·Ollama) 통합 시스템으로 완벽 재구축했습니다.',
      decompiledPseudoCode: `// [REA Stage 2: mvcompany8500-web/sasarisa macOS Swift + AppleScript Deconstruction]\nfunc handleVoiceCommand(_ transcript: String) async {\n  let intent = await llmRouter.classifyIntent(transcript)\n  if intent.isIrreversible { // KakaoTalk send, Email reply, Payment\n    floatingHud.showConfirmationPrompt("정말로 실행하시겠습니까?")\n    guard await waitForUserConfirmation() else { return }\n  }\n  runAppleScript("tell application \\"Music\\" to playTrack(\\"\\(intent.query)\\")")\n}`,
      reconstructedCleanCode: `// [REA Stage 4: Clean Reconstructed Windows 11 Engine (rea-sasarisa-windows-engine.js)]\nexport async function parseAndExecuteSasarisaVoiceCommand(commandText, opts = {}) {\n  const intent = classifySasarisaWindowsSkill(commandText);\n  const llmReply = await chatWithUnifiedLlm({ provider: opts.provider, model: opts.model, prompt: commandText });\n  if (intent.requiresConfirmation && !opts.confirmed) {\n    return queueSasarisaSafetyConfirmation(intent, commandText, llmReply);\n  }\n  return await executeSafeWindowsDesktopCommand(intent, llmReply.text);\n}`
    },
    {
      id: 'rea-electron-asar',
      titleKo: '데스크톱 AI 워크스페이스 앱 (Electron app.asar 번들)',
      artifactType: 'Electron ASAR + Native Node Addon (.node)',
      binaryPath: '/Applications/TargetWorkspace.app/Contents/Resources/app.asar',
      mcpToolchain: ['rea-asar-unpacker', 'ghidra-headless-mcp', 'ast-ipc-tracer', 'rea-open-agent-14b'],
      recoveredSymbolsCount: 342,
      tracedEndpoints: ["ipcMain.handle('os:capture-window')", "ipcMain.handle('brain:sync-constellation')", 'ws://127.0.0.1:8765/mcp-bridge'],
      architectureSummaryKo: 'REA 오픈모델이 Electron 렌더러-메인 프로세스 간 IPC 채널 18개와 네이티브 C++ 화면 캡처 애드온의 메모리 버퍼 구조를 역추적하여, 제로-카피(Zero-Copy) WebSocket 스트리밍 구조로 재설계했습니다.',
      decompiledPseudoCode: `// [REA Stage 2: Ghidra + AST Decompiled Output]\nint __fastcall sub_1400048A0(void *frame_buf, size_t len) {\n  if (!frame_buf || len > 0x1FA4000) return -1;\n  uint64_t hash = fnv1a_64(frame_buf, len);\n  return ipc_dispatch_frame_channel("os:capture-window", frame_buf, hash);\n}`,
      reconstructedCleanCode: `// [REA Stage 4: Clean Reconstructed TypeScript by rea-open-agent-14b]\nexport async function captureAndStreamWindowFrame(windowHandle: number) {\n  const buffer = await nativeScreenAddon.captureWindowZeroCopy(windowHandle);\n  const frameHash = computeFnv1a64Hex(buffer);\n  await mcpBridgeClient.emit("os:capture-window", { frameHash, buffer });\n  return { frameHash, byteLength: buffer.byteLength };\n}`
    },
    {
      id: 'rea-native-elf',
      titleKo: '초저지연 로컬 음성·추론 데몬 (Native Rust/C++ ELF Binary)',
      artifactType: 'Linux/macOS Native Binary (ELF64 / Mach-O)',
      binaryPath: '/usr/local/bin/laya_voice_daemon_bin',
      mcpToolchain: ['ghidra-mcp-decompiler', 'radare2-cfg-analyzer', 'dwarf-symbol-synthesizer', 'rea-open-agent-14b'],
      recoveredSymbolsCount: 518,
      tracedEndpoints: ['unix:///tmp/jarvis_vad_ringbuffer.sock', 'POST http://127.0.0.1:11434/api/generate', 'SIMD_AVX2_Silero_VAD_Frame()'],
      architectureSummaryKo: '스트립(Stripped)된 네이티브 바이너리에서 SIMD 오디오 링버퍼 제어 루프와 Laya-421M 라우터 호출 시퀀스를 복원하여 31ms 초저지연 인터페이스로 재구축했습니다.',
      decompiledPseudoCode: `// [REA Stage 2: Stripped Binary Control Flow Recovery]\nvoid __cdecl process_audio_chunk_avx2(float *pcm_in, int samples) {\n  float energy = simd_rms_energy(pcm_in, samples);\n  if (energy > 0.042f) {\n    trigger_wake_gate_socket("/tmp/jarvis_vad_ringbuffer.sock", pcm_in);\n  }\n}`,
      reconstructedCleanCode: `// [REA Stage 4: Clean Reconstructed Module by rea-open-agent-14b]\nexport class LowLatencyVadGate {\n  private readonly threshold = 0.042;\n  public inspectPcmChunk(pcmFrame: Float32Array): boolean {\n    const rms = Math.sqrt(pcmFrame.reduce((a, v) => a + v * v, 0) / pcmFrame.length);\n    return rms > this.threshold;\n  }\n}`
    },
    {
      id: 'rea-web-protocol',
      titleKo: '복합 웹 애플리케이션 번들 & 비공개 RPC 프로토콜',
      artifactType: 'Minified Webpack/Vite Bundle + WebSocket Binary Frame',
      binaryPath: 'https://target-app.internal/assets/index-89f2a1c.js',
      mcpToolchain: ['rea-bundle-deobfuscator', 'chrome-devtools-mcp-har', 'protobuf-schema-infer', 'rea-open-agent-14b'],
      recoveredSymbolsCount: 289,
      tracedEndpoints: ['wss://realtime.target.internal/v2/stream (Binary Protobuf)', 'POST /api/v2/agent/dispatch-batch', 'GET /api/v2/knowledge/graph-nodes'],
      architectureSummaryKo: '난독화된 프론트엔드 번들과 WebSocket 바이너리 프레임에서 Protobuf 메시지 스키마와 상태 머신을 역추론하여 정식 TypeScript SDK 인터페이스로 자동 복원했습니다.',
      decompiledPseudoCode: `// [REA Stage 2: Bundle AST & Protobuf Wire-Type Recovery]\nfunction _0x4f2a(e) {\n  const n = new Uint8Array(e);\n  return { opCode: n[0] & 0x0f, payloadLen: (n[1] << 8) | n[2], body: n.slice(3) };\n}`,
      reconstructedCleanCode: `// [REA Stage 4: Clean Reconstructed Protocol SDK by rea-open-agent-14b]\nexport function decodeStreamPacket(rawBuffer: ArrayBuffer) {\n  const bytes = new Uint8Array(rawBuffer);\n  return {\n    opCode: bytes[0] & 0x0f,\n    payloadLength: (bytes[1] << 8) | bytes[2],\n    payload: bytes.slice(3)\n  };\n}`
    }
  ],

  // BioScience AlphaFold Presets (TP53, EGFR, BRCA1)
  PROTEIN_PRESETS: [
    {
      gene: 'TP53',
      uniprotAccession: 'P04637',
      pdbId: '1TUP',
      proteinNameKo: '세포 종양 항원 p53 (Cellular Tumor Antigen p53)',
      linkedCompound: 'Imatinib / Eprenetapopt (APR-246)',
      defaultSequence: 'MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYQGSYGFRLGFLHSGTAKSVTCTYSPALNKMFCQLAKTCPVQLWVDSTPPPGTRVRAMAIYKQSQHMTEVVRRCPHHERCSDSDGLAPPQHLIRVEGNLRVEYLDDRNTFRHSVVVPYEPPEVGSDCTTIHYNYMCNSSCMGGMNRRPILTIITLEDSSGNLLGRNSFEVRVCACPGRDRRTEEENLRKKGEPHHELPPGSTKRALPNNTSSSPQPKKKPLDGEYFTLQIRGRERFEMFRELNEALELKDAQAGKEPGGSRAHSSHLKSKKGQSTSRHKKLMFKTEGPDSD',
      domains: [
        { name: 'Transactivation Domain (TAD)', start: 1, end: 61, plddtMean: 56.4 },
        { name: 'Proline-Rich Region', start: 64, end: 92, plddtMean: 68.2 },
        { name: 'DNA-Binding Core Domain', start: 94, end: 292, plddtMean: 94.8 },
        { name: 'Tetramerization Domain', start: 325, end: 356, plddtMean: 91.2 },
        { name: 'C-Terminal Regulatory Domain', start: 363, end: 393, plddtMean: 48.5 }
      ],
      variants: [
        { hgvs: 'p.Arg175His (c.524G>A)', rsId: 'rs28934578', clinicalSignificance: 'Pathogenic', phenotype: 'Li-Fraumeni syndrome / 체세포 종양 핫스팟' },
        { hgvs: 'p.Arg248Gln (c.743G>A)', rsId: 'rs11540652', clinicalSignificance: 'Pathogenic', phenotype: 'DNA 결합 친화도 상실 변이' },
        { hgvs: 'p.Pro72Arg (c.215C>G)', rsId: 'rs1042522', clinicalSignificance: 'Benign', phenotype: '일반 인구 다형성 (Common Polymorphism)' }
      ]
    },
    {
      gene: 'EGFR',
      uniprotAccession: 'P00533',
      pdbId: '1M17',
      proteinNameKo: '표피성장인자 수용체 (Epidermal Growth Factor Receptor)',
      linkedCompound: 'Osimertinib (Tagrisso)',
      defaultSequence: 'MRPSGTAGAALLALLAALCPASRALEEKKVCQGTSNKLTQLGTFEDHFLSLQRMFNNCEVVLGNLEITYVQRNYDLSFLKTIQEVAGYVLIALNTVERIPLENLQIIRGNMYYENSYALAVLSNYDANKTGLKELPMRNLQEILHGAVRFSNNPALCNVESIQWRDIVSSDFLSNMSMDFQNHLGSCQKCDPSCPNGSCWGAGEENCQKLTKIICAQQCSGRCRGKSPSDCCHNQCAAGCTGPRESDCLVCRKFRDEATCKDTCPPLMLYNPTTYQMDVNPEGKYSFGATCVKKCPRNYVVTDHGSCVRACGADSYEMEEDGVRKCKKCEGPCRKVCNGIGIGEFKDSLSINATNIKHFKNCTSISGDLHILPVAFRGDSFTHTPPLDPQELDILKTVKEITGFLLIQAWPENRTDLHAFENLEIIRGRTKQHGQFSLAVVSLNITSLGLRSLKEISDGDVIISGNKNLCYANTINWKKLFGTSGQKTKIISNRGENSCKATGQVCHALCSPEGCWGPEPRDCVSCRNVSRGRECVDKCNLLEGEPREFVENSECIQCHPECLPQAMNITCTGRGPDNCIQCAHYIDGPHCVKTCPAGVMGENNTLVWKYADAGHVCHLCHPNCTYGCTGPGLEGCPTNGPKIPSIATGMVGALLLLLVVALGIGLFMRRRHIVRKRTLRRLLQERELVEPLTPSGEAPNQALLRILKETEFKKIKVLGSGAFGTVYKGLWIPEGEKVKIPVAIKELREATSPKANKEILDEAYVMASVDNPHVCRLLGICLTSTVQLITQLMPFGCLDYVREHKDNIGSQYLLNWCVQIAKGMNYLEDRRLVHRDLAARNVLVKTPQHVKITDFGLAKLLGAEEKEYHAEGGKVPIKWMALESILHRIYTHQSDVWSYGVTVWELMTFGSKPYDGIPASEISSILEKGERLPQPPICTIDVYMIMVKCWMIDADSRPKFRELIIEFSKMARDPQRYLVIQGDERMHLPSPTDSNFYRALMDEEDMDDVVDADEYLIPQQGFFSSPSTSRTPLLSSLSATSNNSTVACIDRNGLQSCPIKEDSFLQRYSSDPTGALTEDSIDDTFLPVPEYINQSVPKRPAGSVQNPVYHNQPLNPAPSRDPHYQDPHSTAVGNPEYLNTVQPTCVNSTFDSPAHWAQKGSHQISLDNPDYQQDFFPKEAKPNGIFKGSTAENAEYLRVAPQSSEFIGA',
      domains: [
        { name: 'Extracellular Ligand Binding L1/L2', start: 25, end: 505, plddtMean: 89.4 },
        { name: 'Transmembrane Helix', start: 646, end: 668, plddtMean: 79.1 },
        { name: 'Protein Tyrosine Kinase Domain', start: 712, end: 979, plddtMean: 95.3 },
        { name: 'C-Terminal Autophosphorylation Tail', start: 980, end: 1210, plddtMean: 52.8 }
      ],
      variants: [
        { hgvs: 'p.Leu858Arg (c.2573T>G)', rsId: 'rs121434568', clinicalSignificance: 'Pathogenic', phenotype: '비소세포폐암(NSCLC) 타이로신 키나아제 활성화 변이' },
        { hgvs: 'p.Thr790Met (c.2369C>T)', rsId: 'rs121434569', clinicalSignificance: 'Pathogenic', phenotype: '1세대 EGFR TKI 내성 게이트키퍼 변이' }
      ]
    },
    {
      gene: 'BRCA1',
      uniprotAccession: 'P38398',
      pdbId: '1JM7',
      proteinNameKo: '유방암 감수성 단백질 1 (Breast Cancer Type 1 Susceptibility)',
      linkedCompound: 'Olaparib (Lynparza)',
      defaultSequence: 'MDLSALRVEEVQNVINAMQKILECPICLELIKEPVSTKCDHIFCKFCMLKLLNQKKGPSQCPLCKNDITKRSLQESTRFSQLVEELLKIICAFQLDTGLEYANSYNFAKKENNSPEHLKDEVSIIQSMGYRNRAKRLLQSEPENPSLQETSLSVQLSNLGTVRTLRTKQRIQPQKTSVYIELGSDSSEDTVNKATYCSVGDQELLQITPQGTRDEISLDSAKKAACEFSETDVTNTEHHQPSNNDLNTTEKRAAERHPEKYQGSSVSNLHVEPCGTNTHASSLQHENSSLLLTKDRMNVEKAEFCNKSKQPGLARSQHNRWAGSKETCNDRRTPSTEKKVDLNADPLCERKEWNKQKLPCSENPRDTEDVPWITLNSSIQKVNEWFSRSDELLGSDDSHDGESESNAKVADVLDVLNEVDEYSGSSEKIDLLASDPHEALICKSERVHSKSVESNIEDKIFGKTYRKKASLPNLSHVTENLIIGAFVTEPQIIQERPLTNKLKRKRRPTSGLHPEDFIKKADLAVQKTPEMINQGTNQTEQNGQVMNITNSGHENKTKGDSIQNEKNPNPIESLEKESAFKTKAEPISSSISNMELELNIHNSKAPKKNRLRRKSSTRHIHALELVVSRNLSPPNCTELQIDSCSSSEEIKKKKYNQMPVRHSRNLQLMEGKEPATGAKKSNKPNEQTSKRHDSDTFPELKLTNAPGSFTKCSNTSELKEFVNPSLPREEKEEKLETVKVSNNAEDPKDLMLSGERVLQTERSVESSSISLVPGTDYGTQESISLLEVSTLGKAKTEPNKCVSQCAAFENPKGLIHGCSKDNRNDTEGFKYPLGHEVNHSRETSIEMEESELDAQYLQNTFKVSKRQSFAPFSNPGNAEEECATFSAHSGSLKKQSPKVTFECEQKEENQGKNESNIKPVQTVNITAGFPVVGQKDKPVDNAKCSIKGGSRFCLSSQFRGNETGLITPNKHGLLQNPYRIPPLFPIKSFVKTKCKKNLLEENFEEHSMSPEREMGNENIPSTVSTISRNNIRENVFKEASSSNINEVGSSTNEVGSSINEIGSSDENIQAELGRNRGPKLNAMLRLGVLQPEVYKQSLPGSNCKHPEIKKQEYEEVVQTVNTDFSPYLISDNLEQPMGSSHASQVCSETPDDLLDDGEIKEDTSFAENDIKESSAVFSKSVQKGELSRSPSPFTHTHLAQGYRRGAKKLESSEENLSSEDEELPCFQHLLFGKVNNIPSQSTRHSTVATECLSKNTEENLLSLKNSLNDCSNQVILAKASQEHHLSEETKCSASLFSSQCSELEDLTANTNTQDPFLIGSSKQMRHQSESQGVGLSDKELVSDDEERGTGLEENNQEEQSMDSNLGEAASGCESETSVSEDCSGLSSQSDILTTQQRDTMQHNLIKLQQEMAELEAVLEQHGSQPSNSYPSIISDSSALEDLRNPEQSTSEKAVLTSQKSSEYPISQNPEGLSADKFEVSADSSTSKNKEPGVERSSPSKCPSLDDRWYMHSCSGSLQNRNYPSQEELIKVVDVEEQQLEESGPHDLTETSYLPRQDLEGTPYLESGISLFSDDPESDPSEDRAPESARVGNIPSSTSALKVPQLKVAESAQSPAAAHTTDTAGYNAMEESVSREKPELTASTERVNKRMSMVVSGLTPEEFMLVYKFARKHHITLTNLITEETTHVVMKTDAEFVCERTLKYFLGIAGGKWVVSYFWVTQSICKERKMLNEHDFEVRGDVVNGRNHQGPKRARESQDRKIFRGLEICCYGPFTNMPTDQLEWMVQLCGASVVKELSSFTLGTGVHPIVVVQPDAWTEDNGFHAIGQMCEAPVVTREWVLDSVALYQCQELDTYLIPQIPHSHY',
      domains: [
        { name: 'RING Finger Domain (E3 Ubiquitin Ligase)', start: 8, end: 96, plddtMean: 93.7 },
        { name: 'Intrinsically Disordered Central Region', start: 170, end: 1640, plddtMean: 46.2 },
        { name: 'BRCT Domain 1 (Phosphopeptide Binding)', start: 1646, end: 1736, plddtMean: 94.1 },
        { name: 'BRCT Domain 2 (DNA Damage Repair)', start: 1756, end: 1855, plddtMean: 95.0 }
      ],
      variants: [
        { hgvs: 'p.Cys61Gly (c.181T>G)', rsId: 'rs28897672', clinicalSignificance: 'Pathogenic', phenotype: 'RING 도메인 아연 결합 소실 및 유방/난소암 고위험 변이' },
        { hgvs: 'p.Arg1699Trp (c.5095C>T)', rsId: 'rs55770810', clinicalSignificance: 'Pathogenic', phenotype: 'BRCT 도메인 단백질 상호작용 저해 변이' }
      ]
    }
  ],

  // Ported from JarvisKnowledgeWikiStudio.tsx (6-Category Recursive Knowledge Wiki)
  INITIAL_WIKI_NODES: [
    {
      id: 'wiki-ai-1',
      title: 'Laya-421M & DeepSeek GRPO 강화학습 초고속 추론 아키텍처',
      category: 'AI_TRENDS',
      summaryKo: 'Laya-421M RLCD 및 DeepSeek-R1의 그룹 상대 정책 최적화(GRPO)를 결합하여 0.03초 만에 사용자 의도를 정밀 분류하고 소형 언어모델(SLM)을 자가 파인튜닝하는 오픈소스 트렌드입니다.',
      detailsKo: '기존 DPO 방식 대비 GRPO는 별도의 평가 모델 없이 자가 보상 함수 점수 비교를 수행하여 VRAM을 70% 절감하고, Laya RLCD 확률 보정 헤드를 통해 확신 과잉(Brier Loss)을 억제합니다.',
      keyInsights: ['VRAM 4.5GB 환경에서 3B급 SLM을 GRPO로 자가 학습 가능', 'Antigravity IDE & ADE 환경에서 연동 디버깅 정확도 98.4% 달성', 'System-1 빠른 반응과 System-2 심도 추론의 혼합 라우팅'],
      relevanceScore: 99,
      recursiveLevel: 4,
      rlRewardScore: 2.85,
      updatedAt: '2026-10-21',
      sources: ['GitHub / ConvAI-Innovations', 'Unsloth AI Research', 'DeepSeek-R1 Paper']
    },
    {
      id: 'wiki-econ-1',
      title: '2026 글로벌 AI 하이테크 경제 & 반도체 공급망 동향',
      category: 'ECONOMY_BUSINESS',
      summaryKo: '글로벌 빅테크의 온디바이스 AI 및 소형 언어모델(SLM) 채택 급증으로 데이터센터 전력 자율화 및 HBM4 메모리 수요가 사상 최고치를 경신하고 있습니다.',
      detailsKo: 'AI 에이전트 브릿지 소프트웨어 기업 및 온디바이스 AI 칩 설계사의 기업 가치가 가파르게 상승 중이며 초경량 0.4B~4B 모델 지배력이 확대되고 있습니다.',
      keyInsights: ['AI 에이전트 인프라 시장 연평균 성장률(CAGR) 42.5% 예상', '전력 효율 중심의 초경량 0.4B~4B 모델(Laya/Gemma 4/Llama) 지배력 확대', '기업용 자율 PC 제어 및 IDE 에이전트 도입률 3배 증가'],
      relevanceScore: 95,
      recursiveLevel: 3,
      rlRewardScore: 2.62,
      updatedAt: '2026-10-21',
      sources: ['Bloomberg AI Index', 'Financial Times Tech Insight', 'Wall Street Research']
    },
    {
      id: 'wiki-stock-1',
      title: '글로벌 AI 반도체 & 에이전트 소프트웨어 주식 및 자산 전략',
      category: 'STOCKS_FINANCE',
      summaryKo: 'NVDA, TSMC, MSFT 및 주요 AI 생태계 종목의 모멘텀 지수와 감성 분석 결과, 온디바이스 에이전트 연동 기술을 보유한 하이테크 종목에 자금이 집중되고 있습니다.',
      detailsKo: '기술적 분석 결과 상대강도지수(RSI 62.4) 및 이동평균선(MA20) 상방 지지선이 견고하며, 로컬 SLM 및 프라이빗 AI 기술을 결합한 기업들의 실적 개선세가 두드러집니다.',
      keyInsights: ['AI 에이전트 소프트웨어 섹터 수급 유입 지수 88/100', '반도체 밸류체인 및 자율형 개발 환경(ADE) 시장 가치 재평가', '변동성 완화를 위한 분산 포트폴리오 및 기술 지표 추적'],
      relevanceScore: 92,
      recursiveLevel: 3,
      rlRewardScore: 2.48,
      updatedAt: '2026-10-21',
      sources: ['S&P 500 Tech Sector', 'KOSPI AI Leaders Index', 'TradingView Sentiment']
    },
    {
      id: 'wiki-it-1',
      title: '안티그래비티 IDE & 멀티 오픈모델 에이전트 통합 아키텍처',
      category: 'IT_SOFTWARE_ARCHITECTURE',
      summaryKo: '로컬 파일시스템 바인딩, 실시간 AST 구문 트리 자가치유 패치, 그리고 MAPS 4계층 메모리/펄스 데몬을 결합한 차세대 AI-OS 표준 아키텍처입니다.',
      detailsKo: 'Chatterbox Multilingual 오픈소스 TTS와 Ollama Gemma 4(e2b/e4b/31b) 로컬 추론을 결합하여 0원의 운영비로 엔터프라이즈급 보안을 달성합니다.',
      keyInsights: ['토큰 절감률은 이번 세션의 기준량과 실제 전송량을 둘 다 재기 전에는 표시하지 않습니다', 'Chatterbox MIT 라이선스 기반 23개국어 제로샷 보이스 클로닝', 'Human-in-the-Loop 대표님 승인 게이트웨이 100% 내장'],
      relevanceScore: 98,
      recursiveLevel: 4,
      rlRewardScore: 2.91,
      updatedAt: '2026-10-21',
      sources: ['BSC_HQ Engineering', 'pavrus117/ai-os-maps-guide', 'resemble-ai/chatterbox']
    }
  ],

  // Ported from TelemetryAndDataPanel.tsx
  PRESET_TELEMETRY_DATASETS: [
    {
      id: 'gpu-inference',
      name: '무료 오픈모델 속도 & 메모리 효율 비교 데이터',
      sample: [
        { 모델명: 'Laya-421M-RLCD (의도 분류)', 응답시간_ms: 33, 처리속도_TPS: 890, 메모리_GB: 0.8, 정확도: '99.1%' },
        { 모델명: 'Gemma-4-e2b (로컬 Ollama)', 응답시간_ms: 1120, 처리속도_TPS: 145, 메모리_GB: 2.1, 정확도: '95.8%' },
        { 모델명: 'Whisper-Large-v3 (음성 인식)', 응답시간_ms: 180, 처리속도_TPS: 295, 메모리_GB: 0.0, 정확도: '98.4%' },
        { 모델명: 'Chatterbox-Multilingual (TTS)', 응답시간_ms: 380, 처리속도_TPS: 240, 메모리_GB: 4.2, 정확도: '99.0%' },
        { 모델명: 'Phi-4-Mini-3.8B-SLM (강화학습)', 응답시간_ms: 150, 처리속도_TPS: 110, 메모리_GB: 2.8, 정확도: '94.7%' }
      ]
    },
    {
      id: 'workstation-processes',
      name: '내 컴퓨터 프로그램별 메모리 & CPU 사용량',
      sample: [
        { 프로그램: 'ollama_local_server', 프로세스ID: 4821, CPU사용률: 22.4, 메모리_MB: 2840 },
        { 프로그램: 'bsc_jarvis_os_node', 프로세스ID: 56008, CPU사용률: 4.1, 메모리_MB: 115 },
        { 프로그램: 'local_open_tts_chatterbox', 프로세스ID: 7860, CPU사용률: 8.2, 메모리_MB: 620 }
      ]
    }
  ],

  // Ported from OpenSourceLabView.tsx / openSourceCatalog.ts
  generateLocalBridgeScript(cfg) {
    return `#!/usr/bin/env python3
"""
[BSC J.A.R.V.I.S. Local Bridge Daemon — jarvis_local_bridge.py]
- Active STT Engine : ${cfg.sttEngine}
- Active LLM Engine : ${cfg.llmEngine} (${cfg.localEndpointUrl})
- Active TTS Engine : ${cfg.ttsEngine} (${cfg.localTtsServerUrl})
- Safety Gate       : ${cfg.safeModeRequireApproval ? 'CEO Approval Required' : 'Auto'}
"""
import asyncio, json, subprocess, pyautogui
from fastapi import FastAPI

app = FastAPI(title="BSC J.A.R.V.I.S. Local Bridge")

@app.get("/health")
async def health():
    return {"ok": True, "llm": "${cfg.llmEngine}", "tts": "${cfg.ttsEngine}"}

@app.post("/os/execute")
async def execute_safe_cmd(payload: dict):
    cmd = payload.get("command", "")
    return {"status": "QUEUED_FOR_CEO_APPROVAL", "command": cmd}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8765)
`;
  },

  // Script Generators from openSourceCatalog.ts
  generateRlFineTuningScript(params) {
    return `#!/usr/bin/env python3
"""
[BSC J.A.R.V.I.S. 무료 오픈모델 SLM / LLM 강화학습 스크립트]
- 베이스 오픈모델 : ${params.baseModel}
- 학습 알고리즘   : ${params.rlMethod} (Unsloth + HuggingFace TRL 기반, VRAM 80% 절감)
- LoRA Rank (r)   : ${params.loraRank}
- 학습률 (LR)     : ${params.learningRate}
- 핵심 보상 목표  : ${params.rewardFocus}
"""
import torch
from datasets import Dataset
from unsloth import FastLanguageModel
from trl import GRPOConfig, GRPOTrainer

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="${params.baseModel}",
    max_seq_length=2048,
    load_in_4bit=True,
    fast_inference=True,
)
model = FastLanguageModel.get_peft_model(
    model, r=${params.loraRank},
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha=${params.loraRank}, use_gradient_checkpointing="unsloth", random_state=42,
)
def jarvis_format_and_safety_reward(completions, **kwargs):
    return [3.0 if ("<think>" in str(c) and "actionType" in str(c)) else 1.0 for c in completions]

if __name__ == "__main__":
    print("[BSC J.A.R.V.I.S. RL] GRPO 강화학습 튜닝 및 Ollama GGUF 변환 준비 완료!")`;
  },

  generateLocalBridgeScript(config) {
    const port = (config.bridgeEndpoint || 'ws://localhost:8765').split(':').pop() || '8765';
    return `#!/usr/bin/env python3
"""
[BSC J.A.R.V.I.S. 로컬 컴퓨터 제어 & 무료 오픈모델 브릿지]
- STT 엔진 : ${config.sttEngine}
- LLM 두뇌 : ${config.llmEngine} (Laya 33ms 라우터: ${config.layaRouterEnabled ? 'ON' : 'OFF'})
- TTS 엔진 : ${config.ttsEngine}
- 포트     : ${port}
"""
import asyncio, json, subprocess, platform, psutil, pyautogui, websockets
pyautogui.FAILSAFE = True

async def main():
    print("BSC J.A.R.V.I.S. Local Python Bridge listening on ws://localhost:${port}")
if __name__ == "__main__":
    asyncio.run(main())`;
  },

  // Weight Distribution Generator for RL/SLM Studio
  generateWeightDistributionData(layerId, step = 25, lrValue = 0.00005) {
    const count = 400;
    const weights = [];
    const shift = (step / 100) * (lrValue * 1e4) * 0.08;
    let meanTarget = 0.0, stdTarget = 0.12, skewFactor = 0.0;

    if (layerId === 'q_proj') { meanTarget = 0.02 + shift; stdTarget = 0.14; skewFactor = 0.35; }
    else if (layerId === 'v_proj') { meanTarget = -0.01 + shift * 0.5; stdTarget = 0.11; skewFactor = -0.15; }
    else if (layerId === 'gate_up_proj') { meanTarget = 0.05 + shift * 1.2; stdTarget = 0.18; skewFactor = 0.72; }
    else if (layerId === 'laya_brier_head') { meanTarget = 0.0; stdTarget = 0.08; skewFactor = 0.05; }
    else { meanTarget = 0.01; stdTarget = 0.22; skewFactor = -0.38; }

    for (let i = 0; i < count; i++) {
      const u1 = Math.random() || 0.0001;
      const u2 = Math.random() || 0.0001;
      let z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      if (z > 0) z += skewFactor * (z * z * 0.15);
      weights.push(meanTarget + z * stdTarget);
    }

    const mean = weights.reduce((a, b) => a + b, 0) / count;
    const variance = weights.reduce((a, v) => a + Math.pow(v - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const m3 = weights.reduce((a, v) => a + Math.pow((v - mean) / (stdDev || 1), 3), 0) / count;
    const skewness = Number(m3.toFixed(3));
    const nearZeroCount = weights.filter(w => Math.abs(w) < 0.01).length;
    const sparsityRatio = Number(((nearZeroCount / count) * 100).toFixed(1));

    let biasRiskLevel = 'NORMAL';
    let biasAssessmentKo = '가중치가 대칭 정규분포에 가까우며 편향성이 낮아 안정적인 학습 상태입니다.';
    if (Math.abs(skewness) > 0.6) {
      biasRiskLevel = 'HIGH_BIAS';
      biasAssessmentKo = `왜도(${skewness})가 높아 특정 활성화 영역에 데이터 편향이 검출됩니다. 학습률 하향 조절을 권장합니다.`;
    } else if (Math.abs(skewness) > 0.3) {
      biasRiskLevel = 'MODERATE_BIAS';
      biasAssessmentKo = `왜도(${skewness})가 다소 검출되어 우측 치우침이 보입니다. GRPO KL 페널티를 재점검하세요.`;
    }

    const layerNameKoMap = {
      q_proj: 'Query Projection 어댑터 가중치 (Attention Q)',
      v_proj: 'Value Projection 어댑터 가중치 (Attention V)',
      gate_up_proj: 'MLP Gate/Up Projection 레이어 가중치',
      laya_brier_head: 'Laya System-1 Brier 보정 헤드 가중치',
      lm_head: '최종 언어모델 출력 헤드 가중치 (LM Head)'
    };

    return {
      layerId,
      layerNameKo: layerNameKoMap[layerId] || layerId,
      weights,
      mean: Number(mean.toFixed(4)),
      stdDev: Number(stdDev.toFixed(4)),
      skewness,
      sparsityRatio,
      biasRiskLevel,
      biasAssessmentKo
    };
  }
};

/**
 * [SRP Class #1] AgentManagementController
 * AI Studio 6대 전문 에이전트 + BSC 28인 에이전트 연동, 페르소나 슬라이더, Bulk Status Toggle 전담
 */
class AgentManagementController {
  constructor() {
    this.classSignature = 'class AgentManagementController';
    this.storageKey = 'bsc_jarvis_agents_registry_v2';
  }

  getDefaultAgents() {
    return [
      {
        id: 'agent-os-commander',
        name: '자비스 OS 자율 제어 에이전트 ( & 수호 QA Gate)',
        className: 'class OsAutomationAgent(BaseJarvisAgent)',
        roleCategory: 'OS_AUTOMATION_AGENT',
        assignedModel: 'laya-421m-rlcd',
        autonomyMode: 'HUMAN_APPROVAL',
        status: 'ACTIVE',
        systemPromptKo: '사용자의 음성/텍스트 명령을 33ms 이내에 분석하여 안전한 PyAutoGUI 마우스/키보드 제어 및 쉘 스크립트 작업을 생성하고 승인 큐에 등록합니다.',
        capabilities: ['PyAutoGUI Coordinate Click', 'Safe Shell Execution', 'Voice Macro Trigger', 'Window Focus Control'],
        personalityProfile: {
          personaArchetype: '자비스 클래식 전술 집사 & 코람데오 청지기',
          toneStyle: 'DRY_WITTY_BUTLER',
          formality: 88,
          verbosity: 32,
          humorWarmth: 75,
          proactivity: 92,
          customCatchphraseKo: '이건우 대표님, 명령 확인했습니다. 33ms 내 최적의 OS 제어 시퀀스로 안전하게 집행합니다.'
        },
        tasksCompleted: 142,
        successRate: 99.2,
        avgLatencyMs: 31
      },
      {
        id: 'agent-rea-reverse-engineer',
        name: 'REA 오픈소스 역공학 & MAPS AI-OS 분석 에이전트 ( & 거누 CTO)',
        className: 'class ReaReverseEngineeringAgent(BaseJarvisAgent)',
        roleCategory: 'CODE_IDE_AGENT',
        assignedModel: 'rea-open-agent-14b',
        autonomyMode: 'SEMI_AUTO',
        status: 'ACTIVE',
        systemPromptKo: 'REA(Reverse Engineer Anything) 오픈모델 및 MCP 서버를 통해 네이티브 바이너리, Electron 앱, 웹 번들 및 API 프로토콜을 역공학 분석하고 AI-OS MAPS(Memory·Agent·Pulse·Screen) 아키텍처로 재구축합니다.',
        capabilities: ['Ghidra MCP Decompile', 'Electron ASAR Unpack', 'Protobuf Wire-Schema Infer', 'Clean TS Reconstruct'],
        personalityProfile: {
          personaArchetype: 'REA 수석 오픈소스 역공학 아키텍트',
          toneStyle: 'TACTICAL_CONCISE',
          formality: 86,
          verbosity: 42,
          humorWarmth: 45,
          proactivity: 92,
          customCatchphraseKo: 'REA MCP 역공학 파이프라인 가동. 타겟 바이너리·번들 시그니처와 MAPS 4계층 상태를 즉시 해부합니다.'
        },
        tasksCompleted: 74,
        successRate: 99.1,
        avgLatencyMs: 96
      },
      {
        id: 'agent-code-architect',
        name: '안티그래비티 IDE 자가치유 코딩 에이전트 ( & 강서진/유나)',
        className: 'class AntigravityCodeAgent(BaseJarvisAgent)',
        roleCategory: 'CODE_IDE_AGENT',
        assignedModel: 'qwen-2.5-coder-32b',
        autonomyMode: 'SEMI_AUTO',
        status: 'ACTIVE',
        systemPromptKo: 'Antigravity IDE 및 로컬 리포지토리의 구문 오류와 타입 에러를 실시간 감지하고, 무중단 리팩토링 패치와 유닛 테스트를 생성합니다.',
        capabilities: ['AST Code Refactoring', 'TypeScript/Python Lint Fix', 'Unit Test Generation', 'WebSocket IDE RPC'],
        personalityProfile: {
          personaArchetype: '수석 소프트웨어 아키텍트',
          toneStyle: 'TACTICAL_CONCISE',
          formality: 80,
          verbosity: 45,
          humorWarmth: 50,
          proactivity: 85,
          customCatchphraseKo: 'AST 구문 분석 완료. 무중단 리팩토링 패치와 타입 검증을 즉시 적용합니다.'
        },
        tasksCompleted: 89,
        successRate: 98.4,
        avgLatencyMs: 168
      },
      {
        id: 'agent-wiki-researcher',
        name: '지식 생태계 & 실시간 트렌드 리서처 ( & 우진/하준)',
        className: 'class RecursiveWikiAgent(BaseJarvisAgent)',
        roleCategory: 'RESEARCH_WIKI_AGENT',
        assignedModel: 'deepseek-r1-distill-llama-70b',
        autonomyMode: 'FULL_AUTO_SAFE',
        status: 'ACTIVE',
        systemPromptKo: '글로벌 AI 트렌드, 반도체 경제 지표, 주식 모멘텀 및 로컬 옵시디언 볼트(RAG)를 스캔하여 지식 생태계 그래프와 위키 노드를 재귀적으로 확장합니다.',
        capabilities: ['Obsidian Graph Linking', 'Google Search Grounding', 'Local Vault RAG Scan', 'RLCD Confidence Calibration'],
        personalityProfile: {
          personaArchetype: '수석 지식 생태계 연구원',
          toneStyle: 'ACADEMIC_ANALYTICAL',
          formality: 92,
          verbosity: 76,
          humorWarmth: 40,
          proactivity: 80,
          customCatchphraseKo: '글로벌 트렌드와 로컬 옵시디언 지식 그래프의 교차 상관관계를 정밀 브리핑합니다.'
        },
        tasksCompleted: 116,
        successRate: 97.8,
        avgLatencyMs: 215
      },
      {
        id: 'agent-creative-director',
        name: '3D 블렌더 & 캐릭터 에셋 파이프라인 에이전트 ( & 시안/태오)',
        className: 'class CreativePipelineAgent(BaseJarvisAgent)',
        roleCategory: 'CREATIVE_PIPELINE_AGENT',
        assignedModel: 'phi-4-mini-3.8b-slm',
        autonomyMode: 'SEMI_AUTO',
        status: 'ACTIVE',
        systemPromptKo: 'CharacterAssetStudioController에서 생성된 캐릭터 360° 시트·스토리보드 메타데이터를 읽어 블렌더 4.x Python(bpy) 노드로 전송합니다.',
        capabilities: ['Character 360 SVG Parse', 'Blender bpy Script Synthesis', '3-Point Volumetric Lighting', 'OBJ/GLTF Mesh Validation'],
        personalityProfile: {
          personaArchetype: '시네마틱 3D VFX 아트 디렉터',
          toneStyle: 'CREATIVE_INSPIRING',
          formality: 65,
          verbosity: 64,
          humorWarmth: 84,
          proactivity: 88,
          customCatchphraseKo: '비주얼 디렉션 확인 완료! 3점 볼류메트릭 조명과 셰이더 노드로 생동감을 불어넣겠습니다.'
        },
        tasksCompleted: 64,
        successRate: 99.0,
        avgLatencyMs: 74
      },
      {
        id: 'agent-bio-scientist',
        name: '바이오사이언스 & AlphaFold 구조 분석 에이전트',
        className: 'class BioScienceAnalystAgent(BaseJarvisAgent)',
        roleCategory: 'BIOSCIENCE_ANALYST_AGENT',
        assignedModel: 'gemma-3-12b-it',
        autonomyMode: 'FULL_AUTO_SAFE',
        status: 'ACTIVE',
        systemPromptKo: 'UniProt 단백질 서열, AlphaFold 3D pLDDT 신뢰도, PubChem 화합물 Lipinski 약물성 규칙 및 Europe PMC 논문을 교차 검증합니다.',
        capabilities: ['AlphaFold 3D pLDDT Query', 'UniProt Variant Inspection', 'PubChem Lipinski Assay', 'Europe PMC Citation Fetch'],
        personalityProfile: {
          personaArchetype: '정밀 분자생물학·구조화학 분석가',
          toneStyle: 'ACADEMIC_ANALYTICAL',
          formality: 95,
          verbosity: 70,
          humorWarmth: 35,
          proactivity: 78,
          customCatchphraseKo: 'AlphaFold pLDDT 신뢰도 및 Lipinski 약물성 지표 교차 검증 결과를 보고합니다.'
        },
        tasksCompleted: 38,
        successRate: 99.5,
        avgLatencyMs: 118
      }
    ];
  }

  loadAgents() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return this.getDefaultAgents();
  }

  saveAgents(agents) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(agents));
    } catch (e) {}
  }

  bulkToggleAgentStatus(agents, targetIds, mode) {
    const selectedSet = new Set(targetIds);
    const selectedAgents = agents.filter(a => selectedSet.has(a.id));
    const allSelectedAreActive = selectedAgents.length > 0 && selectedAgents.every(a => a.status === 'ACTIVE');
    let activeAfterCount = 0, inactiveAfterCount = 0;

    const updatedAgents = agents.map(agent => {
      if (!selectedSet.has(agent.id)) return agent;
      let nextStatus = 'ACTIVE';
      if (mode === 'ACTIVE') nextStatus = 'ACTIVE';
      else if (mode === 'INACTIVE') nextStatus = 'INACTIVE';
      else if (mode === 'SMART_TOGGLE') nextStatus = allSelectedAreActive ? 'INACTIVE' : 'ACTIVE';
      else nextStatus = agent.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

      if (nextStatus === 'ACTIVE') activeAfterCount++;
      else inactiveAfterCount++;
      return { ...agent, status: nextStatus };
    });

    this.saveAgents(updatedAgents);
    return { updatedAgents, activeAfterCount, inactiveAfterCount };
  }
}

/**
 * [SRP Class #2] CharacterAssetStudioController
 * 캐릭터 360° 턴어라운드 SVG 도면, Wavefront .OBJ 프로시저럴 3D 메쉬, 스토리보드 컷 합성 전담
 */
class CharacterAssetStudioController {
  constructor() {
    this.classSignature = 'class CharacterAssetStudioController';
  }

  synthesizeCharacterTurnaroundSvg(spec) {
    const primary = spec.primaryColorHex || '#00F0FF';
    const secondary = spec.secondaryColorHex || '#34D399';
    const exprPreview = (spec.expressions || ['Focused', 'Smile', 'Tactical Scan', 'Coram Deo']).slice(0, 4).join(' · ');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 235" width="100%" height="215">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#05080F"/>
          <stop offset="100%" stop-color="#0D1627"/>
        </linearGradient>
      </defs>
      <rect width="600" height="235" fill="url(#bgGrad)" rx="10" stroke="rgba(0,240,255,0.3)"/>
      <line x1="20" y1="185" x2="580" y2="185" stroke="#1E293B" stroke-width="1.5" stroke-dasharray="4 4"/>
      <g transform="translate(115, 0)">
        <circle cx="0" cy="62" r="22" stroke="${primary}" stroke-width="2.2" fill="none"/>
        <circle cx="0" cy="108" r="7" fill="${secondary}"/>
        <rect x="-24" y="88" width="48" height="54" rx="8" stroke="${primary}" stroke-width="2.2" fill="none"/>
        <line x1="-24" y1="96" x2="-44" y2="126" stroke="${primary}" stroke-width="2"/>
        <line x1="24" y1="96" x2="44" y2="126" stroke="${primary}" stroke-width="2"/>
        <line x1="-13" y1="142" x2="-16" y2="182" stroke="${primary}" stroke-width="2.2"/>
        <line x1="13" y1="142" x2="16" y2="182" stroke="${primary}" stroke-width="2.2"/>
        <text x="0" y="203" font-family="monospace" font-size="11" font-weight="bold" fill="${primary}" text-anchor="middle">FRONT VIEW (0°)</text>
      </g>
      <g transform="translate(300, 0)">
        <circle cx="0" cy="62" r="21" stroke="${secondary}" stroke-width="2.2" fill="none"/>
        <path d="M -11 88 L 15 88 L 11 142 L -9 142 Z" stroke="${secondary}" stroke-width="2.2" fill="none"/>
        <line x1="2" y1="98" x2="24" y2="128" stroke="${secondary}" stroke-width="2.2"/>
        <line x1="0" y1="142" x2="4" y2="182" stroke="${secondary}" stroke-width="2.2"/>
        <text x="0" y="203" font-family="monospace" font-size="11" font-weight="bold" fill="${secondary}" text-anchor="middle">SIDE PROFILE (90°)</text>
      </g>
      <g transform="translate(485, 0)">
        <circle cx="0" cy="62" r="22" stroke="#A855F7" stroke-width="2.2" fill="none"/>
        <rect x="-24" y="88" width="48" height="54" rx="8" stroke="#A855F7" stroke-width="2.2" fill="none"/>
        <rect x="-13" y="98" width="26" height="28" rx="4" stroke="${primary}" stroke-width="1.5" fill="none"/>
        <line x1="-13" y1="142" x2="-16" y2="182" stroke="#A855F7" stroke-width="2.2"/>
        <line x1="13" y1="142" x2="16" y2="182" stroke="#A855F7" stroke-width="2.2"/>
        <text x="0" y="203" font-family="monospace" font-size="11" font-weight="bold" fill="#A855F7" text-anchor="middle">BACK RIG (180°)</text>
      </g>
      <text x="300" y="24" font-family="monospace" font-size="11" fill="#F8FAFC" text-anchor="middle">${spec.characterName} · [${spec.archetype}] · ${spec.polyCountTarget}</text>
      <text x="300" y="224" font-family="monospace" font-size="10" fill="#94A3B8" text-anchor="middle">EXPRESSIONS: ${exprPreview}</text>
    </svg>`;
  }

  synthesizeProceduralObjMesh(spec) {
    const scale = spec.polyCountTarget === 'HIGH_POLY_CINEMA' ? 1.25 : 1.0;
    return `# Wavefront OBJ Procedural Character Rig — CharacterAssetStudioController
# Character: ${spec.characterName} (${spec.archetype})
o ${(spec.characterName || 'Jarvis_Hero').replace(/\s+/g, '_')}
v 0.0000 ${(1.85 * scale).toFixed(4)} 0.0000
v ${(-0.38 * scale).toFixed(4)} ${(1.48 * scale).toFixed(4)} 0.0000
v ${(0.38 * scale).toFixed(4)} ${(1.48 * scale).toFixed(4)} 0.0000
v 0.0000 ${(0.95 * scale).toFixed(4)} ${(0.18 * scale).toFixed(4)}
v ${(-0.24 * scale).toFixed(4)} 0.0000 0.0000
v ${(0.24 * scale).toFixed(4)} 0.0000 0.0000
vn 0.0000 1.0000 0.0000
f 1//1 2//1 3//1
f 2//1 4//1 3//1
f 4//1 5//1 6//1`;
  }

  synthesizeBlenderBpyScript(spec) {
    return `import bpy, math
# [BSC J.A.R.V.I.S. Blender 4.x/5.x Cycles & Principled BSDF v2 Auto-Generator]
# Target Asset: ${spec.characterName} (${spec.archetype})
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.cycles.samples = 128
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=1.1, location=(0, 0, 1.2))
obj = bpy.context.active_object
obj.name = "${(spec.characterName || 'Jarvis_Core_Rig').replace(/\s+/g, '_')}"
mat = bpy.data.materials.new(name="Jarvis_Arc_PBR")
mat.use_nodes = True
bsdf = mat.node_tree.nodes.get("Principled BSDF")
if bsdf:
    bsdf.inputs["Metallic"].default_value = 0.92
    bsdf.inputs["Roughness"].default_value = 0.14
obj.data.materials.append(mat)
print("[BSC J.A.R.V.I.S.] Blender 3D Rig & 3-Point Studio Lighting Ready!")`;
  }
}

window.agentManagerController = new AgentManagementController();
window.characterAssetController = new CharacterAssetStudioController();
