'use client';

import React, { useState } from 'react';

interface Appuntamento {
  data: string; // formato: "YYYY-MM-DD"
  orario: string;
  cliente: string;
}

const appuntamentiFinti: Appuntamento[] = [
  { data: "2025-04-15", orario: "10:00", cliente: "Mario Rossi" },
  { data: "2025-04-15", orario: "15:00", cliente: "Luca Bianchi" },
  { data: "2025-05-01", orario: "09:30", cliente: "Giulia Neri" },
];

const giorniSettimana = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const mesi = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
];

const CalendarioCompleto: React.FC = () => {
  const today = new Date();
  const [mese, setMese] = useState(today.getMonth()); 
  const [anno, setAnno] = useState(today.getFullYear());

  const giorniNelMese = new Date(anno, mese + 1, 0).getDate();
  const primoGiorno = new Date(anno, mese, 1).getDay(); 
  const offsetInizio = primoGiorno === 0 ? 6 : primoGiorno - 1; 

  const cambiaMese = (delta: number) => {
    let nuovoMese = mese + delta;
    let nuovoAnno = anno;

    if (nuovoMese < 0) {
      nuovoMese = 11;
      nuovoAnno -= 1;
    } else if (nuovoMese > 11) {
      nuovoMese = 0;
      nuovoAnno += 1;
    }

    setMese(nuovoMese);
    setAnno(nuovoAnno);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => cambiaMese(-1)} className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">←</button>
        <h2 className="text-2xl font-bold text-center">
          {mesi[mese]} {anno}
        </h2>
        <button onClick={() => cambiaMese(1)} className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">→</button>
      </div>

      <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-2">
        {giorniSettimana.map((g, i) => (
          <div key={i}>{g}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: offsetInizio }).map((_, i) => (
          <div key={`empty-${i}`} className="p-4"></div>
        ))}

        {Array.from({ length: giorniNelMese }, (_, i) => {
          const giorno = i + 1;
          const dataCompleta = `${anno}-${(mese + 1).toString().padStart(2, '0')}-${giorno.toString().padStart(2, '0')}`;
          const appuntamentiDelGiorno = appuntamentiFinti.filter(app => app.data === dataCompleta);

          return (
            <div
              key={giorno}
              className="border rounded p-2 bg-white hover:bg-gray-100 transition duration-200 h-24 overflow-y-auto"
            >
              <div className="font-semibold text-sm text-gray-700 mb-1">{giorno}</div>
              {appuntamentiDelGiorno.length > 0 ? (
                appuntamentiDelGiorno.map((app, i) => (
                  <div key={i} className="text-xs bg-gray-100 p-1 rounded mb-1">
                    <strong>{app.orario}</strong> <br /> {app.cliente}
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400">-</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarioCompleto;
