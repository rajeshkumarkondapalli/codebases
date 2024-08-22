public class Main {
    public static void main(String[] args) {
        String originalString = "ODL-cisco-0.test.local";
        
        // Remove the "ODL-" prefix
        String modifiedString = originalString.replace("ODL-", "");
        
        // Split the string into parts based on the "." separator
        String[] parts = modifiedString.split("\\.");
        
        // Construct the new string "cisco-0-0.cisco-0.test.local"
        String result = parts[0] + "-0." + parts[0] + "." + parts[1] + "." + parts[2];
        
        System.out.println(result); // Output: "cisco-0-0.cisco-0.test.local"
    }
}
