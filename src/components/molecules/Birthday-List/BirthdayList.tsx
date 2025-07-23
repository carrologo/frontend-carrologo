import { useEffect, useState } from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";
import { Cake, CalendarToday } from "@mui/icons-material";
import { UpcomingBirthday } from "../../../interfaces/notifications.interface";

interface BirthdateListProps {
  upcomingBirthdays: UpcomingBirthday[];
  loading: boolean;
}

const BirthdateList = ({ upcomingBirthdays, loading }: BirthdateListProps) => {
  const [clientesProximos, setClientesProximos] = useState<
    { cliente: UpcomingBirthday; diasFaltantes: number }[]
  >([]);

  useEffect(() => {
    if (upcomingBirthdays && upcomingBirthdays.length > 0) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const cumpleEnMenosDe30Dias = upcomingBirthdays
        .map((cliente) => {
          const nacimiento = new Date(cliente.birthDate);
          const cumple = new Date(
            hoy.getFullYear(),
            nacimiento.getMonth(),
            nacimiento.getDate()
          );

          if (cumple < hoy) {
            cumple.setFullYear(hoy.getFullYear() + 1);
          }

          const msPorDia = 1000 * 60 * 60 * 24;
          const diasFaltantes = Math.ceil(
            (cumple.getTime() - hoy.getTime()) / msPorDia
          );

          return { cliente, diasFaltantes };
        })
        .filter(({ diasFaltantes }) => diasFaltantes <= 30)
        .sort((a, b) => a.diasFaltantes - b.diasFaltantes);

      setClientesProximos(cumpleEnMenosDe30Dias);
    }
  }, [upcomingBirthdays]);

  return (
    <Card
      sx={{
        height: { xs: "auto", sm: "70vh", md: "75vh" },
        display: "flex",
        flexDirection: "column",
        minHeight: { xs: "300px", sm: "400px" },
      }}
    >
      <CardHeader
        avatar={<Cake sx={{ color: "#1e76e9ff" }} />}
        title={
          <Typography variant="h6" fontWeight="bold">
            Próximos Cumpleaños
          </Typography>
        }
      />
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : clientesProximos.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CalendarToday
              sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
            />
            <Typography color="text.secondary">
              No hay cumpleaños próximos en los próximos 30 días.
            </Typography>
          </Box>
        ) : (
          <List
            sx={{
              maxHeight: { xs: "40vh", sm: "50vh", md: "60vh" },
              overflow: "auto",
              minHeight: { xs: "200px", sm: "250px", md: "300px" },
            }}
          >
            {clientesProximos.map(({ cliente, diasFaltantes }) => (
              <ListItem
                key={cliente.id}
                sx={{
                  background:
                    "linear-gradient(135deg, rgba(241, 247, 255, 1) 0%, #e4f2ffff 100%)",
                  borderRadius: 2,
                  mb: 1,
                  border: "1px solid #0066ffff",
                  alignItems: "flex-start",
                  py: 2,
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#1e76e9ff", mt: 0.5 }}>
                    <Cake />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={cliente.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        📅{" "}
                        {new Date(cliente.birthDate).toLocaleDateString(
                          "es-ES"
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📞 {cliente.contact}
                      </Typography>
                      <Box sx={{ mt: 0.5, mb: 0.5 }}>
                        <a
                          href={`https://api.whatsapp.com/send?phone=${cliente.contact}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#25D366",
                            textDecoration: "none",
                            fontWeight: 500,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "0.98em",
                          }}
                        >
                          <WhatsAppIcon
                            sx={{ fontSize: 20, verticalAlign: "middle" }}
                          />
                          Escribir al WhatsApp
                        </a>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        🆔 {cliente.identification}
                      </Typography>
                    </Box>
                  }
                />
                <Box sx={{ alignSelf: "flex-start", mt: 0.5 }}>
                  <Chip
                    label={
                      diasFaltantes === 0
                        ? "¡Hoy!"
                        : diasFaltantes === 1
                        ? "Mañana"
                        : `${diasFaltantes} días`
                    }
                    color={diasFaltantes <= 7 ? "primary" : "default"}
                    variant="filled"
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default BirthdateList;
