https://freemarker.apache.org/

assign
attempt, recover
autoesc
compress
escape, noescape (deprecated)
flush
ftl
function, return
global
if, else, elseif
import
include
list, else, items, sep, break, continue
local
macro, nested, return
noautoesc
noparse
nt
outputformat
setting
stop
switch, case, default, break
t, lt, rt
User-defined directive (<@...>)
visit, recurse, fallback




Debugging FreeMarker Template Language (FTL) can be a bit challenging, as errors are often reported during template processing. Here are some tips and techniques to make debugging FTL templates easier:

1. Enable Exception Handling and Error Messages
FreeMarker provides detailed error messages by default, which can be invaluable for debugging.

Ensure that error messages are properly captured in your application’s logs. Typically, errors will include line numbers, the problematic variable, and the specific issue.

Wrap template processing code in a try-catch block to handle and log exceptions:

java
Copy code
try {
    Template template = cfg.getTemplate("template.ftl");
    Writer out = new StringWriter();
    template.process(data, out);
} catch (TemplateException | IOException e) {
    e.printStackTrace(); // Log the error message
}
2. Use ?dump to Inspect Variables
The ?dump built-in operator in FTL can output the structure and contents of an entire variable, which is very helpful for inspecting data at runtime.

This is useful if you're unsure of the data format or structure passed to the template.

plaintext
Copy code
${data?dump}
This will print out all key-value pairs in a map, or the structure of an object, making it easier to see what data is available.

3. Conditional Debugging with #if Statements
Use #if statements to print specific debug information without modifying the template's main functionality.

plaintext
Copy code
<#if data.someKey?exists>
    Debug: someKey = ${data.someKey}
</#if>
Check if a variable exists using ?exists, and output its value only when available to prevent errors if the variable is missing.

4. Logging in Templates
You can add log statements in FreeMarker templates to print messages for debugging purposes.

Use ${"Message to log"!} to add inline logging messages, which will be shown in the output.

plaintext
Copy code
${"Starting the template processing!"!}
5. Use ?default and ! for Fallback Values
Often, FreeMarker errors arise from undefined variables. To prevent this, use the ?default operator to specify fallback values:

plaintext
Copy code
${data.name?default("Unknown")}
Alternatively, use the ! operator, which acts similarly to ?default but only in output expressions:

plaintext
Copy code
${data.name!"Unknown"}
6. Check Types Using ?is_<type> Built-Ins
FreeMarker provides type-checking built-ins like ?is_number, ?is_string, and ?is_boolean to verify types before using data in a specific way. This is helpful when working with mixed data types:

plaintext
Copy code
<#if data.age?is_number>
    Age is ${data.age}
<#else>
    Error: age is not a number
</#if>
7. Add Debugging Macros
Define reusable macros to help with debugging specific data structures or outputs:

plaintext
Copy code
<#macro debug var>
    ${var?dump}
</#macro>

<@debug var=data/>
8. Use Template Testing Tools
Some IDEs (like IntelliJ IDEA) have built-in FreeMarker support with syntax highlighting and basic error checking.
Use a testing tool to load the template in isolation with different data sets. This can help identify issues before integrating it into your application.
9. Debugging null Values with ?has_content
Use ?has_content to check if a variable exists and has content (i.e., is not null or empty). This helps when trying to use variables that may be null.

plaintext
Copy code
<#if data.description?has_content>
    Description: ${data.description}
<#else>
    No description available.
</#if>
10. FreeMarker Developer Tools (Debug Environment)
FreeMarker offers a "Template Debugger" mode that allows you to inspect template execution when working in a debugging environment (e.g., IntelliJ or Eclipse).
This debugger lets you step through template processing, set breakpoints, and inspect variables.
By combining these debugging techniques, you can identify and resolve issues in FTL templates effectively. Let me know if you need additional examples or specific debugging tips!







