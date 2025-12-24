// src/app/Routes.jsx
import { Routes, Route } from "react-router-dom";
import Login from "../presentation/pages/auth/Login";
import '../presentation/styles/Login.css'
import Forget from "../presentation/pages/auth/Forget";
import VerifyCode from "../presentation/pages/auth/VerifyCode";
import NewPassword from "../presentation/pages/auth/NewPassword";
import Dashboard from "../presentation/pages/dashboard/Dashboard";
import AdminDashboard from "../presentation/pages/dashboard/AdminDashboard";
import UsersPage from "../presentation/pages/dashboard/UsersPage";
import EmployeesPage from "../presentation/pages/dashboard/EmployeesPage";

// import Dashboard from "../presentation/pages/dashboard/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
       <Route path="/forget" element={<Forget />} />
       <Route path="/code" element={<VerifyCode/>} />
        <Route path="/reset" element={<NewPassword/>} />
        <Route path="/admindash" element={<Dashboard/>} />
        <Route path="/adminadmin" element={<AdminDashboard />} />
        <Route path="/admin/complaints" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/employees" element={<EmployeesPage/>} />

      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
    </Routes>
  );
}
