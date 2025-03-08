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

// Add functionality to block the current subreddit
document.getElementById("block-current-btn").addEventListener("click", () => {
  // Send a message to the content script to get the current subreddit
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    if (tab.url && tab.url.includes("reddit.com/r/")) {
      const subreddit = new URL(tab.url).pathname.split("/")[2].toLowerCase();

      // Block the current subreddit if it isn't already blocked
      chrome.storage.local.get("userBlockedSubreddits", (data) => {
        const userBlockedSubreddits = data.userBlockedSubreddits || [];

        if (!userBlockedSubreddits.includes(subreddit)) {
          userBlockedSubreddits.push(subreddit);

          // Save the updated blocklist in chrome storage
          chrome.storage.local.set({ userBlockedSubreddits }, () => {
            console.log(`Current subreddit ${subreddit} added to blocklist.`);
            updateBlockedList(); // Update the UI

            // Reload the page to apply the block
            chrome.tabs.reload(tab.id);
          });
        } else {
          alert("This subreddit is already blocked!");
        }
      });
    } else {
      alert("Not a subreddit page!");
    }
  });
});

// Function to check if the user is on a subreddit and toggle the button visibility
function checkIfOnSubreddit() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    if (tab.url && tab.url.includes("reddit.com/r/")) {
      // Show the button and label if on a subreddit page
      document.getElementById("subreddit-block-section").style.display =
        "block";
    } else {
      // Hide the button and label if not on a subreddit page
      document.getElementById("subreddit-block-section").style.display = "none";
    }
  });
}

// Initialize the popup with the current blocklist and check if we're on a subreddit
updateBlockedList();
checkIfOnSubreddit();
