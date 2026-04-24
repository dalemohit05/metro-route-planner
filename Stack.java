// ─────────────────────────────────────────────────
// Stack.java
// Used for PATH REVERSAL after Dijkstra / BFS.
//
// Dijkstra's parent array gives path as:
//   destination → ... → source   (backwards)
//
// We push all nodes onto Stack, then pop them.
// LIFO property reverses the order automatically:
//   source → ... → destination   (correct order)
//
// Also used for line-change detection while printing.
// ─────────────────────────────────────────────────

public class Stack {

    private int[] data;
    private int   top;
    private static final int CAPACITY = 100;

    public Stack() {
        data = new int[CAPACITY];
        top  = -1;
    }

    // ── Push ───────────────────────────────────────
    public void push(int val) {
        if (top < CAPACITY - 1) {
            data[++top] = val;
        }
    }

    // ── Pop ────────────────────────────────────────
    public int pop() {
        if (isEmpty()) return -1;
        return data[top--];
    }

    // ── Peek ───────────────────────────────────────
    public int peek() {
        if (isEmpty()) return -1;
        return data[top];
    }

    public boolean isEmpty() {
        return top == -1;
    }

    public int size() {
        return top + 1;
    }

    // Convert stack to array (top → bottom order, i.e. source → dest)
    public int[] toArray() {
        int[] result = new int[top + 1];
        for (int i = 0; i <= top; i++) {
            result[top - i] = data[i];
        }
        return result;
    }
}
