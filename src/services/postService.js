import apiClient from "./apiClient";

export class PostService {
    async createPost({ title, slug, content, status, featuredImage }) {
        try {
            const response = await apiClient.post("/posts", {
                title, slug, content, status, featuredImage,
            });
            return this.toAppwriteShape(response.data);
        } catch (error) {
            console.log("Post service :: createPost :: error", error);
            return false;
        }
    }

    async updatePost(slug, { title, content, status, featuredImage }) {
        try {
            const response = await apiClient.put(`/posts/${slug}`, {
                title, slug, content, status, featuredImage,
            });
            return this.toAppwriteShape(response.data);
        } catch (error) {
            console.log("Post service :: updatePost :: error", error);
            return false;
        }
    }

    async deletePost(slug) {
        try {
            await apiClient.delete(`/posts/${slug}`);
            return true;
        } catch (error) {
            console.log("Post service :: deletePost :: error", error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            const response = await apiClient.get(`/posts/${slug}`);
            return this.toAppwriteShape(response.data);
        } catch (error) {
            console.log("Post service :: getPost :: error", error);
            return false;
        }
    }

    async getPosts(status = "active", sortBy = "recent", limit = null) {
        try {
            let url = `/posts?status=${status}&sortBy=${sortBy}`;
            if (limit) url += `&limit=${limit}`;
            const response = await apiClient.get(url);
            const documents = response.data.map(this.toAppwriteShape);
            return { documents };
        } catch (error) {
            console.log("Post service :: getPosts :: error", error);
            return false;
        }
    }

    async getPostsPaged(page = 0, size = 8, status = "active") {
        try {
            const response = await apiClient.get(
                `/posts/paged?status=${status}&page=${page}&size=${size}`
            );
            const data = response.data;
            return {
                documents: data.content.map(this.toAppwriteShape),
                page: data.page,
                size: data.size,
                totalElements: data.totalElements,
                totalPages: data.totalPages,
                hasNext: data.hasNext,
                hasPrevious: data.hasPrevious,
            };
        } catch (error) {
            console.log("Post service :: getPostsPaged :: error", error);
            return false;
        }
    }

    toAppwriteShape(post) {
        return { ...post, $id: post.slug };
    }
}

const postService = new PostService();
export default postService;