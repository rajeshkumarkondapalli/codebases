

from bs4 import BeautifulSoup
import difflib

def extract_div_content(html_file, class_name):
    """Extracts the content of all <div> elements with a specific class name."""
    with open(html_file, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')
        return [div.get_text(strip=True) for div in soup.find_all('div', class_=class_name)]

def compare_divs(content1, content2):
    """Compares two lists of div contents and highlights differences."""
    diff = difflib.unified_diff(
        content1,
        content2,
        lineterm='',
        fromfile='File1',
        tofile='File2'
    )
    return '\n'.join(diff)

# Paths to HTML files
file1 = 'file1.html'
file2 = 'file2.html'

# Class name to target
target_class = 'your-target-class'

# Extract div contents
divs_file1 = extract_div_content(file1, target_class)
divs_file2 = extract_div_content(file2, target_class)

# Compare div contents
differences = compare_divs(divs_file1, divs_file2)

# Output differences
if differences:
    print("Differences found:")
    print(differences)
else:
    print("No differences found.")
