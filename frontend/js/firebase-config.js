/* ========================================================
   LAYOVERX - Firebase Initialization
   ======================================================== */

// Your web app's Firebase configuration
// REPLACE THESE VALUES WITH YOUR ACTUAL FIREBASE PROJECT CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyC_LWXrkRAFg5lMQiw-fGU_NcEy7r7g-hM",
  authDomain: "layoverx-e61a8.firebaseapp.com",
  projectId: "layoverx-e61a8",
  storageBucket: "layoverx-e61a8.firebasestorage.app",
  messagingSenderId: "281081249812",
  appId: "1:281081249812:web:48db4624c3a395cd12e701",
  measurementId: "G-VVNX1N3CDE"
};

// Initialize Firebase using the Compat CDN
firebase.initializeApp(firebaseConfig);

// Expose services globally for app.js to use
window.layoverxDb = firebase.firestore();
window.layoverxAuth = firebase.auth();
