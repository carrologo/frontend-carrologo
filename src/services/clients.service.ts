import { doGet, doPost, doPatch } from "../core/api/api";
import { Client, ClientsTableData } from "../interfaces/clients.interface";
import { showErrorToast, showLoadingToast, updateToast } from "../utils/toast.utils";

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
  const toastId = showLoadingToast('Creando cliente...');
  try {
    await doPost<T, typeof values>('/clients', values, 'client');
    updateToast(toastId, 'Cliente creado exitosamente', 'success');
  } catch (error) {
    updateToast(toastId, 'Error al crear el cliente', 'error');
    throw error;
  }
};

export const getClients = async (
  page: number = 1,
  limit: number = 10,
  findBy?: string,
  value?: string
): Promise<ClientsTableData> => {
  try {
    let url = `/clients?page=${page}&limit=${limit}`;
    if (findBy && value) {
      url += `&findBy=${encodeURIComponent(findBy)}&value=${encodeURIComponent(value)}`;
    }
    const response = await doGet<ClientsTableData>(url, 'client');
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
  const toastId = showLoadingToast('Actualizando cliente...');
  try {
    await doPatch<T, typeof values>(`/clients/${id}`, values, 'client');
    updateToast(toastId, 'Cliente actualizado exitosamente', 'success');
  } catch (error) {
    updateToast(toastId, 'Error al actualizar el cliente', 'error');
    throw error;
  }
};
