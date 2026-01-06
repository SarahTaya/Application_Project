export default function DepartmentCard({ department }) {
  return (
    <div className="employee-card">
      

      <div className="employee-info">
        <span className="employee-name"> اسم القسم : {department.name}</span>
        <span>رقم القسم: {department.id}</span>
        
      </div>

      <div className="employee-info">
        <span >
        الوزارة: {department.governmentName || "-"}
      </span>
        <span>معرف الجهة الحكومية : {department.governmentEntityId}</span>
      </div>

      

      <div className="employee-actions">
        <button className="danger-btn" type="button">
          حذف
        </button>
      </div>
    </div>
  );
}
