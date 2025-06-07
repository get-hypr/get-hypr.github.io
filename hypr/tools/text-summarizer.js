export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Text Summarizer</h3>
      <button id="pin-text-summarizer" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Paste text to generate a concise summary.</p>
    <textarea id="summarizer-input" placeholder="Paste text here" rows="5" class="tool-textarea"></textarea>
    <button onclick="Hypr.toolUtilities.textSummarizer.summarizeText()" class="action-button" data-tooltip="Generate summary">Summarize</button>
    <textarea id="summarizer-output" readonly rows="3" class="tool-textarea"></textarea>
  </div>
`;

export const css = `
  /* Text Summarizer-specific styles */
  .tool-textarea { font-family: inherit; }
`;

export const init = (utils) => {
  const textSummarizer = {
    summarizeText() {
      const input = utils.dom.getElement('summarizer-input');
      const output = utils.dom.getElement('summarizer-output');
      if (!input || !output) return;
      const text = input.value.trim();
      if (!text) {
        output.value = 'Enter text to summarize';
        return;
      }
      const paragraphs = text.split('\n').filter(p => p.trim());
      const summary = paragraphs.map(p => {
        const sentence = p.split(/[.!?]/)[0].trim();
        return sentence ? sentence + '.' : '';
      }).filter(s => s).join(' ');
      output.value = summary || 'Unable to summarize';
    }
  };
  Hypr.toolUtilities.textSummarizer = textSummarizer;
  const summarizeButton = utils.dom.query('.action-button');
  if (summarizeButton) summarizeButton.addEventListener('click', textSummarizer.summarizeText);
};