import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import Paper from "@mui/material/Paper";
import "./dataTable.css";
import IconButton from "@mui/material/IconButton";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import {
  Client,
  ClientsTableData,
} from "../../../interfaces/clients.interface";
import { useState } from "react";
import {
  Button,
  Dialog,
  Typography,
  TextField,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { ModalCreateClient } from "../../templates/modal-create-client/ModalCreateClient";
import { ModalViewClient } from "../../templates/modal-view-client/ModalViewClient";
import { ModalEditClient } from "../../templates/modal-edit-client/ModalEditClient";
import ModalDeleteClient from "../../templates/modal-delete-client/ModalDeleteClient";

interface DataTableProps {
  readonly dataTable: ClientsTableData;
  onClientsUpdated: () => void;
  paginationModel: { page: number; pageSize: number };
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
}

export default function DataTable({
  dataTable,
  onClientsUpdated,
  paginationModel,
  onPaginationModelChange,
}: Readonly<DataTableProps>) {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client>({} as Client);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("fullName"); // Campo de búsqueda predeterminado

  const columns: GridColDef[] = [
    { field: "name", headerName: "Nombre", flex: 1, minWidth: 120 },
    { field: "lastName", headerName: "Apellido", flex: 1, minWidth: 120 },
    { field: "email", headerName: "Correo", flex: 1.5, minWidth: 200 },
    { field: "identification", headerName: "Identificación", flex: 1, minWidth: 120 },
    {
      field: "birthdate",
      headerName: "Fecha de Nacimiento",
      flex: 1.2,
      minWidth: 140,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "",
    },
    { field: "contact", headerName: "Contacto", flex: 1, minWidth: 120 },
    { field: "comment", headerName: "Observaciones", flex: 1.3, minWidth: 150 },
    {
      field: "isActive",
      headerName: "Estado",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <span
          style={{ color: params.value ? "green" : "red", fontWeight: 500 }}
        >
          {params.value === true ? "Activo" : "Deshabilitado"}
        </span>
      ),
    },
    {
      field: "edit",
      headerName: "",
      flex: 0.5,
      minWidth: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          aria-label="editar"
          color="primary"
          onClick={() => handleEditClient(params.row)}
        >
          <ModeEditIcon />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "",
      flex: 0.5,
      minWidth: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          aria-label={params.row.isActive ? "desactivar cliente" : "activar cliente"}
          color={params.row.isActive ? "error" : "success"}
          onClick={() => handleOpenDeleteModal(params.row)}
        >
          {params.row.isActive ? <DeleteIcon /> : <CheckIcon />}
        </IconButton>
      ),
    },
  ];

  // Opciones de búsqueda con etiquetas para el label
  const searchOptions = [
    { value: "fullName", label: "Nombre completo" },
    { value: "email", label: "Correo" },
    { value: "identification", label: "Identificación" },
    { value: "birthdate", label: "Fecha de Nacimiento" },
    { value: "contact", label: "Contacto" },
    { value: "comment", label: "Observaciones" },
    { value: "isActive", label: "Estado" },
  ];

  const handleViewClient = async (client: Client) => {
    try {
      setSelectedClient(client);
      setOpenViewModal(true);
    } catch (error) {
      console.error("Error al obtener cliente:", error);
    }
  };

  const handleEditClient = async (client: Client) => {
    try {
      setSelectedClient(client);
      setOpenEditModal(true);
    } catch (error) {
      console.error("Error al obtener cliente para editar:", error);
    }
  };

  const handleOpenDeleteModal = (client: Client) => {
    setSelectedClient(client);
    setOpenDeleteModal(true);
  };

  const handlePaginationModelChange = (newModel: { page: number; pageSize: number }) => {
    onPaginationModelChange(newModel);
  };

  // Debug temporal para verificar los datos
  console.log('DataTable Debug:', {
    dataTable,
    totalRows: dataTable.data?.length || 0,
    pagination: dataTable.pagination,
    paginationModel
  });

  return (
    <div className="datatable-container">
      <Paper sx={{ 
        height: "calc(100vh - 120px)", 
        width: "100%",
        display: "flex",
        flexDirection: "column"
      }}>
        <Typography
          variant="h1"
          component="div"
          fontSize={30}
          sx={{ mt: 2, mb: 2, flexShrink: 0 }}
          align="center"
        >
          Clientes
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            m: 2,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "flex-start" },
            gap: { xs: 2, sm: 0 },
            flexShrink: 0
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
            Agregar Cliente
          </Button>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              width: { xs: "100%", sm: "auto" },
              maxWidth: { xs: "300px", sm: "none" },
              alignItems: { xs: "center", sm: "flex-start" },
            }}
          >
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
              label={`Buscar por ${searchOptions
                .find((opt) => opt.value === searchField)
                ?.label.toLowerCase()}`}
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
        </Box>

        <DataGrid
          rows={dataTable.data || []}
          columns={columns}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          paginationMode="server"
          rowCount={dataTable.pagination?.total || 0}
          onCellDoubleClick={(params) => {
            if (params.field === "delete" || params.field === "edit") return;
            handleViewClient(params.row);
          }}
          initialState={{
            sorting: { sortModel: [{ field: "name", sort: "asc" }] },
          }}
          pageSizeOptions={[10, 25, 50]}
          sx={{ 
            border: 0,
            flex: 1
          }}
        />
      </Paper>

      <Dialog open={openCreateModal} maxWidth="md" fullWidth>
        <ModalCreateClient
          onClose={() => setOpenCreateModal(false)}
          onClientCreated={onClientsUpdated}
        />
      </Dialog>
      <Dialog open={openViewModal} maxWidth="md" fullWidth>
        <ModalViewClient
          clientData={selectedClient}
          onClose={() => setOpenViewModal(false)}
        />
      </Dialog>

      <Dialog open={openEditModal} maxWidth="md" fullWidth>
        <ModalEditClient
          clientData={selectedClient}
          onClose={() => setOpenEditModal(false)}
          onEditClient={onClientsUpdated}
        />
      </Dialog>

      <Dialog open={openDeleteModal} maxWidth="sm" fullWidth>
        <ModalDeleteClient
          open={openDeleteModal}
          selectedClient={selectedClient}
          onClose={() => setOpenDeleteModal(false)}
          onClientUpdated={onClientsUpdated}
        />
      </Dialog>
    </div>
  );
}
