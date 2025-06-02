'use client';

import { useEffect, useState } from 'react';
import NotificheItem from './notificheItem';

interface NotificaPrenotazione {
  id: number;
  nome_cliente: string;
  titolo_immobile: string;
  data_visita: string;
  stato: 'in_attesa' | 'confermata' | 'rifiutata';
}

export default function Notifiche() {
  const [notifiche, setNotifiche] = useState<NotificaPrenotazione[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifiche = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          setError("Token non presente");
          setLoading(false);
          return;
        }

        const res = await fetch('http://localhost:3001/api/notificaAppuntamento', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error(`Errore HTTP ${res.status}`);
        }

        const data = await res.json();
        setNotifiche(data);
      } catch (err: any) {
        setError(err.message || 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifiche();
  }, []);

  if (loading) return <div className="p-5">Caricamento notifiche...</div>;
  if (error) return <div className="p-5 text-red-600">Errore: {error}</div>;
  if (!notifiche.length) return <div className="p-5">Nessuna notifica</div>;

  return (
    <div className="p-4 space-y-3">
      {notifiche.map(notifica => (
        <NotificheItem key={notifica.id} notifica={notifica} />
      ))}
    </div>
  );
}
