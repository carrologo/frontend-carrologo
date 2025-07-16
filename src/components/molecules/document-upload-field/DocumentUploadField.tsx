import React, { useCallback, useState } from 'react';
import { Box, Button, Typography, IconButton, CircularProgress } from '@mui/material';
import { FieldConfig } from '../../../interfaces/modal-form.interface';
import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import { getBase64Size } from '../../../utils/documentCompression.utils';

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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      setIsProcessing(true);
      console.log('=== INICIO DE PROCESAMIENTO DE ARCHIVOS ===');
      console.log('Archivos seleccionados:', files.length);

      try {
        const documentArray: DocumentFile[] = field.multiple
          ? [...(formikField.value || [])]
          : [];

        console.log('Documentos existentes:', documentArray.length);

        for (const file of Array.from(files)) {
          console.log('Procesando archivo:', {
            name: file.name,
            type: file.type,
            size: file.size,
            sizeInMB: (file.size / 1024 / 1024).toFixed(2) + ' MB'
          });

          // Verificar tamaño del archivo (máximo 2MB)
          if (file.size > 2 * 1024 * 1024) {
            const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
            alert(`El archivo "${file.name}" es demasiado grande (${sizeInMB} MB). El tamaño máximo permitido es 2MB.`);
            continue;
          }

          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              console.log('Archivo convertido a base64:', {
                name: file.name,
                base64Length: (reader.result as string).length,
                base64Preview: (reader.result as string).substring(0, 100) + '...'
              });
              resolve(reader.result as string);
            };
            reader.onerror = (error) => {
              console.error('Error al leer archivo:', error);
              reject(error);
            };
            reader.readAsDataURL(file);
          });

          const document: DocumentFile = {
            base64,
            name: file.name,
          };

          console.log('Documento procesado:', {
            name: document.name,
            base64Size: getBase64Size(document.base64)
          });

          if (field.multiple) {
            documentArray.push(document);
          } else {
            documentArray[0] = document;
          }
        }

        console.log('Documentos finales:', {
          count: documentArray.length,
          totalSize: documentArray.reduce((total, doc) => total + getBase64Size(doc.base64), 0),
          names: documentArray.map(doc => doc.name)
        });

        setFieldValue(field.name, documentArray);
        console.log('=== FIN DE PROCESAMIENTO DE ARCHIVOS ===');
      } catch (error) {
        console.error('Error procesando archivos:', error);
        alert('Error al procesar los archivos. Por favor, intente nuevamente.');
      } finally {
        setIsProcessing(false);
      }
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const documents = formikField.value || [];
  const hasError = touched[field.name] && errors[field.name];

  // Calcular tamaño total de los documentos
  const totalSize = documents.reduce((total: number, doc: DocumentFile) => {
    return total + getBase64Size(doc.base64 || "");
  }, 0);

  return (
    <Box>
      <Typography variant="body1" component="label" sx={{ mb: 1, display: 'block' }}>
        {field.label}
        {field.required && <span style={{ color: 'red' }}> *</span>}
      </Typography>
      
      <Button
        variant="outlined"
        component="label"
        startIcon={isProcessing ? <CircularProgress size={20} /> : <CloudUploadIcon />}
        sx={{ mb: 2, mr: 1 }}
        disabled={field.disabled || isProcessing}
      >
        {isProcessing 
          ? 'Procesando...' 
          : field.multiple 
            ? 'Subir Documentos' 
            : 'Subir Documento'
        }
        <input
          type="file"
          hidden
          multiple={field.multiple}
          accept="*/*"
          onChange={handleFileChange}
        />
      </Button>

      {isProcessing && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">
            Procesando archivos...
          </Typography>
        </Box>
      )}

      {documents.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2">
              Documentos cargados:
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tamaño total: {formatFileSize(totalSize)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {documents.map((doc: DocumentFile, index: number) => {
              const docSize = getBase64Size(doc.base64 || "");
              return (
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
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {doc.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(docSize)}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveDocument(index)}
                    sx={{ ml: 1 }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Box>
              );
            })}
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
