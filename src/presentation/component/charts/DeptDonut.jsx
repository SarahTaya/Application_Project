import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#c07922ff", "#7c3aed", "#10b981", "#f59e0b",
  "#ef4444", "#d0d406ff", "#8b5cf6", "#22c55e",
  "#fb7185", "#1f6feb",
];

export default function DeptDonut({ items = [], topN = 9 }) {
  // ترتيب تنازلي
  const sorted = [...items].sort((a, b) => b.value - a.value);

  const top = sorted.slice(0, topN);
  const rest = sorted.slice(topN);

  const restSum = rest.reduce((s, x) => s + x.value, 0);

  const data = restSum > 0
    ? [...top, { label: "أخرى", value: restSum }]
    : top;

  return (
    <div className="dept-donut-chart">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => [`${value}`, "عدد الشكاوي"]}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
