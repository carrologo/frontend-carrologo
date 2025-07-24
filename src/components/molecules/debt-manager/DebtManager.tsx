import React from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, IconButton, Card, CardContent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { showWarningToast } from "../../../utils/toast.utils";

interface Debt {
  id?: number;
  amount: number | '';
  typeDebtId: number;
}

interface DebtManagerProps {
  debts: Debt[];
  onChange: (debts: Debt[]) => void;
  error?: string;
  typeDebtsOptions: { value: number; label: string }[];
}

export const DebtManager: React.FC<DebtManagerProps> = ({ debts, onChange, error, typeDebtsOptions }) => {
  const handleDebtChange = (index: number, field: keyof Debt, value: any) => {
    const updated = debts.map((debt, i) =>
      i === index ? { ...debt, [field]: value } : debt
    );
    onChange(updated);
  };

  const handleAddDebt = () => {
    // Evitar duplicados de tipo de deuda
    const existingTypes = debts.map(debt => debt.typeDebtId);
    const firstAvailableType = typeDebtsOptions.find(td => !existingTypes.includes(td.value));
    if (!firstAvailableType) {
      showWarningToast('Ya agregaste todos los tipos de deuda disponibles.');
      return;
    }
    onChange([...debts, { amount: '', typeDebtId: firstAvailableType.value }]);
  };

  const handleRemoveDebt = (index: number) => {
    onChange(debts.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Deudas del Vehículo</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddDebt}
          size="small"
          disabled={typeDebtsOptions.length === 0}
        >
          Agregar Deuda
        </Button>
      </Box>

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {debts.map((debt, idx) => {
        const isExistingDebt = !!debt.id;
        // Deshabilitar opciones ya usadas
        const usedTypes = debts.map((debt, i) => i !== idx ? debt.typeDebtId : null).filter(Boolean);
        return (
          <Card key={idx} sx={{ mb: 2, position: 'relative',
            backgroundColor: isExistingDebt ? '#f8f9fa' : 'white',
            border: isExistingDebt ? '2px solid #e3f2fd' : '1px solid #e0e0e0'
          }}>
            <CardContent>
              {isExistingDebt && (
                <Typography variant="caption" color="primary" sx={{
                  position: 'absolute',
                  top: 8,
                  left: 16,
                  fontWeight: 'bold'
                }}>
                  Deuda Existente
                </Typography>
              )}
              <IconButton
                color="error"
                onClick={() => handleRemoveDebt(idx)}
                sx={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)' }}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pr: 6, mt: isExistingDebt ? 3 : 0 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de Deuda</InputLabel>
                  <Select
                    value={debt.typeDebtId}
                    label="Tipo de Deuda"
                    onChange={e => handleDebtChange(idx, "typeDebtId", Number(e.target.value))}
                  >
                    {typeDebtsOptions.map(opt => (
                      <MenuItem key={opt.value} value={opt.value} disabled={usedTypes.includes(opt.value)}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Valor (COP)"
                  type="text"
                  size="small"
                  value={
                    debt.amount === '' || debt.amount === undefined
                      ? ''
                      : Number(debt.amount).toLocaleString('es-CO')
                  }
                  onChange={e => {
                    // Eliminar puntos y caracteres no numéricos
                    const raw = e.target.value.replace(/\D/g, '');
                    handleDebtChange(idx, "amount", raw === '' ? '' : Number(raw));
                  }}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                  fullWidth
                />
              </Box>
            </CardContent>
          </Card>
        );
      })}

      {debts.length === 0 && (
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
          No hay deudas agregadas. Haz clic en "Agregar Deuda" para comenzar.
        </Typography>
      )}
    </Box>
  );
};
