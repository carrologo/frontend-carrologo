import * as Yup from "yup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Field, Form, Formik } from "formik";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";
import { Box, TextField, Typography, Grid } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { FieldConfig } from "../../../interfaces/modal-form.interface";
import ClearIcon from "@mui/icons-material/Clear";

dayjs.locale("es");

interface ViewClientProps {
  fields: FieldConfig[];
  initialValues: any;
  title: string;
  onClose: () => void;
}

const ViewClient = ({ fields, initialValues, title, onClose }: ViewClientProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object()} // No validation needed
        onSubmit={() => {}} // Not used
      >
        {() => (
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
                  size={{ xs: 12, md: field.multiline ? 12 : 6 }}
                  >
                    {field.type === "date" ? (
                      <Field name={field.name}>
                        {({
                          field: fieldProps,
                        }: {
                          field: {
                            value: Dayjs | null | string;
                            name: string;
                          };
                        }) => (
                          <DatePicker
                            label={field.label}
                            value={
                              fieldProps.value
                                ? dayjs(fieldProps.value)
                                : null
                            }
                            readOnly
                            slotProps={{
                              textField: {
                                variant: "outlined",
                                fullWidth: true,
                                disabled: true,
                              },
                            }}
                          />
                        )}
                      </Field>
                    ) : (
                      <Field
                        as={TextField}
                        name={field.name}
                        label={field.label}
                        type={field.type ?? "text"}
                        variant="outlined"
                        disabled
                        multiline={field.multiline}
                        rows={field.rows}
                        fullWidth
                      />
                    )}
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </LocalizationProvider>
  );
};

export default ViewClient;
