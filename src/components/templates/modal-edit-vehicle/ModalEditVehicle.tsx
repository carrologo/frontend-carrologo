import { FieldConfig } from "../../../interfaces/modal-form.interface";
import { useEffect } from "react";
import { getValues } from '../../../services/values.service';
import { Debt, UpdateVehicleDebt } from '../../../interfaces/vehicles.interface';
import { DebtManager } from '../../molecules/debt-manager/DebtManager';
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

const field3: FieldConfig[] = [
  { name: "debts", label: "Deudas del Vehículo", type: "debts", required: false },
];

const steps = [
  { title: "Información Básica", fields: field1 },
  { title: "Documentación", fields: field2 },
  { title: "Deudas", fields: field3 },
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
        document_type_id: Yup.number().required("El tipo de documento es obligatorio"),
        expiration_date: Yup.string().required("La fecha de vencimiento es obligatoria"),
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

  // Parsear initialData para adaptarlo al formato esperado por el formulario
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
    const formattedDate = doc.expiration_date ? dayjs.utc(doc.expiration_date).format('YYYY-MM-DD') : '';
    return {
      document_type_id: doc.document_type_id,
      expiration_date: formattedDate,
      id: doc.id, // Conservar el ID para updates
      category: doc.category, // Conservar categoría si existe
      idVehicle: doc.idVehicle // Conservar relación con vehículo
    };
  }) || [], // Formatear fechas de documentos existentes
  debts: initialData.debts?.map(debt => ({
    id: debt.id,
    amount: debt.amount,
    typeDebtId: typeof debt.typeDebtId === 'number' ? debt.typeDebtId : (typeof debt.type_debt_id === 'number' ? debt.type_debt_id : 1),
  })) || [],
};


  const [currentStep, setCurrentStep] = useState(0);
  const [showImageAlert, setShowImageAlert] = useState(false);
  const [typeDebtsOptions, setTypeDebtsOptions] = useState<{ value: number; label: string }[]>([]);
  // Cargar tipos de deudas para el DebtManager
  useEffect(() => {
    const fetchTypeDebts = async () => {
      try {
        const response = await getValues();
        const options = response.data.typeDebts.map((td: { id: number; name: string }) => ({ value: td.id, label: td.name }));
        setTypeDebtsOptions(options);
      } catch (error) {
        console.error('Error al cargar tipos de deudas:', error);
      }
    };
    fetchTypeDebts();
  }, []);

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

  // Restricción para el paso de documentos (debe ir después de formik)
  const hasDocuments = Array.isArray(formik.values.documents) && formik.values.documents.length > 0;

const handleUpdate = async (data: Record<string, unknown>) => {
  console.log("🔥 handleUpdate INICIADO con datos:", data);
  const toastId = showLoadingToast("Actualizando vehículo...");
  try {
    const allDocuments = data.documents as VehicleDocument[] || [];
    const allDebts = data.debts as Debt[] || [];

    // Transformar TODOS los documentos válidos (existentes y nuevos)
    const transformedDocuments = allDocuments
      .filter(doc => doc.document_type_id && doc.expiration_date)
      .map(doc => ({
        ...(doc.id && { id: doc.id }),
        document_type_id: doc.document_type_id,
        expiration_date: doc.expiration_date,
        idVehicle: vehicleId
      }));

    // Transformar deudas para el update (compatibilidad con backend)
    const transformedDebts = allDebts
      .filter(debt => typeof debt.typeDebtId === 'number' && debt.amount)
      .map(debt => ({
        ...(debt.id && { id: debt.id }),
        TypeDebtId: debt.typeDebtId,
        amount: debt.amount
      }));

    // Sanitizar campos (quitar espacios)
    const transformedData: UpdateVehiclePost = {
      type: data.type as string,
      brand: data.brand as string,
      line: data.line as string,
      plate: String(data.plate).replace(/\s+/g, "").toUpperCase(),
      version: (data.version as string)?.replace(/\s+/g, ""),
      transmission: (data.transmission as string)?.replace(/\s+/g, ""),
      traction: (data.traction as string)?.replace(/\s+/g, ""),
      fuelType: (data.fuelType as string)?.replace(/\s+/g, ""),
      kms: Number(String(data.kms).replace(/\s+/g, "")),
      model: dayjs(data.model as string).toISOString(),
      displacement: Number(String(data.displacement).replace(/\s+/g, "")),
      seatMaterial: data.seatMaterial as string,
      airbags: data.airbags as boolean,
      documents: transformedDocuments as UpdateVehicleDocument[],
      debts: transformedDebts as UpdateVehicleDebt[],
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
    // Si estamos en el paso de documentos (step 1), solo permitir avanzar si hay al menos un documento
    if (currentStep === 1 && !hasDocuments) {
      formik.setFieldTouched('documents', true);
      return;
    }
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
      canProceed={currentStep !== 1 ? true : hasDocuments}
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
          
          {/* Renderizar DebtManager en el paso de deudas */}
          {step.fields[0]?.name === 'debts' ? (
            <DebtManager
              debts={formik.values.debts || []}
              onChange={debts => formik.setFieldValue('debts', debts)}
              error={formik.touched.debts && formik.errors.debts ? String(formik.errors.debts) : undefined}
              typeDebtsOptions={typeDebtsOptions}
            />
          ) : (
            <DynamicForm 
              fields={step.fields} 
              formik={formik}
              isEditMode={true}
              imageUrl={imageUrl}
            />
          )}
        </Box>
      ))}
    </MultiStepModal>
  );
};
