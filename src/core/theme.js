// Keep the chosen appearance available before the stylesheet paints.
(() => {
  const KEY = 'codeflow_theme';
  const root = document.documentElement;
  let theme = 'dark';
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch (_) { /* Theme selection still works for this page without storage. */ }
  root.dataset.theme = theme;

  const updateControl = () => {
    const button = document.getElementById('theme-toggle');
    const icon = button?.querySelector('.material-symbols-outlined');
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (button) {
      button.setAttribute('aria-label', `Switch to ${next} mode`);
      button.title = `Switch to ${next} mode`;
    }
    if (icon) icon.textContent = root.dataset.theme === 'dark' ? 'light_mode' : 'dark_mode';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = root.dataset.theme === 'dark' ? '#10141a' : '#f8fafc';
  };

  const setTheme = (themeName) => {
    root.dataset.theme = themeName;
    try { localStorage.setItem(KEY, themeName); } catch (_) { /* Keep the in-memory choice. */ }
    updateControl();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateControl();
      document.getElementById('theme-toggle')?.addEventListener('click', () => {
        setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
      });
    }, { once: true });
  } else {
    updateControl();
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }
})();
