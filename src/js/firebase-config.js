// Using Firebase compat version
import firebase from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js';
import 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js';

const firebaseConfig = {
    apiKey: "AIzaSyDtOgfObFOJl3E7Yr322RfjUqaSG99E3dQ",
    authDomain: "sample-dashboard-cb785.firebaseapp.com",
    projectId: "sample-dashboard-cb785",
    storageBucket: "sample-dashboard-cb785.firebasestorage.app",
    messagingSenderId: "840149826725",
    appId: "1:840149826725:web:2bd4de3d7b1ad4c4b5a14c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export firestore
export const db = firebase.firestore();

// Debug: Log initialization
console.log('Firebase initialized');