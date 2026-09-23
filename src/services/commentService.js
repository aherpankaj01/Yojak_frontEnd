import apiClient from "./apiClient";

export class CommentService {
    async addComment(postSlug, content) {
        try {
            const response = await apiClient.post(`/posts/${postSlug}/comments`, { content });
            return response.data;
        } catch (error) {
            console.log("Comment service :: addComment :: error", error);
            return false;
        }
    }

    async getComments(postSlug) {
        try {
            const response = await apiClient.get(`/posts/${postSlug}/comments`);
            return response.data;
        } catch (error) {
            console.log("Comment service :: getComments :: error", error);
            return [];
        }
    }

    async deleteComment(commentId) {
        try {
            await apiClient.delete(`/comments/${commentId}`);
            return true;
        } catch (error) {
            console.log("Comment service :: deleteComment :: error", error);
            return false;
        }
    }
}

const commentService = new CommentService();
export default commentService;