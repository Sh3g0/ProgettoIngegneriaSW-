'use client';

import { User, Home, History } from 'lucide-react';
import Link from 'next/link';

export default function TendinaOfferteCliente() {
  const icone = [
    { icon: <User />, href: '/homeAgente', attiva: false },
    { icon: <Home />, href: '/offerteCliente', attiva: true },
    { icon: <History />, href: '/storicoCliente', attiva: false },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-white shadow-lg flex flex-col justify-between items-center py-4">
      <div className="flex flex-col items-center space-y-4">
        {icone.map((item, i) => (
          <Link key={i} href={item.href}>
            <div
              className={`p-2 rounded ${
                item.attiva
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-400 hover:text-blue-400'
              }`}
            >
              {item.icon}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
