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
            new Test("rajesh-8"),
            new Test("rajesh-10"),
            new Test("rajesh-9"),
            new Test("rajesh-1"),
            new Test("rajesh-100")
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
