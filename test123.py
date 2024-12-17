import os
import re

def groovy_to_freemarker(groovy_code, data_model):
    """
    Converts Groovy code to formatted FreeMarker, handling dynamic field names.

    Args:
        groovy_code: The Groovy code string.
        data_model: A dictionary (or similar structure) representing the data passed to the FreeMarker template.

    Returns:
        The corresponding formatted FreeMarker template as a string.
    """
    freemarker_template = ""
    lines = groovy_code.strip().split('\n')
    indent_level = 0
    
    for line in lines:
        line = line.strip()
        if not line:
            continue  # Skip empty lines

        indent = get_indent_level(line)
        indent_level = indent

        line = line.lstrip()
        
        # 1. Handle List declarations
        match = re.match(r'(def|final)\s+(.*)\s*=\s*\[(.*)\]', line)
        if match:
          list_name = match.group(2).strip()
          elements = [s.strip().strip("'").strip('"') for s in match.group(3).split(',')]
          freemarker_template += "  " * indent_level + f"<#assign {list_name} = {elements}> \n"
          continue
        
        # 2. Handle assignment
        match = re.match(r'(def|final)\s+(.*)\s*=\s*(.*)', line)
        if match:
            variable_name = match.group(2).strip()
            value = match.group(3).strip()
             # Handle ternary operators
            if '?' in value:
              parts = value.split('?')
              condition = parts[0].strip()
              options = parts[1].split(':')
              true_value = options[0].strip()
              false_value = options[1].strip()
              value = f" <#if {condition}>{true_value}<#else>{false_value}</#if> "
            freemarker_template += "  " * indent_level + f"<#assign {variable_name} = {value}> \n"
            continue
        
        # Handle output assignments using indexed access
        match = re.match(r'outputs\[\"(.*)\"\]\s*=\s*(.*)', line)
        if match:
          output_key = match.group(1).strip()
          output_value = match.group(2).strip()
          if '?' in output_value:
            parts = output_value.split('?')
            condition = parts[0].strip()
            options = parts[1].split(':')
            true_value = options[0].strip()
            false_value = options[1].strip()
            output_value = f" <#if {condition}>{true_value}<#else>{false_value}</#if> "
          freemarker_template += "  " * indent_level + f"<#assign outputs[\"{output_key}\"] = {output_value}> \n"
          continue

        # 3. Handle if statements, including equals and isBound
        match = re.match(r'if\s*\((.*)\)\s*\{', line)
        if match:
            condition = match.group(1)
            condition = convert_groovy_condition(condition)
            freemarker_template += "  " * indent_level + f"<#if {condition}> \n"
            indent_level += 1
            continue

        # 4. Handle else if statements
        match = re.match(r'else\s+if\s*\((.*)\)\s*\{', line)
        if match:
            condition = match.group(1)
            condition = convert_groovy_condition(condition)
            freemarker_template += "  " * (indent_level - 1) + f"<#elseif {condition}> \n"
            continue

        # 5. Handle else statements
        match = re.match(r'else\s*\{', line)
        if match:
            freemarker_template += "  " * (indent_level - 1) + "<#else> \n"
            continue

        # 6. Handle while loops
        match = re.match(r'while\s*\((.*)\)\s*\{', line)
        if match:
            condition = match.group(1)
            freemarker_template += "  " * indent_level + f"<#while {condition}> \n"
            indent_level += 1
            continue

        # 7. Handle for loop
        match = re.match(r'for\s*\((.*)\s+in\s+(.*)\)\s*\{', line)
        if match:
            variable_name = match.group(1).strip()
            list_name = match.group(2).strip()
            freemarker_template += "  " * indent_level + f"<#list {list_name} as {variable_name}> \n"
            indent_level += 1
            continue

        # 8. Handle function calls
        match = re.match(r'(.*)\((.*)\)', line)
        if match:
             function_name = match.group(1).strip()
             parameters = match.group(2).strip()
             freemarker_template += "  " * indent_level + f"${{{function_name}({parameters})}} \n"
             continue

        # 9. Handle switch statements
        match = re.match(r'switch\s*\((.*)\)\s*\{', line)
        if match:
            variable_name = match.group(1)
            freemarker_template += "  " * indent_level + f"<#switch {variable_name}> \n"
            indent_level += 1
            continue

        # 10. Handle case statements
        match = re.match(r'case\s+(.*)\s*:\s*', line)
        if match:
            case_value = match.group(1)
            freemarker_template += "  " * (indent_level - 1) + f"<#case {case_value}> \n"
            continue

        # 11. Handle default statements
        match = re.match(r'default\s*:\s*', line)
        if match:
            freemarker_template += "  " * (indent_level - 1) + f"<#default> \n"
            continue

        # 12. Handle break
        if 'break' in line:
            continue

        # 13. Handle string output
        match = re.match(r'(.*)[\"\'](.*)[\"\'](.*)', line)
        if match:
            prefix = match.group(1).strip()
            text = match.group(2)
            suffix = match.group(3).strip()
            if not prefix and not suffix:
                freemarker_template += "  " * indent_level + f'{text} \n'
            else:
                freemarker_template += "  " * indent_level + f'{prefix} {text} {suffix} \n'
            continue

        # 14. Handle closures
        if "->" in line:
            continue

        # 15 Handle abort calls
        match = re.match(r'abort\s*\(\s*s\s*:\s*[\"\'](.*)[\"\']\s*\)', line)
        if match:
            message = match.group(1)
            freemarker_template += "  " * indent_level + f"<#stop \"{message}\"> \n"
            continue

        # 16. Handle other logic
        if line.endswith("}"):
            indent_level -= 1
            if indent_level < 0:
                indent_level = 0
            freemarker_template += "  " * indent_level + f"</#if> \n"
            continue

        # Handle other text or expressions
        freemarker_template += "  " * indent_level + line + " \n"

    return freemarker_template


