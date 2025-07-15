import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  People,
  DirectionsCar,
  Receipt,
  Schedule,
} from "@mui/icons-material";

import { getClients } from "../../../services/clients.service";
import { getVehicles } from "../../../services/vehicles.service";
import "./StatsCards.css";

const StatsCards = () => {
  const [totalClients, setTotalClients] = useState<number>(0);
  const [totalVehicles, setTotalVehicles] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [clientsRes, vehiclesRes] = await Promise.all([
          getClients(1, 1000),
          getVehicles(1, 1000),
        ]);

        setTotalClients(clientsRes.data.length);
        setTotalVehicles(vehiclesRes.data.length);
      } catch (error) {
        console.error("Error al obtener datos de estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Cantidad de clientes",
      value: totalClients,
      icon: People,
      bgColor: "rgba(80, 174, 252, 0.8)",
      route: "/clientes",
      clickable: true,
    },
    {
      title: "Vehículos totales",
      value: totalVehicles,
      icon: DirectionsCar,
      bgColor: "rgba(80, 174, 252, 0.8)",
      route: "/vehiculos",
      clickable: true,
    },
    {
      title: "Transacciones totales",
      value: 0,
      icon: Receipt,
      bgColor: "#3acc3e98",
      route: "/transactions",
      clickable: false,
    },
    {
      title: "Transacciones pendientes",
      value: 0,
      icon: Schedule,
      bgColor: "#ffb950ff",
      route: "/transactions",
      clickable: false,
    },
  ];

  const handleCardClick = (stat: typeof stats[0]) => {
    if (stat.clickable && stat.route) {
      navigate(stat.route);
    }
  };

  return (
    <Box className="stats-container">
      {loading ? (
        <Box className="stats-loading">
          <CircularProgress />
        </Box>
      ) : (
        stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Box
              key={index}
              className="stats-card-wrapper"
            >
              <Card
                onClick={() => handleCardClick(stat)}
                className={`stats-card ${stat.clickable ? 'clickable' : ''}`}
                sx={{
                  backgroundColor: stat.bgColor,
                }}
              >
                <CardContent>
                  <Box className="stats-card-content">
                    <Box>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                      >
                        {stat.title}
                      </Typography>
                      <Typography
                        variant="h4"
                        component="h2"
                        fontWeight="bold"
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                    <Avatar
                      className="stats-card-avatar"
                      sx={{
                        backgroundColor: "white",
                        color: stat.bgColor,
                      }}
                    >
                      <Icon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default StatsCards;
