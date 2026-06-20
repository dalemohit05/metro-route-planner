'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

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

function Train({ line, color, fillColor, speed = 1200 }: {
  line: string[];
  color: string;
  fillColor: string;
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
      <rect x="-13" y="-7" width="26" height="14" rx="4" fill={color} />
      <rect x="-11" y="-5" width="6" height="10" rx="1.5" fill={fillColor} opacity="0.9" />
      <rect x="-3" y="-5" width="6" height="10" rx="1.5" fill={fillColor} opacity="0.9" />
      <rect x="5" y="-5" width="6" height="10" rx="1.5" fill={fillColor} opacity="0.9" />
      <circle cx="-7" cy="7" r="2.5" fill={color} opacity="0.7" />
      <circle cx="7" cy="7" r="2.5" fill={color} opacity="0.7" />
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
    <div style={{ background: 'radial-gradient(ellipse at 20% 0%, #0d1b3e 0%, #020817 60%)', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Header */}
      <header style={{ background: 'rgba(8,12,28,0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo showTagline taglineLang="en" />
          <nav style={{ display: 'flex', gap: '4px' }}>
            {[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Book Ticket', href: '/booking' }].map(item => (
              <a key={item.label} href={item.href}
                style={{ color: '#94a3b8', fontSize: '13px', padding: '6px 14px', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = 'white'; (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#94a3b8'; (e.target as HTMLElement).style.background = 'transparent'; }}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 24px 24px' }}>

        {/* Planner Controls */}
        <div style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px 20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>

            <div style={{ flex: 1, minWidth: '180px' }}>
              <label style={{ color: '#475569', fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Origin</label>
              <select value={from} onChange={e => setFrom(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '10px', color: from ? 'white' : '#64748b', fontSize: '13px', padding: '10px 14px', outline: 'none', cursor: 'pointer' }}>
                <option value="">Select origin station</option>
                <optgroup label="Purple Line">{PURPLE_LINE.filter(s => s !== 'Shivajinagar').map(s => <option key={s} value={s}>{s}</option>)}</optgroup>
                <optgroup label="Interchange"><option value="Shivajinagar">Shivajinagar</option></optgroup>
                <optgroup label="Aqua Line">{AQUA_LINE.filter(s => s !== 'Shivajinagar').map(s => <option key={s} value={s}>{s}</option>)}</optgroup>
              </select>
            </div>

            <button onClick={() => { const t = from; setFrom(to); setTo(t); setResult(null); setHighlightedPath([]); }}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '10px', color: '#94a3b8', width: '40px', height: '40px', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: '1px' }}>
              ⇄
            </button>

            <div style={{ flex: 1, minWidth: '180px' }}>
              <label style={{ color: '#475569', fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Destination</label>
              <select value={to} onChange={e => setTo(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '10px', color: to ? 'white' : '#64748b', fontSize: '13px', padding: '10px 14px', outline: 'none', cursor: 'pointer' }}>
                <option value="">Select destination station</option>
                <optgroup label="Purple Line">{PURPLE_LINE.filter(s => s !== 'Shivajinagar').map(s => <option key={s} value={s}>{s}</option>)}</optgroup>
                <optgroup label="Interchange"><option value="Shivajinagar">Shivajinagar</option></optgroup>
                <optgroup label="Aqua Line">{AQUA_LINE.filter(s => s !== 'Shivajinagar').map(s => <option key={s} value={s}>{s}</option>)}</optgroup>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleFindRoute} disabled={loading || !from || !to}
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '600', fontSize: '13px', padding: '10px 22px', cursor: loading || !from || !to ? 'not-allowed' : 'pointer', opacity: !from || !to ? 0.5 : 1, boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
                {loading ? 'Finding...' : 'Show Route'}
              </motion.button>
              <button onClick={handleClear}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#64748b', fontSize: '13px', padding: '10px 16px', cursor: 'pointer' }}>
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div style={{ display: 'flex', gap: '16px', minHeight: '560px' }}>

          {/* Map Panel */}
          <div style={{ flex: '1 1 0', minWidth: 0, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ overflowX: 'auto', overflowY: 'auto', height: '100%', minHeight: '540px' }}>
              <svg width="740" height="560" viewBox="0 0 740 560" style={{ minWidth: '640px', display: 'block' }}>
                <rect width="740" height="560" fill="#020817" />
                {Array.from({ length: 8 }).map((_, i) => (
                  <line key={'h' + i} x1="0" y1={i * 80} x2="740" y2={i * 80} stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <line key={'v' + i} x1={i * 80} y1="0" x2={i * 80} y2="560" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
                ))}

                <polyline points={buildPoints(PURPLE_LINE)} fill="none" stroke="#7c3aed" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.12" />
                <polyline points={buildPoints(PURPLE_LINE)} fill="none" stroke="#8b5cf6" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />

                <polyline points={buildPoints(AQUA_LINE)} fill="none" stroke="#0891b2" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.12" />
                <polyline points={buildPoints(AQUA_LINE)} fill="none" stroke="#06b6d4" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />

                {highlightedPath.length > 1 && (
                  <motion.polyline
                    key={routeKey}
                    points={highlightPoints}
                    fill="none" stroke="white" strokeWidth="9"
                    strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="1200" strokeDashoffset="1200"
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1.3, ease: 'easeInOut' }}
                    style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.7))' }}
                  />
                )}

                <Train line={PURPLE_LINE} color="#6d28d9" fillColor="#a78bfa" speed={1100} />
                <Train line={AQUA_LINE} color="#0e7490" fillColor="#67e8f9" speed={1300} />

                {ALL_STATIONS.map((name) => {
                  const pos = POSITIONS[name];
                  if (!pos) return null;
                  const isInterchange = name === 'Shivajinagar';
                  const isPurple = PURPLE_LINE.includes(name);
                  const isHL = highlightedPath.includes(name);
                  const isFrom = name === from;
                  const isTo = name === to;
                  const isHov = hoveredStation === name;
                  const col = isInterchange ? '#fbbf24' : isPurple ? '#8b5cf6' : '#06b6d4';
                  const r = isInterchange ? 11 : (isFrom || isTo) ? 10 : isHov ? 9 : 7;

                  return (
                    <g key={name}>
                      {(isHL || isFrom || isTo) && <circle cx={pos.x} cy={pos.y} r={r + 9} fill={col} opacity="0.12" />}
                      {isInterchange && <circle cx={pos.x} cy={pos.y} r={r + 5} fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.4" strokeDasharray="3 2" />}
                      {isHov && <circle cx={pos.x} cy={pos.y} r={r + 5} fill={col} opacity="0.15" />}
                      <circle cx={pos.x} cy={pos.y} r={r}
                        fill={isHL || isFrom || isTo ? col : '#0f172a'}
                        stroke={col} strokeWidth={isInterchange ? 2.5 : 2}
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => handleStationClick(name)}
                        onMouseEnter={() => setHoveredStation(name)}
                        onMouseLeave={() => setHoveredStation('')}
                      />
                      {!isHL && !isFrom && !isTo && (
                        <circle cx={pos.x} cy={pos.y} r={r - 3.5} fill={col} opacity="0.65" style={{ pointerEvents: 'none' }} />
                      )}
                      {isFrom && <text x={pos.x} y={pos.y + 3.5} textAnchor="middle" fill="white" fontSize="8" fontWeight="700" style={{ pointerEvents: 'none' }}>S</text>}
                      {isTo && <text x={pos.x} y={pos.y + 3.5} textAnchor="middle" fill="white" fontSize="8" fontWeight="700" style={{ pointerEvents: 'none' }}>E</text>}
                      {isHov && (
                        <g style={{ pointerEvents: 'none' }}>
                          <rect x={pos.x - 58} y={pos.y - 42} width="116" height="32" rx="7" fill="rgba(8,12,28,0.96)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                          <text x={pos.x} y={pos.y - 25} textAnchor="middle" fill="white" fontSize="9.5" fontWeight="600">{name}</text>
                          <text x={pos.x} y={pos.y - 14} textAnchor="middle" fill={col} fontSize="8">{isInterchange ? 'Interchange Station' : isPurple ? 'Purple Line' : 'Aqua Line'}</text>
                        </g>
                      )}
                      {isInterchange && !isHov && (
                        <text x={pos.x + 15} y={pos.y + 4} fill="#fbbf24" fontSize="8.5" fontWeight="600" style={{ pointerEvents: 'none' }}>Shivajinagar</text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(8,12,28,0.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px 14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[{ color: '#8b5cf6', label: 'Purple Line' }, { color: '#06b6d4', label: 'Aqua Line' }, { color: '#fbbf24', label: 'Interchange' }].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '20px', height: '3px', borderRadius: '2px', background: item.color }} />
                    <span style={{ color: '#94a3b8', fontSize: '11px' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
              <span style={{ color: '#334155', fontSize: '11px' }}>Click station to select</span>
            </div>
          </div>

          {/* Route Details Panel */}
          <div style={{ width: '288px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px' }}>
                    <div style={{ color: '#475569', fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Route</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ color: 'white', fontWeight: '600', fontSize: '13px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{from}</span>
                      <span style={{ color: '#334155', fontSize: '16px', flexShrink: 0 }}>→</span>
                      <span style={{ color: 'white', fontWeight: '600', fontSize: '13px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{to}</span>
                    </div>
                    {result.interchanges.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '8px', padding: '6px 10px' }}>
                        <span style={{ fontSize: '12px' }}>🔄</span>
                        <span style={{ color: '#fbbf24', fontSize: '11px' }}>Change at {result.interchanges.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { icon: '⏱', label: 'Duration', value: result.totalTime + ' min', accent: '#6366f1' },
                      { icon: '🚇', label: 'Stations', value: result.numStops + ' stops', accent: '#8b5cf6' },
                      { icon: '📍', label: 'Distance', value: result.totalDistance + ' km', accent: '#06b6d4' },
                      { icon: '💰', label: 'Fare', value: 'Rs. ' + result.totalFare, accent: '#10b981' },
                    ].map((stat, i) => (
                      <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: stat.accent, opacity: 0.5, borderRadius: '12px 12px 0 0' }} />
                        <div style={{ fontSize: '18px', marginBottom: '6px' }}>{stat.icon}</div>
                        <div style={{ color: 'white', fontWeight: '700', fontSize: '14px', letterSpacing: '-0.02em' }}>{stat.value}</div>
                        <div style={{ color: '#475569', fontSize: '10px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '14px', maxHeight: '220px', overflowY: 'auto' }}>
                    <div style={{ color: '#475569', fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>Route Path</div>
                    {result.path.map((station, index) => {
                      const isFirst = index === 0;
                      const isLast = index === result.path.length - 1;
                      const col = isFirst || isLast ? '#fff' : station.line === 'interchange' ? '#fbbf24' : station.line === 'purple' ? '#8b5cf6' : '#06b6d4';
                      return (
                        <motion.div key={station.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }}
                          style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '2px' }}>
                            <div style={{ width: isFirst || isLast ? '10px' : '8px', height: isFirst || isLast ? '10px' : '8px', borderRadius: '50%', background: col, boxShadow: isFirst || isLast ? ('0 0 8px ' + col) : 'none', flexShrink: 0 }} />
                            {index < result.path.length - 1 && (
                              <div style={{ width: '2px', height: '18px', background: station.line === 'purple' ? 'rgba(139,92,246,0.3)' : 'rgba(6,182,212,0.3)' }} />
                            )}
                          </div>
                          <span style={{ color: isFirst || isLast ? 'white' : station.line === 'interchange' ? '#fbbf24' : '#94a3b8', fontSize: '12px', fontWeight: isFirst || isLast ? '600' : '400', lineHeight: '1.4' }}>
                            {station.name}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  <motion.a
                    href={buildBookingUrl()}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(16,185,129,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    style={{ display: 'block', background: 'linear-gradient(135deg, #059669, #047857)', borderRadius: '12px', color: 'white', fontWeight: '600', fontSize: '13px', padding: '13px', textAlign: 'center', textDecoration: 'none', cursor: 'pointer' }}>
                    Book Ticket — Rs. {result.totalFare}
                  </motion.a>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '300px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '16px' }}>🗺️</div>
                  <div style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>Plan your journey</div>
                  <div style={{ color: '#475569', fontSize: '12px', lineHeight: '1.5' }}>Select origin and destination, then tap Show Route</div>
                  {from && !to && (
                    <div style={{ marginTop: '16px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '8px', padding: '8px 12px' }}>
                      <span style={{ color: '#818cf8', fontSize: '11px' }}>Origin: <strong style={{ color: 'white' }}>{from}</strong> — now pick destination</span>
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
