// // مثال إذا هو بـ src/presentation/http/httpClient.js
// // import { httpClient } from "../presentation/http/httpClient";

// import { httpClient } from "../http/client";

// export const EXPORT_ENDPOINTS = {
//   statistics: { pdf: "/export/statistics/pdf", csv: "/export/statistics/csv" },
//   activity:    { pdf: "/export/activity/pdf",    csv: "/export/activity/csv" },
//   versions:    { pdf: "/export/versions/pdf",    csv: "/export/versions/csv" },
//   backups:     { pdf: "/export/backups/pdf",     csv: "/export/backups/csv" },
// };

// // ملاحظة: baseURL عندك فيه /api
// // فهون لازم المسارات تكون بدون /api بالبداية مثل فوق

// export async function exportReportApi({ type, format }) {
//   const url = EXPORT_ENDPOINTS?.[type]?.[format];
//   if (!url) throw new Error("Export endpoint غير موجود");

//   return httpClient.get(url, { responseType: "blob" });
// }

import { httpClient } from "../http/client";

export const EXPORT_ENDPOINTS = {
  statistics: { pdf: "/export/statistics/pdf", csv: "/export/statistics/csv" },
  activity:   { pdf: "/export/activity/pdf",   csv: "/export/activity/csv" },
  versions:   { pdf: "/export/versions/pdf",   csv: "/export/versions/csv" },
  backups:    { pdf: "/export/backups/pdf",    csv: "/export/backups/csv" },
};

const DEFAULT_CREDS = {
  identifier: process.env.REACT_APP_EXPORT_IDENTIFIER || "11111",
  password: process.env.REACT_APP_EXPORT_PASSWORD || "Admin123",
};

export async function exportReportApi({ type, format, creds }) {
  const url = EXPORT_ENDPOINTS?.[type]?.[format];
  if (!url) throw new Error("Export endpoint غير موجود");

  // statistics ما بدها creds
  if (type === "statistics") {
    return httpClient.get(url, { responseType: "blob" });
  }

  const c = {
    identifier: creds?.identifier ?? DEFAULT_CREDS.identifier,
    password: creds?.password ?? DEFAULT_CREDS.password,
  };

  // ✅ GET + query params (لأن السيرفر رافض POST)
  return httpClient.get(url, {
    responseType: "blob",
    params: c,
  });
}



export async function getErrorLogsApi() {
  const res = await httpClient.get("/logs/error"); 
  return res.data;
}

