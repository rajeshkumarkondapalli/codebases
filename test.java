


You can combine both TimeoutRetryPolicy and SimpleRetryPolicy using CompositeRetryPolicy in Spring Retry. This allows you to enforce both a maximum number of attempts and a total timeout limit.


---

Example: Combining TimeoutRetryPolicy and SimpleRetryPolicy

import org.springframework.retry.support.RetryTemplate;
import org.springframework.retry.policy.TimeoutRetryPolicy;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.retry.policy.CompositeRetryPolicy;
import org.springframework.retry.backoff.FixedBackOffPolicy;

public class CombinedRetryPolicyExample {
    public static void main(String[] args) {
        RetryTemplate retryTemplate = new RetryTemplate();

        // Define SimpleRetryPolicy (Max Attempts)
        SimpleRetryPolicy simpleRetryPolicy = new SimpleRetryPolicy();
        simpleRetryPolicy.setMaxAttempts(3); // Maximum 3 retries

        // Define TimeoutRetryPolicy (Total Retry Duration)
        TimeoutRetryPolicy timeoutRetryPolicy = new TimeoutRetryPolicy();
        timeoutRetryPolicy.setTimeout(5000); // Max retry duration: 5 seconds

        // Combine both policies
        CompositeRetryPolicy compositeRetryPolicy = new CompositeRetryPolicy();
        compositeRetryPolicy.setPolicies(new org.springframework.retry.RetryPolicy[]{simpleRetryPolicy, timeoutRetryPolicy});

        // Set retry policy
        retryTemplate.setRetryPolicy(compositeRetryPolicy);

        // Set Backoff Policy (Optional)
        FixedBackOffPolicy backOffPolicy = new FixedBackOffPolicy();
        backOffPolicy.setBackOffPeriod(1000); // Wait 1 second between retries
        retryTemplate.setBackOffPolicy(backOffPolicy);

        try {
            String result = retryTemplate.execute(context -> {
                System.out.println("Attempting operation...");
                simulateOperation();
                return "Success";
            });

            System.out.println("Operation result: " + result);
        } catch (Exception e) {
            System.out.println("Operation failed after retries: " + e.getMessage());
        }
    }

    private static void simulateOperation() throws Exception {
        // Simulating failure scenario
        throw new RuntimeException("Simulated failure");
    }
}


---

How It Works

1. SimpleRetryPolicy ensures a maximum of 3 retry attempts.


2. TimeoutRetryPolicy ensures that retries do not exceed 5 seconds in total.


3. CompositeRetryPolicy combines both policies so that retries stop whenever the first condition is met (either max attempts or timeout).


4. FixedBackOffPolicy ensures a 1-second delay between retries.



Would you like additional customization, such as exponential backoff?










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