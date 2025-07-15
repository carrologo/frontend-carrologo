import { FieldConfig } from "../../../interfaces/modal-form.interface";
import * as Yup from "yup";
import { updateVehicle } from "../../../services/vehicles.service";
import { Image } from "../../../interfaces/commons.interface";
import { CreateVehiclePost } from "../../../services/vehicles.service";
import dayjs from 'dayjs';
import { useState } from "react";
import { useFormik } from "formik";
import MultiStepModal from "../../organisms/multi-step-modal/MultiStepModal";
import DynamicForm from "../../molecules/dynamicform/DynamicForm";

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
  { name: "images", label: "Subir Imagenes", type: "file", multiple: true,  },
];

const field2: FieldConfig[] = [
  { name: "soat", label: "SOAT", type: "date", views: ["year"], required: true },
  { name: "technicalReview", label: "Revisión Técnica", type: "date", views: ["year"], required: true },
  { name: "propertyCard", label: "Tarjeta de Propiedad", type: "date", required: true },
  { name: "secure", label: "Seguro", type: "date", required: true },
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
  images: Yup.array(),

  // Validaciones para los campos adicionales
  soat: Yup.date().required("El SOAT es obligatorio"),
  technicalReview: Yup.date().required("La revisión técnica es obligatoria"),
  propertyCard: Yup.date().required("La tarjeta de propiedad es obligatoria"),
  secure: Yup.date().required("El seguro es obligatorio"),
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

const parsedInitialData = {
  ...initialData,
  fuelType: initialData.fuel_type,
  seatMaterial: initialData.seat_material,
  model: dayjs(initialData.model),
};


  const [currentStep, setCurrentStep] = useState(0);
  const formik = useFormik({
    initialValues: parsedInitialData,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleUpdate(values);
    },
  });

const handleUpdate = async (data: Record<string, any>) => {
  try {
    const transformedData: CreateVehiclePost = {
      ...data,
      plate: data.plate.toUpperCase(),
      model: dayjs(data.model).toISOString(),
      soat: dayjs(data.soat).toISOString(),
      technicalReview: dayjs(data.technicalReview).toISOString(),
      propertyCard: dayjs(data.propertyCard).toISOString(),
      secure: dayjs(data.secure).toISOString(),
      fuel_type: data.fuelType,
      seat_material: data.seatMaterial,
      images: data.images.map((image: Image) => ({
        ...image,
        base64: image.base64.replace(/^data:image\/[a-z]+;base64,/, ""),
      })),
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
    >
      {/* Renderiza los campos del paso actual */}
      {steps.map((step, index) => (
    <DynamicForm 
      key={index} 
      fields={step.fields} 
      formik={formik}
      isEditMode={true}
      imageUrl={imageUrl}
    />
  ))}
    </MultiStepModal>
  );
};
