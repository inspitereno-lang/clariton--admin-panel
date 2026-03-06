import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
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
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export default app;
