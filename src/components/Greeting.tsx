'use client';

import { useState, useEffect } from 'react';

interface GreetingProps {
  name: string;
}

export default function Greeting({ name }: GreetingProps) {
  const [greeting, setGreeting] = useState<{ text: string; emoji: string } | null>(null);

  useEffect(() => {
    // Runs in the browser, so it always reflects the visitor's
    // actual local time — not the server's timezone.
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting({ text: 'Good Morning', emoji: '👋' });
    } else if (hour >= 12 && hour < 17) {
      setGreeting({ text: 'Good Afternoon', emoji: '☀️' });
    } else if (hour >= 17 && hour < 20) {
      setGreeting({ text: 'Good Evening', emoji: '🌆' });
    } else {
      setGreeting({ text: 'Good Evening', emoji: '🌙' });
    }
  }, []);

  // While waiting for client mount, show a neutral placeholder
  // to avoid a flash of incorrect text.
  if (!greeting) {
    return (
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
        Welcome back, {name}!
      </h2>
    );
  }

  return (
    <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
      {greeting.text}, {name}! {greeting.emoji}
    </h2>
  );
}
