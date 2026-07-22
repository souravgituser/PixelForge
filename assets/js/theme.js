/**
 * PixelForge AI Editor - Theme Controller Module
 * Manages dark theme state for PixelForge AI Editor
 */

export class ThemeController {
  constructor() {
    this.STORAGE_KEY = 'pixelforge_theme';
    this.DEFAULT_THEME = 'dark'; // Dark theme is single source of truth per Stitch spec
  }

  init() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) || this.DEFAULT_THEME;
    this.applyTheme(savedTheme);
  }

  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    return newTheme;
  }
}
