import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class RestExchangeExample {
    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://your-api-endpoint.com/your-endpoint"; // Replace with your endpoint URL

        // Set up headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        // Create the payload
        String payload = "{\n" +
                "  \"netop:node\": [\n" +
                "    {\n" +
                "      \"no-id\": \"AB\",\n" +
                "      \"dalk\": {\n" +
                "        \"dalkaed\": false\n" +
                "      }\n" +
                "    }\n" +
                "  ]\n" +
                "}";

        // Create the request entity
        HttpEntity<String> requestEntity = new HttpEntity<>(payload, headers);

        // Execute the PUT request
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, requestEntity, String.class);

        // Check the response
        if (response.getStatusCode() == HttpStatus.OK) {
            System.out.println("Request successful: " + response.getBody());
        } else {
            System.out.println("Request failed: " + response.getStatusCode());
        }
    }
}