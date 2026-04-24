// ─────────────────────────────────────────────────
// HashTable.java
// Maps station names (String) → station index (int)
//
// Hash Function : sum of ASCII values of all characters % TABLE_SIZE
// Collision     : Linear Probing  (index + 1) % TABLE_SIZE
// Lookup Time   : O(1) average
// ─────────────────────────────────────────────────

public class HashTable {

    private static final int TABLE_SIZE = 53; // prime number reduces collisions

    private String[]  keys;
    private int[]     values;
    private boolean[] occupied;

    public HashTable() {
        keys     = new String[TABLE_SIZE];
        values   = new int[TABLE_SIZE];
        occupied = new boolean[TABLE_SIZE];
    }

    // ── Hash Function ──────────────────────────────
    // Converts a station name string to a table index.
    // Each character's ASCII value is summed, then mod TABLE_SIZE.
    // Example: "PCMC" → 80+67+77+67 = 291 → 291 % 53 = 26
    private int hash(String key) {
        int sum = 0;
        for (char c : key.toCharArray()) {
            sum += (int) c;
        }
        return sum % TABLE_SIZE;
    }

    // ── Insert ─────────────────────────────────────
    // If collision: move to next slot (linear probing) until empty
    public void put(String key, int value) {
        int index = hash(key);
        while (occupied[index] && !keys[index].equals(key)) {
            index = (index + 1) % TABLE_SIZE; // linear probe
        }
        keys[index]     = key;
        values[index]   = value;
        occupied[index] = true;
    }

    // ── Search ─────────────────────────────────────
    // Returns station index, or -1 if not found
    public int get(String key) {
        int index = hash(key);
        int start = index;
        while (occupied[index]) {
            if (keys[index].equals(key)) return values[index];
            index = (index + 1) % TABLE_SIZE;
            if (index == start) break; // full loop, not found
        }
        return -1;
    }

    // ── Exists ─────────────────────────────────────
    public boolean contains(String key) {
        return get(key) != -1;
    }
}
