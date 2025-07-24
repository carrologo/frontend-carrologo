import { doGet } from "../core/api/api";
import { showErrorToast } from "../utils/toast.utils";

export interface MonthlyCompletedTransactions {
  month: string;
  year: number;
  count: number;
  monthName: string;
}

export interface CompletedTransactionsResponse {
  data: MonthlyCompletedTransactions[];
}

export const getCompletedTransactionsByMonth = async (months: number = 6): Promise<MonthlyCompletedTransactions[]> => {
  try {
    // Obtener todas las transacciones completadas (estado 5) con paginación
    let allTransactions: any[] = [];
    let page = 1;
    let hasMoreData = true;
    
    while (hasMoreData) {
      const response = await doGet<{ data: any[], pagination: any }>(`/transactions?findBy=id_status&value=5&limit=100&page=${page}`, 'transactions');
      
      if (!response.data || !response.data.data) {
        break;
      }

      allTransactions = [...allTransactions, ...response.data.data];
      
      // Verificar si hay más páginas
      const pagination = response.data.pagination;
      if (!pagination || page >= Math.ceil(pagination.total / 100)) {
        hasMoreData = false;
      } else {
        page++;
      }
    }

    // Procesar las transacciones para agruparlas por mes
    const monthlyData: { [key: string]: MonthlyCompletedTransactions } = {};
    
    // Generar los últimos 6 meses
    const currentDate = new Date();
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      monthlyData[monthKey] = {
        month: String(date.getMonth() + 1).padStart(2, '0'),
        year: date.getFullYear(),
        count: 0,
        monthName: monthNames[date.getMonth()]
      };
    }
    
    // Contar transacciones por mes
    allTransactions.forEach((transaction: any) => {
      if (transaction.close_date) {
        const closeDate = new Date(transaction.close_date);
        const monthKey = `${closeDate.getFullYear()}-${String(closeDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].count++;
        }
      }
    });
    
    return Object.values(monthlyData).sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return parseInt(a.month) - parseInt(b.month);
    });
    
  } catch (error) {
    console.error('Error al obtener estadísticas de transacciones completadas:', error);
    showErrorToast(error, 'Error al cargar estadísticas de transacciones');
    return [];
  }
};
