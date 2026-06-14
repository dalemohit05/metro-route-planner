'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STATIONS } from '@/lib/metro/data';
import { bookTicket } from '@/lib/actions/booking';
import Image from 'next/image';

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

export default function BookingPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState<TicketResult | null>(null);

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
    <main className="min-h-screen bg-gray-950 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border-b border-gray-800 px-6 py-4"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-400">Book Ticket</h1>
          <div className="flex gap-4">
            <a href="/planner" className="text-gray-400 hover:text-white text-sm">
              Planner
            </a>
            <a href="/dashboard" className="text-gray-400 hover:text-white text-sm">
              Dashboard
            </a>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!ticket ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-6">Journey Details</h2>
                <div className="flex flex-col gap-4">

                  <div>
                    <label className="text-gray-400 text-sm block mb-1">
                      From Station
                    </label>
                    <select
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select source station</option>
                      <optgroup label="Purple Line">
                        {STATIONS.filter(
                          (s) => s.line === 'purple' || s.line === 'interchange'
                        ).map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Aqua Line">
                        {STATIONS.filter((s) => s.line === 'aqua').map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm block mb-1">
                      To Station
                    </label>
                    <select
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select destination station</option>
                      <optgroup label="Purple Line">
                        {STATIONS.filter(
                          (s) => s.line === 'purple' || s.line === 'interchange'
                        ).map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Aqua Line">
                        {STATIONS.filter((s) => s.line === 'aqua').map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm block mb-1">
                      Journey Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      min={today}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-2">
                      {error}
                    </p>
                  )}

                  <button
                    onClick={handleBooking}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-900 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {loading ? 'Booking...' : 'Book Ticket'}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ticket"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">

                <div className="bg-blue-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Pune Metro</h2>
                    <span className="text-blue-200 text-sm">e-Ticket</span>
                  </div>
                  <p className="text-blue-200 text-sm mt-1">{ticket.ticketNumber}</p>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">FROM</p>
                      <p className="text-white font-bold text-lg">{ticket.from}</p>
                    </div>
                    <div className="text-gray-600 text-2xl">to</div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">TO</p>
                      <p className="text-white font-bold text-lg">{ticket.to}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                      { label: 'Fare', value: 'Rs. ' + ticket.fare },
                      { label: 'Distance', value: ticket.distance + ' km' },
                      { label: 'Time', value: ticket.time + ' min' },
                      { label: 'Stops', value: '' + ticket.stops },
                    ].map((s) => (
                      <div key={s.label} className="bg-gray-800 rounded-xl p-3 text-center">
                        <p className="text-white font-bold text-sm">{s.value}</p>
                        <p className="text-gray-400 text-xs">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="text-center mb-2">
                    <p className="text-gray-400 text-sm">Journey Date: {ticket.date}</p>
                  </div>

                  <div className="border-t border-dashed border-gray-700 my-6" />

                  <div className="flex flex-col items-center">
                    <p className="text-gray-400 text-sm mb-4">
                      Show this QR code at the station
                    </p>
                    <div className="bg-white p-4 rounded-2xl">
                      <Image
                        src={ticket.qrCode}
                        alt="Ticket QR Code"
                        width={200}
                        height={200}
                      />
                    </div>
                    <p className="text-gray-500 text-xs mt-3">
                      Valid for journey date only
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => {
                    setTicket(null);
                    setFrom('');
                    setTo('');
                    setDate('');
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
                >
                  Book Another
                </button>
                <a
                  href="/dashboard"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-center transition-colors"
                >
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
