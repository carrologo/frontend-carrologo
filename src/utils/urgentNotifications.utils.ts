import { UpcomingBirthday, ExpiringDocument } from '../interfaces/notifications.interface';

/**
 * Filtra los cumpleaños que están a máximo 7 días de distancia
 */
export const getUrgentBirthdays = (birthdays: UpcomingBirthday[]): UpcomingBirthday[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return birthdays.filter(birthday => {
    const birthDate = new Date(birthday.birthDate);
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

    // Incluir cumpleaños que están a máximo 7 días
    return diasFaltantes <= 7;
  });
};

/**
 * Filtra los documentos que vencen a máximo 7 días de distancia (o ya vencidos)
 */
export const getUrgentDocuments = (documents: ExpiringDocument[]): ExpiringDocument[] => {
  const today = new Date();
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(today.getDate() + 7);

  return documents.filter(document => {
    const expirationDate = new Date(document.expirationDate);
    // Incluir documentos ya vencidos y los que vencen en los próximos 7 días
    return expirationDate <= oneWeekFromNow;
  });
};

/**
 * Verifica si hay notificaciones urgentes
 */
export const hasUrgentNotifications = (
  birthdays: UpcomingBirthday[],
  documents: ExpiringDocument[]
): boolean => {
  const urgentBirthdays = getUrgentBirthdays(birthdays);
  const urgentDocuments = getUrgentDocuments(documents);
  
  return urgentBirthdays.length > 0 || urgentDocuments.length > 0;
};
