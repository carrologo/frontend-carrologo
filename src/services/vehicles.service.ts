import { doGet } from "../core/api/api";
import { VehiclesTableData } from "../interfaces/vehicles.interface";

export const getVehicles = async (): Promise<VehiclesTableData> => {
  try {
    const response = await doGet<VehiclesTableData>('/vehicles', 'vehicle');
    return response.data;
  } catch (error) {
    return error as VehiclesTableData;
  }
}