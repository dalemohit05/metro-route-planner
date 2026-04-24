package metro.algorithms;

import metro.datastructures.Queue;
import metro.datastructures.Stack;
import metro.graph.Graph;
import metro.graph.Graph.EdgeNode;

/**
 * Breadth-First Search that finds the path with the fewest intermediate stops.
 *
 * Uses a custom {@link Queue} (frontier) and {@link Stack} (path reconstruction).
 * No Java Collections used.
 */
public class BFS {

    private final int   numVertices;
    private final int[] prev;

    public BFS(int numVertices) {
        this.numVertices = numVertices;
        this.prev        = new int[numVertices];
    }

    // ── Core algorithm ────────────────────────────────────────────────────────

    /**
     * Run BFS from {@code source} until {@code destination} is reached.
     *
     * @return {@code true} if a path exists.
     */
    public boolean compute(Graph graph, int source, int destination) {
        boolean[] visited = new boolean[numVertices];
        for (int i = 0; i < numVertices; i++) prev[i] = -1;

        Queue<Integer> queue = new Queue<>(numVertices);
        visited[source] = true;
        queue.enqueue(source);

        while (!queue.isEmpty()) {
            int u = queue.dequeue();

            if (u == destination) return true;

            EdgeNode node = graph.getAdjList(u);
            while (node != null) {
                int v = node.edge.getDestination();
                if (!visited[v]) {
                    visited[v] = true;
                    prev[v]    = u;
                    queue.enqueue(v);
                }
                node = node.next;
            }
        }
        return false;
    }

    // ── Results ───────────────────────────────────────────────────────────────

    /**
     * Reconstruct the BFS path to {@code destination}.
     * Call only after a successful {@link #compute}.
     *
     * @return array of station IDs from source → destination.
     */
    public int[] getPath(int destination) {
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
}
