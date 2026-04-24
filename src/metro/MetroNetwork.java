package metro;

import metro.datastructures.AVLTree;
import metro.datastructures.HashTable;
import metro.graph.Graph;
import metro.graph.Station;

/**
 * Builds and owns the in-memory metro network.
 *
 * Network layout (15 stations, 4 lines):
 *
 *   RED LINE     : Central Station(0) – City Square(1) – University(2) –
 *                  Market Junction(3) – Old Town(4) – Airport(5)
 *
 *   BLUE LINE    : North Station(6) – Tech Park(7) – City Square(1) –
 *                  Stadium(8) – South Mall(9) – Harbor(10)
 *
 *   YELLOW LINE  : East Gate(11) – Market Junction(3) – Stadium(8) –
 *                  West End(12) – Industrial Zone(13)
 *
 *   GREEN LINE   : Hills(14) – University(2) – Tech Park(7) – East Gate(11)
 *
 *   Interchange stations:
 *     City Square(1)       Red  ↔ Blue
 *     Market Junction(3)   Red  ↔ Yellow
 *     University(2)        Red  ↔ Green
 *     Tech Park(7)         Blue ↔ Green
 *     Stadium(8)           Blue ↔ Yellow
 *     East Gate(11)        Yellow ↔ Green
 *
 * Uses a {@link HashTable} for O(1) name→id lookups and an
 * {@link AVLTree} for sorted station listings.
 */
public class MetroNetwork {

    // ── Constants ─────────────────────────────────────────────────────────────

    public static final int STATION_COUNT = 15;

    private static final String RED    = "Red Line";
    private static final String BLUE   = "Blue Line";
    private static final String YELLOW = "Yellow Line";
    private static final String GREEN  = "Green Line";

    // ── State ─────────────────────────────────────────────────────────────────

    private final Station[]          stations;
    private final Graph              graph;
    private final HashTable<String, Integer> nameToId;
    private final AVLTree            stationTree;

    // ── Constructor ───────────────────────────────────────────────────────────

    public MetroNetwork() {
        stations    = new Station[STATION_COUNT];
        nameToId    = new HashTable<>(32);
        stationTree = new AVLTree();
        graph       = new Graph(STATION_COUNT);

        initStations();
        initConnections();
    }

    // ── Station initialisation ────────────────────────────────────────────────

    private void initStations() {
        // Red Line
        addStation(0,  "Central Station",   RED);
        addStation(1,  "City Square",       "Red/Blue Line");
        addStation(2,  "University",        "Red/Green Line");
        addStation(3,  "Market Junction",   "Red/Yellow Line");
        addStation(4,  "Old Town",          RED);
        addStation(5,  "Airport",           RED);
        // Blue Line
        addStation(6,  "North Station",     BLUE);
        addStation(7,  "Tech Park",         "Blue/Green Line");
        addStation(8,  "Stadium",           "Blue/Yellow Line");
        addStation(9,  "South Mall",        BLUE);
        addStation(10, "Harbor",            BLUE);
        // Yellow Line
        addStation(11, "East Gate",         "Yellow/Green Line");
        addStation(12, "West End",          YELLOW);
        addStation(13, "Industrial Zone",   YELLOW);
        // Green Line
        addStation(14, "Hills",             GREEN);
    }

    private void addStation(int id, String name, String line) {
        stations[id] = new Station(id, name, line);
        nameToId.put(name.toLowerCase(), id);
        stationTree.insert(name, id);
    }

    // ── Connection initialisation ─────────────────────────────────────────────
    //   addEdge(src, dst, distKm, timeMin, costRs, line)

    private void initConnections() {
        // Red Line
        graph.addEdge(0,  1,  2, 3,  10, RED);    // Central Station  – City Square
        graph.addEdge(1,  2,  3, 4,  15, RED);    // City Square      – University
        graph.addEdge(2,  3,  2, 3,  10, RED);    // University       – Market Junction
        graph.addEdge(3,  4,  4, 5,  20, RED);    // Market Junction  – Old Town
        graph.addEdge(4,  5,  5, 6,  25, RED);    // Old Town         – Airport

        // Blue Line
        graph.addEdge(6,  7,  3, 4,  15, BLUE);   // North Station    – Tech Park
        graph.addEdge(7,  1,  2, 3,  10, BLUE);   // Tech Park        – City Square
        graph.addEdge(1,  8,  3, 4,  15, BLUE);   // City Square      – Stadium
        graph.addEdge(8,  9,  2, 3,  10, BLUE);   // Stadium          – South Mall
        graph.addEdge(9,  10, 4, 5,  20, BLUE);   // South Mall       – Harbor

        // Yellow Line
        graph.addEdge(11, 3,  2, 3,  10, YELLOW); // East Gate        – Market Junction
        graph.addEdge(3,  8,  3, 4,  15, YELLOW); // Market Junction  – Stadium
        graph.addEdge(8,  12, 3, 4,  15, YELLOW); // Stadium          – West End
        graph.addEdge(12, 13, 2, 3,  10, YELLOW); // West End         – Industrial Zone

        // Green Line
        graph.addEdge(14, 2,  4, 5,  20, GREEN);  // Hills            – University
        graph.addEdge(2,  7,  3, 4,  15, GREEN);  // University       – Tech Park
        graph.addEdge(7,  11, 2, 3,  10, GREEN);  // Tech Park        – East Gate
    }

