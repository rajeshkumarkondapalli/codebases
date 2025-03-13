import java.util.concurrent.*;

public class ThreadExample {

    class Task implements Callable<String> {
        private String input;
        private final int maxRetries = 3; // Maximum number of retries
        private final int baseSleepTime = 1000; // Initial sleep time in milliseconds

        public Task(String input) {
            this.input = input;
        }

        @Override
        public String call() throws InterruptedException {
            int attempt = 0;
            while (attempt < maxRetries) {
                try {
                    System.out.println("Attempt " + (attempt + 1) + ": Processing input: " + input);
                    
                    // Simulating an IO operation that may fail
                    if (Math.random() < 0.5) { // 50% chance of failure
                        throw new RuntimeException("Simulated IO failure");
                    }

                    System.out.println("Task completed successfully with input: " + input);
                    return input.toUpperCase(); // Process the input and return result
                } catch (Exception e) {
                    System.out.println("Error: " + e.getMessage() + " | Retrying...");
                    Thread.sleep(baseSleepTime * (1 << attempt)); // Exponential backoff (1s, 2s, 4s)
                    attempt++;
                }
            }
            return "Failed after " + maxRetries + " attempts";
        }
    }

    public static void main(String[] args) {
        ThreadExample example = new ThreadExample();
        String inputString = "Hello, world!";

        Thread workerThread = new Thread(() -> {
            try {
                ExecutorService executorService = Executors.newSingleThreadExecutor();
                Future<String> future = executorService.submit(example.new Task(inputString));

                System.out.println("Worker thread waiting for task to complete...");
                String result = future.get(); // Blocks until the task is done

                System.out.println("Processed Result: " + result);
                executorService.shutdown();
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
            }
        });

        workerThread.start();

        try {
            workerThread.join(); // Main thread waits for the worker thread
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("Main thread finished.");
    }
}


import java.util.concurrent.*;

public class ThreadExample {

    // A simple task that takes a String, processes it, and returns a modified String
    class Task implements Callable<String> {
        private String input; // Non-final input string

        // Constructor that takes an input string
        public Task(String input) {
            this.input = input;
        }

        @Override
        public String call() throws InterruptedException {
            System.out.println("Task started with input: " + input);
            Thread.sleep(2000); // Simulate some operation
            String processedResult = input.toUpperCase(); // Example of processing (convert to uppercase)
            System.out.println("Task completed with result: " + processedResult);
            return processedResult;
        }
    }

    public static void main(String[] args) {
        // Create an instance of the enclosing class (ThreadExample)
        ThreadExample example = new ThreadExample();

        // Input string to pass to the task
        String inputString = "Hello, world!";

        // Create a new thread that will handle the ExecutorService and Future
        Thread workerThread = new Thread(() -> {
            try {
                // Inside the worker thread, we manage the executor and future
                ExecutorService executorService = Executors.newSingleThreadExecutor();
                
                // Submit the task with input string
                Future<String> future = executorService.submit(example.new Task(inputString));
                
                // Worker thread waits for the result of the task
                System.out.println("Worker thread waiting for task to complete...");
                String result = future.get(); // This blocks the worker thread until the task is done
                
                System.out.println("Processed Result: " + result);
                
                executorService.shutdown(); // Shut down the executor service after the task is done
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
            }
        });
        
        // Start the worker thread
        workerThread.start();
        
        // Wait for the worker thread to finish
        try {
            workerThread.join(); // This blocks the main thread until the worker thread finishes
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        System.out.println("Main thread finished.");
    }
}
