import axios from "axios";

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

// Generic doPost function
export const doPost = async <T, D>(
  resource: string,
  data: D
): Promise<ApiResponse<T>> => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
    const url = resource.startsWith("/")
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
      axiosError.response?.data?.message || "Error performing POST request"
    );
  }
};

export const doGet = async <T>(resource: string): Promise<ApiResponse<T>> => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
    const url = resource.startsWith("/")
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
      axiosError.response?.data?.message || "Error performing GET request"
    );
  }
};

export const doPatch = async <T, D>(
  resource: string,
  data: D
): Promise<ApiResponse<T>> => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
    const url = resource.startsWith("/")
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
      axiosError.response.data.message || "Error performing PATCH request"
    );
  }
};