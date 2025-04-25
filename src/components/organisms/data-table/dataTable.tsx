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
import { ModalViewClient } from "../../templates/modal-view-client/ModalViewClient";
import { ModalEditClient } from "../../templates/modal-edit-client/ModalEditClient";
import { getClientById } from "../../../services/clients.service";

export default function DataTable({
  dataTable,
}: {
  readonly dataTable: ClientsTableData;
}) {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null); // Add state for selected client

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const handleViewClient = async (id: string) => {
    try {
      const client = await getClientById(id);
      setSelectedClient(client);
      setOpenViewModal(true);
    } catch (error) {
      console.error("Error al obtener cliente:", error);
    }
  };

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
        <span
          style={{ color: params.value ? "green" : "red", fontWeight: 500 }}
        >
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

  const handleEditClient = async (id: string) => {
    try {
      const client = await getClientById(id);
      setSelectedClient(client);
      setOpenEditModal(true);
      console.log("Cliente para editar:", client);
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

        <Button
          sx={{ m: 2 }}
          variant="contained"
          onClick={() => setOpenCreateModal(true)}
        >
          Agregar Cliente
        </Button>

        <DataGrid
          rows={dataTable.data}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          onCellClick={(params) => {
            if (params.field === "name" || params.field === "lastName") {
              handleViewClient(params.row.id);
            }
          }}
          initialState={{
            sorting: { sortModel: [{ field: "name", sort: "asc" }] },
          }}
          pageSizeOptions={[10, 25, 50]}
          sx={{ border: 0, overflow: "auto" }}
        />
      </Paper>

      <Dialog open={openCreateModal} maxWidth="md" fullWidth>
        <ModalCreateClient onClose={() => setOpenCreateModal(false)} />
      </Dialog>

      <Dialog open={openViewModal} maxWidth="md" fullWidth>
        <ModalViewClient
          clientData={selectedClient}
          onClose={() => setOpenViewModal(false)}
        />
      </Dialog>

      <Dialog open={openEditModal} maxWidth="md" fullWidth>
        {selectedClient && (
          <ModalEditClient
            clientData={selectedClient}
            onClose={() => setOpenEditModal(false)}
          />
        )}
      </Dialog>
    </div>
  );
}
