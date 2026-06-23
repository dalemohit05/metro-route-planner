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

  function lineColor(line: string) {
    if (line === 'interchange') return 'var(--accent-amber)';
    if (line === 'purple') return 'var(--accent-purple)';
    return 'var(--accent-cyan)';
  }

  function lineBarColor(line: string) {
    if (line === 'purple') return 'color-mix(in srgb, var(--accent-purple) 45%, transparent)';
    return 'color-mix(in srgb, var(--accent-cyan) 45%, transparent)';
  }

  const fromName = STATIONS.find(s => String(s.id) === from)?.name;
  const toName = STATIONS.find(s => String(s.id) === to)?.name;

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>

      <header
        style={{ background: 'var(--bg-header)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-subtle)' }}
        className="px-6 py-4 sticky top-0 z-50"
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

        {/* Search Card */}
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

              {/* Journey Summary */}
              <div
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '20px' }}
                className="p-6 mb-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{fromName}</span>
                    <span style={{ color: 'var(--text-faint)' }} className="text-xl">→</span>
                    <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{toName}</span>
                  </div>
                  {result.interchanges.length > 0 && (
                    <span
                      style={{ background: 'color-mix(in srgb, var(--accent-amber) 12%, transparent)', color: 'var(--accent-amber)' }}
                      className="text-xs font-medium px-3 py-1 rounded-full"
                    >
                      🔄 {result.interchanges.length} interchange{result.interchanges.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { icon: '⏱', label: 'Duration', value: result.totalTime + ' min', accent: 'var(--accent-indigo)' },
                    { icon: '🚉', label: 'Stations', value: result.numStops + ' stops', accent: 'var(--accent-purple)' },
                    { icon: '📍', label: 'Distance', value: result.totalDistance + ' km', accent: 'var(--accent-cyan)' },
                    { icon: '💰', label: 'Fare', value: 'Rs. ' + result.totalFare, accent: 'var(--accent-green)' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                      style={{ background: 'var(--bg-stat)', border: '1px solid var(--border-subtle)' }}
                      className="rounded-xl p-3 text-center relative overflow-hidden"
                    >
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: stat.accent, opacity: 0.5 }} />
                      <div className="text-lg mb-1">{stat.icon}</div>
                      <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Dijkstra badge */}
              <div className="flex items-center gap-2 mb-4 px-1">
                <span style={{ color: 'var(--accent-indigo)' }} className="text-xs">⚡</span>
                <span style={{ color: 'var(--text-muted)' }} className="text-xs">
                  Dijkstra&apos;s Algorithm Powered Route Optimization
                </span>
              </div>

              {/* Route Path — transit style */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                className="rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Route Path</h3>
                <div>
                  {result.path.map((station, index) => {
                    const isFirst = index === 0;
                    const isLast = index === result.path.length - 1;
                    const isInterchange = station.line === 'interchange';
                    return (
                      <motion.div
                        key={station.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="flex items-center gap-4"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            style={{
                              width: isFirst || isLast ? '18px' : isInterchange ? '16px' : '14px',
                              height: isFirst || isLast ? '18px' : isInterchange ? '16px' : '14px',
                              borderRadius: '50%',
                              border: '2.5px solid ' + (isFirst || isLast ? 'var(--text-primary)' : lineColor(station.line)),
                              background: isFirst || isLast ? 'var(--text-primary)' : isInterchange ? 'var(--accent-amber)' : lineColor(station.line),
                              boxShadow: isInterchange ? '0 0 0 4px color-mix(in srgb, var(--accent-amber) 15%, transparent)' : 'none',
                              zIndex: 10,
                            }}
                          />
                          {index < result.path.length - 1 && (
                            <div
                              style={{ width: '3px', height: '36px', background: lineBarColor(station.line), borderRadius: '2px' }}
                            />
                          )}
                        </div>
                        <div className="py-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              style={{
                                color: isFirst || isLast
                                  ? 'var(--text-primary)'
                                  : isInterchange
                                  ? 'var(--accent-amber)'
                                  : 'var(--text-primary)',
                                fontSize: isFirst || isLast ? '17px' : '14px',
                                fontWeight: isFirst || isLast ? 700 : 500,
                              }}
                            >
                              {station.name}
                            </span>
                            {isInterchange && (
                              <span
                                style={{ background: 'color-mix(in srgb, var(--accent-amber) 15%, transparent)', color: 'var(--accent-amber)' }}
                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                              >
                                Interchange
                              </span>
                            )}
                            {isFirst && (
                              <span
                                style={{ background: 'color-mix(in srgb, var(--accent-green) 15%, transparent)', color: 'var(--accent-green)' }}
                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                              >
                                Start
                              </span>
                            )}
                            {isLast && (
                              <span
                                style={{ background: 'color-mix(in srgb, var(--accent-indigo) 15%, transparent)', color: 'var(--accent-indigo)' }}
                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                              >
                                Destination
                              </span>
                            )}
                          </div>
                          {!isFirst && !isLast && (
                            <span style={{ color: 'var(--text-muted)' }} className="text-xs">
                              {station.line === 'purple' ? 'Purple Line' : station.line === 'aqua' ? 'Aqua Line' : ''}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <a
                  href={'/booking?fromName=' + fromName + '&toName=' + toName}
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
