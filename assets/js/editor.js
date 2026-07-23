/**
 * PixelForge AI Editor - Canvas Editor Controller Module
 */

import { $, $$, on } from './helper.js';
import { STOCK_IMAGES } from './stock-images.js';
import { galleryDb } from './gallery-db.js';

const FILTER_PRESETS = [
  // Classic & Adjust
  { id: 'none', name: 'Normal', category: 'classic', css: '' },
  { id: 'auto-enhance', name: 'Auto-Enhance', category: 'classic', css: 'contrast(115%) saturate(110%) brightness(105%)' },
  { id: 'high-contrast', name: 'High Contrast', category: 'classic', css: 'contrast(140%)' },
  { id: 'soft', name: 'Soft Glow', category: 'classic', css: 'brightness(105%) contrast(85%) saturate(90%)' },
  { id: 'shadow-boost', name: 'Shadow Boost', category: 'classic', css: 'brightness(115%) contrast(95%)' },
  { id: 'highlight-rec', name: 'Highlight Recovery', category: 'classic', css: 'brightness(90%) contrast(105%)' },

  // Cinematic
  { id: 'cyberpunk', name: 'Cyberpunk', category: 'cinematic', css: 'hue-rotate(180deg) saturate(180%) contrast(120%)' },
  { id: 'teal-orange', name: 'Teal & Orange', category: 'cinematic', css: 'hue-rotate(-20deg) saturate(130%) contrast(110%)' },
  { id: 'hollywood', name: 'Hollywood', category: 'cinematic', css: 'contrast(115%) brightness(95%) saturate(110%) hue-rotate(10deg)' },
  { id: 'neo-noir', name: 'Neo-Noir', category: 'cinematic', css: 'contrast(130%) saturate(70%) brightness(90%) hue-rotate(-10deg)' },
  { id: 'sci-fi-green', name: 'Sci-Fi Green', category: 'cinematic', css: 'hue-rotate(60deg) saturate(120%) contrast(110%)' },
  { id: 'retro-cinema', name: 'Retro Cinema', category: 'cinematic', css: 'sepia(15%) contrast(110%) saturate(115%)' },
  { id: 'moonlight', name: 'Moonlight', category: 'cinematic', css: 'brightness(75%) contrast(115%) saturate(60%) hue-rotate(200deg)' },
  { id: 'sunset', name: 'Sunset', category: 'cinematic', css: 'sepia(30%) saturate(160%) hue-rotate(-15deg)' },
  { id: 'cyber-neon', name: 'Cyber Neon', category: 'cinematic', css: 'hue-rotate(140deg) saturate(200%) contrast(125%)' },
  { id: 'film-noir', name: 'Film Noir', category: 'cinematic', css: 'grayscale(90%) contrast(140%) brightness(90%)' },

  // Vintage & Retro
  { id: 'vintage', name: 'Vintage', category: 'vintage', css: 'sepia(50%) contrast(90%) brightness(105%)' },
  { id: 'retro-70s', name: 'Retro 70s', category: 'vintage', css: 'sepia(35%) saturate(140%) hue-rotate(10deg) contrast(95%)' },
  { id: 'polaroid', name: 'Polaroid', category: 'vintage', css: 'contrast(85%) saturate(120%) brightness(110%) sepia(20%)' },
  { id: 'fade', name: 'Fade', category: 'vintage', css: 'contrast(80%) brightness(105%) saturate(90%)' },
  { id: 'sepia-classic', name: 'Sepia Classic', category: 'vintage', css: 'sepia(100%) contrast(100%)' },
  { id: 'aged-paper', name: 'Aged Paper', category: 'vintage', css: 'sepia(70%) contrast(85%) brightness(95%)' },
  { id: 'cold-retro', name: 'Cold Retro', category: 'vintage', css: 'sepia(10%) hue-rotate(180deg) saturate(110%) contrast(95%)' },
  { id: 'warm', name: 'Golden Hour', category: 'vintage', css: 'sepia(25%) saturate(140%) brightness(105%)' },
  { id: 'analog-film', name: 'Analog Film', category: 'vintage', css: 'contrast(105%) saturate(100%) sepia(15%) hue-rotate(5deg)' },
  { id: 'rust', name: 'Rust', category: 'vintage', css: 'sepia(40%) saturate(180%) hue-rotate(-30deg) contrast(110%)' },

  // Black & White
  { id: 'bw', name: 'Noir B&W', category: 'bw', css: 'grayscale(100%) contrast(130%)' },
  { id: 'silver-screen', name: 'Silver Screen', category: 'bw', css: 'grayscale(100%) contrast(110%) brightness(105%)' },
  { id: 'high-key-bw', name: 'High Key B&W', category: 'bw', css: 'grayscale(100%) contrast(140%) brightness(120%)' },
  { id: 'low-key-bw', name: 'Low Key B&W', category: 'bw', css: 'grayscale(100%) contrast(150%) brightness(75%)' },
  { id: 'sepia-tone-bw', name: 'Sepia Tone B&W', category: 'bw', css: 'grayscale(100%) sepia(30%) contrast(110%)' },
  { id: 'cool-bw', name: 'Cool B&W', category: 'bw', css: 'grayscale(100%) hue-rotate(200deg) saturate(5%) contrast(115%)' },
  { id: 'matte-bw', name: 'Matte B&W', category: 'bw', css: 'grayscale(100%) contrast(80%) brightness(110%)' },
  { id: 'carbon', name: 'Carbon', category: 'bw', css: 'grayscale(100%) contrast(170%) brightness(80%)' },

  // Aesthetic & Artistic
  { id: 'dreamy', name: 'Dreamy', category: 'aesthetic', css: 'blur(0.5px) brightness(110%) saturate(115%)' },
  { id: 'acid-trip', name: 'Acid Trip', category: 'aesthetic', css: 'hue-rotate(90deg) saturate(180%)' },
  { id: 'psychedelic', name: 'Psychedelic', category: 'aesthetic', css: 'hue-rotate(270deg) saturate(220%) contrast(120%)' },
  { id: 'cyber-purple', name: 'Cyber-Purple', category: 'aesthetic', css: 'hue-rotate(120deg) saturate(160%)' },
  { id: 'forest-breath', name: 'Forest Breath', category: 'aesthetic', css: 'hue-rotate(80deg) saturate(90%) contrast(95%)' },
  { id: 'cherry-blossom', name: 'Cherry Blossom', category: 'aesthetic', css: 'hue-rotate(-40deg) saturate(130%) brightness(105%)' },
  { id: 'deep-ocean', name: 'Deep Ocean', category: 'aesthetic', css: 'hue-rotate(210deg) saturate(120%) brightness(85%)' },
  { id: 'infrared', name: 'InfraRed', category: 'aesthetic', css: 'hue-rotate(-120deg) saturate(200%) contrast(110%)' },
  { id: 'pastel-dream', name: 'Pastel Dream', category: 'aesthetic', css: 'saturate(70%) brightness(120%) contrast(85%)' },
  { id: 'pop-art', name: 'Pop Art', category: 'aesthetic', css: 'saturate(300%) contrast(150%)' },

  // DuoTone
  { id: 'crimson', name: 'Crimson', category: 'duotone', css: 'grayscale(100%) sepia(100%) hue-rotate(-40deg) saturate(300%) contrast(110%)' },
  { id: 'cobalt', name: 'Cobalt', category: 'duotone', css: 'grayscale(100%) sepia(100%) hue-rotate(190deg) saturate(400%) contrast(110%)' },
  { id: 'emerald', name: 'Emerald', category: 'duotone', css: 'grayscale(100%) sepia(100%) hue-rotate(90deg) saturate(300%) contrast(110%)' },
  { id: 'amber', name: 'Amber', category: 'duotone', css: 'grayscale(100%) sepia(100%) hue-rotate(10deg) saturate(400%) contrast(115%)' },
  { id: 'magenta', name: 'Magenta', category: 'duotone', css: 'grayscale(100%) sepia(100%) hue-rotate(280deg) saturate(400%) contrast(110%)' },
  { id: 'cyan', name: 'Cyan', category: 'duotone', css: 'grayscale(100%) sepia(100%) hue-rotate(160deg) saturate(300%) contrast(105%)' },
  { id: 'purple-rain', name: 'Purple Rain', category: 'duotone', css: 'grayscale(100%) sepia(100%) hue-rotate(240deg) saturate(350%) contrast(115%)' },
  { id: 'gold-leaf', name: 'Gold Leaf', category: 'duotone', css: 'grayscale(100%) sepia(100%) hue-rotate(25deg) saturate(250%) contrast(130%)' }
];

export class EditorController {
  constructor() {
    this.previewImg = $('#editor-image-preview');
    this.canvasWrapper = $('#canvas-wrapper');
    this.drawLayer = $('#canvas-draw-layer');
    this.textLayer = $('#canvas-text-layer');
    this.cropOverlay = $('#canvas-crop-overlay');
    this.zoomText = $('#zoom-level-text');
    this.openFileBtn = $('#editor-open-file-btn');
    this.fileInput = $('#editor-file-input');
    
    this.propertiesSidebar = $('#properties-sidebar');
    this.togglePropertiesBtn = $('#btn-toggle-properties');
    this.closePropertiesBtn = $('#btn-close-properties');
    
    this.currentZoom = 100;
    this.rotationAngle = 0;
    this.flipH = false;
    this.activeTool = 'select';
    this.brushSize = 20;
    this.crBrushSize = 20;
    this.isDrawing = false;

    this.isCropping = false;
    this.cropStartPos = null;
    this.cropRect = null;

    this.undoStack = [];
    this.redoStack = [];
    this.undoBtn = $('#editor-undo');
    this.redoBtn = $('#editor-redo');
    this.isRestoringState = false;

    this.filters = {
      brightness: 100,
      contrast: 100,
      saturate: 100,
      blur: 0,
      hue: 0,
      preset: 'none'
    };
  }


