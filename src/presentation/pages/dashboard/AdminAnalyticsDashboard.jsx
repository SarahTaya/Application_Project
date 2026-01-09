import AdminNavBar from "./AdminNavBar";
import "../../styles/AdminAnalyticsDashboard.css";
import DeptDonut from "../../component/charts/DeptDonut";
import ExportMenu from "../../component/ExportMenu";
import { exportReport } from "../../../domain/adminExportService";

import {
  FaChartPie,
  FaMapMarkerAlt,
  FaBuilding,
  FaUsersCog,
  FaDatabase,
  FaHistory,
  FaShieldAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { getAdminDashboard, getDashboardStatistics } from "../../../domain/adminAnalyticsService";
import StatusBarChart from "../../component/charts/StatusBarChart";
import TopLocationsBar from "../../component/charts/TopLocationsBar";

export default function AdminAnalyticsDashboard() {
    const [dash, setDash] = useState(null);
    const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  async function load() {
    try {
      setLoading(true);
      setError("");

      const dashboard = await getAdminDashboard({ page: 1 });
      const statistics = await getDashboardStatistics();

      setDash(dashboard);      // endpoint #1
      setStats(statistics);    // endpoint #2

    } catch (e) {
      console.error(e);
      setError("فشل تحميل لوحة الإحصائيات");
      setDash(null);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  load();
}, []);

  // ===== dummy data (بدون ربط) =====
  // endpoint #2
  // const generalStats = {
  //   total_complaints: 40,
  //   resolved_percentage: 0,
  //   avg_processing_time_minutes: 0,
  // };

  

 

 

  const topEmployees = []; // ممكن يجي لاحقاً
  const employeePerformance = []; // ممكن يجي لاحقاً

  

  const versionsSummary = {
    total_records: 1,
    last_update: "2025-12-24T14:03:52.000000Z",
  };

 

  
  

  return (
    <div className="dash-page">
      <AdminNavBar />

      {/* HERO */}
      <div className="dash-hero">
        <div className="dash-hero-title">
          <h2>لوحة الإحصائيات العامة</h2>
        </div>

        <div className="dash-hero-actions"   >
          
    <ExportMenu
      onPdf={() => exportReport({ type: "statistics", format: "pdf" })}
      onCsv={() => exportReport({ type: "statistics", format: "csv" })}
    />
  
          {/* <button className="btn secondary" type="button">تصدير CSV</button>
          <button className="btn primary" type="button">تصدير PDF</button> */}
        </div>
      </div>

      {/* KPIs (الأهم) */}
      <div className="kpi-grid">
        <KpiCard title="إجمالي الشكاوي" value={stats?.generalStats?.totalComplaints} hint="general_stats" icon={<FaChartPie />} />
        <KpiCard title="نسبة المحلول" value={`${stats?.generalStats?.resolvedPercentage}%`} hint="general_stats" icon={<FaChartPie />} />
        <KpiCard title="متوسط وقت المعالجة"  value={`${stats?.generalStats?.avgProcessingTimeMinutes} دقيقة`} hint="general_stats" icon={<FaChartPie />} />

        <KpiCard title="المستخدمين النشطين" value={dash?.activity?.summary?.activeUsers ?? 0} hint="activity.summary" icon={<FaUsersCog />} />
        <KpiCard title="إجمالي السجلات (Activity)" value={dash?.activity?.summary?.totalLogs ?? 0} hint="activity.summary" icon={<FaHistory />} />
        <KpiCard title="آخر نشاط" value={formatShortDate(dash?.activity?.summary?.lastLog)} hint="activity.summary" icon={<FaHistory />} />

        <KpiCard title="آخر تحديث (Versions)" value={formatShortDate(dash?.versions?.summary?.lastUpdate)} hint="versions.summary" icon={<FaDatabase />} />

         {/* <KpiCard title="Backups (Total)" value={dash?.backupStats?.total} hint="BackupStats" icon={<FaShieldAlt />} />
        <KpiCard title=" Backup فاشل " value={dash?.backupStats?.field} hint="BackupStats" icon={<FaDatabase />} />

        <KpiCard title=" Backup ناجح" value={dash?.backupStats?.success  } hint="BackupStats" icon={<FaShieldAlt />} />  */}
        
        
      </div>

      {/* Charts row */}
      <div className="grid-2">
        <SectionCard title="توزيع الحالات" icon={<FaChartPie />}>
  <StatusBarChart statusSummary={stats?.statusSummary ?? []} />
</SectionCard>

        
<SectionCard title="توزيع الشكاوي على الأقسام" icon={<FaBuilding />}>
  <DeptDonut
    items={(stats?.departmentDistribution ?? []).map((d) => ({
      label: d.label,     // جاهزة من الماب
      value: d.value,     // جاهزة من الماب
    }))}
    topN={9}
  />
</SectionCard>

      </div>

      {/* Charts row 2 */}
      <div className="grid-2">
        <SectionCard title="أكثر المواقع وروداً" icon={<FaMapMarkerAlt />}>
  <TopLocationsBar data={stats?.topLocations ?? []} height={260} />
</SectionCard>

        {/* <SectionCard title="Leaderboard الموظفين" icon={<FaUsersCog />}>
          {(topEmployees.length === 0 && employeePerformance.length === 0) ? (
            <EmptyState text="حالياً بيانات الموظفين (top_employees / employee_performance) فاضية. بس الواجهة جاهزة." />
          ) : (
            <LeaderboardTable rows={[]} />
          )}
        </SectionCard> */}
        <SectionCard title="آخر التعديلات (Versions)" icon={<FaDatabase />}  extra={
    <ExportMenu
      onPdf={() => exportReport({ type: "versions", format: "pdf" })}
      onCsv={() => exportReport({ type: "versions", format: "csv" })}
    />
  }>
          <MiniTable
            columns={["#","رقم الشكوى", "الإجراء",  "الوقت"]}
            rows={(dash?.versions?.logs??[]).map((x) => [ x.id,x.complaintId, x.action,formatShortDate(x.createdAt)     ])}
          />
        </SectionCard>
      </div>

      {/* Bottom tables */}
      <div className="grid-2">
        <SectionCard title="آخر نشاطات النظام (Activity Logs)" icon={<FaHistory />}     extra={
    <ExportMenu
      onPdf={() => exportReport({ type: "activity", format: "pdf" })}
      onCsv={() => exportReport({ type: "activity", format: "csv" })}
    />
  }>
  <div className="table-scroll">
    <MiniTable
      columns={["#", "الوصف", " معلومات الموظف", "الوقت"]}
      rows={(dash?.activity?.logs ?? []).map((x) => [
        x.id,
        x.description,
       x.properties,
        formatShortDate(x.createdAt),
      ])}
    />
  </div>
</SectionCard>

<SectionCard
  title="Backups"
  icon={<FaShieldAlt />}
  extra={
    <ExportMenu
      onPdf={() => exportReport({ type: "backups", format: "pdf" })}
      onCsv={() => exportReport({ type: "backups", format: "csv" })}
    />
  }
>
  <div className="backup-grid">
    <KpiCard title="Backups (Total)" value={dash?.backupStats?.total ?? 0} hint="BackupStats" icon={<FaShieldAlt />} />
    <KpiCard title="Backup ناجح" value={dash?.backupStats?.successful ?? 0} hint="BackupStats" icon={<FaShieldAlt />} />
    <KpiCard title="Backup فاشل" value={dash?.backupStats?.failed ?? 0} hint="BackupStats" icon={<FaShieldAlt />} />
  </div>
</SectionCard>



        
      </div>
    </div>
  );
}

/* ----------------- components ----------------- */

function KpiCard({ title, value, hint, icon }) {
  return (
    <div className="kpi-card">
      <div className="kpi-left">
        <div className="kpi-title">{title}</div>
        <div className="kpi-hint">{hint}</div>
      </div>
      <div className="kpi-right">
        <div className="kpi-value">{value}</div>
        <div className="kpi-icon">{icon}</div>
      </div>
    </div>
  );
}

function SectionCard({ title, icon, children ,extra = null}) {
  return (
    <div className="section-card">
      <div className="section-head">
        <div className="section-title">
          <span className="section-ic">{icon}</span>
          <h3>{title}</h3>
        </div>
            {extra}
      </div>
      <div className="section-body">{children}</div>
    </div>
  );
}





function MiniTable({ columns = [], rows = [] }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => <th key={c}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, idx) => <td key={idx}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeaderboardTable({ rows = [] }) {
  return (
    <MiniTable
      columns={["الموظف", "عدد الشكاوي", "متوسط المعالجة"]}
      rows={rows.map((r) => [r.name, r.total, r.avg])}
    />
  );
}

function EmptyState({ text }) {
  return (
    <div className="empty">
      <div className="empty-title">لا يوجد بيانات</div>
      <div className="empty-text">{text}</div>
    </div>
  );
}




function formatShortDate(iso) {
  if (!iso) return "-";
  // UI فقط
  return iso.replace("T", " ").slice(0, 16);
}
