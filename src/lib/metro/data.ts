// Types for our metro network
export interface Station {
  id: number;
  name: string;
  code: string;
  line: 'purple' | 'aqua' | 'interchange';
}

export interface Edge {
  to: number;
  distance: number; // in km
  fare: number;     // in rupees
}

// All 26 Pune Metro stations
// Index matches your Java stationNames[] array
export const STATIONS: Station[] = [
  // Purple Line (0-13)
  { id: 0,  name: 'PCMC',                 code: 'PCMC', line: 'purple' },
  { id: 1,  name: 'Sant Tukaram Nagar',   code: 'STN',  line: 'purple' },
  { id: 2,  name: 'Bhosari',              code: 'BHO',  line: 'purple' },
  { id: 3,  name: 'Kasarwadi',            code: 'KSW',  line: 'purple' },
  { id: 4,  name: 'Phugewadi',            code: 'PHW',  line: 'purple' },
  { id: 5,  name: 'Dapodi',               code: 'DAP',  line: 'purple' },
  { id: 6,  name: 'Bopodi',               code: 'BOP',  line: 'purple' },
  { id: 7,  name: 'Khadki',               code: 'KHD',  line: 'purple' },
  { id: 8,  name: 'Range Hills',          code: 'RNH',  line: 'purple' },
  { id: 9,  name: 'Shivajinagar',         code: 'SJN',  line: 'interchange' },
  { id: 10, name: 'Civil Court',          code: 'CVC',  line: 'purple' },
  { id: 11, name: 'Budhwar Peth',         code: 'BWP',  line: 'purple' },
  { id: 12, name: 'Mandai',               code: 'MND',  line: 'purple' },
  { id: 13, name: 'Swargate',             code: 'SWG',  line: 'purple' },

  // Aqua Line (14-26)
  { id: 14, name: 'Vanaz',                code: 'VNZ',  line: 'aqua' },
  { id: 15, name: 'Anand Nagar',          code: 'AND',  line: 'aqua' },
  { id: 16, name: 'Ideal Colony',         code: 'IDC',  line: 'aqua' },
  { id: 17, name: 'Nal Stop',             code: 'NAL',  line: 'aqua' },
  { id: 18, name: 'Garware College',      code: 'GWC',  line: 'aqua' },
  { id: 19, name: 'Deccan Gymkhana',      code: 'DCG',  line: 'aqua' },
  { id: 20, name: 'Chhatrapati Sambhaji', code: 'CSM',  line: 'aqua' },
  { id: 21, name: 'PMC',                  code: 'PMC',  line: 'aqua' },
  // Index 9 = Shivajinagar (shared interchange)
  { id: 22, name: 'Bund Garden',          code: 'BNG',  line: 'aqua' },
  { id: 23, name: 'Yerawada',             code: 'YRW',  line: 'aqua' },
  { id: 24, name: 'Kalyani Nagar',        code: 'KLN',  line: 'aqua' },
  { id: 25, name: 'Ramwadi',              code: 'RMW',  line: 'aqua' },
];

// Adjacency list — same as your Java Graph
// Each station connects to its neighbors with distance and fare
export const GRAPH: Edge[][] = Array(26).fill(null).map(() => []);

function addEdge(from: number, to: number, distance: number, fare: number) {
  // Undirected graph — add both directions (like your Java addEdge)
  GRAPH[from].push({ to, distance, fare });
  GRAPH[to].push({ to: from, distance, fare });
}

// Purple Line connections
addEdge(0, 1, 1.5, 10);   // PCMC ↔ Sant Tukaram Nagar
addEdge(1, 2, 1.2, 10);   // Sant Tukaram Nagar ↔ Bhosari
addEdge(2, 3, 1.3, 10);   // Bhosari ↔ Kasarwadi
addEdge(3, 4, 1.1, 10);   // Kasarwadi ↔ Phugewadi
addEdge(4, 5, 1.4, 10);   // Phugewadi ↔ Dapodi
addEdge(5, 6, 1.2, 10);   // Dapodi ↔ Bopodi
addEdge(6, 7, 1.3, 10);   // Bopodi ↔ Khadki
addEdge(7, 8, 1.5, 10);   // Khadki ↔ Range Hills
addEdge(8, 9, 2.1, 15);   // Range Hills ↔ Shivajinagar
addEdge(9, 10, 1.8, 15);  // Shivajinagar ↔ Civil Court
addEdge(10, 11, 1.2, 10); // Civil Court ↔ Budhwar Peth
addEdge(11, 12, 1.1, 10); // Budhwar Peth ↔ Mandai
addEdge(12, 13, 1.3, 10); // Mandai ↔ Swargate

// Aqua Line connections
addEdge(14, 15, 1.4, 10); // Vanaz ↔ Anand Nagar
addEdge(15, 16, 1.2, 10); // Anand Nagar ↔ Ideal Colony
addEdge(16, 17, 1.3, 10); // Ideal Colony ↔ Nal Stop
addEdge(17, 18, 1.1, 10); // Nal Stop ↔ Garware College
addEdge(18, 19, 1.2, 10); // Garware College ↔ Deccan Gymkhana
addEdge(19, 20, 1.3, 10); // Deccan Gymkhana ↔ Chhatrapati Sambhaji
addEdge(20, 21, 1.4, 10); // Chhatrapati Sambhaji ↔ PMC
addEdge(21, 9, 1.6, 15);  // PMC ↔ Shivajinagar (interchange)
addEdge(9, 22, 2.3, 15);  // Shivajinagar ↔ Bund Garden
addEdge(22, 23, 1.8, 15); // Bund Garden ↔ Yerawada
addEdge(23, 24, 1.5, 10); // Yerawada ↔ Kalyani Nagar
addEdge(24, 25, 1.3, 10); // Kalyani Nagar ↔ Ramwadi