    // ── Public accessors ──────────────────────────────────────────────────────

    public Graph    getGraph()          { return graph; }
    public Station  getStation(int id)  { return stations[id]; }
    public int      getStationCount()   { return STATION_COUNT; }

    /**
     * Look up a station by name (case-insensitive).
     *
     * @return station ID, or {@code null} if not found.
     */
    public Integer getIdByName(String name) {
        return nameToId.get(name.toLowerCase());
    }

    /**
     * Print all stations sorted alphabetically (via the AVL tree in-order traversal).
     */
    public void printAllStations() {
        int      n      = stationTree.size();
        String[] keys   = new String[n];
        int[]    ids    = new int[n];
        int[]    cursor = { 0 };
        stationTree.inOrder(keys, ids, cursor);

        System.out.println(BOX_TOP);
        System.out.println(row("  ALL STATIONS (sorted alphabetically)"));
        System.out.println(BOX_MID);
        System.out.printf( "║  %-4s %-22s %-32s║%n", "ID", "Name", "Line(s)");
        System.out.println(BOX_MID);
        for (int i = 0; i < n; i++) {
            Station s = stations[ids[i]];
            System.out.printf("║  %-4d %-22s %-32s║%n",
                    s.getId(), s.getName(), s.getLine());
        }
        System.out.println(BOX_BTM);
    }

    /**
     * Print the metro map (schematic line layout).
     */
    public void printMetroMap() {
        System.out.println(BOX_TOP);
        System.out.println(row("  METRO MAP"));
        System.out.println(BOX_MID);
        System.out.println(row("  RED LINE:"));
        System.out.println(row("    Central(0)--City Square(1)--University(2)"));
        System.out.println(row("    University(2)--Market Jn(3)--Old Town(4)--Airport(5)"));
        System.out.println(row(""));
        System.out.println(row("  BLUE LINE:"));
        System.out.println(row("    North Stn(6)--Tech Park(7)--City Square(1)--Stadium(8)"));
        System.out.println(row("    Stadium(8)--South Mall(9)--Harbor(10)"));
        System.out.println(row(""));
        System.out.println(row("  YELLOW LINE:"));
        System.out.println(row("    East Gate(11)--Market Jn(3)--Stadium(8)"));
        System.out.println(row("    Stadium(8)--West End(12)--Industrial Zone(13)"));
        System.out.println(row(""));
        System.out.println(row("  GREEN LINE:"));
        System.out.println(row("    Hills(14)--University(2)--Tech Park(7)--East Gate(11)"));
        System.out.println(row(""));
        System.out.println(row("  INTERCHANGE STATIONS:"));
        System.out.println(row("    City Square(1)     Red <-> Blue"));
        System.out.println(row("    Market Jn(3)       Red <-> Yellow"));
        System.out.println(row("    University(2)      Red <-> Green"));
        System.out.println(row("    Tech Park(7)       Blue <-> Green"));
        System.out.println(row("    Stadium(8)         Blue <-> Yellow"));
        System.out.println(row("    East Gate(11)      Yellow <-> Green"));
        System.out.println(BOX_BTM);
    }

    // ── Box-drawing helpers ───────────────────────────────────────────────────

    static final String BOX_TOP = "╔" + "═".repeat(62) + "╗";
    static final String BOX_MID = "╠" + "═".repeat(62) + "╣";
    static final String BOX_BTM = "╚" + "═".repeat(62) + "╝";

    /** Pad / truncate {@code content} to fill one 62-char-wide box row. */
    static String row(String content) {
        if (content.length() > 62) content = content.substring(0, 62);
        return "║" + content + " ".repeat(62 - content.length()) + "║";
    }
}
