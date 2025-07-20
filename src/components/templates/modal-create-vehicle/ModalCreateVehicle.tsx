import { useState, useMemo } from "react";
import { FieldConfig } from "../../../interfaces/modal-form.interface";
import * as Yup from "yup";
import MultiStepModal from "../../organisms/multi-step-modal/MultiStepModal";
import {
  createVehicle,
  CreateVehiclePost,
} from "../../../services/vehicles.service";
import { Image } from "../../../interfaces/commons.interface";
// Imagen por defecto en base64 (miniatura PNG 1x1 transparente, reemplaza por tu base64 real si lo deseas)
const DEFAULT_IMAGE_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAn8B9pQn2wAAAABJRU5ErkJggg==";
const DEFAULT_IMAGE_NAME = "image-not-found.png";
import { useFormik } from "formik";
import DynamicForm from "../../molecules/dynamicform/DynamicForm";
import { VehicleDocument } from "../../../interfaces/vehicles.interface";

const fields1: FieldConfig[] = [
  { name: "brand", label: "Marca", type: "text", required: true },
  { name: "line", label: "Linea", type: "text", required: true },
  { name: "type", label: "Tipo de Vehiculo", type: "text", required: true },
  { name: "plate", label: "Placa", type: "text", required: true },
  { name: "version", label: "Versión", type: "text" },
  { name: "transmission", label: "Transmisión", type: "text" },
  { name: "traction", label: "Tipo de Traccion", type: "text" },
  {
    name: "fuelType",
    label: "Tipo de Combustible",
    type: "text",
    required: true,
  },
  { name: "kms", label: "Kilometraje", type: "number", required: true },
  {
    name: "model",
    label: "Modelo",
    type: "date",
    views: ["year"],
    required: true,
  },
  { name: "displacement", label: "Cilindrada", type: "number" },
  { name: "seatMaterial", label: "Material de Asientos", type: "text" },
  { name: "airbags", label: "Airbags", type: "boolean" },
  { name: "images", label: "Subir Imagenes", type: "file", multiple: true },
];

// Este array debe ser llenado dinámicamente con las opciones de typeDebts desde values
const typeDebtsOptions = [
  { value: 1, label: "Multas" },
  { value: 2, label: "Impuestos" },
];

const fields2: FieldConfig[] = [
  { name: "documents", label: "Documentos del Vehículo", type: "documents", required: true },
];
const fields3: FieldConfig[] = [
  { name: "debts", label: "Deudas del Vehículo", type: "debts", required: false, options: typeDebtsOptions },
];

const steps = [
  { title: "Información Básica", fields: fields1 },
  { title: "Documentación", fields: fields2 },
  { title: "Deudas", fields: fields3 },
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
  kms: Yup.number()
    .typeError("El kilometraje debe ser un número")
    .required("El kilometraje es obligatorio"),
  model: Yup.date().required("El modelo es obligatorio"),
  displacement: Yup.number(),
  seatMaterial: Yup.string(),
  airbags: Yup.boolean(),
  images: Yup.array(),
  documents: Yup.array()
    .of(
      Yup.object({
        documentTypeId: Yup.number().required("El tipo de documento es obligatorio"),
        expirationDate: Yup.string().required("La fecha de vencimiento es obligatoria"),
      })
    )
    .min(1, "Debe agregar al menos un documento")
    .required("Los documentos son obligatorios"),
  debts: Yup.array()
    .of(
      Yup.object({
        amount: Yup.number().typeError("El valor debe ser un número").min(0, "El valor debe ser mayor o igual a 0").required("El valor es obligatorio"),
        typeDebtId: Yup.number().required("El tipo de deuda es obligatorio"),
      })
    ),
});

const initialValues = {
  brand: "",
  line: "",
  type: "",
  plate: "",
  version: "",
  transmission: "",
  traction: "",
  fuelType: "",
  kms: 0,
  model: new Date(),
  displacement: 0,
  seatMaterial: "",
  airbags: false,
  images: [],
  documents: [],
  debts: [],
};

interface ModalCreateVehicleProps {
  onClose: () => void;
  onVehicleCreated: () => void;
}

