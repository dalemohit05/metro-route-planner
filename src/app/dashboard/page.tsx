import { createServerSupabaseClient } from '@/lib/supabase/server';
import { signOut } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: 'Good Morning', emoji: '👋' };
  if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', emoji: '☀️' };
  if (hour >= 17 && hour < 20) return { text: 'Good Evening', emoji: '🌆' };
  return { text: 'Good Evening', emoji: '🌙' };
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const [
    { count: stationsCount },
    { count: routesPlannedCount },
    { data: bookings },
    { count: ticketsCount },
  ] = await Promise.all([
    supabase.from('stations').select('*', { count: 'exact', head: true }),
    supabase.from('route_history').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase
      .from('bookings')
      .select('id, fare, distance, travel_time, journey_date, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ]);

  const allBookingsForAvg = bookings || [];
  const totalDistance = allBookingsForAvg.reduce((sum, b) => sum + (b.distance || 0), 0);
  const avgTime = allBookingsForAvg.length
    ? Math.round(allBookingsForAvg.reduce((sum, b) => sum + (b.travel_time || 0), 0) / allBookingsForAvg.length)
    : 0;

  const greeting = getGreeting();

  const stats = [
    { icon: '🚉', label: 'Stations Available', value: stationsCount || 0, accent: 'var(--accent-cyan)' },
    { icon: '🗺️', label: 'Routes Planned', value: routesPlannedCount || 0, accent: 'var(--accent-purple)' },
    { icon: '🎫', label: 'Tickets Booked', value: ticketsCount || 0, accent: 'var(--accent-green)' },
    { icon: '📍', label: 'Travel Distance', value: totalDistance.toFixed(1) + ' km', accent: 'var(--accent-indigo)' },
    { icon: '⏱️', label: 'Avg Travel Time', value: avgTime + ' min', accent: 'var(--accent-amber)' },
  ];

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>

      {/* Header */}
      <header style={{ background: 'var(--bg-header)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-subtle)' }} className="px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <form action={signOut}>
              <button
                type="submit"
                style={{ background: 'color-mix(in srgb, var(--accent-red) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-red) 25%, transparent)', borderRadius: '8px', color: 'var(--accent-red)', fontSize: '13px', padding: '6px 14px', cursor: 'pointer' }}
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Welcome */}
        <div
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}
        >
          <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {greeting.text}, {profile?.full_name || 'there'}! {greeting.emoji}
          </h2>
          <p className="text-sm font-devanagari" style={{ color: 'var(--text-secondary)' }}>
            Welcome back to मेट्रोमित्र
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{ background: 'var(--bg-stat)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '16px', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: stat.accent, opacity: 0.6 }} />
              <div className="text-xl mb-2">{stat.icon}</div>
              <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <a href="/planner"
            style={{ background: 'linear-gradient(135deg, var(--accent-indigo-dim), var(--accent-indigo))', borderRadius: '16px', padding: '24px', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
            <div className="text-3xl mb-3">🗺️</div>
            <div className="text-white font-semibold text-lg">Plan Route</div>
            <div style={{ color: 'rgba(255,255,255,0.8)' }} className="text-sm mt-1">Find shortest path</div>
          </a>

          <a href="/booking"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
            <div className="text-3xl mb-3">🎫</div>
            <div className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Book Ticket</div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Book your journey</div>
          </a>

          <a href="/map"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
            <div className="text-3xl mb-3">🌐</div>
            <div className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Metro Map</div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Interactive metro map</div>
          </a>

          <a href="/profile"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
            <div className="text-3xl mb-3">👤</div>
            <div className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Profile</div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>View your account</div>
          </a>

          <a href="/admin"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
            <div className="text-3xl mb-3">👑</div>
            <div className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Admin Panel</div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage system</div>
          </a>

        </div>

        {/* Two Column: Recent Journeys + Network Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

          {/* Recent Journeys */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px' }}>
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span>🕓</span> Recent Journeys
            </h3>
            {bookings && bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id}
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px' }}
                    className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {b.journey_date}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {b.distance} km · {b.travel_time} min
                      </div>
                    </div>
                    <div style={{ color: 'var(--accent-green)' }} className="font-semibold text-sm">
                      Rs. {b.fare}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p style={{ color: 'var(--text-muted)' }} className="text-sm mb-3">No journeys yet</p>
                <a href="/planner" style={{ color: 'var(--accent-indigo)' }} className="text-sm font-medium hover:underline">
                  Plan your first route →
                </a>
              </div>
            )}
          </div>

          {/* Metro Network Overview */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px' }}>
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span>🚇</span> Metro Network
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-purple)', display: 'inline-block' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Purple Line</span>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>14 stations</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-cyan)', display: 'inline-block' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Aqua Line</span>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>13 stations</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-amber)', display: 'inline-block' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Interchange</span>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Shivajinagar</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '8px', paddingTop: '12px' }}>
                <a href="/map" style={{ color: 'var(--accent-indigo)' }} className="text-sm font-medium hover:underline">
                  Explore full map →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px' }}>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span>📢</span> Announcements
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span style={{ color: 'var(--accent-indigo)' }} className="text-xs mt-0.5">●</span>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                New Light/Dark/Auto theme support is now live — switch anytime from the navbar.
              </p>
            </div>
            <div className="flex gap-3">
              <span style={{ color: 'var(--accent-green)' }} className="text-xs mt-0.5">●</span>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Interactive metro map updated with smoother train animations.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
