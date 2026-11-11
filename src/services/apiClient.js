import axios from "axios";
import getErrorMessage from "../utils/getErrorMessage";
import { showError } from "../utils/toast";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("yojak_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = (error.config && error.config.url) || "";
        const status = error.response && error.response.status;
        const hadToken = !!localStorage.getItem("yojak_token");
        const isAuthCall =
            url.includes("/auth/login") || url.includes("/auth/signup");

        let message = getErrorMessage(error);

        if (status === 401 && !isAuthCall) {
            localStorage.removeItem("yojak_token");
            if (hadToken && !url.includes("/auth/me")) {
                message = "Your session has expired. Please log in again.";
            }
        }

        error.message = message;

        if (!(error.config && error.config.silent)) {
            showError(message);
        }

        return Promise.reject(error);
    }
);

export default apiClient;