// Listen for messages from the background script to trigger the subreddit check
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkSubreddit") {
    try {
      blockSubreddit(); // Trigger the blocking function when the message is received
      sendResponse({ success: true }); // Ensure to send a response back to the background
    } catch (error) {
      console.error("Error during subreddit blocking:", error);
      sendResponse({ success: false, error: error.message });
    }
  }
  // Keep the message port open to receive response asynchronously
  return true;
});

// Function to extract subreddit name and block the page if necessary
function blockSubreddit() {
  const url = new URL(window.location.href);
  const subreddit = url.pathname.split("/")[2]?.toLowerCase(); // Extract subreddit name and convert to lowercase

  if (!subreddit) {
    console.log("No subreddit found in the URL.");
    return; // Exit if no subreddit found in the URL
  }

  console.log(`Checking subreddit: ${subreddit}`);

  // Get both blocked subreddits lists (default blocked and user-blocked)
  chrome.storage.local.get(
    ["blockedSubreddits", "userBlockedSubreddits"],
    (data) => {
      const blockedSubreddits = data.blockedSubreddits || [];
      const userBlockedSubreddits = data.userBlockedSubreddits || [];

      // Log the blocked subreddits for debugging
      console.log("Blocked subreddits loaded from storage:", blockedSubreddits);
      console.log(
        "User-blocked subreddits loaded from storage:",
        userBlockedSubreddits
      );

      // Combine both blocked subreddits lists
      const combinedBlockedSubreddits = new Set([
        ...blockedSubreddits,
        ...userBlockedSubreddits,
      ]);

      // Check if the current subreddit is blocked
      if (combinedBlockedSubreddits.has(subreddit)) {
        // If the subreddit is in the combined blocked list, replace the page content
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
    }
  );
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
