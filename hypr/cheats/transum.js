export const html = `
  <div class="tool-card">
    <div class="tool-header">
      <h3 class="tool-title">Transum Cheat</h3>
    </div>
    <p class="tool-description">Easily brute force Transum questions.</p>
    <div class="input-group">
      <input id="decimal-accuracy" type="number" min="0" max="5" placeholder="Max Decimal Accuracy (0 decimals - 5 decimals)" class="tool-input">
    </div>
    <button onclick="Hypr.cheatUtilities.transum.execute()" class="action-button">Execute</button>
  </div>
`;

export const css = `
  /* None */
`;

export const init = (utils) => {
    const transum = {
        async execute() {
            async function solveAllAnswers(maxDecAcc) {
                function delay(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }

                function triggerEvaluation() {
                    if (typeof checkAnswers === "function") checkAnswers();
                    else if (typeof RemoveSpaces === "function") RemoveSpaces();
                    else {
                        let btn = document.querySelector("#Checkbutton");
                        if (btn) btn.click();
                    }
                }

                function generateCandidates(intDigits, decAcc) {
                    const result = [];
                    const scale = Math.pow(10, decAcc);
                    const limit = Math.pow(10, intDigits) * scale;
                    for (let i = 0; i < limit; i++) {
                        result.push((i / scale).toFixed(decAcc));
                    }
                    return result;
                }

                function parseLatexToMath(expr) {
                    return expr.replace(/\$\$/g, "")
                        .replace(/\$/g, "")
                        .replace(/\\\(|\\\)/g, "")
                        .replace(/\\left|\\right/g, "")
                        .replace(/=/g, "")
                        .replace(/\\cdot|\\times/g, "*")
                        .replace(/\\div|\u00F7/g, "/")
                        .replace(/(\d)\s*x\s*(\d)/gi, "$1*$2")
                        .replace(/(\d+|\))\s*\^\s*\{?([\d\.]+)\}?/g, "$1**$2")
                        .replace(/\\frac\s*\{([^}]+)\}\s*\{([^}]+)\}/g, "($1)/($2)")
                        .replace(/\\sqrt\s*\{([^}]+)\}/g, "Math.sqrt($1)")
                        .replace(/\\[a-zA-Z]+/g, "")
                        .trim();
                }

                function getEquationText(input) {
                    if (input.previousElementSibling) return input.previousElementSibling.textContent.trim();
                    if (input.previousSibling && input.previousSibling.nodeType === Node.TEXT_NODE) return input.previousSibling.textContent.trim();
                    return Array.from(input.parentNode.childNodes)
                        .filter(n => n !== input && n.nodeType === Node.TEXT_NODE)
                        .map(n => n.textContent)
                        .join(" ")
                        .trim();
                }

                const inputs = Array.from(document.querySelectorAll(".Answer_box"))
                    .filter(el => el.offsetParent !== null && window.getComputedStyle(el).visibility !== "hidden");

                for (const input of inputs) {
                    const questionText = getEquationText(input);
                    let solved = false;

                    if (questionText) {
                        const mathExpr = parseLatexToMath(questionText);
                        try {
                            const answer = window.math ? window.math.evaluate(mathExpr) : eval(mathExpr);
                            input.value = answer;
                            triggerEvaluation();
                            await delay(200);
                            const tick = input.parentElement.querySelector(".tick");
                            if (tick && getComputedStyle(tick).display !== "none") {
                                solved = true;
                                continue;
                            }
                        } catch (err) {
                            console.warn("Eval failed:", err);
                        }
                    }

                    if (!solved) {
                        let intDigits = 1;
                        while (!solved && intDigits < 10) {
                            for (let decAcc = 0; decAcc <= maxDecAcc && !solved; decAcc++) {
                                const candidates = generateCandidates(intDigits, decAcc);
                                for (const candidate of candidates) {
                                    input.value = candidate;
                                    triggerEvaluation();
                                    await delay(5);
                                    const tick = input.parentElement.querySelector(".tick");
                                    if (tick && getComputedStyle(tick).display !== "none") {
                                        solved = true;
                                        break;
                                    }
                                }
                            }
                            intDigits++;
                        }
                    }
                }

                console.log("Answer solving complete.");
            }

            const accuracyInput = document.getElementById('decimal-accuracy');
            await solveAllAnswers(Number(accuracyInput.value));
        }
    };
    Hypr.cheatUtilities.transum = transum;
};