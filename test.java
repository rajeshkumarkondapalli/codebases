
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class RemountTask implements Runnable {

    public void run() {
        try {
            test();
            clearInProgressList();
        } catch (InterruptedException e) {
            // Log the interruption
            Thread.currentThread().interrupt(); // Restore interrupt status
        }
    }

    private void clearInProgressList() {
        QueueReader.lock.lock();
        try {
            QueueReader.inProgressGroups.remove("group");
        } finally {
            QueueReader.lock.unlock();
        }
    }

    private void test() throws InterruptedException {
        // Replace this with your actual logic
        //...

        // Example of an operation that might throw InterruptedException
        Thread.sleep(1000); 
    }
}

class QueueReader {
    public static Lock lock = new ReentrantLock();
    //... other members...
}









class SafeThread extends Thread {
    @Override
    public void run() {
        try {
            // Simulate some work
            System.out.println("Thread is running...");
            if (Math.random() > 0.5) {
                throw new RuntimeException("Simulated Exception");
            }
            System.out.println("Thread completed successfully.");
        } catch (Exception e) {
            System.err.println("Exception caught: " + e.getMessage());
        } finally {
            // Clean up resources
            System.out.println("Cleaning up resources...");
        }
    }
}

public class Main {
    public static void main(String[] args) {
        SafeThread thread = new SafeThread();
        thread.start();
    }








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