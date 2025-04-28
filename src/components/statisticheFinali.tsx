import React from 'react';
import { Eye, Save, Calendar, DollarSign, Clipboard } from 'lucide-react';

interface StatisticheProps {
  immobile: string;
  foto: string;
  visitePrenotate: number;
  offerteFatte: number;
  visualizzazioni: number;
  salvataggi: number;
}

export default function StatisticheFinali({
  immobile,
  foto,
  visitePrenotate,
  offerteFatte,
  visualizzazioni,
  salvataggi,
}: StatisticheProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto">
      <div className="flex flex-col items-center space-y-4">
        <img
          src={foto}
          alt={immobile}
          className="w-full h-56 object-cover rounded-lg"
        />
        <h2 className="text-2xl font-semibold text-center">{immobile}</h2>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6 text-lg">
        <div className="flex items-center space-x-2">
          <Calendar className="text-blue-500 w-6 h-6" />
          <span>{visitePrenotate} Visite Prenotate</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="text-green-500 w-6 h-6" />
          <span>{offerteFatte} Offerte Fatte</span>
        </div>

        <div className="flex items-center space-x-2">
          <Eye className="text-yellow-500 w-6 h-6" />
          <span>{visualizzazioni} Visualizzazioni</span>
        </div>
        <div className="flex items-center space-x-2">
          <Save className="text-red-500 w-6 h-6" />
          <span>{salvataggi} Salvataggi</span>
        </div>
      </div>
    </div>
  );
}
