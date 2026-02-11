chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "find-synonym",
        title: "Find Synonyms for '%s'",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "find-synonym") {
        // Inject the content script only when the user interacts
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        }).then(() => {
            // Once injected, send the message to the content script
            chrome.tabs.sendMessage(tab.id, {
                action: "SHOW_SYNONYMS",
                word: info.selectionText
            });
        }).catch(err => console.error("Script injection failed: ", err));
    }
});