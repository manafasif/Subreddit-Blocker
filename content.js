// Get the current subreddit name from the URL
const url = new URL(window.location.href);
const subreddit = url.pathname.split("/")[2].toLowerCase(); // Extract subreddit name and convert to lowercase

console.log(`Checking subreddit: ${subreddit}`);

// Get the list of blocked subreddits from storage
chrome.storage.local.get("blockedSubreddits", (data) => {
  const blockedSubreddits = data.blockedSubreddits || [];

  console.log(`Blocked subreddits: ${blockedSubreddits}`);

  // Convert blocked subreddits to lowercase for case-insensitive comparison
  const blockedSubredditsLower = blockedSubreddits.map((sub) =>
    sub.toLowerCase()
  );

  if (blockedSubredditsLower.includes(subreddit)) {
    // If the subreddit is in the blocked list, replace the page content
    console.log(`Subreddit "${subreddit}" is blocked. Replacing page content.`);
    document.body.innerHTML = `
      <div style="text-align: center; margin-top: 50px;">
        <h1>Blocked Subreddit</h1>
        <p>The subreddit <strong>${subreddit}</strong> has been blocked.</p>
      </div>
    `;
  } else {
    console.log(`Subreddit "${subreddit}" is not blocked.`);
  }
});
