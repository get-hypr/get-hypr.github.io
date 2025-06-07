export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Calculator</h3>
      <button id="pin-calculator" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Enter expressions (e.g., 2 + 2, sin(30)).</p>
    <input id="calculator-input" type="text" placeholder="e.g., 2 + 2 or sin(30)" class="tool-input">
    <div class="calc-grid">
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('7')" class="calc-button">7</button>
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('8')" class="calc-button">8</button>
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('9')" class="calc-button">9</button>
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('/')" class="calc-button">/</button>
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('4')" class="calc-button">4</button>
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('5')" class="calc-button">5</button>
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('6')" class="calc-button">6</button>
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('*')" class="calc-button">×</button>
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('1')" class="calc-button">1</button>
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('2')" class="calc-button">2</button>
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('3')" class="calc-button">3</button>
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('-')" class="calc-button">-</button>
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('0')" class="calc-button">0</button>
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('.')" class="calc-button">.</button>
      <button onclick="Hypr.toolUtilities.calculator.calculate()" class="calc-button primary">=</button>
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('+')" class="calc-button">+</button>
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('sin(')" class="calc-button">sin</button>
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('cos(')" class="calc-button">cos</button>
      <button onclick="Hypr.toolUtilities.calculator.appendToCalc('tan(')" class="calc-button">tan</button>
      <button onclick="Hypr.toolUtilities.calculator.clearCalc()" class="calc-button">C</button>
    </div>
  </div>
`;

export const css = `
  /* Calculator-specific styles (optional, extends base styles) */
  .calc-grid button { font-weight: 600; }
`;

export const init = (utils) => {
  const calculator = {
    appendToCalc(value) {
      const input = utils.dom.getElement('calculator-input');
      if (input) input.value += value;
    },
    clearCalc() {
      const input = utils.dom.getElement('calculator-input');
      if (input) input.value = '';
    },
    calculate() {
      const input = utils.dom.getElement('calculator-input');
      if (input) {
        try {
          let expr = input.value.replace('×', '*');
          expr = expr.replace(/sin\((.*?)\)/g, 'Math.sin($1 * Math.PI / 180)');
          expr = expr.replace(/cos\((.*?)\)/g, 'Math.cos($1 * Math.PI / 180)');
          expr = expr.replace(/tan\((.*?)\)/g, 'Math.tan($1 * Math.PI / 180)');
          input.value = eval(expr).toFixed(4);
        } catch (e) {
          input.value = 'Error';
        }
      }
    }
  };
  Hypr.toolUtilities.calculator = calculator;
  const calcButton = utils.dom.query('.calc-button.primary');
  if (calcButton) calcButton.addEventListener('click', calculator.calculate);
};