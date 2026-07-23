/**
 * PixelForge AI Editor - Accessible Dropdown Module
 */

import { $, $$, on } from './helper.js';

export class DropdownController {
  init() {
    on(document, 'click', (e) => {
      const toggle = e.target.closest('[data-dropdown-toggle]');
      
      if (!toggle) {
        // Close all dropdowns when clicking outside
        this.closeAll();
        return;
      }

      e.stopPropagation();
      e.preventDefault();
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
