const DUMMY_QUEUE = [
  { id: 3,  type: "MEAT",       weight: 45,  expiry: "2026-06-19", donorName: "Fresh Market",     centerLocation: "Lalitpur - Patan"        },
  { id: 1,  type: "VEGETABLES", weight: 120, expiry: "2026-06-21", donorName: "Green Farm Foods",  centerLocation: "Kathmandu - Baneshwor"   },
  { id: 2,  type: "FRUITS",     weight: 80,  expiry: "2026-06-22", donorName: "Green Farm Foods",  centerLocation: "Pokhara - Lakeside"      },
  { id: 7,  type: "OTHER",      weight: 15,  expiry: "2026-06-23", donorName: "Pokhara Organics",  centerLocation: "Lalitpur - Patan"        },
  { id: 6,  type: "BEVERAGES",  weight: 30,  expiry: "2026-06-24", donorName: "Green Farm Foods",  centerLocation: "Pokhara - Lakeside"      },
  { id: 4,  type: "GRAINS",     weight: 200, expiry: "2026-06-25", donorName: "Pokhara Organics",  centerLocation: "Pokhara - Lakeside"      },
];

const WASTE_TYPE_COLORS = {
  VEGETABLES: "bg-green-100 text-green-700",
  DAIRY:      "bg-blue-100 text-blue-700",
  GRAINS:     "bg-yellow-100 text-yellow-700",
  MEAT:       "bg-red-100 text-red-700",
  FRUITS:     "bg-orange-100 text-orange-700",
  BEVERAGES:  "bg-purple-100 text-purple-700",
  OTHER:      "bg-gray-100 text-gray-700",
};

const urgencyLabel = (expiry) => {
  const today = new Date();
  const exp   = new Date(expiry);
  const days  = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  if (days < 0)  return { label: "Expired",   cls: "bg-red-100 text-red-700",      dot: "bg-red-500"    };
  if (days <= 1) return { label: "Critical",  cls: "bg-red-100 text-red-700",      dot: "bg-red-500"    };
  if (days <= 3) return { label: "Urgent",    cls: "bg-orange-100 text-orange-700", dot: "bg-orange-500" };
  if (days <= 7) return { label: "Soon",      cls: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" };
  return               { label: "OK",         cls: "bg-green-100 text-green-700",   dot: "bg-green-500"  };
};

const ProcessingQueueReport = () => {
  // Already sorted by expiry (earliest first = highest priority)
  const queue = [...DUMMY_QUEUE].sort((a, b) => new Date(a.expiry) - new Date(b.expiry));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Processing Queue</h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Unprocessed items sorted by expiry date — earliest first (highest priority)
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Expired / Critical (≤1 day)", dot: "bg-red-500"    },
          { label: "Urgent (≤3 days)",             dot: "bg-orange-500" },
          { label: "Soon (≤7 days)",               dot: "bg-yellow-500" },
          { label: "OK (>7 days)",                 dot: "bg-green-500"  },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className={`w-2 h-2 rounded-full inline-block ${l.dot}`} />
            {l.label}
          </span>
        ))}
      </div>

      {/* Queue list */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left font-medium text-gray-600">Priority</th>
              <th className="p-3 text-left font-medium text-gray-600">Type</th>
              <th className="p-3 text-left font-medium text-gray-600">Weight</th>
              <th className="p-3 text-left font-medium text-gray-600">Expiry</th>
              <th className="p-3 text-left font-medium text-gray-600">Donor</th>
              <th className="p-3 text-left font-medium text-gray-600">Center</th>
              <th className="p-3 text-left font-medium text-gray-600">Urgency</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((item, i) => {
              const urgency = urgencyLabel(item.expiry);
              return (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                      #{i + 1}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${WASTE_TYPE_COLORS[item.type]}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="p-3 font-medium">{item.weight} kg</td>
                  <td className="p-3 text-gray-600">{item.expiry}</td>
                  <td className="p-3 text-gray-700">{item.donorName}</td>
                  <td className="p-3 text-gray-600">{item.centerLocation}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${urgency.cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${urgency.dot}`} />
                      {urgency.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400">
        Total unprocessed: {queue.length} items · {queue.reduce((s, i) => s + i.weight, 0)} kg
      </p>
    </div>
  );
};

export default ProcessingQueueReport;
