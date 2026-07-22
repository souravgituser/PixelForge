/**
 * PixelForge AI Editor - Base Component Class
 */

export class BaseComponent {
  constructor(element) {
    if (!element) {
      throw new Error('Component initialization requires a target DOM element.');
    }
    this.element = element;
  }

  render() {
    // Abstract method to be overridden by child UI components
  }

  destroy() {
    // Clean up event listeners or references
  }
}
