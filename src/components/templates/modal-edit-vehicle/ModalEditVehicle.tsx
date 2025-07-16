import { FieldConfig } from "../../../interfaces/modal-form.interface";
import * as Yup from "yup";
import { updateVehicle, UpdateVehiclePost } from "../../../services/vehicles.service";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// Extender dayjs con el plugin UTC
dayjs.extend(utc);
import { useState } from "react";
import { useFormik } from "formik";
import MultiStepModal from "../../organisms/multi-step-modal/MultiStepModal";
import DynamicForm from "../../molecules/dynamicform/DynamicForm";
import { VehicleDocument, UpdateVehicleDocument, Vehicle } from "../../../interfaces/vehicles.interface";
import { showLoadingToast, updateToast } from "../../../utils/toast.utils";
import { Box, Button, Alert } from '@mui/material';
import { Image as ImageIcon } from '@mui/icons-material';

const field1: FieldConfig[] = [
  { name: "brand", label: "Marca", type: "text", required: true },
  { name: "line", label: "Linea", type: "text", required: true },
  { name: "type", label: "Tipo de Vehiculo", type: "text", required: true },
  { name: "plate", label: "Placa", type: "text", required: true },
  { name: "version", label: "Versión", type: "text" },
  { name: "transmission", label: "Transmisión", type: "text" },
  { name: "traction", label: "Tipo de Traccion", type: "text" },
  { name: "fuelType", label: "Tipo de Combustible", type: "text", required: true },
  { name: "kms", label: "Kilometraje", type: "number", required: true },
  { name: "model", label: "Modelo", type: "date", views: ["year"], required: true,},
  { name: "displacement", label: "Cilindrada", type: "number" },
  { name: "seatMaterial", label: "Material de Asientos", type: "text" },
  { name: "airbags", label: "Airbags", type: "boolean" },
];

const field2: FieldConfig[] = [
  { name: "documents", label: "Documentos del Vehículo", type: "documents", required: true },
];

const steps = [
  { title: "Información Básica", fields: field1 },
  { title: "Documentación", fields: field2 },
];

const validationSchema = Yup.object({
  brand: Yup.string().required("La marca es obligatoria"),
  line: Yup.string().required("La linea es obligatoria"),
  type: Yup.string().required("El tipo de vehiculo es obligatorio"),
  plate: Yup.string().required("La placa es obligatoria"),
  version: Yup.string(),
  transmission: Yup.string(),
  traction: Yup.string(),
  fuelType: Yup.string().required("El tipo de combustible es obligatorio"),
  kms: Yup.number().typeError("Debe ser un número").required("El kilometraje es obligatorio"),
  model: Yup.date().required("El modelo es obligatorio"),
  displacement: Yup.number(),
  seatMaterial: Yup.string(),
  airbags: Yup.boolean(),
  documents: Yup.array()
    .of(
      Yup.object({
        documentTypeId: Yup.number().required("El tipo de documento es obligatorio"),
        expirationDate: Yup.string().required("La fecha de vencimiento es obligatoria"),
      })
    )
    .min(1, "Debe agregar al menos un documento")
    .required("Los documentos son obligatorios"),
});

interface ModalEditVehicleProps { 
  onClose: () => void;
  vehicleId: number;
  initialData: Vehicle; // Usar la interfaz Vehicle que coincide con el GET
  onVehicleEdited: () => void;
  imageUrl?: string;
}

