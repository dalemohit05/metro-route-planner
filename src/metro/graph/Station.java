package metro.graph;

/**
 * Represents a metro station.
 */
public class Station {

    private final int    id;
    private final String name;
    private final String line;

    public Station(int id, String name, String line) {
        this.id   = id;
        this.name = name;
        this.line = line;
    }

    public int    getId()   { return id; }
    public String getName() { return name; }
    public String getLine() { return line; }

    @Override
    public String toString() {
        return name + " [" + line + "]";
    }
}
