import { doGet, doPost, doPatch } from "../core/api/api";
import { TransactionTableData } from "../interfaces/transactions.interface";
import { showErrorToast, showSuccessToast } from "../utils/toast.utils";

export interface CreateTransactionPost {
  id_buyer: string;
  id_seller: string;
  id_vehicle: string;
  amount: number;
  description: string;
  documents: string;
  id_status: string;
}

export const getTransactions = async (page: number = 1, limit: number = 50): Promise<TransactionTableData> => {
  try {
    const response = await doGet<TransactionTableData>(`/transactions?page=${page}&limit=${limit}`, 'transactions');
    return response.data;
  } catch (error) {
    showErrorToast(error, 'Error al cargar las transacciones');
    return error as TransactionTableData;
  }
};

export const getTransactionById = async (id: string) => {
  try {
    const response = await doGet(`/transactions/${id}`, 'transactions');
    return response.data;
  } catch (error) {
    showErrorToast(error, 'Error al cargar la información de la transacción');
    throw error;
  }
};

export const createTransaction = async <T>(values: CreateTransactionPost): Promise<void> => {
  try {
    await doPost<T, typeof values>('/transaction', values, 'transactions');
    showSuccessToast('Transacción creada exitosamente');
  } catch (error) {
    showErrorToast(error, 'Error al crear la transacción');
    throw error;
  }
};

export const updateTransaction = async (id: string, values: Partial<CreateTransactionPost>): Promise<void> => {
  try {
    await doPatch(`/transactions/${id}`, values, 'transactions');
    showSuccessToast('Transacción actualizada exitosamente');
  } catch (error) {
    showErrorToast(error, 'Error al actualizar la transacción');
    throw error;
  }
};