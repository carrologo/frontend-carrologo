import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Cake as CakeIcon,
  Description as DocumentIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { UpcomingBirthday, ExpiringDocument } from '../../../interfaces/notifications.interface';

interface UrgentNotificationsModalProps {
  open: boolean;
  onClose: () => void;
  urgentBirthdays: UpcomingBirthday[];
  urgentDocuments: ExpiringDocument[];
}

const UrgentNotificationsModal: React.FC<UrgentNotificationsModalProps> = ({
  open,
  onClose,
  urgentBirthdays,
  urgentDocuments,
}) => {
  const hasUrgentNotifications = urgentBirthdays.length > 0 || urgentDocuments.length > 0;

  if (!hasUrgentNotifications) return null;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatBirthdayDate = (birthDateString: string): string => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    
    // Crear la fecha del cumpleaños en el año actual
    const thisYearBirthday = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );

    // Si ya pasó este año, mostrar el del próximo año
    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1);
    }

    return thisYearBirthday.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const getDaysUntil = (dateString: string): number => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysUntilBirthday = (birthDateString: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const birthDate = new Date(birthDateString);
    // Crear la fecha del cumpleaños en el año actual usando solo mes y día
    const thisYearBirthday = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );

    // Si ya pasó este año, considerar el próximo año
    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1);
    }

    // Calcular días hasta el cumpleaños
    const msPorDia = 1000 * 60 * 60 * 24;
    const diasFaltantes = Math.ceil(
      (thisYearBirthday.getTime() - today.getTime()) / msPorDia
    );

    return diasFaltantes;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          <WarningIcon color="warning" />
          <Typography variant="h6" component="span">
            Notificaciones Importantes
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          Tienes eventos importantes en los próximos 7 días que requieren tu atención.
        </Alert>

        {urgentBirthdays.length > 0 && (
          <Box mb={3}>
            <Typography variant="h6" color="primary" mb={2} display="flex" alignItems="center" gap={1}>
              <CakeIcon />
              Cumpleaños Próximos ({urgentBirthdays.length})
            </Typography>
            <List dense>
              {urgentBirthdays.map((birthday, index) => {
                const daysUntil = getDaysUntilBirthday(birthday.birthDate);
                const isToday = daysUntil === 0;
                const isTomorrow = daysUntil === 1;
                
                let timeText = '';
                if (isToday) timeText = 'Hoy';
                else if (isTomorrow) timeText = 'Mañana';
                else timeText = `En ${daysUntil} días`;

                return (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemIcon>
                      <CakeIcon color={isToday ? 'error' : isTomorrow ? 'warning' : 'primary'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={birthday.name}
                      secondary={`${formatBirthdayDate(birthday.birthDate)} - ${timeText}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}

        {urgentDocuments.length > 0 && (
          <Box>
            {urgentBirthdays.length > 0 && <Divider sx={{ mb: 3 }} />}
            <Typography variant="h6" color="error" mb={2} display="flex" alignItems="center" gap={1}>
              <DocumentIcon />
              Documentos por Vencer ({urgentDocuments.length})
            </Typography>
            <List dense>
              {urgentDocuments.map((document, index) => {
                const daysUntil = getDaysUntil(document.expirationDate);
                const isToday = daysUntil === 0;
                const isTomorrow = daysUntil === 1;
                const isExpired = daysUntil < 0;
                
                let timeText = '';
                if (isExpired) timeText = `Vencido hace ${Math.abs(daysUntil)} días`;
                else if (isToday) timeText = 'Vence hoy';
                else if (isTomorrow) timeText = 'Vence mañana';
                else timeText = `Vence en ${daysUntil} días`;

                return (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemIcon>
                      <DocumentIcon color={isExpired || isToday ? 'error' : isTomorrow ? 'warning' : 'primary'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={document.buyer?.name || "Propietario no especificado"}
                      secondary={`${document.documentType} - ${document.vehicle?.plate || "Sin placa"} - ${formatDate(document.expirationDate)} - ${timeText}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          Entendido
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UrgentNotificationsModal;
