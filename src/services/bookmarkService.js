import apiClient from "./apiClient";

export class BookmarkService {
    async bookmarkPost(postSlug) {
        try {
            const response = await apiClient.post(`/posts/${postSlug}/bookmark`);
            return response.data;
        } catch (error) {
            console.log("Bookmark service :: bookmarkPost :: error", error);
            return false;
        }
    }

    async unbookmarkPost(postSlug) {
        try {
            const response = await apiClient.delete(`/posts/${postSlug}/bookmark`);
            return response.data;
        } catch (error) {
            console.log("Bookmark service :: unbookmarkPost :: error", error);
            return false;
        }
    }

    async getStatus(postSlug) {
        try {
            const response = await apiClient.get(`/posts/${postSlug}/bookmark`, { silent: true });
            return response.data;
        } catch (error) {
            return { bookmarked: false };
        }
    }

    async getSavedPosts() {
        try {
            const response = await apiClient.get("/bookmarks");
            return response.data.map((post) => ({ ...post, $id: post.slug }));
        } catch (error) {
            console.log("Bookmark service :: getSavedPosts :: error", error);
            return null;
        }
    }
}

const bookmarkService = new BookmarkService();
export default bookmarkService;