import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import Paper from "@mui/material/Paper";
import "./dataTable.css";
import IconButton from "@mui/material/IconButton";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Client,
  ClientsTableData,
} from "../../../interfaces/clients.interface";
import { useState, useMemo } from "react";
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
import { getClientById } from "../../../services/clients.service";

interface DataTableProps {
  readonly dataTable: ClientsTableData;
  onClientCreated: () => void;
}

export default function DataTable({
  dataTable,
  onClientCreated,
}: Readonly<DataTableProps>) {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client>({} as Client);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("fullName"); // Campo de búsqueda predeterminado

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const columns: GridColDef[] = [
    { field: "name", headerName: "Nombre", width: 150 },
    { field: "lastName", headerName: "Apellido", width: 150 },
    { field: "email", headerName: "Correo", width: 300 },
    { field: "identification", headerName: "Identificación", width: 140 },
    {
      field: "birthdate",
      headerName: "Fecha de Nacimiento",
      width: 140,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "",
    },
    { field: "contact", headerName: "Contacto", width: 150 },
    { field: "comment", headerName: "Observaciones", width: 230 },
    {
      field: "isActive",
      headerName: "Estado",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: params.value ? "green" : "red", fontWeight: 500 }}>
          {params.value === true ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      field: "edit",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          aria-label="editar"
          color="primary"
          onClick={() => handleEditClient(params.row.id)}
        >
          <ModeEditIcon />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          aria-label="eliminar"
          color="error"
          onClick={() => console.log("Eliminar", params.row)}
        >
          <DeleteIcon />
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

  // Filtrar datos según el término de búsqueda y el campo seleccionado
  const filteredRows = useMemo(() => {
    if (!searchTerm) return dataTable.data;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return dataTable.data.filter((row) => {
      if (searchField === "fullName") {
        const fullName = `${row.name} ${row.lastName}`.toLowerCase();
        return fullName.includes(lowerSearchTerm);
      }
      if (searchField === "isActive") {
        // Para el campo booleano, convertir a "activo" o "inactivo" y comparar
        const status = row.isActive ? "activo" : "inactivo";
        return status.toLowerCase().includes(lowerSearchTerm);
      }
      // Para los demás campos, buscar directamente
      return row[searchField as keyof Client]
        ?.toString()
        .toLowerCase()
        .includes(lowerSearchTerm);
    });
  }, [dataTable.data, searchTerm, searchField]);

  const handleViewClient = async (id: string) => {
    try {
      const client = await getClientById(id);
      setSelectedClient(client);
      setOpenViewModal(true);
    } catch (error) {
      console.error("Error al obtener cliente:", error);
    }
  };

  const handleEditClient = async (id: string) => {
    try {
      const client = await getClientById(id);
      setSelectedClient(client);
      setOpenEditModal(true);
    } catch (error) {
      console.error("Error al obtener cliente para editar:", error);
    }
  };


  return (
    <div className="datatable-container">
      <Paper sx={{ height: "70vh", width: "100%" }}>
        <Typography
          variant="h1"
          component="div"
          fontSize={30}
          sx={{ mt: 2 }}
          align="center"
          gutterBottom
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
          rows={filteredRows}
          columns={columns}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          onCellDoubleClick={(params) => {
            if (params.field === "delete" || params.field === "edit") return;
            handleViewClient(params.row.id);
          }}
          initialState={{
            sorting: { sortModel: [{ field: "name", sort: "asc" }] },
          }}
          pageSizeOptions={[10, 25, 50]}
          sx={{ border: 0, overflow: "auto" }}
        />
      </Paper>

      <Dialog open={openCreateModal} maxWidth="md" fullWidth>
        <ModalCreateClient
          onClose={() => setOpenCreateModal(false)}
          onClientCreated={onClientCreated}
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
          />
      </Dialog>
    </div>
  );
}
