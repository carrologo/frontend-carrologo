import { FieldConfig } from "../../../interfaces/modal-form.interface";
import * as Yup from "yup";
import { createTransaction, CreateTransactionPost } from "../../../services/transactions.service";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from "@mui/material";
import DynamicForm from "../../molecules/dynamicform/DynamicForm";
import { Formik, Form } from "formik";
import ClearIcon from "@mui/icons-material/Clear";
import { useState, useEffect } from "react";
import { getClients } from "../../../services/clients.service";
import { getVehicles } from "../../../services/vehicles.service";
import { transactionStatusMap } from "../../../utils/transactionStatus.utils";
import { Client } from "../../../interfaces/clients.interface";
import { Vehicle } from "../../../interfaces/vehicles.interface";

const validationSchema = Yup.object({
  id_vehicle: Yup.string().optional(),
  id_buyer: Yup.string().optional(),
  id_seller: Yup.string().optional(),
  id_status: Yup.string().required("El estado es obligatorio"),
  amount: Yup.number().optional(),
  description: Yup.string().optional(),
  url_documents: Yup.mixed().optional(),
});

const initialValues = {
  id_vehicle: "",
  id_buyer: "",
  id_seller: "",
  id_status: "1", // "Nuevo" por defecto
  amount: 0,
  description: "",
  url_documents: "",
};

interface ModalCreateTransactionProps {
  open: boolean;
  onClose: () => void;
  onTransactionCreated: () => void;
}

export const ModalCreateTransaction = ({ open, onClose, onTransactionCreated }: ModalCreateTransactionProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    if (open) {
      loadClientsAndVehicles();
    }
  }, [open]);

  const loadClientsAndVehicles = async () => {
    try {
      const [clientsData, vehiclesData] = await Promise.all([
        getClients(1, 1000), // Cargar muchos para tener todas las opciones
        getVehicles(1, 1000)
      ]);
      setClients(clientsData.data || []);
      setVehicles(vehiclesData.data || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const fields: FieldConfig[] = [
    {
      name: "id_vehicle",
      label: "Vehículo",
      type: "select",
      required: false,
      options: vehicles.map(vehicle => ({
        value: vehicle.id?.toString() || "",
        label: `${vehicle.brand} ${vehicle.line} ${vehicle.plate ? `(${vehicle.plate})` : ''}`.trim()
      }))
    },
    {
      name: "id_buyer",
      label: "Comprador",
      type: "select",
      required: false,
      options: clients.map(client => ({
        value: client.id?.toString() || "",
        label: `${client.name} ${client.lastName} (${client.email})`
      }))
    },
    {
      name: "id_seller",
      label: "Vendedor", 
      type: "select",
      required: false,
      options: clients.map(client => ({
        value: client.id?.toString() || "",
        label: `${client.name} ${client.lastName} (${client.email})`
      }))
    },
    {
      name: "id_status",
      label: "Estado",
      type: "select",
      required: true,
      value: "1", // Estado "Nuevo" por defecto
      options: Object.entries(transactionStatusMap).map(([id, name]) => ({
        value: id,
        label: name
      }))
    },
    {
      name: "amount",
      label: "Monto",
      type: "number",
      required: false,
    },
    {
      name: "description",
      label: "Descripción",
      type: "text",
      required: false,
      multiline: true,
      rows: 4,
    },
    {
      name: "url_documents",
      label: "Documentos",
      type: "document",
      required: false,
    },
  ];
  const handleCreateTransaction = async (data: any) => {
    try {
      // Convertir los datos al formato correcto
      const cleanData: CreateTransactionPost = {
        id_vehicle: data.id_vehicle ? parseInt(data.id_vehicle.toString()) : null,
        id_buyer: data.id_buyer ? parseInt(data.id_buyer.toString()) : null,
        id_seller: data.id_seller ? parseInt(data.id_seller.toString()) : null,
        id_status: parseInt(data.id_status.toString()),
        amount: data.amount ? Number(data.amount) : null,
        description: data.description?.trim() || null,
        documents: null, // Mantenemos para compatibilidad
        url_documents: data.url_documents || null,
      };

      await createTransaction(cleanData);
      onTransactionCreated();
      onClose();
    } catch (error) {
      console.error("Error al crear transacción:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleCreateTransaction}
        enableReinitialize
      >
        {({ errors, touched, setFieldValue, values, isSubmitting }) => (
          <Form>
            <DialogTitle>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4">Crear Transacción</Typography>
                <ClearIcon sx={{ cursor: "pointer" }} onClick={onClose} />
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <DynamicForm
                  fields={fields}
                  formik={{
                    values,
                    errors,
                    touched,
                    handleChange: (e) => setFieldValue(e.target.name, e.target.value),
                    handleBlur: () => {},
                    setFieldValue,
                    getFieldProps: (name: string) => ({ name, value: (values as any)[name] }),
                  }}
                />
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button 
                onClick={onClose} 
                disabled={isSubmitting}
                variant="outlined"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                variant="contained"
              >
                {isSubmitting ? "Creando..." : "Crear Transacción"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
