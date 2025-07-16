import { doGet, doPost, doPatch } from "../core/api/api";
import { Client, ClientsTableData } from "../interfaces/clients.interface";
import { showErrorToast, showSuccessToast } from "../utils/toast.utils";

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
    showSuccessToast('Cliente creado exitosamente');
  } catch (error) {
    showErrorToast(error, 'Error al crear el cliente');
    throw error;
  }
};

export const getClients = async (page: number = 1, limit: number = 10): Promise<ClientsTableData> => {
  try {
    const response = await doGet<ClientsTableData>(`/clients?page=${page}&limit=${limit}`, 'client');
    return response.data;
  } catch (error) {
    showErrorToast(error, 'Error al cargar los clientes');
    return error as ClientsTableData;
  }
}

export const getClientById = async (id: string): Promise<Client> => {
  try {
    const response = await doGet<Client>(`/client/${id}`, 'client');
    return response.data;
  } catch (error) {
    showErrorToast(error, 'Error al cargar la información del cliente');
    return error as Client;
  }
}

export const updateClient = async <T>(
  id: number,
  values: Partial<CreateClientPost> & { isActive?: boolean }
): Promise<void> => {
  try {
    await doPatch<T, typeof values>(`/clients/${id}`, values, 'client');
    showSuccessToast('Cliente actualizado exitosamente');
  } catch (error) {
    showErrorToast(error, 'Error al actualizar el cliente');
    throw error;
  }
};
