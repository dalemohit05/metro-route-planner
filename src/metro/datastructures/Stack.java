package metro.datastructures;

/**
 * Generic LIFO stack backed by a resizable array.
 * No Java Collections used.
 */
public class Stack<T> {

    private Object[] data;
    private int      top;
    private int      capacity;

    public Stack(int initialCapacity) {
        this.capacity = initialCapacity;
        this.data     = new Object[capacity];
        this.top      = -1;
    }

    // ── Public API ────────────────────────────────────────────────────────────

    public void push(T item) {
        if (top == capacity - 1) resize();
        data[++top] = item;
    }

    @SuppressWarnings("unchecked")
    public T pop() {
        if (isEmpty()) throw new IllegalStateException("Stack is empty");
        T item  = (T) data[top];
        data[top--] = null;   // help GC
        return item;
    }

    @SuppressWarnings("unchecked")
    public T peek() {
        if (isEmpty()) throw new IllegalStateException("Stack is empty");
        return (T) data[top];
    }

    public boolean isEmpty() { return top == -1; }
    public int     size()    { return top + 1; }

    // ── Private helpers ───────────────────────────────────────────────────────

    private void resize() {
        capacity *= 2;
        Object[] newData = new Object[capacity];
        for (int i = 0; i <= top; i++) newData[i] = data[i];
        data = newData;
    }
}
