import React from 'react';
import { Card, CardContent, CardHeader, CardMedia, CardActions } from '@mui/material';
import Button from '@mui/material/Button';
import { Vehicle } from '../../../interfaces/vehicles.interface';

interface CardVehicleProps {
  vehicle: Vehicle;
}

const CardVehicle: React.FC<CardVehicleProps> = ({ vehicle }) => {
  return (
    <Card>
      <CardHeader
        title={`${vehicle.brand} ${vehicle.line}`}
        subheader={new Date(vehicle.model).getFullYear().toString()}
      />
      <CardMedia
        component="img"
        height="194"
        image={vehicle.url_images[0]?.base64 || '/images/image-not-found.png'}
        alt={vehicle.url_images[0]?.name || 'Vehicle'}
      />
      <CardContent>
        <p><strong>Cilindraje:</strong> {vehicle.displacement} cc</p>
        <p><strong>Transmisión:</strong> {vehicle.transmission}</p>
        <p><strong>Kilometraje:</strong> {vehicle.kms.toLocaleString()} Km</p>
        <p><strong>Tipo de Combustible :</strong> {vehicle.fuel_type}</p>
      </CardContent>
      <CardActions>
        <Button size="small">Ver detalles</Button>
      </CardActions>
    </Card>
  );
};

export default CardVehicle;