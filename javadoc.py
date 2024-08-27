import re
import os

def extract_comments(file_content):
    # Regular expression to match Javadoc comments
    comment_pattern = re.compile(r'/\*\*.*?\*/', re.DOTALL)
    comments = comment_pattern.findall(file_content)
    return comments

def extract_method_signatures(file_content):
    # Regular expression to match method signatures
    method_pattern = re.compile(r'(public|private|protected)?\s*(static)?\s*\w+\s+\w+.*?\s*{')
    methods = method_pattern.findall(file_content)
    return methods

def parse_java_files(directory):
    documentation = {}
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".java"):
                with open(os.path.join(root, file), 'r') as f:
                    file_content = f.read()
                    comments = extract_comments(file_content)
                    methods = extract_method_signatures(file_content)
                    documentation[file] = {'comments': comments, 'methods': methods}
    return documentation

def generate_markdown(doc):
    md_content = "# Java Code Documentation\n\n"
    for file, data in doc.items():
        md_content += f"## {file}\n"
        md_content += "### Javadoc Comments:\n"
        for comment in data['comments']:
            md_content += f"```java\n{comment}\n```\n"
        md_content += "### Method Signatures:\n"
        for method in data['methods']:
            md_content += f"```java\n{method}\n```\n"
    return md_content

def write_to_file(content, file_path):
    with open(file_path, 'w') as f:
        f.write(content)

if __name__ == "__main__":
    java_directory = "./src"  # Set this to your Java source directory
    documentation = parse_java_files(java_directory)
    markdown_content = generate_markdown(documentation)
    write_to_file(markdown_content, "Documentation.md")