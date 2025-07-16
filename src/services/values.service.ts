import { doGet } from "../core/api/api";
import { showErrorToast } from "../utils/toast.utils";

export interface TypeDocument {
  id: number;
  name: string;
}

export interface TransactionStatus {
  id_status: number;
  name: string;
}

export interface TypeDebt {
  id: number;
  name: string;
}

export interface ValuesResponse {
  data: {
    transactionStatuses: TransactionStatus[];
    typeDocuments: TypeDocument[];
    typeDebts: TypeDebt[];
  };
}

export const getValues = async (): Promise<ValuesResponse> => {
  try {
    const response = await doGet<ValuesResponse>('/values/all', 'values');
    return response.data;
  } catch (error) {
    showErrorToast(error, 'Error al cargar los tipos de documentos');
    throw error;
  }
};
