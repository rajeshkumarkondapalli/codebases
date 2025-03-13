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
