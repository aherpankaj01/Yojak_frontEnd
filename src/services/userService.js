import apiClient from "./apiClient";

export class UserService {
    async getOwnProfile() {
        try {
            const response = await apiClient.get("/users/me");
            return response.data;
        } catch (error) {
            console.log("User service :: getOwnProfile :: error", error);
            return false;
        }
    }

    async updateProfile({ name, bio, avatar }) {
        try {
            const response = await apiClient.put("/users/me", { name, bio, avatar });
            return response.data;
        } catch (error) {
            console.log("User service :: updateProfile :: error", error);
            return false;
        }
    }

    async getPublicProfile(userId) {
        try {
            const response = await apiClient.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.log("User service :: getPublicProfile :: error", error);
            return false;
        }
    }

    async getPostsByUser(userId, sortBy = "recent") {
        try {
            const response = await apiClient.get(`/users/${userId}/posts?sortBy=${sortBy}`);
            return response.data.map((post) => ({ ...post, $id: post.slug }));
        } catch (error) {
            console.log("User service :: getPostsByUser :: error", error);
            return [];
        }
    }
}

const userService = new UserService();
export default userService;