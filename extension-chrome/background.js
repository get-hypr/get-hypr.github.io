chrome.action.onClicked.addListener(async (tab) => {
  const scriptUrl = "https://get-hypr.github.io/hypr/hypr.latest.js";

  try {
    const response = await fetch(scriptUrl);
    const scriptText = await response.text();

    const escapedScript = scriptText
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$\{/g, "\\${");

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: "MAIN",
      func: (code) => {
        const script = document.createElement("script");
        script.textContent = code;
        document.documentElement.appendChild(script);
        script.remove();
      },
      args: [escapedScript]
    });
  } catch (e) {
    console.error("Failed to inject remote script:", e);
  }
});