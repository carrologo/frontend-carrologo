//import { Image } from "./commons.interface";

export interface Vehicle {
  id: number;
  type: string;
  brand: string;
  line: string;
  version: string;
  transmission: string;
  traction: string;
  fuel_type: string;
  kms: number;
  model: string;
  displacement: number;
  seat_material: string;
  airbags: boolean;
  url_images: string;
}

export interface VehiclesTableData {
  data : Vehicle[];
  pagination: { page: number; total: number };
};