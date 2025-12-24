// src/presentation/common/ComplaintsDashboardBase.jsx
import { useEffect, useState } from "react";
import "../styles/dashboard.css"; // عدّلي المسار حسب مشروعك
import {
  deleteNote,
  getAllNotesForComplaint,
} from "../../domain/complaintsService";

export default function ComplaintsDashboardBase({
  pageTitle,
  pageSubtitle,
  loadInitialComplaints, // () => Promise<Complaint[]>
  loadByReference,      // (reference: string) => Promise<Complaint>
  loadByStatus,         // (status: string) => Promise<Complaint[]>
  employeeId,           // رقم الموظف الحالي (للـ "ملاحظاتي")
}) {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchRef, setSearchRef] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [notesMode, setNotesMode] = useState("mine"); // "mine" أو "all"
  const [allNotes, setAllNotes] = useState([]);

  // 🔹 تحميل الشكاوي أول ما نفوت على الصفحة
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await loadInitialComplaints();
        setComplaints(data);
      } catch (err) {
        console.error(err);
        setError("فشل تحميل الشكاوي");
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [loadInitialComplaints]);

  // 🔍 فلترة حسب رقم الشكوى
  async function handleSearchByReference() {
    if (!searchRef.trim()) return;

    try {
      setLoading(true);
      setError("");
      const complaint = await loadByReference(searchRef.trim());
      setComplaints([complaint]); // شكوى واحدة
      setSelectedComplaint(null);
      setSearchStatus("");
    } catch (err) {
      console.error(err);
      alert("ما في شكوى بهالرقم");
    } finally {
      setLoading(false);
    }
  }

  // 🔁 تغيير فلتر الحالة
  async function handleStatusChange(e) {
    const value = e.target.value;
    setSearchStatus(value);

    // رجوع للوضع الافتراضي: تحميل الشكاوي الأساسية
    if (!value) {
      try {
        setLoading(true);
        setError("");
        const data = await loadInitialComplaints();
        setComplaints(data);
        setSelectedComplaint(null);
      } catch (err) {
        console.error(err);
        setError("فشل تحميل الشكاوي");
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      setError("");
      const list = await loadByStatus(value);
      setComplaints(list);
      setSelectedComplaint(null);
      setSearchRef("");
    } catch (err) {
      console.error(err);
      setError("لا توجد شكاوي بهذه الحالة");
      setComplaints([]);
      setSelectedComplaint(null);
    } finally {
      setLoading(false);
    }
  }

  // 📝 اختيار شكوى من الجدول
  async function handleSelectComplaint(item) {
    setSelectedComplaint(item);
    setNotesMode("mine"); // نرجع لملاحظاتي
    setAllNotes([]);      // نفرّغ ملاحظات الكل القديمة
  }

  // 🗑 حذف ملاحظة
  async function handleDeleteNote(noteId) {
    if (!noteId) return;

    const confirmDelete = window.confirm("متأكد/ة بدك تحذفي هالملاحظة؟");
    if (!confirmDelete) return;

    try {
      await deleteNote(noteId);

      // حدّث ملاحظات "كل الموظفين"
      setAllNotes((prev) => prev.filter((n) => n.id !== noteId));

      // وحدّث ملاحظات الشكوى الحالية كمان
      setSelectedComplaint((prev) => {
        if (!prev) return prev;
        const updatedNotes = (prev.notes || []).filter((n) => n.id !== noteId);
        return { ...prev, notes: updatedNotes };
      });
    } catch (err) {
      console.error(err);
      alert("فشل حذف الملاحظة، جرّبي بعد شوي.");
    }
  }

  // 📝 تغيير مود الملاحظات (ملاحظاتي / كل الموظفين)
  async function handleNotesModeChange(e) {
    const value = e.target.value;
    setNotesMode(value);

    if (value === "mine") return; // ملاحظاتي → ما مننادي API

    if (!selectedComplaint) return;

    try {
      setLoading(true);
      setError("");
      const list = await getAllNotesForComplaint(selectedComplaint.id);
      setAllNotes(list);
    } catch (err) {
      console.error(err);
      setError("فشل تحميل كل الملاحظات لهذه الشكوى");
      setAllNotes([]);
    } finally {
      setLoading(false);
    }
  }

  // 🔍 تجهيز الملاحظات المعروضة حسب المود
  let visibleNotes = [];
  if (selectedComplaint) {
    const rawNotes = selectedComplaint.notes || [];

    if (notesMode === "mine") {
      visibleNotes = rawNotes
        .filter((n) => n.employee_id === employeeId)
        .map((n) => ({
          id: n.id,
          text: n.note,
          createdAt: n.created_at?.slice(0, 10) ?? "",
          employeeId: n.employee_id,
        }));
    } else {
      visibleNotes = allNotes;
    }
  }

  return (
    <div className="maindash">
      <div className="title">
        <div className="title1">
          <h1>{pageTitle}</h1>
        </div>
        <div className="title2">
          <h4>{pageSubtitle}</h4>
        </div>
      </div>

      <div className="complaint">
        {/* الفلاتر + الجدول */}
        <div className="table-filter">
          <div className="filters-area">
            {/* البحث برقم الشكوى */}
            <input
              type="text"
              placeholder="ابحث برقم الشكوى (مثال: COMP-2025-...)"
              className="filter-input"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchByReference();
              }}
            />

            {/* فلتر الحالة */}
            <select
              className="filter-select"
              value={searchStatus}
              onChange={handleStatusChange}
            >
              <option value="">كل الحالات</option>
              <option value="new">جديدة</option>
              <option value="processing">قيد المعالجة</option>
              <option value="need_more_info">تحتاج معلومات إضافية</option>
              <option value="rejected">مرفوضة</option>
              <option value="closed">مغلقة</option>
            </select>
          </div>

          {/* الجدول */}
          <div className="table-wrapper">  
            <table className="complaints-table">
              <thead>
                <tr>
                  <th>رقم الشكوى</th>
                  <th>الرقم الوطني</th>
                  <th>الحالة</th>
                  <th>نوع الشكوى</th>
                  <th>الموقع</th>
                  <th>تاريخ الإنشاء</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((item, index) => (
                  <tr
                    key={item.id || item.reference || index}
                    onClick={() => handleSelectComplaint(item)}
                    className={
                      selectedComplaint?.id === item.id ? "row-selected" : ""
                    }
                  >
                    <td>{item.reference}</td>
                    <td>{item.nationalNumber}</td>
                    <td>
                      <span className={`status ${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.type}</td>
                    <td>{item.location}</td>
                    <td>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {error && <p className="error-text">{error}</p>}
          {loading && <p className="loading-text">جاري التحميل...</p>}
        </div>

        {/* تفاصيل الشكوى */}
        <div className="detail-complaints">
          {selectedComplaint ? (
            <>
              <div className="detail-header">
                <h2 className="detail-title">تفاصيل الشكوى</h2>
              </div>

              <p className="detail-ref">{selectedComplaint.reference}</p>
              <p className="detail-citizen">
                {selectedComplaint.nationalNumber}
              </p>

              <hr className="detail-divider" />

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">القسم </span>
                  <span className="detail-value">
                    {selectedComplaint.departmentId}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">نوع الشكوى</span>
                  <span className="detail-value">
                    {selectedComplaint.type}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">الموقع</span>
                  <span className="detail-value">
                    {selectedComplaint.location}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">تاريخ الإنشاء</span>
                  <span className="detail-value">
                    {selectedComplaint.date}
                  </span>
                </div>
              </div>

              <hr className="detail-divider" />

              {/* الوصف */}
              <div className="detail-section">
                <h3 className="section-title">الوصف</h3>
                <p className="section-text">
                  {selectedComplaint.description || "لا يوجد وصف"}
                </p>
              </div>

              {/* الملاحظات */}
              <div className="detail-section">
                <div className="notes-header">
                  <h3 className="section-title">الملاحظات</h3>

                  <select
                    className="notes-filter-select"
                    value={notesMode}
                    onChange={handleNotesModeChange}
                    disabled={!selectedComplaint}
                  >
                    <option value="mine">ملاحظاتي على الشكوى</option>
                    <option value="all">ملاحظات كل الموظفين</option>
                  </select>
                </div>

                {!selectedComplaint ? (
                  <p className="section-text">
                    اختاري شكوى أولاً لعرض الملاحظات
                  </p>
                ) : visibleNotes.length === 0 ? (
                  <p className="section-text">
                    {notesMode === "mine"
                      ? "ما عندك ملاحظات على هذه الشكوى"
                      : "لا توجد ملاحظات لهذه الشكوى"}
                  </p>
                ) : (
                  <ul className="notes-list">
                    {visibleNotes.map((note) => (
                      <li key={note.id} className="note-item">
                        <div className="note-header">
                          {note.employeeId && (
                            <span className="note-author">
                              موظف رقم {note.employeeId}
                            </span>
                          )}
                          {note.createdAt && (
                            <span className="note-date">
                              {note.createdAt}
                            </span>
                          )}

                          <button
                            className="note-delete-btn"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            ×
                          </button>
                        </div>
                        <p className="note-text">{note.text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* الملفات */}
              <div className="detail-section">
                <h3 className="section-title">الملفات المرفقة</h3>
                {(!selectedComplaint.files ||
                  selectedComplaint.files.length === 0) && (
                  <p className="section-text">لا توجد ملفات مرفقة</p>
                )}

                {selectedComplaint.files?.length > 0 && (
                  <div className="attachments-list">
                    {selectedComplaint.files.map((file) => {
                      const isImage = file.type?.startsWith("image/");
                      const isPdf = file.type === "application/pdf";

                      return (
                        <div key={file.id} className="attachment-item">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="attachment-pill"
                          >
                            {isImage && "عرض الصورة"}
                            {isPdf && "فتح ملف PDF"}
                            {!isImage && !isPdf && "تحميل الملف"}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="empty-details">
              اختاري شكوى من الجدول لعرض التفاصيل
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
