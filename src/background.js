// runs once on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Extension installed.");
  // chrome.storage.local.set({ showFloatingButton: false });
});
