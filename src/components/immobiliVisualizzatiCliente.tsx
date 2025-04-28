'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';

export function ImmobiliVisualizzatiCliente() {
  return (
    <div className="bg-white shadow rounded p-4 mb-6">
      <div className="flex items-center text-xl font-semibold mb-4">
        <Home className="mr-2" />
        IMMOBILI VISUALIZZATI
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Immobile</th>
            <th className="py-2">Data Visualizzazione</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2">Via Napoli 123</td>
            <td className="py-2">12/04/2025</td>
          </tr>
        </tbody>
      </table>
      <div className="text-right mt-2">
        <Link href="/immobiliVisualizzatiClnt" className="text-blue-600 hover:underline">Mostra tutti</Link>
      </div>
    </div>
  );
}