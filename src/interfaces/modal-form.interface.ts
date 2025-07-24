import { DateView } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

export interface FieldConfig {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "number" | "boolean" | "file" | "documents" | "document" | "select" | "autocomplete" | "debts";
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  views?: DateView[];
  rows?: number;
  value?: string | Dayjs | null; // For disabled fields or default values
  multiple?: boolean;
  options?: { value: string | number; label: string }[]; // For select fields
}

export interface StepConfig {
  title: string;
  fields: FieldConfig[];
}