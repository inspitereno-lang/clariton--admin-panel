importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyDa3CKdDCx4HzxbsfEhKRQnfw3f5MP5kd0",
    authDomain: "claritone-78475.firebaseapp.com",
    projectId: "claritone-78475",
    storageBucket: "claritone-78475.firebasestorage.app",
    messagingSenderId: "361393978843",
    appId: "1:361393978843:web:315669264097dc0a747bfe",
    measurementId: "G-7QQE5G94RH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/vite.svg'
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});
