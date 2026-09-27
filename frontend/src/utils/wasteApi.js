import api from "./api";

const WASTE_ENDPOINT = "/api/food-waste-items";

const extractMessage = (error, fallback) => {
  const data = error?.response?.data;
  return (data && (data.message || data.error)) || error?.message || fallback;
};

const request = async (promise, fallback) => {
  try {
    return await promise;
  } catch (error) {
    throw new Error(extractMessage(error, fallback));
  }
};

export const getWasteItems = () =>
  request(api.get(WASTE_ENDPOINT), "Failed to load waste items.");

export const createWasteItem = (item) =>
  request(
    api.post(WASTE_ENDPOINT, {
      weightKg: item.weight,
      expirationDate: item.expiry,
      wasteType: item.type,
      donorId: item.donorId,
      collectionCenterId: item.centerId,
    }),
    "Failed to add waste item."
  );

export const updateWasteItem = (item) =>
  request(
    api.put(`${WASTE_ENDPOINT}/${item.id}`, {
      weightKg: item.weight,
      expirationDate: item.expiry,
      wasteType: item.type,
      donorId: item.donorId,
      collectionCenterId: item.centerId,
    }),
    "Failed to update waste item."
  );

export const deleteWasteItem = (itemId) =>
  request(api.delete(`${WASTE_ENDPOINT}/${itemId}`), "Failed to delete waste item.");

export const acceptWasteItem = (itemId) =>
  request(api.patch(`${WASTE_ENDPOINT}/${itemId}/accept`), "Failed to accept waste item.");

export const rejectWasteItem = (itemId) =>
  request(api.patch(`${WASTE_ENDPOINT}/${itemId}/reject`), "Failed to reject waste item.");

export const completeWasteProcessing = (itemId) =>
  request(api.patch(`${WASTE_ENDPOINT}/${itemId}/complete`), "Failed to complete waste processing.");