const StatCard = ({ label, value, icon, color = "green" }) => {
  const colorMap = {
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const iconBg = {
    green: "bg-green-100",
    red: "bg-red-100",
    yellow: "bg-yellow-100",
    blue: "bg-blue-100",
  };

  return (
    <div className={`rounded-xl border p-4 flex items-center gap-4 ${colorMap[color]}`}>
      {icon && (
        <div className={`p-3 rounded-full text-xl ${iconBg[color]}`}>
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-medium opacity-70">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;