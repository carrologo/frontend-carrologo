import { doGet, doPost, doPatch} from "../core/api/api";
import { Image } from "../interfaces/commons.interface";
import { VehiclesTableData, VehicleDocument, UpdateVehicleDocument, UpdateVehicleDebt } from "../interfaces/vehicles.interface";
import { showErrorToast, showLoadingToast, updateToast, getErrorMessage } from "../utils/toast.utils";

export interface CreateVehiclePost {
  type: string;
  brand: string;
  line: string;
  plate: string;
  version: string;
  transmission: string;
  traction: string;
  fuel_type?: string;
  fuelType?: string;
  kms: number;
  model: string;
  displacement: number;
  seat_material?: string;
  seatMaterial?: string;
  airbags: boolean;
  images: Image[];
  documents?: VehicleDocument[];
  debts?: { amount: number; typeDebtId: number }[];
}

// Interfaz específica para actualización de vehículos
export interface UpdateVehiclePost {
  type?: string;
  brand?: string;
  line?: string;
  plate?: string;
  version?: string;
  transmission?: string;
  traction?: string;
  fuelType?: string;
  kms?: number;
  model?: string;
  displacement?: number;
  seatMaterial?: string;
  airbags?: boolean;
  documents?: UpdateVehicleDocument[]; // Usa la interfaz específica para actualización
  debts?: UpdateVehicleDebt[];
}

export const getVehicles = async (page: number = 1, limit: number = 50): Promise<VehiclesTableData> => {
  try {
    const response = await doGet<VehiclesTableData>(`/vehicles?page=${page}&limit=${limit}`, 'vehicle');
    return response.data;
  } catch (error) {
    showErrorToast(error, 'Error al cargar los vehículos');
    return error as VehiclesTableData;
  }
}

export const createVehicle = async <T>( values: CreateVehiclePost ): Promise<void> => {
  const toastId = showLoadingToast('Creando vehículo...');
  try {
    await doPost<T, typeof values>('/vehicle', values, 'vehicle');
    updateToast(toastId, 'Vehículo creado exitosamente', 'success');
  } catch (error) {
    updateToast(toastId, getErrorMessage(error), 'error');
    throw error;
  }
};

export const getVehicleById = async (id: string): Promise<{ plate: string; brand: string; line: string } | null> => {
  try {
    const response = await doGet<{ plate: string; brand: string; line: string }>(`/vehicles/${id}`, 'vehicle');
    return response.data;
  } catch (error) {
    showErrorToast(error, 'Error al cargar la información del vehículo');
    return null;
  }
};

export const updateVehicle = async (id: number, values: UpdateVehiclePost): Promise<void> => {
  const toastId = showLoadingToast('Actualizando vehículo...');
  try {
    await doPatch(`/vehicles/${id}`, values, 'vehicle');
    updateToast(toastId, 'Vehículo actualizado exitosamente', 'success');
  } catch (error) {
    updateToast(toastId, getErrorMessage(error), 'error');
    throw error;
  }
};
