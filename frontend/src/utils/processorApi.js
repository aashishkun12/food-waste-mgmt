import api from "./api";

const PROCESSORS_ENDPOINT = "/api/processors";

export const getProcessors = () => api.get(PROCESSORS_ENDPOINT);

export const getProcessorSupportingData = () => Promise.all([
  api.get("/api/collection-centers"),
  api.get("/api/food-waste-items"),
]);

export const createProcessor = (processor) => api.post(PROCESSORS_ENDPOINT, {
  name: processor.name,
  location: processor.location,
  maxProcessingCapacityKg: processor.maxCapacity,
});

export const updateProcessor = (processor) => api.put(`${PROCESSORS_ENDPOINT}/${processor.id}`, {
  name: processor.name,
  location: processor.location,
  maxProcessingCapacityKg: processor.maxCapacity,
});

export const deleteProcessor = (processorId) => api.delete(`${PROCESSORS_ENDPOINT}/${processorId}`);
