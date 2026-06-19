import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const DUMMY_WASTE_FREQUENCY = [
  { type: "VEGETABLES", count: 38, totalKg: 520 },
  { type: "FRUITS",     count: 25, totalKg: 310 },
  { type: "DAIRY",      count: 18, totalKg: 240 },
  { type: "GRAINS",     count: 15, totalKg: 410 },
  { type: "MEAT",       count: 10, totalKg: 180 },
  { type: "BEVERAGES",  count: 8,  totalKg: 95  },
  { type: "OTHER",      count: 6,  totalKg: 70  },
];

const COLORS = {
  VEGETABLES: "#16a34a",
  FRUITS:     "#f97316",
  DAIRY:      "#3b82f6",
  GRAINS:     "#eab308",
  MEAT:       "#ef4444",
  BEVERAGES:  "#a855f7",
  OTHER:      "#6b7280",
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow px-3 py-2 text-sm">
        <p className="font-semibold text-gray-800">{d.type}</p>
        <p className="text-gray-600">{d.count} items</p>
        <p className="text-gray-600">{d.totalKg} kg total</p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap gap-2 justify-center mt-2">
    {payload.map((entry, i) => (
      <span key={i} className="flex items-center gap-1 text-xs text-gray-600">
        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: entry.color }} />
        {entry.value}
      </span>
    ))}
  </div>
);

const WasteTypeReport = () => {
  const total = DUMMY_WASTE_FREQUENCY.reduce((s, d) => s + d.count, 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Waste Type Frequency</h3>
        <p className="text-sm text-gray-500 mt-0.5">Distribution of waste items by category</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Donut chart */}
        <div className="bg-white border rounded-xl p-5">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={DUMMY_WASTE_FREQUENCY}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
              >
                {DUMMY_WASTE_FREQUENCY.map((entry) => (
                  <Cell key={entry.type} fill={COLORS[entry.type]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown table */}
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left font-medium text-gray-600">Type</th>
                <th className="p-3 text-left font-medium text-gray-600">Items</th>
                <th className="p-3 text-left font-medium text-gray-600">Total kg</th>
                <th className="p-3 text-left font-medium text-gray-600">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_WASTE_FREQUENCY.sort((a, b) => b.count - a.count).map((row) => {
                const pct = ((row.count / total) * 100).toFixed(1);
                return (
                  <tr key={row.type} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-full text-white"
                        style={{ background: COLORS[row.type] }}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="p-3 font-medium">{row.count}</td>
                    <td className="p-3 text-gray-600">{row.totalKg} kg</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${pct}%`, background: COLORS[row.type] }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default WasteTypeReport;
