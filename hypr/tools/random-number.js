export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Random Number Generator</h3>
      <button id="pin-random-number" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Generate a random number within a range.</p>
    <div class="range-inputs">
      <input id="range-min" type="number" placeholder="Min" class="tool-input" style="width: 48%;">
      <input id="range-max" type="number" placeholder="Max" class="tool-input" style="width: 48%;">
    </div>
    <div class="random-result">
      <span id="random-output">Result: -</span>
    </div>
    <button onclick="Hypr.toolUtilities.randomNumber.generate()" class="random-button primary">Generate</button>
  </div>
`;

export const css = `
  .range-inputs { display: flex; gap: 8px; margin: 10px 0; }
  .random-result { margin: 12px 0; font-size: 18px; color: #f1f5f9; }
  .random-button { padding: 10px; background-color: #334155; color: #f1f5f9; border: 1px solid #475569; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background-color 0.2s, border-color 0.2s, transform 0.2s; }
  .random-button:hover { background-color: #475569; border-color: #ff1a1a; transform: scale(1.05); }
  .random-button.primary { background-color: #ff1a1a; border-color: #ff1a1a; }
  .random-button.primary:hover { background-color: #e01414; border-color: #e01414; transform: scale(1.05); }
`;

export const init = (utils) => {
  const randomNumber = {
    generate() {
      const minInput = utils.dom.getElement('range-min');
      const maxInput = utils.dom.getElement('range-max');
      const output = utils.dom.getElement('random-output');
      if (!minInput || !maxInput || !output) return;

      const min = parseInt(minInput.value);
      const max = parseInt(maxInput.value);
      if (isNaN(min) || isNaN(max)) {
        output.textContent = 'Result: Invalid range';
        return;
      }
      if (min >= max) {
        output.textContent = 'Result: Min must be less than Max';
        return;
      }

      const result = Math.floor(Math.random() * (max - min + 1)) + min;
      output.textContent = `Result: ${result}`;
    }
  };

  Hypr.toolUtilities.randomNumber = randomNumber;

  const generateButton = utils.dom.query('.random-button.primary');
  if (generateButton) generateButton.addEventListener('click', randomNumber.generate);
};