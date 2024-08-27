// Custom class to hold request URL and response body
class RequestResponse {
    private String url;
    private String responseBody;

    public RequestResponse(String url, String responseBody) {
        this.url = url;
        this.responseBody = responseBody;
    }

    public String getUrl() {
        return url;
    }

    public String getResponseBody() {
        return responseBody;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setResponseBody(String responseBody) {
        this.responseBody = responseBody;
    }
}




import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper; // Jackson library for JSON conversion

@RestController
@RequestMapping("/your-endpoint")
public class YourController {

    @GetMapping
    public void yourMethod(HttpServletResponse response) throws IOException {
        HttpMethod httpMethod = getRequestType(command.getRequestType());
        List<RequestResponse> combinedResponses = new ArrayList<>();
        int finalStatus = HttpServletResponse.SC_OK; // Default to 200 OK

        for (String podId : testPods) {
            ResponseEntity<String> responseEntity = invoketestRequest(podId, deviceName, httpMethod);

            if (responseEntity != null) {
                // Assuming 'invoketestRequest' method returns the URL or you can construct it manually
                String requestUrl = constructRequestUrl(podId, deviceName, httpMethod);

                combinedResponses.add(new RequestResponse(requestUrl, responseEntity.getBody()));

                // Check if the response status is 4xx or 5xx
                if (responseEntity.getStatusCode().is4xxClientError() || responseEntity.getStatusCode().is5xxServerError()) {
                    finalStatus = responseEntity.getStatusCodeValue(); // Update final status if any request fails
                }

                LOG.info(responseEntity.getStatusCode() + " - " + responseEntity.getBody());
            }
        }

        // Convert combined responses to JSON format using Jackson
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResponseBody = objectMapper.writeValueAsString(combinedResponses);

        // Set the response content type to application/json
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(finalStatus);

        // Write the JSON response body to the HttpServletResponse
        response.getWriter().write(jsonResponseBody);
    }

    private String constructRequestUrl(String podId, String deviceName, HttpMethod httpMethod) {
        // Construct the request URL based on the parameters. This is a placeholder implementation.
        // Adjust as per your actual URL construction logic.
        return "http://your-service-url/" + podId + "/" + deviceName + "?method=" + httpMethod.name();
    }

    // Your existing methods like getRequestType, invoketestRequest, etc.
}
