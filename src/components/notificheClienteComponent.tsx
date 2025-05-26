'use client';
import { useEffect, useState } from 'react';

interface PrenotazioneAccettata {
    id: number;
    titolo_immobile: string;
    data_visita: string;
    comune: string;
    indirizzo: string;
}

export default function NotificheClienteComponent({ idCliente }: { idCliente: number }) {
    const [notifiche, setNotifiche] = useState<PrenotazioneAccettata[]>([]);
    const [caricamento, setCaricamento] = useState(true);

    useEffect(() => {
        const fetchNotifiche = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/prenotazioniConfermateCliente/${idCliente}`);
                const data = await res.json();
                setNotifiche(data);
                console.log("Notifiche recuperate:", data);
            } catch (err) {
                console.error("Errore nel recupero delle notifiche:", err);
            } finally {
                setCaricamento(false);
            }
        };

        fetchNotifiche();
    }, [idCliente]);

    if (caricamento) {
        return <div className="text-gray-600">Caricamento notifiche...</div>;
    }

    return (
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Prenotazioni Accettate</h2>

            {notifiche.length === 0 ? (
                <p className="text-gray-500">Non hai prenotazioni confermate al momento.</p>
            ) : (
                <ul className="space-y-4">
                    {notifiche.map((p) => (
                        <li key={p.id} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                            <h3 className="text-blue-900 font-semibold truncate">{p.titolo_immobile}</h3>
                            <p className="text-blue-700 text-sm">{p.indirizzo}, {p.comune}</p>
                            <p className="text-sm text-gray-600">Data visita: {new Date(p.data_visita).toLocaleString('it-IT')}</p>
                        </li>

                    ))}
                </ul>
            )}
        </div>
    );
}