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

  const searchOptions = [
    { value: 'brand', label: 'Marca' },
    { value: 'line', label: 'Línea' },
    { value: 'version', label: 'Versión' },
    { value: 'type', label: 'Tipo' },
    { value: 'model', label: 'Año' },
    { value: 'transmission', label: 'Transmisión' },
    { value: 'fuel_type', label: 'Combustible' },
    { value: 'kms', label: 'Kilometraje' },
    { value: 'displacement', label: 'Cilindrada' },
    { value: 'seat_material', label: 'Material Asientos' },
    { value: 'airbags', label: 'Airbags' },
  ];

  const filteredRows = useMemo(() => {
    if (!searchTerm) return vehicles;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return vehicles.filter((vehicle) => {
      if (searchField === 'model') {
        const year = new Date(vehicle.model).getFullYear().toString();
        return year.includes(lowerSearchTerm);
      }
      if (searchField === 'kms') {
        const kms = vehicle.kms.toString();
        return kms.includes(lowerSearchTerm);
      }
      if (searchField === 'displacement') {
        const displacement = vehicle.displacement.toString();
        return displacement.includes(lowerSearchTerm);
      }
      if (searchField === 'airbags') {
        const airbags = vehicle.airbags ? 'sí' : 'no';
        return airbags.toLowerCase().includes(lowerSearchTerm);
      }
      return vehicle[searchField as keyof Vehicle]
        ?.toString()
        .toLowerCase()
        .includes(lowerSearchTerm);
    });
  }, [vehicles, searchTerm, searchField]);

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

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            m: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: { xs: 2, sm: 1 },
          }}
        >
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: '100%', sm: 150 },
              maxWidth: { xs: '300px' },
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
              width: { xs: '100%', sm: '200px' },
              maxWidth: { xs: '200px' },
            }}
          />
        </Box>

        <DataGrid
          rows={filteredRows}
          columns={columns}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]}
          sx={{ border: 0, overflow: 'auto' }}
          getRowId={(row) => `${row.brand}-${row.line}-${row.model}-${row.kms}`}
        />
      </Paper>
    </div>
  );
}