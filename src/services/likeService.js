import apiClient from "./apiClient";

export class LikeService {
    async likePost(postSlug) {
        try {
            const response = await apiClient.post(`/posts/${postSlug}/likes`);
            return response.data;
        } catch (error) {
            console.log("Like service :: likePost :: error", error);
            return false;
        }
    }

    async unlikePost(postSlug) {
        try {
            const response = await apiClient.delete(`/posts/${postSlug}/likes`);
            return response.data;
        } catch (error) {
            console.log("Like service :: unlikePost :: error", error);
            return false;
        }
    }

    async getStatus(postSlug) {
        try {
            const response = await apiClient.get(`/posts/${postSlug}/likes`);
            return response.data;
        } catch (error) {
            console.log("Like service :: getStatus :: error", error);
            return { count: 0, likedByCurrentUser: false };
        }
    }
}

const likeService = new LikeService();
export default likeService;