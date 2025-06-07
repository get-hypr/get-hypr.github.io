export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Cheat Sheet</h3>
      <button id="pin-cheat-sheet" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Store key info for quick access (saved locally).</p>
    <textarea id="cheatsheet-input" placeholder="Enter key info (e.g., formulas, vocab)" rows="5" class="tool-textarea"></textarea>
    <div class="button-group">
      <button onclick="Hypr.toolUtilities.cheatSheet.saveCheatSheet()" class="action-button" data-tooltip="Save cheat sheet">Save</button>
      <button onclick="Hypr.toolUtilities.cheatSheet.clearCheatSheet()" class="action-button" data-tooltip="Clear cheat sheet">Clear</button>
    </div>
  </div>
`;

export const css = `
  /* Cheat Sheet-specific styles */
  .tool-textarea { min-height: 100px; }
`;

export const init = (utils) => {
  const cheatSheet = {
    saveCheatSheet() {
      const input = utils.dom.getElement('cheatsheet-input');
      if (input) utils.localStorage.set('hypr-cheatsheet', input.value);
    },
    loadCheatSheet() {
      const input = utils.dom.getElement('cheatsheet-input');
      if (input) input.value = utils.localStorage.get('hypr-cheatsheet') || '';
    },
    clearCheatSheet() {
      const input = utils.dom.getElement('cheatsheet-input');
      if (input) {
        input.value = '';
        utils.localStorage.remove('hypr-cheatsheet');
      }
    }
  };
  Hypr.toolUtilities.cheatSheet = cheatSheet;
  cheatSheet.loadCheatSheet();
  const saveButton = utils.dom.queryAll('.action-button')[0];
  const clearButton = utils.dom.queryAll('.action-button')[1];
  if (saveButton) saveButton.addEventListener('click', cheatSheet.saveCheatSheet);
  if (clearButton) clearButton.addEventListener('click', cheatSheet.clearCheatSheet);
};