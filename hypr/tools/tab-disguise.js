export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Tab Disguise</h3>
      <button id="pin-tab-disguise" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Make the page look like Google Drive.</p>
    <button onclick="Hypr.toolUtilities.tabDisguise.disguiseTab()" class="action-button" data-tooltip="Disguise tab">Disguise Tab</button>
  </div>
`;

export const css = `
  /* Tab Disguise-specific styles */
`;

export const init = (utils) => {
  const tabDisguise = {
    disguiseTab() {
      try {
        document.title = 'Google Drive';
        const links = utils.dom.queryAll("link[rel~='icon']");
        links.forEach(link => link.remove());
        const newFavicon = document.createElement('link');
        newFavicon.rel = 'icon';
        newFavicon.href = 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png';
        document.head.appendChild(newFavicon);
      } catch (e) {
        const status = utils.dom.getElement('tab-status');
        if (status) status.textContent = 'Failed to disguise tab';
      }
    }
  };
  Hypr.toolUtilities.tabDisguise = tabDisguise;
  const disguiseButton = utils.dom.query('.action-button');
  if (disguiseButton) disguiseButton.addEventListener('click', tabDisguise.disguiseTab);
};