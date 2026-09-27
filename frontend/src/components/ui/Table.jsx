const Table = ({ columns, data, responsiveCards = true }) => {
  const renderCell = (column, row) => column.render ? column.render(row) : row[column.key];

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden">
      {responsiveCards && (
        <div className="divide-y divide-gray-200 md:hidden">
          {data.length > 0 ? data.map((row) => (
            <article key={row.id} className="space-y-3 p-4">
              {columns.map((column) => (
                <div key={column.key} className="flex items-start justify-between gap-4 text-sm">
                  <span className="shrink-0 font-medium text-gray-500">{column.label}</span>
                  <div className="min-w-0 max-w-[65%] break-words text-right text-gray-800">{renderCell(column, row)}</div>
                </div>
              ))}
            </article>
          )) : <p className="p-4 text-center text-gray-500">No data available</p>}
        </div>
      )}

      <table className={`hidden w-full table-fixed text-left md:table ${responsiveCards ? "min-w-0" : "min-w-[720px]"}`}>
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`border-b p-3 text-left align-top font-medium ${col.width || ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr
                key={row.id}
                className="border-b align-top hover:bg-gray-50"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`p-3 align-top text-left ${col.width || ""}`}
                  >
                    <div className="flex w-full flex-wrap items-start justify-start gap-1 max-w-full break-words">
                      {renderCell(col, row)}
                    </div>
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="p-4 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;