import { doPost, setToken } from "../core/api/api";
import { LoginRequest, LoginResponse } from "../interfaces/auth.interface";
import { showErrorToast, showSuccessToast } from "../utils/toast.utils";

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await doPost<LoginResponse, LoginRequest>(
      '/auth/login',
      credentials,
      'auth'
    );
    
    // Guardar el token en sessionStorage
    if (response.data.token) {
      setToken(response.data.token);
      showSuccessToast('Inicio de sesión exitoso');
    }
    
    return response.data;
  } catch (error) {
    showErrorToast(error, 'Error al iniciar sesión. Verifica tus credenciales.');
    throw error;
  }
};

export const logout = (): void => {
  sessionStorage.removeItem('authToken');
  showSuccessToast('Sesión cerrada correctamente');
  window.location.href = '/';
};
