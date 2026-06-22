'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const PURPLE_LINE = [
  'PCMC','Sant Tukaram Nagar','Bhosari','Kasarwadi','Phugewadi',
  'Dapodi','Bopodi','Khadki','Range Hills','Shivajinagar',
  'Civil Court','Budhwar Peth','Mandai','Swargate',
];

const AQUA_LINE = [
  'Vanaz','Anand Nagar','Ideal Colony','Nal Stop','Garware College',
  'Deccan Gymkhana','Chhatrapati Sambhaji','PMC','Shivajinagar',
  'Bund Garden','Yerawada','Kalyani Nagar','Ramwadi',
];

const POSITIONS: Record<string, { x: number; y: number }> = {
  'PCMC':                 { x: 60,  y: 80  },
  'Sant Tukaram Nagar':   { x: 110, y: 108 },
  'Bhosari':              { x: 160, y: 136 },
  'Kasarwadi':            { x: 210, y: 164 },
  'Phugewadi':            { x: 260, y: 192 },
  'Dapodi':               { x: 310, y: 220 },
  'Bopodi':               { x: 355, y: 245 },
  'Khadki':               { x: 385, y: 278 },
  'Range Hills':          { x: 415, y: 311 },
  'Shivajinagar':         { x: 455, y: 348 },
  'Civil Court':          { x: 482, y: 382 },
  'Budhwar Peth':         { x: 504, y: 416 },
  'Mandai':               { x: 522, y: 450 },
  'Swargate':             { x: 538, y: 484 },
  'Vanaz':                { x: 140, y: 390 },
  'Anand Nagar':          { x: 192, y: 378 },
  'Ideal Colony':         { x: 244, y: 366 },
  'Nal Stop':             { x: 296, y: 354 },
  'Garware College':      { x: 340, y: 350 },
  'Deccan Gymkhana':      { x: 374, y: 349 },
  'Chhatrapati Sambhaji': { x: 408, y: 349 },
  'PMC':                  { x: 434, y: 348 },
  'Bund Garden':          { x: 500, y: 316 },
  'Yerawada':             { x: 555, y: 284 },
  'Kalyani Nagar':        { x: 608, y: 294 },
  'Ramwadi':              { x: 665, y: 308 },
};

const ALL_STATIONS = Object.keys(POSITIONS);

interface StationInfo { name: string; line: string; }
interface RouteResult {
  path: StationInfo[];
  totalDistance: number;
  totalFare: number;
  totalTime: number;
  numStops: number;
  interchanges: string[];
  found: boolean;
}

function buildPoints(stations: string[]) {
  return stations.filter(s => POSITIONS[s]).map(s => POSITIONS[s].x + ',' + POSITIONS[s].y).join(' ');
}

// Resolve a CSS variable to its actual computed color (needed for SVG fill/stroke
// in some edge cases, but modern browsers support var() directly in SVG attrs
// when set via style, so we use inline style on SVG elements instead of attributes).

function Train({ line, colorVar, fillVar, speed = 1200 }: {
  line: string[];
  colorVar: string;
  fillVar: string;
  speed?: number;
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function advance() {
      setIndex(prev => {
        const next = prev + 1;
        if (next >= line.length) {
          setVisible(false);
          timerRef.current = setTimeout(() => {
            setIndex(0);
            setVisible(true);
          }, 1500);
          return prev;
        }
        return next;
      });
    }
    timerRef.current = setTimeout(advance, speed);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [index, line, speed]);

  const pos = POSITIONS[line[index]];
  if (!pos || !visible) return null;

  return (
    <motion.g
      animate={{ x: pos.x, y: pos.y }}
      transition={{ duration: speed / 1000, ease: 'linear' }}
    >
      <rect x="-13" y="-7" width="26" height="14" rx="4" style={{ fill: colorVar }} />
      <rect x="-11" y="-5" width="6" height="10" rx="1.5" style={{ fill: fillVar, opacity: 0.9 }} />
      <rect x="-3" y="-5" width="6" height="10" rx="1.5" style={{ fill: fillVar, opacity: 0.9 }} />
      <rect x="5" y="-5" width="6" height="10" rx="1.5" style={{ fill: fillVar, opacity: 0.9 }} />
      <circle cx="-7" cy="7" r="2.5" style={{ fill: colorVar, opacity: 0.7 }} />
      <circle cx="7" cy="7" r="2.5" style={{ fill: colorVar, opacity: 0.7 }} />
    </motion.g>
  );
}

