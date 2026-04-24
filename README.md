# Pune Metro Route Planner
**Data Structures — Semester IV Mini Project**
**Group 17 | Gopal Yadav & Mohit Dale**

---

## Project Overview

A terminal-based metro route planner that simulates real Pune Metro navigation.
Given a source and destination station, it finds:
- Shortest distance route
- Route with fewest stops
- Cheapest fare route

Built entirely with **custom implementations** of all data structures — no Java Collections used for core DS.

---

## How to Compile and Run

```bash
javac *.java
java PuneMetro
```

---

## Pune Metro Network Hardcoded

**Purple Line (14 stations):** PCMC → Sant Tukaram Nagar → Bhosari → Kasarwadi → Phugewadi → Dapodi → Bopodi → Khadki → Range Hills → Shivajinagar → Civil Court → Budhwar Peth → Mandai → Swargate

**Aqua Line (13 stations):** Vanaz → Anand Nagar → Ideal Colony → Nal Stop → Garware College → Deccan Gymkhana → Chhatrapati Sambhaji → PMC → Shivajinagar → Bund Garden → Yerawada → Kalyani Nagar → Ramwadi

**Interchange:** Shivajinagar (index 9) — shared between both lines

**Total Stations:** 26

---

## Data Structures Used

### 1. Graph + Adjacency List (`Graph.java`, `Edge.java`)

**What it is:**
The entire metro network is stored as a Graph. Stations are nodes, tracks between stations are edges.

**Why Adjacency List over Adjacency Matrix:**
A metro network is a *sparse graph* — each station connects to only 2–3 neighbors, not all 26.
An adjacency matrix would be a 26×26 array with mostly zeros (wasted memory).
Adjacency list stores only actual connections.

**Structure:**
```
adjList[0] → Edge(1, 1.5km, Rs10) → null         (PCMC connects to Sant Tukaram Nagar)
adjList[9] → Edge(8, 2.1km, Rs15) → Edge(10, ...) → Edge(21, ...) → Edge(22, ...)
             (Shivajinagar connects to Range Hills, Civil Court, PMC, Bund Garden)
```

**Each Edge stores THREE weights:**
```java
int    destination   // connected station index
double distance      // physical km
int    fare          // rupees
int    stops         // always 1 (one hop)
Edge   next          // linked list pointer
```
Having 3 weights on every edge is what allows the same graph to be searched
for shortest distance, cheapest fare, or fewest stops.

---

### 2. Hash Table (`HashTable.java`)

**What it is:**
Maps station names (String) → station index (int) for O(1) lookup.

**Hash Function Used:**
```
Sum of ASCII values of all characters in the name  %  TABLE_SIZE (53)
```

**Example:**
```
"PCMC"  →  P(80) + C(67) + M(77) + C(67)  =  291
           291 % 53  =  26
           hashTable[26] = 0   (PCMC is station index 0)
```

**Why TABLE_SIZE = 53 (prime):**
Prime numbers distribute hash values more evenly, reducing clustering.

**Collision Handling: Linear Probing**
If the computed index is already occupied, move to `(index + 1) % TABLE_SIZE` until an empty slot is found.

**Time Complexity:**
- Insert: O(1) average
- Search: O(1) average
- Worst case (all collisions): O(N)

**Where it's used:**
- User types "Shivajinagar" → hash function → index 9
- `graph.isValid("Nal Stop")` → checks if name exists in hash table

---

### 3. Min-Heap / Priority Queue (`MinHeap.java`)

**What it is:**
A binary heap that always keeps the minimum-cost station at the top.
Used by Dijkstra's algorithm to pick the next station to visit.

**Why it matters for Dijkstra:**
```
Without MinHeap: Scan all V stations to find minimum  →  O(V) per step  →  Total O(V²)
With MinHeap   : Minimum is always at index 0          →  O(log V) per step → Total O((V+E) log V)
```
For 26 stations: O(676) vs O(130). For a real metro with 200 stations: O(40000) vs O(1400).

**Internal Structure:**
Binary heap stored in an array:
```
Parent of index i  →  (i - 1) / 2
Left child         →  2 * i + 1
Right child        →  2 * i + 2
```

**Operations:**
- `insert(station, cost)` → add at end, bubble UP  →  O(log N)
- `extractMin()` → remove root, put last at root, heapify DOWN  →  O(log N)
- `peekCost()` → view minimum without removing  →  O(1)

---

### 4. Stack (`Stack.java`)

**What it is:**
Array-based LIFO stack. Used for path reversal after Dijkstra/BFS.

**Why it's needed:**
Dijkstra uses a `parent[]` array where `parent[v] = u` means "we reached v from u."
To reconstruct the path, we backtrack from destination to source:
```
Ramwadi → Kalyani Nagar → Yerawada → ... → PCMC   (BACKWARDS)
```
We push each station onto the Stack while backtracking.
Then pop them — LIFO reverses the order:
```
PCMC → ... → Kalyani Nagar → Ramwadi   (CORRECT)
```

**Operations:** push O(1), pop O(1), peek O(1)

---

### 5. Queue (`Queue.java`)

**What it is:**
Circular array-based FIFO queue. Used exclusively by BFS.

**Why Queue is essential for BFS:**
BFS must explore stations *level by level* (closest first).
Queue's FIFO property guarantees that stations are processed in the order they were discovered.
This is what makes BFS find the minimum-hop path.

