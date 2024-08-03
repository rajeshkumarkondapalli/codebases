## Advanced Apache FreeMarker Concepts with Examples

FreeMarker offers powerful features beyond basic templating. Here are some advanced concepts with illustrative examples:

**1. Custom Directives and Methods:**

* **Creating Custom Directives:** Extend FreeMarker's functionality by writing your own directives for specific tasks.

   ```java
   public class MyCustomDirective extends TemplateDirectiveModel {
       @Override
       public void execute(Environment env, Map params, TemplateModel[] loopVars, TemplateDirectiveBody body)
           throws TemplateException, IOException {
           // Access data from params map
           String name = (String) params.get("name");
           // Process data and render content
           env.getOut().write("Hello, " + name + "!");
       }
   }
   ```

   **Usage in template:**

   ```html
   <#assign myDirective = "com.example.MyCustomDirective" />
   <#myDirective name="John Doe" />
   ```

* **Defining Custom Methods:** Create reusable functions for data manipulation within templates.

   ```java
   public class MyUtils {
       public static String capitalize(String text) {
           return text.substring(0, 1).toUpperCase() + text.substring(1);
       }
   }
   ```

   **Usage in template:**

   ```html
   <#assign myUtils = "com.example.MyUtils" />
   ${myUtils.capitalize("hello world")}
   ```

**2. Macro Definitions and Recursion:**

* **Defining Macros:** Create reusable template blocks for repeated structures.

   ```html
   <#macro displayUser(user)>
       <h3>${user.name}</h3>
       <p>Email: ${user.email}</p>
   </macro>

   <#list users as user>
       <#displayUser user />
   </list>
   ```

* **Recursive Macros:** Create macros that call themselves, enabling complex structure generation.

   ```html
   <#macro recursiveList(items)>
       <#if items?size gt 0>
           <ul>
               <#list items as item>
                   <li>${item}</li>
                   <#if item?has_content>
                       <#recursiveList item>
                   </#fi>
               </</list>
           </ul>
       </#if>
   </macro>

   <#recursiveList items=[ "root", ["child1", "child2"], "sibling"] />
   ```

**3. Advanced Data Structures:**

* **Sequences and Hashes:** Work with lists and maps effectively for data management.

   ```java
   <#assign myList = ["apple", "banana", "cherry"]>
   <#list myList as item>
       ${item}
   </</list>

   <#assign myMap = { "name": "John", "age": 30 }>
   ${myMap.name} is ${myMap.age} years old.
   ```

* **Nested Data Structures:** Traverse nested objects and arrays within your templates.

   ```java
   <#assign user = { "name": "John", "address": { "street": "Main St", "city": "New York" }}>
   ${user.name} lives at ${user.address.street}, ${user.address.city}
   ```

**4. Template Inheritance and Partials:**

* **Template Inheritance:**  Define a base template with common elements, then extend it with specific content in child templates.

   **Base Template (base.ftl):**

   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>${title}</title>
   </head>
   <body>
       <header>
           <h1>My Website</h1>
       </header>
       <main>
           <@body />
       </main>
       <footer>
           Copyright &copy; 2023
       </footer>
   </body>
   </html>
   ```

   **Child Template (index.ftl):**

   ```html
   <@base title="Home">
       <h2>Welcome to our website!</h2>
   </@base>
   ```

* **Partials (Includes):** Reuse small template snippets across different templates.

   **Partial (header.ftl):**

   ```html
   <header>
       <h1>My Website</h1>
   </header>
   ```

   **Main Template:**

   ```html
   <@include "header.ftl" />
   <main>
       <!-- content -->
   </main>
   ```

**5. Error Handling and Debugging:**

* **Template Error Handling:** Use `#if ... #else` blocks to handle missing data or invalid values.

   ```html
   <#if user.name?exists>
       ${user.name}
   <#else>
       User name not available.
   </#if>
   ```

* **Debugging:** Enable FreeMarker's built-in debug mode for detailed error messages and template information.

   ```java
   Configuration cfg = new Configuration(Configuration.VERSION_2_3_30);
   cfg.setTemplateLoader(new FileTemplateLoader(new File("templates")));
   cfg.setLogTemplateExceptions(false); // Enable detailed error reporting
   cfg.setWrapUncheckedExceptions(true); // Wrap exceptions for easier handling
   ```

**6. Other Advanced Features:**

* **Custom Objects and Collections:** Create custom Java classes and collections to be used within your templates.
* **Built-in Filters:** Utilize FreeMarker's rich set of built-in filters for data manipulation and formatting.
* **Internationalization and Localization:** Implement multilingual support using FreeMarker's localization features.
* **Extending FreeMarker's Functionality:** Develop plugins and custom extensions to tailor FreeMarker to your specific needs.

These examples demonstrate just a few of FreeMarker's powerful capabilities. Explore the official documentation and online resources for a deeper dive into advanced templating techniques and further expand your FreeMarker expertise.



