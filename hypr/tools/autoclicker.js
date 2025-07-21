export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Autoclicker</h3>
      <button id="pin-autoclicker" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Automatically click at your chosen interval.</p>

    <div class="autoclicker-options">
      <input id="click-interval" type="number" placeholder="Interval (ms)" class="tool-input" style="width: 100%;">
      
      <select id="click-button" class="tool-input" style="width: 100%; margin-top: 8px;">
        <option value="left">Left Click</option>
        <option value="middle">Middle Click</option>
        <option value="right">Right Click</option>
      </select>

      <label style="margin-top: 8px; display: flex; align-items: center; gap: 8px;">
        <input type="checkbox" id="repeat-toggle" />
        Repeat indefinitely
      </label>
    </div>

    <div class="autoclicker-status" style="margin: 12px 0;">
      <span id="autoclicker-status-text">Status: Stopped</span>
    </div>

    <button id="autoclicker-start" class="random-button primary">Start</button>
    <button id="autoclicker-stop" class="random-button" style="margin-left: 8px;">Stop</button>
  </div>
`;

export const css = `
  .autoclicker-options { display: flex; flex-direction: column; gap: 8px; margin: 10px 0; }
  .autoclicker-status { font-size: 16px; color: #f1f5f9; }
  .random-button { padding: 10px; background-color: #334155; color: #f1f5f9; border: 1px solid #475569; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background-color 0.2s, border-color 0.2s, transform 0.2s; }
  .random-button:hover { background-color: #475569; border-color: #ff1a1a; transform: scale(1.05); }
  .random-button.primary { background-color: #22c55e; border-color: #22c55e; }
  .random-button.primary:hover { background-color: #16a34a; border-color: #16a34a; }
`;

export const init = (utils) => {
  const autoclicker = {
    intervalId: null,

    start() {
      const intervalInput = utils.dom.getElement('click-interval');
      const clickType = utils.dom.getElement('click-button');
      const repeat = utils.dom.getElement('repeat-toggle');
      const statusText = utils.dom.getElement('autoclicker-status-text');

      const interval = parseInt(intervalInput.value);
      if (isNaN(interval) || interval <= 0) {
        statusText.textContent = 'Status: Invalid interval';
        return;
      }

      if (autoclicker.intervalId) clearInterval(autoclicker.intervalId);

      const buttonType = clickType.value;

      statusText.textContent = 'Status: Running';

      autoclicker.intervalId = setInterval(() => {
        const event = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          button: buttonType === 'left' ? 0 : buttonType === 'middle' ? 1 : 2,
        });
        document.body.dispatchEvent(event);

        if (!repeat.checked) {
          autoclicker.stop();
        }
      }, interval);
    },

    stop() {
      const statusText = utils.dom.getElement('autoclicker-status-text');
      if (autoclicker.intervalId) {
        clearInterval(autoclicker.intervalId);
        autoclicker.intervalId = null;
      }
      statusText.textContent = 'Status: Stopped';
    }
  };

  Hypr.toolUtilities.autoclicker = autoclicker;

  const startBtn = utils.dom.getElement('autoclicker-start');
  const stopBtn = utils.dom.getElement('autoclicker-stop');
  if (startBtn) startBtn.addEventListener('click', autoclicker.start);
  if (stopBtn) stopBtn.addEventListener('click', autoclicker.stop);
};
