import { useEffect, useState } from "react";
import DataTable from "../../organisms/data-table/dataTable";
import { getClients } from "../../../services/clients.service";
import { ClientsTableData } from "../../../interfaces/clients.interface";

import "./Clients.css";

const Clients = () => {

  const [clients, setClients] = useState<ClientsTableData>({} as ClientsTableData);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });
  
  const fetchClients = async (page: number = 1, limit: number = 50) => {
    try {
      const clientsData = await getClients(page, limit);
      setClients(clientsData);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  useEffect(() => {
    fetchClients(paginationModel.page + 1, paginationModel.pageSize);
  }, [paginationModel]);

  const handleFetchClients = () => {
    fetchClients(paginationModel.page + 1, paginationModel.pageSize);
  };

  return( 
    <main className="clients-container">
      <DataTable
        dataTable={clients}
        onClientsUpdated={handleFetchClients}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </main>
  )
}

export default Clients;