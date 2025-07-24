import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { TabPanel } from "../../atoms/tabPanel/TabPanel";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";
import ActiveVehicles from "../../organisms/active-vehicles/ActiveVehicles";
import { VehiclesTableData } from "../../../interfaces/vehicles.interface";
import VehicleTable from "../../organisms/vehicle-table/VehicleTable";
import { useEffect, useState } from "react";
import { getVehicles } from "../../../services/vehicles.service";
import {
  Button,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { ModalCreateVehicle } from "../../templates/modal-create-vehicle/ModalCreateVehicle";


const TabsVehicles = () => {
  const [value, setValue] = useState("1");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("brand");
  // Estado local para el valor del input de búsqueda (para el debounce)
  const [inputValue, setInputValue] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });
  const [vehiclesData, setVehiclesData] = useState<VehiclesTableData>({ data: [], pagination: { page: 1, total: 0 } });
  const [loading, setLoading] = useState(false);

  const searchOptions = [
    { value: "brand", label: "Marca" },
    { value: "line", label: "Línea" },
    { value: "version", label: "Versión" },
    { value: "type", label: "Tipo" },
    { value: "plate", label: "Placa" },
    { value: "model", label: "Año" },
    { value: "transmission", label: "Transmisión" },
    { value: "fuel_type", label: "Combustible" },
    { value: "kms", label: "Kilometraje" },
    { value: "displacement", label: "Cilindrada" },
    { value: "seat_material", label: "Material Asientos" },
  ];

  // Fetch vehicles desde el backend
  const fetchVehicles = async (
    page: number = 1,
    limit: number = 50,
    findBy?: string,
    value?: string
  ) => {
    setLoading(true);
    try {
      const vehicles = await getVehicles(page, limit, findBy, value);
      setVehiclesData(vehicles);
    } catch (error) {
      setVehiclesData({ data: [], pagination: { page: 1, total: 0 } });
    } finally {
      setLoading(false);
    }
  };

  // Sincronizar inputValue con searchTerm externo (por si se limpia desde el padre)
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  // Debounce: esperar 500ms después de dejar de escribir para actualizar el searchTerm real
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue !== searchTerm) {
        setSearchTerm(inputValue);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue, searchTerm]);

  // Actualizar vehículos cuando cambian paginación o búsqueda
  useEffect(() => {
    fetchVehicles(
      paginationModel.page + 1,
      paginationModel.pageSize,
      searchTerm ? searchField : undefined,
      searchTerm ? searchTerm : undefined
    );
  }, [paginationModel, searchTerm, searchField]);

  // Handler para paginación desde ambos componentes
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPaginationModel({ page: page - 1, pageSize });
  };

  // Handler para crear vehículo (refresca la lista)
  const handleCreateVehicle = () => {
    fetchVehicles(
      paginationModel.page + 1,
      paginationModel.pageSize,
      searchTerm ? searchField : undefined,
      searchTerm ? searchTerm : undefined
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          m: 2,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 1 },
        }}
      >
        <Button
          variant="contained"
          onClick={() => setOpenCreateModal(true)}
          sx={{
            minWidth: { xs: "100%", sm: "auto" },
            maxWidth: { xs: "300px" },
          }}
        >
          Agregar Vehículo
        </Button>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            m: 2,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "flex-start" },
            gap: { xs: 2, sm: 1 },
          }}
        >
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 150 },
              maxWidth: { xs: "300px" },
            }}
          >
            <InputLabel id="search-field-label">Buscar por</InputLabel>
            <Select
              labelId="search-field-label"
              value={searchField}
              label="Buscar por"
              onChange={(e) => setSearchField(e.target.value)}
            >
              {searchOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={`Buscar por ${searchOptions
              .find((opt) => opt.value === searchField)
              ?.label.toLowerCase()}`}
            variant="outlined"
            size="small"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{
              width: { xs: "100%", sm: "200px" },
              maxWidth: { xs: "200px" },
            }}
          />
        </Box>
        <Tabs
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          sx={{ mb: 2, height: 40, justifyContent: "center" }}
          centered
        >
          <Tab icon={<GridViewIcon />} value="1" />
          <Tab icon={<ListIcon />} value="2" />
        </Tabs>
      </Box>
      <TabPanel value={value} index="1">
        <ActiveVehicles
          vehicles={vehiclesData.data}
          pagination={vehiclesData.pagination}
          paginationModel={paginationModel}
          onPaginationChange={handlePaginationChange}
          onUpdateVehicles={handleCreateVehicle}
          loading={loading}
        />
      </TabPanel>
      <TabPanel value={value} index="2">
        <VehicleTable
          vehicles={vehiclesData.data}
          pagination={vehiclesData.pagination}
          paginationModel={paginationModel}
          onPaginationChange={handlePaginationChange}
          onUpdateVehicles={handleCreateVehicle}
          loading={loading}
        />
      </TabPanel>
      <Dialog open={openCreateModal} maxWidth="md" fullWidth>
        <ModalCreateVehicle
          onClose={() => setOpenCreateModal(false)}
          onVehicleCreated={handleCreateVehicle}
        />
      </Dialog>
    </Box>
  );
};

export default TabsVehicles;
