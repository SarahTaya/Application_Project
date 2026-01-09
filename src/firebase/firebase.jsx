import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB6oVxAyrHy1soYv3CMhj-wQYw8ehHPKSk",
  authDomain: "application-project-ba268.firebaseapp.com",
  projectId: "application-project-ba268",
  storageBucket: "application-project-ba268.firebasestorage.app",
  messagingSenderId: "272244005484",
  appId: "1:272244005484:web:aad9d87b4932d5a121d649",
  measurementId: "G-0BKC5058CK",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);

// VAPID Key (Web Push certificates)
export const VAPID_KEY =
  "BOEwUMeqnn_RlTi6OVY18D4GPPAamWqbTOaJeyetxthKX5rOlo3yXzTfxuAgId5luLPS1roYEOjHEXUtTW7dvYo";
