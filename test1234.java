import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class GenericService<T, ID> {

    private final GenericDao<T, ID> dao;

    public GenericService(GenericDao<T, ID> dao) {
        this.dao = dao;
    }

    public boolean save(T entity) {
        try {
            dao.save(entity);
            return true;
        } catch (Exception e) {
            // Log error and return false indicating failure
            System.err.println("Error saving entity: " + e.getMessage());
            return false;
        }
    }

    public boolean update(T entity) {
        try {
            dao.update(entity);
            return true;
        } catch (Exception e) {
            System.err.println("Error updating entity: " + e.getMessage());
            return false;
        }
    }

    public boolean delete(ID id) {
        try {
            dao.delete(id);
            return true;
        } catch (Exception e) {
            System.err.println("Error deleting entity: " + e.getMessage());
            return false;
        }
    }

    public Optional<T> get(ID id) {
        try {
            return Optional.ofNullable(dao.get(id));
        } catch (Exception e) {
            System.err.println("Error fetching entity: " + e.getMessage());
            return Optional.empty();
        }
    }

    public List<T> getAll() {
        try {
            List<T> list = dao.getAll(); // Assuming a getAll() method exists
            return list != null ? list : Collections.emptyList();
        } catch (Exception e) {
            System.err.println("Error fetching all entities: " + e.getMessage());
            return Collections.emptyList();
        }
    }
}