export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Stealth Opener</h3>
      <button id="pin-stealth-opener" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Open a URL without adding it to your history.</p>
    <input id="stealth-url" type="text" placeholder="URL (leave blank for current page)" class="tool-input">
    <button onclick="Hypr.toolUtilities.stealthOpener.stealthOpen()" class="action-button" data-tooltip="Stealth open">Stealth Open</button>
    <p id="tab-status" class="tool-description"></p>
  </div>
`;

export const css = `
  /* Stealth Opener-specific styles */
  .tool-input { width: 100%; }
`;

export const init = (utils) => {
  const stealthOpener = {
    stealthOpen() {
      const stealthURL = utils.dom.getElement('stealth-url');
      const status = utils.dom.getElement('tab-status');
      if (!stealthURL || !status) return;
      const url = stealthURL.value.trim() || window.location.href;
      try {
        const html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Stealth Opener</title>
            <style>
              html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }
              iframe { border: none; width: 100%; height: 100%; display: block; }
            </style>
          </head>
          <body>
            <iframe src="${url}"></iframe>
          </body>
          </html>
        `;
        const newWindow = window.open('about:blank', '_blank');
        if (newWindow) {
          newWindow.document.write(html);
          newWindow.document.close();
          status.textContent = 'Opened URL in stealth mode';
        } else {
          status.textContent = 'Failed to open: Pop-up blocked';
        }
      } catch (e) {
        status.textContent = 'Failed to stealth open';
      }
    }
  };
  Hypr.toolUtilities.stealthOpener = stealthOpener;
  const stealthButton = utils.dom.query('.action-button');
  if (stealthButton) stealthButton.addEventListener('click', stealthOpener.stealthOpen);
};