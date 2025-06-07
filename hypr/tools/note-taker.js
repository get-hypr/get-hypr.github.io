export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Note Taker</h3>
      <button id="pin-note-taker" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Write and save notes locally.</p>
    <textarea id="notes-input" placeholder="Write your notes here" rows="5" class="tool-textarea"></textarea>
    <div class="button-group">
      <button onclick="Hypr.toolUtilities.noteTaker.saveNotes()" class="action-button" data-tooltip="Save notes">Save</button>
      <button onclick="Hypr.toolUtilities.noteTaker.clearNotes()" class="action-button" data-tooltip="Clear notes">Clear</button>
    </div>
  </div>
`;

export const css = `
  /* Note Taker-specific styles */
  .tool-textarea { min-height: 100px; }
`;

export const init = (utils) => {
  const noteTaker = {
    saveNotes() {
      const input = utils.dom.getElement('notes-input');
      if (input) utils.localStorage.set('hypr-notes', input.value);
    },
    loadNotes() {
      const input = utils.dom.getElement('notes-input');
      if (input) input.value = utils.localStorage.get('hypr-notes') || '';
    },
    clearNotes() {
      const input = utils.dom.getElement('notes-input');
      if (input) {
        input.value = '';
        utils.localStorage.remove('hypr-notes');
      }
    }
  };
  Hypr.toolUtilities.noteTaker = noteTaker;
  noteTaker.loadNotes();
  const saveButton = utils.dom.queryAll('.action-button')[0];
  const clearButton = utils.dom.queryAll('.action-button')[1];
  if (saveButton) saveButton.addEventListener('click', noteTaker.saveNotes);
  if (clearButton) clearButton.addEventListener('click', noteTaker.clearNotes);
};