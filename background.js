// Initialize storage with empty array if not exists
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('collectedPosts', (result) => {
    if (!result.collectedPosts) {
      chrome.storage.local.set({ collectedPosts: [] });
    }
  });
});

// Helper function to compare posts and generate change log
function getChanges(oldPost, newPost) {
  const changes = [];
  const fieldsToCompare = ['title', 'details', 'votes'];

  fieldsToCompare.forEach(field => {
    if (oldPost[field] !== newPost[field]) {
      changes.push({
        columnName: field,
        originalValue: oldPost[field],
        newValue: newPost[field],
        timestamp: new Date().toISOString()
      });
    }
  });

  return changes;
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'COLLECT_POST') {
    chrome.storage.local.get('collectedPosts', (result) => {
      const posts = result.collectedPosts || [];
      const existingPostIndex = posts.findIndex(p => p.link === message.post.link);

      if (existingPostIndex === -1) {
        // New post
        message.post.changes = [];
        posts.push(message.post);
      } else {
        // Existing post - check for changes
        const existingPost = posts[existingPostIndex];
        const changes = getChanges(existingPost, message.post);

        if (changes.length > 0) {
          // Update the post with new values and add changes to history
          posts[existingPostIndex] = {
            ...message.post,
            changes: [...(existingPost.changes || []), ...changes]
          };
        }
      }

      chrome.storage.local.set({ collectedPosts: posts });
    });
  }
});