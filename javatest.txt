
# Rajesh Kondapalli - --------------------------------------

import os
import re

# Rajesh Kondapalli - Define a function to extract method signatures from a Java file
def extract_methods_from_java(java_code):
    # Rajesh Kondapalli - Regex to match Java method signatures (public/protected/private returnType methodName(args))
    method_pattern = r'(public|protected|private)\s+(\w+)\s+(\w+)\s*\(.*?\)\s*\{'
    
    # Rajesh Kondapalli - Find all methods in the file
    methods = re.findall(method_pattern, java_code)
    
    method_signatures = []
    for method in methods:
        access_modifier, return_type, method_name = method
        method_signatures.append({
            "access_modifier": access_modifier,
            "return_type": return_type,
            "method_name": method_name
        })
    
    return method_signatures

# Rajesh Kondapalli - Define a function to generate unit test templates
def generate_unit_test(method_signature, class_name):
    method_name = method_signature['method_name']
    return f"""
    @Test
    public void test_{method_name}() {{
        // Arrange
        {class_name} instance = new {class_name}();
        
        // Act
        // Replace with actual parameters
        var result = instance.{method_name}();
        
        // Assert
        // Replace with actual assertions
        assertNotNull(result);
    }}
    """

# Rajesh Kondapalli - Define a function to scan Java files in the directory and generate unit tests
def generate_unit_tests_for_folder(base_folder):
    for root, dirs, files in os.walk(base_folder):
        for file in files:
            if file.endswith(".java"):
                file_path = os.path.join(root, file)
                
                # Rajesh Kondapalli - Open the Java file and extract method signatures
                with open(file_path, 'r', encoding='utf-8') as java_file:
                    java_code = java_file.read()
                
                # Rajesh Kondapalli - Get the class name from the file name
                class_name = file.replace(".java", "")
                
                # Rajesh Kondapalli - Extract methods from the Java code
                method_signatures = extract_methods_from_java(java_code)
                
                # Rajesh Kondapalli - Skip files without methods
                if not method_signatures:
                    continue
                
                # Rajesh Kondapalli - Generate test methods for each method signature
                test_methods = ""
                for method_signature in method_signatures:
                    test_methods += generate_unit_test(method_signature, class_name)
                
                # Rajesh Kondapalli - Create a test file with the generated test methods
                test_class_name = f"{class_name}Test"
                test_file_content = f"""
                import org.junit.jupiter.api.Test;
                import static org.junit.jupiter.api.Assertions.*;

                public class {test_class_name} {{

                {test_methods}

                }}
                """
                
                # Rajesh Kondapalli - Write the generated test to a new file in the same directory as the source file
                test_file_path = os.path.join(root, f"{test_class_name}.java")
                with open(test_file_path, 'w', encoding='utf-8') as test_file:
                    test_file.write(test_file_content)
                
                print(f"Generated test for {file_path} -> {test_file_path}")

# Rajesh Kondapalli - Example usage:
base_folder = '/path/to/your/springboot/project/src/main/java'
generate_unit_tests_for_folder(base_folder)

# Rajesh Kondapalli - ------------------------------------

import os
import re

# Rajesh Kondapalli - Define a function to extract method signatures from a Java file
def extract_methods_from_java(java_code):
    # Rajesh Kondapalli - Regex to match Java method signatures (public/protected/private returnType methodName(args))
    method_pattern = r'(public|protected|private)\s+(\w+)\s+(\w+)\s*\((.*?)\)\s*\{'
    
    # Rajesh Kondapalli - Find all methods in the file
    methods = re.findall(method_pattern, java_code)
    
    method_signatures = []
    for method in methods:
        access_modifier, return_type, method_name, params = method
        param_list = [param.strip() for param in params.split(",") if param]  # Rajesh Kondapalli - Split parameters by comma
        method_signatures.append({
            "access_modifier": access_modifier,
            "return_type": return_type,
            "method_name": method_name,
            "params": param_list
        })
    
    return method_signatures

# Rajesh Kumar Kondapalli - Define a function to generate test input values based on parameter types
def generate_test_input(param_type):
    if "String" in param_type:
        return '"testValue"'
    elif "int" in param_type or "Integer" in param_type:
        return '1'
    elif "boolean" in param_type:
        return 'true'
    elif "double" in param_type:
        return '1.0'
    elif "List" in param_type:
        return 'new ArrayList<>()'
    else:
        return 'null'  # Rajesh Kondapalli - Default fallback, handle custom objects as needed

