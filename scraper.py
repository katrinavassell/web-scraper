import requests
from bs4 import BeautifulSoup
import time
from typing import List, Dict, Any
import streamlit as st
import json

def scrape_feedback_page(url: str, max_results: int = 50) -> List[Dict[str, Any]]:
    """
    Scrapes feedback data from the given URL, including handling pagination through "Load more" functionality.
    Returns a list of dictionaries containing post information, limited by max_results per page.
    """
    all_posts = []
    seen_urls = set()  # Track unique URLs
    page = 1
    max_retries = 3

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
    }

    try:
        # First, get the initial page to extract any necessary tokens or parameters
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        while True:
            st.write(f"Fetching page {page}...")

            # Find all posts with class "postListItemV2"
            posts = soup.find_all('div', class_='postListItemV2')

            if not posts and page == 1:
                st.error("No posts found. Website structure might have changed.")
                st.code(soup.prettify()[:500], language="html")
                break

            # If no posts found on subsequent pages, we've reached the end
            if not posts and page > 1:
                st.info("No more posts to load.")
                break

            new_posts_found = False  # Track if we found any new posts on this page
            for post in posts:
                try:
                    # Extract title from postLink class
                    title_elem = post.find('a', class_='postLink')

                    # Get the post link
                    post_link = title_elem.get('href', '') if title_elem else ''
                    if not post_link:
                        continue

                    # Normalize URL
                    if not post_link.startswith(('http://', 'https://')):
                        post_link = f"{url.rstrip('/')}{post_link}"

                    # Skip if we've seen this URL before
                    if post_link in seen_urls:
                        continue

                    seen_urls.add(post_link)
                    new_posts_found = True

                    # Extract post details
                    details_elem = post.find('div', class_='postDetails')

                    # Extract vote count from metaInfo class
                    meta_info = post.find('div', class_='metaInfo')
                    count_elem = meta_info.find('span', class_='count') if meta_info else None

                    # Extract vote count
                    vote_count = 0
                    if count_elem:
                        try:
                            vote_count = int(count_elem.text.strip())
                        except ValueError:
                            st.warning(f"Could not parse vote count: {count_elem.text.strip()}")

                    post_data = {
                        'postTitle': title_elem.text.strip() if title_elem else '',
                        'postDetails': details_elem.text.strip() if details_elem else '',
                        'count': vote_count,
                        'postLink': post_link
                    }

                    all_posts.append(post_data)

                    # Only collect up to max_results posts
                    if len(all_posts) >= max_results:
                        st.info(f"Reached maximum number of results ({max_results})")
                        return all_posts[:max_results]

                except Exception as e:
                    st.warning(f"Error processing post: {str(e)}")
                    continue

            # If we didn't find any new posts on this page, we've reached the end
            if not new_posts_found:
                st.info("No new posts found on this page.")
                break

            # Return current batch of results if we have enough
            if len(all_posts) >= max_results:
                st.info(f"Reached maximum number of results ({max_results})")
                return all_posts[:max_results]

            # Add a delay between requests
            time.sleep(2)

            # Construct the next page URL
            page += 1
            next_url = f"{url}?page={page}" if '?' not in url else f"{url}&page={page}"

            # Fetch the next page
            for attempt in range(max_retries):
                try:
                    response = requests.get(next_url, headers=headers)
                    response.raise_for_status()
                    soup = BeautifulSoup(response.text, 'html.parser')
                    break
                except requests.RequestException as e:
                    if attempt == max_retries - 1:
                        st.error(f"Failed to fetch page {page} after {max_retries} attempts: {str(e)}")
                        return all_posts[:max_results]  # Return what we have so far
                    time.sleep(2 * (attempt + 1))  # Exponential backoff

    except Exception as e:
        st.error(f"An error occurred while scraping: {str(e)}")

    return all_posts[:max_results]