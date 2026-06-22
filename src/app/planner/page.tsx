'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STATIONS } from '@/lib/metro/data';
import Logo from '@/components/Logo';
import StationSelect from '@/components/StationSelect';
import ThemeToggle from '@/components/ThemeToggle';

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
    if (index === 0 || index === total - 1) return 'var(--text-primary)';
    if (station.line === 'interchange') return 'var(--accent-amber)';
    if (station.line === 'purple') return 'var(--accent-purple)';
    return 'var(--accent-cyan)';
  }

  function getBarColor(line: string) {
    if (line === 'purple') return 'color-mix(in srgb, var(--accent-purple) 40%, transparent)';
    return 'color-mix(in srgb, var(--accent-cyan) 40%, transparent)';
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>

      <header
        style={{ background: 'var(--bg-header)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-subtle)' }}
        className="px-6 py-4"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4 text-sm">
            <a href="/map" style={{ color: 'var(--text-secondary)' }} className="hover:opacity-80 transition-opacity">Map</a>
            <a href="/booking" style={{ color: 'var(--text-secondary)' }} className="hover:opacity-80 transition-opacity">Book</a>
            <a href="/dashboard" style={{ color: 'var(--text-secondary)' }} className="hover:opacity-80 transition-opacity">Dashboard</a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: 'var(--bg-card)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-subtle)', borderRadius: '20px' }}
          className="p-6 mb-6"
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Plan Your Journey
          </h2>

          <div className="flex flex-col gap-4">

            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>
                From Station
              </label>
              <StationSelect
                value={from}
                onChange={setFrom}
                placeholder="Select source station"
                stations={STATIONS}
                accentColor="var(--accent-purple)"
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSwap}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
                className="px-6 py-2 rounded-full text-sm transition-colors"
              >
                Swap
              </button>
            </div>

            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>
                To Station
              </label>
              <StationSelect
                value={to}
                onChange={setTo}
                placeholder="Select destination station"
                stations={STATIONS}
                accentColor="var(--accent-cyan)"
              />
            </div>

            {error && (
              <p
                style={{ background: 'color-mix(in srgb, var(--accent-red) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-red) 25%, transparent)', color: 'var(--accent-red)' }}
                className="text-sm rounded-lg px-4 py-2"
              >
                {error}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-indigo-dim))' }}
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
                    style={{ background: 'var(--bg-stat)', border: '1px solid var(--border-subtle)' }}
                    className="rounded-xl p-4 text-center"
                  >
                    <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {result.interchanges.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{ background: 'color-mix(in srgb, var(--accent-amber) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-amber) 15%, transparent)' }}
                  className="rounded-xl p-4 mb-6"
                >
                  <p className="font-medium" style={{ color: 'var(--accent-amber)' }}>
                    Interchange at: {result.interchanges.join(', ')}
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--accent-amber)', opacity: 0.8 }}>
                    Change trains at this station
                  </p>
                </motion.div>
              )}

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                className="rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Route Path</h3>
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
                          style={{
                            width: index === 0 || index === result.path.length - 1 ? '18px' : '16px',
                            height: index === 0 || index === result.path.length - 1 ? '18px' : '16px',
                            borderRadius: '50%',
                            border: '2px solid ' + getDotColor(station, index, result.path.length),
                            background: getDotColor(station, index, result.path.length),
                            zIndex: 10,
                          }}
                        />
                        {index < result.path.length - 1 && (
                          <div
                            style={{ width: '2px', height: '32px', background: getBarColor(station.line) }}
                          />
                        )}
                      </div>
                      <div className="py-1">
                        <span
                          style={{
                            color: index === 0 || index === result.path.length - 1
                              ? 'var(--text-primary)'
                              : station.line === 'interchange'
                              ? 'var(--accent-amber)'
                              : 'var(--text-primary)',
                            fontSize: index === 0 || index === result.path.length - 1 ? '18px' : '14px',
                            fontWeight: 500,
                          }}
                        >
                          {station.name}
                        </span>
                        {station.line === 'interchange' && (
                          <span
                            style={{ background: 'color-mix(in srgb, var(--accent-amber) 15%, transparent)', color: 'var(--accent-amber)' }}
                            className="ml-2 text-xs px-2 py-0.5 rounded-full"
                          >
                            Interchange
                          </span>
                        )}
                        {index === 0 && (
                          <span
                            style={{ background: 'color-mix(in srgb, var(--accent-green) 15%, transparent)', color: 'var(--accent-green)' }}
                            className="ml-2 text-xs px-2 py-0.5 rounded-full"
                          >
                            Start
                          </span>
                        )}
                        {index === result.path.length - 1 && (
                          <span
                            style={{ background: 'color-mix(in srgb, var(--accent-indigo) 15%, transparent)', color: 'var(--accent-indigo)' }}
                            className="ml-2 text-xs px-2 py-0.5 rounded-full"
                          >
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
                  style={{ background: 'linear-gradient(135deg, var(--accent-green-dim), var(--accent-green))' }}
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
