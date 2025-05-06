import { FieldConfig } from "../../../interfaces/modal-form.interface";
import * as Yup from "yup";
import ModalForm from "../../organisms/modal-form/ModalForm";
import { createVehicle, CreateVehiclePost } from "../../../services/vehicles.service";
import { Image } from "../../../interfaces/commons.interface";

const fields: FieldConfig[] = [
  { name: "brand", label: "Marca", type: "text", required: true },
  { name: "line", label: "Linea", type: "text", required: true },
  { name: "type", label: "Tipo de Vehiculo", type: "text", required: true },
  { name: "version", label: "Versión", type: "text" },
  { name: "transmission", label: "Transmisión", type: "text" },
  { name: "traction", label: "Tipo de Traccion", type: "text" },
  { name: "fuelType", label: "Tipo de Combustible", type: "text", required: true },
  { name: "kms", label: "Kilometraje", type: "number", required: true },
  { name: "model", label: "Modelo", type: "date", views: ['year'], required: true },
  { name: "displacement", label: "Cilindrada", type: "number" },
  { name: "seatMaterial", label: "Material de Asientos", type: "text" },
  { name: "airbags", label: "Airbags", type: "boolean" },
  { name: "images", label: "Subir Imagenes", type: "file", multiple: true},
];

const validationSchema = Yup.object({
  brand: Yup.string().required("La marca es obligatoria"),
  line: Yup.string().required("La linea es obligatoria"),
  type: Yup.string().required("El tipo de vehiculo es obligatorio"),
  version: Yup.string(),
  transmission: Yup.string(),
  traction: Yup.string(),
  fuelType: Yup.string().required("El tipo de combustible es obligatorio"),
  kms: Yup.number().typeError("El kilometraje debe ser un número").required("El kilometraje es obligatorio"),
  model: Yup.date().required("El modelo es obligatorio"),
  displacement: Yup.number(),
  seatMaterial: Yup.string(),
  airbags: Yup.boolean(),
  images: Yup.array(),
});

const initialValues = {
  brand: "",
  line: "",
  type: "",
  version: "",
  transmission: "",
  traction: "",
  fuelType: "",
  kms: 0,
  model: null,
  displacement: 0,
  seatMaterial: "",
  airbags: false,
  images: [],
};

interface ModalCreateVehicleProps {
  onClose: () => void;
  onVehicleCreated: () => void; 
}


export const ModalCreateVehicle = ({ onClose, onVehicleCreated }: ModalCreateVehicleProps) => {

  const handleCreateVehicle = async (data: CreateVehiclePost) => {
    try {
      const transformedData = {
        ...data,
        images: data.images.map((image: Image) => ({
          ...image,
          base64: image.base64.replace(/^data:image\/[a-z]+;base64,/, ''),
        })),
      };
      await createVehicle(transformedData);
      onVehicleCreated();
    } catch (error) {
      console.error('Error al crear vehiculo:', error);
    }
  };
  
  return(
  <ModalForm
    fields={fields}
    validationSchema={validationSchema}
    initialValues={initialValues}
    title="Crear Vehiculo"
    onSubmit={handleCreateVehicle}
    onClose={onClose}
  />
)};
