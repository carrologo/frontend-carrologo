import { doGet, doPost, doPatch} from "../core/api/api";
import { Image } from "../interfaces/commons.interface";
import { VehiclesTableData } from "../interfaces/vehicles.interface";

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
    return error as VehiclesTableData;
  }
}

export const createVehicle = async <T>( values: CreateVehiclePost ): Promise<void> => {
  try {
    await doPost<T, typeof values>('/vehicle', values, 'vehicle');
  } catch (error) {
    console.error('POST failed:', error);
    throw error;
  }
};

export const getVehicleById = async (id: string): Promise<{ plate: string; brand: string; line: string } | null> => {
  try {
    const response = await doGet<{ plate: string; brand: string; line: string }>(`/vehicles/${id}`, 'vehicle');
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle by ID:', error);
    return null;
  }
};

export const updateVehicle = async (id: number, values: Partial<CreateVehiclePost>): Promise<void> => {
  try {
    await doPatch(`/vehicles/${id}`, values, 'vehicle');
  } catch (error) {
    console.error('PATCH failed:', error);
    throw error;
  }
};
