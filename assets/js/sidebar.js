/**
 * PixelForge AI Editor - Sidebar Controller Module
 */

import { $, $$, on } from './helper.js';

export class SidebarController {
  constructor() {
    this.sidebar = $('.side-navbar');
    this.toggleBtn = $('[data-toggle="sidebar"]');
  }

  init() {
    if (this.toggleBtn && this.sidebar) {
      on(this.toggleBtn, 'click', () => this.toggle());
    }

    // Auto-close sidebar on mobile overlay click
    on(document, 'click', (event) => {
      if (
        window.innerWidth < 992 &&
        this.sidebar &&
        this.sidebar.classList.contains('is-open') &&
        !this.sidebar.contains(event.target) &&
        (!this.toggleBtn || !this.toggleBtn.contains(event.target))
      ) {
        this.close();
      }
    });

    this.initActiveLinkHandling();
  }

  toggle() {
    if (this.sidebar) {
      this.sidebar.classList.toggle('is-open');
    }
  }

  open() {
    if (this.sidebar) {
      this.sidebar.classList.add('is-open');
    }
  }

  close() {
    if (this.sidebar) {
      this.sidebar.classList.remove('is-open');
    }
  }

  initActiveLinkHandling() {
    const navLinks = $$('.side-navbar nav a');
    navLinks.forEach(link => {
      on(link, 'click', (e) => {
        navLinks.forEach(item => item.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });
  }
}
