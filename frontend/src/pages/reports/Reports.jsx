import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FiBarChart2,
  FiCheckCircle,
  FiPackage,
  FiTrendingUp,
  FiTruck,
} from "react-icons/fi";
import { hasRole } from "../../utils/auth";
import { getFullReport, getTopDonors, getWasteTypeFrequency, getWasteTypeWeight } from "../../utils/reportApi";

const CHART_COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#84CC16",
];

const formatWasteType = (value) => {
  if (!value) return "Unknown";
  return String(value)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/(^\w|\s\w)/g, (letter) => letter.toUpperCase());
};

const normalizeChartData = (payload = {}) =>
  Object.entries(payload).map(([name, value]) => ({
    name: formatWasteType(name),
    value: Number(value) || 0,
  }));

const formatKg = (value) => `${Number(value || 0).toFixed(1)} kg`;

const Reports = () => {
  const canViewReports = hasRole("ROLE_ADMIN") || hasRole("ROLE_OPERATOR");
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!canViewReports) return;

    const loadReports = async () => {
      setLoading(true);
      setError("");

      try {
        const [fullReport, wasteTypeFrequency, wasteTypeWeight, topDonors] = await Promise.all([
          getFullReport(),
          getWasteTypeFrequency(),
          getWasteTypeWeight(),
          getTopDonors(5),
        ]);

        setReport({
          fullReport,
          wasteTypeFrequency,
          wasteTypeWeight,
          topDonors,
        });
      } catch (requestError) {
        setError(requestError.message || "Unable to load reports.");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [canViewReports]);

  const summaryCards = useMemo(() => {
    const full = report.fullReport || {};

    return [
      {
        label: "Total Items",
        value: full.totalItems ?? 0,
        icon: <FiPackage className="text-blue-600" size={20} />,
        accent: "bg-blue-50 text-blue-700",
      },
      {
        label: "Processed",
        value: full.processedItems ?? 0,
        icon: <FiCheckCircle className="text-emerald-600" size={20} />,
        accent: "bg-emerald-50 text-emerald-700",
      },
      {
        label: "Pending",
        value: full.pendingItems ?? 0,
        icon: <FiTruck className="text-amber-600" size={20} />,
        accent: "bg-amber-50 text-amber-700",
      },
      {
        label: "Total Weight",
        value: formatKg(full.totalWeightKg),
        icon: <FiTrendingUp className="text-violet-600" size={20} />,
        accent: "bg-violet-50 text-violet-700",
      },
    ];
  }, [report]);

  const frequencyData = useMemo(
    () => normalizeChartData(report.wasteTypeFrequency || report.fullReport?.byTypeCount),
    [report]
  );

  const weightData = useMemo(
    () => normalizeChartData(report.wasteTypeWeight || report.fullReport?.byTypeWeightKg),
    [report]
  );

  const donorRows = report.topDonors || report.fullReport?.topDonors || [];

  if (!canViewReports) {
    return (
      <div className="p-6 text-sm text-red-600">
        Reports are available to ADMIN and OPERATOR users only.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">
            Waste type, weight, and donor insights from the backend reporting API.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700">
          <FiBarChart2 size={16} />
          Live analytics
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
          Loading reports...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <div key={card.label} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                <div className="mb-4 flex items-center justify-between">
                  <div className={`rounded-lg p-2 ${card.accent}`}>{card.icon}</div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="mt-1 text-sm text-gray-500">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Waste Type Frequency</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={frequencyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {frequencyData.map((entry, index) => (
                        <Cell key={`${entry.name}-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Waste Type Weight</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={weightData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {weightData.map((entry, index) => (
                        <Cell key={`${entry.name}-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatKg(value), "Weight"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Weight by Waste Type</h3>
              <div className="space-y-3">
                {weightData.length > 0 ? (
                  weightData.map((item, index) => (
                    <div key={`${item.name}-${index}`}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <span className="text-gray-500">{formatKg(item.value)}</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max((item.value / Math.max(...weightData.map((entry) => entry.value), 1)) * 100, 8)}%`,
                            backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No waste weight data available.</p>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Top Donors</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-700">Donor</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Total Donated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donorRows.length > 0 ? (
                      donorRows.map((donor, index) => (
                        <tr key={`${donor.donorName || "donor"}-${index}`} className="border-t border-gray-200">
                          <td className="px-4 py-3 text-gray-700">{donor.donorName || "Unknown"}</td>
                          <td className="px-4 py-3 text-gray-700">{formatKg(donor.totalKg)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="px-4 py-6 text-center text-sm text-gray-500">
                          No donor data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
