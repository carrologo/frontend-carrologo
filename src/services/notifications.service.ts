import { doGet } from "../core/api/api";
import { NotificationsResponse } from "../interfaces/notifications.interface";

export const getNotifications = async (period: 'month' | 'week' = 'month'): Promise<NotificationsResponse> => {
  try {
    const response = await doGet<NotificationsResponse>(`/expirations?period=${period}`, 'notifications');
    return response.data;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};
