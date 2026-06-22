'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { STATIONS } from '@/lib/metro/data';
import { bookTicket } from '@/lib/actions/booking';
import Image from 'next/image';
import Logo from '@/components/Logo';
import StationSelect from '@/components/StationSelect';
import ThemeToggle from '@/components/ThemeToggle';

interface TicketResult {
  ticketNumber: string;
  qrCode: string;
  from: string;
  to: string;
  fare: number;
  distance: number;
  time: number;
  stops: number;
  date: string;
  bookingId: string;
}

function BookingForm() {
  const searchParams = useSearchParams();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState<TicketResult | null>(null);

  useEffect(() => {
    const fromName = searchParams.get('fromName');
    const toName = searchParams.get('toName');

    if (fromName) {
      const fromStation = STATIONS.find((station) => station.name === fromName);
      if (fromStation) setFrom(String(fromStation.id));
    }

    if (toName) {
      const toStation = STATIONS.find((station) => station.name === toName);
      if (toStation) setTo(String(toStation.id));
    }
  }, [searchParams]);

  async function handleBooking() {
    if (!from || !to || !date) {
      setError('Please fill all fields');
      return;
    }
    if (from === to) {
      setError('Source and destination cannot be same');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('from', from);
    formData.append('to', to);
    formData.append('journeyDate', date);

    const result = await bookTicket(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.ticket) {
      setTicket(result.ticket);
    }
    setLoading(false);
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <header style={{ background: 'var(--bg-header)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-subtle)' }} className="px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4 text-sm">
            <a href="/map" style={{ color: 'var(--text-secondary)' }} className="hover:opacity-80 transition-opacity">Map</a>
            <a href="/planner" style={{ color: 'var(--text-secondary)' }} className="hover:opacity-80 transition-opacity">Planner</a>
            <a href="/dashboard" style={{ color: 'var(--text-secondary)' }} className="hover:opacity-80 transition-opacity">Dashboard</a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!ticket ? (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ background: 'var(--bg-card)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '28px' }}>
                <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Journey Details</h2>
                <div className="flex flex-col gap-5">

                  <div>
                    <label style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }} className="block mb-2">From Station</label>
                    <StationSelect
                      value={from}
                      onChange={setFrom}
                      placeholder="Select source station"
                      stations={STATIONS}
                      accentColor="var(--accent-purple)"
                    />
                  </div>

                  <div>
                    <label style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }} className="block mb-2">To Station</label>
                    <StationSelect
                      value={to}
                      onChange={setTo}
                      placeholder="Select destination station"
                      stations={STATIONS}
                      accentColor="var(--accent-cyan)"
                    />
                  </div>

                  <div>
                    <label style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }} className="block mb-2">Journey Date</label>
                    <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)}
                      style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: date ? 'var(--text-primary)' : 'var(--text-placeholder)' }}
                      className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>

                  {error && (
                    <div style={{ background: 'color-mix(in srgb, var(--accent-red) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-red) 25%, transparent)', borderRadius: '10px' }} className="px-4 py-3">
                      <p style={{ color: 'var(--accent-red)' }} className="text-sm">{error}</p>
                    </div>
                  )}

                  <motion.button onClick={handleBooking} disabled={loading}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 24px color-mix(in srgb, var(--accent-green) 25%, transparent)' }}
                    whileTap={{ scale: 0.98 }}
                    style={{ background: 'linear-gradient(135deg, var(--accent-green-dim), var(--accent-green))', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '600', fontSize: '14px', padding: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Booking...' : 'Book Ticket'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="ticket" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(135deg, var(--accent-indigo-dim), var(--accent-purple-dim))', padding: '20px 24px' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white font-devanagari">मेट्रोमित्र</h2>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '2px' }}>e-Ticket</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 12px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontFamily: 'monospace' }}>{ticket.ticketNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>From</p>
                      <p style={{ color: 'var(--text-primary)' }} className="font-bold text-lg">{ticket.from}</p>
                    </div>
                    <div style={{ color: 'var(--text-faint)', fontSize: '24px' }}>→</div>
                    <div className="text-right">
                      <p style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>To</p>
                      <p style={{ color: 'var(--text-primary)' }} className="font-bold text-lg">{ticket.to}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                      { label: 'Fare', value: 'Rs. ' + ticket.fare },
                      { label: 'Distance', value: ticket.distance + ' km' },
                      { label: 'Time', value: ticket.time + ' min' },
                      { label: 'Stops', value: '' + ticket.stops },
                    ].map(s => (
                      <div key={s.label} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-primary)' }} className="font-bold text-sm">{s.value}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '10px', marginTop: '2px' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="text-center mb-4">
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>Journey Date: <span style={{ color: 'var(--text-primary)' }}>{ticket.date}</span></p>
                  </div>

                  <div style={{ borderTop: '1px dashed var(--border-strong)', margin: '20px 0' }} />

                  <div className="flex flex-col items-center">
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginBottom: '16px' }}>Show this QR code at the station</p>
                    <div style={{ background: 'white', padding: '16px', borderRadius: '16px' }}>
                      <Image src={ticket.qrCode} alt="Ticket QR Code" width={180} height={180} />
                    </div>
                    <p style={{ color: 'var(--text-faint)', fontSize: '11px', marginTop: '12px' }}>Valid for journey date only</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={() => { setTicket(null); setFrom(''); setTo(''); setDate(''); }}
                  style={{ flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', padding: '13px', cursor: 'pointer' }}>
                  Book Another
                </button>
                <a href="/dashboard"
                  style={{ flex: 1, background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-indigo-dim))', borderRadius: '12px', color: 'white', fontSize: '13px', fontWeight: '600', padding: '13px', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                  Dashboard
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-solid)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    }>
      <BookingForm />
    </Suspense>
  );
}
