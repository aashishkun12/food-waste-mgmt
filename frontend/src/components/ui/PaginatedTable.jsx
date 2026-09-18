import { useEffect, useMemo, useState } from "react";
import Table from "./Table";

const PaginatedTable = ({ columns, data, pageSize = 8 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((data?.length || 0) / pageSize)),
    [data, pageSize]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [data?.length]);

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const visibleRows = useMemo(
    () => (data || []).slice(startIndex, startIndex + pageSize),
    [data, startIndex, pageSize]
  );

  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
  };

  return (
    <div className="space-y-3">
      <div className="min-h-[360px]">
        <Table columns={columns} data={visibleRows} />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <button
            onClick={() => goToPage(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Page</span>
            <span className="font-semibold text-gray-800">{safeCurrentPage}</span>
            <span>of {totalPages}</span>
          </div>

          <button
            onClick={() => goToPage(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginatedTable;
