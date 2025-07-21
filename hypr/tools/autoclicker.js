export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Autoclicker</h3>
      <button id="pin-autoclicker" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">An advanced autoclicking tool.</p>

    <div class="autoclicker-options">
      <input id="click-interval" type="number" placeholder="Interval (ms)" class="tool-input">

      <select id="click-button" class="tool-input">
        <option value="left">Left Click</option>
        <option value="middle">Middle Click</option>
        <option value="right">Right Click</option>
      </select>

      <select id="click-mode" class="tool-input">
        <option value="cursor">Follow Cursor</option>
        <option value="fixed">Fixed Location</option>
      </select>

      <div id="fixed-coords" style="display: none; gap: 6px; display: flex;">
        <input id="coord-x" type="number" placeholder="X" class="tool-input" style="width: 50%;">
        <input id="coord-y" type="number" placeholder="Y" class="tool-input" style="width: 50%;">
      </div>

      <label style="margin-top: 6px; display: flex; align-items: center; gap: 6px;">
        Hotkey: <input id="start-hotkey" class="tool-input" value="F6" style="width: 100px;">
      </label>
    </div>

    <div class="autoclicker-status">
      <span id="autoclicker-status-text">Status: Stopped</span>
    </div>

    <button id="autoclicker-start" class="random-button primary">Start</button>
    <button id="autoclicker-stop" class="random-button" style="margin-left: 8px;">Stop</button>
  </div>
`;

export const css = `
  .autoclicker-options { display: flex; flex-direction: column; gap: 8px; margin: 10px 0; }
  .autoclicker-status { font-size: 16px; color: #f1f5f9; margin-top: 10px; }
  .random-button { padding: 10px; background-color: #334155; color: #f1f5f9; border: 1px solid #475569; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background-color 0.2s, border-color 0.2s, transform 0.2s; }
  .random-button:hover { background-color: #475569; border-color: #ff1a1a; transform: scale(1.05); }
  .random-button.primary { background-color: #22c55e; border-color: #22c55e; }
  .random-button.primary:hover { background-color: #16a34a; border-color: #16a34a; }
`;

export const init = (utils) => {
  const autoclicker = {
    intervalId: null,
    hotkey: 'F6',
    isRecordingHotkey: false,

    start() {
      const interval = parseInt(utils.dom.getElement('click-interval')?.value);
      const buttonType = utils.dom.getElement('click-button')?.value;
      const mode = utils.dom.getElement('click-mode')?.value;
      const coordX = parseInt(utils.dom.getElement('coord-x')?.value);
      const coordY = parseInt(utils.dom.getElement('coord-y')?.value);
      const statusText = utils.dom.getElement('autoclicker-status-text');

      if (isNaN(interval) || interval <= 0) {
        statusText.textContent = 'Status: Invalid interval';
        return;
      }

      this.stop();
      statusText.textContent = 'Status: Running';

      this.intervalId = setInterval(() => {
        let x = 0;
        let y = 0;

        if (mode === 'fixed') {
          if (isNaN(coordX) || isNaN(coordY)) {
            statusText.textContent = 'Status: Invalid coordinates';
            this.stop();
            return;
          }
          x = coordX;
          y = coordY;
        } else {
          x = window.event?.clientX || 100;
          y = window.event?.clientY || 100;
        }

        const buttonCode = buttonType === 'left' ? 0 : buttonType === 'middle' ? 1 : 2;

        const click = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          button: buttonCode,
          clientX: x,
          clientY: y
        });

        document.elementFromPoint(x, y)?.dispatchEvent(click);
      }, interval);
    },

    stop() {
      const statusText = utils.dom.getElement('autoclicker-status-text');
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      statusText.textContent = 'Status: Stopped';
    },

    bindHotkeyToggle() {
      document.addEventListener('keydown', (e) => {
        if (this.isRecordingHotkey) return; // avoid conflict
        if (e.key.toUpperCase() === this.hotkey.toUpperCase()) {
          this.intervalId ? this.stop() : this.start();
        }
      });
    },

    bindHotkeyInput() {
      const input = utils.dom.getElement('start-hotkey');
      let previousKey = this.hotkey;

      input.addEventListener('focus', () => {
        input.value = '(press key)';
        this.isRecordingHotkey = true;

        const captureKey = (e) => {
          e.preventDefault();
          if (e.key === 'Escape') {
            input.value = previousKey;
            this.isRecordingHotkey = false;
            window.removeEventListener('keydown', captureKey);
            return;
          }

          this.hotkey = e.key;
          input.value = e.key;
          this.isRecordingHotkey = false;
          window.removeEventListener('keydown', captureKey);
        };

        window.addEventListener('keydown', captureKey);
      });
    }
  };

  Hypr.toolUtilities.autoclicker = autoclicker;

  utils.dom.getElement('autoclicker-start')?.addEventListener('click', () => autoclicker.start());
  utils.dom.getElement('autoclicker-stop')?.addEventListener('click', () => autoclicker.stop());
  utils.dom.getElement('click-mode')?.addEventListener('change', (e) => {
    utils.dom.getElement('fixed-coords').style.display = e.target.value === 'fixed' ? 'flex' : 'none';
  });

  autoclicker.bindHotkeyToggle();
  autoclicker.bindHotkeyInput();
};