  init() {
    if (!this.previewImg) return;

    this.loadSessionImage();
    this.bindSliders();
    this.bindFilterPresets();
    this.bindZoomControls();
    this.bindWheelZoom();
    this.bindAiActions();
    this.bindTools();
    this.bindCropRotate();
    this.bindInpaintBrush();
    this.bindTextOverlay();
    this.bindFileOpen();
    this.bindUndoRedo();
    this.bindSaveToGallery();
    this.bindContentRemove();
    this.bindPropertiesSidebar();

    setTimeout(() => this.saveState(), 300);

    console.log('Editor Controller initialized successfully.');
  }

  getImageSrc(src, title) {
    if (!src || src === 'null' || src === 'undefined') {
      return '';
    }
    return src;
  }

  async loadSessionImage() {
    const galleryId = sessionStorage.getItem('pixedit_gallery_id');
    const storedImg = sessionStorage.getItem('pixedit_active_image');
    const storedTitle = sessionStorage.getItem('pixedit_active_title');

    const wrapper = $('#canvas-wrapper');
    const emptyContainer = $('#empty-canvas-container');

    if (storedTitle) {
      const titleEl = $('#active-project-name');
      if (titleEl) titleEl.textContent = storedTitle;
    }

    if (!this.previewImg) return;

    const hasImage = galleryId || (storedImg && storedImg !== 'null' && storedImg !== 'undefined');

    if (!hasImage) {
      if (wrapper) wrapper.style.setProperty('display', 'none', 'important');
      if (emptyContainer) emptyContainer.style.setProperty('display', 'block', 'important');
      
      const dimensionsEl = $('#canvas-dimensions-text');
      if (dimensionsEl) dimensionsEl.textContent = 'No Canvas Active';
      
      if (!storedTitle) {
        const titleEl = $('#active-project-name');
        if (titleEl) titleEl.textContent = 'No Active Project';
      }
      return;
    }

    if (wrapper) wrapper.style.setProperty('display', 'inline-flex', 'important');
    if (emptyContainer) emptyContainer.style.setProperty('display', 'none', 'important');

    // If a gallery ID is set, load the image from IndexedDB
    if (galleryId) {
      try {
        const items = await galleryDb.getAll();
        const item = items.find(i => String(i.id) === String(galleryId));
        if (item && item.imgDataUrl) {
          this.previewImg.onload = () => {
            this.updateDimensionsText();
          };
          this.previewImg.src = item.imgDataUrl;
          this.updateDimensionsText();
          sessionStorage.removeItem('pixedit_gallery_id');
          return;
        }
      } catch (err) {
        console.error('Failed to load gallery image from IndexedDB:', err);
      }
    }

    // Fallback: load from sessionStorage (for regular / stock images)
    const resolvedSrc = this.getImageSrc(storedImg, storedTitle);

    if (resolvedSrc) {
      this.previewImg.onload = () => {
        this.updateDimensionsText();
      };
      this.previewImg.onerror = () => {
        this.previewImg.onerror = null;
        this.previewImg.src = '';
        if (wrapper) wrapper.style.setProperty('display', 'none', 'important');
        if (emptyContainer) emptyContainer.style.setProperty('display', 'block', 'important');
        this.updateDimensionsText();
      };

      this.previewImg.src = resolvedSrc;
      this.updateDimensionsText();
    } else {
      if (wrapper) wrapper.style.setProperty('display', 'none', 'important');
      if (emptyContainer) emptyContainer.style.setProperty('display', 'block', 'important');
    }
  }


  saveState() {
    if (this.isRestoringState || !this.previewImg) return;

    const state = {
      imgSrc: this.previewImg.src,
      filters: { ...this.filters },
      rotationAngle: this.rotationAngle,
      flipH: this.flipH,
      inpaintDataUrl: this.drawLayer ? this.drawLayer.toDataURL() : null,
      textHtml: this.textLayer ? this.textLayer.innerHTML : ''
    };

    if (this.undoStack.length > 0) {
      const top = this.undoStack[this.undoStack.length - 1];
      if (JSON.stringify(top) === JSON.stringify(state)) {
        return;
      }
    }

    this.undoStack.push(state);
    if (this.undoStack.length > 50) {
      this.undoStack.shift();
    }
    this.redoStack = [];
    this.updateUndoRedoUI();
  }

  updateUndoRedoUI() {
    if (this.undoBtn) {
      const canUndo = this.undoStack.length > 1;
      this.undoBtn.disabled = !canUndo;
      this.undoBtn.style.opacity = canUndo ? '1' : '0.4';
      this.undoBtn.style.pointerEvents = canUndo ? 'auto' : 'none';
    }
    if (this.redoBtn) {
      const canRedo = this.redoStack.length > 0;
      this.redoBtn.disabled = !canRedo;
      this.redoBtn.style.opacity = canRedo ? '1' : '0.4';
      this.redoBtn.style.pointerEvents = canRedo ? 'auto' : 'none';
    }
  }

  undo() {
    if (this.undoStack.length <= 1) return;
    const currentState = this.undoStack.pop();
    this.redoStack.push(currentState);
    const previousState = this.undoStack[this.undoStack.length - 1];
    this.restoreState(previousState);
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const nextState = this.redoStack.pop();
    this.undoStack.push(nextState);
    this.restoreState(nextState);
  }

  restoreState(state) {
    if (!state) return;
    this.isRestoringState = true;

    this.filters = { ...state.filters };
    this.rotationAngle = state.rotationAngle;
    this.flipH = state.flipH;

    if (this.previewImg.src !== state.imgSrc) {
      this.previewImg.src = state.imgSrc;
    }

    this.applyFilters();
    this.applyTransform();

    const brightnessSlider = $('#slider-brightness');
    const contrastSlider = $('#slider-contrast');
    const saturateSlider = $('#slider-saturate');
    const blurSlider = $('#slider-blur');
    const hueSlider = $('#slider-hue');

    if (brightnessSlider) brightnessSlider.value = this.filters.brightness;
    if (contrastSlider) contrastSlider.value = this.filters.contrast;
    if (saturateSlider) saturateSlider.value = this.filters.saturate;
    if (blurSlider) blurSlider.value = this.filters.blur;
    if (hueSlider) hueSlider.value = this.filters.hue;

    $('#val-brightness') && ($('#val-brightness').textContent = `${this.filters.brightness}%`);
    $('#val-contrast') && ($('#val-contrast').textContent = `${this.filters.contrast}%`);
    $('#val-saturate') && ($('#val-saturate').textContent = `${this.filters.saturate}%`);
    $('#val-blur') && ($('#val-blur').textContent = `${this.filters.blur}px`);
    $('#val-hue') && ($('#val-hue').textContent = `${this.filters.hue}°`);

    const filterBtns = $$('.filter-preset-card');
    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-filter') === this.filters.preset) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (this.drawLayer && state.inpaintDataUrl) {
      const ctx = this.drawLayer.getContext('2d');
      ctx.clearRect(0, 0, this.drawLayer.width, this.drawLayer.height);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = state.inpaintDataUrl;
    } else if (this.drawLayer) {
      const ctx = this.drawLayer.getContext('2d');
      ctx.clearRect(0, 0, this.drawLayer.width, this.drawLayer.height);
    }

    if (this.textLayer) {
      this.textLayer.innerHTML = state.textHtml || '';
      this.rebindTextEvents();
    }

