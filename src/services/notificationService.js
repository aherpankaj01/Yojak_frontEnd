import apiClient from "./apiClient";

export class NotificationService {
    async getAll() {
        try {
            const response = await apiClient.get("/notifications", { silent: true });
            return response.data;
        } catch (error) {
            console.log("Notification service :: getAll :: error", error);
            return [];
        }
    }

    async getUnreadCount() {
        try {
            const response = await apiClient.get("/notifications/unread-count", { silent: true });
            return response.data.count;
        } catch (error) {
            return null;
        }
    }

    async markAllRead() {
        try {
            await apiClient.post("/notifications/read-all", null, { silent: true });
            return true;
        } catch (error) {
            console.log("Notification service :: markAllRead :: error", error);
            return false;
        }
    }

    async markRead(id) {
        try {
            await apiClient.post(`/notifications/${id}/read`, null, { silent: true });
            return true;
        } catch (error) {
            console.log("Notification service :: markRead :: error", error);
            return false;
        }
    }
}

const notificationService = new NotificationService();
export default notificationService;