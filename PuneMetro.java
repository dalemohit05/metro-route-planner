// ─────────────────────────────────────────────────
// PuneMetro.java
// Main entry point. Hardcodes real Pune Metro network
// and provides a terminal menu for all features.
//
// Pune Metro Lines:
//   Purple Line : PCMC ↔ Swargate        (14 stations)
//   Aqua Line   : Vanaz ↔ Ramwadi        (13 stations)
//   Interchange : Shivajinagar (index 9)
//
// Total: 26 stations
// ─────────────────────────────────────────────────

import java.util.Scanner;

public class PuneMetro {

    static Graph   graph;
    static Scanner scanner = new Scanner(System.in);

    // ──────────────────────────────────────────────
    // Station Index Map
    // Purple Line : 0  – 13
    // Aqua Line   : 14 – 25  (9 = Shivajinagar, shared)
    // ──────────────────────────────────────────────

    public static void main(String[] args) {
        initializeNetwork();
        printWelcome();
        showMenu();
    }

    // ──────────────────────────────────────────────
    // NETWORK INITIALIZATION
    // ──────────────────────────────────────────────
    static void initializeNetwork() {
        graph = new Graph(26);

        // ── Purple Line ───────────────────────────
        graph.addStation(0,  "PCMC",                   "Purple Line");
        graph.addStation(1,  "Sant Tukaram Nagar",      "Purple Line");
        graph.addStation(2,  "Bhosari",                 "Purple Line");
        graph.addStation(3,  "Kasarwadi",               "Purple Line");
        graph.addStation(4,  "Phugewadi",               "Purple Line");
        graph.addStation(5,  "Dapodi",                  "Purple Line");
        graph.addStation(6,  "Bopodi",                  "Purple Line");
        graph.addStation(7,  "Khadki",                  "Purple Line");
        graph.addStation(8,  "Range Hills",             "Purple Line");
        graph.addStation(9,  "Shivajinagar",            "Purple Line / Aqua Line"); // INTERCHANGE
        graph.addStation(10, "Civil Court",             "Purple Line");
        graph.addStation(11, "Budhwar Peth",            "Purple Line");
        graph.addStation(12, "Mandai",                  "Purple Line");
        graph.addStation(13, "Swargate",                "Purple Line");

        // ── Aqua Line ─────────────────────────────
        graph.addStation(14, "Vanaz",                   "Aqua Line");
        graph.addStation(15, "Anand Nagar",             "Aqua Line");
        graph.addStation(16, "Ideal Colony",            "Aqua Line");
        graph.addStation(17, "Nal Stop",                "Aqua Line");
        graph.addStation(18, "Garware College",         "Aqua Line");
        graph.addStation(19, "Deccan Gymkhana",         "Aqua Line");
        graph.addStation(20, "Chhatrapati Sambhaji",    "Aqua Line");
        graph.addStation(21, "PMC",                     "Aqua Line");
        // Shivajinagar (9) is shared — already added above
        graph.addStation(22, "Bund Garden",             "Aqua Line");
        graph.addStation(23, "Yerawada",                "Aqua Line");
        graph.addStation(24, "Kalyani Nagar",           "Aqua Line");
        graph.addStation(25, "Ramwadi",                 "Aqua Line");

        // ── Purple Line Routes ─────────────────────
        //  ( stationA, stationB, distance_km, fare_Rs )
        graph.addRoute(0,  1,  1.5, 10);
        graph.addRoute(1,  2,  1.2, 10);
        graph.addRoute(2,  3,  1.8, 10);
        graph.addRoute(3,  4,  1.5, 10);
        graph.addRoute(4,  5,  1.3, 10);
        graph.addRoute(5,  6,  1.1, 10);
        graph.addRoute(6,  7,  1.4, 10);
        graph.addRoute(7,  8,  1.2, 10);
        graph.addRoute(8,  9,  2.1, 15);  // Range Hills → Shivajinagar (longer)
        graph.addRoute(9,  10, 1.5, 10);
        graph.addRoute(10, 11, 1.2, 10);
        graph.addRoute(11, 12, 0.9, 10);
        graph.addRoute(12, 13, 1.1, 10);

        // ── Aqua Line Routes ──────────────────────
        graph.addRoute(14, 15, 1.8, 10);
        graph.addRoute(15, 16, 1.3, 10);
        graph.addRoute(16, 17, 1.1, 10);
        graph.addRoute(17, 18, 0.9, 10);
        graph.addRoute(18, 19, 1.2, 10);
        graph.addRoute(19, 20, 1.0, 10);
        graph.addRoute(20, 21, 1.3, 10);
        graph.addRoute(21, 9,  1.5, 10);  // PMC → Shivajinagar (interchange)
        graph.addRoute(9,  22, 1.8, 10);  // Shivajinagar → Bund Garden
        graph.addRoute(22, 23, 2.1, 15);  // Bund Garden → Yerawada (longer)
        graph.addRoute(23, 24, 1.6, 10);
        graph.addRoute(24, 25, 1.4, 10);
    }

