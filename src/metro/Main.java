package metro;

import metro.algorithms.BFS;
import metro.algorithms.Dijkstra;
import metro.graph.Graph.EdgeNode;
import metro.graph.Station;

import java.util.Scanner;

/**
 * Entry point for the Metro Route Planner terminal application.
 *
 * Menu options:
 *   1. List all stations (sorted via AVL Tree)
 *   2. Shortest path by distance  (Dijkstra)
 *   3. Fastest path by time       (Dijkstra)
 *   4. Cheapest path by fare      (Dijkstra)
 *   5. Path with fewest stops     (BFS)
 *   6. View metro map
 *   0. Exit
 */
public class Main {

    private static MetroNetwork metro;
    private static Scanner      scanner;

    // ─────────────────────────────────────────────────────────────────────────

    public static void main(String[] args) {
        metro   = new MetroNetwork();
        scanner = new Scanner(System.in);

        printBanner();

        boolean running = true;
        while (running) {
            printMenu();
            System.out.print("  Enter choice: ");
            String input = scanner.nextLine().trim();

            switch (input) {
                case "1": metro.printAllStations();                    break;
                case "2": routeQuery(Dijkstra.BY_DISTANCE);            break;
                case "3": routeQuery(Dijkstra.BY_TIME);                break;
                case "4": routeQuery(Dijkstra.BY_COST);                break;
                case "5": bfsQuery();                                  break;
                case "6": metro.printMetroMap();                       break;
                case "0":
                    System.out.println("\n  Goodbye! Safe travels.\n");
                    running = false;
                    break;
                default:
                    System.out.println("  [!] Invalid option. Please enter 0-6.");
            }
        }
        scanner.close();
    }

    // ── Banner & menu ─────────────────────────────────────────────────────────

    private static void printBanner() {
        System.out.println(MetroNetwork.BOX_TOP);
        System.out.println(MetroNetwork.row(""));
        System.out.println(MetroNetwork.row("       METRO ROUTE PLANNER  v1.0"));
        System.out.println(MetroNetwork.row(""));
        System.out.println(MetroNetwork.row("  Data Structures used:"));
        System.out.println(MetroNetwork.row("    Graph  |  Dijkstra  |  BFS  |  AVL Tree"));
        System.out.println(MetroNetwork.row("    Hash Table  |  Min-Heap  |  Stack  |  Queue"));
        System.out.println(MetroNetwork.row(""));
        System.out.println(MetroNetwork.BOX_BTM);
    }

    private static void printMenu() {
        System.out.println();
        System.out.println("  +------------------------------------+");
        System.out.println("  |           MAIN  MENU              |");
        System.out.println("  +------------------------------------+");
        System.out.println("  |  1. List All Stations             |");
        System.out.println("  |  2. Shortest Path  (by distance)  |");
        System.out.println("  |  3. Fastest Path   (by time)      |");
        System.out.println("  |  4. Cheapest Path  (by fare)      |");
        System.out.println("  |  5. Min-Stops Path (BFS)          |");
        System.out.println("  |  6. View Metro Map                |");
        System.out.println("  |  0. Exit                          |");
        System.out.println("  +------------------------------------+");
    }

    // ── Route query helpers ───────────────────────────────────────────────────

    private static void routeQuery(int mode) {
        int[] pair = promptSourceDest();
        if (pair == null) return;

        int src  = pair[0];
        int dst  = pair[1];

        if (src == dst) {
            System.out.println("  [!] Source and destination are the same station.");
            return;
        }

        Dijkstra dijkstra = new Dijkstra(metro.getStationCount());
        dijkstra.compute(metro.getGraph(), src, mode);

        int[] path = dijkstra.getPath(dst);
        if (path.length == 0) {
            System.out.println("  [!] No path found between the selected stations.");
            return;
        }

        String label;
        switch (mode) {
            case Dijkstra.BY_DISTANCE: label = "Shortest Distance"; break;
            case Dijkstra.BY_TIME:     label = "Fastest Route";     break;
            default:                   label = "Cheapest Route";
        }
        printRoute(path, label);
    }

