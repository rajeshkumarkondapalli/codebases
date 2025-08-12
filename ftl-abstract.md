Has an abstract Java class and two implementation classes

Passes them to FreeMarker templates

Uses an #include approach in FTL so you can switch implementations like in your example

Project Structure
css
Copy
Edit
springboot-ftl-include/
 ├─ src/main/java/com/example/demo/
 │   ├─ DemoApplication.java
 │   ├─ service/
 │   │    ├─ AbstractCalc.java
 │   │    ├─ AddCalc.java
 │   │    ├─ MultiplyCalc.java
 │   └─ controller/
 │        └─ CalcController.java
 ├─ src/main/resources/
 │   ├─ templates/
 │   │    ├─ AbstractBase.ftl
 │   │    ├─ AddCalc.ftl
 │   │    ├─ MultiplyCalc.ftl
 │   │    └─ main.ftl
 │   └─ application.properties
 └─ pom.xml
1. pom.xml
xml
Copy
Edit
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>springboot-ftl-include</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>Spring Boot FTL Include Example</name>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.5</version>
    </parent>

    <dependencies>
        <!-- Spring Boot Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- FreeMarker -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-freemarker</artifactId>
        </dependency>
    </dependencies>
</project>
2. AbstractCalc.java
java
Copy
Edit
package com.example.demo.service;

public abstract class AbstractCalc {
    public abstract int calculate(int a, int b);
}
3. AddCalc.java
java
Copy
Edit
package com.example.demo.service;

public class AddCalc extends AbstractCalc {
    @Override
    public int calculate(int a, int b) {
        return a + b;
    }
}
4. MultiplyCalc.java
java
Copy
Edit
package com.example.demo.service;

public class MultiplyCalc extends AbstractCalc {
    @Override
    public int calculate(int a, int b) {
        return a * b;
    }
}
5. CalcController.java
java
Copy
Edit
package com.example.demo.controller;

import com.example.demo.service.AddCalc;
import com.example.demo.service.MultiplyCalc;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CalcController {

    @GetMapping("/calc")
    public String calculate(Model model) {
        // Choose which implementation you want here
        AddCalc addCalc = new AddCalc();
        MultiplyCalc multiplyCalc = new MultiplyCalc();

        model.addAttribute("a", 10);
        model.addAttribute("b", 5);
        model.addAttribute("addResult", addCalc.calculate(10, 5));
        model.addAttribute("multiplyResult", multiplyCalc.calculate(10, 5));

        return "main"; // main.ftl
    }
}
6. application.properties
properties
Copy
Edit
spring.freemarker.suffix=.ftl
spring.freemarker.cache=false
spring.freemarker.template-loader-path=classpath:/templates
7. AbstractBase.ftl
ftl
Copy
Edit
<#-- AbstractBase.ftl -->
<#function calculate a b>
    <#return "Not implemented">
</#function>
8. AddCalc.ftl
ftl
Copy
Edit
<#-- AddCalc.ftl -->
<#function calculate a b>
    <#return a + b>
</#function>
9. MultiplyCalc.ftl
ftl
Copy
Edit
<#-- MultiplyCalc.ftl -->
<#function calculate a b>
    <#return a * b>
</#function>
10. main.ftl
ftl
Copy
Edit
<#-- main.ftl -->

<#-- Include base structure -->
<#include "AbstractBase.ftl">

<#-- Choose implementation -->
<#include "AddCalc.ftl">
<#-- Or -->
<#-- <#include "MultiplyCalc.ftl"> -->

<h1>Calculation Example</h1>
<p>Inputs: ${a} and ${b}</p>
<p>Result from include: ${calculate(a, b)}</p>
<p>Result from Java AddCalc: ${addResult}</p>
<p>Result from Java MultiplyCalc: ${multiplyResult}</p>
