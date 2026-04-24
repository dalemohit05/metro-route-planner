package metro.datastructures;

/**
 * Generic FIFO queue backed by a circular resizable array.
 * No Java Collections used.
 */
public class Queue<T> {

    private Object[] data;
    private int      front;
    private int      rear;
    private int      size;
    private int      capacity;

    public Queue(int initialCapacity) {
        this.capacity = initialCapacity;
        this.data     = new Object[capacity];
        this.front    = 0;
        this.rear     = -1;
        this.size     = 0;
    }

    // ── Public API ────────────────────────────────────────────────────────────

    public void enqueue(T item) {
        if (size == capacity) resize();
        rear = (rear + 1) % capacity;
        data[rear] = item;
        size++;
    }

    @SuppressWarnings("unchecked")
    public T dequeue() {
        if (isEmpty()) throw new IllegalStateException("Queue is empty");
        T item = (T) data[front];
        data[front] = null;              // help GC
        front = (front + 1) % capacity;
        size--;
        return item;
    }

    @SuppressWarnings("unchecked")
    public T peek() {
        if (isEmpty()) throw new IllegalStateException("Queue is empty");
        return (T) data[front];
    }

    public boolean isEmpty() { return size == 0; }
    public int     size()    { return size; }

    // ── Private helpers ───────────────────────────────────────────────────────

    private void resize() {
        int      newCapacity = capacity * 2;
        Object[] newData     = new Object[newCapacity];
        for (int i = 0; i < size; i++) {
            newData[i] = data[(front + i) % capacity];
        }
        data     = newData;
        front    = 0;
        rear     = size - 1;
        capacity = newCapacity;
    }
}
