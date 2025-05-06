import React, { useCallback } from 'react';
import { Box, Button, Typography, Grid, IconButton } from '@mui/material';
import { FieldConfig } from '../../../interfaces/modal-form.interface';
import { Image } from '../../../interfaces/vehicles.interface';
import ClearIcon from '@mui/icons-material/Clear';

interface ImageUploadFieldProps {
  field: FieldConfig;
  formikField: any;
  setFieldValue: (field: string, value: any) => void;
  touched: any;
  errors: any;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  field,
  formikField,
  setFieldValue,
  touched,
  errors,
}) => {
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      const imageArray: Image[] = field.multiple
        ? [...(formikField.value || [])]
        : [];

      for (const file of Array.from(files)) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const image: Image = {
          base64,
          name: file.name,
        };

        if (field.multiple) {
          imageArray.push(image);
        } else {
          imageArray[0] = image;
        }
      }

      setFieldValue(field.name, field.multiple ? imageArray : imageArray[0] || null);
    },
    [field, formikField.value, setFieldValue]
  );

  const handleRemoveImage = useCallback(
    (index: number) => {
      if (field.multiple) {
        const newImages = [...(formikField.value || [])];
        newImages.splice(index, 1);
        setFieldValue(field.name, newImages);
      } else {
        setFieldValue(field.name, null);
      }
    },
    [field, formikField.value, setFieldValue]
  );

  return (
    <Box>
      {touched[field.name] && errors[field.name] && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
          {String(errors[field.name])}
        </Typography>
      )}
      {formikField.value && (
        <Box sx={{ mt: 2 }}>
          {field.multiple ? (
            <Grid container spacing={2} >
              {(formikField.value as Image[]).map((image, index) => (
                <Grid key={index} component={Box} >
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={image.base64}
                      alt={image.name}
                      style={{
                        width: '100%',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="caption" noWrap sx={{ mt: 1, display: 'block' }}>
                      {image.name}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ position: 'relative', maxWidth: '200px' }}>
              <img
                src={(formikField.value as Image).base64}
                alt={(formikField.value as Image).name}
                style={{
                  width: '100%',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                }}
                onClick={() => handleRemoveImage(0)}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption" noWrap sx={{ mt: 1, display: 'block' }}>
                {(formikField.value as Image).name}
              </Typography>
            </Box>
          )}
        </Box>
      )}
      <Button
        variant="contained"
        component="label"
        color={touched[field.name] && errors[field.name] ? 'error' : 'primary'}
      >
        {field.label}
        <input
          type="file"
          accept="image/*"
          multiple={field.multiple}
          hidden
          onChange={handleFileChange}
        />
      </Button>
    </Box>
  );
};

export default ImageUploadField;