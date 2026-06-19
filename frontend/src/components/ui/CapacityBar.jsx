const CapacityBar = ({ current, max }) => {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;

  const barColor =
    pct >= 100
      ? "bg-red-500"
      : pct >= 80
      ? "bg-yellow-400"
      : "bg-green-500";

  const textColor =
    pct >= 100
      ? "text-red-600"
      : pct >= 80
      ? "text-yellow-600"
      : "text-green-600";

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">{current} kg / {max} kg</span>
        <span className={`font-semibold ${textColor}`}>{pct.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default CapacityBar;