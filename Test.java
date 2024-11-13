import os
import re

# Function to escape special characters in Groovy strings for FreeMarker
def escape_special_characters_in_string(match):
    content = match.group(0)
    content = content.replace('${', r'\${')  # Escape ${}
    content = content.replace('#', r'\#')     # Escape #
    return content

# Convert Groovy code to FTL code
def convert_groovy_to_ftl(groovy_code):
    ftl_code = groovy_code

    # Escape special characters in strings
    ftl_code = re.sub(r'"[^"]*"', escape_special_characters_in_string, ftl_code)

    # Convert variable assignments
    ftl_code = re.sub(r'(\w+)\s*=\s*(.+)', r'<#assign \1 = \2>', ftl_code)

    # Convert println statements
    ftl_code = re.sub(r'println\s+"(.+)"', r'${"\1"}', ftl_code)

    # Convert logical operators in conditions
    ftl_code = re.sub(r'\s+&&\s+', ' && ', ftl_code)
    ftl_code = re.sub(r'\s+\|\|\s+', ' || ', ftl_code)

    # Convert if conditions
    ftl_code = re.sub(r'if\s*\((.+?)\)\s*{', r'<#if \1>', ftl_code)
    ftl_code = re.sub(r'}\s*else\s*{', r'<#else>', ftl_code)
    ftl_code = re.sub(r'}\s*else if\s*\((.+?)\)\s*{', r'<#elseif \1>', ftl_code)
    ftl_code = re.sub(r'}', r'</#if>', ftl_code)

    # Handle for loops
    ftl_code = re.sub(r'for\s*\((\w+)\s+in\s+(.+?)\)\s*{', r'<#list \2 as \1>', ftl_code)
    ftl_code = re.sub(r'}', r'</#list>', ftl_code)

    # Handle while loops
    while_pattern = re.compile(r'while\s*\((.+?)\)\s*{(.+?)}', re.DOTALL)
    def convert_while(match):
        condition = match.group(1).strip()
        loop_content = match.group(2).strip()
        return f"<#list 1..<#if {condition}>9999<#else>0</#if> as i>\n{loop_content}\n</#list>"
    ftl_code = while_pattern.sub(convert_while, ftl_code)

    # Handle switch-case statements
    switch_pattern = re.compile(r'switch\s*\((.+?)\)\s*\{(.+?)\}', re.DOTALL)
    def convert_switch(match):
        switch_var = match.group(1).strip()
        cases_block = match.group(2)
        case_pattern = re.compile(r'case\s+(.+?):(.+?)(?=case|default|$)', re.DOTALL)
        case_statements = case_pattern.findall(cases_block)
        ftl_switch_code = ""
        first_case = True
        for case in case_statements:
            if len(case) == 2:
                case_value, case_code = case
                condition = f"{switch_var} == {case_value.strip()}"
                if first_case:
                    ftl_switch_code += f"<#if {condition}>\n{case_code.strip()}\n"
                    first_case = False
                else:
                    ftl_switch_code += f"<#elseif {condition}>\n{case_code.strip()}\n"
            else:
                print(f"Warning: Skipping invalid case entry '{case}'")

        default_match = re.search(r'default:\s*(.+)', cases_block, re.DOTALL)
        if default_match:
            default_code = default_match.group(1).strip()
            ftl_switch_code += f"<#else>\n{default_code}\n"
        ftl_switch_code += "</#if>"
        return ftl_switch_code
    ftl_code = switch_pattern.sub(convert_switch, ftl_code)

    # Convert equalsIgnoreCase method
    ftl_code = re.sub(r'(\w+)\.equalsIgnoreCase\((.+?)\)', r'\1?lower_case == \2?lower_case', ftl_code)

    # Handle array, list, and map enumeration
    map_enum_pattern = re.compile(r'(\w+)\.each\s*\{\s*(\w+),\s*(\w+)\s*->\s*(.+?)\s*\}', re.DOTALL)
    def convert_map_enum(match):
        map_name = match.group(1)
        key_var = match.group(2)
        value_var = match.group(3)
        loop_body = match.group(4).strip()
        return f"<#list {map_name}?keys as {key_var}>\n<#assign {value_var} = {map_name}[{key_var}]>\n{loop_body}\n</#list>"
    ftl_code = map_enum_pattern.sub(convert_map_enum, ftl_code)

    # Handle Map declarations with error handling for invalid entries
    map_pattern = re.compile(r'\[([^]]+)\]')
    def convert_map(match):
        map_content = match.group(1)
        items = [item.split(":") for item in map_content.split(",")]
        map_items = []

        for item in items:
            if len(item) == 2:  # Ensure there are exactly two parts to unpack
                k, v = item
                map_items.append(f'"{k.strip()}": {v.strip()}')
            else:
                # Handle unexpected format gracefully, maybe log or skip
                print(f"Warning: Skipping invalid map entry '{item}'")
        
        return f'{{ {", ".join(map_items)} }}'
    ftl_code = map_pattern.sub(convert_map, ftl_code)

    list_pattern = re.compile(r'(\w+)\s*=\s*\[(.+?)\]')
    ftl_code = list_pattern.sub(r'<#assign \1 = [\2]>', ftl_code)

    return ftl_code

# Fetch all .groovy files from a folder and subfolders
def fetch_groovy_files(folder_path):
    groovy_files = []
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".groovy"):
                groovy_files.append(os.path.join(root, file))
    return groovy_files

# Process each Groovy file and create an FTL file with converted content
def process_files(groovy_files):
    for groovy_file in groovy_files:
        print(f"Processing file: {groovy_file}")
       
        with open(groovy_file, 'r', encoding='utf-8') as f:
            groovy_content = f.read()
       
        # Convert the content to FTL
        ftl_content = convert_groovy_to_ftl(groovy_content)
       
        # Save the converted content into a new .ftl file
        ftl_file = groovy_file.replace('.groovy', '.ftl')
        with open(ftl_file, 'w', encoding='utf-8') as f:
            f.write(ftl_content)
       
        print(f"Created FTL file: {ftl_file}")

def main():
    # Get the folder path from the user
    folder_path = input("Enter the path of the folder (leave blank for current directory): ").strip() or "."
   
    # Check if folder exists
    if not os.path.isdir(folder_path):
        print("Invalid directory. Exiting...")
        return
   
    # Fetch all Groovy files from the folder and subfolders
    groovy_files = fetch_groovy_files(folder_path)
   
    if not groovy_files:
        print(f"No .groovy files found in {folder_path}")
        return
   
    # Process each file and generate FTL files
    process_files(groovy_files)

# Run the script
if __name__ == "__main__":
    main()
