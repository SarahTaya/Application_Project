import { NavLink } from "react-router-dom";
import ThemeToggle from "../../../Theme/ThemeToggle";

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
          to="/admin/chart"
          className="admin-nav__tab"
        >
          الاحصائيات
        </NavLink>

        <NavLink
          to="/admin/errors"
          className="admin-nav__tab"
        >
          الايرورات
        </NavLink>

       

                            {/* زر التبديل */}
      <div style={{ padding: "1px" }}>
        <ThemeToggle />
      </div>


      
      </div>

       
    </nav>
  );
}
