import api from "./api";

export const getReportData = () => Promise.all([
  api.get("/api/food-waste-items"),
  api.get("/api/food-waste-items/processing-queue"),
  api.get("/api/processors"),
]);
