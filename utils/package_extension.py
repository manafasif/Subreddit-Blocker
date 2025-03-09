import os
import zipfile

# Configuration
EXTENSION_NAME = "Subreddit_Blocker"
RELEASE_DIR = "releases"
ZIP_FILE = os.path.join(RELEASE_DIR, f"{EXTENSION_NAME}.zip")

# Directories and files to exclude
EXCLUDE_DIRS = {"releases", ".git", "utils", "web_scraper"}
EXCLUDE_FILES = {".env", ".gitignore"}


def should_exclude(path):
    """Check if the file or folder should be excluded."""
    abs_path = os.path.abspath(path)

    # Check for excluded directories
    for exclude in EXCLUDE_DIRS:
        if os.path.abspath(exclude) in abs_path:
            return True

    # Check for excluded files
    if os.path.basename(path) in EXCLUDE_FILES:
        return True

    return False


def create_zip():
    """Create a zip file excluding specified directories and files."""
    os.makedirs(RELEASE_DIR, exist_ok=True)

    with zipfile.ZipFile(ZIP_FILE, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk("."):
            # Exclude directories from traversal
            dirs[:] = [d for d in dirs if not should_exclude(
                os.path.join(root, d))]

            for file in files:
                file_path = os.path.join(root, file)
                if should_exclude(file_path):
                    arcname = os.path.relpath(file_path, ".")
                    print(f"Excluded: {arcname}")
                    continue

                # Add file to zip with relative path
                arcname = os.path.relpath(file_path, ".")
                zipf.write(file_path, arcname)
                print(f"Added: {arcname}")

    print(f"Zip archive created: {ZIP_FILE}")


if __name__ == "__main__":
    create_zip()
