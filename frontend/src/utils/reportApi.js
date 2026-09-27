import api from "./api";

const REPORTS_ENDPOINT = "/api/reports";

export const getWasteTypeFrequency = () =>
  api.get(`${REPORTS_ENDPOINT}/waste-type-frequency`);

export const getWasteTypeWeight = () =>
  api.get(`${REPORTS_ENDPOINT}/waste-type-weight`);

export const getTopDonors = (limit = 5) =>
  api.get(`${REPORTS_ENDPOINT}/top-donors`, { params: { limit } });

export const getFullReport = () =>
  api.get(`${REPORTS_ENDPOINT}/full`);

export default {
  getWasteTypeFrequency,
  getWasteTypeWeight,
  getTopDonors,
  getFullReport,
};
