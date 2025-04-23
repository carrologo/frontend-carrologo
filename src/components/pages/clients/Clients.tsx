import { useEffect, useState } from "react";
import DataTable from "../../organisms/data-table/dataTable";
import { getClients } from "../../../services/clients.service";
import { ClientsTableData } from "../../../interfaces/clients.interface";


const Clients = () => {

  const [clients, setClients] = useState<ClientsTableData>({} as ClientsTableData);
  const fetchClients = async () => {
    const clientsData = await getClients();
    setClients(clientsData);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return( 
    <main className="clients">
      <div className="clients-header">
        <DataTable
          dataTable={clients}
        />
      </div>
    </main>
  )
}

export default Clients;