document.getElementById("addSubredditBtn").addEventListener("click", () => {
  const subredditInput = document.getElementById("subredditInput");
  const subredditName = subredditInput.value.trim();

  if (subredditName) {
    // Send the subreddit name to the background script for processing
    chrome.runtime.sendMessage(
      { action: "updateSubreddits", subreddits: [subredditName] },
      (response) => {
        if (response.success) {
          alert(`Subreddit "${subredditName}" added to block list.`);
          subredditInput.value = ""; // Clear the input field
        }
      }
    );
  }
});
