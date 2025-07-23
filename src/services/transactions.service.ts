import { doGet, doPost, doPut } from "../core/api/api";
import { TransactionTableData } from "../interfaces/transactions.interface";
import { showErrorToast, showSuccessToast } from "../utils/toast.utils";
import { document_transaction} from "../interfaces/commons.interface";

export interface CreateTransactionPost {
  id_buyer: number | null;
  id_seller: number | null;
  id_vehicle: number | null;
  amount: number | null;
  description: string | null;
  documents: document_transaction[] | null;
  id_status: number;
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
    console.log('=== DEBUGGING TRANSACTION CREATION ===');
    console.log('Enviando datos a la API:', values);
    
    // Verificar el tamaño del payload antes de enviar
    const payloadString = JSON.stringify(values);
    const payloadSize = payloadString.length;
    console.log('Tamaño del payload:', payloadSize, 'bytes');
    console.log('Tamaño del payload:', (payloadSize / 1024 / 1024).toFixed(2), 'MB');
    
    // Límite de 5MB para el payload
    if (payloadSize > 5 * 1024 * 1024) {
      throw new Error('El tamaño de la transacción excede el límite de 5MB permitido');
    }
    
    console.log('Datos serializados (preview):', payloadString.substring(0, 500) + '...');
    console.log('Tipos de datos:', {
      id_vehicle: typeof values.id_vehicle,
      id_buyer: typeof values.id_buyer,
      id_seller: typeof values.id_seller,
      id_status: typeof values.id_status,
      amount: typeof values.amount,
      description: typeof values.description,
      documents: typeof values.documents,
      documents_count: Array.isArray(values.documents) ? values.documents.length : 0,
    });
    
    const response = await doPost<T, typeof values>('/transactions', values, 'transactions');
    console.log('Respuesta de la API:', response);
    
    // Verificar si la respuesta indica éxito
    if (response && response.data) {
      console.log('✅ Transacción creada exitosamente');
      showSuccessToast('Transacción creada exitosamente');
      return;
    }
    
    showSuccessToast('Transacción creada exitosamente');
  } catch (error) {
    console.error('=== ERROR EN createTransaction ===');
    console.error('Error completo:', error);
    console.error('Datos que causaron el error:', {
      ...values,
      documents: values.documents ? `[${values.documents.length} documentos]` : null
    });
    
    // Intentar obtener más detalles del error
    if (error && typeof error === 'object') {
      const errorResponse = (error as any).response;
      console.error('Error response:', errorResponse);
      console.error('Error data:', errorResponse?.data);
      console.error('Error status:', errorResponse?.status);
      console.error('Error headers:', errorResponse?.headers);
      
      // Si el error es 500, proporcionar más información
      if (errorResponse?.status === 500) {
        console.error('⚠️ Error 500 - Posibles causas:');
        console.error('- Tamaño del payload demasiado grande');
        console.error('- Formato de documentos incorrecto');
        console.error('- Error en el servidor de backend');
        
        // Si hay un mensaje específico del servidor
        if (errorResponse?.data?.message) {
          showErrorToast(errorResponse.data.message, 'Error del servidor');
        } else {
          showErrorToast('Error interno del servidor. Verifique el tamaño de los documentos.', 'Error del servidor');
        }
      } else {
        showErrorToast(error, 'Error al crear transacción');
      }
    } else if (error instanceof Error) {
      showErrorToast(error.message, 'Error al crear transacción');
    } else {
      showErrorToast('Error desconocido al crear transacción', 'Error al crear transacción');
    }
    
    throw error;
  }
};

export const updateTransaction = async (id: string, values: Partial<CreateTransactionPost>): Promise<void> => {
  try {
    // Excluir el campo documents del payload para la actualización
    const { documents, ...updatePayload } = values;
    
    await doPut(`/transactions/${id}`, updatePayload, 'transactions');
    showSuccessToast('Transacción actualizada exitosamente');
  } catch (error) {
    showErrorToast(error, 'Error al actualizar la transacción');
    throw error;
  }
};