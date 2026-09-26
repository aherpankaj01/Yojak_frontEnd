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


    getFilePreview(fileId, size = "thumb") {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

        const transforms = {

            thumb: "w_400,h_300,c_fill,q_auto,f_auto",
            banner: "w_1200,h_600,c_fill,q_auto,f_auto",
            avatar: "w_150,h_150,c_fill,q_auto,f_auto",
            full: "q_auto,f_auto",
        };

        const transform = transforms[size] || transforms.thumb;

        return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${fileId}`;
    }

    getFileView(fileId) {
        return this.getFilePreview(fileId, "banner");
    }
}

const fileService = new FileService();
export default fileService;