    this.updateUndoRedoUI();
    this.isRestoringState = false;
  }

  rebindTextEvents() {
    if (!this.textLayer) return;
    const badges = this.textLayer.querySelectorAll('div');
    badges.forEach(badge => {
      const textSpan = badge.querySelector('.text-content-span');
      const delBtn = badge.querySelector('.text-delete-btn');

      if (textSpan) {
        textSpan.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          textSpan.contentEditable = 'true';
          textSpan.focus();
          const range = document.createRange();
          range.selectNodeContents(textSpan);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        });

        textSpan.addEventListener('blur', () => {
          textSpan.contentEditable = 'false';
          this.saveState();
        });

        textSpan.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            textSpan.blur();
          }
        });
      }

      if (delBtn) {
        delBtn.addEventListener('mousedown', (e) => e.stopPropagation());
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          badge.remove();
          this.saveState();
        });
      }

      let isDragging = false;
      let startX, startY, origLeft, origTop;

      badge.addEventListener('mousedown', (e) => {
        if (e.target.closest('.text-delete-btn') || e.target.contentEditable === 'true') return;
        e.stopPropagation();
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        origLeft = badge.offsetLeft;
        origTop = badge.offsetTop;
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        badge.style.left = `${origLeft + dx}px`;
        badge.style.top = `${origTop + dy}px`;
        badge.style.transform = 'none';
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          this.saveState();
        }
      });
    });
  }

  bindUndoRedo() {
    if (this.undoBtn) {
      on(this.undoBtn, 'click', () => this.undo());
    }
    if (this.redoBtn) {
      on(this.redoBtn, 'click', () => this.redo());
    }

    window.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isEditable = document.activeElement && document.activeElement.isContentEditable;
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select' || isEditable) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            this.redo();
          } else {
            this.undo();
          }
        } else if (key === 'y') {
          e.preventDefault();
          this.redo();
        }
      }
    });
  }


  updateDimensionsText() {
    if (!this.previewImg) return;
    const update = () => {
      const w = this.previewImg.naturalWidth || this.previewImg.width;
      const h = this.previewImg.naturalHeight || this.previewImg.height;
      const dimEl = $('#canvas-dimensions-text');
      if (dimEl && w && h) {
        dimEl.textContent = `${w} x ${h} px (RGB / 8-bit)`;
      }
      this.syncDrawLayerSize();
    };
    if (this.previewImg.complete) {
      update();
    } else {
      this.previewImg.onload = update;
    }
  }

  syncDrawLayerSize() {
    if (this.drawLayer && this.previewImg) {
      this.drawLayer.width = this.previewImg.clientWidth || 800;
      this.drawLayer.height = this.previewImg.clientHeight || 600;
    }
  }

  bindFileOpen() {
    if (this.openFileBtn && this.fileInput) {
      on(this.openFileBtn, 'click', (e) => {
        e.preventDefault();
        this.fileInput.value = '';
        this.fileInput.click();
      });

      on(this.fileInput, 'change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
          this.loadCanvasImage(file);
        }
        this.fileInput.value = '';
      });
    }

    if (this.canvasWrapper) {
      ['dragenter', 'dragover'].forEach(eventName => {
        on(this.canvasWrapper, eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.canvasWrapper.classList.add('border-primary');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        on(this.canvasWrapper, eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.canvasWrapper.classList.remove('border-primary');
        });
      });

      on(this.canvasWrapper, 'drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const dt = e.dataTransfer;
        if (!dt) return;

        // 1. Drop OS Files
        if (dt.files && dt.files.length > 0 && dt.files[0].type.startsWith('image/')) {
          this.loadCanvasImage(dt.files[0]);
          return;
        }

        // 2. Drop In-App Images or Web Image URLs
        const customSrc = dt.getData('pixedit-img-src') || dt.getData('text/plain') || dt.getData('text/uri-list') || dt.getData('URL');
        const customTitle = dt.getData('pixedit-title') || 'Loaded Image';

        if (customSrc && (customSrc.startsWith('http') || customSrc.startsWith('data:') || customSrc.startsWith('blob:'))) {
          this.loadCanvasImageUrl(customSrc, customTitle);
        }
      });
    }
  }

  loadCanvasImage(file) {
    const url = URL.createObjectURL(file);
    this.loadCanvasImageUrl(url, file.name);
  }

  loadCanvasImageUrl(url, title) {
    if (!this.previewImg) return;
    const resolvedSrc = this.getImageSrc(url, title);

    const wrapper = $('#canvas-wrapper');
    const emptyContainer = $('#empty-canvas-container');
    if (wrapper) wrapper.style.setProperty('display', 'inline-flex', 'important');
    if (emptyContainer) emptyContainer.style.setProperty('display', 'none', 'important');

    this.previewImg.onload = () => {
      this.updateDimensionsText();
      this.saveState();
      this.previewImg.onload = null;
    };
    this.previewImg.onerror = () => {
      this.previewImg.onerror = null;
      this.previewImg.src = '';
      if (wrapper) wrapper.style.setProperty('display', 'none', 'important');
      if (emptyContainer) emptyContainer.style.setProperty('display', 'block', 'important');
      this.updateDimensionsText();
      this.saveState();
    };
    this.previewImg.src = resolvedSrc;

    if (title) {
      const titleEl = $('#active-project-name');
      if (titleEl) titleEl.textContent = title;
      sessionStorage.setItem('pixedit_active_title', title);
    }
    sessionStorage.setItem('pixedit_active_image', resolvedSrc);

    this.resetFilters();
    this.rotationAngle = 0;
    this.flipH = false;
    this.applyTransform();
  }


  bindSliders() {
    const sliders = [
      { id: 'slider-brightness', valId: 'val-brightness', prop: 'brightness', unit: '%' },
      { id: 'slider-contrast', valId: 'val-contrast', prop: 'contrast', unit: '%' },
      { id: 'slider-saturate', valId: 'val-saturate', prop: 'saturate', unit: '%' },
      { id: 'slider-blur', valId: 'val-blur', prop: 'blur', unit: 'px' },
      { id: 'slider-hue', valId: 'val-hue', prop: 'hue', unit: '°' },
    ];

    sliders.forEach(({ id, valId, prop, unit }) => {
      const slider = $(`#${id}`);
      const display = $(`#${valId}`);
      if (slider) {
        on(slider, 'input', (e) => {
          const val = e.target.value;
          this.filters[prop] = val;
          if (display) display.textContent = `${val}${unit}`;
          this.applyFilters();
        });
        on(slider, 'change', () => {
          this.saveState();
        });
      }
    });

    const resetBtn = $('#editor-reset-filters');
    const resetAllBtn = $('#editor-reset-all');
    if (resetBtn) {
      on(resetBtn, 'click', () => {
        this.resetFilters();
        this.saveState();
      });
    }
    if (resetAllBtn) {
      on(resetAllBtn, 'click', () => {
        this.resetFilters();
        this.saveState();
      });
    }

  }

  bindFilterPresets() {
    this.renderFilterPresets();
    this.bindFilterCategories();

    // Event delegation for filter cards
    const grid = $('#filter-presets-grid');
    if (grid) {
      on(grid, 'click', (e) => {
        const card = e.target.closest('.filter-preset-card');
        if (!card) return;

        const cards = $$('.filter-preset-card');
        cards.forEach(b => b.classList.remove('active'));
        card.classList.add('active');

        const filterName = card.getAttribute('data-filter');
        this.filters.preset = filterName;
        this.applyFilters();
        this.saveState();
      });
    }
  }

  renderFilterPresets() {
    const grid = $('#filter-presets-grid');
    if (!grid) return;

    grid.innerHTML = '';

    FILTER_PRESETS.forEach(filter => {
      const card = document.createElement('div');
      card.className = 'col-2 filter-preset-card text-center cursor-pointer px-1'; // col-2 for 6 columns per row, minimal padding
      card.setAttribute('data-filter', filter.id);
      card.setAttribute('data-category', filter.category);

      // Select category preview image
      let imgSrc = '../assets/images/classic.jpg';
      if (filter.category === 'cinematic') imgSrc = '../assets/images/cinematic.jpg';
      else if (filter.category === 'vintage') imgSrc = '../assets/images/vintage.jpg';
      else if (filter.category === 'bw') imgSrc = '../assets/images/bw.jpg';
      else if (filter.category === 'aesthetic') imgSrc = '../assets/images/aesthetic.jpg';
      else if (filter.category === 'duotone') imgSrc = '../assets/images/duotone.jpg';

      // Add 'active' class if this filter is currently active
      if (filter.id === this.filters.preset) {
        card.classList.add('active');
      }

      card.innerHTML = `
        <div class="position-relative rounded overflow-hidden mb-1 border border-secondary/30 filter-preset-thumb-wrapper" 
             style="aspect-ratio: 1; background: #0c0c12; transition: all 0.2s ease;">
          <img src="${imgSrc}" class="filter-preview-thumb w-100 h-100 object-fit-cover" 
               style="filter: ${filter.css || 'none'}; transition: transform 0.2s ease;" />
          <div class="filter-active-indicator position-absolute inset-0 d-flex align-items-center justify-content-center bg-primary/20 opacity-0" style="transition: opacity 0.2s ease;">
            <span class="material-symbols-outlined text-white" style="font-size: 12px; font-weight: bold;">check</span>
          </div>
        </div>
        <span class="font-label-sm text-on-surface-variant-color text-truncate d-block" style="font-size: 8px; font-weight: 500; line-height: 1.1; height: 18px; overflow: hidden;">${filter.name}</span>
      `;

      grid.appendChild(card);
    });

    // Add CSS styles for the preview card interactions
    if (!document.getElementById('filter-presets-style')) {
      const style = document.createElement('style');
      style.id = 'filter-presets-style';
      style.textContent = `
        .filter-preset-card:hover .filter-preset-thumb-wrapper {
          border-color: var(--color-primary) !important;
          transform: translateY(-1px);
        }
        .filter-preset-card:hover .filter-preview-thumb {
          transform: scale(1.08);
        }
        .filter-preset-card.active .filter-preset-thumb-wrapper {
          border-color: var(--color-primary) !important;
          box-shadow: 0 0 6px rgba(108, 99, 255, 0.4);
        }
        .filter-preset-card.active .filter-active-indicator {
          opacity: 1 !important;
        }
        .filter-preset-card.active span {
          color: var(--color-primary) !important;
          font-weight: 700;
        }
      `;
      document.head.appendChild(style);
    }
  }

  bindFilterCategories() {
    const categorySelect = $('#filter-category-select');
    if (!categorySelect) return;

    on(categorySelect, 'change', (e) => {
      const selectedCat = e.target.value;
      const cards = $$('.filter-preset-card');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (selectedCat === 'all' || cat === selectedCat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  applyFilters() {
    if (!this.previewImg) return;

    let baseFilter = `brightness(${this.filters.brightness}%) contrast(${this.filters.contrast}%) saturate(${this.filters.saturate}%) blur(${this.filters.blur}px) hue-rotate(${this.filters.hue}deg)`;

    const activePreset = FILTER_PRESETS.find(f => f.id === this.filters.preset);
    if (activePreset && activePreset.css) {
      baseFilter += ' ' + activePreset.css;
    }

    this.previewImg.style.filter = baseFilter;
  }

  resetFilters() {
    this.filters = { brightness: 100, contrast: 100, saturate: 100, blur: 0, hue: 0, preset: 'none' };
    
    ['brightness', 'contrast', 'saturate'].forEach(id => {
      const el = $(`#slider-${id}`);
      const valEl = $(`#val-${id}`);
      if (el) el.value = 100;
      if (valEl) valEl.textContent = '100%';
    });
    const blurEl = $('#slider-blur');
    if (blurEl) blurEl.value = 0;
    const valBlur = $('#val-blur');
    if (valBlur) valBlur.textContent = '0px';

    const hueEl = $('#slider-hue');
    if (hueEl) hueEl.value = 0;
    const valHue = $('#val-hue');
    if (valHue) valHue.textContent = '0°';

    $$('.filter-preset-card').forEach(b => b.classList.remove('active'));
    const defaultBtn = $('[data-filter="none"]');
    if (defaultBtn) defaultBtn.classList.add('active');

    this.rotationAngle = 0;
    this.flipH = false;
    this.applyTransform();
    this.applyFilters();
    this.clearInpaintMask();
  }

  bindZoomControls() {
    const zoomIn = $('#editor-zoom-in');
    const zoomOut = $('#editor-zoom-out');

    if (zoomIn) {
      on(zoomIn, 'click', () => {
        this.currentZoom = Math.min(this.currentZoom + 25, 400);
        this.updateZoom();
      });
    }

    if (zoomOut) {
      on(zoomOut, 'click', () => {
        this.currentZoom = Math.max(this.currentZoom - 25, 25);
        this.updateZoom();
      });
    }

    const recenterBtn = $('#btn-recenter-canvas');
    if (recenterBtn) {
      on(recenterBtn, 'click', () => {
        this.currentZoom = 100;
        this.updateZoom();
      });
    }
  }

  bindWheelZoom() {
    const mainWorkspace = $('.main-workspace');
    if (mainWorkspace) {
      mainWorkspace.addEventListener('wheel', (e) => {
        // If scrolling inside properties inspector, navigation bars, or selectors, allow normal scroll
        if (e.target.closest('#properties-sidebar') || e.target.closest('.side-navbar') || e.target.closest('.top-navbar') || e.target.closest('#filter-presets-grid')) {
          return;
        }

        // Prevent browser page zoom and page scrolling when zooming on canvas
        e.preventDefault();

        let zoomDelta = 0;
        if (e.ctrlKey) {
          // Touchpad pinch gesture
          zoomDelta = -e.deltaY * 0.5;
        } else {
          // Mouse wheel scroll
          zoomDelta = -e.deltaY * 0.15;
        }

        this.currentZoom = Math.min(Math.max(Math.round(this.currentZoom + zoomDelta), 25), 400);
        this.updateZoom();
      }, { passive: false });
    }
  }

  updateZoom() {
    if (this.canvasWrapper) {
      this.canvasWrapper.style.transform = `scale(${this.currentZoom / 100})`;
    }
    if (this.zoomText) {
      this.zoomText.textContent = `Zoom: ${this.currentZoom}%`;
    }
  }

  bindTools() {
    const tools = $$('[data-editor-tool]');
    tools.forEach(tool => {
      on(tool, 'click', (e) => {
        tools.forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const toolName = e.currentTarget.getAttribute('data-editor-tool');
        this.switchTool(toolName);
      });
    });
  }

  bindPropertiesSidebar() {
    if (this.togglePropertiesBtn && this.propertiesSidebar) {
      on(this.togglePropertiesBtn, 'click', (e) => {
        e.stopPropagation();
        this.propertiesSidebar.classList.toggle('is-open');
      });
    }

    if (this.closePropertiesBtn && this.propertiesSidebar) {
      on(this.closePropertiesBtn, 'click', (e) => {
        e.stopPropagation();
        this.propertiesSidebar.classList.remove('is-open');
      });
    }

    // Auto-close right sidebar on mobile when clicking outside
    on(document, 'click', (event) => {
      if (
        window.innerWidth < 768 &&
        this.propertiesSidebar &&
        this.propertiesSidebar.classList.contains('is-open') &&
        !this.propertiesSidebar.contains(event.target) &&
        (!this.togglePropertiesBtn || !this.togglePropertiesBtn.contains(event.target)) &&
        !event.target.closest('[data-editor-tool]')
      ) {
        this.propertiesSidebar.classList.remove('is-open');
      }
    });
  }

  switchTool(toolName) {
    this.activeTool = toolName;

    // Switch right inspector tool panels
    $$('[data-tool-panel]').forEach(panel => {
      if (panel.getAttribute('data-tool-panel') === toolName) {
        panel.classList.remove('d-none');
      } else {
        panel.classList.add('d-none');
      }
    });

    // Auto-slide open properties sidebar on mobile when switching tools
    if (window.innerWidth < 768 && this.propertiesSidebar) {
      this.propertiesSidebar.classList.add('is-open');
    }

    // Toggle draw layer interaction mode
    if (this.drawLayer) {
      if (toolName === 'inpaint' || toolName === 'content-remove') {
        this.drawLayer.classList.remove('pe-none');
        this.drawLayer.style.cursor = 'crosshair';
        this.syncDrawLayerSize();
      } else {
        this.drawLayer.classList.add('pe-none');
        this.drawLayer.style.cursor = 'default';
      }
    }

    if (toolName === 'crop') {
      if (this.canvasWrapper) this.canvasWrapper.style.cursor = 'crosshair';
    } else {
      if (this.canvasWrapper) this.canvasWrapper.style.cursor = 'default';
      this.resetCropOverlay();
    }
  }

  bindCropRotate() {
    const rotateCw = $('#btn-rotate-cw');
    const rotateCcw = $('#btn-rotate-ccw');
    const flipHBtn = $('#btn-flip-h');

    if (rotateCw) {
      on(rotateCw, 'click', () => {
        this.rotationAngle = (this.rotationAngle + 90) % 360;
        this.applyTransform();
        this.saveState();
      });
    }

    if (rotateCcw) {
      on(rotateCcw, 'click', () => {
        this.rotationAngle = (this.rotationAngle - 90 + 360) % 360;
        this.applyTransform();
        this.saveState();
      });
    }

    if (flipHBtn) {
      on(flipHBtn, 'click', () => {
        this.flipH = !this.flipH;
        this.applyTransform();
        this.saveState();
      });
    }

    const cropRatios = $$('[data-crop-ratio]');
    cropRatios.forEach(btn => {
      on(btn, 'click', (e) => {
        cropRatios.forEach(b => b.classList.remove('active', 'btn-primary'));
        e.currentTarget.classList.add('active');
        const ratio = e.currentTarget.getAttribute('data-crop-ratio');
        this.applyCropRatio(ratio);
        this.saveState();
      });
    });

    if (this.canvasWrapper && this.cropOverlay) {
      const handleMouseDown = (e) => {
        if (this.activeTool !== 'crop') return;
        e.preventDefault();
        
        const rect = this.canvasWrapper.getBoundingClientRect();
        this.isCropping = true;
        this.cropStartPos = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };

        this.cropOverlay.classList.remove('d-none');
        this.cropOverlay.style.left = `${this.cropStartPos.x}px`;
        this.cropOverlay.style.top = `${this.cropStartPos.y}px`;
        this.cropOverlay.style.width = '0px';
        this.cropOverlay.style.height = '0px';
        this.cropRect = null;
      };

      const handleMouseMove = (e) => {
        if (!this.isCropping || this.activeTool !== 'crop') return;

        const rect = this.canvasWrapper.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const left = Math.min(this.cropStartPos.x, currentX);
        const top = Math.min(this.cropStartPos.y, currentY);
        const width = Math.abs(currentX - this.cropStartPos.x);
        const height = Math.abs(currentY - this.cropStartPos.y);

        this.cropOverlay.style.left = `${left}px`;
        this.cropOverlay.style.top = `${top}px`;
        this.cropOverlay.style.width = `${width}px`;
        this.cropOverlay.style.height = `${height}px`;

        this.cropRect = { left, top, width, height };
      };

      const handleMouseUp = () => {
        if (this.isCropping) {
          this.isCropping = false;
        }
      };

      this.canvasWrapper.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    const applyCropBtn = $('#btn-apply-crop-selection');
    if (applyCropBtn) {
      on(applyCropBtn, 'click', () => this.applySelectedCrop());
    }

    const resetCropBtn = $('#btn-reset-crop-selection');
    if (resetCropBtn) {
      on(resetCropBtn, 'click', () => this.resetCropOverlay());
    }
  }

  applySelectedCrop() {
    if (!this.cropRect || !this.previewImg || this.cropRect.width < 5 || this.cropRect.height < 5) {
      alert('Please click and drag mouse across image to select a crop box area.');
      return;
    }

    const wrapperRect = this.canvasWrapper.getBoundingClientRect();
    const imgRect = this.previewImg.getBoundingClientRect();

    const natW = this.previewImg.naturalWidth || this.previewImg.width || 1200;
    const natH = this.previewImg.naturalHeight || this.previewImg.height || 800;

    const scaleX = natW / imgRect.width;
    const scaleY = natH / imgRect.height;

    const relLeft = Math.max(0, this.cropRect.left - (imgRect.left - wrapperRect.left));
    const relTop = Math.max(0, this.cropRect.top - (imgRect.top - wrapperRect.top));

    const cropX = Math.round(relLeft * scaleX);
    const cropY = Math.round(relTop * scaleY);
    const cropW = Math.round(Math.min(natW - cropX, this.cropRect.width * scaleX));
    const cropH = Math.round(Math.min(natH - cropY, this.cropRect.height * scaleY));

    if (cropW <= 0 || cropH <= 0) {
      alert('Invalid crop selection area.');
      return;
    }

    const renderCropResult = (imgElementToDraw) => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = cropW;
        canvas.height = cropH;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgElementToDraw, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

        const croppedDataUrl = canvas.toDataURL('image/png');
        this.resetCropOverlay();

        this.previewImg.onload = () => {
          this.updateDimensionsText();
          this.saveState();
          this.previewImg.onload = null;
        };
        this.previewImg.src = croppedDataUrl;
      } catch (err) {
        console.warn('Canvas export tainted or CORS blocked, rendering fallback SVG crop:', err);
        this.fallbackCropRender(cropX, cropY, cropW, cropH);
      }
    };

    if (this.previewImg.complete && this.previewImg.naturalWidth !== 0) {
      renderCropResult(this.previewImg);
    } else {
      const temp = new Image();
      temp.crossOrigin = 'anonymous';
      temp.onload = () => renderCropResult(temp);
      temp.onerror = () => this.fallbackCropRender(cropX, cropY, cropW, cropH);
      temp.src = this.previewImg.src;
    }
  }

  fallbackCropRender(cropX, cropY, cropW, cropH) {
    const titleEl = $('#active-project-name');
    const title = titleEl ? titleEl.textContent.toLowerCase() : '';
    let fallbackSrc = STOCK_IMAGES.cyberpunk;
    if (title.includes('portrait') || title.includes('vogue')) {
      fallbackSrc = STOCK_IMAGES.portrait;
    } else if (title.includes('arch')) {
      fallbackSrc = STOCK_IMAGES.architecture;
    }

    const tempImg = new Image();
    tempImg.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(tempImg, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      const dataUrl = canvas.toDataURL('image/png');
      this.resetCropOverlay();
      this.previewImg.src = dataUrl;
      this.updateDimensionsText();
      this.saveState();
    };
    tempImg.src = fallbackSrc;
  }

  resetCropOverlay() {
    this.cropRect = null;
    this.isCropping = false;
    if (this.cropOverlay) {
      this.cropOverlay.classList.add('d-none');
      this.cropOverlay.style.width = '0px';
      this.cropOverlay.style.height = '0px';
    }
  }

  applyCropRatio(ratio) {
    if (!this.canvasWrapper || !this.previewImg || !this.cropOverlay) return;

    // Switch active tool to crop mode
    this.activeTool = 'crop';
    const toolBtns = $$('[data-editor-tool]');
    toolBtns.forEach(b => b.classList.remove('active', 'bg-primary-container'));
    const cropToolBtn = $('[data-editor-tool="crop"]');
    if (cropToolBtn) cropToolBtn.classList.add('active', 'bg-primary-container');

    const wrapperRect = this.canvasWrapper.getBoundingClientRect();
    const imgRect = this.previewImg.getBoundingClientRect();

    if (imgRect.width < 10 || imgRect.height < 10) return;

    let targetRatio = 1;
    if (ratio === '16:9') targetRatio = 16 / 9;
    else if (ratio === '9:16') targetRatio = 9 / 16;
    else if (ratio === '1:1') targetRatio = 1;
    else targetRatio = (this.previewImg.naturalWidth || imgRect.width) / (this.previewImg.naturalHeight || imgRect.height);

    let cropW = imgRect.width * 0.85;
    let cropH = cropW / targetRatio;

    if (cropH > imgRect.height * 0.85) {
      cropH = imgRect.height * 0.85;
      cropW = cropH * targetRatio;
    }

    const imgOffsetLeft = imgRect.left - wrapperRect.left;
    const imgOffsetTop = imgRect.top - wrapperRect.top;
    const left = imgOffsetLeft + (imgRect.width - cropW) / 2;
    const top = imgOffsetTop + (imgRect.height - cropH) / 2;

    this.cropOverlay.classList.remove('d-none');
    this.cropOverlay.style.left = `${left}px`;
    this.cropOverlay.style.top = `${top}px`;
    this.cropOverlay.style.width = `${cropW}px`;
    this.cropOverlay.style.height = `${cropH}px`;

    this.cropRect = { left, top, width: cropW, height: cropH };
  }


  applyTransform() {
    if (this.previewImg) {
      const scaleX = this.flipH ? -1 : 1;
      this.previewImg.style.transform = `rotate(${this.rotationAngle}deg) scaleX(${scaleX})`;
    }
  }

  bindInpaintBrush() {
    const brushSlider = $('#slider-brush-size');
    const brushVal = $('#val-brush-size');

    if (brushSlider && brushVal) {
      on(brushSlider, 'input', (e) => {
        this.brushSize = parseInt(e.target.value, 10);
        brushVal.textContent = `${this.brushSize}px`;
      });
    }

    if (this.drawLayer) {
      const ctx = this.drawLayer.getContext('2d');

      const startDrawing = (e) => {
        if (this.activeTool !== 'inpaint' && this.activeTool !== 'content-remove') return;
        this.isDrawing = true;

        const isContentRemove = this.activeTool === 'content-remove';
        ctx.strokeStyle = isContentRemove ? 'rgba(255, 165, 0, 0.55)' : 'rgba(255, 75, 75, 0.6)';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = isContentRemove ? this.crBrushSize : this.brushSize;

        const rect = this.drawLayer.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.drawLayer.width / rect.width);
        const y = (e.clientY - rect.top) * (this.drawLayer.height / rect.height);

        ctx.beginPath();
        ctx.moveTo(x, y);
      };

      const draw = (e) => {
        if (!this.isDrawing || (this.activeTool !== 'inpaint' && this.activeTool !== 'content-remove')) return;
        const rect = this.drawLayer.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.drawLayer.width / rect.width);
        const y = (e.clientY - rect.top) * (this.drawLayer.height / rect.height);

        ctx.lineTo(x, y);
        ctx.stroke();
      };

      const stopDrawing = () => {
        if (this.isDrawing) {
          this.isDrawing = false;
          this.saveState();
        }
      };

      this.drawLayer.addEventListener('mousedown', startDrawing);
      this.drawLayer.addEventListener('mousemove', draw);
      this.drawLayer.addEventListener('mouseup', stopDrawing);
      this.drawLayer.addEventListener('mouseleave', stopDrawing);
    }

    const clearBtn = $('#btn-clear-mask');
    if (clearBtn) {
      on(clearBtn, 'click', () => {
        this.clearInpaintMask();
        this.saveState();
      });
    }

    const applyInpaintBtn = $('#btn-apply-inpaint');
    if (applyInpaintBtn) {
      on(applyInpaintBtn, 'click', () => {
        if (this.previewImg) {
          this.previewImg.style.opacity = '0.4';
          setTimeout(() => {
            this.previewImg.style.opacity = '1';
            this.clearInpaintMask();
            this.saveState();
          }, 600);
        }
      });
    }
  }

  clearInpaintMask() {
    if (this.drawLayer) {
      const ctx = this.drawLayer.getContext('2d');
      ctx.clearRect(0, 0, this.drawLayer.width, this.drawLayer.height);
    }
  }

  bindContentRemove() {
    const brushSlider = $('#slider-cr-brush-size');
    const brushVal = $('#val-cr-brush-size');

    if (brushSlider && brushVal) {
      on(brushSlider, 'input', (e) => {
        this.crBrushSize = parseInt(e.target.value, 10);
        brushVal.textContent = `${this.crBrushSize}px`;
      });
    }

    const clearBtn = $('#btn-clear-cr-mask');
    if (clearBtn) {
      on(clearBtn, 'click', () => {
        this.clearInpaintMask();
      });
    }

    const applyBtn = $('#btn-apply-content-remove');
    if (applyBtn) {
      on(applyBtn, 'click', () => this.applyContentRemove());
    }
  }

  async applyContentRemove() {
    if (!this.previewImg || !this.drawLayer) return;

    const statusEl = $('#cr-status-msg');
    const applyBtn = $('#btn-apply-content-remove');
    const showStatus = (msg) => {
      if (statusEl) {
        statusEl.textContent = msg;
        statusEl.classList.remove('d-none');
      }
    };

    if (applyBtn) {
      applyBtn.disabled = true;
      applyBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Processing...`;
    }
    showStatus('Analyzing mask...');

    // Give UI a tick to update
    await new Promise(r => setTimeout(r, 50));

    try {
      const natW = this.previewImg.naturalWidth || this.previewImg.width;
      const natH = this.previewImg.naturalHeight || this.previewImg.height;

      // 1. Render the current image onto a working canvas
      const workCanvas = document.createElement('canvas');
      workCanvas.width = natW;
      workCanvas.height = natH;
      const workCtx = workCanvas.getContext('2d', { willReadFrequently: true });

      // Apply filters
      const filterStr = this.previewImg.style.filter;
      if (filterStr && filterStr !== 'none') workCtx.filter = filterStr;
      workCtx.drawImage(this.previewImg, 0, 0, natW, natH);
      workCtx.filter = 'none';

      // 2. Get the mask from the draw layer
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = natW;
      maskCanvas.height = natH;
      const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
      maskCtx.drawImage(this.drawLayer, 0, 0, natW, natH);

      const maskData = maskCtx.getImageData(0, 0, natW, natH);
      const imgData = workCtx.getImageData(0, 0, natW, natH);

      // 3. Build boolean mask (any non-transparent pixel on draw layer = masked)
      const w = natW;
      const h = natH;
      const mask = new Uint8Array(w * h);
      let maskedCount = 0;
      for (let i = 0; i < w * h; i++) {
        if (maskData.data[i * 4 + 3] > 20) {
          mask[i] = 1;
          maskedCount++;
        }
      }

      if (maskedCount === 0) {
        showStatus('No area selected. Paint over content to remove.');
        if (applyBtn) {
          applyBtn.disabled = false;
          applyBtn.innerHTML = `<span class="material-symbols-outlined font-size-sm">healing</span> Remove Content`;
        }
        return;
      }

      showStatus(`Removing content (${maskedCount} pixels)...`);
      await new Promise(r => setTimeout(r, 30));

      const pixels = imgData.data;
      const originalPixels = new Uint8ClampedArray(pixels);

      // Create feathered mask
      const blurredMask = new Float32Array(w * h);
      for (let i = 0; i < w * h; i++) {
        blurredMask[i] = mask[i] ? 1.0 : 0.0;
      }

      const tempMask = new Float32Array(w * h);
      const blurRadius = 3;
      for (let pass = 0; pass < 2; pass++) {
        // Horizontal pass
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            let sum = 0;
            let count = 0;
            for (let dx = -blurRadius; dx <= blurRadius; dx++) {
              const nx = x + dx;
              if (nx >= 0 && nx < w) {
                sum += blurredMask[y * w + nx];
                count++;
              }
            }
            tempMask[y * w + x] = sum / count;
          }
        }
        // Vertical pass
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            let sum = 0;
            let count = 0;
            for (let dy = -blurRadius; dy <= blurRadius; dy++) {
              const ny = y + dy;
              if (ny >= 0 && ny < h) {
                sum += tempMask[ny * w + x];
                count++;
              }
            }
            blurredMask[y * w + x] = sum / count;
          }
        }
      }

      // Compute bounding box
      let minX = w, maxX = 0, minY = h, maxY = 0;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (mask[y * w + x]) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (maxX < minX || maxY < minY) {
        showStatus('No area selected. Paint over content to remove.');
        if (applyBtn) {
          applyBtn.disabled = false;
          applyBtn.innerHTML = `<span class="material-symbols-outlined font-size-sm">healing</span> Remove Content`;
        }
        return;
      }

      // Expand bounding box slightly for context
      const contextMargin = 15;
      minX = Math.max(0, minX - contextMargin);
      maxX = Math.min(w - 1, maxX + contextMargin);
      minY = Math.max(0, minY - contextMargin);
      maxY = Math.min(h - 1, maxY + contextMargin);

      const patchR = 4;
      const patchSize = patchR * 2 + 1;

      const filled = new Uint8Array(w * h);
      for (let i = 0; i < w * h; i++) {
        filled[i] = mask[i] ? 0 : 1;
      }

      // Collect candidate source coordinates in the surrounding unmasked search window
      const searchMargin = 150;
      const searchMinX = Math.max(patchR, minX - searchMargin);
      const searchMaxX = Math.min(w - 1 - patchR, maxX + searchMargin);
      const searchMinY = Math.max(patchR, minY - searchMargin);
      const searchMaxY = Math.min(h - 1 - patchR, maxY + searchMargin);

      const sourceCoords = [];
      const step = 2; // density sampling step
      for (let sy = searchMinY; sy <= searchMaxY; sy += step) {
        for (let sx = searchMinX; sx <= searchMaxX; sx += step) {
          let overlapsMask = false;
          for (let dy = -patchR; dy <= patchR; dy++) {
            for (let dx = -patchR; dx <= patchR; dx++) {
              if (mask[(sy + dy) * w + (sx + dx)]) {
                overlapsMask = true;
                break;
              }
            }
            if (overlapsMask) break;
          }
          if (!overlapsMask) {
            sourceCoords.push({ x: sx, y: sy });
          }
        }
      }

      // Global search fallback if search window yields too few patches
      if (sourceCoords.length < 50) {
        for (let sy = patchR; sy < h - patchR; sy += 8) {
          for (let sx = patchR; sx < w - patchR; sx += 8) {
            let overlapsMask = false;
            for (let dy = -patchR; dy <= patchR; dy++) {
              for (let dx = -patchR; dx <= patchR; dx++) {
                if (mask[(sy + dy) * w + (sx + dx)]) {
                  overlapsMask = true;
                  break;
                }
              }
              if (overlapsMask) break;
            }
            if (!overlapsMask) {
              sourceCoords.push({ x: sx, y: sy });
            }
          }
        }
      }

      let unfilledCount = maskedCount;
      let iterations = 0;
      const maxIterations = maskedCount * 2;

      while (unfilledCount > 0 && iterations < maxIterations) {
        iterations++;

        // Find boundary pixel with max filled neighbors
        let bestPx = -1, bestPy = -1;
        let maxFilledNeighbors = -1;

        for (let y = minY; y <= maxY; y++) {
          for (let x = minX; x <= maxX; x++) {
            const idx = y * w + x;
            if (filled[idx] === 1) continue;

            let filledNeighbors = 0;
            if (x > 0 && filled[idx - 1]) filledNeighbors++;
            if (x < w - 1 && filled[idx + 1]) filledNeighbors++;
            if (y > 0 && filled[idx - w]) filledNeighbors++;
            if (y < h - 1 && filled[idx + w]) filledNeighbors++;

            if (filledNeighbors > 0 && filledNeighbors > maxFilledNeighbors) {
              maxFilledNeighbors = filledNeighbors;
              bestPx = x;
              bestPy = y;
            }
          }
        }

        if (bestPx === -1) break;

        const px = bestPx;
        const py = bestPy;

        // Search for best matching source patch
        let bestSx = -1, bestSy = -1;
        let minSSD = Infinity;

        for (let i = 0; i < sourceCoords.length; i++) {
          const { x: sx, y: sy } = sourceCoords[i];

          let ssd = 0;
          let count = 0;

          for (let dy = -patchR; dy <= patchR; dy++) {
            const ty = py + dy;
            const sY = sy + dy;
            for (let dx = -patchR; dx <= patchR; dx++) {
              const tx = px + dx;
              const sX = sx + dx;

              const tIdx = ty * w + tx;
              if (filled[tIdx] === 1) {
                const sIdx = sY * w + sX;
                const tIdx4 = tIdx * 4;
                const sIdx4 = sIdx * 4;

                const dr = pixels[tIdx4] - pixels[sIdx4];
                const dg = pixels[tIdx4 + 1] - pixels[sIdx4 + 1];
                const db = pixels[tIdx4 + 2] - pixels[sIdx4 + 2];

                ssd += dr * dr + dg * dg + db * db;
                count++;
              }
            }
          }

          if (count > 0) {
            const normalizedSSD = ssd / count;
            if (normalizedSSD < minSSD) {
              minSSD = normalizedSSD;
              bestSx = sx;
              bestSy = sy;
            }
          }
        }

        // Copy texture patch
        if (bestSx !== -1) {
          for (let dy = -patchR; dy <= patchR; dy++) {
            const ty = py + dy;
            const sy = bestSy + dy;
            if (ty < 0 || ty >= h) continue;
            for (let dx = -patchR; dx <= patchR; dx++) {
              const tx = px + dx;
              const sx = bestSx + dx;
              if (tx < 0 || tx >= w) continue;

              const tIdx = ty * w + tx;
              if (filled[tIdx] === 0) {
                const sIdx = sy * w + sx;
                const tIdx4 = tIdx * 4;
                const sIdx4 = sIdx * 4;

                pixels[tIdx4] = pixels[sIdx4];
                pixels[tIdx4 + 1] = pixels[sIdx4 + 1];
                pixels[tIdx4 + 2] = pixels[sIdx4 + 2];
                pixels[tIdx4 + 3] = pixels[sIdx4 + 3];

                filled[tIdx] = 1;
                unfilledCount--;
              }
            }
          }
        } else {
          filled[py * w + px] = 1;
          unfilledCount--;
        }

        if (iterations % 40 === 0) {
          showStatus(`Reconstructing texture... ${Math.round((1 - unfilledCount / maskedCount) * 100)}%`);
          await new Promise(r => setTimeout(r, 1));
        }
      }

      showStatus('Blending edges...');
      await new Promise(r => setTimeout(r, 20));

      for (let idx = 0; idx < w * h; idx++) {
        const weight = blurredMask[idx];
        if (weight > 0.0 && weight < 1.0) {
          const idx4 = idx * 4;
          const rInpaint = pixels[idx4];
          const gInpaint = pixels[idx4 + 1];
          const bInpaint = pixels[idx4 + 2];

          const rOrig = originalPixels[idx4];
          const gOrig = originalPixels[idx4 + 1];
          const bOrig = originalPixels[idx4 + 2];

          pixels[idx4] = Math.round(rInpaint * weight + rOrig * (1.0 - weight));
          pixels[idx4 + 1] = Math.round(gInpaint * weight + gOrig * (1.0 - weight));
          pixels[idx4 + 2] = Math.round(bInpaint * weight + bOrig * (1.0 - weight));
        } else if (weight === 0.0) {
          const idx4 = idx * 4;
          pixels[idx4] = originalPixels[idx4];
          pixels[idx4 + 1] = originalPixels[idx4 + 1];
          pixels[idx4 + 2] = originalPixels[idx4 + 2];
          pixels[idx4 + 3] = originalPixels[idx4 + 3];
        }
      }

      // Write result back to preview image
      workCtx.putImageData(imgData, 0, 0);
      this.previewImg.src = workCanvas.toDataURL('image/png');

      // Clear the mask overlay
      this.clearInpaintMask();
      this.saveState();

      showStatus('Content removed successfully!');
      setTimeout(() => {
        if (statusEl) statusEl.classList.add('d-none');
      }, 2500);

    } catch (err) {
      console.error('Content Remove failed:', err);
      showStatus('Error: ' + err.message);
    }

    if (applyBtn) {
      applyBtn.disabled = false;
      applyBtn.innerHTML = `<span class="material-symbols-outlined font-size-sm">healing</span> Remove Content`;
    }
  }

  loadGoogleFont(fontName) {
    if (!fontName) return;
    const fontId = `google-font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;700&display=swap`;
      document.head.appendChild(link);
    }
  }

  bindTextOverlay() {
    const addTextBtn = $('#btn-add-text');
    const clearAllTextBtn = $('#btn-clear-all-text');
    const textInput = $('#text-input-content');
    const fontSizeSlider = $('#slider-font-size');
    const fontSizeVal = $('#val-font-size');
    const colorPicker = $('#text-color-picker');
    const colorHex = $('#text-color-hex');
    const bgToggle = $('#text-bg-toggle');
    const fontSearch = $('#font-search-input');
    const fontSelect = $('#font-family-select');

    if (fontSizeSlider && fontSizeVal) {
      on(fontSizeSlider, 'input', (e) => {
        fontSizeVal.textContent = `${e.target.value}px`;
      });
    }

    // Sync color picker <-> HEX text input (#000000)
    if (colorPicker && colorHex) {
      on(colorPicker, 'input', (e) => {
        colorHex.value = e.target.value;
      });

      on(colorHex, 'input', (e) => {
        let val = e.target.value.trim();
        if (val && !val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
          colorPicker.value = val;
        }
      });
    }

    // Real-time font search filter
    if (fontSearch && fontSelect) {
      on(fontSearch, 'input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const options = fontSelect.querySelectorAll('option');
        options.forEach(opt => {
          const text = opt.textContent.toLowerCase();
          if (!query || text.includes(query)) {
            opt.style.display = 'block';
          } else {
            opt.style.display = 'none';
          }
        });
      });
    }

    if (addTextBtn && textInput && this.textLayer) {
      on(addTextBtn, 'click', () => {
        const textStr = textInput.value.trim();
        if (!textStr) return;

        const fontPx = fontSizeSlider ? fontSizeSlider.value : 28;
        const textColor = colorPicker ? colorPicker.value : '#c4c0ff';
        const selectedFont = fontSelect ? fontSelect.value : 'Inter';
        const hasBackground = bgToggle ? bgToggle.checked : false;

        this.loadGoogleFont(selectedFont);

        const badge = document.createElement('div');
        badge.className = 'position-absolute user-select-none font-bold d-inline-flex align-items-center gap-2';
        badge.style.left = '50%';
        badge.style.top = '50%';
        badge.style.transform = 'translate(-50%, -50%)';
        badge.style.fontSize = `${fontPx}px`;
        badge.style.fontFamily = `"${selectedFont}", sans-serif`;
        badge.setAttribute('data-font-name', selectedFont);
        badge.style.color = textColor;
        badge.style.textShadow = hasBackground ? 'none' : '0 2px 8px rgba(0,0,0,0.8)';
        
        if (hasBackground) {
          badge.style.background = 'rgba(0, 0, 0, 0.75)';
          badge.style.padding = '0.4rem 0.8rem';
          badge.style.borderRadius = '0.375rem';
          badge.style.border = '1px solid rgba(255,255,255,0.2)';
        } else {
          badge.style.background = 'transparent';
          badge.style.padding = '0';
          badge.style.border = 'none';
        }

        badge.style.pointerEvents = 'auto';
        badge.style.cursor = 'move';
        
        badge.innerHTML = `
          <span class="text-content-span" title="Double click to edit text" style="font-family: '${selectedFont}', sans-serif; outline: none;">${textStr}</span>
          <button type="button" class="btn-close btn-close-white p-1 font-size-xs bg-danger rounded-circle text-delete-btn" style="width: 14px; height: 14px; font-size: 8px; cursor: pointer;" title="Delete Text"></button>
        `;

        const textSpan = badge.querySelector('.text-content-span');
        const delBtn = badge.querySelector('.text-delete-btn');

        // Inline double-click editing after placing
        if (textSpan) {
          textSpan.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            textSpan.contentEditable = 'true';
            textSpan.focus();

            const range = document.createRange();
            range.selectNodeContents(textSpan);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          });

          textSpan.addEventListener('blur', () => {
            textSpan.contentEditable = 'false';
            this.saveState();
          });

          textSpan.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              textSpan.blur();
            }
          });
        }

        if (delBtn) {
          delBtn.addEventListener('mousedown', (e) => e.stopPropagation());
          delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            badge.remove();
            this.saveState();
          });
        }

        // Drag element on canvas
        let isDragging = false;
        let startX, startY, origLeft, origTop;

        badge.addEventListener('mousedown', (e) => {
          if (e.target.closest('.text-delete-btn') || e.target.contentEditable === 'true') return;
          e.stopPropagation();
          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          origLeft = badge.offsetLeft;
          origTop = badge.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
          if (!isDragging) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          badge.style.left = `${origLeft + dx}px`;
          badge.style.top = `${origTop + dy}px`;
          badge.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
          if (isDragging) {
            isDragging = false;
            this.saveState();
          }
        });

        this.textLayer.appendChild(badge);
        this.saveState();
      });
    }

    if (clearAllTextBtn && this.textLayer) {
      on(clearAllTextBtn, 'click', () => {
        this.textLayer.innerHTML = '';
        this.saveState();
      });
    }
  }




  bindAiActions() {
    const autoEnhance = $('#btn-ai-enhance');
    const bgRemove = $('#btn-ai-bg-remove');

    if (autoEnhance) {
      on(autoEnhance, 'click', () => {
        this.filters.contrast = 120;
        this.filters.saturate = 135;
        this.filters.brightness = 105;
        this.applyFilters();

        // Sync slider UI to reflect new filter values
        const contrastSlider = $('#slider-contrast');
        const saturateSlider = $('#slider-saturate');
        const brightnessSlider = $('#slider-brightness');
        if (contrastSlider) contrastSlider.value = 120;
        if (saturateSlider) saturateSlider.value = 135;
        if (brightnessSlider) brightnessSlider.value = 105;
        $('#val-contrast') && ($('#val-contrast').textContent = '120%');
        $('#val-saturate') && ($('#val-saturate').textContent = '135%');
        $('#val-brightness') && ($('#val-brightness').textContent = '105%');

        this.saveState();
      });
    }


    if (bgRemove) {
      on(bgRemove, 'click', () => {
        this.switchTool('bg-remove');
        this.removeBackground();
      });
    }

    this.bindBgRemoveTool();
  }

  bindBgRemoveTool() {
    const doBgRemoveBtn = $('#btn-do-bg-remove');
    const dlTransparentBtn = $('#btn-download-transparent-png');
    const bgOptBtns = $$('.bg-opt-btn');

    if (doBgRemoveBtn) {
      on(doBgRemoveBtn, 'click', () => this.removeBackground());
    }

    if (dlTransparentBtn) {
      on(dlTransparentBtn, 'click', () => this.downloadTransparentPng());
    }

    bgOptBtns.forEach(btn => {
      on(btn, 'click', (e) => {
        bgOptBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
        e.currentTarget.classList.add('active');
        const opt = e.currentTarget.getAttribute('data-bg-opt');
        this.applyBgStyleOption(opt);
      });
    });
  }

  async removeBackground() {
    if (!this.previewImg) return;

    const doBgRemoveBtn = $('#btn-do-bg-remove');
    if (doBgRemoveBtn) {
      doBgRemoveBtn.disabled = true;
      doBgRemoveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span> Identifying Subject & Removing Background...`;
    }

    const natW = this.previewImg.naturalWidth || this.previewImg.width || 1200;
    const natH = this.previewImg.naturalHeight || this.previewImg.height || 800;

    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = natW;
    srcCanvas.height = natH;
    const srcCtx = srcCanvas.getContext('2d');
    srcCtx.drawImage(this.previewImg, 0, 0, natW, natH);

    // 1. Try AI Human Subject Segmentation (MediaPipe AI)
    if (window.SelfieSegmentation) {
      try {
        const selfieSegmentation = new window.SelfieSegmentation({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
        });

        selfieSegmentation.setOptions({ modelSelection: 1 });

        selfieSegmentation.onResults((results) => {
          const outCanvas = document.createElement('canvas');
          outCanvas.width = natW;
          outCanvas.height = natH;
          const outCtx = outCanvas.getContext('2d');

          // Draw segmentation mask (human subject = white, background = black)
          outCtx.clearRect(0, 0, natW, natH);
          outCtx.drawImage(results.segmentationMask, 0, 0, natW, natH);

          // Clip to preserve 100% of human subject
          outCtx.globalCompositeOperation = 'source-in';
          outCtx.drawImage(srcCanvas, 0, 0, natW, natH);

          const transparentDataUrl = outCanvas.toDataURL('image/png');
          this.applyBackgroundRemovalResult(transparentDataUrl, doBgRemoveBtn);
        });

        await selfieSegmentation.send({ image: srcCanvas });
        return;
      } catch (err) {
        console.warn('AI MediaPipe segmentation fallback to Saliency Subject model:', err);
      }
    }

    // 2. Fallback: Smart Subject-Centrality Saliency Model (Protects 100% of Human Subject)
    this.removeBackgroundSaliency(srcCanvas, natW, natH, doBgRemoveBtn);
  }

  removeBackgroundSaliency(srcCanvas, natW, natH, doBgRemoveBtn) {
    const srcCtx = srcCanvas.getContext('2d');
    const imgData = srcCtx.getImageData(0, 0, natW, natH);
    const data = imgData.data;

    // Sample border background colors ONLY from outermost 5% edge perimeter
    const borderSamples = [];
    for (let x = 0; x < natW; x += 12) {
      let idx = (0 * natW + x) * 4;
      borderSamples.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
      idx = ((natH - 1) * natW + x) * 4;
      borderSamples.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
    }

    for (let y = 0; y < natH; y += 12) {
      let idx = (y * natW + 0) * 4;
      borderSamples.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
      idx = (y * natW + (natW - 1)) * 4;
      borderSamples.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
    }

    // Subject protection zone (central 70% width x 84% height)
    const subjMinX = natW * 0.15;
    const subjMaxX = natW * 0.85;
    const subjMinY = natH * 0.08;
    const subjMaxY = natH * 0.92;

    for (let y = 0; y < natH; y++) {
      for (let x = 0; x < natW; x++) {
        const i = (y * natW + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        let minDiff = 999;
        borderSamples.forEach(s => {
          const d = Math.sqrt(Math.pow(r - s.r, 2) + Math.pow(g - s.g, 2) + Math.pow(b - s.b, 2));
          if (d < minDiff) minDiff = d;
        });

        const isInSubjectZone = (x >= subjMinX && x <= subjMaxX && y >= subjMinY && y <= subjMaxY);

        if (isInSubjectZone) {
          // Inside human subject zone: PROTECT SUBJECT 100%
          if (minDiff < 18) {
            data[i + 3] = 40; // Soft edge transparent
          } else {
            data[i + 3] = 255; // 100% Opaque subject (skin, hair, clothes, body)
          }
        } else {
          // Outer background perimeter: Erase background
          if (minDiff < 45) {
            data[i + 3] = 0; // 100% Transparent
          } else if (minDiff < 85) {
            data[i + 3] = Math.round(((minDiff - 45) / 40) * 255);
          }
        }
      }
    }

    const outCanvas = document.createElement('canvas');
    outCanvas.width = natW;
    outCanvas.height = natH;
    const outCtx = outCanvas.getContext('2d');
    outCtx.putImageData(imgData, 0, 0);

    const transparentDataUrl = outCanvas.toDataURL('image/png');
    this.applyBackgroundRemovalResult(transparentDataUrl, doBgRemoveBtn);
  }

  applyBackgroundRemovalResult(transparentDataUrl, doBgRemoveBtn) {
    this.previewImg.onload = () => {
      this.updateDimensionsText();
      this.saveState();
      this.previewImg.onload = null;
    };

    this.previewImg.src = transparentDataUrl;
    this.rawTransparentSrc = transparentDataUrl;

    if (this.canvasWrapper) {
      this.canvasWrapper.style.backgroundImage = 'repeating-conic-gradient(#2c2d3f 0% 25%, #191a27 0% 50%)';
      this.canvasWrapper.style.backgroundSize = '20px 20px';
    }

    if (doBgRemoveBtn) {
      doBgRemoveBtn.disabled = false;
      doBgRemoveBtn.classList.remove('btn-pixelforge-primary');
      doBgRemoveBtn.classList.add('btn-outline-light');
      doBgRemoveBtn.innerHTML = `<span class="material-symbols-outlined font-size-sm text-success me-1">check_circle</span> Subject Isolated & Background Removed!`;
    }

    const dlTransparentBtn = $('#btn-download-transparent-png');
    if (dlTransparentBtn) {
      dlTransparentBtn.classList.remove('d-none');
    }
  }

  downloadTransparentPng() {
    const srcToDownload = this.rawTransparentSrc || (this.previewImg ? this.previewImg.src : null);
    if (!srcToDownload) {
      alert('No image ready to download.');
      return;
    }

    const titleEl = $('#active-project-name');
    const title = titleEl ? titleEl.textContent.trim().replace(/\s+/g, '_') : 'pixedit_removed_bg';

    const a = document.createElement('a');
    a.href = srcToDownload;
    a.download = `${title}_transparent.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  applyBgStyleOption(option) {
    if (!this.rawTransparentSrc || !this.previewImg) return;

    if (option === 'transparent') {
      this.previewImg.src = this.rawTransparentSrc;
      if (this.canvasWrapper) {
        this.canvasWrapper.style.backgroundImage = 'repeating-conic-gradient(#2c2d3f 0% 25%, #191a27 0% 50%)';
        this.canvasWrapper.style.backgroundSize = '20px 20px';
      }
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (option === 'white') {
        ctx.fillStyle = '#ffffff';
      } else if (option === 'dark') {
        ctx.fillStyle = '#121218';
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      this.previewImg.src = canvas.toDataURL('image/png');
      if (this.canvasWrapper) {
        this.canvasWrapper.style.backgroundImage = 'none';
      }
    };
    img.src = this.rawTransparentSrc;
  }

  bindSaveToGallery() {
    const btn = $('#btn-save-to-gallery');
    if (!btn) return;

    on(btn, 'click', () => this.saveToGallery());
  }

  async saveToGallery() {
    if (!this.previewImg) return;

    const btn = $('#btn-save-to-gallery');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Saving...`;
    }

    try {
      const natW = this.previewImg.naturalWidth || this.previewImg.width || 1200;
      const natH = this.previewImg.naturalHeight || this.previewImg.height || 800;

      const canvas = document.createElement('canvas');
      canvas.width = natW;
      canvas.height = natH;
      const ctx = canvas.getContext('2d');

      // Apply current rotation/flip
      ctx.save();
      ctx.translate(natW / 2, natH / 2);
      ctx.rotate((this.rotationAngle * Math.PI) / 180);
      ctx.scale(this.flipH ? -1 : 1, 1);

      // Apply current CSS filters
      const filterStr = this.previewImg.style.filter;
      if (filterStr && filterStr !== 'none') {
        ctx.filter = filterStr;
      }

      ctx.drawImage(this.previewImg, -natW / 2, -natH / 2, natW, natH);
      ctx.restore();

      const dataUrl = canvas.toDataURL('image/png');

      const titleEl = $('#active-project-name');
      const title = titleEl ? titleEl.textContent.trim() : 'Untitled Edit';

      await galleryDb.save({
        title: title,
        imgDataUrl: dataUrl,
        tags: 'Edited',
        width: natW,
        height: natH
      });

      // Show success toast
      this.showSaveToast('Saved to Gallery!');

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span class="material-symbols-outlined font-size-sm">check_circle</span> Saved!`;
        setTimeout(() => {
          btn.innerHTML = `<span class="material-symbols-outlined font-size-sm">save</span> Save to Gallery`;
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to save to gallery:', err);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span class="material-symbols-outlined font-size-sm">save</span> Save to Gallery`;
      }
    }
  }

  showSaveToast(message) {
    let toast = document.getElementById('pixedit-save-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'pixedit-save-toast';
      toast.style.cssText = `
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(80px);
        background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff;
        padding: 12px 28px; border-radius: 12px; font-weight: 600; font-size: 14px;
        z-index: 99999; box-shadow: 0 8px 32px rgba(34,197,94,0.35);
        display: flex; align-items: center; gap: 8px;
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
        opacity: 0;
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="material-symbols-outlined" style="font-size: 20px;">check_circle</span> ${message}`;
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity = '1';
    });
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(80px)';
      toast.style.opacity = '0';
    }, 2500);
  }
}
