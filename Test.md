Test


public class Node {
    private String nodeId;
    private DatastoreLock datastoreLock;

    // Getters and setters for nodeId and datastoreLock
    public String getNodeId() {
        return nodeId;
    }

    public void setNodeId(String nodeId) {
        this.nodeId = nodeId;
    }

    public DatastoreLock getDatastoreLock() {
        return datastoreLock;
    }

    public void setDatastoreLock(DatastoreLock datastoreLock) {
        this.datastoreLock = datastoreLock;
    }
}

public class DatastoreLock {
    private boolean datastoreLockAllowed;

    // Getter and setter for datastoreLockAllowed
    public boolean isDatastoreLockAllowed() {
        return datastoreLockAllowed;
    }

    public void setDatastoreLockAllowed(boolean datastoreLockAllowed) {
        this.datastoreLockAllowed = datastoreLockAllowed;
    }
}


// Assuming you have 'deviceName' and 'restHeader' available

// 1. Create the POJO objects and set their values
DatastoreLock datastoreLock = new DatastoreLock();
datastoreLock.setDatastoreLockAllowed(false);

Node node = new Node();
node.setNodeId(deviceName); 
node.setDatastoreLock(datastoreLock);

// 2. Use a library like Jackson or Gson to convert POJOs to JSON
ObjectMapper objectMapper = new ObjectMapper();
List<Node> nodes = new ArrayList<>();
nodes.add(node);
String payload = objectMapper.writeValueAsString(nodes);

// 3. Set Content-Type and use the payload
HttpHeaders headers = restHeader.getHeader();
headers.setContentType(MediaType.APPLICATION_JSON);

// Now you can use 'payload' in your REST request
