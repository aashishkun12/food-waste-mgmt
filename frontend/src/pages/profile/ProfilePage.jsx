import { useEffect, useMemo, useState } from "react";
import { getCurrentRole, hasRole } from "../../utils/auth";
import { getCenters } from "../../utils/centerApi";
import { createDonor, getDonors, updateDonor } from "../../utils/donorApi";
import DonorFormModal from "../donors/DonorFormModal";

const ProfilePage = () => {
  const role = getCurrentRole();
  const isDonor = hasRole("ROLE_DONOR");
  const [donor, setDonor] = useState(null);
  const [centers, setCenters] = useState([]);
  const [showEdit, setShowEdit] = useState(false);

  const profile = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    if (!isDonor) return;

    const loadProfile = async () => {
      try {
        const [donorData, centerData] = await Promise.all([getDonors(), getCenters()]);
        const email = String(profile.email || "").trim().toLowerCase();
        const username = String(profile.username || "").trim().toLowerCase();

        let matchedDonor = (donorData || []).find((entry) => {
          const donorEmail = String(entry.contactEmail || "").trim().toLowerCase();
          const donorName = String(entry.name || "").trim().toLowerCase();
          return donorEmail === email || donorName === username || donorName.includes(username);
        });

        if (!matchedDonor && email) {
          matchedDonor = await createDonor({
            name: profile.username || "Donor",
            address: "",
            contactEmail: email,
            contactPhone: "",
            collectionCenterIds: [],
          });
        }

        setDonor(matchedDonor || null);
        setCenters(centerData || []);
      } catch {
        setDonor(null);
        setCenters([]);
      }
    };

    loadProfile();
  }, [isDonor, profile.email, profile.username]);

  const donorCenterIds = useMemo(() => {
    if (!donor || !Array.isArray(donor.collectionCenterLocations)) return [];
    return (centers || [])
      .filter((center) => {
        const centerName = String(center.name || "").trim().toLowerCase();
        const centerLocation = String(center.location || "").trim().toLowerCase();
        return donor.collectionCenterLocations.some((location) => {
          const value = String(location || "").trim().toLowerCase();
          return value === centerLocation || value === centerName;
        });
      })
      .map((center) => center.id);
  }, [centers, donor]);

  const handleSave = async (payload) => {
    if (!donor?.id) return;
    const saved = await updateDonor({ ...payload, id: donor.id });
    setDonor(saved);
    setShowEdit(false);
  };

  if (!isDonor) {
    return <div className="p-6 text-sm text-red-600">This profile page is available to donors only. Current role: {role || "unknown"}</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Donor Profile</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your personal details and donation information.</p>
        </div>
        {donor && (
          <button
            onClick={() => setShowEdit(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Business / donor name</span>
              <span className="font-medium">{donor?.name || profile.username || "Not available"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{donor?.contactEmail || profile.email || "Not available"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Phone</span>
              <span className="font-medium">{donor?.contactPhone || "Not available"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Address</span>
              <span className="font-medium text-right">{donor?.address || "Not available"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Role</span>
              <span className="font-medium">{role || "ROLE_DONOR"}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4">Collection Centers</h3>
          <div className="space-y-4 text-sm text-gray-700">
            <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
              <p className="font-medium mb-2">Assigned centers</p>
              <div className="flex flex-wrap gap-2">
                {(donor?.collectionCenterLocations?.length ? donor.collectionCenterLocations : ["No assigned center yet"]).map((center, index) => (
                  <span key={`${center}-${index}`} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-200">
                    {center}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-green-50 p-4 text-green-800">
              Your donor account is active and ready to contribute food waste donations.
            </div>
          </div>
        </div>
      </div>

      {donor && (
        <DonorFormModal
          open={showEdit}
          onClose={() => setShowEdit(false)}
          onSubmit={handleSave}
          donor={{
            ...donor,
            collectionCenterIds: donorCenterIds,
          }}
          centers={centers}
          allowEditDetails={true}
        />
      )}
    </div>
  );
};

export default ProfilePage;
