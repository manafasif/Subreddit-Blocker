import json


def extract_subreddit_names(input_file, output_file):
    """
    Extract subreddit names from a JSON file and save them to a text file.

    :param input_file: JSON file containing subreddit data
    :param output_file: File to save the subreddit names
    """
    try:
        # Load the JSON file
        with open(input_file, "r", encoding="utf-8") as file:
            data = json.load(file)

        # Extract subreddit names
        subreddit_names = [subreddit["name"] for subreddit in data]

        # Save the names to a text file
        with open(output_file, "w", encoding="utf-8") as file:
            for name in subreddit_names:
                file.write(name + "\n")

        print(
            f"Extracted {len(subreddit_names)} subreddit names and saved to {output_file}.")

    except Exception as e:
        print(f"Error: {e}")


# Usage
input_file = "data/subreddits.json"
output_file = "data/subreddit_names.txt"
extract_subreddit_names(input_file, output_file)
