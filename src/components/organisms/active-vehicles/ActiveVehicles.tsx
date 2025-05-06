import { Grid } from "@mui/material";
import CardVehicle from "../../molecules/card-vehicle/CardVehicle";
import { Vehicle } from "../../../interfaces/vehicles.interface";

interface ActiveVehiclesProps {
  vehicles: Vehicle[];
}

const ActiveVehicles: React.FC<ActiveVehiclesProps> = ({ vehicles }) => {
  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 20 }}
    >
      {vehicles.map((vehicle, index) => (
        <Grid size={4} key={index}>
          <CardVehicle vehicle={vehicle} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ActiveVehicles;
