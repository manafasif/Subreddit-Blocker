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
      chrome.storage.local.set({ blockedSubreddits });
    })
    .catch((error) => {
      console.error("Error loading subreddit names:", error);
    });
}

// Fetch subreddit names on extension load
loadSubredditNames();
