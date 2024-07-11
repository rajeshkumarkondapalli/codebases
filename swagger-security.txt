server:
  port: 8080

spring:
  application:
    name: your-application-name

# Spring Security Configuration
spring:
  security:
    user:
      name: user
      password: password
    basic:
      enabled: true

# Swagger (springdoc-openapi) Configuration
springdoc:
  swagger-ui:
    path: /swagger-ui.html  # Customize the Swagger UI path
  api-docs:
    path: /v3/api-docs       # Customize the API docs path

# Actuator endpoints (optional)
management:
  endpoints:
    web:
      exposure:
        include: "*"



import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api")
public class ExampleController {

    @Operation(summary = "Get example data")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful operation"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/example")
    public String getExample() {
        return "Example data";
    }
}


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springdoc.core.GroupedOpenApi;
import org.springdoc.core.SwaggerUiConfigParameters;

@Configuration
@EnableWebSecurity
public class SwaggerConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            .antMatchers("/swagger-ui/**", "/swagger-ui.html").permitAll() // Allow access to Swagger UI
            .anyRequest().authenticated()
            .and()
            .httpBasic();
    }

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("api")
                .pathsToMatch("/api/**")
                .build();
    }

    @Bean
    public SwaggerUiConfigParameters swaggerUiConfigParameters() {
        return new SwaggerUiConfigParameters();
    }
}


<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-ui</artifactId>
    <version>1.6.5</version> <!-- Check for the latest version -->
</dependency>

