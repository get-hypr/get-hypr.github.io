export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Test Cheat</h3>
    </div>
    <p class="tool-description">Test for HyprCheats.</p>
    <button onclick="Hypr.cheatUtilities.test.execute()" class="action-button">Execute</button>
  </div>
`;

export const css = `
  /* None */
`;

export const init = (utils) => {
  const test = {
    execute() {
      alert('Test executed!');
    }
  };
  Hypr.cheatUtilities.test = test;
  const executeButton = utils.dom.query('.test-button');
  if (executeButton) executeButton.addEventListener('click', test.execute);
};