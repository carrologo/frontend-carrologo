import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import './dataTable.css';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit'; 
import DeleteIcon from '@mui/icons-material/Delete';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Nombre', width: 150 },
  { field: 'lastName', headerName: 'Apellido', width: 150 },
  { field: 'email', headerName: 'Correo', width: 300 },
  { field: 'identification', headerName: 'Identificacion', width: 140,},
  { field: 'birthdate', headerName: 'Nacimiento' , width: 140 },
  { field: 'contact', headerName: 'Contacto', width: 150 },
  { field: 'comment', headerName: 'Observaciones', width: 230 },
  {
    field: 'edit',
    headerName: '',
    width: 60,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <IconButton
        aria-label="editar"
        color="primary"
        onClick={() => console.log('Editar', params.row)}
      >
        <ModeEditIcon />
      </IconButton>
    ),
  },
  {
    field: 'delete',
    headerName: '',
    width: 60,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <IconButton
        aria-label="eliminar"
        color="error"
        onClick={() => console.log('Eliminar', params.row)}
      >
        <DeleteIcon />
      </IconButton>
    ),
  },
];

const rows = [
  {
    id: 1,
    name: 'Juan Miguel',
    lastName: 'Rojas',
    email: 'juanmiguelrojasnoriega@hotmail.com',
    identification: 1143873302,
    birthdate: '1998-01-01',
    contact: 3141234567,
    comment: 'Sin observaciones',
  },
];


const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
  return (
    <div className="datatable-container">
    <Paper sx={{ height: '400px', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0, overflow: 'auto' }}
      />
    </Paper>
    </div>
  );
}
