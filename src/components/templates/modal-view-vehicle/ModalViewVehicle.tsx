import { FieldConfig } from "../../../interfaces/modal-form.interface";
import * as Yup from "yup";
import ModalForm from "../../organisms/modal-form/ModalForm";
import dayjs from "dayjs";

const fields: FieldConfig[] = [
  { name: "brand", label: "Marca", type: "text", required: true, disabled: true },
  { name: "line", label: "Linea", type: "text", required: true, disabled: true },
  { name: "type", label: "Tipo de Vehiculo", type: "text", required: true ,disabled: true},
  { name: "version", label: "Versión", type: "text", disabled: true },
  { name: "transmission", label: "Transmisión", type: "text", disabled: true },
  { name: "traction", label: "Tipo de Traccion", type: "text", disabled: true },
  { name: "fuel_type", label: "Tipo de Combustible", type: "text", required: true, disabled: true },
  { name: "kms", label: "Kilometraje", type: "number", required: true, disabled: true },
  { name: "model", label: "Modelo", type: "date", views: ['year'], required: true, disabled: true },
  { name: "displacement", label: "Cilindrada", type: "number", disabled: true },
  { name: "seat_material", label: "Material de Asientos", type: "text", disabled: true },
  { name: "airbags", label: "Airbags", type: "boolean", disabled: true },
];

interface ModalCreateVehicleProps {
  onClose: () => void;
  initialValues: any; // Asegúrate de que esta propiedad sea requerida
}

export const ModalViewVehicle = ({ onClose, initialValues }: ModalCreateVehicleProps) => {
  const formattedInitialValues = {
    ...initialValues,
    model: dayjs(initialValues.model), // Asegurarse de que sea un objeto dayjs
  };
  return (
    <ModalForm
      fields={fields}
      validationSchema={Yup.object({})}
      initialValues={formattedInitialValues} // Usar los valores iniciales pasados como prop
      title="Detalles del Vehiculo"
      onSubmit={() => {}}
      onClose={onClose}
    />
  );
};
