import { DateView } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

export interface FieldConfig {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "number" | "boolean" | "file";
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  views?: DateView[];
  rows?: number;
  value?: string | Dayjs | null; // For disabled fields or default values
  multiple?: boolean;
}