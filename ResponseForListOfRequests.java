import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.ArrayList;

public class BatchRequestServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Example list of requests (in practice, this could be parsed from the incoming request)
        List<String> requests = new ArrayList<>();
        requests.add("Request 1");
        requests.add("Request 2");
        requests.add("Request 3");

        // Setting the response content type
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Create a StringBuilder to hold the combined response
        StringBuilder jsonResponse = new StringBuilder();
        jsonResponse.append("[");

        // Iterate over the list of requests and process each one
        for (int i = 0; i < requests.size(); i++) {
            String req = requests.get(i);
            String processedResponse = processRequest(req);

            // Append the processed response to the JSON array
            jsonResponse.append(processedResponse);

            // Add a comma separator for all but the last element
            if (i < requests.size() - 1) {
                jsonResponse.append(",");
            }
        }

        jsonResponse.append("]");

        // Write the combined JSON response to the output
        response.getWriter().write(jsonResponse.toString());
    }

    private String processRequest(String req) {
        // Process the request and generate a response (this is just a placeholder)
        // In a real scenario, this method would contain the logic to handle each request
        return "{ \"request\": \"" + req + "\", \"status\": \"processed\" }";
    }
}
