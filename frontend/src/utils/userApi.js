import api from "./api";

const USERS_ENDPOINT = "/api/users";

export const getUsers = () => api.get(USERS_ENDPOINT);

export const updateUserStatus = (userId, active) => api.patch(`${USERS_ENDPOINT}/${userId}/status`, null, {
  params: { active },
});

export const updateUserDetails = (userId, details) => api.put(`${USERS_ENDPOINT}/${userId}/details`, {
  email: details.email,
  name: details.name,
  address: details.address,
  phone: details.phone,
});
