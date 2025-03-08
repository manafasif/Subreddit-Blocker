// Function to update the UI with the current blocked subreddits
function updateBlockedList() {
  chrome.storage.local.get("userBlockedSubreddits", (data) => {
    const userBlockedSubreddits = data.userBlockedSubreddits || [];
    const listElement = document.getElementById("blocked-list");

    // Clear the existing list
    listElement.innerHTML = "";

    // Add each user-blocked subreddit to the list
    userBlockedSubreddits.forEach((subreddit) => {
      const listItem = document.createElement("li");
      listItem.textContent = subreddit;
      listElement.appendChild(listItem);
    });
  });
}

// Add subreddit to the blocklist
document.getElementById("add-btn").addEventListener("click", () => {
  const subredditInput = document.getElementById("subreddit-input");
  const subredditName = subredditInput.value.trim();

  if (subredditName) {
    chrome.storage.local.get("userBlockedSubreddits", (data) => {
      const userBlockedSubreddits = data.userBlockedSubreddits || [];

      // Prevent duplicates
      if (!userBlockedSubreddits.includes(subredditName)) {
        userBlockedSubreddits.push(subredditName);

        // Save the updated blocklist in chrome storage
        chrome.storage.local.set({ userBlockedSubreddits }, () => {
          console.log(`Subreddit ${subredditName} added to blocklist.`);
          updateBlockedList(); // Update the UI
        });
      } else {
        alert("This subreddit is already blocked!");
      }
    });
  }

  subredditInput.value = ""; // Clear input field
  subredditInput.focus(); // Focus back on the input
});

// Initialize the popup with the current blocklist
updateBlockedList();
