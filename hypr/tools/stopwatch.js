export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Stopwatch</h3>
      <button id="pin-stopwatch" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Track elapsed time with start, stop, and reset.</p>
    <div class="stopwatch-display">
      <span id="stopwatch-output">Time: 00:00:00</span>
    </div>
    <div class="stopwatch-controls">
      <button onclick="Hypr.toolUtilities.stopwatch.start()" class="stopwatch-button primary">Start</button>
      <button onclick="Hypr.toolUtilities.stopwatch.stop()" class="stopwatch-button">Stop</button>
      <button onclick="Hypr.toolUtilities.stopwatch.reset()" class="stopwatch-button">Reset</button>
    </div>
  </div>
`;

export const css = `
  .stopwatch-display { margin: 12px 0; font-size: 18px; color: #f1f5f9; }
  .stopwatch-controls { display: flex; gap: 8px; justify-content: center; }
  .stopwatch-button { padding: 10px; background-color: #334155; color: #f1f5f9; border: 1px solid #475569; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background-color 0.2s, border-color 0.2s, transform 0.2s; }
  .stopwatch-button:hover { background-color: #475569; border-color: #ff1a1a; transform: scale(1.05); }
  .stopwatch-button.primary { background-color: #ff1a1a; border-color: #ff1a1a; }
  .stopwatch-button.primary:hover { background-color: #e01414; border-color: #e01414; transform: scale(1.05); }
`;

export const init = (utils) => {
  const stopwatch = {
    timeElapsed: 0,
    interval: null,
    start() {
      const output = utils.dom.getElement('stopwatch-output');
      if (!output) return;
      if (this.interval) return;
      this.interval = setInterval(() => {
        this.timeElapsed++;
        this.updateDisplay(output);
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
      this.timeElapsed = 0;
      const output = utils.dom.getElement('stopwatch-output');
      if (output) output.textContent = 'Time: 00:00:00';
    },
    updateDisplay(output) {
      const hours = Math.floor(this.timeElapsed / 3600);
      const minutes = Math.floor((this.timeElapsed % 3600) / 60);
      const seconds = this.timeElapsed % 60;
      output.textContent = `Time: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  Hypr.toolUtilities.stopwatch = stopwatch;

  const startButton = utils.dom.query('.stopwatch-button.primary');
  if (startButton) startButton.addEventListener('click', stopwatch.start);
  const stopButton = utils.dom.query('.stopwatch-button:not(.primary)');
  if (stopButton) stopButton.addEventListener('click', stopwatch.stop);
  const resetButton = utils.dom.query('.stopwatch-button:last-child');
  if (resetButton) resetButton.addEventListener('click', stopwatch.reset);
};