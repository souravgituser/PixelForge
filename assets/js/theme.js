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
    this.bindRadioButtons(savedTheme);
  }

  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  bindRadioButtons(theme) {
    const darkRadio = document.getElementById('theme-dark');
    const lightRadio = document.getElementById('theme-light');

    if (darkRadio && lightRadio) {
      if (theme === 'dark') {
        darkRadio.checked = true;
      } else {
        lightRadio.checked = true;
      }

      darkRadio.addEventListener('change', () => {
        if (darkRadio.checked) this.applyTheme('dark');
      });

      lightRadio.addEventListener('change', () => {
        if (lightRadio.checked) this.applyTheme('light');
      });
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    return newTheme;
  }
}
