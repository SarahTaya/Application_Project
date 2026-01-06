import { deleteCitizen } from "../../domain/employeesService";

export default function CitizenCard({ citizen,onDeleted }) {



async function handleDeleteCitizen() {
  const ok = window.confirm("متأكد بدك تحذف ");
  if (!ok) return;

  try {
    await deleteCitizen(citizen.id); 
    onDeleted?.(citizen.id);

    

   
  } catch (e) {
    console.error(e);
    alert("فشل حذف ");
  }
}


  return (
    <div className="employee-card">
      {/* عم نستخدم نفس ستايل employee-card كرمال يكون شكلو موحد */}
      

      <div className="employee-info">
        {/* <span>رقم المواطن: {citizen.id}</span> */}
        <span className="employee-name">الاسم: {citizen.fullName}</span>
        <span>الرقم الوطني: {citizen.nationalNumber}</span>
      </div>

      <div className="employee-info">
        <span>الهاتف: {citizen.phoneNumber || "-"}</span>
        <span>الإيميل: {citizen.email || "-"}</span>
      </div>

      <div className="employee-actions">
        <button className="danger-btn" type="button"  onClick={handleDeleteCitizen}>
          حذف
        </button>
      </div>
    </div>
  );
}
