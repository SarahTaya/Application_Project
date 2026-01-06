import { getAdminDashboardApi, getDashboardStatisticsApi } from "../data/dash/adminAnalyticsApi";

function mapBackupStats(raw) {
  const b = raw?.BackupStats ?? {};
  return {
    total: b.total_backups ?? 0,
    success: b.successful_backups ?? 0,
    failed: b.failed_backups ?? 0,
    lastSuccess: b.last_successful_backup ?? null,
  };
}

function mapVersions(raw) {
  const v = raw?.versions ?? {};
  const summary = v.summary ?? {};
  const page = v.data ?? {};
  const list = Array.isArray(page.data) ? page.data : [];

  return {
    summary: {
      totalRecords: summary.total_records ?? 0,
      lastUpdate: summary.last_update ?? null,
    },
    pagination: {
      currentPage: page.current_page ?? 1,
      perPage: page.per_page ?? 20,
      total: page.total ?? list.length,
      lastPage: page.last_page ?? 1,
    },
    logs: list.map((x) => ({
      id: x.id,
      complaintId: x.complaint_id ?? null,
      action: x.action ?? "",
      fieldName: x.field_name ?? "",
      oldValue: x.old_value ?? null,
      newValue: x.new_value ?? null,
      createdBy: x.created_by ?? null,
      createdAt: x.created_at ?? null,
    })),
  };
}

function mapActivity(raw) {
  const a = raw?.activity ?? {};
  const summary = a.summary ?? {};
  const page = a.data ?? {};
  const list = Array.isArray(page.data) ? page.data : [];

  return {
    summary: {
      totalLogs: summary.total_logs ?? 0,
      activeUsers: summary.active_users ?? 0,
      lastLog: summary.last_log ?? null,
    },
    pagination: {
      currentPage: page.current_page ?? 1,
      perPage: page.per_page ?? 20,
      total: page.total ?? list.length,
      lastPage: page.last_page ?? 1,
    },
    logs: list.map((x) => ({
      id: x.id,
      description: x.description ?? "",
      subjectType: x.subject_type ?? "",
      causerId: x.causer_id ?? null,
      properties: Array.isArray(x.properties) ? x.properties : [],
      createdAt: x.created_at ?? null,
    })),
  };
}

export async function getAdminDashboard(params = {}) {
  const data = await getAdminDashboardApi(params);

  // data = { status, data: {...} }
  const root = data?.data ?? {};

  return {
    backupStats: mapBackupStats(root),
    versions: mapVersions(root),
    activity: mapActivity(root),
  };
}

/////////////////////////////////////////////////////////////////////////////////
function mapStatusSummary(list) {
  const arr = Array.isArray(list) ? list : [];
  return arr.map((x) => ({
    status: x?.status ?? "",
    total: x?.total ?? 0,
  }));
}

function mapDepartmentDistribution(list) {
  const arr = Array.isArray(list) ? list : [];
  return arr.map((x) => ({
    departmentId: x?.department_id ?? null,
    total: x?.total ?? 0,
    department: {
      id: x?.department?.id ?? null,
      name: x?.department?.name ?? "",
    },
    // مفيد للـ chart مباشرة
    label: x?.department?.name ?? `Department #${x?.department_id ?? ""}`,
    value: x?.total ?? 0,
  }));
}

function mapTopLocations(list) {
  const arr = Array.isArray(list) ? list : [];
  return arr.map((x) => ({
    location: x?.location ?? "",
    total: x?.total ?? 0,
    label: x?.location ?? "",
    value: x?.total ?? 0,
  }));
}

function mapGeneralStats(obj) {
  const g = obj ?? {};
  return {
    totalComplaints: g?.total_complaints ?? 0,
    resolvedPercentage: g?.resolved_percentage ?? 0,
    avgProcessingTimeMinutes: g?.avg_processing_time_minutes ?? 0,
  };
}

function mapEmployeePerformance(list) {
  const arr = Array.isArray(list) ? list : [];
  return arr.map((x) => ({
    employeeId: x?.employee_id ?? null,
    employeeName: x?.employee?.name ?? x?.employee_name ?? "",
    total: x?.total ?? 0,
    avgMinutes: x?.avg_processing_time_minutes ?? x?.avg_minutes ?? null,
  }));
}

function mapTopEmployees(list) {
  const arr = Array.isArray(list) ? list : [];
  return arr.map((x) => ({
    employeeId: x?.employee_id ?? null,
    name: x?.name ?? x?.employee?.name ?? "",
    total: x?.total ?? 0,
    avgMinutes: x?.avg_processing_time_minutes ?? x?.avg_minutes ?? null,
  }));
}

export async function getDashboardStatistics(params = {}) {
  const raw = await getDashboardStatisticsApi(params);

  return {
    statusSummary: mapStatusSummary(raw?.status_summary),
    departmentDistribution: mapDepartmentDistribution(raw?.department_distribution),
    employeePerformance: mapEmployeePerformance(raw?.employee_performance),
    topLocations: mapTopLocations(raw?.top_locations),
    topEmployees: mapTopEmployees(raw?.top_employees),
    generalStats: mapGeneralStats(raw?.general_stats),

    // إذا بدك تحتفظ بالخام لأي طاري
    raw,
  };
}
