import { useState } from "react";
import TopDonorsReport      from "./TopDonorsReport";
import WasteTypeReport      from "./WasteTypeReport";
import ProcessingQueueReport from "./ProcessingQueueReport";
import GreedyAllocationReport from "./GreedyAllocationReport";

const TABS = [
  { key: "donors",     label: "Top Donors",         icon: "🏆" },
  { key: "wastetype",  label: "Waste Type Frequency", icon: "🥧" },
  { key: "queue",      label: "Processing Queue",    icon: "⏳" },
  { key: "allocation", label: "Greedy Allocation",   icon: "⚙️" },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState("donors");

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

      {/* Tab content */}
      <div>
        {activeTab === "donors"     && <TopDonorsReport />}
        {activeTab === "wastetype"  && <WasteTypeReport />}
        {activeTab === "queue"      && <ProcessingQueueReport />}
        {activeTab === "allocation" && <GreedyAllocationReport />}
      </div>

    </div>
  );
};

export default Reports;
