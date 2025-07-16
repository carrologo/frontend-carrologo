//import { Image } from "./commons.interface";

export interface TypeDocument {
  id: number;
  name: string;
}

export interface VehicleDocument {
  id?: number; // Para documentos existentes
  documentTypeId: number;
  expirationDate: string;
  category?: string; // Categoría del documento
  idVehicle?: number; // ID del vehículo relacionado
}

// Interfaz específica para la actualización de documentos
export interface UpdateVehicleDocument {
  id: number; // REQUERIDO para actualización - ID del documento existente
  documentTypeId: number;
  expirationDate: string;
  idVehicle: number; // REQUERIDO para actualización - ID del vehículo
}

export interface DocumentManagerProps {
  documents: VehicleDocument[];
  onChange: (documents: VehicleDocument[]) => void;
  error?: string;
  onLoadingChange?: (loading: boolean) => void;
}

export interface Vehicle {
  id: number;
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
  url_images: string;
  documents?: VehicleDocument[]; // Agregar documentos al vehículo
}

export interface VehiclesTableData {
  data : Vehicle[];
  pagination: { page: number; total: number };
};