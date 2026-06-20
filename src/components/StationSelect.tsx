'use client';

import { useState, useRef, useEffect } from 'react';

interface StationOption {
  id: number | string;
  name: string;
  line: string;
}

interface StationSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  stations: StationOption[];
  accentColor?: string;
}

export default function StationSelect({
  value,
  onChange,
  placeholder,
  stations,
  accentColor = '#8b5cf6',
}: StationSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedStation = stations.find((s) => String(s.id) === value);

  const purpleStations = stations.filter((s) => s.line === 'purple' || s.line === 'interchange');
  const aquaStations = stations.filter((s) => s.line === 'aqua');

  function lineColor(line: string) {
    if (line === 'interchange') return '#fbbf24';
    if (line === 'purple') return '#8b5cf6';
    return '#06b6d4';
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.05)',
          border: open ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.09)',
          borderRadius: '10px',
          color: selectedStation ? 'white' : '#64748b',
          fontSize: '13px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'border-color 0.15s',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          {selectedStation && (
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: lineColor(selectedStation.line),
                flexShrink: 0,
              }}
            />
          )}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedStation ? selectedStation.name : placeholder}
          </span>
        </span>
        <span style={{ color: '#64748b', fontSize: '11px', flexShrink: 0, marginLeft: '8px' }}>
          {open ? '▲' : '▼'}
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#0d1424',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
            maxHeight: '280px',
            overflowY: 'auto',
            zIndex: 100,
            padding: '6px',
          }}
        >
          {purpleStations.length > 0 && (
            <>
              <div style={{ color: '#475569', fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '8px 10px 4px' }}>
                Purple Line
              </div>
              {purpleStations.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { onChange(String(s.id)); setOpen(false); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: String(s.id) === value ? 'rgba(139,92,246,0.12)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: String(s.id) === value ? 'white' : '#cbd5e1',
                    fontSize: '13px',
                    padding: '9px 10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = String(s.id) === value ? 'rgba(139,92,246,0.12)' : 'transparent'; }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: lineColor(s.line), flexShrink: 0 }} />
                  {s.name}
                </button>
              ))}
            </>
          )}

          {aquaStations.length > 0 && (
            <>
              <div style={{ color: '#475569', fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '10px 10px 4px' }}>
                Aqua Line
              </div>
              {aquaStations.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { onChange(String(s.id)); setOpen(false); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: String(s.id) === value ? 'rgba(6,182,212,0.12)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: String(s.id) === value ? 'white' : '#cbd5e1',
                    fontSize: '13px',
                    padding: '9px 10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = String(s.id) === value ? 'rgba(6,182,212,0.12)' : 'transparent'; }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: lineColor(s.line), flexShrink: 0 }} />
                  {s.name}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
