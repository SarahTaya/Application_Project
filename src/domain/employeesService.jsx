// src/domain/employeesService.js
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
