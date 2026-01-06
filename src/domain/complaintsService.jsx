// import { deleteNoteApi, finishComplaintProcessApi, getAllComplaintsForAdminApi, getComplaintByReferenceApi, getComplaintsByDepartment, getComplaintsByEntityApi, getComplaintsByStatuseApi, getNotesByComplaintIdApi, startComplaintProcessApi } from "../data/dash/dashApi";
// import { httpClient } from "../data/http/client";

// export async function getDepartmentComplaints(departmentId) {
//     const data=await getComplaintsByDepartment(departmentId);
//     console.log("DATA FROM API = ", data);
//     const list = Array.isArray(data.complaints) ? data.complaints : [];
//     return list.map((item)=>({
// id:item.id,
// reference:item.reference_number,
// nationalNumber:
//       item.citizen?.national_number ?? "رقم وطني غير متوفر",


//     status: item.status,          // new / ...
//     type: item.type,              // Waste Issue, Road Damage...
//     location: item.location,
//     description: item.description,
//     departmentId: item.department_id,
//     date: item.created_at?.slice(0, 10), // ناخد بس yyyy-mm-dd
// files: item.files,  
// notes: item.notes,
//     // نخزن الشي الكامل للمرحلة الجاية (التفاصيل)
//     raw: item,


//     }))
    
// }

// ////reference////

// export async function getComplaintByReference(reference) {
//   const data = await getComplaintByReferenceApi(reference);
//   console.log("DATA FROM API (reference) =", data);

//   // إذا الريسبونس لافّين الداتا جوّا complaint استعمليها، غير هيك خدي data نفسه
//   const wrapper = data.complaint ?? data;
//   const item = wrapper.complaint ?? wrapper;

//   return {
//     id: item.id,
//     reference: item.reference_number,

//     nationalNumber:
//       item.citizen?.national_number ??
//       item.citizen_id ??             // لو ما رجعلنا object citizen، منستعمل الـ id
//       "رقم وطني غير متوفر",
      

//     status: item.status,
//     type: item.type,
//     location: item.location,
//     departmentId: item.department_id ?? item.government_entity_id ?? "",

//     date: item.created_at ? item.created_at.slice(0, 10) : "",

//     raw: item,
//     files: item.files ?? [],
//   };
// }

// /////status/////
// function mapComplaint(item) {
//   return {
//     id: item.id,
//     reference: item.reference_number,

//     nationalNumber:
//       item.citizen?.national_number ??
//       item.citizen_id ??
//       "رقم وطني غير متوفر",

//     status: item.status,
//     type: item.type,
//     location: item.location,
//     description: item.description,
//     departmentId: item.department_id ?? item.government_entity_id ?? "",
//     date: item.created_at ? item.created_at.slice(0, 10) : "",
//     files: item.files ?? [],
//     notes: item.notes ?? [],
//     raw: item,
//      lockedBy: item.locked_by ?? null,
//     lockedAt: item.locked_at ?? null,
//   };
// }

// export async function getComplaintsByStatuse(status) {
//   const data = await getComplaintsByStatuseApi(status);
//   console.log("DATA FROM API (status) =", data);

//   const list = Array.isArray(data.complaints) ? data.complaints : [];

//   return list.map(mapComplaint);
// }


// /////notes by complaints id

// function mapNote(n){
//   return{
//     id: n.id,
//     complaintId: n.complaint_id,
//     text: n.note,
//     requestedToCitizen: !!n.requested_to_citizen,
//     employeeId: n.employee_id,
//     employeeSerial: n.employee?.serial_number ?? null,
//     createdAt: n.created_at?.slice(0, 10) ?? "",
//   }
// }

// export async function getAllNotesForComplaint(complaintId) {
//   const data = await getNotesByComplaintIdApi(complaintId);
//   console.log("DATA FROM API (complaint id) =", data);

//   const list = Array.isArray(data.notes) ? data.notes : [];  // 👈 هون التعديل
//   return list.map(mapNote);
  
// }


// export async function deleteNote(noteId) {
//   const data = await deleteNoteApi(noteId);
//   console.log("DELETE NOTE RESPONSE =", data);
//   return data;
// }







// export async function getComplaintsByEntity(entityId) {
//   const data = await getComplaintsByEntityApi(entityId);
//   console.log("DATA FROM API (entity) =", data);

//   const list = Array.isArray(data.complaints) ? data.complaints : [];
//   return list.map(mapComplaint);
// }



// export async function startComplaintProcess(reference) {
//   const data = await startComplaintProcessApi(reference);
//   console.log("DATA FROM API (startProcess) =", data);

//   const item = data.complaint ?? data;
//   return mapComplaint(item);
// }

// export async function finishComplaintProcess(reference) {
//   const data = await finishComplaintProcessApi(reference);
//   console.log("DATA FROM API (finishProcess) =", data);

//   const item = data.complaint ?? data;
//   return mapComplaint(item);
// }

