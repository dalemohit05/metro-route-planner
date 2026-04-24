package metro.datastructures;

/**
 * Self-balancing AVL Tree keyed on Strings, storing integer values.
 * Used to maintain a sorted index of station names.
 * No Java Collections used.
 */
public class AVLTree {

    private Node root;

    // ── Inner node ────────────────────────────────────────────────────────────

    private static class Node {
        String key;
        int    value;
        Node   left, right;
        int    height;

        Node(String key, int value) {
            this.key    = key;
            this.value  = value;
            this.height = 1;
        }
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /** Insert or update the entry for {@code key}. */
    public void insert(String key, int value) {
        root = insert(root, key, value);
    }

    /** Return the integer value stored for {@code key}, or {@code null} if absent. */
    public Integer search(String key) {
        Node node = search(root, key);
        return node == null ? null : node.value;
    }

    /** Number of entries in the tree. */
    public int size() {
        return size(root);
    }

    /**
     * Fill {@code keys} and {@code values} arrays with an in-order traversal.
     * {@code index[0]} must be 0 on entry; it is incremented to the count of entries.
     */
    public void inOrder(String[] keys, int[] values, int[] index) {
        inOrder(root, keys, values, index);
    }

    // ── Recursive helpers ─────────────────────────────────────────────────────

    private Node insert(Node node, String key, int value) {
        if (node == null) return new Node(key, value);

        int cmp = key.compareTo(node.key);
        if      (cmp < 0) node.left  = insert(node.left,  key, value);
        else if (cmp > 0) node.right = insert(node.right, key, value);
        else { node.value = value; return node; }

        node.height = 1 + Math.max(height(node.left), height(node.right));

        int balance = getBalance(node);

        // Left-Left
        if (balance > 1 && key.compareTo(node.left.key) < 0)
            return rotateRight(node);
        // Right-Right
        if (balance < -1 && key.compareTo(node.right.key) > 0)
            return rotateLeft(node);
        // Left-Right
        if (balance > 1 && key.compareTo(node.left.key) > 0) {
            node.left = rotateLeft(node.left);
            return rotateRight(node);
        }
        // Right-Left
        if (balance < -1 && key.compareTo(node.right.key) < 0) {
            node.right = rotateRight(node.right);
            return rotateLeft(node);
        }
        return node;
    }

    private Node search(Node node, String key) {
        if (node == null) return null;
        int cmp = key.compareTo(node.key);
        if      (cmp < 0) return search(node.left,  key);
        else if (cmp > 0) return search(node.right, key);
        return node;
    }

    private void inOrder(Node node, String[] keys, int[] values, int[] index) {
        if (node == null) return;
        inOrder(node.left, keys, values, index);
        keys[index[0]]   = node.key;
        values[index[0]] = node.value;
        index[0]++;
        inOrder(node.right, keys, values, index);
    }

    private int size(Node node) {
        return node == null ? 0 : 1 + size(node.left) + size(node.right);
    }

    // ── AVL rotation helpers ──────────────────────────────────────────────────

    private int height(Node n)     { return n == null ? 0 : n.height; }
    private int getBalance(Node n) { return n == null ? 0 : height(n.left) - height(n.right); }

    private Node rotateRight(Node y) {
        Node x  = y.left;
        Node t2 = x.right;
        x.right = y;
        y.left  = t2;
        y.height = 1 + Math.max(height(y.left), height(y.right));
        x.height = 1 + Math.max(height(x.left), height(x.right));
        return x;
    }

    private Node rotateLeft(Node x) {
        Node y  = x.right;
        Node t2 = y.left;
        y.left  = x;
        x.right = t2;
        x.height = 1 + Math.max(height(x.left), height(x.right));
        y.height = 1 + Math.max(height(y.left), height(y.right));
        return y;
    }
}