    private static void bfsQuery() {
        int[] pair = promptSourceDest();
        if (pair == null) return;

        int src = pair[0];
        int dst = pair[1];

        if (src == dst) {
            System.out.println("  [!] Source and destination are the same station.");
            return;
        }

        BFS bfs = new BFS(metro.getStationCount());
        if (!bfs.compute(metro.getGraph(), src, dst)) {
            System.out.println("  [!] No path found between the selected stations.");
            return;
        }
        printRoute(bfs.getPath(dst), "Minimum Stops (BFS)");
    }

    // ── Input helpers ─────────────────────────────────────────────────────────

    /**
     * Prompt the user for source and destination stations.
     *
     * @return int[]{srcId, dstId} or {@code null} on any error.
     */
    private static int[] promptSourceDest() {
        metro.printAllStations();

        System.out.print("\n  Enter SOURCE station (name or ID): ");
        String srcInput = scanner.nextLine().trim();

        System.out.print("  Enter DESTINATION station (name or ID): ");
        String dstInput = scanner.nextLine().trim();

        int src = resolveStation(srcInput);
        int dst = resolveStation(dstInput);

        if (src < 0) { System.out.println("  [!] Source not found: " + srcInput);      return null; }
        if (dst < 0) { System.out.println("  [!] Destination not found: " + dstInput); return null; }

        return new int[]{ src, dst };
    }

    /**
     * Resolve a user-entered string to a station ID.
     * Accepts a numeric ID or a case-insensitive station name.
     *
     * @return station ID, or -1 if not found.
     */
    private static int resolveStation(String input) {
        // Try numeric ID first
        try {
            int id = Integer.parseInt(input);
            if (id >= 0 && id < metro.getStationCount()) return id;
        } catch (NumberFormatException ignored) { }

        // Try by name
        Integer id = metro.getIdByName(input);
        return id == null ? -1 : id;
    }

    // ── Route display ─────────────────────────────────────────────────────────

    private static void printRoute(int[] path, String routeType) {
        // Accumulate totals
        int totalDist = 0, totalTime = 0, totalCost = 0;
        String[] segLines = new String[path.length - 1];

        for (int i = 0; i < path.length - 1; i++) {
            EdgeNode node = metro.getGraph().getAdjList(path[i]);
            while (node != null) {
                if (node.edge.getDestination() == path[i + 1]) {
                    totalDist += node.edge.getDistance();
                    totalTime += node.edge.getTime();
                    totalCost += node.edge.getCost();
                    segLines[i] = node.edge.getLine();
                    break;
                }
                node = node.next;
            }
        }

        System.out.println(MetroNetwork.BOX_TOP);
        System.out.println(MetroNetwork.row("  Route Type : " + routeType));
        System.out.println(MetroNetwork.BOX_MID);
        System.out.println(MetroNetwork.row(String.format(
                "  Stops: %d  |  Dist: %d km  |  Time: %d min  |  Fare: Rs.%d",
                path.length - 1, totalDist, totalTime, totalCost)));
        System.out.println(MetroNetwork.BOX_MID);
        System.out.println(MetroNetwork.row("  PATH:"));
        System.out.println(MetroNetwork.row(""));

        for (int i = 0; i < path.length; i++) {
            Station s     = metro.getStation(path[i]);
            String  label;
            if      (i == 0)              label = "  [START]";
            else if (i == path.length - 1) label = "  [ END ]";
            else                          label = "         ";

            String nameStr = label + " " + s.getName() + "  [" + s.getLine() + "]";
            System.out.println(MetroNetwork.row(nameStr));

            // Show line-change indicator between segments
            if (i > 0 && i < path.length - 1 && segLines[i - 1] != null && segLines[i] != null
                    && !segLines[i - 1].equals(segLines[i])) {
                System.out.println(MetroNetwork.row(
                        "           >>> Change to " + segLines[i]));
            }
        }

        System.out.println(MetroNetwork.row(""));
        System.out.println(MetroNetwork.BOX_BTM);
    }
}
