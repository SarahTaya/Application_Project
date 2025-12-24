import { httpClient } from "../http/client";

export async function getComplaintsByDepartment(departmentId) {
    const res= await httpClient.get(`complaints/department/${departmentId}`);
    
    return res.data;
}



export async function getComplaintByReferenceApi(reference) {
  const res = await httpClient.get(`complaints/reference/${reference}`);
  return res.data;
}


export async function getComplaintsByStatuseApi(status) 
{
const res=await httpClient.get(`complaints/status/${status}`); 
return res.data; 
}

export async function getNotesByComplaintIdApi(complaintId) 
{
const res=await httpClient.get(`get/note/${complaintId}`); 
return res.data; 
}

export async function deleteNoteApi(noteId) {
  // إذا عندكم بالباك إند الطريقة DELETE:
  const res = await httpClient.get(`delete/note/${noteId}`);
  return res.data;}
//اضافة ملاحظة
export async function addEmployeeNoteApi({ complaintId, note, requested_to_citizen }){
  const res=await httpClient.post("/add/note", {
    complaintId,
    note,
    requested_to_citizen,
  });
  return res.data;
}

//تغيير الخالة


export async function updateComplaintStatusApi({ complaint_id, status }) {
  const res = await httpClient.post("/complaints/status", {
    complaint_id,
    status,
  });
  return res.data; // { status, message, complaint }
}
///////////////////Adminnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
// جلب شكاوي جهة حكومية معيّنة
export async function getComplaintsByEntityApi(entityId) {
  const res = await httpClient.get(`complaints/entity/${entityId}`);
  return res.data; // { status, complaints: [...] }
}





export async function addEmployeeApi(payload) {
  const res = await httpClient.post("add-employee", payload);
  return res.data; // متل باقي الدوال: منرجع res.data
}




// بدء معالجة الشكوى (قفل)
export async function startComplaintProcessApi(referenceNumber) {
  const res = await httpClient.post("complaints/startProcess", {
    reference_number: referenceNumber,
  });
  return res.data;
}

// إنهاء معالجة الشكوى (فك القفل)
export async function finishComplaintProcessApi(referenceNumber) {
  const res = await httpClient.post("complaints/finishProcess", {
    reference_number: referenceNumber,
  });
  return res.data;
}
