import React from 'react';
import { useVehicleInfo } from '../../../hooks/useVehicleInfo';

interface VehicleInfoDisplayProps {
  vehicleId: string;
}

const VehicleInfoDisplay: React.FC<VehicleInfoDisplayProps> = ({ vehicleId }) => {
  const { vehicleInfo, loading } = useVehicleInfo(vehicleId);

  if (loading) {
    return <span style={{ color: '#666' }}>Cargando...</span>;
  }

  if (!vehicleInfo) {
    return <span style={{ color: '#666' }}>Vehículo no encontrado</span>;
  }

  return (
    <span>
      {vehicleInfo.brand} {vehicleInfo.line} - {vehicleInfo.plate}
    </span>
  );
};

export default VehicleInfoDisplay;
