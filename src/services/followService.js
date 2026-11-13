import apiClient from "./apiClient";

export class FollowService {
    async follow(userId) {
        try {
            const response = await apiClient.post(`/users/${userId}/follow`);
            return response.data;
        } catch (error) {
            console.log("Follow service :: follow :: error", error);
            return false;
        }
    }

    async unfollow(userId) {
        try {
            const response = await apiClient.delete(`/users/${userId}/follow`);
            return response.data;
        } catch (error) {
            console.log("Follow service :: unfollow :: error", error);
            return false;
        }
    }

    async getStatus(userId) {
        try {
            const response = await apiClient.get(`/users/${userId}/follow-status`, { silent: true });
            return response.data;
        } catch (error) {
            console.log("Follow service :: getStatus :: error", error);
            return { followersCount: 0, followingCount: 0, following: false };
        }
    }
}

const followService = new FollowService();
export default followService;