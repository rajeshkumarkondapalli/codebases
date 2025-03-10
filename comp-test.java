

import java.util.*;

class Test {
    String name;
    String usage;

    Test(String name, String usage) {
        this.name = name;
        this.usage = usage;
    }

    public String getName() {
        return name;
    }

    public String getUsage() {
        return usage;
    }

    // Static method to extract the numeric part from the name
    public static int extractNumber(Test t) {
        return Integer.parseInt(t.getName().split("-")[1]);
    }

    @Override
    public String toString() {
        return "Test{name='" + name + "', usage='" + usage + "'}";
    }
}

public class Main {
    public static void main(String[] args) {
        List<Test> list = Arrays.asList(
            new Test("test-8", "6"),
            new Test("test-10", "6"),
            new Test("test-9", "6"),
            new Test("test-1", "20"),
            new Test("test-10", "1000"),
            new Test("test-100", "30")
        );

        // Sorting based on usage (ascending), and then by numeric part of name (ascending)
        list.sort(Comparator.comparingInt((Test t) -> Integer.parseInt(t.getUsage()))
                .thenComparingInt(Test::extractNumber));

        // Printing the sorted list
        list.forEach(System.out::println);
    }
}


import java.util.*;

class Test {
    String name;

    Test(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return name;
    }

    public String getName() {
        return name;
    }
}

public class Main {
    public static void main(String[] args) {
        List<Test> list = Arrays.asList(
            new Test("test-8"),
            new Test("test-10"),
            new Test("test-9"),
            new Test("test-1"),
            new Test("test-100")
        );

        // Sort in numerical ascending order
        list.sort(Comparator.comparing(t -> Integer.parseInt(t.getName().split("-")[1])));
        System.out.println("Ascending: " + list);

        // Sort in numerical descending order
        list.sort(Comparator.comparing((Test t) -> Integer.parseInt(t.getName().split("-")[1])).reversed());
        System.out.println("Descending: " + list);
    }
}











import java.util.*;

class Test {
    String name;
    int value;

    Test(String name, int value) {
        this.name = name;
        this.value = value;
    }

    @Override
    public String toString() {
        return name + ": " + value;
    }
}

public class Main {
    public static void main(String[] args) {
        List<Test> list = Arrays.asList(
            new Test("test1", 0),
            new Test("test2", 0),
            new Test("test8", 0),
            new Test("test9", 0),
            new Test("test10", 0)
        );

        // Sorting in ascending order
        list.sort(Comparator.comparing((Test t) -> t.value));

        System.out.println(list);
    }
}
