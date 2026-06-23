import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

const FEATURES = [
  { icon: '🗺️', title: 'Route Planning', desc: 'Find the fastest path between any two stations using Dijkstra\'s algorithm.' },
  { icon: '🎫', title: 'Ticket Booking', desc: 'Book your metro ticket in seconds and get an instant QR code.' },
  { icon: '🌐', title: 'Metro Map', desc: 'Explore an interactive map of every station across both lines.' },
  { icon: '💰', title: 'Fare Calculator', desc: 'Know your exact fare before you travel, no surprises.' },
  { icon: '⚡', title: 'Route Optimization', desc: 'Always get the shortest, most efficient journey available.' },
  { icon: '🕓', title: 'Travel History', desc: 'Look back at your past journeys and rebook in one tap.' },
];

const WHY_POINTS = [
  { icon: '🚇', title: 'Built for Pune Metro', desc: 'Every station, every line, modeled accurately for the real network.' },
  { icon: '⚙️', title: 'Algorithm-powered', desc: 'Dijkstra\'s shortest-path algorithm finds your fastest route every time.' },
  { icon: '🔒', title: 'Secure & Reliable', desc: 'Your bookings and data are protected with industry-standard authentication.' },
  { icon: '📱', title: 'Works Everywhere', desc: 'A clean experience whether you\'re on desktop, tablet, or phone.' },
];

const TESTIMONIALS = [
  { name: 'Aditi Sharma', role: 'Daily Commuter', quote: 'MetroMitra cut my morning planning down to seconds. I just check the route and go.', avatar: 'A' },
  { name: 'Rohan Patil', role: 'College Student', quote: 'The fare calculator is a lifesaver before I top up my card. No more guessing.', avatar: 'R' },
  { name: 'Sneha Kulkarni', role: 'Working Professional', quote: 'Booking a ticket with a QR code in under a minute? This is how it should be.', avatar: 'S' },
];

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }} className="min-h-screen">

      {/* Header */}
      <header
        style={{ background: 'var(--bg-header)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-subtle)' }}
        className="px-6 py-4 sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/login"
              style={{ color: 'var(--text-secondary)' }}
              className="text-sm px-4 py-2 hover:opacity-80 transition-opacity"
            >
              Login
            </a>
            <a
              href="/signup"
              style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-indigo-dim))' }}
              className="text-sm px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105"
            >
              Sign Up
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <Logo size="lg" showTagline taglineLang="hi" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Smart Metro Travel for Pune
          </h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-lg mb-10 max-w-xl mx-auto">
            Find the fastest routes, estimate fares, and book metro tickets instantly across Pune Metro.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/signup"
              style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-indigo-dim))' }}
              className="px-7 py-3.5 rounded-xl text-white font-semibold transition-all hover:scale-105"
            >
              Plan Journey
            </a>
            <a
              href="/signup"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
              className="px-7 py-3.5 rounded-xl font-semibold transition-all hover:scale-105"
            >
              Book Ticket
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-6 pb-16">
        <div
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '20px' }}
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden"
        >
          {[
            { value: '26', label: 'Total Stations' },
            { value: '2', label: 'Active Routes' },
            { value: '10K+', label: 'Daily Travelers' },
            { value: '5K+', label: 'Tickets Generated' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{ borderRight: i < 3 ? '1px solid var(--border-subtle)' : 'none' }}
              className="px-6 py-8 text-center"
            >
              <div style={{ color: 'var(--accent-indigo)' }} className="text-3xl font-bold mb-1">
                {stat.value}
              </div>
              <div style={{ color: 'var(--text-muted)' }} className="text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Everything you need to travel smart</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              One platform for planning, booking, and exploring Pune Metro.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}
                className="p-6 transition-all hover:scale-[1.02]"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why MetroMitra */}
      <section className="px-6 pb-16">
        <div
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '24px' }}
          className="max-w-5xl mx-auto p-10"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3 font-devanagari">मेट्रोमित्र</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Why commuters choose MetroMitra</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {WHY_POINTS.map((point) => (
              <div key={point.title} className="flex gap-4">
                <div
                  style={{ background: 'color-mix(in srgb, var(--accent-indigo) 12%, transparent)' }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                >
                  {point.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{point.title}</h3>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Loved by commuters across Pune</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}
                className="p-6"
              >
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))', color: 'white' }}
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0"
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div style={{ color: 'var(--text-muted)' }} className="text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-20">
        <div
          style={{ background: 'linear-gradient(135deg, var(--accent-indigo-dim), var(--accent-purple-dim))' }}
          className="max-w-5xl mx-auto rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Ready to travel smarter?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)' }} className="mb-8 max-w-md mx-auto">
            Join thousands of commuters planning their Pune Metro journeys with MetroMitra.
          </p>
          <a
            href="/signup"
            style={{ background: 'white', color: 'var(--accent-indigo-dim)' }}
            className="inline-block px-8 py-3.5 rounded-xl font-semibold transition-all hover:scale-105"
          >
            Get Started Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-header)' }}
        className="px-6 py-10"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo />
          <div className="flex gap-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <a href="/login" className="hover:opacity-80 transition-opacity">Login</a>
            <a href="/signup" className="hover:opacity-80 transition-opacity">Sign Up</a>
            <a href="/map" className="hover:opacity-80 transition-opacity">Metro Map</a>
          </div>
          <p style={{ color: 'var(--text-muted)' }} className="text-xs">
            © 2026 MetroMitra. Built for Pune Metro commuters.
          </p>
        </div>
      </footer>
    </main>
  );
}
