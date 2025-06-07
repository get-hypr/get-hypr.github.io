export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Encryptor/Decryptor</h3>
      <button id="pin-encryptor" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Securely encrypt or decrypt text with a password.</p>
    <textarea id="encryptor-input" placeholder="Enter text to encrypt/decrypt" rows="4" class="tool-textarea"></textarea>
    <div class="input-group">
      <input id="encryptor-password" type="password" placeholder="Password (min 6 chars)" class="tool-input">
      <button id="toggle-password" class="toggle-button" data-tooltip="Toggle password visibility">👁️</button>
    </div>
    <div class="button-group">
      <button onclick="Hypr.toolUtilities.encryptor.encryptText()" class="action-button" data-tooltip="Encrypt text">Encrypt</button>
      <button onclick="Hypr.toolUtilities.encryptor.decryptText()" class="action-button" data-tooltip="Decrypt text">Decrypt</button>
    </div>
    <div class="output-group">
      <textarea id="encryptor-output" readonly rows="3" class="tool-textarea"></textarea>
      <button id="copy-output" class="toggle-button" data-tooltip="Copy to clipboard">📋</button>
    </div>
  </div>
`;

export const css = `
  .output-group button { min-width: 40px; }
`;

export const init = (utils) => {
  const encryptor = {
    loadEncryptor() {
      const input = utils.dom.getElement('encryptor-input');
      const output = utils.dom.getElement('encryptor-output');
      const password = utils.dom.getElement('encryptor-password');
      const toggleBtn = utils.dom.getElement('toggle-password');
      const copyBtn = utils.dom.getElement('copy-output');
      if (input && output && password && toggleBtn && copyBtn) {
        input.value = utils.localStorage.get('hypr-encryptor-input') || '';
        output.value = utils.localStorage.get('hypr-encryptor-output') || '';
        password.value = utils.localStorage.get('hypr-encryptor-password') || '';
        toggleBtn.onclick = () => {
          const isHidden = password.getAttribute('type') === 'password';
          password.setAttribute('type', isHidden ? 'text' : 'password');
          toggleBtn.setAttribute('data-tooltip', isHidden ? 'Hide password' : 'Show password');
          toggleBtn.textContent = isHidden ? '👁️‍🗨️' : '👁️';
        };
        copyBtn.onclick = async () => {
          if (!output.value) return;
          try {
            await navigator.clipboard.writeText(output.value);
            copyBtn.classList.add('copied');
            copyBtn.setAttribute('data-tooltip', 'Copied!');
            copyBtn.textContent = '✅';
            setTimeout(() => {
              copyBtn.classList.remove('copied');
              copyBtn.setAttribute('data-tooltip', 'Copy to clipboard');
              copyBtn.textContent = '📋';
            }, 1500);
          } catch (e) {
            output.value = 'Failed to copy to clipboard';
          }
        };
        input.addEventListener('input', () => utils.localStorage.set('hypr-encryptor-input', input.value));
        output.addEventListener('input', () => utils.localStorage.set('hypr-encryptor-output', output.value));
        password.addEventListener('input', () => utils.localStorage.set('hypr-encryptor-password', password.value));
      }
    },
    async deriveKey(password, salt) {
      const encoder = new TextEncoder();
      const passwordBuffer = encoder.encode(password);
      const saltBuffer = salt || crypto.getRandomValues(new Uint8Array(16));
      const keyMaterial = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, ['deriveBits', 'deriveKey']);
      const key = await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: saltBuffer, iterations: 100000, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      return { key, salt: saltBuffer };
    },
    async encryptText() {
      const input = utils.dom.getElement('encryptor-input');
      const password = utils.dom.getElement('encryptor-password');
      const output = utils.dom.getElement('encryptor-output');
      if (!input || !password || !output) return;
      const text = input.value.trim();
      const pass = password.value.trim();
      if (!text) {
        output.value = 'Enter text to encrypt';
        return;
      }
      if (pass.length < 6) {
        output.value = 'Password must be at least 6 characters';
        return;
      }
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const { key, salt } = await utils.deriveKey(pass);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
        const encryptedArray = new Uint8Array(encrypted);
        const result = { iv: Array.from(iv), salt: Array.from(salt), data: Array.from(encryptedArray) };
        output.value = btoa(JSON.stringify(result));
        utils.localStorage.set('hypr-encryptor-output', output.value);
      } catch (e) {
        output.value = 'Encryption failed: Invalid input or processing error';
      }
    },
    async decryptText() {
      const input = utils.dom.getElement('encryptor-input');
      const password = utils.dom.getElement('encryptor-password');
      const output = utils.dom.getElement('encryptor-output');
      if (!input || !password || !output) return;
      const text = input.value.trim();
      const pass = password.value.trim();
      if (!text) {
        output.value = 'Enter encrypted text to decrypt';
        return;
      }
      if (pass.length < 6) {
        output.value = 'Password must be at least 6 characters';
        return;
      }
      try {
        const encryptedObj = JSON.parse(atob(text));
        if (!encryptedObj.iv || !encryptedObj.salt || !encryptedObj.data) {
          output.value = 'Invalid encrypted text format';
          return;
        }
        const iv = new Uint8Array(encryptedObj.iv);
        const salt = new Uint8Array(encryptedObj.salt);
        const data = new Uint8Array(encryptedObj.data);
        const { key } = await this.deriveKey(pass, salt);
        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
        const decoder = new TextDecoder();
        output.value = decoder.decode(decrypted);
        utils.localStorage.set('hypr-encryptor-output', output.value);
      } catch (e) {
        output.value = 'Decryption failed: Invalid text, password, or format';
      }
    }
  };
  Hypr.toolUtilities.encryptor = encryptor;
  encryptor.loadEncryptor();
  const encryptButton = utils.dom.queryAll('.action-button')[0];
  const decryptButton = utils.dom.queryAll('.action-button')[1];
  if (encryptButton) encryptButton.addEventListener('click', encryptor.encryptText);
  if (decryptButton) decryptButton.addEventListener('click', encryptor.decryptText);
};