import { httpClient } from "../http/client";

export async function getAllEmployeesApi() {
  const res = await httpClient.get("/allEmployees");
  return res.data; // { status: "success", data: [...] }
}

export async function getAllCitizensApi() {
  const res = await httpClient.get("/allCitizens");
  return res.data; // { status: "success", data: [...] }
}

export async function getAllDepartmentsApi() {
  const res = await httpClient.get("/allDepartments");
  return res.data; // { status: "success", data: [...] }
}

export function deleteEmployeeApi(employeeId) {
  return httpClient.delete(`/employee/${employeeId}`);
}

export function deleteCitizenApi(CitizenId) {
  return httpClient.delete(`/citizens/${CitizenId}`);
}
