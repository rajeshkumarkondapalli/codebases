import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;


// {
//   "device": {
//     "name": "sonoo",
//     "vendor": "test",
//     "model": "123",
//     "connections": [
//       {
//         "name": "con1",
//         "status": "connected"
//       }
//     ]
//   }
// }



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
}
