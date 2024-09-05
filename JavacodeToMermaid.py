import re

def java_to_mermaid(java_code: str) -> str:
    # Define patterns for class, methods, and control structures
    class_pattern = r'class\s+(\w+)'
    method_pattern = r'(public|private|protected)\s+\w+\s+(\w+)\s*\(.*\)'
    if_pattern = r'if\s*\((.*)\)\s*{'
    else_pattern = r'else\s*{'
    for_pattern = r'for\s*\((.*)\)\s*{'
    while_pattern = r'while\s*\((.*)\)\s*{'
    
    mermaid_code = "graph TD\n"
    
    # Extract class name
    class_match = re.search(class_pattern, java_code)
    if class_match:
        class_name = class_match.group(1)
        mermaid_code += f"    {class_name}[[Class: {class_name}]]\n"
    
    # Extract methods and control flow structures
    method_matches = re.finditer(method_pattern, java_code)
    for match in method_matches:
        method_name = match.group(2)
        mermaid_code += f"    {class_name} --> {method_name}((Method: {method_name}))\n"
    
    # Handling control flows
    for if_match in re.finditer(if_pattern, java_code):
        condition = if_match.group(1)
        mermaid_code += f"    {method_name} --> |if {condition}| decision{{If condition}}\n"
    
    for else_match in re.finditer(else_pattern, java_code):
        mermaid_code += f"    decision --> |else| else_branch{{Else block}}\n"
    
    for for_match in re.finditer(for_pattern, java_code):
        condition = for_match.group(1)
        mermaid_code += f"    {method_name} --> |for {condition}| loop{{For loop}}\n"
    
    for while_match in re.finditer(while_pattern, java_code):
        condition = while_match.group(1)
        mermaid_code += f"    {method_name} --> |while {condition}| loop{{While loop}}\n"
    
    return mermaid_code

# Sample Java code
java_code = """
public class Example {
    public void methodOne() {
        if (a > b) {
            // do something
        } else {
            // do something else
        }
        for (int i = 0; i < 10; i++) {
            // loop
        }
    }

    public int methodTwo() {
        while (true) {
            // infinite loop
        }
    }
}
"""

# Convert Java to Mermaid
mermaid_code = java_to_mermaid(java_code)
print(mermaid_code)
