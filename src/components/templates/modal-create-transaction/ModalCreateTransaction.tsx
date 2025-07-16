import * as Yup from "yup";
import { createTransaction, CreateTransactionPost } from "../../../services/transactions.service";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel, FormHelperText, Autocomplete } from "@mui/material";
import { Formik, Form } from "formik";
import ClearIcon from "@mui/icons-material/Clear";
import { useState, useEffect } from "react";
import { getClients } from "../../../services/clients.service";
import { getVehicles } from "../../../services/vehicles.service";
import { transactionStatusMap } from "../../../utils/transactionStatus.utils";
import { Client } from "../../../interfaces/clients.interface";
import { Vehicle } from "../../../interfaces/vehicles.interface";
import DocumentUploadField from "../../molecules/document-upload-field/DocumentUploadField";
import { cleanBase64, getBase64Size } from "../../../utils/documentCompression.utils";

const validationSchema = Yup.object({
  id_vehicle: Yup.string().optional(),
  id_buyer: Yup.string().optional(),
  id_seller: Yup.string().optional(),
  id_status: Yup.string().required("El estado es obligatorio"),
  amount: Yup.number().optional(),
  description: Yup.string().optional(),
  documents: Yup.array().optional(),
});

const initialValues = {
  id_vehicle: "",
  id_buyer: "",
  id_seller: "",
  id_status: "1", // "Nuevo" por defecto
  amount: 0,
  description: "",
  documents: [],
};

interface ModalCreateTransactionProps {
  open: boolean;
  onClose: () => void;
  onTransactionCreated: () => void;
}

