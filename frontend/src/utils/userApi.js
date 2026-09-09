import api from "./api";

const USERS_ENDPOINT = "/api/users";

const toBackendRole = (role) => {
  const value = String(role || "").toUpperCase();
  return value.startsWith("ROLE_") ? value : `ROLE_${value}`;
};

export const getUsers = () => api.get(USERS_ENDPOINT);

export const updateUserRoles = (userId, role) => api.put(`${USERS_ENDPOINT}/${userId}/roles`, [
  toBackendRole(role),
]);

export const updateUserStatus = (userId, active) => api.patch(`${USERS_ENDPOINT}/${userId}/status`, null, {
  params: { active },
});
