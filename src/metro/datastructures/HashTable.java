package metro.datastructures;

/**
 * Generic hash table using separate chaining for collision resolution.
 * Automatically resizes when the load factor exceeds 0.75.
 * No Java Collections used.
 */
public class HashTable<K, V> {

    private static final int   DEFAULT_CAPACITY = 16;
    private static final float LOAD_FACTOR      = 0.75f;

    private Node<K, V>[] table;
    private int          size;
    private int          capacity;

    // ── Inner node ────────────────────────────────────────────────────────────

    private static class Node<K, V> {
        final K    key;
        V          value;
        Node<K, V> next;

        Node(K key, V value) {
            this.key   = key;
            this.value = value;
        }
    }

    // ── Constructors ──────────────────────────────────────────────────────────

    @SuppressWarnings("unchecked")
    public HashTable() {
        capacity = DEFAULT_CAPACITY;
        table    = new Node[capacity];
    }

    @SuppressWarnings("unchecked")
    public HashTable(int initialCapacity) {
        capacity = initialCapacity;
        table    = new Node[capacity];
    }

    // ── Core operations ───────────────────────────────────────────────────────

    public void put(K key, V value) {
        if (key == null) throw new IllegalArgumentException("Key cannot be null");
        if ((float) size / capacity >= LOAD_FACTOR) resize();

        int        index = hash(key);
        Node<K, V> curr  = table[index];
        while (curr != null) {
            if (curr.key.equals(key)) {
                curr.value = value;   // update existing
                return;
            }
            curr = curr.next;
        }
        Node<K, V> node = new Node<>(key, value);
        node.next    = table[index];
        table[index] = node;
        size++;
    }

    public V get(K key) {
        if (key == null) return null;
        Node<K, V> curr = table[hash(key)];
        while (curr != null) {
            if (curr.key.equals(key)) return curr.value;
            curr = curr.next;
        }
        return null;
    }

    public boolean containsKey(K key) {
        return get(key) != null;
    }

    public void remove(K key) {
        if (key == null) return;
        int        index = hash(key);
        Node<K, V> curr  = table[index];
        Node<K, V> prev  = null;
        while (curr != null) {
            if (curr.key.equals(key)) {
                if (prev == null) table[index] = curr.next;
                else              prev.next    = curr.next;
                size--;
                return;
            }
            prev = curr;
            curr = curr.next;
        }
    }

    public int     size()    { return size; }
    public boolean isEmpty() { return size == 0; }

    // ── Iteration helpers ─────────────────────────────────────────────────────

    /** Returns all keys (order not guaranteed). */
    @SuppressWarnings("unchecked")
    public Object[] keys() {
        Object[] result = new Object[size];
        int idx = 0;
        for (int i = 0; i < capacity; i++) {
            Node<K, V> curr = table[i];
            while (curr != null) {
                result[idx++] = curr.key;
                curr = curr.next;
            }
        }
        return result;
    }

    /** Returns all values (order not guaranteed). */
    @SuppressWarnings("unchecked")
    public Object[] values() {
        Object[] result = new Object[size];
        int idx = 0;
        for (int i = 0; i < capacity; i++) {
            Node<K, V> curr = table[i];
            while (curr != null) {
                result[idx++] = curr.value;
                curr = curr.next;
            }
        }
        return result;
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private int hash(K key) {
        return (key.hashCode() & 0x7FFFFFFF) % capacity;
    }

    @SuppressWarnings("unchecked")
    private void resize() {
        int        newCap   = capacity * 2;
        Node<K, V>[] newTable = new Node[newCap];
        for (int i = 0; i < capacity; i++) {
            Node<K, V> curr = table[i];
            while (curr != null) {
                Node<K, V> next   = curr.next;
                int        newIdx = (curr.key.hashCode() & 0x7FFFFFFF) % newCap;
                curr.next         = newTable[newIdx];
                newTable[newIdx]  = curr;
                curr              = next;
            }
        }
        table    = newTable;
        capacity = newCap;
    }
}
