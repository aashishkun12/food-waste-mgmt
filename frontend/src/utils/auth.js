const normalizeRole = (role) => {
  if (!role) return "";
  const value = String(role).toUpperCase();
  return value.startsWith("ROLE_") ? value : `ROLE_${value}`;
};

export const getCurrentRole = () => {
  const storedRole = localStorage.getItem("wfms_role");
  if (storedRole) return normalizeRole(storedRole);

  try {
    return normalizeRole(JSON.parse(localStorage.getItem("user"))?.role);
  } catch {
    return "";
  }
};

export const hasRole = (role) => getCurrentRole() === normalizeRole(role);

export default getCurrentRole;
