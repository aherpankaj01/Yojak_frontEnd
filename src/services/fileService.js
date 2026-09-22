import apiClient from "./apiClient";

export class FileService {
    async uploadFile(file) {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await apiClient.post("/files/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            return { $id: response.data.fileId };
        } catch (error) {
            console.log("File service :: uploadFile :: error", error);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await apiClient.delete(`/files/${fileId}`);
            return true;
        } catch (error) {
            console.log("File service :: deleteFile :: error", error);
            return false;
        }
    }

    getFilePreview(fileId) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        return `https://res.cloudinary.com/${cloudName}/image/upload/${fileId}`;
    }

    getFileView(fileId) {
        return this.getFilePreview(fileId);
    }
}

const fileService = new FileService();
export default fileService;