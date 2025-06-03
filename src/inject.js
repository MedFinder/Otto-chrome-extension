const styleHref = chrome.runtime.getURL("inject.css");
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = styleHref;
document.head.appendChild(link);

const openSidePanel = () => {
  if (!document.getElementById("extension-root")) {
    const panel = document.createElement("iframe");
    panel.sandbox = "allow-scripts allow-same-origin";
    panel.id = "extension-root";
    panel.className = "otto-side-panel";
    panel.src = chrome.runtime.getURL("index.html") + "?view=panel";

    document.body.appendChild(panel);
  }
};

const showFloatIconUI = () => {
  if (!document.getElementById("float-icon-root")) {
    const container = document.createElement("iframe");
    container.sandbox = "allow-scripts allow-same-origin";
    container.id = "float-icon-root";
    container.className = "otto-float-icon";
    container.src = chrome.runtime.getURL("index.html") + "?view=float-icon";

    document.body.appendChild(container);
  }
};

let lastRightClickedTask = null;

const attachClickListeners = () => {
  const todoItems = document.querySelectorAll(`[data-testid="task-list-item"]`);
  todoItems.forEach((item) => {
    // Prevent adding duplicate listeners
    if (!item.dataset.listenerAttached) {
      item.addEventListener("contextmenu", (e) => {
        const taskElement = e.target.closest('[data-testid="task-list-item"]');

        e.preventDefault(); // prevent default context menu if you want

        lastRightClickedTask = {
          taskText: taskElement.querySelector(".task_content")?.innerHTML,
          taskId: taskElement.dataset.itemId,
        };

        openSidePanel();

        // Send data to iframe
        const iframe = document.getElementById("extension-root");
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage(
              { action: "TASK_RIGHT_CLICKED", task: lastRightClickedTask },
              "*"
            );
          };
        }

      });

      item.dataset.listenerAttached = "true";
    }
  });
};
6605
const observer = new MutationObserver(attachClickListeners);
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

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

showFloatIconUI();
