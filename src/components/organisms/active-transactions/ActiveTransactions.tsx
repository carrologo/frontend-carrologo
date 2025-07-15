import { Box } from "@mui/material";
import TransactionCard from "../../atoms/transactionCard/TransactionCard";
import { Transaction } from "../../../interfaces/transactions.interface";
import SimplePagination from "../../atoms/simple-pagination/SimplePagination";
import './ActiveTransactions.css';

interface ActiveTransactionsProps {
  transactions: Transaction[];
  pagination?: { page: number; total: number };
  paginationModel: { page: number; pageSize: number };
  onPaginationChange: (page: number, pageSize: number) => void;
}

const ActiveTransactions: React.FC<ActiveTransactionsProps> = ({ 
  transactions = [], 
  pagination,
  paginationModel,
  onPaginationChange 
}) => {
  
  const handlePageChange = (page: number) => {
    onPaginationChange(page, paginationModel.pageSize);
  };

  const handleItemsPerPageChange = (pageSize: number) => {
    onPaginationChange(1, pageSize); // Reset to page 1 when changing page size
  };

  return (
    <Box className="active-transactions-container">
      {/* Paginador superior */}
      {pagination && (
        <Box className="pagination-top">
          <SimplePagination
            currentPage={paginationModel.page + 1}
            totalItems={pagination.total}
            itemsPerPage={paginationModel.pageSize}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            position="top"
          />
        </Box>
      )}
      
      {/* Área de contenido de cards */}
      <Box className="cards-content-area">
        {transactions && transactions.length > 0 ? (
          <Box 
            display="grid" 
            gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" 
            gap={3}
            sx={{ padding: 2 }}
          >
            {transactions.map((transaction) => (
              <Box key={transaction.id_transaction}>
                <TransactionCard
                  transaction={transaction}
                />
              </Box>
            ))}
          </Box>
        ) : (
          <Box className="no-transactions-message">
            No hay transacciones disponibles
          </Box>
        )}
      </Box>
      
      {/* Paginador inferior */}
      {pagination && (
        <Box className="pagination-bottom">
          <SimplePagination
            currentPage={paginationModel.page + 1}
            totalItems={pagination.total}
            itemsPerPage={paginationModel.pageSize}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            position="bottom"
          />
        </Box>
      )}
    </Box>
  );
};

export default ActiveTransactions;
