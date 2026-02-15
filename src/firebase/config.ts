// Follow the instructions in the Firebase console to get your config object.
// You can find it in your project's settings.

// 1. Go to the Firebase console: https://console.firebase.google.com/
// 2. Select your project.
// 3. Go to Project settings (the gear icon).
// 4. In the "Your apps" card, select the web app.
// 5. Click on "Config" to see your Firebase config object.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
