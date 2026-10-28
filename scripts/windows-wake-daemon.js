/**
 * 🎙️🚀🪟 BSC_자비스 (BSC_Jarvis) — Windows 11 Always-On Background Wake-Word & Startup Auto-Launcher
 * Path: c:\BSC_Javis_OS\scripts\windows-wake-daemon.js
 *
 * Implements the exact "Turn on PC -> Call Name -> Immediately Recognizes & Opens/Acts" experience
 * from `https://www.youtube.com/watch?v=muY9-sCxZlg` (`scripts/install.sh` + `Ear.swift` + `Butler.swift`):
 *   1. OS-Level Background Wake-Word Listener (`System.Speech.Recognition.SpeechRecognitionEngine`):
 *      - Runs continuously in the background while `node server.js` is up — even when NO browser/HUD window is open!
 *      - Listens for wake words: "BSC_자비스", "자비스", "사사리사", "헤이 자비스", "아빠 왔어", "나 왔어".
 *      - When recognized:
 *        a) If no HUD client is currently connected on SSE (`getConnectedClientCount() === 0`), automatically pops open
 *           the frameless `BSC_자비스` desktop app window (`msedge --app=http://localhost:7777` or `chrome --app=http://localhost:7777`).
 *        b) Brings the `BSC_자비스` window to the foreground and broadcasts `os_wake_event` via SSE so the HUD
 *           immediately chimes (`띵`), triggers `BootScene` on `"아빠 왔어"`, or executes the spoken command in ~1s!
 *   2. Windows Login Auto-Start Registration (`%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\BSC_Jarvis_AutoStart.vbs`):
 *      - Equivalent to macOS `~/Library/LaunchAgents/com.macbutler.app.plist` (`RunAtLoad: true, KeepAlive: true`).
 *      - Starts `node server.js` silently at Windows login and opens/watches the microphone in the background.
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'public', 'data');
const WAKE_STATE_PATH = path.join(DATA_DIR, 'bsc-jarvis-wake-daemon-state.json');

const STARTUP_DIR = process.env.APPDATA
  ? path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup')
  : path.join(process.env.USERPROFILE || 'C:\\Users\\USER', 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');
const STARTUP_VBS_PATH = path.join(STARTUP_DIR, 'BSC_Jarvis_AutoStart.vbs');
const DESKTOP_LNK_VBS_PATH = path.join(ROOT_DIR, 'Start_BSC_Jarvis.vbs');

let wakeProcess = null;
let daemonState = {
  enabled: true,
  status: 'INITIALIZING',
  engine: 'WINDOWS_OS_SAPI_ALWAYS_ON',
  culture: 'ko-KR',
  wakeWords: ['BSC_자비스', '자비스', '비에스씨 자비스', '사사리사', '헤이 자비스', '아빠 왔어', '나 왔어'],
  autoOpenWindowOnWake: true,
  autoStartRegistered: false,
  startupFilePath: STARTUP_VBS_PATH,
  lastWakeAt: null,
  lastHeardText: '',
  wakeCount: 0
};

function loadSavedWakeState() {
  try {
    if (fs.existsSync(WAKE_STATE_PATH)) {
      const saved = JSON.parse(fs.readFileSync(WAKE_STATE_PATH, 'utf8'));
      daemonState = { ...daemonState, ...saved };
    }
  } catch (_) {}
  daemonState.autoStartRegistered = fs.existsSync(STARTUP_VBS_PATH);
  return daemonState;
}

function saveWakeState() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    daemonState.autoStartRegistered = fs.existsSync(STARTUP_VBS_PATH);
    fs.writeFileSync(WAKE_STATE_PATH, JSON.stringify(daemonState, null, 2), 'utf8');
  } catch (_) {}
}

/**
 * Generate the silent Windows Startup VBS launcher (`BSC_Jarvis_AutoStart.vbs`)
 * Equivalent to `scripts/install.sh` LaunchAgent (`RunAtLoad: true`)
 */
