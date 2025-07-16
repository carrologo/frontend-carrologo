import { doGet, doPost, doPatch} from "../core/api/api";
import { Image } from "../interfaces/commons.interface";
import { VehiclesTableData } from "../interfaces/vehicles.interface";
import { showErrorToast, showSuccessToast } from "../utils/toast.utils";

export interface CreateVehiclePost {
  type: string;
  brand: string;
  line: string;
  plate: string;
  version: string;
  transmission: string;
  traction: string;
  fuel_type: string;
  kms: number;
  model: string;
  displacement: number;
  seat_material: string;
  airbags: boolean;
  images: Image[];
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
  try {
    await doPost<T, typeof values>('/vehicle', values, 'vehicle');
    showSuccessToast('Vehículo creado exitosamente');
  } catch (error) {
    showErrorToast(error, 'Error al crear el vehículo');
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

export const updateVehicle = async (id: number, values: Partial<CreateVehiclePost>): Promise<void> => {
  try {
    await doPatch(`/vehicles/${id}`, values, 'vehicle');
    showSuccessToast('Vehículo actualizado exitosamente');
  } catch (error) {
    showErrorToast(error, 'Error al actualizar el vehículo');
    throw error;
  }
};
