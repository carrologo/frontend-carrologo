import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, TextField, Chip, Divider, Snackbar, Alert } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useState, useEffect } from "react";
import { getTransactionById } from "../../../services/transactions.service";
import { getTransactionStatusName, getTransactionStatusColor } from "../../../utils/transactionStatus.utils";
import { Transaction } from "../../../interfaces/transactions.interface";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

interface ModalViewTransactionProps {
  open: boolean;
  onClose: () => void;
  transactionId: string | null;
}

export const ModalViewTransaction = ({ open, onClose, transactionId }: ModalViewTransactionProps) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (open && transactionId) {
      loadTransactionDetails();
    }
  }, [open, transactionId]);

  const loadTransactionDetails = async () => {
    if (!transactionId) return;
    
    setLoading(true);
    try {
      const transactionData = await getTransactionById(transactionId) as Transaction;
      setTransaction(transactionData);
    } catch (error) {
      console.error("Error cargando detalles de la transacción:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number | null) => {
    if (!amount) return "No especificado";
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const handleClose = () => {
    setTransaction(null);
    onClose();
  };

  const handleViewImages = () => {
    // Intentar obtener la URL de imágenes del vehículo
    const vehicleImageUrl = (transaction?.vehicleInfo as any)?.url_images;
    if (vehicleImageUrl) {
      window.open(vehicleImageUrl, "_blank");
    } else {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography>Cargando detalles de la transacción...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!transaction) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography>No se pudo cargar la transacción</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ flex: 1 }} />
          <Typography variant="h4" sx={{ textAlign: "center", flex: 1 }}>
            Detalles de Transacción #{transaction.id_transaction}
          </Typography>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <ClearIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Estado y fechas */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Estado de la Transacción</Typography>
              <Chip
                label={getTransactionStatusName(
                  transaction.statusInfo?.id_status?.toString() || 
                  transaction.id_status?.toString() || 
                  '1'
                )}
                style={{ 
                  backgroundColor: getTransactionStatusColor(
                    transaction.statusInfo?.id_status?.toString() || 
                    transaction.id_status?.toString() || 
                    '1'
                  ), 
                  color: 'white',
                  fontWeight: 'bold'
                }}
                size="small"
              />
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">Fecha de Inicio</Typography>
                  <Typography variant="body1">{formatDate(transaction.start_date)}</Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">Fecha de Cierre</Typography>
                  <Typography variant="body1">{formatDate(transaction.close_date)}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Información del vehículo */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <DirectionsCarIcon color="primary" />
              <Typography variant="h6">Vehículo</Typography>
            </Box>
            
            {transaction?.vehicleInfo ? (
              <Box sx={{ pl: 4 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{transaction.vehicleInfo.description}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Placa: {transaction.vehicleInfo.plate || 'No especificada'}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                No se especificó vehículo
              </Typography>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Información de personas */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PersonIcon color="primary" />
              <Typography variant="h6">Participantes</Typography>
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, pl: 4 }}>
              {/* Comprador */}
              <Box>
                <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                  Comprador
                </Typography>
                {transaction?.buyerInfo ? (
                  <Box>
                    <Typography variant="body1">{transaction.buyerInfo.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{transaction.buyerInfo.email}</Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No especificado
                  </Typography>
                )}
              </Box>
              
              {/* Vendedor */}
              <Box>
                <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                  Vendedor
                </Typography>
                {transaction?.sellerInfo ? (
                  <Box>
                    <Typography variant="body1">{transaction.sellerInfo.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{transaction.sellerInfo.email}</Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No especificado
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Información financiera */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AttachMoneyIcon color="primary" />
              <Typography variant="h6">Información Financiera</Typography>
            </Box>
            
            <Box sx={{ pl: 4 }}>
              <Typography variant="h5" color="primary">
                {formatAmount(transaction.amount)}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Descripción */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <DescriptionOutlinedIcon color="primary" />
              <Typography variant="h6">Descripción</Typography>
            </Box>
            
            <Box sx={{ pl: 4 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={transaction.description || 'Sin descripción'}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Documentos */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <DescriptionIcon color="primary" />
              <Typography variant="h6">Documentos</Typography>
            </Box>
            
            <Box sx={{ pl: 4 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {transaction.url_documents ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon color="action" />
                    <Button 
                      variant="outlined" 
                      size="small"
                      href={transaction.url_documents}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver Documentos
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No hay documentos adjuntos
                  </Typography>
                )}
                
                {transaction?.vehicleInfo && (
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={handleViewImages}
                  >
                    Ver Imágenes del Vehículo
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={handleClose}
          variant="contained"
          sx={{ minWidth: 120 }}
        >
          Cerrar
        </Button>
      </DialogActions>

      <Snackbar 
        open={showAlert} 
        autoHideDuration={3000} 
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ 
          position: 'fixed',
          top: 80,
          zIndex: 9999
        }}
      >
        <Alert 
          severity="warning" 
          onClose={() => setShowAlert(false)}
          sx={{
            minWidth: 300,
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          No hay una URL de imágenes asignada a este vehículo.
        </Alert>
      </Snackbar>
    </Dialog>
  );
};
