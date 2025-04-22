import { Dayjs } from "dayjs";

export interface FieldConfig {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "date";
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  value?: string | Dayjs | null; // For disabled fields or default values
}