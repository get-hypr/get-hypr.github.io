/**
 * Hypr Application - Modular and Extensible with External Tool Loading
 * A self-contained utility toolkit that loads tools from external JS files
 */

// Core Hypr Module (Singleton)
const Hypr = (() => {
  // Private state and configuration
  const config = {
    protectedSites: [
      'proplayer919.dev',
      'rainycards.com',
      'economix.lol',
      'proplayer919.github.io',
      'proplayer929.github.io'
    ],
    maxPinnedTools: 5,
    maxRecentTools: 5,
    toolsPerPage: 5,
    windowStyles: {
      position: 'fixed',
      top: '100px',
      left: '100px',
      width: '650px',
      minHeight: '450px',
      backgroundColor: '#0f172a',
      border: '2px solid #ff1a1a',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      resize: 'both',
      overflow: 'hidden',
      zIndex: '1000',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: '#f1f5f9',
      transition: 'transform 0.2s ease'
    },
    toolBaseUrl: 'https://get-hypr.github.io/hypr/tools/'
  };

  // State management
  let state = {
    pinnedTools: JSON.parse(localStorage.getItem('hypr-pinned')) || [],
    recentTools: JSON.parse(localStorage.getItem('hypr-recent')) || [],
    currentPage: 1,
    isDragging: false,
    currentX: 100,
    currentY: 100,
    initialX: 0,
    initialY: 0
  };

  // DOM elements
  const elements = {
    windowEl: null,
    header: null,
    content: null,
    sidebar: null,
    mainContent: null
  };

  // Utility: Parse URL
  const parseURL = (url) => {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      const hostname = parsed.hostname.replace(/^www\./, '').toLowerCase();
      const pathname = parsed.pathname.replace(/\/+$/, '');
      return { hostname, pathname };
    } catch {
      return null;
    }
  };

  // Utility: Check if current site is protected
  const isCurrentSiteProtected = (siteList) => {
    const { hostname: currentHost, pathname: currentPath } = parseURL(window.location.href);
    return siteList.some(entry => {
      const [rawHost, ...pathParts] = entry.split('/');
      const pathPattern = pathParts.join('/');
      let hostRegex = rawHost
        .replace(/^www\./, '')
        .replace(/\./g, '\\.')
        .replace(/^\*\./, '([a-z0-9-]+\\.)*');
      let pathRegex = pathPattern ? pathPattern.replace(/\*/g, '.*') : '';
      const fullRegex = new RegExp(`^${hostRegex}${pathRegex ? '/' + pathRegex : ''}$`, 'i');
      return fullRegex.test(`${currentHost}${currentPath}`);
    });
  };

  // Tool Registry
  const toolRegistry = {
    tools: [],
    async registerTool(toolConfig) {
      if (!toolConfig.id || !toolConfig.name || !toolConfig.description || !toolConfig.scriptUrl) {
        console.error('Tool registration failed: Missing required properties (id, name, description, scriptUrl)');
        return;
      }
      try {
        const module = await import(toolConfig.scriptUrl);
        const tool = {
          id: toolConfig.id,
          name: toolConfig.name,
          description: toolConfig.description,
          content: module.html,
          init: module.init || (() => { }),
          styles: module.css || ''
        };
        this.tools.push(tool);
        if (tool.styles) {
          const styleEl = document.createElement('style');
          styleEl.textContent = tool.styles;
          document.head.appendChild(styleEl);
        }
      } catch (e) {
        console.error(`Failed to load tool ${toolConfig.id} from ${toolConfig.scriptUrl}:`, e);
      }
    },
    getTool(id) {
      return this.tools.find(t => t.id === id);
    }
  };

  // DOM Manager
  const domManager = {
    createElement(tag, styles, attributes = {}) {
      const el = document.createElement(tag);
      Object.assign(el.style, styles);
      Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));
      return el;
    },
    initUI() {
      elements.windowEl = this.createElement('div', config.windowStyles, { id: 'hypr-window' });
      elements.header = this.createElement('div', {
        background: '#1e293b',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'move',
        borderRadius: '12px 12px 0 0',
        userSelect: 'none',
        borderBottom: '1px solid #ff1a1a'
      });
      const logo = this.createElement('img', {
        width: '24px',
        height: '24px',
        marginRight: '8px',
        borderRadius: '4px'
      }, { src: 'https://get-hypr.github.io/brand/logo.png' });
      const title = this.createElement('span', {
        fontSize: '16px',
        fontWeight: '700',
        color: '#f1f5f9'
      });
      title.textContent = 'Hypr';
      const buttonContainer = this.createElement('div', {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        marginLeft: 'auto'
      });
      const minimizeBtn = this.createElement('button', {
        background: 'none',
        border: '1px solid #ff1a1a',
        color: '#ff1a1a',
        fontSize: '14px',
        cursor: 'pointer',
        padding: '4px 10px',
        borderRadius: '6px',
        transition: 'background-color 0.2s, color 0.2s, transform 0.2s'
      }, { 'data-tooltip': 'Minimize' });
      minimizeBtn.innerHTML = '—';
      minimizeBtn.onmouseover = () => minimizeBtn.style.transform = 'scale(1.1)';
      minimizeBtn.onmouseout = () => minimizeBtn.style.transform = 'scale(1)';
      const closeBtn = this.createElement('button', {
        background: 'none',
        border: '1px solid #ff1a1a',
        color: '#ff1a1a',
        fontSize: '14px',
        cursor: 'pointer',
        padding: '4px 10px',
        borderRadius: '6px',
        transition: 'background-color 0.2s, color 0.2s, transform 0.2s'
      }, { 'data-tooltip': 'Close' });
      closeBtn.innerHTML = '✕';
      closeBtn.onmouseover = () => closeBtn.style.transform = 'scale(1.1)';
      closeBtn.onmouseout = () => closeBtn.style.transform = 'scale(1)';
      elements.content = this.createElement('div', {
        display: 'flex',
        height: 'calc(100% - 50px)'
      });
      elements.sidebar = this.createElement('div', {
        width: '180px',
        backgroundColor: '#1e293b',
        padding: '16px',
        borderRight: '1px solid #ff1a1a',
        overflowY: 'auto'
      }, { class: 'sidebar' });
      elements.mainContent = this.createElement('div', {
        flex: '1',
        padding: '16px',
        overflowY: 'auto',
        backgroundColor: '#0f172a'
      });

      buttonContainer.append(minimizeBtn, closeBtn);
      elements.header.append(logo, title, buttonContainer);
      elements.content.append(elements.sidebar, elements.mainContent);
      elements.windowEl.append(elements.header, elements.content);
      document.body.appendChild(elements.windowEl);

      this.setupEventListeners(minimizeBtn, closeBtn);
    },
    setupEventListeners(minimizeBtn, closeBtn) {
      elements.header.addEventListener('mousedown', e => {
        state.initialX = e.clientX - state.currentX;
        state.initialY = e.clientY - state.currentY;
        state.isDragging = true;
      });
      document.addEventListener('mousemove', e => {
        if (state.isDragging) {
          e.preventDefault();
          state.currentX = e.clientX - state.initialX;
          state.currentY = e.clientY - state.initialY;
          elements.windowEl.style.left = state.currentX + 'px';
          elements.windowEl.style.top = state.currentY + 'px';
        }
      });
      document.addEventListener('mouseup', () => state.isDragging = false);
      minimizeBtn.addEventListener('click', () => {
        elements.windowEl.classList.toggle('minimized');
        elements.content.style.display = elements.windowEl.classList.contains('minimized') ? 'none' : 'flex';
        minimizeBtn.innerHTML = elements.windowEl.classList.contains('minimized') ? '+' : '—';
      });
      closeBtn.addEventListener('click', () => elements.windowEl.style.display = 'none');
      document.addEventListener('keydown', e => {
        if (e.key.toLowerCase() === 'h' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
          elements.windowEl.style.display = elements.windowEl.style.display === 'none' ? 'block' : 'none';
        }
      });
    },
    injectStyles() {
      const styleEl = document.createElement('style');
      styleEl.textContent = `
        #hypr-window * { box-sizing: border-box; }
        #hypr-window.minimized { transform: scale(0.95); opacity: 0.9; }
        #hypr-window button:focus, #hypr-window input:focus, #hypr-window textarea:focus, #hypr-window select:focus {
          outline: 2px solid #ff1a1a; outline-offset: 2px;
        }
        #hypr-window .sidebar button { width: 100%; padding: 10px 14px; margin-bottom: 8px; background-color: #334155; color: #f1f5f9; border: 1px solid #475569; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background-color 0.2s, border-color 0.2s, transform 0.2s; position: relative; }
        #hypr-window .sidebar button:hover { background-color: #ff1a1a; border-color: #ff1a1a; transform: translateX(4px); }
        #hypr-window .sidebar h4 { font-size: 13px; font-weight: 600; color: #94a3b8; margin: 12px 0 8px; text-transform: uppercase; letter-spacing: 0.8px; }
        #hypr-window .tool-card { background-color: #1e293b; padding: 16px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); transition: transform 0.2s; }
        #hypr-window .tool-card:hover { transform: translateY(-2px); }
        #hypr-window .tool-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        #hypr-window .tool-title, #hypr-window .header-title { font-size: 18px; font-weight: 700; color: #f1f5f9; }
        #hypr-window .pin-button { background: none; border: none; color: #94a3b8; font-size: 16px; cursor: pointer; padding: 4px; transition: color 0.2s, transform 0.2s; position: relative; }
        #hypr-window .pin-button:hover { color: #ff1a1a; transform: scale(1.15); }
        #hypr-window .tool-description { font-size: 13px; color: #94a3b8; margin-bottom: 12px; }
        #hypr-window .tool-input, #hypr-window .tool-textarea, #hypr-window .tool-select { width: 100%; padding: 10px 14px; margin-bottom: 12px; background-color: #334155; border: 1px solid #475569; border-radius: 8px; color: #f1f5f9; font-size: 14px; transition: border-color 0.2s, box-shadow 0.2s; }
        #hypr-window .tool-input:hover, #hypr-window .tool-textarea:hover, #hypr-window .tool-select:hover { border-color: #ff1a1a; box-shadow: 0 0 5px rgba(255, 26, 26, 0.3); }
        #hypr-window .tool-textarea { resize: vertical; min-height: 80px; }
        #hypr-window .calc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px; }
        #hypr-window .calc-button { padding: 10px; background-color: #334155; color: #f1f5f9; border: 1px solid #475569; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background-color 0.2s, border-color 0.2s, transform 0.2s; position: relative; }
        #hypr-window .calc-button:hover { background-color: #475569; border-color: #ff1a1a; transform: scale(1.05); }
        #hypr-window .calc-button.primary { background-color: #ff1a1a; border-color: #ff1a1a; }
        #hypr-window .calc-button.primary:hover { background-color: #e01414; border-color: #e01414; transform: scale(1.05); }
        #hypr-window .action-button { width: 100%; padding: 10px 14px; background-color: #ff1a1a; color: #f1f5f9; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: background-color 0.2s, transform 0.2s; position: relative; }
        #hypr-window .action-button:hover { background-color: #e01414; transform: scale(1.03); }
        #hypr-window .toggle-button { padding: 10px; background-color: #334155; color: #f1f5f9; border: 1px solid #475569; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background-color 0.2s, border-color 0.2s, transform 0.2s; position: relative; }
        #hypr-window .toggle-button:hover { background-color: #475569; border-color: #ff1a1a; transform: scale(1.05); }
        #hypr-window .toggle-button.copied { background-color: #22c55e; border-color: #22c55e; }
        #hypr-window .button-group { display: flex; gap: 8px; margin-bottom: 12px; }
        #hypr-window .button-group .action-button { flex: 1; }
        #hypr-window .input-group { display: flex; gap: 8px; margin-bottom: 12px; align-items: center; }
        #hypr-window .input-group .tool-input, #hypr-window .input-group .tool-select { flex: 1; }
        #hypr-window .output-group { display: flex; gap: 8px; margin-bottom: 12px; align-items: flex-start; }
        #hypr-window .output-group .tool-textarea { flex: 1; }
        #hypr-window .formula-list p { font-size: 14px; color: #f1f5f9; margin: 8px 0; }
        #hypr-window .recent-tools button, #hypr-window .search-results button:not(.pin-button), #hypr-window .browse-tools button { width: 100%; padding: 10px 14px; background-color: #334155; color: #f1f5f9; border: 1px solid #475569; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background-color 0.2s, border-color 0.2s, transform 0.2s; }
        #hypr-window .recent-tools button:hover, #hypr-window .search-results button:not(.pin-button):hover, #hypr-window .browse-tools button:hover { background-color: #ff1a1a; border-color: #ff1a1a; transform: scale(1.03); }
        #hypr-window .search-results > div { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        #hypr-window .pagination { display: flex; gap: 8px; justify-content: center; align-items: center; margin-top: 12px; }
        #hypr-window .pagination button { padding: 8px 12px; background-color: #334155; color: #f1f5f9; border: 1px solid #475569; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background-color 0.2s, border-color 0.2s, transform 0.2s; }
        #hypr-window .pagination button:hover { background-color: #ff1a1a; border-color: #ff1a1a; transform: scale(1.05); }
        #hypr-window .pagination button:disabled { background-color: #1e293b; border-color: #334155; color: #64748b; cursor: not-allowed; transform: none; }
        #hypr-window .pagination span { font-size: 14px; color: #94a3b8; }
        #hypr-window [data-tooltip] { position: relative; }
        #hypr-window [data-tooltip]::after { content: attr(data-tooltip); position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%) translateY(-8px); background-color: #1e293b; color: #f1f5f9; padding: 6px 10px; border-radius: 6px; font-size: 13px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s, transform 0.2s; z-index: 10; border: 1px solid #ff1a1a; }
        #hypr-window [data-tooltip]:hover::after { opacity: 1; transform: translateX(-50%) translateY(-14px); }
      `;
      document.head.appendChild(styleEl);
    }
  };

  // View Manager
  const viewManager = {
    updateSidebar() {
      elements.sidebar.innerHTML = '';
      const buttons = [
        { name: 'Home', action: this.showHome },
        { name: 'Search', action: this.showSearch },
        { name: 'Browse', action: this.showBrowse }
      ];
      buttons.forEach(({ name, action }) => {
        const button = domManager.createElement('button', {}, { 'data-tooltip': name });
        button.textContent = name;
        button.onclick = action.bind(this);
        elements.sidebar.appendChild(button);
      });

      if (state.pinnedTools.length > 0) {
        const pinnedSection = document.createElement('div');
        pinnedSection.innerHTML = '<h4>Pinned</h4>';
        state.pinnedTools.forEach(toolId => {
          const tool = toolRegistry.getTool(toolId);
          if (tool) {
            const button = domManager.createElement('button', {}, { 'data-tooltip': tool.name });
            button.textContent = tool.name;
            button.onclick = () => this.loadTool(toolId);
            pinnedSection.appendChild(button);
          }
        });
        elements.sidebar.appendChild(pinnedSection);
      }
    },
    showHome() {
      elements.mainContent.innerHTML = `
        <div class="tool-card">
          <h3 class="header-title">Recently Used</h3>
          <div id="home-tools" class="recent-tools"></div>
        </div>
      `;
      const homeContainer = document.getElementById('home-tools');
      if (state.recentTools.length === 0) {
        homeContainer.innerHTML = '<p class="tool-description">No recent tools yet.</p>';
      } else {
        state.recentTools.slice(0, 3).forEach(toolId => {
          const tool = toolRegistry.getTool(toolId);
          if (tool) {
            const button = domManager.createElement('button', {}, { 'data-tooltip': tool.name });
            button.textContent = tool.name;
            button.onclick = () => this.loadTool(toolId);
            homeContainer.appendChild(button);
          }
        });
      }
    },
    showSearch() {
      elements.mainContent.innerHTML = `
        <div class="tool-card">
          <h3 class="header-title">Search Tools</h3>
          <input id="search-input" type="text" placeholder="Search tools..." class="tool-input">
          <div id="search-results" class="search-results"></div>
        </div>
      `;
      const searchInput = document.getElementById('search-input');
      searchInput.focus();
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const results = toolRegistry.tools.filter(t => t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query));
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '';
        if (query && results.length === 0) {
          resultsContainer.innerHTML = '<p class="tool-description">No tools found.</p>';
        } else {
          results.forEach(tool => {
            const result = document.createElement('div');
            result.innerHTML = `
              <button data-tooltip="${tool.name}">${tool.name}</button>
              <button id="data-${tool.id}" class="pin-button" data-tooltip="${state.pinnedTools.includes(tool.id) ? 'Unpin' : 'Pin'} to sidebar">${state.pinnedTools.includes(tool.id) ? '📍' : '📌'}</button>
            `;
            result.children[0].onclick = () => this.loadTool(tool.id);
            result.children[1].onclick = () => toolManager.pinTool(tool.id);
            resultsContainer.appendChild(result);
          });
        }
      });
    },
    showBrowse() {
      elements.mainContent.innerHTML = `
        <div class="tool-card">
          <h3 class="header-title">Browse Tools</h3>
          <div id="browse-tools" class="browse-tools"></div>
          <div id="pagination" class="pagination"></div>
        </div>
      `;
      const browseContainer = document.getElementById('browse-tools');
      const paginationContainer = document.getElementById('pagination');
      const totalPages = Math.ceil(toolRegistry.tools.length / config.toolsPerPage);

      const updateBrowsePage = () => {
        browseContainer.innerHTML = '';
        const start = (state.currentPage - 1) * config.toolsPerPage;
        const end = start + config.toolsPerPage;
        const paginatedTools = toolRegistry.tools.slice(start, end);
        paginatedTools.forEach(tool => {
          const button = domManager.createElement('button', {}, { 'data-tooltip': tool.description });
          button.textContent = tool.name;
          button.onclick = () => this.loadTool(tool.id);
          browseContainer.appendChild(button);
        });

        paginationContainer.innerHTML = '';
        const prevButton = domManager.createElement('button', {});
        prevButton.textContent = 'Prev';
        prevButton.disabled = state.currentPage === 1;
        prevButton.onclick = () => {
          if (state.currentPage > 1) {
            state.currentPage--;
            updateBrowsePage();
          }
        };
        const nextButton = domManager.createElement('button', {});
        nextButton.textContent = 'Next';
        nextButton.disabled = state.currentPage === totalPages;
        nextButton.onclick = () => {
          if (state.currentPage < totalPages) {
            state.currentPage++;
            updateBrowsePage();
          }
        };
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Page ${state.currentPage} of ${totalPages}`;
        paginationContainer.append(prevButton, pageInfo, nextButton);
      };
      updateBrowsePage();
    },
    loadTool(toolId) {
      const tool = toolRegistry.getTool(toolId);
      if (tool) {
        elements.mainContent.innerHTML = tool.content;
        const pinButton = document.getElementById(`pin-${tool.id}`);
        if (pinButton) {
          pinButton.innerHTML = state.pinnedTools.includes(tool.id) ? '📍' : '📌';
          pinButton.setAttribute('data-tooltip', state.pinnedTools.includes(tool.id) ? 'Unpin' : 'Pin to sidebar');
          pinButton.onclick = () => toolManager.pinTool(tool.id);
        }
        state.recentTools = [toolId, ...state.recentTools.filter(id => id !== toolId)].slice(0, config.maxRecentTools);
        localStorage.setItem('hypr-recent', JSON.stringify(state.recentTools));
        if (tool.init) tool.init(Hypr.toolUtilities);
      }
    }
  };

  // Tool Manager
  const toolManager = {
    pinTool(toolId) {
      if (state.pinnedTools.includes(toolId)) {
        state.pinnedTools = state.pinnedTools.filter(id => id !== toolId);
      } else if (state.pinnedTools.length < config.maxPinnedTools) {
        state.pinnedTools.push(toolId);
      } else {
        alert('Maximum 5 pinned tools. Unpin one to add another.');
        return;
      }
      localStorage.setItem('hypr-pinned', JSON.stringify(state.pinnedTools));
      viewManager.updateSidebar();
      const currentTool = toolRegistry.tools.find(t => elements.mainContent.innerHTML.includes(`pin-${t.id}`));
      if (currentTool) viewManager.loadTool(currentTool.id);
      else if (elements.mainContent.innerHTML.includes('Recently Used')) viewManager.showHome();
      else if (elements.mainContent.innerHTML.includes('Search Tools')) viewManager.showSearch();
      else if (elements.mainContent.innerHTML.includes('Browse Tools')) viewManager.showBrowse();
    }
  };

  // Base Tool Utilities (Available to external tools)
  const toolUtilities = {
    localStorage: {
      get: (key) => localStorage.getItem(key),
      set: (key, value) => localStorage.setItem(key, value),
      remove: (key) => localStorage.removeItem(key)
    },
    dom: {
      getElement: (id) => document.getElementById(id),
      query: (selector) => document.querySelector(selector),
      queryAll: (selector) => document.querySelectorAll(selector)
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
    }
  };

  // Register default tools (pointing to external scripts)
  const registerDefaultTools = async () => {
    const toolConfigs = [
      { id: 'calculator', name: 'Calculator', description: 'Perform arithmetic and scientific calculations.', scriptUrl: `${config.toolBaseUrl}calculator.js` },
      { id: 'unit-converter', name: 'Unit Converter', description: 'Convert between common units (length, weight, temperature).', scriptUrl: `${config.toolBaseUrl}unit-converter.js` },
      { id: 'text-summarizer', name: 'Text Summarizer', description: 'Summarize text for quick study notes.', scriptUrl: `${config.toolBaseUrl}text-summarizer.js` },
      { id: 'formula-reference', name: 'Formula Reference', description: 'Quick reference for common formulas.', scriptUrl: `${config.toolBaseUrl}formula-reference.js` },
      { id: 'note-taker', name: 'Note Taker', description: 'Take and save quick notes.', scriptUrl: `${config.toolBaseUrl}note-taker.js` },
      { id: 'cheat-sheet', name: 'Cheat Sheet', description: 'Store quick reference text discreetly.', scriptUrl: `${config.toolBaseUrl}cheat-sheet.js` },
      { id: 'encryptor', name: 'Encryptor/Decryptor', description: 'Encrypt or decrypt text using a password.', scriptUrl: `${config.toolBaseUrl}encryptor.js` },
      { id: 'history-flooder', name: 'History Flooder', description: 'Flood browser history with the current page.', scriptUrl: `${config.toolBaseUrl}history-flooder.js` },
      { id: 'tab-disguise', name: 'Tab Disguise', description: 'Make the page look like Google Drive.', scriptUrl: `${config.toolBaseUrl}tab-disguise.js` },
      { id: 'tab-opener', name: 'Tab Opener', description: 'Open multiple tabs of a URL.', scriptUrl: `${config.toolBaseUrl}tab-opener.js` },
      { id: 'stealth-opener', name: 'Stealth Opener', description: 'Open a URL without adding it to your history.', scriptUrl: `${config.toolBaseUrl}stealth-opener.js` },
      { id: 'cookie-cleaner', name: 'Cookie Cleaner', description: 'Clear all cookies for the current domain.', scriptUrl: `${config.toolBaseUrl}cookie-cleaner.js` },
      { id: 'cache-buster', name: 'Cache Buster', description: 'Clear browser cache for the current site.', scriptUrl: `${config.toolBaseUrl}cache-buster.js` }
    ];
    for (const toolConfig of toolConfigs) {
      await toolRegistry.registerTool(toolConfig);
    }
  };

  // Public API
  return {
    async init() {
      if (isCurrentSiteProtected(config.protectedSites)) {
        alert("This site is protected with Hypr Protect. Get Hypr Protect to stop Hypr from being used on your site.");
        return;
      }
      domManager.injectStyles();
      domManager.initUI();
      await registerDefaultTools();
      viewManager.updateSidebar();
      viewManager.showHome();
    },
    registerTool: toolRegistry.registerTool.bind(toolRegistry),
    toolUtilities
  };
})();

// Initialize Hypr
Hypr.init();