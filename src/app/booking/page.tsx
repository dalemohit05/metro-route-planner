'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { STATIONS } from '@/lib/metro/data';
import { bookTicket } from '@/lib/actions/booking';
import Image from 'next/image';
import Logo from '@/components/Logo';
import StationSelect from '@/components/StationSelect';

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
    <main className="min-h-screen text-white" style={{ background: 'radial-gradient(ellipse at 20% 0%, #0d1b3e 0%, #020817 60%)' }}>
      <header style={{ background: 'rgba(8,12,28,0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }} className="px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex gap-4 text-sm">
            <a href="/map" className="text-gray-400 hover:text-white transition-colors">Map</a>
            <a href="/planner" className="text-gray-400 hover:text-white transition-colors">Planner</a>
            <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</a>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!ticket ? (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px' }}>
                <h2 className="text-lg font-semibold mb-6 text-white">Journey Details</h2>
                <div className="flex flex-col gap-5">

                  <div>
                    <label style={{ color: '#475569', fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }} className="block mb-2">From Station</label>
                    <StationSelect
                      value={from}
                      onChange={setFrom}
                      placeholder="Select source station"
                      stations={STATIONS}
                      accentColor="#8b5cf6"
                    />
                  </div>

                  <div>
                    <label style={{ color: '#475569', fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }} className="block mb-2">To Station</label>
                    <StationSelect
                      value={to}
                      onChange={setTo}
                      placeholder="Select destination station"
                      stations={STATIONS}
                      accentColor="#06b6d4"
                    />
                  </div>

                  <div>
                    <label style={{ color: '#475569', fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }} className="block mb-2">Journey Date</label>
                    <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: date ? 'white' : '#64748b' }}
                      className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>

                  {error && (
                    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px' }} className="px-4 py-3">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <motion.button onClick={handleBooking} disabled={loading}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(16,185,129,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    style={{ background: 'linear-gradient(135deg, #059669, #047857)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '600', fontSize: '14px', padding: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Booking...' : 'Book Ticket'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="ticket" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '20px 24px' }}>
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
                      <p style={{ color: '#475569', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>From</p>
                      <p className="text-white font-bold text-lg">{ticket.from}</p>
                    </div>
                    <div style={{ color: '#334155', fontSize: '24px' }}>→</div>
                    <div className="text-right">
                      <p style={{ color: '#475569', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>To</p>
                      <p className="text-white font-bold text-lg">{ticket.to}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                      { label: 'Fare', value: 'Rs. ' + ticket.fare },
                      { label: 'Distance', value: ticket.distance + ' km' },
                      { label: 'Time', value: ticket.time + ' min' },
                      { label: 'Stops', value: '' + ticket.stops },
                    ].map(s => (
                      <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                        <p className="text-white font-bold text-sm">{s.value}</p>
                        <p style={{ color: '#475569', fontSize: '10px', marginTop: '2px' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="text-center mb-4">
                    <p style={{ color: '#64748b', fontSize: '12px' }}>Journey Date: <span className="text-white">{ticket.date}</span></p>
                  </div>

                  <div style={{ borderTop: '1px dashed rgba(255,255,255,0.08)', margin: '20px 0' }} />

                  <div className="flex flex-col items-center">
                    <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '16px' }}>Show this QR code at the station</p>
                    <div style={{ background: 'white', padding: '16px', borderRadius: '16px' }}>
                      <Image src={ticket.qrCode} alt="Ticket QR Code" width={180} height={180} />
                    </div>
                    <p style={{ color: '#334155', fontSize: '11px', marginTop: '12px' }}>Valid for journey date only</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={() => { setTicket(null); setFrom(''); setTo(''); setDate(''); }}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#94a3b8', fontSize: '13px', fontWeight: '600', padding: '13px', cursor: 'pointer' }}>
                  Book Another
                </button>
                <a href="/dashboard"
                  style={{ flex: 1, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: '12px', color: 'white', fontSize: '13px', fontWeight: '600', padding: '13px', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#020817' }}>
        <p className="text-gray-400">Loading...</p>
      </div>
    }>
      <BookingForm />
    </Suspense>
  );
}
