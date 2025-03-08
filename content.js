// Function to extract subreddit name and block the page if necessary
function blockSubreddit() {
  const url = new URL(window.location.href);
  const subreddit = url.pathname.split("/")[2]?.toLowerCase(); // Extract subreddit name and convert to lowercase

  if (!subreddit) {
    console.log("No subreddit found in the URL.");
    return; // Exit if no subreddit found in the URL
  }

  console.log(`Checking subreddit: ${subreddit}`);

  // Get the list of user-blocked subreddits from storage
  chrome.storage.local.get("userBlockedSubreddits", (data) => {
    const userBlockedSubreddits = data.userBlockedSubreddits || [];

    // Log the user-blocked subreddits for debugging
    console.log(
      "User blocked subreddits loaded from storage:",
      userBlockedSubreddits
    );

    // Check if the current subreddit is blocked
    if (userBlockedSubreddits.includes(subreddit)) {
      // If the subreddit is in the user-blocked list, replace the page content
      console.log(
        `Subreddit "${subreddit}" is blocked. Replacing page content.`
      );

      // Temporarily disconnect the observer to prevent an infinite loop
      observer.disconnect();

      // Clear existing content and append the block message
      document.body.innerHTML = ""; // This will clear any existing content
      const blockedMessage = document.createElement("div");
      blockedMessage.style.textAlign = "center";
      blockedMessage.style.marginTop = "50px";

      const heading = document.createElement("h1");
      heading.innerText = "Blocked Subreddit";
      blockedMessage.appendChild(heading);

      const paragraph = document.createElement("p");
      paragraph.innerHTML = `The subreddit <strong>${subreddit}</strong> has been blocked.`;
      blockedMessage.appendChild(paragraph);

      document.body.appendChild(blockedMessage);
    } else {
      console.log(`Subreddit "${subreddit}" is not blocked.`);
    }
  });
}

// Observe changes to the DOM and trigger blocking when necessary
const observer = new MutationObserver(() => {
  blockSubreddit();
});

// Start observing for changes in the body (detecting dynamic content loading)
observer.observe(document.body, {
  childList: true, // Observe direct children
  subtree: true, // Observe all descendants
});

console.log("MutationObserver is active, watching for DOM changes...");
