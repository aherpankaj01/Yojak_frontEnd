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

    async getPosts(status = "active") {
        try {
            const response = await apiClient.get(`/posts?status=${status}`);
            const documents = response.data.map(this.toAppwriteShape);
            return { documents }; // matches Appwrite's listDocuments() shape
        } catch (error) {
            console.log("Post service :: getPosts :: error", error);
            return false;
        }
    }

    // Adds $id (mapped from slug) so PostForm.jsx, Post.jsx, PostCard.jsx work unchanged
    toAppwriteShape(post) {
        return { ...post, $id: post.slug };
    }
}

const postService = new PostService();
export default postService;