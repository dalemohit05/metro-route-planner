# 🚇 मेट्रोमित्र (MetroMitra)

**Your Smart Pune Metro Companion** — a full-stack metro route planning and ticket booking platform built with Next.js, TypeScript, and Supabase.

🔗 **Live Demo:** [metro-route-planner-three.vercel.app](https://metro-route-planner-three.vercel.app)

---

## ✨ Features

- **Smart Route Planning** — Dijkstra's algorithm finds the shortest path between any two stations, with automatic interchange detection
- **Interactive Metro Map** — SVG-based map with both metro lines, animated trains, zoom controls, and clickable station info
- **Ticket Booking** — Multi-step booking flow with passenger details, journey preview, and instant QR code ticket generation
- **Authentication** — Secure signup/login with Supabase Auth and protected routes
- **User Dashboard** — Real-time stats, recent journeys, and network overview pulled live from the database
- **Profile Management** — Editable profile, travel history, saved routes, and theme preferences
- **Admin Panel** — User management, booking analytics, a revenue chart, and station management
- **Light / Dark / Auto Theme** — Time-based automatic theme switching with manual override, persisted across sessions

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion (animations)
- Recharts (admin analytics)

**Backend**
- Next.js Server Actions & API Routes
- Supabase (PostgreSQL + Auth)
- Row Level Security (RLS) policies

**Core Algorithm**
- Custom TypeScript implementation of Dijkstra's shortest-path algorithm with a binary min-heap, adapted from an earlier Java DSA project

---

## 📐 Architecture Highlights

- Server Components for data-fetching pages (dashboard, admin, profile)
- Client Components for interactive UI (route planner, map, booking flow, theme toggle)
- CSS custom properties for a fully theme-aware design system (no hardcoded colors)
- Server Actions for all mutations (auth, bookings, profile updates) — no separate REST layer needed

---

## 🚀 Getting Started

```bash
git clone https://github.com/dalemohit05/metro-route-planner.git
cd metro-route-planner
npm install
```

Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure

```
src/
├── app/              # Pages (App Router)
│   ├── (auth)/       # Login, Signup
│   ├── dashboard/    # User dashboard
│   ├── planner/      # Route planner
│   ├── map/          # Interactive metro map
│   ├── booking/      # Ticket booking flow
│   ├── profile/      # User profile
│   ├── admin/        # Admin panel
│   └── api/route/    # Route calculation API
├── components/       # Reusable UI components
└── lib/
    ├── actions/      # Server Actions (auth, booking)
    ├── metro/        # Station data & Dijkstra algorithm
    └── supabase/     # Supabase client setup
```

---

## 📝 Note

This project began as a Java console-based DSA mini-project implementing graph algorithms (Dijkstra's shortest path, adjacency lists, min-heaps) for the Pune Metro network. It was later rebuilt from the ground up as a production-style full-stack web application, while preserving the original algorithmic core.

---

## 📄 License

This project is open source and available for learning purposes.
