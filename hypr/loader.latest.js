(function () {
  const response = fetch("https://get-hypr.github.io/hypr/hypr.latest.js").then(res => {
    if (!res.ok) {
      alert('Failed to load Hypr!');
      return;
    }
    return res.text();
  });
  response.then(scriptContent => {
    const script = document.createElement("script");
    script.textContent = scriptContent;
    document.body.appendChild(script);
  })
})()