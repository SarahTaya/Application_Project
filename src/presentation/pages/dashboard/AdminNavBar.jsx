import { NavLink } from "react-router-dom";

export default function AdminNavBar() {
  return (
    <nav className="admin-nav">
      <div className="admin-nav__logo">لوحة تحكم الأدمن</div>

      <div className="admin-nav__tabs">
        <NavLink
          to="/admin/complaints"
          className="admin-nav__tab"
        >
          الشكاوي
        </NavLink>

        <NavLink
          to="/admin/users"
          className="admin-nav__tab"
        >
          المستخدمين
        </NavLink>

        <NavLink
          to="/admin/employees"
          className="admin-nav__tab"
        >
          الموظفين
        </NavLink>
      </div>
    </nav>
  );
}
