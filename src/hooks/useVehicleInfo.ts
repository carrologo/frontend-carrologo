import { useState, useEffect } from 'react';
import { getVehicleById } from '../services/vehicles.service';

interface VehicleInfo {
  plate: string;
  brand: string;
  line: string;
}

export const useVehicleInfo = (vehicleId: string | null) => {
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!vehicleId) {
      setVehicleInfo(null);
      return;
    }

    const fetchVehicleInfo = async () => {
      setLoading(true);
      try {
        const info = await getVehicleById(vehicleId);
        setVehicleInfo(info);
      } catch (error) {
        console.error('Error fetching vehicle info:', error);
        setVehicleInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleInfo();
  }, [vehicleId]);

  return { vehicleInfo, loading };
};