```
Level 0: [PCMC]
Level 1: [Sant Tukaram Nagar]         (1 hop from PCMC)
Level 2: [Bhosari]                    (2 hops from PCMC)
...
```
First time we reach destination = guaranteed minimum stops.

**Circular Implementation:**
```
front = (front + 1) % CAPACITY    // avoids shifting elements
rear  = (rear  + 1) % CAPACITY
```

---

### 6. AVL Tree (`AVLTree.java`)

**What it is:**
Self-balancing Binary Search Tree that stores station names alphabetically.
Supports O(log N) search and sorted display.

**Why AVL over plain BST:**
A plain BST can degenerate to O(N) if stations are inserted in sorted order.
AVL tree maintains balance using the condition:
```
|height(left subtree) - height(right subtree)| <= 1
```

**Balance Factor = height(left) - height(right)**
- If BF > 1 → left heavy → rotate right
- If BF < -1 → right heavy → rotate left

**Four Rotation Cases:**
```
LL Case: Right Rotation
RR Case: Left Rotation
LR Case: Left Rotation on left child → Right Rotation on node
RL Case: Right Rotation on right child → Left Rotation on node
```

**In-Order Traversal = Alphabetical Output:**
Left subtree → Current node → Right subtree
BST property ensures left < current < right, so in-order is always sorted.

**Where it's used:**
- Menu option 5: display all 26 stations alphabetically
- Menu option 6: search station by name in O(log N)

---

## Algorithms

### Dijkstra's Algorithm

**Purpose:** Find shortest path in a weighted graph.

**How it works:**
1. Set distance to all stations = ∞, source = 0
2. Insert source into MinHeap
3. While heap is not empty:
   - Extract minimum-cost station u
   - For each neighbor v of u (via adjacency list):
     - If `dist[u] + weight(u,v) < dist[v]`:
       - Update `dist[v]`
       - Set `parent[v] = u`
       - Insert v into MinHeap
4. Backtrack using parent[] + Stack to get path

**Run 3 times with different weights:**
```java
dijkstra(src, dest, "distance")  // uses edge.distance
dijkstra(src, dest, "fare")      // uses edge.fare
// BFS used for stops — more efficient than Dijkstra for unweighted
```

**Time Complexity:** O((V + E) log V) with MinHeap

### BFS (Breadth First Search)

**Purpose:** Find path with fewest hops (stops).

**How it works:**
1. Enqueue source, mark visited
2. Dequeue station u, explore all neighbors
3. First time destination is dequeued = minimum hops guaranteed
4. Reconstruct path using parent[] + Stack

**Why BFS and not Dijkstra for stops:**
Since each edge has weight = 1 (one stop), BFS is simpler and equally correct.
It also runs in O(V + E) without needing a heap.

---

## Line Change Detection

Each station stores its metro line in `stationLines[]`.
When printing the path, consecutive stations are compared:
```java
if (!prevLine.equals(currentLine)) {
    // Print "INTERCHANGE — Change to <line>"
}
```
No extra algorithm needed — just a comparison while walking the path array.

---

## Station Closure Feature

When a station is marked closed:
```java
closedStations[index] = true;
```
Both Dijkstra and BFS skip closed stations:
```java
if (!visited[v] && !closedStations[v]) {
    // process this neighbor
}
```
The algorithm automatically finds the next best path without that station.
After the query, station can be reopened — no structural change to the graph.

---

## File Structure

```
PuneMetro/
├── Edge.java         → Edge node for adjacency linked list (3 weights)
├── HashTable.java    → Custom hash table (ASCII sum % 53, linear probing)
├── MinHeap.java      → Custom binary min-heap for Dijkstra
├── Stack.java        → Custom array stack for path reversal
├── Queue.java        → Custom circular queue for BFS
├── AVLTree.java      → Custom AVL tree for alphabetical station search
├── Graph.java        → Graph with adjacency list + all algorithms
├── PuneMetro.java    → Main class with Pune Metro data + terminal menu
└── README.md         → This file
```

---

## DS Summary Table

| Data Structure | File | Role | Time Complexity |
|---|---|---|---|
| Graph (Adjacency List) | Graph.java, Edge.java | Store metro network | O(V+E) space |
| Hash Table | HashTable.java | Station name → index | O(1) lookup |
| Min-Heap | MinHeap.java | Dijkstra priority queue | O(log N) insert/extract |
| Stack | Stack.java | Path reversal | O(1) push/pop |
| Queue | Queue.java | BFS level traversal | O(1) enqueue/dequeue |
| AVL Tree | AVLTree.java | Alphabetical search | O(log N) search |

---

## Sample Test Cases

**Cross-line journey (tests interchange detection):**
```
Source      : PCMC
Destination : Ramwadi
Expected    : Path via Shivajinagar interchange, 13 stops, ~20km
```

**Same-line journey:**
```
Source      : PCMC
Destination : Swargate
Expected    : All Purple Line, no interchange
```

**Station closure test:**
```
1. Close "Shivajinagar" (option 8)
2. Search PCMC → Ramwadi
3. Expected: No route (only path goes through Shivajinagar)
4. Reopen (option 9), search again → route restored
```

**Alphabetical display (AVL Tree in-order):**
```
Option 5 → All 26 stations in alphabetical order
```
