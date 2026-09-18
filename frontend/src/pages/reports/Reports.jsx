import { hasRole } from "../../utils/auth";

const Reports = () => {
  const canViewReports = hasRole("ROLE_ADMIN") || hasRole("ROLE_OPERATOR");

  if (!canViewReports) {
    return <div className="p-6 text-sm text-red-600">Reports are available to ADMIN and OPERATOR users only.</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reports Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          Backend reporting APIs are ready.
        </p>
      </div>
    </div>
  );
};

export default Reports;
