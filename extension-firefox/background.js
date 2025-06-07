browser.browserAction.onClicked.addListener(async (tab) => {
  const scriptUrl = "https://get-hypr.github.io/hypr/hypr.latest.js";

  try {
    const response = await fetch(scriptUrl);
    const scriptText = await response.text();

    await browser.tabs.executeScript(tab.id, {
      code: scriptText
    });
  } catch (e) {
    console.error("Failed to inject remote script:", e);
  }
});