import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const COLORS = ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow px-3 py-2 text-sm">
        <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
        <p className="text-green-600">{payload[0].value} kg donated</p>
      </div>
    );
  }
  return null;
};

const TopDonorsReport = ({ items }) => {
  const totals = items.reduce((result, item) => {
    const name = item.donorName || "Unknown donor";
    result[name] = (result[name] || 0) + Number(item.weightKg || 0);
    return result;
  }, {});
  const sorted = Object.entries(totals)
    .map(([name, totalKg]) => ({ name, totalKg }))
    .sort((a, b) => b.totalKg - a.totalKg);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Most Active Donors</h3>
        <p className="text-sm text-gray-500 mt-0.5">Ranked by total kg donated</p>
      </div>

      {/* Bar Chart */}
      <div className="bg-white border rounded-xl p-5">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sorted} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              unit=" kg"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="totalKg" radius={[6, 6, 0, 0]}>
              {sorted.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ranked list */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left font-medium text-gray-600">Rank</th>
              <th className="p-3 text-left font-medium text-gray-600">Donor</th>
              <th className="p-3 text-left font-medium text-gray-600">Total Donated</th>
              <th className="p-3 text-left font-medium text-gray-600">Share</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((donor, i) => {
              const total = sorted.reduce((s, d) => s + d.totalKg, 0);
              const pct = total ? ((donor.totalKg / total) * 100).toFixed(1) : "0.0";
              return (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white ${i === 0 ? "bg-yellow-400" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-orange-400" : "bg-gray-200 text-gray-600"}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-gray-800">{donor.name}</td>
                  <td className="p-3 text-green-600 font-semibold">{donor.totalKg} kg</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${pct}%` }}
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
  );
};

export default TopDonorsReport;
