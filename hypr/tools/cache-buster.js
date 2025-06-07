export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Cache Buster</h3>
      <button id="pin-cache-buster" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Clear cache for this site or force a hard reload.</p>
    <button onclick="Hypr.toolUtilities.cacheBuster.clearCache()" class="action-button" data-tooltip="Clear cache">Clear Cache</button>
    <p id="cache-status" class="tool-description"></p>
  </div>
`;

export const css = `
  /* Cache Buster-specific styles */
`;

export const init = (utils) => {
  const cacheBuster = {
    async clearCache() {
      const status = utils.dom.getElement('cache-status');
      if (!status) return;
      try {
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
          status.textContent = 'Cache cleared successfully';
        } else {
          status.textContent = 'Cache API not supported; performing hard reload';
          window.location.reload(true);
        }
      } catch (e) {
        status.textContent = 'Failed to clear cache; try a hard reload';
      }
    }
  };
  Hypr.toolUtilities.cacheBuster = cacheBuster;
  const clearButton = utils.dom.query('.action-button');
  if (clearButton) clearButton.addEventListener('click', cacheBuster.clearCache);
};