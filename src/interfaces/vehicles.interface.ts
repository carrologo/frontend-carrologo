// Interfaz para las deudas de vehículo
export interface Debt {
  id?: number; // Opcional para nuevas deudas
  amount: number;
  created_at?: string;
  vehicle_id?: number;
  typeDebtId: number;
  type_debt_id: number; // Usar camelCase y obligatorio para el frontend
}

// Interfaz específica para actualización de deudas
export interface UpdateVehicleDebt {
  id?: number; // Solo para deudas existentes
  TypeDebtId: number;
  amount: number;
}

export interface TypeDocument {
  id: number;
  name: string;
}

export interface VehicleDocument {
  id?: number; // Para documentos existentes
  document_type_id: number;
  expiration_date: string;
  category?: string; // Categoría del documento
  idVehicle?: number; // ID del vehículo relacionado
}

// Interfaz específica para la actualización de documentos
export interface UpdateVehicleDocument {
  id: number; // REQUERIDO para actualización - ID del documento existente
  document_type_id: number;
  expiration_date: string;
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
  debts?: Debt[]; // Agregar deudas al vehículo
}

export interface VehiclesTableData {
  data : Vehicle[];
  pagination: { page: number; total: number };
};