def get_indent_level(line):
    return len(line) - len(line.lstrip())

def convert_groovy_condition(condition):
    """Converts a Groovy-style condition to a FreeMarker-compatible one, handling dynamic keys."""
     # Replace .equals() with ==, handle string equality properly and isBound() calls.
    condition = re.sub(r'\.equals\s*\(\s*[\"\'](.*)[\"\']\s*\)', r' == "\1"', condition)
    condition = re.sub(r'\.equals\s*\(\s*(.*?)\s*\)', r' == \1', condition)
    condition = re.sub(r'\s*([!=]==)\s*null', r' \1 null', condition)
    condition = re.sub(r'inputs\.isBound\s*\(\s*varName:\s*[\"\'](.*)[\"\']\s*\)', r'\1?has_content', condition)
    condition = re.sub(r'inputs\[[\"\'](.*?)[\"\']\]\s*([!=]==)\s*null', r'\1 \2 null', condition)
    condition = re.sub(r'inputs\[[\"\'](.*?)[\"\']\]', r'inputs.\1', condition)
    condition = condition.replace("!", "!")  # handle the negation separately
    condition = condition.replace("&&", "&&")
    condition = condition.replace("||", "||")
    return condition


def process_groovy_files(root_folder, data_model):
    """
    Recursively scans a folder for .groovy files, converts them to FreeMarker, and saves as .ftl files.

    Args:
        root_folder: The path to the root folder.
        data_model: A dictionary (or similar structure) representing the data passed to the FreeMarker template.
    """
    for dirpath, _, filenames in os.walk(root_folder):
        for filename in filenames:
            if filename.endswith(".groovy"):
                groovy_filepath = os.path.join(dirpath, filename)
                ftl_filepath = os.path.join(dirpath, filename.replace(".groovy", ".ftl"))

                try:
                    with open(groovy_filepath, "r") as f:
                        groovy_code = f.read()
                    freemarker_code = groovy_to_freemarker(groovy_code, data_model)
                    formatted_freemarker_code = format_freemarker_code(freemarker_code)
                    with open(ftl_filepath, "w") as f:
                        f.write(formatted_freemarker_code)
                    print(f"Converted: {groovy_filepath} to {ftl_filepath}")
                except Exception as e:
                    print(f"Error processing {groovy_filepath}: {e}")
                    
def format_freemarker_code(freemarker_code):
    """Formats the generated FreeMarker code."""
    lines = freemarker_code.splitlines()
    formatted_lines = []
    current_indent = 0
    
    for line in lines:
        line = line.strip()
        if not line:
            formatted_lines.append("")
            continue

        if line.startswith("</#if>") or line.startswith("</#list>") or line.startswith("</#while>") or line.startswith("<#case>") or line.startswith("<#default>"):
          current_indent -=1
        
        formatted_line = "  " * current_indent + line
        formatted_lines.append(formatted_line)

        if line.startswith("<#if ") or line.startswith("<#list ") or line.startswith("<#while ") or line.startswith("<#switch "):
          current_indent += 1

    return "\n".join(formatted_lines)


# Example usage:
if __name__ == "__main__":
    root_folder = "./test_folder"  # Replace with the actual root folder path

    data_model = {
       "inputs": {
          "end-point-role": ["PWE"],
          "use-case": "GENERIC",
          "asn1": 100,
          "peer-asn1": 200,
          "shared-policer-id1": 50,
          "frame-format1": "UNTAGGED",
          "control-frame-tunneling-profile-name-untagged": "profile1",
          "control-frame-tunneling-profile-name-all-to-one-bundled": "profile2",
           "pw-id1": 12345,
           "peer-ip1": "127.0.0.1"
       },
       "outputs": {
          "ignore-get-bgp-call": True
       }
    }
    process_groovy_files(root_folder, data_model)
