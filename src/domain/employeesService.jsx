// src/domain/employeesService.js
import { deleteCitizenApi, deleteEmployeeApi, geAllDepartmentsApi, getAllCitizensApi, getAllDepartmentsApi, getAllEmployeesApi } from "../data/dash/adminUsersApi";
import { addEmployeeApi } from "../data/dash/dashApi";

function mapEmployeeUser(user) {
  const employee = user.employee ?? {};
  const firstRole = Array.isArray(user.roles) ? user.roles[0] : null;

  return {
    id: user.id,
    fName: user.f_name,
    lName: user.l_name,
    fullName: `${user.f_name} ${user.l_name}`,
    phone: user.phone_number,
    roleId: user.role_id,
    roleName: firstRole?.name ?? null,

    employeeId: employee.id ?? null,
    departmentId: employee.department_id ?? null,
    serialNumber: employee.serial_number ?? null,
    status: employee.status ?? null,
    lastLoginAt: employee.last_login_at ?? null,

    raw: user, // خلي النسخة الكاملة لأي استخدام لاحق
  };
}

export async function addEmployee(input) {
  const payload = {
    f_name: input.f_name,
    l_name: input.l_name,
    phone_number: input.phone_number,
    serial_number: input.serial_number,
    department_id: Number(input.department_id),
    password: input.password,
    password_confirmation: input.password_confirmation,
  };

  const data = await addEmployeeApi(payload);
  console.log("DATA FROM API (add employee) =", data);

  const user = data.result?.user ?? data.user ?? data;
  return mapEmployeeUser(user);
}
////users/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mapEmployee(raw) {
  return {
    id: raw.id,
    serialNumber: raw.serial_number,
    status: raw.status,
    lastLoginAt: raw.last_login_at,

    fullName: `${raw.user?.f_name ?? ""} ${raw.user?.l_name ?? ""}`.trim(),
    phoneNumber: raw.user?.phone_number ?? "",

    departmentName: raw.department?.name ?? "",
    departmentId: raw.department?.id ?? null,
  };
}

export async function getAllEmployees() {
  const data = await getAllEmployeesApi();
  const list = Array.isArray(data?.data) ? data.data : [];
  return list.map(mapEmployee);
}



function mapCitizen(raw) {
  return {
    id: raw.id,
    nationalNumber: raw.national_number,
    email: raw.email,

    fullName: `${raw.user?.f_name ?? ""} ${raw.user?.l_name ?? ""}`.trim(),
    phoneNumber: raw.user?.phone_number ?? "",
  };
}

export async function getAllCitizens() {
  const data = await getAllCitizensApi();
  const list = Array.isArray(data?.data) ? data.data : [];
  return list.map(mapCitizen);
}

// ////////////////////////////////اقسااام///////////////////////////
function mapDepartment(raw) {
  return {
    id: raw.id,
    name: raw.name,
    governmentEntityId: raw.government_entity_id,

    // اسم الوزارة/الجهة العليا
    governmentName: raw.governments?.name ?? "",
    governmentId: raw.governments?.id ?? null,
  };
}

export async function getAllDepartments() {
  const data = await getAllDepartmentsApi();
  const list = Array.isArray(data?.data) ? data.data : [];
  return list.map(mapDepartment);
}


export async function deleteEmployee(employeeId) {
  const res = await deleteEmployeeApi(employeeId);
  return res.data;
}

export async function deleteCitizen(CitizenId) {
  const res = await deleteCitizenApi(CitizenId);
  return res.data;
}