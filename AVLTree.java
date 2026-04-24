// ─────────────────────────────────────────────────
// AVLTree.java
// Self-balancing BST that stores station names.
// Supports O(log N) search and in-order display
// (alphabetical order).
//
// AVL Property: |height(left) - height(right)| <= 1
// Maintained via rotations after every insert.
//
// Rotations:
//   LL Case → Right Rotation
//   RR Case → Left Rotation
//   LR Case → Left Rotation on left child, then Right Rotation
//   RL Case → Right Rotation on right child, then Left Rotation
// ─────────────────────────────────────────────────

public class AVLTree {

    // ── Inner Node class ───────────────────────────
    private class Node {
        String name;
        int    height;
        Node   left, right;

        Node(String name) {
            this.name   = name;
            this.height = 1;
            this.left   = null;
            this.right  = null;
        }
    }

    private Node root;

    // ── Height helper ──────────────────────────────
    private int height(Node n) {
        return (n == null) ? 0 : n.height;
    }

    // ── Balance factor ─────────────────────────────
    // Positive = left heavy, Negative = right heavy
    private int balance(Node n) {
        return (n == null) ? 0 : height(n.left) - height(n.right);
    }

    private void updateHeight(Node n) {
        n.height = 1 + Math.max(height(n.left), height(n.right));
    }

    // ── Right Rotation (LL Case) ───────────────────
    //        y                  x
    //       / \                / \
    //      x   T3    →      T1   y
    //     / \                   / \
    //    T1  T2               T2  T3
    private Node rotateRight(Node y) {
        Node x  = y.left;
        Node T2 = x.right;

        x.right = y;
        y.left  = T2;

        updateHeight(y);
        updateHeight(x);

        return x; // new root
    }

    // ── Left Rotation (RR Case) ────────────────────
    //     x                    y
    //    / \                  / \
    //   T1   y      →        x   T3
    //       / \             / \
    //      T2  T3          T1  T2
    private Node rotateLeft(Node x) {
        Node y  = x.right;
        Node T2 = y.left;

        y.left  = x;
        x.right = T2;

        updateHeight(x);
        updateHeight(y);

        return y; // new root
    }

    // ── Insert ─────────────────────────────────────
    private Node insert(Node node, String name) {
        // Standard BST insert
        if (node == null) return new Node(name);

        int cmp = name.compareTo(node.name);
        if      (cmp < 0) node.left  = insert(node.left,  name);
        else if (cmp > 0) node.right = insert(node.right, name);
        else return node; // duplicate, ignore

        updateHeight(node);

        int bf = balance(node);

        // LL Case
        if (bf > 1 && name.compareTo(node.left.name) < 0)
            return rotateRight(node);

        // RR Case
        if (bf < -1 && name.compareTo(node.right.name) > 0)
            return rotateLeft(node);

        // LR Case
        if (bf > 1 && name.compareTo(node.left.name) > 0) {
            node.left = rotateLeft(node.left);
            return rotateRight(node);
        }

        // RL Case
        if (bf < -1 && name.compareTo(node.right.name) < 0) {
            node.right = rotateRight(node.right);
            return rotateLeft(node);
        }

        return node;
    }

    public void insert(String name) {
        root = insert(root, name);
    }

    // ── Search ─────────────────────────────────────
    // O(log N) — tree is always balanced
    private boolean search(Node node, String name) {
        if (node == null) return false;

        int cmp = name.compareTo(node.name);
        if      (cmp == 0) return true;
        else if (cmp < 0)  return search(node.left,  name);
        else               return search(node.right, name);
    }

    public boolean search(String name) {
        return search(root, name);
    }

    // ── In-Order Traversal = Alphabetical Order ────
    private void inOrder(Node node, int[] count) {
        if (node == null) return;
        inOrder(node.left, count);
        count[0]++;
        System.out.printf("  %3d. %s%n", count[0], node.name);
        inOrder(node.right, count);
    }

    public void displayAlphabetical() {
        System.out.println("\n  ┌─────────────────────────────────────┐");
        System.out.println("  │     ALL STATIONS (Alphabetical)     │");
        System.out.println("  └─────────────────────────────────────┘");
        int[] count = {0};
        inOrder(root, count);
        System.out.println("  Total: " + count[0] + " stations");
    }

    // ── Height of tree (for display/analysis) ─────
    public int getTreeHeight() {
        return height(root);
    }
}
