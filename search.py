import argparse
import os
import re

# Rajesh Kondapalli - Function to find and print lines containing the search text (regex search)
def print_lines_with_search_text(file_path, search_regex):
    try:
        with open(file_path, 'r') as file:
            lines = file.readlines()

        print(f"\nResults for file: {file_path}")
        found = False
        # Rajesh Kondapalli - Search for lines matching the regex
        for i, line in enumerate(lines, start=1):
            if re.search(search_regex, line, re.IGNORECASE):  # Rajesh Kondapalli - Case-insensitive regex search
                found = True
                print(f"Line {i}: {line.strip()}")
        if not found:
            print(f"No matches for regex '{search_regex}' found in {file_path}.")
    except Exception as e:
        print(f"Could not read file {file_path}: {e}")

# Rajesh Kondapalli - Function to find files matching a regex pattern in the given folder
def find_files_matching_regex(folder_path, filename_regex):
    matched_files = []
    regex = re.compile(filename_regex)
    for root, _, files in os.walk(folder_path):
        for file in files:
            if regex.match(file):  # Rajesh Kondapalli - Match the regex against the filename
                matched_files.append(os.path.join(root, file))
    return matched_files

# Rajesh Kumar Kondapalli - Main function to handle command-line arguments and execute search
def main():
    parser = argparse.ArgumentParser(description="Search for a regex pattern in files matching a regex in a folder.")
    parser.add_argument('folder_path', type=str, help="The path to the folder to search in")
    parser.add_argument('filename_regex', type=str, help="The regex to match filenames")
    parser.add_argument('search_regex', type=str, help="The regex pattern to search for in the matched files")

    # Rajesh Kondapalli - Parse the arguments
    args = parser.parse_args()

    # Rajesh Kondapalli - Find files matching the filename regex
    matched_files = find_files_matching_regex(args.folder_path, args.filename_regex)
    
    if not matched_files:
        print(f"No files matching regex '{args.filename_regex}' found in folder '{args.folder_path}'")
        return

    # Rajesh Kondapalli - Search for the regex pattern in each matched file
    for file_path in matched_files:
        print_lines_with_search_text(file_path, args.search_regex)

if __name__ == '__main__':
    main()


# Rajesh Kondapalli - python search_in_files.py /logs ".*\.log" "failed|error|warning"
# Rajesh Kondapalli - python search_in_files.py /path/to/folder ".*\.log" "ERROR|WARNING"
# Rajesh Kondapalli - python3 search.py . trace\d*\.log DEVICE1