# Rajesh Kondapalli - Define a function to generate assertions based on the return type
def generate_assertion(return_type):
    if return_type == "void":
        return "// No return value, test for expected side effects"
    elif "String" in return_type:
        return 'assertEquals("expectedValue", result);'
    elif return_type in ["int", "Integer", "double", "boolean"]:
        return 'assertEquals(1, result);'
    elif "List" in return_type:
        return 'assertNotNull(result); assertTrue(result.isEmpty());'
    else:
        return 'assertNotNull(result);'  # Rajesh Kondapalli - Fallback for custom objects

# Rajesh Kondapalli - Define a function to generate test cases for each method signature
def generate_unit_test(method_signature, class_name):
    method_name = method_signature['method_name']
    return_type = method_signature['return_type']
    params = method_signature['params']
    
    # Rajesh Kondapalli - Generate input values for each parameter
    param_values = [generate_test_input(param) for param in params]
    param_string = ", ".join(param_values) if param_values else ""
    
    # Rajesh Kondapalli - Generate assertion based on return type
    assertion = generate_assertion(return_type)
    
    return f"""
    @Test
    public void test_{method_name}_validInputs() {{
        // Arrange
        {class_name} instance = new {class_name}();
        
        // Act
        {return_type} result = instance.{method_name}({param_string});
        
        // Assert
        {assertion}
    }}
    
    @Test
    public void test_{method_name}_invalidInputs() {{
        // Arrange
        {class_name} instance = new {class_name}();
        
        // Act
        // Use invalid inputs and check for exceptions or boundary behavior
        try {{
            {return_type} result = instance.{method_name}(null);  // Example: null input
        }} catch (Exception e) {{
            assertNotNull(e);
        }}
    }}
    """

# Rajesh Kondapalli - Define a function to scan Java files in the directory and generate unit tests
def generate_unit_tests_for_folder(base_folder):
    for root, dirs, files in os.walk(base_folder):
        for file in files:
            if file.endswith(".java"):
                file_path = os.path.join(root, file)
                
                # Rajesh Kondapalli - Open the Java file and extract method signatures
                with open(file_path, 'r', encoding='utf-8') as java_file:
                    java_code = java_file.read()
                
                # Rajesh Kondapalli - Get the class name from the file name
                class_name = file.replace(".java", "")
                
                # Rajesh Kondapalli - Extract methods from the Java code
                method_signatures = extract_methods_from_java(java_code)
                
                # Rajesh Kondapalli - Skip files without methods
                if not method_signatures:
                    continue
                
                # Rajesh Kondapalli - Generate test methods for each method signature
                test_methods = ""
                for method_signature in method_signatures:
                    test_methods += generate_unit_test(method_signature, class_name)
                
                # Rajesh Kondapalli - Create a test file with the generated test methods
                test_class_name = f"{class_name}Test"
                test_file_content = f"""
                import org.junit.jupiter.api.Test;
                import static org.junit.jupiter.api.Assertions.*;

                public class {test_class_name} {{

                {test_methods}

                }}
                """
                
                # Rajesh Kondapalli - Write the generated test to a new file in the same directory as the source file
                test_file_path = os.path.join(root, f"{test_class_name}.java")
                with open(test_file_path, 'w', encoding='utf-8') as test_file:
                    test_file.write(test_file_content)
                
                print(f"Generated test for {file_path} -> {test_file_path}")

# Rajesh Kondapalli - Example usage:
base_folder = '/path/to/your/springboot/project/src/main/java'
generate_unit_tests_for_folder(base_folder)


# Rajesh Kondapalli - ----------------------------------
import os
import re

# Rajesh Kondapalli - Define a function to extract method signatures from a Java file
def extract_methods_from_java(java_code):
    # Rajesh Kondapalli - Regex to match Java method signatures (public/protected/private returnType methodName(args))
    method_pattern = r'(public|protected|private)\s+(\w+)\s+(\w+)\s*\((.*?)\)\s*\{'
    
    # Rajesh Kondapalli - Find all methods in the file
    methods = re.findall(method_pattern, java_code)
    
    method_signatures = []
    for method in methods:
        access_modifier, return_type, method_name, params = method
        param_list = [param.strip() for param in params.split(",") if param]  # Rajesh Kondapalli - Split parameters by comma
        method_signatures.append({
            "access_modifier": access_modifier,
            "return_type": return_type,
            "method_name": method_name,
            "params": param_list
        })
    
    return method_signatures

