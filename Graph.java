// ─────────────────────────────────────────────────
// Graph.java
// Core of the Metro Route Planner.
//
// Structure:
//   - Adjacency List (array of linked lists of Edges)
//   - Each edge has 3 weights: distance, fare, stops
//
// Algorithms:
//   - Dijkstra  → shortest distance OR cheapest fare
//   - BFS       → fewest stops
//   - Path recovery via parent array + Stack
//
// Helper DS integrated:
//   - HashTable  → station name to index
//   - AVLTree    → alphabetical station search
//   - Stack      → path reversal
//   - Queue      → BFS
//   - MinHeap    → Dijkstra priority queue
// ────────────────────────────────────────────────

public class Graph {

    private int       totalStations;
    private String[]  stationNames;
    private String[]  stationLines;
    private Edge[]    adjList;          // adjacency list heads (linked list per station)
    private boolean[] closedStations;

    // Integrated Data Structures
    private HashTable hashTable;
    private AVLTree   avlTree;

    public Graph(int totalStations) {
        this.totalStations = totalStations;
        stationNames   = new String[totalStations];
        stationLines   = new String[totalStations];
        adjList        = new Edge[totalStations];
        closedStations = new boolean[totalStations];
        hashTable      = new HashTable();
        avlTree        = new AVLTree();
    }

    // ── Add Station ────────────────────────────────
    public void addStation(int index, String name, String line) {
        stationNames[index] = name;
        stationLines[index] = line;
        hashTable.put(name, index);  // O(1) insert into hash table
        avlTree.insert(name);        // O(log N) insert into AVL tree
    }

    // ── Add Bidirectional Route ────────────────────
    // Adds two directed edges (u→v and v→u)
    public void addRoute(int u, int v, double distance, int fare) {
        Edge e1 = new Edge(v, distance, fare);
        e1.next    = adjList[u];   // prepend to linked list
        adjList[u] = e1;

        Edge e2 = new Edge(u, distance, fare);
        e2.next    = adjList[v];
        adjList[v] = e2;
    }

    // ── Station Lookup ─────────────────────────────
    public int    getIndex(String name) { return hashTable.get(name); }
    public String getName(int index)    { return stationNames[index]; }
    public String getLine(int index)    { return stationLines[index]; }
    public boolean isValid(String name) { return hashTable.contains(name); }

    // ── Station Closure ────────────────────────────
    public void closeStation(int index) { closedStations[index] = true; }
    public void openStation(int index)  { closedStations[index] = false; }
    public boolean isClosed(int index)  { return closedStations[index]; }

    // ──────────────────────────────────────────────
    // DIJKSTRA'S ALGORITHM
    // weightType: "distance" or "fare"
    //
    // Steps:
    // 1. Set all distances to infinity, source = 0
    // 2. Use MinHeap to always pick minimum cost node
    // 3. Relax all neighbors
    // 4. Record parent for path reconstruction
    // 5. Reconstruct path using Stack (reversal)
    // ──────────────────────────────────────────────
    public int[] dijkstra(int src, int dest, String weightType) {

        double[] dist   = new double[totalStations];
        int[]    parent = new int[totalStations];
        boolean[] visited = new boolean[totalStations];

        // Initialize all distances to infinity
        for (int i = 0; i < totalStations; i++) {
            dist[i]    = Double.MAX_VALUE;
            parent[i]  = -1;
            visited[i] = false;
        }
        dist[src] = 0;

        // MinHeap: insert source with cost 0
        MinHeap pq = new MinHeap();
        pq.insert(src, 0);

        while (!pq.isEmpty()) {
            double minCost = pq.peekCost();
            int u = pq.extractStation();

            if (visited[u]) continue;
            visited[u] = true;

            // Traverse adjacency linked list of u
            Edge e = adjList[u];
            while (e != null) {
                int v = e.destination;

                if (!visited[v] && !closedStations[v]) {
                    // Pick weight based on what we're optimizing
                    double weight = weightType.equals("distance") ? e.distance : e.fare;

                    // Relaxation: if shorter path found, update
                    if (dist[u] + weight < dist[v]) {
                        dist[v]   = dist[u] + weight;
                        parent[v] = u;
                        pq.insert(v, dist[v]);
                    }
                }
                e = e.next;
            }
        }

        // No path found
        if (dist[dest] == Double.MAX_VALUE) {
            System.out.println("\n  No route available between these stations.");
            return null;
        }

        // ── Path Reconstruction using Stack ───────
        // parent array gives: dest → ... → src (backwards)
        // Stack reverses it  : src → ... → dest
        Stack stack = new Stack();
        int curr = dest;
        while (curr != -1) {
            stack.push(curr);
            curr = parent[curr];
        }

        // Convert stack to path array
        int pathLen  = stack.size();
        int[] path   = new int[pathLen];
        for (int i = 0; i < pathLen; i++) {
            path[i] = stack.pop();
        }

        // Print route
        printRoute(path, weightType, dist[dest]);

        return path;
    }

