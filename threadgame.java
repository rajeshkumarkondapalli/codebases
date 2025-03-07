import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

class StringCheckerTask implements Runnable {
    private String result;

    @Override
    public void run() {
        while (true) {
            result = checkString();
            if (result != null && !result.isEmpty()) {
                System.out.println("Valid string found: " + result);
                break; // Exit loop when a valid string is found
            }
            System.out.println("Waiting for a valid string...");
            try {
                Thread.sleep(1000); // Wait 1 second before retrying
            } catch (InterruptedException e) {
                System.out.println("Thread interrupted. Stopping...");
                break;
            }
        }
    }

    public String getResult() {
        return result;
    }

    // Simulated method that sometimes returns null or empty string
    private String checkString() {
        if (Math.random() > 0.8) {
            return "Hello, World!";
        }
        return ""; // Or return null
    }
}

public class StringChecker {
    public static void main(String[] args) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        StringCheckerTask task = new StringCheckerTask();
        Future<?> future = executor.submit(task); // Submit the task to the executor

        try {
            future.get(); // Block main thread until task completes
        } catch (Exception e) {
            System.out.println("Error occurred: " + e.getMessage());
        }

        executor.shutdown(); // Shut down the executor after task completion
        System.out.println("Main thread resumes. Final Result: " + task.getResult());
    }
}
