import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Dialog, Chip } from '@mui/material';
import { Transaction } from '../../../interfaces/transactions.interface';
import { getTransactionStatusName, getTransactionStatusColor } from '../../../utils/transactionStatus.utils';
import VehicleInfoDisplay from '../../atoms/vehicle-info-display/VehicleInfoDisplay';
import ClientInfoDisplay from '../../atoms/client-info-display/ClientInfoDisplay';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './TransactionsTable.css';

interface TransactionsTableProps {
  transactions: Transaction[];
  pagination?: { page: number; total: number };
  paginationModel: { page: number; pageSize: number };
  onPaginationChange: (page: number, pageSize: number) => void;
}

export default function TransactionsTable({ 
  transactions = [], 
  pagination, 
  paginationModel, 
  onPaginationChange 
}: Readonly<TransactionsTableProps>) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handlePaginationModelChange = (newModel: { page: number; pageSize: number }) => {
    onPaginationChange(newModel.page + 1, newModel.pageSize);
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTransaction(null);
  };

  const columns: GridColDef[] = [
    { 
      field: 'id_buyer', 
      headerName: 'Comprador', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params) => <ClientInfoDisplay clientId={params.value} />
    },
    { 
      field: 'id_seller', 
      headerName: 'Vendedor', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params) => <ClientInfoDisplay clientId={params.value} />
    },
    { 
      field: 'id_vehicle', 
      headerName: 'Vehículo', 
      flex: 1.5, 
      minWidth: 150,
      renderCell: (params) => <VehicleInfoDisplay vehicleId={params.value.toString()} />
    },
    {
      field: 'amount',
      headerName: 'Monto',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => `$${params.value.toLocaleString()}`,
    },
    { field: 'description', headerName: 'Descripción', flex: 1.5, minWidth: 150 },
    { 
      field: 'documents', 
      headerName: 'Documentos', 
      flex: 1, 
      minWidth: 100,
      renderCell: (params) => (
        params.value ? (
          <a 
            href={params.value} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#1976d2', 
              textDecoration: 'underline'
            }}
          >
            Ver documentos
          </a>
        ) : (
          <span style={{ color: '#666' }}>No disponible</span>
        )
      )
    },
    { 
      field: 'id_status', 
      headerName: 'Estado', 
      flex: 1, 
      minWidth: 100,
      renderCell: (params) => (
        <Chip 
          label={getTransactionStatusName(params.value.toString())} 
          style={{ 
            backgroundColor: getTransactionStatusColor(params.value.toString()), 
            color: 'white',
            fontWeight: 'bold'
          }}
          size="small"
        />
      )
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <IconButton
            aria-label="ver"
            color="primary"
            onClick={() => handleViewTransaction(params.row)}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            aria-label="editar"
            color="secondary"
            onClick={() => handleEditTransaction(params.row)}
          >
            <ModeEditIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="transactionstable-container">
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
          Transacciones
        </Typography>
        
        <DataGrid
          rows={transactions}
          columns={columns}
          getRowId={(row) => row.id_transaction}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          paginationMode="server"
          rowCount={pagination?.total || 0}
          onCellDoubleClick={(params) => {
            if (params.field === "actions") return;
            handleViewTransaction(params.row);
          }}
          pageSizeOptions={[10, 25, 50]}
          sx={{ 
            border: 0,
            flex: 1
          }}
        />
      </Paper>

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        {selectedTransaction && (
          <div style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Detalles de la Transacción
            </Typography>
            <p>
              <strong>Comprador:</strong> <ClientInfoDisplay clientId={selectedTransaction.id_buyer} />
            </p>
            <p>
              <strong>Vendedor:</strong> <ClientInfoDisplay clientId={selectedTransaction.id_seller} />
            </p>
            <p>
              <strong>Vehículo:</strong> <VehicleInfoDisplay vehicleId={selectedTransaction.id_vehicle.toString()} />
            </p>
            <p><strong>Monto:</strong> ${selectedTransaction.amount.toLocaleString()}</p>
            <p><strong>Descripción:</strong> {selectedTransaction.description}</p>
            <p>
              <strong>Documentos:</strong> 
              {selectedTransaction.documents ? (
                <a 
                  href={selectedTransaction.documents} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#1976d2', 
                    textDecoration: 'underline',
                    marginLeft: '8px'
                  }}
                >
                  Ver documentos
                </a>
              ) : (
                <span style={{ color: '#666', marginLeft: '8px' }}>No disponible</span>
              )}
            </p>
            <p>
              <strong>Estado:</strong> 
              <Chip 
                label={getTransactionStatusName(selectedTransaction.id_status.toString())} 
                style={{ 
                  backgroundColor: getTransactionStatusColor(selectedTransaction.id_status.toString()), 
                  color: 'white',
                  fontWeight: 'bold',
                  marginLeft: '8px'
                }}
                size="small"
              />
            </p>
          </div>
        )}
      </Dialog>

      <Dialog open={isEditModalOpen} onClose={handleCloseEditModal} maxWidth="md" fullWidth>
        {selectedTransaction && (
          <div style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Editar Transacción
            </Typography>
            <p>Modal de edición de transacción (pendiente de implementar)</p>
          </div>
        )}
      </Dialog>
    </div>
  );
}