export interface Transaction {
  id_transaction: number;
  id_buyer: number | null;
  id_seller: number | null;
  id_vehicle: number | null;
  amount: number | null;
  start_date: string;
  close_date: string | null;
  description: string | null;
  documents: string | null;
  url_documents: string | null;
  id_status: number;
  sellerInfo?: {
    id: number;
    name: string;
    email: string;
  };
  buyerInfo?: {
    id: number;
    name: string;
    email: string;
  };
  statusInfo?: {
    id_status: number;
    name: string;
  };
  vehicleInfo?: {
    id: number;
    description: string;
    plate: string | null;
  };
}
//import { Image } from "./commons.interface"

export interface UpdateTransactionPost {
  id_buyer: number | null;
  id_seller: number | null;
  id_vehicle: number | null;
  amount: number | null;
  start_date: string;
  close_date?: string | null;
  description?: string | null;
  documents?: string;
  id_status: number;
}

export interface TransactionTableData {
  data : Transaction[];
  pagination: { page: number; total: number };
};