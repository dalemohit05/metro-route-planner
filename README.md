# metro-route-planner

A **terminal-based Metro Route Planner** built in Java using custom, ground-up implementations of every data structure and algorithm — **no `java.util` Collections used**.

> Semester IV Data-Structures Mini Project

---

## Features

| Feature | Algorithm / DS used |
|---|---|
| List all stations (alphabetical) | AVL Tree (in-order traversal) |
| Shortest path by distance | Dijkstra + Min-Heap |
| Fastest path by travel time | Dijkstra + Min-Heap |
| Cheapest path by fare | Dijkstra + Min-Heap |
| Path with fewest stops | BFS + Queue |
| Name → ID lookup | Hash Table |
| Path reconstruction | Stack |

---

## Data Structures implemented

| Class | Location |
|---|---|
| `HashTable<K,V>` | `src/metro/datastructures/HashTable.java` |
| `AVLTree` | `src/metro/datastructures/AVLTree.java` |
| `MinHeap` | `src/metro/datastructures/MinHeap.java` |
| `Stack<T>` | `src/metro/datastructures/Stack.java` |
| `Queue<T>` | `src/metro/datastructures/Queue.java` |
| `Graph` (adjacency list) | `src/metro/graph/Graph.java` |

---

## Metro Network

15 stations across 4 lines with 6 interchange stations:

```
RED LINE    : Central Station(0)--City Square(1)--University(2)--Market Jn(3)--Old Town(4)--Airport(5)
BLUE LINE   : North Station(6)--Tech Park(7)--City Square(1)--Stadium(8)--South Mall(9)--Harbor(10)
YELLOW LINE : East Gate(11)--Market Jn(3)--Stadium(8)--West End(12)--Industrial Zone(13)
GREEN LINE  : Hills(14)--University(2)--Tech Park(7)--East Gate(11)
```

---

## Build & Run

**Prerequisites:** Java 11 or later, GNU Make

```bash
# Compile
make

# Run interactively
make run

# Or compile & run manually
javac -encoding UTF-8 -d out -sourcepath src $(find src -name "*.java")
java -cp out metro.Main
```

---

## Project Structure

```
src/
  metro/
    datastructures/
      HashTable.java   – separate-chaining generic hash table
      AVLTree.java     – self-balancing BST (String → int)
      MinHeap.java     – integer min-heap (priority queue)
      Stack.java       – resizable generic array stack
      Queue.java       – circular-buffer generic queue
    graph/
      Station.java     – station POJO (id, name, line)
      Edge.java        – weighted directed edge (dist, time, cost, line)
      Graph.java       – adjacency-list graph
    algorithms/
      Dijkstra.java    – single-source shortest path (3 weight modes)
      BFS.java         – minimum-stops path
    MetroNetwork.java  – network initialisation & display helpers
    Main.java          – terminal UI entry point
Makefile
```