    // ──────────────────────────────────────────────
    // BFS — FEWEST STOPS
    //
    // BFS explores level by level (nearest hops first).
    // First time destination is reached = minimum hops.
    // Uses Queue (FIFO) — crucial for level-order traversal.
    // ──────────────────────────────────────────────
    public int[] bfs(int src, int dest) {

        boolean[] visited = new boolean[totalStations];
        int[]     parent  = new int[totalStations];

        for (int i = 0; i < totalStations; i++) parent[i] = -1;

        Queue queue = new Queue();
        queue.enqueue(src);
        visited[src] = true;

        boolean found = false;

        while (!queue.isEmpty() && !found) {
            int u = queue.dequeue();

            Edge e = adjList[u];
            while (e != null) {
                int v = e.destination;
                if (!visited[v] && !closedStations[v]) {
                    visited[v] = true;
                    parent[v]  = u;
                    if (v == dest) { found = true; break; }
                    queue.enqueue(v);
                }
                e = e.next;
            }
        }

        if (!found && !visited[dest]) {
            System.out.println("\n  No route available.");
            return null;
        }

        // Reconstruct path using Stack
        Stack stack = new Stack();
        int curr = dest;
        while (curr != -1) {
            stack.push(curr);
            curr = parent[curr];
        }

        int   pathLen = stack.size();
        int[] path    = new int[pathLen];
        for (int i = 0; i < pathLen; i++) {
            path[i] = stack.pop();
        }

        printRoute(path, "stops", 0);
        return path;
    }

    // ──────────────────────────────────────────────
    // PRINT ROUTE — with line change detection
    // ──────────────────────────────────────────────
    private void printRoute(int[] path, String routeType, double cost) {
        System.out.println("\n  ┌─────────────────────────────────────────────────┐");
        if      (routeType.equals("distance")) System.out.println("  │           SHORTEST DISTANCE ROUTE              │");
        else if (routeType.equals("fare"))     System.out.println("  │             CHEAPEST FARE ROUTE                │");
        else                                   System.out.println("  │            FEWEST STOPS ROUTE                  │");
        System.out.println("  └─────────────────────────────────────────────────┘");

        String prevLine    = "";
        int    lineChanges = 0;
        double totalDist   = 0;
        int    totalFare   = 0;
        int    totalStops  = path.length - 1;

        // Walk through path and calculate all metrics
        for (int i = 0; i < path.length; i++) {
            int    station = path[i];
            String line    = stationLines[station];

            // Detect line change
            if (!prevLine.isEmpty() && !line.equals(prevLine)) {
                System.out.println("  │");
                System.out.println("  │   *** INTERCHANGE — Change to " + line + " ***");
                System.out.println("  │");
                lineChanges++;
            }

            if (i == 0)
                System.out.println("  │  [START] " + stationNames[station] + "  (" + line + ")");
            else if (i == path.length - 1)
                System.out.println("  │  [END]   " + stationNames[station] + "  (" + line + ")");
            else
                System.out.println("  │    →     " + stationNames[station] + "  (" + line + ")");

            prevLine = line;

            // Accumulate edge metrics along this path
            if (i < path.length - 1) {
                Edge e = adjList[path[i]];
                while (e != null) {
                    if (e.destination == path[i + 1]) {
                        totalDist += e.distance;
                        totalFare += e.fare;
                        break;
                    }
                    e = e.next;
                }
            }
        }

        // Summary footer
        System.out.println("  │");
        System.out.println("  ├─────────────────────────────────────────────────┤");
        System.out.printf ("  │  Total Stops    : %d stations%n", totalStops);
        System.out.printf ("  │  Total Distance : %.1f km%n", totalDist);
        System.out.printf ("  │  Total Fare     : Rs %d%n", totalFare);
        System.out.printf ("  │  Line Changes   : %d%n", lineChanges);
        System.out.println("  └─────────────────────────────────────────────────┘");
    }

    // ──────────────────────────────────────────────
    // FULL JOURNEY SUMMARY
    // Runs all 3 algorithms and shows complete card
    // ──────────────────────────────────────────────
    public void fullSummary(int src, int dest) {
        System.out.println("\n  ╔═════════════════════════════════════════════════╗");
        System.out.println("  ║           COMPLETE JOURNEY SUMMARY             ║");
        System.out.println("  ║    " + stationNames[src] + "  →  " + stationNames[dest]);
        System.out.println("  ╚═════════════════════════════════════════════════╝");

        System.out.println("\n  [1] SHORTEST DISTANCE:");
        dijkstra(src, dest, "distance");

        System.out.println("\n  [2] FEWEST STOPS:");
        bfs(src, dest);

        System.out.println("\n  [3] CHEAPEST FARE:");
        dijkstra(src, dest, "fare");
    }

    // ── Display Alphabetical (via AVL Tree) ────────
    public void displayStationsAlphabetical() {
        avlTree.displayAlphabetical();
    }

    // ── Search station (via AVL Tree) ──────────────
    public boolean searchStation(String name) {
        return avlTree.search(name);
    }

    // ── Display all connections of a station ───────
    public void displayConnections(String name) {
        if (!isValid(name)) {
            System.out.println("  Station not found.");
            return;
        }
        int index = getIndex(name);
        System.out.println("\n  Connections from " + name + " (" + stationLines[index] + "):");
        Edge e = adjList[index];
        while (e != null) {
            System.out.printf("    → %-25s | %.1f km | Rs %d%n",
                stationNames[e.destination], e.distance, e.fare);
            e = e.next;
        }
    }

    public int getTotalStations() { return totalStations; }
}
