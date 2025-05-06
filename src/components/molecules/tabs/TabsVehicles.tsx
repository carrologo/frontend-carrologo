import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { TabPanel } from "../../atoms/tabPanel/TabPanel";
import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';
import * as React from "react";
import ActiveVehicles from "../../organisms/active-vehicles/ActiveVehicles";
import { Vehicle } from "../../../interfaces/vehicles.interface";
import VehicleTable from "../../organisms/vehicle-table/VehicleTable";

interface TabsVehiclesProps {
  dataVehicles: Vehicle[];
}
const TabsVehicles = ({ dataVehicles }: TabsVehiclesProps) => {
  const [value, setValue] = React.useState("1");

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={(_, newValue) => handleChange(newValue)}
        sx={{ borderBottom: 1, borderColor: "divider", mb: 2}}
        centered
      >
        <Tab icon={<GridViewIcon />} value="1" />
        <Tab icon={<ListIcon />} value="2" />
      </Tabs>
      <TabPanel value={value} index="1">
        <ActiveVehicles vehicles={dataVehicles} />
      </TabPanel>
      <TabPanel value={value} index="2">
        <VehicleTable vehicles={dataVehicles} />
      </TabPanel>
    </Box>
  );
};

export default TabsVehicles;
