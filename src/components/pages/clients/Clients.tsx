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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name");

  // Mapeo de campos del frontend a los del backend
  const fieldMap: Record<string, string> = {
    name: "name",
    lastName: "last_name",
    email: "email",
    identification: "identification",
    contact: "contact",
    comment: "comment",
  };

  const fetchClients = async (
    page: number = 1,
    limit: number = 50,
    findBy?: string,
    value?: string
  ) => {
    try {
      const mappedFindBy = findBy ? fieldMap[findBy] : undefined;
      const clientsData = await getClients(page, limit, mappedFindBy, value);
      setClients(clientsData);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  useEffect(() => {
    // Solo pasar findBy y value si hay término de búsqueda
    fetchClients(
      paginationModel.page + 1,
      paginationModel.pageSize,
      searchTerm ? searchField : undefined,
      searchTerm ? searchTerm : undefined
    );
  }, [paginationModel, searchTerm, searchField]);

  const handleFetchClients = () => {
    fetchClients(
      paginationModel.page + 1,
      paginationModel.pageSize,
      searchTerm ? searchField : undefined,
      searchTerm ? searchTerm : undefined
    );
  };

  return (
    <main className="clients-container">
      <DataTable
        dataTable={clients}
        onClientsUpdated={handleFetchClients}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchField={searchField}
        setSearchField={setSearchField}
      />
    </main>
  );
}

export default Clients;