import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import Paper from "@mui/material/Paper";
import "./dataTable.css";
import IconButton from "@mui/material/IconButton";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import GetAppIcon from "@mui/icons-material/GetApp";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableViewIcon from "@mui/icons-material/TableView";
import {
  Client,
  ClientsTableData,
} from "../../../interfaces/clients.interface";
import { useState, useEffect } from "react";
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
  Menu,
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
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchField: string;
  setSearchField: (value: string) => void;
}

export default function DataTable({
  dataTable,
  onClientsUpdated,
  paginationModel,
  onPaginationModelChange,
  searchTerm,
  setSearchTerm,
  searchField,
  setSearchField,
}: Readonly<DataTableProps>) {
  // Estado local para el valor del input de búsqueda (para el debounce)
  const [inputValue, setInputValue] = useState(searchTerm);

  // Sincronizar inputValue con searchTerm externo (por si se limpia desde el padre)
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  // Debounce: esperar 2 segundos después de dejar de escribir para actualizar el searchTerm real
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue !== searchTerm) {
        setSearchTerm(inputValue);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue, searchTerm, setSearchTerm]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client>({} as Client);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const exportMenuOpen = Boolean(anchorEl);

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
      headerName: "Editar",
      flex: 0.5,
      minWidth: 80,
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
      headerName: "Habilitar/Deshabilitar",
      flex: 1,
      minWidth: 160,
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
    { value: "name", label: "Nombre" },
    { value: "lastName", label: "Apellido" },
    { value: "email", label: "Correo" },
    { value: "identification", label: "Identificación" },
    { value: "contact", label: "Contacto" },
    { value: "comment", label: "Observaciones" },
  ];

  // Ya no se filtra localmente, la data viene filtrada del backend

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

  const handleExportMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setAnchorEl(null);
  };

  const exportToPDF = () => {
    const content = `
      <html>
        <head>
          <title>Reporte de Clientes</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Reporte de Clientes</h1>
          <p>Fecha de generación: ${new Date().toLocaleDateString('es-ES')}</p>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Identificación</th>
                <th>Fecha de Nacimiento</th>
                <th>Contacto</th>
                <th>Observaciones</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${dataTable.data?.map(client => `
                <tr>
                  <td>${client.name}</td>
                  <td>${client.lastName}</td>
                  <td>${client.email}</td>
                  <td>${client.identification}</td>
                  <td>${client.birthdate ? new Date(client.birthdate).toLocaleDateString() : ''}</td>
                  <td>${client.contact}</td>
                  <td>${client.comment}</td>
                  <td>${client.isActive ? 'Activo' : 'Deshabilitado'}</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
    
    handleExportMenuClose();
  };

  const exportToExcel = () => {
    const headers = ['Nombre', 'Apellido', 'Correo', 'Identificación', 'Fecha de Nacimiento', 'Contacto', 'Observaciones', 'Estado'];
    
    const csvData = dataTable.data?.map(client => [
      client.name,
      client.lastName,
      client.email,
      client.identification,
      client.birthdate ? new Date(client.birthdate).toLocaleDateString() : '',
      client.contact,
      client.comment,
      client.isActive ? 'Activo' : 'Deshabilitado'
    ]) || [];

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        row.map(cell => 
          typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    handleExportMenuClose();
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
          fontWeight={700}
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
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<GetAppIcon />}
              onClick={handleExportMenuClick}
              size="small"
            >
              Exportar
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
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                sx={{
                  width: { xs: "100%", sm: "200px" },
                  maxWidth: { xs: "200px" },
                }}
              />
            </Box>
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
          getRowId={(row) => row.id}
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

      <Menu
        anchorEl={anchorEl}
        open={exportMenuOpen}
        onClose={handleExportMenuClose}
        MenuListProps={{
          'aria-labelledby': 'export-button',
        }}
      >
        <MenuItem onClick={exportToPDF}>
          <PictureAsPdfIcon sx={{ mr: 1 }} />
          Exportar como PDF
        </MenuItem>
        <MenuItem onClick={exportToExcel}>
          <TableViewIcon sx={{ mr: 1 }} />
          Exportar como Excel (CSV)
        </MenuItem>
      </Menu>
    </div>
  );
}
