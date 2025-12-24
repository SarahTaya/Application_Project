// src/presentation/pages/dashboard/Dashboard.jsx
import { useEffect, useState } from "react";
import "../../styles/dashboard.css";
import {
  deleteNote,
  getAllNotesForComplaint,
  getComplaintByReference,
  getComplaintsByStatuse,
  getDepartmentComplaints,
  startComplaintProcess,
  finishComplaintProcess,
  addEmployeeNote,
  updateComplaintStatus,
} from "../../../domain/complaintsService";

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchRef, setSearchRef] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [notesMode, setNotesMode] = useState("mine"); // "mine" أو "all"
  const [allNotes, setAllNotes] = useState([]);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [requestedToCitizen, setRequestedToCitizen] = useState(false);
  const [statusDraft, setStatusDraft] = useState("");

  const EMPLOYEE_ID = Number(localStorage.getItem("employee_id") || 0);
  const USER_ID = Number(localStorage.getItem("user_id") || 0);
  const DEPARTMENT_ID = localStorage.getItem("department_id");

  console.log("EMPLOYEE_ID =", EMPLOYEE_ID);
  console.log("USER_ID =", USER_ID);
  console.log("DEPARTMENT_ID from localStorage =", DEPARTMENT_ID);

  function openAddNoteModal() {
    if (!selectedComplaint) return;
    setNewNoteText("");
    setRequestedToCitizen(false);
    setIsAddNoteOpen(true);
  }

  function closeAddNoteModal() {
    setIsAddNoteOpen(false);
  }

  // ✅ الدالة الأساسية لاختيار شكوى (مع statusDraft)
  function handleSelectComplaintMain(item) {
    setSelectedComplaint(item);
    setStatusDraft(item.status || "");
    setNotesMode("mine");
    setAllNotes([]);
  }

  // ✅ خليت اسمك القديم موجود بس صار ينادي الرئيسية
  async function handleSelectComplaint(item) {
    handleSelectComplaintMain(item);
  }

  async function handleUpdateStatus(e) {
    const newStatus = e.target.value;
    setStatusDraft(newStatus);

    if (!selectedComplaint) return;

    if (!canEditSelected) {
      alert("لا يمكنك تعديل حالة الشكوى قبل بدء المعالجة.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const updated = await updateComplaintStatus({
        complaintId: selectedComplaint.id,
        status: newStatus,
      });

      setSelectedComplaint(updated);
      setStatusDraft(updated.status || newStatus);
      setComplaints((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
    } catch (err) {
      console.error(err);
      alert("فشل تعديل الحالة، جرّب مرة تانية.");
      // رجّع السيليكت لقيمة الشكوى الحالية لو فشل
      setStatusDraft(selectedComplaint?.status || "");
    } finally {
      setLoading(false);
    }
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

      setSelectedComplaint(updated);
      setStatusDraft(updated.status || statusDraft);
      setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      closeAddNoteModal();
    } catch (err) {
      console.error(err);
      alert("فشل إضافة الملاحظة، جرّب مرة تانية.");
    } finally {
      setLoading(false);
    }
  }

  // 🔐 من له الحق بالتعديل على الشكوى الحالية؟
  const isLockedByMe =
    selectedComplaint &&
    (selectedComplaint.lockedBy === EMPLOYEE_ID ||
      selectedComplaint.lockedBy === USER_ID);

  const canEditSelected = !!isLockedByMe;

  const lockedByAnother =
    selectedComplaint &&
    selectedComplaint.lockedBy &&
    !isLockedByMe;

  // ------------------------------------
  // حذف ملاحظة
  // ------------------------------------
  async function handleDeleteNote(noteId) {
    if (!noteId) return;

    if (!canEditSelected) {
      alert("لا يمكنك تعديل ملاحظات هذه الشكوى قبل بدء المعالجة.");
      return;
    }

    const confirmDelete = window.confirm("متأكد/ة بدك تحذفي هالملاحظة؟");
    if (!confirmDelete) return;

    try {
      await deleteNote(noteId);

      setAllNotes((prev) => prev.filter((n) => n.id !== noteId));

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

  // ------------------------------------
  // حساب الملاحظات المعروضة
  // ------------------------------------
  let visibleNotes = [];

  if (selectedComplaint) {
    const rawNotes = selectedComplaint.notes || [];

    if (notesMode === "mine") {
      visibleNotes = rawNotes
        .filter((n) => n.employee_id === EMPLOYEE_ID)
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

  // ------------------------------------
  // تبديل مود الملاحظات (ملاحظاتي / الكل)
  // ------------------------------------
  async function handleNotesModeChange(e) {
    const value = e.target.value;
    setNotesMode(value);

    if (value === "mine") return;
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

  // ------------------------------------
  // بدء معالجة الشكوى (قفل)
  // ------------------------------------
  async function handleStartProcessClick() {
    if (!selectedComplaint) return;

    // ✅ الحالات الثلاث اللي بدك ياها:
    if (lockedByAnother) {
      alert("الشكوى قيد المعالجة من قبل موظف آخر.");
      return;
    }

    if (canEditSelected) {
      alert("الشكوى مقفولة عندك أصلاً (قيد المعالجة من قبلك).");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const updated = await startComplaintProcess(selectedComplaint.reference);

      setSelectedComplaint(updated);
      setStatusDraft(updated.status || statusDraft);
      setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch (err) {
      console.error(err);
      setError("فشل بدء معالجة الشكوى، جرّب مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------------
  // إنهاء معالجة الشكوى (فك القفل)
  // ------------------------------------
  async function handleFinishProcessClick() {
    if (!selectedComplaint) return;

    try {
      setLoading(true);
      setError("");

      const updated = await finishComplaintProcess(selectedComplaint.reference);

      setSelectedComplaint(updated);
      setStatusDraft(updated.status || statusDraft);
      setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch (err) {
      console.error(err);
      setError("فشل إنهاء معالجة الشكوى، جرّب مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------------
  // تحميل شكاوي القسم أول ما ندخل
  // ------------------------------------
  useEffect(() => {
    async function loadComplaints() {
      try {
        setLoading(true);
        setError("");

        if (!DEPARTMENT_ID) {
          setError("فشل تحميل الشكاوي الخاصة بالقسم");
          setComplaints([]);
          return;
        }

        const data = await getDepartmentComplaints(DEPARTMENT_ID);
        setComplaints(data);
      } catch (err) {
        console.error(err);
        setError("فشل تحميل الشكاوي الخاصة بالقسم");
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    }

    loadComplaints();
  }, [DEPARTMENT_ID]);

  // ------------------------------------
  // البحث برقم الشكوى
  // ------------------------------------
  async function handleSearchByReference() {
    if (!searchRef.trim()) return;

    try {
      setLoading(true);
      setError("");
      const complaint = await getComplaintByReference(searchRef.trim());
      setComplaints([complaint]);
      setSelectedComplaint(null);
      setSearchStatus("");
    } catch (err) {
      console.error(err);
      alert("ما في شكوى بهالرقم");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(e) {
    const value = e.target.value;
    setSearchStatus(value);

    if (!value) {
      try {
        setLoading(true);
        setError("");
        const data = await getDepartmentComplaints(DEPARTMENT_ID);
        setComplaints(data);
        setSelectedComplaint(null);
      } catch (err) {
        console.error(err);
        setError("فشل تحميل الشكاوي الخاصة بالقسم");
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      setError("");
      const list = await getComplaintsByStatuse(value);
      console.log("STATUS FILTER RESULT =", list);
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

  return (
    <div className="maindash">
      <div className="title">
        <div className="title1">
          <h1>ادارة الشكاوي الحكومية</h1>
        </div>
        <div className="title2">
          <h4>ادارة وتتبع شكاوي المواطنين</h4>
        </div>
      </div>

      <div className="complaint">
        {/* الفلاتر + الجدول */}
        <div className="table-filter">
          <div className="filters-area">
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

               <div className="detail-actions">
  {lockedByAnother && (
    <span className="locked-badge">
      الشكوى قيد المعالجة من قبل موظف آخر
    </span>
  )}

  {/* ✅ زر واحد Toggle */}
  <button
    type="button"
    className={`detail-btn ${canEditSelected ? "secondary" : "primary"}`}
    onClick={canEditSelected ? handleFinishProcessClick : handleStartProcessClick}
    disabled={!selectedComplaint || loading}
  >
    {canEditSelected ? "إنهاء المعالجة" : "بدء المعالجة"}
  </button>
</div>

              </div>

              <div className="detail-section">
                <h3 className="section-title">تعديل الحالة</h3>

                <select
                  className="filter-select"
                  value={statusDraft}
                  onChange={handleUpdateStatus}
                  disabled={!selectedComplaint || !canEditSelected || loading}
                  title={
                    !canEditSelected
                      ? "لا يمكنك تعديل الحالة قبل بدء المعالجة"
                      : "عدّل الحالة"
                  }
                >
                  <option value="new">جديدة</option>
                  <option value="processing">قيد المعالجة</option>
                  <option value="need_more_info">تحتاج معلومات إضافية</option>
                  <option value="rejected">مرفوضة</option>
                  <option value="closed">مغلقة</option>
                </select>
              </div>

              <p className="detail-ref">{selectedComplaint.reference}</p>
              <p className="detail-citizen">{selectedComplaint.nationalNumber}</p>

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
                  <span className="detail-value">{selectedComplaint.type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">الموقع</span>
                  <span className="detail-value">{selectedComplaint.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">تاريخ الإنشاء</span>
                  <span className="detail-value">{selectedComplaint.date}</span>
                </div>
              </div>

              <hr className="detail-divider" />

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

                  <div className="notes-actions">
                    <select
                      className="notes-filter-select"
                      value={notesMode}
                      onChange={handleNotesModeChange}
                      disabled={!selectedComplaint}
                    >
                      <option value="mine">ملاحظاتي على الشكوى</option>
                      <option value="all">ملاحظات كل الموظفين</option>
                    </select>

                    <button
                      type="button"
                      className="add-note-btn"
                      onClick={openAddNoteModal}
                      disabled={!selectedComplaint}
                      title={!selectedComplaint ? "اختار شكوى أولاً" : "إضافة ملاحظة"}
                    >
                      + إضافة ملاحظة
                    </button>
                  </div>
                </div>

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
                    {notesMode === "mine"
                      ? " لايوجد ملاحظات على هذه الشكوى"
                      : "لا توجد ملاحظات لهذه الشكوى"}
                  </p>
                ) : (
                  <ul className="notes-list">
                    {visibleNotes.map((note) => (
                      <li key={note.id} className="note-item">
                        <div className="note-header">
                          {note.employeeId && (
                            <span className="note-author">موظف رقم {note.employeeId}</span>
                          )}
                          {note.createdAt && <span className="note-date">{note.createdAt}</span>}

                          <button
                            type="button"
                            className="note-delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNote(note.id);
                            }}
                            disabled={!canEditSelected}
                            title={canEditSelected ? "حذف الملاحظة" : "لا يمكنك الحذف قبل بدء المعالجة"}
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

              <div className="detail-section">
                <h3 className="section-title">الملفات المرفقة</h3>
                {(!selectedComplaint.files || selectedComplaint.files.length === 0) && (
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
            <p className="empty-details">اختار شكوى من الجدول لعرض التفاصيل</p>
          )}
        </div>
      </div>
    </div>
  );
}
