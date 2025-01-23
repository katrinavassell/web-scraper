// Initialize message listener immediately
(() => {
  console.log('Content script initializing...');

  // Set up message listener right away
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Content script received message:', message.type);

    if (message.type === 'PING') {
      console.log('Responding to PING message');
      sendResponse({ success: true });
      return true;
    }

    if (message.type === 'COLLECT_ALL_VISIBLE') {
      console.log('Starting collection process');
      collectAllVisible().then(count => {
        console.log('Collection complete, sending response with count:', count);
        sendResponse({ success: true, count });
      }).catch(error => {
        console.error('Error in collectAllVisible:', error);
        sendResponse({ success: false, error: error.message });
      });
      return true; // Required for async response
    }
  });

  // Function to add collect buttons to posts
  function addCollectButtons() {
    console.log('Adding collect buttons to posts...');
    const posts = document.querySelectorAll('.postListItemV2:not([data-collector-processed])');
    console.log(`Found ${posts.length} unprocessed posts`);

    posts.forEach(post => {
      post.setAttribute('data-collector-processed', 'true');

      const button = document.createElement('button');
      button.className = 'collect-button';
      button.innerHTML = '+ Collect';

      const metaInfo = post.querySelector('.metaInfo');
      if (metaInfo) {
        metaInfo.appendChild(button);
        button.addEventListener('click', async () => {
          try {
            await collectPost(post, button);
          } catch (error) {
            console.error('Error in collect button click handler:', error);
          }
        });
      }
    });
  }

  // Function to collect a single post
  async function collectPost(post, button) {
    try {
      button.disabled = true;
      button.innerHTML = 'Collecting...';

      const title = post.querySelector('.postLink')?.textContent?.trim() || '';
      const details = post.querySelector('.postDetails')?.textContent?.trim() || '';
      const votes = post.querySelector('.count')?.textContent?.trim() || '0';
      const link = post.querySelector('.postLink')?.href || '';
      const sourceUrl = window.location.origin + window.location.pathname;

      await chrome.runtime.sendMessage({
        type: 'COLLECT_POST',
        post: {
          title,
          details,
          votes: parseInt(votes, 10),
          link,
          sourceUrl,
          collectedAt: new Date().toISOString()
        }
      });

      button.innerHTML = '✓ Collected';
      post.setAttribute('data-collected', 'true');
    } catch (error) {
      console.error('Error collecting post:', error);
      button.innerHTML = '✗ Error';
      setTimeout(() => {
        button.innerHTML = '+ Collect';
        button.disabled = false;
      }, 2000);
    }
  }

  // Function to collect all visible posts
  async function collectAllVisible() {
    console.log('Starting collectAllVisible');
    const posts = document.querySelectorAll('.postListItemV2:not([data-collected="true"])');
    let collectedCount = 0;

    console.log(`Found ${posts.length} uncollected posts`);

    for (const post of posts) {
      try {
        if (isElementInViewport(post)) {
          const button = post.querySelector('.collect-button');
          if (button && !button.disabled) {
            await collectPost(post, button);
            collectedCount++;
          }
        }
      } catch (error) {
        console.error('Error processing post:', error);
      }
    }

    console.log(`Successfully collected ${collectedCount} posts`);
    return collectedCount;
  }

  // Helper function to check if element is in viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Function to initialize the content script
  function initialize() {
    console.log('Content script initialization starting...');

    // Add initial buttons
    addCollectButtons();

    // Set up observer for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          addCollectButtons();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('Content script initialization complete');
  }

  // Initialize as soon as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  console.log('Content script initial setup complete');
})();