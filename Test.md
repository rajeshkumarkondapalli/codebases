test

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class NodePOJO {

    @JsonProperty("netconf-node-optional:node")
    private List<Node> nodes;

    // Getters and Setters

    public List<Node> getNodes() {
        return nodes;
    }

    public void setNodes(List<Node> nodes) {
        this.nodes = nodes;
    }

    public static class Node {
        @JsonProperty("node-id")
        private String nodeId;

        @JsonProperty("datastore-lock")
        private DatastoreLock datastoreLock;

        // Getters and Setters

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

    public static class DatastoreLock {
        @JsonProperty("datastore-lock-allowed")
        private boolean datastoreLockAllowed;

        // Getters and Setters

        public boolean isDatastoreLockAllowed() {
            return datastoreLockAllowed;
        }

        public void setDatastoreLockAllowed(boolean datastoreLockAllowed) {
            this.datastoreLockAllowed = datastoreLockAllowed;
        }
    }
}