function buildStartupVbsContent(openAppWindowImmediately = true) {
  const serverJs = path.join(ROOT_DIR, 'server.js').replace(/\\/g, '\\\\');
  const rootEsc = ROOT_DIR.replace(/\\/g, '\\\\');
  return [
    `' BSC_자비스 (BSC_Jarvis) Windows 11 Login Auto-Start Daemon`,
    `' Starts BSC_자비스 background voice server & HUD at Windows login`,
    `Set WshShell = CreateObject("WScript.Shell")`,
    `WshShell.CurrentDirectory = "${rootEsc}"`,
    `WshShell.Run "cmd /c node ""${serverJs}""", 0, False`,
    openAppWindowImmediately
      ? `WScript.Sleep 1800\nWshShell.Run "cmd /c start msedge --app=http://localhost:7777", 0, False`
      : `' Background wake listener active; window opens when wake word is spoken`
  ].join('\r\n');
}

function setWindowsLoginAutoStart(enable = true, openAppWindowImmediately = true) {
  loadSavedWakeState();
  try {
    const vbsContent = buildStartupVbsContent(openAppWindowImmediately);
    // Always keep a convenient launcher in c:\BSC_Javis_OS\Start_BSC_Jarvis.vbs
    fs.writeFileSync(DESKTOP_LNK_VBS_PATH, vbsContent, 'utf8');

    if (enable) {
      if (!fs.existsSync(STARTUP_DIR)) {
        fs.mkdirSync(STARTUP_DIR, { recursive: true });
      }
      fs.writeFileSync(STARTUP_VBS_PATH, vbsContent, 'utf8');
      daemonState.autoStartRegistered = true;
    } else {
      // Do not delete without user request; if user toggles off, we write a no-op comment file or mark disabled in state
      fs.writeFileSync(STARTUP_VBS_PATH, `' BSC_자비스 자동 시작 일시 비활성화됨 (설정에서 다시 켤 수 있습니다)\r\n`, 'utf8');
      daemonState.autoStartRegistered = false;
    }
    saveWakeState();
    return {
      ok: true,
      autoStartRegistered: daemonState.autoStartRegistered,
      startupFilePath: STARTUP_VBS_PATH,
      launcherPath: DESKTOP_LNK_VBS_PATH,
      message: daemonState.autoStartRegistered
        ? '컴퓨터를 켜면 BSC_자비스가 백그라운드에서 자동으로 시작되어 이름을 부르면 즉시 응답합니다.'
        : '윈도우 시작 시 자동 실행이 비활성화되었습니다.'
    };
  } catch (err) {
    return {
      ok: false,
      error: err.message,
      startupFilePath: STARTUP_VBS_PATH
    };
  }
}

/**
 * Launch or bring to front the frameless `BSC_자비스` desktop HUD window (`--app=http://localhost:7777`)
 */
function launchOrFocusBscJarvisAppWindow(port = 7777) {
  const url = `http://127.0.0.1:${port}/?wake=1&v=20261027_v5`;
  const edgeCandidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  const chromeCandidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  const edgeExe = edgeCandidates.find(p => fs.existsSync(p));
  const chromeExe = chromeCandidates.find(p => fs.existsSync(p));
  let cmd = `cmd.exe /c start "" "${url}"`;
  if (edgeExe) {
    cmd = `"${edgeExe}" --app="${url}" --window-size=1680,980 --new-window`;
  } else if (chromeExe) {
    cmd = `"${chromeExe}" --app="${url}" --window-size=1680,980 --new-window`;
  }
  exec(cmd, { windowsHide: false }, () => {});
}

/**
 * Start the persistent OS-level background microphone wake-word listener
 * so even when all browser windows are closed, calling "BSC_자비스" / "자비스" / "사사리사" / "아빠 왔어"
 * wakes up the system, opens the window, and executes!
 */
