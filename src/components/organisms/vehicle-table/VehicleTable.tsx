import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Dialog } from '@mui/material';
import { Vehicle } from '../../../interfaces/vehicles.interface';
import { ModalViewVehicle } from '../../templates/modal-view-vehicle/ModalViewVehicle';
import { ModalEditVehicle } from '../../templates/modal-edit-vehicle/ModalEditVehicle';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import './vehicleTable.css';

interface VehicleTableProps {
  vehicles: Vehicle[];
  pagination?: { page: number; total: number };
  paginationModel: { page: number; pageSize: number };
  onPaginationChange: (page: number, pageSize: number) => void;
}

export default function VehicleTable({ 
  vehicles, 
  pagination, 
  paginationModel, 
  onPaginationChange 
}: Readonly<VehicleTableProps>) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handlePaginationModelChange = (newModel: { page: number; pageSize: number }) => {
    onPaginationChange(newModel.page + 1, newModel.pageSize);
  };

  const handleViewVehicles = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedVehicle(null);
  };

  const columns: GridColDef[] = [
    { field: 'brand', headerName: 'Marca', flex: 1, minWidth: 100 },
    { field: 'line', headerName: 'Línea', flex: 1, minWidth: 100 },
    { field: 'version', headerName: 'Versión', flex: 1, minWidth: 100 },
    { field: 'type', headerName: 'Tipo de Vehículo', flex: 1.2, minWidth: 120 },
    { field: 'plate', headerName: 'Placa', flex: 0.8, minWidth: 80 },
    {
      field: 'model',
      headerName: 'Año',
      flex: 0.7,
      minWidth: 70,
      renderCell: (params) => new Date(params.value).getFullYear(),
    },
    { field: 'transmission', headerName: 'Transmisión', flex: 1, minWidth: 100 },
    { field: 'traction', headerName: 'Tipo de Tracción', flex: 1.2, minWidth: 120 },
    { field: 'fuel_type', headerName: 'Combustible', flex: 1, minWidth: 100 },
    {
      field: 'kms',
      headerName: 'Kilometraje',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => `${params.value.toLocaleString()} km`,
    },
    {
      field: 'displacement',
      headerName: 'Cilindrada',
      flex: 0.8,
      minWidth: 80,
      renderCell: (params) => `${params.value} cc`,
    },
    { field: 'seat_material', headerName: 'Material Asientos', flex: 1.3, minWidth: 130 },
    {
      field: 'airbags',
      headerName: 'Airbags',
      flex: 0.7,
      minWidth: 70,
      renderCell: (params) => (params.value ? 'Sí' : 'No'),
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
          onClick={() => handleEditVehicle(params.row)}
        >
          <ModeEditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div className="vehicletable-container">
      <Paper sx={{ 
        height: 'calc(100vh - 250px)', 
        width: '100%', 
        p: 2,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography
          variant="h1"
          component="div"
          fontSize={30}
          sx={{ mt: 2, mb: 2, flexShrink: 0 }}
          align="center"
        >
          Vehículos
        </Typography>
        
        <DataGrid
          rows={vehicles}
          columns={columns}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          paginationMode="server"
          rowCount={pagination?.total || 0}
          onCellDoubleClick={(params) => {
            if (params.field === "edit") return;
            handleViewVehicles(params.row);
          }}
          pageSizeOptions={[10, 25, 50]}
          sx={{ 
            border: 0,
            flex: 1
          }}
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

      <Dialog open={isEditModalOpen} onClose={handleCloseEditModal} maxWidth="md" fullWidth>
        {selectedVehicle && (
          <ModalEditVehicle
            onClose={handleCloseEditModal}
            vehicleId={selectedVehicle.id}
            initialData={{
              ...selectedVehicle,
              images: selectedVehicle.url_images
                ? [
                    {
                      base64: selectedVehicle.url_images,
                      name: "imagen-vehiculo.jpg",
                    },
                  ]
                : [],
            }}
            onVehicleEdited={handleCloseEditModal}
            imageUrl={selectedVehicle.url_images}
          />
        )}
      </Dialog>
      
    </div>
  );
}