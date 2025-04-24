import React from 'react';
import { User, MessageSquare, Folder, ListChecks, BarChart2, Settings, OctagonX } from 'lucide-react';
import Link from 'next/link';

export default function TendinaLateraleTracking() {
  const icone = [
    { icon: <User />, href: '/homeAgente'},
    { icon: <MessageSquare />, href: '/messaggi' },
    { icon: <Folder />, href: '/calendarioAgente' },       
    { icon: <ListChecks />, href: '/trackingOfferte' },      
    { icon: <BarChart2 />, href: '/analisiImmobiliAgente' }, 
    { icon: <Settings />, href: '/impostazioni' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-white shadow-lg flex flex-col justify-between items-center py-4">
      <div className="flex flex-col items-center space-y-4">
        {icone.map((item, i) => (
          <Link key={i} href={item.href}>
            <div
              className={`p-2 rounded ${
                i === 3 ? 'bg-blue-500 text-white shadow-md' : 'text-gray-400 hover:text-blue-400'
              }`}
            >
              {item.icon}
            </div>
          </Link>
        ))}
      </div>

      <button className="bg-red-500 text-white rounded-full p-2 shadow-md hover:bg-red-600">
        <OctagonX />
      </button>
    </div>
  );
}
