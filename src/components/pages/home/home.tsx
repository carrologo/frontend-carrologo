import { useEffect, useState } from "react";
import BirthdateList from "../../molecules/Birthday-List/BirthdayList";
import ExpiringDocumentsList from "../../molecules/Expiring-Documents/ExpiringDocumentsList";
import StatsCards from "../../molecules/stats-cards/StastCards";
import Grid from "@mui/material/Grid";
import { getNotifications } from "../../../services/notifications.service";
import { UpcomingBirthday, ExpiringDocument } from "../../../interfaces/notifications.interface";

const Home = () => {
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<UpcomingBirthday[]>([]);
  const [expiringDocuments, setExpiringDocuments] = useState<ExpiringDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await getNotifications('month');
        setUpcomingBirthdays(response.data.upcomingBirthdays);
        setExpiringDocuments(response.data.expiringDocuments);
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
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
  );
};

export default Home;
