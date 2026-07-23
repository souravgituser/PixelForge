/**
 * PixelForge AI Editor - Firebase Service Module
 * Handles initialization, authentication, and database synchronization.
 */

import { firebaseConfig } from './firebase-config.js';

// CDN versions of Firebase SDK modules
const FIREBASE_APP_SDK = "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
const FIREBASE_AUTH_SDK = "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
const FIREBASE_FIRESTORE_SDK = "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export class FirebaseService {
  constructor() {
    this.app = null;
    this.auth = null;
    this.db = null;
    this.isReady = false;
    this.authModules = null;
    this.firestoreModules = null;
  }

  // Check if Firebase configuration has been populated
  isConfigured() {
    return firebaseConfig && 
           firebaseConfig.apiKey && 
           firebaseConfig.apiKey !== "YOUR_API_KEY" && 
           firebaseConfig.projectId !== "YOUR_PROJECT_ID";
  }

  async init() {
    if (!this.isConfigured()) {
      console.warn("Firebase configuration has not been set up yet. Please configure assets/js/firebase-config.js. Google Auth and Cloud features will be disabled.");
      return false;
    }

    try {
      // Dynamically import Firebase Modules
      const { initializeApp } = await import(FIREBASE_APP_SDK);
      this.authModules = await import(FIREBASE_AUTH_SDK);
      this.firestoreModules = await import(FIREBASE_FIRESTORE_SDK);

      this.app = initializeApp(firebaseConfig);
      this.auth = this.authModules.getAuth(this.app);
      this.db = this.firestoreModules.getFirestore(this.app);
      this.isReady = true;

      console.log("Firebase services loaded and initialized successfully.");
      
      // Monitor auth state changes to update profile sync
      this.onAuthStateChanged(async (user) => {
        if (user) {
          await this.syncUserProfile(user);
        } else {
          sessionStorage.removeItem('pixedit_google_access_token');
        }
      });

      return true;
    } catch (error) {
      console.error("Failed to initialize Firebase services:", error);
      return false;
    }
  }

  onAuthStateChanged(callback) {
    if (!this.isReady || !this.auth) return;
    this.authModules.onAuthStateChanged(this.auth, callback);
  }

  async login() {
    if (!this.isReady || !this.auth) {
      alert("Firebase is not configured yet. Please configure assets/js/firebase-config.js first.");
      return;
    }

    const provider = new this.authModules.GoogleAuthProvider();
    // Add Google Drive file upload permission scope
    provider.addScope('https://www.googleapis.com/auth/drive.file');

    try {
      const result = await this.authModules.signInWithPopup(this.auth, provider);
      const credential = this.authModules.GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      
      if (token) {
        sessionStorage.setItem('pixedit_google_access_token', token);
      }
      
      console.log("User successfully signed in with Google.");
      return result.user;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  }

  async logout() {
    if (!this.isReady || !this.auth) return;
    try {
      await this.authModules.signOut(this.auth);
      sessionStorage.removeItem('pixedit_google_access_token');
      console.log("User successfully signed out.");
    } catch (error) {
      console.error("Sign-Out Error:", error);
      throw error;
    }
  }

  getCurrentUser() {
    return this.auth ? this.auth.currentUser : null;
  }

  getAccessToken() {
    return sessionStorage.getItem('pixedit_google_access_token');
  }

  async syncUserProfile(user) {
    if (!this.isReady || !this.db) return;
    try {
      const userRef = this.firestoreModules.doc(this.db, 'users', user.uid);
      await this.firestoreModules.setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: this.firestoreModules.serverTimestamp()
      }, { merge: true });
      console.log("User profile synced to Firestore.");
    } catch (error) {
      console.error("Firestore user profile sync failed:", error);
    }
  }
}
