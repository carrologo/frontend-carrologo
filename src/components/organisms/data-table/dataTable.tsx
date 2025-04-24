import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import "./dataTable.css";
import IconButton from "@mui/material/IconButton";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ClientsTableData } from "../../../interfaces/clients.interface";
import { useState } from "react";
import { Button, Dialog, Typography } from "@mui/material";
import { ModalCreateClient } from "../../templates/modal-create-client/ModalCreateClient";
import ViewClient from "../view-client/viewClient";



const columns: GridColDef[] = [
  { field: "name", headerName: "Nombre", width: 150 },
  { field: "lastName", headerName: "Apellido", width: 150 },
  { field: "email", headerName: "Correo", width: 300 },
  { field: "identification", headerName: "Identificacion", width: 140 },
  { field: "birthdate", headerName: "Nacimiento", width: 140 },
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
        onClick={() => console.log("Editar", params.row)}
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

export default function DataTable({
  dataTable,
}: {
  readonly dataTable: ClientsTableData;
}) {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const handleViewClient = (row: any) => {
    setSelectedClient(row); // Ensure all client data is set
    setOpenViewModal(true);
  };

  return (
    <div className="datatable-container">
      <Paper sx={{ height: "70vh", width: "100%" }}>
        <Typography variant="h1" component="div" fontSize={30} sx={{ mt: 2 }} align="center" gutterBottom>
          Clientes
        </Typography>

        <Button sx={{m: 2}} variant="contained" onClick={()=> setOpenCreateModal(true)}>Agregar Cliente</Button>
        
        <DataGrid
          rows={dataTable.data}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          onCellClick={(params) => {
            if (params.field === 'name' || params.field === 'lastName') {
              handleViewClient(params.row);
          }
        }}
          initialState={{
            sorting: { sortModel: [{ field: "name", sort: "asc" }] },
          }}
          pageSizeOptions={[10, 25, 50]}
          sx={{ border: 0, overflow: "auto" }}
        />
      </Paper>


      <Dialog
        open={openCreateModal}
        maxWidth="md"
        fullWidth
      >
        <ModalCreateClient onClose={() => setOpenCreateModal(false)} />
      </Dialog>
      <Dialog open={openViewModal} 
      maxWidth="md" 
      fullWidth>
        {selectedClient && (
          <ViewClient
            fields={[
              { name: "name", label: "Nombre", type: "text" },
              { name: "lastName", label: "Apellido", type: "text" },
              { name: "email", label: "Correo", type: "email" },
              { name: "identification", label: "Identificación", type: "text" },
              { name: "birthdate", label: "Nacimiento", type: "date" },
              { name: "contact", label: "Contacto", type: "tel" },
              { name: "comment", label: "Observaciones", type: "text", multiline: true, rows: 3 },
              { name: "isActive", label: "Estado", type: "text" },
            ]}
            initialValues={selectedClient}
            title="Detalles del Cliente"
            onClose={() => setOpenViewModal(false)}
          />
        )}
      </Dialog>

    </div>
  );
}
