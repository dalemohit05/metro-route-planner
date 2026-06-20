'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STATIONS } from '@/lib/metro/data';
import Logo from '@/components/Logo';
import StationSelect from '@/components/StationSelect';

interface Station {
  id: number;
  name: string;
  code: string;
  line: string;
}

interface RouteResult {
  path: Station[];
  totalDistance: number;
  totalFare: number;
  totalTime: number;
  numStops: number;
  interchanges: string[];
  found: boolean;
}

export default function PlannerPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch() {
    if (!from || !to) {
      setError('Please select both source and destination');
      return;
    }
    if (from === to) {
      setError('Source and destination cannot be the same');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/route?from=' + from + '&to=' + to);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setResult(data.result);
      }
    } catch {
      setError('Failed to calculate route. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleSwap() {
    const temp = from;
    setFrom(to);
    setTo(temp);
    setResult(null);
  }

  function getDotColor(station: Station, index: number, total: number) {
    if (index === 0 || index === total - 1) return 'bg-blue-500 border-blue-400';
    if (station.line === 'interchange') return 'bg-yellow-500 border-yellow-400';
    if (station.line === 'purple') return 'bg-purple-500 border-purple-400';
    return 'bg-cyan-500 border-cyan-400';
  }

  function getBarColor(line: string) {
    if (line === 'purple') return 'bg-purple-700';
    return 'bg-cyan-700';
  }

  return (
    <main className="min-h-screen text-white"
      style={{ background: 'radial-gradient(ellipse at 20% 0%, #0d1b3e 0%, #020817 60%)' }}>

      <header style={{ background: 'rgba(8,12,28,0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        className="px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex gap-4 text-sm">
            <a href="/map" className="text-gray-400 hover:text-white transition-colors">Map</a>
            <a href="/booking" className="text-gray-400 hover:text-white transition-colors">Book</a>
            <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</a>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px' }}
          className="p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Plan Your Journey
          </h2>

          <div className="flex flex-col gap-4">

            <div>
              <label className="text-gray-400 text-sm block mb-1">
                From Station
              </label>
              <StationSelect
                value={from}
                onChange={setFrom}
                placeholder="Select source station"
                stations={STATIONS}
                accentColor="#8b5cf6"
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSwap}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
                className="text-white px-6 py-2 rounded-full text-sm transition-colors"
              >
                Swap
              </button>
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-1">
                To Station
              </label>
              <StationSelect
                value={to}
                onChange={setTo}
                placeholder="Select destination station"
                stations={STATIONS}
                accentColor="#06b6d4"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
              className="w-full text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-60"
            >
              {loading ? 'Calculating...' : 'Find Route'}
            </motion.button>

          </div>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Distance', value: result.totalDistance + ' km' },
                  { label: 'Fare', value: 'Rs. ' + result.totalFare },
                  { label: 'Time', value: result.totalTime + ' min' },
                  { label: 'Stops', value: '' + result.numStops },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    className="rounded-xl p-4 text-center"
                  >
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {result.interchanges.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}
                  className="rounded-xl p-4 mb-6"
                >
                  <p className="text-yellow-400 font-medium">
                    Interchange at: {result.interchanges.join(', ')}
                  </p>
                  <p className="text-yellow-600 text-sm mt-1">
                    Change trains at this station
                  </p>
                </motion.div>
              )}

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                className="rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Route Path</h3>
                <div>
                  {result.path.map((station, index) => (
                    <motion.div
                      key={station.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-center gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={
                            'w-4 h-4 rounded-full border-2 z-10 ' +
                            getDotColor(station, index, result.path.length)
                          }
                        />
                        {index < result.path.length - 1 && (
                          <div
                            className={'w-0.5 h-8 ' + getBarColor(station.line)}
                          />
                        )}
                      </div>
                      <div className="py-1">
                        <span
                          className={
                            index === 0 || index === result.path.length - 1
                              ? 'text-blue-400 text-lg font-medium'
                              : station.line === 'interchange'
                              ? 'text-yellow-400 font-medium'
                              : 'text-white font-medium'
                          }
                        >
                          {station.name}
                        </span>
                        {station.line === 'interchange' && (
                          <span className="ml-2 text-xs bg-yellow-900 text-yellow-400 px-2 py-0.5 rounded-full">
                            Interchange
                          </span>
                        )}
                        {index === 0 && (
                          <span className="ml-2 text-xs bg-green-900 text-green-400 px-2 py-0.5 rounded-full">
                            Start
                          </span>
                        )}
                        {index === result.path.length - 1 && (
                          <span className="ml-2 text-xs bg-blue-900 text-blue-400 px-2 py-0.5 rounded-full">
                            End
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <a
                  href={'/booking?fromName=' + STATIONS.find(s => String(s.id) === from)?.name + '&toName=' + STATIONS.find(s => String(s.id) === to)?.name}
                  style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
                  className="block w-full text-white font-semibold py-3 rounded-lg text-center transition-colors"
                >
                  Book Ticket - Rs. {result.totalFare}
                </a>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
