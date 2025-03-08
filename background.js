let blockedSubreddits = []; // Stores the list of subreddits to block

// Load subreddit names from the file once
function loadSubredditNames() {
  fetch(chrome.runtime.getURL("subreddit_names.txt"))
    .then((response) => response.text())
    .then((data) => {
      // Split the names by newlines or commas, assuming each subreddit is on a new line
      blockedSubreddits = data
        .split("\n")
        .map((subreddit) => subreddit.trim())
        .filter(Boolean);

      // Store blocked subreddits in chrome storage
      chrome.storage.local.set({ blockedSubreddits }, () => {
        console.log("Blocked subreddits loaded and stored in chrome.storage.");
      });
    })
    .catch((error) => {
      console.error("Error loading subreddit names:", error);
    });
}

// Fetch subreddit names on extension load
loadSubredditNames();

// Listen for URL changes and handle messages
chrome.webNavigation.onHistoryStateUpdated.addListener(
  function (details) {
    console.log(`URL changed: ${details.url}`);

    // Check if the URL is a Reddit subreddit page
    if (details.url.includes("reddit.com/r/")) {
      // Ensure the tab is ready and content script is active
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length > 0 && tabs[0].id) {
          const tabId = tabs[0].id;

          // Use chrome.scripting.executeScript to inject the content script into the tab
          chrome.scripting.executeScript(
            {
              target: { tabId: tabId },
              files: ["content.js"],
            },
            () => {
              // Now that the content script is injected, send the message
              sendMessageToContentScript(tabId);
            }
          );
        }
      });
    }
  },
  { url: [{ hostContains: "reddit.com" }] }
);

// Retry sending the message if the content script is not ready
function sendMessageToContentScript(tabId, retries = 5) {
  chrome.tabs.sendMessage(tabId, { action: "checkSubreddit" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error(
        `Error while sending message to content script for tab ${tabId}: ${chrome.runtime.lastError.message}`
      );
      if (retries > 0) {
        console.log(`Retrying to send message. Attempts remaining: ${retries}`);
        // Retry after a short delay
        setTimeout(() => sendMessageToContentScript(tabId, retries - 1), 500);
      } else {
        console.error(
          "Could not establish connection with the content script after multiple retries."
        );
      }
    } else if (response && response.success) {
      console.log("Message sent successfully to content script.");
    } else {
      console.error("Content script responded with an error:", response.error);
    }
  });
}
