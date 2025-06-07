export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Timer</h3>
      <button id="pin-timer" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Set a countdown timer in seconds.</p>
    <input id="timer-input" type="number" placeholder="Enter seconds" class="tool-input" min="1">
    <div class="timer-display">
      <span id="timer-output">Time: 00:00</span>
    </div>
    <div class="timer-controls">
      <button onclick="Hypr.toolUtilities.timer.start()" class="timer-button primary">Start</button>
      <button onclick="Hypr.toolUtilities.timer.stop()" class="timer-button">Stop</button>
      <button onclick="Hypr.toolUtilities.timer.reset()" class="timer-button">Reset</button>
    </div>
  </div>
`;

export const css = `
  .timer-display { margin: 12px 0; font-size: 18px; color: #f1f5f9; }
  .timer-controls { display: flex; gap: 8px; justify-content: center; }
  .timer-button { padding: 10px; background-color: #334155; color: #f1f5f9; border: 1px solid #475569; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background-color 0.2s, border-color 0.2s, transform 0.2s; }
  .timer-button:hover { background-color: #475569; border-color: #ff1a1a; transform: scale(1.05); }
  .timer-button.primary { background-color: #ff1a1a; border-color: #ff1a1a; }
  .timer-button.primary:hover { background-color: #e01414; border-color: #e01414; transform: scale(1.05); }
`;

export const init = (utils) => {
  const timer = {
    timeLeft: 0,
    interval: null,
    start() {
      const input = utils.dom.getElement('timer-input');
      const output = utils.dom.getElement('timer-output');
      if (!input || !output) return;
      const seconds = parseInt(input.value);
      if (isNaN(seconds) || seconds < 1) {
        output.textContent = 'Time: Invalid';
        return;
      }
      if (this.interval) clearInterval(this.interval);
      this.timeLeft = seconds;
      this.updateDisplay(output);
      this.interval = setInterval(() => {
        this.timeLeft--;
        this.updateDisplay(output);
        if (this.timeLeft <= 0) {
          clearInterval(this.interval);
          this.interval = null;
          output.textContent = 'Time: 00:00 - Done!';
        }
      }, 1000);
    },
    stop() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    },
    reset() {
      this.stop();
      this.timeLeft = 0;
      const output = utils.dom.getElement('timer-output');
      if (output) output.textContent = 'Time: 00:00';
      const input = utils.dom.getElement('timer-input');
      if (input) input.value = '';
    },
    updateDisplay(output) {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      output.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  Hypr.toolUtilities.timer = timer;

  const startButton = utils.dom.query('.timer-button.primary');
  if (startButton) startButton.addEventListener('click', timer.start);
  const stopButton = utils.dom.query('.timer-button:not(.primary)');
  if (stopButton) stopButton.addEventListener('click', timer.stop);
  const resetButton = utils.dom.query('.timer-button:last-child');
  if (resetButton) resetButton.addEventListener('click', timer.reset);
};