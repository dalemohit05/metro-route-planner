import { GRAPH, STATIONS, Station } from './data';

// Result of a route calculation
export interface RouteResult {
  path: Station[];           // ordered list of stations
  totalDistance: number;     // in km
  totalFare: number;         // in rupees
  totalTime: number;         // in minutes
  numStops: number;          // number of stops
  interchanges: string[];    // interchange station names
  found: boolean;            // was a route found?
}

// MinHeap node — same concept as your Java MinHeap
interface HeapNode {
  station: number;
  cost: number;
}

// Simple MinHeap implementation
// Same logic as your MinHeap.java
class MinHeap {
  private heap: HeapNode[] = [];

  insert(node: HeapNode) {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin(): HeapNode | null {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown(0);
    }
    return min;
  }

  get size() { return this.heap.length; }

  private bubbleUp(i: number) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent].cost <= this.heap[i].cost) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  private heapifyDown(i: number) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this.heap[left].cost < this.heap[smallest].cost)
        smallest = left;
      if (right < n && this.heap[right].cost < this.heap[smallest].cost)
        smallest = right;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}

// DIJKSTRA'S ALGORITHM
// Same logic as your Graph.java dijkstra() method
// weight: 'distance' | 'fare' — which metric to optimize
export function dijkstra(
  source: number,
  destination: number,
  weight: 'distance' | 'fare' = 'distance'
): RouteResult {
  const n = STATIONS.length;
  const dist = new Array(n).fill(Infinity);  // dist[] array
  const parent = new Array(n).fill(-1);       // parent[] for path reconstruction
  const visited = new Array(n).fill(false);

  dist[source] = 0;

  const heap = new MinHeap();
  heap.insert({ station: source, cost: 0 });

  // Main Dijkstra loop
  while (heap.size > 0) {
    const { station: u } = heap.extractMin()!;

    if (visited[u]) continue;
    visited[u] = true;

    if (u === destination) break; // reached destination

    // Explore neighbors — same as iterating adjacency list in Java
    for (const edge of GRAPH[u]) {
      const v = edge.to;
      const edgeCost = weight === 'distance' ? edge.distance : edge.fare;

      if (!visited[v] && dist[u] + edgeCost < dist[v]) {
        dist[v] = dist[u] + edgeCost;
        parent[v] = u;
        heap.insert({ station: v, cost: dist[v] });
      }
    }
  }

  // No route found
  if (dist[destination] === Infinity) {
    return {
      path: [], totalDistance: 0, totalFare: 0,
      totalTime: 0, numStops: 0, interchanges: [], found: false
    };
  }

  // Reconstruct path using parent[] — same as your Stack-based reversal
  const pathIndices: number[] = [];
  let current = destination;
  while (current !== -1) {
    pathIndices.unshift(current); // unshift = prepend (replaces Stack reversal)
    current = parent[current];
  }

  // Convert indices to Station objects
  const path = pathIndices.map(i => STATIONS[i]);

  // Calculate totals by walking the path
  let totalDistance = 0;
  let totalFare = 0;
  const interchanges: string[] = [];

  for (let i = 0; i < pathIndices.length - 1; i++) {
    const from = pathIndices[i];
    const to = pathIndices[i + 1];
    const edge = GRAPH[from].find(e => e.to === to)!;
    totalDistance += edge.distance;
    totalFare += edge.fare;

    // Detect interchange — same as your line change detection
    if (STATIONS[to].line === 'interchange' || 
       (STATIONS[from].line !== STATIONS[to].line && 
        STATIONS[from].line !== 'interchange')) {
      if (!interchanges.includes(STATIONS[to].name)) {
        interchanges.push(STATIONS[to].name);
      }
    }
  }

  // Average metro speed = 32 km/h
  // Time = distance / speed * 60 minutes
  const totalTime = Math.round((totalDistance / 32) * 60);

  return {
    path,
    totalDistance: Math.round(totalDistance * 10) / 10,
    totalFare,
    totalTime,
    numStops: path.length - 1,
    interchanges,
    found: true,
  };
}