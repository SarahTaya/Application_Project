import { deleteEmployee } from "../../domain/employeesService";

export default function EmployeeCard({ employee, onDeleted }) {
  async function handleDeleteEmployee() {
    const ok = window.confirm("متأكد بدك تحذف هالموظف؟");
    if (!ok) return;

    try {
      // await deleteEmployee(employee.id);
      // alert("تم حذف الموظف بنجاح");

      onDeleted?.(employee.id); // ✅ هون المهم
    } catch (e) {
      console.error(e);
      alert("فشل حذف الموظف");
    }
  }

  return (
    <div className="employee-card">
      <div className="employee-info">
        <span> الاسم: {employee.fullName}</span>
        <span>الرقم التسلسلي: {employee.serialNumber}</span>
      </div>

      <div className="employee-info">
        <span>الهاتف: {employee.phoneNumber || "-"}</span>
        <span>القسم: {employee.departmentName || "-"}</span>
      </div>

      <div className="employee-actions">
        <button className="danger-btn" type="button" onClick={handleDeleteEmployee}>
          حذف
        </button>
      </div>
    </div>
  );
}
