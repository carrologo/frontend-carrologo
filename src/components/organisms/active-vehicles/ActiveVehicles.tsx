import { Grid, Box, CircularProgress } from "@mui/material";
import CardVehicle from "../../molecules/card-vehicle/CardVehicle";
import { Vehicle } from "../../../interfaces/vehicles.interface";
import SimplePagination from "../../atoms/simple-pagination/SimplePagination";
import './ActiveVehicles.css';

interface ActiveVehiclesProps {
  vehicles: Vehicle[];
  pagination?: { page: number; total: number };
  paginationModel: { page: number; pageSize: number };
  onPaginationChange: (page: number, pageSize: number) => void;
  onUpdateVehicles: (page?: number, limit?: number) => void;
  loading?: boolean;
}

const ActiveVehicles: React.FC<ActiveVehiclesProps> = ({ 
  vehicles, 
  pagination,
  paginationModel,
  onPaginationChange,
  onUpdateVehicles,
  loading = false
}) => {
  
  const handlePageChange = (page: number) => {
    onPaginationChange(page, paginationModel.pageSize);
  };

  const handleItemsPerPageChange = (pageSize: number) => {
    onPaginationChange(1, pageSize); // Reset to page 1 when changing page size
  };

  return (
    <Box className="active-vehicles-container">
      {/* Paginador superior */}
      {pagination && (
        <Box className="pagination-top">
          <SimplePagination
            currentPage={paginationModel.page + 1}
            totalItems={pagination.total}
            itemsPerPage={paginationModel.pageSize}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            position="top"
          />
        </Box>
      )}
      
      {/* Área de contenido de cards */}
      <Box className="cards-content-area">
        {loading ? (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="400px"
          >
            <CircularProgress size={60} />
          </Box>
        ) : vehicles.length > 0 ? (
          <Grid container spacing={3}>
            {vehicles.map((vehicle) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={vehicle.id}>
                <CardVehicle 
                  vehicle={vehicle} 
                  onVehicleUpdated={() => onUpdateVehicles(paginationModel.page + 1, paginationModel.pageSize)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box className="no-vehicles-message">
            No hay vehículos disponibles
          </Box>
        )}
      </Box>
      
      {/* Paginador inferior */}
      {pagination && (
        <Box className="pagination-bottom">
          <SimplePagination
            currentPage={paginationModel.page + 1}
            totalItems={pagination.total}
            itemsPerPage={paginationModel.pageSize}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            position="bottom"
          />
        </Box>
      )}
    </Box>
  );
};

export default ActiveVehicles;
