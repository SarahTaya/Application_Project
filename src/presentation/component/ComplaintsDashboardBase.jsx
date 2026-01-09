// src/presentation/common/ComplaintsDashboardBase.jsx
import { useEffect, useState } from "react";
import "../styles/dashboard.css"; // عدّلي المسار حسب مشروعك
import {
  addEmployeeNote,
  deleteNote,
  getAllNotesForComplaint,
  updateNote,
  updateComplaintStatus,
} from "../../domain/complaintsService";
import { FaEdit } from "react-icons/fa";
import ComplaintHistoryModal from "./history/ComplaintHistoryModal";
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

  const [allNotes, setAllNotes] = useState([]);
  const [statusDraft, setStatusDraft] = useState("");
  // جديد
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [requestedToCitizen, setRequestedToCitizen] = useState(false);
  const [notesMode, setNotesMode] = useState("all"); // ✅ default خلّيه all

  const [isEditNoteOpen, setIsEditNoteOpen] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [editNoteText, setEditNoteText] = useState("");

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  function openAddNoteModal() {
    if (!selectedComplaint) return;
    setNewNoteText("");
    setRequestedToCitizen(false);
    setIsAddNoteOpen(true);
  }

  function closeAddNoteModal() {
    setIsAddNoteOpen(false);
  }

  async function handleSubmitNewNote(e) {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      setLoading(true);
      setError("");

      const updated = await addEmployeeNote({
        complaintId: selectedComplaint.id,
        note: newNoteText,
        requested_to_citizen: requestedToCitizen ? 1 : 0,
      });

      // رجّع الشكوى المحددة محدثة (لحتى notes تتحدّث)
      setSelectedComplaint(updated);

      // حدّثها بقائمة الجدول كمان
      setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      const list = await getAllNotesForComplaint(updated.id);
      setAllNotes(list);

      closeAddNoteModal();
    } catch (err) {
      console.error(err);
      alert("فشل إضافة الملاحظة، جرّب مرة تانية.");
    } finally {
      setLoading(false);
    }
  }


  // 
  function openEditNoteModal(note) {
    setEditNoteId(note.id);
    setEditNoteText(note.text || "");
    setIsEditNoteOpen(true);
  }

  function closeEditNoteModal() {
    setIsEditNoteOpen(false);
    setEditNoteId(null);
    setEditNoteText("");
  }

  async function handleSubmitEditNote(e) {
    e.preventDefault();
    if (!editNoteId) return;

    try {
      setLoading(true);
      setError("");

      const updated = await updateNote({
        noteId: editNoteId,
        noteText: editNoteText,
      });

      // 1) إذا كنا بوضع all عدّل allNotes
      setAllNotes((prev) =>
        prev.map((n) => (n.id === updated.id ? { ...n, text: updated.text } : n))
      );

      // 2) عدّل notes داخل selectedComplaint (لأنه mine مبني عليها)
      setSelectedComplaint((prev) => {
        if (!prev) return prev;
        const updatedNotes = (prev.notes || []).map((n) =>
          n.id === updated.id ? { ...n, note: updated.text } : n
        );
        return { ...prev, notes: updatedNotes };
      });

      closeEditNoteModal();
    } catch (err) {
      console.error(err);
      alert("فشل تعديل الملاحظة، جرّب مرة تانية.");
    } finally {
      setLoading(false);
    }
  }


  // حاااااالة
  async function handleUpdateStatus(e) {
    const newStatus = e.target.value;
    setStatusDraft(newStatus);

    if (!selectedComplaint) return;

    try {
      setLoading(true);
      setError("");

      const updated = await updateComplaintStatus({
        complaintId: selectedComplaint.id,
        status: newStatus,
      });

      setSelectedComplaint(updated);
      setComplaints((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
    } catch (err) {
      console.error(err);
      alert("فشل تعديل الحالة");
      setStatusDraft(selectedComplaint?.status || "");
    } finally {
      setLoading(false);
    }
  }


  // جدديد

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
    setStatusDraft(item.status || "");
    setAllNotes([]);
    setNotesMode("all"); // ✅ ضيف هالسطر

    try {
      setLoading(true);
      setError("");
      const list = await getAllNotesForComplaint(item.id);
      setAllNotes(list);
    } catch (err) {
      console.error(err);
      setError("فشل تحميل كل الملاحظات لهذه الشكوى");
      setAllNotes([]);
    } finally {
      setLoading(false);
    }
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
              <div className="detail-section">
                <select
                  className="filter-select"
                  value={statusDraft}
                  onChange={handleUpdateStatus}
                  disabled={!selectedComplaint || loading}
                  title="تعديل حالة الشكوى"
                >
                  <option value="new">جديدة</option>
                  <option value="processing">قيد المعالجة</option>
                  <option value="need_more_info">تحتاج معلومات إضافية</option>
                  <option value="rejected">مرفوضة</option>
                  <option value="closed">مغلقة</option>
                </select>
              </div>


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
              {/* <div className="detail-section">
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
              </div> */}

              <div className="detail-section">
                <h3 className="section-title">الملاحظات</h3>

                <div className="notes-header">
                  <div className="notes-actions">
                    {/* <select
                      className="notes-filter-select"
                      value={notesMode}
                      onChange={handleNotesModeChange}
                      disabled={!selectedComplaint}
                    >
                      <option value="mine">ملاحظاتي على الشكوى</option>
                      <option value="all">ملاحظات كل الموظفين</option>
                    </select> */}

                    <button
                      type="button"
                      className="add-note-btn"
                      onClick={openAddNoteModal}
                      disabled={!selectedComplaint}
                      title={!selectedComplaint ? "اختار شكوى أولاً" : "إضافة ملاحظة"}
                    >
                      + إضافة ملاحظة
                    </button>

                    <button
  type="button"
  className="history-btn"
  onClick={() => setIsHistoryOpen(true)}
  disabled={!selectedComplaint?.reference}
>
  📜 سجل التغييرات
</button>

                  </div>
                </div>

                {/* ✅ مودال تعديل ملاحظة */}
                {isEditNoteOpen && (
                  <div className="modal-overlay" onClick={closeEditNoteModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                      <div className="modal-head">
                        <h3 className="modal-title">تعديل ملاحظة</h3>
                        <button type="button" className="modal-x" onClick={closeEditNoteModal}>
                          ×
                        </button>
                      </div>

                      <form onSubmit={handleSubmitEditNote} className="modal-body">
                        <label className="modal-label">ID الملاحظة</label>
                        <input className="modal-input" value={editNoteId ?? ""} disabled />

                        <label className="modal-label">نص الملاحظة</label>
                        <textarea
                          className="modal-textarea"
                          value={editNoteText}
                          onChange={(e) => setEditNoteText(e.target.value)}
                          required
                        />

                        <div className="modal-actions">
                          <button type="button" className="modal-btn secondary" onClick={closeEditNoteModal}>
                            إلغاء
                          </button>
                          <button type="submit" className="modal-btn primary" disabled={loading}>
                            تأكيد التعديل
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* ✅ مودال إضافة ملاحظة */}
                {isAddNoteOpen && (
                  <div className="modal-overlay" onClick={closeAddNoteModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                      <div className="modal-head">
                        <h3 className="modal-title">إضافة ملاحظة</h3>
                        <button type="button" className="modal-x" onClick={closeAddNoteModal}>
                          ×
                        </button>
                      </div>

                      <form onSubmit={handleSubmitNewNote} className="modal-body">
                        <label className="modal-label">ID الشكوى</label>
                        <input className="modal-input" value={selectedComplaint?.id ?? ""} disabled />

                        <label className="modal-label">الملاحظة</label>
                        <textarea
                          className="modal-textarea"
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                          placeholder="اكتب ملاحظتك ..."
                          required
                        />

                        <label className="modal-check">
                          <input
                            type="checkbox"
                            checked={requestedToCitizen}
                            onChange={(e) => setRequestedToCitizen(e.target.checked)}
                          />
                          مطلوبة من المواطن (requested_to_citizen)
                        </label>

                        <div className="modal-actions">
                          <button type="button" className="modal-btn secondary" onClick={closeAddNoteModal}>
                            إلغاء
                          </button>
                          <button type="submit" className="modal-btn primary" disabled={loading}>
                            حفظ
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {!selectedComplaint ? (
                  <p className="section-text">اختار شكوى أولاً لعرض الملاحظات</p>
                ) : visibleNotes.length === 0 ? (
                  <p className="section-text">
                    {notesMode === "mine" ? "لا يوجد ملاحظات على هذه الشكوى" : "لا توجد ملاحظات لهذه الشكوى"}
                  </p>
                ) : (
                  <ul className="notes-list">
                    {allNotes.map((note) => (
                      <li key={note.id} className="note-item">
                        <div className="note-header">
                          {note.employeeId && <span className="note-author">موظف رقم {note.employeeId}</span>}
                          {note.createdAt && <span className="note-date">{note.createdAt}</span>}

                          <button
                            type="button"
                            className="note-edit-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditNoteModal(note);
                            }}
                            title="تعديل الملاحظة"
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            className="note-delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNote(note.id);
                            }}
                            title="حذف الملاحظة"
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
              {/* <div className="detail-section">
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
              </div> */}
              <div className="detail-section">
                <h3 className="section-title">الملفات المرفقة</h3>

                {(!selectedComplaint.files || selectedComplaint.files.length === 0) && (
                  <p className="section-text">لا توجد ملفات مرفقة</p>
                )}

                {selectedComplaint.files?.length > 0 && (
                  <div className="attachments-grid">
                    {selectedComplaint.files.map((file) => {
                      const isImage = file.type?.startsWith("image/");
                      const isPdf = file.type === "application/pdf";

                      if (isImage) {
                        return (
                          <a
                            key={file.id}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="img-card"
                            title="فتح الصورة"
                          >
                            <img
                              src={file.url}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/image/logo.svg";
                              }}
                            />
                          </a>
                        );
                      }

                      if (isPdf) {
                        return (
                          <a
                            key={file.id}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pdf-card"
                            title="فتح PDF"
                          >
                            <div className="pdf-badge">PDF</div>
                            <div className="pdf-text">فتح الملف</div>
                          </a>
                        );
                      }

                      return (
                        <a
                          key={file.id}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="file-card"
                        >
                          تحميل الملف
                        </a>
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
      <ComplaintHistoryModal
  isOpen={isHistoryOpen}
  onClose={() => setIsHistoryOpen(false)}
  referenceNumber={selectedComplaint?.reference}
/>

    </div>
  );
}
