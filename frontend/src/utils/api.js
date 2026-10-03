// ─────────────────────────────────────────────
//  src/utils/api.js
//  Central Axios instance for WFMS.
//  baseURL is empty — Vite proxy forwards
//  all /api/* requests to the backend.
// ─────────────────────────────────────────────

import axios from "axios";

const api = axios.create({
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

// ── Request interceptor ──────────────────────
// Attach JWT token to every outgoing request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("wfms_token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────
// Unwrap data and handle common errors globally
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status  = error.response?.status;
        const responseData = error.response?.data;
        const message = responseData?.message || error.message || "Something went wrong";

        // Only redirect on 401 if NOT already on login page
        // otherwise wrong password would redirect and swallow the error
        if (status === 401 && !window.location.pathname.includes("/login")) {
            localStorage.removeItem("wfms_token");
            localStorage.removeItem("wfms_role");
            window.location.href = "/login";
        }

        const apiError = new Error(message);
        apiError.fieldErrors = responseData?.fieldErrors || {};
        return Promise.reject(apiError);
    }
);

export default api;