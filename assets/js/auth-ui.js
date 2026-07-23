/**
 * PixelForge AI Editor - Authentication User Interface Controller
 */

import { $, on } from './helper.js';

export class AuthUIController {
  constructor(firebaseService) {
    this.firebase = firebaseService;
    this.container = $('#auth-container');
  }

  init() {
    this.container = $('#auth-container');
    if (!this.container) {
      console.warn("Auth container '#auth-container' not found on this page.");
      return;
    }

    if (!this.firebase) {
      console.error("FirebaseService not provided to AuthUIController.");
      return;
    }

    // Initial render
    this.render(this.firebase.getCurrentUser());

    // Observe auth state changes to dynamically render UI
    this.firebase.onAuthStateChanged((user) => {
      this.render(user);
    });
  }

  render(user) {
    if (!this.container) return;

    if (user) {
      // User is logged in: render profile dropdown
      this.container.innerHTML = `
        <div class="position-relative" style="z-index: 1100;">
          <button class="btn-icon p-0 rounded-circle overflow-hidden border border-subtle hover-lift d-flex align-items-center justify-content-center" data-dropdown-toggle="auth-menu" aria-haspopup="true" aria-expanded="false" style="width: 32px; height: 32px;">
            <img src="${user.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}" alt="${user.displayName}" class="w-100 h-100 object-fit-cover" referrerpolicy="no-referrer" />
          </button>
          <div class="dropdown-menu-custom position-absolute end-0 bg-dark border border-secondary rounded-lg shadow-lg mt-2 p-2" id="auth-menu" style="min-width: 200px;">
            <div class="px-3 py-2 border-bottom border-secondary/20 mb-2">
              <p class="font-label-md text-on-surface-color font-bold mb-0 text-truncate" style="font-size: 13px;">${user.displayName}</p>
              <p class="font-label-sm text-on-surface-variant-color mb-0 text-truncate" style="font-size: 11px;">${user.email}</p>
            </div>
            <button class="dropdown-item d-flex align-items-center gap-2 py-2 text-danger w-100 text-start border-0 bg-transparent rounded" id="auth-logout-btn">
              <span class="material-symbols-outlined font-size-sm">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      `;

      // Bind Sign Out action
      const logoutBtn = $('#auth-logout-btn');
      if (logoutBtn) {
        on(logoutBtn, 'click', async (e) => {
          e.preventDefault();
          try {
            await this.firebase.logout();
            window.location.reload(); // Refresh to clean state
          } catch (err) {
            console.error("Sign out failed:", err);
          }
        });
      }
    } else {
      // User is logged out: render Google Sign-In button
      this.container.innerHTML = `
        <button class="btn btn-sm btn-pixelforge-variant d-inline-flex align-items-center gap-2" id="auth-login-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 2px;">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.87-4.53-5.84-4.53z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Sign In
        </button>
      `;

      // Bind Sign In action
      const loginBtn = $('#auth-login-btn');
      if (loginBtn) {
        on(loginBtn, 'click', async (e) => {
          e.preventDefault();
          try {
            await this.firebase.login();
          } catch (err) {
            console.error("Sign in failed:", err);
          }
        });
      }
    }

    // Sync Storage widget & Settings page profile input fields
    this.updateStorageWidget(user);
    this.updateSettingsProfile(user);
  }

  async updateStorageWidget(user) {
    const widget = document.getElementById('storage-widget');
    if (!widget) return;

    if (!user) {
      widget.style.display = 'none';
      return;
    }

    const percentText = document.getElementById('storage-percent-text');
    const progressFill = document.getElementById('storage-progress-fill');
    const usageText = document.getElementById('storage-usage-text');

    const token = this.firebase.getAccessToken();
    const drive = window.PixelForgeApp?.drive;

    if (!token || !drive) {
      widget.style.display = 'none';
      return;
    }

    try {
      widget.style.display = 'block';
      if (usageText) usageText.textContent = "Calculating storage usage...";

      const quota = await drive.getStorageDetails(token);
      
      const usageGB = (quota.usage / (1024 * 1024 * 1024)).toFixed(2);
      const limitGB = (quota.limit / (1024 * 1024 * 1024)).toFixed(0);
      const percent = Math.min(100, Math.round((quota.usage / quota.limit) * 100));

      if (percentText) percentText.textContent = `${percent}% Full`;
      if (progressFill) progressFill.style.width = `${percent}%`;
      if (usageText) usageText.textContent = `${usageGB} GB of ${limitGB} GB used`;
    } catch (error) {
      console.error("Failed to update storage widget:", error);
      if (usageText) usageText.textContent = "Unavailable";
    }
  }

  updateSettingsProfile(user) {
    const settingsName = document.getElementById('settings-profile-name');
    const settingsEmail = document.getElementById('settings-profile-email');

    if (settingsName && settingsEmail) {
      if (user) {
        settingsName.value = user.displayName || '';
        settingsEmail.value = user.email || '';
      } else {
        settingsName.value = 'Guest User';
        settingsEmail.value = 'Not signed in';
      }
    }
  }
}
