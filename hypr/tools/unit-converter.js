export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Unit Converter</h3>
      <button id="pin-unit-converter" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Convert units for length, weight, or temperature.</p>
    <select id="unit-type" onchange="Hypr.toolUtilities.unitConverter.updateUnitOptions()" class="tool-select">
      <option value="length">Length</option>
      <option value="weight">Weight</option>
      <option value="temperature">Temperature</option>
    </select>
    <div class="input-group">
      <input id="unit-input" type="number" placeholder="Value" class="tool-input">
      <select id="unit-from" class="tool-select"></select>
    </div>
    <div class="input-group">
      <input id="unit-output" type="text" readonly class="tool-input">
      <select id="unit-to" class="tool-select"></select>
    </div>
    <button onclick="Hypr.toolUtilities.unitConverter.convertUnit()" class="action-button" data-tooltip="Convert units">Convert</button>
  </div>
`;

export const css = `
  /* Unit Converter-specific styles */
  .input-group select { min-width: 100px; }
`;

export const init = (utils) => {
  const unitConverter = {
    updateUnitOptions() {
      const type = utils.dom.getElement('unit-type')?.value;
      const fromSelect = utils.dom.getElement('unit-from');
      const toSelect = utils.dom.getElement('unit-to');
      if (!fromSelect || !toSelect) return;
      const units = {
        length: ['meters', 'kilometers', 'centimeters', 'feet', 'inches'],
        weight: ['kilograms', 'grams', 'pounds', 'ounces'],
        temperature: ['Celsius', 'Fahrenheit', 'Kelvin']
      };
      fromSelect.innerHTML = toSelect.innerHTML = units[type].map(unit => `<option value="${unit}">${unit}</option>`).join('');
    },
    convertUnit() {
      const input = utils.dom.getElement('unit-input');
      const output = utils.dom.getElement('unit-output');
      const type = utils.dom.getElement('unit-type')?.value;
      const from = utils.dom.getElement('unit-from')?.value;
      const to = utils.dom.getElement('unit-to')?.value;
      if (!input || !output || !from || !to) return;
      const value = parseFloat(input.value);
      if (isNaN(value)) {
        output.value = 'Enter a valid number';
        return;
      }
      let result;
      if (type === 'length') {
        const conversions = { meters: 1, kilometers: 0.001, centimeters: 100, feet: 3.28084, inches: 39.3701 };
        result = (value / conversions[from]) * conversions[to];
      } else if (type === 'weight') {
        const conversions = { kilograms: 1, grams: 1000, pounds: 2.20462, ounces: 35.274 };
        result = (value / conversions[from]) * conversions[to];
      } else if (type === 'temperature') {
        let celsius;
        if (from === 'Celsius') celsius = value;
        else if (from === 'Fahrenheit') celsius = (value - 32) * 5 / 9;
        else celsius = value - 273.15;
        if (to === 'Celsius') result = celsius;
        else if (to === 'Fahrenheit') result = celsius * 9 / 5 + 32;
        else result = celsius + 273.15;
      }
      output.value = result.toFixed(4);
    }
  };
  Hypr.toolUtilities.unitConverter = unitConverter;
  unitConverter.updateUnitOptions();
  const convertButton = utils.dom.query('.action-button');
  if (convertButton) convertButton.addEventListener('click', unitConverter.convertUnit);
};