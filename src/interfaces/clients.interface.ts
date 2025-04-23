export interface Client {
  name: string;
  lastName: string;
  email: string;
  identification: string;
  birthdate: Date;
  contact: string;
  comment: string;
  isActive: boolean;
  id: number;
}

export interface ClientsTableData {
  data : Client[];
  pagination: { page: number; total: number };
};
