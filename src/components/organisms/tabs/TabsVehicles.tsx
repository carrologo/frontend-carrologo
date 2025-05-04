import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TabPanel } from "../../organisms/tabPanel/TabPanel";
import * as React from "react";
import ActiveVehicles from "../../organisms/active-vehicles/ActiveVehicles";

const TabsVehicles = () => {

      const [value, setValue] = React.useState('1');
    
      const handleChange=( newValue: string,) => {
        setValue(newValue);
      }
    return(
        <div>
              <Tabs value={value} onChange={(_,newValue) => handleChange(newValue)} centered>
              <Tab label="Vehiculos activos" value="1" />
                    <Tab label="Detalle de vehiculos" value="2" />
                  </Tabs>
                  <TabPanel value={value} index="1">
                    <ActiveVehicles/>
                  </TabPanel>
                  <TabPanel value={value} index="2">
                    <h1>Detalle de vehiculos</h1>
                  </TabPanel>
        </div>
    )
}

export default TabsVehicles;