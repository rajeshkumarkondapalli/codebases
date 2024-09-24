<dependencies>
    <!-- Spring Data MongoDB -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-mongodb</artifactId>
    </dependency>

    <!-- Spring Boot Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

    <!-- Embedded MongoDB for testing -->
    <dependency>
        <groupId>de.flapdoodle.embed</groupId>
        <artifactId>de.flapdoodle.embed.mongo</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>



@Document(collection = "deviceInventory")
public class DeviceInventory {

    @Id
    private String id;

    private String name;
    private List<Connection> connections;

    // getters and setters

    public static class Connection {
        private String protocol;
        private String connectionStatus;
        private String role;
        // other fields, getters and setters
    }
}



@SpringBootTest
@AutoConfigureDataMongo
public class DeviceInventoryServiceTest {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private DeviceInventoryService deviceInventoryService;

    @BeforeEach
    public void setUp() {
        mongoTemplate.dropCollection(DeviceInventory.class); // Clean up collection before each test
        DeviceInventory deviceInventory = new DeviceInventory();
        deviceInventory.setName("Device1");

        // Adding initial connections to the device
        DeviceInventory.Connection connection = new DeviceInventory.Connection();
        connection.setProtocol("NETCONF");
        connection.setRole("CONFIG");
        connection.setConnectionStatus("UNKNOWN");

        deviceInventory.setConnections(List.of(connection));
        mongoTemplate.save(deviceInventory);
    }

    @Test
    public void testUpdateDeviceToInventoryConnectionStatus() {
        // Call the service method to update the connection status
        deviceInventoryService.updateDeviceToInventoryConnectionStatus("Device1", "CONNECTED");

        // Fetch the updated document from MongoDB
        DeviceInventory updatedDevice = mongoTemplate.findOne(
            Query.query(Criteria.where("name").is("Device1")), DeviceInventory.class);

        assertNotNull(updatedDevice);
        assertEquals("CONNECTED", updatedDevice.getConnections().get(0).getConnectionStatus());
    }
}





Here's the updated code using Lombok to reduce boilerplate code for settings, getters, and other utility methods.

1. Add Lombok Dependency:
First, add Lombok to your pom.xml:

xml

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <scope>provided</scope>
</dependency>
2. Entity Class (Using Lombok):
Update the DeviceInventory class to use Lombok annotations for generating getters, setters, and constructors automatically.

java

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "deviceInventory")
@Data  // Lombok annotation to generate getters, setters, equals, hashCode, and toString
@NoArgsConstructor  // Lombok to generate a no-args constructor
@AllArgsConstructor // Lombok to generate a constructor with all fields
public class DeviceInventory {

    @Id
    private String id;
    private String name;
    private List<Connection> connections;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Connection {
        private String protocol;
        private String connectionStatus;
        private String role;
        // other fields, Lombok will generate getters and setters automatically
    }
}
3. Service Class:
The DeviceInventoryService class doesn't need any changes for Lombok, as it's only performing the update logic.

java

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.query.UpdateOptions;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DeviceInventoryService {

    @Autowired
    private MongoTemplate mongoTemplate;

    public void updateDeviceToInventoryConnectionStatus(String deviceName, String deviceConnectionStatus) {
        Query query = new Query(Criteria.where("name").is(deviceName));
        Update update = new Update();
        update.set("connections.$[elem].connectionStatus", deviceConnectionStatus);

        // Array filter to update the specific connection
        UpdateOptions options = new UpdateOptions().arrayFilters(List.of(Criteria.where("elem.role").is("CONFIG")));

        mongoTemplate.updateFirst(query, update, options, DeviceInventory.class);
    }
}
4. Test Class (Using Lombok):
The DeviceInventoryServiceTest class remains the same, except now we benefit from Lombok’s automatic generation of getters, setters, and constructors.

java

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class DeviceInventoryServiceTest {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private DeviceInventoryService deviceInventoryService;

    @BeforeEach
    public void setUp() {
        mongoTemplate.dropCollection(DeviceInventory.class); // Clean up collection before each test

        // Create a new DeviceInventory object with a connection
        DeviceInventory.Connection connection = new DeviceInventory.Connection("NETCONF", "UNKNOWN", "CONFIG");
        DeviceInventory deviceInventory = new DeviceInventory(null, "Device1", List.of(connection));

        // Save the deviceInventory object in MongoDB
        mongoTemplate.save(deviceInventory);
    }

    @Test
    public void testUpdateDeviceToInventoryConnectionStatus() {
        // Call the service method to update the connection status
        deviceInventoryService.updateDeviceToInventoryConnectionStatus("Device1", "CONNECTED");

        // Fetch the updated document from MongoDB
        DeviceInventory updatedDevice = mongoTemplate.findOne(
            Query.query(Criteria.where("name").is("Device1")), DeviceInventory.class);

        assertNotNull(updatedDevice);
        assertEquals("CONNECTED", updatedDevice.getConnections().get(0).getConnectionStatus());
    }
}
