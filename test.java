import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
public class NetworkController {

    @GetMapping("/capabilities")
    public List<Map<String, String>> getAvailableCapabilities() {
        try {
            // URL for the API
            String apiUrl = "http://example.com/api"; // Replace with your API URL

            // Fetch the API response as a String
            RestTemplate restTemplate = new RestTemplate();
            String jsonResponse = restTemplate.getForObject(apiUrl, String.class);

            // Parse the JSON string into a nested Map
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> responseMap = objectMapper.readValue(jsonResponse, new TypeReference<>() {});

            // Navigate to "available-capability"
            Map<String, Object> networkTopologyNode = (Map<String, Object>) ((List<?>) responseMap.get("network-topology:node")).get(0);
            Map<String, Object> availableCapabilities = (Map<String, Object>) networkTopologyNode.get("netconf-node-topology:available-capabilities");
            List<Map<String, String>> availableCapabilityList = (List<Map<String, String>>) availableCapabilities.get("available-capability");

            return availableCapabilityList; // Return the list
        } catch (Exception e) {
            e.printStackTrace();
            return null; // Handle exceptions appropriately
        }
    }
}