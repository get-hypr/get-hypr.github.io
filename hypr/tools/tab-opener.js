export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Tab Opener</h3>
      <button id="pin-tab-opener" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Open multiple tabs (1-50) of a URL (default: current page).</p>
    <input id="tab-url" type="text" placeholder="URL (leave blank for current page)" class="tool-input">
    <div class="input-group">
      <input id="tab-count" type="number" min="1" max="50" placeholder="Number of tabs (1-50)" class="tool-input">
    </div>
    <button onclick="Hypr.toolUtilities.tabOpener.openTabs()" class="action-button" data-tooltip="Open tabs">Open Tabs</button>
    <p id="tab-status" class="tool-description"></p>
  </div>
`;

export const css = `
  /* Tab Opener-specific styles */
  .input-group input { width: 100%; }
`;

export const init = (utils) => {
  const tabOpener = {
    openTabs() {
      const urlInput = utils.dom.getElement('tab-url');
      const countInput = utils.dom.getElement('tab-count');
      const status = utils.dom.getElement('tab-status');
      if (!urlInput || !countInput || !status) return;
      const count = parseInt(countInput.value, 10);
      if (isNaN(count) || count < 1 || count > 50) {
        status.textContent = 'Enter a number between 1 and 50';
        return;
      }
      if (count > 10 && !confirm(`Opening ${count} tabs may slow your browser. Continue?`)) {
        status.textContent = 'Operation cancelled';
        return;
      }
      try {
        const url = urlInput.value.trim() || window.location.href;
        for (let i = 0; i < count; i++) {
          window.open(url, '_blank');
        }
        status.textContent = `Opened ${count} tabs`;
      } catch (e) {
        status.textContent = 'Failed to open tabs';
      }
    }
  };
  Hypr.toolUtilities.tabOpener = tabOpener;
  const openButton = utils.dom.query('.action-button');
  if (openButton) openButton.addEventListener('click', tabOpener.openTabs);
};