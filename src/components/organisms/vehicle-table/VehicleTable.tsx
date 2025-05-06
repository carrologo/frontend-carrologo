import { useState, useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Vehicle } from '../../../interfaces/vehicles.interface';
import './vehicleTable.css';

interface VehicleTableProps {
  vehicles: Vehicle[];
}

export default function VehicleTable({ vehicles }: Readonly<VehicleTableProps>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('brand');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const columns: GridColDef[] = [
    { field: 'brand', headerName: 'Marca', width: 120 },
    { field: 'line', headerName: 'Línea', width: 120 },
    { field: 'version', headerName: 'Versión', width: 120 },
    { field: 'type', headerName: 'Tipo', width: 100 },
    {
      field: 'model',
      headerName: 'Año',
      width: 100,
      renderCell: (params) => new Date(params.value).getFullYear(),
    },
    { field: 'transmission', headerName: 'Transmisión', width: 120 },
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
      renderCell: (params) => `${params.value}L`,
    },
    { field: 'seat_material', headerName: 'Material Asientos', width: 150 },
    {
      field: 'airbags',
      headerName: 'Airbags',
      width: 100,
      renderCell: (params) => (params.value ? 'Sí' : 'No'),
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
          pageSizeOptions={[10, 25, 50]}
          sx={{ border: 0, overflow: 'auto' }}
        />
      </Paper>
    </div>
  );
}