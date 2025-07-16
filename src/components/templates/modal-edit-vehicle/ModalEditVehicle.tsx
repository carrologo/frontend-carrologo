import { FieldConfig } from "../../../interfaces/modal-form.interface";
import * as Yup from "yup";
import { updateVehicle } from "../../../services/vehicles.service";
import { CreateVehiclePost } from "../../../services/vehicles.service";
import dayjs from 'dayjs';
import { useState } from "react";
import { useFormik } from "formik";
import MultiStepModal from "../../organisms/multi-step-modal/MultiStepModal";
import DynamicForm from "../../molecules/dynamicform/DynamicForm";
import { Document } from "../../molecules/document-manager/DocumentManager";

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
  initialData: CreateVehiclePost;
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
  const [documentsLoading, setDocumentsLoading] = useState(false);

const parsedInitialData = {
  ...initialData,
  fuelType: initialData.fuel_type,
  seatMaterial: initialData.seat_material,
  model: dayjs(initialData.model),
  documents: initialData.documents || [], // Agregar documents vacío si no existe
};


  const [currentStep, setCurrentStep] = useState(0);
  const formik = useFormik({
    initialValues: parsedInitialData,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleUpdate(values);
    },
  });

const handleUpdate = async (data: Record<string, unknown>) => {
  try {
    const transformedData: Partial<CreateVehiclePost> = {
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
      documents: data.documents as Document[] || [],
      // No incluir images para que no se toquen las existentes
    };
    await updateVehicle(vehicleId, transformedData);
    onVehicleEdited();
  } catch (error) {
    console.error("Error al actualizar vehículo:", error);
  }
};



  console.log("Parsed Initial Data:", parsedInitialData);
  
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
      onSubmit={formik.handleSubmit}
      isSubmitting={formik.isSubmitting}
      canProceed={true}
      submitButtonText="Actualizar Vehículo"
      submittingText="Actualizando..."
    >
      {/* Renderiza los campos del paso actual */}
      {steps.map((step, index) => (
    <DynamicForm 
      key={index} 
      fields={step.fields} 
      formik={formik}
      isEditMode={true}
      imageUrl={imageUrl}
      onDocumentsLoadingChange={setDocumentsLoading}
    />
  ))}
    </MultiStepModal>
  );
};
