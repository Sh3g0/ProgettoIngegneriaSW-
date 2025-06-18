'use client';

import { useState } from 'react';

interface NotificaPrenotazione {
  id: number;
  nome_cliente: string;
  titolo_immobile: string;
  data_visita: string;
  stato: 'in_attesa' | 'confermata' | 'rifiutata';
}

export default function NotificheItem({ notifica }: { notifica: NotificaPrenotazione }) {
  const [loading, setLoading] = useState(false);
  // Prendi stato iniziale da props o metti in attesa come default
  const [statoPrenotazione, setStatoPrenotazione] = useState<'in_attesa' | 'confermata' | 'rifiutata'>(notifica.stato);



  const gestisciRisposta = async (azione: 'confermata' | 'rifiutata') => {
    console.log('Cliccato su:', azione);
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');

      console.log('Token:', token);
      const res = await fetch('http://localhost:3001/api/notifiche/rispondi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ idPrenotazione: notifica.id, azione }),
      });
      console.log('Risposta fetch:', res.status);
      console.log('Cliccato su:', azione);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Errore: ${res.status} - ${errorText}`);
      }

      // Aggiorna stato per far sparire i bottoni e mostrare messaggio
      if (azione === 'confermata') setStatoPrenotazione('confermata');
      else setStatoPrenotazione('rifiutata');

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 mb-4 transition-all hover:shadow-md">
      <div className="flex items-start space-x-4">
        {/* Icona decorativa */}
        <div className="flex-shrink-0 p-2 bg-blue-50 rounded-full">
          <svg
            className="h-5 w-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Contenuto principale */}
        <div className="flex-1">
          <p className="text-gray-800 leading-relaxed">
            <span className="font-semibold text-gray-900">{notifica.nome_cliente}</span> ha richiesto un appuntamento per{' '}
            <span className="font-semibold text-blue-700">
              {new Date(notifica.data_visita).toLocaleDateString('it-IT', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>{' '}per visionare l'immobile:
            <span className="italic text-gray-900"> {notifica.titolo_immobile}</span>.
          </p>


          {/* Azioni */}
          {statoPrenotazione === 'in_attesa' ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => gestisciRisposta('confermata')}
                disabled={loading}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${loading ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'} 
                text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
              >
                {loading ? 'Conferma in corso...' : 'Conferma appuntamento'}
              </button>
              <button
                onClick={() => gestisciRisposta('rifiutata')}
                disabled={loading}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${loading ? 'bg-gray-200' : 'bg-white hover:bg-gray-50'} 
                text-gray-700 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                Rifiuta
              </button>
            </div>
          ) : (
            <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
            ${statoPrenotazione === 'confermata' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {statoPrenotazione === 'confermata' ? (
                <svg className="mr-1.5 h-2 w-2 text-green-800" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
              ) : (
                <svg className="mr-1.5 h-2 w-2 text-red-800" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
              )}
              Prenotazione {statoPrenotazione === 'confermata' ? 'confermata' : 'rifiutata'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}