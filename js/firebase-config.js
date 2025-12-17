// ============================================
// FIREBASE CONFIGURATION
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyAkRX4SYQAKbd1hz9DhzWLjpH8B6KqL-R8",
    authDomain: "teef-portal.firebaseapp.com",
    projectId: "teef-portal",
    storageBucket: "teef-portal.firebasestorage.app",
    messagingSenderId: "430563187500",
    appId: "1:430563187500:web:143bf1cf2246857c342a89"
};

let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log('✅ Firebase initialized');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
    alert('Firebase not configured! See console for details.');
}
