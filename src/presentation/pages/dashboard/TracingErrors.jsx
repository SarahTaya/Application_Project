import { useEffect, useState } from "react";
import "../../styles/dashboard.css";
import { getErrorLogs } from "../../../domain/adminExportService";


export default function TracingErrors() {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // تحميل اللّوغات أول ما نفوت
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await getErrorLogs();
        setLogs(data);

        // اختار أول عنصر تلقائياً إذا في بيانات
        setSelectedLog(data[0] ?? null);
      } catch (err) {
        console.error(err);
        setError("فشل تحميل Tracing Errors");
        setLogs([]);
        setSelectedLog(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const levelBadgeClass = (level) => `status ${level || ""}`;

  return (
    <div className="maindash">
      <div className="title">
        <div className="title1">
          <h1>Tracing Errors</h1>
        </div>
        <div className="title2">
          <h4>صفحة تتبّع أخطاء النظام (Logs / Traces)</h4>
        </div>
      </div>

      <div className="complaint">
        <div className="table-filter">
          <div className="table-wrapper">
            <table className="complaints-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>log_name</th>
                  <th>level</th>
                  <th>description</th>
                  <th>user_id</th>
                  <th>causer</th>
                  <th>date</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((item, index) => (
                  <tr
                    key={item.id ?? index}
                    onClick={() => setSelectedLog(item)}
                    className={selectedLog?.id === item.id ? "row-selected" : ""}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{item.id ?? "-"}</td>
                    <td>{item.logName ?? "-"}</td>
                    <td>
                      <span className={levelBadgeClass(item.level)}>
                        {item.level ?? "-"}
                      </span>
                    </td>
                    <td style={{ maxWidth: 420 }}>
                      {(item.description ?? "-").slice(0, 90)}
                      {(item.description ?? "").length > 90 ? "..." : ""}
                    </td>
                    <td>{item.userId ?? "-"}</td>
                    <td>
                      {item.causerType
                        ? `${item.causerType} #${item.causerId ?? "-"}`
                        : "-"}
                    </td>
                    <td>{item.createdAt ? item.createdAt.slice(0, 10) : "-"}</td>
                  </tr>
                ))}

                {logs.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: 16 }}>
                      لا يوجد بيانات
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {error && <p className="error-text">{error}</p>}
          {loading && <p className="loading-text">جاري التحميل...</p>}
        </div>

        <div className="detail-complaints">
          {!selectedLog ? (
            <p className="empty-details">اختار Log من الجدول لعرض التفاصيل</p>
          ) : (
            <>
              <div className="detail-header">
                <h2 className="detail-title">تفاصيل الـ Trace</h2>
              </div>

              <p className="detail-ref">Trace ID: {selectedLog.id ?? "-"}</p>
              <p className="detail-citizen">{selectedLog.logName ?? "-"}</p>

              <hr className="detail-divider" />

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Description</span>
                  <span className="detail-value">{selectedLog.description ?? "-"}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Causer Type</span>
                  <span className="detail-value">{selectedLog.causerType ?? "-"}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Causer ID</span>
                  <span className="detail-value">{selectedLog.causerId ?? "-"}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Level</span>
                  <span className="detail-value">{selectedLog.level ?? "-"}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">User ID</span>
                  <span className="detail-value">{selectedLog.userId ?? "-"}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">User Name</span>
                  <span className="detail-value">{selectedLog.userName ?? "-"}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Action</span>
                  <span className="detail-value">{selectedLog.action ?? "-"}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">
                    {selectedLog.createdAt
                      ? selectedLog.createdAt.replace("T", " ").slice(0, 19)
                      : "-"}
                  </span>
                </div>
              </div>

              <hr className="detail-divider" />

              <div className="detail-section">
                <h3 className="section-title">Details</h3>
                <p className="section-text">
                  identifier: {selectedLog.details?.identifier ?? "-"}
                  <br />
                  serial_number: {selectedLog.details?.serialNumber ?? "-"}
                </p>
              </div>

              <hr className="detail-divider" />

              <div className="detail-section">
                <h3 className="section-title">Exception</h3>
                <p className="section-text">
                  type: {selectedLog.exception?.type ?? "-"}
                  <br />
                  message: {selectedLog.exception?.message ?? "-"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
