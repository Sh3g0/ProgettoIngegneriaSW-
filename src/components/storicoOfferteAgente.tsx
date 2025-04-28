'use client';

import React from 'react';

export default function StoricoOfferteAgente() {
  const offerte = [
    {
      immobile: 'Via Roma 10',
      cliente: 'Mario Rossi',
      prezzo: '250.000€',
      prezzoOfferto: '245.000€',
      dataOfferta: '10/04/2025',
      dataRisposta: '12/04/2025',
      stato: 'In attesa',
    },
    {
      immobile: 'Corso Umberto 55',
      cliente: 'Lucia Bianchi',
      prezzo: '180.000€',
      prezzoOfferto: '175.000€',
      dataOfferta: '12/04/2025',
      dataRisposta: '14/04/2025',
      stato: 'Accettata',
    },
    {
      immobile: 'Viale Marconi 3',
      cliente: 'Giuseppe Verdi',
      prezzo: '210.000€',
      prezzoOfferto: '200.000€',
      dataOfferta: '14/04/2025',
      dataRisposta: '16/04/2025',
      stato: 'Rifiutata',
    },
  ];

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md p-6">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Immobile</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Cliente</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Prezzo</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Prezzo Offerto</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Data Offerta</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Data Risposta</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Stato</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {offerte.map((offerta, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-4 py-2">{offerta.immobile}</td>
              <td className="px-4 py-2">{offerta.cliente}</td>
              <td className="px-4 py-2">{offerta.prezzo}</td>
              <td className="px-4 py-2">{offerta.prezzoOfferto}</td>
              <td className="px-4 py-2">{offerta.dataOfferta}</td>
              <td className="px-4 py-2">{offerta.dataRisposta}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    offerta.stato === 'Accettata'
                      ? 'bg-green-200 text-green-800'
                      : offerta.stato === 'Rifiutata'
                      ? 'bg-red-200 text-red-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}
                >
                  {offerta.stato}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
