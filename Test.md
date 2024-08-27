import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/your-endpoint")
public class YourController {

    @GetMapping
    public void yourMethod(HttpServletResponse response) throws IOException {
        HttpMethod httpMethod = getRequestType(command.getRequestType());
        List<String> combinedResponses = new ArrayList<>();
        int finalStatus = HttpServletResponse.SC_OK; // Default to 200 OK

        for (String podId : odlPods) {
            ResponseEntity<String> responseEntity = invokeRequest(podId, deviceName, httpMethod);

            if (responseEntity != null) {
                combinedResponses.add(responseEntity.getBody());

                // Check if the response status is 4xx or 5xx
                if (responseEntity.getStatusCode().is4xxClientError() || responseEntity.getStatusCode().is5xxServerError()) {
                    finalStatus = responseEntity.getStatusCodeValue(); // Update final status if any request fails
                }

                LOG.info(responseEntity.getStatusCode() + " - " + responseEntity.getBody());
            }
        }

        // Convert combined responses to JSON format
        String jsonResponseBody = convertToJson(combinedResponses);

        // Set the response content type to application/json
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(finalStatus);

        // Write the JSON response body to the HttpServletResponse
        response.getWriter().write(jsonResponseBody);
    }

    private String convertToJson(List<String> responses) {
        StringBuilder jsonBuilder = new StringBuilder();
        jsonBuilder.append("["); // Start of JSON array
        for (int i = 0; i < responses.size(); i++) {
            jsonBuilder.append("\"").append(responses.get(i).replace("\"", "\\\"")).append("\""); // Escape quotes
            if (i < responses.size() - 1) {
                jsonBuilder.append(",");
            }
        }
        jsonBuilder.append("]"); // End of JSON array
        return jsonBuilder.toString();
    }

    // Your existing methods like getRequestType, resp, etc.
}
