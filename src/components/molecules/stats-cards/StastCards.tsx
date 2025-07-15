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
import { getTransactions } from "../../../services/transactions.service";
import { Transaction } from "../../../interfaces/transactions.interface";
import "./StatsCards.css";

const StatsCards = () => {
  const [totalClients, setTotalClients] = useState<number>(0);
  const [totalVehicles, setTotalVehicles] = useState<number>(0);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [pendingTransactions, setPendingTransactions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Hacer llamadas con límite pequeño ya que solo necesitamos los totales
        const [clientsRes, vehiclesRes, transactionsRes] = await Promise.all([
          getClients(1, 1), // Solo necesitamos el total, no los datos
          getVehicles(1, 1),
          getTransactions(1, 50), // Un poco más para calcular pendientes
        ]);

        // Usar totales de paginación para estadísticas
        const totalClientsCount = clientsRes?.pagination?.total || 0;
        const totalVehiclesCount = vehiclesRes?.pagination?.total || 0;
        const totalTransactionsCount = transactionsRes?.pagination?.total || 0;

        // Para transacciones pendientes, usamos una muestra pequeña
        // En un caso real, sería mejor tener un endpoint específico para esto
        const transactionsData = transactionsRes?.data || [];
        const pendingCount = transactionsData.filter(
          (transaction: Transaction) => transaction.id_status === 1
        ).length;

        setTotalClients(totalClientsCount);
        setTotalVehicles(totalVehiclesCount);
        setTotalTransactions(totalTransactionsCount);
        setPendingTransactions(pendingCount);
      } catch (error) {
        console.error("Error al obtener datos de estadísticas:", error);
        // Establecer valores por defecto en caso de error
        setTotalClients(0);
        setTotalVehicles(0);
        setTotalTransactions(0);
        setPendingTransactions(0);
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
      value: totalTransactions,
      icon: Receipt,
      bgColor: "#3acc3e98",
      route: "/transactions",
      clickable: true,
    },
    {
      title: "Transacciones pendientes",
      value: pendingTransactions,
      icon: Schedule,
      bgColor: "#ffb950ff",
      route: "/transactions",
      clickable: true,
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