// src/domain/complaintsService.js
import {
  getComplaintsByDepartment,
  getComplaintByReferenceApi,
  getComplaintsByStatuseApi,
  getNotesByComplaintIdApi,
  deleteNoteApi,
  getComplaintsByEntityApi,
  startComplaintProcessApi,
  finishComplaintProcessApi,
  addEmployeeNoteApi,
  updateComplaintStatusApi,
  updateNoteApi,
} from "../data/dash/dashApi";

function mapComplaint(item) {
  return {
    id: item.id,
    reference: item.reference_number,

    nationalNumber: item.citizen?.national_number ?? "رقم وطني غير متوفر",

    status: item.status,
    type: item.type,
    location: item.location,
    description: item.description,
    departmentId: item.department_id ?? item.government_entity_id ?? "",
    departmentName: item.department?.name ??  "rrr",
    date: item.created_at ? item.created_at.slice(0, 10) : "",
    files: item.files ?? [],
    notes: item.notes ?? [],
     
    raw: item,

    lockedBy: item.locked_by ?? null,
    lockedAt: item.locked_at ?? null,
  };
}

// ========== شكاوي القسم ==========
export async function getDepartmentComplaints(departmentId) {
  const data = await getComplaintsByDepartment(departmentId);
  console.log("DATA FROM API (department) = ", data);

  const list = Array.isArray(data.complaints) ? data.complaints : [];
  return list.map(mapComplaint);
}

// ========== شكوى برقم المرجع ==========
export async function getComplaintByReference(reference) {
  const data = await getComplaintByReferenceApi(reference);
  console.log("DATA FROM API (reference) =", data);

  const wrapper = data.complaint ?? data;
  const item = wrapper.complaint ?? wrapper;

  return mapComplaint(item);
}

// ========== شكاوي حسب الحالة ==========
export async function getComplaintsByStatuse(status) {
  const data = await getComplaintsByStatuseApi(status);
  console.log("DATA FROM API (status) =", data);

  const list = Array.isArray(data.complaints) ? data.complaints : [];
  return list.map(mapComplaint);
}

function mapNote(n) {
  return {
    id: n.id,
    complaintId: n.complaint_id,
    text: n.note,
    requestedToCitizen: !!n.requested_to_citizen,
    employeeId: n.employee_id,
    employeeSerial: n.employee?.serial_number ?? null,
    createdAt: n.created_at?.slice(0, 10) ?? "",
  };
}
//=======اضافة ملحظة======
export async function addEmployeeNote({ complaintId, note, requested_to_citizen }) {
  const data=await addEmployeeNoteApi({ complaintId, note, requested_to_citizen })
   return mapComplaint(data.complaint);
}
export async function updateComplaintStatus({ complaintId, status }) {
  const data = await updateComplaintStatusApi({
    complaint_id: complaintId,
    status,
  });

  return mapComplaint(data.complaint); // مهم ترجع mapped مثل الباقي
}
//تعديل حالة
export async function getAllNotesForComplaint(complaintId) {
  const data = await getNotesByComplaintIdApi(complaintId);
  console.log("DATA FROM API (complaint id) =", data);

  const list = Array.isArray(data.notes) ? data.notes : [];
  return list.map(mapNote);
}

export async function deleteNote(noteId) {
  const data = await deleteNoteApi(noteId);
  console.log("DELETE NOTE RESPONSE =", data);
  return data;
}

//تعديل/////
export async function updateNote({ noteId, noteText }) {
  const data = await updateNoteApi({ note_id: noteId, note: noteText });

  // حسب صورة Postman: data.data هو النوت المعدلة
  const updated = data?.data?.data ?? data?.data ?? null;
  if (!updated) throw new Error("Update note response invalid");

  return mapNote(updated);
}



// ========== شكاوي الجهة الحكومية (للأدمن) ==========
export async function getComplaintsByEntity() {
  const data = await getComplaintsByEntityApi();
  console.log("DATA FROM API (all entity) =", data);

  // const list = Array.isArray(data.complaints) ? data.complaints : [];
  // return list.map(mapComplaint);
  const list = Array.isArray(data.data) ? data.data : [];
  return list.map(mapComplaint);
}

// ========== بدء / إنهاء معالجة الشكوى (قفل) ==========
export async function startComplaintProcess(referenceNumber) {
  const data = await startComplaintProcessApi(referenceNumber);
  console.log("DATA FROM API (startProcess) =", data);

  // const item = data.complaint ?? data;
  
   const item =
    data?.complaint?.complaint ??   // الشكل المتداخل
    data?.complaint ??              // شكل ثاني محتمل
    data;  
     return mapComplaint(item);
}

export async function finishComplaintProcess(referenceNumber) {
  const data = await finishComplaintProcessApi(referenceNumber);
  console.log("DATA FROM API (finishProcess) =", data);

  // const item = data.complaint ?? data;
  const item =
    data?.complaint?.complaint ??   // ✅ هذا المطلوب لريسبونسك
    data?.complaint ??
    data;
   return mapComplaint(item);
}
