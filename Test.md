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
            ResponseEntity<String> responseEntity = invokeTemplate(podId, deviceName, httpMethod);

            if (responseEntity != null) {
                combinedResponses.add(responseEntity.getBody());

                // Check if the response status is 4xx or 5xx
                if (responseEntity.getStatusCode().is4xxClientError() || responseEntity.getStatusCode().is5xxServerError()) {
                    finalStatus = responseEntity.getStatusCodeValue(); // Update final status if any request fails
                }

                LOG.info(responseEntity.getStatusCode() + " - " + responseEntity.getBody());
            }
        }

        // Combine all responses into a single string with a chosen delimiter (e.g., newline)
        String combinedResponseBody = String.join("\n", combinedResponses);

        // Set the final status code
        response.setStatus(finalStatus);

        // Write the combined response body to the HttpServletResponse
        response.getWriter().write(combinedResponseBody);
    }

    // Your existing methods like getRequestType, invokeOdlRequest, etc.
}
