import api from "./api";

const WASTE_ENDPOINT = "/api/food-waste-items";

export const getWasteItems = () => api.get(WASTE_ENDPOINT);

export const createWasteItem = (item) => api.post(WASTE_ENDPOINT, {
  weightKg: item.weight,
  expirationDate: item.expiry,
  wasteType: item.type,
  donorId: item.donorId,
  collectionCenterId: item.centerId,
});

export const updateWasteItem = (item) => api.put(`${WASTE_ENDPOINT}/${item.id}`, {
  weightKg: item.weight,
  expirationDate: item.expiry,
  wasteType: item.type,
  donorId: item.donorId,
  collectionCenterId: item.centerId,
});

export const deleteWasteItem = (itemId) => api.delete(`${WASTE_ENDPOINT}/${itemId}`);
