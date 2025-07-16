import React, { useCallback } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { FieldConfig } from '../../../interfaces/modal-form.interface';
import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';

interface DocumentFile {
  base64: string;
  name: string;
}

interface DocumentUploadFieldProps {
  field: FieldConfig;
  formikField: any;
  setFieldValue: (field: string, value: any) => void;
  touched: any;
  errors: any;
}

const DocumentUploadField: React.FC<DocumentUploadFieldProps> = ({
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

      const documentArray: DocumentFile[] = field.multiple
        ? [...(formikField.value || [])]
        : [];

      for (const file of Array.from(files)) {
        // Verificar que el archivo sea un documento válido
        const validTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'image/jpeg',
          'image/png',
          'image/jpg'
        ];

        if (!validTypes.includes(file.type)) {
          alert('Por favor, seleccione un archivo válido (PDF, Word, Excel, imagen o texto).');
          continue;
        }

        // Verificar tamaño del archivo (máximo 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert('El archivo es demasiado grande. El tamaño máximo permitido es 10MB.');
          continue;
        }

        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const document: DocumentFile = {
          base64,
          name: file.name,
        };

        if (field.multiple) {
          documentArray.push(document);
        } else {
          documentArray[0] = document;
        }
      }

      setFieldValue(field.name, documentArray);
    },
    [field.multiple, field.name, formikField.value, setFieldValue]
  );

  const handleRemoveDocument = useCallback(
    (index: number) => {
      if (field.multiple) {
        const newDocuments = [...(formikField.value || [])];
        newDocuments.splice(index, 1);
        setFieldValue(field.name, newDocuments);
      } else {
        setFieldValue(field.name, []);
      }
    },
    [field.multiple, field.name, formikField.value, setFieldValue]
  );

  const documents = formikField.value || [];
  const hasError = touched[field.name] && errors[field.name];

  return (
    <Box>
      <Typography variant="body1" component="label" sx={{ mb: 1, display: 'block' }}>
        {field.label}
        {field.required && <span style={{ color: 'red' }}> *</span>}
      </Typography>
      
      <Button
        variant="outlined"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ mb: 2, mr: 1 }}
        disabled={field.disabled}
      >
        {field.multiple ? 'Subir Documentos' : 'Subir Documento'}
        <input
          type="file"
          hidden
          multiple={field.multiple}
          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
      </Button>

      {documents.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Documentos cargados:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {documents.map((doc: DocumentFile, index: number) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  backgroundColor: '#f5f5f5',
                }}
              >
                <DescriptionIcon sx={{ mr: 1, color: '#666' }} />
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {doc.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveDocument(index)}
                  sx={{ ml: 1 }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {hasError && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {errors[field.name]}
        </Typography>
      )}
    </Box>
  );
};

export default DocumentUploadField;
