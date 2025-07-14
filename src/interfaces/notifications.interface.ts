export interface UpcomingBirthday {
  id: number;
  name: string;
  email: string;
  birthDate: string;
  contact: string;
  identification: string;
}

export interface ExpiringDocument {
  id: number;
  category: string | null;
  expirationDate: string;
  documentType: string;
  documentTypeId: number;
}

export interface NotificationsData {
  upcomingBirthdays: UpcomingBirthday[];
  expiringDocuments: ExpiringDocument[];
  period: string;
  periodType: string;
}

export interface NotificationsSummary {
  birthdaysCount: number;
  documentsCount: number;
  period: string;
  periodType: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: NotificationsData;
  summary: NotificationsSummary;
}
