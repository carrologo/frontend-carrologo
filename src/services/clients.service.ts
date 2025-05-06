import { doGet, doPost, doPatch } from "../core/api/api";
import { Client, ClientsTableData } from "../interfaces/clients.interface";

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
    await doPost<T, typeof values>('/clients', values, 'client');
  } catch (error) {
    console.error('POST failed:', error);
    throw error;
  }
};

export const getClients = async (): Promise<ClientsTableData> => {
  try {
    const response = await doGet<ClientsTableData>('/clients', 'client');
    return response.data;
  } catch (error) {
    return error as ClientsTableData;
  }
}

export const getClientById = async (id: string): Promise<Client> => {
  try {
    const response = await doGet<Client>(`/client/${id}`, 'client');
    return response.data;
  } catch (error) {
    return error as Client;
  }
}

export const updateClient = async <T>(
  id: number,
  values: Partial<CreateClientPost> & { isActive?: boolean }
): Promise<void> => {
  try {
    await doPatch<T, typeof values>(`/clients/${id}`, values, 'client');
  } catch (error) {
    console.error("UPDATE failed:", error);
    throw error;
  }
};
