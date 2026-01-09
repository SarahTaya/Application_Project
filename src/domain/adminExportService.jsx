// import { exportReportApi } from "../data/dash/adminExportApi";


// function guessFilename({ type, format }) {
//   const ext = format === "pdf" ? "pdf" : "csv";
//   const d = new Date().toISOString().slice(0, 10);
//   return `${type}_report_${d}.${ext}`;
// }

// export async function exportReport({ type, format }) {
//   const res = await exportReportApi({ type, format });

//   const blob = new Blob([res.data]);
//   const a = document.createElement("a");
//   a.href = window.URL.createObjectURL(blob);
//   a.download = guessFilename({ type, format });
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
//   window.URL.revokeObjectURL(a.href);
// }


import { exportReportApi, getErrorLogsApi } from "../data/dash/adminExportApi";
import { getComplaintHistoryApi } from "../data/dash/adminUsersApi";

function guessFilename({ type, format }) {
  const ext = format === "pdf" ? "pdf" : "csv";
  const d = new Date().toISOString().slice(0, 10);
  return `${type}_report_${d}.${ext}`;
}

export async function exportReport({ type, format }) {
  const res = await exportReportApi({ type, format });
  const blob = new Blob([res.data]);

  const a = document.createElement("a");
  a.href = window.URL.createObjectURL(blob);
  a.download = guessFilename({ type, format });
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(a.href);
}


function mapTraceLog(item) {
  return {
    id: item.id ?? null,
    logName: item.log_name ?? null,
    description: item.description ?? null,

    causerType: item.causer_type ?? null,
    causerId: item.causer_id ?? null,

    createdAt: item.created_at ?? null,

    // properties المطلوبين منك
    userId: item.properties?.user_id ?? null,
    userName: item.properties?.user_name ?? null,
    level: item.properties?.level ?? null,
    action: item.properties?.action ?? null,

    details: {
      identifier: item.properties?.details?.identifier ?? null,
      serialNumber: item.properties?.details?.serial_number ?? null,
    },

    exception: {
      type: item.properties?.exception?.type ?? null,
      message: item.properties?.exception?.message ?? null,
      file: item.properties?.exception?.file ?? null,
      line: item.properties?.exception?.line ?? null,
    },

    // نخزن الخام إذا بدك لاحقاً
    raw: item,
  };
}

export async function getErrorLogs() {
  const data = await getErrorLogsApi();
  const list = Array.isArray(data?.data) ? data.data : [];
  return list.map(mapTraceLog);
}




// هيستوري

function formatShortDate(iso) {
  if (!iso) return "-";
  return iso.replace("T", " ").slice(0, 16);
}

function actionLabel(action, fieldName) {
  // بدّل التسميات حسب ذوقك
  switch (action) {
    case "status_changed":
      return "تعديل الحالة";
    case "note_added":
      return "إضافة ملاحظة";
    case "note_deleted":
      return "حذف ملاحظة";
    case "note_updated":
      return "تعديل ملاحظة";
    case "note_requested_from_citizen":
      return "طلب معلومات من المواطن";
    default:
      return fieldName ? `تغيير: ${fieldName}` : "تعديل";
  }
}

export async function getComplaintHistory(referenceNumber) {
  const data = await getComplaintHistoryApi(referenceNumber);

  const versions = data?.history?.versions ?? [];

  // نجهّزها للـ UI (شكل موحّد)
  const mapped = versions
    .map((v) => ({
      id: v.id,
      action: v.action,
      actionLabel: actionLabel(v.action, v.field_name),
      fieldName: v.field_name,
      oldValue: v.old_value,
      newValue: v.new_value,
      createdAt: v.created_at,
      createdAtText: formatShortDate(v.created_at),
      userName: `${v.user?.f_name ?? ""} ${v.user?.l_name ?? ""}`.trim() || `User#${v.created_by ?? "-"}`,
      userId: v.created_by ?? null,
      version: v.version ?? null,
      // snapshot مفيد إذا بدك لاحقاً
      snapshotStatus: v.snapshot?.status ?? null,
    }))
    // الأحدث فوق
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return mapped;
}