export const ModalEditVehicle = ({
  onClose,
  vehicleId,
  initialData,
  onVehicleEdited,
  imageUrl,
}: ModalEditVehicleProps) => {

const parsedInitialData = {
  type: initialData.type,
  brand: initialData.brand,
  line: initialData.line,
  plate: initialData.plate,
  version: initialData.version || '',
  transmission: initialData.transmission || '',
  traction: initialData.traction || '',
  fuelType: initialData.fuel_type, // Mapear del campo que llega del backend
  kms: initialData.kms,
  model: dayjs(initialData.model),
  displacement: initialData.displacement || 0,
  seatMaterial: initialData.seat_material || '', // Mapear del campo que llega del backend
  airbags: initialData.airbags || false,
  documents: initialData.documents?.map(doc => {
    const formattedDate = doc.expirationDate ? dayjs.utc(doc.expirationDate).format('YYYY-MM-DD') : '';
    return {
      documentTypeId: doc.documentTypeId,
      expirationDate: formattedDate,
      id: doc.id, // Conservar el ID para updates
      category: doc.category, // Conservar categoría si existe
      idVehicle: doc.idVehicle // Conservar relación con vehículo
    };
  }) || [], // Formatear fechas de documentos existentes
};


  const [currentStep, setCurrentStep] = useState(0);
  const [showImageAlert, setShowImageAlert] = useState(false);

  // Función para ver imágenes
  const handleViewImages = () => {
    if (imageUrl && imageUrl.trim() !== '') {
      window.open(imageUrl, "_blank");
    } else {
      setShowImageAlert(true);
      setTimeout(() => setShowImageAlert(false), 3000);
    }
  };
  const formik = useFormik({
    initialValues: parsedInitialData,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleUpdate(values);
    },
  });

const handleUpdate = async (data: Record<string, unknown>) => {
  console.log("🔥 handleUpdate INICIADO con datos:", data);
  const toastId = showLoadingToast("Actualizando vehículo...");
  
  try {
    const allDocuments = data.documents as VehicleDocument[] || [];
    
    // Transformar TODOS los documentos válidos (existentes y nuevos)
    const transformedDocuments = allDocuments
      .filter(doc => doc.documentTypeId && doc.expirationDate) // Solo filtrar por campos requeridos
      .map(doc => ({
        ...(doc.id && { id: doc.id }), // Solo incluir ID si existe (documentos existentes)
        documentTypeId: doc.documentTypeId,
        expirationDate: doc.expirationDate,
        idVehicle: vehicleId // Usar el ID del vehículo que estamos editando
      }));

    const transformedData: UpdateVehiclePost = {
      type: data.type as string,
      brand: data.brand as string,
      line: data.line as string,
      plate: String(data.plate).toUpperCase(),
      version: data.version as string,
      transmission: data.transmission as string,
      traction: data.traction as string,
      fuelType: data.fuelType as string,
      kms: data.kms as number,
      model: dayjs(data.model as string).toISOString(),
      displacement: data.displacement as number,
      seatMaterial: data.seatMaterial as string,
      airbags: data.airbags as boolean,
      documents: transformedDocuments as UpdateVehicleDocument[], // El backend maneja ambos casos
      // No incluir images para que no se toquen las existentes
    };

    await updateVehicle(vehicleId, transformedData);
    
    updateToast(toastId, "¡Vehículo actualizado exitosamente!", "success");
    onVehicleEdited();
    onClose();
  } catch (error) {
    console.error("❌ Error al actualizar vehículo:", error);
    updateToast(toastId, "Error al actualizar el vehículo", "error");
  }
};


  
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

  const handleCustomSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    console.log("🔥 handleCustomSubmit ejecutado");
    console.log("🔍 Evento:", e);
    console.log("🔍 Formik isValid antes del submit:", formik.isValid);
    console.log("🔍 Formik errors antes del submit:", formik.errors);
    console.log("🔍 Formik values antes del submit:", formik.values);
    
    if (e) {
      e.preventDefault();
    }
    
    formik.handleSubmit(e);
  };

  return (
    <MultiStepModal
      open={true}
      onClose={onClose}
      title="Editar Vehículo"
      initialValues={parsedInitialData}
      steps={steps}
      currentStep={currentStep}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSubmit={handleCustomSubmit}
      isSubmitting={formik.isSubmitting}
      canProceed={true}
      submitButtonText="Actualizar Vehículo"
      submittingText="Actualizando..."
    >
      {/* Renderiza los campos del paso actual */}
      {steps.map((step, index) => (
        <Box key={index}>
          {/* Mostrar botón de imágenes solo en el primer step */}
          {index === 0 && currentStep === 0 && (
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
            </Box>
          )}
          
          <DynamicForm 
            fields={step.fields} 
            formik={formik}
            isEditMode={true}
            imageUrl={imageUrl}
          />
        </Box>
      ))}
    </MultiStepModal>
  );
};
