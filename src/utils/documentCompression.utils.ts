/**
 * Utilidades para comprimir y optimizar documentos antes de subirlos al servidor
 */

export interface CompressedDocument {
  base64: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

/**
 * Convierte un archivo a base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Error al convertir archivo a base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Limpia el prefijo del base64 (data:tipo;base64,)
 */
export const cleanBase64 = (base64String: string): string => {
  if (!base64String) return "";
  
  // Remover el prefijo data:tipo/subtipo;base64, si existe
  const base64Match = base64String.match(/^data:[^;]+;base64,(.+)$/);
  return base64Match ? base64Match[1] : base64String;
};

/**
 * Calcula el tamaño aproximado de un string base64 en bytes
 */
export const getBase64Size = (base64String: string): number => {
  const cleanedBase64 = cleanBase64(base64String);
  // Cada carácter base64 representa 6 bits, por lo que 4 caracteres = 3 bytes
  return Math.ceil(cleanedBase64.length * 3 / 4);
};

/**
 * Comprime una imagen redimensionándola si es necesario
 */
export const compressImage = (file: File, maxWidth: number = 1920, maxHeight: number = 1080, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo la proporción
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Dibujar la imagen redimensionada
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convertir a base64 comprimido
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    
    img.onerror = reject;
    
    // Convertir archivo a URL para cargar en la imagen
    const fileReader = new FileReader();
    fileReader.onload = () => {
      img.src = fileReader.result as string;
    };
    fileReader.readAsDataURL(file);
  });
};

/**
 * Procesa un archivo, aplicando compresión si es una imagen
 */
export const processDocument = async (file: File): Promise<CompressedDocument> => {
  const originalSize = file.size;
  let base64String: string;
  
  // Si es una imagen, comprimirla
  if (file.type.startsWith('image/')) {
    // Aplicar compresión más agresiva para imágenes grandes
    const quality = originalSize > 1024 * 1024 ? 0.6 : 0.8; // Calidad más baja para archivos > 1MB
    base64String = await compressImage(file, 1920, 1080, quality);
  } else {
    // Para otros tipos de archivo, solo convertir a base64
    base64String = await fileToBase64(file);
  }
  
  const cleanedBase64 = cleanBase64(base64String);
  const compressedSize = getBase64Size(base64String);
  
  return {
    base64: cleanedBase64,
    name: file.name,
    originalSize,
    compressedSize,
    compressionRatio: originalSize > 0 ? compressedSize / originalSize : 1
  };
};

/**
 * Procesa múltiples archivos verificando límites de tamaño
 */
export const processMultipleDocuments = async (
  files: File[], 
  maxSizePerFile: number = 2 * 1024 * 1024, // 2MB por archivo
  maxTotalSize: number = 5 * 1024 * 1024 // 5MB total
): Promise<CompressedDocument[]> => {
  const results: CompressedDocument[] = [];
  let totalSize = 0;
  
  for (const file of files) {
    // Verificar tamaño individual
    if (file.size > maxSizePerFile) {
      throw new Error(`El archivo "${file.name}" excede el tamaño máximo permitido de ${Math.round(maxSizePerFile / 1024 / 1024)}MB`);
    }
    
    const processedDoc = await processDocument(file);
    
    // Verificar tamaño total después del procesamiento
    totalSize += processedDoc.compressedSize;
    if (totalSize > maxTotalSize) {
      throw new Error(`El tamaño total de los documentos excede el límite de ${Math.round(maxTotalSize / 1024 / 1024)}MB`);
    }
    
    results.push(processedDoc);
  }
  
  return results;
};

/**
 * Valida el formato de un documento
 */
export const validateDocumentFormat = (file: File): boolean => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  return allowedTypes.includes(file.type);
};
