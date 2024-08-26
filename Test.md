test
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import java.util.concurrent.CompletableFuture;

public class AsyncRestTemplateExample {

    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();

        // Asynchronous calls using CompletableFuture
        CompletableFuture<ResponseEntity<String>> response1 = CompletableFuture.supplyAsync(() ->
                restTemplate.getForEntity("https://api.example.com/endpoint1", String.class)
        );

        CompletableFuture<ResponseEntity<String>> response2 = CompletableFuture.supplyAsync(() ->
                restTemplate.getForEntity("https://api.example.com/endpoint2", String.class)
        );

        // Combine results using CompletableFuture.allOf()
        CompletableFuture<Void> allResponses = CompletableFuture.allOf(response1, response2);

        // Handle results after all calls complete
        allResponses.thenRun(() -> {
            System.out.println("Response 1: " + response1.join().getBody());
            System.out.println("Response 2: " + response2.join().getBody());
        });

        // Keep the main thread running to allow asynchronous tasks to complete
        try {
            Thread.sleep(1000); // Wait for a bit to allow the calls to finish
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}


To handle multiple API responses using Java's RestTemplate, you can use CompletableFuture for asynchronous processing. This allows you to make multiple API calls in parallel and handle the responses once all calls are complete.Here's an example of how to use RestTemplate to call multiple APIs and process their responses:Example CodeDependencies: Make sure to include the Spring Web dependency in your pom.xml if you're using Maven:<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>Service Class with Multiple API Calls:import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
public class ApiService {

    private final RestTemplate restTemplate;

    public ApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void callMultipleApis() throws ExecutionException, InterruptedException {
        // Asynchronous calls using CompletableFuture
        CompletableFuture<ResponseEntity<String>> response1 = CompletableFuture.supplyAsync(() -> 
            restTemplate.getForEntity("https://api.example.com/endpoint1", String.class)
        );

        CompletableFuture<ResponseEntity<String>> response2 = CompletableFuture.supplyAsync(() -> 
            restTemplate.getForEntity("https://api.example.com/endpoint2", String.class)
        );

        CompletableFuture<ResponseEntity<String>> response3 = CompletableFuture.supplyAsync(() -> 
            restTemplate.getForEntity("https://api.example.com/endpoint3", String.class)
        );

        // Combine all futures and wait for all of them to complete
        CompletableFuture<Void> allResponses = CompletableFuture.allOf(response1, response2, response3);

        // Wait for all futures to complete
        allResponses.join();

        // Process each response
        String result1 = response1.get().getBody();
        String result2 = response2.get().getBody();
        String result3 = response3.get().getBody();

        System.out.println("Response from API 1: " + result1);
        System.out.println("Response from API 2: " + result2);
        System.out.println("Response from API 3: " + result3);
    }
}Main Application or Controller to Trigger the Calls:import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public CommandLineRunner run(ApiService apiService) {
        return args -> {
            try {
                apiService.callMultipleApis();
            } catch (Exception e) {
                e.printStackTrace();
            }
        };
    }
}RestTemplate Bean Configuration:Ensure that you have a RestTemplate bean configured in your Spring Boot application:import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}ExplanationRestTemplate: This is a synchronous client provided by Spring to make HTTP requests.CompletableFuture: Allows running tasks asynchronously, making it possible to execute multiple API calls in parallel.CompletableFuture.allOf(): Combines multiple CompletableFuture instances and returns a new CompletableFuture that completes when all the given futures complete.get() Method: Retrieves the result of the computation when it is done, blocking if necessary until it is available.By using this approach, you can efficiently call multiple APIs in parallel and handle their responses without blocking the main thread for each API call.
