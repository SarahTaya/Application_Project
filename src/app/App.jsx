// src/app/App.jsx
// import { BrowserRouter } from "react-router-dom";
// import AppRoutes from "./Routes";

// export default function App() {




//   return (

//     <BrowserRouter>
//       <AppRoutes />
//     </BrowserRouter>
//   );
// }


// src/app/App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes";
import { useEffect } from "react";
import { enableWebNotifications, listenToForegroundMessages } from "../firebase/notifications";
// عدّل المسار حسب مكان الملف عندك

export default function App() {
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const token = await enableWebNotifications();
  //       console.log("FCM TOKEN =", token);

  //       // (اختياري) اسمع إشعارات لما الموقع مفتوح
  //       listenToForegroundMessages((payload) => {
  //         console.log("Foreground message:", payload);
  //       });
  //     } catch (e) {
  //       console.error("FCM error:", e);
  //     }
  //   })();
  // }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
