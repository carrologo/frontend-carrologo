import { useEffect, useState } from "react";
import BirthdateList from "../../molecules/Birthday-List/BirthdayList";
import ExpiringDocumentsList from "../../molecules/Expiring-Documents/ExpiringDocumentsList";
import StatsCards from "../../molecules/stats-cards/StastCards";
import UrgentNotificationsModal from "../../molecules/urgent-notifications-modal/UrgentNotificationsModal";
import Grid from "@mui/material/Grid";
import { getNotifications } from "../../../services/notifications.service";
import { UpcomingBirthday, ExpiringDocument } from "../../../interfaces/notifications.interface";
import { getUrgentBirthdays, getUrgentDocuments, hasUrgentNotifications } from "../../../utils/urgentNotifications.utils";

const Home = () => {
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<UpcomingBirthday[]>([]);
  const [expiringDocuments, setExpiringDocuments] = useState<ExpiringDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  const [urgentBirthdays, setUrgentBirthdays] = useState<UpcomingBirthday[]>([]);
  const [urgentDocuments, setUrgentDocuments] = useState<ExpiringDocument[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await getNotifications('month');
        setUpcomingBirthdays(response.data.upcomingBirthdays);
        setExpiringDocuments(response.data.expiringDocuments);

        // Filtrar notificaciones urgentes (máximo 7 días)
        const urgentBirthdaysFiltered = getUrgentBirthdays(response.data.upcomingBirthdays);
        const urgentDocumentsFiltered = getUrgentDocuments(response.data.expiringDocuments);
        
        setUrgentBirthdays(urgentBirthdaysFiltered);
        setUrgentDocuments(urgentDocumentsFiltered);

        // Mostrar modal solo si hay notificaciones urgentes
        if (hasUrgentNotifications(response.data.upcomingBirthdays, response.data.expiringDocuments)) {
          setShowUrgentModal(true);
        }
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleCloseUrgentModal = () => {
    setShowUrgentModal(false);
  };

  return (
    <>
      <div style={{ padding: "40px" }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <StatsCards />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <h2 style={{ color: "#000000ff" }}>Espacio para gráficos</h2>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <BirthdateList upcomingBirthdays={upcomingBirthdays} loading={loading} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ExpiringDocumentsList expiringDocuments={expiringDocuments} loading={loading} />
          </Grid>
        </Grid>
      </div>

      {/* Modal de notificaciones urgentes */}
      <UrgentNotificationsModal
        open={showUrgentModal}
        onClose={handleCloseUrgentModal}
        urgentBirthdays={urgentBirthdays}
        urgentDocuments={urgentDocuments}
      />
    </>
  );
};

export default Home;
