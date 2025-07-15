import { doGet, doPost, doPatch } from "../core/api/api";
import { TransactionTableData } from "../interfaces/transactions.interface";

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
    return error as TransactionTableData;
  }
};

export const getTransactionById = async (id: string) => {
  const response = await doGet(`/transactions/${id}`, 'transactions');
  return response.data;
};

export const createTransaction = async <T>(values: CreateTransactionPost): Promise<void> => {
  try {
    await doPost<T, typeof values>('/transaction', values, 'transactions');
  } catch (error) {
    console.error('POST failed:', error);
    throw error;
  }
};

export const updateTransaction = async (id: string, values: Partial<CreateTransactionPost>): Promise<void> => {
  try {
    await doPatch(`/transactions/${id}`, values, 'transactions');
  } catch (error) {
    console.error('PATCH failed:', error);
    throw error;
  }
};