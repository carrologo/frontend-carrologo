import { FieldConfig } from "../../../interfaces/modal-form.interface";
import * as Yup from "yup";
import ModalForm from "../../organisms/modal-form/ModalForm";
import { CreateClientPost, updateClient } from "../../../services/clients.service";
import dayjs from "dayjs"; 
import { Client } from "../../../interfaces/clients.interface";

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

interface ModalEditClientProps {
  clientData: Client;
  onClose: () => void;
  onEditClient: () => void;
}

export const ModalEditClient = ({ clientData, onClose, onEditClient }: ModalEditClientProps) => {

  const initialValues = {
    name: clientData.name ?? "",
    lastName: clientData.lastName ?? "",
    email: clientData.email ?? "",
    identification: clientData.identification ?? "",
    birthdate: clientData.birthdate ? dayjs(clientData.birthdate) : null,
    contact: clientData.contact ?? "",
    comment: clientData.comment ?? "",
  };

    const handleEditClient = async (data: CreateClientPost) => {
      try {
        await updateClient(clientData.id, data);
        onEditClient();
      } catch (error) {
        console.error("Error al crear cliente:", error);
      }
    };

  return (
    <ModalForm
      fields={fields}
      validationSchema={validationSchema}
      initialValues={initialValues}
      title="Editar Cliente"
      onSubmit={handleEditClient}
      onClose={onClose}
    />
  );
};
