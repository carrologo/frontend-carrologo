import { doGet } from "../core/api/api";
import { NotificationsResponse } from "../interfaces/notifications.interface";
import { showErrorToast } from "../utils/toast.utils";

export const getNotifications = async (period: 'month' | 'week' = 'month'): Promise<NotificationsResponse> => {
  try {
    const response = await doGet<NotificationsResponse>(`/expirations?period=${period}`, 'notifications');
    return response.data;
  } catch (error) {
    showErrorToast(error, 'Error al cargar las notificaciones');
    throw error;
  }
};
