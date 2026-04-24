package metro.datastructures;

/**
 * Binary min-heap that stores (priority, nodeId) pairs.
 * Used as the priority queue in Dijkstra's algorithm.
 * Resizes automatically when full.
 * No Java Collections used.
 */
public class MinHeap {

    private int[] priorities;
    private int[] nodeIds;
    private int   size;
    private int   capacity;

    public MinHeap(int initialCapacity) {
        this.capacity   = initialCapacity;
        this.priorities = new int[capacity];
        this.nodeIds    = new int[capacity];
        this.size       = 0;
    }

    // ── Public API ────────────────────────────────────────────────────────────

    public void insert(int priority, int nodeId) {
        if (size == capacity) resize();
        priorities[size] = priority;
        nodeIds[size]    = nodeId;
        bubbleUp(size);
        size++;
    }

    /**
     * Remove and return the element with the smallest priority.
     *
     * @return int[]{priority, nodeId}
     */
    public int[] extractMin() {
        if (isEmpty()) throw new IllegalStateException("Heap is empty");
        int[] min = { priorities[0], nodeIds[0] };
        size--;
        priorities[0] = priorities[size];
        nodeIds[0]    = nodeIds[size];
        bubbleDown(0);
        return min;
    }

    public boolean isEmpty() { return size == 0; }
    public int     size()    { return size; }

    // ── Heap maintenance ──────────────────────────────────────────────────────

    private void bubbleUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (priorities[i] < priorities[parent]) {
                swap(i, parent);
                i = parent;
            } else break;
        }
    }

    private void bubbleDown(int i) {
        while (true) {
            int smallest = i;
            int left     = 2 * i + 1;
            int right    = 2 * i + 2;
            if (left  < size && priorities[left]  < priorities[smallest]) smallest = left;
            if (right < size && priorities[right] < priorities[smallest]) smallest = right;
            if (smallest == i) break;
            swap(i, smallest);
            i = smallest;
        }
    }

    private void swap(int i, int j) {
        int tmp;
        tmp = priorities[i]; priorities[i] = priorities[j]; priorities[j] = tmp;
        tmp = nodeIds[i];    nodeIds[i]    = nodeIds[j];    nodeIds[j]    = tmp;
    }

    private void resize() {
        capacity  *= 2;
        int[] newPriorities = new int[capacity];
        int[] newNodeIds    = new int[capacity];
        for (int i = 0; i < size; i++) {
            newPriorities[i] = priorities[i];
            newNodeIds[i]    = nodeIds[i];
        }
        priorities = newPriorities;
        nodeIds    = newNodeIds;
    }
}