    // ──────────────────────────────────────────────
    // MAIN MENU
    // ──────────────────────────────────────────────
    static void showMenu() {
        while (true) {
            System.out.println("\n  ╔══════════════════════════════════════════╗");
            System.out.println("  ║       PUNE METRO ROUTE PLANNER           ║");
            System.out.println("  ╠══════════════════════════════════════════╣");
            System.out.println("  ║  1. Shortest Distance Route  (Dijkstra)  ║");
            System.out.println("  ║  2. Fewest Stops Route       (BFS)       ║");
            System.out.println("  ║  3. Cheapest Fare Route      (Dijkstra)  ║");
            System.out.println("  ║  4. Complete Journey Summary (All 3)     ║");
            System.out.println("  ║──────────────────────────────────────────║");
            System.out.println("  ║  5. Display All Stations   (AVL Tree)    ║");
            System.out.println("  ║  6. Search a Station       (AVL Tree)    ║");
            System.out.println("  ║  7. View Station Connections             ║");
            System.out.println("  ║──────────────────────────────────────────║");
            System.out.println("  ║  8. Close a Station (maintenance)        ║");
            System.out.println("  ║  9. Reopen a Station                     ║");
            System.out.println("  ║──────────────────────────────────────────║");
            System.out.println("  ║  0. Exit                                 ║");
            System.out.println("  ╚══════════════════════════════════════════╝");
            System.out.print("\n  Enter choice: ");

            int choice;
            try {
                choice = Integer.parseInt(scanner.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.println("  Invalid input. Enter a number.");
                continue;
            }

            switch (choice) {
                case 1: routeMenu("distance"); break;
                case 2: routeMenu("stops");    break;
                case 3: routeMenu("fare");     break;
                case 4: summaryMenu();         break;
                case 5: graph.displayStationsAlphabetical(); break;
                case 6: searchMenu();          break;
                case 7: connectionsMenu();     break;
                case 8: closeStationMenu();    break;
                case 9: reopenStationMenu();   break;
                case 0:
                    System.out.println("\n  Thank you for using Pune Metro Planner!");
                    System.out.println("  Have a safe journey!\n");
                    return;
                default:
                    System.out.println("  Invalid choice. Try again.");
            }
        }
    }

    // ──────────────────────────────────────────────
    // MENU HANDLERS
    // ──────────────────────────────────────────────

    static void routeMenu(String type) {
        String src  = getStationInput("Source Station");
        String dest = getStationInput("Destination Station");
        if (src == null || dest == null) return;

        int s = graph.getIndex(src);
        int d = graph.getIndex(dest);

        if (s == d) {
            System.out.println("  Source and destination are the same station.");
            return;
        }

        if (type.equals("stops")) graph.bfs(s, d);
        else                      graph.dijkstra(s, d, type);
    }

    static void summaryMenu() {
        String src  = getStationInput("Source Station");
        String dest = getStationInput("Destination Station");
        if (src == null || dest == null) return;

        int s = graph.getIndex(src);
        int d = graph.getIndex(dest);

        if (s == d) {
            System.out.println("  Source and destination are the same station.");
            return;
        }

        graph.fullSummary(s, d);
    }

    static void searchMenu() {
        System.out.print("\n  Enter station name to search: ");
        String name = scanner.nextLine().trim();

        if (graph.searchStation(name)) {
            int idx = graph.getIndex(name);
            System.out.println("\n  Station Found!");
            System.out.println("  Name : " + name);
            System.out.println("  Line : " + graph.getLine(idx));
            System.out.println("  Status : " + (graph.isClosed(idx) ? "CLOSED (maintenance)" : "Open"));
        } else {
            System.out.println("  Station not found: '" + name + "'");
            System.out.println("  Use option 5 to view all valid station names.");
        }
    }

    static void connectionsMenu() {
        System.out.print("\n  Enter station name: ");
        String name = scanner.nextLine().trim();
        graph.displayConnections(name);
    }

    static void closeStationMenu() {
        System.out.print("\n  Enter station name to close: ");
        String name = scanner.nextLine().trim();
        if (!graph.isValid(name)) {
            System.out.println("  Station not found.");
            return;
        }
        graph.closeStation(graph.getIndex(name));
        System.out.println("  Station '" + name + "' is now CLOSED.");
        System.out.println("  Alternate routes will be used automatically.");
    }

    static void reopenStationMenu() {
        System.out.print("\n  Enter station name to reopen: ");
        String name = scanner.nextLine().trim();
        if (!graph.isValid(name)) {
            System.out.println("  Station not found.");
            return;
        }
        graph.openStation(graph.getIndex(name));
        System.out.println("  Station '" + name + "' is now OPEN.");
    }

    // ──────────────────────────────────────────────
    // HELPER: Get and validate station input
    // ──────────────────────────────────────────────
    static String getStationInput(String label) {
        System.out.print("  Enter " + label + ": ");
        String name = scanner.nextLine().trim();
        if (!graph.isValid(name)) {
            System.out.println("  Invalid station: '" + name + "'");
            System.out.println("  Use option 5 to see all valid station names.");
            return null;
        }
        return name;
    }

    // ──────────────────────────────────────────────
    // WELCOME SCREEN
    // ──────────────────────────────────────────────
    static void printWelcome() {
        System.out.println("\n  ╔══════════════════════════════════════════════╗");
        System.out.println("  ║                                              ║");
        System.out.println("  ║        PUNE METRO ROUTE PLANNER              ║");
        System.out.println("  ║        Data Structures Project — Sem IV      ║");
        System.out.println("  ║                                              ║");
        System.out.println("  ║   Lines : Purple Line  |  Aqua Line          ║");
        System.out.println("  ║   Stations : 26  |  Interchange : Shivajinagar ║");
        System.out.println("  ║                                              ║");
        System.out.println("  ╚══════════════════════════════════════════════╝");
    }
}
