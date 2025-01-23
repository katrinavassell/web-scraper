// Handle displaying and filtering posts
let allPosts = [];

// Load and display posts
async function loadPosts() {
  const result = await chrome.storage.local.get('collectedPosts');
  allPosts = result.collectedPosts || [];
  const filtersDiv = document.querySelector('.filters');

  // Show/hide filters based on posts availability
  if (allPosts.length > 0) {
    filtersDiv.style.display = 'flex';
  } else {
    filtersDiv.style.display = 'none';
  }

  filterAndDisplayPosts();
}

// Filter and display posts based on current filters
function filterAndDisplayPosts() {
  const minVotes = parseInt(document.getElementById('minVotes').value) || 0;
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();

  const filteredPosts = allPosts.filter(post => {
    return post.votes >= minVotes && 
           post.title.toLowerCase().includes(searchTerm);
  });

  const postsList = document.getElementById('postsList');
  postsList.innerHTML = '';

  if (allPosts.length === 0) {
    postsList.innerHTML = '<div class="no-posts">No posts collected yet. Visit a feedback page and use the "Collect All Visible" button to get started.</div>';
    return;
  }

  filteredPosts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post-item';

    let changesHtml = '';
    if (post.changes && post.changes.length > 0) {
      changesHtml = `
        <div class="changes">
          Recent changes: ${post.changes.map(change => 
            `${change.columnName} changed from "${change.originalValue}" to "${change.newValue}" on ${new Date(change.timestamp).toLocaleString()}`
          ).join(', ')}
        </div>
      `;
    }

    postElement.innerHTML = `
      <div class="post-title">${post.title}</div>
      <div class="post-meta">
        ${post.votes} votes · From ${post.sourceUrl || 'Unknown source'} · Collected on ${new Date(post.collectedAt).toLocaleDateString()}
        <a href="${post.link}" target="_blank">View Post</a>
      </div>
      ${changesHtml}
    `;
    postsList.appendChild(postElement);
  });
}

// Export to CSV
function exportToCsv() {
  const csvContent = [
    ['Title', 'Details', 'Votes', 'Link', 'Source URL', 'Collected At', 'Changes'],
    ...allPosts.map(post => [
      post.title,
      post.details,
      post.votes,
      post.link,
      post.sourceUrl || '',
      post.collectedAt,
      post.changes ? JSON.stringify(post.changes) : ''
    ])
  ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'feedback_posts.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// Helper function to get current active tab
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Helper function to inject content script
async function injectContentScript(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    });
    return true;
  } catch (error) {
    console.error('Error injecting content script:', error);
    return false;
  }
}

// Helper function to check if content script is loaded
async function isContentScriptLoaded(tabId) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, { type: 'PING' });
    return response && response.success;
  } catch (error) {
    return false;
  }
}

// Helper function to wait for content script with retries
async function waitForContentScript(tabId, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    if (await isContentScriptLoaded(tabId)) {
      return true;
    }

    // Try to inject the content script
    await injectContentScript(tabId);

    // Wait before next attempt
    await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
  }
  return false;
}

// Collect all visible posts
async function collectAllVisible() {
  const collectButton = document.getElementById('collectAllBtn');
  collectButton.disabled = true;
  collectButton.textContent = 'Collecting...';

  try {
    const tab = await getCurrentTab();

    // Ensure content script is loaded with retries
    const scriptLoaded = await waitForContentScript(tab.id);
    if (!scriptLoaded) {
      throw new Error('Failed to load content script after multiple attempts');
    }

    // Now try to collect posts
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'COLLECT_ALL_VISIBLE' });

    if (response && response.success) {
      collectButton.textContent = `Collected ${response.count} posts`;
      setTimeout(() => {
        collectButton.disabled = false;
        collectButton.textContent = 'Collect All Visible';
      }, 2000);

      // Reload the posts list
      await loadPosts();
    } else {
      throw new Error('Invalid response from content script');
    }
  } catch (error) {
    console.error('Error collecting posts:', error);
    collectButton.textContent = 'Error collecting';
    setTimeout(() => {
      collectButton.disabled = false;
      collectButton.textContent = 'Collect All Visible';
    }, 2000);
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadPosts();
  const minVotesInput = document.getElementById('minVotes');
  const searchInput = document.getElementById('searchInput');
  const exportButton = document.getElementById('exportBtn');
  const collectAllButton = document.getElementById('collectAllBtn');

  if (minVotesInput) minVotesInput.addEventListener('input', filterAndDisplayPosts);
  if (searchInput) searchInput.addEventListener('input', filterAndDisplayPosts);
  if (exportButton) exportButton.addEventListener('click', exportToCsv);
  if (collectAllButton) collectAllButton.addEventListener('click', collectAllVisible);
});