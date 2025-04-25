import { FieldConfig } from "../../../interfaces/modal-form.interface";
import * as Yup from "yup";
import ModalForm from "../../organisms/modal-form/ModalForm";
import dayjs from "dayjs";
import { Client } from "../../../interfaces/clients.interface";

const fields: FieldConfig[] = [
  { name: "name", label: "Nombre", type: "text", required: true ,disabled: true},
  { name: "lastName", label: "Apellido", type: "text", required: true ,disabled: true},
  { name: "identification", label: "Identificación", type: "text" ,disabled: true},
  {
    name: "birthdate",
    label: "Fecha de Nacimiento",
    type: "date",
    required: true,
    disabled: true,
  },
  { name: "contact", label: "Celular", type: "tel", required: true,disabled: true },
  { name: "email", label: "Correo", type: "email" , disabled: true},
  {
    name: "comment",
    label: "Comentarios",
    type: "text",
    multiline: true,
    rows: 4,
    disabled: true,
  },
];



export const ModalViewClient = ({
  clientData,
  onClose,
}: {
  clientData: Client;
  onClose: () => void;
}) => {
  const initialValues = {
    name: clientData.name ?? "",
    lastName: clientData.lastName ?? "",
    email: clientData.email ?? "",
    identification: clientData?.identification ?? "" ,
    birthdate: clientData.birthdate ? dayjs(clientData.birthdate) : null,
    contact: clientData.contact ?? "" ,
    comment: clientData.comment ?? "",
  };

  const fieldsWithValues: FieldConfig[] = fields.map((field) => ({
    ...field,
    value:
      field.name === "birthdate" && clientData.birthdate
        ? dayjs(clientData.birthdate)
        : clientData?.[field.name as keyof Client] ?? "",
  } as FieldConfig));

  return (
    <ModalForm
      fields={fieldsWithValues}
      validationSchema={Yup.object({})}
      initialValues={initialValues}
      title="Detalle del Cliente"
      onSubmit={() => {}} 
      onClose={onClose}
      cancelDisabled
    />
  );
};
