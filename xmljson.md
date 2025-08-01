    // Add produces/consumes to each operation
    paths.fields().forEachRemaining(pathEntry -> {
        ObjectNode pathItem = (ObjectNode) pathEntry.getValue();
        pathItem.fields().forEachRemaining(operationEntry -> {
            ObjectNode operation = (ObjectNode) operationEntry.getValue();
            
            // Add produces
            ArrayNode produces = mapper.createArrayNode();
            produces.add(APPLICATION_JSON);
            produces.add(APPLICATION_XML);
            operation.set("produces", produces);
            
            // Add consumes
            ArrayNode consumes = mapper.createArrayNode();
            consumes.add(APPLICATION_JSON);
            consumes.add(APPLICATION_XML);
            operation.set("consumes", consumes);
        });
    });

    // Option 2: If you can modify the definitions
    ObjectNode definitions = swaggerObject.getDefinitions();
    definitions.fields().forEachRemaining(defEntry -> {
        ObjectNode schema = (ObjectNode) defEntry.getValue();
        if (schema.has("properties")) {
            ObjectNode properties = (ObjectNode) schema.get("properties");
            properties.fields().forEachRemaining(propEntry -> {
                ObjectNode prop = (ObjectNode) propEntry.getValue();
                if (!prop.has("xml")) {
                    ObjectNode xmlConfig = mapper.createObjectNode();
                    xmlConfig.put("name", propEntry.getKey());
                    prop.set("xml", xmlConfig);
                }
            });
        }
    });
