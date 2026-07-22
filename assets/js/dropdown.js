/**
 * PixelForge AI Editor - Accessible Dropdown Module
 */

import { $, $$, on } from './helper.js';

export class DropdownController {
  init() {
    on('[data-dropdown-toggle]', 'click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const toggle = e.currentTarget;
      const menuId = toggle.getAttribute('data-dropdown-toggle');
      const menu = document.getElementById(menuId);

      if (!menu) return;

      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      this.closeAll();

      if (!isExpanded) {
        toggle.setAttribute('aria-expanded', 'true');
        menu.classList.add('is-open');
      }
    });

    // Close all open dropdowns on document click
    on(document, 'click', () => this.closeAll());
  }

  closeAll() {
    $$('[data-dropdown-toggle]').forEach(toggle => {
      toggle.setAttribute('aria-expanded', 'false');
    });

    $$('.dropdown-menu-custom').forEach(menu => {
      menu.classList.remove('is-open');
    });
  }
}
