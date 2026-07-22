/**
 * PixelForge AI Editor - Accessible Modal Controller Module
 */

import { $, $$, on } from './helper.js';

export class ModalController {
  constructor() {
    this.activeModal = null;
  }

  init() {
    // Global delegated click handling for data-modal-target and data-modal-close
    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('[data-modal-target]');
      if (openBtn) {
        e.preventDefault();
        const targetId = openBtn.getAttribute('data-modal-target');
        this.open(targetId);
        return;
      }

      const closeBtn = e.target.closest('[data-modal-close]');
      if (closeBtn) {
        e.preventDefault();
        this.closeActive();
        return;
      }

      // Close modal when clicking dark overlay backdrop
      if (this.activeModal && e.target === this.activeModal) {
        this.closeActive();
      }
    });

    // Close on Escape key press
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeActive();
      }
    });
  }

  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (this.activeModal && this.activeModal !== modal) {
      this.activeModal.classList.remove('is-visible');
      this.activeModal.setAttribute('aria-hidden', 'true');
    }

    this.activeModal = modal;
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first focusable element inside modal
    const focusable = modal.querySelector('button, [href], input, select, textarea');
    if (focusable) focusable.focus();
  }

  closeActive() {
    if (!this.activeModal) return;

    this.activeModal.classList.remove('is-visible');
    this.activeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.activeModal = null;
  }
}
