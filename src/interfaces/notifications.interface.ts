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
  expiration_date: string;
  documentType: string;
  document_type_id: number;
  vehicle?: {
    id: number;
    plate: string | null;
  };
  buyer?: {
    id: number;
    name: string;
    identification: string;
    contact: string;
  } | null;
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
