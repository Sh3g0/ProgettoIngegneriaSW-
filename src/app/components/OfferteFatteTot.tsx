'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export function OfferteFatteTot() {
  return (
    <div className="bg-white shadow rounded p-4 mb-6">
      <div className="flex items-center text-xl font-semibold mb-4">
        <ShoppingCart className="mr-2" />
        OFFERTE FATTE
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Immobile</th>
            <th className="py-2">Importo Offerto</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2">Corso Garibaldi 8</td>
            <td className="py-2">180.000€</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">Corso Garibaldi 8</td>
            <td className="py-2">180.000€</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">Corso Garibaldi 8</td>
            <td className="py-2">180.000€</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">Corso Garibaldi 8</td>
            <td className="py-2">180.000€</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">Corso Garibaldi 8</td>
            <td className="py-2">180.000€</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">Corso Garibaldi 8</td>
            <td className="py-2">180.000€</td>
          </tr>
          
        </tbody>
      </table>
    </div>
  );
}