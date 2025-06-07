export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Cookie Cleaner</h3>
      <button id="pin-cookie-cleaner" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Delete all cookies for this domain (may log you out).</p>
    <button onclick="Hypr.toolUtilities.cookieCleaner.clearCookies()" class="action-button" data-tooltip="Clear cookies">Clear Cookies</button>
    <p id="cookie-status" class="tool-description"></p>
  </div>
`;

export const css = `
  /* Cookie Cleaner-specific styles */
`;

export const init = (utils) => {
  const cookieCleaner = {
    clearCookies() {
      const status = utils.dom.getElement('cookie-status');
      if (!status) return;
      if (!confirm('This will delete all cookies for this domain and may log you out. Continue?')) {
        status.textContent = 'Operation cancelled';
        return;
      }
      try {
        document.cookie.split(';').forEach(cookie => {
          const name = cookie.split('=')[0].trim();
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
        status.textContent = 'Cookies cleared successfully';
      } catch (e) {
        status.textContent = 'Failed to clear cookies';
      }
    }
  };
  Hypr.toolUtilities.cookieCleaner = cookieCleaner;
  const clearButton = utils.dom.query('.action-button');
  if (clearButton) clearButton.addEventListener('click', cookieCleaner.clearCookies);
};