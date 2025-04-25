import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface ModalOptionsProps {
  open: boolean;
  title: string;
  description: string;
  onAccept: () => void;
  onCancel: () => void;
}

const ModalOptions = ({ open, title, description, onAccept, onCancel }: ModalOptionsProps) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="modal-options-title"
      aria-describedby="modal-options-description"
    >
      <DialogTitle id="modal-options-title" textAlign={"center"} >{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="modal-options-description">{description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={onCancel} color="error" variant="contained">
          Cancelar
        </Button>
        <Button onClick={onAccept} color="primary" variant="contained" autoFocus>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalOptions;