export const ModalCreateTransaction = ({ open, onClose, onTransactionCreated }: ModalCreateTransactionProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    if (open) {
      loadClientsAndVehicles();
    }
  }, [open]);

  const loadClientsAndVehicles = async () => {
    try {
      const [clientsData, vehiclesData] = await Promise.all([
        getClients(1, 1000), // Cargar muchos para tener todas las opciones
        getVehicles(1, 1000)
      ]);
      setClients(clientsData.data || []);
      setVehicles(vehiclesData.data || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const handleCreateTransaction = async (data: any) => {
    try {
      console.log("=== INICIANDO CREACIÓN DE TRANSACCIÓN ===");
      console.log("Datos recibidos:", data);

      // Procesar documentos para limpiar el base64 y crear array de document_transaction
      let processedDocuments = null;
      
      if (data.documents && Array.isArray(data.documents) && data.documents.length > 0) {
        console.log("Número de documentos:", data.documents.length);
        console.log("Documentos originales:", data.documents.map((doc: any) => ({
          name: doc.name,
          base64Length: doc.base64?.length || 0,
          base64Size: getBase64Size(doc.base64 || "")
        })));
        
        // Verificar tamaño total antes de procesar
        const totalSize = data.documents.reduce((sum: number, doc: any) => {
          return sum + getBase64Size(doc.base64 || "");
        }, 0);
        
        console.log("Tamaño total de documentos:", totalSize, "bytes");
        console.log("Tamaño total de documentos:", (totalSize / 1024 / 1024).toFixed(2), "MB");
        
        // Límite de 1MB por documento y 4MB total
        const maxFileSize = 1 * 1024 * 1024; // 1MB
        const maxTotalSize = 4 * 1024 * 1024; // 4MB
        
        if (totalSize > maxTotalSize) {
          throw new Error(`El tamaño total de los documentos (${(totalSize / 1024 / 1024).toFixed(2)}MB) excede el límite de ${maxTotalSize / 1024 / 1024}MB permitido`);
        }
        
        // Verificar tamaño individual y procesar
        processedDocuments = data.documents.map((doc: any) => {
          const docSize = getBase64Size(doc.base64 || "");
          
          if (docSize > maxFileSize) {
            throw new Error(`El documento "${doc.name}" (${(docSize / 1024 / 1024).toFixed(2)}MB) excede el límite de ${maxFileSize / 1024 / 1024}MB por archivo`);
          }
          
          const processed = {
            base64: cleanBase64(doc.base64),
            name: doc.name || "documento.pdf"
          };
          
          // Verificar que el base64 no esté vacío
          if (!processed.base64) {
            throw new Error(`Error procesando el documento: ${processed.name}`);
          }
          
          return processed;
        });
        
        console.log("Documentos procesados:", processedDocuments.map((doc: any) => ({
          name: doc.name,
          base64Length: doc.base64.length,
          base64Size: getBase64Size(doc.base64)
        })));
      }

      // Convertir los datos al formato correcto
      const cleanData: CreateTransactionPost = {
        id_vehicle: data.id_vehicle ? parseInt(data.id_vehicle.toString()) : null,
        id_buyer: data.id_buyer ? parseInt(data.id_buyer.toString()) : null,
        id_seller: data.id_seller ? parseInt(data.id_seller.toString()) : null,
        id_status: parseInt(data.id_status.toString()),
        amount: data.amount ? Number(data.amount) : null,
        description: data.description?.trim() || null,
        documents: processedDocuments,
      };

      // Validar que el id_status no sea NaN
      if (isNaN(cleanData.id_status)) {
        throw new Error('El estado de la transacción es requerido');
      }

      // Calcular tamaño del payload
      const payloadSize = JSON.stringify(cleanData).length;
      console.log("Tamaño del payload:", payloadSize, "bytes");
      console.log("Tamaño del payload:", (payloadSize / 1024 / 1024).toFixed(2), "MB");

      // Límite de 5MB para el payload completo
      const maxPayloadSize = 5 * 1024 * 1024; // 5MB
      if (payloadSize > maxPayloadSize) {
        throw new Error(`El tamaño total de la transacción (${(payloadSize / 1024 / 1024).toFixed(2)}MB) excede el límite de ${maxPayloadSize / 1024 / 1024}MB permitido`);
      }

      console.log("Datos a enviar:", {
        ...cleanData,
        documents: cleanData.documents ? `[${cleanData.documents.length} documentos]` : null
      });

      console.log("Validaciones:", {
        id_status_valid: !isNaN(cleanData.id_status),
        id_vehicle_valid: cleanData.id_vehicle === null || !isNaN(cleanData.id_vehicle),
        id_buyer_valid: cleanData.id_buyer === null || !isNaN(cleanData.id_buyer),
        id_seller_valid: cleanData.id_seller === null || !isNaN(cleanData.id_seller),
        amount_valid: cleanData.amount === null || !isNaN(cleanData.amount),
        documents_valid: cleanData.documents === null || (Array.isArray(cleanData.documents) && cleanData.documents.length > 0),
        payload_size_valid: payloadSize <= maxPayloadSize
      });
      
      await createTransaction(cleanData);
      console.log("✅ Transacción creada exitosamente");
      onTransactionCreated();
      onClose();
    } catch (error) {
      console.error("❌ Error al crear transacción:", error);
      
      // Mostrar error más específico al usuario
      if (error && typeof error === 'object' && (error as any).response) {
        const errorResponse = (error as any).response;
        const errorData = errorResponse.data;
        console.error("Error del servidor:", errorData);
        
        // Mostrar mensaje de error específico
        if (errorData?.message) {
          alert(`Error del servidor: ${errorData.message}`);
        } else if (errorResponse.status === 500) {
          alert('Error interno del servidor. El documento puede ser demasiado grande. Intente con archivos más pequeños.');
        } else if (errorResponse.status === 413) {
          alert('Los documentos son demasiado grandes. Reduzca el tamaño de los archivos e intente nuevamente.');
        }
      } else if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Error desconocido al crear la transacción');
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleCreateTransaction}
        enableReinitialize
      >
        {({ errors, touched, setFieldValue, values, isSubmitting }) => (
          <Form>
            <DialogTitle>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ flex: 1 }} />
                <Typography variant="h4" sx={{ textAlign: "center", flex: 1 }}>Crear Transacción</Typography>
                <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                  <ClearIcon sx={{ cursor: "pointer" }} onClick={onClose} />
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Box sx={{ 
                mt: 2,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2
              }}>
                {/* Vehículo */}
                <Box>
                  <Autocomplete
                    options={vehicles.map(vehicle => ({
                      value: vehicle.id?.toString() || "",
                      label: `${vehicle.brand} ${vehicle.line} ${vehicle.plate ? `(${vehicle.plate})` : ''}`.trim()
                    }))}
                    getOptionLabel={(option) => option.label}
                    value={vehicles.map(vehicle => ({
                      value: vehicle.id?.toString() || "",
                      label: `${vehicle.brand} ${vehicle.line} ${vehicle.plate ? `(${vehicle.plate})` : ''}`.trim()
                    })).find(option => option.value === values.id_vehicle) || null}
                    onChange={(_, newValue) => setFieldValue('id_vehicle', newValue?.value || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Vehículo"
                        error={touched.id_vehicle && Boolean(errors.id_vehicle)}
                        helperText={touched.id_vehicle && errors.id_vehicle}
                        fullWidth
                      />
                    )}
                  />
                </Box>

                {/* Comprador */}
                <Box>
                  <Autocomplete
                    options={clients.map(client => ({
                      value: client.id?.toString() || "",
                      label: `${client.name} ${client.lastName} (${client.email})`
                    }))}
                    getOptionLabel={(option) => option.label}
                    value={clients.map(client => ({
                      value: client.id?.toString() || "",
                      label: `${client.name} ${client.lastName} (${client.email})`
                    })).find(option => option.value === values.id_buyer) || null}
                    onChange={(_, newValue) => setFieldValue('id_buyer', newValue?.value || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Comprador"
                        error={touched.id_buyer && Boolean(errors.id_buyer)}
                        helperText={touched.id_buyer && errors.id_buyer}
                        fullWidth
                      />
                    )}
                  />
                </Box>

                {/* Vendedor */}
                <Box>
                  <Autocomplete
                    options={clients.map(client => ({
                      value: client.id?.toString() || "",
                      label: `${client.name} ${client.lastName} (${client.email})`
                    }))}
                    getOptionLabel={(option) => option.label}
                    value={clients.map(client => ({
                      value: client.id?.toString() || "",
                      label: `${client.name} ${client.lastName} (${client.email})`
                    })).find(option => option.value === values.id_seller) || null}
                    onChange={(_, newValue) => setFieldValue('id_seller', newValue?.value || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Vendedor"
                        error={touched.id_seller && Boolean(errors.id_seller)}
                        helperText={touched.id_seller && errors.id_seller}
                        fullWidth
                      />
                    )}
                  />
                </Box>

                {/* Estado */}
                <Box>
                  <FormControl fullWidth error={touched.id_status && Boolean(errors.id_status)}>
                    <InputLabel>Estado *</InputLabel>
                    <Select
                      value={values.id_status}
                      onChange={(e) => setFieldValue('id_status', e.target.value)}
                      label="Estado *"
                    >
                      {Object.entries(transactionStatusMap).map(([id, name]) => (
                        <MenuItem key={id} value={id}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.id_status && errors.id_status && (
                      <FormHelperText>{errors.id_status}</FormHelperText>
                    )}
                  </FormControl>
                </Box>

                {/* Monto */}
                <Box>
                  <TextField
                    fullWidth
                    type="number"
                    label="Monto"
                    value={values.amount}
                    onChange={(e) => setFieldValue('amount', e.target.value)}
                    error={touched.amount && Boolean(errors.amount)}
                    helperText={touched.amount && errors.amount}
                  />
                </Box>

                {/* Descripción - ocupa toda la fila */}
                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Descripción"
                    value={values.description}
                    onChange={(e) => setFieldValue('description', e.target.value)}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Box>

                {/* Documentos - ocupa toda la fila */}
                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                  <DocumentUploadField
                    field={{
                      name: 'documents',
                      label: 'Documentos',
                      type: 'document',
                      required: false,
                      multiple: true
                    }}
                    formikField={{ value: values.documents }}
                    setFieldValue={setFieldValue}
                    touched={touched}
                    errors={errors}
                  />
                </Box>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 2 }}>
              <Button 
                onClick={onClose} 
                disabled={isSubmitting}
                variant="outlined"
                sx={{ flex: 1, minWidth: 120 }}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                variant="contained"
                sx={{ flex: 1, minWidth: 120 }}
              >
                {isSubmitting ? "Creando..." : "Crear Transacción"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
