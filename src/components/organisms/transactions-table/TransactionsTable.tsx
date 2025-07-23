import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Dialog, Chip, Button, Box, Menu, MenuItem } from '@mui/material';
import { Transaction } from '../../../interfaces/transactions.interface';
import { getTransactionStatusName, getTransactionStatusColor, canEditTransaction } from '../../../utils/transactionStatus.utils';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import './TransactionsTable.css';

interface TransactionsTableProps {
  transactions: Transaction[];
  pagination?: { page: number; total: number };
  paginationModel: { page: number; pageSize: number };
  onPaginationChange: (page: number, pageSize: number) => void;
  onViewTransaction?: (transactionId: string) => void;
  onEditTransaction?: (transactionId: string) => void;
}

export default function TransactionsTable({ 
  transactions = [], 
  pagination, 
  paginationModel, 
  onPaginationChange,
  onViewTransaction,
  onEditTransaction
}: Readonly<TransactionsTableProps>) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const exportMenuOpen = Boolean(anchorEl);

  const handlePaginationModelChange = (newModel: { page: number; pageSize: number }) => {
    onPaginationChange(newModel.page + 1, newModel.pageSize);
  };

  const handleViewTransaction = (transaction: Transaction) => {
    if (onViewTransaction) {
      onViewTransaction(transaction.id_transaction.toString());
    } else {
      // Comportamiento por defecto si no se pasa la función
      setSelectedTransaction(transaction);
      setIsModalOpen(true);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    if (onEditTransaction) {
      onEditTransaction(transaction.id_transaction.toString());
    } else {
      // Comportamiento por defecto si no se pasa la función
      setSelectedTransaction(transaction);
      setIsEditModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleExportMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setAnchorEl(null);
  };

  const exportToPDF = () => {
    // Crear contenido HTML para el PDF
    const content = `
      <html>
        <head>
          <title>Reporte de Transacciones</title>
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
          <h1>Reporte de Transacciones</h1>
          <p>Fecha de generación: ${new Date().toLocaleDateString('es-ES')}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Comprador</th>
                <th>Vendedor</th>
                <th>Vehículo</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(transaction => `
                <tr>
                  <td>${transaction.id_transaction}</td>
                  <td>${transaction.buyerInfo ? `${transaction.buyerInfo.name} (${transaction.buyerInfo.email})` : 'No asignado'}</td>
                  <td>${transaction.sellerInfo ? `${transaction.sellerInfo.name} (${transaction.sellerInfo.email})` : 'No asignado'}</td>
                  <td>${transaction.vehicleInfo ? `${transaction.vehicleInfo.description} ${transaction.vehicleInfo.plate ? `(${transaction.vehicleInfo.plate})` : ''}` : 'No asignado'}</td>
                  <td>$${transaction.amount ? transaction.amount.toLocaleString() : '0'}</td>
                  <td>${getTransactionStatusName(transaction.statusInfo?.id_status?.toString() || transaction.id_status?.toString() || '1')}</td>
                  <td>${transaction.description || 'Sin descripción'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Crear ventana para imprimir
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
    // Preparar datos para CSV (compatible con Excel)
    const headers = ['ID', 'Comprador', 'Vendedor', 'Vehículo', 'Monto', 'Estado', 'Descripción'];
    
    const csvData = transactions.map(transaction => [
      transaction.id_transaction,
      transaction.buyerInfo ? `${transaction.buyerInfo.name} (${transaction.buyerInfo.email})` : 'No asignado',
      transaction.sellerInfo ? `${transaction.sellerInfo.name} (${transaction.sellerInfo.email})` : 'No asignado',
      transaction.vehicleInfo ? `${transaction.vehicleInfo.description} ${transaction.vehicleInfo.plate ? `(${transaction.vehicleInfo.plate})` : ''}` : 'No asignado',
      transaction.amount ? transaction.amount : 0,
      getTransactionStatusName(transaction.statusInfo?.id_status?.toString() || transaction.id_status?.toString() || '1'),
      transaction.description || 'Sin descripción'
    ]);

    // Crear CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        row.map(cell => 
          typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
        ).join(',')
      )
    ].join('\n');

    // Crear y descargar archivo
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transacciones_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    handleExportMenuClose();
  };

  const columns: GridColDef[] = [
    { 
      field: 'id_buyer', 
      headerName: 'Comprador', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params) => {
        const buyerInfo = params.row.buyerInfo;
        return buyerInfo ? `${buyerInfo.name} (${buyerInfo.email})` : 'No asignado';
      }
    },
    { 
      field: 'id_seller', 
      headerName: 'Vendedor', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params) => {
        const sellerInfo = params.row.sellerInfo;
        return sellerInfo ? `${sellerInfo.name} (${sellerInfo.email})` : 'No asignado';
      }
    },
    { 
      field: 'id_vehicle', 
      headerName: 'Vehículo', 
      flex: 1.5, 
      minWidth: 150,
      renderCell: (params) => {
        const vehicleInfo = params.row.vehicleInfo;
        return vehicleInfo ? `${vehicleInfo.description} ${vehicleInfo.plate ? `(${vehicleInfo.plate})` : ''}` : 'No asignado';
      }
    },
    {
      field: 'amount',
      headerName: 'Monto',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => `$${params.value ? params.value.toLocaleString() : '0'}`,
    },
    { field: 'description', headerName: 'Descripción', flex: 1.5, minWidth: 150,
      renderCell: (params) => params.value || 'Sin descripción'
    },
    { 
      field: 'documents', 
      headerName: 'Documentos', 
      flex: 1, 
      minWidth: 100,
      renderCell: (params) => {
        const documentUrl = params.row.url_documents || params.row.documents;
        return documentUrl ? (
          <a 
            href={documentUrl} 
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
        );
      }
    },
    { 
      field: 'id_status', 
      headerName: 'Estado', 
      flex: 1, 
      minWidth: 100,
      renderCell: (params) => {
        const statusInfo = params.row.statusInfo;
        const statusId = statusInfo?.id_status?.toString() || params.row.id_status?.toString() || '1';
        const statusName = getTransactionStatusName(statusId);
        const statusColor = getTransactionStatusColor(statusId);
        
        return (
          <Chip 
            label={statusName} 
            style={{ 
              backgroundColor: statusColor, 
              color: 'white',
              fontWeight: 'bold'
            }}
            size="small"
          />
        );
      }
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
            disabled={!canEditTransaction(
              params.row.statusInfo?.id_status?.toString() || 
              params.row.id_status?.toString() || 
              '1'
            )}
            title={!canEditTransaction(
              params.row.statusInfo?.id_status?.toString() || 
              params.row.id_status?.toString() || 
              '1'
            ) ? "No se puede editar una transacción completada o cancelada" : "Editar transacción"}
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
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mt: 2, 
          mb: 2, 
          flexShrink: 0 
        }}>
          <Box sx={{ flex: 1 }} />
          <Typography
            variant="h1"
            component="div"
            fontSize={30}
            sx={{ textAlign: "center", flex: 1 }}
          >
            Transacciones
          </Typography>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<GetAppIcon />}
              onClick={handleExportMenuClick}
              size="small"
            >
              Exportar
            </Button>
          </Box>
        </Box>
        
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
              <strong>Comprador:</strong> {selectedTransaction.buyerInfo ? `${selectedTransaction.buyerInfo.name} (${selectedTransaction.buyerInfo.email})` : 'No asignado'}
            </p>
            <p>
              <strong>Vendedor:</strong> {selectedTransaction.sellerInfo ? `${selectedTransaction.sellerInfo.name} (${selectedTransaction.sellerInfo.email})` : 'No asignado'}
            </p>
            <p>
              <strong>Vehículo:</strong> {selectedTransaction.vehicleInfo ? `${selectedTransaction.vehicleInfo.description} ${selectedTransaction.vehicleInfo.plate ? `(${selectedTransaction.vehicleInfo.plate})` : ''}` : 'No asignado'}
            </p>
            <p><strong>Monto:</strong> ${selectedTransaction.amount ? selectedTransaction.amount.toLocaleString() : '0'}</p>
            <p><strong>Descripción:</strong> {selectedTransaction.description || 'Sin descripción'}</p>
            <p>
              <strong>Documentos:</strong> 
              {selectedTransaction.url_documents || selectedTransaction.documents ? (
                <a 
                  href={(selectedTransaction.url_documents || selectedTransaction.documents) || ''} 
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
                label={getTransactionStatusName(
                  selectedTransaction.statusInfo?.id_status?.toString() || 
                  selectedTransaction.id_status?.toString() || 
                  '1'
                )} 
                style={{ 
                  backgroundColor: getTransactionStatusColor(
                    selectedTransaction.statusInfo?.id_status?.toString() || 
                    selectedTransaction.id_status?.toString() || 
                    '1'
                  ), 
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