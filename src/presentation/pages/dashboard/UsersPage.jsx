import { useEffect, useState } from "react";
import AdminNavBar from "./AdminNavBar";
import "../../styles/Adminstratev.css";
import "../../styles/Login.css";

import AdminstratevDevs from "../../component/AdminstratevDevs";
import EmployeeCard from "../../component/EmployeeCard";
import CitizenCard from "../../component/CitizenCard";
import { FaUsers, FaUserTie, FaBuilding } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import { getAllEmployees, getAllCitizens, getAllDepartment, getAllDepartments } from "../../../domain/employeesService";
import DepartmentCard from "../../component/DepartmentCard";
import SectionIcon from "../../component/SectionIcon";

export default function UsersPage() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [dep, setdep] = useState([]);

  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [errorEmployees, setErrorEmployees] = useState("");

  const [loadingCitizens, setLoadingCitizens] = useState(false);
  const [errorCitizens, setErrorCitizens] = useState("");

  useEffect(() => {
    async function loadEmployees() {
      try {

        const list = await getAllEmployees();
        setEmployees(list);
      } catch (e) {
        console.error(e);
        setErrorEmployees("فشل تحميل الموظفين");
        setEmployees([]);
      }
    }

    async function loadCitizens() {
      try {

        const list = await getAllCitizens();
        setCitizens(list);
      } catch (e) {
        console.error(e);
        setErrorCitizens("فشل تحميل المواطنين");
        setCitizens([]);
      }
    }


    async function loadDepartments() {
      try {

        const list = await getAllDepartments();
        setdep(list);
      } catch (e) {
        console.error(e);
        setErrorCitizens("فشل تحميل ");
        setdep([]);
      }
    }

    loadEmployees();
    loadCitizens();
    loadDepartments();
  }, []);

  function handleEmployeeDeleted(id) {
    setEmployees(prev => prev.filter(e => e.id !== id));
  }

  function handleCitizenDeleted(id) {
    setCitizens(prev => prev.filter(e => e.id !== id));
  }


  return (

    <div className="main_Admistratev">
      <AdminNavBar />

      <div className="devs-col">
        <AdminstratevDevs icon={<SectionIcon Icon={FaUserTie} />} title="الموظفين المتاحين :" buttonText=" إضافة موظف" onClick={() => navigate("/admin/employees ")}>
          {loadingEmployees && <div className="loading-text">جاري التحميل...</div>}
          {errorEmployees && <div className="error-text">{errorEmployees}</div>}
          {!loadingEmployees && !errorEmployees && employees.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} onDeleted={handleEmployeeDeleted} />
          ))}
        </AdminstratevDevs>

        <AdminstratevDevs icon={<SectionIcon Icon={FaUsers} />} title="المواطنين المتاحين :" >
          {!loadingCitizens && !errorCitizens && citizens.map((cit) => (
            <CitizenCard key={cit.id} citizen={cit} onDeleted={handleCitizenDeleted} />
          ))}
        </AdminstratevDevs>

        <AdminstratevDevs icon={<SectionIcon Icon={FaBuilding} />} title="الاقسام المتاحة :" buttonText=" إضافة قسم">
          {dep.map((dep) => <DepartmentCard key={dep.id} department={dep} />
          )}
        </AdminstratevDevs>
      </div>
    </div>
  );
}
