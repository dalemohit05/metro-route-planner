'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { mode, setMode } = useTheme();

  const options: { value: 'light' | 'dark' | 'auto'; icon: string; label: string }[] = [
    { value: 'light', icon: '☀️', label: 'Light' },
    { value: 'dark', icon: '🌙', label: 'Dark' },
    { value: 'auto', icon: '🕒', label: 'Auto' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        background: 'var(--bg-input)',
        border: '1px solid var(--border-input)',
        borderRadius: '10px',
        padding: '3px',
        gap: '2px',
      }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setMode(opt.value)}
          title={opt.label}
          style={{
            background: mode === opt.value ? 'var(--accent-indigo)' : 'transparent',
            border: 'none',
            borderRadius: '7px',
            color: mode === opt.value ? 'white' : 'var(--text-secondary)',
            fontSize: '13px',
            padding: '6px 9px',
            cursor: 'pointer',
            transition: 'all 0.15s',
            lineHeight: 1,
          }}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}
