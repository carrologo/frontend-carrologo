import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Button,
  LinearProgress,
  linearProgressClasses,
  Grid,
} from "@mui/material";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { styled } from "@mui/material/styles";
import { StepConfig } from "../../../interfaces/modal-form.interface";
import { FormikValues } from "formik";

interface MultiStepModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  steps: StepConfig[];
  children: React.ReactNode[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  canProceed?: boolean;
  initialValues: FormikValues;
  submitButtonText?: string;
  submittingText?: string;
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles?.("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
    ...theme.applyStyles?.("dark", {
      backgroundColor: "#308fe8",
    }),
  },
}));

const MultiStepModal: React.FC<MultiStepModalProps> = ({
  open,
  onClose,
  title,
  steps,
  children,
  currentStep,
  onNext,
  onPrevious,
  onSubmit,
  isSubmitting = false,
  canProceed = true,
  submitButtonText = "Crear Vehículo",
  submittingText = "Creando...",
}) => {
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: { xs: 3, md: 5 }, bgcolor: "background.paper" }}>
        {/* Icono Cerrar */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <IconButton onClick={onClose}>
            <X />
          </IconButton>
        </Box>

        {/* Título */}
        <Typography
          variant="h4"
          color="text.primary"
          textAlign="center"
          mb={3}
        >
          {title}
        </Typography>

        {/* Subtítulo del paso */}
        <Typography
          variant="h6"
          color="primary"
          textAlign="center"
          gutterBottom
        >
          Paso {currentStep + 1}: {steps[currentStep]?.title}
        </Typography>

        {/* Contenido del paso */}
        <Box mt={3} mb={4}>
          {children[currentStep]}
        </Box>
                {/* Progreso */}
        <Box mb={4}>
          <BorderLinearProgress variant="determinate" value={progress} />
        </Box>
        {/* Botones de navegación */}
        <Grid container spacing={2} justifyContent="center">
          
            <Button
              variant="outlined"
              onClick={onPrevious}
              disabled={isFirstStep || isSubmitting}
              startIcon={<ChevronLeft size={18} />}
            >
              Anterior
            </Button>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Paso {currentStep + 1} de {steps.length}
            </Typography>
            {isLastStep ? (
              <Button
                variant="contained"
                color="primary"
                onClick={onSubmit}
                disabled={!canProceed || isSubmitting}
              >
                {isSubmitting ? submittingText : submitButtonText}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={onNext}
                disabled={!canProceed || isSubmitting}
                endIcon={<ChevronRight size={18} />}
              >
                Siguiente
              </Button>
            )}
          </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default MultiStepModal;
