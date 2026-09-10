import api from "./api";

const DONORS_ENDPOINT = "/api/food-donors";

export const getDonors = () => api.get(DONORS_ENDPOINT);

export const createDonor = (donor) => api.post(DONORS_ENDPOINT, {
  name: donor.name,
  address: donor.address,
  contactEmail: donor.contactEmail,
  contactPhone: donor.contactPhone,
  collectionCenterIds: donor.collectionCenterIds,
});

export const updateDonor = (donor) => api.put(`${DONORS_ENDPOINT}/${donor.id}`, {
  name: donor.name,
  address: donor.address,
  contactEmail: donor.contactEmail,
  contactPhone: donor.contactPhone,
  collectionCenterIds: donor.collectionCenterIds,
});

export const deleteDonor = (donorId) => api.delete(`${DONORS_ENDPOINT}/${donorId}`);
