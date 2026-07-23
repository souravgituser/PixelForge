/**
 * PixelForge AI Editor - Library Controller Module
 */

import { $, $$, on } from './helper.js';
import { galleryDb } from './gallery-db.js';

export class LibraryController {
  constructor() {
    this.searchInput = $('#library-search');
    this.grid = $('#library-grid');
    this.items = $$('.library-item');
    this.dropZone = $('#drop-zone');
    this.fileInput = $('#asset-file-input');
    this.filePreviewList = $('#file-preview-list');
    this.confirmUploadBtn = $('#confirm-upload-btn');
    
    this.stagedFiles = [];
    this.activeTag = 'all';
    this.searchQuery = '';
  }

  init() {
    if (this.items.length || this.dropZone) {
      this.bindSearch();
      this.bindTags();
      this.bindUpload();
      this.loadSavedItems();
      console.log('Library Controller initialized.');
    }
  }

  bindSearch() {
    if (this.searchInput) {
      on(this.searchInput, 'input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.filterItems();
      });
    }
  }

  bindTags() {
    const tagBtns = $$('.library-tag-btn');
    tagBtns.forEach(btn => {
      on(btn, 'click', (e) => {
        tagBtns.forEach(b => {
          b.classList.remove('btn-primary', 'active');
          b.classList.add('btn-outline-secondary');
        });
        e.currentTarget.classList.remove('btn-outline-secondary');
        e.currentTarget.classList.add('btn-primary', 'active');

        this.activeTag = e.currentTarget.getAttribute('data-tag');
        this.filterItems();
      });
    });
  }

  bindUpload() {
    if (!this.dropZone || !this.fileInput) return;

    // Reset upload modal state on trigger
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-modal-target="upload-modal"]')) {
        this.stagedFiles = [];
        if (this.fileInput) this.fileInput.value = '';
        if (this.filePreviewList) this.filePreviewList.innerHTML = '';
      }
    });

    // Trigger file dialog on click
    on(this.dropZone, 'click', (e) => {
      if (e.target === this.fileInput || e.target.closest('#file-preview-list')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      this.fileInput.value = '';
      this.fileInput.click();
    });


    // File input selection
    on(this.fileInput, 'change', (e) => {
      const files = Array.from(e.target.files);
      this.handleSelectedFiles(files);
      this.fileInput.value = '';
    });

    // Drag and drop events
    ['dragenter', 'dragover'].forEach(eventName => {
      on(this.dropZone, eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.add('border-primary', 'bg-dark/80');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      on(this.dropZone, eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.remove('border-primary', 'bg-dark/80');
      });
    });

    on(this.dropZone, 'drop', (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length) {
        const files = Array.from(dt.files);
        this.handleSelectedFiles(files);
      }
    });

    // Confirm upload action
    if (this.confirmUploadBtn) {
      on(this.confirmUploadBtn, 'click', () => {
        this.processStagedUploads();
      });
    }
  }

  handleSelectedFiles(files) {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (!imageFiles.length) return;

    this.stagedFiles.push(...imageFiles);
    this.renderPreviews();
  }

  renderPreviews() {
    if (!this.filePreviewList) return;
    this.filePreviewList.innerHTML = '';

    this.stagedFiles.forEach((file, index) => {
      const url = URL.createObjectURL(file);
      const badge = document.createElement('div');
      badge.className = 'position-relative d-inline-block rounded overflow-hidden border border-secondary';
      badge.style.width = '64px';
      badge.style.height = '64px';

      badge.innerHTML = `
        <img src="${url}" class="w-100 h-100 object-fit-cover" title="${file.name}" />
        <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 p-1 font-size-xs bg-dark rounded-circle" data-remove-index="${index}" aria-label="Remove"></button>
      `;
      this.filePreviewList.appendChild(badge);
    });

    // Handle preview remove buttons
    $$('[data-remove-index]').forEach(btn => {
      on(btn, 'click', (e) => {
        e.stopPropagation();
        const idx = parseInt(e.currentTarget.getAttribute('data-remove-index'), 10);
        this.stagedFiles.splice(idx, 1);
        this.renderPreviews();
      });
    });
  }

  async processStagedUploads() {
    if (!this.stagedFiles.length) {
      if (window.PixelForgeApp && window.PixelForgeApp.modal) {
        window.PixelForgeApp.modal.closeActive();
      }
      return;
    }

    const readAsDataURL = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    for (const file of this.stagedFiles) {
      try {
        const dataUrl = await readAsDataURL(file);
        
        // Save to IndexedDB gallery database
        const savedItem = await galleryDb.save({
          title: file.name,
          imgDataUrl: dataUrl,
          tags: 'Uploaded Raw',
          width: 800,
          height: 600
        });

        // Now, prepend to the library grid
        const cardCol = document.createElement('div');
        cardCol.className = 'col-12 col-md-6 col-lg-4 library-item';
        cardCol.setAttribute('data-title', file.name);
        cardCol.setAttribute('data-tags', 'Uploaded Raw');
        cardCol.setAttribute('data-gallery-id', savedItem.id);

        const dateStr = this.formatTimestamp(Date.now());
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);

        cardCol.innerHTML = `
          <div class="project-card" style="position: relative;" data-gallery-id="${savedItem.id}">
            <div class="aspect-4-3 position-relative overflow-hidden">
              <img src="${dataUrl}" alt="${file.name}" class="w-100 h-100 object-fit-cover" />
              <div class="position-absolute top-0 end-0 p-3 d-flex gap-2">
                <span class="badge-processed" style="background: linear-gradient(135deg, #3b82f6, #2563eb);">New Upload</span>
              </div>
            </div>
            <div class="p-3">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h3 class="font-body-md font-bold text-on-surface-color text-truncate mb-0" style="max-width: 180px;">${file.name}</h3>
                  <span class="font-mono-sm text-on-surface-variant-color">${sizeMb} MB • ${dateStr}</span>
                </div>
                <div class="d-flex align-items-center gap-1">
                  <a href="./editor.html" class="btn-icon open-in-editor-btn" title="Open in Editor" data-gallery-id="${savedItem.id}" data-title="${file.name}">
                    <span class="material-symbols-outlined">edit</span>
                  </a>
                  <button class="btn-icon gallery-delete-btn" title="Delete from Gallery" data-gallery-id="${savedItem.id}" style="color: #ef4444;">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
              <div class="d-flex gap-2">
                <span class="chip-tag">Uploaded</span>
                <span class="chip-tag">RAW</span>
              </div>
            </div>
          </div>
        `;

        // Bind delete button for this new card
        const delBtn = cardCol.querySelector('.gallery-delete-btn');
        if (delBtn) {
          on(delBtn, 'click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            await this.deleteSavedItem(savedItem.id, delBtn);
          });
        }

        if (this.grid) {
          this.grid.prepend(cardCol);
        }
      } catch (err) {
        console.error("Failed to process file upload:", err);
      }
    }

    // Reset staged files & close modal
    this.stagedFiles = [];
    if (this.filePreviewList) this.filePreviewList.innerHTML = '';
    if (this.fileInput) this.fileInput.value = '';

    // Update internal items reference
    this.items = $$('.library-item');

    if (window.PixelForgeApp && window.PixelForgeApp.modal) {
      window.PixelForgeApp.modal.closeActive();
    }
  }

  filterItems() {
    this.items.forEach(item => {
      const title = (item.getAttribute('data-title') || '').toLowerCase();
      const tags = (item.getAttribute('data-tags') || '').toLowerCase();

      const matchesSearch = !this.searchQuery || title.includes(this.searchQuery) || tags.includes(this.searchQuery);
      const matchesTag = this.activeTag === 'all' || tags.includes(this.activeTag.toLowerCase());

      if (matchesSearch && matchesTag) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  async loadSavedItems() {
    try {
      const items = await galleryDb.getAll();
      if (!items.length || !this.grid) return;

      items.forEach(item => {
        const cardCol = document.createElement('div');
        cardCol.className = 'col-12 col-md-6 col-lg-4 library-item';
        cardCol.setAttribute('data-title', item.title);
        cardCol.setAttribute('data-tags', item.tags || 'Edited');
        cardCol.setAttribute('data-gallery-id', item.id);

        const dateStr = this.formatTimestamp(item.timestamp);
        const sizeKb = item.imgDataUrl ? Math.round(item.imgDataUrl.length * 0.75 / 1024) : 0;
        const sizeStr = sizeKb > 1024 ? (sizeKb / 1024).toFixed(1) + ' MB' : sizeKb + ' KB';

        cardCol.innerHTML = `
          <div class="project-card" style="position: relative;" data-gallery-id="${item.id}">
            <div class="aspect-4-3 position-relative overflow-hidden">
              <img src="${item.imgDataUrl}" alt="${item.title}" class="w-100 h-100 object-fit-cover" />
              <div class="position-absolute top-0 end-0 p-3 d-flex gap-2">
                <span class="badge-processed" style="background: linear-gradient(135deg, #22c55e, #16a34a);">Edited</span>
              </div>
            </div>
            <div class="p-3">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h3 class="font-body-md font-bold text-on-surface-color text-truncate mb-0" style="max-width: 180px;">${item.title}</h3>
                  <span class="font-mono-sm text-on-surface-variant-color">${sizeStr} • ${dateStr}</span>
                </div>
                <div class="d-flex align-items-center gap-1">
                  <a href="./editor.html" class="btn-icon open-in-editor-btn" title="Open in Editor" data-gallery-id="${item.id}" data-title="${item.title}">
                    <span class="material-symbols-outlined">edit</span>
                  </a>
                  <button class="btn-icon gallery-delete-btn" title="Delete from Gallery" data-gallery-id="${item.id}" style="color: #ef4444;">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
              <div class="d-flex gap-2">
                <span class="chip-tag">Edited</span>
              </div>
            </div>
          </div>
        `;

        this.grid.prepend(cardCol);
      });

      // Update internal items reference
      this.items = $$('.library-item');

      // Bind delete buttons
      this.grid.querySelectorAll('.gallery-delete-btn').forEach(btn => {
        on(btn, 'click', async (e) => {
          e.stopPropagation();
          e.preventDefault();
          const id = parseInt(btn.getAttribute('data-gallery-id'), 10);
          await this.deleteSavedItem(id, btn);
        });
      });

      console.log(`Library: Loaded ${items.length} saved items from gallery.`);
    } catch (err) {
      console.error('Library: Failed to load saved items:', err);
    }
  }

  async deleteSavedItem(id, btn) {
    try {
      await galleryDb.delete(id);
      const card = btn.closest('.library-item');
      if (card) {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => {
          card.remove();
          this.items = $$('.library-item');
        }, 300);
      }
    } catch (err) {
      console.error('Gallery: Failed to delete item:', err);
    }
  }

  formatTimestamp(ts) {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
  }
}

