import apiClient from "./apiClient";

export class SearchService {
    async search(query) {
        try {
            const response = await apiClient.get("/search", { params: { q: query } });
            const posts = response.data.posts.map((post) => ({ ...post, $id: post.slug }));
            return { users: response.data.users, posts };
        } catch (error) {
            console.log("Search service :: search :: error", error);
            return { users: [], posts: [] };
        }
    }
}

const searchService = new SearchService();
export default searchService;