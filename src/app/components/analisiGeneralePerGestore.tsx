'use client';

import React from 'react';
import { User, Home, DollarSign } from 'lucide-react';

export default function AnalisiGeneralePerGestore() {
  const stats = [
    {
      titolo: 'Agenti',
      valore: 12,
      icon: <User className="w-6 h-6 text-blue-600" />,
      colore: 'bg-blue-100',
    },
    {
      titolo: 'Immobili',
      valore: 57,
      icon: <Home className="w-6 h-6 text-green-600" />,
      colore: 'bg-green-100',
    },
    {
      titolo: 'Reddito Totale',
      valore: '€ 145.000',
      icon: <DollarSign className="w-6 h-6 text-yellow-600" />,
      colore: 'bg-yellow-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`flex items-center justify-between p-6 rounded-xl shadow-md ${stat.colore}`}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-white shadow-sm">
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-600 text-sm">{stat.titolo}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.valore}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
