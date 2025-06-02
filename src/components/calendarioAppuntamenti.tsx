'use client';
import { useEffect, useState } from 'react';

interface Prenotazione {
  id: number;
  nome_cliente: string;
  titolo_immobile: string;
  data_visita: string; // deve contenere anche l'orario (es: 2025-05-21T15:30:00Z)
}

export default function CalendarioAppuntamenti({ idAgente }: { idAgente: number }) {
  const [prenotazioni, setPrenotazioni] = useState<Prenotazione[]>([]);
  const [eventiPerData, setEventiPerData] = useState<Record<string, Prenotazione[]>>({});
  const [meseCorrente, setMeseCorrente] = useState(new Date());
  const [giornoSelezionato, setGiornoSelezionato] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrenotazioni = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/prenotazioni/confermate/${idAgente}`, {
          headers: { 
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${sessionStorage.getItem('token')}`
          },
        }
        );
        const data = await res.json();

        const grouped: Record<string, Prenotazione[]> = {};
        data.forEach((p: Prenotazione) => {
          const giorno = new Date(p.data_visita).toISOString().split('T')[0];
          if (!grouped[giorno]) grouped[giorno] = [];
          grouped[giorno].push(p);
        });

        setPrenotazioni(data);
        setEventiPerData(grouped);
      } catch (err) {
        console.error('Errore nel caricamento delle prenotazioni:', err);
      }
    };

    fetchPrenotazioni();
  }, [idAgente]);

  const getGiorniDelMese = () => {
    const anno = meseCorrente.getFullYear();
    const mese = meseCorrente.getMonth();
    const primoGiorno = new Date(anno, mese, 1);
    const offsetInizio = (primoGiorno.getDay() + 6) % 7;
    const giorniNelMese = new Date(anno, mese + 1, 0).getDate();

    const celleVuote = Array.from({ length: offsetInizio }, () => null);
    const giorni = Array.from({ length: giorniNelMese }, (_, i) => new Date(anno, mese, i + 1));

    return [...celleVuote, ...giorni];
  };

  const cambiaMese = (delta: number) => {
    const nuovoMese = new Date(meseCorrente);
    nuovoMese.setMonth(nuovoMese.getMonth() + delta);
    setMeseCorrente(nuovoMese);
  };

  const formatoDataISO = (data: Date) => data.toISOString().split('T')[0];

  const formatOrario = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => cambiaMese(-1)} className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-800 capitalize">
          {meseCorrente.toLocaleString('it-IT', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => cambiaMese(1)} className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Giorni della settimana */}
      <div className="grid grid-cols-7 gap-1 mb-3 " >
        {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((giorno) => (
          <div key={giorno} className="text-center text-sm font-medium text-gray-900 py-2">
            {giorno}
          </div>
        ))}
      </div>

      {/* Griglia giorni */}
      <div className="grid grid-cols-7 gap-1 ">
        {getGiorniDelMese().map((giorno, index) => {
          if (!giorno) return <div key={`empty-${index}`} className="h-24 bg-blue-50 rounded-lg opacity-50" />;

          const iso = formatoDataISO(giorno);
          const eventi = eventiPerData[iso] || [];
          const isOggi = giorno.toDateString() === new Date().toDateString();

          return (
            <div
              key={iso}
              onClick={() => eventi.length > 0 && setGiornoSelezionato(iso)}
              className={`
                border rounded-lg h-28 p-1.5 overflow-hidden cursor-pointer 
                ${isOggi ? 'border-blue-800 bg-blue-50' : 'border-gray-400'}
                hover:shadow-md transition-all
              `}
            >
              <div className={`text-right text-sm font-semibold mb-1 px-1 ${isOggi ? 'text-blue-600' : 'text-gray-700'}`}>
                {giorno.getDate()}
              </div>

              <div className="space-y-1 max-h-20 overflow-y-auto">
                {eventi.map((evento) => (
                  <div
                    key={evento.id}
                    className="px-2 py-1 rounded border border-blue-200 bg-blue-50 text-xs"
                  >
                    <div className="font-medium truncate text-gray-800">{evento.nome_cliente}</div>
                    <div className="truncate text-gray-800">{evento.titolo_immobile}</div>
                    <div className="text-gray-800">{formatOrario(evento.data_visita)}</div>
                  </div>
                ))}


              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Appuntamenti Giornalieri */}
      {giornoSelezionato && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Appuntamenti per il {giornoSelezionato}
            </h3>
            {eventiPerData[giornoSelezionato]?.map((evento) => (
              <div key={evento.id} className="border-b border-gray-200 py-3">
                <div className="font-semibold text-gray-900">{evento.nome_cliente}</div>
                <div className="text-sm text-gray-600 mt-1">{evento.titolo_immobile}</div>
                <div className="text-sm text-indigo-600 font-semibold mt-1">
                  {formatOrario(evento.data_visita)}
                </div>
              </div>
            ))}


            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setGiornoSelezionato(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
