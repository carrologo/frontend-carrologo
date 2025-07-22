import { useEffect, useState } from "react";
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
import { Description, CalendarToday } from "@mui/icons-material";
import { ExpiringDocument } from "../../../interfaces/notifications.interface";

interface ExpiringDocumentsListProps {
  expiringDocuments: ExpiringDocument[];
  loading: boolean;
}

const ExpiringDocumentsList = ({ expiringDocuments, loading }: ExpiringDocumentsListProps) => {
  const [documentosProximos, setDocumentosProximos] = useState<
    { documento: ExpiringDocument; diasFaltantes: number }[]
  >([]);

  useEffect(() => {
    if (expiringDocuments && expiringDocuments.length > 0) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const vencenEnMenosDe30Dias = expiringDocuments
        .map((documento) => {
          const vencimiento = new Date(documento.expiration_date);
          vencimiento.setHours(0, 0, 0, 0);

          const msPorDia = 1000 * 60 * 60 * 24;
          const diasFaltantes = Math.ceil(
            (vencimiento.getTime() - hoy.getTime()) / msPorDia
          );

          return { documento, diasFaltantes };
        })
        .filter(({ diasFaltantes }) => diasFaltantes <= 30)
        .sort((a, b) => a.diasFaltantes - b.diasFaltantes);

      setDocumentosProximos(vencenEnMenosDe30Dias);
    }
  }, [expiringDocuments]);

  return (
    <Card sx={{ 
      height: { xs: 'auto', sm: '70vh', md: '75vh' },
      display: 'flex',
      flexDirection: 'column',
      minHeight: { xs: '300px', sm: '400px' }
    }}>
      <CardHeader
        avatar={<Description sx={{ color: "#ff9800" }} />}
        title={
          <Typography variant="h6" fontWeight="bold">
            Próximos Vencimientos
          </Typography>
        }
      />
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : documentosProximos.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CalendarToday sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography color="text.secondary">
              No hay documentos próximos a vencer en los próximos 30 días.
            </Typography>
          </Box>
        ) : (
          <List sx={{ 
            maxHeight: { xs: '40vh', sm: '50vh', md: '60vh' }, 
            overflow: "auto",
            minHeight: { xs: '200px', sm: '250px', md: '300px' }
          }}>
            {documentosProximos.map(({ documento, diasFaltantes }) => (
              <ListItem
                key={documento.id}
                sx={{
                  background: "linear-gradient(135deg, rgba(255, 243, 224, 1) 0%, #fff3e0 100%)",
                  borderRadius: 2,
                  mb: 1,
                  border: "1px solid #ff9800",
                  alignItems: "flex-start",
                  py: 2,
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#ff9800", mt: 0.5 }}>
                    <Description />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={documento.buyer?.name || "Propietario no especificado"}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        📅 {new Date(documento.expiration_date).toLocaleDateString("es-ES")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        🚗 {documento.vehicle?.plate || "Placa no Relacionada"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📄 {documento.documentType.toUpperCase()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        🆔 {documento.buyer?.identification || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📞 {documento.buyer?.contact || "Contacto no disponible"}
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
                        : diasFaltantes < 0
                        ? "Vencido"
                        : `${diasFaltantes} días`
                    }
                    color={
                      diasFaltantes < 0
                        ? "error"
                        : diasFaltantes <= 7
                        ? "warning"
                        : "default"
                    }
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

export default ExpiringDocumentsList;
