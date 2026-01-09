/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB6oVxAyrHy1soYv3CMhj-wQYw8ehHPKSk",
  authDomain: "application-project-ba268.firebaseapp.com",
  projectId: "application-project-ba268",
  storageBucket: "application-project-ba268.firebasestorage.app",
  messagingSenderId: "272244005484",
  appId: "1:272244005484:web:aad9d87b4932d5a121d649",
});

const messaging = firebase.messaging();

// لما توصل Notification والويب مغلق/بالخلفية
messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || "New notification";
  const options = {
    body: payload?.notification?.body || "",
    icon: "/logo192.png",
    data: payload?.data || {},
  };

  self.registration.showNotification(title, options);
});
