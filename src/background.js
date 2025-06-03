// Create context menu ONCE (on extension install)
chrome.runtime.onInstalled.addListener(() => {
console.log('Extension installed')
});

