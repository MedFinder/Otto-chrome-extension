window.addEventListener("load", () => {
  // chrome.storage.local.get("showFloatingButton", (result) => {
  const container = document.createElement("iframe");
  container.id = "float-icon-root";
  container.src = chrome.runtime.getURL("index.html");
  container.style.cssText = `
  position: fixed;
  top: 45%;
  right: 10px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  z-index: 999999;
  border: 1px solid rgba(133, 80, 255, 1);
`;

  document.body.appendChild(container);
});

const attachClickListeners = () => {
  const todoItems = document.querySelectorAll(`[data-testid="task-list-item"]`);

  todoItems.forEach((item) => {
    // Prevent adding duplicate listeners
    if (!item.dataset.listenerAttached) {
      // Double-click event
      item.addEventListener("dblclick", () => {
        openSidePanel();
      });

      // Right-click event (context menu)
      item.addEventListener("contextmenu", (e) => {
        e.preventDefault(); // prevent default context menu if you want
        openSidePanel();
      });

      item.dataset.listenerAttached = "true";
    }
  });
};

const observer = new MutationObserver(() => {
  attachClickListeners();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

const openSidePanel = () => {
  if (!document.getElementById("extension-root")) {
    const panel = document.createElement("iframe");
    panel.id = "extension-root";
    panel.src = chrome.runtime.getURL("index.html") + "?view=panel";
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
  }
};

const showFloatIconUI = () => {
  if (!document.getElementById("float-icon-root")) {
    const container = document.createElement("iframe");
    container.id = "float-icon-root";
    container.src = chrome.runtime.getURL("index.html") + "?view=float-icon";
    container.style.cssText = `
        position: fixed;
        top: 45%;
        right: 10px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        z-index: 999999;
        border: 1px solid rgba(133, 80, 255, 1);
      `;

    document.body.appendChild(container);
  }
};

window.addEventListener("message", (event) => {
  if (event.data?.action === "close-float-icon") {
    const iframe = document.getElementById("float-icon-root");
    if (iframe) {
      iframe.remove();

      openSidePanel();
    }
  }

  if (event.data?.action === "close-extension-panel") {
    const iframe = document.getElementById("extension-root");
    if (iframe) {
      iframe.remove();
      showFloatIconUI();
    }
  }
});
