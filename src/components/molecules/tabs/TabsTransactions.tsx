import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";
import { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
} from "@mui/material";
import { TabPanel } from "../../atoms/tabPanel/TabPanel";
import { Transaction } from "../../../interfaces/transactions.interface";
import { transactionStatusMap, getTransactionStatusName, canEditTransaction } from "../../../utils/transactionStatus.utils";
import ActiveTransactions from "../../organisms/active-transactions/ActiveTransactions";
import TransactionsTable from "../../organisms/transactions-table/TransactionsTable";
import { ModalCreateTransaction } from "../../templates/modal-create-transaction/ModalCreateTransaction";
import { ModalViewTransaction } from "../../templates/modal-view-transaction/ModalViewTransaction";
import { ModalEditTransaction } from "../../templates/modal-edit-transaction/ModalEditTransaction";
import { getValues, TransactionStatus } from "../../../services/values.service";
import { getTransactions } from "../../../services/transactions.service";
import { showErrorToast } from "../../../utils/toast.utils";


const TabsTransactions = () => {
  const [value, setValue] = useState("1");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("buyerInfo");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transactionStatuses, setTransactionStatuses] = useState<TransactionStatus[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]); // Todas las transacciones del filtro por estado
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<{ page: number; total: number }>({ page: 1, total: 0 });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });

  const searchOptions = [
    { value: "buyerInfo", label: "Comprador" },
    { value: "sellerInfo", label: "Vendedor" },
    { value: "vehicleInfo", label: "Vehículo" },
    { value: "amount", label: "Monto" },
    { value: "description", label: "Descripción" },
  ];

  // Función para obtener el valor del campo correspondiente de una transacción
  const getFieldValue = (transaction: Transaction, searchField: string): string => {
    switch (searchField) {
      case "buyerInfo":
        return transaction.buyerInfo?.name || "";
      case "sellerInfo":
        return transaction.sellerInfo?.name || "";
      case "vehicleInfo":
        return transaction.vehicleInfo?.plate || "";
      case "amount":
        return transaction.amount?.toString() || "";
      case "description":
        return transaction.description || "";
      default:
        return "";
    }
  };

  // Función reutilizable para obtener transacciones
  const fetchTransactions = async (currentPage?: number, currentPageSize?: number) => {
    setLoading(true);
    const page = currentPage || paginationModel.page + 1;
    const limit = currentPageSize || paginationModel.pageSize;

    try {
      let findBy: string | undefined;
      let value: string | undefined;

      // Solo aplicar filtro por estado en la llamada al API
      if (statusFilter !== "all") {
        findBy = "id_status";
        value = statusFilter;
      }

      const response = await getTransactions(page, limit, findBy, value);
      const fetchedTransactions = response.data || [];
      setAllTransactions(fetchedTransactions);
      
      // Aplicar búsqueda por texto localmente
      let filteredTransactions = fetchedTransactions;
      if (searchTerm && searchField) {
        filteredTransactions = fetchedTransactions.filter((transaction) => {
          const fieldValue = getFieldValue(transaction, searchField);
          return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
        });
      }
      
      setTransactions(filteredTransactions);
      setPagination(response.pagination || { page, total: 0 });
    } catch (err) {
      console.error("Error al obtener transacciones:", err);
      setTransactions([]);
      setAllTransactions([]);
      setPagination({ page, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadStatuses = async () => {
      try {
        const values = await getValues();
        setTransactionStatuses(values.data.transactionStatuses);
      } catch (err) {
        console.error("Error al cargar estados:", err);
      }
    };
    loadStatuses();
  }, []);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel, statusFilter]);

  // Efecto separado para manejar la búsqueda por texto localmente
  useEffect(() => {
    if (!searchTerm || !searchField) {
      setTransactions(allTransactions);
      return;
    }

    const filteredTransactions = allTransactions.filter((transaction) => {
      const fieldValue = getFieldValue(transaction, searchField);
      return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    setTransactions(filteredTransactions);
  }, [searchTerm, searchField, allTransactions]);

  const handleChange = (newValue: string) => setValue(newValue);

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPaginationModel({ page: page - 1, pageSize });
  };

  const handleCreateTransaction = () => {
    // Recargar la página actual después de crear una transacción
    const page = paginationModel.page + 1;
    const limit = paginationModel.pageSize;
    fetchTransactions(page, limit);
  };

  const handleViewTransaction = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
    setOpenViewModal(true);
  };

  const handleEditTransaction = (transactionId: string) => {
    // Buscar la transacción específica para verificar su estado
    const transaction = transactions.find(t => t.id_transaction?.toString() === transactionId);
    
    if (transaction) {
      const statusId = transaction.statusInfo?.id_status?.toString() || transaction.id_status?.toString() || '1';
      
      if (!canEditTransaction(statusId)) {
        const statusName = getTransactionStatusName(statusId);
        showErrorToast(`No se puede editar una transacción en estado "${statusName}"`);
        return;
      }
    }
    
    setSelectedTransactionId(transactionId);
    setOpenEditModal(true);
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedTransactionId(null);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedTransactionId(null);
  };

  const handleEditSuccess = () => {
    setOpenEditModal(false);
    setSelectedTransactionId(null);
    
    // Recargar la página actual después de editar una transacción
    const page = paginationModel.page + 1;
    const limit = paginationModel.pageSize;
    fetchTransactions(page, limit);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '300px' 
        }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              m: 2,
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 1 },
            }}
          >
        <Button
          variant="contained"
          onClick={() => setOpenCreateModal(true)}
          sx={{ minWidth: { xs: "100%", sm: "auto" }, maxWidth: { xs: "300px" } }}
        >
          Agregar Transacción
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            m: 2,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "flex-start" },
            gap: { xs: 2, sm: 1 },
          }}
        >
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 120 }, maxWidth: { xs: "300px" } }}>
            <InputLabel id="status-filter-label">Filtrar por estado</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Filtrar por estado"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Todos</MenuItem>
              {transactionStatuses.length > 0 ? (
                transactionStatuses.map((status) => (
                  <MenuItem key={status.id_status} value={status.id_status.toString()}>
                    {getTransactionStatusName(status.id_status.toString())}
                  </MenuItem>
                ))
              ) : (
                Object.entries(transactionStatusMap).map(([id, name]) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 150 }, maxWidth: { xs: "300px" } }}>
            <InputLabel id="search-field-label">Buscar por</InputLabel>
            <Select
              labelId="search-field-label"
              value={searchField}
              label="Buscar por"
              onChange={(e) => setSearchField(e.target.value)}
            >
              {searchOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label={`Buscar por ${searchOptions.find((opt) => opt.value === searchField)?.label.toLowerCase()}`}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: "100%", sm: "200px" }, maxWidth: { xs: "200px" } }}
          />
        </Box>

        <Tabs
          value={value}
          onChange={(_, newValue) => handleChange(newValue)}
          sx={{ mb: 2, height: 40, justifyContent: "center" }}
          centered
        >
          <Tab icon={<GridViewIcon />} value="1" />
          <Tab icon={<ListIcon />} value="2" />
        </Tabs>
      </Box>

      <TabPanel value={value} index="1">
        <ActiveTransactions
          transactions={transactions}
          pagination={pagination}
          paginationModel={paginationModel}
          onPaginationChange={handlePaginationChange}
          onViewTransaction={handleViewTransaction}
          onEditTransaction={handleEditTransaction}
        />
      </TabPanel>

      <TabPanel value={value} index="2">
        <TransactionsTable
          transactions={transactions}
          pagination={pagination}
          paginationModel={paginationModel}
          onPaginationChange={handlePaginationChange}
          onViewTransaction={handleViewTransaction}
          onEditTransaction={handleEditTransaction}
        />
      </TabPanel>

      <ModalCreateTransaction
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onTransactionCreated={handleCreateTransaction}
      />

      <ModalViewTransaction
        open={openViewModal}
        onClose={handleCloseViewModal}
        transactionId={selectedTransactionId}
      />

      <ModalEditTransaction
        open={openEditModal}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
        transactionId={selectedTransactionId ? parseInt(selectedTransactionId) : 0}
      />
        </>
      )}
    </Box>
  );
};

export default TabsTransactions;
