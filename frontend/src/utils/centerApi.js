import api from "./api";

const CENTERS_ENDPOINT = "/api/collection-centers";

export const getCenters = () => api.get(CENTERS_ENDPOINT);

export const getCenterSupportingData = () => Promise.all([
  api.get("/api/processors"),
  api.get("/api/food-donors"),
  api.get("/api/food-waste-items"),
]);

export const createCenter = (center) => api.post(CENTERS_ENDPOINT, {
  name: center.name,
  location: center.location,
  maxCapacityKg: center.maxCapacity,
  processorId: center.processorId,
});

export const updateCenter = (center) => api.put(`${CENTERS_ENDPOINT}/${center.id}`, {
  name: center.name,
  location: center.location,
  maxCapacityKg: center.maxCapacity,
  processorId: center.processorId,
});

export const deleteCenter = (centerId) => api.delete(`${CENTERS_ENDPOINT}/${centerId}`);

export const dispatchCenter = (centerId) => api.post(`${CENTERS_ENDPOINT}/${centerId}/dispatch`);
