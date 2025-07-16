import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { getValues, TypeDocument } from '../../../services/values.service';

export interface Document {
  documentTypeId: number;
  expirationDate: string;
}

interface DocumentManagerProps {
  documents: Document[];
  onChange: (documents: Document[]) => void;
  error?: string;
  onLoadingChange?: (loading: boolean) => void;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents,
  onChange,
  error,
  onLoadingChange,
}) => {
  const [typeDocuments, setTypeDocuments] = useState<TypeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        setLoadingError(null);
        onLoadingChange?.(true);
        const response = await getValues();
        setTypeDocuments(response.data.typeDocuments);
      } catch (error) {
        console.error('Error al cargar tipos de documentos:', error);
        setLoadingError('Error al cargar los tipos de documentos. Por favor, recarga la página.');
      } finally {
        setLoading(false);
        onLoadingChange?.(false);
      }
    };

    fetchDocumentTypes();
  }, [onLoadingChange]);

  const addDocument = () => {
    if (typeDocuments.length === 0) {
      console.warn('No se pueden agregar documentos: tipos de documentos no cargados');
      return;
    }
    
    const newDocument: Document = {
      documentTypeId: typeDocuments[0]?.id || 1,
      expirationDate: '',
    };
    onChange([...documents, newDocument]);
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    onChange(updatedDocuments);
  };

  const updateDocument = (index: number, field: keyof Document, value: string | number) => {
    const updatedDocuments = documents.map((doc, i) => 
      i === index ? { ...doc, [field]: value } : doc
    );
    onChange(updatedDocuments);
  };

  if (loadingError) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {loadingError}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => window.location.reload()}
        >
          Recargar página
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Cargando tipos de documentos...
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </Box>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Documentos del Vehículo</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={addDocument}
          size="small"
          disabled={loading || typeDocuments.length === 0}
        >
          Agregar Documento
        </Button>
      </Box>

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {documents.map((document, index) => (
        <Card key={index} sx={{ mb: 2, position: 'relative' }}>
          <CardContent>
            <IconButton
              color="error"
              onClick={() => removeDocument(index)}
              sx={{ 
                position: 'absolute', 
                top: '50%', 
                right: 8, 
                transform: 'translateY(-50%)' 
              }}
              size="small"
            >
              <Delete />
            </IconButton>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pr: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Documento</InputLabel>
                <Select
                  value={document.documentTypeId}
                  label="Tipo de Documento"
                  onChange={(e) => updateDocument(index, 'documentTypeId', e.target.value)}
                >
                  {typeDocuments.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Fecha de Vencimiento"
                type="date"
                value={document.expirationDate}
                onChange={(e) => updateDocument(index, 'expirationDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
            </Box>
          </CardContent>
        </Card>
      ))}

      {documents.length === 0 && (
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
          No hay documentos agregados. Haz clic en "Agregar Documento" para comenzar.
        </Typography>
      )}
    </Box>
  );
};