export const ModalCreateVehicle = ({
  onClose,
  onVehicleCreated,
}: ModalCreateVehicleProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (data: Record<string, unknown>) => {
      try {
        let images = (data.images as Image[])?.map((image: Image) => ({
          ...image,
          base64: image.base64?.replace(/^data:image\/[a-z]+;base64,/, ""),
        })) || [];
        if (!images || images.length === 0) {
          images = [{
            name: DEFAULT_IMAGE_NAME,
            base64: DEFAULT_IMAGE_BASE64,
          }];
        }
        const transformedData: CreateVehiclePost = {
          type: data.type as string,
          brand: data.brand as string,
          line: data.line as string,
          plate: String(data.plate).toUpperCase(),
          version: data.version as string,
          transmission: data.transmission as string,
          traction: data.traction as string,
          fuelType: data.fuelType as string,
          kms: data.kms as number,
          model: new Date(data.model as string).toISOString(),
          displacement: data.displacement as number,
          seatMaterial: data.seatMaterial as string,
          airbags: data.airbags as boolean,
          documents: data.documents as VehicleDocument[] || [],
          images,
          debts: (data.debts as any[])?.map((debt) => ({
            amount: Number(debt.amount),
            typeDebtId: Number(debt.typeDebtId),
          })) || [],
        };
        // Transformar debts a TypeDebtId para el backend
        const backendData = {
          ...transformedData,
          debts: (transformedData.debts || []).map(({ amount, typeDebtId }) => ({
            amount,
            TypeDebtId: typeDebtId,
          })),
        };
        await createVehicle(backendData as any);
        onVehicleCreated();
        onClose();
      } catch (err) {
        console.error("Error al crear vehículo:", err);
      }
    },
  });

  // Función para determinar si se puede proceder al siguiente paso
  const canProceedToNext = useMemo(() => {
    // Si estamos en el paso de documentos y está cargando, no permitir avanzar
    if (currentStep === 1 && documentsLoading) {
      return false;
    }

    const currentStepFields = steps[currentStep].fields;
    const requiredFields = currentStepFields.filter((field) => field.required);

    return requiredFields.every((field) => {
      const fieldValue = (formik.values as Record<string, unknown>)[field.name];        // Para campos numéricos, permitir el valor 0
        if (field.type === "number") {
          return (
            fieldValue !== null &&
            fieldValue !== undefined &&
            fieldValue !== "" &&
            !(formik.errors as Record<string, unknown>)[field.name]
          );
        }

        // Para campos de documentos, verificar que tenga al menos uno
        if (field.type === "documents") {
          return (
            Array.isArray(fieldValue) &&
            fieldValue.length > 0 &&
            !(formik.errors as Record<string, unknown>)[field.name]
          );
        }

      // Para otros tipos de campos
      return (
        fieldValue &&
        !(Array.isArray(fieldValue) && fieldValue.length === 0) &&
        !(typeof fieldValue === "string" && fieldValue.trim() === "") &&
        !(formik.errors as Record<string, unknown>)[field.name]
      );
    });
  }, [currentStep, formik.values, formik.errors, documentsLoading]);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      // Validar solo los campos del paso actual
      const currentStepFields = steps[currentStep].fields;

      // Forzar validación de los campos del paso actual
      const errors = await formik.validateForm();

      // Marcar como tocados los campos requeridos del paso actual
      const requiredFields = currentStepFields.filter(
        (field) => field.required
      );
      const touchedFields: Record<string, boolean> = {};

      requiredFields.forEach((field) => {
        touchedFields[field.name] = true;
      });

      formik.setTouched({ ...formik.touched, ...touchedFields });

      // Verificar si hay errores en campos requeridos del paso actual
      const hasRequiredFieldErrors = requiredFields.some((field) => {
        const fieldValue = (formik.values as Record<string, unknown>)[
          field.name
        ];

        // Para campos numéricos, permitir el valor 0
        if (field.type === "number") {
          return (
            fieldValue === null ||
            fieldValue === undefined ||
            fieldValue === "" ||
            (errors as Record<string, unknown>)[field.name]
          );
        }

        // Para campos de documentos, verificar que tenga al menos uno
        if (field.type === "documents") {
          return (
            !Array.isArray(fieldValue) ||
            fieldValue.length === 0 ||
            (errors as Record<string, unknown>)[field.name]
          );
        }

        // Para otros tipos de campos
        return (
          !fieldValue ||
          (Array.isArray(fieldValue) && fieldValue.length === 0) ||
          (typeof fieldValue === "string" && fieldValue.trim() === "") ||
          (errors as Record<string, unknown>)[field.name]
        );
      });

      if (!hasRequiredFieldErrors) {
        setCurrentStep((prev) => prev + 1);
      }
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
      title="Crear Nuevo Vehículo"
      steps={steps}
      currentStep={currentStep}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSubmit={formik.handleSubmit}
      isSubmitting={formik.isSubmitting}
      canProceed={canProceedToNext}
      initialValues={formik.initialValues}
    >
      {/* Renderiza los campos del paso actual */}
      {steps.map((step, index) => (
        <DynamicForm
          key={`step-${step.title}-${index}`}
          fields={step.fields}
          formik={formik}
          onDocumentsLoadingChange={setDocumentsLoading}
        />
      ))}
    </MultiStepModal>
  );
};
