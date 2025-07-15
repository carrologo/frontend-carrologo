import "./TransactionCard.css";
import React from "react";
import { getTransactionStatusName, getTransactionStatusColor } from "../../../utils/transactionStatus.utils";
import VehicleInfoDisplay from "../vehicle-info-display/VehicleInfoDisplay";
import { ClientInfoDisplay } from "../client-info-display/ClientInfoDisplay";
import { Transaction } from "../../../interfaces/transactions.interface";

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const statusName = getTransactionStatusName(transaction.id_status.toString());
  const statusColor = getTransactionStatusColor(transaction.id_status.toString());

  return (
    <div className="ticket">
      <div className="ticket_content">
        <div className="ticket_header">
          <h1 className="h1-transactions">
            Vehículo: <VehicleInfoDisplay vehicleId={transaction.id_vehicle.toString()} />
          </h1>
          <p className="p-transactions">
            Comprador: <ClientInfoDisplay clientId={transaction.id_buyer} />
          </p>
          <p className="p-transactions">
            Vendedor: <ClientInfoDisplay clientId={transaction.id_seller} />
          </p>
          <p className="p-transactions">Monto: ${transaction.amount.toLocaleString()}</p>
          <p className="p-transactions">
            Estado: <span style={{ color: statusColor, fontWeight: 'bold' }}>{statusName}</span>
          </p>
          <p className="p-transactions">
            Documentos: 
            {transaction.documents ? (
              <a 
                href={transaction.documents} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#1976d2', 
                  textDecoration: 'underline',
                  marginLeft: '4px'
                }}
              >
                Ver documentos
              </a>
            ) : (
              <span style={{ color: '#666', marginLeft: '4px' }}>No disponible</span>
            )}
          </p>
          <p className="p-transactions-description">Descripción: {transaction.description}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
