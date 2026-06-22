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
    console.log(response);
    
    if (response.token) {
        localStorage.setItem("wfms_token", response.token);
        localStorage.setItem("wfms_role", response.roles[0]);
    }

    return response;
};
