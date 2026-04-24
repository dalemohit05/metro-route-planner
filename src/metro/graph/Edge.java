package metro.graph;

/**
 * Weighted directed edge in the metro graph.
 * Each edge carries distance (km), travel time (min), fare cost (₹), and metro line name.
 */
public class Edge {

    private final int    destination;
    private final int    distance;     // km
    private final int    time;         // minutes
    private final int    cost;         // rupees
    private final String line;

    public Edge(int destination, int distance, int time, int cost, String line) {
        this.destination = destination;
        this.distance    = distance;
        this.time        = time;
        this.cost        = cost;
        this.line        = line;
    }

    public int    getDestination() { return destination; }
    public int    getDistance()    { return distance; }
    public int    getTime()        { return time; }
    public int    getCost()        { return cost; }
    public String getLine()        { return line; }
}
