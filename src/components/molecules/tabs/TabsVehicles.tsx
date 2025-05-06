import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { TabPanel } from "../../atoms/tabPanel/TabPanel";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";
import ActiveVehicles from "../../organisms/active-vehicles/ActiveVehicles";
import { Vehicle } from "../../../interfaces/vehicles.interface";
import VehicleTable from "../../organisms/vehicle-table/VehicleTable";
import { useMemo, useState } from "react";
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

interface TabsVehiclesProps {
  dataVehicles: Vehicle[];
  onUpdateVehicles: () => void;
}
const TabsVehicles = ({ dataVehicles, onUpdateVehicles }: TabsVehiclesProps) => {
  const [value, setValue] = useState("1");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("brand");

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const searchOptions = [
    { value: "brand", label: "Marca" },
    { value: "line", label: "Línea" },
    { value: "version", label: "Versión" },
    { value: "type", label: "Tipo" },
    { value: "model", label: "Año" },
    { value: "transmission", label: "Transmisión" },
    { value: "fuel_type", label: "Combustible" },
    { value: "kms", label: "Kilometraje" },
    { value: "displacement", label: "Cilindrada" },
    { value: "seat_material", label: "Material Asientos" },
    { value: "airbags", label: "Airbags" },
  ];

  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return dataVehicles;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return dataVehicles.filter((vehicle) => {
      if (searchField === "model") {
        const year = new Date(vehicle.model).getFullYear().toString();
        return year.includes(lowerSearchTerm);
      }
      if (searchField === "kms") {
        const kms = vehicle.kms.toString();
        return kms.includes(lowerSearchTerm);
      }
      if (searchField === "displacement") {
        const displacement = vehicle.displacement.toString();
        return displacement.includes(lowerSearchTerm);
      }
      if (searchField === "airbags") {
        const airbags = vehicle.airbags ? "sí" : "no";
        return airbags.toLowerCase().includes(lowerSearchTerm);
      }
      return vehicle[searchField as keyof Vehicle]
        ?.toString()
        .toLowerCase()
        .includes(lowerSearchTerm);
    });
  }, [dataVehicles, searchTerm, searchField]);

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: { xs: "100%", sm: "200px" },
              maxWidth: { xs: "200px" },
            }}
          />
        </Box>
        <Tabs
          value={value}
          onChange={(_, newValue) => handleChange(newValue)}
          sx={{ mb: 2, height: 40, justifyContent: "center" }}
          centered
        >
          <Tab icon={<GridViewIcon />} value="1" />
          <Tab icon={<ListIcon />} value="2" />
        </Tabs>
      </Box>
      <TabPanel value={value} index="1">
        <ActiveVehicles vehicles={filteredVehicles} />
      </TabPanel>
      <TabPanel value={value} index="2">
        <VehicleTable vehicles={filteredVehicles} />
      </TabPanel>
      <Dialog open={openCreateModal} maxWidth="md" fullWidth>
        <ModalCreateVehicle
          onClose={() => setOpenCreateModal(false)}
          onVehicleCreated={onUpdateVehicles}
        />
      </Dialog>
    </Box>
  );
};

export default TabsVehicles;
