import React from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormControl,
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import { FieldConfig } from "../../../interfaces/modal-form.interface";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import ImageUploadField from "../image-upload-field/ImageUploadField";
import DocumentUploadField from "../document-upload-field/DocumentUploadField";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { DocumentManager } from "../document-manager/DocumentManager";
import { DebtManager } from "../debt-manager/DebtManager";

interface DynamicFormProps {
  fields: FieldConfig[];
  formik: {
    values: Record<string, any>;
    errors: Record<string, any>;
    touched: Record<string, any>;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any) => void;
    getFieldProps: (field: string) => any;
  };
  isEditMode?: boolean;
  imageUrl?: string;
  onDocumentsLoadingChange?: (loading: boolean) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ 
  fields, 
  formik, 
  isEditMode = false, 
  imageUrl,
  onDocumentsLoadingChange 
}) => {
  const handleOpenImage = () => {
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap={2}
      >
        {fields.map((field) => {
          const {
            name,
            label,
            type,
            required,
            disabled,
          } = field;

          const error = formik.touched[name] && Boolean(formik.errors[name]);
          const helperText = formik.touched[name] ? formik.errors[name] : "";

          const fullWidthColumn = field.multiline || type === "file" || type === "documents" || type === "document" || type === "debts";

          return (
            <Box key={name} gridColumn={fullWidthColumn ? "span 2" : "span 1"}>
              {type === "text" || type === "number" ? (
                <TextField
                  fullWidth
                  type={type}
                  name={name}
                  label={label}
                  required={required}
                  disabled={disabled}
                  value={formik.values[name] ?? ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!error}
                  helperText={helperText as string}
                />
              ) : type === "boolean" ? (
                <FormControl fullWidth error={!!error}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name={name}
                        checked={formik.values[name] ?? false}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={disabled}
                      />
                    }
                    label={label}
                  />
                  {error && <FormHelperText>{helperText as string}</FormHelperText>}
                </FormControl>
              ) : type === "select" ? (
                <FormControl fullWidth error={!!error}>
                  <InputLabel>{label}</InputLabel>
                  <Select
                    name={name}
                    value={formik.values[name] ?? ""}
                    onChange={(e) => formik.setFieldValue(name, e.target.value)}
                    onBlur={formik.handleBlur}
                    disabled={disabled}
                    label={label}
                  >
                    {field.options?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {error && <FormHelperText>{helperText as string}</FormHelperText>}
                </FormControl>
              ) : type === "autocomplete" ? (
                <FormControl fullWidth error={!!error}>
                  <Autocomplete
                    options={field.options || []}
                    getOptionLabel={(option) => option.label}
                    value={field.options?.find(option => option.value === formik.values[name]) || null}
                    onChange={(_, newValue) => {
                      formik.setFieldValue(name, newValue?.value || "");
                    }}
                    onBlur={formik.handleBlur}
                    disabled={disabled}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={label}
                        required={required}
                        error={!!error}
                        helperText={helperText as string}
                      />
                    )}
                    filterOptions={(options, { inputValue }) => {
                      return options.filter(option =>
                        option.label.toLowerCase().includes(inputValue.toLowerCase())
                      );
                    }}
                  />
                </FormControl>
              ) : type === "date" ? (
                  <DatePicker
                    label={label}
                    value={formik.values[name] ? dayjs(formik.values[name]) : null}
                    onChange={(value) => {
                      formik.setFieldValue(name, value);
                    }}
                    disabled={disabled}
                    views={name === "model" ? ["year"] : ["year", "month", "day"]}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required,
                        onBlur: formik.handleBlur,
                        error: !!error,
                        helperText: helperText as string,
                      },
                    }}
                  />
              ) : type === "documents" ? (
                <DocumentManager
                  documents={formik.values[name] || []}
                  onChange={(documents) => formik.setFieldValue(name, documents)}
                  error={error ? helperText as string : undefined}
                  onLoadingChange={onDocumentsLoadingChange}
                />
              ) : type === "debts" ? (
                <DebtManager
                  debts={formik.values[name] || []}
                  onChange={(debts) => formik.setFieldValue(name, debts)}
                  error={error ? helperText as string : undefined}
                  typeDebtsOptions={(field.options as { value: number; label: string }[]) || []}
                />
              ) : type === "document" ? (
                <DocumentUploadField
                  field={field}
                  formikField={formik.getFieldProps(name)}
                  setFieldValue={formik.setFieldValue}
                  touched={formik.touched}
                  errors={formik.errors}
                />
              ) : type === "file" ? (
                isEditMode && name === "images" ? (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Button
                      variant="outlined"
                      startIcon={<OpenInNewIcon />}
                      onClick={handleOpenImage}
                      disabled={!imageUrl}
                      fullWidth
                    >
                      Ver Imagenes del Vehículo
                    </Button>
                  </Box>
                ) : (
                  <ImageUploadField
                    field={field}
                    formikField={formik.getFieldProps(name)}
                    setFieldValue={formik.setFieldValue}
                    touched={formik.touched}
                    errors={formik.errors}
                  />
                )
              ) : null}
            </Box>
          );
        })}
      </Box>
    </LocalizationProvider>
  );
};

export default DynamicForm;
