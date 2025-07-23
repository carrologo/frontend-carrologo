import { FieldConfig } from "../../../interfaces/modal-form.interface";
import * as Yup from "yup";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import MultiStepModal from "../../organisms/multi-step-modal/MultiStepModal";
import DynamicForm from "../../molecules/dynamicform/DynamicForm";
import { Vehicle, TypeDocument } from "../../../interfaces/vehicles.interface";
import { Box, Typography, Card, CardContent, Chip, Button, Alert } from '@mui/material';
import { Description, CalendarToday, Image as ImageIcon } from '@mui/icons-material';
import { getValues } from '../../../services/values.service';

// Extender dayjs con el plugin UTC
dayjs.extend(utc);

const field1: FieldConfig[] = [
  { name: "brand", label: "Marca", type: "text", required: true, disabled: true },
  { name: "line", label: "Linea", type: "text", required: true, disabled: true },
  { name: "type", label: "Tipo de Vehiculo", type: "text", required: true, disabled: true },
  { name: "plate", label: "Placa", type: "text", required: true, disabled: true },
  { name: "version", label: "Versión", type: "text", disabled: true },
  { name: "transmission", label: "Transmisión", type: "text", disabled: true },
  { name: "traction", label: "Tipo de Traccion", type: "text", disabled: true },
  { name: "fuelType", label: "Tipo de Combustible", type: "text", required: true, disabled: true },
  { name: "kms", label: "Kilometraje", type: "number", required: true, disabled: true },
  { name: "model", label: "Modelo", type: "date", views: ['year'], required: true, disabled: true },
  { name: "displacement", label: "Cilindrada", type: "number", disabled: true },
  { name: "seatMaterial", label: "Material de Asientos", type: "text", disabled: true },
  { name: "airbags", label: "Airbags", type: "boolean", disabled: true },
];

const steps = [
  { title: "Información del Vehículo", fields: field1 },
  { title: "Documentos", fields: [] }, // Step personalizado para documentos
  { title: "Deudas", fields: [] }, // Nuevo step para deudas
];

const validationSchema = Yup.object({});

interface ModalViewVehicleProps {
  onClose: () => void;
  initialData: Vehicle; // Usar la interfaz Vehicle que coincide con el GET
  imageUrl?: string;
}

