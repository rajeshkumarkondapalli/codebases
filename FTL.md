import os
import re

def convert(groovy_code):
    # Conversion logic (as described in the previous section)
    converted_code = re.sub(r'def (\w+) = (.+)', r'<#assign \1 = \2>', groovy_code)
    converted_code = re.sub(r'\$\{(\w+)\}', r'${\1}', converted_code)
    converted_code = re.sub(r'println\s+["\'](.+?)["\']', r'\1', converted_code)
    converted_code = re.sub(r'for \((\w+) in (\w+)\) \{', r'<#list \2 as \1>', converted_code)
    converted_code = re.sub(r'\}', r'</#list>', converted_code)
    converted_code = re.sub(r'if \((.+)\) \{', r'<#if \1>', converted_code)
    converted_code = re.sub(r'def (\w+) = \[(.+)\]', r'<#assign \1 = [\2]>', converted_code)
    converted_code = re.sub(r'def (\w+) = \[(.+?): (.+?)(, .+?: .+?)*\]', 
                            lambda m: f"<#assign {m.group(1)} = {{{m.group(2)}: {m.group(3)}{m.group(4) if m.group(4) else ''}}}>", 
                            converted_code)
    converted_code = re.sub(r'switch \((\w+)\) \{', r'<#switch \1>', converted_code)
    converted_code = re.sub(r'case (.+):', r'<#case \1>', converted_code)
    converted_code = re.sub(r'default:', r'<#default>', converted_code)
    converted_code = re.sub(r'\bbreak\b', '', converted_code)
    converted_code = re.sub(r'\}', r'</#switch>', converted_code)

    return converted_code

def convert_file(file_path, output_dir=None):
    with open(file_path, 'r') as file:
        groovy_code = file.read()
    
    freemarker_code = convert(groovy_code)
    
    # Create output directory if it doesn't exist
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Determine the output file path
    base_name = os.path.basename(file_path)
    name, _ = os.path.splitext(base_name)
    output_file_path = os.path.join(output_dir if output_dir else os.path.dirname(file_path), f"{name}.ftl")
    
    with open(output_file_path, 'w') as file:
        file.write(freemarker_code)
    
    print(f"Converted {file_path} to {output_file_path}")

def convert_directory(directory_path, output_dir=None):
    for root, _, files in os.walk(directory_path):
        for file in files:
            if file.endswith(".groovy"):
                file_path = os.path.join(root, file)
                convert_file(file_path, output_dir)

def main(input_path, output_dir=None):
    if os.path.isfile(input_path):
        convert_file(input_path, output_dir)
    elif os.path.isdir(input_path):
        convert_directory(input_path, output_dir)
    else:
        print(f"Error: {input_path} is not a valid file or directory.")

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Convert files.")
    parser.add_argument("input", help="Path to the Groovy file or directory containing Groovy files.")
    parser.add_argument("-o", "--output", help="Output directory for converted files. Defaults to the input directory.")
    
    args = parser.parse_args()
    
    main(args.input, args.output)


#python groovy_to_freemarker.py path/to/your/file.groovy
#python groovy_to_freemarker.py path/to/your/directory
#python groovy_to_freemarker.py path/to/your/directory -o path/to/output/directory

    
