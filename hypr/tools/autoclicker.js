export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Advanced Autoclicker</h3>
      <button id="pin-autoclicker" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Automatically click with full control.</p>

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
        <input type="checkbox" id="repeat-toggle" />
        Repeat indefinitely
      </label>

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

    start() {
      const interval = parseInt(utils.dom.getElement('click-interval')?.value);
      const buttonType = utils.dom.getElement('click-button')?.value;
      const mode = utils.dom.getElement('click-mode')?.value;
      const repeat = utils.dom.getElement('repeat-toggle')?.checked;
      const coordX = parseInt(utils.dom.getElement('coord-x')?.value);
      const coordY = parseInt(utils.dom.getElement('coord-y')?.value);
      const statusText = utils.dom.getElement('autoclicker-status-text');

      if (isNaN(interval) || interval <= 0) {
        statusText.textContent = 'Status: Invalid interval';
        return;
      }

      this.stop(); // Clear previous intervals
      statusText.textContent = 'Status: Running';

      this.intervalId = setInterval(() => {
        let targetX = 0;
        let targetY = 0;

        if (mode === 'fixed') {
          if (isNaN(coordX) || isNaN(coordY)) {
            statusText.textContent = 'Status: Invalid coordinates';
            this.stop();
            return;
          }
          targetX = coordX;
          targetY = coordY;
        } else {
          const mouseEvent = window.event;
          targetX = mouseEvent?.clientX ?? 100;
          targetY = mouseEvent?.clientY ?? 100;
        }

        const buttonCode = buttonType === 'left' ? 0 : buttonType === 'middle' ? 1 : 2;

        const evt = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          button: buttonCode,
          clientX: targetX,
          clientY: targetY
        });

        document.elementFromPoint(targetX, targetY)?.dispatchEvent(evt);

        if (!repeat) this.stop();
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

    setHotkeyListener() {
      document.addEventListener('keydown', (e) => {
        const userKey = utils.dom.getElement('start-hotkey')?.value || 'F6';
        if (e.key.toUpperCase() === userKey.toUpperCase()) {
          if (this.intervalId) this.stop();
          else this.start();
        }
      });
    }
  };

  Hypr.toolUtilities.autoclicker = autoclicker;

  utils.dom.getElement('autoclicker-start')?.addEventListener('click', () => autoclicker.start());
  utils.dom.getElement('autoclicker-stop')?.addEventListener('click', () => autoclicker.stop());
  utils.dom.getElement('click-mode')?.addEventListener('change', (e) => {
    const mode = e.target.value;
    utils.dom.getElement('fixed-coords').style.display = mode === 'fixed' ? 'flex' : 'none';
  });

  autoclicker.setHotkeyListener();
};
