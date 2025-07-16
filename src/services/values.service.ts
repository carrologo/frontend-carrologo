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
    // Como este endpoint no está en las variables de entorno, usamos la URL directa
    const response = await fetch('https://nengsmd1sj.execute-api.us-east-1.amazonaws.com/prod/values/all');
    if (!response.ok) {
      throw new Error('Error al obtener los valores');
    }
    return await response.json();
  } catch (error) {
    showErrorToast(error, 'Error al cargar los tipos de documentos');
    throw error;
  }
};
