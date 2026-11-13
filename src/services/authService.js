import apiClient from "./apiClient";

export class AuthService {
    async createAccount({ name, email, password }) {
        const response = await apiClient.post(
            "/auth/signup",
            { name, email, password },
            { silent: true }
        );
        return response.data;
    }

    async verifyOtp({ email, otp }) {
        const response = await apiClient.post(
            "/auth/verify-otp",
            { email, otp },
            { silent: true }
        );
        const { token, userId, name, email: userEmail } = response.data;
        localStorage.setItem("yojak_token", token);
        return { userId, name, email: userEmail };
    }

    async resendOtp(email) {
        const response = await apiClient.post(
            "/auth/resend-otp",
            { email },
            { silent: true }
        );
        return response.data;
    }

    async login({ email, password }) {
        const response = await apiClient.post(
            "/auth/login",
            { email, password },
            { silent: true }
        );
        const { token, userId, name, email: userEmail } = response.data;
        localStorage.setItem("yojak_token", token);
        return { userId, name, email: userEmail };
    }

    async getCurrentUser() {
        try {
            const response = await apiClient.get("/auth/me", { silent: true });
            const { userId, name, email } = response.data;
            return { $id: userId, name, email };
        } catch (error) {
            return null;
        }
    }

    async logout() {
        localStorage.removeItem("yojak_token");
    }
}

const authService = new AuthService();
export default authService;