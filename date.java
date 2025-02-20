
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class LastUpdateComparison {
    public static void main(String[] args) {
        String lastUpdatedDate1 = "2025-02-11 17:24:51+0000";
        String lastUpdatedDate2 = "2025-02-20 15:32:28+0000";

        if (isDifferenceWithinFiveMinutes(lastUpdatedDate1, lastUpdatedDate2)) {
            System.out.println("The difference between the two timestamps is 5 minutes or less.");
        } else {
            System.out.println("The difference between the two timestamps is more than 5 minutes.");
        }
    }

    private static boolean isDifferenceWithinFiveMinutes(String date1, String date2) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ssX")
                .withZone(ZoneOffset.UTC);

        Instant time1 = ZonedDateTime.parse(date1, formatter).toInstant();
        Instant time2 = ZonedDateTime.parse(date2, formatter).toInstant();

        Duration duration = Duration.between(time1, time2);

        return Math.abs(duration.toMinutes()) <= 5;
    }
}




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