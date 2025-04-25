import { FieldConfig } from "../../../interfaces/modal-form.interface";
import * as Yup from "yup";
import ModalForm from "../../organisms/modal-form/ModalForm";
import { createClient, CreateClientPost } from "../../../services/clients.service";

const fields: FieldConfig[] = [
  { name: "name", label: "Nombre", type: "text", required: true },
  { name: "lastName", label: "Apellido", type: "text", required: true },
  { name: "identification", label: "Identificación", type: "text" },
  {
    name: "birthdate",
    label: "Fecha de Nacimiento",
    type: "date",
    required: true,
  },
  { name: "contact", label: "Celular", type: "tel", required: true },
  { name: "email", label: "Correo", type: "email", required: true },
  {
    name: "comment",
    label: "Comentarios",
    type: "text",
    multiline: true,
    rows: 4,
  },
];

const validationSchema = Yup.object({
  name: Yup.string().required("El nombre es obligatorio"),
  lastName: Yup.string().required("El apellido es obligatorio"),
  identification: Yup.string().required("La identificación es obligatoria"),
  birthdate: Yup.date()
    .required("La fecha de nacimiento es obligatoria")
    .nullable()
    .typeError("Ingrese una fecha válida"),
  contact: Yup.string()
    .matches(/^\+?\d{7,15}$/, "Ingrese un número de celular válido")
    .required("El celular es obligatorio"),
  email: Yup.string()
    .email("El correo electrónico no es válido")
    .required("El correo electrónico es obligatorio"),
  comment: Yup.string().required("Los comentarios son obligatorios"),
});

const initialValues = {
  name: "",
  lastName: "",
  email: "",
  identification: "",
  birthdate: null,
  contact: "",
  comment: "",
};

interface ModalCreateClientProps {
  onClose: () => void;
  onClientCreated: () => void; // Nueva prop para notificar creación
}


export const ModalCreateClient = ({ onClose, onClientCreated }: ModalCreateClientProps) => {

  const handleCreateClient = async (data: CreateClientPost) => {
    try {
      await createClient(data);
      onClientCreated();
    } catch (error) {
      console.error("Error al crear cliente:", error);
    }
  };
  
  return(
  <ModalForm
    fields={fields}
    validationSchema={validationSchema}
    initialValues={initialValues}
    title="Crear Cliente"
    onSubmit={handleCreateClient}
    onClose={onClose}
  />
)};
