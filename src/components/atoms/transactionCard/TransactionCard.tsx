import "./TransactionCard.css";
import React from "react";
import { getTransactionStatusName, getTransactionStatusColor } from "../../../utils/transactionStatus.utils";
import VehicleInfoDisplay from "../vehicle-info-display/VehicleInfoDisplay";
import { ClientInfoDisplay } from "../client-info-display/ClientInfoDisplay";
import { Transaction } from "../../../interfaces/transactions.interface";
import { Button } from "@mui/material";
import PaidIcon from '@mui/icons-material/Paid';
import ModeEditIcon from "@mui/icons-material/ModeEdit";

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const statusName = getTransactionStatusName(transaction.id_status.toString());
  const statusColor = getTransactionStatusColor(transaction.id_status.toString());

  return (
    <div className="ticket">
      <div className="ticket__content">
        <div className="ticket__header">
          <h1 className="h1-transactions">
            <PaidIcon style={{ color: statusColor , fontSize: '2rem' }} />
          </h1>
          <h1 className="h1-transactions">
            <VehicleInfoDisplay vehicleId={transaction.id_vehicle.toString()} />
          </h1>
          <p className="p-transactions">
            <strong>Comprador:</strong> <ClientInfoDisplay clientId={transaction.id_buyer} />
          </p>
          <p className="p-transactions">
            <strong>Vendedor:</strong> <ClientInfoDisplay clientId={transaction.id_seller} />
          </p>
          <p className="p-transactions"> <strong>Monto:</strong> ${transaction.amount.toLocaleString()}</p>
          <p className="p-transactions">
            <strong>Estado:</strong> <span style={{ color: statusColor, fontWeight: 'bold' }}>{statusName}</span>
          </p>
          <p className="p-transactions-description"><strong>Descripción:</strong> {transaction.description}</p>
        </div>
        
        <div className="ticket__footer">
          <Button 
            size="small"
            variant="text"
            color="primary"
            className="card-transaction-button"
            >
            Ver detalles
            </Button>
            <Button
            size="small"
            startIcon={<ModeEditIcon />}
            className="card-vehicle-button"
          >
            Editar
          </Button>
          <Button 
            size="small"
            variant="outlined" 
            color="primary" 
            className="card-transaction-button"
            onClick={() => window.open(transaction.documents || '', '_blank')}
            disabled={!transaction.documents}
          >
            {transaction.documents ? "Ver documentos" : "Ver documentos"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
