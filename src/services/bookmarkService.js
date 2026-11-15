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

    async getSavedPostsPaged(page = 0, size = 8) {
        try {
            const response = await apiClient.get(`/bookmarks/paged?page=${page}&size=${size}`);
            const data = response.data;
            return {
                documents: data.content.map((post) => ({ ...post, $id: post.slug })),
                page: data.page,
                size: data.size,
                totalElements: data.totalElements,
                totalPages: data.totalPages,
                hasNext: data.hasNext,
                hasPrevious: data.hasPrevious,
            };
        } catch (error) {
            console.log("Bookmark service :: getSavedPostsPaged :: error", error);
            return null;
        }
    }
}

const bookmarkService = new BookmarkService();
export default bookmarkService;