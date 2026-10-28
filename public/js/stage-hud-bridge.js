/**
 * Top-bar actions for the AR stage.
 * The stage module owns the item list and exposes window.BSC_StageAPI.
 */
(function () {
  function api() {
    return window.BSC_StageAPI || null;
  }

  function esc(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function closeModal() {
    const el = document.getElementById('jarvis-ui-manager-modal');
    if (el) el.remove();
  }

  async function renderManager() {
    closeModal();
    let payload = { defaults: [], custom: [] };
    try {
      const res = await fetch('/api/stage-ui-icons');
      if (res.ok) payload = await res.json();
    } catch (_) {}

    const modal = document.createElement('div');
    modal.id = 'jarvis-ui-manager-modal';
    modal.style.cssText = 'position:fixed;top:64px;left:18px;z-index:99999;width:min(440px,92vw);background:rgba(9,20,24,0.96);backdrop-filter:blur(16px);border:1.5px solid rgba(111,229,214,0.6);border-radius:18px;padding:16px 18px;color:#ecfffa;font-family:Pretendard,-apple-system,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,0.7);';
    const defaults = Array.isArray(payload.defaults) ? payload.defaults : [];
    const custom = Array.isArray(payload.custom) ? payload.custom : [];
    modal.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <strong style="font-size:15px;color:#8ff0e4;">UI 추가·관리</strong>
        <button type="button" id="jarvis-ui-mgr-close" style="background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
      </div>
      <div style="font-size:12px;line-height:1.55;color:#d1fae5;display:flex;flex-direction:column;gap:8px;">
        ${defaults.map((o) => `<div style="padding:8px 10px;border:1px solid rgba(111,229,214,0.28);border-radius:10px;"><b>${esc(o.title)}</b> <span style="color:#94a3b8;">${esc(o.kind || 'notes')}</span></div>`).join('')}
        ${custom.map((o) => `<div style="display:flex;justify-content:space-between;gap:8px;align-items:center;padding:8px 10px;border:1px solid rgba(251,191,36,0.35);border-radius:10px;"><span><b>${esc(o.title)}</b> <span style="color:#94a3b8;">${esc(o.kind || 'notes')}</span></span><button type="button" data-del="${esc(o.id)}" style="background:rgba(225,29,72,0.25);color:#fecdd3;border:1px solid rgba(248,113,113,0.6);border-radius:999px;padding:3px 8px;cursor:pointer;">삭제</button></div>`).join('')}
      </div>
      <form id="jarvis-ui-mgr-form" style="display:flex;flex-direction:column;gap:8px;margin-top:12px;">
        <input id="jarvis-ui-mgr-title" name="title" placeholder="새 오브 이름" style="background:#041014;color:#ecfffa;border:1px solid rgba(111,229,214,0.4);border-radius:8px;padding:8px 10px;" />
        <select id="jarvis-ui-mgr-kind" name="kind" style="background:#041014;color:#ecfffa;border:1px solid rgba(111,229,214,0.4);border-radius:8px;padding:8px 10px;">
          <option value="notes">notes</option>
          <option value="media">media</option>
        </select>
        <input id="jarvis-ui-mgr-path" name="path" placeholder="폴더 경로 (비우면 아이콘 제어 문서)" style="background:#041014;color:#ecfffa;border:1px solid rgba(111,229,214,0.4);border-radius:8px;padding:8px 10px;" />
        <button type="submit" style="background:rgba(0,240,255,0.22);color:#ecfeff;border:1px solid #00f0ff;border-radius:999px;padding:7px 12px;font-weight:800;cursor:pointer;">오브 추가</button>
        <div id="jarvis-ui-mgr-status" style="min-height:1.2em;color:#fcd34d;font-size:12px;"></div>
      </form>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#jarvis-ui-mgr-close').onclick = (ev) => {
      ev.stopPropagation();
      closeModal();
    };
    modal.querySelectorAll('[data-del]').forEach((btn) => {
      btn.onclick = async (ev) => {
        ev.stopPropagation();
        const status = modal.querySelector('#jarvis-ui-mgr-status');
        try {
          const res = await fetch('/api/stage-ui-icons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id: btn.getAttribute('data-del') })
          });
          if (!res.ok) throw new Error('delete failed');
          if (api()) await api().reloadOrbs();
          renderManager();
        } catch (_) {
          if (status) status.textContent = '삭제 요청이 전달되지 않았습니다.';
        }
      };
    });
    modal.querySelector('#jarvis-ui-mgr-form').onsubmit = async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const status = modal.querySelector('#jarvis-ui-mgr-status');
      const title = modal.querySelector('#jarvis-ui-mgr-title').value.trim();
      const kind = modal.querySelector('#jarvis-ui-mgr-kind').value;
      const folder = modal.querySelector('#jarvis-ui-mgr-path').value.trim();
      if (!title) {
        if (status) status.textContent = '이름을 입력하세요.';
        return;
      }
      try {
        const res = await fetch('/api/stage-ui-icons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'add', title, kind, path: folder })
        });
        if (!res.ok) throw new Error('add failed');
        if (api()) await api().reloadOrbs();
        renderManager();
      } catch (_) {
        if (status) status.textContent = '추가 요청이 전달되지 않았습니다.';
      }
    };
  }

  window.BSC_ToggleUIManagerModal = function () {
    if (document.getElementById('jarvis-ui-manager-modal')) {
      closeModal();
      return;
    }
    renderManager();
  };

  window.BSC_SpawnUICardImage = function (opts) {
    const stage = api();
    if (!stage || !opts || !opts.src) return null;
    return stage.spawnImage(opts);
  };

  window.BSC_SpawnDefaultUICards = async function () {
    const stage = api();
    if (!stage) return;
    const voice = document.getElementById('voice-status-txt');
    stage.spawnTextCard({
      id: 'hud-voice',
      title: '음성 상태',
      text: voice ? voice.textContent : '음성 대기',
      xFrac: 0.72,
      yFrac: 0.28
    });
    let tokenText = '연결 없음';
    try {
      const res = await fetch('/api/token-flow');
      if (res.ok) {
        const data = await res.json();
        const hasSession = data && (typeof data.totalTurns === 'number' || data.measured === true);
        if (hasSession) {
          const lines = [
            `턴 ${data.totalTurns}`,
            `세션 문자 ${data.sessionChars == null ? 0 : data.sessionChars}`
          ];
          if (typeof data.optimizedActualTokens === 'number') lines.push(`실제 토큰 ${data.optimizedActualTokens}`);
          if (typeof data.rawBaselineTokens === 'number') lines.push(`기준 토큰 ${data.rawBaselineTokens}`);
          if (typeof data.savedTokens === 'number') lines.push(`절감 토큰 ${data.savedTokens}`);
          if (typeof data.savingsPct === 'number') lines.push(`절감률 ${data.savingsPct}`);
          tokenText = lines.join('\n');
        }
      }
    } catch (_) {
      tokenText = '연결 없음';
    }
    stage.spawnTextCard({
      id: 'hud-token',
      title: '토큰 흐름',
      text: tokenText,
      xFrac: 0.72,
      yFrac: 0.62
    });
  };
})();
