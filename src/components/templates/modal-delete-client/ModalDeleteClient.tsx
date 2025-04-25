import ModalOptions from "../../molecules/modal-options/ModalOptions";
import { Client } from "../../../interfaces/clients.interface";
import { updateClient } from "../../../services/clients.service";

interface ModalDeleteClientProps {
  open: boolean;
  selectedClient: Client;
  onClose: () => void;
  onClientUpdated: () => void; // Para actualizar la tabla
}

const ModalDeleteClient = ({ open, selectedClient, onClose, onClientUpdated }: ModalDeleteClientProps) => {
  const handleAccept = async () => {
    try {
      // Cambiar el estado del cliente (activar/inactivar)
      await updateClient(selectedClient.id, { isActive: !selectedClient.isActive});
      onClientUpdated();
      onClose(); 
    } catch (error) {
      console.error("Error al cambiar el estado del cliente:", error);
    }
  };

  return (
    <ModalOptions
      open={open}
      title="Cambiar Estado del Cliente"
      description="¿Deseas Activar/Inactivar este Cliente?"
      onAccept={handleAccept}
      onCancel={onClose}
    />
  );
};

export default ModalDeleteClient;