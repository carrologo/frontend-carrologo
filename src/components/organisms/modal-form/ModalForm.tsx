import * as Yup from "yup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Field, Form, Formik } from "formik";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";
import { Box, Button, TextField, Typography, Grid, FormControlLabel, Checkbox } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { FieldConfig } from "../../../interfaces/modal-form.interface";
import ClearIcon from "@mui/icons-material/Clear";
import ImageUploadField from "../../molecules/image-upload-field/ImageUploadField";

dayjs.locale("es");

// Interface for ModalForm props
interface ModalFormProps {
  fields: FieldConfig[];
  validationSchema: Yup.ObjectSchema<any>;
  initialValues: any;
  title: string;
  cancelDisabled?: boolean;
  onSubmit: (values: any) => void;
  onClose: () => void;
}

const ModalForm = ({
  fields,
  validationSchema,
  initialValues,
  title,
  cancelDisabled,
  onSubmit,
  onClose,
}: ModalFormProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          const formattedValues: any = {};
          Object.keys(values).forEach((key) => {
            const field = fields.find((f) => f.name === key);
            if (field && !field.disabled) {
              formattedValues[key] =
                field.type === "date" && values[key]
                  ? dayjs(values[key]).format("YYYY-MM-DD")
                  : values[key];
            }
          });
          onSubmit(formattedValues);
          setSubmitting(false);
          onClose();
        }}
      >
        {({ errors, touched, setFieldValue, isSubmitting, resetForm }) => (
          <Form>
            <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: "background.paper" }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <ClearIcon sx={{ cursor: "pointer" }} onClick={onClose} />
              </Box>
              <Typography
                variant="h4"
                color="text.primary"
                textAlign="center"
                mb={3}
              >
                {title}
              </Typography>
              <Grid container spacing={2}>
                {fields.map((field) => (
                  <Grid
                    key={field.name}
                    size={{ xs: 12, md: field.multiline || field.type === "file" ? 12 : 6 }}
                  >
                    {field.type === "date" ? (
                      <Field name={field.name}>
                        {({ field: formikField }: { field: FieldConfig }) => (
                          <DatePicker
                            label={field.label}
                            value={formikField.value as Dayjs}
                            disabled={field.disabled}
                            views={field.views}
                            sx={{ width: "100%" }}
                            onChange={(value) => {
                              setFieldValue(field.name, value);
                            }}
                            slotProps={{
                              textField: {
                                variant: "outlined",
                                required: field.required,
                                fullWidth: true,
                                error:
                                  touched[field.name] &&
                                  Boolean(errors[field.name]),
                                helperText:
                                  touched[field.name] && errors[field.name]
                                    ? String(errors[field.name])
                                    : undefined,
                              },
                            }}
                          />
                        )}
                      </Field>
                    ) : field.type === "boolean" ? (
                      <Field name={field.name}>
                        {({ field: formikField }: { field: any }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formikField.value}
                                onChange={(e) =>
                                  setFieldValue(field.name, e.target.checked)
                                }
                                disabled={field.disabled}
                              />
                            }
                            label={field.label}
                            sx={{
                              "& .MuiFormControlLabel-label": {
                                color:
                                  touched[field.name] && errors[field.name]
                                    ? "error.main"
                                    : "text.primary",
                              },
                              display: "flex",
                              justifyContent: "center",
                            }}
                          />
                        )}
                      </Field>
                    ) :field.type === 'file' ? (
                      <Field name={field.name}>
                        {({ field: formikField }: { field: any }) => (
                          <ImageUploadField
                            field={field}
                            formikField={formikField}
                            setFieldValue={setFieldValue}
                            touched={touched}
                            errors={errors}
                          />
                        )}
                      </Field>
                    ) : (
                      <Field
                        as={TextField}
                        name={field.name}
                        label={field.label}
                        type={field.type ?? 'text'}
                        variant="outlined"
                        required={field.required}
                        disabled={field.disabled}
                        multiline={field.multiline}
                        rows={field.rows}
                        fullWidth
                        error={touched[field.name] && Boolean(errors[field.name])}
                        helperText={
                          touched[field.name] && errors[field.name]
                            ? String(errors[field.name])
                            : undefined
                        }
                      />
                    )}
                  </Grid>
                ))}
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    {!cancelDisabled && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          resetForm();
                          onClose();
                        }}
                        disabled={isSubmitting}
                      >
                        Cancelar
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Aceptar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </LocalizationProvider>
  );
};

export default ModalForm;
