import "./TransactionCard.css";
import React from "react";
import {
  getTransactionStatusName,
  getTransactionStatusColor,
} from "../../../utils/transactionStatus.utils";
import { Transaction } from "../../../interfaces/transactions.interface";
import { Button } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

interface TransactionCardProps {
  transaction: Transaction;
  onViewTransaction?: (transactionId: string) => void;
  onEditTransaction?: (transactionId: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onViewTransaction,
  onEditTransaction,
}) => {
  const statusId =
    transaction.statusInfo?.id_status?.toString() ||
    transaction.id_status?.toString() ||
    "1";
  const statusName = getTransactionStatusName(statusId);
  const statusColor = getTransactionStatusColor(
    transaction.statusInfo?.id_status?.toString() || "1"
  );

  console.log("TransactionCard transaction:", transaction); // Debug

  return (
    <div className="ticket">
      <div className="ticket__content">
        <div className="ticket__header">
          <h1 className="h1-transactions">
            <PaidIcon style={{ color: statusColor, fontSize: "2rem" }} />
          </h1>
          <h1 className="h1-transactions">
            {transaction.vehicleInfo
              ? `${transaction.vehicleInfo.description} ${
                  transaction.vehicleInfo.plate
                    ? `(${transaction.vehicleInfo.plate})`
                    : ""
                }`
              : "Vehículo no asignado"}
          </h1>
          <p className="p-transactions">
            <strong>Comprador:</strong>{" "}
            {transaction.buyerInfo
              ? `${transaction.buyerInfo.name} (${transaction.buyerInfo.email})`
              : "No asignado"}
          </p>
          <p className="p-transactions">
            <strong>Vendedor:</strong>{" "}
            {transaction.sellerInfo
              ? `${transaction.sellerInfo.name} (${transaction.sellerInfo.email})`
              : "No asignado"}
          </p>
          <p className="p-transactions">
            {" "}
            <strong>Monto:</strong> $
            {transaction.amount ? transaction.amount.toLocaleString() : "0"}
          </p>
          <p className="p-transactions">
            <strong>Estado:</strong>{" "}
            <span style={{ color: statusColor, fontWeight: "bold" }}>
              {statusName}
            </span>
          </p>
          <p className="p-transactions-description">
            <strong>Descripción:</strong>{" "}
            {transaction.description || "Sin descripción"}
          </p>
        </div>

        <div className="ticket__footer">
          <Button
            size="small"
            variant="text"
            color="primary"
            className="card-transaction-button"
            onClick={() =>
              onViewTransaction?.(transaction.id_transaction.toString())
            }
          >
            Ver detalles
          </Button>
          <Button
            size="small"
            startIcon={<ModeEditIcon />}
            className="card-transaction-button"
            onClick={() =>
              onEditTransaction?.(transaction.id_transaction.toString())
            }
          >
            Editar
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            className="card-transaction-button"
            onClick={() => {
              const documentUrl =
                transaction.url_documents || transaction.documents;
              if (documentUrl) {
                window.open(documentUrl, "_blank");
              }
            }}
            disabled={!transaction.url_documents && !transaction.documents}
          >
            Ver documentos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
