import axios from 'axios';

// Define a generic type for the response data
interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// Define a generic type for the error response
interface ApiError {
  message: string;
  code?: string;
}

// Tipo para el parámetro apiType
type ApiType = 'client' | 'vehicle' | 'auth' | 'notifications' | 'transactions';

// Mapeo de apiType a la variable de entorno correspondiente
const baseUrlMap: Record<ApiType, string> = {
  client: import.meta.env.VITE_CLIENT_BASE_URL as string,
  vehicle: import.meta.env.VITE_VEHICLE_BASE_URL as string,
  auth: import.meta.env.VITE_AUTH_BASE_URL as string,
  notifications: import.meta.env.VITE_NOTIFICATIONS_BASE_URL as string,
  transactions: import.meta.env.VITE_TRANSACTIONS_BASE_URL as string,
};

// Token management
export const getToken = (): string | null => {
  return sessionStorage.getItem('authToken');
};

export const setToken = (token: string): void => {
  sessionStorage.setItem('authToken', token);
};

export const removeToken = (): void => {
  sessionStorage.removeItem('authToken');
};

// Configure axios interceptors
axios.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = {};
    }
    
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.url?.includes(import.meta.env.VITE_AUTH_BASE_URL)) {
      config.headers['x-api-key'] = import.meta.env.VITE_AUTH_X_API_KEY;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Generic doPost function
export const doPost = async <T, D>(
  resource: string,
  data: D,
  apiType: ApiType
): Promise<ApiResponse<T>> => {
  try {
    const baseUrl = baseUrlMap[apiType];
    if (!baseUrl) {
      throw new Error(`No base URL defined for apiType: ${apiType}`);
    }
    const url = resource.startsWith('/')
      ? `${baseUrl}${resource}`
      : `${baseUrl}/${resource}`;
    const response: ApiResponse<T> = await axios.post(url, data);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    const axiosError = error as { response: { data: ApiError } };
    throw new Error(
      axiosError.response?.data?.message || 'Error performing POST request'
    );
  }
};

// Generic doGet function
export const doGet = async <T>(
  resource: string,
  apiType: ApiType
): Promise<ApiResponse<T>> => {
  try {
    const baseUrl = baseUrlMap[apiType];
    if (!baseUrl) {
      throw new Error(`No base URL defined for apiType: ${apiType}`);
    }
    const url = resource.startsWith('/')
      ? `${baseUrl}${resource}`
      : `${baseUrl}/${resource}`;
    const response: ApiResponse<T> = await axios.get(url);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
    } catch (error) {
    const axiosError = error as { response: { data: ApiError } };
    throw new Error(
      axiosError.response?.data?.message || 'Error performing GET request'
    );
  }
};

// Generic doPatch function
export const doPatch = async <T, D>(
  resource: string,
  data: D,
  apiType: ApiType
): Promise<ApiResponse<T>> => {
  try {
    const baseUrl = baseUrlMap[apiType];
    if (!baseUrl) {
      throw new Error(`No base URL defined for apiType: ${apiType}`);
    }
    const url = resource.startsWith('/')
      ? `${baseUrl}${resource}`
      : `${baseUrl}/${resource}`;
    const response: ApiResponse<T> = await axios.patch(url, data);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    const axiosError = error as { response: { data: ApiError } };
    throw new Error(
      axiosError.response?.data?.message || 'Error performing PATCH request'
    );
  }
};