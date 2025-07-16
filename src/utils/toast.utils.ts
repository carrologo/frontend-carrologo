import { toast } from 'react-toastify';

// Tipos de errores personalizados
export interface ServiceError {
  message: string;
  code?: string;
  statusCode?: number;
}

// Función para extraer mensaje de error útil
export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const errorWithMessage = error as { message: string };
    return errorWithMessage.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Ha ocurrido un error inesperado';
};

// Función para mostrar errores con toast
export const showErrorToast = (error: unknown, defaultMessage?: string): void => {
  const message = defaultMessage || getErrorMessage(error);
  toast.error(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Función para mostrar éxito con toast
export const showSuccessToast = (message: string): void => {
  toast.success(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Función para mostrar información con toast
export const showInfoToast = (message: string): void => {
  toast.info(message, {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Función para mostrar advertencia con toast
export const showWarningToast = (message: string): void => {
  toast.warning(message, {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Función para mostrar toast de carga/procesando
export const showLoadingToast = (message: string): string | number => {
  return toast.loading(message, {
    position: "top-center",
  });
};

// Función para actualizar un toast existente
export const updateToast = (toastId: string | number, message: string, type: 'success' | 'error' | 'info' | 'warning'): void => {
  toast.update(toastId, {
    render: message,
    type,
    isLoading: false,
    autoClose: type === 'success' ? 3000 : 5000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
