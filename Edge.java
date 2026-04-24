// ─────────────────────────────────────────────────
// Edge.java
// Represents a directed connection between two stations.
// Each edge stores THREE weights — this is what allows
// Dijkstra to be run for distance, fare, or stops
// using the same graph structure.
//
// Used as a node in the Adjacency List (Linked List)
// ─────────────────────────────────────────────────

public class Edge {
    int destination;       // index of the connected station
    double distance;       // physical distance in km
    int fare;              // ticket fare in rupees
    int stops;             // always 1 (one hop between adjacent stations)
    Edge next;             // pointer to next edge in linked list

    public Edge(int destination, double distance, int fare) {
        this.destination = destination;
        this.distance    = distance;
        this.fare        = fare;
        this.stops       = 1;
        this.next        = null;
    }
}
