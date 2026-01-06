// src/presentation/admin/AdminDashboard.jsx
import ComplaintsDashboardBase from "../../component/ComplaintsDashboardBase";
import {
  getComplaintByReference,
  getComplaintsByStatuse,
  getComplaintsByEntity,
} from "../../../domain/complaintsService";
import AdminNavBar from "./AdminNavBar";

export default function AdminDashboard() {

  
  const ADMIN_ID = Number(localStorage.getItem("employee_id") || 0);

  const ENTITY_ID = Number(localStorage.getItem("entity_id") || 1);
  console.log("ENTITY_ID from localStorage =", ENTITY_ID);

  async function loadInitialComplaints() {
    return await getComplaintsByEntity(ENTITY_ID);
  }

  async function loadByReference(reference) {
    return await getComplaintByReference(reference);
  }

  async function loadByStatus(status) {
    return await getComplaintsByStatuse(status);
  }

    return (
    <div className="admin-page">
      <AdminNavBar />

      <div className="admin-maindash">
        <ComplaintsDashboardBase
          pageTitle="لوحة تحكم الأدمن"
          pageSubtitle="عرض وإدارة جميع الشكاوي للجهة الحكومية"
          loadInitialComplaints={loadInitialComplaints}
          loadByReference={loadByReference}
          loadByStatus={loadByStatus}
          employeeId={ADMIN_ID}
        />
      </div>
    </div>
  );
}
