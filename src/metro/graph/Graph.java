package metro.graph;

/**
 * Undirected weighted graph using an adjacency list of singly-linked {@link EdgeNode}s.
 * No Java Collections used.
 */
public class Graph {

    private final int        numVertices;
    private final EdgeNode[] adjacencyList;

    // ── Public inner node (algorithms traverse it directly) ───────────────────

    public static class EdgeNode {
        public final Edge edge;
        public EdgeNode   next;

        public EdgeNode(Edge edge) {
            this.edge = edge;
            this.next = null;
        }
    }

    // ── Constructor ───────────────────────────────────────────────────────────

    public Graph(int numVertices) {
        this.numVertices   = numVertices;
        this.adjacencyList = new EdgeNode[numVertices];
    }

    // ── Mutation ──────────────────────────────────────────────────────────────

    /**
     * Add an undirected (bidirectional) edge between {@code src} and {@code dst}.
     */
    public void addEdge(int src, int dst, int distance, int time, int cost, String line) {
        // src → dst
        EdgeNode n1 = new EdgeNode(new Edge(dst, distance, time, cost, line));
        n1.next            = adjacencyList[src];
        adjacencyList[src] = n1;

        // dst → src
        EdgeNode n2 = new EdgeNode(new Edge(src, distance, time, cost, line));
        n2.next            = adjacencyList[dst];
        adjacencyList[dst] = n2;
    }

    // ── Accessors ─────────────────────────────────────────────────────────────

    public EdgeNode getAdjList(int vertex) { return adjacencyList[vertex]; }
    public int      numVertices()          { return numVertices; }
}
