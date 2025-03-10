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
