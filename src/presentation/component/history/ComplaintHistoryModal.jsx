// src/presentation/component/history/ComplaintHistoryModal.jsx
import { useEffect, useMemo, useState } from "react";
import "../../styles/ComplaintHistoryModal.css";
import { getComplaintHistory } from "../../../domain/adminExportService";

export default function ComplaintHistoryModal({
  isOpen,
  onClose,
  referenceNumber,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  const [filter, setFilter] = useState("all"); // all | status | notes
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    if (!referenceNumber) return;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const list = await getComplaintHistory(referenceNumber);
        setItems(list);
      } catch (e) {
        console.error(e);
        setError("فشل تحميل سجل التغييرات");
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, referenceNumber]);

  const filtered = useMemo(() => {
    let list = items;

    if (filter === "status") {
      list = list.filter((x) => x.action === "status_changed");
    } else if (filter === "notes") {
      list = list.filter((x) => String(x.fieldName || "").includes("notes") || String(x.action || "").includes("note"));
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((x) => {
        return (
          String(x.actionLabel).toLowerCase().includes(q) ||
          String(x.userName).toLowerCase().includes(q) ||
          String(x.oldValue ?? "").toLowerCase().includes(q) ||
          String(x.newValue ?? "").toLowerCase().includes(q) ||
          String(x.createdAtText).toLowerCase().includes(q)
        );
      });
    }

    return list;
  }, [items, filter, query]);

  if (!isOpen) return null;

  return (
    <div className="chm-overlay" onClick={onClose}>
      <div className="chm-card" onClick={(e) => e.stopPropagation()}>
        <div className="chm-head">
          <div>
            <div className="chm-title">سجل التغييرات</div>
            <div className="chm-sub">رقم الشكوى: {referenceNumber}</div>
          </div>
          <button className="chm-x" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <div className="chm-toolbar">
          <select
            className="chm-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">الكل</option>
            <option value="status">الحالة</option>
            <option value="notes">الملاحظات</option>
          </select>

          <input
            className="chm-search"
            placeholder="بحث داخل السجل..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="chm-body">
          {loading && <div className="chm-hint">جاري التحميل...</div>}
          {error && <div className="chm-error">{error}</div>}

          {!loading && !error && filtered.length === 0 && (
            <div className="chm-hint">ما في سجلات حالياً</div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <ul className="chm-timeline">
              {filtered.map((x) => (
                <li key={x.id} className="chm-item">
                  <div className="chm-dot" />
                  <div className="chm-content">
                    <div className="chm-row">
                      <span className="chm-badge">{x.actionLabel}</span>
                      <span className="chm-time">{x.createdAtText}</span>
                    </div>

                    <div className="chm-meta">
                      <span className="chm-user">{x.userName}</span>
                      {x.version != null && <span className="chm-ver">v{x.version}</span>}
                    </div>

                    {(x.oldValue != null || x.newValue != null) && (
                      <div className="chm-diff">
                        {x.oldValue != null && (
                          <div className="chm-old">
                            <div className="chm-k">قبل</div>
                            <div className="chm-v">{String(x.oldValue)}</div>
                          </div>
                        )}
                        {x.newValue != null && (
                          <div className="chm-new">
                            <div className="chm-k">بعد</div>
                            <div className="chm-v">{String(x.newValue)}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="chm-foot">
          <button className="chm-close" onClick={onClose} type="button">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
