import { httpClient } from "../http/client";

export async function getAdminDashboardApi(params = {}) {
  // إذا بدك pagination لاحقاً: params = { page: 1 }
  const res = await httpClient.get("/dashboard", { params });
  return res.data; // نفس الريسبونس يلي بعتلي ياه
}

// GET /api/dashboard/statistics
export async function getDashboardStatisticsApi(params = {}) {
  // إذا عندك باراميترات لاحقاً (date_from/date_to) بتبعتها هون
  const res = await httpClient.get("/dashboard/statistics", { params });
  return res.data; 
  // عندك الريسبونس هون هو نفسه اللي بعته: 
  // { status_summary, department_distribution, ... , general_stats }
}