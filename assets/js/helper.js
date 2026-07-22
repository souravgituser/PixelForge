/**
 * PixelForge AI Editor - ES6 Utility Helpers
 */

/**
 * Select single DOM element
 * @param {string} selector 
 * @param {Element} [context=document] 
 * @returns {Element|null}
 */
export const $ = (selector, context = document) => context.querySelector(selector);

/**
 * Select multiple DOM elements as Array
 * @param {string} selector 
 * @param {Element} [context=document] 
 * @returns {Array<Element>}
 */
export const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

/**
 * Add event listener to element or elements
 * @param {Element|Array<Element>|string} target 
 * @param {string} event 
 * @param {Function} handler 
 */
export const on = (target, event, handler) => {
  if (typeof target === 'string') {
    $$(target).forEach(el => el.addEventListener(event, handler));
  } else if (Array.isArray(target) || target instanceof NodeList) {
    target.forEach(el => el.addEventListener(event, handler));
  } else if (target && target.addEventListener) {
    target.addEventListener(event, handler);
  }
};

import { STOCK_IMAGES } from './stock-images.js';

/**
 * Initialize global image error handler for offline / missing asset fallbacks
 */
export const initImageFallbacks = () => {
  document.addEventListener('error', (e) => {
    if (e.target && e.target.tagName === 'IMG') {
      const img = e.target;
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = 'true';
      
      const altText = (img.alt || '').toLowerCase();
      if (altText.includes('avatar') || altText.includes('profile')) {
        img.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%236c63ff"/><circle cx="50" cy="40" r="20" fill="%23ffffff"/><path d="M 20 85 C 20 65 35 55 50 55 C 65 55 80 65 80 85 Z" fill="%23ffffff"/></svg>`;
      } else if (altText.includes('vogue') || altText.includes('portrait')) {
        img.src = STOCK_IMAGES.portrait;
      } else if (altText.includes('arch') || altText.includes('building')) {
        img.src = STOCK_IMAGES.architecture;
      } else {
        img.src = STOCK_IMAGES.cyberpunk;
      }
    }
  }, true);
};

/**
 * Initialize lazy loading for images with data-src or native lazy loading
 */
export const initLazyLoading = () => {
  const lazyImages = $$('img[data-src]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          image.removeAttribute('data-src');
          observer.unobserve(image);
        }
      });
    });
    lazyImages.forEach(image => imageObserver.observe(image));
  } else {
    lazyImages.forEach(image => {
      image.src = image.dataset.src;
      image.removeAttribute('data-src');
    });
  }
};

