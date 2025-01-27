let blockedSubreddits = []; // Stores the list of subreddits to block
let activeRuleIds = []; // Keeps track of active rule IDs

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

      // Update the blocking rules once the subreddits are loaded
      updateBlockRules();
    })
    .catch((error) => {
      console.error("Error loading subreddit names:", error);
    });
}

// Function to update the blocking rules dynamically
function updateBlockRules() {
  const newRuleIds = [];

  // Remove any previously added rules
  chrome.declarativeNetRequest.updateDynamicRules(
    {
      removeRuleIds: activeRuleIds, // Remove old rules before adding new ones
    },
    () => {
      console.log("Old rules removed");

      // Generate new rules based on the loaded list of blocked subreddits
      const rules = blockedSubreddits.map((subreddit, index) => {
        const ruleId = index + 1; // Use the index as a unique rule ID starting from 1
        console.log(`Attempting to add rule ${ruleId}`);
        newRuleIds.push(ruleId); // Track the new rule ID
        return {
          id: ruleId, // Unique ID for the rule
          priority: 1, // Rule priority
          action: {
            type: "block",
          },
          condition: {
            urlFilter: `*://www.reddit.com/r/${subreddit}/*`,
            resourceTypes: ["main_frame", "sub_frame"],
          },
        };
      });

      // Add the new rules dynamically
      chrome.declarativeNetRequest.updateDynamicRules(
        {
          addRules: rules,
          removeRuleIds: [], // No rules to remove after the initial removal
        },
        () => {
          // Update the active rule IDs
          activeRuleIds = newRuleIds;
          console.log("Blocking rules updated");
        }
      );
    }
  );
}

// Fetch and load subreddit names on extension load
loadSubredditNames();
