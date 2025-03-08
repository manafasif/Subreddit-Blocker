import requests
from bs4 import BeautifulSoup
import json
import time
import os
from random import randint

# Function to extract subreddit name and description


def extract_subreddit_info(url):
    try:
        # Send a request to the page
        response = requests.get(url)
        response.raise_for_status()  # Ensure the request was successful

        # Parse the page using BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find all divs containing community data
        community_divs = soup.find_all(
            'div', class_='flex flex-wrap justify-center py-[0.75rem]')

        # Extract subreddit names and descriptions
        subreddits = []
        for community in community_divs:
            name = community.find(
                'a', class_='m-0 font-bold text-12 text-current truncate max-w-[11rem]')
            description = community.find(
                'h6', class_='flex-grow h-md text-12 truncate py-[0.125rem] w-[11rem] m-0')

            if name and description:
                subreddits.append({
                    'name': name.text.strip(),
                    'description': description.text.strip()
                })

        return subreddits
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return None  # Return None if the page fails to load

# Function to iterate through pages with retries and save without duplicates


def iterate_pages(start_page=1, end_page=5, filename='subreddits.json'):
    all_subreddits = []
    seen_subreddits = set()  # Set to track already seen subreddits by name

    # Try to load existing data if the file exists
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            all_subreddits = json.load(f)
            # Track seen subreddits from the existing file
            seen_subreddits = {subreddit['name']
                               for subreddit in all_subreddits}

    # Track the last scraped page based on the number of subreddits already scraped
    # Assuming 20 subreddits per page
    last_page_scraped = len(all_subreddits) // 24

    for page_number in range(start_page + last_page_scraped, end_page + 1):
        url = f"https://www.reddit.com/best/communities/{page_number}/"
        print(f"Scraping page {page_number}: {url}")

        retries = 3
        for attempt in range(retries):
            subreddits = extract_subreddit_info(url)
            if subreddits is not None:
                for subreddit in subreddits:
                    if subreddit['name'] not in seen_subreddits:
                        all_subreddits.append(subreddit)
                        # Mark this subreddit as seen
                        seen_subreddits.add(subreddit['name'])
                break  # Break out of retry loop if successful
            else:
                print(
                    f"Retrying page {page_number} ({attempt + 1}/{retries})...")
                # Wait before retrying (to avoid rate-limiting)
                time.sleep(randint(5, 15))

        # Save the data after each page scrape to allow for recovery if interrupted
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(all_subreddits, f, ensure_ascii=False, indent=4)
        print(
            f"Page {page_number} saved. Total subreddits: {len(all_subreddits)}")

    return all_subreddits


# Example usage
if __name__ == "__main__":
    start_page = 1
    end_page = 1364  # Adjust the range as needed

    subreddits_info = iterate_pages(
        start_page=start_page, end_page=end_page)  # Adjust the range as needed

    # Print the output
    for subreddit in subreddits_info:
        print(
            f"Name: {subreddit['name']}, Description: {subreddit['description']}")

    print("Data scraping completed and saved.")
