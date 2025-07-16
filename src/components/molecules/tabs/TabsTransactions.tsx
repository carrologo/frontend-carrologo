import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";
import { useMemo, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { TabPanel } from "../../atoms/tabPanel/TabPanel";
import { Transaction } from "../../../interfaces/transactions.interface";
import { transactionStatusMap } from "../../../utils/transactionStatus.utils";
import ActiveTransactions from "../../organisms/active-transactions/ActiveTransactions";
import TransactionsTable from "../../organisms/transactions-table/TransactionsTable";
import { ModalCreateTransaction } from "../../templates/modal-create-transaction/ModalCreateTransaction";
import { ModalViewTransaction } from "../../templates/modal-view-transaction/ModalViewTransaction";
import { ModalEditTransaction } from "../../templates/modal-edit-transaction/ModalEditTransaction";

interface TabsTransactionsProps {
  dataTransactions: Transaction[];
  onUpdateTransactions: (page?: number, limit?: number) => void;
  pagination?: { page: number; total: number };
}

const TabsTransactions = ({
  dataTransactions = [],
  onUpdateTransactions,
  pagination,
}: TabsTransactionsProps) => {
  const [value, setValue] = useState("1");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("buyerInfo");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });

  const handleChange = (newValue: string) => setValue(newValue);

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPaginationModel({ page: page - 1, pageSize });
    onUpdateTransactions(page, pageSize);
  };

  const handleCreateTransaction = () => {
    onUpdateTransactions(paginationModel.page + 1, paginationModel.pageSize);
  };

  const handleViewTransaction = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
    setOpenViewModal(true);
  };

  const handleEditTransaction = (transactionId: string) => {
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
    onUpdateTransactions(paginationModel.page + 1, paginationModel.pageSize);
  };

  const searchOptions = [
    { value: "buyerInfo", label: "Comprador" },
    { value: "sellerInfo", label: "Vendedor" },
    { value: "vehicleInfo", label: "Vehículo" },
    { value: "statusInfo", label: "Estado" },
    { value: "amount", label: "Monto" },
    { value: "description", label: "Descripción" },
  ];

  const filteredTransactions = useMemo(() => {
    let filtered = dataTransactions;

    // Filtrar por estado si no es "all"
    if (statusFilter !== "all") {
      filtered = filtered.filter(transaction => transaction.id_status?.toString() === statusFilter);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((transaction) => {
        if (searchField === "amount") {
          return transaction.amount?.toString().includes(searchTerm) || false;
        } else if (searchField === "statusInfo") {
          // Buscar en el nombre del estado
          return transaction.statusInfo?.name?.toLowerCase().includes(lowerSearchTerm) || false;
        } else if (searchField === "buyerInfo") {
          // Buscar en nombre y email del comprador
          return transaction.buyerInfo?.name?.toLowerCase().includes(lowerSearchTerm) ||
                 transaction.buyerInfo?.email?.toLowerCase().includes(lowerSearchTerm) || false;
        } else if (searchField === "sellerInfo") {
          // Buscar en nombre y email del vendedor
          return transaction.sellerInfo?.name?.toLowerCase().includes(lowerSearchTerm) ||
                 transaction.sellerInfo?.email?.toLowerCase().includes(lowerSearchTerm) || false;
        } else if (searchField === "vehicleInfo") {
          // Buscar en descripción y placa del vehículo
          return transaction.vehicleInfo?.description?.toLowerCase().includes(lowerSearchTerm) ||
                 transaction.vehicleInfo?.plate?.toLowerCase().includes(lowerSearchTerm) || false;
        }
        return transaction[searchField as keyof Transaction]
          ?.toString()
          .toLowerCase()
          .includes(lowerSearchTerm);
      });
    }

    return filtered;
  }, [dataTransactions, searchTerm, searchField, statusFilter]);

  return (
    <Box sx={{ width: "100%" }}>
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
          sx={{
            minWidth: { xs: "100%", sm: "auto" },
            maxWidth: { xs: "300px" },
          }}
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
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 120 },
              maxWidth: { xs: "300px" },
            }}
          >
            <InputLabel id="status-filter-label">Filtrar por estado</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Filtrar por estado"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Todos</MenuItem>
              {Object.entries(transactionStatusMap).map(([id, name]) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 150 },
              maxWidth: { xs: "300px" },
            }}
          >
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
            label={`Buscar por ${
              searchOptions.find((opt) => opt.value === searchField)?.label.toLowerCase()
            }`}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: { xs: "100%", sm: "200px" },
              maxWidth: { xs: "200px" },
            }}
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
          transactions={filteredTransactions} 
          pagination={pagination}
          paginationModel={paginationModel}
          onPaginationChange={handlePaginationChange}
          onViewTransaction={handleViewTransaction}
          onEditTransaction={handleEditTransaction}
        />
      </TabPanel>
      
      <TabPanel value={value} index="2">
        <TransactionsTable 
          transactions={filteredTransactions} 
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
    </Box>
  );
};

export default TabsTransactions;
