import java.util.concurrent.*;

public class ThreadExample {

    // A simple task that simulates an operation and then waits
    static class Task implements Callable<String> {
        @Override
        public String call() throws InterruptedException {
            System.out.println("Task started...");
            Thread.sleep(2000); // Simulate operation taking time
            System.out.println("Task completed.");
            return "Operation Complete";
        }
    }

    public static void main(String[] args) {
        // Create a new thread that will handle the ExecutorService and Future
        Thread workerThread = new Thread(() -> {
            try {
                // Inside the worker thread, we manage the executor and future
                ExecutorService executorService = Executors.newSingleThreadExecutor();
                
                // Submit the task
                Future<String> future = executorService.submit(new Task());
                
                // Calling thread waits for the result of the task
                System.out.println("Worker thread waiting for task to complete...");
                String result = future.get(); // This blocks the worker thread until the task is done
                
                System.out.println("Result: " + result);
                
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
