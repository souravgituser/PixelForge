/**
 * PixelForge AI Editor - Export & File Download Controller Module
 */

import { $, on } from './helper.js';

export class ExportController {
  constructor() {
    this.formatSelect = $('#export-format-select');
    this.qualitySelect = $('#export-quality-select');
    this.downloadBtn = $('#export-download-btn');
    this.driveBtn = $('#export-drive-btn');
  }

  init() {
    if (!this.downloadBtn) return;

    on(this.downloadBtn, 'click', (e) => {
      e.preventDefault();
      this.handleExport(false);
    });

    if (this.driveBtn) {
      on(this.driveBtn, 'click', (e) => {
        e.preventDefault();
        this.handleExport(true);
      });
    }

    console.log('Export Controller initialized.');
  }

  handleExport(isDriveUpload = false) {
    const format = this.formatSelect ? this.formatSelect.value : 'webp';
    const quality = this.qualitySelect ? this.qualitySelect.value : 'original';

    // Locate primary target image element
    const imgElement = $('#editor-image-preview') || $('#ai-output-image') || $('.project-card img') || $('img');

    if (!imgElement || !imgElement.src) {
      alert('No active canvas image found to export.');
      return;
    }

    const srcUrl = imgElement.src;
    const isDataOrBlob = srcUrl.startsWith('data:') || srcUrl.startsWith('blob:');

    const tempImg = new Image();
    if (!isDataOrBlob) {
      tempImg.crossOrigin = 'anonymous';
    }

    tempImg.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const origWidth = tempImg.naturalWidth || tempImg.width || 1920;
        const origHeight = tempImg.naturalHeight || tempImg.height || 1080;
        const aspectRatio = origWidth / origHeight;

        let width = origWidth;
        let height = origHeight;

        // Proportional aspect-ratio scaling
        if (quality === '4k') {
          const maxDim = 3840;
          if (origWidth >= origHeight) {
            width = Math.max(origWidth, maxDim);
            height = Math.round(width / aspectRatio);
          } else {
            height = Math.max(origHeight, maxDim);
            width = Math.round(height * aspectRatio);
          }
        } else if (quality === '8k') {
          const maxDim = 7680;
          if (origWidth >= origHeight) {
            width = Math.max(origWidth, maxDim);
            height = Math.round(width / aspectRatio);
          } else {
            height = Math.max(origHeight, maxDim);
            width = Math.round(height * aspectRatio);
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Retrieve active rotation & flip state from editor controller if present
        let rotation = 0;
        let scaleX = 1;
        if (window.PixelForgeApp && window.PixelForgeApp.editor) {
          rotation = window.PixelForgeApp.editor.rotationAngle || 0;
          scaleX = window.PixelForgeApp.editor.flipH ? -1 : 1;
        }

        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scaleX, 1);

        if (imgElement.style && imgElement.style.filter && imgElement.style.filter !== 'none') {
          ctx.filter = imgElement.style.filter;
        }

        if (rotation === 90 || rotation === 270) {
          ctx.drawImage(tempImg, -height / 2, -width / 2, height, width);
        } else {
          ctx.drawImage(tempImg, -width / 2, -height / 2, width, height);
        }
        ctx.restore();

        // Overlay inpaint draw layer if present
        const drawLayer = $('#canvas-draw-layer');
        if (drawLayer && drawLayer.width && drawLayer.height) {
          ctx.drawImage(drawLayer, 0, 0, width, height);
        }

        // Render text overlay badges onto canvas
        const textLayer = $('#canvas-text-layer');
        if (textLayer && imgElement.getBoundingClientRect) {
          const textBadges = textLayer.querySelectorAll('div');
          const imgRect = imgElement.getBoundingClientRect();

          textBadges.forEach(badge => {
            const textSpan = badge.querySelector('.text-content-span');
            const text = textSpan ? textSpan.textContent : badge.textContent;
            const fontPx = parseFloat(badge.style.fontSize) || 28;

            const textColor = badge.style.color || '#ffffff';

            const badgeRect = badge.getBoundingClientRect();
            const relX = (badgeRect.left - imgRect.left) * (width / (imgRect.width || width));
            const relY = (badgeRect.top - imgRect.top) * (height / (imgRect.height || height));

            const fontName = badge.getAttribute('data-font-name') || 'Inter';

            ctx.save();
            ctx.font = `bold ${Math.round(fontPx * (width / (imgRect.width || width)))}px "${fontName}", sans-serif`;
            ctx.fillStyle = textColor;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 8;
            ctx.fillText(text, relX, relY + (fontPx * 0.8));
            ctx.restore();

          });
        }

        let mimeType = 'image/webp';
        let ext = 'webp';
        if (format === 'png') {
          mimeType = 'image/png';
          ext = 'png';
        } else if (format === 'jpg' || format === 'jpeg') {
          mimeType = 'image/jpeg';
          ext = 'jpg';
        }

        if (isDriveUpload) {
          this.uploadToDrive(canvas, ext);
        } else {
          const dataUrl = canvas.toDataURL(mimeType, 0.95);
          this.downloadDataUrl(dataUrl, ext);
          this.closeModal();
        }
      } catch (err) {
        console.warn('Canvas export tainted by cross-origin resource. Falling back to blob download.', err);
        if (isDriveUpload) {
          this.uploadFallbackToDrive(srcUrl, format);
        } else {
          this.fallbackBlobDownload(srcUrl, format);
          this.closeModal();
        }
      }
    };

