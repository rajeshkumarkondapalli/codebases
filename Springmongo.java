import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;




@Service
public class Springmongo {

    @Autowired
    private MongoTemplate mongoTemplate;

    public void updateStatusToNone(String deviceName) {
        Query query = new Query();
        query.addCriteria(Criteria.where("device.name").is(deviceName));

        Update update = new Update();
        update.set("device.connections.$.status", "none");

        mongoTemplate.updateFirst(query, update, "devices");
    }

    Query query = new Query(Criteria.where("name").is(deviceName));
Update update = new Update();
update.set("connections.$[elem].connection-status", deviceConnectionStatus);

// Add the array filter to target the right element in the 'connections' array
UpdateOptions options = new UpdateOptions().arrayFilters(List.of(Criteria.where("elem.role").is("CONFIG")));
mongoTemplate.updateFirst(query, update, options, DeviceInventory.class);

mongoTemplate.updateMulti(query, update, options, DeviceInventory.class);


UpdateOptions options = new UpdateOptions().upsert(true);
mongoTemplate.updateFirst(query, update, options, DeviceInventory.class);

}
