@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle MongoDB connectivity issues
    @ExceptionHandler(org.springframework.dao.DataAccessException.class)
    public ResponseEntity<String> handleDatabaseException(DataAccessException ex) {
        return new ResponseEntity<>("Database error: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Handle Resource Not Found Exception
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    // Handle Generic Runtime Exceptions
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return new ResponseEntity<>("Internal Server Error: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}



@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getUserById(String id) {
        try {
            return userRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        } catch (DataAccessException ex) {
            throw new ApplicationException("Database connection issue. Please try again later.");
        }
    }

    public User createUser(User user) {
        try {
            return userRepository.save(user);
        } catch (DataAccessException ex) {
            throw new ApplicationException("Error connecting to database.");
        }
    }
}







@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user));
    }
}