    tempImg.onerror = () => {
      console.warn('Image failed to load in memory for canvas. Falling back to direct download.');
      this.fallbackBlobDownload(srcUrl, format);
      this.closeModal();
    };

    tempImg.src = srcUrl;
  }

  downloadDataUrl(dataUrl, ext) {
    const link = document.createElement('a');
    link.download = `pixelforge-export-${Date.now()}.${ext}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  fallbackBlobDownload(url, ext) {
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `pixelforge-render-${Date.now()}.${ext || 'png'}`;
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      })
      .catch(() => {
        const link = document.createElement('a');
        link.download = `pixelforge-render-${Date.now()}.${ext || 'png'}`;
        link.href = url;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }

  closeModal() {
    if (window.PixelForgeApp && window.PixelForgeApp.modal) {
      window.PixelForgeApp.modal.closeActive();
    }
  }

  async uploadToDrive(canvas, ext) {
    const firebase = window.PixelForgeApp?.firebase;
    const drive = window.PixelForgeApp?.drive;

    if (!firebase || !firebase.getCurrentUser()) {
      alert("Please sign in with Google first using the button in the header.");
      return;
    }

    const token = firebase.getAccessToken();
    if (!token) {
      alert("Active Google Sign-In session not found. Please log out and sign in again.");
      return;
    }

    const originalText = this.driveBtn.innerHTML;
    try {
      this.driveBtn.disabled = true;
      this.driveBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="width: 12px; height: 12px; margin-right: 4px; border-width: 2px;"></span>
        Uploading...
      `;

      let mimeType = 'image/webp';
      if (ext === 'png') mimeType = 'image/png';
      else if (ext === 'jpg') mimeType = 'image/jpeg';

      const blob = await new Promise(resolve => canvas.toBlob(resolve, mimeType, 0.95));
      const fileName = `PixelForge_Edit_${Date.now()}.${ext}`;

      await drive.uploadFile(blob, fileName, token);
      alert(`Success! File "${fileName}" has been saved to your Google Drive.`);
      this.closeModal();
    } catch (error) {
      console.error("Drive upload failed:", error);
      alert(`Failed to save to Google Drive: ${error.message}`);
    } finally {
      this.driveBtn.disabled = false;
      this.driveBtn.innerHTML = originalText;
    }
  }

  async uploadFallbackToDrive(srcUrl, format) {
    const firebase = window.PixelForgeApp?.firebase;
    const drive = window.PixelForgeApp?.drive;

    if (!firebase || !firebase.getCurrentUser()) {
      alert("Please sign in with Google first.");
      return;
    }

    const token = firebase.getAccessToken();
    if (!token) {
      alert("Active Google session not found. Please re-authenticate.");
      return;
    }

    const originalText = this.driveBtn.innerHTML;
    try {
      this.driveBtn.disabled = true;
      this.driveBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="width: 12px; height: 12px; margin-right: 4px; border-width: 2px;"></span>
        Uploading...
      `;

      const res = await fetch(srcUrl);
      const blob = await res.blob();
      const ext = format === 'png' ? 'png' : (format === 'jpg' ? 'jpg' : 'webp');
      const fileName = `PixelForge_Edit_${Date.now()}.${ext}`;

      await drive.uploadFile(blob, fileName, token);
      alert(`Success! File "${fileName}" has been saved to your Google Drive.`);
      this.closeModal();
    } catch (error) {
      console.error("Drive fallback upload failed:", error);
      alert(`Failed to save to Google Drive: ${error.message}`);
    } finally {
      this.driveBtn.disabled = false;
      this.driveBtn.innerHTML = originalText;
    }
  }
}
