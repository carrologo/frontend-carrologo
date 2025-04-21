import * as Yup from "yup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Field, Form, Formik, FieldProps } from "formik";
import dayjs from "dayjs";
import { Box, Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers";

const validationSchema = Yup.object({
  name: Yup.string().required("El nombre es obligatorio"),
  lastName: Yup.string().required("El apellido es obligatorio"),
  birthdate: Yup.date()
    .required("La fecha de nacimiento es obligatoria")
    .nullable()
    .typeError("Ingrese una fecha válida"),
  cellPhone: Yup.string()
    .matches(/^\+?\d{7,15}$/, "Ingrese un número de celular válido")
    .required("El celular es obligatorio"),
  email: Yup.string()
    .email("El correo electrónico no es válido")
    .required("El correo electrónico es obligatorio"),
});

const initialValues = {
  name: "",
  lastName: "",
  birthdate: null,
  cellPhone: "",
  email: "",
  comments: "",
};

export const ModalClient = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          const { name, lastName, birthdate, cellPhone, email, comments } = values;
          const formattedValues = {
            name,
            lastName,
            birthdate: birthdate ? dayjs(birthdate).format("YYYY-MM-DD") : null,
            cellPhone,
            email,
            comments,
          };
          console.log("Formulario válido:", formattedValues);
          setSubmitting(false);
        }}
      >
        {({ errors, touched, setFieldValue, isSubmitting, resetForm }) => (
          <Form>
            <Box sx={{ p: 5, bgcolor: "background.paper" }}>
              <Grid container spacing={2}>
                <Grid size={{xs: 12, md: 6}}>
                  <Field
                    as={TextField}
                    name="name"
                    label="Nombre"
                    variant="outlined"
                    required
                    fullWidth
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                  <Field
                    as={TextField}
                    name="lastName"
                    label="Apellido"
                    variant="outlined"
                    required
                    fullWidth
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                  <Field name="birthdate">
                    {({ field }: FieldProps) => (
                      <DatePicker
                        label="Fecha de Nacimiento"
                        value={field.value}
                        onChange={(value) => setFieldValue("birthdate", value)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                  <Field
                    as={TextField}
                    name="cellPhone"
                    label="Celular"
                    variant="outlined"
                    required
                    fullWidth
                    error={touched.cellPhone && Boolean(errors.cellPhone)}
                    helperText={touched.cellPhone && errors.cellPhone}
                  />
                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                  <Field
                    as={TextField}
                    name="email"
                    label="Correo"
                    variant="outlined"
                    required
                    fullWidth
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                  <TextField
                    label="Estado"
                    value="Activo"
                    variant="outlined"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid size={{xs: 12}}>
                  <Field
                    as={TextField}
                    name="comments"
                    label="Comentarios"
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    error={touched.comments && Boolean(errors.comments)}
                    helperText={touched.comments && errors.comments}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: { xs: "center" },
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => resetForm()}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
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