export const ModalViewVehicle = ({ onClose, initialData, imageUrl }: ModalViewVehicleProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [typeDocuments, setTypeDocuments] = useState<TypeDocument[]>([]);
  const [typeDebts, setTypeDebts] = useState<{id: number; name: string}[]>([]);
  const [showImageAlert, setShowImageAlert] = useState(false);

  // Cargar tipos de documentos
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await getValues();
        setTypeDocuments(response.data.typeDocuments);
        setTypeDebts(response.data.typeDebts);
      } catch (error) {
        console.error('Error al cargar tipos de documentos o deudas:', error);
      }
    };
    fetchTypes();
  }, []);

  // Función para obtener el nombre del tipo de documento
  const getDocumentTypeName = (document_type_id: number): string => {
    const docType = typeDocuments.find(type => type.id === document_type_id);
    return docType ? docType.name : `Documento tipo ${document_type_id}`;
  };

  // Función para obtener el nombre del tipo de deuda
  const getDebtTypeName = (typeDebtId: number): string => {
    
    const debtType = typeDebts.find(type => type.id === typeDebtId);
    return debtType ? debtType.name : `Tipo deuda ${typeDebtId}`;
  };

  // Función para ver imágenes
  const handleViewImages = () => {
    if (imageUrl && imageUrl.trim() !== '') {
      window.open(imageUrl, "_blank");
    } else {
      setShowImageAlert(true);
      setTimeout(() => setShowImageAlert(false), 3000);
    }
  };

  // Formatear los datos para mostrar
  const parsedInitialData = {
    type: initialData.type,
    brand: initialData.brand,
    line: initialData.line,
    plate: initialData.plate,
    version: initialData.version || 'N/A',
    transmission: initialData.transmission || 'N/A',
    traction: initialData.traction || 'N/A',
    fuelType: initialData.fuel_type, // Mapear del campo que llega del backend
    kms: initialData.kms,
    model: dayjs(initialData.model),
    displacement: initialData.displacement || 0,
    seatMaterial: initialData.seat_material || 'N/A', // Mapear del campo que llega del backend
    airbags: initialData.airbags || false,
  };

  const formik = useFormik({
    initialValues: parsedInitialData,
    validationSchema: validationSchema,
    onSubmit: () => {
      // No hacer nada, es solo vista
    },
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Componente para mostrar documentos
  const DocumentsView = () => {
    if (!initialData.documents || initialData.documents.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Description sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay documentos registrados para este vehículo
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Description color="primary" />
          Documentos del Vehículo ({initialData.documents.length})
        </Typography>
        {initialData.documents.map((document, index) => {
          const expirationDate = dayjs.utc(document.expiration_date);
          const today = dayjs();
          const daysUntilExpiration = expirationDate.diff(today, 'days');
          const isExpired = daysUntilExpiration < 0;
          const isExpiringSoon = daysUntilExpiration <= 30 && daysUntilExpiration >= 0;

          return (
            <Card 
              key={document.id || index} 
              sx={{ 
                mb: 2, 
                border: isExpired ? '2px solid #f44336' : isExpiringSoon ? '2px solid #ff9800' : '1px solid #e0e0e0',
                backgroundColor: isExpired ? '#ffebee' : isExpiringSoon ? '#fff3e0' : 'white'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    Documento #{document.id}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {isExpired && (
                      <Chip 
                        label="VENCIDO" 
                        size="small" 
                        color="error" 
                      />
                    )}
                    {isExpiringSoon && (
                      <Chip 
                        label="PRÓXIMO A VENCER" 
                        size="small" 
                        color="warning" 
                      />
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tipo de Documento
                    </Typography>
                    <Typography variant="body1">
                      {getDocumentTypeName(document.document_type_id)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <CalendarToday sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                      Fecha de Vencimiento
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: isExpired ? 'error.main' : isExpiringSoon ? 'warning.main' : 'text.primary',
                        fontWeight: (isExpired || isExpiringSoon) ? 'bold' : 'normal'
                      }}
                    >
                      {expirationDate.format('DD/MM/YYYY')}
                      {daysUntilExpiration >= 0 && (
                        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                          ({daysUntilExpiration === 0 ? 'Vence hoy' : 
                            daysUntilExpiration === 1 ? 'Vence mañana' :
                            `Vence en ${daysUntilExpiration} días`})
                        </Typography>
                      )}
                      {isExpired && (
                        <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'error.main' }}>
                          (Vencido hace {Math.abs(daysUntilExpiration)} días)
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    );
  };

  // Componente para mostrar deudas
  const DebtsView = () => {
    if (!initialData.debts || initialData.debts.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Description sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay deudas registradas para este vehículo
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Description color="primary" />
          Deudas del Vehículo ({initialData.debts.length})
        </Typography>
        {initialData.debts.map((debt, index) => {
          const createdDate = dayjs(debt.created_at);
          return (
            <Card
              key={debt.id || index}
              sx={{ mb: 2, border: '2px solid #ff9800', backgroundColor: '#fff3e0' }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    Deuda #{debt.id}
                  </Typography>
          <Chip label={getDebtTypeName(debt.type_debt_id)} size="small" color="warning" />
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Fecha de Registro
                    </Typography>
                    <Typography variant="body1">
                      {createdDate.format('DD/MM/YYYY HH:mm')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Monto
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                      $ {debt.amount.toLocaleString('es-CO')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    );
  };

  return (
    <MultiStepModal
      open={true}
      onClose={onClose}
      title="Detalles del Vehículo"
      initialValues={parsedInitialData}
      steps={steps}
      currentStep={currentStep}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSubmit={onClose} // Cerrar el modal cuando se hace clic en "Cerrar"
      isSubmitting={false}
      canProceed={true}
      submitButtonText="Cerrar"
      submittingText=""
    >
      {/* Renderizar contenido basado en el step actual */}
      {currentStep === 0 && (
        <Box>
          {/* Alerta para imágenes no disponibles */}
          {showImageAlert && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No hay imágenes disponibles para este vehículo
            </Alert>
          )}
          {/* Botón para ver imágenes */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleViewImages}
              startIcon={<ImageIcon />}
              sx={{ mb: 2 }}
            >
              Ver Imágenes del Vehículo
            </Button>
          </Box>
          <DynamicForm 
            fields={field1} 
            formik={formik}
            isEditMode={false}
            imageUrl={imageUrl}
          />
        </Box>
      )}
      {currentStep === 1 && <DocumentsView />}
      {currentStep === 2 && <DebtsView />}
    </MultiStepModal>
  );
};
