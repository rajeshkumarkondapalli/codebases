import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class LastUpdateCheck {
    public static void main(String[] args) {
        String lastUpdatedDate1 = "2025-02-11 17:24:51+0000";
        String lastUpdatedDate2 = "2025-02-20 15:32:28+0000";

        checkIfWithinFiveMinutes(lastUpdatedDate1);
        checkIfWithinFiveMinutes(lastUpdatedDate2);
    }

    private static void checkIfWithinFiveMinutes(String lastUpdatedDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ssX")
                .withZone(ZoneOffset.UTC);

        Instant lastUpdateTime = ZonedDateTime.parse(lastUpdatedDate, formatter).toInstant();
        Instant now = Instant.now();

        Duration duration = Duration.between(lastUpdateTime, now);

        if (Math.abs(duration.toMinutes()) <= 5) {
            System.out.println("Last update is within 5 minutes: " + lastUpdatedDate);
        } else {
            System.out.println("Last update is NOT within 5 minutes: " + lastUpdatedDate);
        }
    }
}