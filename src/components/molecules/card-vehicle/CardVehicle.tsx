import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardActions,
  Dialog,
} from "@mui/material";
import Button from "@mui/material/Button";
import { Vehicle } from "../../../interfaces/vehicles.interface";
import { ModalEditVehicle } from "../../templates/modal-edit-vehicle/ModalEditVehicle";

import ModeEditIcon from "@mui/icons-material/ModeEdit";

interface CardVehicleProps {
  vehicle: Vehicle;
}

const CardVehicle: React.FC<CardVehicleProps> = ({ vehicle }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader
          title={`${vehicle.brand} ${vehicle.line}`}
          subheader={new Date(vehicle.model).getFullYear().toString()}
        />
        <CardMedia
          component="img"
          height="194"
          image={vehicle.url_images || '/images/image-not-found.png'}
          alt={vehicle.url_images || 'Vehicle'}
        />
        <CardContent>
          <p><strong>Cilindraje:</strong> {vehicle.displacement} cc</p>
          <p><strong>Transmisión:</strong> {vehicle.transmission}</p>
          <p><strong>Kilometraje:</strong> {vehicle.kms.toLocaleString()} Km</p>
          <p><strong>Tipo de Combustible :</strong> {vehicle.fuel_type}</p>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleOpenModal}>Ver detalles</Button>
        </CardActions>
      </Card>

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <ModalViewVehicle
          onClose={handleCloseModal}
          initialValues={vehicle} // Pasa los datos del vehículo al modal
        />
      </Dialog>
    </>
  );
};

export default CardVehicle;