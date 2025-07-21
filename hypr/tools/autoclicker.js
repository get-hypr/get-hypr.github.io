export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Autoclicker</h3>
      <button id="pin-autoclicker" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Click at your cursor using a custom CPS and hotkey.</p>

    <div class="autoclicker-options">
      <input id="cps-input" type="number" class="tool-input" placeholder="CPS (e.g. 10)" min="1" max="200" />

      <label style="margin-top: 8px;">Hotkey:</label>
      <input id="start-hotkey" class="tool-input" value="Control+E" placeholder="Press a key combo..." />

      <div class="autoclicker-status">
        <span id="autoclicker-status-text">Status: Ready</span>
      </div>
    </div>
  </div>
`;

export const css = `
  .autoclicker-options { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
  .autoclicker-status { font-size: 14px; color: #f1f5f9; margin-top: 6px; }
`;

export const init = (utils) => {
  const autoclicker = {
    interval: null,
    running: false,
    x: 0,
    y: 0,
    hotkey: null,
    modifiers: {
      ctrl: false,
      shift: false,
      alt: false
    },

    start(cps) {
      if (this.running || isNaN(cps) || cps <= 0) return;

      this.running = true;
      document.body.style.cursor = 'crosshair';

      this.interval = setInterval(() => {
        const el = document.elementFromPoint(this.x, this.y);
        if (!el) return;

        ['mousedown', 'mouseup', 'click'].forEach(type => {
          const evt = new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            clientX: this.x,
            clientY: this.y,
            button: 0
          });
          el.dispatchEvent(evt);
        });
      }, 1000 / cps);
    },

    stop() {
      if (!this.running) return;
      clearInterval(this.interval);
      this.interval = null;
      this.running = false;
      document.body.style.cursor = 'default';
    },

    toggle() {
      const cpsInput = utils.dom.getElement('ac-cps');
      const cps = parseInt(cpsInput?.value || '0');
      if (this.running) {
        this.stop();
      } else {
        this.start(cps);
      }
    },

    initListeners() {
      window.addEventListener('mousemove', (e) => {
        this.x = e.clientX;
        this.y = e.clientY;
      });

      window.addEventListener('keydown', (e) => {
        if (
          e.key.toLowerCase() === this.hotkey &&
          e.ctrlKey === this.modifiers.ctrl &&
          e.shiftKey === this.modifiers.shift &&
          e.altKey === this.modifiers.alt
        ) {
          this.toggle();
        }
      });
    },

    captureHotkeyInput(inputEl) {
      const updateDisplay = (e) => {
        e.preventDefault();

        // Escape cancels
        if (e.key === 'Escape') {
          inputEl.blur();
          return;
        }

        // Ignore modifier-only presses
        const ignoredKeys = ['Shift', 'Control', 'Alt', 'Meta'];
        if (ignoredKeys.includes(e.key)) return;

        this.hotkey = e.key.toLowerCase();
        this.modifiers.ctrl = e.ctrlKey;
        this.modifiers.shift = e.shiftKey;
        this.modifiers.alt = e.altKey;

        const mods = [
          this.modifiers.ctrl ? 'Ctrl' : '',
          this.modifiers.shift ? 'Shift' : '',
          this.modifiers.alt ? 'Alt' : ''
        ].filter(Boolean);

        inputEl.value = [...mods, e.key.toUpperCase()].join(' + ');
        inputEl.blur();
      };

      // Clear existing value when focused
      inputEl.addEventListener('focus', () => {
        inputEl.value = '';
      });

      // Handle key capture
      inputEl.addEventListener('keydown', updateDisplay);

      // Prevent mouse click from triggering blur unintentionally
      inputEl.addEventListener('mousedown', e => e.preventDefault());
    }
  };

  Hypr.toolUtilities.autoclicker = autoclicker;

  autoclicker.initListeners();

  const hotkeyInput = utils.dom.getElement('start-hotkey');
  if (hotkeyInput) {
    autoclicker.captureHotkeyInput(hotkeyInput);
  }
};
