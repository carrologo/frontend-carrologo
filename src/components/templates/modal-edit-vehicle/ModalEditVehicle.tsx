import { FieldConfig } from "../../../interfaces/modal-form.interface";
import * as Yup from "yup";
import ModalForm from "../../organisms/modal-form/ModalForm";
import { updateVehicle } from "../../../services/vehicles.service";
import { Image } from "../../../interfaces/commons.interface";
import { CreateVehiclePost } from "../../../services/vehicles.service";
import dayjs from 'dayjs';

const fields: FieldConfig[] = [
  { name: "brand", label: "Marca", type: "text", required: true },
  { name: "line", label: "Linea", type: "text", required: true },
  { name: "type", label: "Tipo de Vehiculo", type: "text", required: true },
  { name: "version", label: "Versión", type: "text" },
  { name: "transmission", label: "Transmisión", type: "text" },
  { name: "traction", label: "Tipo de Traccion", type: "text" },
  { name: "fuelType", label: "Tipo de Combustible", type: "text", required: true },
  { name: "kms", label: "Kilometraje", type: "number", required: true },
  { name: "model", label: "Modelo", type: "date", views: ["year"], required: true },
  { name: "displacement", label: "Cilindrada", type: "number" },
  { name: "seatMaterial", label: "Material de Asientos", type: "text" },
  { name: "airbags", label: "Airbags", type: "boolean" },
  { name: "images", label: "Subir Imagenes", type: "file", multiple: true },
];

const validationSchema = Yup.object({
  brand: Yup.string().required("La marca es obligatoria"),
  line: Yup.string().required("La linea es obligatoria"),
  type: Yup.string().required("El tipo de vehiculo es obligatorio"),
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
});

interface ModalEditVehicleProps { 
  onClose: () => void;
  vehicleId: number;
  initialData: CreateVehiclePost;
  onVehicleEdited: () => void;
}

export const ModalEditVehicle = ({
  onClose,
  vehicleId,
  initialData,
  onVehicleEdited,
}: ModalEditVehicleProps) => {
  const handleUpdate = async (data: CreateVehiclePost) => {
    try {
      const transformedData = {
        ...data,
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

  const parsedInitialData = {
    ...initialData,
    fuelType: initialData.fuel_type,
    seatMaterial: initialData.seat_material,
    model: dayjs(initialData.model),
  };

  return (
    <ModalForm
      fields={fields}
      validationSchema={validationSchema}
      initialValues={parsedInitialData}
      title="Editar Vehiculo"
      onSubmit={handleUpdate}
      onClose={onClose}
    />
  );
};
