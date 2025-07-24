import React, { useState } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import DocumentUploadField from '../molecules/document-upload-field/DocumentUploadField';
import { getBase64Size, cleanBase64 } from '../../utils/documentCompression.utils';

interface TestDocument {
  base64: string;
  name: string;
}

const TestDocumentUpload: React.FC = () => {
  const [documents, setDocuments] = useState<TestDocument[]>([]);
  const [touched, setTouched] = useState<any>({});
  const [errors] = useState<any>({});

  const handleFieldChange = (fieldName: string, value: any) => {
    console.log('=== CAMBIO EN CAMPO ===');
    console.log('Campo:', fieldName);
    console.log('Valor:', value);
    console.log('Tipo:', typeof value);
    console.log('Es array:', Array.isArray(value));
    
    if (Array.isArray(value)) {
      console.log('Documentos recibidos:', value.length);
      value.forEach((doc, index) => {
        console.log(`Documento ${index + 1}:`, {
          name: doc.name,
          base64Length: doc.base64?.length || 0,
          base64Size: getBase64Size(doc.base64 || ""),
          base64Preview: doc.base64?.substring(0, 100) + '...'
        });
      });
    }
    
    setDocuments(value || []);
    setTouched({ ...touched, [fieldName]: true });
  };

  const handleTestSubmit = () => {
    console.log('=== SIMULANDO ENVÍO ===');
    
    const processedDocuments = documents.map(doc => ({
      name: doc.name,
      base64: cleanBase64(doc.base64)
    }));

    console.log('Documentos procesados para envío:', processedDocuments);
    
    const payload = {
      documents: processedDocuments
    };

    const payloadSize = JSON.stringify(payload).length;
    console.log('Tamaño del payload:', payloadSize, 'bytes');
    console.log('Tamaño del payload:', (payloadSize / 1024 / 1024).toFixed(2), 'MB');

    alert(`Se procesaron ${documents.length} documentos. Revisa la consola para más detalles.`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Prueba de Subida de Documentos
      </Typography>
      
      <Typography variant="body1" paragraph>
        Esta página te permite probar la funcionalidad de subida de documentos.
        Acepta cualquier tipo de archivo hasta 2MB por archivo.
      </Typography>

      <Box sx={{ my: 4 }}>
        <DocumentUploadField
          field={{
            name: 'test_documents',
            label: 'Documentos de Prueba',
            type: 'document',
            required: false,
            multiple: true
          }}
          formikField={{ value: documents }}
          setFieldValue={handleFieldChange}
          touched={touched}
          errors={errors}
        />
      </Box>

      {documents.length > 0 && (
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Resumen de Documentos Cargados:
          </Typography>
          
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2">
              Cantidad: {documents.length}
            </Typography>
            <Typography variant="body2">
              Tamaño total: {(documents.reduce((total, doc) => total + getBase64Size(doc.base64), 0) / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Box>

          <Button 
            variant="contained" 
            onClick={handleTestSubmit}
            sx={{ mt: 2 }}
          >
            Simular Envío
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default TestDocumentUpload;