# Rajesh Kondapalli - Define a function to generate test input values based on parameter types
def generate_test_input(param_type):
    if "String" in param_type:
        return '"testValue"'
    elif "int" in param_type or "Integer" in param_type:
        return '1'
    elif "boolean" in param_type:
        return 'true'
    elif "double" in param_type:
        return '1.0'
    elif "List" in param_type:
        return 'new ArrayList<>()'
    else:
        return 'null'  # Rajesh Kondapalli - Default fallback, handle custom objects as needed

# Rajesh Kondapalli - Define a function to generate assertions based on the return type
def generate_assertion(return_type):
    if return_type == "void":
        return "// No return value, test for expected side effects"
    elif "String" in return_type:
        return 'assertEquals("expectedValue", result);'
    elif return_type in ["int", "Integer", "double", "boolean"]:
        return 'assertEquals(1, result);'
    elif "List" in return_type:
        return 'assertNotNull(result); assertTrue(result.isEmpty());'
    else:
        return 'assertNotNull(result);'  # Rajesh Kondapalli - Fallback for custom objects

# Rajesh Kondapalli - Define a function to generate test cases for each method signature, with Spring dependency injection
def generate_unit_test(method_signature, class_name):
    method_name = method_signature['method_name']
    return_type = method_signature['return_type']
    params = method_signature['params']
    
    # Rajesh Kondapalli - Generate input values for each parameter
    param_values = [generate_test_input(param) for param in params]
    param_string = ", ".join(param_values) if param_values else ""
    
    # Rajesh Kondapalli - Generate assertion based on return type
    assertion = generate_assertion(return_type)
    
    return f"""
    @Test
    public void test_{method_name}_validInputs() {{
        // Act
        {return_type} result = {class_name_lower}.{method_name}({param_string});
        
        // Assert
        {assertion}
    }}
    
    @Test
    public void test_{method_name}_invalidInputs() {{
        // Act
        try {{
            {return_type} result = {class_name_lower}.{method_name}(null);  // Example: null input
        }} catch (Exception e) {{
            assertNotNull(e);
        }}
    }}
    """

# Rajesh Kondapalli - Define a function to scan Java files in the directory and generate unit tests with Spring dependencies setup
def generate_unit_tests_for_folder(base_folder):
    for root, dirs, files in os.walk(base_folder):
        for file in files:
            if file.endswith(".java"):
                file_path = os.path.join(root, file)
                
                # Rajesh Kondapalli - Open the Java file and extract method signatures
                with open(file_path, 'r', encoding='utf-8') as java_file:
                    java_code = java_file.read()
                
                # Rajesh Kondapalli - Get the class name from the file name
                class_name = file.replace(".java", "")
                class_name_lower = class_name[0].lower() + class_name[1:]  # Rajesh Kondapalli - Convert to camelCase
                
                # Rajesh Kondapalli - Extract methods from the Java code
                method_signatures = extract_methods_from_java(java_code)
                
                # Rajesh Kondapalli - Skip files without methods
                if not method_signatures:
                    continue
                
                # Rajesh Kondapalli - Generate test methods for each method signature
                test_methods = ""
                for method_signature in method_signatures:
                    test_methods += generate_unit_test(method_signature, class_name)
                
                # Rajesh Kondapalli - Create a test file with the generated test methods, including Spring dependencies setup
                test_class_name = f"{class_name}Test"
                test_file_content = f"""
                import org.junit.jupiter.api.BeforeEach;
                import org.junit.jupiter.api.Test;
                import org.springframework.beans.factory.annotation.Autowired;
                import org.springframework.boot.test.context.SpringBootTest;
                import static org.junit.jupiter.api.Assertions.*;
                import org.mockito.Mockito;
                
                @SpringBootTest
                public class {test_class_name} {{

                    @Autowired
                    private {class_name} {class_name_lower};
                    
                    // Setup method to initialize Spring dependencies, mock beans, etc.
                    @BeforeEach
                    public void setUp() {{
                        // Example: Mock some dependencies if needed
                        // Mockito.when(dependency.someMethod()).thenReturn(someValue);
                    }}
                    
                    {test_methods}

                }}
                """
                
                # Rajesh Kondapalli - Write the generated test to a new file in the same directory as the source file
                test_file_path = os.path.join(root, f"{test_class_name}.java")
                with open(test_file_path, 'w', encoding='utf-8') as test_file:
                    test_file.write(test_file_content)
                
                print(f"Generated test for {file_path} -> {test_file_path}")

# Rajesh Kondapalli - Example usage:
base_folder = '/path/to/your/springboot/project/src/main/java'
generate_unit_tests_for_folder(base_folder)
