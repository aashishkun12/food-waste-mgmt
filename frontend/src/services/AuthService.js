// ─────────────────────────────────────────────
//  src/services/authService.js
//  All authentication API calls live here.
//  Import this wherever you need auth actions.
// ─────────────────────────────────────────────

import api from "../utils/api";

const ENDPOINTS = {
    REGISTER : "/api/auth/register",
    LOGIN    : "/api/auth/login",
};

export const register = async (userData) => {
    const response = await api.post(ENDPOINTS.REGISTER, userData);

    if (response.token) {
        localStorage.setItem("wfms_token", response.token);
    }

    return response;
};

export const login = async (credentials) => {
    const response = await api.post(ENDPOINTS.LOGIN, credentials);

    if (response.token) {
        localStorage.setItem("wfms_token", response.token);
        const role = response.roles?.[0] || "";
        localStorage.setItem("wfms_role", role);
        localStorage.setItem("user", JSON.stringify({
            id: response.id,
            username: response.username,
            email: response.email,
            role: role.replace(/^ROLE_/, ""),
        }));
    }

    return response;
};
