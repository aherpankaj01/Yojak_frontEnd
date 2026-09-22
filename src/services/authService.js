import apiClient from "./apiClient";

export class AuthService {
    async createAccount({ name, email, password }) {
        const response = await apiClient.post("/auth/signup", { name, email, password });
        const { token, userId, name: userName, email: userEmail } = response.data;
        localStorage.setItem("yojak_token", token);
        return { userId, name: userName, email: userEmail };
    }

    async login({ email, password }) {
        const response = await apiClient.post("/auth/login", { email, password });
        const { token, userId, name, email: userEmail } = response.data;
        localStorage.setItem("yojak_token", token);
        return { userId, name, email: userEmail };
    }

    async getCurrentUser() {
        try {
            const response = await apiClient.get("/auth/me");
            const { userId, name, email } = response.data;
            return { $id: userId, name, email }; // $id matches Appwrite's naming, used by App.jsx and Post.jsx
        } catch (error) {
            return null; // no session — matches Appwrite's behavior
        }
    }

    async logout() {
        localStorage.removeItem("yojak_token");
        // No server call needed — JWT is stateless, no session to invalidate
    }
}

const authService = new AuthService();
export default authService;