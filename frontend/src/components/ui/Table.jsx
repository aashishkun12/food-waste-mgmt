const Table = ({ columns, data }) => {
  return (
    <div className="bg-white shadow rounded-xl overflow-hidden">
      <table className="w-full table-fixed text-left">
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
                    <div className="flex w-full items-start justify-start max-w-full break-words overflow-hidden text-ellipsis">
                      {col.render
                        ? col.render(row)
                        : row[col.key]}
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