import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

const STATUS_ORDER = [
  "new",
  "processing",
  "need_more_info",
  "resubmitted",
  "resolved",
  "rejected",
];
const STATUS_COLORS = {
  new: "#2563eb",            // أزرق – جديد
  processing: "#f59e0b",     // برتقالي – قيد المعالجة
  need_more_info: "#8b5cf6", // بنفسجي – بحاجة معلومات
  resubmitted: "#06b6d4",    // سماوي – معاد الإرسال
  resolved: "#10b981",       // أخضر – مغلق
  rejected: "#ef4444",       // أحمر – مرفوض
};


const STATUS_AR = {
  new: "جديد",
  processing: "قيد المعالجة",
  need_more_info: "بحاجة معلومات",
  resubmitted: "معاد الإرسال",
  resolved: "مغلق",
  rejected: "مرفوض",
};

function normalizeStatusSummary(statusSummary = []) {
  const map = new Map();

  (Array.isArray(statusSummary) ? statusSummary : []).forEach((x) => {
    const key = (x?.status ?? "").toLowerCase();
    const total = Number(x?.total ?? 0) || 0;
    if (key) map.set(key, total);
  });

  return STATUS_ORDER.map((key) => ({
    status: key,
    name: STATUS_AR[key] ?? key,
    total: map.get(key) ?? 0,
  }));
}

export default function StatusBarChart({ statusSummary = [], height = 260 }) {
  const data = normalizeStatusSummary(statusSummary);

  return (
    <div className="status-bar-chart">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
  <YAxis allowDecimals={false} />

  <Tooltip
    formatter={(value) => [`${value}`, "عدد الشكاوي"]}
    labelFormatter={(label) => `الحالة: ${label}`}
  />

  <Bar
    dataKey="total"
    barSize={24}
    radius={[8, 8, 0, 0]}
  >
    {data.map((entry, index) => (
      <Cell
        key={`cell-${index}`}
        fill={STATUS_COLORS[entry.status] || "#64748b"}
      />
    ))}
  </Bar>
</BarChart>

      </ResponsiveContainer>
    </div>
  );
}
