import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, TextField, Chip, Divider } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useState, useEffect } from "react";
import { getTransactionById } from "../../../services/transactions.service";
import { getClientById } from "../../../services/clients.service";
import { getVehicleById } from "../../../services/vehicles.service";
import { transactionStatusMap } from "../../../utils/transactionStatus.utils";
import { Transaction } from "../../../interfaces/transactions.interface";
import { Client } from "../../../interfaces/clients.interface";
import { Vehicle } from "../../../interfaces/vehicles.interface";
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
  const [buyer, setBuyer] = useState<Client | null>(null);
  const [seller, setSeller] = useState<Client | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);

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

      // Cargar datos relacionados
      const promises = [];
      
      if (transactionData.id_buyer) {
        promises.push(getClientById(transactionData.id_buyer.toString()));
      }
      
      if (transactionData.id_seller) {
        promises.push(getClientById(transactionData.id_seller.toString()));
      }
      
      if (transactionData.id_vehicle) {
        promises.push(getVehicleById(transactionData.id_vehicle.toString()));
      }

      const results = await Promise.allSettled(promises);
      
      let resultIndex = 0;
      
      if (transactionData.id_buyer) {
        const buyerResult = results[resultIndex++];
        if (buyerResult.status === 'fulfilled') {
          setBuyer(buyerResult.value as Client);
        }
      }
      
      if (transactionData.id_seller) {
        const sellerResult = results[resultIndex++];
        if (sellerResult.status === 'fulfilled') {
          setSeller(sellerResult.value as Client);
        }
      }
      
      if (transactionData.id_vehicle) {
        const vehicleResult = results[resultIndex++];
        if (vehicleResult.status === 'fulfilled') {
          setVehicle(vehicleResult.value as Vehicle);
        }
      }
      
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

  const getStatusColor = (statusId: number) => {
    const statusColors: { [key: number]: string } = {
      1: 'info',     // Nuevo
      2: 'warning',  // En proceso
      3: 'success',  // Completado
      4: 'error'     // Cancelado
    };
    return statusColors[statusId] || 'default';
  };

  const handleClose = () => {
    setTransaction(null);
    setBuyer(null);
    setSeller(null);
    setVehicle(null);
    onClose();
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
                label={transactionStatusMap[transaction.id_status.toString() as keyof typeof transactionStatusMap] || 'Desconocido'}
                color={getStatusColor(transaction.id_status) as any}
                variant="filled"
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
            
            {vehicle ? (
              <Box sx={{ pl: 4 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{vehicle.brand} {vehicle.line}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Placa: {vehicle.plate || 'No especificada'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Año: {vehicle.model || 'No especificado'}
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
                {buyer ? (
                  <Box>
                    <Typography variant="body1">{buyer.name} {buyer.lastName}</Typography>
                    <Typography variant="body2" color="text.secondary">{buyer.email}</Typography>
                    <Typography variant="body2" color="text.secondary">{buyer.contact}</Typography>
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
                {seller ? (
                  <Box>
                    <Typography variant="body1">{seller.name} {seller.lastName}</Typography>
                    <Typography variant="body2" color="text.secondary">{seller.email}</Typography>
                    <Typography variant="body2" color="text.secondary">{seller.contact}</Typography>
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
    </Dialog>
  );
};
