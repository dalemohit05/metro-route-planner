interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  taglineLang?: 'hi' | 'en';
}

export default function Logo({ size = 'md', showTagline = false, taglineLang = 'hi' }: LogoProps) {
  const sizes = {
    sm: { icon: '24px', iconBox: '28px', name: '13px', tagline: '9px' },
    md: { icon: '16px', iconBox: '32px', name: '15px', tagline: '10px' },
    lg: { icon: '20px', iconBox: '40px', name: '20px', tagline: '12px' },
  };
  const s = sizes[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: s.iconBox,
          height: s.iconBox,
          borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: s.icon,
          flexShrink: 0,
        }}
      >
        🚇
      </div>
      <div>
        <div
          className="font-devanagari"
          style={{
            color: 'var(--text-primary)',
            fontWeight: 700,
            fontSize: s.name,
            letterSpacing: '-0.01em',
            lineHeight: '1',
          }}
        >
          मेट्रोमित्र
        </div>
        {showTagline && (
          <div style={{ color: 'var(--accent-indigo)', fontSize: s.tagline, marginTop: '2px' }}>
            {taglineLang === 'hi'
              ? 'आपला स्मार्ट पुणे मेट्रो साथी'
              : 'Your Smart Pune Metro Companion'}
          </div>
        )}
      </div>
    </div>
  );
}
