import { useEffect, useState } from "react";
import { Transaction, TransactionTableData } from "../../../interfaces/transactions.interface";
import { getTransactions } from "../../../services/transactions.service";
import TabsTransactions from "../../molecules/tabs/TabsTransactions";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<{ page: number; total: number }>({ page: 1, total: 0 });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTransactions = async (page = 1, limit = 50) => {
    setLoading(true);
    try {
      const data: TransactionTableData = await getTransactions(page, limit);
      
      if (data && data.data && Array.isArray(data.data)) {
        setTransactions(data.data);
        setPagination(data.pagination || { page, total: data.data.length });
      } else {
        console.log('No hay datos disponibles en la API');
        setTransactions([]);
        setPagination({ page, total: 0 });
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
      setPagination({ page, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleUpdateTransactions = (page?: number, limit?: number) => {
    fetchTransactions(page, limit);
  };

  if (loading) {
    return <div>Cargando transacciones...</div>;
  }

  return (
    <TabsTransactions 
      dataTransactions={transactions} 
      onUpdateTransactions={handleUpdateTransactions}
      pagination={pagination}
    />
  );
};

export default Transactions;
