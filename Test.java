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
