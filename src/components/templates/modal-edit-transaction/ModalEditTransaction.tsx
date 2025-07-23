import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Autocomplete,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { ClearIcon } from '@mui/x-date-pickers/icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Transaction, UpdateTransactionPost } from '../../../interfaces/transactions.interface';
import { Client } from '../../../interfaces/clients.interface';
import { Vehicle } from '../../../interfaces/vehicles.interface';
import { getClients } from '../../../services/clients.service';
import { getVehicles } from '../../../services/vehicles.service';
import { updateTransaction, getTransactionById } from '../../../services/transactions.service';
import { transactionStatusMap } from '../../../utils/transactionStatus.utils';
import { showSuccessToast, showErrorToast } from '../../../utils/toast.utils';

interface ModalEditTransactionProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transactionId: number;
}

const validationSchema = Yup.object({
  id_buyer: Yup.number().nullable(),
  id_seller: Yup.number().nullable(),
  id_vehicle: Yup.number().nullable(),
  amount: Yup.number()
    .required('El monto es requerido')
    .min(0, 'El monto debe ser mayor a 0'),
  description: Yup.string().max(1000, 'La descripción no puede exceder 1000 caracteres'),
  id_status: Yup.number().required('El estado es requerido'),
});

export const ModalEditTransaction: React.FC<ModalEditTransactionProps> = ({
  open,
  onClose,
  onSuccess,
  transactionId
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<UpdateTransactionPost | null>(null);
  const [transactionData, setTransactionData] = useState<Transaction | null>(null);

  useEffect(() => {
    console.log('Valores totales de clientes:', clients.length);
    if (open && transactionId) {
      loadInitialData();
    }
  }, [open, transactionId]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [clientsData, vehiclesData, transactionData] = await Promise.all([
        getClients(1, 1000), // Cargar todos los clientes
        getVehicles(),
        getTransactionById(transactionId.toString())
      ]);


      setClients(clientsData.data);
      setVehicles(vehiclesData.data);
      
      const transaction = transactionData as Transaction;
      setTransactionData(transaction);
      
      // Usar los IDs de la transacción para preseleccionar los valores
      setInitialValues({
        id_buyer: transaction.buyerInfo?.id || null,
        id_seller: transaction.sellerInfo?.id ?? null,
        id_vehicle: transaction.vehicleInfo?.id || null,
        amount: transaction.amount,
        description: transaction.description || '',
        id_status: transaction.id_status || 1,
      });

      // Los documentos no son editables, solo se muestran
    } catch (error) {
      console.error('Error loading initial data:', error);
      showErrorToast('Error al cargar los datos iniciales');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: UpdateTransactionPost) => {
    setLoading(true);
    try {
      // Excluir el campo documents ya que no es editable
      const { documents, ...updatePayload } = values;
      
      await updateTransaction(transactionId.toString(), updatePayload);
      showSuccessToast('Transacción actualizada exitosamente');
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      
      if (error.response?.status === 413) {
        showErrorToast('El archivo es demasiado grande. Por favor, seleccione un archivo más pequeño.');
      } else if (error.response?.status === 500) {
        showErrorToast('Error interno del servidor. Por favor, intente nuevamente.');
      } else {
        showErrorToast('Error al actualizar la transacción');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInitialValues(null);
    setTransactionData(null);
    onClose();
  };

  // Helper functions para encontrar las opciones seleccionadas
  const findSelectedClient = (clientId: number | null): Client | null => {
    if (!clientId || clients.length === 0) return null;
    return clients.find(client => Number(client.id) === Number(clientId)) || null;
  };

  const findSelectedVehicle = (vehicleId: number | null): Vehicle | null => {
    if (!vehicleId || vehicles.length === 0) return null;
    return vehicles.find(vehicle => Number(vehicle.id) === Number(vehicleId)) || null;
  };

  if (!initialValues || clients.length === 0 || vehicles.length === 0) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Cargando datos de la transacción...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }
  
;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ flex: 1 }} />
          <Typography variant="h4" sx={{ textAlign: "center", flex: 1 }}>
            Editar Transacción
          </Typography>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <ClearIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
          </Box>
        </Box>
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, values, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                    {/* Comprador */}
                    <Autocomplete
                      options={clients}
                      getOptionLabel={(option) => `${option.name} ${option.lastName} - ${option.identification}`}
                      value={findSelectedClient(values.id_buyer)}
                      onChange={(_, newValue) => {
                        setFieldValue('id_buyer', newValue?.id || null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Comprador"
                          error={touched.id_buyer && !!errors.id_buyer}
                          helperText={touched.id_buyer && errors.id_buyer}
                          placeholder={transactionData?.buyerInfo ? 
                            `${transactionData.buyerInfo.name} - ${transactionData.buyerInfo.email}` : 
                            'Buscar comprador...'
                          }
                        />
                      )}
                      sx={{ flex: 1 }}
                        renderOption={(props, option) => {
                          const { key, ...rest } = props;
                          return (
                            <li key={key} {...rest}>
                              <Box>
                                <Typography variant="body1">
                                  {option.name} {option.lastName} - {option.identification}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {option.email}
                                </Typography>
                              </Box>
                            </li>
                          );
                        }}
                    />

                    {/* Vendedor */}
                    <Autocomplete
                      options={clients}
                      getOptionLabel={(option) => `${option.name} ${option.lastName} - ${option.identification}`}
                      value={findSelectedClient(values.id_seller)}
                      onChange={(_, newValue) => {
                        setFieldValue('id_seller', newValue?.id || null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Vendedor"
                          error={touched.id_seller && !!errors.id_seller}
                          helperText={touched.id_seller && errors.id_seller}
                          placeholder={transactionData?.sellerInfo ? 
                            `${transactionData.sellerInfo.name} - ${transactionData.sellerInfo.email}` : 
                            'Buscar vendedor...'
                          }
                        />
                        
                      )}
                      sx={{ flex: 1 }}
                        renderOption={(props, option) => {
                          const { key, ...rest } = props;
                          return (
                            <li key={key} {...rest}>
                              <Box>
                                <Typography variant="body1">
                                  {option.name} {option.lastName} - {option.identification}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {option.email}
                                </Typography>
                              </Box>
                            </li>
                          );
                        }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                    {/* Vehículo */}
                    <Autocomplete
                      options={vehicles}
                      getOptionLabel={(option) => `${option.brand} ${option.line} - ${option.plate}`}
                      value={findSelectedVehicle(values.id_vehicle)}
                      onChange={(_, newValue) => {
                        setFieldValue('id_vehicle', newValue?.id || null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Vehículo"
                          error={touched.id_vehicle && !!errors.id_vehicle}
                          helperText={touched.id_vehicle && errors.id_vehicle}
                          placeholder={transactionData?.vehicleInfo ? 
                            `${transactionData.vehicleInfo.description} - ${transactionData.vehicleInfo.plate || 'Sin placa'}` : 
                            'Buscar vehículo...'
                          }
                        />
                      )}
                      sx={{ flex: 1 }}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Box>
                            <Typography variant="body1">
                              {option.brand} {option.line}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Placa: {option.plate || 'Sin placa'}
                            </Typography>
                          </Box>
                        </li>
                      )}
                    />

                    {/* Estado */}
                    <FormControl sx={{ flex: 1 }}>
                      <InputLabel>Estado</InputLabel>
                      <Select
                        value={values.id_status}
                        label="Estado"
                        onChange={(e: SelectChangeEvent<number>) => {
                          setFieldValue('id_status', e.target.value);
                        }}
                        error={touched.id_status && !!errors.id_status}
                      >
                        {Object.entries(transactionStatusMap).map(([id, name]) => (
                          <MenuItem key={id} value={parseInt(id)}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                      {transactionData?.statusInfo && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, ml: 1 }}>
                          Estado actual: {transactionData.statusInfo.name}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                    {/* Monto */}
                    <Field name="amount">
                      {({ field }: any) => (
                        <TextField
                          {...field}
                          label="Monto"
                          type="number"
                          error={touched.amount && !!errors.amount}
                          helperText={touched.amount && errors.amount}
                          required
                          sx={{ flex: 1 }}
                        />
                      )}
                    </Field>

                    {/* Documentos - Solo mostrar si existe */}
                    {transactionData?.url_documents && (
                      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Documento actual:
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          href={transactionData.url_documents}
                          target="_blank"
                          rel="noopener noreferrer"
                          disabled={!transactionData.url_documents}
                        >
                          Ver Documento
                        </Button>
                      </Box>
                    )}
                  </Box>

                  {/* Descripción */}
                  <Field name="description">
                    {({ field }: any) => (
                      <TextField
                        {...field}
                        label="Descripción"
                        multiline
                        rows={4}
                        fullWidth
                        error={touched.description && !!errors.description}
                        helperText={touched.description && errors.description}
                      />
                    )}
                  </Field>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleClose} variant="outlined">
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || loading}
                sx={{ minWidth: 120 }}
              >
                {isSubmitting || loading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
