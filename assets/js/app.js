/**
 * PixelForge AI Editor - Main JavaScript Entry Point
 * Modern ES6 Modules Architecture
 */

import { initLazyLoading, initImageFallbacks } from './helper.js';
import { ThemeController } from './theme.js';
import { SidebarController } from './sidebar.js';
import { ModalController } from './modal.js';
import { DropdownController } from './dropdown.js';
import { EditorController } from './editor.js';
import { LibraryController } from './library.js';
import { ExportController } from './export.js';
import { FirebaseService } from './firebase-service.js';
import { GoogleDriveService } from './drive-service.js';
import { AuthUIController } from './auth-ui.js';

class PixelForgeApp {
  constructor() {
    this.theme = new ThemeController();
    this.sidebar = new SidebarController();
    this.modal = new ModalController();
    this.dropdown = new DropdownController();
    this.editor = new EditorController();
    this.library = new LibraryController();
    this.export = new ExportController();
    this.firebase = new FirebaseService();
    this.drive = new GoogleDriveService();
    this.authUI = new AuthUIController(this.firebase);
  }

  async init() {
    // Initialize image fallbacks & lazy loading
    initImageFallbacks();
    initLazyLoading();

    // Initialize Firebase Auth & DB first
    await this.firebase.init();

    // Initialize core controllers
    this.theme.init();
    this.sidebar.init();
    this.modal.init();
    this.dropdown.init();
    this.authUI.init();

    // Initialize page-specific controllers
    this.editor.init();
    this.library.init();
    this.export.init();

    // Bind global navigation listeners to pass active image to editor
    this.bindGlobalNavInterceptors();

    console.log('PixelForge AI Editor architecture initialized successfully.');
  }


  bindGlobalNavInterceptors() {
    const makeElementsDraggable = () => {
      const items = document.querySelectorAll('.project-card, .library-item, [data-open-editor], .project-card img, .library-item img');
      items.forEach(el => {
        if (!el.hasAttribute('draggable')) {
          el.setAttribute('draggable', 'true');
        }
        if (!el.dataset.dragBound) {
          el.dataset.dragBound = 'true';
          el.addEventListener('dragstart', (e) => {
            let card = el.closest('.project-card, .library-item, [data-open-editor]') || el;
            let imgSrc = card.getAttribute('data-img-src');
            let title = card.getAttribute('data-title');

            if (!imgSrc) {
              const img = card.querySelector('img') || (el.tagName === 'IMG' ? el : null);
              if (img) imgSrc = img.src;
            }
            if (!title) {
              const titleEl = card.querySelector('h3, h2, p, .font-body-md');
              if (titleEl) title = titleEl.textContent.trim();
            }

            if (imgSrc) {
              e.dataTransfer.setData('text/plain', imgSrc);
              e.dataTransfer.setData('text/uri-list', imgSrc);
              e.dataTransfer.setData('pixedit-img-src', imgSrc);
              e.dataTransfer.setData('pixedit-title', title || 'Saved Project');
              e.dataTransfer.effectAllowed = 'copy';
            }
          });
        }
      });
    };

    makeElementsDraggable();
    const observer = new MutationObserver(() => makeElementsDraggable());
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('click', (e) => {
      const cardTarget = e.target.closest('.project-card, .library-item, [data-open-editor]');

      if (cardTarget) {
        // Check if this is a saved gallery item (from IndexedDB)
        const galleryId = cardTarget.getAttribute('data-gallery-id') 
          || (e.target.closest('[data-gallery-id]') || {}).getAttribute?.('data-gallery-id');

        if (galleryId) {
          // Store gallery ID reference — editor will load from IndexedDB
          sessionStorage.setItem('pixedit_gallery_id', galleryId);
          sessionStorage.removeItem('pixedit_active_image');

          let title = cardTarget.getAttribute('data-title');
          if (!title) {
            const titleEl = cardTarget.querySelector('h3, h2, p, .font-body-md');
            if (titleEl) title = titleEl.textContent.trim();
          }
          if (title) {
            sessionStorage.setItem('pixedit_active_title', title);
          }

          if (!e.target.closest('a')) {
            const isPagesDir = window.location.pathname.includes('/pages/');
            window.location.href = isPagesDir ? './editor.html' : './pages/editor.html';
          }
          return;
        }

        // Regular (non-gallery) card handling
        let imgSrc = cardTarget.getAttribute('data-img-src');
        let title = cardTarget.getAttribute('data-title');

        if (!imgSrc) {
          const img = cardTarget.querySelector('img');
          if (img) imgSrc = img.src;
        }
        if (!title) {
          const titleEl = cardTarget.querySelector('h3, h2, p, .font-body-md');
          if (titleEl) title = titleEl.textContent.trim();
        }

        if (imgSrc) {
          sessionStorage.removeItem('pixedit_gallery_id');
          sessionStorage.setItem('pixedit_active_image', imgSrc);
        }
        if (title) {
          sessionStorage.setItem('pixedit_active_title', title);
        }

        if (!e.target.closest('a')) {
          const isPagesDir = window.location.pathname.includes('/pages/');
          window.location.href = isPagesDir ? './editor.html' : './pages/editor.html';
        }
      }
    });
  }

}

// Instantiate application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new PixelForgeApp();
  app.init();
  window.PixelForgeApp = app; // Accessible on window for debugging/extension
});
