const panel = document.createElement("iframe");
panel.id = 'extension-root';
panel.src = chrome.runtime.getURL("index.html");
panel.style.cssText = `
  position: fixed;
  top: 0;
  right: 0;
   width: 500px;
  height: 100vh;
  background-color: #fff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.15);
  padding: 18px 14px;
  border: none;
  z-index: 999999;
`;

document.body.appendChild(panel);

// Load React bundle
const script = document.createElement("script");
script.type = "module";
script.src = chrome.runtime.getURL("/main.js"); // or whatever your Vite output is
document.body.appendChild(script);


window.addEventListener("message", (event) => {
  if (event.data?.action === "close-extension-panel") {
    const iframe = document.getElementById("extension-root");
    if (iframe) iframe.remove();
  }
});