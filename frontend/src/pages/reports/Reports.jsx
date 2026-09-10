import { useEffect, useState } from "react";
import TopDonorsReport      from "./TopDonorsReport";
import WasteTypeReport      from "./WasteTypeReport";
import ProcessingQueueReport from "./ProcessingQueueReport";
import GreedyAllocationReport from "./GreedyAllocationReport";
import { hasRole } from "../../utils/auth";
import { getReportData } from "../../utils/reportApi";

const TABS = [
  { key: "donors",     label: "Top Donors",         icon: "🏆" },
  { key: "wastetype",  label: "Waste Type Frequency", icon: "🥧" },
  { key: "queue",      label: "Processing Queue",    icon: "⏳" },
  { key: "allocation", label: "Greedy Allocation",   icon: "⚙️" },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState("donors");
  const [reportData, setReportData] = useState({ items: [], queue: [], processors: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const canViewReports = hasRole("ROLE_ADMIN") || hasRole("ROLE_OPERATOR");

  useEffect(() => {
    if (!canViewReports) {
      setLoading(false);
      return;
    }
    getReportData()
      .then(([items, queue, processors]) => setReportData({ items: items || [], queue: queue || [], processors: processors || [] }))
      .catch((requestError) => setError(requestError.message || "Unable to load reports."))
      .finally(() => setLoading(false));
  }, [canViewReports]);

  if (!canViewReports) {
    return <div className="p-6 text-sm text-red-600">Reports are available to ADMIN and OPERATOR users only.</div>;
  }

  return (
    <div className="p-6">

      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reports & Statistics</h2>
        <p className="text-sm text-gray-500 mt-1">
          Analytics and insights across donors, waste types, and processors
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white text-green-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {loading ? <p className="text-gray-500">Loading reports...</p> : <div>
        {activeTab === "donors" && <TopDonorsReport items={reportData.items} />}
        {activeTab === "wastetype" && <WasteTypeReport items={reportData.items} />}
        {activeTab === "queue" && <ProcessingQueueReport items={reportData.queue} />}
        {activeTab === "allocation" && <GreedyAllocationReport processors={reportData.processors} />}
      </div>}

    </div>
  );
};

export default Reports;