function startWindowsAlwaysOnWakeDaemon({ port = 7777, getConnectedClients = () => 0, onWakeDetected = () => {} } = {}) {
  loadSavedWakeState();
  // Ensure the startup launcher is registered by default so "Turn on PC -> Call Name" works out of the box
  if (!fs.existsSync(STARTUP_VBS_PATH)) {
    setWindowsLoginAutoStart(true, true);
  } else {
    saveWakeState();
  }

  if (wakeProcess) {
    try { wakeProcess.kill(); } catch (_) {}
    wakeProcess = null;
  }

  const psScript = `
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
try {
  Add-Type -AssemblyName System.Speech
  $rec = $null
  try {
    $rec = New-Object System.Speech.Recognition.SpeechRecognitionEngine([System.Globalization.CultureInfo]::GetCultureInfo('ko-KR'))
  } catch {
    $rec = New-Object System.Speech.Recognition.SpeechRecognitionEngine
  }
  $rec.SetInputToDefaultAudioDevice()

  $choices = New-Object System.Speech.Recognition.Choices
  $choices.Add(@('자비스', '비에스씨 자비스', '사사리사', '헤이 자비스', '아빠 왔어', '나 왔어', '자비스 유튜브 틀어', '자비스 시간 알려줘', '자비스 창 다 꺼'))
  $gb = New-Object System.Speech.Recognition.GrammarBuilder($choices)
  try { $gb.Culture = $rec.RecognizerInfo.Culture } catch {}
  $rec.LoadGrammar((New-Object System.Speech.Recognition.Grammar($gb)))
  $rec.LoadGrammar((New-Object System.Speech.Recognition.DictationGrammar))

  Write-Output "WAKE_DAEMON_READY:$($rec.RecognizerInfo.Culture.Name)"

  while ($true) {
    $res = $rec.Recognize([TimeSpan]::FromSeconds(8))
    if ($res -and $res.Text -and $res.Confidence -ge 0.25) {
      Write-Output "WAKE_HEARD:$($res.Text)"
    }
  }
} catch {
  Write-Output "WAKE_DAEMON_STANDBY:$($_.Exception.Message)"
  while ($true) { Start-Sleep -Seconds 30 }
}
`;

  try {
    wakeProcess = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', psScript], {
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'ignore']
    });

    daemonState.status = 'LISTENING_BACKGROUND';
    saveWakeState();

    wakeProcess.stdout.on('data', (chunk) => {
      const lines = String(chunk || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
      for (const line of lines) {
        if (line.startsWith('WAKE_DAEMON_READY:')) {
          daemonState.culture = line.split(':')[1] || 'ko-KR';
          daemonState.status = 'LISTENING_OS_MIC';
          saveWakeState();
        } else if (line.startsWith('WAKE_DAEMON_STANDBY:')) {
          daemonState.status = 'BROWSER_AND_HOTKEY_READY';
          saveWakeState();
        } else if (line.startsWith('WAKE_HEARD:')) {
          const heard = line.slice('WAKE_HEARD:'.length).trim();
          if (!heard) continue;
          const isWake = /(자비스|사사리사|아빠\s*왔어|나\s*왔어|헤이)/i.test(heard);
          if (isWake) {
            triggerOsWakeEvent(heard, { port, getConnectedClients, onWakeDetected, source: 'OS_MIC_DAEMON' });
          }
        }
      }
    });

    wakeProcess.on('exit', () => {
      daemonState.status = 'STANDBY';
    });
  } catch (e) {
    daemonState.status = 'STANDBY';
    saveWakeState();
  }

  return getWakeDaemonStatus();
}

function triggerOsWakeEvent(heardText = '', { port = 7777, getConnectedClients = () => 0, onWakeDetected = () => {}, source = 'MANUAL_OR_OS_MIC', forceOpenWindow = false } = {}) {
  const heard = String(heardText || '').trim();
  if (!heard) {
    return { ok: false, source, heardText: '', message: '들은 문장이 없습니다.' };
  }
  daemonState.lastWakeAt = new Date().toLocaleTimeString('ko-KR');
  daemonState.lastHeardText = heard;
  daemonState.wakeCount = (daemonState.wakeCount || 0) + 1;
  saveWakeState();

  const clients = typeof getConnectedClients === 'function' ? getConnectedClients() : 0;
  let windowLaunched = false;
  if (forceOpenWindow || (daemonState.autoOpenWindowOnWake && clients === 0)) {
    launchOrFocusBscJarvisAppWindow(port);
    windowLaunched = true;
  }

  const eventPayload = {
    ok: true,
    source,
    heardText: heard,
    wakeAt: daemonState.lastWakeAt,
    wakeCount: daemonState.wakeCount,
    connectedClients: clients,
    windowLaunched,
    isBootGreeting: /(아빠\s*왔어|나\s*왔어|다녀왔어)/i.test(heard)
  };

  if (typeof onWakeDetected === 'function') {
    onWakeDetected(eventPayload);
  }
  return eventPayload;
}

function getWakeDaemonStatus() {
  loadSavedWakeState();
  return {
    ok: true,
    daemonState
  };
}

module.exports = {
  startWindowsAlwaysOnWakeDaemon,
  setWindowsLoginAutoStart,
  triggerOsWakeEvent,
  getWakeDaemonStatus,
  launchOrFocusBscJarvisAppWindow
};
