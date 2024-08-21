## Debugging Apache FreeMarker Templates (FTL)

Debugging FreeMarker templates can be a bit tricky, but there are several strategies you can employ to pinpoint issues:

**1. Enable Debugging Output:**

* **`freemarker.template.debug` Property:** Set this property to `true` in your FreeMarker configuration (e.g., in your `freemarker.properties` file or in your Java code). This will print detailed debugging information to the console, including:
    * Template parsing details
    * Variable assignments and values
    * Template execution steps
    * Error messages with line numbers
* **Example Java Configuration:**
   ```java
   Configuration cfg = new Configuration(Configuration.VERSION_2_3_28);
   cfg.setDirectoryForTemplateLoading(new File("templates"));
   cfg.setDefaultEncoding("UTF-8");
   cfg.setLogTemplateExceptions(false);
   cfg.setWrapUncheckedExceptions(true);
   cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
   // Enable debugging output
   cfg.setDebug(true);
   ```

**2. Use the `#debug` Built-in:**

* **Purpose:** The `#debug` built-in allows you to print variables and expressions to the console during template execution.
* **Syntax:**
   ```ftl
   <#-- Print the value of the "name" variable -->
   <#debug "name: ${name}">
   ```
* **Example:**
    ```ftl
    <html>
    <head>
    <title>My Template</title>
    </head>
    <body>
        <h1>Hello, ${name}!</h1>
        <#debug "The name variable is: ${name}">
    </body>
    </html>
    ```

**3. Utilize the `#stop` Built-in:**

* **Purpose:** This built-in allows you to halt template execution at a specific point, which can be useful for examining the state of variables and the current template context.
* **Syntax:** `#stop`
* **Example:**
    ```ftl
    <html>
    <head>
    <title>My Template</title>
    </head>
    <body>
        <h1>Hello, ${name}!</h1>
        <#debug "The name variable is: ${name}">
        <#stop> <!-- Stop template execution here -->
        <p>This paragraph won't be rendered.</p>
    </body>
    </html>
    ```

**4. Use an IDE with FreeMarker Support:**

* **IntelliJ IDEA:** Offers excellent FreeMarker support, including syntax highlighting, code completion, and debugging tools.
* **Eclipse:** You can install the FreeMarker plugin to gain similar capabilities.
* **Visual Studio Code:** You can use the FreeMarker extension for some basic syntax highlighting and code completion.

**5. Leverage Logging Frameworks:**

* **Log4j:** Use log4j to log FreeMarker-related information, including template loading, execution, and error messages.
* **SLF4j:** Similar to Log4j, SLF4j allows you to configure logging levels and customize log output formats.

**6. Understand Error Messages:**

* **Error Locations:** FreeMarker error messages typically provide line numbers within the template file, guiding you to the problematic area.
* **Descriptive Messages:** Pay close attention to the specific error message, which often explains the reason for the failure, such as undefined variables, incorrect syntax, or missing directives.
* **Stack Traces:** In case of exceptions during template execution, examine the stack trace to identify the source of the issue.

**7. Break Down Complex Templates:**

* **Modularization:** Break down large templates into smaller, reusable components to make debugging easier.
* **Step-by-Step Testing:** Test each individual template component separately before integrating them into the larger whole.

**Remember:**

* **Thorough Understanding:** A firm understanding of FreeMarker syntax, directives, and built-ins is crucial for successful debugging.
* **Test Cases:** Write unit tests for your templates to catch potential errors early in the development cycle.
* **Documentation:** Refer to the official FreeMarker documentation for comprehensive information and examples.

By applying these debugging strategies, you can effectively troubleshoot and resolve issues in your Apache FreeMarker templates.
