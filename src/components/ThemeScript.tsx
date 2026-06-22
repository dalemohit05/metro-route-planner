// This script runs BEFORE React hydrates, directly in <head>.
// It prevents the "flash of wrong theme" by setting data-theme
// on <html> as early as possible.
export default function ThemeScript() {
  const script = `
(function() {
  try {
    var stored = localStorage.getItem('metromitra-theme-mode');
    var theme;
    if (stored === 'light' || stored === 'dark') {
      theme = stored;
    } else {
      var hour = new Date().getHours();
      theme = (hour >= 7 && hour < 19) ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
