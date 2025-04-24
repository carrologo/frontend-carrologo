import { doGet, doPost } from "../core/api/api";
import { ClientsTableData } from "../interfaces/clients.interface";

export interface CreateClientPost {
  name: string;
  lastName: string;
  email: string;
  identification: string;
  birthdate: string;
  contact: string;
  comment: string;
}

export const createClient = async <T>( values: CreateClientPost ): Promise<void> => {
  try {
    await doPost<T, typeof values>('/clients', values);
  } catch (error) {
    console.error('POST failed:', error);
    throw error;
  }
};

export const getClients = async (): Promise<ClientsTableData> => {
  try {
    const response = await doGet<ClientsTableData>('/clients');
    return response.data;
  } catch (error) {
    return error as ClientsTableData;
  }
}

export const getClientById = async (id: string): Promise<ClientsTableData> => {
  try {
    const response = await doGet<ClientsTableData>(`/client/${id}`);
    return response.data;
  } catch (error) {
    return error as ClientsTableData;
  }
}