export default function MetroMap3D() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState<RouteResult | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [hoveredStation, setHoveredStation] = useState('');
  const [loading, setLoading] = useState(false);
  const [routeKey, setRouteKey] = useState(0);

  async function handleFindRoute() {
    if (!from || !to || from === to) return;
    setLoading(true);
    const fi = ALL_STATIONS.indexOf(from);
    const ti = ALL_STATIONS.indexOf(to);
    const res = await fetch('/api/route?from=' + fi + '&to=' + ti);
    const data = await res.json();
    if (data.result) {
      setResult(data.result);
      setHighlightedPath(data.result.path.map((s: StationInfo) => s.name));
      setRouteKey(k => k + 1);
    }
    setLoading(false);
  }

  function handleClear() {
    setFrom(''); setTo(''); setResult(null); setHighlightedPath([]);
  }

  function handleStationClick(name: string) {
    if (!from) { setFrom(name); return; }
    if (!to && name !== from) { setTo(name); return; }
    setFrom(name); setTo(''); setResult(null); setHighlightedPath([]);
  }

  function buildBookingUrl() {
    const params = new URLSearchParams();
    if (from) params.set('fromName', from);
    if (to) params.set('toName', to);
    return '/booking?' + params.toString();
  }

  const highlightPoints = highlightedPath
    .filter(s => POSITIONS[s])
    .map(s => POSITIONS[s].x + ',' + POSITIONS[s].y)
    .join(' ');

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: 'var(--text-primary)' }}>

      {/* Header */}
      <header style={{ background: 'var(--bg-header)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo showTagline taglineLang="en" />
          <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Book Ticket', href: '/booking' }].map(item => (
              <a key={item.label} href={item.href}
                style={{ color: 'var(--text-secondary)', fontSize: '13px', padding: '6px 14px', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--text-primary)'; (e.target as HTMLElement).style.background = 'var(--bg-card-hover)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text-secondary)'; (e.target as HTMLElement).style.background = 'transparent'; }}>
                {item.label}
              </a>
            ))}
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 24px 24px' }}>

        {/* Planner Controls */}
        <div style={{ background: 'var(--bg-card)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '16px 20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>

            <div style={{ flex: 1, minWidth: '180px' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Origin</label>
              <select value={from} onChange={e => setFrom(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-input)', borderRadius: '10px', color: from ? 'var(--text-primary)' : 'var(--text-placeholder)', fontSize: '13px', padding: '10px 14px', outline: 'none', cursor: 'pointer' }}>
                <option value="">Select origin station</option>
                <optgroup label="Purple Line">{PURPLE_LINE.filter(s => s !== 'Shivajinagar').map(s => <option key={s} value={s}>{s}</option>)}</optgroup>
                <optgroup label="Interchange"><option value="Shivajinagar">Shivajinagar</option></optgroup>
                <optgroup label="Aqua Line">{AQUA_LINE.filter(s => s !== 'Shivajinagar').map(s => <option key={s} value={s}>{s}</option>)}</optgroup>
              </select>
            </div>

            <button onClick={() => { const t = from; setFrom(to); setTo(t); setResult(null); setHighlightedPath([]); }}
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', borderRadius: '10px', color: 'var(--text-secondary)', width: '40px', height: '40px', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: '1px' }}>
              ⇄
            </button>

            <div style={{ flex: 1, minWidth: '180px' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Destination</label>
              <select value={to} onChange={e => setTo(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-input)', borderRadius: '10px', color: to ? 'var(--text-primary)' : 'var(--text-placeholder)', fontSize: '13px', padding: '10px 14px', outline: 'none', cursor: 'pointer' }}>
                <option value="">Select destination station</option>
                <optgroup label="Purple Line">{PURPLE_LINE.filter(s => s !== 'Shivajinagar').map(s => <option key={s} value={s}>{s}</option>)}</optgroup>
                <optgroup label="Interchange"><option value="Shivajinagar">Shivajinagar</option></optgroup>
                <optgroup label="Aqua Line">{AQUA_LINE.filter(s => s !== 'Shivajinagar').map(s => <option key={s} value={s}>{s}</option>)}</optgroup>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleFindRoute} disabled={loading || !from || !to}
                style={{ background: 'linear-gradient(135deg, var(--accent-indigo) 0%, var(--accent-indigo-dim) 100%)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '600', fontSize: '13px', padding: '10px 22px', cursor: loading || !from || !to ? 'not-allowed' : 'pointer', opacity: !from || !to ? 0.5 : 1, boxShadow: '0 4px 16px color-mix(in srgb, var(--accent-indigo) 30%, transparent)' }}>
                {loading ? 'Finding...' : 'Show Route'}
              </motion.button>
              <button onClick={handleClear}
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: 'var(--text-tertiary)', fontSize: '13px', padding: '10px 16px', cursor: 'pointer' }}>
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div style={{ display: 'flex', gap: '16px', minHeight: '560px' }}>

          {/* Map Panel */}
          <div style={{ flex: '1 1 0', minWidth: 0, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ overflowX: 'auto', overflowY: 'auto', height: '100%', minHeight: '540px' }}>
              <svg width="740" height="560" viewBox="0 0 740 560" style={{ minWidth: '640px', display: 'block' }}>
                <rect width="740" height="560" style={{ fill: 'var(--bg-solid)' }} />
                {Array.from({ length: 8 }).map((_, i) => (
                  <line key={'h' + i} x1="0" y1={i * 80} x2="740" y2={i * 80} style={{ stroke: 'var(--border-subtle)', strokeWidth: 1 }} />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <line key={'v' + i} x1={i * 80} y1="0" x2={i * 80} y2="560" style={{ stroke: 'var(--border-subtle)', strokeWidth: 1 }} />
                ))}

                {/* Purple line */}
                <polyline points={buildPoints(PURPLE_LINE)} fill="none" style={{ stroke: 'var(--accent-purple-dim)', strokeWidth: 16, opacity: 0.12 }} strokeLinecap="round" strokeLinejoin="round" />
                <polyline points={buildPoints(PURPLE_LINE)} fill="none" style={{ stroke: 'var(--accent-purple)', strokeWidth: 7, opacity: 0.95 }} strokeLinecap="round" strokeLinejoin="round" />

                {/* Aqua line */}
                <polyline points={buildPoints(AQUA_LINE)} fill="none" style={{ stroke: 'var(--accent-cyan-dim)', strokeWidth: 16, opacity: 0.12 }} strokeLinecap="round" strokeLinejoin="round" />
                <polyline points={buildPoints(AQUA_LINE)} fill="none" style={{ stroke: 'var(--accent-cyan)', strokeWidth: 7, opacity: 0.95 }} strokeLinecap="round" strokeLinejoin="round" />

                {/* Highlighted route */}
                {highlightedPath.length > 1 && (
                  <motion.polyline
                    key={routeKey}
                    points={highlightPoints}
                    fill="none"
                    strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="1200" strokeDashoffset="1200"
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1.3, ease: 'easeInOut' }}
                    style={{ stroke: 'var(--text-primary)', strokeWidth: 9, filter: 'drop-shadow(0 0 10px color-mix(in srgb, var(--text-primary) 70%, transparent))' }}
                  />
                )}

                {/* Trains */}
                <Train line={PURPLE_LINE} colorVar="var(--accent-purple-dim)" fillVar="var(--accent-purple)" speed={1100} />
                <Train line={AQUA_LINE} colorVar="var(--accent-cyan-dim)" fillVar="var(--accent-cyan)" speed={1300} />

                {/* Stations */}
                {ALL_STATIONS.map((name) => {
                  const pos = POSITIONS[name];
                  if (!pos) return null;
                  const isInterchange = name === 'Shivajinagar';
                  const isPurple = PURPLE_LINE.includes(name);
                  const isHL = highlightedPath.includes(name);
                  const isFrom = name === from;
                  const isTo = name === to;
                  const isHov = hoveredStation === name;
                  const col = isInterchange ? 'var(--accent-amber)' : isPurple ? 'var(--accent-purple)' : 'var(--accent-cyan)';
                  const r = isInterchange ? 11 : (isFrom || isTo) ? 10 : isHov ? 9 : 7;

                  return (
                    <g key={name}>
                      {(isHL || isFrom || isTo) && <circle cx={pos.x} cy={pos.y} r={r + 9} style={{ fill: col, opacity: 0.12 }} />}
                      {isInterchange && <circle cx={pos.x} cy={pos.y} r={r + 5} fill="none" style={{ stroke: 'var(--accent-amber)', strokeWidth: 2, opacity: 0.4 }} strokeDasharray="3 2" />}
                      {isHov && <circle cx={pos.x} cy={pos.y} r={r + 5} style={{ fill: col, opacity: 0.15 }} />}
                      <circle cx={pos.x} cy={pos.y} r={r}
                        style={{
                          fill: isHL || isFrom || isTo ? col : 'var(--bg-solid)',
                          stroke: col,
                          strokeWidth: isInterchange ? 2.5 : 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onClick={() => handleStationClick(name)}
                        onMouseEnter={() => setHoveredStation(name)}
                        onMouseLeave={() => setHoveredStation('')}
                      />
                      {!isHL && !isFrom && !isTo && (
                        <circle cx={pos.x} cy={pos.y} r={r - 3.5} style={{ fill: col, opacity: 0.65, pointerEvents: 'none' }} />
                      )}
                      {isFrom && <text x={pos.x} y={pos.y + 3.5} textAnchor="middle" style={{ fill: 'white', fontSize: '8px', fontWeight: 700, pointerEvents: 'none' }}>S</text>}
                      {isTo && <text x={pos.x} y={pos.y + 3.5} textAnchor="middle" style={{ fill: 'white', fontSize: '8px', fontWeight: 700, pointerEvents: 'none' }}>E</text>}
                      {isHov && (
                        <g style={{ pointerEvents: 'none' }}>
                          <rect x={pos.x - 58} y={pos.y - 42} width="116" height="32" rx="7" style={{ fill: 'var(--bg-dropdown)', stroke: 'var(--border-strong)', strokeWidth: 1 }} />
                          <text x={pos.x} y={pos.y - 25} textAnchor="middle" style={{ fill: 'var(--text-primary)', fontSize: '9.5px', fontWeight: 600 }}>{name}</text>
                          <text x={pos.x} y={pos.y - 14} textAnchor="middle" style={{ fill: col, fontSize: '8px' }}>{isInterchange ? 'Interchange Station' : isPurple ? 'Purple Line' : 'Aqua Line'}</text>
                        </g>
                      )}
                      {isInterchange && !isHov && (
                        <text x={pos.x + 15} y={pos.y + 4} style={{ fill: 'var(--accent-amber)', fontSize: '8.5px', fontWeight: 600, pointerEvents: 'none' }}>Shivajinagar</text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Floating Legend */}
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'var(--bg-dropdown)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-strong)', borderRadius: '12px', padding: '10px 14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[{ color: 'var(--accent-purple)', label: 'Purple Line' }, { color: 'var(--accent-cyan)', label: 'Aqua Line' }, { color: 'var(--accent-amber)', label: 'Interchange' }].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '20px', height: '3px', borderRadius: '2px', background: item.color }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
              <span style={{ color: 'var(--text-faint)', fontSize: '11px' }}>Click station to select</span>
            </div>
          </div>

          {/* Route Details Panel */}
          <div style={{ width: '288px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                  <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '16px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Route</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '13px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{from}</span>
                      <span style={{ color: 'var(--text-faint)', fontSize: '16px', flexShrink: 0 }}>→</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '13px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{to}</span>
                    </div>
                    {result.interchanges.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'color-mix(in srgb, var(--accent-amber) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-amber) 15%, transparent)', borderRadius: '8px', padding: '6px 10px' }}>
                        <span style={{ fontSize: '12px' }}>🔄</span>
                        <span style={{ color: 'var(--accent-amber)', fontSize: '11px' }}>Change at {result.interchanges.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { icon: '⏱', label: 'Duration', value: result.totalTime + ' min', accent: 'var(--accent-indigo)' },
                      { icon: '🚇', label: 'Stations', value: result.numStops + ' stops', accent: 'var(--accent-purple)' },
                      { icon: '📍', label: 'Distance', value: result.totalDistance + ' km', accent: 'var(--accent-cyan)' },
                      { icon: '💰', label: 'Fare', value: 'Rs. ' + result.totalFare, accent: 'var(--accent-green)' },
                    ].map((stat, i) => (
                      <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                        style={{ background: 'var(--bg-stat)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: stat.accent, opacity: 0.5, borderRadius: '12px 12px 0 0' }} />
                        <div style={{ fontSize: '18px', marginBottom: '6px' }}>{stat.icon}</div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '14px', letterSpacing: '-0.02em' }}>{stat.value}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  <div style={{ background: 'var(--bg-stat)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '14px', maxHeight: '220px', overflowY: 'auto' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>Route Path</div>
                    {result.path.map((station, index) => {
                      const isFirst = index === 0;
                      const isLast = index === result.path.length - 1;
                      const col = isFirst || isLast ? 'var(--text-primary)' : station.line === 'interchange' ? 'var(--accent-amber)' : station.line === 'purple' ? 'var(--accent-purple)' : 'var(--accent-cyan)';
                      return (
                        <motion.div key={station.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }}
                          style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '2px' }}>
                            <div style={{ width: isFirst || isLast ? '10px' : '8px', height: isFirst || isLast ? '10px' : '8px', borderRadius: '50%', background: col, boxShadow: isFirst || isLast ? ('0 0 8px ' + col) : 'none', flexShrink: 0 }} />
                            {index < result.path.length - 1 && (
                              <div style={{ width: '2px', height: '18px', background: station.line === 'purple' ? 'color-mix(in srgb, var(--accent-purple) 30%, transparent)' : 'color-mix(in srgb, var(--accent-cyan) 30%, transparent)' }} />
                            )}
                          </div>
                          <span style={{ color: isFirst || isLast ? 'var(--text-primary)' : station.line === 'interchange' ? 'var(--accent-amber)' : 'var(--text-secondary)', fontSize: '12px', fontWeight: isFirst || isLast ? '600' : '400', lineHeight: '1.4' }}>
                            {station.name}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  <motion.a
                    href={buildBookingUrl()}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 24px color-mix(in srgb, var(--accent-green) 25%, transparent)' }}
                    whileTap={{ scale: 0.98 }}
                    style={{ display: 'block', background: 'linear-gradient(135deg, var(--accent-green-dim), var(--accent-green))', borderRadius: '12px', color: 'white', fontWeight: '600', fontSize: '13px', padding: '13px', textAlign: 'center', textDecoration: 'none', cursor: 'pointer' }}>
                    Book Ticket — Rs. {result.totalFare}
                  </motion.a>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '300px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'color-mix(in srgb, var(--accent-indigo) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-indigo) 20%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '16px' }}>🗺️</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>Plan your journey</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: '1.5' }}>Select origin and destination, then tap Show Route</div>
                  {from && !to && (
                    <div style={{ marginTop: '16px', background: 'color-mix(in srgb, var(--accent-indigo) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-indigo) 15%, transparent)', borderRadius: '8px', padding: '8px 12px' }}>
                      <span style={{ color: 'var(--accent-indigo)', fontSize: '11px' }}>Origin: <strong style={{ color: 'var(--text-primary)' }}>{from}</strong> — now pick destination</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
