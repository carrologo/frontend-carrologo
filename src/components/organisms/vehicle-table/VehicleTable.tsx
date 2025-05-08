import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Dialog } from '@mui/material';
import { Vehicle } from '../../../interfaces/vehicles.interface';
import { ModalViewVehicle } from '../../templates/modal-view-vehicle/ModalViewVehicle';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import './vehicleTable.css';

interface VehicleTableProps {
  vehicles: Vehicle[];
}

export default function VehicleTable({ vehicles }: Readonly<VehicleTableProps>) {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null); // Estado para el vehículo seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

  const handleViewVehicles = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  const columns: GridColDef[] = [
    { field: 'brand', headerName: 'Marca', width: 120 },
    { field: 'line', headerName: 'Línea', width: 120 },
    { field: 'version', headerName: 'Versión', width: 120 },
    { field: 'type', headerName: 'Tipo de Vehículo', width: 100 },
    {
      field: 'model',
      headerName: 'Año',
      width: 100,
      renderCell: (params) => new Date(params.value).getFullYear(),
    },
    { field: 'transmission', headerName: 'Transmisión', width: 120 },
    { field: 'traction', headerName: 'Tipo de Tracción', width: 120 },
    { field: 'fuel_type', headerName: 'Combustible', width: 120 },
    {
      field: 'kms',
      headerName: 'Kilometraje',
      width: 120,
      renderCell: (params) => `${params.value.toLocaleString()} km`,
    },
    {
      field: 'displacement',
      headerName: 'Cilindrada',
      width: 100,
      renderCell: (params) => `${params.value} cc`,
    },
    { field: 'seat_material', headerName: 'Material Asientos', width: 150 },
    {
      field: 'airbags',
      headerName: 'Airbags',
      width: 100,
      renderCell: (params) => (params.value ? 'Sí' : 'No'),
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
              onClick={() => handleViewVehicles(params.row)}
            >
              <ModeEditIcon />
            </IconButton>
          ),
        },
  ];

  return (
    <div className="vehicletable-container">
      <Paper sx={{ height: '100%', width: '100%', p: 2 }}>
        <Typography
          variant="h1"
          component="div"
          fontSize={30}
          sx={{ mt: 2 }}
          align="center"
          gutterBottom
        >
          Vehículos
        </Typography>

        <DataGrid
          rows={vehicles}
          columns={columns}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          onCellDoubleClick={(params) => {
            if (params.field === "delete" || params.field === "edit") return;
            handleViewVehicles(params.row);
          }}
          pageSizeOptions={[10, 25, 50]}
          sx={{ border: 0, overflow: 'auto' }}
        />
      </Paper>

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        {selectedVehicle && (
          <ModalViewVehicle
            onClose={handleCloseModal}
            initialValues={selectedVehicle} // Pasa los datos del vehículo al modal
          />
        )}
      </Dialog>
      
    </div>
  );
}