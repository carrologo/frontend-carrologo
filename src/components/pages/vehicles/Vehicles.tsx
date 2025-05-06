import { useEffect, useState } from "react";
import { Vehicle } from "../../../interfaces/vehicles.interface";
import TabsVehicles from "../../molecules/tabs/TabsVehicles";
import { getVehicles } from "../../../services/vehicles.service";


const Vehicles = () => {

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const fetchVehicles = async () => {
    try {
      const vehiclesData = await getVehicles();
      setVehicles(vehiclesData.data);
    } catch (error) {
      console.error("Error al obtener vehiculos:", error);
    }
  }

  useEffect(() => {
    fetchVehicles();
  }, []);

  return( 
    <div>
      <TabsVehicles 
        dataVehicles={vehicles}
        onUpdateVehicles={fetchVehicles}
      />
    </div>
  )
}

export default Vehicles;
