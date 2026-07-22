/**
 * PixelForge AI Editor - Gallery IndexedDB Persistence Module
 * Stores edited images locally in the browser so they persist across sessions.
 */

const DB_NAME = 'pixelforge_gallery';
const DB_VERSION = 1;
const STORE_NAME = 'gallery_items';

class GalleryDB {
  constructor() {
    this.db = null;
  }

  /**
   * Open (or create) the IndexedDB database.
   * Returns a promise that resolves when the DB is ready.
   */
  open() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('title', 'title', { unique: false });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = (e) => {
        console.error('GalleryDB: Failed to open IndexedDB', e);
        reject(e);
      };
    });
  }

  /**
   * Save an edited image to the gallery.
   * @param {Object} item - { title, imgDataUrl, tags, width, height }
   * @returns {Promise<number>} The auto-generated ID of the saved item.
   */
  async save(item) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      const record = {
        title: item.title || 'Untitled Edit',
        imgDataUrl: item.imgDataUrl,
        tags: item.tags || 'Edited',
        width: item.width || 0,
        height: item.height || 0,
        timestamp: Date.now()
      };

      const request = store.add(record);

      request.onsuccess = () => {
        console.log('GalleryDB: Image saved to gallery, id:', request.result);
        resolve(request.result);
      };
      request.onerror = (e) => {
        console.error('GalleryDB: Failed to save image', e);
        reject(e);
      };
    });
  }

  /**
   * Load all saved gallery items, newest first.
   * @returns {Promise<Array>} Array of saved items.
   */
  async getAll() {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result || [];
        // Sort newest first
        items.sort((a, b) => b.timestamp - a.timestamp);
        resolve(items);
      };
      request.onerror = (e) => {
        console.error('GalleryDB: Failed to load gallery', e);
        reject(e);
      };
    });
  }

  /**
   * Delete a saved item by ID.
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log('GalleryDB: Deleted item', id);
        resolve();
      };
      request.onerror = (e) => {
        console.error('GalleryDB: Failed to delete item', e);
        reject(e);
      };
    });
  }
}

// Export a singleton instance
export const galleryDb = new GalleryDB();
