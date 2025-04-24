'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function AttivitaRecentiAgentiCompleta() {
  const router = useRouter();

  const attività = [
    {
      agente: 'Mario Rossi',
      descrizione: 'Proposta per Appartamento - Venduto',
      data: '20/04/2025',
    },
    {
      agente: 'Luca Bianchi',
      descrizione: 'Controproposta per Villa - In trattativa',
      data: '18/04/2025',
    },
    {
      agente: 'Mario Rossi',
      descrizione: 'Proposta per Appartamento - Venduto',
      data: '20/04/2025',
    },
    {
      agente: 'Luca Bianchi',
      descrizione: 'Controproposta per Villa - In trattativa',
      data: '18/04/2025',
    },
    {
      agente: 'Mario Rossi',
      descrizione: 'Proposta per Appartamento - Venduto',
      data: '20/04/2025',
    },
    {
      agente: 'Luca Bianchi',
      descrizione: 'Controproposta per Villa - In trattativa',
      data: '18/04/2025',
    },
    {
      agente: 'Giulia Verdi',
      descrizione: 'Prenotazione per Loft - In attesa',
      data: '17/04/2025',
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Tutte le Attività degli Agenti</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-200 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Agente</th>
              <th className="px-4 py-2 border-b">Attività</th>
              <th className="px-4 py-2 border-b">Data</th>
            </tr>
          </thead>
          <tbody>
            {attività.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{item.agente}</td>
                <td className="px-4 py-2 border-b">{item.descrizione}</td>
                <td className="px-4 py-2 border-b">{item.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => router.push('/homeGestoreAgenzia')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-md transition"
        >
          INDIETRO        </button>
      </div>
    </div>
  );
}
