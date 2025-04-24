'use client';

import React from 'react';
import Link from 'next/link';

export default function AttivitaRecentiAgenti() {
  const attività = [
    {
      agente: 'Mario Rossi',
      attività: 'Appartamento – Venduto',
      data: '20/04/2025',
    },
    {
      agente: 'Luisa Bianchi',
      attività: 'Villa – Proposta prenotazione',
      data: '19/04/2025',
    },
    {
      agente: 'Giovanni Verdi',
      attività: 'Bilocale – Controproposta',
      data: '18/04/2025',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Attività Recenti Agenti</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-2">Agente</th>
            <th className="pb-2">Attività</th>
            <th className="pb-2">Data</th>
          </tr>
        </thead>
        <tbody>
          {attività.map((item, index) => (
            <tr key={index} className="border-b last:border-none text-gray-700">
              <td className="py-2">{item.agente}</td>
              <td className="py-2">{item.attività}</td>
              <td className="py-2">{item.data}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <Link href="/attivitaRecentiCompleta">
          <span className="text-blue-600 hover:underline cursor-pointer font-semibold">
            Mostra tutti →
          </span>
        </Link>
      </div>
    </div>
  );
}
