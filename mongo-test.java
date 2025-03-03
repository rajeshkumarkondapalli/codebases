import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MongoEntryService {

    @Autowired
    private MongoTemplate mongoTemplate;

    public boolean hasMatchingEntries(String deviceName) {
        Query query = new Query(Criteria.where("device-name").is(deviceName)
                .and("lock").is(false)
                .and("processed-flag").is(false)
                .and("id").regex("^.*\\+\\+" + deviceName + "$")); // Regex to match device-name at the end

        List<Object> results = mongoTemplate.find(query, Object.class, "yourCollectionName"); // Replace "yourCollectionName"

        return !results.isEmpty();
    }
}