```ftl
<#assign myList = ["apple", "banana", "cherry"]>
<fruits>
  <#list myList as fruit>
    <fruit>${fruit}</fruit>
  </#list>
</fruits>
```

**Output XML:**

```xml
<fruits>
  <fruit>apple</fruit>
  <fruit>banana</fruit>
  <fruit>cherry</fruit>
</fruits>
```

**Explanation:**

* **<#assign myList = ["apple", "banana", "cherry"]>**: This line assigns a list of fruits to the variable `myList`.
* **<fruits>**: This line starts the `<fruits>` XML element.
* **<#list myList as fruit>**: This directive iterates over the `myList` and assigns each element to the variable `fruit`.
* **<fruit>${fruit}</fruit>**: For each iteration, this line creates a `<fruit>` element with the value of the `fruit` variable.
* **</fruits>**: This line closes the `<fruits>` XML element.

**Other FTL directives for XML generation:**

* **<#if ...> ... </#if>**: Conditional statements to generate elements based on conditions.
* **<#macro ...> ... </#macro>**: Defining reusable macros for generating repetitive XML structures.
* **<#nested> ... </#nested>**: Nested loops for generating hierarchical XML structures.

**Note:** The output XML format might vary depending on the specific FreeMarker configuration and the chosen XML library.












I can provide examples of how to use FreeMarker Template Language (FTL) to work with XPath and JSONPath.

FreeMarker Template Language (FTL) with XPath
FreeMarker doesn’t natively support XPath, but you can use it with XML data if you preprocess the XML with XPath expressions before passing it to FreeMarker. Here’s an example:

Example XML Data (data.xml):
xml
Copy code
<bookstore>
  <book>
    <title lang="en">Effective Java</title>
    <author>Joshua Bloch</author>
  </book>
  <book>
    <title lang="es">Java: Cómo Programar</title>
    <author>Deitel & Deitel</author>
  </book>
</bookstore>
Preprocess XML with XPath:
Assuming you use an XPath processor (like lxml in Python) to extract data from the XML and pass it to FreeMarker:

python
Copy code
from lxml import etree

tree = etree.parse('data.xml')
titles = tree.xpath('//book/title/text()')
FreeMarker Template (template.ftl):
ftl
Copy code
<#-- Loop through titles extracted by XPath -->
<#list titles as title>
  <p>${title}</p>
</#list>
FreeMarker Template Language (FTL) with JSONPath
For JSONPath, you would similarly preprocess the JSON data to extract the relevant pieces and pass them to FreeMarker.

Example JSON Data (data.json):
json
Copy code
{
  "store": {
    "book": [
      {
        "title": "Effective Java",
        "author": "Joshua Bloch"
      },
      {
        "title": "Java: How to Program",
        "author": "Deitel & Deitel"
      }
    ]
  }
}
Preprocess JSON with JSONPath:
Assuming you use a JSONPath processor (like jsonpath-ng in Python) to extract data from the JSON and pass it to FreeMarker:

python
Copy code
import json
from jsonpath_ng import jsonpath, parse

with open('data.json') as f:
    data = json.load(f)

jsonpath_expr = parse('$.store.book[*].title')
titles = [match.value for match in jsonpath_expr.find(data)]
FreeMarker Template (template.ftl):
ftl
Copy code
<#-- Loop through titles extracted by JSONPath -->
<#list titles as title>
  <p>${title}</p>
</#list>
In both cases, the key is to preprocess the data with XPath or JSONPath and then use FreeMarker to render it.





```json
{
  "name": "John Doe",
  "age": 30,
  "city": "New York"
}
```

**Freemarker Template (ftl):**

```ftl
<h1>Hello, ${name}!</h1>
<p>You are ${age} years old and live in ${city}.</p>
```

**Output:**

```html
<h1>Hello, John Doe!</h1>
<p>You are 30 years old and live in New York.</p>
```

**Explanation:**

1. **JSON Data:** The JSON data contains information about a person, including their name, age, and city.
2. **Freemarker Template:** The `ftl` template uses Freemarker's expression language to access the data from the JSON.
    - `${name}`: This expression retrieves the value of the "name" key from the JSON.
    - `${age}`: Retrieves the value of the "age" key.
    - `${city}`: Retrieves the value of the "city" key.
3. **Output:** When the template is processed, it replaces the expressions with the corresponding values from the JSON, generating an HTML output.

**To use this in your application:**

1. **Load the JSON data:** You can use a library like Gson or Jackson to parse the JSON string into a Java object.
2. **Create a Freemarker configuration:** Set up Freemarker with the template file.
3. **Process the template:** Pass the Java object containing the JSON data to the Freemarker template engine. This will generate the HTML output based on the template and the provided data.

**Note:** This is a simple example. You can use Freemarker's more advanced features to achieve more complex data transformations and manipulations.
