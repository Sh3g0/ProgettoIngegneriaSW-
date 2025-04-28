'use client';

import { Calendar } from 'lucide-react';
import Link from 'next/link';

export function TabellaTotPrenCliente() {
  return (
    <div className="bg-white shadow rounded p-4 mb-6">
      <div className="flex items-center text-xl font-semibold mb-4">
        <Calendar className="mr-2" />
        VISITE PRENOTATE
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Immobile</th>
            <th className="py-2">Data Visita</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2">Via Roma 45</td>
            <td className="py-2">15/04/2025</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">Via Roma 45</td>
            <td className="py-2">15/04/2025</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">Via Roma 45</td>
            <td className="py-2">15/04/2025</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">Via Roma 45</td>
            <td className="py-2">15/04/2025</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">Via Roma 45</td>
            <td className="py-2">15/04/2025</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}