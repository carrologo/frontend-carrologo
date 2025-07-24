# Modales de Transacciones

Este directorio contiene los modales para gestionar transacciones en el sistema.

## Modales Disponibles

### 1. ModalViewTransaction
Modal para **visualizar** los detalles de una transacción existente.

**Props:**
- `open: boolean` - Controla si el modal está abierto
- `onClose: () => void` - Función llamada al cerrar el modal
- `transactionId: number` - ID de la transacción a mostrar

**Características:**
- Muestra información completa de la transacción
- Información del comprador y vendedor
- Detalles del vehículo
- Estado de la transacción con colores
- Documentos adjuntos (si existen)
- Información financiera formateada
- Solo lectura

**Ejemplo de uso:**
```tsx
<ModalViewTransaction
  open={viewModalOpen}
  onClose={() => setViewModalOpen(false)}
  transactionId={selectedTransactionId}
/>
```

### 2. ModalEditTransaction
Modal para **editar** una transacción existente.

**Props:**
- `open: boolean` - Controla si el modal está abierto
- `onClose: () => void` - Función llamada al cerrar el modal
- `onSuccess: () => void` - Función llamada después de una edición exitosa
- `transactionId: number` - ID de la transacción a editar

**Características:**
- Carga datos existentes de la transacción
- Formulario completo con validación
- Autocomplete para clientes y vehículos
- Manejo de archivos/documentos
- Validación con Yup
- Manejo de errores
- Toast notifications

**Ejemplo de uso:**
```tsx
<ModalEditTransaction
  open={editModalOpen}
  onClose={() => setEditModalOpen(false)}
  onSuccess={() => {
    setEditModalOpen(false);
    // Recargar datos
    fetchTransactions();
  }}
  transactionId={selectedTransactionId}
/>
```

## Dependencias

Ambos modales requieren:
- Material-UI (@mui/material)
- Formik (solo para edición)
- Yup (solo para edición)
- Servicios de transacciones, clientes y vehículos
- Interfaces TypeScript correspondientes

## Servicios Utilizados

- `getTransactionById(id: string)` - Obtiene datos de una transacción
- `updateTransaction(id: string, data)` - Actualiza una transacción
- `getClients()` - Obtiene lista de clientes
- `getVehicles()` - Obtiene lista de vehículos

## Notas Técnicas

1. **Documentos**: Los archivos se manejan en base64 para compatibilidad con el backend
2. **Validación**: Se usa Yup para validar formularios antes del envío
3. **Estado**: Los modales manejan su propio estado interno para los datos
4. **Errores**: Incluye manejo específico para errores 413 (archivo muy grande) y 500 (servidor)
5. **Formatos**: Las fechas y montos se formatean automáticamente para mejor UX
