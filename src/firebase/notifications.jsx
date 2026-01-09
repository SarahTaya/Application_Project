import { getToken, onMessage } from "firebase/messaging";
import { messaging, VAPID_KEY } from "./firebase";

// 1) Register service worker
async function registerFirebaseSW() {
  if (!("serviceWorker" in navigator)) return null;

  const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  return reg;
}

// 2) Ask permission + get FCM token
export async function enableWebNotifications() {
  if (!("Notification" in window)) {
    throw new Error("المتصفح ما بيدعم الإشعارات");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("لازم تسمح بالإشعارات من المتصفح");
  }

  const swReg = await registerFirebaseSW();

  // get FCM token
  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: swReg,
  });

  if (!token) {
    throw new Error("ما قدرنا نطلع FCM Token");
  }

  return token;
}

// 3) Foreground listener (لما الموقع مفتوح)
export function listenToForegroundMessages(cb) {
  return onMessage(messaging, (payload) => {
    cb?.(payload);
  });
}
