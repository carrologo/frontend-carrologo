import React, { useState, useEffect } from 'react';
import { getClientById } from '../../../services/clients.service';
import { Client } from '../../../interfaces/clients.interface';

interface ClientInfoDisplayProps {
  clientId: string | number;
}

const ClientInfoDisplay: React.FC<ClientInfoDisplayProps> = ({ clientId }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (!clientId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const clientData = await getClientById(clientId.toString());
        setClient(clientData);
      } catch (err) {
        console.error('Error fetching client:', err);
        setError('Error al cargar cliente');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  if (loading) {
    return <span style={{ color: '#666' }}>Cargando...</span>;
  }

  if (error) {
    return <span style={{ color: '#f44336' }}>Error: {error}</span>;
  }

  if (!client) {
    return <span style={{ color: '#666' }}>ID: {clientId}</span>;
  }

  return (
    <span style={{ fontWeight: 500 }}>
      {client.name} {client.lastName}
    </span>
  );
};

export { ClientInfoDisplay };
export default ClientInfoDisplay;
