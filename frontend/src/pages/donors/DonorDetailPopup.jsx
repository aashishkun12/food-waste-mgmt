import { modalOverlayClass } from "../../components/ui/Modal";

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 6L18 18M18 6L6 18" />
  </svg>
);

const DonorDetailPopup = ({ donor, onClose }) => {
  if (!donor) return null;

  return (
    <div className={modalOverlayClass}>
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Donor Details
            </p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">{donor.name}</h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close donor details"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 hover:text-red-600"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Address</p>
                <p className="text-sm text-gray-700 mt-1">{donor.address}</p>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>📧 {donor.contactEmail}</p>
                <p>📞 {donor.contactPhone}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-blue-600">Donation Summary</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">{donor.totalDonations}</p>
              <p className="text-sm text-gray-500">total donations recorded</p>
              <p className="mt-3 text-sm text-gray-600">Assigned centers: {donor.centers?.length || 0}</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-3">
              Collection Centers
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({donor.centers?.length || 0})
              </span>
            </h4>

            {!donor.centers || donor.centers.length === 0 ? (
              <p className="text-sm text-gray-400">Not assigned to any center.</p>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {donor.centers.map((center) => (
                  <div
                    key={center.id}
                    className="flex items-center gap-2 border border-gray-200 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block flex-shrink-0" />
                    {center.location}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDetailPopup;
