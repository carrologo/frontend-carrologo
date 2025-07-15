
export interface Transaction {
  id_transaction: number;
  id_buyer: number;
  id_seller: number;
  id_vehicle: number;
  amount: number;
  start_date: string;
  close_date: string | null;
  description: string;
  documents: string | null;
  id_status: number;
}
//import { Image } from "./commons.interface"

export interface TransactionTableData {
  data : Transaction[];
  pagination: { page: number; total: number };
};