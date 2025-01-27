import requests
import json


def scrape_subreddits(api_url, output_file):
    """
    Scrape all subreddits from the given API URL and save to a JSON file.

    :param api_url: Base API URL for subreddits
    :param output_file: File to save the scraped data
    """
    page = 1
    per_page = 250
    all_subreddits = []

    while True:
        params = {
            "page": page,
            "per_page": per_page,
            "sort_by": "subscribers",
            "sort_dir": "desc",
            "filters[0][field]": "nsfw",
            "filters[0][operator]": "=",
            "filters[0][value]": 1,
            "filters[0][type]": 2,
            "filters[1][field]": "name",
            "filters[1][operator]": "not like",
            "filters[1][value]": "u\\_%",
            "filters[1][type]": 1,
            "filters[2][field]": "status",
            "filters[2][operator]": "<>",
            "filters[2][value]": "banned",
            "filters[2][type]": 1,
            "search_fields[]": "name",
            "search_value": ""
        }

        response = requests.get(api_url, params=params)

        if response.status_code != 200:
            print(f"Failed to fetch data: {response.status_code}")
            break

        data = response.json()
        subreddits = data.get("data", [])

        if not subreddits:
            # No more subreddits to fetch
            break

        all_subreddits.extend(subreddits)
        print(f"Page {page}: Retrieved {len(subreddits)} subreddits.")
        page += 1

    # Save all subreddits to a JSON file
    with open(output_file, "w", encoding="utf-8") as file:
        json.dump(all_subreddits, file, indent=4, ensure_ascii=False)

    print(
        f"Scraping complete. Saved {len(all_subreddits)} subreddits to {output_file}.")


# Usage
api_url = "https://app.social-rise.com/api/subreddits"
output_file = "data/subreddits.json"
scrape_subreddits(api_url, output_file)
