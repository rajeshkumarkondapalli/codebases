public Map<String, String> getProtocolManagementMap() {
        Map<String, String> protocolMap = new HashMap<>();
        if (connections != null) {
            for (Connection conn : connections) {
                String protocol = conn.getProtocol();
                String managementEntity = conn.getManagementEntity() != null ? conn.getManagementEntity() : "";
                protocolMap.put(protocol, managementEntity);
            }
        }
        return protocolMap;
    }
