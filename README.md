# Subreddit Blocker Chrome Extension

A simple Chrome extension that allows users to block specific subreddits on Reddit. With this extension, users can block unwanted subreddits to improve their browsing experience on Reddit.

---

## Features

- **Block Subreddits**: Block specific subreddits by adding them to the block list.
- **Customizable**: Easily load and update the list of blocked subreddits from a text file.
- **Local Storage**: Blocked subreddits are stored in the browser’s local storage, ensuring privacy and security.
- **Dynamic Blocking**: Automatically block subreddits when navigating to them, including through the Reddit search bar.
- **User-Friendly Interface**: Simple and intuitive interface to manage blocked subreddits.

---

## How to Use

### Installation

1. **Download the Extension**:
   - Clone this repository to your local machine:
     ```bash
     git clone https://github.com/yourusername/your-repo.git
     ```

2. **Install the Extension in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer mode** in the top right corner.
   - Click **Load unpacked** and select the folder where you cloned this repository.
   - The extension will now be installed in your Chrome browser.

3. **Block Subreddits**:
   - The list of blocked subreddits is loaded from a `.txt` file. You can modify the `subreddit_names.txt` file to include the subreddits you want to block (one per line).
   - The extension will block the listed subreddits automatically when you visit them.

---

## Privacy Policy

This extension does not collect any personal data. It only stores a list of blocked subreddits locally in your browser. No data is sent to external servers, ensuring your privacy.

- The list of blocked subreddits is stored in your browser's local storage.
- The extension does not track or store any other browsing activity.

You can read the full privacy policy here: [Privacy Policy](https://yourusername.github.io/your-repo/docs/privacy-policy.html)

---

## Technologies Used

- **JavaScript**: The main programming language used for the extension.
- **Chrome APIs**: Used for interacting with the Chrome browser, including `chrome.webNavigation`, `chrome.storage`, and `chrome.runtime`.
- **HTML/CSS**: For building the user interface of the extension.

---

## Contributing

We welcome contributions! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Open a pull request.

Please make sure to follow the code style used in the project, and include relevant tests if possible.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For any questions or support, feel free to open an issue in the [GitHub Issues page](https://github.com/yourusername/your-repo/issues).

---

**Thank you for using Subreddit Blocker!** Enjoy a more peaceful Reddit browsing experience. 🚀
