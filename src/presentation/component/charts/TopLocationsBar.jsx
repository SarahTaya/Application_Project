import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#1f6feb", "#7c3aed", "#10b981", "#f59e0b",
  "#ef4444", "#06b6d4", "#8b5cf6", "#22c55e",
  "#fb7185", "#64748b",
];

// data: [{ location: "الرقة - المدينة", total: 5 }, ...]
export default function TopLocationsBar({ data = [], height = 260 }) {
  const safe = Array.isArray(data)
    ? data.map((x) => ({
        name: x?.location ?? "",
        total: Number(x?.total ?? 0),
      }))
    : [];

  return (
    <div className="toploc-chart" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={safe}
          margin={{ top: 10, right: 16, left: 0, bottom: 16 }}
          barCategoryGap={18}
        >
          {/* شبكة خفيفة بدل الشكل “الأسود” */}
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            interval={0}
            height={60}
            tickMargin={10}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />

          <Tooltip
            formatter={(v) => [`${v}`, "عدد الشكاوي"]}
            labelFormatter={(label) => `الموقع: ${label}`}
          />

          {/* أهم شغلتين:
              1) fill شفاف/عادي
              2) Cell لكل عمود لونه */}
          <Bar dataKey="total" radius={[10, 10, 0, 0]} barSize={26}>
            {safe.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
