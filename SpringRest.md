To set up a Spring REST controller with payload validation, security, and Swagger documentation, you can follow these steps:

### 1. **Setting Up Spring Boot**

First, ensure you have a Spring Boot project. You can create one using Spring Initializr (https://start.spring.io/) with the following dependencies:

- Spring Web
- Spring Boot Starter Validation
- Spring Security
- Spring Boot Starter Data JPA (if you're working with databases)
- Swagger (Springfox or SpringDoc for OpenAPI)

### 2. **Create a REST Controller with Payload Validation**

Define a REST controller in your Spring Boot application. To validate the incoming request payload, use the `@Valid` annotation along with JSR-303/JSR-380 validation annotations.

**Example:**

```java
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {

    @PostMapping
    public ResponseEntity<String> createUser(@Valid @RequestBody UserDto userDto) {
        // Handle your business logic here
        return new ResponseEntity<>("User created successfully", HttpStatus.CREATED);
    }

    // Define other endpoints here
}

// DTO with validation constraints
class UserDto {

    @NotEmpty(message = "Name must not be empty")
    @Size(min = 2, max = 30, message = "Name must be between 2 and 30 characters")
    private String name;

    @NotEmpty(message = "Email must not be empty")
    @Size(min = 5, max = 50, message = "Email must be between 5 and 50 characters")
    private String email;

    // Getters and setters
}
```

### 3. **Setting Up Security**

Spring Security is a powerful and highly customizable authentication and access-control framework. You can set up basic security configurations using `WebSecurityConfigurerAdapter`.

**Example:**

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
            .antMatchers("/api/**").authenticated() // Secure all /api/ endpoints
            .anyRequest().permitAll()
            .and()
            .httpBasic(); // Use Basic authentication

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // In-memory user store, replace with your own authentication logic
        var user = User.withUsername("user")
            .password("{noop}password") // {noop} is needed to specify no encoding is done for the password
            .roles("USER")
            .build();
        
        return new InMemoryUserDetailsManager(user);
    }
}
```

### 4. **Adding Swagger Documentation**

Swagger (OpenAPI) allows you to document and test your APIs easily. Springfox or SpringDoc are popular libraries to integrate Swagger with Spring Boot.

#### **Using Springfox:**

Add the dependency in your `pom.xml`:

```xml
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-boot-starter</artifactId>
    <version>3.0.0</version>
</dependency>
```

Configure Swagger in your application:

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.example.demo"))
                .paths(PathSelectors.any())
                .build();
    }
}
```

Swagger UI will be accessible at `http://localhost:8080/swagger-ui/`.

#### **Using SpringDoc OpenAPI:**

Add the dependency in your `pom.xml`:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-ui</artifactId>
    <version>1.6.14</version>
</dependency>
```

No additional configuration is required for SpringDoc. The OpenAPI documentation will be accessible at `http://localhost:8080/swagger-ui.html`.

### 5. **Testing Your Setup**

1. Start your Spring Boot application.
2. Access Swagger UI to interact with your API.
3. Ensure your security configuration is working as expected (e.g., using the provided username and password).

### Conclusion

By following these steps, you will have a Spring Boot REST application with payload validation, basic security, and Swagger documentation. This setup provides a good foundation for developing secure and well-documented APIs.