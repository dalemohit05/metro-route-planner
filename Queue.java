// ─────────────────────────────────────────────────
// Queue.java
// Circular queue used by BFS (Fewest Stops search).
//
// BFS uses a Queue because it must process stations
// level by level (nearest first). FIFO property
// ensures we always explore closer stations before
// farther ones — guaranteeing minimum hops.
// ─────────────────────────────────────────────────

public class Queue {

    private int[] data;
    private int   front, rear, size;
    private static final int CAPACITY = 200;

    public Queue() {
        data  = new int[CAPACITY];
        front = 0;
        rear  = 0;
        size  = 0;
    }

    // ── Enqueue ────────────────────────────────────
    public void enqueue(int val) {
        if (size < CAPACITY) {
            data[rear] = val;
            rear       = (rear + 1) % CAPACITY;
            size++;
        }
    }

    // ── Dequeue ────────────────────────────────────
    public int dequeue() {
        if (isEmpty()) return -1;
        int val = data[front];
        front   = (front + 1) % CAPACITY;
        size--;
        return val;
    }

    // ── Peek ───────────────────────────────────────
    public int peek() {
        if (isEmpty()) return -1;
        return data[front];
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public int size() {
        return size;
    }
}
