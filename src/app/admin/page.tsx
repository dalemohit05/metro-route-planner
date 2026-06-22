import { createServerSupabaseClient } from '@/lib/supabase/server';
import { signOut } from '@/lib/actions/auth';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();

  const [
    { count: totalUsers },
    { count: totalBookings },
    { data: revenueData },
    { data: recentBookings },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('fare'),
    supabase.from('bookings').select(`
      id, fare, status, journey_date, created_at
    `).order('created_at', { ascending: false }).limit(10),
    supabase.from('profiles').select('id, full_name, role, created_at')
      .order('created_at', { ascending: false }).limit(10),
  ]);

  const totalRevenue = revenueData?.reduce((sum, b) => sum + (b.fare || 0), 0) || 0;
  const confirmedBookings = recentBookings?.filter(b => b.status === 'confirmed').length || 0;

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>

      {/* Header */}
      <header style={{ background: 'var(--bg-header)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-subtle)' }}
        className="px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo showTagline={false} />
          <div className="flex items-center gap-4">
            <span style={{ color: 'var(--accent-amber)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Admin Panel
            </span>
            <ThemeToggle />
            <a href="/dashboard" style={{ color: 'var(--text-secondary)' }} className="text-sm hover:opacity-80 transition-opacity">
              User View
            </a>
            <form action={signOut}>
              <button type="submit"
                style={{ background: 'color-mix(in srgb, var(--accent-red) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-red) 25%, transparent)', borderRadius: '8px', color: 'var(--accent-red)', fontSize: '13px', padding: '6px 14px', cursor: 'pointer' }}>
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1>
          <p className="text-sm mt-1 font-devanagari" style={{ color: 'var(--text-muted)' }}>मेट्रोमित्र Operations Overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: totalUsers || 0, icon: '👥', accent: 'var(--accent-indigo)', change: 'All registered users' },
            { label: 'Total Bookings', value: totalBookings || 0, icon: '🎫', accent: 'var(--accent-purple)', change: 'All time bookings' },
            { label: 'Total Revenue', value: 'Rs. ' + totalRevenue, icon: '💰', accent: 'var(--accent-green)', change: 'From all bookings' },
            { label: 'Active Today', value: confirmedBookings, icon: '✅', accent: 'var(--accent-cyan)', change: 'Confirmed bookings' },
          ].map((stat) => (
            <div key={stat.label}
              style={{ background: 'var(--bg-stat)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: stat.accent, opacity: 0.6 }} />
              <div className="text-2xl mb-3">{stat.icon}</div>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Recent Bookings */}
          <div style={{ background: 'var(--bg-stat)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px' }}>
            <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span>🎫</span> Recent Bookings
            </h2>
            <div className="space-y-3">
              {recentBookings && recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking.id}
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px' }}
                    className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {booking.journey_date}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {new Date(booking.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm" style={{ color: 'var(--accent-green)' }}>
                        Rs. {booking.fare}
                      </div>
                      <div style={{
                        background: booking.status === 'confirmed'
                          ? 'color-mix(in srgb, var(--accent-green) 10%, transparent)' : 'color-mix(in srgb, var(--accent-red) 10%, transparent)',
                        border: booking.status === 'confirmed'
                          ? '1px solid color-mix(in srgb, var(--accent-green) 20%, transparent)' : '1px solid color-mix(in srgb, var(--accent-red) 20%, transparent)',
                        color: booking.status === 'confirmed' ? 'var(--accent-green)' : 'var(--accent-red)',
                        borderRadius: '6px', padding: '2px 8px', fontSize: '10px',
                        display: 'inline-block', marginTop: '4px', textTransform: 'capitalize'
                      }}>
                        {booking.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-4">No bookings yet</p>
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div style={{ background: 'var(--bg-stat)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px' }}>
            <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span>👥</span> Recent Users
            </h2>
            <div className="space-y-3">
              {recentUsers && recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user.id}
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px' }}
                    className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0, color: 'white' }}>
                        {(user.full_name || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {user.full_name || 'Unknown User'}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      background: user.role === 'admin'
                        ? 'color-mix(in srgb, var(--accent-amber) 10%, transparent)' : 'color-mix(in srgb, var(--accent-indigo) 10%, transparent)',
                      border: user.role === 'admin'
                        ? '1px solid color-mix(in srgb, var(--accent-amber) 20%, transparent)' : '1px solid color-mix(in srgb, var(--accent-indigo) 20%, transparent)',
                      color: user.role === 'admin' ? 'var(--accent-amber)' : 'var(--accent-indigo)',
                      borderRadius: '6px', padding: '2px 10px', fontSize: '10px',
                      textTransform: 'capitalize'
                    }}>
                      {user.role}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-4">No users yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: 'View Metro Map', href: '/map', icon: '🗺️', desc: 'Interactive metro map' },
            { label: 'Route Planner', href: '/planner', icon: '📍', desc: 'Plan routes' },
            { label: 'Book Ticket', href: '/booking', icon: '🎫', desc: 'New booking' },
          ].map(link => (
            <a key={link.label} href={link.href}
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px', textDecoration: 'none', transition: 'all 0.2s' }}>
              <div className="text-2xl mb-2">{link.icon}</div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{link.label}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{link.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
