export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">History Flooder</h3>
      <button id="pin-history-flooder" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Add current page to history multiple times (1-1000).</p>
    <div class="input-group">
      <input id="history-count" type="number" min="1" max="1000" placeholder="Number of entries (1-1000)" class="tool-input">
    </div>
    <button onclick="Hypr.toolUtilities.historyFlooder.floodHistory()" class="action-button" data-tooltip="Flood history">Flood History</button>
    <p id="history-status" class="tool-description"></p>
  </div>
`;

export const css = `
  /* History Flooder-specific styles */
  .input-group input { width: 100%; }
`;

export const init = (utils) => {
  const historyFlooder = {
    floodHistory() {
      const countInput = utils.dom.getElement('history-count');
      const status = utils.dom.getElement('history-status');
      if (!countInput || !status) return;
      const count = parseInt(countInput.value, 10);
      if (isNaN(count) || count < 1 || count > 1000) {
        status.textContent = 'Enter a number between 1 and 1000';
        return;
      }
      try {
        const url = window.location.href;
        for (let i = 0; i < count; i++) {
          history.pushState({}, '', i === count - 1 ? url : `${url}#${i}`);
        }
        status.textContent = `Added ${count} entries to history`;
      } catch (e) {
        status.textContent = 'Failed to flood history';
      }
    }
  };
  Hypr.toolUtilities.historyFlooder = historyFlooder;
  const floodButton = utils.dom.query('.action-button');
  if (floodButton) floodButton.addEventListener('click', historyFlooder.floodHistory);
};