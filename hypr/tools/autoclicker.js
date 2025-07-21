export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Autoclicker</h3>
      <button id="pin-autoclicker" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Click at your cursor using a custom CPS and hotkey.</p>

    <div class="autoclicker-options">
      <input id="cps-input" type="number" class="tool-input" placeholder="CPS (e.g. 10)" min="1" max="200" />

      <label style="margin-top: 8px;">Hotkey:</label>
      <input id="start-hotkey" class="tool-input" value="Control+E" placeholder="Press a key combo..." />

      <div class="autoclicker-status">
        <span id="autoclicker-status-text">Status: Ready</span>
      </div>
    </div>
  </div>
`;

export const css = `
  .autoclicker-options { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
  .autoclicker-status { font-size: 14px; color: #f1f5f9; margin-top: 6px; }
`;

export const init = (utils) => {
  const autoclicker = {
    active: false,
    interval: null,
    cps: 10,
    hotkeyCombo: ['Control', 'e'],
    isRecording: false,
    x: 0,
    y: 0,

    start() {
      if (window.click || this.active) return;

      const cpsInput = utils.dom.getElement('cps-input');
      const status = utils.dom.getElement('autoclicker-status-text');
      const cps = parseFloat(cpsInput?.value);

      if (!cps || isNaN(cps) || cps < 1 || cps > 200) {
        status.textContent = 'Status: Invalid CPS';
        return;
      }

      this.cps = cps;
      this.active = true;
      window.click = true;
      document.body.style.cursor = 'crosshair';
      status.textContent = `Status: Running (${cps} CPS)`;

      window.addEventListener('mousemove', this._trackCursor);
      this.interval = setInterval(() => {
        const el = document.elementFromPoint(this.x, this.y);
        if (el) el.click();
      }, 1000 / cps);
    },

    stop() {
      if (!this.active) return;
      clearInterval(this.interval);
      window.removeEventListener('mousemove', this._trackCursor);
      this.interval = null;
      this.active = false;
      window.click = false;
      document.body.style.cursor = 'default';
      const status = utils.dom.getElement('autoclicker-status-text');
      status.textContent = 'Status: Stopped';
    },

    _trackCursor(e) {
      autoclicker.x = e.clientX;
      autoclicker.y = e.clientY;
    },

    bindHotkey() {
      const input = utils.dom.getElement('start-hotkey');

      input.addEventListener('focus', () => {
        input.value = '(press combo)';
        autoclicker.isRecording = true;

        const listener = (e) => {
          e.preventDefault();

          if (e.key === 'Escape') {
            input.value = autoclicker.hotkeyCombo.join('+');
            autoclicker.isRecording = false;
            window.removeEventListener('keydown', listener);
            return;
          }

          const combo = [];
          if (e.ctrlKey) combo.push('Control');
          if (e.shiftKey) combo.push('Shift');
          if (e.altKey) combo.push('Alt');
          combo.push(e.key);

          autoclicker.hotkeyCombo = combo;
          input.value = combo.join('+');
          autoclicker.isRecording = false;
          window.removeEventListener('keydown', listener);
        };

        window.addEventListener('keydown', listener);
      });

      document.addEventListener('keydown', (e) => {
        if (autoclicker.isRecording) return;

        const matchKey = autoclicker.hotkeyCombo.includes(e.key);
        const matchMods =
          autoclicker.hotkeyCombo.includes('Control') === e.ctrlKey &&
          autoclicker.hotkeyCombo.includes('Shift') === e.shiftKey &&
          autoclicker.hotkeyCombo.includes('Alt') === e.altKey;

        if (matchKey && matchMods) {
          autoclicker.active ? autoclicker.stop() : autoclicker.start();
        }
      });
    }
  };

  Hypr.toolUtilities.autoclicker = autoclicker;
  autoclicker.bindHotkey();
};
