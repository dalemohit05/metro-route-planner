package metro.algorithms;

import metro.datastructures.MinHeap;
import metro.datastructures.Stack;
import metro.graph.Graph;
import metro.graph.Graph.EdgeNode;

/**
 * Dijkstra's single-source shortest-path algorithm.
 * The weight function is selected by a mode constant:
 *   BY_DISTANCE – minimise total kilometres
 *   BY_TIME     – minimise total travel time
 *   BY_COST     – minimise total fare
 *
 * Uses a custom {@link MinHeap} (priority queue) and {@link Stack} (path reconstruction).
 * No Java Collections used.
 */
public class Dijkstra {

    public static final int BY_DISTANCE = 0;
    public static final int BY_TIME     = 1;
    public static final int BY_COST     = 2;

    private final int   numVertices;
    private final int[] dist;
    private final int[] prev;

    public Dijkstra(int numVertices) {
        this.numVertices = numVertices;
        this.dist        = new int[numVertices];
        this.prev        = new int[numVertices];
    }

    // ── Core algorithm ────────────────────────────────────────────────────────

    /**
     * Run Dijkstra from {@code source} using the given {@code mode}.
     * Results are accessible via {@link #getDist} and {@link #getPath}.
     */
    public void compute(Graph graph, int source, int mode) {
        boolean[] visited = new boolean[numVertices];
        for (int i = 0; i < numVertices; i++) {
            dist[i] = Integer.MAX_VALUE;
            prev[i] = -1;
        }
        dist[source] = 0;

        MinHeap heap = new MinHeap(numVertices * 4);
        heap.insert(0, source);

        while (!heap.isEmpty()) {
            int[] min = heap.extractMin();
            int   u   = min[1];

            if (visited[u]) continue;
            visited[u] = true;

            EdgeNode node = graph.getAdjList(u);
            while (node != null) {
                int v      = node.edge.getDestination();
                int weight = selectWeight(node, mode);

                if (!visited[v] && dist[u] != Integer.MAX_VALUE
                        && dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    prev[v] = u;
                    heap.insert(dist[v], v);
                }
                node = node.next;
            }
        }
    }

    // ── Results ───────────────────────────────────────────────────────────────

    /** Minimum cost (as per chosen mode) from source to {@code destination}. */
    public int getDist(int destination) {
        return dist[destination];
    }

    /**
     * Reconstruct the path from the source to {@code destination}.
     *
     * @return array of station IDs from source → destination, or empty if unreachable.
     */
    public int[] getPath(int destination) {
        if (dist[destination] == Integer.MAX_VALUE) return new int[0];

        Stack<Integer> stack = new Stack<>(numVertices);
        int curr = destination;
        while (curr != -1) {
            stack.push(curr);
            curr = prev[curr];
        }

        int[] path = new int[stack.size()];
        int   i    = 0;
        while (!stack.isEmpty()) path[i++] = stack.pop();
        return path;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private int selectWeight(EdgeNode node, int mode) {
        switch (mode) {
            case BY_DISTANCE: return node.edge.getDistance();
            case BY_TIME:     return node.edge.getTime();
            case BY_COST:     return node.edge.getCost();
            default:          return node.edge.getDistance();
        }
    }
}
