// Mapeo de estados de transacciones
export const transactionStatusMap = {
  "1": "Nuevo",
  "2": "En progreso", 
  "3": "Cancelado",
  "4": "En pausa",
  "5": "Completado"
};

export const getTransactionStatusName = (statusId: string): string => {
  return transactionStatusMap[statusId as keyof typeof transactionStatusMap] || statusId;
};

export const getTransactionStatusColor = (statusId: string): string => {
  switch (statusId) {
    case "1": return "#2196F3"; // Azul para nuevo
    case "2": return "#FF9800"; // Naranja para en progreso
    case "3": return "#F44336"; // Rojo para cancelado
    case "4": return "#9C27B0"; // Púrpura para en pausa
    case "5": return "#4CAF50"; // Verde para completado
    default: return "#757575"; // Gris para desconocido
  }
};
