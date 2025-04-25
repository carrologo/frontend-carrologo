import { useEffect, useState } from "react";
import DataTable from "../../organisms/data-table/dataTable";
import { getClients } from "../../../services/clients.service";
import { ClientsTableData } from "../../../interfaces/clients.interface";

import "./Clients.css";

const Clients = () => {

  const [clients, setClients] = useState<ClientsTableData>({} as ClientsTableData);
  const fetchClients = async () => {
    try {
      const clientsData = await getClients();
      setClients(clientsData);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return( 
    <main className="clients-container">
      <div className="clients-header">
        <DataTable
          dataTable={clients}
          onClientCreated={fetchClients}
        />
      </div>
    </main>
  )
}

export default Clients;