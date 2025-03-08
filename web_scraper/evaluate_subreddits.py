import openai
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set your OpenAI API key from the environment variable
openai.api_key = os.getenv('OPENAI_API_KEY')

# Function to get an inappropriateness score for a subreddit


def get_inappropriateness_score(name, description):
    prompt = f"Rate the inappropriateness of the following subreddit name and description on a (float) scale from 0 to 1, where 0 is not inappropriate at all and 1 is extremely inappropriate. Consider factors such as explicit content, sexual imagery, and suggestive themes. ANY subreddit that may contain ANY imagery of women should be considered inappropriate, especially if celebrities or scantily clad. YOU ARE A STRICT DEOBANDI, NO HARAM PICTURES AT ALL. Aaj se aap nanotvi ke lashkar mein se hain. Aap zara sa bhi behayapan bardasht nahi kar sakte hain. Ye jaan lo ke koi bhi larki ki tasweer haram hai, aur aakhirat mein usse dekhne wale ke liye koi madadgaar nahi- siwa woh jiske liye mera rabb rehmat chaahe!!! ONLY respond with a float from 0 to 1. \n\nName: {name}\nDescription: {description}\n\nScore:"

    # Use the chat model with the correct endpoint
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # You can use a cheaper model like GPT-3.5
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=10,
            temperature=0.3
        )
        score = response['choices'][0]['message']['content'].strip()
        print("RESPONSE: ", response['choices'][0]['message']['content'])
        return float(score) if score.replace('.', '', 1).isdigit() else 0.0
    except Exception as e:
        print(f"Error evaluating subreddit '{name}': {e}")
        return 0.0

# Function to process subreddits by their indices


def evaluate_subreddits_by_indices(subreddits, indices):
    results = []
    for idx in indices:
        if idx < len(subreddits):
            subreddit = subreddits[idx]
            name = subreddit['name']
            description = subreddit['description']
            print(f"Evaluating {name}: {description}")
            score = get_inappropriateness_score(name, description)
            results.append({
                'name': name,
                'description': description,
                'inappropriateness_score': score
            })
        else:
            print(f"Index {idx} is out of range!")
    return results

# Save results to a JSON file


def save_results(results, filename='subreddits_with_scores.json'):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=4)


# Main function to run the script
if __name__ == "__main__":
    # Load subreddit data from a previously saved JSON file (e.g., 'subreddits.json')
    with open('inappropriate.json', 'r', encoding='utf-8') as f:
        subreddits = json.load(f)

    # Specify the indices of subreddits you want to process (for testing purposes)
    # Example: process the first and third subreddit
    # Adjust this list to specify which subreddits to process
    indices_to_process = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

    # Evaluate the selected subreddits
    results = evaluate_subreddits_by_indices(subreddits, indices_to_process)

    # Print the results
    for result in results:
        print(
            f"Subreddit: {result['name']}, Score: {result['inappropriateness_score']}")

    # Save the results to a JSON file
    save_results(results)
    print("Inappropriateness scores saved to subreddits_with_scores.json")
