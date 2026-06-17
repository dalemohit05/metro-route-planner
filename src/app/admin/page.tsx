import { createServerSupabaseClient } from '@/lib/supabase/server';
import { signOut } from '@/lib/actions/auth';

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();

  // Get all stats in parallel
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
    <main className="min-h-screen text-white"
      style={{ background: 'radial-gradient(ellipse at 20% 0%, #0d1b3e 0%, #020817 60%)' }}>

      {/* Header */}
      <header style={{ background: 'rgba(8,12,28,0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        className="px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              className="flex items-center justify-center">🚇</div>
            <div>
              <div className="text-white font-bold text-sm">SD Metro</div>
              <div className="text-xs" style={{ color: '#f59e0b' }}>Admin Panel</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
              User View
            </a>
            <form action={signOut}>
              <button type="submit"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', fontSize: '13px', padding: '6px 14px', cursor: 'pointer' }}>
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of SD Metro operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: totalUsers || 0, icon: '👥', accent: '#6366f1', change: 'All registered users' },
            { label: 'Total Bookings', value: totalBookings || 0, icon: '🎫', accent: '#8b5cf6', change: 'All time bookings' },
            { label: 'Total Revenue', value: 'Rs. ' + totalRevenue, icon: '💰', accent: '#10b981', change: 'From all bookings' },
            { label: 'Active Today', value: confirmedBookings, icon: '✅', accent: '#06b6d4', change: 'Confirmed bookings' },
          ].map((stat) => (
            <div key={stat.label}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: stat.accent, opacity: 0.6 }} />
              <div className="text-2xl mb-3">{stat.icon}</div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-300">{stat.label}</div>
              <div className="text-xs text-gray-600 mt-1">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Recent Bookings */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>🎫</span> Recent Bookings
            </h2>
            <div className="space-y-3">
              {recentBookings && recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking.id}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px' }}
                    className="flex items-center justify-between">
                    <div>
                      <div className="text-white text-sm font-medium">
                        {booking.journey_date}
                      </div>
                      <div className="text-gray-500 text-xs mt-0.5">
                        {new Date(booking.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-semibold text-sm">
                        Rs. {booking.fare}
                      </div>
                      <div style={{
                        background: booking.status === 'confirmed'
                          ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        border: booking.status === 'confirmed'
                          ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)',
                        color: booking.status === 'confirmed' ? '#10b981' : '#ef4444',
                        borderRadius: '6px', padding: '2px 8px', fontSize: '10px',
                        display: 'inline-block', marginTop: '4px', textTransform: 'capitalize'
                      }}>
                        {booking.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm text-center py-4">No bookings yet</p>
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>👥</span> Recent Users
            </h2>
            <div className="space-y-3">
              {recentUsers && recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user.id}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px' }}
                    className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                        {(user.full_name || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">
                          {user.full_name || 'Unknown User'}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5">
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      background: user.role === 'admin'
                        ? 'rgba(245,158,11,0.1)' : 'rgba(99,102,241,0.1)',
                      border: user.role === 'admin'
                        ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(99,102,241,0.2)',
                      color: user.role === 'admin' ? '#f59e0b' : '#818cf8',
                      borderRadius: '6px', padding: '2px 10px', fontSize: '10px',
                      textTransform: 'capitalize'
                    }}>
                      {user.role}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm text-center py-4">No users yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: 'View Metro Map', href: '/map', icon: '🗺️', desc: 'Interactive 3D map' },
            { label: 'Route Planner', href: '/planner', icon: '📍', desc: 'Plan routes' },
            { label: 'Book Ticket', href: '/booking', icon: '🎫', desc: 'New booking' },
          ].map(link => (
            <a key={link.label} href={link.href}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', textDecoration: 'none', transition: 'all 0.2s' }}
              className="hover:bg-white/5">
              <div className="text-2xl mb-2">{link.icon}</div>
              <div className="text-white text-sm font-medium">{link.label}</div>
              <div className="text-gray-600 text-xs mt-1">{link.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}