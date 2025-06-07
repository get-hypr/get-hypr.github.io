export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Formula Reference</h3>
      <button id="pin-formula-reference" class="pin-button" data-tooltip="Pin to sidebar">📌</button>
    </div>
    <p class="tool-description">Common formulas for math and science.</p>
    <select id="formula-category" onchange="Hypr.toolUtilities.formulaReference.updateFormulas()" class="tool-select">
      <option value="math">Math</option>
      <option value="physics">Physics</option>
      <option value="geometry">Geometry</option>
    </select>
    <div id="formula-list" class="formula-list"></div>
  </div>
`;

export const css = `
  .formula-list p { padding: 4px; border-left: 2px solid #ff1a1a; font-size: 14px; color: #f1f5f9; margin: 8px 0; }
`;

export const init = (utils) => {
  const formulaReference = {
    updateFormulas() {
      const category = utils.dom.getElement('formula-category')?.value;
      const list = utils.dom.getElement('formula-list');
      if (!list) return;
      const formulas = {
        math: ['Quadratic Formula: x = (-b ± √(b²-4ac)) / (2a)', 'Pythagorean Theorem: a² + b² = c²', 'Slope: m = (y₂ - y₁) / (x₂ - x₁)'],
        physics: ['Force: F = m * a', 'Kinetic Energy: KE = (1/2) * m * v²', 'Ohm\'s Law: V = I * R'],
        geometry: ['Area of Circle: A = π * r²', 'Volume of Sphere: V = (4/3) * π * r³', 'Area of Triangle: A = (1/2) * b * h']
      };
      list.innerHTML = formulas[category].map(formula => `<p>${formula}</p>`).join('');
    }
  };
  Hypr.toolUtilities.formulaReference = formulaReference;
  formulaReference.updateFormulas();
};