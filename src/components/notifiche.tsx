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

interface NotificheProps {
  agenteId: number;
}

export default function Notifiche({ agenteId }: NotificheProps) {
  const [notifiche, setNotifiche] = useState<NotificaPrenotazione[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrenotazioni = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`http://localhost:3001/api/notificaAppuntamento/${agenteId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Errore fetch notifiche');

        const data = await res.json();
        console.log('📦 Notifiche ricevute:', data);
        setNotifiche(data);
      } catch (err) {
        console.error('Errore:', err);
      } finally {
        setLoading(false);
      }
    };

    if (agenteId) fetchPrenotazioni();
  }, [agenteId]);

  if (loading) return <div className="p-5">Caricamento notifiche...</div>;
  if (!notifiche.length) return <div className="p-5">Nessuna notifica</div>;

  return (
    <div className="p-4 space-y-3">
      {notifiche.map((notifica) => (
        <NotificheItem key={notifica.id} notifica={notifica} />
      ))}
    </div>
  );
}
