// ─────────────────────────────────────────────────
// MinHeap.java
// Priority Queue used by Dijkstra's Algorithm.
// Always gives the station with MINIMUM cost at the top.
//
// Without MinHeap : Dijkstra is O(V²)
// With MinHeap    : Dijkstra is O((V+E) log V)
//
// Internal structure: binary heap stored in an array.
// Parent of index i  → (i-1) / 2
// Left child         → 2*i + 1
// Right child        → 2*i + 2
// ─────────────────────────────────────────────────

public class MinHeap {

    // Each node stores: [stationIndex, cost]
    private int[][]  heap;
    private double[] costs;   // parallel cost array for double precision
    private int      size;
    private static final int CAPACITY = 500;

    public MinHeap() {
        heap  = new int[CAPACITY][1];
        costs = new double[CAPACITY];
        size  = 0;
    }

    // ── Swap two heap positions ────────────────────
    private void swap(int i, int j) {
        int tempStation = heap[i][0];
        heap[i][0] = heap[j][0];
        heap[j][0] = tempStation;

        double tempCost = costs[i];
        costs[i] = costs[j];
        costs[j] = tempCost;
    }

    // ── Insert a (station, cost) pair ─────────────
    // Add at end, then bubble UP to restore heap property
    public void insert(int station, double cost) {
        heap[size][0] = station;
        costs[size]   = cost;
        int i = size;
        size++;

        // Bubble up: while parent has higher cost, swap
        while (i > 0 && costs[(i - 1) / 2] > costs[i]) {
            swap(i, (i - 1) / 2);
            i = (i - 1) / 2;
        }
    }

    // ── Extract minimum (station with lowest cost) ─
    // Remove root, put last element at root, heapify DOWN
    public int[] extractMin() {
        if (size == 0) return null;

        int minStation = heap[0][0];
        double minCost = costs[0];

        heap[0][0] = heap[size - 1][0];
        costs[0]   = costs[size - 1];
        size--;

        heapifyDown(0);

        return new int[]{minStation, (int)(minCost * 10)}; // return station index
    }

    // Returns just the station index of minimum
    public int peekStation() {
        return heap[0][0];
    }

    public double peekCost() {
        return costs[0];
    }

    // ── Heapify Down ───────────────────────────────
    // Push root down until heap property is restored
    private void heapifyDown(int i) {
        int smallest = i;
        int left     = 2 * i + 1;
        int right    = 2 * i + 2;

        if (left  < size && costs[left]  < costs[smallest]) smallest = left;
        if (right < size && costs[right] < costs[smallest]) smallest = right;

        if (smallest != i) {
            swap(i, smallest);
            heapifyDown(smallest);
        }
    }

    public boolean isEmpty() {
        return size == 0;
    }

    // Helper: extract just the station index
    public int extractStation() {
        if (size == 0) return -1;
        int station = heap[0][0];

        heap[0][0] = heap[size - 1][0];
        costs[0]   = costs[size - 1];
        size--;

        heapifyDown(0);
        return station;
    }

    public double extractCost() {
        return costs[0]; // call before extractStation
    }
}
