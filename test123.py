import os
import re

def convert_groovy_to_freemarker(groovy_code: str) -> str:
    """
    Convert Groovy code with lists, if, switch, loops, and methods into Freemarker Template Language (FTL).
    Args:
        groovy_code (str): The Groovy code snippet.
    Returns:
        str: Equivalent Freemarker code.
    """
    freemarker_code = groovy_code

    # Replace Groovy list creation to Freemarker
    freemarker_code = re.sub(r'\[([^]]+)\]', r'${[\1]}', freemarker_code)

    # Replace if conditions
    freemarker_code = re.sub(r'if \((.*?)\) \{', r'<#if \1>', freemarker_code)
    freemarker_code = re.sub(r'else if \((.*?)\) \{', r'<#elseif \1>', freemarker_code)
    freemarker_code = re.sub(r'else \{', r'<#else>', freemarker_code)

    # Replace while loops
    freemarker_code = re.sub(r'while \((.*?)\) \{', r'<#list 1.. as dummy>
    <#if \1>', freemarker_code)

    # Replace switch statements
    freemarker_code = re.sub(r'switch\s*\((.*?)\)\s*\{', r'<#switch \1>', freemarker_code)
    freemarker_code = re.sub(r'case (.*?):', r'<#case \1>', freemarker_code)
    freemarker_code = re.sub(r'default:', r'<#default>', freemarker_code)
    
    # Replace method calls
    freemarker_code = re.sub(r'(\w+)\((.*?)\)', r'${\1(\2)}', freemarker_code)

    # Replace println statements
    freemarker_code = re.sub(r'println\s*\((.*?)\)', r'${\1}', freemarker_code)

    # Closing braces
    freemarker_code = re.sub(r'\}', r'</#if>', freemarker_code)
    freemarker_code = re.sub(r'</#if></#if>', r'</#switch>', freemarker_code)  # Fix nested closing tags

    return freemarker_code

def process_folder(input_folder: str):
    """
    Scan a folder recursively for .groovy files, convert them to .ftl, and save alongside the original files.
    Args:
        input_folder (str): Path to the root folder.
    """
    for root, _, files in os.walk(input_folder):
        for file in files:
            if file.endswith(".groovy"):
                groovy_file_path = os.path.join(root, file)
                ftl_file_path = os.path.join(root, file.replace(".groovy", ".ftl"))
                
                print(f"Processing: {groovy_file_path}")
                with open(groovy_file_path, 'r', encoding='utf-8') as groovy_file:
                    groovy_code = groovy_file.read()
                    freemarker_code = convert_groovy_to_freemarker(groovy_code)
                
                with open(ftl_file_path, 'w', encoding='utf-8') as ftl_file:
                    ftl_file.write(freemarker_code)
                    print(f"Saved: {ftl_file_path}")

if __name__ == "__main__":
    input_folder = input("Enter the folder path to scan for .groovy files: ").strip()
    if os.path.isdir(input_folder):
        process_folder(input_folder)
        print("Conversion completed successfully.")
    else:
        print("Invalid folder path. Please try again.")
